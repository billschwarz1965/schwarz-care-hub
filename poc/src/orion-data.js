const HCP_PROFILES = [
  { id: "HCP-4821", name: "Dr. Sarah Chen", specialty: "Dermatology", institution: "Mount Sinai Dermatology", region: "Northeast", tier: "KOL" },
  { id: "HCP-3159", name: "Dr. James Patel", specialty: "Rheumatology", institution: "Cleveland Clinic", region: "Midwest", tier: "High" },
  { id: "HCP-7204", name: "Dr. Maria Gonzalez", specialty: "Pulmonology", institution: "UCSF Medical Center", region: "West", tier: "KOL" },
  { id: "HCP-5538", name: "Dr. Robert Kim", specialty: "Allergy & Immunology", institution: "Johns Hopkins", region: "Mid-Atlantic", tier: "High" },
  { id: "HCP-9012", name: "Dr. Emily Nakamura", specialty: "Gastroenterology", institution: "Mayo Clinic", region: "Midwest", tier: "Medium" },
  { id: "HCP-6377", name: "Dr. David Okonkwo", specialty: "Dermatology", institution: "Emory University", region: "Southeast", tier: "Medium" },
];

const SIGNALS = [
  {
    id: "SIG-001", hcpId: "HCP-4821", timestamp: "2026-08-06T09:14:00",
    topic: "Dupixent efficacy in moderate-to-severe AD",
    intent: "Clinical decision support", diseaseArea: "Atopic Dermatitis",
    stage: "Treatment selection", depth: "Deep engagement",
    orionAction: "PRIORITY: Schedule MSL visit — KOL evaluating biologic switch for refractory patients",
    queries: ["What are the latest EASI response rates for dupilumab?", "How does dupilumab compare with JAK inhibitors in AD patients who failed topical therapy?"],
    contentAccessed: ["Dupixent in Atopic Dermatitis — Clinical Overview", "AD Treatment Algorithm 2026"],
    sessionDuration: 12,
  },
  {
    id: "SIG-002", hcpId: "HCP-3159", timestamp: "2026-08-06T10:32:00",
    topic: "Sarilumab dosing and safety in RA",
    intent: "Safety information", diseaseArea: "Rheumatoid Arthritis",
    stage: "Patient management", depth: "Moderate engagement",
    orionAction: "Queue for MSL follow-up — monitoring safety profile interest",
    queries: ["What is the sarilumab dosing adjustment for hepatic impairment?"],
    contentAccessed: ["Kevzara (Sarilumab) in RA — Clinical Profile"],
    sessionDuration: 5,
  },
  {
    id: "SIG-003", hcpId: "HCP-7204", timestamp: "2026-08-06T11:05:00",
    topic: "Type 2 inflammation across respiratory and dermatologic conditions",
    intent: "Scientific education", diseaseArea: "Cross-TA Immunology",
    stage: "Concept exploration", depth: "Deep engagement — cross-TA query",
    orionAction: "PRIORITY: Cross-TA signal — pulmonologist exploring dermatologic overlap. Alert Immunology MSL team",
    queries: ["How does type 2 inflammation manifest differently in asthma versus AD?", "What role do IL-4 and IL-13 play across atopic conditions?", "Are there shared biomarkers for type 2 inflammation across respiratory and skin diseases?"],
    contentAccessed: ["Type 2 Inflammation — Cross-TA Scientific Review", "AD Disease State Overview", "Dupixent in Atopic Dermatitis — Clinical Overview"],
    sessionDuration: 18,
  },
  {
    id: "SIG-004", hcpId: "HCP-5538", timestamp: "2026-08-06T13:21:00",
    topic: "AAD 2026 congress — new AD data presentations",
    intent: "Congress intelligence", diseaseArea: "Atopic Dermatitis",
    stage: "Data review", depth: "Deep engagement",
    orionAction: "PRIORITY: KOL accessing congress data pre-publication — high engagement value for MSL outreach",
    queries: ["What new dupilumab data was presented at AAD 2026?", "Were there any head-to-head studies presented?"],
    contentAccessed: ["AAD 2026 Annual Meeting — Key Highlights", "Dupilumab Clinical Trial Pipeline"],
    sessionDuration: 14,
  },
  {
    id: "SIG-005", hcpId: "HCP-9012", timestamp: "2026-08-06T14:45:00",
    topic: "IL-23/Th17 pathway in IBD and psoriasis overlap",
    intent: "Mechanism of action", diseaseArea: "GI / Dermatology",
    stage: "Pathophysiology review", depth: "Moderate engagement",
    orionAction: "Queue for MSL follow-up — GI specialist exploring derm comorbidity pathways",
    queries: ["What is the role of the IL-23/Th17 axis in IBD patients with psoriasis?"],
    contentAccessed: ["IL-23/Th17 Pathway in Psoriasis and IBD"],
    sessionDuration: 7,
  },
  {
    id: "SIG-006", hcpId: "HCP-4821", timestamp: "2026-08-06T15:30:00",
    topic: "Dupilumab clinical trial pipeline — upcoming indications",
    intent: "Pipeline intelligence", diseaseArea: "Multi-indication",
    stage: "Pipeline assessment", depth: "High-value engagement",
    orionAction: "PRIORITY: Repeat KOL session — deep pipeline interest signals advisory board potential",
    queries: ["What new indications are being studied for dupilumab?", "When are the Phase 3 readouts expected for COPD?", "Is there trial data on dupilumab in EoE?"],
    contentAccessed: ["Dupilumab Clinical Trial Pipeline", "EADV 2026 Preview — Key Sessions"],
    sessionDuration: 22,
  },
  {
    id: "SIG-007", hcpId: "HCP-6377", timestamp: "2026-08-05T16:10:00",
    topic: "AD treatment algorithm — biologic sequencing",
    intent: "Clinical decision support", diseaseArea: "Atopic Dermatitis",
    stage: "Treatment selection", depth: "Light engagement",
    orionAction: "Log engagement — standard content access, no immediate MSL action",
    queries: ["What is the current treatment algorithm for AD?"],
    contentAccessed: ["AD Treatment Algorithm 2026"],
    sessionDuration: 3,
  },
  {
    id: "SIG-008", hcpId: "HCP-3159", timestamp: "2026-08-05T11:22:00",
    topic: "RA disease overview — patient burden data",
    intent: "Disease education", diseaseArea: "Rheumatoid Arthritis",
    stage: "Background review", depth: "Light engagement",
    orionAction: "Log engagement — informational access",
    queries: ["What is the current prevalence of RA in the US?"],
    contentAccessed: ["RA Disease State Overview"],
    sessionDuration: 4,
  },
];

