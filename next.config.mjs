/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.scdn.co'],
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
  },
};

export default nextConfig;
