import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: "https://yonoplaystore.com/sitemap.xml",
    host: "https://yonoplaystore.com",
  };
}
