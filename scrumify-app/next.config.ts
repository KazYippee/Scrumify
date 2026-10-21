import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match Django's API URLs, which end with a slash.
  trailingSlash: true,
  // Proxy browser requests to Django. :path* keeps the rest of the requested path:
  // /api/chores/4/ on port 3000 goes to /api/chores/4/ on port 8000.
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
