// === CANONICAL AREA TAXONOMY ===
//
// `diseaseArea` and `therapeuticArea` are written by hand in ~10 data modules
// and read by four different lookups. Before this module they were free-form
// strings, so the same disease was spelled several ways and retrieval failed
// silently — an `EoE` signal never boosted `Eosinophilic Esophagitis` content,
// and `GI / Dermatology` never matched `Dermatology / Gastroenterology`.
//
// This is a controlled vocabulary, modelled on CARE_GAPS and REGIONS in
// population-data.js: fixed IDs, explicit relationships, and no new values
// invented at the call site. Data modules keep writing human-readable strings
// (they are displayed verbatim in the UI); every *comparison* goes through
// resolveDiseaseArea() / matchesDiseaseArea() here.
//
// DO NOT introduce a new therapeutic or disease area by typing a new string
// into a data file. Add it here, with its aliases, and the rest of the POC
// picks it up. Values that are not in this vocabulary still resolve to null and
// fall back to substring matching, so unknown strings degrade rather than
// break — but they get none of the synonym handling.
//
// No clinical content lives here. Names and abbreviations only.

// --- Business units ---
// A separate axis from therapeutic area. This vocabulary is NOT closed — unlike
// REGIONS in population-data.js, it lists only the value the repo actually
// evidences. "Vaccines" is a Sanofi global business unit that was previously
// stored in the `ta` field of pipeline-data.js and studies-data.js, which made
// the two axes indistinguishable; those rows now carry `businessUnit` instead.
// The repo references GBU as a real organisational axis and names "General
// Medicines" (ai-context/MedVerse_AI_Portable_Bundle_July_2026.md) but does not
// enumerate the full set, so the rest is not guessed here.
// TODO(business): confirm the complete business-unit list before treating this
// as closed, and before assigning a unit to any non-vaccine record. Business
// unit must be stored, never inferred from therapeutic area — at least one TA
// is believed to span more than one unit.
export const BUSINESS_UNITS = [
  { id: "vaccines", name: "Vaccines", aliases: [] },
];

// --- Therapeutic areas ---
// The union of every `therapeuticArea` / `ta` value in use. `Chronic Disease`
// and `Pediatrics` are not therapeutic areas in any real sense, but they are
// what the education content library was tagged with, so they resolve rather
// than silently failing.
//
// "Vaccines" is deliberately absent — see BUSINESS_UNITS above. A record whose
// only area value is a business unit resolves to no therapeutic area, which is
// the honest answer: none is recorded.
export const THERAPEUTIC_AREAS = [
  { id: "immunology", name: "Immunology", aliases: [] },
  { id: "dermatology", name: "Dermatology", aliases: ["Derm"] },
  { id: "gastroenterology", name: "Gastroenterology", aliases: ["GI"] },
  { id: "respiratory", name: "Respiratory", aliases: ["Pulmonology", "Pulmonary"] },
  { id: "rhinology", name: "Rhinology", aliases: [] },
  { id: "allergy", name: "Allergy", aliases: [] },
  { id: "rheumatology", name: "Rheumatology", aliases: [] },
  { id: "neurology", name: "Neurology", aliases: [] },
  { id: "oncology", name: "Oncology", aliases: [] },
  { id: "hematology", name: "Hematology", aliases: ["Rare Blood Disorders"] },
  { id: "rare-diseases", name: "Rare Diseases", aliases: ["Rare Disease"] },
  { id: "endocrinology", name: "Endocrinology", aliases: ["Diabetes"] },
  { id: "ophthalmology", name: "Ophthalmology", aliases: [] },
  { id: "transplant", name: "Transplant", aliases: [] },
  { id: "pediatrics", name: "Pediatrics", aliases: [] },
  { id: "chronic-disease", name: "Chronic Disease", aliases: [] },
  // The single sanctioned "not area-specific" value. Everything that used to
  // mean this — General, Multiple, Other — is an alias, not a sibling.
  { id: "unspecified", name: "Unspecified", aliases: ["General", "Multiple", "Multi-indication", "Other"] },
];

