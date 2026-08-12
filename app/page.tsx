import type { Metadata } from "next";
import { SitePage } from "./site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Yono Play Store – Explore Yono Apps, Games and APK Guides",
    description: "Browse Yono apps, review available download information and learn how to verify Android gaming apps before installation.",
    url: "/",
    siteName: "Yono Play Store",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Yono Play Store – Yono Apps and APK Guides",
    description: "Browse Yono apps, APK download information, source checks and Android installation guidance.",
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

export default function Home() {
  return <SitePage path="/" />;
}
