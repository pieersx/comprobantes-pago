import type { NextConfig } from 'next';

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969/api/v1').replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Optimización para producción
  output: 'standalone',
  compress: true,
  poweredByHeader: false,

  // API Configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: apiBaseUrl,
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },

  // Turbopack config (vacía para silenciar advertencia en Next.js 16)
  turbopack: {},

  // Webpack config
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
