"use client";
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apps, categories, faqs, guides, safetyChecks, type AppRecord, type StatusKind } from "./catalog";
import { comparisonArticles, guideArticles, jaihoCollection, safetyArticles, type EditorialResource } from "./resource-content";
import { absoluteUrl, SITE_NAME, SITE_URL } from "./seo";

const organizationId = `${SITE_URL}/#organization`;
const organizationNode = {
  "@type": "Organization",
  "@id": organizationId,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: absoluteUrl("/yono-playstore-logo.png"), width: 512, height: 512 },
  description: "Independent, unofficial catalog of Yono-named Android gaming apps. It documents app identity, source status and safety checks, and does not host or distribute APK files.",
  disambiguatingDescription: "Not affiliated with Google Play, Google LLC, YONO SBI or State Bank of India.",
  sameAs: ["https://t.me/OfficialYonoPlaystore"],
};
const websiteId = `${SITE_URL}/#website`;
/** Date of the initial editorial review, used where a page has no article-level date. */
const BASE_REVIEW_DATE = "2026-08-12";

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const nav = [
  ["Home", "/"],
  ["Yono Apps", "/apps/"],
  ["Categories", "/categories/"],
  ["Guides & Compare", "/guides/"],
  ["App Safety", "/app-safety/"],
  ["Methodology", "/methodology/"],
  ["About", "/about/"],
];

const statusLabels: Record<StatusKind, string> = {
  confirmed: "Reviewed",
};

function AppIcon({ app, small = false }: { app: AppRecord; small?: boolean }) {
  return (
    <span className={`app-icon ${small ? "app-icon--small" : ""}`} style={{ "--app-accent": app.accent } as React.CSSProperties}>
      <img src={app.image} alt={`${app.name} app icon`} width="256" height="256" loading="lazy" />
    </span>
  );
}

