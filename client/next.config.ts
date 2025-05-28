import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        {
          protocol: "https",
          hostname: "portfolio.test",
          pathname: "/wp-content/uploads/**",
        },
      ],
  }
};

export default nextConfig;
