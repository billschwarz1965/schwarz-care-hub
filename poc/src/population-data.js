// === POPULATION INTELLIGENCE — deidentified aggregate RWD ===
//
// Source: licensed deidentified real-world data (claims + EHR). No patient-level
// records and no HCP-linked patient counts exist in this module by design.
//
// AGGREGATION FLOOR: state. Cells below SUPPRESSION_THRESHOLD are not reported.
// The join to MedVerse behavioural signals happens at REGION level only — see
// buildOverlay(). That is the Medical/Commercial firewall expressed as a data
// constraint rather than a policy document.
//
// All figures below are ILLUSTRATIVE example data for demonstration purposes.

export const AGGREGATION_FLOOR = "state";
export const SUPPRESSION_THRESHOLD = 11;

// Regions match HCP_PROFILES[].region in orion-data.js so behavioural signals
// can be rolled up and joined. Do not introduce new region names here.
export const REGIONS = [
  { id: "Northeast", name: "Northeast", color: "#2563eb" },
  { id: "Mid-Atlantic", name: "Mid-Atlantic", color: "#7a00e6" },
  { id: "Southeast", name: "Southeast", color: "#d97706" },
  { id: "Midwest", name: "Midwest", color: "#0f6e56" },
  { id: "West", name: "West", color: "#be185d" },
];

// === CARE GAP TAXONOMY ===
// Every gap is anchored to a guideline or a safety concern, never to an
// opportunity. `safetyRelevant` gaps are the least contestable as Medical
// activity and are surfaced first in the UI.
export const CARE_GAPS = [
  {
    id: "prolonged-tcs",
    name: "Prolonged topical therapy",
    shortName: "Prolonged topicals",
    definition:
      "Moderate-to-severe AD, mid/high-potency topical corticosteroid ≥12 months with ≥2 documented flares and no systemic or biologic escalation",
    guideline: "AAD 2023 / EADV 2022 — escalate beyond topicals when disease is inadequately controlled",
    gapType: "undertreatment",
    medicalImplication:
      "Clinicians may not recognise inadequate-control thresholds or the criteria that should trigger escalation",
    educationNeed: "Severity assessment and escalation criteria",
    safetyRelevant: false,
    nationalRate: 41,
    unit: "%",
  },
  {
    id: "systemic-steroid-burden",
    name: "Recurrent systemic corticosteroid exposure",
    shortName: "Systemic steroid burden",
    definition: "≥3 oral corticosteroid bursts per year prescribed for AD flares",
    guideline: "Guidelines discourage repeated or chronic systemic corticosteroids in AD",
    gapType: "safety",
    medicalImplication:
      "Cumulative corticosteroid toxicity — bone density loss, adrenal suppression, metabolic and ocular sequelae",
    educationNeed: "Steroid-sparing strategies and cumulative exposure risk",
    safetyRelevant: true,
    nationalRate: 22,
    unit: "%",
  },
  {
    id: "referral-delay",
    name: "Dermatology referral delay",
    shortName: "Referral delay",
    definition:
      "Median months from first moderate-to-severe AD coding in primary care to a dermatology encounter",
    guideline: "Timely specialist referral is recommended for inadequately controlled disease",
    gapType: "access",
    medicalImplication:
      "Prolonged uncontrolled inflammation before specialist assessment; correlates with specialist density",
    educationNeed: "Referral criteria for primary care; teledermatology pathways",
    safetyRelevant: false,
    nationalRate: 8.4,
    unit: "mo",
  },
  {
    id: "t2-comorbidity",
    name: "Unrecognised Type 2 comorbidity",
    shortName: "Type 2 comorbidity",
    definition:
      "AD patients with utilisation patterns consistent with asthma, CRSwNP or EoE but no corresponding recorded diagnosis",
    guideline: "Atopic march — Type 2 comorbidity screening is recommended in moderate-to-severe AD",
    gapType: "diagnostic",
    medicalImplication:
      "Atopic march under-recognised; disease managed organ-by-organ rather than by shared Type 2 mechanism",
    educationNeed: "Cross-TA Type 2 comorbidity screening",
    safetyRelevant: false,
    nationalRate: 31,
    unit: "%",
  },
  {
    id: "severity-undocumented",
    name: "Severity not documented",
    shortName: "Severity undocumented",
    definition: "No EASI, IGA, BSA or DLQI recorded across ≥12 months of active AD management",
    guideline: "Guidelines expect objective severity assessment to guide therapy",
    gapType: "measurement",
    medicalImplication:
      "Without documented severity, escalation decisions stall and payer authorisation cannot be supported",
    educationNeed: "Practical severity assessment in routine practice",
    safetyRelevant: false,
    nationalRate: 54,
    unit: "%",
  },
  {
    id: "jak-first",
    name: "JAK inhibitor without prior biologic trial",
    shortName: "JAK before biologic",
    definition: "Oral JAK inhibitor initiated as first advanced therapy with no prior biologic exposure",
    guideline: "Comparative safety favours trialling a non-boxed-warning option first",
    gapType: "safety",
    medicalImplication:
      "A boxed-warning agent (MACE, malignancy, thrombosis) used ahead of an option without those warnings",
    educationNeed: "Advanced-therapy sequencing and comparative safety",
    safetyRelevant: true,
    nationalRate: 17,
    unit: "%",
  },
];

