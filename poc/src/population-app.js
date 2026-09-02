import {
  GEOS, REGIONS, CARE_GAPS, QUADRANTS, NEED_THRESHOLD, ENGAGEMENT_THRESHOLD,
  ENGAGEMENT_CANDIDATES, getNationalSummary, getRegionRollup, getAllRegionRollups,
  getTopGaps, getGapDelta, getEducationPriorities, getEventGeographyAnalysis,
  getCandidatesForRegion,
} from "./population-data.js";
import { broadcastPopulationSignal } from "./orion-bridge.js";
import { speakAndWait, stopSpeaking, showControls, hideControls } from "./narrator.js";

let activeMetric = "need";
let selectedGeo = null;
let quadrantFilter = null;

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

// Sequential purple ramp for need, teal for engagement — kept distinct so the
// two maps never read as the same scale.
function rampColor(value, scale) {
  const t = Math.max(0, Math.min(1, value / 100));
  if (scale === "engagement") {
    const stops = ["#e1f5ee", "#a7ddc9", "#5cbb9c", "#219873", "#0f6e56"];
    return stops[Math.min(stops.length - 1, Math.floor(t * stops.length))];
  }
  const stops = ["#f0e6ff", "#d7b3f5", "#b366e8", "#8f1fd6", "#5c0aa0"];
  return stops[Math.min(stops.length - 1, Math.floor(t * stops.length))];
}

function tileColor(geo) {
  if (activeMetric === "need") return rampColor(geo.needIndex, "need");
  if (activeMetric === "engagement") return rampColor(geo.engagementIndex, "engagement");
  return QUADRANTS[geo.quadrant].color;
}

// === STATS ===
function renderStats() {
  const s = getNationalSummary();
  const eduGap = s.quadrantCounts["education-gap"];
  const evGap = s.quadrantCounts["evidence-gap"];
  const tiles = [
    { num: s.totalCohort.toLocaleString(), label: "Deidentified cohort", cls: "" },
    { num: s.stateCount, label: "Geographies", cls: "" },
    { num: eduGap, label: "Education-gap states", cls: "stat-danger" },
    { num: evGap, label: "Evidence-gap states", cls: "stat-warn" },
    { num: s.cohortInGapPct + "%", label: "Cohort in a gap", cls: "stat-warn" },
  ];
  document.getElementById("stats-grid").innerHTML = tiles.map(t => `
    <div class="stat-card ${t.cls}">
      <div class="stat-card-num">${esc(t.num)}</div>
      <div class="stat-card-label">${esc(t.label)}</div>
    </div>`).join("");
}

// === TILE MAP ===
function renderMap() {
  const html = GEOS.map(g => {
    const dim = quadrantFilter && g.quadrant !== quadrantFilter;
    const sel = selectedGeo && selectedGeo.code === g.code;
    const val = activeMetric === "engagement" ? g.engagementIndex : g.needIndex;
    const title = `${g.name} — need ${g.needIndex}, engagement ${g.engagementIndex}, ${QUADRANTS[g.quadrant].label}`;
    return `<div class="tile${dim ? " dim" : ""}${sel ? " selected" : ""}"
      data-code="${esc(g.code)}"
      style="grid-row:${g.row};grid-column:${g.col};background:${tileColor(g)};"
      title="${esc(title)}">${esc(g.code)}</div>`;
  }).join("");
  document.getElementById("tile-map").innerHTML = html;

  document.querySelectorAll(".tile[data-code]").forEach(el => {
    el.addEventListener("click", () => {
      const code = el.dataset.code;
      selectedGeo = selectedGeo && selectedGeo.code === code
        ? null
        : GEOS.find(g => g.code === code);
      renderMap();
      renderDetail();
      if (selectedGeo) emitGeoSignal(selectedGeo);
    });
  });
  renderLegend();
}

function renderLegend() {
  const el = document.getElementById("map-legend");
  if (activeMetric === "quadrant") {
    el.innerHTML = Object.values(QUADRANTS)
      .sort((a, b) => a.severity - b.severity)
      .map(q => `<div class="legend-item">
        <span class="legend-swatch" style="background:${q.color}"></span>${esc(q.label)}
      </div>`).join("");
    return;
  }
  const scale = activeMetric === "engagement" ? "engagement" : "need";
  const label = activeMetric === "engagement" ? "Scientific engagement index" : "Clinical need index";
  const stops = [10, 30, 50, 70, 90].map(v => rampColor(v, scale));
  el.innerHTML = `<div class="legend-scale">
      <span>Low</span>
      <span class="legend-bar" style="background:linear-gradient(90deg,${stops.join(",")})"></span>
      <span>High</span>
    </div>
    <div class="legend-item" style="margin-left:6px;">${esc(label)} · 0–100</div>`;
}

