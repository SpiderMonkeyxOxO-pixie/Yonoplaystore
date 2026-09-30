import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { absoluteUrl, getRouteSeo, SITE_NAME } from "../seo";
import { SitePage } from "../site";

type Props = { params: Promise<{ path: string[] }> };

const TITLE_SUFFIX = ` | ${SITE_NAME}`;
const DEFAULT_IMAGE = { url: "/yono-playstore-logo.png", width: 512, height: 512, alt: `${SITE_NAME} logo` };

/** Keep the brand suffix only when the full title still fits in ~60 characters. */
function pageTitle(title: string): Metadata["title"] {
  return title.length + TITLE_SUFFIX.length > 60 ? { absolute: title } : title;
}

/** Trim descriptions to <=160 characters at a word boundary. */
function clampDescription(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const seo = getRouteSeo(path);
  if (!seo) {
    return {
      title: "Page Not Found",
      description: "This URL is not part of the Yono Play Store app catalog.",
      robots: { index: false, follow: false },
    };
  }
  const isArticleImage = seo.image?.startsWith("/articles/");
  const image = seo.image
    ? [{ url: seo.image, width: isArticleImage ? 1200 : 256, height: isArticleImage ? 675 : 256, alt: seo.imageAlt }]
    : [DEFAULT_IMAGE];
  const description = clampDescription(seo.description);
  return {
    title: pageTitle(seo.title),
    description,
    alternates: { canonical: seo.canonicalPath },
    openGraph: {
      title: seo.title,
      description,
      url: seo.canonicalPath,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: seo.openGraphType || "website",
      images: image,
    },
    twitter: {
      card: isArticleImage ? "summary_large_image" : "summary",
      title: seo.title,
      description,
      images: [absoluteUrl(image[0].url)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function DynamicPage({ params }: Props) {
  const { path } = await params;
  const seo = getRouteSeo(path);
  if (!seo) notFound();
  if (seo.redirectTo) permanentRedirect(seo.redirectTo);
  return <SitePage path={`/${path.join("/")}/`} />;
}