// === GEOGRAPHY ===
// Compact tuple table expanded below. Tile grid row/col drive the map layout
// (an 8 x 11 tile grid map — each state one cell, arranged to approximate US
// geography). Fields:
//   code, name, region, row, col, cohort, needIndex, engagementIndex, dermPer100k
//
// `cohort` = estimated deidentified moderate-to-severe adult AD cohort size.
// `needIndex` / `engagementIndex` are 0-100 composites.
// Texas is grouped under West to stay inside the five-region vocabulary that
// orion-data.js already uses; a real deployment would add South Central.
const GEO_TUPLES = [
  // code, name,            region,         row, col, cohort, need, engage, derm
  ["ME", "Maine",           "Northeast",      1, 11,   4100,  61,  27, 2.1],
  ["VT", "Vermont",         "Northeast",      2, 10,   1900,  48,  31, 2.6],
  ["NH", "New Hampshire",   "Northeast",      2, 11,   3800,  46,  38, 2.9],
  ["AK", "Alaska",          "West",           3,  1,   1600,  72,  14, 0.9],
  ["WI", "Wisconsin",       "Midwest",        3,  6,  16800,  44,  58, 3.1],
  ["MI", "Michigan",        "Midwest",        3,  7,  27400,  52,  54, 3.0],
  ["NY", "New York",        "Northeast",      3,  9,  56200,  63,  86, 5.2],
  ["MA", "Massachusetts",   "Northeast",      3, 10,  20100,  55,  91, 5.8],
  ["RI", "Rhode Island",    "Northeast",      3, 11,   3200,  53,  62, 3.4],
  ["WA", "Washington",      "West",           4,  1,  21900,  49,  67, 3.3],
  ["ID", "Idaho",           "West",           4,  2,   5400,  66,  21, 1.3],
  ["MT", "Montana",         "West",           4,  3,   2900,  69,  18, 1.1],
  ["ND", "North Dakota",    "Midwest",        4,  4,   1800,  57,  16, 1.4],
  ["MN", "Minnesota",       "Midwest",        4,  5,  16200,  42,  74, 3.6],
  ["IL", "Illinois",        "Midwest",        4,  6,  36100,  51,  71, 3.4],
  ["IN", "Indiana",         "Midwest",        4,  7,  19600,  62,  39, 2.2],
  ["OH", "Ohio",            "Midwest",        4,  8,  33800,  58,  49, 2.8],
  ["PA", "Pennsylvania",    "Mid-Atlantic",   4,  9,  37400,  54,  73, 3.9],
  ["NJ", "New Jersey",      "Mid-Atlantic",   4, 10,  24600,  50,  76, 4.1],
  ["CT", "Connecticut",     "Northeast",      4, 11,  10700,  47,  70, 4.3],
  ["OR", "Oregon",          "West",           5,  1,  12400,  56,  52, 2.7],
  ["NV", "Nevada",          "West",           5,  2,   9100,  70,  29, 1.5],
  ["WY", "Wyoming",         "West",           5,  3,   1300,  71,  12, 0.8],
  ["SD", "South Dakota",    "Midwest",        5,  4,   2000,  60,  17, 1.2],
  ["IA", "Iowa",            "Midwest",        5,  5,   8400,  53,  35, 1.9],
  ["MO", "Missouri",        "Midwest",        5,  6,  17900,  64,  41, 2.3],
  ["KY", "Kentucky",        "Southeast",      5,  7,  13100,  74,  24, 1.6],
  ["WV", "West Virginia",   "Mid-Atlantic",   5,  8,   5600,  79,  15, 1.0],
  ["VA", "Virginia",        "Mid-Atlantic",   5,  9,  22800,  52,  63, 3.2],
  ["MD", "Maryland",        "Mid-Atlantic",   5, 10,  16400,  49,  78, 4.6],
  ["DE", "Delaware",        "Mid-Atlantic",   5, 11,   2700,  57,  44, 2.5],
  ["CA", "California",      "West",           6,  1, 104300,  58,  84, 4.4],
  ["UT", "Utah",            "West",           6,  2,   8700,  55,  46, 2.4],
  ["CO", "Colorado",        "West",           6,  3,  14900,  45,  69, 3.5],
  ["NE", "Nebraska",        "Midwest",        6,  4,   5100,  56,  33, 2.0],
  ["KS", "Kansas",          "Midwest",        6,  5,   7300,  61,  30, 1.8],
  ["AR", "Arkansas",        "Southeast",      6,  6,   8200,  77,  19, 1.2],
  ["TN", "Tennessee",       "Southeast",      6,  7,  19400,  70,  37, 2.1],
  ["NC", "North Carolina",  "Southeast",      6,  8,  27600,  65,  56, 2.9],
  ["SC", "South Carolina",  "Southeast",      6,  9,  13900,  72,  28, 1.7],
  ["DC", "District of Columbia", "Mid-Atlantic", 6, 10, 1400,  44,  81, 6.9],
  ["AZ", "Arizona",         "West",           7,  2,  20700,  63,  43, 2.2],
  ["NM", "New Mexico",      "West",           7,  3,   6100,  75,  20, 1.1],
  ["OK", "Oklahoma",        "Southeast",      7,  4,  10800,  76,  22, 1.3],
  ["LA", "Louisiana",       "Southeast",      7,  5,  12600,  78,  23, 1.4],
  ["MS", "Mississippi",     "Southeast",      7,  6,   7900,  84,  13, 0.9],
  ["AL", "Alabama",         "Southeast",      7,  7,  13400,  81,  18, 1.1],
  ["GA", "Georgia",         "Southeast",      7,  8,  28900,  68,  47, 2.4],
  ["HI", "Hawaii",          "West",           8,  1,   3100,  51,  34, 2.3],
  ["TX", "Texas",           "West",           8,  4,  78500,  71,  51, 2.0],
  ["FL", "Florida",         "Southeast",      8,  8,  61800,  66,  59, 3.1],
];

