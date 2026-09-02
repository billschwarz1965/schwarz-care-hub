// Shared Care Gap Analyzer rendering — decomposes a region's aggregate burden
// into the guideline-anchored care-gap taxonomy (population-data.js CARE_GAPS),
// ranked by safety relevance then delta vs. national rate. Used by Medical
// Concierge (poc) and the standalone Care Gap Analyzer module (poc-internal).
import { CARE_GAPS, getRegionRollup, getGapDelta } from "./population-data.js";
import { broadcastPopulationSignal } from "./orion-bridge.js";

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

export function renderCareGapAnalysis(region, resultsEl, source) {
  if (!resultsEl) return;
  const r = getRegionRollup(region);
  if (!r) {
    resultsEl.innerHTML = '<div class="result-empty"><i class="ti ti-stethoscope"></i>No aggregate data for that region.</div>';
    return;
  }

  const ranked = CARE_GAPS
    .map(gap => ({ gap, rate: r.gapRates[gap.id], delta: getGapDelta(r, gap.id) }))
    .sort((a, b) => {
      if (a.gap.safetyRelevant !== b.gap.safetyRelevant) return a.gap.safetyRelevant ? -1 : 1;
      return b.delta - a.delta;
    });

  const safetyCount = ranked.filter(x => x.gap.safetyRelevant).length;
  const top = ranked[0];

  const rows = ranked.map(({ gap, rate, delta }) => {
    const unit = gap.unit === "mo" ? " mo" : "%";
    const dTxt = (delta > 0 ? "+" : "") + delta + (gap.unit === "mo" ? "mo" : "pp");
    return `<tr>
      <td><strong>${esc(gap.name)}</strong>${gap.safetyRelevant ? ' <span style="font-size:9.5px;font-weight:700;padding:2px 6px;border-radius:4px;background:var(--danger-bg);color:var(--danger);">SAFETY</span>' : ""}
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${esc(gap.guideline)}</div></td>
      <td>${rate}${unit}</td>
      <td style="color:var(--text-muted);">${gap.nationalRate}${unit}</td>
      <td style="color:${delta > 0 ? "var(--danger)" : "var(--success)"};font-weight:700;">${esc(dTxt)}</td>
      <td style="text-transform:capitalize;">${esc(gap.gapType)}</td>
      <td style="font-size:11.5px;">${esc(gap.educationNeed)}</td>
    </tr>`;
  }).join("");

  resultsEl.innerHTML = `
    <div class="result-card" style="border-left:3px solid var(--accent);">
      <h4><i class="ti ti-stethoscope"></i> ${ranked.length} guideline-anchored gaps — ${esc(region)} (${r.stateCount} states, ${r.cohort.toLocaleString()} cohort)</h4>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">Ranked by safety relevance, then by delta vs. national rate. Every gap is anchored to a guideline or a safety concern — none is defined by treatment opportunity.</p>
      <table class="data-table"><thead><tr>
        <th>Gap</th><th>Rate</th><th>National</th><th>Delta</th><th>Type</th><th>Education need</th>
      </tr></thead><tbody>${rows}</tbody></table>
    </div>
    <div class="result-card">
      <h4><i class="ti ti-arrow-ramp-right"></i> Reading the pattern</h4>
      <div style="font-size:12.5px;line-height:1.75;color:var(--text-secondary);">
        <strong style="color:var(--text);">${esc(top.gap.name)}</strong> is the largest gap versus national, at ${top.rate}${top.gap.unit === "mo" ? "mo" : "%"}
        (${(top.delta > 0 ? "+" : "") + top.delta}${top.gap.unit === "mo" ? "mo" : "pp"} vs. national). ${esc(top.gap.medicalImplication)}.<br><br>
        <strong style="color:var(--text);">${safetyCount} of ${ranked.length} gaps are safety-relevant</strong> — cumulative exposure or sequencing concerns rather than efficacy framing. These are the least contestable as medical activity.<br><br>
        Route education needs to Medical Education and Scientific Communications; route any gap with high need <em>and</em> high engagement to Publication Planner for real-world evidence study scoping instead — the evidence base, not the audience, is what's missing there.
      </div>
    </div>`;

  broadcastPopulationSignal({
    geoId: r.geoId,
    geoName: region,
    aggregationLevel: "region",
    cohortSize: r.cohort,
    gapId: top.gap.id,
    gapName: top.gap.name,
    gapRate: top.rate,
    nationalRate: top.gap.nationalRate,
    nationalDelta: top.delta,
    needIndex: r.needIndex,
    engagementIndex: r.engagementIndex,
    quadrant: r.quadrant,
    medicalAction: `CARE GAP ANALYSIS: ${region} — ${top.gap.shortName} at ${top.rate}${top.gap.unit === "mo" ? "mo" : "%"} vs ${top.gap.nationalRate}${top.gap.unit === "mo" ? "mo" : "%"} national. ${safetyCount} safety-relevant gap(s). Education need: ${top.gap.educationNeed}.`,
    educationNeed: top.gap.educationNeed,
    _source: source || "Care Gap Analyzer",
  });
}

/** Wires a region <select> + submit button to render results into a container. */
export function mountCareGapAnalyzer({ regionSelectId, submitId, resultsId, source }) {
  const submitEl = document.getElementById(submitId);
  const regionEl = document.getElementById(regionSelectId);
  const resultsEl = document.getElementById(resultsId);
  if (!submitEl || !regionEl || !resultsEl) return;
  submitEl.addEventListener("click", () => renderCareGapAnalysis(regionEl.value, resultsEl, source));
}
