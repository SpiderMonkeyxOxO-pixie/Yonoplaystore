#!/usr/bin/env node
// Yono Play Store SEO content publishing dispatcher.
//
// Reads scripts/content-pipeline/manifest.json, publishes any item whose
// publish_at (Asia/Kolkata) has passed and is not yet marked published in
// scripts/content-pipeline/state.json, then rebuilds and redeploys.
//
// Usage:
//   node dispatcher.mjs --dry-run              Validate + report, no writes/build/deploy
//   node dispatcher.mjs                         Publish all due items
//   node dispatcher.mjs --publish day-05        Force-publish a specific item (recovery)
//
// Exit codes: 0 = success (including "nothing due"), 1 = one or more items failed.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { parseContentFile } from "./convert-markdown.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const MANIFEST_PATH = path.join(ROOT, "scripts/content-pipeline/manifest.json");
const STATE_PATH = path.join(ROOT, "scripts/content-pipeline/state.json");
const LOCK_PATH = path.join(ROOT, "scripts/content-pipeline/.publisher.lock");
const LOG_PATH = path.join(ROOT, "logs/content-publisher.log");
const SITE_ORIGIN = "https://yonoplaystore.com";
const PM2_PROCESS_NAME = "yonoplaystore";

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const forcePublishArg = args.find((a) => a.startsWith("--publish"));
const forceDay = forcePublishArg
  ? Number((args[args.indexOf(forcePublishArg) + 1] || forcePublishArg.split("=")[1] || "").replace(/^day-/, ""))
  : null;

function nowIso() {
  return new Date().toISOString();
}

function log(level, message, extra) {
  const line = JSON.stringify({ ts: nowIso(), level, message, ...extra });
  console.log(line);
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.appendFileSync(LOG_PATH, line + "\n");
}

function loadJson(p, fallback) {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function saveJsonAtomic(p, data) {
  const tmp = `${p}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, p); // atomic on the same filesystem
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function acquireLock() {
  try {
    // O_EXCL: fails if the file already exists -> atomic cross-process lock.
    const fd = fs.openSync(LOCK_PATH, "wx");
    fs.writeSync(fd, String(process.pid));
    fs.closeSync(fd);
    return true;
  } catch (e) {
    if (e.code === "EEXIST") {
      const staleMs = Date.now() - fs.statSync(LOCK_PATH).mtimeMs;
      if (staleMs > 15 * 60 * 1000) {
        log("warn", "Removing stale lock older than 15 minutes", { staleMs });
        fs.rmSync(LOCK_PATH, { force: true });
        return acquireLock();
      }
      return false;
    }
    throw e;
  }
}

function releaseLock() {
  fs.rmSync(LOCK_PATH, { force: true });
}

// ---- Validation ----

function validateItem(item, manifest, state) {
  const issues = [];
  const articlePath = path.join(ROOT, item.articleFile);
  const imageSourcePath = path.join(ROOT, item.imageSourceFile);
  const imageWebpPath = path.join(ROOT, item.imageWebp);

  if (!fs.existsSync(articlePath)) issues.push(`Article file missing: ${item.articleFile}`);
  if (!fs.existsSync(imageSourcePath)) issues.push(`Source image missing: ${item.imageSourceFile}`);
  if (!fs.existsSync(imageWebpPath)) issues.push(`Converted WebP image missing: ${item.imageWebp} (run convert-images first)`);

  if (item.status === "needs_clarification") {
    issues.push(`BLOCKED: ${item.conflict || "manifest marks this item as needing clarification before publish"}`);
  }

  let parsed = null;
  if (fs.existsSync(articlePath)) {
    try {
      parsed = parseContentFile(articlePath);
    } catch (e) {
      issues.push(`Markdown parse error: ${e.message}`);
    }
  }

  if (parsed) {
    if (!parsed.h1) issues.push("No H1 found in public article body");
    const seoTitleLen = (parsed.brief["SEO title"] || "").length;
    const metaDescLen = (parsed.brief["Meta description"] || "").length;
    if (seoTitleLen === 0) issues.push("Missing SEO title in editorial brief");
    if (seoTitleLen > 60) issues.push(`SEO title is ${seoTitleLen} chars (recommended <=60)`);
    if (metaDescLen === 0) issues.push("Missing meta description in editorial brief");
    if (metaDescLen > 160) issues.push(`Meta description is ${metaDescLen} chars (recommended <=160)`);
    if (parsed.faqs.length < 3) issues.push(`Only ${parsed.faqs.length} FAQs found (expected 3-6)`);
    if (parsed.videoMentionsInBody.length > 0) issues.push(`Video-related terms found in PUBLIC article body: ${parsed.videoMentionsInBody.join(", ")}`);

    // Internal link resolution: every /apps/, /apk-guides/, /compare/, /categories/, /collections/, /app-safety/ link
    // must resolve to something already live OR an earlier-or-equal-day manifest item.
    const liveByPublishTime = manifest.items.filter((i) => new Date(i.publishAt) <= new Date(item.publishAt) && i.day !== item.day);
    for (const link of parsed.internalLinksInBody) {
      const targetManifestItem = manifest.items.find((i) => i.canonicalUrl.endsWith(link.href) || `${SITE_ORIGIN}${link.href}` === i.canonicalUrl.replace(/\/$/, "") + "/");
      if (targetManifestItem) {
        const isLiveByNow = liveByPublishTime.some((i) => i.day === targetManifestItem.day);
        if (!isLiveByNow && targetManifestItem.day !== item.day) {
          issues.push(`FORWARD REFERENCE: links to ${link.href} (Day ${targetManifestItem.day}, publishes ${targetManifestItem.publishAt}) which is not live yet at this item's publish time — dispatcher will omit this link at publish time`);
        }
      }
      // Links to routes outside this manifest (existing site routes like /categories/rummy/, /methodology/, /app-safety/)
      // are assumed already live per the architecture inspection; not re-verified here since that would require a live HTTP check.
    }
  }

  return { issues, parsed };
}