// Gap rates are derived from needIndex and specialist density so the map stays
// internally consistent: scarcer specialists push access and undertreatment
// gaps up, while measurement gaps track need more directly.
// Declared before GEOS because classifyQuadrant runs during its initialisation.
export const NEED_THRESHOLD = 60;
export const ENGAGEMENT_THRESHOLD = 50;

export function classifyQuadrant(needIndex, engagementIndex) {
  const highNeed = needIndex >= NEED_THRESHOLD;
  const highEngagement = engagementIndex >= ENGAGEMENT_THRESHOLD;
  if (highNeed && !highEngagement) return "education-gap";
  if (highNeed && highEngagement) return "evidence-gap";
  if (!highNeed && highEngagement) return "well-served";
  return "monitor";
}

function deriveGapRates(need, derm) {
  const scarcity = Math.max(0, Math.min(1, (4.0 - derm) / 3.4));
  const n = need / 100;
  const clampPct = (v) => Math.round(Math.max(4, Math.min(94, v)));
  return {
    "prolonged-tcs": clampPct(24 + n * 52 + scarcity * 14),
    "systemic-steroid-burden": clampPct(8 + n * 30 + scarcity * 12),
    "referral-delay": Math.round((2.6 + n * 9 + scarcity * 7) * 10) / 10,
    "t2-comorbidity": clampPct(14 + n * 30 + scarcity * 10),
    "severity-undocumented": clampPct(30 + n * 40 + scarcity * 16),
    "jak-first": clampPct(7 + n * 18 + scarcity * 6),
  };
}

export const GEOS = GEO_TUPLES.map(
  ([code, name, region, row, col, cohort, needIndex, engagementIndex, dermPer100k]) => {
    const gapRates = deriveGapRates(needIndex, dermPer100k);
    return {
      geoId: `US-${code}`,
      code,
      name,
      region,
      row,
      col,
      aggregationLevel: "state",
      cohort,
      suppressed: cohort < SUPPRESSION_THRESHOLD,
      needIndex,
      engagementIndex,
      dermPer100k,
      gapRates,
      quadrant: classifyQuadrant(needIndex, engagementIndex),
    };
  }
);

