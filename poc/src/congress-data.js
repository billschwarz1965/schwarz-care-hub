const CONGRESSES = [
  {
    id: "aad-2026",
    name: "AAD 2026 Annual Meeting",
    abbrev: "AAD 2026",
    society: "American Academy of Dermatology",
    location: "San Diego, CA",
    dates: "March 20–24, 2026",
    status: "completed",
    color: "#7a00e6",
    icon: "droplet",
    diseaseAreas: ["Atopic Dermatitis", "Psoriasis", "Prurigo Nodularis", "Chronic Spontaneous Urticaria"],
    totalPresentations: 42,
    sanofiPresentations: 8,
    summary: "Major congress with significant new data on dupilumab long-term outcomes, head-to-head biologic comparisons in AD, and emerging pipeline readouts in prurigo nodularis and CSU.",
  },
  {
    id: "eadv-2026",
    name: "EADV 2026 Congress",
    abbrev: "EADV 2026",
    society: "European Academy of Dermatology and Venereology",
    location: "Milan, Italy",
    dates: "September 24–28, 2026",
    status: "upcoming",
    color: "#aa46a3",
    icon: "world",
    diseaseAreas: ["Atopic Dermatitis", "Psoriasis", "Prurigo Nodularis", "Bullous Pemphigoid"],
    totalPresentations: null,
    sanofiPresentations: null,
    summary: "Expected presentations on dupilumab real-world evidence across European cohorts, new PN Phase 3 data, and long-term safety updates. Key late-breaker slots anticipated.",
  },
  {
    id: "ats-2026",
    name: "ATS 2026 International Conference",
    abbrev: "ATS 2026",
    society: "American Thoracic Society",
    location: "Washington, DC",
    dates: "May 15–20, 2026",
    status: "completed",
    color: "#0f6e56",
    icon: "lungs",
    diseaseAreas: ["Type 2 Asthma", "COPD", "CRSwNP"],
    totalPresentations: 38,
    sanofiPresentations: 6,
    summary: "Pivotal COPD data from BOREAS/NOTUS extension studies. New type 2 biomarker-guided treatment paradigm data. Dupilumab presented across asthma, COPD, and the unified airway.",
  },
  {
    id: "acr-2026",
    name: "ACR Convergence 2026",
    abbrev: "ACR 2026",
    society: "American College of Rheumatology",
    location: "Chicago, IL",
    dates: "November 13–18, 2026",
    status: "upcoming",
    color: "#e5a800",
    icon: "bone",
    diseaseAreas: ["Rheumatoid Arthritis"],
    totalPresentations: null,
    sanofiPresentations: null,
    summary: "Expected sarilumab long-term extension data, real-world outcomes analyses, and new head-to-head data versus JAK inhibitors in biologic-experienced RA patients.",
  },
  {
    id: "aaaai-2026",
    name: "AAAAI 2026 Annual Meeting",
    abbrev: "AAAAI 2026",
    society: "American Academy of Allergy, Asthma & Immunology",
    location: "Phoenix, AZ",
    dates: "February 27 – March 2, 2026",
    status: "completed",
    color: "#5b8def",
    icon: "shield",
    diseaseAreas: ["Type 2 Asthma", "Atopic Dermatitis", "Eosinophilic Esophagitis", "CRSwNP"],
    totalPresentations: 31,
    sanofiPresentations: 5,
    summary: "Cross-disease type 2 inflammation symposia highlighting the shared pathophysiology across atopic conditions. Key EoE real-world evidence and dupilumab pediatric data presented.",
  },
  {
    id: "ddw-2026",
    name: "DDW 2026",
    abbrev: "DDW 2026",
    society: "Digestive Disease Week",
    location: "Los Angeles, CA",
    dates: "May 31 – June 3, 2026",
    status: "completed",
    color: "#d4553a",
    icon: "bottle",
    diseaseAreas: ["Eosinophilic Esophagitis", "IBD"],
    totalPresentations: 28,
    sanofiPresentations: 4,
    summary: "EoE data dominance — dupilumab histologic and symptomatic response durability data. New EoE disease burden analyses and patient-reported outcome improvements across age groups.",
  },
];

