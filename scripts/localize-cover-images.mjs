// Build-time cover localization.
// Downloads each works/blogs cover image into public/covers/<pageId>.<ext> and
// writes lib/coverManifest.json mapping pageId -> local path. Runs in `prebuild`.
// Fails soft: if Notion is unreachable or a download fails, it just skips that
// cover (the component falls back to the original remote URL) and never breaks
// the build.
import 'dotenv/config'
import { Client } from '@notionhq/client'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const OUT_DIR = join(process.cwd(), 'public', 'covers')
const MANIFEST = join(process.cwd(), 'lib', 'coverManifest.json')
const notion = new Client({ auth: process.env.NOTION_TOKEN })

async function dataSourceId(dbId) {
  const db = await notion.databases.retrieve({ database_id: dbId })
  return db.data_sources?.[0]?.id || dbId
}
async function queryAll(dbId) {
  const id = await dataSourceId(dbId)
  const out = []
  let cursor
  do {
    const r = await notion.dataSources.query({ data_source_id: id, start_cursor: cursor })
    out.push(...r.results)
    cursor = r.has_more ? r.next_cursor : undefined
  } while (cursor)
  return out
}
const coverUrl = (p) => p.cover?.external?.url || p.cover?.file?.url || null
const extFromType = (t) =>
  t?.includes('webp') ? 'webp' : t?.includes('png') ? 'png' : t?.includes('avif') ? 'avif' : t?.includes('gif') ? 'gif' : 'jpg'

async function run() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    console.log('[localize-covers] No Notion env; skipping (covers fall back to remote URLs).')
    await writeFile(MANIFEST, '{}\n')
    return
  }
  await mkdir(OUT_DIR, { recursive: true })
  const manifest = {}
  let ok = 0, fail = 0
  const dbs = [process.env.NOTION_DATABASE_ID, process.env.NOTION_DATABASE_ID2].filter(Boolean)
  for (const db of dbs) {
    let pages = []
    try {
      pages = await queryAll(db)
    } catch (e) {
      console.log('[localize-covers] query failed for a database:', e.message)
      continue
    }
    for (const p of pages) {
      const url = coverUrl(p)
      if (!url) continue
      try {
        const ctrl = new AbortController()
        const t = setTimeout(() => ctrl.abort(), 20000)
        const res = await fetch(url, { signal: ctrl.signal })
        clearTimeout(t)
        if (!res.ok) { fail++; continue }
        const ext = extFromType(res.headers.get('content-type') || '')
        const buf = Buffer.from(await res.arrayBuffer())
        const file = `${p.id}.${ext}`
        await writeFile(join(OUT_DIR, file), buf)
        manifest[p.id] = `/covers/${file}`
        ok++
      } catch (e) {
        fail++
      }
    }
  }
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`[localize-covers] localized ${ok} covers (${fail} failed/skipped) -> public/covers/`)
}

run().catch((e) => {
  console.log('[localize-covers] unexpected error, skipping:', e.message)
})