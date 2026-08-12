import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

let workerPromise;
async function loadWorker() {
  if (!workerPromise) {
    const workerUrl = new URL("../dist/server/index.js", import.meta.url);
    workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
    workerPromise = import(workerUrl.href).then((module) => module.default);
  }
  return workerPromise;
}

async function render(path) {
  const worker = await loadWorker();
  const request = (url) => worker.fetch(
    new Request(url, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
  let response = await request(`http://localhost${path}`);
  for (let redirects = 0; redirects < 3 && response.status >= 300 && response.status < 400; redirects += 1) {
    const location = response.headers.get("location");
    assert.ok(location, "redirect response must provide a location");
    response = await request(new URL(location, `http://localhost${path}`).toString());
  }
  return response;
}

test("renders indexable homepage metadata and structured data", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/yonoplaystore\.com\/"/i);
  assert.match(html, /<meta name="description" content="Explore Yono apps and games/i);
  assert.match(html, /<meta name="robots" content="index, follow"/i);
  assert.match(html, /<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/i);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"Organization"/);
});

test("loads Google Analytics once with the requested measurement ID", async () => {
  for (const route of ["/", "/apps/dhan-game/"]) {
    const response = await render(route);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.equal((html.match(/googletagmanager\.com\/gtag\/js\?id=G-TD9D02FDMM/g) || []).length, 1, `${route} should load gtag.js once`);
    assert.equal((html.match(/gtag\('config', 'G-TD9D02FDMM'\)/g) || []).length, 1, `${route} should configure GA4 once`);
  }
});

test("uses the supplied YONO PLAYSTORE artwork for the site logo and favicon", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<img[^>]+class="brand-logo"[^>]+src="\/yono-playstore-logo\.png"[^>]+alt="YONO PLAYSTORE"/i);
  assert.match(html, /<link rel="icon" href="https:\/\/yonoplaystore\.com\/yono-playstore-logo\.png"/i);
});

test("renders unique app metadata and schema", async () => {
  const response = await render("/apps/hi-rummy/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Hi Rummy APK Download, Source and Safety Guide \| Yono Play Store<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/yonoplaystore\.com\/apps\/hi-rummy\/"/i);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
});

test("returns a real 404 with noindex metadata for unknown routes", async () => {
  const response = await render("/not-a-real-page/");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /<meta content="noindex" name="robots"/i);
  assert.doesNotMatch(html, /<link rel="canonical"/i);
});

