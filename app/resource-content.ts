export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type EditorialResource = {
  slug: string;
  code: string;
  eyebrow: string;
  title: string;
  summary: string;
  directAnswer: string;
  read: string;
  sections: ArticleSection[];
  checklist: string[];
  faqs: [string, string][];
  relatedApps?: string[];
  /** Full-size (1200x675) featured image, used for the page banner and OG/Twitter metadata. */
  image?: string;
  imageAlt?: string;
  datePublished?: string;
  dateModified?: string;
  /** Search title and meta description from the content brief, when one was supplied. */
  seoTitle?: string;
  seoDescription?: string;
};

import { generatedGuideArticles, generatedComparisonUpdates } from "./generated/resource-articles.generated";

const handAuthoredGuideArticles: Record<string, EditorialResource> = {
  "what-is-an-apk": {
    slug: "what-is-an-apk",
    code: "APK / 01",
    eyebrow: "Android file basics",
    title: "What Is an APK?",
    summary: "Understand what an Android application package contains, how it reaches a phone and why the file format does not prove who published it.",
    directAnswer: "An APK is the installable package Android uses to deliver an application. It can come from an app store, a publisher website or another source. The APK format explains how the app is installed; it does not prove that the file is official, unchanged, lawful or appropriate for your device.",
    read: "4 min",
    sections: [
      {
        heading: "APK describes the package—not its trustworthiness",
        paragraphs: [
          "An APK bundles the code, resources and configuration Android needs to install an app. When you tap an APK, Android reads that package and asks whether the device should allow the installation.",
          "Two files can display the same app name and icon while containing different code. That is why a familiar brand image cannot replace a check of the download source, package identity and signing information.",
        ],
      },
      {
        heading: "How an APK reaches an Android phone",
        paragraphs: [
          "A recognized app store normally manages delivery and updates. A direct APK may instead arrive through a publisher-controlled website, a cloud folder, a message, a shortened link or a third-party mirror. Each additional handoff makes provenance harder to follow.",
        ],
        bullets: [
          "Store-managed install: the store supplies the package and update path.",
          "Publisher download: the publisher should clearly connect its identity, domain and app package.",
          "Mirror or message link: the visitor must establish who uploaded the file and whether it matches a reliable reference.",
        ],
      },
      {
        heading: "Information worth recording before installation",
        paragraphs: [
          "Write down the complete source domain, the stated publisher, the Android package name, the version and the permissions requested. If a later update changes the signer, source or permission pattern without an explanation, treat it as a new verification decision.",
        ],
      },
    ],
    checklist: ["Complete source domain", "Stated publisher", "Package name", "Signing identity", "Version and update path", "Requested permissions"],
    faqs: [
      ["Is every APK unsafe?", "No. APK is simply Android's installation-package format. Risk depends on the specific app, publisher, source, file integrity, permissions and behavior."],
      ["Does an APK name prove which app it contains?", "No. File names can be changed. Compare the installed package, signing information and source with a reliable publisher record."],
      ["Can an APK update an existing app?", "Android normally expects a compatible package identity and signer. An unexpected mismatch is a reason to stop and verify the update source."],
    ],
  },
  "how-to-install-apk": {
    slug: "how-to-install-apk",
    code: "APK / 02",
    eyebrow: "Installation walkthrough",
    title: "How to Install an APK Carefully",
    summary: "Use a source-first Android installation process that keeps device protections enabled except for the narrow permission needed to open a reviewed file.",
    directAnswer: "Before installing an APK, identify the exact app, verify the source and review the requested permissions. If Android allows installation from that source, grant the permission only to the browser or file manager you intentionally used, install the reviewed file, then turn the source permission off again.",
    read: "6 min",
    sections: [
      {
        heading: "Begin before the download",
        paragraphs: [
          "Installation is the final step, not the first check. Confirm that the page identifies a publisher, explains what the app is, provides readable terms and privacy information, and does not pressure you to disable broad security controls.",
          "Save the full source URL. A shortened link or forwarded message can hide the final host and makes it harder to understand who is responsible for the file.",
        ],
      },
      {
        heading: "Use the narrow Android permission",
        paragraphs: [
          "Modern Android versions authorize individual sources rather than one universal unknown-app switch. The setting should name the browser or file manager that opened the APK. Do not grant installation rights to an unrelated messaging, accessibility or remote-control app.",
        ],
        bullets: [
          "Open the downloaded file only after completing the source review.",
          "Read Android's installer prompt and compare the displayed app name.",
          "Reject unexpected permission or protection-disable requests.",
          "Remove the source's install permission after the process is complete.",
        ],
      },
      {
        heading: "Check the first launch separately",
        paragraphs: [
          "Installation permission is different from the permissions requested after launch. Ask whether contacts, SMS, accessibility, screen capture, device administration, precise location or storage access is necessary for the app's stated function.",
          "If the first screen immediately asks for an OTP, payment or remote access before explaining the service, close the app and verify the operator through an independent channel.",
        ],
      },
    ],
    checklist: ["Exact app identified", "Full URL recorded", "Publisher connection checked", "Installer prompt reviewed", "Sensitive permissions rejected", "Unknown-source access removed"],
    faqs: [
      ["Should I disable Play Protect to install an APK?", "A request to disable device protection is a warning sign. Investigate why the file is being blocked and seek a reliable source rather than bypassing the warning automatically."],
      ["Why can I not open an APK?", "The download may be incomplete, the file may not be an APK, the Android version may be incompatible, or the selected source may not have permission to request an install."],
      ["Should unknown-source access stay enabled?", "No. Keep the permission limited to the source and period required for a deliberate installation, then switch it off."],
    ],
  },
  "how-to-check-apk-source": {
    slug: "how-to-check-apk-source",
    code: "APK / 03",
    eyebrow: "Provenance check",
    title: "How to Check an APK Download Source",
    summary: "Trace a download from the visible button to the final host, stated publisher and Android identity before deciding whether the source is credible.",
    directAnswer: "A credible APK source should connect the same app, publisher, domain, support contact, privacy policy and Android package. Read the complete destination—not just the button label—and stop when ownership claims, domains or payment identities contradict one another.",
    read: "5 min",
    sections: [
      {
        heading: "Follow the link to its real destination",
        paragraphs: [
          "A button can say “official download” while leading through redirects, trackers, storage services or an unrelated host. Inspect the final domain and check whether the stated publisher controls it.",
          "HTTPS protects the connection to a domain; it does not prove that the domain belongs to the intended app operator.",
        ],
      },
      {
        heading: "Build a connected identity trail",
        paragraphs: [
          "Look for agreement between the developer or business name, domain, support email, privacy policy, terms and Android package. One matching logo is weak evidence because images and page layouts are easy to copy.",
        ],
        bullets: [
          "The support email uses the same accountable domain.",
          "The privacy policy identifies who processes app and account data.",
          "The terms name the same operator and complaint route.",
          "The package and signer can be compared with a reliable earlier version.",
          "Update links remain within the same documented source chain.",
        ],
      },
      {
        heading: "Separate scanning from provenance",
        paragraphs: [
          "A malware scan can add one technical signal, but it cannot establish who published a file, whether the service is lawful, whether account claims are accurate or whether a new threat is undetected. Source identity and file analysis answer different questions.",
        ],
      },
    ],
    checklist: ["Final destination", "Domain ownership signals", "Business or developer name", "Policy and terms agreement", "Package and signer", "Consistent update source"],
    faqs: [
      ["Does HTTPS mean the APK is official?", "No. HTTPS secures the connection to the website. It does not prove that the website is operated by the intended publisher."],
      ["Is a cloud-storage link an official source?", "Not by itself. Establish which accountable publisher uploaded the file and how the link is connected to that publisher's own documentation."],
      ["Can a clean scan verify the publisher?", "No. A scan assesses detectable file behavior; it does not verify ownership, licensing, business identity or payment claims."],
    ],
  },
  "android-app-permissions": {
    slug: "android-app-permissions",
    code: "APK / 04",
    eyebrow: "Permission review",
    title: "Android App Permissions Explained",
    summary: "Understand what common Android permissions allow and identify requests that do not fit a gaming app's stated purpose.",
    directAnswer: "Android permissions control access to data and device functions such as location, camera, microphone, contacts and SMS. Review each request in context. A permission is not automatically dangerous, but an unexplained sensitive permission—especially accessibility, SMS, contacts or device administration—deserves a stop-and-verify response.",
    read: "7 min",
    sections: [
      {
        heading: "Judge the request against the feature",
        paragraphs: [
          "A camera request can make sense when a user deliberately scans a document, while the same request is harder to justify for a simple game screen. The useful question is not only what the permission is called, but which visible feature needs it and when the app asks.",
        ],
      },
      {
        heading: "Permissions that deserve extra explanation",
        paragraphs: [
          "Some permissions can expose personal communication, control the screen or make account takeover easier when abused. Do not grant them merely because a pop-up blocks progress.",
        ],
        bullets: [
          "SMS and notification access can expose one-time codes and account messages.",
          "Contacts access can expose other people who never chose to use the app.",
          "Accessibility can read screen content and perform actions on the user's behalf.",
          "Screen capture or remote control can expose passwords, balances and payment steps.",
          "Device administration can make an app harder to remove or grant it broader control.",
        ],
      },
      {
        heading: "Permissions can change after an update",
        paragraphs: [
          "Review the permission list again when an app changes source, package, signer or major version. A previously acceptable install does not make every later update equivalent.",
          "Android settings can revoke many permissions after installation. If denying an unrelated request makes the entire app unusable, ask whether the operator has explained that dependency clearly.",
        ],
      },
    ],
    checklist: ["Permission matches a feature", "Request appears at the relevant moment", "Sensitive access is explained", "Denied access is respected", "Update changes are reviewed", "Unused permissions are revoked"],
    faqs: [
      ["Are all permissions dangerous?", "No. Many app features need permissions. The concern is whether the requested access is proportionate, clearly explained and connected to a feature the user chose."],
      ["Why would a game ask for SMS access?", "Some services may claim account-verification uses, but direct SMS access can expose sensitive messages. Prefer a process that does not require broad inbox access and verify the operator before proceeding."],
      ["Can I remove a permission later?", "Android settings allow many permissions to be reviewed and revoked. Some features may stop working, which helps reveal whether the access was actually required."],
    ],
  },
};

