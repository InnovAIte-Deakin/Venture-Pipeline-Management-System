/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.0.108"],
  async rewrites() {
    const backend =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.PUBLIC_BACKEND_URL ||
      "http://localhost:3001";

    return [
      {
        source: "/backend/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;