import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repo sits inside a larger git/npm tree; pin the project root here.
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  // Fully static site: `next build` writes plain HTML/CSS/JS to out/.
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // Inline the stylesheet into the HTML so it doesn't block first paint.
  experimental: { inlineCss: true },
};

export default nextConfig;
