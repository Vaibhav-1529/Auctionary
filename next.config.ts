import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: /supabase/,
    };
    return config;
  },
};

export default nextConfig;