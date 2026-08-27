// ─── Ask MedVerse — cross-module query router ───
// The home page needs one box that answers anything. Each module already has
// its own in-page router; this is the layer above them: it classifies a free-text
// question, decides which agents should handle it, and hands back everything the
// results page needs to show an answer plus deep links into the real modules.
//
// Capability entries are declared once here. A results page filters them to the
// modules its own edition actually ships (see availableModules).

import { generateResponse } from "./rag-engine.js";
import { searchEducationContent } from "./education-content-data.js";
import { searchTrials, trialLink } from "./trials-data.js";

export { trialLink };

// page = the module that hosts this capability; agent = the panel to open there.
export const CAPABILITIES = [
  {
    id: "clinical-qa",
    name: "Clinical Q&A",
    icon: "stethoscope",
    page: "concierge.html",
    agent: "clinical-qa",
    blurb: "Evidence-based answer with citations from governed Sanofi content",
    keywords: ["treatment", "dosing", "dose", "efficacy", "safety", "mechanism", "moa", "guideline", "first-line", "first line", "biologic", "compare", "versus", "evidence", "indication", "contraindication", "pathway", "inflammation", "how does", "options for", "my options", "topicals", "failed topicals", "atopic dermatitis", "eczema", "prescribe", "switch to", "what should i"]
  },
  {
    id: "medinfo",
    name: "Medical Information",
    icon: "file-question",
    page: "concierge.html",
    agent: "medinfo",
    blurb: "Approved answer now, formal written response when it goes beyond the label",
    keywords: ["medical information", "med info", "submit a question", "written response", "off-label", "off label", "renal dose", "hepatic dose", "dialysis", "not in the label", "prescribing information", "unapproved", "lot number", "product quality"]
  },
  {
    id: "trial-match",
    name: "Trial Matching",
    icon: "flask",
    page: "concierge.html",
    agent: "trial-match",
    blurb: "Match a patient profile to eligible Sanofi trials",
    keywords: ["trial", "trials", "enroll", "enrolment", "enrollment", "eligib", "recruiting", "study site", "clinical study", "refer a patient", "phase 3", "phase 2"]
  },
  {
    id: "msl-connect",
    name: "MSL Connect",
    icon: "users",
    page: "concierge.html",
    agent: "msl-connect",
    blurb: "Find the right Medical Science Liaison for your territory and topic",
    keywords: ["msl", "liaison", "field team", "field medical", "who is my", "schedule meeting", "connect with", "scientific exchange", "sanofi contact"]
  },
  {
    id: "ingredient",
    name: "Ingredient Safety",
    icon: "shield-check",
    page: "concierge.html",
    agent: "ingredient",
    blurb: "Excipient and allergy cross-reference before prescribing",
    keywords: ["ingredient", "excipient", "allergy", "allergic", "latex", "polysorbate", "lactose", "halal", "kosher", "gelatin", "preservative", "safe for"]
  },
  {
    id: "temp-stab",
    name: "Temperature Stability",
    icon: "temperature",
    page: "concierge.html",
    agent: "temp-stab",
    blurb: "Cold chain and temperature excursion assessment",
    keywords: ["storage", "temperature", "cold chain", "fridge", "refrigerat", "freeze", "frozen", "excursion", "left out", "room temp", "stability", "expired", "travel with"]
  },
  {
    id: "patient-nav",
    name: "Patient Navigator",
    icon: "route",
    page: "concierge.html",
    agent: "patient-nav",
    blurb: "Care pathway, treatment sequencing, and referral guidance",
    keywords: ["care pathway", "pathway for", "treatment sequence", "next step", "referral", "navigator", "patient profile", "comorbid", "journey"]
  },
  {
    // Medical Affairs' equivalent of Clinical Q&A. Editions without an HCP
    // Concierge (poc-internal) rely on this so clinical questions still land
    // somewhere real.
    id: "medical",
    name: "Medical Concierge",
    icon: "building-hospital",
    page: "medical.html",
    blurb: "Medical Affairs view — evidence, product data, and scientific response support",
    keywords: ["treatment", "dosing", "dose", "efficacy", "safety", "mechanism", "moa", "guideline", "first-line", "biologic", "evidence", "indication", "contraindication", "medical affairs", "scientific response", "atopic dermatitis", "rheumatoid", "asthma"]
  },
  {
    id: "msl",
    name: "MSL Copilot",
    icon: "briefcase",
    page: "msl-copilot.html",
    blurb: "Pre-call briefing, KOL intelligence, and field guidance",
    keywords: ["pre-call", "precall", "briefing", "kol", "territory", "field visit", "call plan", "hcp profile", "engagement history", "talking points"]
  },
  {
    id: "literature",
    name: "Literature Intelligence",
    icon: "book-2",
    page: "literature.html",
    blurb: "Live PubMed and NEJM search with evidence synthesis",
    keywords: ["literature", "pubmed", "publication", "published", "paper", "journal", "meta-analysis", "systematic review", "nejm", "lancet", "citation", "abstract"]
  },
  {
    id: "disease",
    name: "Disease State Navigator",
    icon: "dna",
    page: "disease.html",
    blurb: "Disease biology, pathways, and cross-therapeutic-area connections",
    keywords: ["pathophysiology", "disease state", "biology", "cytokine", "il-4", "il-13", "il-5", "il-6", "il-23", "th17", "biomarker", "phenotype", "cross-ta", "comorbidity", "epidemiology", "prevalence",
      // Rare disease and genetics — these questions have no other natural home.
      "gaucher", "fabry", "asmd", "mps i", "pompe", "hemophilia", "rare disease", "lysosomal",
      "inheritance", "genotype", "autosomal", "gene variant", "mutation", "screening for", "newborn screening", "diabetes", "t1d"]
  },
  {
    id: "congress",
    name: "Congress Intelligence",
    icon: "calendar-event",
    page: "congress.html",
    blurb: "Congress presentations, key findings, and MSL talking points",
    keywords: ["congress", "conference", "aad", "eadv", "eaaci", "ats", "acr", "eular", "ddw", "ash", "isth", "wfh", "symposium", "poster", "late-breaker", "presented at"]
  },
  {
    id: "agents",
    name: "Agent Ecosystem",
    icon: "topology-star-ring-3",
    page: "agents.html",
    blurb: "The full agent and governance architecture",
    keywords: ["agent", "agents", "governance", "compliance", "audit", "architecture", "orchestration", "ecosystem", "which agent", "peer connect", "kol", "advisory board", "expert"]
  },
  {
    id: "population",
    name: "Population Insights",
    icon: "map-2",
    page: "population.html",
    blurb: "Regional disease burden, care gaps, and event geography",
    keywords: ["population", "regional", "geography", "burden by", "care gap", "cohort", "real-world", "rwd", "state", "county", "unmet need", "heat map"]
  },
  {
    id: "orion",
    name: "Interaction Signals",
    icon: "broadcast",
    page: "orion.html",
    blurb: "Field intelligence signals generated from HCP engagement",
    keywords: ["signal", "signals", "field intelligence", "engagement pattern", "orion", "interaction data", "territory"]
  },
  {
    id: "patient-concierge",
    name: "Patient Concierge",
    icon: "heart",
    page: "patient.html",
    blurb: "Patient-friendly treatment guidance and support programs",
    keywords: ["my treatment", "side effects i", "support program", "copay", "financial assistance", "injection training", "caregiver", "what should i expect"]
  }
];

