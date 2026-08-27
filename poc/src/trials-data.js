// ─── Sanofi clinical trials ───
// Real recruiting studies scraped from the Sanofi trial finder
// (sanofi.com/en/clinical-trials/search?keyword=…). These are structured
// records, not reading material, so they live apart from educationContent:
// a trial has a status, phase, enrolment target and site count that an HCP
// judges eligibility against.
//
// Every entry links to ClinicalTrials.gov by NCT ID, which is the registry of
// record — deliberately not to a Sanofi marketing page, so the HCP can read
// the full protocol and eligibility criteria at source.

export const trials = [
  // ── Oncology ──
  {
    nct: "NCT05363319",
    title: "Study of Routine Use of an Immunotherapy for Advanced Non-Small Cell Lung Cancer",
    status: "Recruiting",
    phase: "Observational",
    conditions: ["Non-small Cell Lung Cancer"],
    therapeuticArea: "Oncology",
    enrollment: 300,
    sites: 28,
    keywords: ["lung cancer", "NSCLC", "non-small cell", "immunotherapy", "oncology", "cancer", "real-world"]
  },
  {
    nct: "NCT05584670",
    title: "Study of an Investigational Study Drug Alone or With Other Treatments for Advanced Solid Tumors",
    status: "Recruiting",
    phase: "Phase 1/2",
    conditions: ["Solid Tumor"],
    therapeuticArea: "Oncology",
    enrollment: 542,
    sites: 22,
    keywords: ["solid tumor", "advanced", "metastatic", "oncology", "cancer", "cetuximab", "bevacizumab", "melanoma", "kidney cancer", "mesothelioma"]
  },
  {
    nct: "NCT06131840",
    title: "Study of an Investigational Antibody-Drug Conjugate for Advanced Solid Tumors",
    status: "Recruiting",
    phase: "Phase 1",
    conditions: ["Colorectal Neoplasms", "Non-Small-Cell Lung Carcinoma", "Stomach Neoplasms", "Pancreatic Ductal Adenocarcinoma"],
    therapeuticArea: "Oncology",
    enrollment: 914,
    sites: 52,
    keywords: ["antibody-drug conjugate", "ADC", "colorectal", "gastric", "lung cancer", "pancreatic", "oncology", "cancer", "solid tumor"]
  },
  {
    nct: "NCT07629960",
    title: "Study of an Investigational Study Drug for Metastatic KRAS-Mutant Cancers",
    status: "Recruiting",
    phase: "Phase 1/2",
    conditions: ["Advanced Solid Tumor", "Non-Small Cell Lung Cancer", "Colorectal Neoplasms", "Pancreatic Ductal Adenocarcinoma"],
    therapeuticArea: "Oncology",
    enrollment: 265,
    sites: 2,
    keywords: ["KRAS", "G12C", "G12D", "mutation", "metastatic", "pancreatic", "colorectal", "lung cancer", "oncology", "cancer", "biomarker"]
  },
  {
    nct: "NCT07692204",
    title: "Study of an Investigational Study Drug for Advanced Stomach or Gastroesophageal Junction Cancer",
    status: "Recruiting",
    phase: "Phase 2",
    conditions: ["Gastric Cancer", "Oesophageal Carcinoma"],
    therapeuticArea: "Oncology",
    enrollment: 30,
    sites: 1,
    keywords: ["gastric cancer", "stomach cancer", "gastroesophageal", "oesophageal", "HER2", "oncology", "cancer"]
  },

  // ── Atopic dermatitis ──
  {
    nct: "NCT06241118",
    title: "Study of an Investigational Injection for Moderate-to-Severe Atopic Dermatitis",
    status: "Recruiting",
    phase: "Phase 3",
    conditions: ["Atopic Dermatitis"],
    therapeuticArea: "Immunology",
    enrollment: 636,
    sites: 155,
    keywords: ["atopic dermatitis", "eczema", "moderate-to-severe", "injection", "dermatology", "immunology"]
  },
  {
    nct: "NCT06039241",
    title: "Study of Long-Term Treatment With an Approved Medicine for Atopic Dermatitis",
    status: "Recruiting",
    phase: "Observational",
    conditions: ["Atopic Dermatitis"],
    therapeuticArea: "Immunology",
    enrollment: 900,
    sites: 55,
    keywords: ["atopic dermatitis", "eczema", "long-term", "safety", "dermatology", "immunology"]
  },
  {
    nct: "NCT06837454",
    title: "Study of Real-World Care for Adults With Moderate to Severe Atopic Dermatitis",
    status: "Recruiting",
    phase: "Observational",
    conditions: ["Atopic Dermatitis"],
    therapeuticArea: "Immunology",
    enrollment: 600,
    sites: 64,
    keywords: ["atopic dermatitis", "eczema", "real-world", "adults", "dermatology", "immunology"]
  },
  {
    nct: "NCT07290803",
    title: "Study of Long-Term Real-World Systemic Treatments for Atopic Dermatitis",
    status: "Recruiting",
    phase: "Observational",
    conditions: ["Atopic Dermatitis"],
    therapeuticArea: "Immunology",
    enrollment: 1000,
    sites: 80,
    keywords: ["atopic dermatitis", "eczema", "systemic", "real-world", "long-term", "dermatology"]
  },
  {
    nct: "NCT03936335",
    title: "Study of Pregnancy and Infant Outcomes in Women With Atopic Dermatitis",
    status: "Recruiting",
    phase: "Observational",
    conditions: ["Adverse Pregnancy Outcomes", "Atopic Dermatitis"],
    therapeuticArea: "Immunology",
    enrollment: 3930,
    sites: 1,
    keywords: ["atopic dermatitis", "pregnancy", "infant", "registry", "outcomes", "dermatology"]
  },
  {
    nct: "NCT06192563",
    title: "Study of Dupilumab Treatment in Children and Teens With Severe Atopic Dermatitis",
    status: "Recruiting",
    phase: "Observational",
    conditions: ["Atopic Dermatitis"],
    therapeuticArea: "Immunology",
    enrollment: 230,
    sites: 9,
    keywords: ["atopic dermatitis", "dupilumab", "children", "pediatric", "adolescent", "severe", "dermatology"]
  },
  {
    nct: "NCT07467564",
    title: "Study of a Treatment's Effects on Mental Health in Moderate-to-Severe Atopic Dermatitis",
    status: "Recruiting",
    phase: "Observational",
    conditions: ["Atopic Dermatitis"],
    therapeuticArea: "Immunology",
    enrollment: 184,
    sites: 7,
    keywords: ["atopic dermatitis", "mental health", "depression", "anxiety", "quality of life", "dermatology"]
  }
];