function getAnalytics(signalSubset) {
  const signals = signalSubset || SIGNALS;
  const todayStr = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0") + "-" + String(new Date().getDate()).padStart(2, "0");
  const today = signals.filter(s => s.timestamp.startsWith(todayStr) || s.timestamp.startsWith("2026-08-06"));
  const priority = signals.filter(s => s.orionAction.startsWith("PRIORITY"));
  const hcpIds = new Set(signals.map(s => s.hcpId));
  const diseaseAreas = {};
  signals.forEach(s => {
    diseaseAreas[s.diseaseArea] = (diseaseAreas[s.diseaseArea] || 0) + 1;
  });
  const depthMap = { "Light engagement": 1, "Moderate engagement": 2, "Deep engagement": 3, "Deep engagement — cross-TA query": 4, "Deep engagement — cross-TA": 4, "High-value engagement": 4 };
  const avgDepth = signals.length ? signals.reduce((sum, s) => sum + (depthMap[s.depth] || 2), 0) / signals.length : 0;
  const totalMinutes = signals.reduce((sum, s) => sum + s.sessionDuration, 0);

  return {
    totalSignals: signals.length,
    todaySignals: today.length,
    priorityAlerts: priority.length,
    uniqueHcps: hcpIds.size,
    diseaseAreas,
    avgDepth: avgDepth.toFixed(1),
    totalEngagementMinutes: totalMinutes,
  };
}

function getHcpProfile(hcpId, signalSubset) {
  const profile = HCP_PROFILES.find(h => h.id === hcpId);
  const signals = (signalSubset || SIGNALS).filter(s => s.hcpId === hcpId).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const topics = new Set(signals.map(s => s.diseaseArea));
  const depthMap = { "Light engagement": 1, "Moderate engagement": 2, "Deep engagement": 3, "Deep engagement — cross-TA query": 4, "Deep engagement — cross-TA": 4, "High-value engagement": 4 };
  const maxDepth = signals.length ? Math.max(...signals.map(s => depthMap[s.depth] || 2)) : 0;
  const totalMinutes = signals.reduce((sum, s) => sum + s.sessionDuration, 0);

  return {
    ...profile,
    signals,
    signalCount: signals.length,
    diseaseAreas: [...topics],
    maxDepth,
    totalEngagementMinutes: totalMinutes,
    hasPriority: signals.some(s => s.orionAction.startsWith("PRIORITY")),
  };
}

