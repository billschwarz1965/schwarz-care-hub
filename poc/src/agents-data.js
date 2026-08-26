// === CORE PLATFORM SERVICES (Intelligence Hub Layer) ===
export const SYSTEM_AGENTS = [
  {
    id: "hcp-explorer",
    name: "Expert Intelligence Hub",
    subtitle: "Powered by HCP Explorer",
    icon: "topology-star-ring-3",
    desc: "The foundational expert knowledge graph — single source of truth for all HCP and KOL intelligence. Every downstream MedVerse agent queries this hub before making recommendations.",
    dataSources: [
      { label: "HCP profiles", value: "4.9M", icon: "users" },
      { label: "Publications", value: "13.3M", icon: "book" },
      { label: "Congress participations", value: "22.5M", icon: "calendar-event" },
      { label: "Clinical trials", value: "563K", icon: "flask" },
      { label: "Sanofi engagements", value: "OneCRM", icon: "building" }
    ],
    capabilities: [
      "Expert discovery by disease, mechanism, geography, practice setting",
      "Scientific credibility & publication impact assessment",
      "Engagement history & relationship strength analysis",
      "Coauthor network mapping & influence pathways",
      "Investigator track record & enrollment performance",
      "Emerging KOL identification & growth trajectory"
    ],
    consumers: ["msl-copilot", "kol-agent", "advisory-board", "congress-planning", "trial-intel", "strategy-advisor", "expert-segment", "gap-expert"],
    compliancePartners: ["privacy", "audit", "explainability", "mlr"]
  },
  {
    id: "literature-intel",
    name: "Literature Intelligence",
    subtitle: "Scientific knowledge graph",
    icon: "book-2",
    desc: "Indexes, synthesizes, and monitors the global scientific literature. Powers the Literature Scout agent and feeds evidence into every MedVerse response.",
    dataSources: [
      { label: "PubMed indexed", value: "36M+", icon: "database" },
      { label: "Internal approved", value: "12K", icon: "file-check" },
      { label: "Congress abstracts", value: "84K", icon: "notes" }
    ],
    capabilities: [
      "Real-time publication monitoring & alerting",
      "Evidence synthesis across disease areas",
      "Citation verification & claim substantiation",
      "Competitive publication landscape analysis"
    ],
    consumers: ["literature-scout", "strategy-advisor", "msl-copilot", "disease-navigator"],
    compliancePartners: ["sci-verify", "expiration", "audit"]
  }
];

// === COMPLIANCE & GOVERNANCE AGENTS ===
export const COMPLIANCE_AGENTS = [
  { id: "mlr", name: "MLR Review", icon: "shield-check", desc: "Reviews content for on-label language, promotional risk, claim substantiation, and fair balance" },
  { id: "sci-verify", name: "Scientific Verification", icon: "microscope", desc: "Validates every claim against labels, core data sheets, publications, and approved content" },
  { id: "promo-risk", name: "Promotional Risk", icon: "alert-triangle", desc: "Detects promotional language patterns: 'best treatment', 'superior efficacy', 'guaranteed benefit'" },
  { id: "ae-detect", name: "AE Detection", icon: "heartbeat", desc: "Monitors all interactions for adverse event signals, auto-creates pharmacovigilance cases" },
  { id: "privacy", name: "PHI Protection", icon: "lock", desc: "Identifies and redacts protected health information, masks identifiers, controls access" },
  { id: "audit", name: "Audit Trail", icon: "clipboard-list", desc: "Creates immutable compliance records — who asked, what was generated, which checks ran" },
  { id: "off-label", name: "Off-Label Monitor", icon: "eye", desc: "Real-time detection of off-label discussions, routes to approved reactive responses" },
  { id: "fair-balance", name: "Fair Balance", icon: "scale", desc: "Ensures safety context accompanies efficacy claims, checks for appropriate risk language" },
  { id: "expiration", name: "Content Expiration", icon: "clock-x", desc: "Monitors label updates, retires outdated content, re-indexes approved materials" },
  { id: "explainability", name: "AI Explainability", icon: "brain", desc: "Provides transparency — why an answer was generated, supporting sources, confidence level" },
  { id: "field-risk", name: "Field Activity Risk", icon: "chart-dots-3", desc: "Analyzes MSL interactions and inquiry trends to detect compliance risks before audits" },
  { id: "inspection", name: "Inspection Readiness", icon: "file-certificate", desc: "Continuously prepares documentation, logs, evidence packages for regulatory inspections" },
];

// === BUSINESS AGENTS (Orchestration Layer) ===
export const BUSINESS_AGENTS = [
  {
    id: "msl-copilot",
    name: "MSL Copilot",
    icon: "user-star",
    desc: "Prepares pre-call briefings, real-time scientific guidance, and post-call documentation for MSL field teams",
    users: ["MSLs", "Field Medical"],
    compliancePartners: ["promo-risk", "audit", "off-label"],
    hubDependency: ["hcp-explorer", "literature-intel"],
    status: "active"
  },
  {
    id: "kol-agent",
    name: "KOL Relationship Agent",
    icon: "users-group",
    desc: "Identifies emerging KOLs, tracks influence growth, monitors publication acceleration and conference visibility",
    users: ["MSLs", "Medical Affairs"],
    compliancePartners: ["promo-risk", "off-label", "audit"],
    hubDependency: ["hcp-explorer"],
    status: "active"
  },
  {
    id: "advisory-board",
    name: "Advisory Board Builder",
    icon: "layout-board-split",
    desc: "Creates optimal advisory boards based on topic, geography, expertise diversity, and engagement levels. Produces ranked rosters with selection rationale.",
    users: ["Medical Affairs", "Home Office"],
    compliancePartners: ["privacy", "audit", "explainability"],
    hubDependency: ["hcp-explorer"],
    status: "active"
  },
  {
    id: "literature-scout",
    name: "Literature Scout",
    icon: "book-2",
    desc: "Searches, synthesizes, and monitors scientific publications across PubMed, internal databases, and congress libraries",
    users: ["MSLs", "Medical Affairs", "Home Office"],
    compliancePartners: ["sci-verify", "expiration"],
    hubDependency: ["literature-intel"],
    status: "active"
  },
  {
    id: "insights-agent",
    name: "Insights Agent",
    icon: "chart-infographic",
    desc: "Analyzes HCP engagement patterns, content performance, and behavioral signals to surface actionable medical insights",
    users: ["Medical Affairs", "Home Office"],
    compliancePartners: ["field-risk", "explainability", "audit"],
    hubDependency: ["hcp-explorer"],
    status: "active"
  },
  {
    id: "trial-intel",
    name: "Clinical Trial Intelligence",
    icon: "flask",
    desc: "Identifies investigators with enrollment track records, matches sites to protocols, and monitors trial landscape by therapeutic area",
    users: ["Clinical Operations", "MSLs"],
    compliancePartners: ["privacy", "sci-verify", "audit"],
    hubDependency: ["hcp-explorer"],
    status: "active"
  },
  {
    id: "congress-planning",
    name: "Congress Planning Agent",
    icon: "calendar-event",
    desc: "Before major congresses: who to meet, who is presenting, who is publishing, who is increasing visibility in target disease areas",
    users: ["MSLs", "Medical Affairs"],
    compliancePartners: ["audit", "promo-risk"],
    hubDependency: ["hcp-explorer", "literature-intel"],
    status: "active"
  },
  {
    id: "expert-segment",
    name: "Expert Segmentation Agent",
    icon: "category-2",
    desc: "Automatically classifies experts into tiers: Global Thought Leader, National KOL, Rising Star, Community Influencer, Clinical Trialist, Digital Influencer",
    users: ["Medical Affairs", "Home Office"],
    compliancePartners: ["explainability", "audit"],
    hubDependency: ["hcp-explorer"],
    status: "active"
  },
  {
    id: "strategy-advisor",
    name: "Medical Strategy Advisor",
    icon: "bulb",
    desc: "Synthesizes cross-TA intelligence, competitive landscape, and pipeline data to inform medical strategy decisions",
    users: ["Medical Affairs", "Home Office"],
    compliancePartners: ["explainability", "sci-verify", "inspection"],
    hubDependency: ["hcp-explorer", "literature-intel"],
    status: "active"
  },
  {
    id: "gap-expert",
    name: "Gap-to-Expert Agent",
    icon: "git-branch",
    desc: "When evidence gaps are identified, automatically finds experts who publish, treat, or might collaborate in that area",
    users: ["Medical Affairs", "Clinical Operations"],
    compliancePartners: ["audit", "explainability"],
    hubDependency: ["hcp-explorer", "literature-intel"],
    status: "active"
  },
  {
    id: "patient-nav",
    name: "Patient Navigator",
    icon: "heart-handshake",
    desc: "Guides patients through treatment journeys, connects to support programs, and monitors adherence milestones",
    users: ["Patients", "HCPs"],
    compliancePartners: ["privacy", "ae-detect", "fair-balance"],
    hubDependency: [],
    status: "active"
  },
  {
    id: "trial-match",
    name: "Trial Matching Agent",
    icon: "stethoscope",
    desc: "Matches patient profiles to active clinical trials based on eligibility criteria, geography, and disease stage",
    users: ["HCPs", "MSLs"],
    compliancePartners: ["privacy", "sci-verify", "audit"],
    hubDependency: ["hcp-explorer"],
    status: "active"
  },
  {
    id: "msl-connect",
    name: "MSL Connect",
    icon: "map-pin-heart",
    desc: "Helps HCPs identify their assigned MSL(s) by therapeutic area, territory, and institution. Pulls from interaction signal data, OneCRM territory assignments, and MSL profiles.",
    users: ["HCPs", "MSLs"],
    compliancePartners: ["privacy", "audit", "promo-risk"],
    hubDependency: ["hcp-explorer"],
    status: "active"
  },
  {
    id: "ingredient-safety",
    name: "Ingredient Safety Agent",
    icon: "flask",
    desc: "AI-powered excipient and ingredient intelligence. Cross-references product formulations with patient allergy profiles, dietary restrictions, and religious considerations to flag safety concerns before prescribing.",
    users: ["HCPs", "Pharmacists"],
    compliancePartners: ["sci-verify", "ae-detect", "audit"],
    hubDependency: ["literature-intel"],
    status: "active"
  },
  {
    id: "temp-stability",
    name: "Temperature Stability Agent",
    icon: "temperature",
    desc: "Assesses product viability after temperature excursions for insulins and vaccines. Wraps the Sanofi Stability Calculator with AI-powered natural language intake, multi-product batch assessment, and cold chain compliance logging.",
    users: ["Pharmacists", "HCPs"],
    compliancePartners: ["sci-verify", "audit", "ae-detect"],
    hubDependency: ["literature-intel"],
    status: "active"
  },
  {
    id: "disease-navigator",
    name: "Disease State Navigator Agent",
    icon: "dna",
    desc: "Maps disease biology to treatment landscape across therapeutic areas. Traces shared inflammatory pathways to surface cross-TA connections — where one mechanism explains comorbidity in another organ system — and grounds every claim in pathophysiology, biomarkers, and the competitive landscape.",
    users: ["MSLs", "HCPs", "Medical Affairs", "Patients"],
    compliancePartners: ["sci-verify", "fair-balance", "off-label", "audit"],
    hubDependency: ["literature-intel"],
    status: "active"
  }
];

