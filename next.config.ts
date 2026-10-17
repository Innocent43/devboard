import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // allowedDevOrigins: ["192.168.1.86"],
  experimental: {
    useOffline: true,
  },
};

export default nextConfig;
