// FIN:NECT Global Singapore 2026 — Korean fintech cohort.
// Source: "[마스터파일] 핀테크지원센터_현지프로그램" › 2026 스타트업 명단 (12 Oct):
// each company's own English service overview (서비스 개요 영문) as the
// tagline. Funding amounts, revenue and the MYSC diagnostic notes in that
// sheet are internal and stay out. Ops deck (12 Oct): 12 companies — these
// 8 selected, plus alumni 머니가드서비스 · 앳원스 and 전북창경 십일리터 ·
// 지투시그마 (Tenity programme + visits; 전북 pair also get one online 1:1
// with LodestarT). ponytail: those four join the site once their data lands.
// IR decks are NOT published (CMK lesson, 7 Oct). Sector labels are ours.
// Profile sections (16 Oct) are written from each company's own IR deck;
// Canopy's deck is mostly images, so its profile stays short until the
// one-pager lands.

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
    website: "https://276holdings.com",
    email: "contact@276holdings.com",
    phone: "+82 2-785-7080",
    problem: [
      "SMEs are over 97% of ASEAN firms and 60%+ of GDP, yet up to 70% are rejected or abandon loan applications for lack of credit history.",
      "Fragmented data and no trusted assessment infrastructure make SME screening risky and costly; the ADB estimates US$330B in unmet annual SME financing demand in ASEAN.",
      "SMEs are paid on credit after delivery while suppliers demand cash upfront, so funding gaps stall growth and can bankrupt profitable firms.",
      "Paper sales contracts are slow, easily lost or forged, and leave SMEs with too few assets to pledge for working capital.",
    ],
    solution: [
      "FlowPoint registers and digitizes sales contracts as electronic receivables (e-AR), linking them directly to transfer and funding.",
      "FlowScore scores risk per transaction from financial, behavioral and trade data, updating with every trade instead of once or twice a year.",
      "FlowPay (SNPL) prepays and supplies the raw materials an SME needs; the client settles after delivery, structured as procurement rather than lending.",
    ],
    keyFeatures: [
      "FlowScore v3.6: 491 variables across 5 dimensions (financial, governance, behavioral, transaction, interaction), returning risk, limit, fee rate and term with reason codes.",
      "Double safeguard on every SNPL deal: FlowScore screening plus guarantee insurance to distribute risk.",
      "e-AR conversion, digital contract archive and online transfer link that turn a sales contract into a funding option.",
      "IP portfolio of 13 rights, including 5 Korean patent filings and 1 PCT filing on AR platform and hybrid credit scoring.",
    ],
    targetAudience: [
      "SMEs that need working capital to buy raw materials before they are paid by buyers.",
      "Suppliers and buyers trading B2B on credit terms, including cross-border exporters and importers.",
      "ASEAN banks and SME lenders looking to improve screening of thin-file SMEs.",
    ],
    businessModel: [
      "FlowPay fee revenue: instant prepaid procurement within FlowScore-approved limits, settled by the client after delivery.",
      "Cross-border supply financing for export and import trades, already generating revenue in India, the US and China.",
      "Planned SaaS: supplying the FlowScore model and data as a Partner Kit to ASEAN financial institutions.",
    ],
    businessSnapshot: [
      "KRW 689B+ (about US$500M) in cumulative receivables brokered; 1,100 registered supplier and buyer firms.",
      "2025 revenue KRW 9.7B (about US$7.0M, +230% YoY); monthly break-even reached by year-end 2025; KRW 3.7B cross-border revenue across 3 markets.",
      "Series A in 2025 (Korea Investment Accelerator, HG Initiative, KB Securities, Magna Investment, Big Basin Capital); PoC with Funding Societies integrating FlowScore into loan screening.",
      "Minister of SMEs & Startups Award 2025, Minister of Science and ICT Award 2024, FinConnect Demo Day Top Award 2025; Venture, Inno-Biz and R&D Center certified.",
    ],
    team: [
      { name: "Ingeun Shin", role: "Founder & CEO", bio: ["10 years in structured finance; leads business model design and partnerships with financial institutions", "Previously Korea Note Brokerage, POSCO International and Hanwha Trading; Law, Chung-Ang University"] },
      { name: "Jinyong Park", role: "Co-Founder & CSO", bio: ["Leads fundraising, IR strategy, the domestic B2B sales network and platform planning", "Previously Korea Note Brokerage, Koscom (UI/UX) and Dacom MI Cloud"] },
      { name: "Intak Song", role: "Co-Founder & COO", bio: ["Leads finance, risk control design, AR management and settlement", "Previously Korea Note Brokerage, Woori Securities and LG Innotek; Economics, SKKU"] },
      { name: "Jihoon Lim", role: "CIO", bio: ["Leads AI-based dynamic risk scoring, global business and R&D", "Two-time fintech/edtech founder; MSc Data Science"] },
    ],
    seekingOpportunities: [
      "Scaling FlowScore-based SNPL with Funding Societies from a 100-company Singapore PoC to around 2,000 companies a year.",
      "LPs to form an SNPL supply fund with 276 Holdings and Funding Societies, later extending into ESG and impact finance.",
      "ASEAN banks and financial institutions to fund SNPL and adopt the FlowScore scoring model and data as SaaS.",
      "Support for setting up a Singapore subsidiary in 2026 as its regional HQ and expansion hub.",
    ],
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
    tagline: "HomeQ · DocQ: real estate rights and collateral verification infrastructure that prevents households from losing their housing assets and automates collateral underwriting for lenders.",
    sector: "Personal finance · Big data analytics",
    stage: "Series A · founded 2019",
    track: "track1",
    website: "https://www.bigtech.co.kr",
    email: "",
    phone: "",
    problem: [
      "76% of Korean household assets are in real estate, yet households commit their savings without being able to see owner debt, senior liens or price risk.",
      "Banks still verify collateral rights by reading documents by hand, making verification cost the bottleneck in digital lending.",
      "High verification cost keeps underwriting conservative, so thin-file customers are the first to be excluded from credit.",
      "In Indonesia, mortgage-to-GDP has been flat at 3.4% for a decade with a 2.88% NPL ratio, and collateral verification is still manual.",
    ],
    solution: [
      "One verification layer automating the full mortgage collateral process: identify the property, verify rights, review the contract, register priority and monitor after the loan.",
      "For financial institutions: real-time collateral verification and monitoring infrastructure built on R-Code, DocQ and R-List.",
      "For households: HomeQ provides rights diagnosis, registry change alerts, HomeQ Pay and property tax services before savings are committed.",
      "For ASEAN: the proven Korean process delivered as technology transfer plus onshore deployment with local banking partners.",
    ],
    keyFeatures: [
      "R-Code: maps any unstructured address to a standard address, unique registry number, building number and market price in real time.",
      "DocQ: real-time retrieval and parsing of registry, building and land ledgers, land-use certificates and cadastral maps, with Korea's only cancelled-entry analysis.",
      "R-List: inverts property-keyed public records into owner-keyed data, retrieving every property a person holds for MyData, credit assessment and debt recovery.",
      "Seven-year data pipeline: 19M registry retrieval records, 340M property listing histories and 28M owner records, backed by granted and filed patents.",
    ],
    targetAudience: [
      "Banks, securities firms and lenders underwriting real-estate-backed and mortgage loans.",
      "Households committing savings to housing who need to verify property rights first.",
      "ASEAN lenders expanding mortgage and retail credit, starting with Indonesia and Thailand.",
    ],
    businessModel: [
      "B2B verification infrastructure for financial institutions, with three new services from 2027 (corporate self-registration, electronic notice, digital rights survey).",
      "B2C HomeQ services for households: rights diagnosis, registry alerts, HomeQ Pay and property tax.",
      "Direct mortgage-specialised lending from 2027, underwritten on the company's own verification layer.",
    ],
    businessSnapshot: [
      "In production at KakaoBank, KB, NH, Hana, IBK Securities, Toss, NICE and KAMCO; R-Code adopted by KakaoBank, K bank and HUG.",
      "HomeQ live inside KakaoBank since Dec 2024 with approx. 300,000 rights diagnoses a year and 397,000 users.",
      "KRW 7.77bn revenue in 2025, net profitable since H1 2026; Series A of KRW 5.7bn (2025) at KRW 24bn post-money, incl. KIP Singapore SEA Venture Fund I.",
      "ISO/IEC 27001 certified (May 2026); MyData preliminary licence filed with Korea's FSC (Jul 2026); selected three times for the regulator's testbed.",
    ],
    team: [
      { name: "Bae-il Hahm", role: "CEO", bio: ["20 years in real estate information services, including Korea Rating & Data and KODIT"] },
    ],
    seekingOpportunities: [
      "Introductions to Indonesian and Thai lenders, including Superbank and BankX, to scope collateral verification PoCs.",
      "Local partners for onshore deployment in Indonesia and Thailand, and document-AI partners for joint bank PoCs.",
      "Series B investors for a round planned in H2 2027, following the financial MyData licence and the launch of direct lending.",
    ],
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
    problem: [
      "Singapore scam losses reached S$1.11B in 2024 and S$913M in 2025, and banks now carry liability for fraud-surveillance gaps under the Shared Responsibility Framework.",
      "KYC/AML alert handling, customer due diligence and STR filing still rely on manual reconciliation of scattered documents.",
      "MAS AI risk management rules require explainability and human oversight that general-purpose LLMs without grounded evidence cannot provide.",
      "Separate custom builds for each use case fragment operations, and high costs and vendor dependency keep 71.5% of firms stuck at PoC.",
    ],
    solution: [
      "STORM: one no-code platform covering the full AI lifecycle, from document parsing to governance, under a single point of control.",
      "Grounded answers with exact source links, plus built-in audit logs, clause-level evidence tracing and agent change history for supervisors.",
      "Business teams build and deploy new agents themselves, scaling by adding agents instead of buying new systems.",
      "Runs on-premise, in private cloud, air-gapped or as SaaS, so sensitive data never leaves the institution's perimeter.",
    ],
    keyFeatures: [
      "Conductor: turns a plain-language request into an AI agent that is designed, debugged, tested and deployed end to end.",
      "Agentic Parsing: detects document formats and applies the best parsing mix, keeping every chunk context-rich, including tables.",
      "Agentic RAG: connects rules scattered across documents, weighs conditions and flags compliance risks no section states explicitly.",
      "Domain-tuned sLLM, VLM and embeddings; the embedding model ranks #1 on MTEB for Korean and Japanese retrieval, backed by 67 patent filings.",
    ],
    targetAudience: [
      "Banks, insurers and card companies running fraud surveillance, KYC/AML, claims and compliance workflows.",
      "Mid-market enterprises adopting AI without in-house AI expertise.",
      "SI and AX delivery partners that want to win AI projects without building their own AI capability.",
    ],
    businessModel: [
      "Perpetual platform and sLLM licences for on-premise or private-cloud deployment, plus ~15% annual maintenance.",
      "Tiered SaaS subscriptions from Free to Enterprise (3 to 100 agents), with pay-as-you-go usage beyond token limits.",
      "Partner-led sales: SI partners own sales and delivery while Sionic AI collects licence fees.",
    ],
    businessSnapshot: [
      "S$27M raised (Seed S$5M and Series A S$22M); strategic investors include Naver Cloud, KT and IBK, with IBK also a client.",
      "Korea revenue grew 1,727% YoY to about USD 1.26M in 2025; 11 projects including PoC and SaaS by 1H 2026.",
      "Customers include IBK, NongHyup Bank, Samsung Life Insurance and Eugene Investment & Securities; a policy bank's L/C agent cut review time from ~3 hours to ~10 minutes.",
      "Japan: 4 official partnerships and 5+ partner-led contracts within a year of opening in Tokyo; Thailand: a USD 400K+ project with Siam.AI Cloud.",
    ],
    team: [
      { name: "Sukhyun Ko", role: "CEO", bio: ["Co-founder of Company.AI (acquired by NAVER); led AI SaaS solutions at NAVER", "Built Toss's main search platform and led multi-cloud infrastructure for B2B clients"] },
      { name: "Woomyeong Park", role: "CDO / Head of Research / Head of Japan Office", bio: ["Former Head of LLM Development & Research, HyperCLOVA, NAVER; Company.AI co-founder", "Ph.D., University of Maryland, College Park; ex-Samsung Electronics R&D"] },
      { name: "Sihyeung Han", role: "CSO / Head of Business Development", bio: ["Former KR/JP AI B2B Strategy & Business Development Lead, NAVER Cloud; AI Business Team Lead, NAVER Clova", "Former Senior Consultant, IBM Digital Strategy / AI Consulting"] },
      { name: "Seunghee Oh", role: "Director of Strategy & Business Development", bio: ["Former Consultant, Bain & Company (growth strategy and M&A due diligence)", "Former Business Development Manager, Krust Universe (Kakao affiliate)"] },
    ],
    seekingOpportunities: [
      "Singapore banks and insurers for safety-net agent PoCs in SRF fraud surveillance, KYC/AML and claims adjudication.",
      "Local SI partners to deliver STORM, regional model providers such as AI Singapore (SEA-LION) for on-premise builds, and AWS/Google Cloud marketplace co-selling.",
      "Series B investors and partners to carry the platform across Southeast Asia.",
    ],
  },
  {
    slug: "aizen",
    name: "AIZEN Global",
    displayName: "AIZEN Global Co., Inc.",
    tagline: "CreditConnect: AI-powered, data-driven financial services for financial institutions and mobility platform companies across Southeast Asia, with Singapore as its regional hub.",
    sector: "Financial data · AI credit",
    stage: "Series C · founded 2016",
    track: "track1",
    website: "https://aizenglobal.com",
    email: "contact@aizen.co",
    phone: "",
    problem: [
      "Because EVs are still early-stage, lenders avoid financing them, citing asset, battery, resale and business-model risk.",
      "Where EV loans exist, riders face interest rates above 20%, down payments of 25-50% and short loan tenors; dedicated EV lending products are almost absent.",
      "High upfront cost remains the main barrier to electric two-wheeler adoption, even though running costs are low.",
      "Riders and small merchants are hard to score with traditional credit data, leaving operational and platform data untapped.",
    ],
    solution: [
      "CreditConnect converts platform, EV-operator and battery data into credit and risk indicators that banks can use to lend.",
      "Built on ABACUS, AIZEN's finance-specialised AutoML platform, it runs multiple AI models in real time to automate acquisition, credit assessment and risk management.",
      "Connects riders, financial institutions, mobility platforms and manufacturers in one EV data ecosystem, giving riders finance access and operators capital to scale EV fleets.",
    ],
    keyFeatures: [
      "AI battery valuation: predicts remaining battery life and state of health to set collateral value and LTV standards.",
      "Alternative-data credit scoring using operating, revenue, utilisation, location and battery data for thin-file customers.",
      "Real-time collateral monitoring of driving routes, battery location, condition and rider revenue throughout the loan.",
      "End-to-end portfolio tools covering disbursement, repayment, delinquency prediction and collections.",
    ],
    targetAudience: [
      "Banks, finance companies and insurers seeking to lend against EVs and batteries in Southeast Asia.",
      "Mobility platforms, EV fleet operators and their riders, plus EV and battery manufacturers.",
      "Global and ESG investors looking for Southeast Asian real-asset exposure via Singapore.",
    ],
    businessModel: [
      "Platform fee from EV operators for onboarding and access to diverse EV financing products.",
      "Technology licence fees from financial institutions for collateral and portfolio management services.",
      "Revenue sharing on financial services delivered through institutions connected to the CreditConnect data platform.",
    ],
    businessSnapshot: [
      "Founded 2016; KRW 12.2bn raised (Series B); 27 staff in Korea plus a ~50-person team in Indonesia and Vietnam; 52 registered patents.",
      "Indonesia: 17,000+ cumulative EV loans executed across 10 districts, a 2-year track record with 12,000+ Grab riders, and a target of 20,000 units by Q3 2026.",
      "Partners include Grab, Gojek, KB Capital, Woori Financial affiliates, Hana Bank Indonesia, Sinar Mas Group and UNDP Vietnam; strategic investment from Indika Energy and Innoven Capital.",
      "AIZEN Asia Pacific entity set up in Singapore; MAS FinTech Awards 2nd place (Global track) and MAS AI Fairness Challenge Top 10.",
    ],
    team: [
      { name: "Jung Seok Kang", role: "CEO & Founder", bio: ["Former Citigroup (strategy, risk, marketing); National Assembly Finance Committee and LG CNS", "MBA, University of Chicago; BA Linguistics and MA Economics, Seoul National University"] },
      { name: "Sungjun Cho", role: "EVP, CSO (Head of Global Business)", bio: ["Former Risk Head, Volkswagen Financial Services China/Korea; management at VWFS Germany", "Standard Chartered, Citi and LG Card; MSc Finance, London Business School"] },
      { name: "Damien Ngai", role: "Indonesia/Vietnam Country Manager", bio: ["Leads a ~50-person AIZEN team across Indonesia and Vietnam", "Former Regional Head, iMoney Group/Jirnexu; founding member of Pluang; ACCA"] },
      { name: "Kihyuck Kweon", role: "Director, Business Strategy", bio: ["Risk division at Hyundai Capital / Hyundai Card, Standard Chartered and Citi", "MA Economics, Yonsei University"] },
    ],
    seekingOpportunities: [
      "Banks, payment networks and development finance institutions (e.g. DBS, UOB, OCBC, Visa, Mastercard, ADB) for PoCs and joint business.",
      "Global and ESG investors seeking Southeast Asian underlying assets, channelled through AIZEN's Singapore hub.",
      "Finance, data and embedded-finance partners to support expansion into Vietnam, Thailand and other Southeast Asian markets.",
    ],
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
    targetAudience: [
      "Large employers and enterprises; current clients in Japan range from 1,700 to 10,000 employees.",
    ],
    businessModel: [],
    businessSnapshot: [
      "Japan: three enterprise clients, including a publicly listed company with 10,000 employees and private companies with 8,500 and 1,700 employees.",
      "Japan entity incorporated and officially launched in FY26 Q4, with nationwide expansion planned for FY27.",
      "Singapore: one enterprise client evaluating adoption, alongside discussions on a MoM x EDB pilot programme.",
      "Plans a Singapore APAC hub in FY27 1H, then expansion to Taiwan, Hong Kong, Malaysia and Indonesia in FY27 2H.",
    ],
    team: [],
    seekingOpportunities: [
      "Singapore enterprises open to PoC and pilot discussions as Canopy builds its market-entry pipeline.",
    ],
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
    email: "crosshub@crosshub.kr",
    phone: "",
    problem: [
      "Payments, transfers, logins and account recovery carry growing financial risk, requiring verification of both identity and intent at the moment of approval.",
      "Generative AI makes synthetic voices, voice cloning and replayed recordings an increasingly serious forgery threat.",
      "Verification codes, OTPs and passwords can be stolen or phished, and cannot confirm what was actually authorised.",
      "Hands-free settings such as smart glasses, vehicles, drive-thrus and AI agents need new ways to authenticate.",
    ],
    solution: [
      "V-Pay: a security layer that verifies high-risk transactions through the user's live voice, confirming both who approved and what was approved.",
      "Each transaction generates a one-time phrase containing its details; the user reads it aloud and V-Pay checks both the words and the voice.",
      "Delivered as an API/SDK for step-up authentication on high-risk actions only, so it works alongside existing systems without full replacement.",
    ],
    keyFeatures: [
      "Dynamic one-time approval phrases, regenerated for every transaction to defend against replay and synthetic-voice attacks.",
      "Dual check: speech-to-text verifies the phrase, while frequency, intonation and pronunciation patterns are matched to the enrolled voice.",
      "Data minimisation: verifies voice feature vectors without storing raw audio, reducing biometric-data and privacy risk.",
      "Voice-triggered advertising: brand or promotional messages embedded in the approval phrase at the moment of purchase (patent applied).",
    ],
    targetAudience: [
      "Banks and card issuers.",
      "Payment gateways and digital wallets.",
      "Fintech and commerce platforms, and later commerce, tourism and brand advertisers.",
    ],
    businessModel: [
      "Authentication fees priced by number of authentication requests and monthly usage.",
      "Enterprise and licensing deals: setup fees, integration fees and monthly subscriptions.",
      "Phase 2: voice-triggered targeted advertising for commerce, tourism, local markets and brands.",
    ],
    businessSnapshot: [
      "CES 2026 Best of Innovation Award (FinTech); ISO 27001, ISO 27701 and ISMS-P certified; 6 registered patents and 12 applications.",
      "USD 2M cumulative investment from 7 investors at a USD 15M post-money valuation; selected for Deep Tech TIPS and MSIT's 2026 Next-Gen Unicorn programme.",
      "V-Pay MVP completed; existing services IDBlock and K-POP PRO have 300K and 500K users respectively.",
      "Team grew from 6 (2024) to 41 members (2026), with 9+ ministerial awards and presence in the U.S., France, Singapore, Vietnam, Japan and China.",
    ],
    team: [
      { name: "Jay Kim", role: "CEO", bio: ["KAIST MBA; B.B.M., Columbia University"] },
      { name: "Sewoong Choi", role: "CTO", bio: ["Former blockchain R&D at ETRI", "Seoul National University"] },
      { name: "Insook Kim", role: "CAIO", bio: ["Former Korea Development Institute", "Ph.D., Ruhr University Bochum, Germany"] },
      { name: "Jinwoo Lee", role: "CISO", bio: ["Leads financial security architecture design"] },
    ],
    seekingOpportunities: [
      "Banks, card issuers, payment gateways and digital wallets to run financial and payment PoCs of V-Pay step-up authentication.",
      "Fintech and commerce platforms to integrate V-Pay as an API/SDK security module for high-risk transactions.",
      "Commerce, tourism and brand partners for voice-triggered advertising once security is validated.",
    ],
  },
];

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

// Companies that take 1:1 bookings: the whole cohort on this event.
export const MEETUP_COMPANIES: Company[] = companies;
