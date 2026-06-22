// Delete R2 objects that no Notion page references anymore (orphans left over
// from the earlier manifest-based migration: cover/ work/ blog/ prefixes).
// Builds the set of CURRENTLY-referenced keys from live Notion and deletes only
// objects NOT in that set. Safe by construction.
//   node scripts/cleanup-r2-orphans.mjs --dry-run   # list only
//   node scripts/cleanup-r2-orphans.mjs             # delete orphans
import 'dotenv/config'
import { Client } from '@notionhq/client'
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'

const env = process.env
const DRY = process.argv.includes('--dry-run')
const notion = new Client({ auth: env.NOTION_TOKEN })
const s3 = new S3Client({ region: 'auto', endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY } })
const base = env.NEXT_PUBLIC_R2_PUBLIC_BASE.replace(/\/$/, '')

async function dsId(d){const db=await notion.databases.retrieve({database_id:d});return db.data_sources?.[0]?.id||d}
async function queryAll(d){const id=await dsId(d);const out=[];let c;do{const r=await notion.dataSources.query({data_source_id:id,start_cursor:c});out.push(...r.results);c=r.has_more?r.next_cursor:undefined}while(c);return out}
async function getBlocks(b){const out=[];let c;do{const r=await notion.blocks.children.list({block_id:b,start_cursor:c});out.push(...r.results);c=r.has_more?r.next_cursor:undefined}while(c);return out}
async function* walkImages(id){for(const b of await getBlocks(id)){if(b.type==='image')yield b;if(b.has_children&&b.type!=='image')yield* walkImages(b.id)}}
const keyFromUrl = (u) => (u && u.startsWith(base + '/')) ? decodeURIComponent(u.slice(base.length + 1)) : null

// 1) collect referenced keys
const referenced = new Set()
for (const db of [env.NOTION_DATABASE_ID, env.NOTION_DATABASE_ID2]) {
  for (const p of await queryAll(db)) {
    const cov = p.cover?.external?.url || p.cover?.file?.url
    const ck = keyFromUrl(cov); if (ck) referenced.add(ck)
    for await (const b of walkImages(p.id)) {
      const k = keyFromUrl(b.image?.external?.url || b.image?.file?.url); if (k) referenced.add(k)
    }
  }
}
console.log(`referenced R2 keys (in Notion): ${referenced.size}`)

// 2) list all objects
const all = []
let token
do {
  const r = await s3.send(new ListObjectsV2Command({ Bucket: env.R2_BUCKET, ContinuationToken: token }))
  ;(r.Contents || []).forEach(o => all.push(o.Key))
  token = r.IsTruncated ? r.NextContinuationToken : undefined
} while (token)
console.log(`objects in R2 bucket: ${all.length}`)

// 3) orphans = not referenced
const orphans = all.filter(k => !referenced.has(k))
const byPrefix = {}; orphans.forEach(k => { const p = k.split('/')[0]; byPrefix[p] = (byPrefix[p]||0)+1 })
console.log(`orphans to delete: ${orphans.length}`, byPrefix)
console.log('sample:', orphans.slice(0, 5))

if (DRY || orphans.length === 0) { console.log(DRY ? '(dry-run, nothing deleted)' : 'nothing to delete'); process.exit(0) }

// 4) delete in batches of 1000
for (let i = 0; i < orphans.length; i += 1000) {
  const batch = orphans.slice(i, i + 1000)
  await s3.send(new DeleteObjectsCommand({ Bucket: env.R2_BUCKET, Delete: { Objects: batch.map(Key => ({ Key })) } }))
  console.log(`deleted ${Math.min(i + 1000, orphans.length)}/${orphans.length}`)
}
console.log('done.')
