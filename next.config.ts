import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "www.goodreads.com",
      },
      {
        protocol: "https",
        hostname: "images.gr-assets.com",
      },
    ],
  },
};

export default nextConfig;