function getMslActionQueue(signalSubset) {
  const signals = signalSubset || SIGNALS;
  return signals
    .filter(s => s.orionAction.startsWith("PRIORITY") || s.orionAction.startsWith("Queue"))
    .sort((a, b) => {
      const aPri = a.orionAction.startsWith("PRIORITY") ? 0 : 1;
      const bPri = b.orionAction.startsWith("PRIORITY") ? 0 : 1;
      if (aPri !== bPri) return aPri - bPri;
      return b.timestamp.localeCompare(a.timestamp);
    })
    .map(s => {
      const hcp = HCP_PROFILES.find(h => h.id === s.hcpId);
      return { ...s, hcpName: hcp?.name, hcpSpecialty: hcp?.specialty, hcpTier: hcp?.tier };
    });
}

function generateTalkingPoints(signal) {
  const points = [];
  if (signal.depth.includes("Deep") || signal.depth.includes("High")) {
    points.push(`High engagement depth signals genuine clinical interest in ${signal.diseaseArea} — open with recent data.`);
  }
  if (signal.queries.length > 1) {
    points.push(`HCP asked ${signal.queries.length} queries spanning ${signal.intent.toLowerCase()} — prepare comprehensive responses.`);
  }
  if (signal.orionAction.includes("cross-TA") || signal.orionAction.includes("Cross-TA")) {
    points.push(`Cross-therapeutic-area exploration detected — consider involving the ${signal.diseaseArea} specialist MSL.`);
  }
  if (signal.contentAccessed.length > 1) {
    points.push(`Accessed ${signal.contentAccessed.length} content pieces including "${signal.contentAccessed[0]}" — reference these in conversation.`);
  }
  if (signal.stage.includes("Treatment")) {
    points.push("HCP is in treatment selection phase — focus on comparative efficacy and patient selection criteria.");
  }
  if (signal.stage.includes("Pipeline")) {
    points.push("Pipeline interest suggests advisory board or speaker bureau potential — assess willingness.");
  }
  if (signal.intent.includes("Congress") || signal.intent.includes("congress")) {
    points.push("Congress data interest signals desire for cutting-edge evidence — share pre-publication highlights.");
  }
  if (points.length < 2) {
    points.push(`Review content accessed: ${signal.contentAccessed.join(", ")}.`);
    points.push(`Session lasted ${signal.sessionDuration} minutes — indicates ${signal.sessionDuration > 10 ? "substantial" : "focused"} engagement.`);
  }
  return points;
}

