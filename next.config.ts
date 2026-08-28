import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonicalizes the apex domain to www so Google never sees the two as
  // duplicate pages. No-op until computersuri.com's DNS actually points at
  // this Vercel project; safe to keep even if a domain-level redirect is
  // later configured in Vercel, since that would fire before this ever runs.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "computersuri.com" }],
        destination: "https://www.computersuri.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
