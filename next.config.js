/** @type {import('next').NextConfig} */
// This is to allow the frontend to talk to itself solving
// Third-part cookies issue
const nextConfig = {
    async rewrites() {
      return [
        // Proxy Auth routes
        {
          source: '/auth/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/:path*`,
        },
        // Proxy Protected API routes
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        },
        // Proxy Public routes (Topics, Posts)
        {
          source: '/topics/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/topics/:path*`,
        },
        {
          source: '/posts/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/posts/:path*`,
        },
        // Proxy Health check
        {
          source: '/health',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/health`,
        }
      ]
    },
  }
  
  module.exports = nextConfig