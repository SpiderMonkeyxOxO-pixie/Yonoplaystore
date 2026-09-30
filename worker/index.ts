/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import robots from "../app/robots";
import sitemap from "../app/sitemap";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const CANONICAL_HOST = "yonoplaystore.com";

const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
};

function withSecurityHeaders(response: Response): Response {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!secured.headers.has(name)) secured.headers.set(name, value);
  }
  return secured;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Consolidate the www host onto the apex domain so only one host is indexed.
    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    return withSecurityHeaders(await routeRequest(request, env, ctx, url));
  },
};

/** Signal header the vinext Node server reads to serve a file from dist/client. */
const VINEXT_STATIC_FILE_HEADER = "x-vinext-static-file";

/** True for paths whose last segment has a file extension, e.g. /articles/x.webp. */
function isFilePath(pathname: string) {
  if (pathname.endsWith("/") || pathname.startsWith("/_vinext/")) return false;
  const last = pathname.slice(pathname.lastIndexOf("/") + 1);
  return /\.[A-Za-z0-9]{1,8}$/.test(last);
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sitemapXml() {
  const urls = sitemap().map(({ url, lastModified }) => {
    const lastmod = lastModified ? `<lastmod>${escapeXml(new Date(lastModified).toISOString().slice(0, 10))}</lastmod>\n` : "";
    return `<url>\n<loc>${escapeXml(url)}</loc>\n${lastmod}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function robotsTxt() {
  const { rules, sitemap: sitemapUrl, host } = robots();
  const lines: string[] = [];
  for (const rule of Array.isArray(rules) ? rules : [rules]) {
    for (const agent of [rule.userAgent ?? "*"].flat()) lines.push(`User-Agent: ${agent}`);
    for (const path of [rule.allow ?? []].flat()) lines.push(`Allow: ${path}`);
    for (const path of [rule.disallow ?? []].flat()) lines.push(`Disallow: ${path}`);
    lines.push("");
  }
  for (const url of [sitemapUrl ?? []].flat()) lines.push(`Sitemap: ${url}`);
  if (host) lines.push(`Host: ${host}`);
  return `${lines.join("\n")}\n`;
}

async function routeRequest(request: Request, env: Env, ctx: ExecutionContext, url: URL): Promise<Response> {
    // trailingSlash: true makes vinext redirect every slash-less path, including
    // these metadata files (whose slashed form then 404s), so serve them here.
    if (url.pathname === "/sitemap.xml") {
      return new Response(sitemapXml(), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
    }
    if (url.pathname === "/robots.txt") {
      return new Response(robotsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // Files from public/ (images, favicon, llms.txt, …) must not get the
    // trailing-slash redirect. Under `vinext start` every request reaches this
    // handler first, so hand file-like paths straight to the static server.
    if (isFilePath(url.pathname)) {
      if (env?.ASSETS) return env.ASSETS.fetch(request);
      return new Response(null, { headers: { [VINEXT_STATIC_FILE_HEADER]: url.pathname } });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
}

export default worker;
