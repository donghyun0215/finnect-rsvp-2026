// FIN:NECT Global Singapore 2026 — Korean fintech cohort.
// Source: "[마스터파일] 핀테크지원센터_현지프로그램" › 2026 스타트업 명단 (12 Oct):
// each company's own English service overview (서비스 개요 영문) as the
// tagline. Funding amounts, revenue and the MYSC diagnostic notes in that
// sheet are internal and stay out. Eight companies from the centre so far;
// two more come from 전북창경원 (1:1 밋업 sheet, 12 Oct) — names not yet given.
// IR decks are NOT published (CMK lesson, 7 Oct). Sector labels are ours.

export interface Company {
  slug: string;
  name: string;
  displayName: string;
  tagline: string;
  sector: string;
  stage: string;
  track: "track1" | "track2";
  website: string;
  email: string;
  phone: string;
  problem: string[];
  solution: string[];
  keyFeatures: string[];
  targetAudience: string[];
  businessModel: string[];
  businessSnapshot: string[];
  team: { name: string; role: string; bio: string[] }[];
  seekingOpportunities: string[];
  /** Public path to an English IR deck PDF. Left unset on purpose (see above). */
  irdeck?: string;
  /** Public path to the programme one-pager PDF. */
  onepager?: string;
}

// One cohort on this event; track2 kept empty so shared components compile.
export const TRACKS = {
  track1: {
    title: "FIN:NECT Global Singapore 2026",
    theme: "Korean fintech startups selected by the Korea Fintech Support Center",
    dates: "19 November 2026",
  },
  track2: {
    title: "",
    theme: "",
    dates: "",
  },
} as const;

export const companies: Company[] = [
  {
    slug: "276holdings",
    name: "276 Holdings",
    displayName: "276 HOLDINGS",
    tagline: "An SNPL (Settle Now, Pay Later) supply chain finance service that resolves SME working capital bottlenecks, powered by the AI credit scoring model FlowScore.",
    sector: "Payments · Financial data",
    stage: "Series B · founded 2019",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [],
    solution: ["SNPL supply chain finance for SMEs, underwritten by FlowScore, an AI credit scoring model."],
    keyFeatures: [],
    targetAudience: [],
    businessModel: [],
    businessSnapshot: [],
    team: [],
    seekingOpportunities: [],
  },
  {
    slug: "devd",
    name: "DEVD",
    displayName: "DEVD Co., Ltd.",
    tagline: "ZIPUP PAY: a rent-payment infrastructure that verifies leases, screens transaction risk, routes payments, and settles rent to landlords while tenants pay by card.",
    sector: "Payments · Security & authentication",
    stage: "Pre-A · founded 2022",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [],
    solution: ["ZIPUP PAY: lease verification, transaction-risk screening and payment routing, with rent settled to landlords while tenants pay by card."],
    keyFeatures: [],
    targetAudience: [],
    businessModel: [],
    businessSnapshot: [],
    team: [],
    seekingOpportunities: [],
  },
  {
    slug: "marinachain",
    name: "MarinaChain",
    displayName: "MarinaChain",
    tagline: "An AI-powered maritime carbon and financial data platform that automates vessel emissions data processing and supports regulatory compliance and carbon allowance procurement.",
    sector: "Financial data · Maritime carbon",
    stage: "Pre-A · founded 2023",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [],
    solution: ["Automates vessel emissions data processing.", "Supports regulatory compliance and carbon allowance procurement."],
    keyFeatures: [],
    targetAudience: [],
    businessModel: [],
    businessSnapshot: [],
    team: [],
    seekingOpportunities: [],
  },
  {
    slug: "bigtechplus",
    name: "BigTech Plus",
    displayName: "BigTech Plus Inc.",
    tagline: "HomeQ · DocQ: real estate rights and collateral verification infrastructure that prevents households from losing their housing assets and automates collateral underwriting for lenders.",
    sector: "Personal finance · Big data analytics",
    stage: "Series A · founded 2019",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [],
    solution: ["HomeQ · DocQ: automated public-record verification for real estate rights and collateral.", "Protects households' housing assets and automates collateral underwriting for lenders."],
    keyFeatures: [],
    targetAudience: [],
    businessModel: [],
    businessSnapshot: [],
    team: [],
    seekingOpportunities: [],
  },
  {
    slug: "sionic",
    name: "Sionic AI",
    displayName: "Sionic AI",
    tagline: "STORM Platform: an all-in-one, no-code AI agent builder that enables financial institutions to design, deploy, and scale enterprise AI agents on demand.",
    sector: "AI · Enterprise agents",
    stage: "Series A · founded 2023",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [],
    solution: ["STORM Platform: design, deploy and scale enterprise AI agents without code."],
    keyFeatures: [],
    targetAudience: [],
    businessModel: [],
    businessSnapshot: [],
    team: [],
    seekingOpportunities: [],
  },
  {
    slug: "aizen",
    name: "AIZEN Global",
    displayName: "AIZEN Global Co., Inc.",
    tagline: "CreditConnect: AI-powered, data-driven financial services for financial institutions and mobility platform companies across Southeast Asia, with Singapore as its regional hub.",
    sector: "Financial data · AI credit",
    stage: "Series C · founded 2016",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [],
    solution: ["CreditConnect: data-driven financial service innovation for financial institutions and mobility platforms."],
    keyFeatures: [],
    targetAudience: [],
    businessModel: [],
    businessSnapshot: [],
    team: [],
    seekingOpportunities: [],
  },
  {
    slug: "canopy",
    name: "Canopy",
    displayName: "Canopy Inc.",
    tagline: "A payroll data-driven employee financial wellness platform.",
    sector: "Personal finance · Financial software",
    stage: "Seed · founded 2024",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [],
    solution: ["Financial wellness services for employees, built on payroll data."],
    keyFeatures: [],
    targetAudience: [],
    businessModel: [],
    businessSnapshot: [],
    team: [],
    seekingOpportunities: [],
  },
  {
    slug: "crosshub",
    name: "Crosshub",
    displayName: "Crosshub",
    tagline: "VoiceAI-based authentication and payment solutions.",
    sector: "Payments · Voice AI authentication",
    stage: "Pre-A · founded 2024",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [],
    solution: ["Voice AI authentication and payment solutions."],
    keyFeatures: [],
    targetAudience: [],
    businessModel: [],
    businessSnapshot: [],
    team: [],
    seekingOpportunities: [],
  },
];

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

// Companies that take 1:1 bookings: the whole cohort on this event.
export const MEETUP_COMPANIES: Company[] = companies;
