// Make Notion itself point at R2 — the final, dependency-free state.
// For every WORKS + BLOGS page: take each image that is NOT already on r2.dev
// (Notion-S3 `file` blocks, imgbb `external` blocks, page covers), download it,
// resize to <=1920px webp, upload to R2, and update the Notion block/cover IN
// PLACE to the external R2 url (order + caption preserved). After this, the
// imageManifest/r2Image bypass can be deleted — Notion is the single source.
//
//   node scripts/notion-images-to-r2.mjs --dry-run          # list, no changes
//   node scripts/notion-images-to-r2.mjs --page=Aquaman     # one page only
//   node scripts/notion-images-to-r2.mjs                    # do everything
//
// Requires .env: NOTION_TOKEN (with write capability), NOTION_DATABASE_ID,
// NOTION_DATABASE_ID2, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
// R2_BUCKET, NEXT_PUBLIC_R2_PUBLIC_BASE
import 'dotenv/config'
import { Client } from '@notionhq/client'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

const env = process.env
const DRY = process.argv.includes('--dry-run')
const PAGE = (process.argv.find(a => a.startsWith('--page=')) || '').slice('--page='.length)
const notion = new Client({ auth: env.NOTION_TOKEN })
const s3 = new S3Client({ region: 'auto', endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY } })
const base = env.NEXT_PUBLIC_R2_PUBLIC_BASE.replace(/\/$/, '')

const isR2 = (u) => typeof u === 'string' && u.includes('r2.dev')
async function dsId(d){const db=await notion.databases.retrieve({database_id:d});return db.data_sources?.[0]?.id||d}
async function queryAll(d){const id=await dsId(d);const out=[];let c;do{const r=await notion.dataSources.query({data_source_id:id,start_cursor:c});out.push(...r.results);c=r.has_more?r.next_cursor:undefined}while(c);return out}
async function getBlocks(b){const out=[];let c;do{const r=await notion.blocks.children.list({block_id:b,start_cursor:c});out.push(...r.results);c=r.has_more?r.next_cursor:undefined}while(c);return out}
const titleOf = (p) => p.properties?.title?.title?.[0]?.plain_text || '(untitled)'

// yield every image block under a page, recursing into nested children
async function* walkImages(blockId) {
  for (const b of await getBlocks(blockId)) {
    if (b.type === 'image') yield b
    if (b.has_children && b.type !== 'image') yield* walkImages(b.id)
  }
}

let uploaded = 0, skipped = 0, failed = 0

async function toR2(srcUrl, key) {
  const res = await fetch(srcUrl)
  if (!res.ok) throw new Error(`fetch ${res.status}`)
  const srcType = res.headers.get('content-type') || ''
  let body = Buffer.from(await res.arrayBuffer())
  let ext = 'webp', type = 'image/webp'
  if (/svg|gif/.test(srcType)) {            // leave vector/animated untouched
    ext = srcType.includes('svg') ? 'svg' : 'gif'
    type = srcType
  } else {
    body = await sharp(body).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
  }
  const r2key = `${key}.${ext}`
  await s3.send(new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: r2key, Body: body, ContentType: type, CacheControl: 'public, max-age=31536000, immutable' }))
  return { url: `${base}/${r2key}`, kb: (body.length / 1024).toFixed(0) }
}

async function processDb(dbId, dbLabel) {
  for (const p of await queryAll(dbId)) {
    const title = titleOf(p)
    if (PAGE && !title.toLowerCase().includes(PAGE.toLowerCase())) continue
    console.log(`\n# [${dbLabel}] ${title}`)

    // 1) cover (page property)
    const coverUrl = p.cover?.external?.url || p.cover?.file?.url
    if (coverUrl && !isR2(coverUrl)) {
      try {
        if (DRY) { console.log(`  COVER would migrate: ${new URL(coverUrl).host}`); skipped++ }
        else {
          const { url, kb } = await toR2(coverUrl, `notion/cover-${p.id}`)
          await notion.pages.update({ page_id: p.id, cover: { type: 'external', external: { url } } })
          console.log(`  COVER -> R2 (${kb} KB)`); uploaded++
        }
      } catch (e) { console.log(`  COVER FAIL: ${e.message}`); failed++ }
    } else if (coverUrl) { skipped++ }

    // 2) body images (recursive)
    let n = 0
    for await (const b of walkImages(p.id)) {
      n++
      const url = b.image?.external?.url || b.image?.file?.url
      if (!url) { continue }
      if (isR2(url)) { skipped++; continue }
      try {
        if (DRY) { console.log(`  IMG ${n} would migrate: [${b.image.type}] ${new URL(url).host}`); skipped++; continue }
        const { url: r2url, kb } = await toR2(url, `notion/${b.id}`)
        await notion.blocks.update({ block_id: b.id, image: { external: { url: r2url }, caption: b.image.caption || [] } })
        console.log(`  IMG ${n} -> R2 (${kb} KB)`); uploaded++
      } catch (e) { console.log(`  IMG ${n} FAIL: ${e.message}`); failed++ }
    }
  }
}

const missing = ['NOTION_TOKEN','NOTION_DATABASE_ID','NOTION_DATABASE_ID2','R2_ACCOUNT_ID','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY','R2_BUCKET','NEXT_PUBLIC_R2_PUBLIC_BASE'].filter(k=>!env[k])
// Build-safe: when wired into the Netlify build, never fail the deploy just
// because env is missing (e.g. R2 keys not set yet) — skip with a warning.
if (missing.length) { console.warn('[notion-images-to-r2] skipping — env not set:', missing.join(', ')); process.exit(0) }

await processDb(env.NOTION_DATABASE_ID, 'WORKS')
await processDb(env.NOTION_DATABASE_ID2, 'BLOGS')
console.log(`\n=== ${DRY ? 'DRY-RUN ' : ''}Done: migrated ${uploaded}, already-R2/skipped ${skipped}, failed ${failed} ===`)