// === QUADRANT MODEL ===
// The delta between clinical need (RWD) and scientific engagement (MedVerse
// behavioural signals) is the Medical Affairs action list.
export const QUADRANTS = {
  "education-gap": {
    id: "education-gap",
    label: "Education gap",
    description: "High clinical need, low scientific engagement — deploy content, symposia and MSL scientific exchange",
    action: "Prioritise medical education and field scientific exchange",
    color: "#dc2626",
    severity: 1,
  },
  "evidence-gap": {
    id: "evidence-gap",
    label: "Evidence gap",
    description: "High need and high engagement, gap persists — clinicians are looking and the data is not answering them",
    action: "Route to publication planning and RWE study design",
    color: "#d97706",
    severity: 2,
  },
  "well-served": {
    id: "well-served",
    label: "Well served",
    description: "Need is being met with active scientific engagement — replicate this model elsewhere",
    action: "Maintain; study what is working",
    color: "#0f6e56",
    severity: 4,
  },
  monitor: {
    id: "monitor",
    label: "Monitor",
    description: "Lower measured need and lower engagement — no action indicated",
    action: "Monitor only",
    color: "#94a3b8",
    severity: 3,
  },
};

// === ROLLUPS ===
export function getRegionRollup(regionId) {
  const members = GEOS.filter((g) => g.region === regionId);
  if (!members.length) return null;
  const cohort = members.reduce((s, g) => s + g.cohort, 0);
  const wAvg = (fn) => Math.round(members.reduce((s, g) => s + fn(g) * g.cohort, 0) / cohort);
  const gapRates = {};
  CARE_GAPS.forEach((gap) => {
    const raw = members.reduce((s, g) => s + g.gapRates[gap.id] * g.cohort, 0) / cohort;
    gapRates[gap.id] = gap.unit === "mo" ? Math.round(raw * 10) / 10 : Math.round(raw);
  });
  const needIndex = wAvg((g) => g.needIndex);
  const engagementIndex = wAvg((g) => g.engagementIndex);
  return {
    geoId: `US-REGION-${regionId.toUpperCase().replace(/[^A-Z]/g, "")}`,
    region: regionId,
    aggregationLevel: "region",
    stateCount: members.length,
    cohort,
    needIndex,
    engagementIndex,
    dermPer100k: Math.round((members.reduce((s, g) => s + g.dermPer100k * g.cohort, 0) / cohort) * 10) / 10,
    gapRates,
    quadrant: classifyQuadrant(needIndex, engagementIndex),
    states: members.map((g) => g.code),
  };
}

export function getAllRegionRollups() {
  return REGIONS.map((r) => getRegionRollup(r.id)).filter(Boolean);
}

export function getNationalRate(gapId) {
  const gap = CARE_GAPS.find((g) => g.id === gapId);
  return gap ? gap.nationalRate : null;
}

export function getGapDelta(geo, gapId) {
  const national = getNationalRate(gapId);
  if (national === null) return null;
  const raw = geo.gapRates[gapId] - national;
  return Math.round(raw * 10) / 10;
}

// The two-map overlay. Map A is clinical need from RWD; Map B is scientific
// engagement rolled up from behavioural signals. Callers pass observed
// engagement keyed by region so the join never touches an HCP identifier.
export function buildOverlay(engagementByRegion) {
  return getAllRegionRollups().map((r) => {
    const observed = engagementByRegion && engagementByRegion[r.region];
    const engagementIndex = typeof observed === "number" ? observed : r.engagementIndex;
    return {
      ...r,
      engagementIndex,
      quadrant: classifyQuadrant(r.needIndex, engagementIndex),
      delta: r.needIndex - engagementIndex,
    };
  });
}

// === TOP GAPS ===
export function getTopGaps(geo, limit = 3) {
  return CARE_GAPS.map((gap) => ({
    gap,
    rate: geo.gapRates[gap.id],
    delta: getGapDelta(geo, gap.id),
  }))
    .sort((a, b) => {
      if (a.gap.safetyRelevant !== b.gap.safetyRelevant) return a.gap.safetyRelevant ? -1 : 1;
      return (b.delta || 0) - (a.delta || 0);
    })
    .slice(0, limit);
}

