/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: true,
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