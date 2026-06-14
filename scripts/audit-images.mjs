// One-off audit: classifies every works/blogs cover (and works content images)
// by origin so we know which use expiring Notion URLs vs permanent imgbb URLs,
// and flags oversized imgbb originals that risk slow/timeout optimization.
// Run: node scripts/audit-images.mjs
import 'dotenv/config'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

async function dataSourceId(dbId) {
  const db = await notion.databases.retrieve({ database_id: dbId })
  return db.data_sources?.[0]?.id || dbId
}
async function queryAll(dbId) {
  const dsId = await dataSourceId(dbId)
  const out = []
  let cursor
  do {
    const res = await notion.dataSources.query({ data_source_id: dsId, start_cursor: cursor })
    out.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return out
}
const coverUrl = (p) => p.cover?.external?.url || p.cover?.file?.url || null
const title = (p) => p.properties?.title?.title?.[0]?.plain_text || '(untitled)'
function classify(url) {
  if (!url) return 'NONE'
  if (url.includes('ibb.co')) return 'imgbb'
  if (url.includes('amazonaws') || url.includes('notion.so')) return 'NOTION-EXPIRING'
  return 'other'
}
async function kbOf(url) {
  if (!url || !url.includes('ibb.co')) return null
  try {
    const c = new AbortController(); const t = setTimeout(() => c.abort(), 8000)
    const r = await fetch(url, { method: 'HEAD', signal: c.signal }); clearTimeout(t)
    const len = r.headers.get('content-length')
    return len ? Math.round(len / 1024) : null
  } catch { return null }
}
async function imageBlocks(pageId) {
  const urls = []
  let cursor
  do {
    const res = await notion.blocks.children.list({ block_id: pageId, start_cursor: cursor })
    for (const b of res.results) {
      if (b.type === 'image') {
        urls.push(b.image?.external?.url || b.image?.file?.url || null)
      }
    }
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return urls.filter(Boolean)
}

async function main() {
  // WORKS — covers + content images
  console.log('\n===== WORKS =====')
  const works = await queryAll(process.env.NOTION_DATABASE_ID)
  let wExp = 0, wImg = 0, wHeavy = 0, contentExp = 0, contentImgbb = 0
  for (const p of works) {
    const url = coverUrl(p); const cls = classify(url); const kb = await kbOf(url)
    if (cls === 'NOTION-EXPIRING') wExp++; if (cls === 'imgbb') wImg++
    if (kb && kb > 500) wHeavy++
    const blocks = await imageBlocks(p.id)
    let bExp = 0, bImgbb = 0
    for (const b of blocks) { const c = classify(b); if (c === 'NOTION-EXPIRING') { bExp++; contentExp++ } else if (c === 'imgbb') { bImgbb++; contentImgbb++ } }
    console.log(`  cover[${cls}]${kb ? ` ${kb}KB${kb > 500 ? ' !HEAVY' : ''}` : ''}  content:{imgbb:${bImgbb}, expiring:${bExp}}  ${title(p)}`)
  }
  console.log(`  -- WORKS ${works.length} items | covers: expiring ${wExp}, imgbb ${wImg}, heavy>500KB ${wHeavy} | content imgs: imgbb ${contentImgbb}, expiring ${contentExp}`)

  // BLOGS — covers (inline content images are Notion-hosted via react-notion-x)
  console.log('\n===== BLOGS =====')
  const blogs = await queryAll(process.env.NOTION_DATABASE_ID2)
  let bExp = 0, bImg = 0, bHeavy = 0
  for (const p of blogs) {
    const url = coverUrl(p); const cls = classify(url); const kb = await kbOf(url)
    if (cls === 'NOTION-EXPIRING') bExp++; if (cls === 'imgbb') bImg++
    if (kb && kb > 500) bHeavy++
    console.log(`  cover[${cls}]${kb ? ` ${kb}KB${kb > 500 ? ' !HEAVY' : ''}` : ''}  ${title(p)}`)
  }
  console.log(`  -- BLOGS ${blogs.length} items | covers: expiring ${bExp}, imgbb ${bImg}, heavy>500KB ${bHeavy}`)
  console.log('\n(NOTE: blog INLINE images are written into Notion -> Notion-hosted/expiring by nature; host them on imgbb to be safe.)')
}
main().catch(e => { console.error(e); process.exit(1) })