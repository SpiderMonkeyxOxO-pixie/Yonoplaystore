"use client";

import { useEffect } from "react";

const MEASUREMENT_ID = "G-TD9D02FDMM";

declare global {
  interface Window {
    dataLayer?: Array<ArrayLike<unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalyticsRuntime() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    const alreadyConfigured = window.dataLayer.some(
      (entry) => entry[0] === "config" && entry[1] === MEASUREMENT_ID,
    );

    if (alreadyConfigured) return;

    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);
  }, []);

  return null;
}