// ---- Dry run report ----

function runDryRun() {
  const manifest = loadJson(MANIFEST_PATH, null);
  const state = loadJson(STATE_PATH, { items: {} });
  if (!manifest) {
    log("error", "Manifest not found", { path: MANIFEST_PATH });
    process.exit(1);
  }
  const rows = [];
  let anyBlocking = false;
  for (const item of manifest.items) {
    const { issues, parsed } = validateItem(item, manifest, state);
    const blocking = issues.some((i) => i.startsWith("BLOCKED") || i.includes("missing") || i.includes("parse error"));
    if (blocking) anyBlocking = true;
    rows.push({
      day: item.day,
      articleFound: fs.existsSync(path.join(ROOT, item.articleFile)),
      imageFound: fs.existsSync(path.join(ROOT, item.imageWebp)),
      publishAt: item.publishAt,
      action: item.action,
      canonicalUrl: item.canonicalUrl,
      h1Count: parsed ? (parsed.h1 ? 1 : 0) : 0,
      faqCount: parsed ? parsed.faqs.length : 0,
      seoTitleLen: parsed ? (parsed.brief["SEO title"] || "").length : 0,
      metaDescLen: parsed ? (parsed.brief["Meta description"] || "").length : 0,
      videoClean: parsed ? parsed.videoMentionsInBody.length === 0 : false,
      checksum: fs.existsSync(path.join(ROOT, item.articleFile)) ? sha256(path.join(ROOT, item.articleFile)).slice(0, 12) : null,
      issues,
    });
  }
  saveJsonAtomic(path.join(ROOT, "scripts/content-pipeline/dry-run-report.json"), { generatedAt: nowIso(), rows });
  log("info", "Dry run complete", { itemCount: rows.length, anyBlocking });
  return { rows, anyBlocking };
}

// ---- Publish path (structurally complete; not executed by this session) ----

function buildSite() {
  execFileSync("npm", ["run", "build"], { cwd: ROOT, stdio: "inherit" });
}

function deploy() {
  execFileSync("pm2", ["restart", PM2_PROCESS_NAME], { stdio: "inherit" });
}

function verifyLive(url) {
  try {
    const out = execFileSync("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", url]).toString();
    return out.trim() === "200";
  } catch {
    return false;
  }
}

function publishItem(item, manifest, state) {
  const { issues } = validateItem(item, manifest, state);
  const blocking = issues.filter((i) => i.startsWith("BLOCKED") || i.includes("missing") || i.includes("parse error"));
  if (blocking.length) {
    log("error", `Day ${item.day} blocked, skipping`, { issues: blocking });
    return { ok: false, day: item.day, issues: blocking };
  }
  return { ok: true, day: item.day, checksum: sha256(path.join(ROOT, item.articleFile)) };
}