const LIVE_SIGNAL_TEMPLATES = [
  {
    hcpId: "HCP-4821", topic: "Dupixent real-world evidence in pediatric AD",
    intent: "Clinical decision support", diseaseArea: "Atopic Dermatitis",
    stage: "Patient management", depth: "Deep engagement",
    orionAction: "PRIORITY: KOL reviewing pediatric data — coordinate with pediatric MSL",
    queries: ["What real-world data exists for dupilumab in adolescent AD patients?", "How do pediatric response rates compare to adults?"],
    contentAccessed: ["Dupixent Pediatric AD Data", "AD Treatment Algorithm 2026"],
    sessionDuration: 11,
  },
  {
    hcpId: "HCP-7204", topic: "Asthma biologic sequencing after anti-IgE failure",
    intent: "Treatment strategy", diseaseArea: "Severe Asthma",
    stage: "Treatment selection", depth: "Deep engagement",
    orionAction: "PRIORITY: Pulmonologist evaluating biologic switch — MSL outreach recommended",
    queries: ["What is the recommended sequencing after omalizumab failure in severe asthma?", "How does dupilumab compare with mepolizumab in eosinophilic asthma?"],
    contentAccessed: ["Severe Asthma Biologic Sequencing Guide", "Dupixent in Asthma — Clinical Overview"],
    sessionDuration: 9,
  },
  {
    hcpId: "HCP-3159", topic: "IL-6 pathway inhibition — long-term safety outcomes",
    intent: "Safety information", diseaseArea: "Rheumatoid Arthritis",
    stage: "Patient management", depth: "Moderate engagement",
    orionAction: "Queue for MSL follow-up — rheumatologist reviewing long-term safety data",
    queries: ["What are the 5-year safety outcomes for sarilumab in RA?"],
    contentAccessed: ["Kevzara Long-Term Safety Extension Study"],
    sessionDuration: 6,
  },
  {
    hcpId: "HCP-5538", topic: "Eosinophilic esophagitis — emerging biologic therapies",
    intent: "Pipeline intelligence", diseaseArea: "EoE",
    stage: "Pipeline assessment", depth: "Deep engagement",
    orionAction: "PRIORITY: Allergist exploring EoE pipeline — high-value engagement for emerging indication",
    queries: ["What biologics are in late-stage trials for EoE?", "What is the dupilumab EoE Phase 3 data?"],
    contentAccessed: ["Dupilumab in EoE — Phase 3 Results", "EoE Treatment Landscape 2026"],
    sessionDuration: 15,
  },
  {
    hcpId: "HCP-9012", topic: "Ulcerative colitis biologic sequencing",
    intent: "Clinical decision support", diseaseArea: "GI / Dermatology",
    stage: "Treatment selection", depth: "Deep engagement",
    orionAction: "Queue for MSL follow-up — GI specialist evaluating biologic options for refractory UC",
    queries: ["What is the current evidence for biologic sequencing in UC after anti-TNF failure?"],
    contentAccessed: ["UC Biologic Sequencing — Evidence Review"],
    sessionDuration: 8,
  },
  {
    hcpId: "HCP-6377", topic: "Prurigo nodularis — nemolizumab and dupilumab data",
    intent: "Scientific education", diseaseArea: "Atopic Dermatitis",
    stage: "Data review", depth: "Moderate engagement",
    orionAction: "Queue for MSL follow-up — dermatologist exploring PN treatment data",
    queries: ["How do nemolizumab and dupilumab compare in prurigo nodularis?"],
    contentAccessed: ["PN Treatment Landscape 2026"],
    sessionDuration: 5,
  },
  {
    hcpId: "HCP-7204", topic: "COPD type 2 high phenotype — dupilumab BOREAS/NOTUS",
    intent: "Clinical decision support", diseaseArea: "COPD",
    stage: "Treatment selection", depth: "High-value engagement",
    orionAction: "PRIORITY: KOL deep-diving COPD data — potential speaker identification",
    queries: ["What were the primary endpoints in BOREAS and NOTUS?", "Which COPD patients are most likely to benefit from dupilumab?"],
    contentAccessed: ["Dupilumab COPD — BOREAS/NOTUS Results", "Type 2 COPD Phenotyping Guide"],
    sessionDuration: 19,
  },
  {
    hcpId: "HCP-4821", topic: "Alopecia areata — JAK inhibitor vs biologic positioning",
    intent: "Treatment strategy", diseaseArea: "Alopecia Areata",
    stage: "Concept exploration", depth: "Moderate engagement",
    orionAction: "Queue for MSL follow-up — KOL comparing mechanism classes in AA",
    queries: ["What is the current positioning of JAK inhibitors versus biologics in alopecia areata?"],
    contentAccessed: ["AA Treatment Landscape 2026"],
    sessionDuration: 7,
  },
];

let liveSignalCounter = 100;

function generateLiveSignal() {
  const template = LIVE_SIGNAL_TEMPLATES[Math.floor(Math.random() * LIVE_SIGNAL_TEMPLATES.length)];
  liveSignalCounter++;
  const now = new Date();
  const ts = now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0") + "T" +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");
  return {
    ...template,
    id: `SIG-LIVE-${liveSignalCounter}`,
    timestamp: ts,
    sessionDuration: Math.max(2, template.sessionDuration + Math.floor(Math.random() * 5) - 2),
    _isLive: true,
  };
}

function addSignal(signal) {
  SIGNALS.push(signal);
}

export { SIGNALS, HCP_PROFILES, getAnalytics, getHcpProfile, getMslActionQueue, generateTalkingPoints, generateLiveSignal, addSignal };