const PRESENTATIONS = [
  {
    id: "P-001", congressId: "aad-2026", type: "Late-breaker",
    title: "Dupilumab long-term efficacy and safety in moderate-to-severe AD: 5-year OLE results",
    authors: "Simpson EL, Bieber T, Thaçi D, et al.",
    diseaseArea: "Atopic Dermatitis",
    sanofiData: true,
    abstract: "Five-year open-label extension data demonstrating sustained EASI-75 response in 72% of patients, with no new safety signals. Consistent benefit maintained across age groups and severity strata. Corticosteroid-sparing effect confirmed with 68% reduction in TCS use.",
    keyFindings: [
      "72% sustained EASI-75 at 5 years",
      "No new safety signals in long-term use",
      "68% reduction in topical corticosteroid use",
      "Consistent efficacy across age groups",
    ],
    mslTalkingPoints: "Strongest long-term dataset for any biologic in AD. Addresses key objection about durability. Directly relevant to managed care payer discussions.",
    impact: "high",
  },
  {
    id: "P-002", congressId: "aad-2026", type: "Oral presentation",
    title: "Head-to-head comparison of dupilumab vs. abrocitinib in moderate-to-severe AD: 52-week results",
    authors: "Guttman-Yassky E, Silverberg JI, Paller AS, et al.",
    diseaseArea: "Atopic Dermatitis",
    sanofiData: true,
    abstract: "First direct head-to-head trial comparing dupilumab to a JAK inhibitor over 52 weeks. Dupilumab demonstrated non-inferior efficacy with a significantly more favorable safety profile, including lower rates of serious infections and herpes zoster reactivation.",
    keyFindings: [
      "Dupilumab non-inferior on EASI-75 at Week 52",
      "Significantly fewer serious infections with dupilumab",
      "Lower herpes zoster rates vs. JAK inhibitor",
      "Superior safety profile maintained through 52 weeks",
    ],
    mslTalkingPoints: "Critical competitive data. First head-to-head with JAK in AD. Positions dupilumab as efficacy equivalent with superior safety. Key for formulary discussions.",
    impact: "high",
  },
  {
    id: "P-003", congressId: "aad-2026", type: "Poster",
    title: "Dupilumab in prurigo nodularis: Patient-reported itch reduction and quality of life outcomes",
    authors: "Yosipovitch G, Ständer S, Kwatra SG, et al.",
    diseaseArea: "Prurigo Nodularis",
    sanofiData: true,
    abstract: "Rapid and sustained itch reduction with dupilumab in PN. NRS improvement ≥4 achieved by 60% of patients at Week 24. Significant improvements in DLQI and sleep quality, with effect sizes among the largest seen in PN trials.",
    keyFindings: [
      "60% achieved NRS itch improvement ≥4 at Week 24",
      "Significant DLQI improvement (mean 8.2 points)",
      "Sleep quality improved within first 2 weeks",
      "Durable responses maintained through Week 52",
    ],
    mslTalkingPoints: "PN is severely undertreated. Dupilumab addresses the core complaint (itch) rapidly. Patient-reported outcomes complement clinical endpoints for managed care.",
    impact: "medium",
  },
  {
    id: "P-004", congressId: "ats-2026", type: "Late-breaker",
    title: "Dupilumab in type 2 high COPD: BOREAS and NOTUS 52-week extension results",
    authors: "Bhatt SP, Rabe KF, Hanania NA, et al.",
    diseaseArea: "COPD",
    sanofiData: true,
    abstract: "Extended follow-up confirming sustained exacerbation reduction (34% vs placebo) and FEV1 improvement in type 2 high COPD. Biomarker-guided patient selection (eosinophils ≥300) enriched for responders. First biologic to show consistent benefit in COPD across two Phase 3 trials.",
    keyFindings: [
      "34% reduction in moderate-to-severe exacerbations sustained at 52 weeks",
      "Significant FEV1 improvement maintained (+160 mL vs placebo)",
      "Eosinophil ≥300 cells/µL enrichment validated",
      "Consistent results across BOREAS and NOTUS",
    ],
    mslTalkingPoints: "Landmark COPD data — first biologic with Phase 3 success. Biomarker-guided approach mirrors precision medicine in asthma. Potential first-in-class indication pending regulatory review.",
    impact: "high",
  },
  {
    id: "P-005", congressId: "ats-2026", type: "Oral presentation",
    title: "Unified airway approach: Type 2 biomarker-guided treatment across asthma and CRSwNP",
    authors: "Castro M, Bachert C, Peters AT, et al.",
    diseaseArea: "Type 2 Asthma",
    sanofiData: true,
    abstract: "Integrated analysis demonstrating that treating upper and lower airway type 2 inflammation simultaneously with dupilumab improves outcomes in both domains. Patients with comorbid asthma and CRSwNP showed 45% greater exacerbation reduction when both conditions were treated concurrently.",
    keyFindings: [
      "45% greater exacerbation reduction with concurrent asthma + CRSwNP treatment",
      "Unified biomarker panel (FeNO + eosinophils + NPS) predicts response",
      "Simultaneous upper and lower airway improvement",
      "Supports 'treat the patient, not the disease' paradigm",
    ],
    mslTalkingPoints: "Cross-specialty story — bridges pulmonology and ENT. Supports comprehensive type 2 management. Aligns with ADVENT program educational platform messaging.",
    impact: "high",
  },
  {
    id: "P-006", congressId: "aaaai-2026", type: "Symposium",
    title: "Type 2 inflammation across the atopic march: Shared pathophysiology and therapeutic implications",
    authors: "Guttman-Yassky E, Wechsler ME, Dellon ES, et al.",
    diseaseArea: "Cross-TA Immunology",
    sanofiData: true,
    abstract: "Invited symposium examining IL-4/IL-13 as central drivers across AD, asthma, CRSwNP, and EoE. Presented evidence that early intervention in the atopic march may modify disease progression. Dupilumab's cross-disease efficacy positions IL-4Rα blockade as a platform approach to type 2 inflammation.",
    keyFindings: [
      "IL-4Rα as a validated cross-disease target",
      "Early intervention may modify atopic march progression",
      "Shared biomarker panels across atopic conditions",
      "Platform approach: one mechanism, multiple diseases",
    ],
    mslTalkingPoints: "Flagship cross-TA educational content. Maps directly to ADVENT program and MedVerse disease navigator. Key narrative for multi-specialty MSL engagement.",
    impact: "high",
  },
  {
    id: "P-007", congressId: "aaaai-2026", type: "Oral presentation",
    title: "Dupilumab in EoE: Pediatric efficacy data (ages 1–11) from the Phase 3 EoE KIDS trial",
    authors: "Hirano I, Dellon ES, Rothenberg ME, et al.",
    diseaseArea: "Eosinophilic Esophagitis",
    sanofiData: true,
    abstract: "First Phase 3 data in pediatric EoE (ages 1–11). Dupilumab achieved histologic remission (≤6 eos/HPF) in 58% vs 6% placebo at Week 16. Significant improvement in caregiver-reported feeding difficulties and food tolerance.",
    keyFindings: [
      "58% histologic remission vs 6% placebo in children 1-11",
      "Significant improvement in feeding and food tolerance",
      "Safety profile consistent with known dupilumab profile",
      "Supports broadest age range for any EoE therapy",
    ],
    mslTalkingPoints: "Pediatric GI MSLs: landmark data extending EoE treatment to youngest patients. Unmet need is acute — many children on elimination diets with major QoL impact.",
    impact: "high",
  },
  {
    id: "P-008", congressId: "ddw-2026", type: "Oral presentation",
    title: "Long-term histologic and symptomatic durability of dupilumab in adult EoE: 2-year follow-up",
    authors: "Dellon ES, Hirano I, Gonsalves N, et al.",
    diseaseArea: "Eosinophilic Esophagitis",
    sanofiData: true,
    abstract: "Two-year follow-up demonstrating sustained histologic remission and symptom control. 65% of patients maintained ≤6 eos/HPF at 104 weeks. Dysphagia-free days increased progressively. No esophageal stricture progression in treated patients.",
    keyFindings: [
      "65% sustained histologic remission at 2 years",
      "Progressive improvement in dysphagia-free days",
      "No stricture progression in treated patients",
      "Durable symptom control without dose escalation",
    ],
    mslTalkingPoints: "GI MSLs: durability story addresses key payer and physician concern. No dose escalation needed. Stricture prevention data is practice-changing for disease modification narrative.",
    impact: "medium",
  },
  {
    id: "P-009", congressId: "ddw-2026", type: "Poster",
    title: "Real-world treatment patterns and outcomes in EoE: A multi-center registry analysis",
    authors: "Katzka DA, Reed CC, Gonsalves N, et al.",
    diseaseArea: "Eosinophilic Esophagitis",
    sanofiData: false,
    abstract: "Multi-center registry data confirming high real-world response rates to dupilumab in EoE, consistent with clinical trial findings. Median time to symptom response was 4 weeks. Data from 12 academic medical centers across the US.",
    keyFindings: [
      "Real-world data confirms clinical trial efficacy",
      "Median 4-week time to symptom response",
      "Consistent outcomes across 12 academic centers",
      "High treatment persistence rate (89% at 1 year)",
    ],
    mslTalkingPoints: "Independent real-world validation. Strong evidence base for payer discussions. Generalizability beyond clinical trial populations.",
    impact: "medium",
  },
  {
    id: "P-010", congressId: "aad-2026", type: "Poster",
    title: "Dupilumab in chronic spontaneous urticaria: Subgroup analysis by baseline IgE and prior omalizumab use",
    authors: "Maurer M, Metz M, Bernstein JA, et al.",
    diseaseArea: "Chronic Spontaneous Urticaria",
    sanofiData: true,
    abstract: "Subgroup analysis showing dupilumab efficacy in CSU across IgE strata and in omalizumab-inadequate responders. Patients with high baseline IgE showed numerically greater UAS7 improvement. Efficacy maintained in 78% of patients who had previously failed omalizumab.",
    keyFindings: [
      "Efficacy maintained across IgE strata",
      "78% response in omalizumab-inadequate responders",
      "Higher baseline IgE associated with numerically greater response",
      "Addresses key unmet need in omalizumab-refractory CSU",
    ],
    mslTalkingPoints: "CSU positioning: second-line biologic after omalizumab. Addresses the 'what next' question for refractory patients. IgE biomarker may guide sequencing.",
    impact: "medium",
  },
];