// === DETAIL PANEL ===
function renderDetail() {
  const el = document.getElementById("detail-panel");
  if (!selectedGeo) {
    el.innerHTML = `<div class="detail-card"><div class="detail-empty">
      <i class="ti ti-hand-click" style="font-size:26px;display:block;margin-bottom:8px;opacity:0.5;"></i>
      Select a geography to see its care-gap profile.<br>
      Detail is reported at state level — the aggregation floor.
    </div></div>`;
    return;
  }
  const g = selectedGeo;
  const q = QUADRANTS[g.quadrant];
  const gaps = CARE_GAPS.map(gap => {
    const rate = g.gapRates[gap.id];
    const delta = getGapDelta(g, gap.id);
    const dCls = delta > 0 ? "up" : "down";
    const dTxt = (delta > 0 ? "+" : "") + delta + (gap.unit === "mo" ? "mo" : "pp");
    return `<div class="gap-row">
      <span class="gap-name">${esc(gap.shortName)}
        ${gap.safetyRelevant ? '<span class="safety-pill">SAFETY</span>' : ""}</span>
      <span class="gap-val">${rate}${gap.unit === "mo" ? " mo" : "%"}</span>
      <span class="gap-delta ${dCls}">${esc(dTxt)}</span>
    </div>`;
  }).join("");

  const cands = getCandidatesForRegion(g.region);
  el.innerHTML = `<div class="detail-card">
    <div class="detail-name">${esc(g.name)}</div>
    <div class="detail-region">${esc(g.region)} region · ${esc(g.geoId)}</div>
    <div class="detail-quadrant" style="background:${q.color}">
      <i class="ti ti-target"></i> ${esc(q.label)}
    </div>
    <div class="detail-metrics">
      <div class="dm"><div class="dm-num">${g.needIndex}</div><div class="dm-label">Need index</div></div>
      <div class="dm"><div class="dm-num">${g.engagementIndex}</div><div class="dm-label">Engagement</div></div>
      <div class="dm"><div class="dm-num">${g.cohort.toLocaleString()}</div><div class="dm-label">Cohort (aggregate)</div></div>
      <div class="dm"><div class="dm-num">${g.dermPer100k}</div><div class="dm-label">Derm / 100k</div></div>
    </div>
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:var(--text-muted);margin-bottom:2px;">Care gaps</div>
    ${gaps}
    <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.5;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
      <strong>Recommended:</strong> ${esc(q.action)}
    </div>
    ${cands.length ? `<div style="font-size:11px;color:var(--text-muted);margin-top:10px;">
      <i class="ti ti-users"></i> ${cands.length} scientific engagement candidate${cands.length > 1 ? "s" : ""} in ${esc(g.region)}
    </div>` : ""}
  </div>`;
}

// === QUADRANT MATRIX ===
function renderQuadrants() {
  const s = getNationalSummary();
  const c = s.quadrantCounts;
  const cell = (id) => {
    const q = QUADRANTS[id];
    const active = quadrantFilter === id;
    return `<div class="quad-cell" data-quad="${id}"
      style="background:${q.color}1a;border-color:${active ? q.color : "var(--border)"};${active ? `box-shadow:0 0 0 2px ${q.color}` : ""}">
      <div class="quad-cell-label" style="color:${q.color}">${esc(q.label)}</div>
      <div class="quad-cell-count" style="color:${q.color}">${c[id]}</div>
      <div class="quad-cell-desc">${esc(q.description)}</div>
    </div>`;
  };
  document.getElementById("quad-matrix").innerHTML = `
    <div></div>
    <div class="quad-axis">Low engagement (&lt;${ENGAGEMENT_THRESHOLD})</div>
    <div class="quad-axis">High engagement (≥${ENGAGEMENT_THRESHOLD})</div>
    <div class="quad-axis v">High need (≥${NEED_THRESHOLD})</div>
    ${cell("education-gap")}
    ${cell("evidence-gap")}
    <div class="quad-axis v">Low need</div>
    ${cell("monitor")}
    ${cell("well-served")}
  `;
  document.querySelectorAll(".quad-cell[data-quad]").forEach(el => {
    el.addEventListener("click", () => {
      quadrantFilter = quadrantFilter === el.dataset.quad ? null : el.dataset.quad;
      renderQuadrants();
      renderMap();
    });
  });
}

