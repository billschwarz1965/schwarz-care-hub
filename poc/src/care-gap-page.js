// Standalone Care Gap Analyzer page (poc-internal) — thin wrapper around the
// shared renderer in care-gap-analysis.js, defaulting to Southeast on load so
// the page isn't empty on first view.
import { mountCareGapAnalyzer, renderCareGapAnalysis } from "./care-gap-analysis.js";

mountCareGapAnalyzer({ regionSelectId: "cga-region", submitId: "cga-submit", resultsId: "cga-results", source: "Care Gap Analyzer" });
renderCareGapAnalysis(document.getElementById("cga-region").value, document.getElementById("cga-results"), "Care Gap Analyzer");