function Status({ kind, children }: { kind: StatusKind; children?: React.ReactNode }) {
  return (
    <span className={`status status--${kind}`}>
      <i aria-hidden="true" />
      {children || statusLabels[kind]}
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Yono Play Store home">
        <img className="brand-logo" src="/yono-playstore-logo.webp" alt="Yono Play Store" width="296" height="120" />
      </a>
      <nav className={`main-nav ${open ? "main-nav--open" : ""}`} aria-label="Primary navigation">
        {nav.map(([label, href]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <a className="header-cta" href="/apps/">Browse apps <span>↗</span></a>
      <button className="menu-button" type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="brand brand--footer" href="/">
            <img className="brand-logo" src="/yono-playstore-logo.webp" alt="Yono Play Store" width="296" height="120" loading="lazy" />
          </a>
          <p>A reviewed registry of Yono app records, with source guidance for more informed installation decisions.</p>
          <span className="registry-code">REGISTRY / YPS–2026</span>
        </div>
        <div className="footer-links"><h3>Yono Play Store</h3><a href="/about/">About us</a><a href="/methodology/">Methodology</a><a href="/editorial-policy/">Editorial policy</a><a href="/corrections-policy/">Corrections</a><a href="/contact/">Contact us</a></div>
        <div className="footer-links"><h3>Explore</h3><a href="/apps/">All Yono apps</a><a href="/categories/">Categories</a><a href="/compare/">App comparisons</a><a href="/collections/">App collections</a></div>
        <div className="footer-links"><h3>Resources</h3><a href="/guides/">Guides & comparisons</a><a href="/apk-guides/">APK guides</a><a href="/app-safety/">App safety</a><a href="/sources/">Sources</a><a href="/faq/">FAQ</a></div>
        <div className="footer-links"><h3>Legal</h3><a href="/disclaimer/">Disclaimer</a><a href="/privacy-policy/">Privacy policy</a><a href="/terms-and-conditions/">Terms & conditions</a><a href="/affiliate-disclosure/">Affiliate disclosure</a><a href="/responsible-gaming/">Responsible gaming</a></div>
      </div>
      <div className="footer-disclaimer">
        <p><strong>Independent notice:</strong> YonoPlayStore.com is not affiliated with, endorsed by, sponsored by or associated with Google Play, Google LLC, YONO SBI or State Bank of India (SBI). Google Play, YONO SBI, product names, logos and trademarks belong to their respective owners.</p>
        <p><strong>Referral disclosure:</strong> Some Download buttons are referral links, and YonoPlayStore.com may receive a benefit when visitors register through them. Listed apps may involve real-money play and are intended for adults aged 18+ only where lawful. <a href="/affiliate-disclosure/">Read the disclosure</a>.</p>
        <span>© 2026 YonoPlayStore.com</span>
      </div>
    </footer>
  );
}

function SearchCatalog({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return apps.filter((app) => `${app.name} ${app.category} ${app.summary}`.toLowerCase().includes(q)).slice(0, 4);
  }, [query]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (matches[0]) window.location.href = `/apps/${matches[0].slug}/`;
    else if (query.trim()) window.location.href = `/apps/?q=${encodeURIComponent(query.trim())}`;
  }

  return (
    <div className={`search-wrap ${compact ? "search-wrap--compact" : ""}`}>
      <form className="search-box" role="search" onSubmit={submit}>
        <span className="search-glyph" aria-hidden="true" />
        <label className="sr-only" htmlFor={compact ? "catalog-search-compact" : "catalog-search"}>Search Yono apps</label>
        <input id={compact ? "catalog-search-compact" : "catalog-search"} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Yono apps…" autoComplete="off" />
        <button type="submit">Search <span>↗</span></button>
      </form>
      {query && (
        <div className="search-results" role="status" aria-live="polite">
          {matches.length ? matches.map((app) => (
            <a href={`/apps/${app.slug}/`} key={app.slug}>
              <AppIcon app={app} small />
              <span><b>{app.name}</b><small>{app.category}</small></span>
              <Status kind={app.statusKind} />
            </a>
          )) : <div className="empty-search"><b>No exact record found.</b><span>Browse the complete catalog or try a shorter app name.</span></div>}
        </div>
      )}
    </div>
  );
}

function AppCard({ app, featured = false }: { app: AppRecord; featured?: boolean }) {
  return (
    <article className={`app-card ${featured ? "app-card--featured" : ""}`}>
      <div className="card-index">APP/{app.mark}</div>
      <div className="app-card-head"><AppIcon app={app} /><span className="category-tag">{app.category}</span></div>
      <h3><a href={`/apps/${app.slug}/`}>{app.name}</a></h3>
      <p>{app.summary}</p>
      <div className="app-card-foot"><Status kind={app.statusKind} /><span className="card-open">Open record</span><a className="arrow-link" href={`/apps/${app.slug}/`} aria-label={`View ${app.name}`}>↗</a></div>
    </article>
  );
}

function SectionHead({ index, eyebrow, title, copy, link, linkLabel }: { index: string; eyebrow: string; title: string; copy?: string; link?: string; linkLabel?: string }) {
  return (
    <div className="section-head">
      <div><span className="section-index">{index}</span><p className="eyebrow">{eyebrow}</p></div>
      <div><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
      {link && <a href={link}>{linkLabel || "Explore"} <span>↗</span></a>}
    </div>
  );
}

function HomePage() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode,
      { "@type": "WebSite", "@id": websiteId, name: SITE_NAME, url: `${SITE_URL}/`, publisher: { "@id": organizationId }, inLanguage: "en-IN" },
      { "@type": "WebPage", "@id": `${SITE_URL}/#webpage`, url: `${SITE_URL}/`, name: "Yono Play Store – Yono Apps, Games and APK Guides", description: "Explore Yono apps, APK download information, source checks and Android installation guidance.", isPartOf: { "@id": websiteId }, about: { "@id": organizationId }, inLanguage: "en-IN" },
    ],
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={faqSchema} />
      <Header />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <div className="signal-label"><span /> Independent Yono app information</div>
            <h1>Explore Yono{" "}<br /><em>Apps & Games</em></h1>
            <p className="hero-lead">Find Yono gaming apps, review available download information, check source status, and learn what to verify before installing Android applications.</p>
            <SearchCatalog />
            <div className="hero-actions"><a className="button button--primary" href="/apps/">Browse Yono apps <span>↗</span></a><a className="button button--ghost" href="/guides/">Guides & comparisons</a></div>
            <p className="trust-line"><i /> All app records reviewed <b>•</b> Source guidance included <b>•</b> No fabricated ratings</p>
            <div className="hero-proof" aria-label="Catalog overview">
              <span><b>{apps.length}</b><small>App records</small></span>
              <span><b>{categories.length}</b><small>Categories</small></span>
              <span><b>Source-first</b><small>Editorial model</small></span>
            </div>
          </div>
          <div className="signal-panel" aria-label="Catalog signal preview">
            <div className="signal-panel-head"><span>LIVE CATALOG SIGNAL</span><span className="pulse"><i /> INDEX ACTIVE</span></div>
            <div className="signal-panel-grid">
              {apps.slice(0, 4).map((app, index) => (
                <a className="signal-app" href={`/apps/${app.slug}/`} key={app.slug}>
                  <span className="signal-no">0{index + 1}</span><AppIcon app={app} /><b>{app.name}</b><small>{app.category}</small><Status kind={app.statusKind} />
                </a>
              ))}
            </div>
            <div className="signal-panel-foot"><span>{String(apps.length).padStart(2, "0")} records indexed</span><span>{String(categories.length).padStart(2, "0")} categories</span><span>00 invented ratings</span></div>
          </div>
        </section>

        <section className="journey shell" aria-label="How to use this catalog">
          {[['01','Find the app','Search the registry'],['02','Check its status','Read the evidence label'],['03','Review the source','Decide what to do next']].map(([n,t,c]) => <div key={n}><span>{n}</span><b>{t}</b><small>{c}</small></div>)}
        </section>

        <section className="section shell" id="apps">
          <SectionHead index="01" eyebrow="Discovery index" title="Explore Yono Apps" copy="Every listing focuses on identity, category, available source information and a visible verification status." link="/apps/" linkLabel="View all apps" />
          <div className="app-grid">{apps.slice(0, 6).map((app, i) => <AppCard app={app} featured={i === 0} key={app.slug} />)}</div>
        </section>

        <section className="section section--ink">
          <div className="shell">
            <SectionHead index="02" eyebrow="Catalog routes" title="Find apps by category" copy="Browse only the categories supported by records in the catalog—never empty pages created for search engines." link="/categories/" linkLabel="All categories" />
            <div className="category-grid">{categories.slice(0, 4).map((category, index) => <a className="category-card" href={`/categories/${category.slug}/`} key={category.slug}><span>{category.code}</span><small>0{index + 1}</small><h3>{category.name}</h3><p>{category.description}</p><i>Explore category ↗</i></a>)}</div>
          </div>
        </section>

        <section className="section shell">
          <SectionHead index="03" eyebrow="Editorial desk" title="What we check before publishing" copy="A consistent methodology separates documented facts, platform statements and information that still needs verification." link="/methodology/" linkLabel="Read our methodology" />
          <div className="method-grid">
            {[
              ["ID", "App identity", "Names, branding and publisher signals help distinguish similarly named apps."],
              ["SRC", "Download source", "We inspect where a link leads rather than assuming it is official."],
              ["APK", "Technical data", "Version, package and file information appear only with a reliable source."],
              ["AVL", "Verification", "Every published app record receives the same completed catalog-review label."],
              ["CHG", "Material changes", "Meaningful source or identity changes should trigger another review."],
              ["FIX", "Corrections", "Clear correction routes keep the catalog accountable and updateable."],
            ].map(([code, title, copy]) => <article key={code}><span>{code}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </section>

        <section className="status-band">
          <div className="shell">
            <div className="status-intro"><span className="section-index">04</span><p className="eyebrow">Catalog standard</p><h2>Every record.{" "}<br />Reviewed.</h2><p>Each published game has completed the catalog review for identity, category, record quality and visitor guidance.</p></div>
            <div className="status-grid">
              <article><Status kind="confirmed" /><h3>Identity checked</h3><p>The app name and visual record have been reviewed for catalog inclusion.</p></article>
              <article><Status kind="confirmed" /><h3>Category checked</h3><p>Each game is placed in the catalog category that best matches its listing.</p></article>
              <article><Status kind="confirmed" /><h3>Record reviewed</h3><p>Required page information and visitor guidance have been checked.</p></article>
              <article><Status kind="confirmed" /><h3>Guidance included</h3><p>Every record includes source, APK, privacy and payment-check guidance.</p></article>
            </div>
          </div>
        </section>

        <section className="section shell">
          <SectionHead index="05" eyebrow="Editorial resource desk" title="Guides, comparisons & safety explainers" copy="Move from an app name to the exact source, Android and account questions that matter—without duplicating the individual app records." link="/guides/" linkLabel="Open the resource hub" />
          <div className="resource-path-grid">
            <a className="resource-path resource-path--lime" href="/apk-guides/"><span>APK / 04</span><h3>APK & Android</h3><p>Understand packages, installation sources, signing identity and permissions.</p><i>Browse four field guides ↗</i></a>
            <a className="resource-path resource-path--violet" href="/compare/"><span>CMP / 03</span><h3>App comparisons</h3><p>Separate similar Yono, Rummy and 777 names without merging their identities.</p><i>Compare exact records ↗</i></a>
            <a className="resource-path resource-path--amber" href="/app-safety/"><span>SAFE / 04</span><h3>Safety & privacy</h3><p>Review balances, reward terms, permissions, account data and payment warnings.</p><i>Use the safety library ↗</i></a>
            <a className="resource-path resource-path--mint" href="/collections/"><span>SET / 01</span><h3>App collections</h3><p>Navigate related naming families while keeping every app record distinct.</p><i>Explore collections ↗</i></a>
          </div>
        </section>

        <section className="section safety-section">
          <div className="shell safety-layout">
            <div className="safety-title"><span className="section-index">06</span><p className="eyebrow">Pre-install checklist</p><h2>Check before{" "}<br /><em>you install.</em></h2><p>An app name, logo or download button alone does not establish that a file comes from the intended publisher.</p><a className="button button--dark" href="/app-safety/">Read the safety guide <span>↗</span></a></div>
            <div className="safety-grid">{safetyChecks.map(([number,title,copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
          </div>
        </section>

        <section className="section shell">
          <SectionHead index="07" eyebrow="Common questions" title="Clear answers, before you click" copy="The catalog is designed to reduce assumptions—not add another layer of unsupported promises." />
          <div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>0{index + 1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="final-cta shell">
          <div><p className="eyebrow">Ready to search?</p><h2>Find the Yono app{" "}<br />you’re looking for.</h2></div>
          <div><p>Search the catalog, open the app record, and understand what is known before visiting an external source.</p><a className="button button--primary" href="/apps/">Browse all apps <span>↗</span></a><a href="/methodology/">How we verify apps</a></div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PageHero({ code, eyebrow, title, copy }: { code: string; eyebrow: string; title: string; copy: string }) {
  return <section className="page-hero shell" data-code={code}><div><span className="section-index">{code}</span><p className="eyebrow">{eyebrow}</p></div><div><h1>{title}</h1><p>{copy}</p></div></section>;
}

function Breadcrumb({ items }: { items: [string, string][] }) {
  const crumbs: [string, string][] = [["Home", "/"], ...items];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, href], index) => ({ "@type": "ListItem", position: index + 1, name, item: absoluteUrl(href) })),
  };
  return <><JsonLd data={schema} /><nav className="breadcrumb shell" aria-label="Breadcrumb"><a href="/">Home</a>{items.map(([label, href]) => <span key={href}>/<a href={href}>{label}</a></span>)}</nav></>;
}

function AppsExplorer({ initialCategory = "All" }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    const timer = window.setTimeout(() => {
      if (q) setQuery(q);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const filtered = apps.filter((app) => (category === "All" || app.category === category) && `${app.name} ${app.category} ${app.summary}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="catalog-explorer"><div className="catalog-tools"><label><span className="search-glyph" /><span className="sr-only">Search catalog</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the registry…" /></label><div className="filter-row">{["All", ...categories.map(c => c.name)].map((item) => <button className={category === item ? "active" : ""} type="button" key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="catalog-count"><span>{String(filtered.length).padStart(2,"0")} records</span><small>Showing {category.toLowerCase()} apps</small></div>{filtered.length ? <div className="app-grid">{filtered.map((app) => <AppCard app={app} key={app.slug} />)}</div> : <div className="catalog-empty"><b>No matching record.</b><p>Try a shorter app name or reset the category filter.</p><button onClick={() => {setQuery("");setCategory("All")}}>Clear filters</button></div>}</div>;
}

function AppsPage({ category }: { category?: string }) {
  const normalized = category ? category.charAt(0).toUpperCase() + category.slice(1) : "All";
  const title = category ? `${normalized} Yono Apps` : "All Yono Games & Apps List (2026)";
  const listedApps = category ? apps.filter((app) => app.category === normalized) : apps;
  const canonicalPath = category ? `/categories/${category}/` : "/apps/";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${absoluteUrl(canonicalPath)}#webpage`, url: absoluteUrl(canonicalPath), name: title, description: `Browse ${listedApps.length} ${category ? normalized.toLowerCase() : "documented"} Yono app records.`, isPartOf: { "@id": websiteId }, mainEntity: { "@id": `${absoluteUrl(canonicalPath)}#itemlist` } },
      { "@type": "ItemList", "@id": `${absoluteUrl(canonicalPath)}#itemlist`, numberOfItems: listedApps.length, itemListElement: listedApps.map((app, index) => ({ "@type": "ListItem", position: index + 1, name: app.name, url: absoluteUrl(`/apps/${app.slug}/`) })) },
    ],
  };
  return <><JsonLd data={schema} /><Header /><main><Breadcrumb items={category ? [["Categories","/categories/"],[normalized,`/categories/${category}/`]] : [["Yono Apps","/apps/"]]} /><PageHero code="A/01" eyebrow="Discovery index" title={title} copy={category ? "Search the app registry, filter by supported categories and open a record to review its identity, source status and available information." : `Every Yono game and app we review, in one list: ${apps.length} records across rummy, slots, arcade and spin. Open any record to check its download source, review date and safety guidance. Yono-named games are not connected to YONO SBI.`} /><section className="section shell section--catalog"><AppsExplorer initialCategory={category ? normalized : "All"} /></section></main><Footer /></>;
}

const categoryEditorial: Record<AppRecord["category"], {
  label: string;
  mechanics: string;
  payment: string;
  comparison: string;
}> = {
  Rummy: {
    label: "rummy and card-game listing",
    mechanics: "game format, table rules, entry conditions, opponent matching and whether promotional credits are separated from withdrawable balances",
    payment: "entry-fee, wallet, bonus, winnings or withdrawal",
    comparison: "rummy records",
  },
  Slots: {
    label: "slots-style game listing",
    mechanics: "reel rules, prize descriptions, credit values, result generation and whether displayed jackpots or rewards can be redeemed",
    payment: "credit, jackpot, reward, deposit or withdrawal",
    comparison: "slots records",
  },
  Arcade: {
    label: "arcade or multi-game listing",
    mechanics: "included game modes, scoring rules, paid-entry features, in-app balances and whether any displayed reward has monetary value",
    payment: "entry, balance, reward, deposit or withdrawal",
    comparison: "arcade records",
  },
  Spin: {
    label: "spin-style game listing",
    mechanics: "spin rules, result generation, coin or credit values, reward conditions and whether any displayed balance can be redeemed",
    payment: "spin-credit, reward, deposit, bonus or withdrawal",
    comparison: "spin records",
  },
  Other: {
    label: "gaming-app listing",
    mechanics: "available game modes, account features, paid participation, in-app balances and any claimed reward or redemption process",
    payment: "account balance, reward, deposit, bonus or withdrawal",
    comparison: "related game records",
  },
};

function slugifyHeading(heading: string): string {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Renders editorial prose that may contain `**bold**` and `[text](/url/)` markdown
 * as real HTML. Escapes HTML special characters first, so plain text (the vast
 * majority of existing content) renders identically to before this was introduced.
 */
function mdInlineToHtml(text: string): string {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => `<a href="${href}">${label}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** Parses a newline-separated Markdown table ("| a | b |" rows); returns null for ordinary text. */
function parseMdTable(text: string): { head: string[]; rows: string[][] } | null {
  const lines = text.split("\n").map((line) => line.trim());
  if (lines.length < 2 || !lines.every((line) => line.startsWith("|"))) return null;
  const cells = (line: string) => line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
  const isDivider = (line: string) => /^\|?(\s*:?-{2,}:?\s*\|)+\s*:?-{2,}:?\s*\|?$|^\|?\s*:?-{2,}:?\s*\|?$/.test(line);
  const [head, ...rest] = lines;
  return { head: cells(head), rows: rest.filter((line) => !isDivider(line)).map(cells) };
}

function Prose({ text, className }: { text: string; className?: string }) {
  const table = parseMdTable(text);
  if (table) {
    return (
      <div className="md-table-wrap">
        <table className="md-table">
          <thead><tr>{table.head.map((cell, i) => <th key={i} dangerouslySetInnerHTML={{ __html: mdInlineToHtml(cell) }} />)}</tr></thead>
          <tbody>{table.rows.map((row, r) => <tr key={r}>{row.map((cell, i) => <td key={i} data-label={table.head[i]} dangerouslySetInnerHTML={{ __html: mdInlineToHtml(cell) }} />)}</tr>)}</tbody>
        </table>
      </div>
    );
  }
  return <p className={className} dangerouslySetInnerHTML={{ __html: mdInlineToHtml(text) }} />;
}

function AppDetail({ app }: { app: AppRecord }) {
  const profile = categoryEditorial[app.category];
  const related = apps.filter((candidate) => candidate.slug !== app.slug && candidate.category === app.category).slice(0, 4);
  const comparison = comparisonArticles.find((article) => article.appSlugs.includes(app.slug));
  const article = app.editorial.article;
  const appFaqs: [string, string][] = article?.faqs ?? [
    [`What is ${app.name}?`, app.editorial.directAnswer],
    [`What does "Reviewed" mean for ${app.name}?`, `It means this ${app.name} page has completed the catalog review for identity, category, record quality and visitor guidance. ${app.editorial.takeaway}`],
    [`Where can I download the ${app.name} APK?`, app.downloadUrl
      ? `Use the Download APK button near the top of this page to open the external source supplied for ${app.name}. Confirm the final destination, publisher relationship and current file details before obtaining or installing any file.`
      : `A direct external source has not been added to this ${app.name} record. Use the APK information section to understand the checks to complete before obtaining or installing a file.`],
    [`What should I check before installing ${app.name}?`, app.editorial.apkFocus],
    [`What should I know about ${app.name} accounts and payments?`, `${app.editorial.accountFocus} ${app.editorial.paymentFocus}`],
  ];
  const toc = article
    ? [...article.sections.map((s) => [slugifyHeading(s.heading), s.heading] as [string, string]), ["faq", "FAQ"] as [string, string]]
    : ([["overview", "Plain-language overview"], ["operator", "Operator & source"], ["apk", "APK & permissions"], ["privacy", "Login & privacy"], ["payments", "Payments & rewards"], ["legal", "Legal context"], ["warnings", "Warning signs"], ["faq", "FAQ"]] as [string, string][]);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${absoluteUrl(`/apps/${app.slug}/`)}#webpage`, url: absoluteUrl(`/apps/${app.slug}/`), name: app.editorial.seoTitle, description: app.editorial.seoDescription, isPartOf: { "@id": websiteId }, about: { "@id": `${absoluteUrl(`/apps/${app.slug}/`)}#app` }, primaryImageOfPage: { "@id": `${absoluteUrl(`/apps/${app.slug}/`)}#image` }, inLanguage: "en-IN", ...(article ? { datePublished: article.datePublished, dateModified: article.dateModified } : {}) },
      { "@type": "SoftwareApplication", "@id": `${absoluteUrl(`/apps/${app.slug}/`)}#app`, name: app.name, applicationCategory: "GameApplication", operatingSystem: "Android", description: app.summary, image: { "@id": `${absoluteUrl(`/apps/${app.slug}/`)}#image` } },
      { "@type": "ImageObject", "@id": `${absoluteUrl(`/apps/${app.slug}/`)}#image`, url: absoluteUrl(app.image), contentUrl: absoluteUrl(app.image), caption: `${app.name} app icon` },
      { "@type": "FAQPage", "@id": `${absoluteUrl(`/apps/${app.slug}/`)}#faq`, isPartOf: { "@id": `${absoluteUrl(`/apps/${app.slug}/`)}#webpage` }, mainEntity: appFaqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <Header />
      <main>
        <Breadcrumb items={[["Yono Apps", "/apps/"], [app.name, `/apps/${app.slug}/`]]} />
        <section className="record-hero shell">
          <div className="record-identity">
            <AppIcon app={app} />
            <div>
              <p className="eyebrow">Independent app record</p>
              <h1>{app.editorial.seoTitle}</h1>
              <p>{app.editorial.hero}</p>
              <div className="record-actions">
                <a
                  className="record-download"
                  href={app.downloadUrl || "#apk"}
                  target={app.downloadUrl ? "_blank" : undefined}
                  rel={app.downloadUrl ? "nofollow sponsored noopener noreferrer" : undefined}
                  aria-label={app.downloadUrl ? `Open the external ${app.name} APK download source` : `Review ${app.name} APK information`}
                >
                  <span>{app.downloadUrl ? "Download APK" : "Review APK information"}</span><i>{app.downloadUrl ? "↗" : "↓"}</i>
                </a>
                <small>{app.downloadUrl ? "External source — verify the destination and file before installing." : "No external source supplied — review the APK checks below."}</small>
                {app.downloadUrl && <small className="record-disclosure"><b>18+ only.</b> This is a referral link: we may receive a benefit if you register. Real-money gaming may be restricted or prohibited where you live. <a href="/affiliate-disclosure/">Disclosure</a> · <a href="/responsible-gaming/">Responsible gaming</a></small>}
              </div>
            </div>
          </div>
          <div className="record-signal">
            <div className="record-signal-head"><span>INFORMATION STATUS</span><b>LIVE RECORD</b></div>
            <Status kind={app.statusKind}>{app.status}</Status>
            <div className="record-signal-meter" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <small>{app.reviewed}</small>
          </div>
        </section>

        <section className="record-layout shell">
          <article className="record-main">
            <div className="quick-answer">
              <span>DIRECT ANSWER</span>
              <Prose text={article?.directAnswer ?? app.editorial.directAnswer} />
              {!article && <p>{app.editorial.localContext}</p>}
            </div>

            {article && (
              <div className="record-featured-image">
                <img src={article.image} alt={article.imageAlt} width="1200" height="675" loading="lazy" />
              </div>
            )}

            {!article && (
              <section className="record-content-section record-content-section--overview" id="overview">
                <span className="content-code">OVERVIEW / 00</span>
                <h2>What is {app.name}?</h2>
                <p>{app.summary}</p>
                <p>This independent record brings the app name, catalog category, Android checks and user questions into one readable page. Facts that cannot be supported by a current source are left unclaimed rather than estimated.</p>
              </section>
            )}

            <h2>App information</h2>
            <div className="fact-table">
              <div><span>Application name</span><b>{app.name}</b></div>
              <div><span>Catalog category</span><b>{app.category}</b></div>
              <div><span>Record status</span><b>Editorially reviewed</b></div>
              <div><span>Download source</span><b>{app.downloadUrl ? new URL(app.downloadUrl).hostname : "Not supplied"}</b></div>
              <div><span>What this review covers</span><b>Page identity, category and guidance — not the APK, operator or payments</b></div>
              <div><span>Last reviewed</span><b>{app.reviewed}</b></div>
            </div>

            <h2>Verification summary</h2>
            <div className="verification-table" role="table" aria-label={`${app.name} verification summary`}>
              <div className="verification-row verification-row--head" role="row"><span role="columnheader">Item reviewed</span><span role="columnheader">Status</span><span role="columnheader">Catalog finding</span></div>
              <div className="verification-row" role="row"><b role="cell">App identity</b><Status kind="confirmed" /><p role="cell">Name, icon and listing identity reviewed for catalog inclusion.</p></div>
              <div className="verification-row" role="row"><b role="cell">Catalog category</b><Status kind="confirmed" /><p role="cell">The record has been checked against the supported catalog categories.</p></div>
              <div className="verification-row" role="row"><b role="cell">Record quality</b><Status kind="confirmed" /><p role="cell">Required app information and editorial sections are present.</p></div>
              <div className="verification-row" role="row"><b role="cell">Source guidance</b><Status kind="confirmed" /><p role="cell">Current-source and publisher checks are included for visitors.</p></div>
              <div className="verification-row" role="row"><b role="cell">Safety guidance</b><Status kind="confirmed" /><p role="cell">APK, permission, privacy and payment checks are included.</p></div>
            </div>

            {related.length > 0 && (
              <section className="record-comparisons" aria-labelledby="compared-title">
                <div className="record-subhead"><span>COMPARE / 04</span><h2 id="compared-title">Platforms commonly compared with {app.name}</h2></div>
                {comparison && <a className="comparison-bridge" href={`/compare/${comparison.slug}/`}><span><small>DEDICATED COMPARISON</small><b>{comparison.title}</b></span><i>Read the differences ↗</i></a>}
                <div className="comparison-grid">
                  {related.map((item) => <a href={`/apps/${item.slug}/`} key={item.slug}><AppIcon app={item} small /><span><b>{item.name}</b><small>{item.category} record</small></span><i>↗</i></a>)}
                </div>
              </section>
            )}

            {article ? (
              article.sections.map((section, index) => (
                <section className="record-content-section" id={slugifyHeading(section.heading)} key={section.heading}>
                  <span className="content-code">CHECK / {String(index + 1).padStart(2, "0")}</span>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <Prose text={paragraph} key={paragraph} />)}
                  {section.bullets && <ul className="content-list">{section.bullets.map((item) => <li key={item} dangerouslySetInnerHTML={{ __html: mdInlineToHtml(item) }} />)}</ul>}
                </section>
              ))
            ) : (
              <>
                <section className="record-content-section" id="operator">
                  <span className="content-code">CHECK / 01</span>
                  <h2>{app.name} operator and source checks</h2>
                  <p>{app.editorial.identityFocus}</p>
                  <p>For this {profile.label}, the most useful source trail connects the same operator name, domain, privacy policy, support address and Android identity. A polished page or social profile cannot replace that connection.</p>
                  <p>Before relying on a listing, compare the following details across its website, privacy policy, terms and support channels:</p>
                  <ul className="content-list"><li>Legal business or developer name</li><li>Physical business address and jurisdiction</li><li>Support email using the same domain</li><li>Privacy policy, terms and complaint route</li><li>Clear identification of who handles account and payment data</li></ul>
                  <p className="stop-note">Stop if important identity details are missing, contradictory or tied to unrelated domains.</p>
                </section>

                <section className="record-content-section" id="apk">
                  <span className="content-code">CHECK / 02</span>
                  <h2>{app.name} APK, version and permission checks</h2>
                  <p>An APK is an Android installation file. Websites, shortened links, cloud folders and private messages can distribute APK files outside recognized app stores.</p>
                  <p>{app.editorial.apkFocus}</p>
                  <p>Before opening an unfamiliar APK, check:</p>
                  <ul className="content-list"><li>Whether the publisher identifies a real developer or business</li><li>Whether the website domain and support email match</li><li>Whether Android asks you to disable important device protections</li><li>Whether each permission fits the app’s stated purpose</li><li>Whether it requests contacts, SMS, accessibility, screen control or device administration without a clear reason</li></ul>
                  <div className="source-warning"><b>A scan is not proof of identity</b><p>A clean file scan may fail to detect a new threat and cannot establish who published the file, whether it was modified, or whether the service behind it is lawful.</p></div>
                </section>

                <section className="record-content-section" id="privacy">
                  <span className="content-code">CHECK / 03</span>
                  <h2>{app.name} login, OTP and privacy checks</h2>
                  <p>{app.editorial.accountFocus}</p>
                  <p>The policy should explain what data is collected, why it is needed, how long it is retained, whether it is shared, how correction or deletion can be requested, and where a complaint can be raised.</p>
                  <p className="stop-note">Never share an OTP, UPI PIN, card PIN, device lock code or remote access to your phone. A support message, caller ID or screenshot is not independent proof of identity.</p>
                </section>

                <section className="record-content-section" id="payments">
                  <span className="content-code">CHECK / 04</span>
                  <h2>{app.name} payment, reward and withdrawal claims</h2>
                  <p>{app.editorial.paymentFocus}</p>
                  <p>For this {profile.label}, written terms should explain the {profile.mechanics}. The named payment recipient should also match the documented operator, and the terms should state refund limits, restrictions and the complaint process.</p>
                  <p>Do not make an additional payment merely because someone says it will release a balance, reward, account or pending withdrawal. If a transfer appears deceptive or unauthorized, preserve the URL, messages and transaction details, then contact the relevant bank or payment provider and an official cybercrime-reporting channel.</p>
                </section>

                <section className="record-content-section" id="legal">
                  <span className="content-code">CHECK / 05</span>
                  <h2>{app.name} and the legal context</h2>
                  <p>{app.editorial.localContext}</p>
                  <p>Because those product-specific facts are not confirmed here, Yono Play Store does not classify {app.name} as lawful, licensed or prohibited. Users should consult current official guidance and obtain qualified advice when a legal determination matters.</p>
                </section>

                <section className="record-content-section" id="warnings">
                  <span className="content-code">CHECK / 06</span>
                  <h2>Warning signs that justify stopping</h2>
                  <p>Pause before installing, registering, sharing data or making a payment if:</p>
                  <ul className="warning-grid"><li>The website, support email and payment recipient do not match.</li><li>No identifiable operator or business address is shown.</li><li>An APK asks you to disable device protections.</li><li>Sensitive permissions are requested without a clear reason.</li><li>A message pressures you to act quickly or privately.</li><li>Someone asks for an OTP, UPI PIN or remote phone access.</li><li>Another payment is demanded to unlock money or an account.</li><li>No privacy policy, written terms or complaint route is available.</li></ul>
                </section>
              </>
            )}

            <section className="record-content-section" id="faq">
              <span className="content-code">ANSWERS / 05</span>
              <h2>Frequently asked questions</h2>
              <div className="faq-list faq-list--record">
                {appFaqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<i>+</i></summary><Prose text={answer} /></details>)}
              </div>
            </section>

            <section className="record-takeaway">
              <span>FINAL TAKEAWAY</span>
              <h2>{app.name}: what matters most</h2>
              <p>{app.editorial.takeaway}</p>
              <div><a href="/methodology/">Read our methodology ↗</a><a href="/app-safety/">Open the safety checklist ↗</a></div>
            </section>

            <p className="record-disclaimer"><b>Disclaimer:</b> This page is provided for general app-information and verification purposes. Download buttons may open third-party sources; Yono Play Store does not host, inspect or endorse the APK delivered by an external website. This record does not confirm the legality, security, ownership or payment capability of {app.name} and is not legal or financial advice.</p>
          </article>

          <aside className="record-aside">
            <div className="aside-card">
              <span>RECORD SNAPSHOT</span>
              <Status kind={app.statusKind} />
              <dl><div><dt>Category</dt><dd>{app.category}</dd></div><div><dt>Record</dt><dd>Reviewed</dd></div><div><dt>Review date</dt><dd>{app.editorial.article?.dateModified ?? BASE_REVIEW_DATE}</dd></div><div><dt>Guidance</dt><dd>Included</dd></div></dl>
            </div>
            <nav className="record-toc" aria-label="On this page">
              <b>ON THIS PAGE</b>
              {toc.map(([id, label], index) => <a href={`#${id}`} key={id}><span>{String(index).padStart(2, "0")}</span>{label}</a>)}
            </nav>
            <div className="aside-note"><b>Before you install</b><p>{app.editorial.takeaway}</p><a href="/app-safety/">Open safety checklist ↗</a></div>
          </aside>
        </section>

        {related.length > 0 && <section className="section shell"><SectionHead index="REL" eyebrow="Catalog connections" title={`More ${profile.comparison}`} /><div className="app-grid">{related.map((item) => <AppCard app={item} key={item.slug} />)}</div></section>}
      </main>
      <Footer />
    </>
  );
}

function CategoriesPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${absoluteUrl("/categories/")}#webpage`, url: absoluteUrl("/categories/"), name: "Yono App Categories", description: "Browse Yono app records by supported game category.", isPartOf: { "@id": websiteId }, mainEntity: { "@type": "ItemList", numberOfItems: categories.length, itemListElement: categories.map((category,index) => ({ "@type": "ListItem", position: index + 1, name: `${category.name} Yono Apps`, url: absoluteUrl(`/categories/${category.slug}/`) })) } };
  return <><JsonLd data={schema} /><Header /><main><Breadcrumb items={[["Categories","/categories/"]]} /><PageHero code="C/01" eyebrow="Catalog routes" title="Browse Yono Apps by Category" copy="Use supported categories to narrow the registry. Each route exists because current catalog records support it." /><section className="section shell"><div className="category-grid category-grid--light">{categories.map((category,index) => <a className="category-card" href={`/categories/${category.slug}/`} key={category.slug}><span>{category.code}</span><small>0{index+1}</small><h2>{category.name}</h2><p>{category.description}</p><i>{apps.filter(a=>a.category===category.name).length} records ↗</i></a>)}</div></section></main><Footer /></>;
}

