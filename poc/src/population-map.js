// Shared tile-map heat map for Population Intelligence — clinical need vs.
// scientific engagement, at state level. Extracted so Medical Concierge and
// MSL Copilot can embed the same visualization used on population.html
// without duplicating the tile/legend rendering logic.
import { GEOS, QUADRANTS } from "./population-data.js";

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

/**
 * Mounts an interactive need/engagement/quadrant tile map into the given
 * container element ids. `toggleId` and `subId` are optional — omit them for
 * a single fixed metric (pass `metric: "need" | "engagement" | "quadrant"`).
 */
export function mountTileMap({ tileMapId, legendId, toggleId, subId, metric = "need", onSelect }) {
  const tileMapEl = document.getElementById(tileMapId);
  const legendEl = document.getElementById(legendId);
  if (!tileMapEl || !legendEl) return null;

  let activeMetric = metric;
  let selectedGeo = null;

  function tileColor(geo) {
    if (activeMetric === "need") return rampColor(geo.needIndex, "need");
    if (activeMetric === "engagement") return rampColor(geo.engagementIndex, "engagement");
    return QUADRANTS[geo.quadrant].color;
  }

  function renderLegend() {
    if (activeMetric === "quadrant") {
      legendEl.innerHTML = Object.values(QUADRANTS)
        .sort((a, b) => a.severity - b.severity)
        .map(q => `<div class="legend-item"><span class="legend-swatch" style="background:${q.color}"></span>${esc(q.label)}</div>`)
        .join("");
      return;
    }
    const scale = activeMetric === "engagement" ? "engagement" : "need";
    const label = activeMetric === "engagement" ? "Scientific engagement index" : "Clinical need index";
    const stops = [10, 30, 50, 70, 90].map(v => rampColor(v, scale));
    legendEl.innerHTML = `<div class="legend-scale">
        <span>Low</span>
        <span class="legend-bar" style="background:linear-gradient(90deg,${stops.join(",")})"></span>
        <span>High</span>
      </div>
      <div class="legend-item" style="margin-left:6px;">${esc(label)} · 0–100</div>`;
  }

  function renderMap() {
    tileMapEl.innerHTML = GEOS.map(g => {
      const sel = selectedGeo && selectedGeo.code === g.code;
      const title = `${g.name} — need ${g.needIndex}, engagement ${g.engagementIndex}, ${QUADRANTS[g.quadrant].label}`;
      return `<div class="tile${sel ? " selected" : ""}"
        data-code="${esc(g.code)}"
        style="grid-row:${g.row};grid-column:${g.col};background:${tileColor(g)};"
        title="${esc(title)}">${esc(g.code)}</div>`;
    }).join("");

    tileMapEl.querySelectorAll(".tile[data-code]").forEach(el => {
      el.addEventListener("click", () => {
        const code = el.dataset.code;
        selectedGeo = selectedGeo && selectedGeo.code === code ? null : GEOS.find(g => g.code === code);
        renderMap();
        if (onSelect) onSelect(selectedGeo);
      });
    });
    renderLegend();
  }

  if (toggleId) {
    const toggleEl = document.getElementById(toggleId);
    if (toggleEl) {
      toggleEl.querySelectorAll(".metric-btn[data-metric]").forEach(btn => {
        btn.addEventListener("click", () => {
          activeMetric = btn.dataset.metric;
          toggleEl.querySelectorAll(".metric-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          if (subId) {
            const subs = {
              need: "Map A is clinical need from deidentified RWD — care gaps, diagnostic delay, undertreatment and guideline non-adherence, aggregated to state level.",
              engagement: "Map B is scientific engagement rolled up from MedVerse behavioural signals — content consumption, Med Info inquiries and congress activity, joined at region level only.",
              quadrant: "The delta. High need with low engagement is an education gap. High need with high engagement means the evidence is not answering the question being asked.",
            };
            const subEl = document.getElementById(subId);
            if (subEl) subEl.textContent = subs[activeMetric];
          }
          renderMap();
        });
      });
    }
  }

  renderMap();
  return { getSelected: () => selectedGeo };
}
