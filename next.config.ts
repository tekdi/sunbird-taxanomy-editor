import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Enable standalone build for Docker optimization
  output: 'standalone',

  // Optimize for production builds
  poweredByHeader: false,

  // Enable compression
  compress: true,
};

export default nextConfig;
