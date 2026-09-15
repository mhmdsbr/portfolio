import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Production image source — your actual domain/CDN/Hetzner host
      {
        protocol: 'https',
        hostname: 'yourdomain.com', // <-- replace with your real domain
        pathname: '/**',
      },
      // Local dev only — never active in production
      ...(isDev
        ? [
            {
              protocol: 'http' as const,
              hostname: 'localhost',
              port: '3000',
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;