export const guideArticles: Record<string, EditorialResource> = { ...handAuthoredGuideArticles, ...generatedGuideArticles };

export type ComparisonResource = EditorialResource & {
  appSlugs: string[];
  identityNotes: Record<string, string>;
};

const handAuthoredComparisonArticles: ComparisonResource[] = [
  {
    slug: "yono-rummy-vs-gogo-rummy-vs-hi-rummy",
    code: "CMP / 01",
    eyebrow: "Three-name comparison",
    title: "Yono Rummy vs GoGo Rummy vs Hi Rummy",
    summary: "Compare three separate rummy app records without treating similar category labels, icons or APK pages as proof that they share an operator.",
    directAnswer: "Yono Rummy, GoGo Rummy and Hi Rummy are documented as three separate catalog identities. They belong to the same broad rummy category, but that does not establish shared ownership, accounts, APK packages or payment terms. Match the complete name, source domain, publisher and Android identity for the specific app you intend to inspect.",
    read: "8 min",
    appSlugs: ["yono-rummy", "gogo-rummy", "hi-rummy"],
    identityNotes: {
      "yono-rummy": "The Yono name can be confused with unrelated Yono-branded services. Verify the complete gaming-app identity and keep the site's SBI non-affiliation clear.",
      "gogo-rummy": "The repeated GoGo wording is distinctive, but the display name still needs to connect to one publisher, domain, package and signer.",
      "hi-rummy": "The short greeting-style name is easy to reproduce. Use the full source and package identity rather than recognizing the icon alone.",
    },
    sections: [
      { heading: "What the shared rummy label tells you", paragraphs: ["The category suggests card-game content. It does not tell you whether the apps use the same rules, player matching, wallet, bonus conditions, support team or withdrawal process. Those details must be read in each app's own terms and record."] },
      { heading: "A practical way to choose the correct record", paragraphs: ["Start with the exact wording shown on the page or installed app. Then compare its icon, source domain, package name and publisher statement with the matching catalog record."], bullets: ["Do not use a comparison page as a substitute for the individual app record.", "Do not move one app's version, bonus or operator claim onto another app.", "Treat a redirect to a different brand or domain as a new source decision.", "Open the relevant record before following any external source."] },
      { heading: "The comparison result", paragraphs: ["The correct answer is not which name sounds better. It is which record matches the actual app, source and account you are evaluating. If those identifiers do not line up, stop rather than forcing a match."] },
    ],
    checklist: ["Exact display name", "Matching icon", "Source domain", "Package and signer", "Operator in terms", "Account and payment recipient"],
    faqs: [["Are these three apps operated by the same company?", "This comparison does not establish shared ownership. Verify the operator and domain separately for each app."], ["Can one APK install all three apps?", "Do not assume that. Each app identity should have its own documented package and source trail."], ["Which page should rank for each app name?", "Each exact app query belongs to its individual catalog record; this comparison answers only the distinct comparison intent."]],
  },
  {
    slug: "rummy-91-vs-rummy-888-vs-rummy-77",
    code: "CMP / 02",
    eyebrow: "Numbered rummy comparison",
    title: "Rummy 91 vs Rummy 888 vs Rummy 77",
    summary: "Distinguish three numbered rummy names by their complete label, digit sequence, Android identity and source—not by a partial numeric match.",
    directAnswer: "Rummy 91, Rummy 888 and Rummy 77 are different catalog records. The shared word “Rummy” and repeated digits make them easy to confuse in search results, messages and filenames. Confirm the entire number sequence and then verify the matching domain, package, signer and account terms.",
    read: "7 min",
    appSlugs: ["rummy-91", "rummy-888", "rummy-77"],
    identityNotes: {
      "rummy-91": "Keep the digits in the order 9–1 and distinguish the record from Jaiho 91 or other apps using 91.",
      "rummy-888": "The three repeated eights are part of the identity; a shortened “88” or substituted 777 name should not be treated as the same record.",
      "rummy-77": "Two sevens identify this catalog record. Do not merge it with 777-branded apps or move their source claims onto it.",
    },
    sections: [
      { heading: "Why numbered names create search confusion", paragraphs: ["Digits are easy to omit, repeat or transpose, and a filename can be renamed without changing the underlying application. Search snippets may also emphasize the shared rummy term more than the distinguishing number."] },
      { heading: "Use identifiers in the right order", paragraphs: ["First match the full public name. Next confirm the publisher-controlled source. Finally compare the Android package and signer. A number match without the source and technical identity remains incomplete."], bullets: ["Read the full page title and destination domain.", "Compare the icon as a supporting—not decisive—signal.", "Check the package before replacing an existing install.", "Keep account, bonus and withdrawal terms attached to the exact app."] },
      { heading: "When to keep searching", paragraphs: ["If a page switches between 91, 77 and 888 branding, or its download points to a differently named package without explanation, do not select the closest catalog record. Record the contradiction and seek a reliable primary source."] },
    ],
    checklist: ["All digits match", "Word order matches", "Final domain matches", "Package identity matches", "Signer is consistent", "Terms name the same app"],
    faqs: [["Is Rummy 91 the same as Jaiho 91?", "No shared identity should be assumed from the number alone. They have separate catalog records and require separate source checks."], ["Is Rummy 77 another name for a 777 app?", "Not on the basis of the digits. Match the complete name and Android identity rather than expanding 77 into 777."], ["Can I compare bonuses on this page?", "Only if current, attributable terms exist for each exact app. This page does not transfer promotional claims between similar names."]],
  },
  {
    slug: "yono-777-vs-777-game-vs-yn-777",
    code: "CMP / 03",
    eyebrow: "777 identity comparison",
    title: "Yono 777 vs 777 Game vs YN 777",
    summary: "Separate three 777-branded records by the words around the digits, the source trail and the installed Android identity.",
    directAnswer: "Yono 777, 777 Game and YN 777 are separate records. “777” is the shared motif, not proof of a shared app or publisher. The words before or after the digits, the final source domain, the Android package and the written account terms determine which record applies.",
    read: "8 min",
    appSlugs: ["yono-777", "777-game", "yn-777"],
    identityNotes: {
      "yono-777": "The full Yono 777 label matters. Do not infer an SBI relationship from the word Yono; the catalog and site are independently operated.",
      "777-game": "This record begins with the digits and ends with Game. A page that adds Yono or another prefix may represent a different identity.",
      "yn-777": "The abbreviated YN prefix is part of the name. Confirm how the publisher itself expands or uses that abbreviation rather than guessing.",
    },
    sections: [
      { heading: "777 is a motif, not an ownership record", paragraphs: ["The number appears across many game and jackpot brands. It can describe a theme without connecting the apps technically, legally or commercially. Treat each complete name as a separate entity until reliable evidence connects it to a publisher."] },
      { heading: "Compare what surrounds the number", paragraphs: ["Read the prefix, suffix and word spacing, then inspect the final domain. A lookalike may keep the 777 icon while changing the brand, package or payment destination."], bullets: ["Yono, Game and YN are distinguishing terms—not optional decoration.", "Package names and signers matter more than renamed APK filenames.", "One app's review, reward or withdrawal language does not describe the other two.", "Open the exact app record for source and safety context."] },
      { heading: "A safe comparison conclusion", paragraphs: ["If you cannot connect a page and installed package to one of the three complete identities, the responsible conclusion is “not matched,” not whichever record looks most similar."] },
    ],
    checklist: ["Prefix or suffix", "Complete 777 name", "Final source domain", "Package and signer", "Operator identity", "Payment recipient"],
    faqs: [["Are all 777 apps connected?", "No. The shared number alone does not establish an operator, package, account system or business relationship."], ["Is YN short for Yono?", "Do not assume an expansion. Use the publisher's own consistent documentation and technical identity."], ["Which URL should target “Yono 777”?", "The individual Yono 777 app record targets the entity query; this page targets users explicitly comparing the three names."]],
  },
];