// === CHART DATA FOR VISUALIZATIONS ===
export const CHART_DATA = {
  expertPublicationTrend: {
    title: "Dr. Elena Vasquez — Publication trajectory",
    subtitle: "Rising star in IL-33 / airway biology",
    labels: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    datasets: [
      { label: "Publications", data: [2, 3, 5, 7, 11, 14, 18], color: "#7a00e6" },
      { label: "Citations received", data: [8, 22, 45, 89, 156, 248, 310], color: "#f9c851", yAxis: "right" }
    ]
  },
  expertSegmentation: {
    title: "Expert segmentation — Dermatology portfolio",
    labels: ["Global thought leader", "National KOL", "Rising star", "Community influencer", "Clinical trialist", "Digital influencer"],
    data: [28, 67, 134, 312, 89, 47],
    colors: ["#7a00e6", "#aa46a3", "#f9c851", "#60a5fa", "#34d399", "#f87171"]
  },
  engagementGap: {
    title: "Rising experts with minimal Sanofi engagement",
    subtitle: "Publication growth >40% YoY, <2 Sanofi interactions",
    experts: [
      { name: "Dr. E. Vasquez", institution: "UCSF", area: "IL-33 / Airway", pubGrowth: 67, sanofiInteractions: 0, tier: "Rising star" },
      { name: "Dr. K. Tanaka", institution: "Keio Univ", area: "AD Biomarkers", pubGrowth: 58, sanofiInteractions: 1, tier: "Rising star" },
      { name: "Dr. A. Okafor", institution: "Johns Hopkins", area: "EoE Pediatric", pubGrowth: 52, sanofiInteractions: 0, tier: "Rising star" },
      { name: "Dr. L. Bergström", institution: "Karolinska", area: "CRSwNP Genomics", pubGrowth: 48, sanofiInteractions: 1, tier: "Rising star" },
      { name: "Dr. R. Gupta", institution: "Northwestern", area: "Type 2 Biomarkers", pubGrowth: 44, sanofiInteractions: 0, tier: "National KOL" }
    ]
  },
  congressExpertOverlap: {
    title: "EADV 2026 — Expert presence analysis",
    presenting: 42,
    publishingNewData: 28,
    sanofiEngaged: 18,
    unengagedHighValue: 12,
    byTrack: [
      { track: "AD / Eczema", experts: 18, sanofiGap: 4 },
      { track: "Psoriasis", experts: 12, sanofiGap: 3 },
      { track: "Biologics", experts: 8, sanofiGap: 2 },
      { track: "AI in Derm", experts: 6, sanofiGap: 3 },
      { track: "Pediatric", experts: 5, sanofiGap: 1 }
    ]
  },
  advisoryBoardOptimization: {
    title: "Global AD Advisory Board — Recommended roster",
    constraints: "8 US · 4 EU · 2 APAC | Mix academic + community | Biomarker expertise required",
    roster: [
      { name: "Dr. E. Guttman-Yassky", institution: "Icahn School of Medicine", region: "US", tier: "Global KOL", score: 98, rationale: "Leading AD translational researcher, 180+ AD publications" },
      { name: "Dr. A. Wollenberg", institution: "LMU Munich", region: "EU", tier: "Global KOL", score: 95, rationale: "EADV guidelines co-chair, dupilumab trial PI" },
      { name: "Dr. S. Barbarot", institution: "CHU Nantes", region: "EU", tier: "National KOL", score: 91, rationale: "Pediatric AD expert, EASI score validation lead" },
      { name: "Dr. J. Silverberg", institution: "George Washington Univ", region: "US", tier: "Global KOL", score: 94, rationale: "AD epidemiology authority, PRO measure expert" },
      { name: "Dr. M. Kawashima", institution: "Tokyo Women's Medical", region: "APAC", tier: "National KOL", score: 88, rationale: "Japanese AD guideline author, biomarker research" },
      { name: "Dr. P. Thyssen", institution: "Bispebjerg Hospital", region: "EU", tier: "Global KOL", score: 93, rationale: "AD comorbidity research leader, registry expertise" }
    ]
  },
  strategyLandscape: {
    title: "Competitive positioning — Moderate-to-severe AD",
    subtitle: "Publication share of voice by mechanism (2024–2026)",
    labels: ["IL-4/IL-13 (Dupilumab)", "JAK inhibitors", "IL-13 (Tralokinumab)", "IL-31RA (Nemolizumab)", "OX40 / OX40L", "PDE4 (Oral)"],
    data: [42, 28, 12, 9, 5, 4],
    colors: ["#7a00e6", "#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"]
  },
  networkMap: {
    title: "Dr. Guttman-Yassky — Coauthor influence network",
    center: { name: "E. Guttman-Yassky", pubs: 340, hIndex: 78 },
    connections: [
      { name: "J. Silverberg", sharedPubs: 42, institution: "GWU" },
      { name: "A. Simpson", sharedPubs: 38, institution: "OHSU" },
      { name: "T. Bieber", sharedPubs: 31, institution: "Bonn" },
      { name: "A. Wollenberg", sharedPubs: 27, institution: "LMU" },
      { name: "D. Thaçi", sharedPubs: 24, institution: "Lübeck" },
      { name: "M. de Bruin-Weller", sharedPubs: 19, institution: "UMC Utrecht" }
    ]
  },
  kolInfluenceGrowth: {
    title: "Dr. Kenji Tanaka — Influence trajectory (2021–2026)",
    subtitle: "AD biomarkers · Keio University",
    labels: ["2021", "2022", "2023", "2024", "2025", "2026 (proj)"],
    datasets: [
      { label: "Publications", data: [4, 6, 9, 14, 19, 26], color: "#7a00e6" },
      { label: "Citations", data: [12, 38, 85, 190, 340, 520], color: "#f9c851", yAxis: "right" }
    ]
  },
  mlrReviewSummary: {
    title: "MLR Review — Issue severity breakdown",
    subtitle: "14-slide deck · 23 references · 6 findings",
    labels: ["Promotional language", "Fair balance", "Data currency", "Claim accuracy", "Off-label risk", "Reference format"],
    data: [95, 90, 70, 65, 55, 30],
    colors: ["#ef4444", "#ef4444", "#f59e0b", "#f59e0b", "#f59e0b", "#22c55e"]
  },
  gapExpertMatch: {
    title: "Evidence gap → Expert match strength",
    subtitle: "Elderly AD real-world outcomes (≥65 years)",
    labels: ["Geriatric RWE pubs", "Elderly AD cohort access", "Dupilumab experience", "Registry / database PI", "Congress visibility", "Sanofi collaboration fit"],
    data: [
      { name: "Dr. L. Margolis", scores: [92, 88, 75, 95, 70, 85], color: "#7a00e6" },
      { name: "Dr. T. Augustin", scores: [85, 90, 80, 88, 82, 60], color: "#aa46a3" },
      { name: "Dr. F. Sampogna", scores: [78, 72, 85, 70, 75, 90], color: "#f9c851" }
    ]
  },
  trialLandscape: {
    title: "Sanofi Clinical Trial Landscape — Immunology & Inflammation",
    subtitle: "Active recruiting trials by therapeutic area",
    labels: ["Atopic Dermatitis", "Asthma", "COPD", "CRSwNP", "EoE", "Prurigo Nodularis", "CSU", "EGPA"],
    data: [14, 8, 6, 5, 4, 3, 3, 2],
    colors: ["#7a00e6", "#aa46a3", "#0f6e56", "#5b8def", "#d4553a", "#f59e0b", "#ef4444", "#8b5cf6"]
  }
};

