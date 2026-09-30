import type { MetadataRoute } from "next";
import { apps, categories, guides } from "./catalog";
import { comparisonArticles, guideArticles, jaihoCollection, safetyArticles } from "./resource-content";

/** Date of the initial editorial review shown on records that have no article-level date. */
const BASE_REVIEW_DATE = "2026-08-12";

function latest(dates: (string | undefined)[]) {
  return dates.filter(Boolean).sort().at(-1) ?? BASE_REVIEW_DATE;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://yonoplaystore.com";
  const staticRoutes = ["", "apps", "categories", "guides", "apk-guides", "compare", "collections", "app-safety", "methodology", "sources", "editorial-policy", "corrections-policy", "about", "contact", "disclaimer", "affiliate-disclosure", "responsible-gaming", "privacy-policy", "terms-and-conditions", "faq"];
  const appDate = (slug: string) => apps.find((app) => app.slug === slug)?.editorial.article?.dateModified ?? BASE_REVIEW_DATE;
  const catalogDate = latest(apps.map((app) => app.editorial.article?.dateModified));
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}/${route}${route ? "/" : ""}`,
      ...(["", "apps", "categories"].includes(route) ? { lastModified: catalogDate } : {}),
    })),
    ...apps.map((app) => ({ url: `${base}/apps/${app.slug}/`, lastModified: appDate(app.slug) })),
    ...categories.map((category) => ({
      url: `${base}/categories/${category.slug}/`,
      lastModified: latest(apps.filter((app) => app.category === category.name).map((app) => app.editorial.article?.dateModified)),
    })),
    ...guides.map((guide) => ({ url: `${base}/apk-guides/${guide.slug}/`, lastModified: guideArticles[guide.slug]?.dateModified ?? BASE_REVIEW_DATE })),
    ...comparisonArticles.map((article) => ({ url: `${base}/compare/${article.slug}/`, lastModified: article.dateModified ?? BASE_REVIEW_DATE })),
    ...safetyArticles.map((article) => ({ url: `${base}/app-safety/${article.slug}/`, lastModified: article.dateModified ?? BASE_REVIEW_DATE })),
    { url: `${base}/collections/${jaihoCollection.slug}/`, lastModified: BASE_REVIEW_DATE },
  ];
}
