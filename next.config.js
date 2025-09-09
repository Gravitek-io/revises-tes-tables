/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  async generateBuildId() {
    return 'build'
  }
}

module.exports = nextConfig