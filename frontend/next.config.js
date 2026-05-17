/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendBaseUrl =
      process.env.BACKEND_BASE_URL ||
      process.env.RAILWAY_PUBLIC_DOMAIN ||
      "http://localhost:3002";

    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
