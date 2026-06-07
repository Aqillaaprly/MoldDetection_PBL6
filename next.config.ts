import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.241.168.140"],
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig