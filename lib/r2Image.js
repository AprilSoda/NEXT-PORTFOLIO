import imageManifest from './imageManifest.json'

// Returns the migrated Cloudflare R2 URL for a Notion page/block id if the
// image has been migrated (see scripts/migrate-images-to-r2.mjs); otherwise
// falls back to the original URL. Non-destructive: Notion is the source of
// truth, the manifest just redirects known images to the fast R2 origin.
export default function r2Image(id, fallbackUrl) {
  return (id && imageManifest[id]) || fallbackUrl
}