// === EDUCATION PRIORITIES ===
function renderEducation() {
  const rows = getEducationPriorities(6);
  const max = rows.length ? rows[0].priorityScore : 1;
  document.getElementById("edu-body").innerHTML = rows.map(r => `
    <tr>
      <td><strong>${esc(r.region)}</strong></td>
      <td>${esc(r.gap.shortName)} ${r.gap.safetyRelevant ? '<span class="safety-pill">SAFETY</span>' : ""}</td>
      <td>${r.rate}${r.gap.unit === "mo" ? " mo" : "%"}</td>
      <td><span class="badge badge-danger">+${r.delta}${r.gap.unit === "mo" ? "mo" : "pp"}</span></td>
      <td><div class="bar-wrap">
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round((r.priorityScore / max) * 100)}%;background:var(--accent)"></div></div>
        <span style="font-size:11px;font-weight:700;">${r.priorityScore}</span>
      </div></td>
    </tr>`).join("");
}

// === EVENT GEOGRAPHY ===
function renderEvents() {
  const rows = getEventGeographyAnalysis();
  const max = Math.max(...rows.map(r => r.eventsPer10k));
  document.getElementById("event-body").innerHTML = rows.map(r => {
    const under = r.eventsPer10k < max / 3;
    return `<tr>
      <td><strong>${esc(r.region)}</strong></td>
      <td>${r.needIndex}</td>
      <td>${r.totalEvents}</td>
      <td><div class="bar-wrap">
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round((r.eventsPer10k / max) * 100)}%;background:${under ? "var(--danger)" : "var(--success)"}"></div></div>
        <span style="font-size:11px;font-weight:700;">${r.eventsPer10k}</span>
      </div></td>
      <td>${under ? '<span class="badge badge-danger">Under-sited</span>' : ""}</td>
    </tr>`;
  }).join("");
}

// === CARE GAP REFERENCE ===
function renderGapTable() {
  document.getElementById("gap-body").innerHTML = CARE_GAPS.map(g => {
    const typeCls = g.gapType === "safety" ? "badge-danger"
      : g.gapType === "access" ? "badge-warn"
      : g.gapType === "diagnostic" ? "badge-info" : "badge-accent";
    return `<tr>
      <td><strong>${esc(g.name)}</strong></td>
      <td><span class="badge ${typeCls}">${esc(g.gapType)}</span></td>
      <td>${g.nationalRate}${g.unit === "mo" ? " mo" : "%"}</td>
      <td style="color:var(--text-secondary);font-size:11.5px;">${esc(g.definition)}</td>
      <td style="font-size:11.5px;">${esc(g.educationNeed)}</td>
    </tr>`;
  }).join("");
}

// === CANDIDATES ===
function renderCandidates() {
  document.getElementById("cand-grid").innerHTML = ENGAGEMENT_CANDIDATES.map(c => {
    const gap = CARE_GAPS.find(g => g.id === c.regionalGapContext);
    const initials = c.name.replace(/^Dr\.\s*/, "").split(/\s+/).map(w => w[0]).join("").slice(0, 2);
    return `<div class="cand-card">
      <div class="cand-top">
        <div class="cand-av">${esc(initials)}</div>
        <div style="flex:1;">
          <div class="cand-name">${esc(c.name)}</div>
          <div class="cand-meta">${esc(c.specialty)} · ${esc(c.institution)}</div>
          <div class="cand-meta">${esc(c.region)} · ${esc(c.state)}</div>
        </div>
      </div>
      <div class="cand-line"><strong>Scientific profile:</strong> ${esc(c.scientificProfile)}</div>
      <div class="cand-line"><strong>Regional gap:</strong> ${esc(gap ? gap.name : c.regionalGapContext)}</div>
      <div class="cand-line"><strong>Information-seeking:</strong> ${c.informationSeeking.map(esc).join("; ")}</div>
      <div class="cand-line"><strong>Suggested topic:</strong> ${esc(c.suggestedTopic)}</div>
      <div class="cand-nocount"><i class="ti ti-shield-check"></i> Patient count withheld by Commercial Firewall</div>
      <div class="cand-basis"><i class="ti ti-microscope"></i> ${esc(c.engagementBasis)}</div>
    </div>`;
  }).join("");
}

// === ORION SIGNAL EMISSION ===
function emitGeoSignal(geo) {
  const top = getTopGaps(geo, 1)[0];
  if (!top) return;
  const q = QUADRANTS[geo.quadrant];
  const prefix = top.gap.safetyRelevant ? "SAFETY SIGNAL"
    : geo.quadrant === "education-gap" ? "EDUCATION GAP"
    : geo.quadrant === "evidence-gap" ? "EVIDENCE GAP" : "FIELD INSIGHT";
  broadcastPopulationSignal({
    geoId: geo.geoId,
    geoName: geo.name,
    aggregationLevel: "state",
    cohortSize: geo.cohort,
    gapId: top.gap.id,
    gapName: top.gap.name,
    gapRate: top.rate,
    nationalRate: top.gap.nationalRate,
    nationalDelta: top.delta,
    needIndex: geo.needIndex,
    engagementIndex: geo.engagementIndex,
    quadrant: geo.quadrant,
    medicalAction: `${prefix}: ${geo.name} — ${top.gap.shortName} at ${top.rate}${top.gap.unit === "mo" ? "mo" : "%"} vs ${top.gap.nationalRate}${top.gap.unit === "mo" ? "mo" : "%"} national. ${q.action}.`,
    educationNeed: top.gap.educationNeed,
    _source: "Population Intelligence",
  });
  if (window.mvToast) {
    window.mvToast(`Population signal incorporated into medical insights and analytics — ${geo.name}`, "info");
  }
}

