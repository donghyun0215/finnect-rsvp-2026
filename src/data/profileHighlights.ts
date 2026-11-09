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
      ["USD 8.45M", "2025 revenue"],
      ["USD 1.8M", "government grants secured"],
      ["3", "PoCs under way: CMA CGM, Hyundai Samho, J Ocean"],
    ],
    problem: "Carbon rules for shipping keep getting more complex, and the data sits scattered.",
    fix: "Maritime-specific AI: MarinaNet for noon reports and compliance, MarinaDocs for documents.",
    asks: ["Potential customers", "Data partners"],
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
  // From their one-pagers (9 Nov).
  ztosigma: {
    stats: [
      ["1,582", "users"],
      ["93%", "annual paid retention (Paywork)"],
      ["1.3M", "transaction records since 2022"],
    ],
    problem: "Industrial orders and quotes run on phone calls, and follow-ups get lost between calls and files.",
    fix: "Keeper AI turns each customer call into next actions in Paywork, with the customer's history attached.",
    asks: ["Industrial pilots in Singapore", "Local partners", "Pre-A investors"],
  },
  elevenliter: {
    stats: [
      ["KRW 1.36B", "revenue in Jan–Sep 2026 alone (USD 0.9M)"],
      ["67.8%", "loss ratio on Lifet Pet Insurance, about half the market"],
      ["150K+", "AI tests run"],
    ],
    problem: "Pet insurers price on age and breed alone and miss progressive diseases, the top cause of claims.",
    fix: "One smartphone photo, graded by AI in 3 seconds, so insurers can accept and price each pet.",
    asks: ["Pet insurers for an underwriting PoC", "API partners that sell pet insurance", "Series A VCs", "Supplement distributors"],
  },
  atones: {
    stats: [
      ["KRW 890M+", "cumulative payments since Aug 2024 (USD 660K)"],
      ["3.0x", "2026 volume by September vs all of 2025"],
      ["180+", "merchant locations; 4,500 users"],
    ],
    problem: "Most wallets take one card per payment, and group bills leave the rewards with whoever paid.",
    fix: "Split one purchase across several cards with one authentication, or let each person pay their share.",
    asks: ["PoCs with SEA payment providers and wallets", "Platforms licensing the SDKs", "Pre-Series A investors"],
  },
  moneyguard: {
    stats: [
      ["USD 397M", "in IOUs signed, across 20,000 agreements"],
      ["3 min", "to sign a legally usable IOU on a phone"],
      ["40%", "repeat rate (2026)"],
    ],
    problem: "A bank transfer to family can't prove it was a loan, and paper IOUs need a notary.",
    fix: "A mobile IOU signed in 3 minutes with PASS ID, accepted as evidence by a Korean court.",
    asks: ["Banks in Southeast Asia", "Legal-tech partners", "Investors"],
  },
};
