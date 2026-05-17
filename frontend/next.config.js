/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendBaseUrl =
      process.env.BACKEND_BASE_URL ||
      process.env.RAILWAY_PUBLIC_DOMAIN ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3002"
        : "https://service-request-board-production.up.railway.app");

    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
