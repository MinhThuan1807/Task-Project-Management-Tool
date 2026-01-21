import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    // Cho phép hiển thị ảnh từ Cloudinary
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
