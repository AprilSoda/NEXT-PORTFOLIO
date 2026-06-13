/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Route images through Cloudinary (see lib/cloudinary-loader.js).
    // Falls back to the original URL until NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set.
    loader: 'custom',
    loaderFile: './lib/cloudinary-loader.js',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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