// --- Disease areas ---
// Fields:
//   id            stable key — the only thing code should compare
//   name          canonical display string
//   abbrev        the abbreviation clinicians actually use, when there is one
//   scope         "disease"          a single condition
//                 "therapeutic-area" a whole TA used as a disease-area tag
//                 "cross-disease"    a deliberate multi-disease bucket
//                 "unspecified"      no area stated
//   parent        broader disease area, for records tagged at coarser
//                 granularity (studies-data.js tags Crohn's/UC; congress-data.js
//                 and education-content-data.js tag the same domain as IBD)
//   therapeuticAreas  TA ids this sits under. An array, so cross-TA diseases
//                 like EoE do not need a "Immunology / Gastroenterology"
//                 compound string to express themselves.
//   aliases       every other spelling observed in the data files. Adding a
//                 spelling here is how you retire a collision.
export const DISEASE_AREAS = [
  {
    id: "atopic-dermatitis", name: "Atopic Dermatitis", abbrev: "AD", scope: "disease",
    therapeuticAreas: ["immunology", "dermatology"],
    aliases: ["Eczema", "Atopic Eczema"],
  },
  {
    // "Severe Asthma" (orion-data.js, orion-app.js) and "Type 2 Asthma"
    // (congress-data.js, education-content-data.js) were the same records
    // under two names, so neither module could see the other's signals.
    id: "asthma", name: "Asthma", abbrev: null, scope: "disease",
    therapeuticAreas: ["immunology", "respiratory"],
    aliases: ["Severe Asthma", "Type 2 Asthma", "Eosinophilic Asthma", "Moderate-to-Severe Asthma"],
  },
  {
    id: "copd", name: "Chronic Obstructive Pulmonary Disease", abbrev: "COPD", scope: "disease",
    therapeuticAreas: ["respiratory"],
    aliases: [],
  },
  {
    id: "crswnp", name: "Chronic Rhinosinusitis with Nasal Polyps", abbrev: "CRSwNP", scope: "disease",
    therapeuticAreas: ["immunology", "rhinology"],
    aliases: [],
  },
  {
    // The original failure this module was written for: education-content-data.js
    // tags "Eosinophilic Esophagitis", orion-data.js emits "EoE".
    id: "eosinophilic-esophagitis", name: "Eosinophilic Esophagitis", abbrev: "EoE", scope: "disease",
    therapeuticAreas: ["immunology", "gastroenterology"],
    aliases: [],
  },
  {
    id: "prurigo-nodularis", name: "Prurigo Nodularis", abbrev: "PN", scope: "disease",
    therapeuticAreas: ["immunology", "dermatology"],
    aliases: [],
  },
  {
    id: "chronic-spontaneous-urticaria", name: "Chronic Spontaneous Urticaria", abbrev: "CSU", scope: "disease",
    therapeuticAreas: ["immunology", "dermatology"],
    aliases: [],
  },
  {
    id: "bullous-pemphigoid", name: "Bullous Pemphigoid", abbrev: "BP", scope: "disease",
    therapeuticAreas: ["immunology", "dermatology"],
    aliases: [],
  },
  {
    id: "alopecia-areata", name: "Alopecia Areata", abbrev: "AA", scope: "disease",
    therapeuticAreas: ["immunology", "dermatology"],
    aliases: [],
  },
  {
    id: "psoriasis", name: "Psoriasis", abbrev: null, scope: "disease",
    therapeuticAreas: ["immunology", "dermatology"],
    aliases: [],
  },
  {
    id: "inflammatory-bowel-disease", name: "Inflammatory Bowel Disease", abbrev: "IBD", scope: "disease",
    therapeuticAreas: ["immunology", "gastroenterology"],
    aliases: [],
  },
  {
    // studies-data.js records these two individually; congress-data.js and the
    // education library record the parent. `parent` is what lets a filter for
    // either granularity find both.
    id: "crohns-disease", name: "Crohn's Disease", abbrev: null, scope: "disease",
    parent: "inflammatory-bowel-disease",
    therapeuticAreas: ["immunology", "gastroenterology"],
    aliases: ["Crohn Disease", "Crohns Disease"],
  },
  {
    id: "ulcerative-colitis", name: "Ulcerative Colitis", abbrev: "UC", scope: "disease",
    parent: "inflammatory-bowel-disease",
    therapeuticAreas: ["immunology", "gastroenterology"],
    aliases: [],
  },
  {
    id: "celiac-disease", name: "Celiac Disease", abbrev: null, scope: "disease",
    therapeuticAreas: ["immunology", "gastroenterology"],
    aliases: ["Coeliac Disease"],
  },
  {
    id: "rheumatoid-arthritis", name: "Rheumatoid Arthritis", abbrev: "RA", scope: "disease",
    therapeuticAreas: ["immunology", "rheumatology"],
    aliases: [],
  },
  {
    id: "polymyalgia-rheumatica", name: "Polymyalgia Rheumatica", abbrev: "PMR", scope: "disease",
    therapeuticAreas: ["immunology", "rheumatology"],
    aliases: [],
  },
  {
    id: "type-1-diabetes", name: "Type 1 Diabetes", abbrev: "T1D", scope: "disease",
    therapeuticAreas: ["endocrinology"],
    aliases: [],
  },
  {
    id: "multiple-sclerosis", name: "Multiple Sclerosis", abbrev: "MS", scope: "disease",
    therapeuticAreas: ["neurology"],
    aliases: ["Multiple Sclerosis / Neuromuscular"],
  },
  {
    id: "hemophilia", name: "Hemophilia", abbrev: null, scope: "disease",
    therapeuticAreas: ["rare-diseases", "hematology"],
    aliases: ["Haemophilia", "Hemophilia A", "Hemophilia B"],
  },
  {
    id: "fabry-disease", name: "Fabry Disease", abbrev: null, scope: "disease",
    therapeuticAreas: ["rare-diseases"],
    aliases: [],
  },
  {
    id: "gaucher-disease", name: "Gaucher Disease", abbrev: null, scope: "disease",
    therapeuticAreas: ["rare-diseases"],
    aliases: [],
  },
  {
    id: "asmd", name: "Acid Sphingomyelinase Deficiency", abbrev: "ASMD", scope: "disease",
    therapeuticAreas: ["rare-diseases"],
    aliases: [],
  },
  {
    id: "mps-i", name: "Mucopolysaccharidosis Type I", abbrev: "MPS I", scope: "disease",
    therapeuticAreas: ["rare-diseases"],
    aliases: ["MPS 1"],
  },

  // --- Cross-disease buckets ---
  // Deliberately broader than one condition. Kept distinct from "unspecified":
  // these state a scope, they do not omit one.
  {
    id: "cross-ta-immunology", name: "Cross-TA Immunology", abbrev: null, scope: "cross-disease",
    therapeuticAreas: ["immunology"],
    aliases: ["Multi-TA Immunology", "Cross-TA"],
  },
  {
    // "GI / Dermatology" and "Dermatology / Gastroenterology" are the same pair
    // written in two orders. Slash-separated values are sorted during
    // normalisation, so both spellings land on this one entry — and so will any
    // future reordering.
    id: "derm-gi-overlap", name: "Dermatology / Gastroenterology", abbrev: null, scope: "cross-disease",
    therapeuticAreas: ["dermatology", "gastroenterology"],
    aliases: ["GI / Dermatology", "Gastroenterology / Dermatology", "Dermatology / GI"],
  },

  // --- Therapeutic-area-level tags ---
  // Some records tag a whole TA in the diseaseArea field. Rather than treat
  // that as a data error, it is a scope: these match any disease sitting under
  // the same TA.
  {
    id: "ta-dermatology", name: "Dermatology", abbrev: null, scope: "therapeutic-area",
    therapeuticAreas: ["dermatology"], aliases: [],
  },
  {
    id: "ta-neurology", name: "Neurology", abbrev: null, scope: "therapeutic-area",
    therapeuticAreas: ["neurology"], aliases: [],
  },
  {
    id: "ta-oncology", name: "Oncology", abbrev: null, scope: "therapeutic-area",
    therapeuticAreas: ["oncology"], aliases: [],
  },
  {
    id: "ta-rare-diseases", name: "Rare Diseases", abbrev: null, scope: "therapeutic-area",
    therapeuticAreas: ["rare-diseases"], aliases: [],
  },
  {
    id: "ta-transplant", name: "Transplant", abbrev: null, scope: "therapeutic-area",
    therapeuticAreas: ["transplant"], aliases: [],
  },

  // --- No area stated ---
  // Four strings meant this: General, Multiple, Multi-indication and
  // "Multiple (Immunology)". They are aliases of one value, not four values.
  // Note that "Cross-TA Immunology" above is *not* folded in here: it names a
  // scope, whereas these omit one.
  {
    id: "unspecified", name: "Unspecified", abbrev: null, scope: "unspecified",
    therapeuticAreas: [],
    aliases: ["General", "Multiple", "Multi-indication", "Multiple (Immunology)", "Multi-TA", "Other"],
  },
];

