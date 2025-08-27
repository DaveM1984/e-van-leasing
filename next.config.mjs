/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true
  },
  eslint: {
    // Temporarily ignore ESLint during build to avoid CLI option incompatibilities on the server.
    // Local dev `next lint` still works, and CI can run lint separately.
    ignoreDuringBuilds: true
  }
};
export default nextConfig;