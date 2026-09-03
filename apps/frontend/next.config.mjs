/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ai-restaurant/ui", "@ai-restaurant/utils", "@ai-restaurant/config", "@ai-restaurant/types"],
};

export default nextConfig;
