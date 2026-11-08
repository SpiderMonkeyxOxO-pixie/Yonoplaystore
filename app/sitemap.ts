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
  const appDate = (slug: string) => apps.find((app) => app.slug === slug)?.editorial.article?.dateModified ?? BASE_REVIEW_DATE;
  const catalogDate = latest(apps.map((app) => app.editorial.article?.dateModified));
  const guidesDate = latest(guides.map((guide) => guideArticles[guide.slug]?.dateModified));
  const compareDate = latest(comparisonArticles.map((article) => article.dateModified));
  const safetyDate = latest(safetyArticles.map((article) => article.dateModified));
  const jaihoDate = latest(jaihoCollection.appSlugs.map((slug) => apps.find((app) => app.slug === slug)?.editorial.article?.dateModified));
  // "guides" is the combined hub for apk-guides + compare, so it takes the later of the two.
  const resourceHubDate = [guidesDate, compareDate].sort().at(-1)!;
  // Hub pages get a real lastModified derived from their listed content (the same
  // approach already used for apps/categories). Static legal/editorial pages (About,
  // Privacy, Terms, etc.) are deliberately left without lastModified: there is no
  // tracked last-edited date for hand-written prose pages in this codebase, and this
  // site's own Editorial Policy says dates "reflect actual editorial work" rather than
  // being invented — stamping an arbitrary date on those pages would violate that.
  const staticRoutes: { route: string; lastModified?: string }[] = [
    { route: "", lastModified: catalogDate },
    { route: "apps", lastModified: catalogDate },
    { route: "categories", lastModified: catalogDate },
    { route: "guides", lastModified: resourceHubDate },
    { route: "apk-guides", lastModified: guidesDate },
    { route: "compare", lastModified: compareDate },
    { route: "collections", lastModified: jaihoDate },
    { route: "app-safety", lastModified: safetyDate },
    { route: "methodology" },
    { route: "sources" },
    { route: "editorial-policy" },
    { route: "corrections-policy" },
    { route: "about" },
    { route: "contact" },
    { route: "disclaimer" },
    { route: "affiliate-disclosure" },
    { route: "responsible-gaming" },
    { route: "privacy-policy" },
    { route: "terms-and-conditions" },
    { route: "faq" },
  ];
  return [
    ...staticRoutes.map(({ route, lastModified }) => ({
      url: `${base}/${route}${route ? "/" : ""}`,
      ...(lastModified ? { lastModified } : {}),
    })),
    ...apps.map((app) => ({ url: `${base}/apps/${app.slug}/`, lastModified: appDate(app.slug) })),
    ...categories.map((category) => ({
      url: `${base}/categories/${category.slug}/`,
      lastModified: latest(apps.filter((app) => app.category === category.name).map((app) => app.editorial.article?.dateModified)),
    })),
    ...guides.map((guide) => ({ url: `${base}/apk-guides/${guide.slug}/`, lastModified: guideArticles[guide.slug]?.dateModified ?? BASE_REVIEW_DATE })),
    ...comparisonArticles.map((article) => ({ url: `${base}/compare/${article.slug}/`, lastModified: article.dateModified ?? BASE_REVIEW_DATE })),
    ...safetyArticles.map((article) => ({ url: `${base}/app-safety/${article.slug}/`, lastModified: article.dateModified ?? BASE_REVIEW_DATE })),
    { url: `${base}/collections/${jaihoCollection.slug}/`, lastModified: jaihoDate },
  ];
}
