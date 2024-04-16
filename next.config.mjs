/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.scdn.co"],
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    REDIRECT_URI: process.env.REDIRECT_URI,
    AUTH_ENDPOINT: process.env.AUTH_ENDPOINT,
    GENERATION_API_ENDPOINT: process.env.GENERATION_API_ENDPOINT
  },
};

export default nextConfig;
