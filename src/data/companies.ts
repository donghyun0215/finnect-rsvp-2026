// FIN:NECT Global Singapore 2026 — Korean fintech cohort.
// Source: "[마스터파일] 핀테크지원센터_현지프로그램" › 2026 스타트업 명단 (12 Oct):
// each company's own English service overview (서비스 개요 영문) as the
// tagline. Funding amounts, revenue and the MYSC diagnostic notes in that
// sheet are internal and stay out. Ops deck (12 Oct): 12 companies — these
// 8 selected, plus alumni 머니가드서비스 · 앳원스 and 전북창경 십일리터 ·
// 지투시그마 (Tenity programme + visits; 전북 pair also get one online 1:1
// with LodestarT). Those four were added on MYSC's request (20 Oct):
// 십일리터 · 지투시그마 from their 전북창경 applications as summarised in the
// master file (service overview, public milestones only); 앳원스 ·
// 머니가드서비스 have no data in the master file yet, so their lines come from
// press coverage (Money Today, Jan 2026; Hankyung, Aug 2025) and stay short.
// All four one-pagers are due 21 Oct; replace these entries then.
// IR decks are NOT published (CMK lesson, 7 Oct). Sector labels are ours.
// Profile sections (16 Oct): from each company's FIN:NECT one-pager where
// MYSC has finished it (6 of 8); DEVD and MarinaChain from their IR decks
// until their one-pagers land.

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
    tagline: "276 Holdings runs an AI supply chain platform that finances SMEs from order to collection.",
    sector: "Payments · Financial data",
    stage: "Series A · founded 2019",
    track: "track1",
    website: "https://www.276holdings.com",
    email: "jacob.lim@276holdings.com",
    phone: "+82 10 4266 9101",
    problem: [
      "Korean SMEs pay suppliers upfront but collect from large buyers only months later.",
      "Banks lend on collateral and financial statements, leaving most SMEs without working capital.",
      "Real transaction data sits scattered across email, ERP and paper, so lenders cannot use it.",
    ],
    solution: [
      "FlowPoint connects buyers, SMEs and suppliers on one platform, from purchase order to collection.",
      "FlowPay buys raw materials for the SME and resells on deferred terms: a trade structure, not a loan.",
      "FlowScore, the AI risk engine, assesses each transaction with trade and global value chain data.",
    ],
    keyFeatures: [
      "Transaction-level risk assessment built on order, delivery and payment records, not collateral.",
      "Trade credit insurance from K-SURE, SGI and KODIT covers a large share of purchase value.",
      "Confirmed receivables become standardized, financeable assets on a 45-day cycle.",
    ],
    targetAudience: [
      "SMEs that need working capital to buy raw materials before they are paid by buyers.",
      "Suppliers and buyers trading B2B on credit terms.",
    ],
    businessModel: [
      "Trade margin on every FlowPay purchase-and-resale transaction.",
      "Insured SME trade receivables originated by 276 Holdings and funded with institutional capital partners.",
    ],
    businessSnapshot: [
      "FlowPay volume grew from USD 3.1M (2024) to USD 7.0M (2025), and reached USD 7.2M in H1 2026 alone.",
      "Breakeven reached in H1 2026 on a 45-day asset cycle.",
      "0.22% realised loss across 1,295 completed transactions since 2023.",
      "USD 3.0M raised through Series A, plus USD 0.4M in non-dilutive government R&D grants.",
      "Founded in 2019 in Seoul; establishing 276 HOLDINGS ASIA in Singapore.",
      "USD figures converted at KRW 1,380.",
    ],
    team: [
      { name: "In Keun Shin", role: "Founder & CEO", bio: ["Founded 276 Holdings in 2019", "Former POSCO International: global trade and supply chain"] },
      { name: "Jihoon Lim", role: "Director & CIO", bio: ["Leads AI R&D, strategy, IR and global expansion", "Leads government R&D programs and the Singapore entity"] },
      { name: "In Tak Song", role: "Director, Underwriting", bio: ["Leads transaction review and limit policy for FlowPay", "Former Woori Securities"] },
    ],
    seekingOpportunities: [
      "Pre-Series B investors for a KRW 5bn (USD 3.6M) round to fund Southeast Asia expansion.",
      "Debt facility partners for the insured SME trade receivables book.",
      "Local partners to launch SNPL in Singapore and across ASEAN.",
    ],
    onepager: "/onepagers/276holdings.pdf",
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
    email: "ted@devd.co.kr",
    phone: "",
    problem: [
      "Cross-border renters must pay a deposit and first rent on arrival, before local banking, salary and credit are ready, which can take around 90 days.",
      "Landlords want local bank transfers, so newcomers face a liquidity shock that repeats across countries, currencies and corridors.",
      "The gap affects a large global base: 7.3M students studying abroad and 304M international migrants.",
    ],
    solution: [
      "ZIPUPpay verifies the lease and payee, checks identity and transaction risk, and lets tenants pay rent by card or corporate budget.",
      "Landlords simply receive local bank funds: no enrollment and no new app.",
      "One control layer verifies, routes and reconciles payments for foreign residents paying in Korea and for Korea-based payers sending rent abroad.",
    ],
    keyFeatures: [
      "Trust and risk control engine: payer-owner matching, V1-V11 contract cross-check rules, and monitoring for amount drift and high-value card cycling.",
      "Dual-control exception handling and an append-only audit log with minimum 5-year retention.",
      "RESTful API and iOS/Android SDK let partner apps embed rent payment natively, with settlement handled by ZIPUPpay.",
    ],
    targetAudience: [
      "International students, expats and migrants who must pay rent before local banking and credit are in place.",
      "Employers and HR teams paying rent from corporate budgets for relocating staff.",
      "Landlords, proptech and platform partners that want to embed rent payment without rebuilding their stack.",
    ],
    businessModel: [
      "Transaction fee of 2.3-5.5% on each rent payment.",
      "Distribution moves from B2C to B2B to API, including white-label and API deals with payment partners.",
      "Roadmap extends from payment module to multi-PG routing and later rent-specific cards, limits and embedded finance.",
    ],
    businessSnapshot: [
      "2025 GMV US$4.1M and revenue US$245K; July 2026 monthly GMV US$2.18M (US$26.1M annualized run-rate) with 73% monthly repeat.",
      "Pre-A round closed May 2026; US$864K cumulative funding, backed by SJ First Mover Fund and MYSC.",
      "ISO 9001 and ISO/IEC 27001 certified; 3 granted and 3 pending patents plus 1 PCT filing; zero financial incidents since launch.",
      "Selected for COMEUP STARS 2026 Singapore Track and exhibited at CES 2026 Eureka Park; existing cross-border payment relationship with Finmo, a MAS-listed Major Payment Institution.",
    ],
    team: [
      { name: "Ted Kim", role: "CEO & Founder", bio: ["UK founder with an exit; leads business, product and partnerships", "International & European Law LLB; KAIST Digital Finance MBA"] },
      { name: "Brown Hyun", role: "CTO", bio: ["10-year full-stack developer; SW Maestro 9th cohort", "Built the risk engine, multi-PG and partner APIs; leads architecture, security and integrations"] },
    ],
    seekingOpportunities: [
      "Partners to launch the first Singapore rent corridor, targeting 2 signed PoCs and live transactions within 12 weeks.",
      "A pilot-ready Singapore PoC with Finmo: payment link plus one corridor, then white-label or API.",
      "Employers, HR teams and landlords in Singapore to onboard paying renters, aiming for 100 renters and US$200K monthly GMV by day 90.",
      "Investors and partner MoUs as part of the Singapore market entry programme.",
    ],
  },
  {
    slug: "marinachain",
    name: "MarinaChain",
    displayName: "MarinaChain",
    tagline: "An AI-powered maritime carbon and financial data platform that automates vessel emissions data processing and supports regulatory compliance and carbon allowance procurement.",
    sector: "Financial data · Maritime carbon",
    stage: "Pre-A · founded 2023",
    track: "track1",
    website: "https://marinachain.io",
    email: "info@marinachain.io",
    phone: "",
    problem: [
      "Ship crews enter vessel operation data by hand in non-standard formats, causing frequent errors from the very first step.",
      "Daily Noon Reports are emailed to HQ and must be summarised at year-end for regulatory reporting, leaving data fragmented across inboxes.",
      "Shipowners spend significant manpower and time on manual data collection and repeated reconciliation with verifiers and classification societies.",
    ],
    solution: [
      "AI compliance tools that fit existing workflows: crews simply CC MarinaChain on their daily Noon Report emails.",
      "AI extracts and organises vessel operational data and prepares annual submissions for IMO DCS, CII, EU MRV and FuelEU.",
      "One platform for operational data, contracts and compliance, serving regulators, verifiers and shipper requests from a single source.",
    ],
    keyFeatures: [
      "MarinaNet: emissions compliance automation plus EUA calculation and purchase, fuel-intensity tracking, biofuel sourcing and pooling-partner matching.",
      "MarinaDocs: AI document management for safety manuals, ISO certificates, contracts and receipts, with a chatbot and one-click digitisation of any format.",
      "MarinaCP: charterparty AI that drafts agreements from past contracts, tracks clause changes and checks actual fuel use against CP terms.",
      "ParseAI, MarinaCon and MarinaValue: a multi-format document parser, a port and legislation AI library, and market intelligence for asset strategy.",
    ],
    targetAudience: [
      "Shipowners and ship managers facing IMO and EU emissions regulations.",
      "Shipping lines, shipyards, owners and charterers managing operational data and contracts.",
      "Companies in other industries seeking AI document-processing pilots.",
    ],
    businessModel: [
      "MarinaNet: annual subscription priced per vessel.",
      "Brokerage commission on EU Allowance (EUA) and biofuel purchases.",
      "MarinaDocs and MarinaCP: per-contract customisation, transitioning to an annual subscription model.",
    ],
    businessSnapshot: [
      "Founded in 2023, with offices in Busan, Seoul and Singapore; clients include domestic and global shipping lines and shipyards.",
      "1st Place at OpenAI SF 2024, 1st Place at the 2024 K-Startup Grand Challenge, and 1st Place (Minister's Prize) at the 2024 UPA Unicontest.",
      "Selected for the 2024 Global Shell StartUp Engine (top 8); 2025 CMA CGM ZEBOX finalist with a PoC in progress; Microsoft x Pier71 programme (2026).",
      "Appointed AI Advisor to the Singapore Shipping Association's Digitalisation Committee (2026); collaborates with Kim & Chang and DNV.",
    ],
    team: [
      { name: "Dan Ha", role: "CEO & Co-founder", bio: ["CEO of Forabee Pte. Ltd.; former ship engineer at Sinokor", "B.A. Green Ship Engineering, Korea Maritime & Ocean University"] },
      { name: "Jon Jie", role: "COO & Co-founder", bio: ["Founder of Scrio.ai, a chatbot AI startup", "Member, SSA Digitisation Committee (AI Division); B.A. Engineering & Innovation, NUS"] },
      { name: "Dawon Kim", role: "CCO & Co-founder", bio: ["Director, Kinsale Maritime (Singapore); co-founder and director, Diatomic AB (Sweden)", "B.A. Visual Communications, University of the Arts London"] },
      { name: "Jake Yoon", role: "Head of Engineering", bio: ["Former ML engineer at Qraft Technologies and analyst programmer at LG CNS", "B.A. Computer Science, Soongsil University"] },
    ],
    seekingOpportunities: [
      "Shipowners and ship managers looking to automate emissions compliance and streamline vessel operations.",
      "Companies across industries interested in an AI innovation pilot using ParseAI.",
    ],
  },
  {
    slug: "bigtechplus",
    name: "BigTech Plus",
    displayName: "BigTech Plus Inc.",
    tagline: "BigTech Plus connects real estate and finance through data, delivering property data APIs and SaaS to Korea's leading banks.",
    sector: "Personal finance · Big data analytics",
    stage: "Series A · founded 2019",
    track: "track1",
    website: "https://www.bigtech.co.kr",
    email: "bigtech@bigtech.co.kr",
    phone: "+82-2-6959-3960",
    problem: [
      "Real estate makes up about 76% of Korean household assets, yet its data is scattered across public registers, ledgers and price sources.",
      "Lenders still verify property rights and values manually from official documents, slowing non-face-to-face loans and raising risk.",
      "Tenants face rising rental deposit (jeonse) fraud with no easy way to check a property's legal and financial safety before signing.",
    ],
    solution: [
      "DocQ is a SaaS platform for real-time viewing, analysis and sharing of official real estate registers, ledgers and cadastral maps.",
      "Data & API offers R-Code address standardization, R-List owned-property lookup and market price APIs plugged directly into bank apps.",
      "HomeQ is a consumer app for home recommendations, deposit safety diagnosis and asset management across the entire lease lifecycle.",
    ],
    keyFeatures: [
      "Register rights analysis, including canceled entries (unique in Korea), automates collateral checks through RPA and APIs.",
      "An owner-based property database built from 10M+ annual register and ledger inquiries enables instant ownership verification.",
      "Real-time alerts on register, price and transaction changes, backed by 6 registered and 7 pending patents including rights analysis and AVM.",
    ],
    targetAudience: [
      "Banks, securities firms and lenders underwriting real-estate-backed and mortgage loans.",
      "Households committing savings to housing who need to verify property rights first.",
      "ASEAN lenders expanding mortgage and retail credit.",
    ],
    businessModel: [
      "B2B SaaS and usage-based fees for DocQ register viewing and analysis, the company's profitable core revenue base.",
      "Data and API licensing to banks, insurers and platforms such as KB Kookmin Bank, KakaoBank, Woori Bank and NAVER.",
      "B2C MyData monetization via HomeQ through brokerage and referral fees for mortgages, jeonse loans and credit cards.",
    ],
    businessSnapshot: [
      "Founded in 2019 in Seoul after winning the FSC's 1st Korea Fintech Idea Contest; 29 employees, 70%+ developers.",
      "2025 revenue of KRW 7.77B (approx. USD 5.5M); net income turned positive in H1 2026; 2026 revenue target of KRW 12.0B.",
      "Series A of KRW 5.7B (Q3 2025) from Korea Investment Partners, KakaoBank, HG Initiative and Korea Credit Information.",
      "Live with KB Kookmin, KakaoBank, NH, Hana, Woori, Shinhan, BNK, IBK Securities, Kyobo Life and NAVER.",
      "Selected by every major Korean financial group's fintech lab; FSC Regulatory Sandbox; ISO/IEC 27001 certified.",
    ],
    team: [
      { name: "Bae-il Ham", role: "CEO", bio: ["20 years in real estate information services, planning and operations", "Former Korea Enterprise Data (now KODATA) and Korea Credit Guarantee Fund", "Yonsei University (Business Administration); Konkuk University Graduate School of Real Estate Studies"] },
      { name: "Hwan-hee Lee", role: "CTO / Head of AI", bio: ["Former CTO at multiple startups, including Soomgo, Rilid (now Socra AI) and Sling", "Extensive PC, mobile and web development and project management", "Korea University, Department of Electronics and Information Engineering"] },
      { name: "Seung-hwan Yoo", role: "Executive Director, Business Planning", bio: ["10 years at Korea Enterprise Data (now KODATA) and Korea Credit Bureau (KCB)", "Leads service UI/UX planning; Seoul National University (Agricultural Economics)"] },
    ],
    seekingOpportunities: [
      "Banks, lenders and insurers in Singapore and Southeast Asia for PoCs in property data, collateral verification and digital lending.",
      "Proptech and real estate platforms seeking property data infrastructure, address standardization and rental risk diagnosis.",
      "Strategic investors and regional data partners for joint go-to-market and overseas expansion.",
    ],
    onepager: "/onepagers/bigtechplus.pdf",
  },
  {
    slug: "sionic",
    name: "Sionic AI",
    displayName: "Sionic AI",
    tagline: "STORM enables enterprises to build, deploy and govern GenAI agents on one no-code platform.",
    sector: "AI · Enterprise agents",
    stage: "Series A · founded 2023",
    track: "track1",
    website: "https://www.sionic.ai/",
    email: "livi@sionic.ai",
    phone: "+82-2-557-7500",
    problem: [
      "Enterprise teams manually reconcile scattered documents and regulations, slowing reviews, reporting and customer service.",
      "Fragmented AI tools require repeated custom development, making new use cases costly and difficult to scale.",
      "Enterprises need traceable answers and secure deployments, and general-purpose AI alone lacks the required operational controls.",
    ],
    solution: [
      "STORM unifies data gathering, document processing, agent building, deployment and governance in one no-code enterprise AI platform.",
      "Business teams create agents for any type of use case, including knowledge search, document review and reporting, without relying on repeated custom builds.",
      "STORM deploys on-premises, in private clouds or through SaaS to match enterprise security and operational requirements.",
    ],
    keyFeatures: [
      "STORM Act designs, tests and deploys AI agents from natural-language requests, reducing technical barriers for business users.",
      "Agentic Parsing preserves document structure and context, transforming complex financial documents into AI-ready data with proprietary models ranked #1 globally on MTEB and MDP Bench.",
      "Agentic RAG connects information across documents to provide source-grounded answers and flag relevant exceptions or risks.",
    ],
    targetAudience: [
      "Banks, insurers and card companies running fraud surveillance, KYC/AML, claims and compliance workflows.",
      "Mid-market enterprises adopting AI without in-house AI expertise.",
      "SI and AX delivery partners that want to win AI projects without building their own AI capability.",
    ],
    businessModel: [
      "Enterprise software licenses for on-premises and private-cloud deployments, with optional annual maintenance.",
      "Tiered SaaS subscriptions for cloud-based access to the STORM Platform.",
      "Partner-led sales and implementation through local system integrators, distributors and resellers.",
    ],
    businessSnapshot: [
      "Founded in 2023 and headquartered in Seoul, with a Japan subsidiary established in 2025.",
      "Enterprise references include IBK, Samsung Life and Korea Credit Guarantee Fund.",
      "Four official partnerships and five-plus partner-led contracts in Japan within the first year.",
      "Delivered a private-cloud AI platform and travel agent for Siam AI in Thailand.",
      "Platform interfaces available in Korean, English, Japanese and Thai.",
    ],
    team: [
      { name: "Sukhyun Ko", role: "CEO", bio: ["Former co-founder of Company.AI, acquired by NAVER", "Former AI SaaS lead at NAVER; cloud infrastructure lead at Toss"] },
      { name: "Woomyeong Park", role: "CDO / Head of Research", bio: ["Ph.D., University of Maryland, College Park", "Former HyperCLOVA LLM (Korea's largest sovereign AI project) research lead at NAVER; Samsung R&D engineer"] },
      { name: "Sihyeung Han", role: "CSO / Head of Business Development", bio: ["Former AI business lead at NAVER Clova and NAVER Cloud", "Former IBM digital strategy and AI consultant"] },
    ],
    seekingOpportunities: [
      "Enterprises for PoCs in custom AI agent use cases powered by an AI-ready knowledge base and the AI Agent Builder platform.",
      "Singapore-based partners, including system integrators and resellers, for joint sales, implementation and enterprise delivery.",
      "Regional model and infrastructure providers for joint solutions and go-to-market partnerships across Southeast Asia.",
    ],
    onepager: "/onepagers/sionic.pdf",
  },
  {
    slug: "aizen",
    name: "AIZEN Global",
    displayName: "AIZEN Global Co., Inc.",
    tagline: "A vertical AI fintech turning real-time EV data into bankable credit across Southeast Asia.",
    sector: "Financial data · AI credit",
    stage: "Series C · founded 2016",
    track: "track1",
    website: "https://www.aizen.co",
    email: "js.kang@aizen.co",
    phone: "+82-10-3579-5738",
    problem: [
      "Gig and delivery drivers across Southeast Asia lack credit history, so EV financing is out of reach or priced punitively.",
      "Banks cannot price EV residual value, battery health or new brands, so EV fleet lending stays scarce and costly.",
    ],
    solution: [
      "AIZEN finances and operates EV fleets for Grab/Gojek drivers, underwritten by its own finance-specialized Vertical AI.",
      "Live vehicle, battery and repayment data drive continuous credit, pricing and residual-value decisions.",
      "CreditConnect connects platforms, OEMs, banks and insurers on one EV financing rail.",
    ],
    keyFeatures: [
      "ABACUS AutoML: 50+ finance-tuned algorithms that run thousands of models, used by major Korean banks.",
      "EV risk engine: battery state-of-health and residual-value prediction from GPS and battery telemetry.",
      "Real-time decisioning: sub-90ms fraud/credit scoring, recognized by MAS (FinTech Award, Veritas).",
    ],
    targetAudience: [
      "Banks, finance companies and insurers seeking to lend against EVs and batteries in Southeast Asia.",
      "Mobility platforms, EV fleet operators and their riders, plus EV and battery manufacturers.",
      "Global and ESG investors looking for Southeast Asian real-asset exposure via Singapore.",
    ],
    businessModel: [
      "EV-as-a-Service: recurring service fees from B2B fleet partners and B2C rent-to-own drivers.",
      "Vertical AI: ABACUS licensing and AI services for banks, card issuers and insurers.",
      "Data upside: carbon credits, embedded insurance and tokenized asset-backed products.",
    ],
    businessSnapshot: [
      "Scale: ~20,000 EV 2-wheelers in Indonesia, with ~80% B2B share.",
      "Revenue: ARR above US$20M (Jul-2026 run-rate), growing ~25% QoQ.",
      "Funding: US$38.8M equity raised, with JB Financial as investor and lender.",
      "Footprint: active in Indonesia, Vietnam and Cambodia, with Thailand next, expanding from 2W to 4W and trucks.",
      "IP: 100+ AI patents filed; Singapore HQ and Korea R&D.",
    ],
    team: [
      { name: "Kang Jung Seok", role: "Founder & CEO", bio: ["Ex-Citigroup and LG CNS; policy role at the Korea National Assembly", "Early investor in WiPower (acquired by Qualcomm)", "Chicago Booth MBA; Seoul National University"] },
      { name: "Cho Sung Jun", role: "CSO", bio: ["Ex-Head of Risk, Volkswagen Financial Services China & Korea", "StanChart, Citi and LG Card; LBS MSc Finance"] },
    ],
    seekingOpportunities: [
      "Growth-equity and strategic investors for the next round (Singapore HoldCo).",
      "Credit partners (banks, private credit, ABS funds) to scale the fleet to 100k+ units.",
      "Mobility, OEM and battery partners for Vietnam, Thailand and the 4W/truck roll-out.",
    ],
    onepager: "/onepagers/aizen.pdf",
  },
  {
    slug: "canopy",
    name: "Canopy",
    displayName: "Canopy Inc.",
    tagline: "Reinventing how people get paid: real-time access to earned wages.",
    sector: "Earned wage access · Payroll",
    stage: "Seed · founded 2024",
    track: "track1",
    website: "https://canopy.im/en",
    email: "andrew@canopy.im",
    phone: "+82-10-8985-8921",
    problem: [
      "Workers create value every day, but wages are paid once a month, creating a cash-flow gap before payday.",
      "To bridge the gap, employees turn to credit cards and high-interest loans, fueling unnecessary debt and financial stress.",
      "Companies gain liquidity during the pay cycle while employees bear the opportunity cost and lose financial autonomy.",
    ],
    solution: [
      "Employees accrue \"Canopy Mileage\" for every workday verified by geo-sensing check-in and withdraw earned wages to their payroll account.",
      "Each withdrawal is a true sale of wages already earned, not a loan: zero interest, zero per-use fees, only a flat monthly subscription fee.",
      "On payday the employer pays full salary as usual and Canopy settles only the advanced amount via a pre-registered settlement method, with no change to payroll and no employer cost or risk.",
    ],
    keyFeatures: [
      "No HR/payroll integration required: attendance is verified by proprietary geo-sensing, so a company goes live in one day.",
      "Korea's only EWA platform running both employer-adopted (B2B2C) and direct-to-consumer (B2C) lines, with B2C eligibility verified via national health-insurance employment and income data.",
      "Patented EWA technology (2026) with built-in risk control: pre-screened employers, verified income and legally assigned wage claims.",
    ],
    targetAudience: [],
    businessModel: [
      "Flat monthly subscription fee, paid by the employee, the employer, or split, at the employer's choice.",
      "Points & payments: mileage converts to partner loyalty points (e.g., LOTTE L.POINT) at a 2% fee.",
      "Ecosystem revenue: discounted brand gift-card margins (Canopy Coupon), co-branded bank debit card and Canopy benefitmall revenue share, and embedded distribution via HR/payroll SaaS.",
    ],
    businessSnapshot: [
      "30,000+ users and 50+ enterprise clients (incl. Hanwha, Hansol, Daekyo, Zegna) as of Sep 2026, with 83% retention.",
      "Cumulative advances grew 40x in 1H 2026 to KRW 3.45B (~USD 2.5M), and monthly advances rose 8x from March to June.",
      "~USD 2.3M raised from Hanwha Hotels & Resorts, Seoul National Univ. Holdings, Smilegate, Magellan and CNT Tech; backed by KODIT and TIPS.",
      "FSC Fintech Innovative Company (2026); Grand Prize, Seoul Fintech Week 2025; ISO 37001/37301 certified.",
      "Japan: entity incorporation confirmed for Q4 2026, officially supported by Shibuya City (UP Program) and JETRO, working with Osaka Prefecture and FinCity.Tokyo, with 3 PoCs in discussion incl. a listed company.",
    ],
    team: [
      { name: "Andrew Lee", role: "Founder & CEO", bio: ["Leads Canopy end-to-end: product, business and global expansion", "Ex-Google, PwC M&A and KPMG New York; 14 years in the U.S."] },
      { name: "Dan Kim", role: "CTO", bio: ["Ex-Tech Lead at Karrot (Korea's top local community app) and PLAYAUTO", "Built Canopy's data-verification and auto-settlement engine"] },
      { name: "Oliver Ahn", role: "Director of Sales & BD", bio: ["Ex-Hyundai Vendys BPO and Mirae Asset Financial Services", "Leads enterprise sales and partnership development"] },
      { name: "Alex Lee", role: "Global Operations & BD", bio: ["PwC Korea, Deals/M&A Advisory", "Leads and manages global expansion"] },
    ],
    seekingOpportunities: [
      "PoC partners in Singapore (banks and payout infrastructure, HR/payroll providers, and loyalty or digital-wallet players) to co-validate EWA and points-based wage access.",
      "Employers, from SMEs to enterprises, to pilot Canopy as a zero-cost employee financial-wellness benefit.",
      "Investors (VCs, bank and financial-group CVCs, and fintech funds in Singapore and SEA focused on financial inclusion and embedded finance) for the upcoming round.",
    ],
    onepager: "/onepagers/canopy.pdf",
  },
  {
    slug: "crosshub",
    name: "Crosshub",
    displayName: "Crosshub",
    tagline: "Connecting digital identity and payments to make travel seamless for international visitors.",
    sector: "Payments · Digital identity",
    stage: "Pre-A · founded 2024",
    track: "track1",
    website: "https://crosshub.ai/",
    email: "crosshub@crosshub.kr",
    phone: "+82 2-780-9930",
    problem: [
      "Identity verification is complex for foreigners.",
      "Foreign visitors have limited access to local payment services.",
      "Travel and payment systems are fragmented.",
    ],
    solution: [
      "An all-in-one payment platform for international visitors.",
      "Pre-arrival identity verification and card application.",
      "Connects local payments with travel services.",
    ],
    keyFeatures: [
      "Pre-Arrival: passport-based eKYC and card application.",
      "Payments: mobile top-ups and a prepaid card.",
      "Local Services: transport, shopping and tourism.",
    ],
    targetAudience: [],
    businessModel: [
      "Payment and top-up transaction fees.",
      "Financial partnership revenue.",
      "Travel and local service commissions.",
    ],
    businessSnapshot: [
      "CES 2026: Best of Innovation, FinTech.",
      "Strategic partnership with Woori Bank.",
      "Total funding: $4.3M.",
    ],
    team: [
      { name: "Jay Kim", role: "Founder & CEO", bio: ["Government24 Big Data Project", "Former Division Head, LG U+", "KAIST MBA"] },
      { name: "Sewoong Choi", role: "CTO", bio: ["ETRI blockchain researcher", "Seoul National University"] },
      { name: "Junghee Park", role: "Vice President", bio: ["Division head at Weibo Korea", "Leading Korean newspapers"] },
    ],
    seekingOpportunities: [
      "Banking and fintech partnerships.",
      "Strategic partnerships and PoC opportunities.",
    ],
    onepager: "/onepagers/crosshub.pdf",
  },
  {
    slug: "ztosigma",
    name: "Z to Sigma",
    displayName: "Z to Sigma",
    tagline:
      "Keeper AI: Agentic AI for B2B field businesses that connects calls, transactions, and payments to understand context and take the next action.",
    sector: "Financial data & AI",
    stage: "Pre-A",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [
      "Manufacturing, equipment, maintenance and industrial-distribution businesses still run on phone calls, faxes, documents and handwritten notes.",
      "Deal information is scattered, and the context of each customer lives in the memory of the owner and a few key staff.",
    ],
    solution: [
      "Keeper AI connects call, transaction and settlement data, remembers the context of each deal, and decides and carries out the next task.",
      "Offered to local B2B platforms, financial institutions and SaaS providers as an API and transaction-settlement module.",
    ],
    keyFeatures: [],
    targetAudience: [
      "Small and mid-sized manufacturing, equipment, maintenance and industrial-distribution companies.",
      "B2B platforms, financial institutions and SaaS providers that want transaction-settlement data and AI.",
    ],
    businessModel: [],
    businessSnapshot: [
      "36,588 business sites on the platform in Korea, 1,493 of them paying.",
      "1.3M+ transaction documents and about KRW 450B in transactions recorded.",
      "Customer interviews with 35 Japanese companies at Japan IT Week 2025.",
      "Exhibiting at Manufacturing World Osaka, October 2026.",
    ],
    team: [],
    seekingOpportunities: [
      "Executives and managers at field B2B companies (manufacturing, equipment, maintenance, industrial distribution) for interviews and product demos.",
      "Local companies and institutions open to a PoC or business partnership.",
      "VCs investing in AI, B2B SaaS, fintech or industrial tech, or in expansion across Korea, Japan and Southeast Asia.",
    ],
  },
  {
    slug: "elevenliter",
    name: "Elevenliter",
    displayName: "Elevenliter",
    tagline:
      "Lifet: An AI-powered pet insurance underwriting solution that analyzes smartphone photos to assess the presence and severity of progressive conditions, enabling insurers to evaluate risk and tailor premiums to each pet’s health status.",
    sector: "Insurtech",
    stage: "Series A",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [
      "Pet insurers have little health data on the animals they cover, so it is hard to assess each pet's risk or price a policy to its condition.",
    ],
    solution: [
      "Lifet's AI checks smartphone photos of a pet for progressive conditions and how far they have advanced.",
      "Insurers use the result to assess risk and set premiums according to each pet's health.",
    ],
    keyFeatures: [],
    targetAudience: [
      "Pet insurers, reinsurers and insurance platforms.",
      "Pet-care platforms and device makers that want AI health checks.",
    ],
    businessModel: [],
    businessSnapshot: [
      "Pet insurance co-developed and launched with DB Insurance in Korea.",
      "AI checks supplied to Samsung Electronics' SmartThings Pet Care, launching in the US in September 2026.",
      "Exhibited at CES 2024 (K-Startup pavilion), and at CES 2026 and VivaTech 2026 with Samsung Electronics.",
      "19 patents filed in Korea and abroad, and 2 veterinary software-as-a-medical-device approvals.",
    ],
    team: [],
    seekingOpportunities: [
      "Global pet insurers interested in a PoC.",
      "Insurers, reinsurers and insurtechs in Japan, the Americas and East Asia.",
      "Investors and partners in insurance and fintech.",
    ],
  },
  {
    slug: "atones",
    name: "Atones",
    displayName: "Atones",
    tagline:
      "CandyPay: scan one QR code and split a single payment across several credit cards, in the amounts you choose.",
    sector: "Payments",
    stage: "FIN:NECT alumni",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [
      "Many people hold several credit cards but miss each card's monthly spending target, and shops rarely let a customer split one bill across cards.",
    ],
    solution: [
      "CandyPay lets a customer scan a QR code and pay one bill with several cards, choosing how much goes on each.",
      "Candy AI recommends the card with the biggest benefit at the moment of payment.",
    ],
    keyFeatures: [],
    targetAudience: [
      "Consumers with several credit cards.",
      "Small and offline merchants that want to accept split payments.",
    ],
    businessModel: [],
    businessSnapshot: [
      "Launched in August 2025.",
      "2,000+ users and about KRW 220M in payments processed (January 2026).",
    ],
    team: [],
    seekingOpportunities: [],
  },
  {
    slug: "moneyguard",
    name: "Money Guard Service",
    displayName: "Money Guard",
    tagline:
      "A platform where creditors record a money promise, such as a personal loan or payment for goods and services, and the recovery steps follow automatically.",
    sector: "Debt recovery",
    stage: "FIN:NECT alumni",
    track: "track1",
    website: "",
    email: "",
    phone: "",
    problem: [
      "When a personal loan, a payment for goods or services, or child support goes unpaid, the creditor is usually left to chase it alone.",
    ],
    solution: [
      "Creditors record the promise once on Money Guard, and the recovery process follows automatically.",
      "Formal collection steps are handled through a linked credit-information company.",
    ],
    keyFeatures: [],
    targetAudience: [
      "Individuals and businesses owed money for loans, goods or services.",
      "Parents recovering unpaid child support.",
    ],
    businessModel: [],
    businessSnapshot: [
      "Selected for TIPS, Korea's tech-startup programme, in December 2024.",
      "Member company of Seoul Fintech Lab 2.",
    ],
    team: [],
    seekingOpportunities: [],
  },
];

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

// Companies that take 1:1 bookings: the whole cohort on this event.
export const MEETUP_COMPANIES: Company[] = companies;
