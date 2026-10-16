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
      ["US$26.1M", "annualised GMV run-rate, July 2026"],
      ["73%", "of renters pay again every month"],
      ["Zero", "financial incidents since launch"],
    ],
    problem: "Newcomers owe deposit and rent on arrival, months before local banking is ready.",
    fix: "Tenants pay rent by card. Landlords still receive a local bank transfer.",
    asks: ["Singapore rent-corridor partners", "A pilot with Finmo", "Employers, HR teams and landlords", "Investors and MoU partners"],
  },
  marinachain: {
    stats: [
      ["1st", "OpenAI SF 2024 and K-Startup Grand Challenge"],
      ["Top 8", "Global Shell StartUp Engine 2024"],
      ["4", "regimes filed: IMO DCS, CII, EU MRV, FuelEU"],
    ],
    problem: "Emissions data starts as hand-typed emails and ends as a year-end scramble.",
    fix: "Crews CC MarinaChain on their Noon Reports, and AI prepares the compliance filings.",
    asks: ["Shipowners and ship managers", "AI pilot partners in any industry"],
  },
  bigtechplus: {
    stats: [
      ["KRW 7.77B", "2025 revenue (about USD 5.5M)"],
      ["10", "banks, insurers and platforms live, incl. KakaoBank"],
      ["KRW 5.7B", "Series A, 2025"],
    ],
    problem: "Korea's largest household asset is still checked by hand from paper registers.",
    fix: "Property data APIs that let banks verify rights and value inside the loan flow.",
    asks: ["Banks, lenders and insurers", "Proptech and real estate platforms", "Strategic investors and data partners"],
  },
  sionic: {
    stats: [
      ["3", "markets live: Korea, Japan, Thailand"],
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
      ["30,000+", "users across 50+ enterprise clients"],
      ["40x", "growth in advances in 1H 2026"],
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
};
