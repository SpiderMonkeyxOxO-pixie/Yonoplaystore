import { appEditorial, type AppEditorial } from "./app-content";
import { generatedAppArticles } from "./generated/app-articles.generated";
import { handAuthoredAppArticles } from "./hand-authored-articles";
import { generatedGuideIndexEntries } from "./generated/resource-articles.generated";

export type StatusKind = "confirmed";
export type AppCategory = "Rummy" | "Slots" | "Arcade" | "Spin" | "Other";

export type AppRecord = {
  slug: string;
  name: string;
  mark: string;
  image: string;
  category: AppCategory;
  summary: string;
  status: string;
  statusKind: StatusKind;
  availability: string;
  source: string;
  technical: string;
  downloadUrl?: string;
  reviewed: string;
  accent: string;
  editorial: AppEditorial;
};

const categoryAccent: Record<AppCategory, string> = {
  Rummy: "#57dccb",
  Slots: "#ff9fd0",
  Arcade: "#c9ff56",
  Spin: "#5cc5ff",
  Other: "#ffc765",
};

const appDownloadUrls: Partial<Record<string, string>> = {
  "101z": "https://101z19.com/?code=398FMU1E4UC&t=1781948650",
  "567-slots": "https://join567slots.cc/?code=9UXNF2XJ68V&t=1781948821",
  "777-game": "https://www.777game2.com/?code=H53WZ731GKT&t=1781948890",
  "789-jackpots": "https://join789jackpots.cc/?code=VJJL7DL96SG&t=1781948943",
  "abc-rummy": "https://www.11abcrummy.com/?code=6X4TN4LWGST&t=1781949033",
  "bet-213": "https://www.bet213app.com/?code=2QTMHNTC4J9&t=1781949147",
  "bingo-101": "https://bingo101.info/?code=3WFYXGESSL8&t=1781949273",
  "boss-rummy": "https://www.bossrummyv.com/?code=9HF54MYMV8X&t=1781969528",
  "club-inr": "https://clubinr2.top/?code=WZJ9KYQMY2X&t=1781949863",
  "dhan-game": "https://dhangamereferral.com/?code=L2VG9FG6812&t=1784884064",
  "game-rummy": "https://gamerummyq.com/?code=GAF5Y5CUMVU&t=1781950990",
  "gogo-rummy": "https://www.gogorummy30.com/?code=V4U7LU1TUDZ&t=1781951275",
  "hi-rummy": "https://joinhirummy.cc/?code=RX37ZA9H7G7&t=1781952763",
  "hindi-777": "https://www.hindi777agent4.com/?code=7LFAXV7ZFX2&t=1781953691",
  "ind-club": "https://indclub38.com/?code=W231VYT9S4K&t=1781953944",
  "ind-rummy": "https://indrummyvip30.com/?code=2BAB6MWU1ST&t=1781954340",
  "ind-slots": "https://www.indslotsgame.com/?code=T2QAZY5XRX5&t=1781954995",
  "inr-rummy": "https://inrrummysvip.net/?code=JMQK62EW7RW&t=1781969140",
  "jaiho-777": "https://jaiho77790.com/?code=RZP8TTL2EXP&t=1781955169",
  "jaiho-91": "https://jaiho91agents.com/?code=C42CFSG9NU1&t=1781970545",
  "jaiho-arcade": "https://www.jaihoarcade48.com/?code=74SY92P3WEB&t=1781955258",
  "jaiho-rummy": "https://jaihorummyagent.club/?code=3NPMVPS8ECT&t=1781957652",
  "jaiho-slots": "https://www.jaihoslots24.com/?code=QJS2Y15LD48&t=1781957788",
  "jaiho-spin": "https://7jaihospinagent.com/?code=4168H4BCEUT&t=1781958114",
  "jaiho-win": "https://www.jaihowin11.com/?code=XZD1DCCQ3N4&t=1781958256",
  "joy-rummy": "https://www.joyrummy8.com/?code=J5KZREFFUG5&t=1781969686",
  "love-rummy": "https://www.loverummy88.com/?code=R6KTL37DEVW&t=1781958746",
  "maha-games": "https://mahagames-a.com/?code=J245HMNW4C3&t=1781958855",
  "max-rummy": "https://www.maxrummy99.com/?code=QUMV1MBQR7L&t=1783566019",
  "mbm-bet": "https://www.mbmbet21.com/?code=UPHZHE49PH6&t=1781958952",
  "neta-vip": "https://neta7.vip/?code=DR0TFBX29CG&t=1781959176",
  "ok-rummy": "https://www.okrummy48.com/?code=H2GNJTTB4TP&t=1781959294",
  "rumble-rummy": "https://www.rumblerummy333.net/?code=82MDH43NXH9&t=1781961857",
  "rummy-91": "https://www.rummy91q.bet/?code=UXT67QH88MK&t=1781963162",
  "rummy-ludo": "https://www.rummyludo1.com/?code=UWPCL2TP9N3&t=1781963324",
  "rummy-77": "https://rummy77z.vip/?code=F3VMY7HUKLD&t=1781962775",
  "rummy-888": "https://rummy888vip37.com/?code=TPUREFESN3G&t=1781963064",
  "saga-slots": "https://www.sagaslots23.com/?code=0QHQQDQR832&t=1781963464",
  "share-slots": "https://share977.com/?code=YAZ4PR9XNK4&t=1781964196",
  "slot-spin": "https://slotsspiny.com/?code=C1A3LUE98Y9&t=1781964366",
  "slots-winner": "https://slotswinnerk.com/?code=PGVZ35PE57E&t=1781965038",
  "spin-crush": "https://spincrush61.com/?code=ADE75XVN5W2&t=1782646860",
  "spin-gold": "https://spingoldvipagent.cc/?code=S9VSKRLMRJB&t=1781965765",
  "spin-winner": "https://spinwinner-y.com/?code=QVT5YKQQ4ZZ&t=1781966029",
  "spin-101": "https://spin101-f.com/?code=Z9BRWVJXE7T&t=1781966141",
  "top-rummy": "https://www.toprummy.cc/?code=M4GW3PJNE81&t=1781967667",
  "yes-spin": "https://www.y754.com/?code=4SW8P8RDE8P&t=1781968442",
  "yono-arcade": "https://yonoofficial1.com/?code=96LVCHSK6LN&t=1781968544",
  "yono-games": "https://yonogamese.com/?code=GK19NGYEZT2&t=1781968659",
  "yono-rummy": "https://yonorummy044.com/?code=VIPDW9AGUXM&t=1781968802",
  "yono-slots": "https://www.uonoslots.fun/?code=59YLFBFUNDL&t=1781968918",
  "yono-vip": "https://uonovipplay.vip/?code=9U8GYEWZ9LN&t=1781969008",
  "yono-777": "https://uono777network.online/?code=SCHFQRY8DAS",
  "win-rummy": "https://www.winrummy45.com/?code=8JT3QUW7G2L&t=1785292781",
};