// === MEDICAL EVENT FOOTPRINT ===
// Advisory boards, symposia and congress sessions held in each region over the
// trailing 18 months. Compared against need to expose siting mismatch.
export const EVENT_FOOTPRINT = [
  { region: "Northeast", advisoryBoards: 6, symposia: 9, congressSessions: 14 },
  { region: "Mid-Atlantic", advisoryBoards: 4, symposia: 6, congressSessions: 8 },
  { region: "Midwest", advisoryBoards: 3, symposia: 5, congressSessions: 7 },
  { region: "West", advisoryBoards: 5, symposia: 7, congressSessions: 11 },
  { region: "Southeast", advisoryBoards: 0, symposia: 1, congressSessions: 2 },
];

export function getEventFootprint(regionId) {
  return EVENT_FOOTPRINT.find((e) => e.region === regionId) || null;
}

export function getEventGeographyAnalysis() {
  return getAllRegionRollups()
    .map((r) => {
      const f = getEventFootprint(r.region) || { advisoryBoards: 0, symposia: 0, congressSessions: 0 };
      const total = f.advisoryBoards + f.symposia + f.congressSessions;
      // Events per 10k cohort — the siting equity measure.
      const perCohort = Math.round((total / (r.cohort / 10000)) * 100) / 100;
      return {
        region: r.region,
        needIndex: r.needIndex,
        cohort: r.cohort,
        ...f,
        totalEvents: total,
        eventsPer10k: perCohort,
      };
    })
    .sort((a, b) => b.needIndex - a.needIndex);
}

// === ENGAGEMENT CANDIDATES ===
// HCPs an MSL may engage. NOTE: there is deliberately no patient-count field on
// these records. Selection is independently derivable from care-gap context,
// scientific profile and the HCP's own information-seeking behaviour on
// MedVerse — never from a patient-opportunity figure. Patient Services holds
// the patient-to-HCP linkage; that figure does not cross into this module.
export const ENGAGEMENT_CANDIDATES = [
  {
    id: "HCP-4821",
    name: "Dr. Sarah Chen",
    specialty: "Dermatology",
    institution: "Mount Sinai Dermatology",
    region: "Northeast",
    state: "NY",
    scientificProfile: "LIBERTY AD investigator, 24 AD publications, EADV faculty",
    regionalGapContext: "prolonged-tcs",
    informationSeeking: ["3 Med Info requests on biologic sequencing", "Reviewed AD escalation algorithm twice"],
    rationale:
      "Active investigator in a region where prolonged topical therapy runs above national rate; has independently sought sequencing evidence",
    suggestedTopic: "Advanced-therapy sequencing and comparative safety",
    engagementBasis: "Scientific — investigator profile plus documented information-seeking",
  },
  {
    id: "HCP-6377",
    name: "Dr. David Okonkwo",
    specialty: "Dermatology",
    institution: "University of Mississippi Medical Center",
    region: "Southeast",
    state: "MS",
    scientificProfile: "Regional AD referral lead, 6 publications on health-system access barriers",
    regionalGapContext: "referral-delay",
    informationSeeking: ["Queried teledermatology pathways", "Downloaded severity assessment toolkit"],
    rationale:
      "Practises in the highest-need, lowest-engagement geography in the country; publishes on the exact access barrier the RWD surfaces",
    suggestedTopic: "Referral pathways and practical severity assessment in specialist-scarce settings",
    engagementBasis: "Scientific — regional care-gap alignment plus published expertise",
  },
  {
    id: "HCP-3159",
    name: "Dr. James Patel",
    specialty: "Allergy & Immunology",
    institution: "Cleveland Clinic",
    region: "Midwest",
    state: "OH",
    scientificProfile: "Type 2 comorbidity researcher, 18 cross-TA publications",
    regionalGapContext: "t2-comorbidity",
    informationSeeking: ["Repeated cross-TA pathway queries", "Attended two Type 2 congress sessions"],
    rationale:
      "Cross-TA expertise matches an unrecognised comorbidity gap in his region; already engaging deeply with shared-pathway content",
    suggestedTopic: "Type 2 comorbidity screening across AD, asthma and EoE",
    engagementBasis: "Scientific — cross-TA research profile plus deep engagement signal",
  },
  {
    id: "HCP-7204",
    name: "Dr. Maria Gonzalez",
    specialty: "Pulmonology",
    institution: "Emory University",
    region: "Southeast",
    state: "GA",
    scientificProfile: "Severe asthma trial PI, 31 publications, ATS session chair",
    regionalGapContext: "systemic-steroid-burden",
    informationSeeking: ["Queried oral corticosteroid-sparing evidence", "Reviewed long-term safety module"],
    rationale:
      "Steroid-sparing expertise directly addresses the region's recurrent systemic corticosteroid safety signal",
    suggestedTopic: "Cumulative corticosteroid exposure and steroid-sparing strategies",
    engagementBasis: "Scientific — safety-gap alignment plus trial leadership",
  },
  {
    id: "HCP-5538",
    name: "Dr. Robert Kim",
    specialty: "Rheumatology",
    institution: "Northwestern Memorial",
    region: "Midwest",
    state: "IL",
    scientificProfile: "Advanced-therapy safety researcher, 14 publications on JAK class effects",
    regionalGapContext: "jak-first",
    informationSeeking: ["Compared JAK and biologic safety profiles", "Requested boxed-warning summary"],
    rationale:
      "Published on JAK class safety in a region showing above-average JAK-first initiation; actively comparing options",
    suggestedTopic: "Advanced-therapy sequencing and comparative class safety",
    engagementBasis: "Scientific — published class-safety expertise plus comparative information-seeking",
  },
  {
    id: "HCP-9012",
    name: "Dr. Emily Nakamura",
    specialty: "Gastroenterology",
    institution: "Mayo Clinic",
    region: "Midwest",
    state: "MN",
    scientificProfile: "EoE registry co-investigator, 11 publications",
    regionalGapContext: "t2-comorbidity",
    informationSeeking: ["EoE diagnostic criteria queries", "Cross-referenced AD comorbidity data"],
    rationale:
      "Registry experience relevant to the unrecognised EoE component of the comorbidity gap",
    suggestedTopic: "EoE recognition within the atopic march",
    engagementBasis: "Scientific — registry expertise plus diagnostic-criteria information-seeking",
  },
];