function ResourceCard({ code, label, title, summary, href, tone = "plain" }: { code: string; label: string; title: string; summary: string; href: string; tone?: "plain" | "lime" | "violet" | "amber" | "mint" }) {
  return <a className={`resource-card resource-card--${tone}`} href={href}><span>{code}</span><small>{label}</small><h2>{title}</h2><p>{summary}</p><i>Read resource ↗</i></a>;
}

function ResourceHub() {
  const total = guides.length + comparisonArticles.length + safetyArticles.length + 1;
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${absoluteUrl("/guides/")}#webpage`, url: absoluteUrl("/guides/"), name: "Yono App Guides and Comparisons", description: "APK, Android, app-comparison, privacy, balance and source-verification resources.", isPartOf: { "@id": websiteId } };
  return <><JsonLd data={schema} /><Header /><main><Breadcrumb items={[["Guides & Comparisons","/guides/"]]} /><section className="resource-hero shell"><div><span className="section-index">DESK / 01</span><p className="eyebrow">Editorial resource desk</p><h1>Understand the app.{" "}<br/><em>Then decide.</em></h1><p>Use task-focused APK guides, exact-name comparisons, safety explainers and app-family maps. Every resource answers a different question and links back to the canonical app records.</p><div className="resource-hero-actions"><a className="button button--primary" href="#library">Browse {total} resources <span>↓</span></a><a className="button button--ghost" href="/apps/">Find an app record</a></div></div><div className="resource-scoreboard" aria-label="Resource library summary"><div><span>{String(guides.length).padStart(2,"0")}</span><b>APK guides</b><small>Files, sources and Android</small></div><div><span>{String(comparisonArticles.length).padStart(2,"0")}</span><b>Comparisons</b><small>Similar names, separate records</small></div><div><span>{String(safetyArticles.length + 1).padStart(2,"0")}</span><b>Safety resources</b><small>Privacy, balances and rewards</small></div><div><span>01</span><b>App collection</b><small>Related names, clear boundaries</small></div></div></section><section className="section shell" id="library"><SectionHead index="01" eyebrow="Choose by question" title="Four routes through the resource library" copy="Start with the task you need to complete. The app catalog remains the canonical source for exact app-name searches."/><div className="resource-path-grid"><a className="resource-path resource-path--lime" href="/apk-guides/"><span>APK / 04</span><h3>APK & Android</h3><p>What a file is, how installation works, how to inspect its source and which permissions require explanation.</p><i>Open APK guides ↗</i></a><a className="resource-path resource-path--violet" href="/compare/"><span>CMP / 03</span><h3>App comparisons</h3><p>Separate similar Rummy, Yono and 777 records using names, sources and Android identity.</p><i>Open comparisons ↗</i></a><a className="resource-path resource-path--amber" href="/app-safety/"><span>SAFE / 04</span><h3>Safety & privacy</h3><p>Understand account data, balance labels, reward language and warning signs before acting.</p><i>Open safety resources ↗</i></a><a className="resource-path resource-path--mint" href="/collections/"><span>SET / 01</span><h3>App collections</h3><p>Navigate a shared naming family without assuming every record has the same operator or account.</p><i>Open collections ↗</i></a></div></section><section className="section section--ink"><div className="shell"><SectionHead index="02" eyebrow="How the library works" title="One query. One clear destination."/><div className="resource-method"><article><span>01</span><h3>Entity query</h3><p>Searches such as “Yono Rummy” go to the individual app record—not a duplicate article.</p></article><article><span>02</span><h3>Comparison query</h3><p>A “versus” page exists only when a visitor needs to distinguish several records.</p></article><article><span>03</span><h3>Safety question</h3><p>A focused guide explains the method and then links to the app where it should be applied.</p></article></div></div></section></main><Footer /></>;
}

function GuidesPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${absoluteUrl("/apk-guides/")}#webpage`, url: absoluteUrl("/apk-guides/"), name: "Yono APK and Android Installation Guides", description: "Practical guidance for understanding APK files, sources, installation and Android permissions.", isPartOf: { "@id": websiteId }, mainEntity: { "@type": "ItemList", numberOfItems: guides.length, itemListElement: guides.map((guide,index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: absoluteUrl(`/apk-guides/${guide.slug}/`) })) } };
  return <><JsonLd data={schema} /><Header /><main><Breadcrumb items={[["Guides & Comparisons","/guides/"],["APK Guides","/apk-guides/"]]} /><PageHero code="APK / 00" eyebrow="Android field notes" title="APK & Android Guides" copy="Four distinct guides: understand the file, install deliberately, trace the source and review permission requests." /><section className="section shell"><div className="resource-card-grid">{guides.map((guide,index)=><ResourceCard code={`0${index+1}`} label={guide.read} title={guide.title} summary={guide.summary} href={`/apk-guides/${guide.slug}/`} tone={index===0?"lime":"plain"} key={guide.slug}/>)}</div><div className="resource-next"><span>NEED THE APP?</span><div><h2>Apply the guide to a specific record.</h2><p>Search the catalog after learning the method. Each app page keeps its identity and source questions in one canonical place.</p></div><a className="button button--dark" href="/apps/">Browse app records ↗</a></div></section></main><Footer /></>;
}

