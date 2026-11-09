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
// One-pagers replace these entries as they land (머니가드서비스: 5 Nov;
// 앳원스 · 십일리터 · 지투시그마: 9 Nov).
// IR decks are NOT published (CMK lesson, 7 Oct). Sector labels are ours.
// Profile sections (16 Oct): from each company's FIN:NECT one-pager where
// MYSC has finished it (all 8: DEVD's landed 20 Oct, MarinaChain's 5 Nov).

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
    theme: "Korean fintech startups selected by the Korea Fintech Center",
    dates: "19 November 2026",
  },
  track2: {
    title: "",
    theme: "",
    dates: "",
  },
} as const;

const ALL_COMPANIES: Company[] = [
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
      "Founded in 2019 in Seoul; establishing 276 HOLDINGS ASIA in Singapore (in progress).",
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
    tagline: "Pay rent with a credit card: ZIPUP Pay, rent payment infrastructure.",
    sector: "Payments · Proptech",
    stage: "Pre-A",
    track: "track1",
    website: "https://www.devd.co.kr",
    email: "ted@devd.co.kr",
    phone: "+82-70-4222-0421",
    problem: [
      "Most landlords accept only bank transfers, so tenants miss card benefits and cash-flow flexibility on rent.",
      "Small businesses lack simple digital tools to collect and settle rent.",
    ],
    solution: [
      "ZIPUP Pay lets tenants pay rent by credit card while landlords receive regular settlement.",
      "ZIPUP Pay Biz and Partners extend this to businesses and property platforms.",
    ],
    keyFeatures: [
      "Monthly rent payment by card, with rewards and benefits.",
      "API and SDK for property-management software integration.",
      "Payments operated through registered PGs (PayVerse, InnoPay).",
    ],
    targetAudience: [],
    businessModel: [
      "Transaction-based payment fees from rent payments.",
      "B2B subscription and API/SDK fees from partners.",
      "Card-benefit and marketing partnerships.",
    ],
    businessSnapshot: [
      "Raised KRW 1.27B cumulatively, including a Pre-A round in May 2026.",
      "2025 revenue of KRW 1.08B; 11-person team.",
      "Selected for TIPS; works with NHN, Hana Card, Woori and BNK Kyongnam.",
    ],
    team: [
      { name: "Ted Ki Tae Kim", role: "Founder & CEO", bio: ["Leads DEV.D and ZIPUP Pay", "Underdogs, Sheffield, KAIST"] },
      { name: "Kevin Kyungsub Kim", role: "Manager", bio: ["Manages DEV.D and ZIPUP Pay", "Allra fintech, Soongsil University"] },
    ],
    seekingOpportunities: [
      "Local partners: licensed PSPs and banks, proptech and coliving operators.",
      "Regional investors and Singapore market validation support.",
    ],
    onepager: "/onepagers/devd.pdf",
  },
  {
    slug: "marinachain",
    name: "MarinaChain",
    displayName: "MarinaChain",
    tagline: "AI solutions provider for maritime, ocean freight and heavy industries.",
    sector: "Financial data · Maritime carbon",
    stage: "Pre-A · founded 2023",
    track: "track1",
    website: "https://marinachain.io",
    email: "danha@marinachain.io",
    phone: "+82 10 2038 8054",
    problem: [
      "Complex carbon regulations keep emerging for shipping.",
      "Vessel and compliance data is stored in a scattered manner.",
    ],
    solution: [
      "Solutions built for specific market needs, based on deep maritime domain knowledge and applied AI.",
    ],
    keyFeatures: [
      "MarinaNet: noon report management and compliance solutions.",
      "MarinaDocs: document-management AI for safety manuals, commercial contracts, BDNs and more.",
      "MarinaValue (in development): vessel valuation and market analysis, such as scenario analysis on S&P and newbuilding.",
    ],
    targetAudience: [],
    businessModel: [
      "Noon report parsing SaaS.",
      "EUA brokerage and market reports.",
      "Biofuel brokerage.",
      "AI system integration.",
      "Vessel profit-maximising AI agent SaaS (in development).",
    ],
    businessSnapshot: [
      "2025 revenue: USD 8.45M.",
      "Government grants: USD 1.8M secured.",
      "Major clients: Pan Ocean, Sinokor SM, Samsung Heavy Industries and others.",
      "Ongoing PoCs: CMA CGM, Hyundai Samho and J Ocean.",
      "AI Advisor to the Singapore Shipping Association (SSA).",
      "Winner of an OpenAI competition (2023).",
    ],
    team: [
      { name: "Dan Ha", role: "Founder & CEO", bio: ["CEO of Forabee Pte. Ltd.", "Former ship engineer at Sinokor", "B.A. Green Ship Engineering, Korea Maritime & Ocean University"] },
      { name: "Jon Jie", role: "COO", bio: ["Founder of Scrio.ai", "Expertise in AI, full-stack development and DevOps", "B.A. Engineering & Innovation, NUS"] },
      { name: "Millie Lee", role: "Head of Partnerships", bio: ["M.A. Global Business Journalism, Tsinghua University", "Completed the Bloomberg ESG track", "Freelance writer for the Embassy of the Republic of Korea in China"] },
    ],
    seekingOpportunities: [
      "Networking with potential customers across maritime, ocean freight and heavy industries.",
      "Networking with potential data partners.",
    ],
    onepager: "/onepagers/marinachain.pdf",
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
      "2025 revenue of KRW 7.77B (approx. USD 5.5M); net income turned positive in H1 2026; 2026 revenue target of KRW 12.0B (approx. USD 8.9M).",
      "Series A of KRW 5.7B (approx. USD 4.3M, Q3 2025) from Korea Investment Partners, KakaoBank, HG Initiative and Korea Credit Information.",
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
    tagline: "Paywork: voice-first AI for industrial businesses.",
    sector: "Financial data & AI",
    stage: "Pre-A",
    track: "track1",
    website: "https://ztosigma.com",
    email: "jean@paywork.io",
    phone: "+82 2-1833-4080",
    problem: [
      "Industrial orders and quotes run on phone calls.",
      "Follow-ups get lost between calls and files.",
    ],
    solution: [
      "Keeper AI turns customer calls into next actions in Paywork.",
      "Customer history gives every follow-up its context.",
      "The workflow is being extended to quotes and payments.",
    ],
    keyFeatures: [
      "Capture calls and surface the next task.",
      "Search past conversations in everyday language.",
      "Prompt a follow-up before a customer is forgotten.",
    ],
    targetAudience: [],
    businessModel: [
      "Paywork (non-AI): KRW 13,900 per month.",
      "Paywork Solo + Keeper AI: KRW 33,000 per month.",
      "Team: multi-user plan (planned).",
      "Enterprise: custom contract (planned).",
    ],
    businessSnapshot: [
      "1,582 users.",
      "93% annual paid retention (Paywork).",
      "1.3M transaction records since 2022.",
    ],
    team: [
      { name: "Jean Son", role: "Founder & CEO", bio: ["Strategy and go-to-market", "Former hedge fund analyst"] },
      { name: "Simon Han", role: "CPO", bio: ["Former COO, Bithumb", "Former CPO, Yogiyo"] },
      { name: "Claire Park", role: "COO", bio: ["Finance and customer operations", "M.Ed., Ewha Womans University"] },
    ],
    seekingOpportunities: [
      "Industrial pilots in Singapore.",
      "Local partners.",
      "Pre-A investors.",
    ],
    onepager: "/onepagers/ztosigma.pdf",
  },
  {
    slug: "elevenliter",
    name: "Elevenliter",
    displayName: "Elevenliter Inc.",
    tagline:
      "Lifet: AI-powered pet insurance underwriting that reads one smartphone photo to grade progressive diseases, so insurers can price risk by each pet's health.",
    sector: "Insurtech",
    stage: "Pre-A · Series A in progress",
    track: "track1",
    website: "https://www.lifet.co.kr",
    email: "official@elevenliter.com",
    phone: "+82-10-3662-3689",
    problem: [
      "Pet insurers price risk on age and breed alone; a vet health check at sign-up is too slow and costly.",
      "Progressive diseases such as patellar luxation, the #1 claim cause, go unseen early; rival products in Korea run 120–130% loss ratios.",
    ],
    solution: [
      "Lifet AI grades five progressive diseases from one smartphone photo in 3 seconds, with no device or clinic visit.",
      "Insurers use the results to accept risks and set premiums; pets with healthy results get a discount at sign-up.",
      "Lifet Pet Insurance, co-developed with DB Insurance, runs a 67.8% loss ratio, about half the market average.",
    ],
    keyFeatures: [
      "Korea's only two approved veterinary SaMD products (patellar luxation, periodontal disease), with 97%+ accuracy in clinical trials.",
      "120K+ proprietary training images and 19 patents, including 5 US filings.",
      "Plugs into partner apps via API, web link or membership bundle, with fixed or usage-based pricing.",
    ],
    targetAudience: [],
    businessModel: [
      "B2B API: license fees from insurers, electronics makers, telcos and card issuers.",
      "Insurance: commissions on Lifet Pet Insurance, underwritten with AI test results.",
      "Commerce: post-test supplement curation, including 17 vet-formulated private-label products.",
    ],
    businessSnapshot: [
      "Revenue: KRW 1.16B (USD 0.8M) in 2025, and KRW 1.36B (USD 0.9M) in January–September 2026 alone.",
      "Investment: KRW 2.25B (USD 1.55M) raised through Pre-A; Series A in progress; selected for Korea's TIPS.",
      "Clients: 8 companies and 12 services, including Samsung Electronics, LG Electronics, Samsung Fire & Marine, DB Insurance, SKT and KT.",
      "Global: Samsung SmartThings Pet Care US launch (October 2026); Japan license with ENTREX (MY PET+ app).",
      "Traction: 150K+ AI tests run; exhibited with Samsung at CES 2026 and VivaTech 2026.",
    ],
    team: [
      { name: "KwangHyeon Kim", role: "Founder & CEO", bio: ["Ex-New Business Planning, ST Unitas", "Ex-AI Business Division, Testworks", "B.A., Sungkyunkwan University"] },
      { name: "Juyong Park, DVM", role: "CTO", bio: ["9 years in small-animal clinical practice", "Ex-Head of Internal Medicine, referral animal hospital", "DVM, Kyungpook; M.S., Konkuk University"] },
      { name: "Geonwoo Park", role: "AI Researcher", bio: ["6 years in vision AI research", "Ph.D. candidate in CS, KAIST", "Ex-AI Researcher, Filer"] },
    ],
    seekingOpportunities: [
      "PoCs with pet insurers and insurance platforms on AI underwriting.",
      "API partners: telcos, banks and e-commerce platforms that sell pet insurance.",
      "Meetings with VCs for the Series A and Southeast Asian expansion.",
      "Distributors and importers for the vet-formulated supplements.",
    ],
    onepager: "/onepagers/elevenliter.pdf",
  },
  {
    slug: "atones",
    name: "Atones",
    displayName: "Atones Co., Ltd. (CandyPay)",
    tagline:
      "Global payment technology enabling multi-card purchases with a single authentication and direct split-bill payments.",
    sector: "Payments",
    stage: "Seed · FIN:NECT alumni",
    track: "track1",
    website: "https://www.candypay.co.kr",
    email: "help@atones.co.kr",
    phone: "+82 10 9915 1896",
    problem: [
      "Consumers hold multiple credit cards for rewards but struggle to maximize benefits and meet spending requirements.",
      "Most mainstream digital wallets support only one card per transaction, limiting payment flexibility.",
      "Group payments still rely on one person paying upfront and collecting transfers, leaving card rewards concentrated with a single payer.",
    ],
    solution: [
      "CandyPay lets consumers split a single purchase across multiple credit cards, or split bills through direct individual payments.",
      "In Korea, merchants accept QR and remote payments without dedicated terminals, and platforms integrate CandyPay through SDKs.",
      "The proven Korean payment technology is designed to integrate with existing global payment infrastructure and digital wallets.",
    ],
    keyFeatures: [
      "Patent-backed multi-card payments and split billing: concurrent multi-card authorizations with one authentication, plus direct payments by individual participants.",
      "Zero-friction merchant integration: out-of-the-box support for remote payments, table QR ordering and lightweight SDKs.",
      "CandyPayAI engine: AI-driven card benefit optimization, evolving from personalized recommendations to automated multi-card payment execution.",
    ],
    targetAudience: [],
    businessModel: [
      "Korean market: merchant transaction fees from multi-card payments, QR ordering and remote payments.",
      "Global expansion (planned): fixed or percentage-based fees per transaction through API/SDK partnerships with payment providers.",
      "Future expansion: data-driven merchant analytics, personalized promotions and commerce advertising.",
    ],
    businessSnapshot: [
      "Traction: launched in August 2024; KRW 890M (USD 660K)+ cumulative TPV, 4,500 users and 180+ merchant locations. 2026 volume reached KRW 630M by September, already 3.0x FY2025.",
      "Funding and R&D: KRW 400M (USD 300K) seed from Seoul National University Technology Holdings and other investors; selected for Korea's TIPS.",
      "Recognition: Top 10 in Google Play's ChangGoo Program (2024); K-Global Seoul National University Unicorn, 3rd cohort.",
      "Awards: FSC Fintech Idea Competition Excellence Award (2022); Innovation IT Award, Fintech (2026); product demonstration to the FSC Chairman (2025).",
    ],
    team: [
      { name: "Jaecheol Jung", role: "Founder & CEO", bio: ["B.B.A. and M.S., Sogang University", "Formerly at Samsung Electronics (Finance) and NICE Information Service (Marketing)", "Governor of Jeonbuk Award (2025); Minister of Land, Infrastructure and Transport Award (2022)"] },
      { name: "Sangwoo Bae", role: "CTO", bio: ["Software engineer specializing in fintech and payment systems", "Leads CandyPay's payment infrastructure and platform", "Sejong Academy of Science and Arts; Sogang University"] },
      { name: "Jiho Lee", role: "CMO", bio: ["Head of Marketing", "B.A., Sogang University; M.A., Korea National University of Arts"] },
    ],
    seekingOpportunities: [
      "Global PoC partnerships: joint PoCs with Southeast Asian payment providers and digital wallets to enable multi-card checkout.",
      "Platform collaboration: licensing split-payment and group bill settlement SDKs to commerce, O2O and financial platforms.",
      "Strategic Pre-Series A investment from institutional investors to accelerate international expansion.",
    ],
    onepager: "/onepagers/atones.pdf",
  },
  {
    slug: "moneyguard",
    name: "MoneyGuard Service",
    displayName: "MoneyGuard",
    tagline:
      "A mobile IOU infrastructure that turns personal loans between family and friends into legal evidence in 3 minutes and keeps repayment on track.",
    sector: "Personal lending · Legal tech",
    stage: "Seed · FIN:NECT alumni",
    track: "track1",
    website: "https://www.moneygd.com",
    email: "moneygd@moneygd.com",
    phone: "+82 10 3422 1520",
    problem: [
      "Bank records cannot prove a transfer to family was a loan, exposing it to gift tax and disputes.",
      "Paper IOUs need in-person signatures and costly notarisation, so personal loans often remain verbal promises.",
    ],
    solution: [
      "Lenders and borrowers sign a mobile IOU in 3 minutes through PASS identity verification, without meeting in person or visiting a notary.",
      "The signed IOU proves a transfer was a loan for tax review or disputes, and a Korean district court has accepted it as evidence.",
    ],
    keyFeatures: [
      "Standard IOU templates: users fill in only the amount, due date and interest.",
      "Repayment reminders: repayment-date reminders sent to both lender and borrower.",
      "Signed record: every IOU is stored in the app with each party's signing time.",
    ],
    targetAudience: [],
    businessModel: [
      "Per-document fee: USD 7.49 per IOU in the app, or USD 29.99 with tax advice.",
      "Paid retrieval: viewing and re-downloading stored IOUs.",
      "Bank partnership: the same IOU flow inside partner banks' transfer screens.",
    ],
    businessSnapshot: [
      "Investment: USD 172K seed (2024).",
      "Sales revenue: USD 81K in 2025; USD 76K in January–July 2026.",
      "Cumulative agreements: USD 397M across 20,000 IOUs, with a 40% repeat rate (2026).",
      "Partnership contract with Woori Bank (2026).",
      "Selected for the Google Play ChangGoo Programme (2025) and NICE Group Open Innovation (2026).",
    ],
    team: [
      { name: "Moongyu Moon", role: "Founder & CEO", bio: ["Sales and debt-management operator for 15+ years", "Experience at KT Nasmedia and in the steel building-materials industry"] },
      { name: "Jongha Baek", role: "CTO", bio: ["Financial infrastructure architect for 20+ years", "Large-scale document processing at Naver; speech recognition at Kakao", "B.S. and M.S., Yonsei University"] },
      { name: "Seunga Lee", role: "Head of UI/UX", bio: ["Fintech, media and DeFi UX for 18+ years", "MFA, School of the Art Institute of Chicago; BFA, Ewha Womans University"] },
    ],
    seekingOpportunities: [
      "Networking with potential bank partners in Southeast Asia.",
      "Networking with potential legal-tech partners.",
      "Connecting with investors ahead of a Pre-A round targeted for Q1 2027.",
    ],
    onepager: "/onepagers/moneyguard.pdf",
  },
];

// Tammy (8 Nov): Atones and MoneyGuard are off the site. Their entries stay
// above so they can come back by deleting them from this set.
const HIDDEN = new Set(["atones", "moneyguard"]);
export const companies: Company[] = ALL_COMPANIES.filter((c) => !HIDDEN.has(c.slug));

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

// Companies that take 1:1 bookings: the whole cohort on this event.
export const MEETUP_COMPANIES: Company[] = companies;