// === METRIC TOGGLE ===
function bindMetricToggle() {
  document.querySelectorAll(".metric-btn[data-metric]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeMetric = btn.dataset.metric;
      document.querySelectorAll(".metric-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const subs = {
        need: "Map A is clinical need from deidentified RWD — care gaps, diagnostic delay, undertreatment and guideline non-adherence, aggregated to state level.",
        engagement: "Map B is scientific engagement rolled up from MedVerse behavioural signals — content consumption, Med Info inquiries and congress activity, joined at region level only.",
        quadrant: "The delta. High need with low engagement is an education gap. High need with high engagement means the evidence is not answering the question being asked.",
      };
      document.getElementById("map-sub").textContent = subs[activeMetric];
      renderMap();
    });
  });
}

// === DEMO ===
async function runDemo() {
  const btn = document.getElementById("demo-play-btn");
  btn.disabled = true;
  showControls();
  try {
    await speakAndWait("Population Intelligence brings deidentified real-world evidence into MedVerse. Let's start with clinical need.");

    document.querySelector('[data-metric="need"]').click();
    await speakAndWait("Map A shows where the clinical need is. Nine hundred and eleven thousand patients in the deidentified moderate-to-severe cohort, mapped to state level. The Southeast and Appalachia carry the highest burden.");

    const ms = GEOS.find(g => g.code === "MS");
    selectedGeo = ms;
    renderMap();
    renderDetail();
    await speakAndWait("Mississippi is the clearest case. Need index eighty-four. Eighty percent of the moderate-to-severe cohort remains on prolonged topical therapy — thirty-nine points above the national rate. Under one dermatologist per hundred thousand people.");

    await speakAndWait("Notice what is not here. There is no patient count attached to any named physician. Patient Services holds that linkage. The Commercial Firewall withholds it, because a patient opportunity figure cannot be the trigger for a medical engagement.");

    document.querySelector('[data-metric="engagement"]').click();
    await speakAndWait("Map B is the half only MedVerse has — scientific engagement. Content consumption, medical information inquiries, congress activity. Mississippi scores thirteen out of one hundred.");

    document.querySelector('[data-metric="quadrant"]').click();
    await speakAndWait("Overlay the two and the delta appears. Twenty-two states sit in the education gap quadrant — high clinical need, low scientific engagement. That is the Medical Affairs action list.");

    await speakAndWait("Four states show high need and high engagement. Those clinicians are looking and the gap persists anyway. That is not an education problem, it is an evidence problem — it routes to publication planning and real-world evidence study design.");

    document.getElementById("event-body").scrollIntoView({ behavior: "smooth", block: "center" });
    await speakAndWait("The event geography makes the mismatch concrete. The Southeast carries the highest need in the country and has hosted three medical events in eighteen months. The Northeast, with lower need, hosted twenty-nine. Point one four events per ten thousand patients versus two point nine — a twenty-fold difference in siting.");

    document.getElementById("cand-grid").scrollIntoView({ behavior: "smooth", block: "center" });
    await speakAndWait("Engagement candidates are ranked from care-gap context, scientific profile, and the clinician's own information-seeking. Doctor Okonkwo publishes on health-system access barriers and practises in the highest-need geography. That selection is independently derivable — it needs no patient count, which is exactly what makes it defensible.");

    await speakAndWait("Real-world data tells us where the clinical need is. MedVerse tells us where the scientific engagement is. The gap between those two maps is what Medical Affairs is uniquely positioned to close.");
  } finally {
    stopSpeaking();
    hideControls();
    btn.disabled = false;
  }
}

// === INIT ===
function init() {
  renderStats();
  renderMap();
  renderDetail();
  renderQuadrants();
  renderEducation();
  renderEvents();
  renderGapTable();
  renderCandidates();
  bindMetricToggle();
  document.getElementById("demo-play-btn").addEventListener("click", runDemo);
}

init();

if (window.location.hash === "#autoplay") {
  setTimeout(runDemo, 800);
}