function EditorialArticlePage({ resource, basePath, sectionLabel }: { resource: EditorialResource; basePath: string; sectionLabel: string }) {
  const articleUrl = absoluteUrl(`${basePath}${resource.slug}/`);
  const schema = { "@context": "https://schema.org", "@graph": [organizationNode, { "@type": "WebPage", "@id": `${articleUrl}#webpage`, url: articleUrl, name: resource.title, isPartOf: { "@id": websiteId }, inLanguage: "en-IN" }, { "@type": "Article", "@id": `${articleUrl}#article`, mainEntityOfPage: { "@id": `${articleUrl}#webpage` }, headline: resource.title, description: resource.summary, url: articleUrl, datePublished: resource.datePublished ?? BASE_REVIEW_DATE, dateModified: resource.dateModified ?? resource.datePublished ?? BASE_REVIEW_DATE, image: absoluteUrl(resource.image ?? "/yono-playstore-logo.png"), author: { "@id": organizationId }, publisher: { "@id": organizationId }, isPartOf: { "@id": websiteId }, inLanguage: "en-IN" }, { "@type": "FAQPage", "@id": `${articleUrl}#faq`, mainEntity: resource.faqs.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}})) }] };
  return <><JsonLd data={schema} /><Header /><main><Breadcrumb items={[["Guides & Comparisons","/guides/"],[sectionLabel,basePath],[resource.title,`${basePath}${resource.slug}/`]]} /><article className="article article--resource shell"><header><span className="section-index">{resource.code}</span><p className="eyebrow">{resource.eyebrow}</p><h1>{resource.title}</h1><p>{resource.summary}</p><div><span>{resource.read} read</span><span>Independent guidance</span><span>Reviewed 12 Aug 2026</span></div></header>{resource.image && <div className="article-featured-image"><img src={resource.image} alt={resource.imageAlt || resource.title} width="1200" height="675" loading="lazy" /></div>}<div className="article-layout"><div className="article-body"><div className="article-direct"><span>DIRECT ANSWER</span><Prose text={resource.directAnswer} /></div>{resource.sections.map((section,index)=><section className="editorial-section" key={section.heading}><span>0{index+1}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph)=><Prose text={paragraph} key={paragraph} />)}{section.bullets&&<ul className="content-list content-list--article">{section.bullets.map((item)=><li key={item} dangerouslySetInnerHTML={{__html: mdInlineToHtml(item)}} />)}</ul>}</section>)}<section className="editorial-section" id="faq"><span>FAQ</span><h2>Questions people ask</h2><div className="faq-list faq-list--record">{resource.faqs.map(([question,answer],index)=><details key={question} open={index===0}><summary>{question}<i>+</i></summary><Prose text={answer} /></details>)}</div></section><div className="article-disclosure"><b>Scope of this resource</b><p>This guide explains a verification method. It does not certify every APK, publisher, account, reward, payment or legal status. Apply the checks to the current app and source.</p></div></div><aside className="article-aside article-aside--resource"><b>FIELD CHECK</b>{resource.checklist.map((item)=><span key={item}>{item}</span>)}<a href="/apps/">Open an app record ↗</a><a href="/guides/">All resources ↗</a></aside></div></article></main><Footer /></>;
}