// --- Normalisation ---

// Lowercase, drop punctuation, collapse whitespace. Slash-separated values are
// split, normalised, sorted and rejoined so "A / B" and "B / A" produce one key.
function normalizeKey(raw) {
  if (typeof raw !== "string") return "";
  const part = (s) => s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9/]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  const parts = raw.split("/").map(part).filter(Boolean);
  if (parts.length <= 1) return parts[0] || "";
  return parts.sort().join("/");
}

function buildIndex(entries) {
  const index = new Map();
  for (const entry of entries) {
    const spellings = [entry.id, entry.name, entry.abbrev, ...(entry.aliases || [])];
    for (const spelling of spellings) {
      const key = normalizeKey(spelling);
      if (key) index.set(key, entry);
    }
  }
  return index;
}

const TA_INDEX = buildIndex(THERAPEUTIC_AREAS);
const DISEASE_INDEX = buildIndex(DISEASE_AREAS);
const BU_INDEX = buildIndex(BUSINESS_UNITS);
const DISEASE_BY_ID = new Map(DISEASE_AREAS.map(d => [d.id, d]));

/** Canonical business-unit entry for one spelling, or null if unknown. */
export function resolveBusinessUnit(raw) {
  return BU_INDEX.get(normalizeKey(raw)) || null;
}

