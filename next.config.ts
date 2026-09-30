import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonicals, the sitemap and llms.txt all use trailing-slash URLs; without
  // this, every one of them 308-redirects to the no-slash form.
  trailingSlash: true,
};

export default nextConfig;