function app(slug: string, name: string, category: AppCategory): AppRecord {
  const baseEditorial = appEditorial[slug];
  if (!baseEditorial) throw new Error(`Missing editorial profile for ${slug}`);
  // generatedAppArticles is server-only output from the content pipeline (gitignored, not in
  // git); handAuthoredAppArticles is the git-tracked equivalent for records the pipeline hasn't
  // reached. If the pipeline ever does process one of those slugs, its output takes precedence.
  const article = generatedAppArticles[slug] ?? handAuthoredAppArticles[slug];
  const editorial: AppEditorial = article ? { ...baseEditorial, article } : baseEditorial;
  const words = name.replace(/[^a-zA-Z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  const mark = words.length === 1 ? words[0].slice(0, 2).toUpperCase() : words.map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  return {
    slug,
    name,
    mark,
    image: `/apps/${slug}.webp`,
    category,
    summary: editorial.summary,
    status: "Reviewed",
    statusKind: "confirmed",
    availability: editorial.localContext,
    source: editorial.identityFocus,
    technical: editorial.apkFocus,
    downloadUrl: appDownloadUrls[slug],
    reviewed: editorial.article?.dateModified ? `Reviewed ${editorial.article.dateModified}` : "Reviewed 12 August 2026",
    accent: categoryAccent[category],
    editorial,
  };
}

export const apps: AppRecord[] = [
  app("yono-rummy", "Yono Rummy", "Rummy"),
  app("yono-777", "Yono 777", "Arcade"),
  app("dhan-game", "Dhan Game", "Other"),
  app("win-rummy", "Win Rummy", "Rummy"),
  app("yono-arcade", "Yono Arcade", "Arcade"),
  app("yono-slots", "Yono Slots", "Slots"),
  app("101z", "101Z", "Spin"),
  app("567-slots", "567 Slots", "Slots"),
  app("777-game", "777 Game", "Arcade"),
  app("789-jackpots", "789 Jackpots", "Slots"),
  app("abc-rummy", "ABC Rummy", "Rummy"),
  app("bet-213", "Bet 213", "Slots"),
  app("bingo-101", "Bingo 101", "Other"),
  app("boss-rummy", "Boss Rummy", "Rummy"),
  app("club-inr", "Club INR", "Other"),
  app("game-rummy", "Game Rummy", "Rummy"),
  app("gogo-rummy", "Gogo Rummy", "Rummy"),
  app("hi-rummy", "Hi Rummy", "Rummy"),
  app("hindi-777", "Hindi 777", "Arcade"),
  app("ind-club", "IND Club", "Other"),
  app("ind-rummy", "IND Rummy", "Rummy"),
  app("ind-slots", "IND Slots", "Slots"),
  app("inr-rummy", "INR Rummy", "Rummy"),
  app("jaiho-777", "Jaiho 777", "Arcade"),
  app("jaiho-arcade", "Jaiho Arcade", "Arcade"),
  app("jaiho-rummy", "Jaiho Rummy", "Rummy"),
  app("jaiho-slots", "Jaiho Slots", "Slots"),
  app("jaiho-spin", "Jaiho Spin", "Spin"),
  app("jaiho-win", "Jaiho Win", "Arcade"),
  app("jaiho-91", "Jaiho 91", "Arcade"),
  app("joy-rummy", "Joy Rummy", "Rummy"),
  app("love-rummy", "Love Rummy", "Rummy"),
  app("maha-games", "Maha Games", "Arcade"),
  app("max-rummy", "Max Rummy", "Rummy"),
  app("mbm-bet", "MBM Bet", "Other"),
  app("neta-vip", "Neta VIP", "Other"),
  app("ok-rummy", "OK Rummy", "Rummy"),
  app("rumble-rummy", "Rumble Rummy", "Rummy"),
  app("rummy-91", "Rummy 91", "Rummy"),
  app("rummy-ludo", "Rummy Ludo", "Rummy"),
  app("rummy-77", "Rummy 77", "Rummy"),
  app("rummy-888", "Rummy 888", "Rummy"),
  app("saga-slots", "Saga Slots", "Slots"),
  app("share-slots", "Share Slots", "Slots"),
  app("slot-spin", "Slot Spin", "Spin"),
  app("slots-winner", "Slots Winner", "Slots"),
  app("spin-101", "Spin 101", "Spin"),
  app("spin-crush", "Spin Crush", "Spin"),
  app("spin-gold", "Spin Gold", "Spin"),
  app("spin-winner", "Spin Winner", "Spin"),
  app("top-rummy", "Top Rummy", "Rummy"),
  app("yes-spin", "Yes Spin", "Spin"),
  app("yn-777", "YN 777", "Arcade"),
  app("yono-games", "Yono Games", "Other"),
  app("yono-vip", "Yono VIP", "Other"),
];

export const categories = [
  { name: "Rummy", slug: "rummy", code: "RMY", description: "Card-game app records documented in the catalog." },
  { name: "Slots", slug: "slots", code: "SLT", description: "Records associated with slot-style gaming experiences." },
  { name: "Arcade", slug: "arcade", code: "ARC", description: "Arcade-oriented applications and mixed game collections." },
  { name: "Spin", slug: "spin", code: "SPN", description: "Applications associated with spin-style game features." },
  { name: "Other", slug: "other", code: "OTH", description: "App identities that do not yet fit a supported category." },
];

const handAuthoredGuides = [
  {
    slug: "what-is-an-apk",
    number: "01",
    title: "What Is an APK?",
    summary: "Understand Android application packages and why some apps are distributed outside major stores.",
    read: "4 min",
  },
  {
    slug: "how-to-install-apk",
    number: "02",
    title: "How to Install an APK",
    summary: "Follow a careful installation flow without assuming every app or Android device behaves the same way.",
    read: "6 min",
  },
  {
    slug: "how-to-check-apk-source",
    number: "03",
    title: "How to Check an APK Source",
    summary: "Inspect the domain, publisher signals and file context before deciding whether to continue.",
    read: "5 min",
  },
  {
    slug: "android-app-permissions",
    number: "04",
    title: "Android Permissions Explained",
    summary: "Learn what common permissions do and which unexpected requests deserve a closer look.",
    read: "7 min",
  },
  {
    slug: "123-rummy-launch",
    number: "05",
    title: "123 Rummy: Launch Date and What to Check First",
    summary: "123 Rummy is scheduled to launch 16 November 2026. What's confirmed so far and what to verify once it's live.",
    read: "3 min",
  },
];

export const guides = [...handAuthoredGuides, ...generatedGuideIndexEntries];

export const safetyChecks = [
  ["01", "Check the app name", "Confirm that the name and identity match the app you intended to find."],
  ["02", "Inspect the source", "Look closely at the domain or store providing the application."],
  ["03", "Check the publisher", "Compare publisher information using an appropriate primary source."],
  ["04", "Compare details", "Use package, version and file details only when a reliable record exists."],
  ["05", "Review permissions", "Consider whether requested access is appropriate for the app’s purpose."],
  ["06", "Reject guarantees", "A ‘100% safe’ badge is not a substitute for source verification."],
];

export const faqs = [
  ["What is Yono Play Store?", "Yono Play Store is an independent catalog for discovering Yono gaming applications and reviewing available app, source, installation and verification information."],
  ["Is this the Google Play Store?", "No. YonoPlayStore.com is an independent website. It is not Google Play and is not operated by Google."],
  ["Is every listed app official?", "No. A catalog listing does not mean Yono Play Store develops, operates or officially represents the application."],
  ["Can I download apps here?", "Many records include a Download APK button that opens a third-party source supplied for that app. Yono Play Store does not host those files; visitors should verify the final domain, publisher, package and permissions before installing."],
  ["Are all Yono apps safe?", "No blanket guarantee is made. Safety depends on the specific app, publisher, source, file and requested permissions."],
  ["Does this site publish promo codes?", "No. The catalog focuses on app discovery, download-source information and installation guidance rather than maintaining a general promo-code database."],
];
