import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { GoogleAnalyticsRuntime } from "./analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Mono is only used for small labels; skip preloading it so it doesn't compete
// with the LCP element for bandwidth.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yonoplaystore.com"),
  applicationName: "Yono Play Store",
  title: {
    default: "Yono Play Store – Yono Apps, Games & APK Guides",
    template: "%s | Yono Play Store",
  },
  description: "Explore Yono apps and games with download information, Android installation guides, app verification details and safety resources from Yono Play Store.",
  authors: [{ name: "Yono Play Store Editorial Desk", url: "https://yonoplaystore.com/about/" }],
  creator: "Yono Play Store Editorial Desk",
  publisher: "Yono Play Store",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    images: [{ url: "/yono-playstore-logo.png", width: 512, height: 512, alt: "Yono Play Store logo" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TD9D02FDMM"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TD9D02FDMM');
          `}
        </Script>
        <GoogleAnalyticsRuntime />
        {children}
        <a
          className="telegram-widget"
          href="https://t.me/OfficialYonoPlaystore"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open @OfficialYonoPlaystore on Telegram"
        >
          <span className="telegram-widget__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M20.7 3.5 2.9 10.4c-1.2.5-1.2 1.1-.2 1.4l4.6 1.4 1.8 5.5c.2.6.1.8.8.8.5 0 .8-.2 1-.4l2.2-2.1 4.5 3.3c.8.5 1.4.3 1.6-.8l3-14.1c.3-1.4-.5-2-1.5-1.6v-.3ZM8 12.9l10.5-6.6c.5-.3 1-.1.6.3l-8.7 7.8-.3 3.4L8 12.9Z" />
            </svg>
          </span>
          <span className="telegram-widget__copy">
            <b>Telegram</b>
            <small>@OfficialYonoPlaystore</small>
          </span>
          <span className="telegram-widget__arrow" aria-hidden="true">↗</span>
        </a>
      </body>
    </html>
  );
}
