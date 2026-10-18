/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: true,
  // English at /, Korean at /ko
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
  // The blog was renamed to Journal — keep old links working
  async redirects() {
    return [
      { source: '/blogs', destination: '/journal', permanent: true },
      { source: '/blogs/:slug', destination: '/journal/:slug', permanent: true },
    ]
  },
  // Baseline security headers. No CSP yet: GA, Notion images and video embeds
  // would each need allow-listing, and a wrong CSP silently breaks pages.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        ],
      },
    ]
  },
  images: {
    // Host-native next/image optimization (Netlify on prod). No third-party CDN.
    // Allow any HTTPS host: blog/works covers are pasted from arbitrary sources
    // in Notion (imgbb, Google images, YouTube thumbs, Notion S3, etc.), so a
    // restricted allowlist would break existing images. Reliability > tighter list.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400, // 31 days — once optimized, serve cached even if origin expires
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    silenceDeprecations: ['legacy-js-api', 'import'],
  },
  serverExternalPackages: ['@notionhq/client'],
}

module.exports = nextConfig