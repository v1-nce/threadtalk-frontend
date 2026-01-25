/** @type {import('next').NextConfig} */
// This is to allow the frontend to talk to itself solving
// solving Third-Party cookies issue for mobile browsers!
const nextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      // Auth Routes (Signup, Login, Logout)
      {
        source: '/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/:path*`,
      },
      // Protected API Routes (Profile, Create Post)
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      // PUBLIC API Routes (The missing fix for your 301 error)
      {
        source: '/topics',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/topics`,
      },
      {
        source: '/topics/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/topics/:path*`,
      },
      {
        source: '/posts/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/posts/:path*`,
      },
      // Health Check
      {
        source: '/health',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/health`,
      }
    ]
  },
}

module.exports = nextConfig