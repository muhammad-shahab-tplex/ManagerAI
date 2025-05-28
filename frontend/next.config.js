/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static export
  output: 'export',
  // Disable image optimization during static export
  images: {
    unoptimized: true
  },
  // Disable trailing slashes to fix routing issues
  trailingSlash: false
}

module.exports = nextConfig 