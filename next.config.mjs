/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.azurewebsites.net' },
      { protocol: 'https', hostname: '**.blob.core.windows.net' },
      { protocol: 'https', hostname: '**.azureedge.net' }
    ],
    unoptimized: true
  },
  
  eslint: {
    // Temporarily ignore ESLint during build to avoid CLI option incompatibilities on the server.
    // Local dev `next lint` still works, and CI can run lint separately.
    ignoreDuringBuilds: true
  }
};

export default nextConfig;