/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/mywiki',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
