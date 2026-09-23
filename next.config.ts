import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Each /blog/[slug] static page fires several WordPress requests
    // (post, related posts, adjacent posts). The build host's default
    // worker count (one per CPU — 10 locally, likely similar on Vercel)
    // fired that many pages' worth of requests at the WordPress origin
    // concurrently, and it only comfortably serves ~6 concurrent requests
    // before queuing pushes latency well past 10s (measured directly
    // against the real origin while diagnosing a Vercel build failure —
    // see lib/wordpress.ts's REQUEST_TIMEOUT_MS comment for the numbers
    // and for a second, concurrency-independent slow-window issue found
    // on the same origin). Capping build workers keeps concurrent
    // WordPress load under that ceiling.
    cpus: 2,
  },
  // Cloudways origin above needs comfortably more than the 60s default here
  // (see lib/wordpress.ts): a page can legitimately need close to
  // REQUEST_TIMEOUT_MS × 2 for its post fetch, then again for its parallel
  // related/adjacent fetch, in the worst case. This just gives that
  // legitimate worst case room to finish instead of Next killing (and
  // retrying) the page render before our own retries are done.
  staticPageGenerationTimeout: 120,
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