const TRIAL_GENERIC_TERMS = new Set([
  "trial", "trials", "study", "studies", "clinical", "available", "recruiting",
  "patient", "patients", "the", "and", "for", "are", "any", "what", "which",
  "with", "from", "about", "this", "that", "does", "advanced", "treatment",
  "investigational", "drug", "severe", "moderate", "adults", "multiple"
]);

/**
 * Match trials on distinctive condition/keyword terms. Returns nothing rather
 * than a generic list when the query names no recognisable condition — a
 * clinician scanning for eligibility is not helped by unrelated protocols.
 */
export function searchTrials(query, limit = 5) {
  const terms = query.toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter(t => t.length > 2 && !TRIAL_GENERIC_TERMS.has(t));

  if (!terms.length) return [];

  const scored = trials.map(t => {
    const hay = `${t.title} ${t.conditions.join(" ")} ${t.keywords.join(" ")} ${t.therapeuticArea}`.toLowerCase();
    const words = new Set(hay.split(/[^a-z0-9-]+/).filter(Boolean));
    let score = 0;
    for (const term of terms) {
      if (words.has(term)) score += 4;
      else if (hay.includes(term)) score += 2;   // catches multi-word conditions
    }
    return { ...t, score };
  });

  return scored
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score || b.sites - a.sites)
    .slice(0, limit);
}

/** The registry of record, so an HCP can read the real protocol. */
export function trialLink(t) {
  return `https://clinicaltrials.gov/study/${t.nct}`;
}