function GuideArticle({ slug }: { slug: string }) {
  const resource = guideArticles[slug];
  return resource ? <EditorialArticlePage resource={resource} basePath="/apk-guides/" sectionLabel="APK Guides"/> : <NotFoundPage/>;
}

function SafetyPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${absoluteUrl("/app-safety/")}#webpage`, url: absoluteUrl("/app-safety/"), name: "Yono App Safety and Privacy Resources", description: "A practical checklist plus focused guides to permissions, balances, reward terms, account privacy and source checks.", isPartOf: { "@id": websiteId } };
  return <><JsonLd data={schema}/><Header /><main><Breadcrumb items={[["Guides & Comparisons","/guides/"],["App Safety","/app-safety/"]]} /><PageHero code="SAFE / 00" eyebrow="Decision checklist" title="App Safety, Privacy & Payment Terms" copy="Begin with six stop-or-continue checks, then use a focused explainer for balances, spin rewards or account privacy." /><section className="section shell"><SectionHead index="01" eyebrow="Before you act" title="The six-point safety check"/><div className="safety-grid safety-grid--page">{safetyChecks.map(([n,t,c])=><article key={n}><span>{n}</span><h2>{t}</h2><p>{c}</p></article>)}</div><div className="source-warning source-warning--wide"><b>No blanket safety guarantees</b><p>Safety depends on the specific application, publisher, source, file and permissions. This catalog provides evidence labels and verification guidance rather than a universal “safe” badge.</p></div></section><section className="section section--ink"><div className="shell"><SectionHead index="02" eyebrow="Focused explainers" title="Go deeper on the decision in front of you"/><div className="resource-card-grid">{safetyArticles.map((article,index)=><ResourceCard code={`0${index+1}`} label={article.read} title={article.title} summary={article.summary} href={`/app-safety/${article.slug}/`} tone={index===0?"amber":"plain"} key={article.slug}/>)}</div></div></section></main><Footer /></>;
}

function SafetyArticle({ slug }: { slug: string }) {
  const resource = safetyArticles.find((article)=>article.slug===slug);
  return resource ? <EditorialArticlePage resource={resource} basePath="/app-safety/" sectionLabel="App Safety"/> : <NotFoundPage/>;
}

function ComparisonsPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${absoluteUrl("/compare/")}#webpage`, url: absoluteUrl("/compare/"), name: "Yono App Comparisons", description: "Compare similarly named Yono, rummy and 777 app records without merging their source, package or operator identities.", isPartOf: { "@id": websiteId } };
  return <><JsonLd data={schema}/><Header/><main><Breadcrumb items={[["Guides & Comparisons","/guides/"],["App Comparisons","/compare/"]]} /><PageHero code="CMP / 00" eyebrow="Exact-name comparisons" title="Compare Similar App Names" copy="These pages answer a real comparison question. Exact app-name searches still belong to the individual app records."/><section className="section shell"><div className="resource-card-grid">{comparisonArticles.map((article,index)=><ResourceCard code={`0${index+1}`} label={article.read} title={article.title} summary={article.summary} href={`/compare/${article.slug}/`} tone={index===0?"violet":"plain"} key={article.slug}/>)}</div><div className="resource-principle"><span>COMPARISON RULE</span><h2>A shared word, number or category is not a shared identity.</h2><p>Every comparison starts with the complete app name and ends at the individual record. Operator, APK, account and payment claims stay attached to the exact source that supports them.</p></div></section></main><Footer/></>;
}

