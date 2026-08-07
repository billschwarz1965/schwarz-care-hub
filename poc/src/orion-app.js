import { SIGNALS, HCP_PROFILES, getAnalytics, getHcpProfile, getMslActionQueue } from "./orion-data.js";

const analytics = getAnalytics();
const actionQueue = getMslActionQueue();

function init() {
  renderStats();
  renderDiseaseBreakdown();
  renderActionQueue();
  renderSignalTimeline();
  renderHcpProfiles();
}

function renderStats() {
  document.getElementById("stat-total").textContent = analytics.totalSignals;
  document.getElementById("stat-today").textContent = analytics.todaySignals;
  document.getElementById("stat-priority").textContent = analytics.priorityAlerts;
  document.getElementById("stat-hcps").textContent = analytics.uniqueHcps;
  document.getElementById("stat-depth").textContent =
    analytics.avgDepth >= 3 ? "Deep" : analytics.avgDepth >= 2 ? "Moderate" : "Light";
  document.getElementById("stat-minutes").textContent = analytics.totalEngagementMinutes + "m";
}

function renderDiseaseBreakdown() {
  const container = document.getElementById("disease-breakdown");
  const entries = Object.entries(analytics.diseaseAreas).sort((a, b) => b[1] - a[1]);
  const max = entries[0][1];
  const colors = ["var(--accent)", "var(--accent-secondary)", "var(--gold-dark)", "var(--orion-accent)", "#5b8def"];

  container.innerHTML = entries.map(([area, count], i) => `
    <div class="disease-row">
      <div class="disease-label">${escapeHtml(area)}</div>
      <div class="disease-bar-track">
        <div class="disease-bar" style="width:${(count / max) * 100}%;background:${colors[i % colors.length]}"></div>
      </div>
      <div class="disease-count">${count}</div>
    </div>
  `).join("");
}

function renderActionQueue() {
  const container = document.getElementById("action-queue");
  container.innerHTML = actionQueue.map(s => {
    const isPriority = s.orionAction.startsWith("PRIORITY");
    const time = formatTime(s.timestamp);
    return `
    <div class="action-card ${isPriority ? "action-priority" : "action-standard"}">
      <div class="action-card-header">
        <span class="action-badge ${isPriority ? "badge-priority" : "badge-queue"}">${isPriority ? "PRIORITY" : "QUEUE"}</span>
        <span class="action-time">${time}</span>
      </div>
      <div class="action-hcp">
        <strong>${escapeHtml(s.hcpName)}</strong>
        <span class="action-hcp-meta">${escapeHtml(s.hcpSpecialty)} · ${escapeHtml(s.hcpTier)}</span>
      </div>
      <div class="action-topic">${escapeHtml(s.topic)}</div>
      <div class="action-recommendation">
        <i class="ti ti-arrow-right"></i>
        <span>${escapeHtml(s.orionAction.replace(/^PRIORITY:\s*/, "").replace(/^Queue for MSL follow-up —\s*/, ""))}</span>
      </div>
    </div>`;
  }).join("");
}

function renderSignalTimeline() {
  const container = document.getElementById("signal-timeline");
  const sorted = [...SIGNALS].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  container.innerHTML = sorted.map(s => {
    const hcp = HCP_PROFILES.find(h => h.id === s.hcpId);
    const isPriority = s.orionAction.startsWith("PRIORITY");
    const depthClass = s.depth.includes("Deep") || s.depth.includes("High") ? "depth-deep" : s.depth.includes("Moderate") ? "depth-moderate" : "depth-light";
    const time = formatTime(s.timestamp);

    return `
    <div class="timeline-card">
      <div class="timeline-dot ${isPriority ? "dot-priority" : ""}"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span class="timeline-hcp">${escapeHtml(hcp?.name || s.hcpId)}</span>
          <span class="timeline-time">${time}</span>
        </div>
        <div class="timeline-topic">${escapeHtml(s.topic)}</div>
        <div class="timeline-meta">
          <span class="depth-badge ${depthClass}">${escapeHtml(s.depth)}</span>
          <span class="timeline-disease">${escapeHtml(s.diseaseArea)}</span>
          <span class="timeline-duration">${s.sessionDuration}m</span>
        </div>
        <div class="timeline-queries">
          ${s.queries.map(q => `<div class="timeline-query"><i class="ti ti-message-circle"></i> ${escapeHtml(q)}</div>`).join("")}
        </div>
      </div>
    </div>`;
  }).join("");
}

function renderHcpProfiles() {
  const container = document.getElementById("hcp-profiles");
  const profiles = HCP_PROFILES.map(h => getHcpProfile(h.id)).sort((a, b) => b.maxDepth - a.maxDepth || b.signalCount - a.signalCount);

  container.innerHTML = profiles.map(p => {
    const depthLabel = p.maxDepth >= 4 ? "Deep+" : p.maxDepth >= 3 ? "Deep" : p.maxDepth >= 2 ? "Moderate" : "Light";
    const depthClass = p.maxDepth >= 3 ? "depth-deep" : p.maxDepth >= 2 ? "depth-moderate" : "depth-light";

    return `
    <div class="hcp-card ${p.hasPriority ? "hcp-priority" : ""}">
      <div class="hcp-card-header">
        <div class="hcp-avatar">${p.name.split(" ").slice(1).map(n => n[0]).join("")}</div>
        <div class="hcp-info">
          <div class="hcp-name">${escapeHtml(p.name)}</div>
          <div class="hcp-meta">${escapeHtml(p.specialty)} · ${escapeHtml(p.institution)}</div>
        </div>
        <span class="tier-badge tier-${p.tier.toLowerCase()}">${escapeHtml(p.tier)}</span>
      </div>
      <div class="hcp-stats-row">
        <div class="hcp-stat"><span class="hcp-stat-num">${p.signalCount}</span><span class="hcp-stat-label">Signals</span></div>
        <div class="hcp-stat"><span class="hcp-stat-num">${p.totalEngagementMinutes}m</span><span class="hcp-stat-label">Engaged</span></div>
        <div class="hcp-stat"><span class="depth-badge ${depthClass}">${depthLabel}</span><span class="hcp-stat-label">Max depth</span></div>
      </div>
      <div class="hcp-disease-tags">
        ${p.diseaseAreas.map(d => `<span class="disease-tag">${escapeHtml(d)}</span>`).join("")}
      </div>
    </div>`;
  }).join("");
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

init();
