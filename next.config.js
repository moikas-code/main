const withPWA = require('next-pwa');

const nextConfig = {
  // assetPrefix: './',
  // trailingSlash: true,
  reactStrictMode: false,
  pwa: {
    dest: 'public',
  },
  devIndicators: {
    autoPrerender: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [];
  },
  images: {
    domains: [
      'ipfs.io',
      'rarible.mypinata.cloud',
      'akkoros.mypinata.cloud',
      'ipfs.akkoros.xyz',
    ],
  },
  env: {
    NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
    ETHERSCAN_API: process.env.ETHERSCAN_API,
    DEV: process.env.DEV,
    AKKORO_ENV: process.env.AKKORO_ENV,
    NEXT_PUBLIC_OPENZEPPELIN_URL: process.env.NEXT_PUBLIC_OPENZEPPELIN_URL,
  },
};
module.exports = nextConfig;