export function getCandidatesForRegion(regionId) {
  return ENGAGEMENT_CANDIDATES.filter((c) => c.region === regionId);
}

export function getCandidatesForGap(gapId) {
  return ENGAGEMENT_CANDIDATES.filter((c) => c.regionalGapContext === gapId);
}

// === DERIVED EDUCATION PRIORITIES ===
// Ranked education needs, derived from where gap deltas are widest in
// low-engagement geographies. This is the Medical output of the overlay.
export function getEducationPriorities(limit = 5) {
  const rollups = getAllRegionRollups();
  const rows = [];
  rollups.forEach((r) => {
    CARE_GAPS.forEach((gap) => {
      const national = gap.nationalRate;
      const delta = Math.round((r.gapRates[gap.id] - national) * 10) / 10;
      if (delta <= 0) return;
      // Weight by how underserved the region is scientifically.
      const engagementPenalty = (100 - r.engagementIndex) / 100;
      const relative = gap.unit === "mo" ? (delta / national) * 100 : delta;
      rows.push({
        region: r.region,
        gap,
        rate: r.gapRates[gap.id],
        national,
        delta,
        quadrant: r.quadrant,
        priorityScore: Math.round(relative * engagementPenalty * (gap.safetyRelevant ? 1.5 : 1) * 10) / 10,
      });
    });
  });
  return rows.sort((a, b) => b.priorityScore - a.priorityScore).slice(0, limit);
}

// === NATIONAL SUMMARY ===
export function getNationalSummary() {
  const cohort = GEOS.reduce((s, g) => s + g.cohort, 0);
  const counts = { "education-gap": 0, "evidence-gap": 0, "well-served": 0, monitor: 0 };
  GEOS.forEach((g) => { counts[g.quadrant] += 1; });
  const cohortInGap = GEOS
    .filter((g) => g.quadrant === "education-gap" || g.quadrant === "evidence-gap")
    .reduce((s, g) => s + g.cohort, 0);
  return {
    totalCohort: cohort,
    stateCount: GEOS.length,
    quadrantCounts: counts,
    cohortInGap,
    cohortInGapPct: Math.round((cohortInGap / cohort) * 100),
    aggregationFloor: AGGREGATION_FLOOR,
    suppressionThreshold: SUPPRESSION_THRESHOLD,
  };
}
