// Editorial layer for the startup profiles: three headline numbers, a
// one-line problem and fix, and a short name for each "seeking" item (same
// order as seekingOpportunities in companies.ts). Every figure is taken from
// the company's one-pager or IR deck as summarised in companies.ts; the full
// text stays on the page under these.
export interface Highlight {
  stats: [value: string, label: string][];
  problem: string;
  fix: string;
  asks: string[];
}

export const HIGHLIGHTS: Record<string, Highlight> = {
  "276holdings": {
    stats: [
      ["USD 7.2M", "FlowPay volume in H1 2026 alone"],
      ["0.22%", "realised loss across 1,295 deals"],
      ["Breakeven", "reached in H1 2026"],
    ],
    problem: "SMEs pay suppliers upfront, then wait months for buyers to pay them.",
    fix: "276 buys the materials for them and finances the order through to collection.",
    asks: ["Pre-Series B investors", "Debt facility partners", "SNPL launch partners in ASEAN"],
  },
  devd: {
    stats: [
      ["KRW 1.08B", "revenue in 2025"],
      ["KRW 1.27B", "raised to date, incl. a May 2026 Pre-A"],
      ["TIPS", "selected; works with NHN, Hana Card, Woori and BNK Kyongnam"],
    ],
    problem: "Most landlords only take bank transfers, so rent can't go on a card.",
    fix: "Rent on a credit card for tenants, regular settlement for landlords.",
    asks: ["PSPs, banks, proptech and coliving operators", "Regional investors and market validation"],
  },
  marinachain: {
    stats: [
      ["1st", "OpenAI SF 2024 and K-Startup Grand Challenge"],
      ["Top 8", "Global Shell StartUp Engine 2024"],
      ["4", "regimes covered: IMO DCS, CII, EU MRV, FuelEU"],
    ],
    problem: "Emissions data starts as hand-typed emails and ends as a year-end scramble.",
    fix: "Crews CC MarinaChain on their Noon Reports, and AI prepares the compliance filings.",
    asks: ["Shipowners and ship managers", "AI pilot partners in any industry"],
  },
  bigtechplus: {
    stats: [
      ["KRW 7.77B", "2025 revenue (about USD 5.5M)"],
      ["10", "financial groups and platforms live, incl. KakaoBank"],
      ["KRW 5.7B", "Series A, 2025"],
    ],
    problem: "Korea's largest household asset is still checked by hand from official registers.",
    fix: "Property data APIs that let banks verify rights and value inside the loan flow.",
    asks: ["Banks, lenders and insurers", "Proptech and real estate platforms", "Strategic investors and data partners"],
  },
  sionic: {
    stats: [
      ["3", "markets: Korea, Japan and a delivery in Thailand"],
      ["5+", "partner-led contracts in Japan in year one"],
      ["4", "platform languages, incl. Japanese and Thai"],
    ],
    problem: "Every new AI use case means another custom build, and few of them are auditable.",
    fix: "One no-code platform to build, deploy and govern enterprise AI agents.",
    asks: ["Enterprises with an AI agent use case", "Singapore SIs and resellers", "Model and infrastructure providers"],
  },
  aizen: {
    stats: [
      ["US$20M+", "ARR, growing about 25% a quarter"],
      ["~20,000", "EV two-wheelers on the road in Indonesia"],
      ["US$38.8M", "equity raised"],
    ],
    problem: "Gig drivers have no credit history, and banks can't price an electric vehicle.",
    fix: "AIZEN finances EV fleets and underwrites them on live vehicle and battery data.",
    asks: ["Growth-equity and strategic investors", "Credit partners to reach 100k+ vehicles", "Mobility, OEM and battery partners"],
  },
  canopy: {
    stats: [
      ["30,000+", "users, plus 50+ enterprise clients"],
      ["40x", "growth in cumulative advances, 1H 2026"],
      ["83%", "user retention"],
    ],
    problem: "Value is earned every day, but wages arrive once a month.",
    fix: "Employees withdraw wages they have already earned. Not a loan, zero interest.",
    asks: ["PoC partners: banks, payroll, wallets", "Employers piloting a free benefit", "Investors for the upcoming round"],
  },
  crosshub: {
    stats: [
      ["CES 2026", "Best of Innovation, FinTech"],
      ["Woori Bank", "strategic partner"],
      ["$4.3M", "total funding"],
    ],
    problem: "Visitors arrive without local ID or local payments, and travel services don't connect.",
    fix: "Verify identity before arrival, get a card, and pay for the whole trip in one app.",
    asks: ["Banks and fintechs", "Strategic and PoC partners"],
  },
  // Added 20 Oct, before their one-pagers (due 21 Oct). Sources as noted in
  // companies.ts; Atones and Money Guard have no asks until MYSC sends them.
  ztosigma: {
    stats: [
      ["36,588", "business sites on the platform in Korea"],
      ["1.3M+", "transaction documents recorded"],
      ["KRW 450B", "in transactions on the platform"],
    ],
    problem: "Field businesses still run on calls, faxes and memory, so the context of every deal sits in a few people's heads.",
    fix: "Keeper AI links calls, transactions and payments, remembers each deal and takes the next step.",
    asks: ["Field B2B companies for interviews and demos", "PoC and business partners", "VCs in AI, B2B SaaS and fintech"],
  },
  elevenliter: {
    stats: [
      ["DB Insurance", "pet insurance co-developed and launched"],
      ["Samsung", "SmartThings Pet Care AI checks, US launch Sep 2026"],
      ["19", "patents filed in Korea and abroad"],
    ],
    problem: "Pet insurers can't see a pet's health, so they can't price its risk.",
    fix: "A smartphone photo check that scores progressive conditions, so insurers can underwrite each pet.",
    asks: ["Pet insurers for a PoC", "Insurers and insurtechs in Japan, the Americas and East Asia", "Insurance and fintech investors"],
  },
  atones: {
    stats: [
      ["2,000+", "users since the August 2025 launch"],
      ["KRW 220M", "in payments processed (January 2026)"],
    ],
    problem: "Several cards in the wallet, one bill at the till, and no easy way to split it.",
    fix: "Scan one QR code and split the payment across several cards, in the amounts you choose.",
    asks: [],
  },
  moneyguard: {
    stats: [
      ["TIPS", "selected for Korea's tech-startup programme, 2024"],
      ["Seoul Fintech Lab", "member company"],
    ],
    problem: "Getting back money you're owed is slow and awkward, and you usually do it alone.",
    fix: "Record the promise once; the recovery steps follow automatically, with formal collection through a licensed partner.",
    asks: [],
  },
};
