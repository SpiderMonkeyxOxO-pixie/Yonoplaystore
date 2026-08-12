import type { MetadataRoute } from "next";
import { apps, categories, guides } from "./catalog";
import { comparisonArticles, jaihoCollection, safetyArticles } from "./resource-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://yonoplaystore.com";
  const staticRoutes = ["", "apps", "categories", "guides", "apk-guides", "compare", "collections", "app-safety", "methodology", "sources", "editorial-policy", "corrections-policy", "about", "contact", "disclaimer", "responsible-gaming", "privacy-policy", "terms-and-conditions", "faq"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}/${route}${route ? "/" : ""}` })),
    ...apps.map((app) => ({ url: `${base}/apps/${app.slug}/` })),
    ...categories.map((category) => ({ url: `${base}/categories/${category.slug}/` })),
    ...guides.map((guide) => ({ url: `${base}/apk-guides/${guide.slug}/` })),
    ...comparisonArticles.map((article) => ({ url: `${base}/compare/${article.slug}/` })),
    ...safetyArticles.map((article) => ({ url: `${base}/app-safety/${article.slug}/` })),
    { url: `${base}/collections/${jaihoCollection.slug}/` },
  ];
}
