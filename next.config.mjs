/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.googleusercontent.com' }
    ]
  },
  experimental: {
    optimizePackageImports: ['react', 'react-dom']
  }
};
export default nextConfig;