/**
 * true unless `href` is the canonical path of a manifest item that is not yet
 * published. Every other href (existing site routes, already-published items)
 * is treated as live. Re-evaluated fresh on every regeneration run, so a link
 * that was stripped for being forward-referencing reappears automatically the
 * moment its target's state flips to "published" — no patching required.
 */
function computeIsLive(manifest, state) {
  const unpublished = new Set(
    manifest.items
      .filter((item) => state.items[item.day]?.status !== "published" && state.items[item.day]?.status !== "pending_build")
      .map((item) => new URL(item.canonicalUrl).pathname)
  );
  return (href) => {
    const normalized = href.endsWith("/") ? href : `${href}/`;
    return !unpublished.has(normalized) && !unpublished.has(href);
  };
}

function webpPublicPath(item) {
  return "/" + path.relative(path.join(ROOT, "public"), path.join(ROOT, item.imageWebp)).split(path.sep).join("/");
}

function synthesizeChecklist(sections) {
  for (const s of sections) {
    if (s.bullets && s.bullets.length) {
      return s.bullets.slice(0, 6).map((b) => b.replace(/\*\*/g, "").split(/[.:]/)[0].trim()).filter(Boolean);
    }
  }
  return sections.slice(0, 6).map((s) => s.heading);
}

function buildAppArticle(item, parsed) {
  const dateStr = item.publishAt.slice(0, 10);
  return {
    image: webpPublicPath(item),
    imageAlt: `${parsed.h1} illustration`,
    directAnswer: parsed.directAnswer,
    sections: parsed.sections,
    faqs: parsed.faqs,
    datePublished: dateStr,
    dateModified: dateStr,
  };
}

function buildEditorialResourceUpdate(item, parsed, extra) {
  const dateStr = item.publishAt.slice(0, 10);
  return {
    slug: item.targetSlug,
    title: parsed.h1,
    summary: parsed.brief["Suggested excerpt"] || parsed.brief["Meta description"] || "",
    directAnswer: parsed.directAnswer,
    read: `${Math.max(3, Math.round(parsed.wordCount / 200))} min`,
    sections: parsed.sections,
    checklist: synthesizeChecklist(parsed.sections),
    faqs: parsed.faqs,
    image: webpPublicPath(item),
    imageAlt: `${parsed.h1} illustration`,
    datePublished: dateStr,
    dateModified: dateStr,
    ...extra,
  };
}

/**
 * Regenerates both app/generated/*.generated.ts files in full from the
 * ORIGINAL Markdown in Content/, for every item currently published (or
 * being published this run), filtered by the current link-liveness set.
 * Always a complete, deterministic rewrite — never a partial patch.
 */
