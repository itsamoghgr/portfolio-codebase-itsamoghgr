import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'export' to enable Next.js API routes on Vercel
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
