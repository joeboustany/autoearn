import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: "output: standalone" was removed for Vercel compatibility.
  // Vercel handles the Next.js server automatically.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
