import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    globalNotFound: true,
  },
  images: {
    // Cho phép hiển thị ảnh từ Cloudinary
    domains: ["res.cloudinary.com", "api.dicebear.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
      protocol: "https",
      hostname: "api.dicebear.com",
      pathname: "/**",
    },
    ],
  },
  typescript: {
    // Cho phép build thành công ngay cả khi có lỗi TS
    ignoreBuildErrors: true,
  },
  eslint: {
    // Bỏ qua lỗi lint khi build
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
