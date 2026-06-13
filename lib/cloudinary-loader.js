// Custom next/image loader that routes remote images through Cloudinary's
// "fetch" delivery for fast CDN delivery, automatic format (AVIF/WebP),
// automatic quality, and on-the-fly resizing.
//
// Why fetch mode: existing image URLs (imgbb, Notion S3) stay in Notion as-is.
// Cloudinary pulls each source once, optimizes it, caches it on its global CDN
// with long-lived immutable headers, and serves it from then on — no
// re-uploading or content migration needed.
//
// Setup: create a free Cloudinary account and set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.
// Until that env var is present, images fall back to their original URL so the
// site keeps working.

export default function cloudinaryLoader({ src, width, quality }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // No Cloudinary configured yet, or a local/static asset, or a data URI:
  // serve the source untouched.
  if (!cloudName || src.startsWith('/') || src.startsWith('data:')) {
    return src;
  }

  const params = [
    'f_auto', // pick the best format the browser supports (AVIF/WebP)
    `q_${quality || 'auto'}`, // automatic quality unless an explicit quality is set
    `w_${width}`, // resize to the width next/image asks for
    'c_limit', // never upscale beyond the original
  ].join(',');

  return `https://res.cloudinary.com/${cloudName}/image/fetch/${params}/${encodeURIComponent(src)}`;
}