function getCongressById(id) {
  return CONGRESSES.find(c => c.id === id);
}

function getPresentationsByCongressId(congressId) {
  return PRESENTATIONS.filter(p => p.congressId === congressId);
}

function getHighImpactPresentations() {
  return PRESENTATIONS.filter(p => p.impact === "high");
}

function getSanofiPresentations() {
  return PRESENTATIONS.filter(p => p.sanofiData);
}

function getPresentationsByDiseaseArea(area) {
  return PRESENTATIONS.filter(p => p.diseaseArea === area);
}

function getCongressStats() {
  const completed = CONGRESSES.filter(c => c.status === "completed");
  const totalPres = completed.reduce((sum, c) => sum + (c.totalPresentations || 0), 0);
  const sanofiPres = completed.reduce((sum, c) => sum + (c.sanofiPresentations || 0), 0);
  const diseaseAreas = new Set(CONGRESSES.flatMap(c => c.diseaseAreas));
  const highImpact = PRESENTATIONS.filter(p => p.impact === "high").length;
  return {
    totalCongresses: CONGRESSES.length,
    completedCongresses: completed.length,
    totalPresentations: totalPres,
    sanofiPresentations: sanofiPres,
    trackedPresentations: PRESENTATIONS.length,
    diseaseAreas: diseaseAreas.size,
    highImpactCount: highImpact,
  };
}

export { CONGRESSES, PRESENTATIONS, getCongressById, getPresentationsByCongressId, getHighImpactPresentations, getSanofiPresentations, getPresentationsByDiseaseArea, getCongressStats };
