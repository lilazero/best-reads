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
      //how did yarema manage to find a http image on amazon, is beyond me. but i figured it out fast
      {
        protocol: "http",
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
