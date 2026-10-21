import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match Django's trailing slashes and proxy requests to the local backend.
  trailingSlash: true,
  async rewrites() {
    return [{ source: "/api/:path*/", destination: "http://127.0.0.1:8000/api/:path*/" }];
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
