import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "platform.theverge.com",
        port: ""
      },
    ],
  },
};

export default nextConfig;