export const comparisonArticles: ComparisonResource[] = handAuthoredComparisonArticles.map((item) =>
  generatedComparisonUpdates[item.slug] ? { ...item, ...generatedComparisonUpdates[item.slug] } : item
);

export const safetyArticles: EditorialResource[] = [
  {
    slug: "credits-vs-withdrawable-balances",
    code: "SAFE / 01",
    eyebrow: "Balance terminology",
    title: "Game Credits vs Withdrawable Balances",
    summary: "Learn why coins, points, bonuses, jackpots and visible balances may represent different things and require different written terms.",
    directAnswer: "A displayed game credit is not automatically cash and a visible balance is not automatically withdrawable. The app's written terms should define how each unit is earned, used, converted, restricted, expired and redeemed—and identify the operator responsible for the transaction.",
    read: "7 min",
    sections: [
      { heading: "One screen can contain several kinds of value", paragraphs: ["An app may display purchased credits, promotional bonus credits, play-only coins, pending rewards and an eligible withdrawal balance at the same time. Similar symbols or a rupee sign do not make the conditions identical."] },
      { heading: "Definitions the terms should provide", paragraphs: ["A useful policy explains the lifecycle of each balance rather than using “wallet” as a catch-all."], bullets: ["How the unit enters the account", "Whether it can be used as an entry fee", "Whether it can be converted or withdrawn", "Minimums, verification steps and time limits", "Expiry, cancellation and refund conditions", "The legal entity receiving or paying funds"] },
      { heading: "Warning signs in balance and withdrawal messages", paragraphs: ["Stop when a person demands another payment to release an existing balance, moves the conversation to a private account, asks for an OTP or PIN, or sends a payment destination that does not match the documented operator."] },
    ],
    checklist: ["Balance type defined", "Conversion rule written", "Withdrawal eligibility", "Minimum and timing", "Named payment entity", "Complaint route"],
    faqs: [["Does a rupee symbol mean the balance is cash?", "No. Read the written definition and redemption rules for that specific balance."], ["Can bonus credits be withdrawn?", "Only if the app's current terms explicitly allow it and explain the qualifying conditions."], ["Should I pay a fee to unlock a withdrawal?", "An unexpected extra payment demand is a serious warning sign. Preserve the evidence and verify through an accountable official channel."]],
  },
  {
    slug: "spin-app-reward-terms",
    code: "SAFE / 02",
    eyebrow: "Reward-language check",
    title: "How to Read Spin-App Reward Terms",
    summary: "Translate winning screens, bonus labels and withdrawal promises into the written conditions that determine whether a reward has usable value.",
    directAnswer: "A spin result or “winner” message is not enough to establish a payable reward. Check the eligibility rule, balance type, conversion condition, verification requirement, expiry, withdrawal limit and operator responsible for payment before treating the display as money.",
    read: "6 min",
    sections: [
      { heading: "Separate the animation from the agreement", paragraphs: ["Celebratory graphics are interface feedback. The enforceable meaning comes from the app's current terms, account ledger and identified operator. A jackpot label may describe a game event, a promotional pool or a conditional benefit rather than immediately withdrawable funds."] },
      { heading: "Read the conditions in sequence", paragraphs: ["Follow the reward from appearance to redemption. Missing steps create uncertainty about its value."], bullets: ["Who is eligible and in which locations", "Whether payment or play is required", "How the result is calculated or selected", "Which balance receives the reward", "What verification or play-through applies", "When the reward expires or may be cancelled"] },
      { heading: "Pressure is not verification", paragraphs: ["A countdown, urgent support message or claim that only one more deposit will release funds does not prove the reward. Verify through the documented operator and never share an OTP, UPI PIN or remote access to complete a withdrawal."] },
    ],
    checklist: ["Eligibility", "Result method", "Balance destination", "Conversion terms", "Expiry", "Withdrawal and complaint process"],
    faqs: [["Is a jackpot display a guaranteed payout?", "No. The display must be read together with the current rules, eligibility and redemption terms."], ["What is a wagering or play-through condition?", "It is a requirement that certain credited value be used in qualifying activity before redemption. The exact rule must be defined by the app's terms."], ["Can support ask for my OTP to release a reward?", "No legitimate verification should require you to disclose an OTP, UPI PIN, card PIN or device lock code to another person."]],
  },
  {
    slug: "yono-app-privacy-checklist",
    code: "SAFE / 03",
    eyebrow: "Account-data review",
    title: "Yono App Privacy Checklist",
    summary: "Review permissions, identity data, payment information, OTP handling and account-deletion terms before creating an app account.",
    directAnswer: "Before registering with a Yono-named gaming app, identify the operator and read how it handles phone numbers, identity documents, device data, payment information and support requests. Grant only permissions connected to a feature you chose, and never disclose an OTP, PIN or remote-control access.",
    read: "8 min",
    sections: [
      { heading: "Know who receives the data", paragraphs: ["A privacy policy should name the responsible entity and provide a meaningful contact route. A generic policy that never identifies the operator makes it difficult to understand who stores the data or handles a complaint."] },
      { heading: "Map each data request to a purpose", paragraphs: ["The app should explain why it needs the information, whether the field is mandatory, who receives it and how long it is retained."], bullets: ["Phone number and one-time-code handling", "Identity or age-verification documents", "Bank, card or UPI-related data", "Device identifiers and analytics", "Contacts, SMS, camera, microphone or location", "Deletion, correction and complaint procedures"] },
      { heading: "Support channels need verification too", paragraphs: ["A Telegram name, caller ID, social profile or screenshot is not enough to prove that a person represents the operator. Use a contact route published consistently on the app's own domain and policies, and never provide remote phone control."] },
    ],
    checklist: ["Operator named", "Purpose explained", "Sensitive fields minimized", "Permissions proportionate", "Retention stated", "Deletion and complaint route"],
    faqs: [["Should a game read my contacts?", "Only a clearly explained, user-selected feature could justify it. Contacts include other people's data, so deny broad access when the purpose is unclear."], ["Can support ask for an OTP?", "Do not disclose an OTP to another person. Enter a code only into the verified service flow you intentionally initiated."], ["What if the privacy policy uses another company name?", "Treat the mismatch as unresolved until the app explains the relationship with reliable evidence."]],
  },
];

export const jaihoCollection = {
  slug: "jaiho-apps",
  title: "Jaiho Apps Explained",
  summary: "A navigational map for the seven Jaiho records in this catalog, including 777, 91, Arcade, Rummy, Slots, Spin and Win.",
  directAnswer: "Jaiho 777, Jaiho 91, Jaiho Arcade, Jaiho Rummy, Jaiho Slots, Jaiho Spin and Jaiho Win are maintained as separate catalog records. The shared Jaiho prefix helps users discover the family of names; it does not by itself prove that every app has the same operator, APK package, account or payment system.",
  appSlugs: ["jaiho-777", "jaiho-91", "jaiho-arcade", "jaiho-rummy", "jaiho-slots", "jaiho-spin", "jaiho-win"],
};