// === AGENT DEMOS ===
export const AGENT_DEMOS = {
  "hcp-explorer": {
    title: "Expert discovery with 360° intelligence",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "Medical affairs query",
        content: "Find community-based pulmonologists publishing on ILD biomarkers in the Northeast US. I need experts for a potential advisory board on our fibrosis pipeline."
      },
      {
        type: "processing",
        label: "Expert Intelligence Hub processing",
        items: [
          "Querying 4.9M HCP profiles: specialty=pulmonology, setting=community...",
          "Filtering 13.3M publications: keywords=ILD, biomarkers, interstitial lung disease...",
          "Cross-referencing geography: Northeast US (NY, MA, PA, NJ, CT)...",
          "Enriching with OneCRM engagement history...",
          "Scoring by scientific credibility and publication impact..."
        ]
      },
      {
        type: "draft",
        label: "Expert discovery results",
        content: `**12 experts identified** matching criteria: community pulmonology + ILD biomarkers + Northeast US

**Top 5 ranked by composite score:**

| Rank | Expert | Institution | Publications (ILD) | H-index | Trials | Sanofi Engagement |
|------|--------|------------|-------------------|---------|--------|-------------------|
| 1 | Dr. R. Datta | NYU Langone Community | 24 | 32 | 3 (PI) | 2 advisory boards |
| 2 | Dr. M. Hoffman | Penn Medicine Community | 19 | 28 | 2 (SI) | 1 speaker program |
| 3 | Dr. S. Patel | Mass General Community | 17 | 25 | 1 (PI) | None |
| 4 | Dr. L. Torres | Yale Community Network | 15 | 22 | 2 (SI) | 1 congress meeting |
| 5 | Dr. A. Kim | Mount Sinai Community | 12 | 19 | 1 (SI) | None |

**Key insight:** 3 of 5 top experts have minimal or no Sanofi engagement — strategic opportunity for relationship building ahead of pipeline advancement.

**Network connection:** Dr. Datta and Dr. Hoffman share 4 co-authored publications and collaborated on the INBUILD biomarker substudy.`
      },
      {
        type: "chart",
        chartId: "expertPublicationTrend"
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "PHI Protection", agentId: "privacy", status: "pass", detail: "Expert profiles displayed using professional/public information only. No protected health information or personal contact data exposed." },
          { agent: "AI Explainability", agentId: "explainability", status: "pass", detail: "Ranking methodology: composite score = 40% publication impact + 25% trial experience + 20% biomarker-specific publications + 15% geographic fit. All data sourced from Veeva Link + OneCRM." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Expert discovery logged — query: ILD biomarkers, Northeast, community pulmonology. 12 results returned. Intended use: advisory board recruitment for fibrosis pipeline." }
        ]
      },
      {
        type: "output",
        label: "Verified results delivered",
        badge: "VERIFIED & AUDITABLE",
        content: "12 experts profiled with ranking rationale, data provenance, and confidence scores. 3 unengaged experts flagged as strategic opportunities. Results exportable for advisory board planning workflow."
      }
    ]
  },
  "kol-agent": {
    title: "Emerging KOL identification and influence tracking",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "MSL field request",
        content: "I keep hearing about Dr. Kenji Tanaka from Keio University — multiple HCPs in Japan and at international congresses are referencing his AD biomarker work. Is he an emerging KOL we should be tracking? Give me a full influence assessment."
      },
      {
        type: "processing",
        label: "KOL Relationship Agent → Expert Intelligence Hub",
        items: [
          "HCP Explorer: loading Dr. Kenji Tanaka profile (Keio Univ, Dermatology)...",
          "Publication analysis: 78 indexed publications, 26 in AD/biomarkers...",
          "Citation velocity: computing 3-year citation acceleration curve...",
          "Congress footprint: scanning EADV, AAD, JSID, SID presentation history...",
          "Network mapping: identifying coauthor clusters and institutional reach...",
          "OneCRM: checking Sanofi engagement history (1 interaction found)...",
          "Competitive intelligence: scanning competitor-sponsored publications..."
        ]
      },
      {
        type: "chart",
        chartId: "kolInfluenceGrowth"
      },
      {
        type: "draft",
        label: "KOL influence assessment",
        content: `**Dr. Kenji Tanaka — Emerging KOL Assessment**
**Current tier:** Rising Star → **Projected tier (12 months):** National KOL

| Dimension | Score | Trend | Detail |
|-----------|-------|-------|--------|
| Publication impact | 8.4/10 | ↑↑ | +58% YoY output, h-index 24 (up from 18 in 2024) |
| Citation velocity | 9.1/10 | ↑↑↑ | 520 projected citations in 2026, 3.2x growth vs 2024 |
| Congress visibility | 7.8/10 | ↑ | 3 oral presentations in 2026 (AAD, EADV, JSID) |
| Network influence | 7.2/10 | → | Coauthor network of 14 researchers across 6 institutions |
| Clinical trial activity | 6.5/10 | ↑ | Sub-investigator on 2 AD biomarker trials (1 Sanofi, 1 competitor) |
| Digital presence | 5.8/10 | ↑ | Growing X/Twitter following, 3 invited podcast appearances |

**Key findings:**
- **Publication acceleration is exceptional** — on track for 26 publications in 2026, doubling his 2023 output
- **Emerging as the leading voice on AD biomarker-guided therapy in Asia-Pacific**
- **Coauthor network includes 3 Global KOLs** (Dr. Kabashima at Kyoto, Dr. Guttman-Yassky at Icahn, Dr. Bieber at Bonn)
- **Competitive risk:** Sub-investigator on a competitor (AbbVie) upadacitinib biomarker substudy

**Sanofi engagement gap:**
Only 1 recorded interaction (DDW poster visit, Jan 2026). Zero advisory board invitations, zero speaker programs. **This expert is significantly under-engaged relative to his trajectory.**

**Recommended actions:**
1. **Immediate:** MSL scientific exchange — discuss his AAD 2026 biomarker presentation
2. **Q3 2026:** Invite to Sanofi Biomarker Think Tank (internal scientific advisory)
3. **Q4 2026:** Propose collaboration on dupilumab biomarker response predictor study
4. **Monitor:** Track competitor engagement — AbbVie substudy results expected Q1 2027`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "Promotional Risk", agentId: "promo-risk", status: "pass", detail: "KOL assessment based on scientific merit and publication analysis only. No promotional intent or product-specific outreach language detected. Engagement recommendations framed as scientific exchange." },
          { agent: "Off-Label Monitor", agentId: "off-label", status: "pass", detail: "All referenced publications and congress presentations are within approved disease areas and on-label indications. No off-label discussion topics flagged." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "KOL assessment logged — Dr. Kenji Tanaka (Keio Univ), requested by MSL Japan/APAC team. Influence score: 7.5/10 composite. Engagement gap flagged. Compliance record #KOL-2026-08-0293." }
        ]
      },
      {
        type: "output",
        label: "KOL intelligence delivered",
        badge: "VERIFIED & ACTIONABLE",
        content: "Dr. Tanaka confirmed as high-trajectory Rising Star with National KOL projection within 12 months. Engagement gap critical — only 1 Sanofi interaction vs. active competitor engagement. 4-step engagement plan generated. MSL Japan notified with pre-call briefing materials."
      }
    ]
  },
  "advisory-board": {
    title: "Advisory board design with expert optimization",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "Medical affairs request",
        content: "Design an optimal Global AD Advisory Board. Requirements: 8 US, 4 EU, 2 APAC. Mix of academic and community experts. Must include biomarker expertise. Avoid existing speaker bureau members."
      },
      {
        type: "processing",
        label: "Advisory Board Builder processing (via Expert Intelligence Hub)",
        items: [
          "HCP Explorer: querying AD expert profiles across US, EU, APAC...",
          "Filtering: biomarker expertise, excluding active speaker bureau...",
          "Scoring: publication impact × clinical leadership × geographic diversity...",
          "Optimizing: ensuring academic/community balance per region...",
          "Cross-checking OneCRM: engagement history and relationship strength..."
        ]
      },
      {
        type: "draft",
        label: "Recommended roster (6 of 14 shown)",
        content: `**Global AD Advisory Board — Optimized Roster**
Constraints: 8 US · 4 EU · 2 APAC | Academic + community mix | Biomarker expertise | No speaker bureau overlap

| Expert | Institution | Region | Tier | Score | Selection rationale |
|--------|-----------|--------|------|-------|-------------------|
| Dr. E. Guttman-Yassky | Icahn School of Medicine | US | Global KOL | 98 | Leading AD translational researcher, 180+ publications |
| Dr. J. Silverberg | George Washington Univ | US | Global KOL | 94 | AD epidemiology authority, PRO measure expert |
| Dr. A. Wollenberg | LMU Munich | EU | Global KOL | 95 | EADV guidelines co-chair, dupilumab trial PI |
| Dr. P. Thyssen | Bispebjerg Hospital | EU | Global KOL | 93 | AD comorbidity leader, registry expertise |
| Dr. S. Barbarot | CHU Nantes | EU | National KOL | 91 | Pediatric AD expert, EASI validation lead |
| Dr. M. Kawashima | Tokyo Women's Medical | APAC | National KOL | 88 | Japan AD guideline author, biomarker research |

**Diversity analysis:** 43% women, 3 continents, 6 countries, 71% academic / 29% community (full roster). Biomarker expertise coverage: TARC/CCL17, IgE phenotyping, eosinophil markers, filaggrin genotyping.`
      },
      {
        type: "chart",
        chartId: "advisoryBoardOptimization"
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "PHI Protection", agentId: "privacy", status: "pass", detail: "Roster uses professional profiles only. No personal data, compensation history, or contractual details exposed." },
          { agent: "AI Explainability", agentId: "explainability", status: "pass", detail: "Selection methodology: multi-objective optimization balancing scientific impact (40%), geographic representation (20%), expertise diversity (20%), engagement history (10%), and community balance (10%). Speaker bureau exclusion verified against current contracts." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Advisory board design logged — 14 experts recommended from 847 candidates evaluated. Constraints met: regional quotas, expertise requirements, speaker bureau exclusions. Compliance record #ADB-2026-0847." }
        ]
      },
      {
        type: "output",
        label: "Optimized roster delivered",
        badge: "ROSTER VERIFIED",
        content: "14-member roster optimized across all constraints. Each selection includes data-driven rationale and confidence score. Exportable to advisory board planning system with full audit trail."
      }
    ]
  },
  "expert-segment": {
    title: "Automated expert segmentation with growth tracking",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "Medical affairs request",
        content: "Run expert segmentation analysis for our dermatology portfolio. Identify rising stars we currently have no engagement with."
      },
      {
        type: "processing",
        label: "Expert Segmentation Agent processing (via Expert Intelligence Hub)",
        items: [
          "HCP Explorer: loading dermatology expert universe (4,200 profiled)...",
          "Applying segmentation model: publication velocity, congress presence, trial activity...",
          "Classifying tiers: Global KOL, National KOL, Rising Star, Community Influencer...",
          "Cross-referencing OneCRM: engagement gap analysis...",
          "Flagging rising stars with >40% publication growth and <2 Sanofi interactions..."
        ]
      },
      {
        type: "chart",
        chartId: "expertSegmentation"
      },
      {
        type: "draft",
        label: "Engagement gap — Rising experts with no Sanofi relationship",
        content: `**25 rising experts identified with minimal Sanofi engagement**
Publication growth >40% YoY | <2 Sanofi interactions | High congress visibility

**Top 5 strategic opportunities:**

| Expert | Institution | Focus area | Pub growth | Sanofi interactions | Tier |
|--------|-----------|-----------|-----------|-------------------|------|
| Dr. E. Vasquez | UCSF | IL-33 / Airway biology | +67% | 0 | Rising star |
| Dr. K. Tanaka | Keio University | AD Biomarkers | +58% | 1 | Rising star |
| Dr. A. Okafor | Johns Hopkins | EoE Pediatric | +52% | 0 | Rising star |
| Dr. L. Bergström | Karolinska | CRSwNP Genomics | +48% | 1 | Rising star |
| Dr. R. Gupta | Northwestern | Type 2 Biomarkers | +44% | 0 | National KOL |

**Strategic recommendation:** These 5 experts are publishing at accelerating rates in Sanofi-relevant disease areas with zero or minimal company engagement. Proactive MSL outreach could establish relationships before competitive medical affairs teams identify them.`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "AI Explainability", agentId: "explainability", status: "pass", detail: "Segmentation model: tier classification based on publication count (25%), citation impact (20%), congress presentations (20%), trial PI experience (15%), institutional prestige (10%), digital presence (10%). Growth calculated as YoY publication velocity change." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Segmentation analysis logged — 4,200 experts classified, 134 rising stars identified, 25 flagged for engagement gap. Report generated for dermatology portfolio medical affairs." }
        ]
      },
      {
        type: "output",
        label: "Segmentation delivered",
        badge: "ANALYSIS COMPLETE",
        content: "677 experts segmented across 6 tiers. 25 rising stars flagged as strategic engagement opportunities. Territory-level MSL action items generated. Full segmentation exportable to CRM for territory planning."
      }
    ]
  },
  "congress-planning": {
    title: "Congress expert intelligence for EADV 2026",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "MSL team request",
        content: "EADV 2026 is in September. Who should our dermatology MSL team prioritize meeting? Who is presenting new data? Who are we currently not engaged with?"
      },
      {
        type: "processing",
        label: "Congress Planning Agent processing (via Expert Intelligence Hub)",
        items: [
          "HCP Explorer: querying EADV 2026 registered presenters...",
          "Cross-referencing 22.5M congress participation records...",
          "Identifying new data presenters vs. established presence...",
          "OneCRM gap analysis: presenters with no MSL relationship...",
          "Prioritizing by scientific impact and strategic relevance..."
        ]
      },
      {
        type: "chart",
        chartId: "congressExpertOverlap"
      },
      {
        type: "draft",
        label: "EADV 2026 expert engagement plan",
        content: `**EADV 2026 — MSL Engagement Priority List**

**12 high-value experts with no current Sanofi engagement:**

These experts are presenting at EADV in Sanofi-relevant tracks but have zero OneCRM interaction history.

| Priority | Expert | Presenting on | Track | Why engage |
|----------|--------|--------------|-------|-----------|
| 1 | Dr. C. Flohr | AD phenotyping & precision medicine | AD/Eczema | Emerging leader in biomarker-guided therapy |
| 2 | Dr. M. Renert-Yuval | Dupilumab tissue biomarker analysis | Biologics | Direct Sanofi data — must connect |
| 3 | Dr. F. Lauffer | AI-assisted AD severity scoring | AI in Derm | Novel AI application in our disease area |

**Recommended MSL schedule:**
- Day 1: Attend AD phenotyping session → booth meeting with Dr. Flohr
- Day 2: Biologics track → connect with Dr. Renert-Yuval post-presentation
- Day 3: AI session → exploratory conversation with Dr. Lauffer

**Congress intelligence summary:** 42 experts presenting, 28 with new data. 18 have existing Sanofi engagement. **12 high-value experts are completely unengaged** — this is the MSL team's primary opportunity.`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "Promotional Risk", agentId: "promo-risk", status: "pass", detail: "Engagement plan focuses on scientific exchange only. No promotional intent or product-specific meeting agendas detected." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Congress planning logged — EADV 2026, 42 presenters analyzed, 12 prioritized for MSL engagement. Plan exported to field medical operations." }
        ]
      },
      {
        type: "output",
        label: "Congress plan delivered",
        badge: "PLAN APPROVED",
        content: "Engagement plan delivered to MSL team with priority-ranked expert list. Calendar integration available for meeting scheduling. Post-congress interaction capture templates pre-loaded in OneCRM."
      }
    ]
  },
  "msl-copilot": {
    title: "Pre-call intelligence briefing (enhanced with HCP Explorer)",
    steps: [
      {
        type: "input",
        label: "MSL request",
        content: "Prepare me for my meeting with Dr. Sarah Chen tomorrow. She's a community dermatologist at Cleveland Clinic."
      },
      {
        type: "processing",
        label: "MSL Copilot → calls Expert Intelligence Hub",
        items: [
          "HCP Explorer: retrieving Dr. Chen 360° profile...",
          "Publications: 34 total, 12 in AD, h-index 28...",
          "Trial activity: sub-investigator on LIBERTY AD CHRONOS...",
          "OneCRM: 6 Sanofi interactions in last 12 months...",
          "interaction signals: 3 recent MedVerse queries (last 30 days)...",
          "Generating personalized briefing..."
        ]
      },
      {
        type: "draft",
        label: "Enhanced pre-call brief",
        content: `**Pre-Call Brief: Dr. Sarah Chen — Aug 7, 2026**

**Expert Profile (from HCP Explorer)**
- Specialty: Dermatology (community practice, Cleveland Clinic network)
- Publications: 34 total (12 AD-focused), h-index 28
- Trial experience: Sub-investigator on LIBERTY AD CHRONOS
- Expert tier: Community Influencer (trending toward National KOL)
- Publication growth: +35% YoY — expanding from clinical AD to biomarker research

**Sanofi Engagement History (OneCRM)**
- 2 advisory board participations (2024, 2025)
- 1 speaker program (regional, 2025)
- 3 MSL field visits in last 12 months
- Relationship strength: Strong

**Recent MedVerse Activity (Interaction Signals)**
- Queried dupilumab vs abrocitinib head-to-head data (Jul 28)
- Explored active clinical trials — expressed referral interest (Jul 28)
- Reviewed type 2 inflammation cross-TA content (Jul 15)

**Suggested Discussion Topics**
1. JADE DARE comparative data — she's actively evaluating biologic vs JAK
2. Clinical trial referral pathway — LIBERTY CUPID may interest her CSU patients
3. Biomarker research — her publication trajectory suggests growing interest

**Recommended approach:** Lead with JADE DARE safety differentiation. Her publication growth and trial experience suggest she may be ready for a PI role — explore interest in upcoming protocols.`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "Promotional Risk", agentId: "promo-risk", status: "pass", detail: "No promotional language detected. Briefing uses clinical terminology and published data references." },
          { agent: "Off-Label Monitor", agentId: "off-label", status: "pass", detail: "All discussion topics align with approved indications. No off-label content identified." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Interaction logged — MSL ID: FML-2847, HCP: Dr. Sarah Chen (NPI: 1234567890), briefing generated with HCP Explorer profile + interaction signals. Compliance record #MSL-2026-08-2847." }
        ]
      },
      {
        type: "output",
        label: "Approved briefing delivered",
        badge: "APPROVED",
        content: "360° briefing delivered to MSL mobile app. Pre-call checklist created. Post-call documentation template pre-populated. Expert tier trend noted — recommend flagging Dr. Chen for elevated engagement track."
      }
    ]
  },
  "literature-scout": {
    title: "Publication search with verification",
    steps: [
      {
        type: "input",
        label: "Research request",
        content: "Find recent publications on long-term dupilumab safety in pediatric atopic dermatitis. I need this for a medical education slide deck."
      },
      {
        type: "processing",
        label: "Literature Scout processing",
        items: [
          "Searching PubMed (2024-2026): dupilumab AND pediatric AND safety...",
          "Querying internal approved content library...",
          "Cross-referencing congress abstract database...",
          "Ranking by impact factor and relevance..."
        ]
      },
      {
        type: "draft",
        label: "Draft literature summary",
        content: `**5 Key Publications Identified**

1. **Paller AS et al. (2026)** — "Three-year dupilumab safety in adolescents: OLE results" — *JAMA Dermatology* — IF: 15.4
   - n=420, no new safety signals through 156 weeks, conjunctivitis stable at 8.2%

2. **Cork MJ et al. (2025)** — "Dupilumab in children 6mo-5yr: LIBERTY AD PED interim" — *NEJM* — IF: 176.1
   - Favorable safety in youngest population, growth velocity unaffected

3. **Simpson EL et al. (2025)** — "Dupilumab 5-year OLE: integrated safety" — *Br J Dermatol* — IF: 11.2
   - 42% maintained IGA 0/1 at 5 years, safety consistent

4. **Guttman-Yassky E et al. (2026)** — "Biologics vs JAK safety in pediatric AD" — *JACI* — IF: 14.3
   - Dupilumab lower serious AE rate vs JAK in under-18 population

5. **Thyssen JP et al. (2025)** — "Real-world pediatric dupilumab persistence" — *Dermatology* — IF: 4.9
   - 89% persistence at 12 months in Danish national registry`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "warn", detail: "Publication #3: '42% maintained IGA 0/1 at 5 years' — source confirmed but this is the ALL-AGES OLE figure. Pediatric-specific 5-year figure is 38%. Correcting." },
          { agent: "Content Expiration", agentId: "expiration", status: "pass", detail: "All 5 publications are current. No retracted or superseded papers detected." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Literature search logged — 5 publications retrieved, 1 correction applied, intended use: medical education slide deck." }
        ]
      },
      {
        type: "output",
        label: "Verified summary delivered",
        badge: "CORRECTED & APPROVED",
        content: "Literature summary delivered with corrected pediatric-specific figure (38% IGA 0/1 at 5 years). Correction annotated for transparency. Sources packaged with DOI links."
      }
    ]
  },
  "trial-match": {
    title: "Patient-trial matching with live Sanofi portfolio",
    steps: [
      {
        type: "input",
        label: "HCP request",
        content: "I have a patient — Maria Garcia, DOB June 12, 1975, lives in Philadelphia. She has moderate-to-severe Crohn's disease, failed anti-TNF and vedolizumab. Are there any Sanofi trials she might qualify for?"
      },
      {
        type: "compliance",
        label: "Privacy agent intercepts",
        checks: [
          { agent: "PHI Protection", agentId: "privacy", status: "flag", detail: "⚠ Protected health information detected: patient name (Maria Garcia), date of birth (06/12/1975), geographic location (Philadelphia). Redacting before processing." }
        ]
      },
      {
        type: "processing",
        label: "Trial Matching Agent processing (de-identified)",
        items: [
          "Patient de-identified → Patient_CD_4182",
          "Parsing: Crohn's Disease, moderate-to-severe, anti-TNF-refractory, vedolizumab-refractory...",
          "Querying Sanofi US Clinical Studies portfolio: 91 active studies across 13 TAs...",
          "Filtering: Gastroenterology → Crohn's Disease → Recruiting status...",
          "Cross-referencing eligibility: biologic-experienced, age 51, Northeast US...",
          "3 recruiting Sanofi Crohn's trials identified — checking site proximity to Philadelphia..."
        ]
      },
      {
        type: "draft",
        label: "Matching results from Sanofi Studies portfolio (de-identified)",
        content: `**3 Sanofi Trial Matches for Patient_CD_4182**

| Trial (NCT ID) | Drug | Phase | Study | Match strength |
|-----------------|------|-------|-------|---------------|
| [NCT07184931](https://clinicaltrials.gov/study/NCT07184931) | **Duvakitug** | Phase 3 | Crohn's Disease Induction | ★★★ Best match |
| [NCT07184944](https://clinicaltrials.gov/study/NCT07184944) | **Duvakitug** | Phase 3 | Crohn's Disease Maintenance | ★★★ If induction response |
| [NCT06637631](https://clinicaltrials.gov/study/NCT06637631) | **SAR441566** | Phase 2 | Crohn's Disease Ph2 | ★★ Alternative mechanism |

**Best match: Duvakitug Induction (NCT07184931)**
- **Status:** Actively recruiting
- **Mechanism:** Anti-TL1A monoclonal antibody — novel mechanism of action distinct from prior anti-TNF and anti-integrin therapy
- **Key eligibility:** Moderate-to-severe CD, biologic-experienced patients eligible, ages 18-75
- **Patient fit:** Anti-TNF and vedolizumab failure history makes this patient an ideal candidate for a new mechanism
- **Nearest sites:** University of Pennsylvania, Thomas Jefferson University (Philadelphia metro)

**Sequential opportunity:** If patient responds to induction, automatic eligibility for Duvakitug Maintenance (NCT07184944)

**Data source:** Sanofi US Clinical Studies Explorer — 91 studies, 55 recruiting, data from sanofistudies.com`
      },
      {
        type: "compliance",
        label: "Final governance review",
        checks: [
          { agent: "PHI Protection", agentId: "privacy", status: "pass", detail: "All outputs de-identified. No PHI in final output. Patient_CD_4182 token is session-only and not persisted." },
          { agent: "Scientific Verification", agentId: "sci-verify", status: "pass", detail: "Trial NCT IDs verified against Sanofi Studies portfolio and ClinicalTrials.gov. All 3 trials confirmed actively recruiting. Eligibility criteria cross-checked against patient profile." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Trial matching logged — 3 Sanofi matches from 91-study portfolio. PHI redacted. Best match: NCT07184931 (Duvakitug Induction). Compliance record #TM-2026-08-2041." }
        ]
      },
      {
        type: "output",
        label: "De-identified results delivered",
        badge: "PHI-SAFE & PORTFOLIO-MATCHED",
        content: "3 Sanofi trial matches identified from live portfolio (91 studies). Best match: Duvakitug Crohn's Disease Induction (NCT07184931) — novel anti-TL1A mechanism, actively recruiting, Philadelphia sites available. MSL notified for site referral coordination."
      }
    ]
  },
  "patient-nav": {
    title: "Patient interaction with AE detection",
    steps: [
      {
        type: "input",
        label: "Patient message",
        content: "Hi, I started Dupixent 3 weeks ago for my eczema. The itching is getting better which is great, but I've been having really bad eye redness and watering for the past week. My eyes are so irritated I can barely wear my contacts. Should I be worried?"
      },
      {
        type: "processing",
        label: "Patient Navigator processing",
        items: [
          "Analyzing patient message for clinical context...",
          "Identifying: treatment (Dupixent), timeline (3 weeks), symptom (eye redness/watering)...",
          "Retrieving approved patient-facing safety information...",
          "Generating supportive response..."
        ]
      },
      {
        type: "compliance",
        label: "AE Detection agent intercepts",
        checks: [
          { agent: "AE Detection", agentId: "ae-detect", status: "flag", detail: "🚨 ADVERSE EVENT DETECTED\n\nProduct: dupilumab (Dupixent)\nEvent: conjunctivitis / ocular surface disease\nOnset: ~2 weeks after initiation\nSeverity: moderate (impacting daily activity)\nReporter: patient (direct)\n\n→ Auto-creating pharmacovigilance case\n→ Routing to Safety team\n→ 15-day reporting timer initiated" }
        ]
      },
      {
        type: "draft",
        label: "Draft patient response",
        content: `Thank you for sharing this with us. It's good to hear your itching is improving!

**About your eye symptoms:** Eye redness, watering, and irritation (conjunctivitis) is a known side effect that some patients experience with Dupixent. It occurs in approximately 10% of patients.

**What you should do:**
- **Contact your prescribing doctor** to discuss your eye symptoms
- Use preservative-free artificial tears for comfort
- Avoid wearing contact lenses until your doctor evaluates your eyes
- **Do not stop** your Dupixent injections without talking to your doctor first`
      },
      {
        type: "compliance",
        label: "Final governance review",
        checks: [
          { agent: "Fair Balance", agentId: "fair-balance", status: "pass", detail: "Response includes appropriate safety context. Directs to HCP for medical decision. No treatment modification advice." },
          { agent: "PHI Protection", agentId: "privacy", status: "pass", detail: "No PHI in response. Patient identity protected in all logs." },
          { agent: "AE Detection", agentId: "ae-detect", status: "logged", detail: "PV case CASE-2026-AE-09284 created. Safety team notified. 15-day clock started (due: 2026-08-21)." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Full interaction logged with AE flag, response text, and PV case linkage." }
        ]
      },
      {
        type: "output",
        label: "Response delivered + PV case created",
        badge: "AE CAPTURED & APPROVED",
        content: "Patient receives supportive response. Adverse event auto-captured, PV case created, safety team notified, 15-day timer active. Zero manual effort."
      }
    ]
  },
  "insights-agent": {
    title: "Field intelligence with engagement gap analysis",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "Medical affairs request",
        content: "Who are emerging experts in our dermatology portfolio that we currently have no engagement with? I need this for strategic planning."
      },
      {
        type: "processing",
        label: "Insights Agent → calls Expert Intelligence Hub",
        items: [
          "HCP Explorer: loading dermatology expert universe...",
          "Analyzing publication velocity and congress visibility trends...",
          "OneCRM: cross-referencing engagement history...",
          "Identifying experts with >40% publication growth and <2 interactions...",
          "Generating strategic engagement gap report..."
        ]
      },
      {
        type: "chart",
        chartId: "engagementGap"
      },
      {
        type: "draft",
        label: "Strategic insight report",
        content: `**25 rising experts identified with minimal Sanofi engagement**

These experts are publishing at accelerating rates in Sanofi-relevant disease areas with zero or minimal company engagement. Competitive medical affairs teams may identify them first.

**Immediate action recommended for top 5:**
1. **Dr. E. Vasquez (UCSF)** — IL-33 / airway biology, +67% pub growth, 0 Sanofi interactions. Presenting at ATS 2026.
2. **Dr. K. Tanaka (Keio)** — AD biomarkers, +58% growth, 1 interaction. Leading Japan biomarker consortium.
3. **Dr. A. Okafor (Hopkins)** — Pediatric EoE, +52% growth, 0 interactions. PI on competitor-sponsored EoE trial.
4. **Dr. L. Bergström (Karolinska)** — CRSwNP genomics, +48% growth, 1 interaction. EADV 2026 presenter.
5. **Dr. R. Gupta (Northwestern)** — Type 2 biomarkers, +44% growth, 0 interactions. Trending toward National KOL tier.

**Strategic risk:** Dr. Okafor is PI on a competitor EoE trial. If we delay engagement, competitive lock-in becomes likely.`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "Field Activity Risk", agentId: "field-risk", status: "pass", detail: "Engagement gap analysis based on public data and internal CRM records. No competitive intelligence concerns flagged." },
          { agent: "AI Explainability", agentId: "explainability", status: "pass", detail: "Rising star classification: publication growth >40% YoY + congress presence increase + citation acceleration. Data sources: Veeva Link publications DB, congress registration records, OneCRM." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Strategic insight report logged — 25 engagement gaps identified across dermatology portfolio. Report generated for medical affairs leadership." }
        ]
      },
      {
        type: "output",
        label: "Strategic insights delivered",
        badge: "REVIEWED & APPROVED",
        content: "25 rising experts flagged with engagement gap analysis. Territory-level MSL action items generated. Dr. Okafor flagged as competitive risk for immediate outreach."
      }
    ]
  },
  "strategy-advisor": {
    title: "Cross-TA medical strategy synthesis",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "Medical affairs leadership query",
        content: "Give me a strategic landscape assessment for our moderate-to-severe AD franchise. I need competitive positioning, evidence gaps, and recommended priorities for the next 12 months."
      },
      {
        type: "processing",
        label: "Medical Strategy Advisor processing",
        items: [
          "Literature Intelligence: scanning 2,400+ AD publications (2024–2026)...",
          "HCP Explorer: analyzing expert sentiment and prescribing trends...",
          "interaction signals: aggregating field insights from 340 MSL interactions...",
          "Competitive pipeline tracker: mapping 18 active AD mechanisms...",
          "Congress intelligence: synthesizing AAD 2026 + EADV 2025 themes...",
          "Cross-referencing payer landscape and HEOR evidence base..."
        ]
      },
      {
        type: "chart",
        chartId: "strategyLandscape"
      },
      {
        type: "draft",
        label: "Strategic landscape assessment",
        content: `**Moderate-to-Severe AD — Franchise Strategy Brief (August 2026)**

**Competitive positioning: STRONG but narrowing**
Dupilumab maintains 42% publication share of voice — the largest of any single mechanism. However, JAK inhibitors collectively command 28% and are growing fastest (+12% YoY). OX40/OX40L is emerging as the next potential disruptor (5% share, all in last 18 months).

**Key evidence gaps identified:**
| Gap | Priority | Competitive risk | Recommended action |
|-----|----------|-----------------|-------------------|
| Long-term JAK safety comparison | Critical | Abrocitinib 3-year data expected Q1 2027 | Accelerate 5-year H2H safety analysis |
| Biomarker-guided treatment selection | High | IL-13 competitors positioning on biomarker subgroups | Launch type 2 biomarker consortium |
| Pediatric real-world evidence | High | Tralokinumab expanding to pediatric | Fast-track pediatric RWE registry |
| Atopic march disease modification | Medium | No competitor data yet — first-mover opportunity | Fund ADAPT prevention study readout |

**Interaction signal themes (top 3 from MSL interactions):**
1. **HCP concern #1:** "When should I switch from dupilumab to a JAK?" — 67 inquiries this quarter
2. **HCP concern #2:** Need for head-to-head data beyond abrocitinib (upadacitinib H2H requested)
3. **HCP opportunity:** Growing interest in treating AD + asthma concurrently — cross-TA messaging resonating

**Strategic recommendations (next 12 months):**
1. **Defend:** Publish 5-year H2H safety advantage vs JAK class — most requested data point from MSLs
2. **Expand:** Position cross-TA type 2 story (AD + asthma + CRSwNP) as differentiation no competitor can match
3. **Pre-empt:** Build biomarker-guided treatment algorithm before IL-13 competitors claim the subgroup narrative
4. **Invest:** Pediatric RWE to lock in first-line positioning before tralokinumab pediatric data arrives`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "AI Explainability", agentId: "explainability", status: "pass", detail: "Strategy synthesis methodology: 42% weight to publication analysis (Literature Intelligence), 25% to interaction signals, 20% to competitive pipeline data (public filings + congress), 13% to payer landscape. All sources cited with provenance." },
          { agent: "Scientific Verification", agentId: "sci-verify", status: "pass", detail: "All competitive claims verified against published data. Share-of-voice calculation based on PubMed-indexed publications only. JAK safety comparison references JADE DARE and HEADS UP published results." },
          { agent: "Inspection Readiness", agentId: "inspection", status: "logged", detail: "Strategic assessment logged with full data provenance. Competitive intelligence derived from public sources only (publications, ClinicalTrials.gov, congress proceedings). No proprietary competitive data accessed." }
        ]
      },
      {
        type: "output",
        label: "Strategy brief delivered",
        badge: "EXECUTIVE READY",
        content: "AD franchise strategy brief delivered with competitive landscape, 4 prioritized evidence gaps, field intelligence themes, and 4 strategic recommendations. Exportable to medical strategy deck format. Recommended review: Medical Affairs Leadership Team."
      }
    ]
  },
  "gap-expert": {
    title: "Evidence gap to expert identification pipeline",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "Medical affairs evidence gap trigger",
        content: "Our HEOR team flagged a critical gap: we have no real-world evidence on dupilumab outcomes in elderly AD patients (≥65 years). Payers are pushing back on coverage for this population. We need to identify researchers who can design and run an observational study — ideally someone with geriatric dermatology expertise, access to an elderly cohort, and registry or claims database experience."
      },
      {
        type: "processing",
        label: "Gap-to-Expert Agent — multi-source intelligence scan",
        items: [
          "Parsing evidence gap: dupilumab + atopic dermatitis + elderly (≥65) + real-world evidence...",
          "Literature Intelligence: scanning 36M PubMed records for geriatric AD + RWE publications...",
          "Expert Intelligence Hub: querying 4.9M HCP profiles filtered by geriatric dermatology...",
          "Narrowing: investigators with elderly cohort access + registry/database PI experience...",
          "Cross-referencing: publication overlap with dupilumab, biologics, or IL-4/IL-13 pathway...",
          "OneCRM: checking Sanofi engagement history and collaboration feasibility...",
          "Congress footprint: scanning AAD, EADV, SID, AGS for geriatric derm presentations...",
          "Scoring 47 candidates across 6 gap-alignment dimensions..."
        ]
      },
      {
        type: "chart",
        chartId: "gapExpertMatch"
      },
      {
        type: "draft",
        label: "Top 5 expert matches for evidence gap",
        content: `**Evidence gap:** Real-world dupilumab outcomes in elderly AD patients (≥65 years)
**Candidates scanned:** 47 | **Top matches:** 5

| Rank | Expert | Institution | Gap-fit score | Key qualification | Sanofi history |
|------|--------|-----------|---------------|-------------------|----------------|
| 1 | **Dr. Laura Margolis** | UPenn Perelman | 87/100 | PI on DERMA-AGING registry (12,400 patients ≥60). 18 geriatric AD publications. Led Medicare claims analysis of biologic utilization in elderly | 2 advisory boards (2024–25) |
| 2 | **Dr. Matthias Augustin** | UKE Hamburg | 82/100 | PI of German AD Registry (TREATgermany). >200 RWE publications. Largest European elderly AD cohort (3,800 patients ≥65) | 1 ISR (completed 2025) |
| 3 | **Dr. Francesca Sampogna** | IDI-IRCCS Rome | 78/100 | QoL outcomes specialist for elderly dermatology patients. Italian AD registry lead. 8 publications on dupilumab in special populations | No prior engagement |
| 4 | **Dr. Robert Kirsner** | Univ of Miami | 75/100 | Wound care + geriatric derm. PI on CMS real-world evidence program. Access to 8,200 Medicare AD patients | 1 speaker program (2023) |
| 5 | **Dr. Hideki Fujita** | Nihon Univ Tokyo | 72/100 | Japanese geriatric AD specialist. Published dupilumab outcomes in patients ≥70. Access to JMDC claims database (45M lives) | No prior engagement |

**Why these experts?**
- All 5 have **active registry or claims database access** with elderly AD populations
- 4 of 5 have **published on biologic outcomes in elderly** within the past 24 months
- Geographic diversity: US (2), EU (2), APAC (1) — supports multi-regional study design
- Estimated combined cohort access: **>30,000 elderly AD patients**`
      },
      {
        type: "draft",
        label: "Recommended study design & engagement plan",
        content: `**Proposed evidence generation strategy:**

**Study concept:** Multi-center retrospective cohort study — dupilumab real-world outcomes in AD patients ≥65 years
**Design:** Registry-linked observational study across 3 sites (US, EU, APAC)
**Target N:** 2,500 patients | **Endpoints:** EASI-75, treatment persistence, safety in elderly, QoL (DLQI), healthcare utilization

**Engagement roadmap:**

| Phase | Timeline | Action | Lead expert |
|-------|----------|--------|-------------|
| 1. Scientific exchange | Aug 2026 | MSL outreach to Dr. Margolis and Dr. Augustin — discuss gap and gauge interest | MSL Northeast (Dr. Margolis), MSL Germany (Dr. Augustin) |
| 2. Feasibility assessment | Sep 2026 | Protocol concept shared with top 3 experts for feedback on cohort access and endpoints | Dr. Margolis (lead) |
| 3. Steering committee | Oct 2026 | Convene 5-expert steering committee, finalize protocol, define data sharing framework | All 5 experts |
| 4. ISR submission | Nov 2026 | Investigator-sponsored research proposal submitted through Sanofi ISR portal | Dr. Margolis (PI) |

**Payer impact:** Study results projected for Q3 2027 — aligned with 2028 coverage decision cycle for Medicare Part D formulary reviews

**Cross-agent handoffs:**
- → **MSL Copilot**: pre-call briefing materials generated for Dr. Margolis and Dr. Augustin outreach
- → **Medical Strategy Advisor**: evidence gap status updated in competitive landscape tracker
- → **Congress Planning Agent**: flag AAD 2027 abstract submission window for preliminary results`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Gap-to-Expert pipeline logged — evidence gap: elderly AD RWE, 47 candidates scanned, 5 recommended. Study concept: multi-center retrospective cohort. Compliance record #GTE-2026-08-0187." },
          { agent: "AI Explainability", agentId: "explainability", status: "pass", detail: "Expert scoring methodology: 6-dimension weighted model — geriatric RWE publications (25%), elderly cohort access (25%), dupilumab/biologic experience (15%), registry PI status (15%), congress visibility (10%), Sanofi collaboration feasibility (10%). All scores auditable with source data links." }
        ]
      },
      {
        type: "output",
        label: "Evidence gap pipeline activated",
        badge: "GAP MAPPED & EXPERTS IDENTIFIED",
        content: "5 expert matches identified for elderly AD real-world evidence gap. Lead candidate: Dr. Laura Margolis (UPenn) — 87/100 gap-fit score, PI on DERMA-AGING registry with 12,400 elderly patients. 4-phase engagement roadmap generated. MSL Copilot pre-call briefings queued. Medical Strategy Advisor notified to update evidence gap tracker."
      }
    ]
  },
  "msl-connect": {
    title: "HCP finds their assigned MSL(s)",
    steps: [
      {
        type: "input",
        label: "HCP request",
        content: "I'm Dr. Sarah Chen, a dermatologist at Northwestern Memorial Hospital in Chicago. I have questions about the long-term dupilumab data presented at AAD and would like to connect with someone from your medical team. Who is my MSL?"
      },
      {
        type: "processing",
        label: "MSL Connect processing",
        items: [
          "Verifying HCP identity: Dr. Sarah Chen, NPI #1234567890...",
          "HCP Explorer: loading profile — dermatology, Northwestern Memorial, Chicago IL...",
          "Territory lookup: Midwest Region → Illinois → Cook County...",
          "OneCRM: retrieving MSL territory assignments for Immunology + Dermatology...",
          "Matching by therapeutic area alignment and geographic territory...",
          "Checking MSL availability and recent engagement history..."
        ]
      },
      {
        type: "draft",
        label: "MSL assignment results",
        content: `**Your Sanofi Medical Science Liaison Team**

| MSL | Territory | Therapeutic Area | Coverage | Last Activity |
|-----|-----------|-----------------|----------|---------------|
| **Dr. James Rivera, PharmD** | Midwest – IL/WI/IN | Immunology & Dermatology | Primary MSL | Attended your AAD poster (March 2026) |
| **Dr. Priya Mehta, PhD** | Midwest – IL/IN | Respiratory & Cross-TA | Secondary MSL | Available for type 2 inflammation topics |

**Primary MSL: Dr. James Rivera**
- Based in Chicago, IL — covers Northwestern, Rush, UChicago, Loyola
- Specialty expertise: atopic dermatitis, prurigo nodularis, CSU
- 6 prior interactions with your institution (OneCRM)
- Last contact: March 22, 2026 — post-AAD follow-up at Northwestern

**How to connect:**
- 📧 Request a scientific exchange via MedVerse
- 📅 Schedule a 1:1 meeting (available times shared upon request)
- 📋 Submit a medical information request for formal response

**Relevant to your question:** Dr. Rivera attended the AAD 2026 late-breaker session on 5-year dupilumab OLE data and can discuss the findings in a non-promotional scientific exchange.`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "PHI Protection", agentId: "privacy", status: "pass", detail: "HCP professional profile only — no personal health data accessed. NPI verified through public NPI registry. Contact facilitated through official Sanofi channels only." },
          { agent: "Promotional Risk", agentId: "promo-risk", status: "pass", detail: "Response is non-promotional. No product claims or marketing messages included. MSL interaction framed as scientific exchange per SOPs." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "MSL Connect request logged — Dr. Sarah Chen (NPI #1234567890), Northwestern Memorial. Primary MSL: Dr. James Rivera. Request type: scientific exchange re: AAD 2026 data. Compliance record #MC-2026-08-0412." }
        ]
      },
      {
        type: "output",
        label: "Connection facilitated",
        badge: "VERIFIED & NON-PROMOTIONAL",
        content: "Your primary MSL is Dr. James Rivera (Immunology & Dermatology, Midwest). A notification has been sent to Dr. Rivera with your request to discuss the AAD 2026 dupilumab long-term data. Expected response within 1 business day. All interactions logged for compliance."
      }
    ]
  },
  "ingredient-safety": {
    title: "Excipient safety check with allergy cross-reference",
    steps: [
      {
        type: "input",
        label: "HCP prescribing query",
        content: "I'm about to prescribe Dupixent (dupilumab) for a 34-year-old patient with moderate-to-severe AD. She has a documented severe allergy to polysorbate 80 and is also lactose intolerant (religious dietary restriction — halal observant). Can you check the full ingredient profile and flag any concerns before I prescribe?"
      },
      {
        type: "processing",
        label: "Ingredient Safety Agent — formulation analysis",
        items: [
          "Loading Dupixent (dupilumab) product formulation from Sanofi Ingredient Database...",
          "Extracting full excipient list: active + inactive ingredients...",
          "Cross-referencing patient allergy profile: polysorbate 80 (severe)...",
          "Checking dietary/religious compatibility: halal certification status...",
          "Literature Intelligence: scanning excipient cross-reactivity publications...",
          "Querying FDA Inactive Ingredient Database for alternative formulations...",
          "Generating safety assessment with clinical recommendation..."
        ]
      },
      {
        type: "draft",
        label: "Dupixent (dupilumab) — full ingredient analysis",
        content: `**Product:** Dupixent® (dupilumab) 300 mg/2 mL pre-filled syringe
**Source:** Sanofi Ingredient Database + FDA label (BLA 761055)

| Ingredient | Role | Concentration | Allergy flag | Dietary flag |
|------------|------|---------------|-------------|-------------|
| **Dupilumab** | Active (anti-IL-4Rα mAb) | 150 mg/mL | — | — |
| L-histidine | Buffer | 1.55 mg/mL | — | ✅ Halal |
| L-histidine HCl monohydrate | Buffer | 2.24 mg/mL | — | ✅ Halal |
| L-arginine HCl | Stabilizer | 8.18 mg/mL | — | ✅ Halal |
| **Polysorbate 80** | Surfactant | 2.0 mg/mL | ⚠️ **ALERT** | ✅ Halal |
| Sucrose | Tonicity agent | 50 mg/mL | — | ✅ Halal |
| Water for injection | Solvent | q.s. | — | ✅ Halal |

**No lactose, gelatin, porcine-derived, or animal-origin excipients detected.**`
      },
      {
        type: "compliance",
        label: "Safety alert — polysorbate 80",
        checks: [
          { agent: "AE Detection", agentId: "ae-detect", status: "flag", detail: "⚠️ ALLERGY MATCH: Dupixent contains polysorbate 80 (2.0 mg/mL) as a surfactant. Patient has documented severe allergy to polysorbate 80. This is a contraindication-level concern requiring clinical evaluation before prescribing." }
        ]
      },
      {
        type: "draft",
        label: "Clinical safety assessment",
        content: `**⚠️ POLYSORBATE 80 ALERT — Requires clinical evaluation**

**Risk level:** HIGH — patient has documented severe allergy; Dupixent contains polysorbate 80 as an essential surfactant (2.0 mg/mL)

**Clinical context:**
- Polysorbate 80 is used in many biologic formulations as a stabilizing surfactant
- Severe polysorbate 80 allergy is rare but documented — reactions range from urticaria to anaphylaxis
- Cross-reactivity with polysorbate 20 (Tween 20) is also possible

**Literature evidence:**
- Schwartzberg et al. (2020) — documented 3 cases of polysorbate 80 hypersensitivity in biologic users; skin testing recommended before administration
- FDA Safety Communication (2019) — excipient allergy screening recommended for injectable biologics in patients with surfactant sensitivity history

**Recommendations:**
1. **Refer to allergist** for polysorbate 80 skin-prick testing before initiating Dupixent
2. **If confirmed allergy:** Consider desensitization protocol under medical supervision, OR discuss alternative IL-4/IL-13 pathway agents with different excipient profiles
3. **Alternative to consider:** Tralokinumab (Adbry®) uses polysorbate 20 — but cross-reactivity risk exists; allergist should test for both
4. **If prescribing proceeds:** First dose must be administered in a supervised clinical setting with anaphylaxis preparedness

**Halal assessment:** ✅ COMPLIANT — All Dupixent excipients are synthetic or plant-derived. No animal-origin ingredients, no gelatin, no porcine derivatives, no lactose. Product is compatible with halal dietary requirements.

**Data source:** Sanofi Ingredient Database · FDA Inactive Ingredient Guide · [sanofimedicalinformation.com/s/ingredient-checker](https://sanofimedicalinformation.com/s/ingredient-checker?language=en_US&CN=US&HCP=Yes)`
      },
      {
        type: "compliance",
        label: "Final governance review",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "pass", detail: "Excipient list verified against FDA-approved label (BLA 761055, Rev. 2025). Polysorbate 80 concentration confirmed at 2.0 mg/mL. Literature references validated." },
          { agent: "AE Detection", agentId: "ae-detect", status: "flag", detail: "Potential adverse event signal: prescribing a polysorbate 80-containing product to a patient with documented severe polysorbate 80 allergy. Safety alert elevated to HCP with clinical recommendations. Event logged for pharmacovigilance review." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Ingredient safety check logged — Dupixent formulation analysis for patient with polysorbate 80 allergy + halal dietary requirement. Safety alert issued. Allergist referral recommended. Compliance record #IS-2026-08-0094." }
        ]
      },
      {
        type: "output",
        label: "Safety assessment delivered",
        badge: "SAFETY ALERT ISSUED",
        content: "⚠️ Dupixent contains polysorbate 80 — patient has documented severe allergy. Allergist referral recommended for skin-prick testing before initiation. Halal dietary assessment: COMPLIANT — all excipients are synthetic or plant-derived. Full ingredient analysis with literature evidence and alternative options delivered. Pharmacovigilance team notified."
      }
    ]
  },
  "mlr": {
    title: "Real-time MLR content review with auto-correction",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "Content submitted for MLR review",
        content: "MSL slide deck submitted by Medical Affairs — 'Dupixent in Moderate-to-Severe AD: 5-Year Efficacy & Safety Update.' 14 slides, intended for scientific exchange at upcoming EADV satellite symposium. Requesting expedited MLR clearance."
      },
      {
        type: "processing",
        label: "MLR Review Agent — automated content analysis",
        items: [
          "Ingesting 14-slide deck: parsing text, claims, figures, and references...",
          "Cross-referencing all claims against approved FDA label (BLA 761055, Rev. 2025)...",
          "Checking against Sanofi Core Data Sheet (CDS) v12.3...",
          "Scanning for promotional language patterns (superlatives, unsubstantiated comparisons)...",
          "Verifying fair balance: efficacy-to-safety mention ratio analysis...",
          "Validating all 23 literature citations against source publications...",
          "Checking data currency: flagging any references >24 months old...",
          "Running competitive claim review: ensuring no off-label comparisons..."
        ]
      },
      {
        type: "chart",
        chartId: "mlrReviewSummary"
      },
      {
        type: "draft",
        label: "MLR review findings — 6 issues identified across 14 slides",
        content: `**MLR Automated Review — Dupixent AD 5-Year Update Deck**
Review ID: MLR-2026-08-0412 | Submitted: Aug 6, 2026 | Priority: Expedited

**Overall risk level: MODERATE — 6 issues found, 2 require correction before approval**

| # | Slide | Issue type | Severity | Finding |
|---|-------|-----------|----------|---------|
| 1 | Slide 3 | **Promotional language** | 🔴 High | Claim: "Dupixent delivers **superior** long-term disease control" — superlative language without head-to-head superiority claim in label. Must use "sustained" or "durable" instead |
| 2 | Slide 7 | **Fair balance** | 🔴 High | 4 efficacy claims in sequence with no safety context until Slide 11. FDA guidance requires safety information proximate to efficacy claims |
| 3 | Slide 5 | **Data currency** | 🟡 Medium | Reference #8 (Cork et al. 2023) superseded by Cork et al. 2025 with updated 5-year OLE data. Replace with current publication |
| 4 | Slide 9 | **Claim substantiation** | 🟡 Medium | Figure shows "IGA 0/1 response maintained at 5 years: 42%" — correct for all-ages OLE but slide title says "Adult population." Adult-specific figure is 44%. Correction needed |
| 5 | Slide 12 | **Off-label implication** | 🟡 Medium | Discussion of "potential disease modification" pathway — not an approved claim. Recommend adding qualifier: "Hypothesized mechanism under investigation" |
| 6 | Slide 14 | **Reference format** | 🟢 Low | 3 of 23 references missing DOI numbers. Complete for traceability |

**Auto-corrections applied (pending reviewer confirmation):**`
      },
      {
        type: "draft",
        label: "MLR auto-corrections — side-by-side comparison",
        content: `**Slide 3 — Promotional language correction:**
- ❌ Original: "Dupixent delivers **superior** long-term disease control vs conventional therapy"
- ✅ Corrected: "Dupixent demonstrated **sustained** long-term disease control through 5 years of continuous treatment"
- 📋 Rationale: "Superior" implies comparative superiority claim not supported by label. "Sustained" accurately reflects OLE data without comparative implication

**Slide 7 — Fair balance insertion:**
- ❌ Original: Slides 5–7 contain 4 consecutive efficacy claims with no safety mention
- ✅ Corrected: Inserted safety summary after Slide 6: "The most common adverse reactions (incidence ≥1%) are injection site reactions, conjunctivitis, blepharitis, oral herpes, keratitis, eye pruritus, other herpes simplex virus infection, and dry eye (USPI Section 6.1)"
- 📋 Rationale: FDA expects fair balance — safety information must accompany efficacy claims within reasonable proximity

**Slide 5 — Reference update:**
- ❌ Original: Cork MJ et al. JAMA Derm 2023; 159(12):1345-52
- ✅ Corrected: Cork MJ et al. JAMA Derm 2025; 161(3):289-98 (5-year OLE final analysis)

**Slide 9 — Data accuracy correction:**
- ❌ Original: "Adult population: IGA 0/1 at 5 years: 42%"
- ✅ Corrected: "Adult population: IGA 0/1 at 5 years: 44%" (source: adult subgroup analysis, Table 3)`
      },
      {
        type: "compliance",
        label: "Governance layer cross-check",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "warn", detail: "Slide 9 data discrepancy confirmed: 42% is the all-ages figure; adult-specific is 44% per OLE Table 3. Auto-correction validated against source publication." },
          { agent: "Promotional Risk", agentId: "promo-risk", status: "flag", detail: "Slide 3 flagged: 'superior' is a comparative superiority claim requiring Phase 3 head-to-head evidence. Dupilumab does not have a superiority claim in the approved label. Auto-correction to 'sustained' resolves this finding." },
          { agent: "Fair Balance", agentId: "fair-balance", status: "warn", detail: "Efficacy-to-safety ratio was 4:0 across Slides 5–7. FDA draft guidance recommends ≤2:1 ratio in promotional materials. Safety insertion on Slide 6.5 brings ratio to 2:1. Compliant after correction." },
          { agent: "Content Expiration", agentId: "expiration", status: "pass", detail: "22 of 23 references are current (<24 months). 1 superseded reference (Cork 2023) flagged and replacement identified (Cork 2025). Post-correction: all references current." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "MLR review logged — 14-slide deck, 23 references checked, 6 findings (2 high, 3 medium, 1 low), 4 auto-corrections generated. Review ID: MLR-2026-08-0412. Reviewer queue: Dr. M. Thompson (Medical Director), L. Huang (Legal), S. Patel (Regulatory)." }
        ]
      },
      {
        type: "output",
        label: "MLR review complete — ready for human reviewer",
        badge: "6 FINDINGS · 4 AUTO-CORRECTIONS",
        content: "Automated MLR review complete in 47 seconds (vs. avg 4.2 days manual). 6 issues identified: 2 high-severity (promotional language + fair balance), 3 medium (data currency + accuracy + off-label implication), 1 low (reference format). 4 auto-corrections generated with rationale. Deck routed to 3-person review committee with AI pre-annotations. Estimated time to final approval: <24 hours."
      }
    ]
  },
  "temp-stability": {
    title: "Cold chain excursion assessment for pharmacy",
    steps: [
      {
        type: "input",
        label: "Pharmacy urgent request",
        content: "Our pharmacy refrigerator failed overnight. We discovered it this morning — the temperature logger shows the unit reached 14°C for approximately 6 hours before returning to 4°C. We have the following Sanofi products affected: 8 vials of Lantus (insulin glargine U100) 10 mL (unopened), 3 pens of Toujeo Max (insulin glargine U300), and a case of Beyfortus (nirsevimab) for our pediatric RSV program. None have been administered. Are any of these still usable?"
      },
      {
        type: "processing",
        label: "Temperature Stability Agent — multi-product batch assessment",
        items: [
          "Parsing temperature excursion: peak 14°C (~57°F), duration ~6 hours, returned to 4°C...",
          "Classifying excursion range: >8 to ≤30°C — within warm excursion band...",
          "Product 1: Lantus U100 10 mL vial — querying Sanofi Stability Calculator (not in use)...",
          "Product 2: Toujeo Max U300 3 mL pen — querying Sanofi Stability Calculator (not in use)...",
          "Product 3: Beyfortus (nirsevimab) — querying Vaccine Stability Database...",
          "Cross-referencing FDA-approved labeling for each product's excursion tolerance...",
          "Checking lot expiration dates against excursion stability windows...",
          "Generating pharmacy action plan with documentation for state board compliance..."
        ]
      },
      {
        type: "draft",
        label: "Temperature excursion assessment — 3 Sanofi products",
        content: `**Excursion event:** Refrigerator failure | Peak: 14°C (57°F) | Duration: ~6 hours | Products not administered

| # | Product | Form | Qty | Excursion range | Status | Stability assessment |
|---|---------|------|-----|-----------------|--------|---------------------|
| 1 | **Lantus** (insulin glargine U100) | 10 mL vial (unopened) | 8 | >8 to ≤30°C | ✅ **MAY BE USABLE** | Unopened Lantus vials tolerate up to 28 days at room temperature (≤30°C) per PI. 6-hour excursion at 14°C is well within tolerance. Return to refrigeration immediately. |
| 2 | **Toujeo Max** (insulin glargine U300) | 3 mL pen (unopened) | 3 | >8 to ≤30°C | ✅ **MAY BE USABLE** | Unopened Toujeo pens tolerate up to 56 days at room temperature (≤30°C) per PI. 6-hour excursion at 14°C is well within tolerance. Return to refrigeration immediately. |
| 3 | **Beyfortus** (nirsevimab-alip) | Prefilled syringe | 1 case | >8 to ≤30°C | ⚠️ **CONDITIONAL** | Beyfortus may be stored at room temperature up to 25°C for max 8 hours (single excursion, per PI). At 14°C for 6 hours, within the 8-hour window but exceeds 8°C threshold. Contact 1-800-VACCINE for lot-specific guidance. |

**Key details:**
- **Insulins (Lantus, Toujeo Max):** Both products have robust room-temperature stability windows when unopened. A 6-hour excursion to 14°C is well within labeled tolerance. Products should be returned to 2–8°C refrigeration and used within their original expiration dates.
- **Beyfortus:** More temperature-sensitive as a monoclonal antibody vaccine. The 14°C excursion is below the 25°C room temp ceiling, but the product must not have been previously excursed. **Recommend contacting Sanofi Vaccines (1-800-VACCINE) with lot numbers for definitive clearance.**
- **None of the products were frozen (≤0°C)** — no automatic discard required.

**Data source:** [Sanofi Temperature Stability Calculator](https://www.sanofimedicalinformation.com/s/stability-calculator?language=en_US&CN=US&HCP=Yes) · FDA-approved prescribing information`
      },
      {
        type: "draft",
        label: "Pharmacy action plan & documentation",
        content: `**Immediate actions:**

| Step | Action | Timeline |
|------|--------|----------|
| 1 | Return all Lantus and Toujeo Max to functioning refrigerator (2–8°C) | **Now** |
| 2 | Quarantine Beyfortus separately — label "PENDING STABILITY REVIEW" | **Now** |
| 3 | Document excursion: time discovered, logger data, peak temp, duration | **Within 1 hour** |
| 4 | Call 1-800-VACCINE with Beyfortus lot numbers for clearance | **Today** |
| 5 | File temperature excursion report per state pharmacy board requirements | **Within 24 hours** |
| 6 | Update inventory management system with excursion flag on affected lots | **Within 24 hours** |

**Documentation generated:**
- Temperature Excursion Report (auto-populated with event data)
- Product Disposition Log for each affected SKU
- Stability Calculator reference printouts for pharmacy records
- State board notification template (if required by jurisdiction)

**Preventive recommendation:** Consider adding a redundant temperature alarm with SMS/email alerts to prevent undetected overnight failures. Many state pharmacy boards now require continuous monitoring with remote notification.`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "pass", detail: "Stability assessments verified against FDA-approved prescribing information for each product. Lantus PI: store at 2–8°C, may use up to 28 days at ≤30°C (unopened). Toujeo Max PI: store at 2–8°C, may use up to 56 days at ≤30°C (unopened). Beyfortus PI: store at 2–8°C, single room-temp excursion ≤25°C for ≤8 hours." },
          { agent: "AE Detection", agentId: "ae-detect", status: "pass", detail: "No products were administered during or after the excursion. No adverse event reporting required at this time. If Beyfortus is cleared and later administered, standard pharmacovigilance monitoring applies." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Temperature excursion assessment logged — 3 products evaluated, 2 cleared (Lantus ×8, Toujeo Max ×3), 1 conditional (Beyfortus, pending Sanofi Vaccines confirmation). Excursion: 14°C peak, 6 hours. Pharmacy action plan generated. Compliance record #TS-2026-08-0031." }
        ]
      },
      {
        type: "output",
        label: "Stability assessment delivered",
        badge: "ASSESSED & DOCUMENTED",
        content: "2 of 3 products cleared: Lantus (8 vials) and Toujeo Max (3 pens) are within labeled stability tolerance — return to refrigeration. Beyfortus requires Sanofi Vaccines confirmation (1-800-VACCINE) due to stricter excursion limits. Pharmacy action plan and excursion documentation generated. No products were administered — no AE reporting required."
      }
    ]
  },
  "disease-navigator": {
    title: "Cross-TA pathway mapping from a single presenting condition",
    steps: [
      {
        type: "input",
        label: "HCP question",
        content: "I have a 34-year-old atopic dermatitis patient on topicals who has now developed adult-onset asthma and chronic nasal congestion with polyps. Three specialists, three diagnoses. Is this one disease or three? What does the biology say, and what are the treatment implications?"
      },
      {
        type: "processing",
        label: "Disease State Navigator processing",
        items: [
          "Resolving presenting conditions: atopic dermatitis, type 2 asthma, CRSwNP...",
          "Pathway lookup: all three map to type 2 inflammation (IL-4, IL-13, IL-5)...",
          "Tracing shared mediators: TSLP, IL-33, IL-25 upstream alarmins...",
          "Cross-referencing biomarker overlap: IgE, eosinophils, FeNO, periostin, TARC...",
          "Literature Intelligence: retrieving atopic march and unified airway evidence...",
          "Mapping treatment landscape across all three indications...",
          "Checking label scope for each candidate therapy..."
        ]
      },
      {
        type: "draft",
        label: "Cross-therapeutic-area disease map",
        content: `**One mechanism, three organ systems.** All three conditions sit on the **type 2 inflammation** pathway — this is a single immunologic process presenting in skin, lower airway, and upper airway.

| Presenting condition | Area | Shared pathway | Key biomarkers |
|---|---|---|---|
| Atopic Dermatitis | Dermatology | Type 2 inflammation | IgE, eosinophils, TARC/CCL17, periostin |
| Type 2 Asthma | Respiratory | Type 2 inflammation | Eosinophils, FeNO, IgE |
| CRSwNP | ENT | Type 2 inflammation | Eosinophils, IgE, tissue eosinophilia |

**The shared biology**
- **IL-4 and IL-13** drive IgE class switching, barrier disruption, and tissue remodeling across all three sites
- **IL-5** drives eosinophil maturation and survival — the common thread in airway and sinus disease
- **Upstream alarmins** (TSLP, IL-33, IL-25) initiate the cascade from epithelial injury in each organ

**Why this pattern is expected, not coincidental**
This is the **atopic march** — patients frequently progress from AD in childhood or early adulthood to asthma and rhinosinusitis. The unified airway model further links lower and upper airway disease. Your patient's timeline is a textbook presentation rather than three unrelated diagnoses.

**Adjacent conditions on the same pathway** — worth monitoring given the shared mechanism:
- **Eosinophilic Esophagitis** — screen if dysphagia or food impaction appears
- **Prurigo Nodularis** — type 2 driven, with IL-31 mediating itch

**Treatment implications**
A mechanism-level therapy can address all three presentations at once, rather than three organ-specific regimens:

| Approach | Mechanism | Label scope across these three |
|---|---|---|
| IL-4Rα blockade (dupilumab) | Blocks IL-4 **and** IL-13 signalling | Approved in all three: AD, type 2 asthma, CRSwNP |
| IL-13 only (tralokinumab, lebrikizumab) | Single cytokine | AD only |
| IL-5 / IL-5R (mepolizumab, benralizumab) | Eosinophil depletion | Asthma and CRSwNP; not AD |
| Oral JAK inhibitors | Broad intracellular signalling | AD and asthma programs; boxed warnings for MACE, malignancy, thrombosis |

**Discussion points for the treating team**
1. Coordinate across dermatology, pulmonology, and ENT — the shared mechanism argues for one treatment strategy, not three
2. Baseline the shared biomarkers (total IgE, blood eosinophils, FeNO) before starting any systemic therapy
3. Confirm which indications a given agent is actually approved for in your region before discussing it with the patient`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "pass", detail: "Pathway biology verified against the MedVerse disease knowledge base and indexed literature. Type 2 inflammation mediators (IL-4, IL-13, IL-5) and upstream alarmins (TSLP, IL-33, IL-25) confirmed for all three conditions. Atopic march and unified airway models are established, peer-reviewed disease concepts." },
          { agent: "Fair Balance", agentId: "fair-balance", status: "pass", detail: "Comparative table presents mechanism and label scope for all therapy classes including competitors. JAK inhibitor boxed warnings (MACE, malignancy, thrombosis) surfaced alongside their efficacy positioning. No efficacy claim presented without safety context." },
          { agent: "Off-Label Monitor", agentId: "off-label", status: "warn", detail: "CORRECTION APPLIED — draft initially implied a single agent could treat the adjacent conditions (EoE, prurigo nodularis) raised in the response. Rewritten to present those as conditions to monitor, and a step added directing the clinician to confirm approved indications by region. No off-label recommendation delivered." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Disease navigation logged — entry condition: atopic dermatitis. Pathway: type 2 inflammation. 3 primary + 2 adjacent conditions mapped. 4 therapy classes compared. 1 off-label correction applied before delivery. Compliance record #DN-2026-08-0173." }
        ]
      },
      {
        type: "output",
        label: "Disease map delivered",
        badge: "VERIFIED & FAIR-BALANCED",
        content: "Three diagnoses resolved to one shared mechanism — type 2 inflammation across skin, lower airway, and upper airway. Cross-TA map delivered with shared biomarkers, atopic march context, two adjacent conditions to monitor, and a fair-balanced comparison of four therapy classes with label scope. One off-label implication was caught and corrected by the governance layer before delivery."
      }
    ]
  },
  "trial-intel": {
    title: "Clinical trial landscape analysis and investigator matching",
    hasCharts: true,
    steps: [
      {
        type: "input",
        label: "Clinical operations request",
        content: "We're planning a Phase 3b dupilumab trial in moderate-to-severe AD with a biomarker-stratified enrollment design. I need the competitive trial landscape, top-enrolling sites in the US, and investigator recommendations. Target: 500 patients across 40 sites."
      },
      {
        type: "processing",
        label: "Clinical Trial Intelligence Agent processing",
        items: [
          "Querying ClinicalTrials.gov: atopic dermatitis, Phase 3/3b, recruiting/planned...",
          "Identified 47 active competitor trials in AD (22 recruiting, 25 planned)...",
          "Analyzing site-level enrollment velocity: 1,200 US investigator sites with AD experience...",
          "Cross-referencing HCP Explorer: investigator publication profiles and KOL status...",
          "Mapping enrollment competition: sites shared with active competitor trials...",
          "Scoring site readiness: IRB turnaround, screen-fail rates, diversity metrics..."
        ]
      },
      {
        type: "chart",
        chartId: "trialLandscape"
      },
      {
        type: "draft",
        label: "Competitive landscape and site recommendations",
        content: `**Dupilumab AD Phase 3b — Trial Intelligence Report**

**Competitive landscape (US, AD, Phase 2+):**
- **47 active trials** across 8 mechanisms (IL-13, JAK, OX40L, IL-31, PDE4, TSLP, IL-33, TYK2)
- **Highest enrollment competition:** JAK inhibitor trials (12 active) followed by IL-13 (8 active)
- **Biomarker-stratified trials:** Only 3 competitor trials use biomarker enrollment — this is a differentiator

**Top-enrolling US sites for AD biologics (past 24 months):**

| Rank | Site | PI | Patients enrolled (24mo) | Screen-fail rate | Active competitor trials | Risk |
|------|------|----|------------------------|-----------------|------------------------|------|
| 1 | Oregon Health Sciences Univ | Dr. E. Simpson | 142 | 12% | 2 (JAK, IL-13) | Medium |
| 2 | Icahn School of Medicine | Dr. E. Guttman-Yassky | 128 | 9% | 3 (JAK, OX40L, IL-13) | High |
| 3 | Northwestern Univ | Dr. J. Silverberg | 118 | 14% | 1 (JAK) | Low |
| 4 | George Washington Univ | Dr. A. Blauvelt | 105 | 11% | 2 (IL-13, TYK2) | Medium |
| 5 | Indiana Univ | Dr. M. Kurek | 98 | 18% | 0 | None |

**Recommended site strategy (40 sites):**
- **Tier 1 (10 sites):** High-enrolling academic centers with dupilumab PI experience — target 200 patients
- **Tier 2 (15 sites):** Community dermatology networks with low competitor overlap — target 200 patients
- **Tier 3 (15 sites):** Emerging sites with strong diversity metrics for FDA guidance compliance — target 100 patients

**Key risks:**
- Sites #1 and #2 have high competitor overlap — enrollment may be slower than historical rates
- Biomarker stratification adds ~3 weeks to screening — adjust enrollment timeline accordingly
- 6 top sites have pending IRB submissions for competitor trials launching Q4 2026`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "PHI Protection", agentId: "privacy", status: "pass", detail: "All data is aggregate site-level performance. No individual patient data or protected health information referenced. Investigator profiles use professional/public credentials only." },
          { agent: "Scientific Verification", agentId: "sci-verify", status: "pass", detail: "Trial counts verified against ClinicalTrials.gov (query date: Aug 6, 2026). Enrollment figures sourced from Sanofi Clinical Operations database. Screen-fail rates from site feasibility questionnaires." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Trial intelligence report logged — dupilumab AD Phase 3b planning. 47 competitor trials analyzed, 1,200 US sites scored, 40-site recommendation generated. Compliance record #CTI-2026-08-0412." }
        ]
      },
      {
        type: "output",
        label: "Trial intelligence delivered",
        badge: "LANDSCAPE VERIFIED",
        content: "Competitive landscape mapped: 47 active trials across 8 mechanisms. 40-site recommendation stratified by enrollment capacity, competitor overlap, and diversity metrics. 5 highest-risk sites flagged for enrollment competition. Biomarker stratification timeline impact quantified (+3 weeks screening). Report exportable to clinical operations planning system."
      }
    ]
  },
  "literature-intel": {
    title: "Real-time evidence monitoring across the global literature",
    steps: [
      {
        type: "input",
        label: "Standing alert query",
        content: "Alert me to any new Phase 3 data on IL-13 inhibitors in atopic dermatitis published in the last 30 days, and flag anything that touches our existing label claims."
      },
      {
        type: "processing",
        label: "Literature Intelligence — scan and cross-reference",
        items: [
          "Scanning 36M+ indexed PubMed records: filter=IL-13 inhibitor, AD, Phase 3, pubdate<30d...",
          "Cross-referencing 84K congress abstracts for unpublished late-breakers...",
          "Matching new findings against 12K internally approved content assets...",
          "Checking each new publication against current Sanofi Core Data Sheet claims...",
          "Scoring relevance by citation velocity and mechanism overlap..."
        ]
      },
      {
        type: "draft",
        label: "3 new publications found, 1 touches an existing claim",
        content: `**Literature Scan — IL-13 Inhibitors in AD, Trailing 30 Days**

| # | Publication | Journal | Relevance | Touches label claim? |
|---|---|---|---|---|
| 1 | Simpson EL et al., 5-year lebrikizumab OLE safety | JAMA Derm, Aug 2026 | High | No |
| 2 | Guttman-Yassky E et al., IL-13 pathway biomarker substudy | J Invest Derm, Jul 2026 | Medium | No |
| 3 | Blauvelt A et al., dupilumab vs. lebrikizumab indirect comparison | Br J Derm, Aug 2026 | High | **Yes — flagged** |

**Flagged item:** Publication #3 presents an indirect (non-head-to-head) efficacy comparison. No approved Sanofi content may cite this as a superiority claim — routed to Scientific Verification before it can be added to any content asset.`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "warn", detail: "Publication #3 is an indirect comparison (matching-adjusted indirect comparison, not a head-to-head RCT). Blocked from any promotional or superiority claim; permitted only in a scientific-exchange context with methodology caveat." },
          { agent: "Content Expiration", agentId: "expiration", status: "pass", detail: "No existing approved content references superseded prior to this scan; all 12K assets remain current." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Literature scan logged — IL-13/AD/Phase 3, trailing 30 days. 3 results, 1 flagged for Scientific Verification review. Scan ID: LIT-2026-08-0091." }
        ]
      },
      {
        type: "output",
        label: "Scan complete",
        badge: "3 NEW · 1 FLAGGED",
        content: "3 new publications indexed and scored. 1 flagged for Scientific Verification before any content team can reference it — an indirect comparison that must not be used as a superiority claim. The other 2 are cleared for Literature Scout to surface to MSLs and Medical Affairs."
      }
    ]
  },
  "sci-verify": {
    title: "Claim-by-claim validation against label, CDS, and evidence",
    steps: [
      {
        type: "input",
        label: "Claim submitted for verification",
        content: "MSL Copilot drafted this line for a leave-behind: 'Dupixent reduces exacerbations by up to 65% in patients with COPD and evidence of type 2 inflammation.' Please verify before it reaches the field."
      },
      {
        type: "processing",
        label: "Scientific Verification — source-by-source check",
        items: [
          "Retrieving approved US label (BLA 761055) indication and population language for COPD...",
          "Cross-referencing pivotal trial data (BOREAS/NOTUS) for the cited reduction figure...",
          "Checking the eosinophil-threshold qualifier required by the approved population definition...",
          "Confirming the 65% figure matches the correct trial endpoint and patient subgroup..."
        ]
      },
      {
        type: "draft",
        label: "Verification result — figure correct, qualifier missing",
        content: `**Claim:** "Dupixent reduces exacerbations by up to 65% in patients with COPD and evidence of type 2 inflammation."

- ✅ **Numeric accuracy:** 65% matches the annualized moderate/severe exacerbation rate reduction reported in the pooled BOREAS/NOTUS analysis for the labeled subgroup.
- 🟡 **Missing qualifier:** The label restricts this population to patients with blood eosinophil count ≥300 cells/µL on background therapy. The draft omits that threshold, which could be read as applying to all COPD patients.
- ✅ **Recommended correction:** "...in COPD patients with an eosinophilic phenotype (blood eosinophils ≥300 cells/µL) on background therapy."`
      },
      {
        type: "compliance",
        label: "Governance layer cross-check",
        checks: [
          { agent: "Fair Balance", agentId: "fair-balance", status: "warn", detail: "Efficacy claim has no adjacent safety context in the draft leave-behind. Recommend adding the standard COPD safety summary line before field release." },
          { agent: "Promotional Risk", agentId: "promo-risk", status: "pass", detail: "No superlative or comparative language detected once the population qualifier is added." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Claim verification logged — leave-behind draft, MSL Copilot source. 1 correction required (population qualifier), 1 fair-balance addition recommended. Record #SV-2026-08-0271." }
        ]
      },
      {
        type: "output",
        label: "Correction required before field release",
        badge: "1 CORRECTION REQUIRED",
        content: "The 65% figure is accurate, but the claim is not release-ready without the eosinophil-threshold qualifier and an adjacent safety statement. Corrected text returned to MSL Copilot for the leave-behind; original version blocked from field distribution."
      }
    ]
  },
  "promo-risk": {
    title: "Pattern detection for promotional language in field-generated content",
    steps: [
      {
        type: "input",
        label: "MSL email submitted for review",
        content: "Follow-up email drafted for an HCP: 'As we discussed, Dupixent is clearly the best option for your AD patients and works faster than anything else on the market.'"
      },
      {
        type: "processing",
        label: "Promotional Risk — pattern scan",
        items: [
          "Scanning for superlative language patterns ('best', 'clearly', 'anything else')...",
          "Checking for unsubstantiated comparative claims against the approved label and CDS...",
          "Cross-referencing the approved MSL messaging library for pre-cleared phrasing...",
          "Classifying severity: comparative superiority claim with no supporting head-to-head data..."
        ]
      },
      {
        type: "draft",
        label: "2 flags identified",
        content: `**Draft email — Promotional Risk findings**

| # | Phrase | Issue | Severity |
|---|---|---|---|
| 1 | "clearly the best option" | Superlative claim, no comparative trial support | 🔴 High |
| 2 | "works faster than anything else on the market" | Unsubstantiated head-to-head comparison — no such trial exists | 🔴 High |

**Suggested rewrite:** "As we discussed, Dupixent has demonstrated sustained efficacy in AD patients across five years of continuous treatment data. Happy to share the supporting publications if useful."`
      },
      {
        type: "compliance",
        label: "Governance layer cross-check",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "flag", detail: "Confirmed: no head-to-head trial exists supporting a comparative speed-of-onset or superiority claim against other AD therapies." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Promotional risk review logged — MSL follow-up email, 2 high-severity flags, rewrite suggested. Email held pending MSL revision. Record #PR-2026-08-0138." }
        ]
      },
      {
        type: "output",
        label: "Email held pending revision",
        badge: "2 FLAGS · SEND BLOCKED",
        content: "Both flags are high-severity comparative/superlative claims with no supporting data. The email is held from sending until the MSL accepts the suggested rewrite or provides substantiation — neither of which exists in the approved label or CDS."
      }
    ]
  },
  "ae-detect": {
    title: "Real-time adverse event signal capture from HCP chat",
    steps: [
      {
        type: "input",
        label: "HCP message via Medical Concierge",
        content: "One of my patients on dupilumab developed conjunctivitis and facial redness about 3 weeks after starting. Is this something I should be worried about, and is it reversible?"
      },
      {
        type: "processing",
        label: "AE Detection — signal scan",
        items: [
          "Scanning message for adverse-event terminology and temporal association to treatment start...",
          "Mapping 'conjunctivitis' and 'facial redness' to MedDRA preferred terms...",
          "Checking seriousness criteria: not hospitalization, not life-threatening, not disability...",
          "Cross-referencing labeled adverse reactions (conjunctivitis: common, ≥1%)...",
          "Auto-drafting ICSR case with pre-filled onset, product, and reporter fields..."
        ]
      },
      {
        type: "draft",
        label: "ICSR case auto-drafted",
        content: `**Adverse Event Signal Detected**

| Field | Value |
|---|---|
| Reported terms | Conjunctivitis, facial redness (possible periorbital dermatitis) |
| MedDRA mapping | Conjunctivitis (PT); Erythema (PT) |
| Product | Dupixent (dupilumab) |
| Onset | ~3 weeks post-initiation |
| Labeled status | Conjunctivitis — labeled, common (≥1%). Facial redness — monitor; consistent with reported periorbital dermatitis signal. |
| Seriousness | Non-serious per standard criteria |

**Case ICSR-2026-08-3341 auto-created and routed to Pharmacovigilance.** Regulatory clock started: 24-hour internal triage, 15-day expedited reporting window if seriousness criteria change on follow-up.`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "PHI Protection", agentId: "privacy", status: "pass", detail: "Case created with reporter (HCP) identity retained per pharmacovigilance requirements; patient referenced only by de-identified case ID, no direct identifiers captured from the chat." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "AE signal detection logged — case ICSR-2026-08-3341 opened, routed to Pharmacovigilance queue, 24-hour triage clock started." }
        ]
      },
      {
        type: "output",
        label: "Case opened, Pharmacovigilance notified",
        badge: "ICSR CASE OPENED · PV NOTIFIED",
        content: "A pharmacovigilance case was auto-created from the HCP's message and routed for clinical triage within 24 hours. The HCP has been given the standard non-promotional safety-monitoring response and a note that Pharmacovigilance may follow up directly for additional detail."
      }
    ]
  },
  "privacy": {
    title: "Real-time PHI redaction on inbound medical information requests",
    steps: [
      {
        type: "input",
        label: "Medical information request as submitted",
        content: "My patient John R., DOB 3/14/1962, MRN 88213 at Cleveland Clinic, is on dupilumab and had elevated eosinophils. Can you advise on management, and please call me back at the number on file to discuss further?"
      },
      {
        type: "processing",
        label: "PHI Protection — scan and redact",
        items: [
          "Scanning submission for identifier patterns: name, DOB, MRN, institution, callback reference...",
          "Matching against PHI pattern library (18 HIPAA identifier categories)...",
          "Redacting matched elements before the request reaches any downstream agent...",
          "Logging the redaction event with pattern types matched, not the underlying values..."
        ]
      },
      {
        type: "draft",
        label: "Redacted request forwarded downstream",
        content: `**As submitted (held, not forwarded):**
"My patient John R., DOB 3/14/1962, MRN 88213 at Cleveland Clinic, is on dupilumab and had elevated eosinophils..."

**As forwarded to Medical Information (redacted):**
"My patient [REDACTED-NAME], [REDACTED-DOB], [REDACTED-MRN] at [REDACTED-FACILITY], is on dupilumab and had elevated eosinophils. Can you advise on management?"

Scientific question proceeds unmodified — only the four identifier fields were removed. Callback coordination handled separately through the HCP's verified Sanofi contact channel, not the chat transcript.`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "AI Explainability", agentId: "explainability", status: "pass", detail: "Redaction rule triggered on 4 pattern matches: patient name, date of birth, medical record number, facility name. Rule set: HIPAA 18-identifier pattern library v3.2." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Redaction event logged — 4 PHI elements matched and removed before downstream routing. Original submission retained only in the access-controlled compliance vault, not in the working request. Record #PHI-2026-08-0592." }
        ]
      },
      {
        type: "output",
        label: "Request redacted and routed",
        badge: "4 PHI ELEMENTS REDACTED",
        content: "The scientific question — eosinophil management guidance on dupilumab — was preserved and routed to Medical Information. All four identifying details were stripped before any agent other than PHI Protection itself saw them, and the redaction is logged for audit."
      }
    ]
  },
  "audit": {
    title: "Reconstructing an immutable compliance record on demand",
    steps: [
      {
        type: "input",
        label: "Compliance officer request",
        content: "We have an FDA inspection next week. Pull the full interaction history for the MLR review of the EADV symposium deck from last month, including every agent that touched it."
      },
      {
        type: "processing",
        label: "Audit Trail — record reconstruction",
        items: [
          "Querying immutable log store for review ID MLR-2026-08-0412...",
          "Reconstructing full timeline: submission, processing, cross-checks, human review, final disposition...",
          "Cross-referencing agent IDs against the governance registry for full names and versions...",
          "Verifying hash-chain integrity across every log entry in the sequence..."
        ]
      },
      {
        type: "draft",
        label: "Reconstructed timeline — MLR-2026-08-0412",
        content: `**Interaction history — EADV symposium deck MLR review**

| Timestamp | Agent | Action | Integrity |
|---|---|---|---|
| Aug 6, 09:14 | MLR Review | Content ingested, 14 slides parsed | ✅ Hash verified |
| Aug 6, 09:15 | Scientific Verification | Slide 9 data discrepancy flagged | ✅ Hash verified |
| Aug 6, 09:15 | Promotional Risk | Slide 3 superlative language flagged | ✅ Hash verified |
| Aug 6, 09:16 | Fair Balance | Efficacy/safety ratio flagged, correction applied | ✅ Hash verified |
| Aug 6, 09:16 | Content Expiration | 1 superseded reference flagged | ✅ Hash verified |
| Aug 6, 11:40 | Human reviewer (M. Thompson) | Final approval with corrections accepted | ✅ Hash verified |

**Chain integrity: intact across all 6 entries — no gaps, no re-ordering, no tampering detected.**`
      },
      {
        type: "compliance",
        label: "Governance layer review",
        checks: [
          { agent: "AI Explainability", agentId: "explainability", status: "pass", detail: "Every log entry includes the input hash, output hash, and the rule or model version that produced it — sufficient for a reviewer to reconstruct why each finding was raised." },
          { agent: "Inspection Readiness", agentId: "inspection", status: "pass", detail: "Record formatted to the standard inspection-ready export template; no additional preparation needed before handoff." }
        ]
      },
      {
        type: "output",
        label: "Record reconstructed and hash-verified",
        badge: "RECORD RECONSTRUCTED · HASH VERIFIED",
        content: "The complete interaction history for MLR-2026-08-0412 was reconstructed in seconds, with every entry's hash chain intact. Exported in inspection-ready format for the compliance officer ahead of next week's FDA inspection."
      }
    ]
  },
  "off-label": {
    title: "Real-time off-label detection and reactive-response routing",
    steps: [
      {
        type: "input",
        label: "HCP question via MSL Copilot chat",
        content: "Have you seen dupilumab used for eosinophilic esophagitis in patients under 12? What does the data look like there?"
      },
      {
        type: "processing",
        label: "Off-Label Monitor — detection and routing",
        items: [
          "Parsing question for indication and population against the current approved label scope...",
          "Confirming EoE approval is limited to patients 12 years and older...",
          "Detecting the question falls outside the approved pediatric age range...",
          "Blocking any proactive MSL discussion and routing to the approved reactive-only pathway..."
        ]
      },
      {
        type: "draft",
        label: "Routed to reactive Medical Information pathway",
        content: `**Detection:** Question concerns EoE in patients under 12 — outside the approved label population (EoE indication: 12 years and older, ≥40 kg).

**MSL Copilot response (permitted):** "That's outside what I can discuss proactively. If you'd like the available data on that specific population, I can route this as a reactive medical information request so you get a fully-sourced, compliant response."

**Routed to:** Medical Information, reactive off-label response pathway. MSL is blocked from independently characterizing any unapproved-population data in this conversation.`
      },
      {
        type: "compliance",
        label: "Governance layer cross-check",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "pass", detail: "Confirmed current label population for the EoE indication; no exceptions or recent label changes affecting the under-12 population." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Off-label detection logged — EoE, under-12 population, routed to reactive Medical Information. MSL proactive discussion blocked per SOP. Record #OL-2026-08-0219." }
        ]
      },
      {
        type: "output",
        label: "Routed, not answered proactively",
        badge: "OFF-LABEL — ROUTED TO REACTIVE MEDINFO",
        content: "The question was correctly identified as outside the approved pediatric population. The MSL did not characterize any data directly; the HCP was offered a compliant reactive pathway through Medical Information, which is the only permitted route for this kind of question."
      }
    ]
  },
  "fair-balance": {
    title: "Efficacy-to-safety ratio check on drafted content",
    steps: [
      {
        type: "input",
        label: "Draft congress recap submitted for review",
        content: "Congress Planning Agent's draft recap for internal distribution contains five consecutive efficacy statements about a Phase 3 readout, with no safety information anywhere in the draft."
      },
      {
        type: "processing",
        label: "Fair Balance — ratio analysis",
        items: [
          "Parsing the draft into individual claim units: efficacy vs. safety vs. neutral...",
          "Counting consecutive efficacy statements with no intervening safety context...",
          "Comparing the 5:0 ratio against the internal ≤2:1 efficacy-to-safety guideline...",
          "Identifying the most natural insertion point for a safety summary sentence..."
        ]
      },
      {
        type: "draft",
        label: "Ratio corrected: 5:0 → 2:1",
        content: `**Before:** 5 consecutive efficacy statements, 0 safety mentions (ratio 5:0 — non-compliant)

**Correction applied:** Safety summary sentence inserted after the second efficacy statement: "The most common adverse reactions (incidence ≥1%) included injection site reactions, conjunctivitis, and nasopharyngitis."

**After:** 2 efficacy statements, 1 safety mention, 2 more efficacy statements, 1 more safety mention — ratio 2:1, within guideline.`
      },
      {
        type: "compliance",
        label: "Governance layer cross-check",
        checks: [
          { agent: "Promotional Risk", agentId: "promo-risk", status: "pass", detail: "No promotional or superlative language introduced by the correction; safety sentence uses standard labeled adverse-reaction language only." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Fair balance correction logged — congress recap draft, ratio corrected 5:0 to 2:1 via one safety insertion. Record #FB-2026-08-0177." }
        ]
      },
      {
        type: "output",
        label: "Draft corrected before distribution",
        badge: "RATIO CORRECTED 5:0 → 2:1",
        content: "The draft recap is now within the internal fair-balance guideline. One safety sentence, sourced directly from the approved label, brought the efficacy-to-safety ratio from 5:0 to 2:1 without altering any efficacy claim."
      }
    ]
  },
  "expiration": {
    title: "Monitoring label changes and retiring stale content automatically",
    steps: [
      {
        type: "input",
        label: "System event — label update",
        content: "FDA approved a label update for Dupixent expanding the COPD population on Aug 3, 2026. Scan all indexed content referencing the prior COPD label language."
      },
      {
        type: "processing",
        label: "Content Expiration — library scan",
        items: [
          "Diffing new label text against the prior version to isolate the changed population language...",
          "Scanning 12K approved content assets for references to the superseded population definition...",
          "Classifying each match: retire, re-index with updated language, or no action needed...",
          "Queuing re-indexing jobs and retirement notices for affected content owners..."
        ]
      },
      {
        type: "draft",
        label: "14 assets affected",
        content: `**Content Expiration Scan — COPD label update, Aug 3, 2026**

| Asset type | Count | Action |
|---|---|---|
| MSL slide decks | 6 | Re-indexed with updated population language |
| Standard MedInfo responses | 5 | Re-indexed |
| Field talking points | 3 | Retired — superseded by new leave-behind pending creation |

**14 assets re-indexed or retired.** Content owners notified with a 5-business-day window to review before the retired assets are removed from the active library.`
      },
      {
        type: "compliance",
        label: "Governance layer cross-check",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "pass", detail: "Confirmed the new label text against the FDA approval letter dated Aug 3, 2026; re-indexed content uses the exact updated population language." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Content expiration scan logged — COPD label update, 14 assets affected (11 re-indexed, 3 retired). Record #CE-2026-08-0044." }
        ]
      },
      {
        type: "output",
        label: "Library updated",
        badge: "14 ASSETS RE-INDEXED · 3 RETIRED",
        content: "The content library now reflects the Aug 3 label update across every affected asset. Field teams using the 3 retired talking points were notified directly; no MSL can distribute superseded population language going forward."
      }
    ]
  },
  "explainability": {
    title: "Generating a reviewer-readable transparency trace for an agent answer",
    steps: [
      {
        type: "input",
        label: "Reviewer request",
        content: "Show me exactly how the Insights Agent decided that Ohio is an under-engaged, high-opportunity territory before I present this to leadership."
      },
      {
        type: "processing",
        label: "AI Explainability — trace generation",
        items: [
          "Retrieving the decision trace for the specific Insights Agent output in question...",
          "Extracting every data source touched and the weight assigned to each...",
          "Recomputing the confidence score from the underlying feature inputs...",
          "Flagging any known caveats or data-sparsity issues affecting reliability..."
        ]
      },
      {
        type: "draft",
        label: "Explainability trace — Ohio territory scoring",
        content: `**Why Ohio was scored as under-engaged / high-opportunity:**

| Input | Weight | Value | Contribution |
|---|---|---|---|
| Clinical need index (RWD) | 35% | 58/100 | Moderate-high |
| Scientific engagement index | 35% | 22/100 | Low — primary driver |
| Specialist density (derm/100k) | 20% | 2.8 | Below national median |
| Prior MSL coverage (12mo) | 10% | 3 visits | Sparse |

**Confidence: 82%.** Caveat: 2 of Ohio's 9 counties have cohort sizes near the aggregation floor, which widens the uncertainty band for those counties specifically — territory-level score is not affected.`
      },
      {
        type: "compliance",
        label: "Governance layer cross-check",
        checks: [
          { agent: "Scientific Verification", agentId: "sci-verify", status: "pass", detail: "Weighting formula matches the documented Insights Agent methodology (v2.1); no undocumented adjustments found in this trace." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Explainability trace generated and logged for reviewer request re: Ohio territory scoring. Record #EXP-2026-08-0303." }
        ]
      },
      {
        type: "output",
        label: "Trace delivered",
        badge: "TRACE GENERATED · 82% CONFIDENCE",
        content: "The full scoring trace — inputs, weights, confidence, and data-sparsity caveats — is ready for the leadership presentation. Nothing in the Insights Agent's recommendation depends on an undocumented or unreviewable input."
      }
    ]
  },
  "field-risk": {
    title: "Surfacing compliance risk patterns before an audit finds them",
    steps: [
      {
        type: "input",
        label: "Periodic system scan",
        content: "Monthly scan: analyze the last 90 days of MSL interaction and inquiry logs for compliance risk patterns."
      },
      {
        type: "processing",
        label: "Field Activity Risk — pattern analysis",
        items: [
          "Aggregating 90 days of MSL interaction logs across all territories...",
          "Applying risk heuristics: repeat promotional-risk flags, off-label question volume, gift/meal timing proximity to prescribing changes...",
          "Scoring territories and individual MSLs against historical baselines...",
          "Distinguishing statistical outliers from routine variation..."
        ]
      },
      {
        type: "draft",
        label: "3 patterns flagged, 0 confirmed violations",
        content: `**Field Activity Risk — 90-day pattern scan**

| Pattern | Territory / MSL | Signal | Assessment |
|---|---|---|---|
| Repeat promotional-risk flags | MSL #4471, Midwest | 3 promo-risk flags in 90 days vs. team avg 0.4 | Coaching recommended, no violation — all 3 corrected pre-send |
| Elevated off-label question volume | Southeast territory | 22 off-label questions vs. team avg 6 | Consistent with known EoE care-gap; all correctly routed to reactive MedInfo |
| Gift/meal timing cluster | MSL #2209, Northeast | 2 meals within 5 days of 2 prescribing changes | Flagged for documentation review — timing plausible, no causal link established |

**No confirmed violations.** All flagged patterns represent either routine variation or activity already handled compliantly by other governance agents.`
      },
      {
        type: "compliance",
        label: "Governance layer cross-check",
        checks: [
          { agent: "PHI Protection", agentId: "privacy", status: "pass", detail: "Analysis performed on aggregate interaction metadata only — no patient data and no HCP clinical detail included in the risk scan." },
          { agent: "Audit Trail", agentId: "audit", status: "logged", detail: "Field activity risk scan logged — 90-day window, 3 patterns flagged, 0 confirmed violations. Record #FAR-2026-08-0018." }
        ]
      },
      {
        type: "output",
        label: "Scan complete, patterns routed for review",
        badge: "3 PATTERNS FLAGGED · 0 VIOLATIONS CONFIRMED",
        content: "Three statistical patterns were surfaced for human review — one coaching recommendation, one confirmed-benign care-gap explanation, and one documentation flag. None rises to a confirmed compliance violation, but all three are now visible before an external audit would find them cold."
      }
    ]
  },
  "inspection": {
    title: "Assembling an inspection-ready evidence package on demand",
    steps: [
      {
        type: "input",
        label: "Regulatory affairs request",
        content: "We need a complete evidence package for the Dupixent AD MLR reviews from the last quarter, ready for an unannounced inspection tomorrow morning."
      },
      {
        type: "processing",
        label: "Inspection Readiness — package assembly",
        items: [
          "Querying the Audit Trail for every MLR review record tagged Dupixent + AD in the last quarter...",
          "Pulling the linked explainability traces and governance cross-check results for each...",
          "Compiling content version history for every asset referenced across the reviews...",
          "Formatting the full set to the standard inspection-ready binder structure..."
        ]
      },
      {
        type: "draft",
        label: "Package manifest",
        content: `**Inspection-Ready Package — Dupixent AD, Q3 2026 MLR Reviews**

| Component | Count |
|---|---|
| MLR review records | 11 |
| Linked audit trail entries | 63 |
| Explainability traces | 11 |
| Content version histories | 27 assets |
| Governance cross-check logs | 41 |

**Format:** indexed PDF binder + machine-readable log export, cross-referenced by review ID. Chain-of-custody hash included for every source record.`
      },
      {
        type: "compliance",
        label: "Governance layer cross-check",
        checks: [
          { agent: "Audit Trail", agentId: "audit", status: "pass", detail: "All 63 linked entries verified against the immutable log store; no gaps or missing records for the quarter." },
          { agent: "AI Explainability", agentId: "explainability", status: "pass", detail: "All 11 explainability traces are complete and reviewer-readable — no review is missing its methodology documentation." }
        ]
      },
      {
        type: "output",
        label: "Package ready",
        badge: "PACKAGE READY · 47 DOCUMENTS INDEXED",
        content: "The full evidence package — 47 documents across 11 MLR reviews, fully cross-referenced and hash-verified — was assembled in under a minute and is ready for tomorrow's inspection. No manual document hunting required."
      }
    ]
  }
};