// Capabilities that perform a lookup or intake rather than answering a
// question. For these, the agent *is* the answer — there is no prose response
// to generate, so the results page offers the action instead.
const LOOKUP_CAPABILITIES = new Set([
  "msl-connect", "trial-match", "medinfo", "temp-stab", "ingredient", "patient-nav"
]);

// Terms too common to prove a retrieved document is actually about the query.
const GENERIC_QUERY_TERMS = new Set([
  "sanofi", "medverse", "medical", "clinical", "data", "information", "patient",
  "patients", "disease", "treatment", "therapy", "safety", "efficacy", "dose",
  "dosing", "study", "trial", "trials", "content", "program", "agent", "team"
]);

const STOPWORDS = new Set([
  "the", "and", "for", "are", "what", "which", "who", "how", "why", "when",
  "where", "any", "all", "can", "does", "did", "has", "have", "was", "were",
  "with", "from", "into", "about", "this", "that", "there", "you", "your",
  "our", "its", "been", "more", "most", "some", "such", "than", "then",
  "also", "but", "not", "use", "used", "using", "get", "got", "may", "should",
  "would", "could", "need", "want", "know", "tell", "give", "show", "find",
  "see", "please", "help", "just", "only", "very", "too", "now", "here"
]);

/**
 * Score every capability against the query and return the ones that plausibly
 * apply, best first. Longer keyword phrases score higher than single words so
 * "cold chain" beats an incidental "data".
 */
