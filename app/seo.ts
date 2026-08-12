import { apps, categories, guides } from "./catalog";
import { comparisonArticles, guideArticles, jaihoCollection, safetyArticles } from "./resource-content";

export const SITE_NAME = "Yono Play Store";
export const SITE_URL = "https://yonoplaystore.com";

export type RouteSeo = {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  imageAlt?: string;
  openGraphType?: "website" | "article";
  redirectTo?: string;
};

const infoSeo: Record<string, Omit<RouteSeo, "canonicalPath">> = {
  about: {
    title: "About Our Independent Yono App Catalog",
    description: "Learn how Yono Play Store verifies Yono app records and helps visitors evaluate current APK download sources.",
  },
  methodology: {
    title: "How We Review Yono Apps and APK Sources",
    description: "Read the editorial method used to review Yono app identities, APK sources, Android details, evidence labels and corrections.",
  },
  sources: {
    title: "Yono App Sources and Verification Standards",
    description: "See which primary, publisher and third-party sources Yono Play Store uses when reviewing app identities and APK information.",
  },
  "editorial-policy": {
    title: "Editorial Policy for App and APK Information",
    description: "Review the standards used to publish factual Yono app information, disclose uncertainty and avoid unsupported ratings or claims.",
  },
  "corrections-policy": {
    title: "Corrections Policy",
    description: "Learn how to report inaccurate Yono app information and how Yono Play Store evaluates, documents and corrects material errors.",
  },
  "responsible-gaming": {
    title: "Responsible Gaming Guidance",
    description: "Read practical guidance on gaming limits, warning signs, age requirements and understanding the rules that apply in your location.",
  },
  disclaimer: {
    title: "Independent Website Disclaimer",
    description: "Yono Play Store is not affiliated with Google Play, Google LLC, YONO SBI or State Bank of India. Read the full independent website disclaimer.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Read how technical usage data, catalog searches and voluntarily submitted contact information may be processed on this website.",
  },
  "terms-and-conditions": {
    title: "Terms and Conditions",
    description: "Review the terms governing informational use, intellectual property and acceptable use of the Yono Play Store app catalog.",
  },
  faq: {
    title: "Yono Apps and APK Download FAQ",
    description: "Find clear answers about Yono apps, APK download information, source verification, app safety and this catalog's independence.",
  },
  contact: {
    title: "Contact the Editorial Desk",
    description: "Report a Yono app information issue, submit a reliable source or request a factual correction from the editorial desk.",
  },
};

function categorySeo(slug: string): RouteSeo | null {
  const category = categories.find((item) => item.slug === slug);
  if (!category) return null;
  const count = apps.filter((item) => item.category === category.name).length;
  return {
    title: `${category.name} Yono Apps: Games and APK Information`,
    description: `Browse ${count} ${category.name.toLowerCase()} Yono apps with app descriptions, APK download information, source-status labels and Android safety guidance.`,
    canonicalPath: `/categories/${category.slug}/`,
  };
}

export function getRouteSeo(path: string[]): RouteSeo | null {
  if (path.length === 1 && path[0] === "apps") {
    return {
      title: "Yono Apps Catalog: Games and APK Information",
      description: `Explore ${apps.length} Yono apps and games. Compare categories, read APK download information and check each app record's source status.`,
      canonicalPath: "/apps/",
    };
  }

  if (path.length === 2 && path[0] === "apps") {
    const app = apps.find((item) => item.slug === path[1]);
    if (!app) return null;
    const article = app.editorial.article;
    return {
      title: app.editorial.seoTitle,
      description: app.editorial.seoDescription,
      canonicalPath: `/apps/${app.slug}/`,
      image: article?.image || app.image,
      imageAlt: article?.imageAlt || `${app.name} app icon`,
    };
  }

  if (path.length === 1 && path[0] === "categories") {
    return {
      title: "Yono App Categories: Rummy, Slots, Arcade and Spin",
      description: "Browse Yono apps by supported categories, including rummy, slots, arcade, spin and other game records with source-status information.",
      canonicalPath: "/categories/",
    };
  }

  if (path.length === 2 && path[0] === "categories") return categorySeo(path[1]);

  if (path.length === 1 && path[0] === "apk-guides") {
    return {
      title: "Yono APK Download and Android Installation Guides",
      description: "Learn what APK files are, how Android installation works, how to assess download sources and how to review app permissions.",
      canonicalPath: "/apk-guides/",
    };
  }

  if (path.length === 2 && path[0] === "apk-guides") {
    const guide = guides.find((item) => item.slug === path[1]);
    if (!guide) return null;
    const titles: Record<string, string> = {
      "what-is-an-apk": "What Is an APK? Android App File Guide",
      "how-to-install-apk": "How to Install an APK Carefully on Android",
      "how-to-check-apk-source": "How to Check an APK Download Source",
      "android-app-permissions": "Android App Permissions Explained",
    };
    const resource = guideArticles[guide.slug];
    return {
      title: titles[guide.slug] || guide.title,
      description: `${guide.summary} Read a practical, source-aware guide from the Yono Play Store editorial desk.`,
      canonicalPath: `/apk-guides/${guide.slug}/`,
      openGraphType: "article",
      image: resource?.image,
      imageAlt: resource?.imageAlt,
    };
  }

  if (path.length === 1 && path[0] === "guides") {
    return {
      title: "Yono App Guides, Comparisons and Safety Resources",
      description: "Browse APK and Android guides, exact-name Yono app comparisons, privacy checklists, balance explainers and app-family collections.",
      canonicalPath: "/guides/",
    };
  }

  if (path.length === 1 && path[0] === "compare") {
    return {
      title: "Compare Yono Apps, Rummy Games and 777 App Names",
      description: "Compare similarly named Yono, rummy and 777 app records using exact names, source domains, Android packages and operator evidence.",
      canonicalPath: "/compare/",
    };
  }

  if (path.length === 2 && path[0] === "compare") {
    const article = comparisonArticles.find((item) => item.slug === path[1]);
    if (!article) return null;
    return {
      title: article.title,
      description: article.summary,
      canonicalPath: `/compare/${article.slug}/`,
      openGraphType: "article",
      image: article.image,
      imageAlt: article.imageAlt,
    };
  }

  if (path.length === 1 && path[0] === "collections") {
    return {
      title: "Yono App Collections and Naming-Family Maps",
      description: "Browse related Yono gaming-app name families while keeping every app identity, APK source and operator record separate.",
      canonicalPath: "/collections/",
    };
  }

  if (path.length === 2 && path[0] === "collections" && path[1] === jaihoCollection.slug) {
    return {
      title: "Jaiho Apps Collection: 7 Separate Records",
      description: jaihoCollection.summary,
      canonicalPath: `/collections/${jaihoCollection.slug}/`,
    };
  }

  if (path.length === 1 && path[0] === "app-safety") {
    return {
      title: "Yono App Safety: Check APKs Before Installing",
      description: "Use a six-point safety checklist to review a Yono app name, APK source, publisher, Android details and requested permissions.",
      canonicalPath: "/app-safety/",
    };
  }

  if (path.length === 2 && path[0] === "app-safety") {
    const article = safetyArticles.find((item) => item.slug === path[1]);
    if (!article) return null;
    return {
      title: article.title,
      description: article.summary,
      canonicalPath: `/app-safety/${article.slug}/`,
      openGraphType: "article",
    };
  }

  if (path.length === 1 && infoSeo[path[0]]) {
    return { ...infoSeo[path[0]], canonicalPath: `/${path[0]}/` };
  }

  return null;
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
