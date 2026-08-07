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