/** Canonical therapeutic-area entry for one spelling, or null if unknown. */
export function resolveTherapeuticArea(raw) {
  return TA_INDEX.get(normalizeKey(raw)) || null;
}

/**
 * Therapeutic-area ids for a value that may be a compound such as
 * "Immunology / Gastroenterology" or "Immunology / Asthma / CRSwNP" — the
 * education library mixes TA names and disease names in the same slash list.
 * Tokens that are not a TA are tried as a disease and contribute its TAs.
 */
export function therapeuticAreaIds(raw) {
  if (typeof raw !== "string") return [];
  const ids = [];
  for (const token of raw.split("/")) {
    const ta = resolveTherapeuticArea(token);
    if (ta) { if (!ids.includes(ta.id)) ids.push(ta.id); continue; }
    const disease = DISEASE_INDEX.get(normalizeKey(token));
    if (disease) for (const id of disease.therapeuticAreas) if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

/** Canonical disease-area entry for one spelling, or null if unknown. */
export function resolveDiseaseArea(raw) {
  // A compound value is only tried whole; normalizeKey has already sorted its
  // parts, so "GI / Dermatology" and "Dermatology / Gastroenterology" agree.
  return DISEASE_INDEX.get(normalizeKey(raw)) || null;
}

/** Canonical id for one spelling, or null if the vocabulary doesn't know it. */
export function diseaseAreaId(raw) {
  const entry = resolveDiseaseArea(raw);
  return entry ? entry.id : null;
}

/** Canonical display name for one spelling, or the input unchanged if unknown. */
export function diseaseAreaName(raw) {
  const entry = resolveDiseaseArea(raw);
  return entry ? entry.name : raw;
}

/**
 * The entry's id followed by its ancestors, e.g. Crohn's Disease →
 * ["crohns-disease", "inflammatory-bowel-disease"]. Lets a lookup keyed at one
 * granularity serve records tagged at another.
 */
export function diseaseAreaLineage(raw) {
  return lineageOf(resolveDiseaseArea(raw));
}

function lineageOf(entry) {
  const lineage = [];
  while (entry && !lineage.includes(entry.id)) {
    lineage.push(entry.id);
    entry = entry.parent ? DISEASE_BY_ID.get(entry.parent) : null;
  }
  return lineage;
}

function sharesTherapeuticArea(a, b) {
  return a.therapeuticAreas.some(id => b.therapeuticAreas.includes(id));
}

/**
 * Does a record tagged `itemValue` belong to a filter for `filterValue`?
 * Order-independent, alias-aware and granularity-aware.
 *
 * Rules, in order:
 *   - same canonical entry → match (this is what fixes EoE / Eosinophilic
 *     Esophagitis, Severe / Type 2 Asthma, and the reversed slash pairs)
 *   - one is an ancestor of the other → match (IBD ↔ Crohn's / UC)
 *   - "unspecified" only matches "unspecified" — a resource with no stated
 *     area must not answer for every disease
 *   - a therapeutic-area-level or cross-disease tag on either side matches on
 *     shared TA, so a Cross-TA Immunology signal reaches immunology content
 *   - otherwise no match
 *
 * If either value is outside the vocabulary this falls back to the substring
 * test the call sites used before, so unknown strings keep their old behaviour.
 */
export function matchesDiseaseArea(itemValue, filterValue) {
  if (!itemValue || !filterValue) return false;

  const item = resolveDiseaseArea(itemValue);
  const filter = resolveDiseaseArea(filterValue);

  if (!item || !filter) {
    return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
  }

  if (item.id === filter.id) return true;
  if (lineageOf(item).includes(filter.id)) return true;
  if (lineageOf(filter).includes(item.id)) return true;
  if (item.scope === "unspecified" || filter.scope === "unspecified") return false;

  const broad = ["therapeutic-area", "cross-disease"];
  if (broad.includes(item.scope) || broad.includes(filter.scope)) {
    return sharesTherapeuticArea(item, filter);
  }

  return false;
}

// === TRIAL SCHEMA RECONCILIATION ===
//
// studies-data.js and trials-data.js describe overlapping clinical trials with
// different field names (`ta` vs `therapeuticArea`, `disease` vs `conditions[]`).
// They are NOT merged, for three reasons:
//
//   1. Different provenance. SANOFI_STUDIES is the 91-row sanofistudies.com
//      roster; `trials` is scraped from the Sanofi trial finder. Merging would
//      mean asserting a single source for records that came from two, and both
//      files say where their rows came from.
//   2. Different cardinality. A study row carries one `disease`; a trial record
//      carries `conditions[]` because the registry lists several per protocol.
//      Flattening either direction loses information.
//   3. Different purpose, stated in trials-data.js' own header: `trials` are
//      eligibility records (status, phase, enrolment, site count) an HCP judges
//      a patient against; SANOFI_STUDIES is a portfolio inventory.
//
// What *is* reconciled is the taxonomy dimension. Both shapes go through
// trialFacets() below and come out with canonical area ids, so one filter can
// query both without either file changing its schema. Disease-level resolution
// is partial by design: the controlled vocabulary covers the `diseaseArea`
// values the signal and content modules use, not all ~90 conditions in the
// study roster, so `diseaseAreaIds` is often empty while `therapeuticAreaIds`
// resolves. That is visible rather than silent.
export function trialFacets(record) {
  const conditions = Array.isArray(record.conditions)
    ? record.conditions
    : [record.disease].filter(Boolean);

  const diseaseAreaIds = [];
  for (const condition of conditions) {
    const id = diseaseAreaId(condition);
    if (id && !diseaseAreaIds.includes(id)) diseaseAreaIds.push(id);
  }

  const raw = record.therapeuticArea || record.ta || "";
  const therapeuticAreaIdList = therapeuticAreaIds(raw);
  // A study row's `ta` is sometimes a disease-level TA the vocabulary knows
  // only through its conditions — back-fill from those rather than report none.
  if (!therapeuticAreaIdList.length) {
    for (const id of diseaseAreaIds) {
      const entry = DISEASE_BY_ID.get(id);
      if (entry) for (const ta of entry.therapeuticAreas) {
        if (!therapeuticAreaIdList.includes(ta)) therapeuticAreaIdList.push(ta);
      }
    }
  }

  // Reported separately from therapeuticAreaIds, never folded into it. A record
  // can have a business unit and no therapeutic area — that is the state of the
  // vaccine rows in both files — and a caller filtering by TA must not silently
  // pick those up.
  const bu = resolveBusinessUnit(record.businessUnit);

  return {
    nct: record.nct,
    conditions,
    diseaseAreaIds,
    therapeuticAreaIds: therapeuticAreaIdList,
    businessUnitId: bu ? bu.id : null,
    unresolvedConditions: conditions.filter(c => !diseaseAreaId(c)),
  };
}
