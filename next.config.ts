import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
