// Enterprise integration facts for each agent — the part that cannot be derived
// from agents-data.js. Hand-maintained; consumed by generate-agent-docs.mjs.
//
// systems      : systems of record an agent binds to in production
// dataDomains  : the enterprise data domains it reads or writes
// scaling      : what grows with load, and the lever that relieves it
// residency    : data residency / access constraints to honour
//
// An agent with no entry here is documented with an explicit TODO so the gap is
// visible rather than silently missing.

export const ENTERPRISE_BINDINGS = {
  "hcp-explorer": {
    systems: ["Veeva Link (expert graph)", "OneCRM (Sanofi engagement history)", "Internal HCP master data"],
    dataDomains: ["HCP / KOL master", "Publications", "Congress participation", "Clinical trial investigators", "Engagement history"],
    scaling: "Read volume scales with every downstream agent, since all of them query this hub first. Cache resolved expert profiles per session and batch profile enrichment rather than resolving per request.",
    residency: "Professional and public information only. Engagement history is access-controlled by territory; never join to patient-level data."
  },
  "literature-intel": {
    systems: ["PubMed E-utilities", "NEJM / publisher feeds", "Internal approved content repository", "Congress abstract libraries"],
    dataDomains: ["Publications", "Approved medical content", "Congress abstracts", "Citation graph"],
    scaling: "Bound by external API rate limits, not internal compute. Cache query results, honour publisher rate limits, and pre-index high-traffic therapeutic areas rather than searching live on every request.",
    residency: "Respect publisher licensing for full-text. Internal approved content carries expiry — re-check status before reuse."
  },
  "msl-copilot": {
    systems: ["OneCRM", "Veeva Link", "MedVerse content service"],
    dataDomains: ["HCP master", "Engagement history", "Territory assignment", "Approved content"],
    scaling: "Concurrency peaks in the pre-call window each morning. Pre-generate briefings overnight for scheduled meetings instead of on demand.",
    residency: "MSL sees only their assigned territory. Briefing content must be approved-content-derived and non-promotional."
  },
  "kol-agent": {
    systems: ["Veeva Link", "Publication and citation feeds", "Congress registries"],
    dataDomains: ["HCP master", "Publications", "Citation velocity", "Congress participation"],
    scaling: "Influence scoring is the expensive step. Recompute on a schedule per therapeutic area rather than per query, and serve stored scores.",
    residency: "Public scientific output only. Do not infer or store personal attributes beyond professional activity."
  },
  "advisory-board": {
    systems: ["Veeva Link", "OneCRM", "Transparency / spend reporting systems"],
    dataDomains: ["HCP master", "Engagement history", "Contracting and payment history"],
    scaling: "Roster optimisation is combinatorial. Constrain the candidate pool by therapeutic area and geography before ranking.",
    residency: "Spend and contracting data is highly restricted. Selection rationale must be recorded for transparency reporting."
  },
  "literature-scout": {
    systems: ["PubMed E-utilities", "Publisher feeds", "Internal alerting service"],
    dataDomains: ["Publications", "Approved content", "User watch topics"],
    scaling: "Alerting cost grows with watch topics, not users. Deduplicate overlapping topics into shared queries and fan results out.",
    residency: "Alert payloads may quote titles and abstracts only, within publisher licence terms."
  },
  "insights-agent": {
    systems: ["Interaction signal store", "OneCRM", "Content analytics"],
    dataDomains: ["Interaction signals", "Content engagement", "Engagement history"],
    scaling: "Aggregation over the signal store grows with history. Roll up to daily and topic-level aggregates; query aggregates, not raw events.",
    residency: "Report at aggregate and topic level. Do not surface individual-level behavioural profiles outside the assigned field team."
  },
  "trial-intel": {
    systems: ["ClinicalTrials.gov API", "Internal clinical trial management system", "Veeva Link (investigators)"],
    dataDomains: ["Trial registry", "Investigator performance", "Site and enrolment metrics"],
    scaling: "Registry pulls are the bottleneck. Sync the registry on a schedule into a local index and query that; reserve live calls for detail views.",
    residency: "Registry data is public. Internal enrolment performance is confidential — do not expose it externally."
  },
  "congress-planning": {
    systems: ["Congress registries and agendas", "Veeva Link", "OneCRM"],
    dataDomains: ["Congress participation", "HCP master", "Engagement history", "Presentation metadata"],
    scaling: "Highly seasonal — load concentrates in the weeks before each congress. Pre-build congress dossiers when the agenda publishes.",
    residency: "Attendance intent is sensitive. Use published agendas rather than inferred attendance where possible."
  },
  "expert-segment": {
    systems: ["Veeva Link", "Publication feeds", "OneCRM"],
    dataDomains: ["HCP master", "Publications", "Congress participation", "Engagement history"],
    scaling: "Batch classification per therapeutic area on a schedule. Segment membership changes slowly, so nightly is sufficient.",
    residency: "Tier assignment must be explainable and reproducible; record the input features behind each classification."
  },
  "strategy-advisor": {
    systems: ["Literature Intelligence", "Competitive intelligence sources (public filings)", "Internal pipeline data"],
    dataDomains: ["Publications", "Competitive landscape", "Pipeline", "Interaction signals"],
    scaling: "Synthesis is token-heavy rather than query-heavy. Cache per therapeutic area and refresh on material change, not on every request.",
    residency: "Pipeline data is material non-public information. Restrict to authorised internal audiences only."
  },
  "gap-expert": {
    systems: ["Literature Intelligence", "Veeva Link", "Internal evidence gap register"],
    dataDomains: ["Publications", "HCP master", "Evidence gaps"],
    scaling: "Runs on gap creation rather than continuously. Trigger from the evidence gap register instead of polling.",
    residency: "Professional publication and treatment activity only."
  },
  "patient-nav": {
    systems: ["Patient support programme systems", "Approved patient education content", "Pharmacovigilance intake"],
    dataDomains: ["Patient support enrolment", "Approved patient content", "Adverse event intake"],
    scaling: "Sessions are long-lived and stateful. Persist journey state server-side rather than reconstructing context each turn.",
    residency: "Handles the most sensitive data in the platform. PHI minimisation, explicit consent, and an AE reporting path are mandatory."
  },
  "trial-match": {
    systems: ["ClinicalTrials.gov API", "Internal trial management system"],
    dataDomains: ["Trial registry", "Eligibility criteria", "Site geography"],
    scaling: "Eligibility parsing is the expensive step. Pre-parse criteria into a structured index per trial and match against the index.",
    residency: "Never persist the patient profile used for matching beyond the session unless consent is captured. Match, return, discard."
  },
  "msl-connect": {
    systems: ["OneCRM (territory assignment)", "MSL profile directory", "Interaction signal store"],
    dataDomains: ["Territory assignment", "MSL profiles", "HCP master", "Interaction signals"],
    scaling: "Low volume, latency-sensitive. Territory data changes infrequently — cache the assignment map and invalidate on CRM change events.",
    residency: "HCP identity verified against the public NPI registry. Contact routed only through official Sanofi channels."
  },
  "ingredient-safety": {
    systems: ["Product formulation / excipient master", "Approved prescribing information", "Pharmacovigilance intake"],
    dataDomains: ["Product formulation", "Excipients", "Allergen and dietary classifications", "Label content"],
    scaling: "Formulation data is small and stable. Load it in memory; the constraint is keeping it synchronised with label updates.",
    residency: "Patient allergy input is health data — process in-session, do not retain. Every flag must cite the label."
  },
  "temp-stability": {
    systems: ["Sanofi Stability Calculator", "Approved prescribing information", "Cold chain / excursion logging"],
    dataDomains: ["Product stability profiles", "Label storage conditions", "Excursion records"],
    scaling: "Bursty — a single freezer failure generates a batch of assessments at once. Support multi-product batch intake in one request.",
    residency: "Excursion records are regulated documentation. Persist them immutably for pharmacy and state board audit."
  },
  "disease-navigator": {
    systems: ["Disease and pathway knowledge base", "Literature Intelligence", "Approved prescribing information", "Competitive landscape sources"],
    dataDomains: ["Disease pathophysiology", "Inflammatory pathways", "Biomarkers", "Treatment landscape", "Label indications by region"],
    scaling: "The pathway graph is small and read-mostly — hold it in memory. Cost grows with literature enrichment, so cache synthesis per disease and refresh when new evidence lands. Adding a therapeutic area means adding pathway and disease records, not new code.",
    residency: "Label indications are region-specific: bind to the local label for the user's market before presenting any therapy comparison. Cross-TA discussion must not become an off-label recommendation."
  },

  // --- Governance layer ---
  // These are cross-cutting controls rather than workflow agents: they bind to
  // the compliance systems of record and run on every request, so their scaling
  // characteristic is per-interaction latency rather than query volume.
  "mlr": {
    systems: ["Veeva Vault PromoMats / MLR workflow", "Approved content repository", "Product labels and core data sheets"],
    dataDomains: ["Approved content", "Label claims", "Review decisions"],
    scaling: "Runs on every generated output, so it sits directly in the latency path. Cache claim-level verdicts — the same claim is reviewed repeatedly across interactions.",
    residency: "Review decisions are regulated records. Persist the verdict and its rationale, not just the pass/fail."
  },
  "sci-verify": {
    systems: ["Product labels and core data sheets", "Literature Intelligence", "Approved content repository"],
    dataDomains: ["Label claims", "Publications", "Approved content"],
    scaling: "Claim extraction then substantiation lookup. Maintain a claim-to-source index so substantiation is a lookup rather than a search.",
    residency: "Every substantiation must resolve to a citable source. Unsubstantiated claims are blocked, not softened."
  },
  "promo-risk": {
    systems: ["Promotional language policy rules", "Veeva Vault PromoMats"],
    dataDomains: ["Policy rules", "Flagged language patterns", "Review decisions"],
    scaling: "Pattern matching over generated text — cheap and stateless. Scale horizontally; keep the rule set versioned so verdicts stay reproducible.",
    residency: "Rule set version must be recorded alongside each verdict for audit reconstruction."
  },
  "ae-detect": {
    systems: ["Pharmacovigilance case management (safety database)", "AE intake workflow"],
    dataDomains: ["Adverse event signals", "Case records", "Product-event pairs"],
    scaling: "Volume is low but every detection creates a downstream regulatory obligation. Never batch or defer — detection must be synchronous with the interaction.",
    residency: "Detected AEs trigger mandatory reporting timelines. Route to the safety database immediately; do not rely on the user to report."
  },
  "privacy": {
    systems: ["Enterprise identity and access management", "PHI classification service", "Data loss prevention"],
    dataDomains: ["Access entitlements", "PHI classifications", "Redaction records"],
    scaling: "Runs before any data is returned. Push entitlement filtering into the query rather than redacting after retrieval — cheaper and safer.",
    residency: "Enforces the strictest constraint of any data domain in the request. Deny by default when classification is unknown."
  },
  "audit": {
    systems: ["Immutable audit log store (write-once)", "Enterprise SIEM"],
    dataDomains: ["Interaction records", "Governance verdicts", "Data access events"],
    scaling: "Highest write volume in the platform — one record per interaction plus one per check. Append-only storage with time partitioning; never update in place.",
    residency: "Records are retained per regulatory retention schedule and must remain tamper-evident. No deletion path."
  },
  "off-label": {
    systems: ["Approved indication registry (by region)", "Reactive response library", "Medical information workflow"],
    dataDomains: ["Label indications by region", "Approved reactive responses", "Routed inquiries"],
    scaling: "Requires the correct regional label per user. Cache the indication registry per market and invalidate on label change events.",
    residency: "Indication scope differs by market. A response approved in one region may be off-label in another — resolve by the user's market, not the global label."
  },
  "fair-balance": {
    systems: ["Product labels (safety sections)", "Approved content repository"],
    dataDomains: ["Safety and warning content", "Efficacy claims", "Boxed warnings"],
    scaling: "Pairs each efficacy claim with its required safety context. Maintain a claim-to-safety-context map so pairing is deterministic.",
    residency: "Boxed warnings must always accompany the product they belong to, including for competitor products named in comparisons."
  },
  "expiration": {
    systems: ["Approved content repository", "Label change notification feed", "Content index"],
    dataDomains: ["Content approval dates", "Label versions", "Retirement records"],
    scaling: "Event-driven rather than per-request. Subscribe to label change events and re-index affected content instead of polling.",
    residency: "Expired content must become unreachable, not merely flagged. Re-index on retirement."
  },
  "explainability": {
    systems: ["Model and prompt version registry", "Retrieval trace store"],
    dataDomains: ["Retrieval traces", "Model versions", "Ranking rationale", "Confidence scores"],
    scaling: "Trace capture adds payload to every request. Store traces separately from the response path and reference them by id.",
    residency: "A verdict must be reconstructable later, which means retaining the model and prompt version alongside the trace."
  },
  "field-risk": {
    systems: ["Interaction signal store", "OneCRM", "Compliance case management"],
    dataDomains: ["Interaction signals", "Inquiry trends", "Field activity records"],
    scaling: "Trend detection over history rather than per-request. Run on a schedule against aggregates and alert on threshold breach.",
    residency: "Analyse at aggregate and trend level. Individual-level risk conclusions require a documented compliance process, not automated inference."
  },
  "inspection": {
    systems: ["Immutable audit log store", "Document management system", "Quality management system"],
    dataDomains: ["Audit records", "Evidence packages", "SOP and training records"],
    scaling: "Read-heavy and bursty — activity concentrates around inspection events. Pre-assemble evidence packages on a schedule so they are ready on request.",
    residency: "Evidence packages must be reproducible for the full retention period, including the state of content at the time of each interaction."
  }
};