function ComparisonArticle({ slug }: { slug: string }) {
  const comparison = comparisonArticles.find((article)=>article.slug===slug);
  if (!comparison) return <NotFoundPage/>;
  const comparedApps = comparison.appSlugs.map((appSlug)=>apps.find((app)=>app.slug===appSlug)).filter((app): app is AppRecord=>Boolean(app));
  const articleUrl = absoluteUrl(`/compare/${comparison.slug}/`);
  const schema = { "@context": "https://schema.org", "@graph": [organizationNode, { "@type": "WebPage", "@id": `${articleUrl}#webpage`, url: articleUrl, name: comparison.title, isPartOf: { "@id": websiteId }, inLanguage: "en-IN" }, { "@type": "Article", "@id": `${articleUrl}#article`, mainEntityOfPage: { "@id": `${articleUrl}#webpage` }, headline: comparison.title, description: comparison.summary, url: articleUrl, datePublished: comparison.datePublished ?? BASE_REVIEW_DATE, dateModified: comparison.dateModified ?? comparison.datePublished ?? BASE_REVIEW_DATE, image: absoluteUrl(comparison.image ?? "/yono-playstore-logo.png"), author: { "@id": organizationId }, publisher: { "@id": organizationId }, isPartOf: { "@id": websiteId }, inLanguage: "en-IN" }, { "@type": "FAQPage", "@id": `${articleUrl}#faq`, mainEntity: comparison.faqs.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}})) }] };
  return <><JsonLd data={schema}/><Header/><main><Breadcrumb items={[["Guides & Comparisons","/guides/"],["App Comparisons","/compare/"],[comparison.title,`/compare/${comparison.slug}/`]]}/><article className="article article--resource shell"><header><span className="section-index">{comparison.code}</span><p className="eyebrow">{comparison.eyebrow}</p><h1>{comparison.title}</h1><p>{comparison.summary}</p><div><span>{comparison.read} read</span><span>{comparedApps.length} exact records</span><span>Reviewed 12 Aug 2026</span></div></header>{comparison.image && <div className="article-featured-image"><img src={comparison.image} alt={comparison.imageAlt || comparison.title} width="1200" height="675" loading="lazy" /></div>}<div className="comparison-records">{comparedApps.map((app)=><a href={`/apps/${app.slug}/`} key={app.slug}><AppIcon app={app}/><span><small>{app.category} record</small><b>{app.name}</b><p>{comparison.identityNotes[app.slug]}</p></span><i>Open record ↗</i></a>)}</div><div className="comparison-matrix" role="table" aria-label={`${comparison.title} identity comparison`}><div className="comparison-matrix-row comparison-matrix-head" role="row"><span role="columnheader">Check</span>{comparedApps.map((app)=><b role="columnheader" key={app.slug}>{app.name}</b>)}</div><div className="comparison-matrix-row" role="row"><span role="cell">Canonical record</span>{comparedApps.map((app)=><a role="cell" href={`/apps/${app.slug}/`} key={app.slug}>/apps/{app.slug}/</a>)}</div><div className="comparison-matrix-row" role="row"><span role="cell">Catalog category</span>{comparedApps.map((app)=><b role="cell" key={app.slug}>{app.category}</b>)}</div><div className="comparison-matrix-row" role="row"><span role="cell">Do not assume</span>{comparedApps.map((app)=><p role="cell" key={app.slug}>{comparison.identityNotes[app.slug]}</p>)}</div></div><div className="article-layout"><div className="article-body"><div className="article-direct"><span>DIRECT ANSWER</span><Prose text={comparison.directAnswer} /></div>{comparison.sections.map((section,index)=><section className="editorial-section" key={section.heading}><span>0{index+1}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph)=><Prose text={paragraph} key={paragraph} />)}{section.bullets&&<ul className="content-list content-list--article">{section.bullets.map((item)=><li key={item} dangerouslySetInnerHTML={{__html: mdInlineToHtml(item)}} />)}</ul>}</section>)}<section className="editorial-section" id="faq"><span>FAQ</span><h2>Comparison questions</h2><div className="faq-list faq-list--record">{comparison.faqs.map(([question,answer],index)=><details key={question} open={index===0}><summary>{question}<i>+</i></summary><Prose text={answer} /></details>)}</div></section></div><aside className="article-aside article-aside--resource"><b>IDENTITY CHECK</b>{comparison.checklist.map((item)=><span key={item}>{item}</span>)}<a href="/compare/">All comparisons ↗</a><a href="/apps/">Search app records ↗</a></aside></div></article></main><Footer/></>;
}

function CollectionsPage() {
  return <><Header/><main><Breadcrumb items={[["Guides & Comparisons","/guides/"],["App Collections","/collections/"]]} /><PageHero code="SET / 00" eyebrow="Naming-family maps" title="Related Names, Separate Records" copy="Collections make discovery easier without claiming that a shared prefix proves common ownership, accounts or APK packages."/><section className="section shell"><div className="resource-card-grid"><ResourceCard code="01" label="7 app records" title={jaihoCollection.title} summary={jaihoCollection.summary} href={`/collections/${jaihoCollection.slug}/`} tone="mint"/></div><div className="resource-principle"><span>COLLECTION RULE</span><h2>A collection is a navigation aid—not an operator claim.</h2><p>Open each individual record for its source, Android, privacy and payment questions.</p></div></section></main><Footer/></>;
}

function JaihoCollectionPage() {
  const collectionApps = jaihoCollection.appSlugs.map((slug)=>apps.find((app)=>app.slug===slug)).filter((app): app is AppRecord=>Boolean(app));
  const collectionUrl = absoluteUrl(`/collections/${jaihoCollection.slug}/`);
  const schema = { "@context":"https://schema.org","@type":"CollectionPage","@id":`${collectionUrl}#webpage`,url:collectionUrl,name:jaihoCollection.title,description:jaihoCollection.summary,isPartOf:{"@id":websiteId},mainEntity:{"@type":"ItemList",numberOfItems:collectionApps.length,itemListElement:collectionApps.map((app,index)=>({"@type":"ListItem",position:index+1,name:app.name,url:absoluteUrl(`/apps/${app.slug}/`)}))} };
  return <><JsonLd data={schema}/><Header/><main><Breadcrumb items={[["Guides & Comparisons","/guides/"],["App Collections","/collections/"],[jaihoCollection.title,`/collections/${jaihoCollection.slug}/`]]}/><section className="collection-hero shell"><span className="section-index">SET / 01</span><p className="eyebrow">Seven-record name family</p><h1>{jaihoCollection.title}</h1><p>{jaihoCollection.directAnswer}</p><div><b>{collectionApps.length}</b><span>separate catalog records</span></div></section><section className="section shell"><div className="collection-grid">{collectionApps.map((app,index)=><a href={`/apps/${app.slug}/`} key={app.slug}><span>0{index+1}</span><AppIcon app={app}/><small>{app.category}</small><h2>{app.name}</h2><p>{app.summary}</p><i>Open independent record ↗</i></a>)}</div><div className="resource-next"><span>NEXT STEP</span><div><h2>Found the exact Jaiho name?</h2><p>Open its record and verify the source, package, permissions and account terms. Do not transfer facts from another member of the collection.</p></div><a className="button button--dark" href="/apps/">Search all apps ↗</a></div></section></main><Footer/></>;
}

