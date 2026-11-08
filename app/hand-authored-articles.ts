import type { AppArticle } from "./app-content";

/**
 * Hand-authored, git-tracked equivalent of app/generated/app-articles.generated.ts
 * for app records the content pipeline hasn't reached yet. See catalog.ts: the
 * pipeline's output always takes precedence over this file for the same slug, so
 * this is safe to keep even if the pipeline later processes one of these records.
 *
 * Each entry follows the same structure and research standard as the pipeline's
 * own output: specific, verifiable facts about the record's actual download
 * domain and naming pattern (drawn from catalog.ts's real downloadUrl values),
 * not generic template filler.
 */
export const handAuthoredAppArticles: Record<string, AppArticle> = {
  "mbm-bet": {
    directAnswer:
      "MBM Bet is catalogued here as a general gaming-app record whose name explicitly references betting. Its supplied download source is `mbmbet21.com` — a numbered domain, not a plain `mbmbet.com`. Before following that link, confirm the final destination, the Android package identity and the written terms for any balance the app displays as a “bet.”",
    sections: [
      {
        heading: "Why does the download domain say “mbmbet21”, not “mbmbet”?",
        paragraphs: [
          "Real-money gaming operators commonly publish through a series of numbered mirror domains — `mbmbet21.com` today, potentially a different number next month — rather than one fixed address. The number itself does not identify a specific version of the app or confirm anything about the operator; it is simply how that destination is currently reachable.",
          "Treat each numbered domain as its own destination to check, not as a variant of a trusted one. A different number is not proof the operator changed, and the same number is not proof it didn’t.",
        ],
      },
      {
        heading: "MBM Bet APK and installation checks",
        paragraphs: [
          "An APK obtained through a referral link should still be checked like any other unfamiliar Android file: compare the package identity and signing information across updates, and treat a renamed or mirrored installer as a separate, unverified source.",
        ],
        bullets: [
          "Confirm the final destination after any redirect, not just the first link clicked",
          "Compare the Android package name and signer on every update, not only the first install",
          "Be cautious if the app asks to disable standard device protections to install",
        ],
      },
      {
        heading: "MBM Bet account, OTP and privacy checks",
        paragraphs: [
          "A betting-style account typically asks for a phone number and OTP at minimum. Find out which organisation actually receives that data and whether its privacy terms offer a working correction or deletion request route before registering.",
        ],
      },
      {
        heading: "MBM Bet balances, bets and withdrawal claims",
        paragraphs: [
          "The name “Bet” implies wagering outcomes, but it is a name, not a result. A displayed balance, bonus credit or “win” figure is not automatically the same as withdrawable money. Read the written rules for how a balance moves from in-app credit to an actual payout, including any minimum, fee or verification step, before relying on it.",
        ],
      },
    ],
    faqs: [
      ["Is MBM Bet a real-money betting app?", "The name references betting, but this record does not confirm whether real-money wagering is offered, nor its legal status in any location. Read the app’s own terms and check current local rules before registering or paying."],
      ["Why does the download link say mbmbet21.com instead of mbmbet.com?", "Operators in this space often publish through numbered mirror domains that change over time. The number is part of how the destination is currently reachable; it does not by itself confirm or disprove who operates it."],
      ["Is MBM Bet safe to use?", "No blanket safety claim is made here. Safety depends on the current file, the operator behind `mbmbet21.com`, its permissions and its account and payment practices — all of which can change after this record was last reviewed."],
      ["Does Yono Play Store operate MBM Bet?", "No. Yono Play Store is an independent catalog record and does not host, operate or control the external destination this record links to."],
    ],
    datePublished: "2026-11-08",
    dateModified: "2026-11-08",
    seoTitle: "MBM Bet APK: Download Source, Domain and Safety Checks",
    seoDescription: "Review the MBM Bet app record: why its download source is a numbered domain, APK and permission checks, account privacy and withdrawal-claim guidance.",
  },

  "dhan-game": {
    directAnswer:
      "Dhan Game is catalogued here as a general gaming-app record. “Dhan” means wealth or money in Hindi and is reused across several unrelated apps, so the name alone does not identify one operator. Its supplied download source is `dhangamereferral.com` — a domain that identifies itself as a referral destination rather than a plain brand domain.",
    sections: [
      {
        heading: "What does “Dhan” in the name actually tell you?",
        paragraphs: [
          "“Dhan” is a common Hindi word for wealth, used in the names of many unrelated gaming and finance-adjacent apps. Seeing it in a name is not evidence of a single operator, a banking link or an official status — match the full name, the final domain and the operator identity together instead of relying on the word alone.",
        ],
      },
      {
        heading: "Why the download domain says “referral”",
        paragraphs: [
          "`dhangamereferral.com` names itself as a referral destination in the domain itself. That is a more transparent naming choice than most agent domains, but it also means the page you land on is explicitly an intermediary step, not necessarily the operator’s own primary site. Support, account and payment questions may need to be directed to whoever operates the destination you actually reach after following the link, which this record cannot confirm.",
        ],
      },
      {
        heading: "Dhan Game APK and installation checks",
        paragraphs: [
          "Treat the file reached through a referral domain the same as any other unfamiliar APK: check the package identity and signer, and recheck both on every update rather than assuming continuity from the icon alone.",
        ],
      },
      {
        heading: "Dhan Game account, OTP and privacy checks",
        paragraphs: [
          "Before registering, look for a privacy notice that states who collects your phone number and other details, why, and how long it is retained. Never share an OTP, UPI PIN or device unlock code with anyone claiming to need it for account verification.",
        ],
      },
      {
        heading: "Dhan Game balances and withdrawal claims",
        paragraphs: [
          "A displayed balance, bonus or reward inside the app is not automatically withdrawable cash. Read the written terms for how credit converts to a payout, what minimum or fee applies, and match the party that actually processes a withdrawal to the operator the referral domain is meant to represent.",
        ],
      },
    ],
    faqs: [
      ["Does “Dhan” mean this app is government-linked or regulated?", "No. “Dhan” is simply the Hindi word for wealth and is used in multiple unrelated app names. It carries no regulatory or official meaning by itself."],
      ["What is dhangamereferral.com?", "It is the download destination currently supplied for this record. The domain name identifies it as a referral page; this record cannot confirm who ultimately operates the app behind it."],
      ["Is Dhan Game the same as other money-themed apps in this catalog?", "Not necessarily. Share a word like “Dhan” does not establish a shared operator, APK or account system — treat each record as a separate identity."],
      ["Who do I contact if Dhan Game withholds a withdrawal?", "This record cannot provide operator contact details it does not have. Use whatever support channel the destination site itself documents, and consider an official cybercrime-reporting channel if a transfer appears deceptive."],
    ],
    datePublished: "2026-11-08",
    dateModified: "2026-11-08",
    seoTitle: "Dhan Game APK: Referral Source, Identity and Safety Checks",
    seoDescription: "What “Dhan” in Dhan Game's name means, why its download source identifies itself as a referral domain, APK checks, account privacy and withdrawal-claim guidance.",
  },

  "win-rummy": {
    directAnswer:
      "Win Rummy is catalogued here as a rummy and card-game record. “Win” is part of the name, not a result — it does not indicate that using the app leads to winnings. Its supplied download source is `winrummy45.com`, a numbered domain rather than a plain `winrummy.com`.",
    sections: [
      {
        heading: "Does the name “Win Rummy” mean players win?",
        paragraphs: [
          "No. “Win” is a common marketing word in rummy app names and is not a claim this catalog can verify or certify. Game outcomes depend on the specific rules, opponents and format of the current app, none of which the name itself documents.",
        ],
      },
      {
        heading: "Why does the domain include “45”?",
        paragraphs: [
          "Like several other records in this catalog, Win Rummy’s supplied source is a numbered mirror domain — `winrummy45.com` — rather than a single fixed address. Operators in this space commonly rotate through numbered domains over time; the number is part of how the destination is currently reachable and is not itself evidence about the operator.",
        ],
      },
      {
        heading: "Win Rummy APK and signer checks",
        paragraphs: [
          "Compare the Android package identity and signing information across updates. A file with the same name but a different package or signer should be treated as a separate, unverified source regardless of how familiar the icon looks.",
        ],
      },
      {
        heading: "Win Rummy account, OTP and privacy checks",
        paragraphs: [
          "A rummy account typically requires a phone number and OTP. Check which organisation receives that information and whether its privacy policy offers a working route to correct or delete it before registering.",
        ],
      },
      {
        heading: "Win Rummy table rules, bonuses and withdrawals",
        paragraphs: [
          "Read the written rules for table entry, promotional bonuses and withdrawal conditions before adding money. A bonus credit is frequently subject to wagering requirements before it becomes withdrawable — the app’s own terms, not the name, determine that.",
        ],
      },
    ],
    faqs: [
      ["Does the name “Win Rummy” mean I will win?", "No. It is a name, not a result. Outcomes depend on the app’s actual game rules and opponents, which this record does not certify."],
      ["Why does winrummy45.com have a number in it?", "Operators in this space commonly publish through numbered mirror domains that change over time. The number is not by itself evidence of who operates the destination."],
      ["Is Win Rummy different from other rummy apps with similar names?", "Treat it as a separate identity. A shared word like “Rummy” or “Win” across different app names does not establish a common operator, APK or account system."],
      ["Is Win Rummy legal to play?", "Rules for real-money rummy vary by Indian state and have changed recently. Listing in this catalog does not establish that paid play is permitted where you live — check current official guidance first."],
    ],
    datePublished: "2026-11-08",
    dateModified: "2026-11-08",
    seoTitle: "Win Rummy APK: Domain, Identity and Payment-Term Checks",
    seoDescription: "Win Rummy app record: why its download source is a numbered domain, what the name does and doesn't claim, APK checks, account privacy and payment-term guidance.",
  },

  "567-slots": {
    directAnswer:
      "567 Slots is catalogued here as a slots-style gaming record. Number sequences like “567” are reused across unrelated slot apps, so the digits alone do not identify one operator. Its supplied download source is `join567slots.cc` — note the “join” prefix and the `.cc` domain ending, both worth checking rather than assuming.",
    sections: [
      {
        heading: "Is “567” part of a family of numbered apps?",
        paragraphs: [
          "Digit sequences are a common naming device across slots apps in this catalog and beyond, similar to how “91”, “888” and “77” appear across several separately operated rummy records. Seeing “567” on a page or file is not evidence it belongs to this specific record — match the full domain and package identity, not the number alone.",
        ],
      },
      {
        heading: "What the “join” prefix and the .cc ending mean",
        paragraphs: [
          "`join567slots.cc` combines a call-to-action word (“join”) with a less common top-level domain (`.cc`) rather than the app’s plain name on a `.com` address. Neither detail by itself means the destination is unsafe, but a domain built this way is also easy to swap or replace without visitors noticing — treat the exact current domain as something to re-check each time, not something to memorise once.",
        ],
      },
      {
        heading: "567 Slots APK and permission checks",
        paragraphs: [
          "Check the Android package identity and signing information for any installer reached through this link, and recheck both on future updates rather than assuming the same file is being offered each time.",
        ],
      },
      {
        heading: "567 Slots account and privacy checks",
        paragraphs: [
          "Look for a privacy notice stating what data is collected at registration, why, and how a correction or deletion request can be made, before sharing a phone number or other personal details.",
        ],
      },
      {
        heading: "567 Slots reels, credits and withdrawal claims",
        paragraphs: [
          "Treat every displayed coin total, jackpot figure or bonus as a status, not a payout promise. Promotional, pending and withdrawable are different stages — the app’s written terms, not the display, determine which applies.",
        ],
      },
    ],
    faqs: [
      ["Is 567 Slots related to other numbered slot apps?", "Not necessarily. A shared digit sequence does not establish a common operator, APK or account system between separately listed records."],
      ["What does the .cc domain ending mean?", "`.cc` is a less commonly used top-level domain. It does not by itself indicate the destination is unsafe, but a domain built around a generic action word plus an uncommon ending is also easier to replace without notice — recheck the exact current domain each visit."],
      ["Is a “join” domain the same as an official app site?", "Not necessarily. “Join” is a call-to-action word, not a brand name confirming official status."],
      ["How are slot credits different from withdrawable cash?", "A displayed credit or jackpot figure is often promotional or conditional until the app’s own terms confirm it has become withdrawable. Read those terms rather than assuming the displayed number is spendable."],
    ],
    datePublished: "2026-11-08",
    dateModified: "2026-11-08",
    seoTitle: "567 Slots APK: Domain, Source and Jackpot-Claim Checks",
    seoDescription: "567 Slots app record: the join567slots.cc download source explained, numbered-name confusion, APK checks, account privacy and jackpot/credit-term guidance.",
  },

  "club-inr": {
    directAnswer:
      "Club INR is catalogued here as a general gaming-app record. “INR” references the Indian Rupee and appears in several unrelated app names; it does not indicate an official or banking-linked status. Its supplied download source is `clubinr2.top` — a numbered domain on an uncommon `.top` ending.",
    sections: [
      {
        heading: "Does “INR” mean this app is linked to Indian banking authorities?",
        paragraphs: [
          "No. “INR” is simply the currency code for the Indian Rupee and is used descriptively in many unrelated app names to signal real-money or rupee-denominated features. It is not issued, licensed or endorsed by any banking authority because of the name.",
        ],
      },
      {
        heading: "Why the domain is clubinr2.top, not clubinr.com",
        paragraphs: [
          "The supplied source combines a numbered suffix (“2”) with a `.top` domain ending rather than the app’s plain name on a standard `.com` address — a pattern seen across several records in this catalog. Treat the exact current domain as something to check at the time you visit, since these addresses can change.",
        ],
      },
      {
        heading: "Club INR APK and installation checks",
        paragraphs: [
          "Compare the Android package identity and signer for the installer reached through this link, and recheck on future updates rather than assuming the file stays the same.",
        ],
      },
      {
        heading: "Club INR account and privacy checks",
        paragraphs: [
          "Find out which organisation receives your phone number or other details at registration and whether its privacy terms offer a working correction or deletion route before proceeding.",
        ],
      },
      {
        heading: "Club INR balances and withdrawal terms",
        paragraphs: [
          "A displayed INR balance inside the app is not automatically real, withdrawable money. Read the written terms for how a balance converts to a payout, including any minimum amount, fee or verification step.",
        ],
      },
    ],
    faqs: [
      ["Does “INR” mean Club INR is linked to Indian banking authorities?", "No. INR is simply the currency code for the Indian Rupee, used descriptively; it carries no regulatory or banking endorsement."],
      ["Why does the domain end in .top?", "It is a less common top-level domain some operators in this space use instead of `.com`. It is not by itself evidence the destination is unsafe, but worth noting and rechecking at each visit."],
      ["What does the “2” in clubinr2.top mean?", "It most likely indicates a numbered mirror or current-version domain, a pattern used by several records in this catalog. It does not confirm anything about the operator on its own."],
      ["Is Club INR the same as other “Club” apps in this catalog?", "Treat each as a separate record. A shared word in the name does not establish a common operator, APK or account system."],
    ],
    datePublished: "2026-11-08",
    dateModified: "2026-11-08",
    seoTitle: "Club INR APK: Domain, Identity and Withdrawal-Term Checks",
    seoDescription: "Club INR app record: what the INR name does and doesn't mean, the clubinr2.top download source explained, APK checks, privacy and withdrawal-term guidance.",
  },

  "ind-slots": {
    directAnswer:
      "IND Slots is catalogued here as a slots-style gaming record. “IND” is a common India-referencing prefix shared with other, separately operated records in this catalog — it is not evidence of an official or government-linked status. Its supplied download source is `indslotsgame.com`.",
    sections: [
      {
        heading: "Does “IND” mean this is an Indian government or officially regulated app?",
        paragraphs: [
          "No. “IND” is a common prefix used descriptively across unrelated apps to signal an India focus, and this catalog separately lists other IND-prefixed records such as IND Club and IND Rummy. Sharing the prefix does not establish a common operator, APK or account system between them — treat each as its own identity.",
        ],
      },
      {
        heading: "IND Slots download source and domain checks",
        paragraphs: [
          "`indslotsgame.com` is the destination currently supplied for this record. As with any download source, confirm you land on that exact domain after following the link rather than a redirect to a different address, and recheck it on future visits since these destinations can change.",
        ],
      },
      {
        heading: "IND Slots APK and permission checks",
        paragraphs: [
          "Compare the Android package identity and signing information for the installer, and recheck both on future updates rather than assuming continuity from the icon or name alone.",
        ],
      },
      {
        heading: "IND Slots account and privacy checks",
        paragraphs: [
          "Look for a privacy notice explaining what data is collected at registration and how a correction or deletion request can be made before sharing a phone number or other personal details.",
        ],
      },
      {
        heading: "IND Slots jackpots, credits and withdrawals",
        paragraphs: [
          "A displayed jackpot or credit figure is a status, not a guaranteed payout. Read the app’s written terms for how a balance becomes withdrawable, including any minimum, fee or verification step, before relying on it.",
        ],
      },
    ],
    faqs: [
      ["Is IND Slots an Indian government-approved app?", "No. “IND” is a descriptive prefix, not a regulatory marker. This record does not establish any government or official link."],
      ["Is IND Slots related to IND Club or IND Rummy?", "Not necessarily. These are separately catalogued records; a shared “IND” prefix does not by itself establish a common operator, APK or account system."],
      ["What does indslotsgame.com tell me about the operator?", "Only that it is the currently supplied download destination. It does not by itself confirm who operates it — check the site’s own identity and support details."],
      ["Are slot jackpots in IND Slots real money?", "Not necessarily. Treat a displayed jackpot as promotional until the app’s own written terms confirm it is withdrawable, and under what conditions."],
    ],
    datePublished: "2026-11-08",
    dateModified: "2026-11-08",
    seoTitle: "IND Slots APK: Domain, Identity and Jackpot-Claim Checks",
    seoDescription: "IND Slots app record: what the IND prefix does and doesn't mean, the indslotsgame.com download source, APK checks, privacy and jackpot/withdrawal-term guidance.",
  },
};