export function routeQuery(query, availableModules) {
  const q = ` ${query.toLowerCase()} `;
  const available = availableModules && availableModules.length
    ? new Set(availableModules)
    : null;

  const scored = CAPABILITIES
    .filter(c => !available || available.has(c.page))
    .map(c => {
      let score = 0;
      const hits = [];
      for (const kw of c.keywords) {
        if (q.includes(kw.toLowerCase())) {
          // Multi-word phrases are much stronger topical evidence.
          score += kw.includes(" ") ? 6 : 3;
          hits.push(kw);
        }
      }
      return { ...c, score, hits };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored;
}

/**
 * Everything the results page renders: the routed agents, the evidence-backed
 * answer, and matching learning resources.
 */
export function askMedVerse(query, availableModules) {
  const routed = routeQuery(query, availableModules);
  const answer = generateResponse(query);

  const terms = query.toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));

  // A retrieved document is only a real answer if its own title or keywords
  // share a distinctive term with the question. Without this check, a single
  // incidental keyword hit ("MSL" appearing on a congress record because of a
  // booth) renders unrelated content under an "Evidence-based answer" heading —
  // confidently wrong, which is worse than showing nothing.
  // Whole-word matching, not substring: "msl" must not be considered a match
  // for a keyword like "MSL booth" that is about something else entirely.
  const cites = answer.citations || [];
  const answerIsOnTopic = cites.length > 0 && cites.some(c => {
    const words = new Set(
      `${c.title} ${(c.keywords || []).join(" ")}`
        .toLowerCase()
        .split(/[^a-z0-9-]+/)
        .filter(Boolean)
    );
    return terms.some(t => !GENERIC_QUERY_TERMS.has(t) && words.has(t));
  });

  // Lookup-style questions ("who is my MSL", "is this still usable after the
  // fridge failed") have no prose answer — the agent performs the lookup and
  // returns the real result. Lookup takes precedence over a retrieved document
  // even when that document shares a term with the query: matching on a product
  // name does not mean the document answers the question that was asked.
  const topIsLookup = routed.length > 0 && LOOKUP_CAPABILITIES.has(routed[0].id);
  const answerMode = topIsLookup ? "action"
    : answerIsOnTopic ? "evidence"
    : routed.length ? "action"
    : "none";

  // Only let the retrieved document's disease area boost resource ranking when
  // that document was actually on topic — otherwise it drags in resources for
  // the wrong therapeutic area.
  const resources = searchEducationContent(
    query,
    answerIsOnTopic ? answer.signal?.diseaseArea : null,
    6
  );

  // Always give the user somewhere to go, even on a query we can't classify —
  // whichever general-purpose module this edition actually ships.
  const fallback = !routed.length
    ? CAPABILITIES.filter(c => ["clinical-qa", "medical", "literature"].includes(c.id) &&
        (!availableModules || !availableModules.length || availableModules.includes(c.page)))
        .slice(0, 1)
    : [];

  // Actual recruiting studies matching the condition, so "what trials are
  // available for X" gets real protocols rather than only reading material.
  const matchedTrials = searchTrials(query, 5);

  return {
    query,
    terms,
    agents: routed.length ? routed.slice(0, 4) : fallback,
    unmatched: !routed.length,
    answer,
    answerMode,
    answerIsOnTopic,
    resources,
    trials: matchedTrials
  };
}

/** Deep link that opens the module and, where supported, pre-runs the query. */
export function capabilityLink(cap, query) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (cap.agent) params.set("agent", cap.agent);
  const qs = params.toString();
  return qs ? `${cap.page}?${qs}` : cap.page;
}
