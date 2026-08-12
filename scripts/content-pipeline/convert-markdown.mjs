// Converts a prepared Yono Play Store content Markdown file (editorial brief /
// public article / implementation notes, separated by `\n---\n`) into the
// structured shape consumed by app-content.ts / resource-content.ts.
//
// Usage as a module: import { parseContentFile } from "./convert-markdown.mjs"
// Usage as a CLI: node convert-markdown.mjs <path-to-md> [--json]

import fs from "node:fs";

function parseBriefFields(section) {
  const fields = {};
  const lineRe = /^-\s+\*\*(.+?):\*\*\s*(.+)$/gm;
  let m;
  while ((m = lineRe.exec(section))) {
    fields[m[1].trim()] = m[2].trim().replace(/^`|`$/g, "");
  }
  return fields;
}

function stripBold(text) {
  // Keep the markdown as-is; rendering applies mdInlineToHtml at render time.
  return text.trim();
}

/** Splits an H2 block's body into paragraphs vs. a single trailing bullet/numbered list. */
function splitParagraphsAndBullets(body) {
  const lines = body.split("\n").filter((l) => l.trim().length > 0);
  const paragraphs = [];
  const bullets = [];
  let inList = false;
  let paragraphBuf = [];

  function flushParagraph() {
    if (paragraphBuf.length) {
      paragraphs.push(stripBold(paragraphBuf.join(" ")));
      paragraphBuf = [];
    }
  }

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*]\s+(.*)$/) || line.match(/^\d+\.\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      inList = true;
      bullets.push(stripBold(bulletMatch[1]));
    } else {
      if (inList) {
        // A non-bullet line after a list starts a new paragraph block.
        inList = false;
      }
      paragraphBuf.push(line.trim());
    }
  }
  flushParagraph();
  return { paragraphs, bullets: bullets.length ? bullets : undefined };
}

function parseArticleBody(articleRaw) {
  const trimmed = articleRaw.trim();
  const h1Match = trimmed.match(/^# (.+)$/m);
  const h1 = h1Match ? h1Match[1].trim() : null;

  // Split into H2 blocks.
  const h2Re = /^## (.+)$/gm;
  const blocks = [];
  let match;
  const indices = [];
  while ((match = h2Re.exec(trimmed))) {
    indices.push({ heading: match[1].trim(), start: match.index, headingEnd: match.index + match[0].length });
  }
  for (let i = 0; i < indices.length; i++) {
    const end = i + 1 < indices.length ? indices[i + 1].start : trimmed.length;
    blocks.push({ heading: indices[i].heading, body: trimmed.slice(indices[i].headingEnd, end).trim() });
  }

  let directAnswer = null;
  let disclaimer = null;
  const faqs = [];
  const sections = [];

  for (const block of blocks) {
    if (/^direct answer$/i.test(block.heading)) {
      directAnswer = stripBold(block.body.split("\n\n")[0].replace(/\n/g, " "));
      continue;
    }
    if (/^frequently asked questions$/i.test(block.heading)) {
      const h3Re = /^### (.+)$/gm;
      const qIndices = [];
      let qm;
      while ((qm = h3Re.exec(block.body))) {
        qIndices.push({ q: qm[1].trim(), start: qm.index, headingEnd: qm.index + qm[0].length });
      }
      for (let i = 0; i < qIndices.length; i++) {
        const end = i + 1 < qIndices.length ? qIndices[i + 1].start : block.body.length;
        const answer = block.body.slice(qIndices[i].headingEnd, end).trim().replace(/\n+/g, " ");
        faqs.push([qIndices[i].q, stripBold(answer)]);
      }
      continue;
    }
    if (/^final takeaway$/i.test(block.heading)) {
      // Extract the **Disclaimer:** paragraph if present, keep the rest as a normal section.
      const disclaimerMatch = block.body.match(/\*\*Disclaimer:\*\*\s*([\s\S]+)$/);
      let body = block.body;
      if (disclaimerMatch) {
        disclaimer = stripBold(disclaimerMatch[1].trim());
        body = block.body.slice(0, disclaimerMatch.index).trim();
      }
      const { paragraphs, bullets } = splitParagraphsAndBullets(body);
      sections.push({ heading: block.heading, paragraphs, bullets });
      continue;
    }
    const { paragraphs, bullets } = splitParagraphsAndBullets(block.body);
    sections.push({ heading: block.heading, paragraphs, bullets });
  }

  return { h1, directAnswer, disclaimer, sections, faqs };
}

function extractInternalLinks(text) {
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let m;
  while ((m = linkRe.exec(text))) {
    links.push({ text: m[1], href: m[2] });
  }
  return links;
}

function extractVideoMentions(fullRaw) {
  const kws = ["video", "VideoObject", "transcript", "embed", "youtube", "vimeo", "thumbnail"];
  return kws.filter((kw) => new RegExp(`\\b${kw}\\b`, "i").test(fullRaw));
}

/**
 * Removes the markdown link wrapper around any internal link whose href is not
 * (yet) live, leaving the anchor text as plain prose. Re-run on every publish
 * against the ORIGINAL markdown, so a link that was stripped because its target
 * wasn't live yet automatically reappears once `isLive(href)` starts returning
 * true — no patching of previously-generated output required.
 */
function stripNonLiveLinks(articleRaw, isLive) {
  return articleRaw.replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, (full, text, href) => (isLive(href) ? full : text));
}

export function parseContentFile(filePath, options = {}) {
  const isLive = options.isLive || (() => true);
  const raw = fs.readFileSync(filePath, "utf-8");
  const parts = raw.split(/\n---\n/);
  if (parts.length !== 3) {
    throw new Error(`Expected 3 sections split by '---' in ${filePath}, found ${parts.length}`);
  }
  const [briefRaw, rawArticleRaw, notesRaw] = parts;
  const articleRaw = stripNonLiveLinks(rawArticleRaw, isLive);
  const brief = parseBriefFields(briefRaw);
  const parsedArticle = parseArticleBody(articleRaw);
  const internalLinksInBody = extractInternalLinks(rawArticleRaw).filter((l) => l.href.startsWith("/"));
  const omittedLinks = internalLinksInBody.filter((l) => !isLive(l.href));
  const videoMentionsInBody = extractVideoMentions(articleRaw);
  const wordCount = articleRaw.trim().split(/\s+/).length;

  return {
    file: filePath,
    brief,
    h1: parsedArticle.h1,
    directAnswer: parsedArticle.directAnswer,
    disclaimer: parsedArticle.disclaimer,
    sections: parsedArticle.sections,
    faqs: parsedArticle.faqs,
    internalLinksInBody,
    omittedLinks,
    videoMentionsInBody,
    wordCount,
    notesRaw,
  };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node convert-markdown.mjs <path-to-md>");
    process.exit(1);
  }
  const result = parseContentFile(filePath);
  console.log(JSON.stringify(result, null, 2));
}
