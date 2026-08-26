const STORAGE_KEY = "medverse_orion_signals";
const CHANNEL_KEY = "medverse_orion_latest";

let signalCounter = Date.now();

function makeTimestamp() {
  const now = new Date();
  return now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0") + "T" +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");
}

const HCP_POOL = [
  { id: "HCP-4821", name: "Dr. Sarah Chen" },
  { id: "HCP-3159", name: "Dr. James Patel" },
  { id: "HCP-7204", name: "Dr. Maria Gonzalez" },
  { id: "HCP-5538", name: "Dr. Robert Kim" },
  { id: "HCP-9012", name: "Dr. Emily Nakamura" },
  { id: "HCP-6377", name: "Dr. David Okonkwo" },
];

function pickHcp(diseaseArea) {
  const map = {
    "Atopic Dermatitis": ["HCP-4821", "HCP-6377"],
    "Rheumatoid Arthritis": ["HCP-3159"],
    "Severe Asthma": ["HCP-7204"],
    "COPD": ["HCP-7204"],
    "Cross-TA Immunology": ["HCP-5538"],
    "EoE": ["HCP-9012"],
    "GI / Dermatology": ["HCP-9012"],
  };
  const candidates = map[diseaseArea] || HCP_POOL.map(h => h.id);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function broadcastSignal(partialSignal) {
  signalCounter++;
  const signal = {
    id: `SIG-X-${signalCounter}`,
    hcpId: partialSignal.hcpId || pickHcp(partialSignal.diseaseArea),
    timestamp: makeTimestamp(),
    topic: partialSignal.topic || "MedVerse interaction",
    intent: partialSignal.intent || "Clinical decision support",
    diseaseArea: partialSignal.diseaseArea || "General",
    stage: partialSignal.stage || "Information review",
    depth: partialSignal.depth || "Moderate engagement",
    orionAction: partialSignal.orionAction || "Queue for MSL follow-up — cross-module activity detected",
    queries: partialSignal.queries || [partialSignal.topic || "User query"],
    contentAccessed: partialSignal.contentAccessed || ["MedVerse Content"],
    sessionDuration: partialSignal.sessionDuration || Math.floor(Math.random() * 10) + 3,
    _source: partialSignal._source || "unknown",
    _crossModule: true,
  };

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push(signal);
    if (existing.length > 200) existing.splice(0, existing.length - 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    localStorage.setItem(CHANNEL_KEY, JSON.stringify(signal));
  } catch (e) { /* quota exceeded — ignore */ }

  return signal;
}

// === POPULATION SIGNALS ===
// A second signal class for deidentified aggregate real-world data. These are
// keyed on geoId and deliberately carry NO hcpId field: broadcastSignal above
// invents an HCP via pickHcp() when one is absent, which would silently attach
// a named prescriber to a patient cohort. Population signals must never do
// that, so they do not travel through it.
//
// Aggregation floor is enforced here, not in the caller. Anything below
// MIN_CELL_SIZE is reported as suppressed with its value withheld.
const POP_STORAGE_KEY = "medverse_population_signals";
const POP_CHANNEL_KEY = "medverse_population_latest";
const MIN_CELL_SIZE = 11;
const ALLOWED_LEVELS = ["state", "region", "national"];

let popCounter = Date.now();

export function broadcastPopulationSignal(partial) {
  popCounter++;

  const level = ALLOWED_LEVELS.includes(partial.aggregationLevel)
    ? partial.aggregationLevel
    : "region";
  const cohortSize = typeof partial.cohortSize === "number" ? partial.cohortSize : null;
  const suppressed = cohortSize !== null && cohortSize < MIN_CELL_SIZE;

  const signal = {
    id: `POP-${popCounter}`,
    geoId: partial.geoId || "US-NATIONAL",
    geoName: partial.geoName || partial.geoId || "United States",
    aggregationLevel: level,
    // Withheld rather than rounded when the cell is too small to report.
    cohortSize: suppressed ? null : cohortSize,
    suppressed,
    timestamp: makeTimestamp(),
    gapId: partial.gapId || null,
    gapName: partial.gapName || "Population signal",
    gapRate: suppressed ? null : (partial.gapRate ?? null),
    nationalRate: partial.nationalRate ?? null,
    nationalDelta: suppressed ? null : (partial.nationalDelta ?? null),
    needIndex: partial.needIndex ?? null,
    engagementIndex: partial.engagementIndex ?? null,
    quadrant: partial.quadrant || null,
    // Follows the orionAction string-prefix convention used by the HCP signal
    // class so the MSL queue picks these up: EDUCATION GAP / EVIDENCE GAP /
    // ACCESS GAP / SAFETY SIGNAL / EVENT PLANNING.
    medicalAction: partial.medicalAction || "Log population insight — aggregate review",
    educationNeed: partial.educationNeed || null,
    dataSource: partial.dataSource || "Licensed deidentified RWD (claims + EHR)",
    _patientLevel: false,
    _hcpLinked: false,
    _aggregationFloor: level,
    _source: partial._source || "Population Intelligence",
    _crossModule: true,
  };

  try {
    const existing = JSON.parse(localStorage.getItem(POP_STORAGE_KEY) || "[]");
    existing.push(signal);
    if (existing.length > 200) existing.splice(0, existing.length - 200);
    localStorage.setItem(POP_STORAGE_KEY, JSON.stringify(existing));
    localStorage.setItem(POP_CHANNEL_KEY, JSON.stringify(signal));
  } catch (e) { /* quota exceeded — ignore */ }

  return signal;
}

export function loadStoredPopulationSignals() {
  try {
    return JSON.parse(localStorage.getItem(POP_STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function clearStoredPopulationSignals() {
  localStorage.removeItem(POP_STORAGE_KEY);
  localStorage.removeItem(POP_CHANNEL_KEY);
}

export function onPopulationSignalReceived(callback) {
  window.addEventListener("storage", (e) => {
    if (e.key === POP_CHANNEL_KEY && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch { /* bad JSON */ }
    }
  });
}

// Rolls HCP-level behavioural signals up to region so the population overlay
// can join on geography. This is the only sanctioned path between the two
// signal classes, and it discards hcpId in the process.
export function rollUpEngagementByRegion(signals, hcpRegionLookup) {
  const buckets = {};
  (signals || []).forEach((s) => {
    const region = hcpRegionLookup && hcpRegionLookup[s.hcpId];
    if (!region) return;
    if (!buckets[region]) buckets[region] = { total: 0, count: 0 };
    const depth = /Deep|High-value/.test(s.depth || "") ? 3 : /Moderate/.test(s.depth || "") ? 2 : 1;
    buckets[region].total += depth * (s.sessionDuration || 1);
    buckets[region].count += 1;
  });
  const out = {};
  Object.keys(buckets).forEach((region) => {
    const b = buckets[region];
    // Normalise to a 0-100 engagement index.
    out[region] = Math.min(100, Math.round((b.total / b.count) * 2.2));
  });
  return out;
}

export function loadStoredSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function clearStoredSignals() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CHANNEL_KEY);
}

export function onSignalReceived(callback) {
  window.addEventListener("storage", (e) => {
    if (e.key === CHANNEL_KEY && e.newValue) {
      try {
        const signal = JSON.parse(e.newValue);
        callback(signal);
      } catch { /* bad JSON */ }
    }
  });
}
