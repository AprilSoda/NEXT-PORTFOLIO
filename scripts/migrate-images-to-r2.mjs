// One-time / idempotent migration: copy every works & blogs image (covers +
// work-body + blog-body) from its current host (imgbb / Notion S3) into a
// Cloudflare R2 bucket, and write lib/imageManifest.json mapping a STABLE id
// (cover = Notion pageId, content = Notion blockId) -> public R2 URL.
//
// The site reads that manifest (lib/r2Image.js) and prefers the R2 URL, so
// Notion content is never modified (non-destructive, reversible). Re-running
// only uploads new images (skips ids already in the manifest).
//
// Run:  node scripts/migrate-images-to-r2.mjs --dry-run   (counts only)
//       node scripts/migrate-images-to-r2.mjs             (download + upload)
//
// Requires in .env: NOTION_TOKEN, NOTION_DATABASE_ID, NOTION_DATABASE_ID2,
// NOTION_ACTIVE_USER, NOTION_AUTH_TOKEN, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID,
// R2_SECRET_ACCESS_KEY, R2_BUCKET, NEXT_PUBLIC_R2_PUBLIC_BASE
import 'dotenv/config'
import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry-run')
const MANIFEST = join(process.cwd(), 'lib', 'imageManifest.json')
const env = process.env

const notion = new Client({ auth: env.NOTION_TOKEN })
const notionX = new NotionAPI({ activeUser: env.NOTION_ACTIVE_USER, authToken: env.NOTION_AUTH_TOKEN })

async function dsId(dbId) {
  const db = await notion.databases.retrieve({ database_id: dbId })
  return db.data_sources?.[0]?.id || dbId
}
async function queryAll(dbId) {
  const id = await dsId(dbId)
  const out = []; let c
  do { const r = await notion.dataSources.query({ data_source_id: id, start_cursor: c }); out.push(...r.results); c = r.has_more ? r.next_cursor : undefined } while (c)
  return out
}
async function getBlocks(blockId) {
  const out = []; let c
  do { const r = await notion.blocks.children.list({ block_id: blockId, start_cursor: c }); out.push(...r.results); c = r.has_more ? r.next_cursor : undefined } while (c)
  return out
}
const coverUrl = (p) => p.cover?.external?.url || p.cover?.file?.url || null
const extFromType = (t) => t?.includes('webp') ? 'webp' : t?.includes('png') ? 'png' : t?.includes('avif') ? 'avif' : t?.includes('gif') ? 'gif' : t?.includes('svg') ? 'svg' : 'jpg'

async function collectRefs() {
  const refs = []
  // WORKS: covers + body images (official API)
  for (const p of await queryAll(env.NOTION_DATABASE_ID)) {
    const c = coverUrl(p); if (c) refs.push({ key: p.id, url: c, prefix: 'cover' })
    for (const b of await getBlocks(p.id)) {
      if (b.type === 'image') {
        const u = b.image?.external?.url || b.image?.file?.url
        if (u) refs.push({ key: b.id, url: u, prefix: 'work' })
      }
    }
  }
  // BLOGS: covers (official API) + body images (notion-client recordMap)
  for (const p of await queryAll(env.NOTION_DATABASE_ID2)) {
    const c = coverUrl(p); if (c) refs.push({ key: p.id, url: c, prefix: 'cover' })
    try {
      const rec = await notionX.getPage(p.id)
      for (const [bid, blk] of Object.entries(rec.block || {})) {
        const v = blk?.value
        if (v?.type !== 'image') continue
        let src = v.properties?.source?.[0]?.[0]
        if (!src) continue
        if (/secure\.notion-static\.com|amazonaws|s3\./.test(src) && rec.signed_urls?.[bid]) src = rec.signed_urls[bid]
        refs.push({ key: bid, url: src, prefix: 'blog' })
      }
    } catch (e) { console.log(`  blog recordMap failed ${p.id}: ${e.message}`) }
  }
  return refs
}

async function main() {
  const missing = ['NOTION_TOKEN', 'R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'NEXT_PUBLIC_R2_PUBLIC_BASE'].filter(k => !env[k])
  if (missing.length) { console.error('Missing env:', missing.join(', ')); process.exit(1) }

  let manifest = {}
  try { manifest = JSON.parse(await readFile(MANIFEST, 'utf8')) } catch {}

  const refs = await collectRefs()
  const byPrefix = {}; refs.forEach(r => byPrefix[r.prefix] = (byPrefix[r.prefix] || 0) + 1)
  console.log(`Found ${refs.length} image refs:`, byPrefix, `| already migrated: ${refs.filter(r => manifest[r.key]).length}`)
  if (DRY) return

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
  })
  const base = env.NEXT_PUBLIC_R2_PUBLIC_BASE.replace(/\/$/, '')
  let uploaded = 0, skipped = 0, failed = 0
  for (const r of refs) {
    if (manifest[r.key]) { skipped++; continue }
    try {
      const res = await fetch(r.url)
      if (!res.ok) { failed++; console.log(`  fetch ${res.status}: ${r.url.slice(0, 70)}`); continue }
      const type = res.headers.get('content-type') || ''
      const r2key = `${r.prefix}/${r.key}.${extFromType(type)}`
      await s3.send(new PutObjectCommand({
        Bucket: env.R2_BUCKET, Key: r2key,
        Body: Buffer.from(await res.arrayBuffer()),
        ContentType: type || 'application/octet-stream',
        CacheControl: 'public, max-age=31536000, immutable',
      }))
      manifest[r.key] = `${base}/${r2key}`
      uploaded++
      if (uploaded % 10 === 0) console.log(`  ...${uploaded} uploaded`)
    } catch (e) { failed++; console.log(`  error ${r.key}: ${e.message}`) }
  }
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`Done: uploaded ${uploaded}, skipped ${skipped}, failed ${failed}. Manifest now ${Object.keys(manifest).length} entries -> ${MANIFEST}`)
}
main().catch(e => { console.error(e); process.exit(1) })