test("every indexable route has unique, descriptive and canonical metadata", async () => {
  const catalog = await readFile(new URL("../app/catalog.ts", import.meta.url), "utf8");
  const appSlugs = [...catalog.matchAll(/\bapp\("([^"]+)"/g)].map((match) => match[1]);
  const categorySlugs = ["rummy", "slots", "arcade", "spin", "other"];
  const guideSlugs = ["what-is-an-apk", "how-to-install-apk", "how-to-check-apk-source", "android-app-permissions"];
  const comparisonSlugs = ["yono-rummy-vs-gogo-rummy-vs-hi-rummy", "rummy-91-vs-rummy-888-vs-rummy-77", "yono-777-vs-777-game-vs-yn-777"];
  const safetySlugs = ["credits-vs-withdrawable-balances", "spin-app-reward-terms", "yono-app-privacy-checklist"];
  const staticRoutes = ["/", "/apps/", "/categories/", "/guides/", "/apk-guides/", "/compare/", "/collections/", "/app-safety/", "/methodology/", "/sources/", "/editorial-policy/", "/corrections-policy/", "/about/", "/contact/", "/disclaimer/", "/responsible-gaming/", "/privacy-policy/", "/terms-and-conditions/", "/faq/"];
  const routes = [
    ...staticRoutes,
    ...appSlugs.map((slug) => `/apps/${slug}/`),
    ...categorySlugs.map((slug) => `/categories/${slug}/`),
    ...guideSlugs.map((slug) => `/apk-guides/${slug}/`),
    ...comparisonSlugs.map((slug) => `/compare/${slug}/`),
    ...safetySlugs.map((slug) => `/app-safety/${slug}/`),
    "/collections/jaiho-apps/",
  ];
  const titles = new Set();
  const descriptions = new Set();

  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, `${route} should return 200`);
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    assert.ok(title && title.length >= 30 && title.length <= 70, `${route} should have a useful title`);
    assert.ok(description && description.length >= 100 && description.length <= 180, `${route} should have a useful description`);
    assert.equal(canonical, `https://yonoplaystore.com${route}`, `${route} should self-canonicalize`);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${route} should have one H1`);
    assert.doesNotMatch(html, /<meta[^>]+name="keywords"/i, `${route} should not use obsolete meta keywords`);
    assert.ok(!titles.has(title), `${route} should have a unique title`);
    assert.ok(!descriptions.has(description), `${route} should have a unique meta description`);
    titles.add(title);
    descriptions.add(description);
  }

  assert.equal(routes.length, 93);
});

test("renders the supplied external APK destinations safely", async () => {
  const catalog = await readFile(new URL("../app/catalog.ts", import.meta.url), "utf8");
  const appSlugs = [...catalog.matchAll(/\bapp\("([^"]+)"/g)].map((match) => match[1]);
  const downloadEntries = [...catalog.matchAll(/^\s+"([^"]+)":\s+"(https:[^"]+)",$/gm)].map((match) => [match[1], match[2]]);
  const mappedSlugs = new Set(downloadEntries.map(([slug]) => slug));

  assert.equal(downloadEntries.length, 54);
  assert.deepEqual(appSlugs.filter((slug) => !mappedSlugs.has(slug)), ["ind-bingo", "spin-777", "spin-lucky", "yn-777"]);

  for (const [slug, url] of downloadEntries) {
    const response = await render(`/apps/${slug}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    const escapedUrl = url.replaceAll("&", "&amp;");
    assert.ok(html.includes(`href="${escapedUrl}"`), `${slug} should use its supplied external URL`);
    assert.match(html, /rel="nofollow sponsored noopener noreferrer"/i);
    assert.match(html, /target="_blank"/i);
  }

  assert.doesNotMatch(catalog, /1781948890www\.777game7\.com|%F0%9F%94%97/);
});

test("every app record has distinct people-first editorial copy", async () => {
  const catalog = await readFile(new URL("../app/catalog.ts", import.meta.url), "utf8");
  const appSlugs = [...catalog.matchAll(/\bapp\("([^"]+)"/g)].map((match) => match[1]);
  const directAnswers = new Set();

  for (const slug of appSlugs) {
    const response = await render(`/apps/${slug}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.doesNotMatch(html, /catalog record covering app identity/i, `${slug} should not use the old card template`);
    assert.doesNotMatch(html, /This page explains what visitors should verify before interacting/i, `${slug} should not use the old hero template`);
    const answer = html.match(/<div class="quick-answer">[\s\S]*?<p>(.*?)<\/p>/i)?.[1];
    assert.ok(answer && answer.length >= 100, `${slug} should provide a substantial direct answer`);
    assert.ok(!directAnswers.has(answer), `${slug} should have a unique direct answer`);
    directAnswers.add(answer);
  }

  assert.equal(directAnswers.size, 58);
});

test("publishes clean robots and sitemap discovery files", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  const robotsText = await robots.text();
  assert.match(robotsText, /User-Agent: \*/i);
  assert.match(robotsText, /Allow: \//i);
  assert.match(robotsText, /Sitemap: https:\/\/yonoplaystore\.com\/sitemap\.xml/i);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const sitemapXml = await sitemap.text();
  assert.equal((sitemapXml.match(/<url>/g) || []).length, 93);
  assert.match(sitemapXml, /\/guides\//);
  assert.doesNotMatch(sitemapXml, /<lastmod>|<priority>|<changefreq>/);
});
