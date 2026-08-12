import type { Metadata } from "next";
import { SitePage } from "./site";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This URL is not part of the Yono Play Store app catalog.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <SitePage path="/__not-found__/" />;
}
