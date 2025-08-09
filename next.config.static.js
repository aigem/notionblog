/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 禁用需要服务器运行时的功能
  experimental: {
    // 移除服务器端功能
  }
}

module.exports = nextConfig