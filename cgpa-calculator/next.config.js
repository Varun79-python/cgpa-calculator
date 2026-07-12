/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    // HTML pages: NetworkFirst = try live first (admin updates), fall back to cache (offline)
    {
      urlPattern: /^https:\/\/cgpacalculator7\.vercel\.app\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'cgpa-pages-v4',
        expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
        networkTimeoutSeconds: 5,
      },
    },
    // JS/CSS bundles: StaleWhileRevalidate = serve cached instantly, update in background
    {
      urlPattern: /\.(?:js|css|woff2?)$/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'cgpa-static-v4' },
    },
    // Images: CacheFirst = always serve from cache, never re-download
    {
      urlPattern: /\.(?:png|jpg|jpeg|webp|svg|ico|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cgpa-images-v4',
        expiration: { maxEntries: 100, maxAgeSeconds: 90 * 24 * 60 * 60 },
      },
    },
    // API/data: NetworkFirst with short timeout
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'cgpa-data-v4',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 30, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
  ],
});

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        destination: '/api/.well-known/assetlinks',
      },
    ];
  },
});

module.exports = nextConfig;
