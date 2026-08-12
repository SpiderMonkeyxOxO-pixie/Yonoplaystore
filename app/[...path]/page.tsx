import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { absoluteUrl, getRouteSeo, SITE_NAME } from "../seo";
import { SitePage } from "../site";

type Props = { params: Promise<{ path: string[] }> };

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
  const image = seo.image ? [{ url: seo.image, width: 256, height: 256, alt: seo.imageAlt }] : undefined;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonicalPath },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalPath,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: seo.openGraphType || "website",
      images: image,
    },
    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
      images: seo.image ? [absoluteUrl(seo.image)] : undefined,
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