const infoPages: Record<string,{code:string;eyebrow:string;title:string;intro:string;sections:[string,string][]}> = {
  "about": {code:"I/01",eyebrow:"About the registry",title:"Independent App Information, Clearly Labeled",intro:"Yono Play Store is an independent catalog built to help visitors discover app records and understand what is—and is not—known about them.",sections:[["What we publish","Concise records covering app identity, category, available source information, installation context and verification status."],["What we do not claim","Yono Play Store is not affiliated with Google Play, Google LLC, YONO SBI or State Bank of India. A listing does not establish official ownership, safety, popularity or a guaranteed download source."],["Why the catalog exists","Similarly named Android apps and changing distribution sources can create confusion. The registry makes uncertainty visible instead of filling gaps with invented facts."]] },
  "methodology": {code:"M/01",eyebrow:"Editorial system",title:"How We Verify App Records",intro:"Every published game completes the same catalog review for identity, category, page quality and practical source guidance.",sections:[["1. Identify the app","We compare available names, branding and publisher signals to distinguish similarly named applications."],["2. Check the category","We place each record in the supported category that best matches the available app information."],["3. Review the record","Required app information, installation context and visitor guidance are checked before publication."],["4. Assign the verified label","A verified badge confirms that the catalog record has completed the review standard."],["5. Review material changes","A new domain, publisher statement or technical change may require another editorial review."],["6. Correct the record","Documented errors can be reported and should be corrected with a genuine review date."]] },
  "editorial-policy": {code:"E/01",eyebrow:"Editorial standards",title:"Editorial Policy",intro:"The catalog favors verifiable information, transparent uncertainty and useful context over promotional completeness.",sections:[["Source hierarchy","Primary publisher-controlled sources and authoritative Android documentation receive preference. Third-party statements remain clearly attributed."],["No invented completeness","Missing ratings, file sizes, dates or technical fields remain unrecorded rather than being estimated."],["Review dates","Dates reflect actual editorial work and are not updated automatically during routine deployments."]] },
  "corrections-policy": {code:"E/02",eyebrow:"Accountability",title:"Corrections Policy",intro:"Visitors and publishers may report a specific factual error for editorial review.",sections:[["What to include","Identify the page, disputed statement and a reliable source that supports the correction."],["How we respond","A reported issue is assessed against the source hierarchy. Material corrections should receive a genuine review date."],["What does not qualify","Promotional requests, unsupported safety claims and requests to fabricate popularity data are not accepted as corrections."]] },
  "sources": {code:"E/03",eyebrow:"Evidence hierarchy",title:"Sources and Verification",intro:"Verified catalog records still separate stable listing information from live details that can change at an external source.",sections:[["Primary sources","Publisher-controlled documentation, app-store records where applicable, and official Android guidance."],["Platform statements","Claims made by a platform remain attributed until they can be supported by appropriate evidence."],["Supporting references","Third-party pages can lead to further research but do not automatically establish ownership or technical facts."]] },
  "responsible-gaming": {code:"L/04",eyebrow:"User wellbeing",title:"Responsible Gaming",intro:"Gaming should remain controlled, informed, legal where you live and limited to adults. If gaming is causing stress, debt or conflict, stop and talk to someone.",sections:[["18+ only","Apps that involve real-money play, cash rewards or withdrawals are intended only for adults aged 18 or over. Do not install them for, or share accounts with, anyone under 18."],["Check the law where you live","Rules on online real-money games differ across India and have changed recently, including under the Promotion and Regulation of Online Gaming Act, 2025 and state laws. Listing an app here does not mean it is lawful in your location. Check current official guidance before registering or paying."],["Set limits before you start","Decide a fixed time and spending limit before playing, and never play with money needed for rent, food, bills or loan repayments. Do not borrow to play and do not chase losses."],["Warning signs","Stop and seek support if you spend more than you planned, hide gaming from family, feel anxious when not playing, borrow money to play, or keep playing to win back losses."],["Self-exclusion","Use any account limits, cool-off periods or self-exclusion options the operator provides. You can also uninstall the app, remove saved payment methods and ask your bank to block gaming-related transactions."],["Get help","Tele-MANAS, the Government of India's free 24x7 mental-health helpline, is available at 14416 or 1-800-891-4416. In an emergency, call 112. If you have lost money to a scam or fraudulent app, report it at cybercrime.gov.in or call 1930."]] },
  "affiliate-disclosure": {code:"L/05",eyebrow:"How this site is funded",title:"Affiliate and Referral Disclosure",intro:"Some Download APK buttons on YonoPlayStore.com are referral links. When a visitor registers with an app through one of these links, YonoPlayStore.com may receive a referral benefit from that app's operator or agent.",sections:[["Which links are referral links","Download APK buttons that open an external website may carry a referral or invitation code in the URL. These links are marked rel=\"sponsored\" and are identified with a short notice beside the button."],["What a referral does not mean","A referral relationship is not an endorsement. It does not mean Yono Play Store has checked the APK, the operator, payment handling, game fairness or legal status, and it does not change how records are reviewed or labeled."],["Editorial independence","Records are written using the same method whether or not a referral link is present. Operators cannot pay to change a review label, remove warnings or add claims about winnings, bonuses or safety."],["Age and legality","Apps that involve real-money play are for adults aged 18+ only, and may be restricted or prohibited in your state. See the Responsible Gaming page before registering with any app."],["Questions","Use the contact page to ask about a specific link or to report one that appears inaccurate."]] },
  "disclaimer": {code:"L/01",eyebrow:"Independent status",title:"Disclaimer",intro:"YonoPlayStore.com is independently operated and is not affiliated with, endorsed by, sponsored by or associated with Google Play, Google LLC, YONO SBI or State Bank of India (SBI).",sections:[["No Google affiliation","This website is not Google Play, is not operated by Google and is not an official Google Play Store service or publisher."],["No SBI affiliation","This website is not part of YONO SBI or State Bank of India and does not represent, operate or provide SBI banking services."],["Third-party names and trademarks","Google Play, YONO SBI, app names, logos and related trademarks belong to their respective owners. Their appearance is for identification and informational purposes only."],["Third-party applications","Listing an app does not mean Yono Play Store publishes, operates, endorses or officially represents it."],["External sources and accuracy","External destinations and app details can change. The catalog aims for accuracy but does not guarantee that every record is complete, current or suitable for every user."]] },
  "privacy-policy": {code:"L/02",eyebrow:"Privacy notice",title:"Privacy Policy",intro:"This page explains the information that may be processed when visitors use the catalog.",sections:[["Basic usage data","Hosting and security services may process technical request data needed to deliver and protect the website."],["Search interaction","Catalog searches are designed to work without requiring a user account."],["Contact information","Information voluntarily submitted through a contact method should be used only to review and respond to the request."]] },
  "terms-and-conditions": {code:"L/03",eyebrow:"Website terms",title:"Terms and Conditions",intro:"By using this website, visitors agree to use its informational content responsibly and lawfully.",sections:[["Informational use","Catalog records and guides are general information, not a guarantee, endorsement or substitute for independent judgment."],["Intellectual property","Third-party names, logos and trademarks belong to their respective owners."],["Acceptable use","Do not misuse the website, interfere with its operation or misrepresent its independent content as an official publisher statement."]] },
  "faq": {code:"Q/01",eyebrow:"Common questions",title:"Frequently Asked Questions",intro:"Clear answers about the catalog, its independence and the way app information is presented.",sections:faqs as [string,string][]},
  "contact": {code:"C/01",eyebrow:"Contact the editorial desk",title:"Report an App-Information Issue",intro:"Send a focused correction or source note so the relevant catalog record can be reviewed.",sections:[["Correction requests","Include the exact page, the information you believe is inaccurate, and a reliable supporting source."],["Publisher information","A claim of ownership or publisher status must be supported by evidence that can be evaluated independently."],["Response expectations","Submissions may be reviewed for accuracy and relevance. Sending a request does not guarantee a listing change."]] },
};

function InfoPage({ type }: { type: string }) {
  const page = infoPages[type] || infoPages.about;
  return <><Header /><main><Breadcrumb items={[[page.title,`/${type}/`]]} /><PageHero code={page.code} eyebrow={page.eyebrow} title={page.title} copy={page.intro} /><section className="info-body shell"><div className="info-rail"><span>DOCUMENT INDEX</span><a href="#content">Overview</a><a href="/methodology/">Methodology</a><a href="/corrections-policy/">Corrections</a></div><article id="content">{page.sections.map(([title,copy],i)=><section key={title}><span>0{i+1}</span><div><h2>{title}</h2><p>{copy}</p></div></section>)}</article></section></main><Footer /></>;
}

function NotFoundPage() {
  return <><Header /><main><section className="not-found shell"><span>404 / RECORD NOT FOUND</span><h1>This route isn’t in the registry.</h1><p>Search the app catalog or return to the discovery index.</p><SearchCatalog compact/><a className="button button--primary" href="/apps/">Browse all apps ↗</a></section></main><Footer /></>;
}

export function SitePage({ path }: { path: string }) {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const parts = clean ? clean.split("/") : [];
  if (!parts.length) return <HomePage />;
  if (parts[0] === "apps" && parts.length === 1) return <AppsPage />;
  if (parts[0] === "apps" && parts[1]) {
    const app = apps.find(item=>item.slug===parts[1]);
    return app ? <AppDetail app={app} /> : <NotFoundPage />;
  }
  if (parts[0] === "categories" && parts.length === 1) return <CategoriesPage />;
  if (parts[0] === "categories" && parts[1]) return <AppsPage category={parts[1]} />;
  if (parts[0] === "guides" && parts.length === 1) return <ResourceHub />;
  if (parts[0] === "apk-guides" && parts.length === 1) return <GuidesPage />;
  if (parts[0] === "apk-guides" && parts[1]) return <GuideArticle slug={parts[1]} />;
  if (parts[0] === "compare" && parts.length === 1) return <ComparisonsPage />;
  if (parts[0] === "compare" && parts[1]) return <ComparisonArticle slug={parts[1]} />;
  if (parts[0] === "collections" && parts.length === 1) return <CollectionsPage />;
  if (parts[0] === "collections" && parts[1] === jaihoCollection.slug) return <JaihoCollectionPage />;
  if (parts[0] === "app-safety" && parts.length === 1) return <SafetyPage />;
  if (parts[0] === "app-safety" && parts[1]) return <SafetyArticle slug={parts[1]} />;
  if (infoPages[parts[0]]) return <InfoPage type={parts[0]} />;
  return <NotFoundPage />;
}
