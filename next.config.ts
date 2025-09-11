import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: false,
    domains: []
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material']
  }
};

export default nextConfig;