function regenerateGeneratedFiles(manifest, state) {
  const isLive = computeIsLive(manifest, state);
  const publishedItems = manifest.items
    .filter((item) => ["published", "pending_build"].includes(state.items[item.day]?.status))
    .sort((a, b) => a.day - b.day);

  const generatedAppArticles = {};
  const generatedGuideArticles = {};
  const generatedGuideIndexEntries = [];
  const generatedComparisonUpdates = {};
  let guideCounter = 5; // hand-authored guides already occupy APK / 01-04

  for (const item of publishedItems) {
    const parsed = parseContentFile(path.join(ROOT, item.articleFile), { isLive });
    if (item.targetType === "app") {
      generatedAppArticles[item.targetSlug] = buildAppArticle(item, parsed);
    } else if (item.targetType === "guide") {
      const code = `APK / ${String(guideCounter++).padStart(2, "0")}`;
      generatedGuideArticles[item.targetSlug] = buildEditorialResourceUpdate(item, parsed, { code, eyebrow: "Independent verification guide" });
      generatedGuideIndexEntries.push({
        slug: item.targetSlug,
        number: code.split("/")[1].trim(),
        title: parsed.h1,
        summary: parsed.brief["Suggested excerpt"] || "",
        read: generatedGuideArticles[item.targetSlug].read,
      });
    } else if (item.targetType === "comparison") {
      const update = buildEditorialResourceUpdate(item, parsed, {});
      delete update.slug; // preserve the existing entry's slug/code/eyebrow/appSlugs/identityNotes
      generatedComparisonUpdates[item.targetSlug] = update;
    }
  }

  const genDir = path.join(ROOT, "app/generated");
  fs.mkdirSync(genDir, { recursive: true });
  fs.writeFileSync(
    path.join(genDir, "app-articles.generated.ts"),
    `// AUTO-GENERATED by scripts/content-pipeline/dispatcher.mjs — do not hand-edit.\n` +
      `// Regenerated in full on every publish run. Never partially patched.\n` +
      `import type { AppArticle } from "../app-content";\n\n` +
      `export const generatedAppArticles: Record<string, AppArticle> = ${JSON.stringify(generatedAppArticles, null, 2)};\n`
  );
  fs.writeFileSync(
    path.join(genDir, "resource-articles.generated.ts"),
    `// AUTO-GENERATED by scripts/content-pipeline/dispatcher.mjs — do not hand-edit.\n` +
      `// Regenerated in full on every publish run. Never partially patched.\n` +
      `import type { EditorialResource } from "../resource-content";\n\n` +
      `export type GuideIndexEntry = { slug: string; number: string; title: string; summary: string; read: string };\n\n` +
      `export const generatedGuideArticles: Record<string, EditorialResource> = ${JSON.stringify(generatedGuideArticles, null, 2)};\n\n` +
      `export const generatedGuideIndexEntries: GuideIndexEntry[] = ${JSON.stringify(generatedGuideIndexEntries, null, 2)};\n\n` +
      `export const generatedComparisonUpdates: Record<string, Partial<EditorialResource>> = ${JSON.stringify(generatedComparisonUpdates, null, 2)};\n`
  );

  log("info", "Regenerated content files", {
    apps: Object.keys(generatedAppArticles).length,
    guides: Object.keys(generatedGuideArticles).length,
    comparisons: Object.keys(generatedComparisonUpdates).length,
  });
}

export { regenerateGeneratedFiles, computeIsLive };

function runPublish() {
  if (!acquireLock()) {
    log("warn", "Another publisher run is already in progress, exiting");
    process.exit(0);
  }
  try {
    const manifest = loadJson(MANIFEST_PATH, null);
    const state = loadJson(STATE_PATH, { items: {} });
    if (!manifest) {
      log("error", "Manifest not found");
      process.exit(1);
    }
    const now = new Date();
    let due = manifest.items
      .filter((item) => state.items[item.day]?.status !== "published")
      .filter((item) => forceDay ? item.day === forceDay : new Date(item.publishAt) <= now)
      .sort((a, b) => a.day - b.day);

    if (!due.length) {
      log("info", "No items due, nothing to publish");
      return;
    }

    let anyFailed = false;
    let anyPublished = false;
    for (const item of due) {
      const result = publishItem(item, manifest, state);
      if (!result.ok) {
        anyFailed = true;
        state.items[item.day] = { ...(state.items[item.day] || {}), status: "blocked", lastAttempt: nowIso(), issues: result.issues };
        continue;
      }
      anyPublished = true;
      state.items[item.day] = {
        status: "pending_build", // becomes "published" only after build+deploy+verify succeed
        publishedAt: nowIso(),
        canonicalUrl: item.canonicalUrl,
        checksum: result.checksum,
      };
    }
    saveJsonAtomic(STATE_PATH, state);

    if (anyPublished) {
      // Regenerate from ALL currently-published-or-pending items (not just this
      // run's newly-due ones) so any deferred link whose target just went live
      // gets picked back up automatically.
      regenerateGeneratedFiles(manifest, state);
      log("info", "Building site...");
      buildSite();
      log("info", "Deploying (pm2 restart)...");
      deploy();
      for (const item of due) {
        if (state.items[item.day]?.status !== "pending_build") continue;
        const live = verifyLive(item.canonicalUrl);
        state.items[item.day].status = live ? "published" : "publish_failed_verification";
        state.items[item.day].verifiedAt = nowIso();
        if (!live) anyFailed = true;
      }
      saveJsonAtomic(STATE_PATH, state);
    }

    if (anyFailed) process.exit(1);
  } finally {
    releaseLock();
  }
}

// ---- Entry point ----

if (isDryRun) {
  const { rows, anyBlocking } = runDryRun();
  console.log(JSON.stringify(rows, null, 2));
  process.exit(anyBlocking ? 1 : 0);
} else {
  runPublish();
}
