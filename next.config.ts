import type { NextConfig } from "next";

const commonHost = {
  protocol: "http" as const,
  hostname: "localhost",
  port: "4000",
};

const paths = [
  "/public/storage/product/**",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      ...paths.map((pathname) => ({
        ...commonHost,
        pathname,
      })),
      {
        protocol: "https",
        hostname: "api.bloxfruithub.com",
      },
      {
        protocol: "https",
        hostname: "api.zorotopup.com",
      },
      {
        protocol: "https",
        hostname: "api.topupmania.com",
      },
      {
        protocol: "https",
        hostname: "tr.rbxcdn.com",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
