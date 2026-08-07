import { SIGNALS, HCP_PROFILES, getAnalytics, getHcpProfile, getMslActionQueue, generateTalkingPoints, generateLiveSignal, addSignal } from "./orion-data.js";
import { speak, speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";
import { loadStoredSignals, onSignalReceived, clearStoredSignals } from "./orion-bridge.js";

const filterState = { diseaseArea: null, hcpId: null };
let liveInterval = null;
let newSignalCount = 0;

function init() {
  renderDiseaseBreakdown();
  applyFilters();
  attachListeners();
}

function getFilteredSignals() {
  let filtered = SIGNALS;
  if (filterState.diseaseArea) filtered = filtered.filter(s => s.diseaseArea === filterState.diseaseArea);
  if (filterState.hcpId) filtered = filtered.filter(s => s.hcpId === filterState.hcpId);
  return filtered;
}

function applyFilters() {
  const filtered = getFilteredSignals();
  renderStats(filtered);
  renderActionQueue(filtered);
  renderSignalTimeline(filtered);
  renderHcpProfiles(filtered);
  highlightDiseaseBar();
  highlightHcpCard();
  renderFilterChip();
}

function attachListeners() {
  document.getElementById("disease-breakdown").addEventListener("click", (e) => {
    const row = e.target.closest(".disease-row");
    if (!row) return;
    const disease = row.dataset.disease;
    filterState.diseaseArea = (filterState.diseaseArea === disease) ? null : disease;
    filterState.hcpId = null;
    applyFilters();
  });

  document.getElementById("hcp-profiles").addEventListener("click", (e) => {
    const card = e.target.closest(".hcp-card");
    if (!card) return;
    const hcpId = card.dataset.hcpId;
    filterState.hcpId = (filterState.hcpId === hcpId) ? null : hcpId;
    filterState.diseaseArea = null;
    applyFilters();
  });

  document.getElementById("signal-timeline").addEventListener("click", (e) => {
    const card = e.target.closest(".timeline-card");
    if (card) renderSignalOverlay(card.dataset.signalId);
  });

  document.getElementById("action-queue").addEventListener("click", (e) => {
    const card = e.target.closest(".action-card");
    if (card) renderSignalOverlay(card.dataset.signalId);
  });

  document.getElementById("live-toggle").addEventListener("click", toggleLiveFeed);

  // Stat tile click
  document.getElementById("stats-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".stat-card[data-stat]");
    if (!card) return;
    const stat = card.dataset.stat;
    const wasActive = card.classList.contains("active");
    document.querySelectorAll(".stat-card").forEach(c => c.classList.remove("active"));
    if (wasActive) {
      closeStatDrilldown();
    } else {
      card.classList.add("active");
      renderStatDrilldown(stat);
    }
  });
}

// ── Stat Drill-Down ──

let activeStatDrill = null;

function closeStatDrilldown() {
  activeStatDrill = null;
  document.querySelectorAll(".stat-card").forEach(c => c.classList.remove("active"));
  const container = document.getElementById("stat-drilldown-container");
  container.innerHTML = "";
}

function renderStatDrilldown(stat) {
  activeStatDrill = stat;
  const container = document.getElementById("stat-drilldown-container");
  let title = "", icon = "", items = [];

  if (stat === "total") {
    title = "All Signals"; icon = "chart-bar";
    items = SIGNALS.map(s => {
      const hcp = HCP_PROFILES.find(h => h.id === s.hcpId);
      const isPri = s.orionAction.startsWith("PRIORITY");
      return { id: s.id, title: s.topic, badge: isPri ? "PRIORITY" : s.depth.includes("Deep") ? "DEEP" : "", badgeCss: isPri ? "dd-badge-priority" : "dd-badge-queue", meta: [`${escapeHtml(hcp?.name || s.hcpId)}`, escapeHtml(s.diseaseArea), `${s.sessionDuration}m`] };
    });
  } else if (stat === "today") {
    title = "Today's Signals"; icon = "calendar-event";
    const todayStr = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0") + "-" + String(new Date().getDate()).padStart(2, "0");
    const today = SIGNALS.filter(s => s.timestamp.startsWith(todayStr) || s.timestamp.startsWith("2026-08-06"));
    items = today.map(s => {
      const hcp = HCP_PROFILES.find(h => h.id === s.hcpId);
      return { id: s.id, title: s.topic, badge: formatTime(s.timestamp), badgeCss: "dd-badge-log", meta: [escapeHtml(hcp?.name || s.hcpId), escapeHtml(s.diseaseArea)] };
    });
  } else if (stat === "priority") {
    title = "Priority Alerts"; icon = "alert-triangle";
    const priority = SIGNALS.filter(s => s.orionAction.startsWith("PRIORITY"));
    items = priority.map(s => {
      const hcp = HCP_PROFILES.find(h => h.id === s.hcpId);
      return { id: s.id, title: s.topic, badge: "PRIORITY", badgeCss: "dd-badge-priority", meta: [escapeHtml(hcp?.name || s.hcpId), escapeHtml(s.orionAction.replace(/^PRIORITY:\s*/, ""))] };
    });
  } else if (stat === "hcps") {
    title = "Unique HCPs"; icon = "users";
    const hcpIds = [...new Set(SIGNALS.map(s => s.hcpId))];
    items = hcpIds.map(id => {
      const hcp = HCP_PROFILES.find(h => h.id === id);
      const sigs = SIGNALS.filter(s => s.hcpId === id);
      const totalMin = sigs.reduce((sum, s) => sum + s.sessionDuration, 0);
      return { id: null, hcpId: id, title: hcp?.name || id, badge: hcp?.tier || "", badgeCss: hcp?.tier === "KOL" ? "dd-badge-priority" : "dd-badge-queue", meta: [escapeHtml(hcp?.specialty || ""), `${sigs.length} signals`, `${totalMin}m engaged`] };
    });
  } else if (stat === "depth") {
    title = "Engagement Depth Breakdown"; icon = "chart-dots-3";
    const deepSigs = SIGNALS.filter(s => s.depth.includes("Deep") || s.depth.includes("High"));
    const modSigs = SIGNALS.filter(s => s.depth.includes("Moderate"));
    const lightSigs = SIGNALS.filter(s => !s.depth.includes("Deep") && !s.depth.includes("High") && !s.depth.includes("Moderate"));
    items = [
      ...deepSigs.map(s => ({ id: s.id, title: s.topic, badge: "Deep", badgeCss: "dd-badge-priority", meta: [escapeHtml(HCP_PROFILES.find(h => h.id === s.hcpId)?.name || s.hcpId), `${s.sessionDuration}m`] })),
      ...modSigs.map(s => ({ id: s.id, title: s.topic, badge: "Moderate", badgeCss: "dd-badge-queue", meta: [escapeHtml(HCP_PROFILES.find(h => h.id === s.hcpId)?.name || s.hcpId), `${s.sessionDuration}m`] })),
      ...lightSigs.map(s => ({ id: s.id, title: s.topic, badge: "Light", badgeCss: "dd-badge-log", meta: [escapeHtml(HCP_PROFILES.find(h => h.id === s.hcpId)?.name || s.hcpId), `${s.sessionDuration}m`] })),
    ];
  } else if (stat === "minutes") {
    title = "Engagement Time"; icon = "clock";
    items = [...SIGNALS].sort((a, b) => b.sessionDuration - a.sessionDuration).map(s => {
      const hcp = HCP_PROFILES.find(h => h.id === s.hcpId);
      return { id: s.id, title: s.topic, badge: `${s.sessionDuration}m`, badgeCss: s.sessionDuration >= 12 ? "dd-badge-priority" : s.sessionDuration >= 8 ? "dd-badge-queue" : "dd-badge-log", meta: [escapeHtml(hcp?.name || s.hcpId), escapeHtml(s.diseaseArea)] };
    });
  }

  const itemsHtml = items.map(item => `
    <div class="dd-item" ${item.id ? `data-signal-id="${escapeHtml(item.id)}"` : ""} ${item.hcpId ? `data-hcp-id="${escapeHtml(item.hcpId)}"` : ""}>
      <div class="dd-item-title">${item.badge ? `<span class="dd-item-badge ${item.badgeCss}">${escapeHtml(item.badge)}</span> ` : ""}${escapeHtml(item.title)}</div>
      <div class="dd-item-meta">${item.meta.map(m => `<span>${m}</span>`).join("")}</div>
    </div>`).join("");

  container.innerHTML = `
    <div class="stat-drilldown">
      <div class="stat-drilldown-header">
        <h3><i class="ti ti-${icon}"></i> ${escapeHtml(title)} <span style="font-weight:400;color:var(--text-muted);font-size:12px;margin-left:4px">(${items.length})</span></h3>
        <button class="stat-drilldown-close">&times;</button>
      </div>
      <div class="stat-drilldown-body">${itemsHtml || '<div style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">No data</div>'}</div>
    </div>`;

  container.querySelector(".stat-drilldown-close").addEventListener("click", closeStatDrilldown);

  container.querySelectorAll(".dd-item[data-signal-id]").forEach(el => {
    el.addEventListener("click", () => renderSignalOverlay(el.dataset.signalId));
  });

  container.querySelectorAll(".dd-item[data-hcp-id]").forEach(el => {
    el.addEventListener("click", () => {
      filterState.hcpId = (filterState.hcpId === el.dataset.hcpId) ? null : el.dataset.hcpId;
      filterState.diseaseArea = null;
      applyFilters();
      closeStatDrilldown();
    });
  });
}

// ── Stats ──

function renderStats(signals) {
  const analytics = getAnalytics(signals);
  document.getElementById("stat-total").textContent = analytics.totalSignals;
  document.getElementById("stat-today").textContent = analytics.todaySignals;
  document.getElementById("stat-priority").textContent = analytics.priorityAlerts;
  document.getElementById("stat-hcps").textContent = analytics.uniqueHcps;
  document.getElementById("stat-depth").textContent =
    analytics.avgDepth >= 3 ? "Deep" : analytics.avgDepth >= 2 ? "Moderate" : analytics.avgDepth > 0 ? "Light" : "—";
  document.getElementById("stat-minutes").textContent = analytics.totalEngagementMinutes + "m";
}

// ── Disease Breakdown (always shows full data for context) ──

function renderDiseaseBreakdown() {
  const analytics = getAnalytics();
  const container = document.getElementById("disease-breakdown");
  const entries = Object.entries(analytics.diseaseAreas).sort((a, b) => b[1] - a[1]);
  const max = entries[0][1];
  const colors = ["var(--accent)", "var(--accent-secondary)", "var(--gold-dark)", "var(--orion-accent)", "#5b8def"];

  container.innerHTML = entries.map(([area, count], i) => `
    <div class="disease-row" data-disease="${escapeHtml(area)}">
      <div class="disease-label">${escapeHtml(area)}</div>
      <div class="disease-bar-track">
        <div class="disease-bar" style="width:${(count / max) * 100}%;background:${colors[i % colors.length]}"></div>
      </div>
      <div class="disease-count">${count}</div>
    </div>
  `).join("");
}

function highlightDiseaseBar() {
  document.querySelectorAll(".disease-row").forEach(row => {
    row.classList.toggle("active", row.dataset.disease === filterState.diseaseArea);
  });
}

function highlightHcpCard() {
  document.querySelectorAll(".hcp-card").forEach(card => {
    card.classList.toggle("active", card.dataset.hcpId === filterState.hcpId);
  });
}

// ── Filter Chip ──

function renderFilterChip() {
  const container = document.getElementById("active-filters");
  if (!filterState.diseaseArea && !filterState.hcpId) {
    container.innerHTML = "";
    return;
  }
  let label = "";
  if (filterState.diseaseArea) label = `Disease: ${filterState.diseaseArea}`;
  if (filterState.hcpId) {
    const hcp = HCP_PROFILES.find(h => h.id === filterState.hcpId);
    label = `HCP: ${hcp?.name || filterState.hcpId}`;
  }
  container.innerHTML = `<span class="filter-chip">${escapeHtml(label)} <button class="filter-chip-x">&times;</button></span>`;
  container.querySelector(".filter-chip-x").addEventListener("click", () => {
    filterState.diseaseArea = null;
    filterState.hcpId = null;
    applyFilters();
  });
}

// ── Action Queue ──

function renderActionQueue(signals) {
  const container = document.getElementById("action-queue");
  const queue = getMslActionQueue(signals);
  if (!queue.length) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;font-size:13px;">No actions match current filter</div>';
    return;
  }
  container.innerHTML = queue.map(s => {
    const isPriority = s.orionAction.startsWith("PRIORITY");
    const time = formatTime(s.timestamp);
    return `
    <div class="action-card ${isPriority ? "action-priority" : "action-standard"}" data-signal-id="${escapeHtml(s.id)}">
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

// ── Signal Timeline ──

function buildTimelineCardHtml(s, hcp, isNew) {
  const isPriority = s.orionAction.startsWith("PRIORITY");
  const depthClass = s.depth.includes("Deep") || s.depth.includes("High") ? "depth-deep" : s.depth.includes("Moderate") ? "depth-moderate" : "depth-light";
  const time = formatTime(s.timestamp);

  return `
  <div class="timeline-card${isNew ? " timeline-card-new" : ""}" data-signal-id="${escapeHtml(s.id)}">
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
}

function renderSignalTimeline(signals) {
  const container = document.getElementById("signal-timeline");
  const sorted = [...signals].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  if (!sorted.length) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;font-size:13px;">No signals match current filter</div>';
    return;
  }

  container.innerHTML = sorted.map(s => {
    const hcp = HCP_PROFILES.find(h => h.id === s.hcpId);
    return buildTimelineCardHtml(s, hcp, false);
  }).join("");
}

// ── HCP Profiles ──

function renderHcpProfiles(signals) {
  const container = document.getElementById("hcp-profiles");
  const relevantHcpIds = new Set(signals.map(s => s.hcpId));
  const profilesToShow = filterState.diseaseArea || filterState.hcpId
    ? HCP_PROFILES.filter(h => relevantHcpIds.has(h.id))
    : HCP_PROFILES;

  const profiles = profilesToShow.map(h => getHcpProfile(h.id)).sort((a, b) => b.maxDepth - a.maxDepth || b.signalCount - a.signalCount);

  if (!profiles.length) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;font-size:13px;grid-column:1/-1;">No HCPs match current filter</div>';
    return;
  }

  container.innerHTML = profiles.map(p => {
    const depthLabel = p.maxDepth >= 4 ? "Deep+" : p.maxDepth >= 3 ? "Deep" : p.maxDepth >= 2 ? "Moderate" : "Light";
    const depthClass = p.maxDepth >= 3 ? "depth-deep" : p.maxDepth >= 2 ? "depth-moderate" : "depth-light";

    return `
    <div class="hcp-card ${p.hasPriority ? "hcp-priority" : ""}" data-hcp-id="${escapeHtml(p.id)}">
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

// ── Signal Drill-Down Overlay ──

function renderSignalOverlay(signalId) {
  const signal = SIGNALS.find(s => s.id === signalId);
  if (!signal) return;
  const hcp = HCP_PROFILES.find(h => h.id === signal.hcpId);
  const talkingPoints = generateTalkingPoints(signal);

  const overlay = document.createElement("div");
  overlay.className = "signal-overlay";
  overlay.innerHTML = `
    <div class="signal-overlay-backdrop"></div>
    <div class="signal-overlay-panel">
      <div class="overlay-header">
        <h3>${escapeHtml(signal.topic)}</h3>
        <button class="overlay-close">&times;</button>
      </div>
      <div class="overlay-body">
        <div class="overlay-section">
          <div class="overlay-label">HCP</div>
          <div style="font-size:14px;font-weight:600;">${escapeHtml(hcp?.name || signal.hcpId)}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${escapeHtml(hcp?.specialty || "")} · ${escapeHtml(hcp?.institution || "")} · ${escapeHtml(hcp?.region || "")}</div>
        </div>
        <div class="overlay-row">
          <div class="overlay-section">
            <div class="overlay-label">Engagement Depth</div>
            <div style="font-size:13px;font-weight:500;">${escapeHtml(signal.depth)}</div>
          </div>
          <div class="overlay-section">
            <div class="overlay-label">Duration</div>
            <div style="font-size:13px;font-weight:500;">${signal.sessionDuration} minutes</div>
          </div>
          <div class="overlay-section">
            <div class="overlay-label">Intent</div>
            <div style="font-size:13px;font-weight:500;">${escapeHtml(signal.intent)}</div>
          </div>
        </div>
        <div class="overlay-section">
          <div class="overlay-label">Queries Asked</div>
          ${signal.queries.map(q => `<div class="overlay-query"><i class="ti ti-message-circle"></i> ${escapeHtml(q)}</div>`).join("")}
        </div>
        <div class="overlay-section">
          <div class="overlay-label">Content Accessed</div>
          ${signal.contentAccessed.map(c => `<div class="overlay-content-item"><i class="ti ti-file-text"></i> ${escapeHtml(c)}</div>`).join("")}
        </div>
        <div class="overlay-section">
          <div class="overlay-label">Orion Recommended Action</div>
          <div class="overlay-action">${escapeHtml(signal.orionAction)}</div>
        </div>
        <div class="overlay-section">
          <div class="overlay-label">MSL Talking Points</div>
          <ul class="overlay-talking-points">
            ${talkingPoints.map(tp => `<li><i class="ti ti-bulb"></i> <span>${escapeHtml(tp)}</span></li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("open"));

  const close = () => {
    overlay.classList.remove("open");
    setTimeout(() => overlay.remove(), 250);
  };
  overlay.querySelector(".overlay-close").addEventListener("click", close);
  overlay.querySelector(".signal-overlay-backdrop").addEventListener("click", close);
  const escHandler = (e) => {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", escHandler); }
  };
  document.addEventListener("keydown", escHandler);
}

// ── Live Feed ──

function toggleLiveFeed() {
  const btn = document.getElementById("live-toggle");
  if (liveInterval) {
    clearInterval(liveInterval);
    liveInterval = null;
    btn.classList.remove("active");
    return;
  }
  btn.classList.add("active");
  newSignalCount = 0;
  injectLiveSignal();
  liveInterval = setInterval(injectLiveSignal, 6000 + Math.random() * 2000);
}

function injectLiveSignal() {
  const signal = generateLiveSignal();
  addSignal(signal);
  newSignalCount++;

  renderDiseaseBreakdown();
  const filtered = getFilteredSignals();
  renderStats(filtered);
  renderActionQueue(filtered);
  highlightDiseaseBar();

  const matchesFilter = filtered.includes(signal) || filtered.some(s => s.id === signal.id);
  if (matchesFilter) {
    const container = document.getElementById("signal-timeline");
    const emptyMsg = container.querySelector("div[style]");
    if (emptyMsg && emptyMsg.textContent.includes("No signals")) emptyMsg.remove();

    const hcp = HCP_PROFILES.find(h => h.id === signal.hcpId);
    const html = buildTimelineCardHtml(signal, hcp, true);
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const card = temp.firstElementChild;
    container.prepend(card);
    setTimeout(() => card.classList.remove("timeline-card-new"), 2000);
  }

  updateLiveBadge();
}

function updateLiveBadge() {
  const badge = document.getElementById("live-badge");
  badge.style.display = "inline-flex";
  badge.textContent = newSignalCount;
}

// ── Utilities ──

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ── Automated Demo ──

let demoRunning = false;

const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function narrate(text) {
  const el = document.getElementById("demo-narrator");
  el.innerHTML = `<i class="ti ti-sparkles"></i> ${escapeHtml(text)}`;
  if (isCCEnabled()) el.classList.add("visible");
  showControls();
  await speakAndWait(text);
}

function narrateOff() {
  document.getElementById("demo-narrator").classList.remove("visible");
  stopSpeaking();
  hideControls();
}

function highlight(el) {
  if (el) el.classList.add("demo-highlight");
}

function unhighlight(el) {
  if (el) el.classList.remove("demo-highlight");
}

function scrollIntoViewSmooth(el) {
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function closeOverlayIfOpen() {
  const overlay = document.querySelector(".signal-overlay");
  if (overlay) {
    overlay.classList.remove("open");
    setTimeout(() => overlay.remove(), 250);
  }
}

function clearFilterIfActive() {
  if (filterState.diseaseArea || filterState.hcpId) {
    filterState.diseaseArea = null;
    filterState.hcpId = null;
    applyFilters();
  }
}

function stopLiveFeedIfActive() {
  if (liveInterval) {
    clearInterval(liveInterval);
    liveInterval = null;
    document.getElementById("live-toggle").classList.remove("active");
  }
}

async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;
  const btn = document.getElementById("demo-play-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader-2"></i> Demo Running...';

  closeOverlayIfOpen();
  clearFilterIfActive();
  stopLiveFeedIfActive();
  document.querySelector(".dashboard").scrollTo({ top: 0, behavior: "smooth" });
  await wait(600);

  // ── ACT 1: Live Feed ──
  await narrate("Starting the live signal feed — new HCP engagement signals stream in real-time");
  const liveBtn = document.getElementById("live-toggle");
  highlight(liveBtn);
  await wait(500);

  liveBtn.click();
  await wait(7000);

  unhighlight(liveBtn);
  await narrate("Two new signals detected — stats and action queue updated automatically");

  liveBtn.click();
  await wait(500);

  // ── ACT 2: Disease Filter ──
  await narrate("Filtering by disease area — click any disease bar to focus the dashboard");
  const dashboard = document.querySelector(".dashboard");
  const diseasePanel = document.getElementById("disease-breakdown");
  scrollIntoViewSmooth(diseasePanel);
  await wait(500);

  highlight(diseasePanel.closest(".dash-panel"));
  await wait(500);

  const adRow = diseasePanel.querySelector('.disease-row[data-disease="Atopic Dermatitis"]');
  if (adRow) {
    adRow.click();
    unhighlight(diseasePanel.closest(".dash-panel"));
    await narrate("Filtered to Atopic Dermatitis — all panels now show only AD-related signals");
  }

  // ── ACT 3: Signal Drill-Down from timeline ──
  await narrate("Click any signal to drill down into full engagement details");
  const timelineContainer = document.getElementById("signal-timeline");
  scrollIntoViewSmooth(timelineContainer);
  await wait(500);

  const firstTimeline = timelineContainer.querySelector(".timeline-card");
  if (firstTimeline) {
    highlight(firstTimeline);
    await wait(500);
    unhighlight(firstTimeline);
    firstTimeline.click();
    await narrate("Signal detail panel — queries asked, content accessed, and AI-generated MSL talking points");
    closeOverlayIfOpen();
    await wait(500);
  }

  // ── ACT 4: Clear filter, switch to HCP filter ──
  await narrate("Clearing filter — now filtering by HCP to see individual engagement profiles");
  clearFilterIfActive();
  await wait(500);

  const hcpGrid = document.getElementById("hcp-profiles");
  scrollIntoViewSmooth(hcpGrid);
  await wait(500);

  const chenCard = hcpGrid.querySelector('.hcp-card[data-hcp-id="HCP-4821"]');
  if (chenCard) {
    highlight(chenCard);
    await wait(500);
    unhighlight(chenCard);
    chenCard.click();
    await narrate("Filtered to Dr. Sarah Chen (KOL) — 2 signals, 34 minutes engaged, Deep+ depth");
  }

  // ── ACT 5: Drill-down from action queue ──
  await narrate("Opening a priority action from the MSL queue");
  const actionContainer = document.getElementById("action-queue");
  scrollIntoViewSmooth(actionContainer);
  await wait(500);

  const firstAction = actionContainer.querySelector(".action-card");
  if (firstAction) {
    highlight(firstAction);
    await wait(500);
    unhighlight(firstAction);
    firstAction.click();
    await narrate("Priority alert — deep pipeline interest signals advisory board potential");
    closeOverlayIfOpen();
    await wait(500);
  }

  // ── ACT 6: Reset and wrap up ──
  clearFilterIfActive();
  dashboard.scrollTo({ top: 0, behavior: "smooth" });
  await wait(500);
  await narrate("Orion Signal Intelligence — turning every MedVerse interaction into MSL-ready insight");
  narrateOff();

  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-player-play-filled"></i> Play Demo';
  demoRunning = false;
}

document.getElementById("demo-play-btn").addEventListener("click", runDemo);

// ─── CHAT ───

const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatSuggestions = document.getElementById("chat-suggestions");
const chatDemoBtn = document.getElementById("chatDemoBtn");
const chatClearBtn = document.getElementById("chatClearBtn");

function resetChat() {
  chatMessages.innerHTML = `<div class="chat-msg ai">
    <div class="chat-ai-avatar"><i class="ti ti-radar-2"></i></div>
    <div class="chat-bubble chat-ai-bubble">
      I'm the Orion Signal Intelligence Agent. I analyze <strong>HCP engagement signals</strong> from MedVerse in real time. Ask me about priority alerts, trending topics, HCP profiles, or engagement patterns.
    </div>
  </div>`;
  chatSuggestions.innerHTML = [
    "Show priority alerts",
    "What's trending today?",
    "Tell me about Dr. Chen",
    "AD engagement signals",
    "KOL activity summary"
  ].map(s => `<button class="chat-suggestion">${escapeHtml(s)}</button>`).join("");
  chatSuggestions.style.display = "flex";
  chatInput.value = "";
  chatSend.disabled = true;
  bindSuggestionClicks();
}

function bindSuggestionClicks() {
  chatSuggestions.querySelectorAll(".chat-suggestion").forEach(btn => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.textContent;
      sendChat();
    });
  });
}

function addChatUserMsg(text) {
  const div = document.createElement("div");
  div.className = "chat-msg user";
  div.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addChatPersonaMsg(text, persona, css) {
  const div = document.createElement("div");
  div.className = "chat-msg user";
  div.innerHTML = `<div><div class="chat-persona-label ${css}">${escapeHtml(persona)}</div><div class="chat-bubble" style="background:var(--orion-accent);color:white;border-bottom-right-radius:4px">${escapeHtml(text)}</div></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addChatAIMsg(html) {
  const div = document.createElement("div");
  div.className = "chat-msg ai";
  div.innerHTML = `<div class="chat-ai-avatar"><i class="ti ti-radar-2"></i></div><div class="chat-bubble chat-ai-bubble">${html}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addChatTyping() {
  const div = document.createElement("div");
  div.className = "chat-msg ai chat-typing-msg";
  div.innerHTML = `<div class="chat-ai-avatar"><i class="ti ti-radar-2"></i></div><div class="chat-bubble chat-ai-bubble"><span class="chat-typing"><span></span><span></span><span></span></span></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function generateChatResponse(query) {
  const q = query.toLowerCase();
  const analytics = getAnalytics();

  // Priority alerts
  if (q.includes("priority") || q.includes("alert") || q.includes("urgent")) {
    const priority = SIGNALS.filter(s => s.orionAction.startsWith("PRIORITY"));
    const items = priority.map(s => {
      const hcp = HCP_PROFILES.find(h => h.id === s.hcpId);
      return `🔴 <strong>${escapeHtml(hcp?.name || s.hcpId)}</strong> (${escapeHtml(hcp?.tier || "")})<br>${escapeHtml(s.topic)}<br>→ ${escapeHtml(s.orionAction.replace("PRIORITY: ", ""))}`;
    }).join("<br><br>");
    return `<strong>${priority.length} priority alerts</strong> requiring MSL action:<br><br>${items}`;
  }

  // Trending / today
  if (q.includes("trending") || q.includes("today") || q.includes("recent")) {
    const todayStr = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0") + "-" + String(new Date().getDate()).padStart(2, "0");
    const today = SIGNALS.filter(s => s.timestamp.startsWith(todayStr) || s.timestamp.startsWith("2026-08-06"));
    const diseaseCount = {};
    today.forEach(s => { diseaseCount[s.diseaseArea] = (diseaseCount[s.diseaseArea] || 0) + 1; });
    const sorted = Object.entries(diseaseCount).sort((a, b) => b[1] - a[1]);
    const trends = sorted.map(([area, count]) => `• <strong>${escapeHtml(area)}</strong> — ${count} signal${count > 1 ? "s" : ""}`).join("<br>");
    return `<strong>${today.length} signals today</strong> across ${sorted.length} disease areas:<br><br>${trends}<br><br>Total engagement: <strong>${today.reduce((s, sig) => s + sig.sessionDuration, 0)} minutes</strong> across ${new Set(today.map(s => s.hcpId)).size} unique HCPs.`;
  }

  // HCP-specific query
  const hcpMatch = HCP_PROFILES.find(h => {
    const nameLower = h.name.toLowerCase();
    const lastName = nameLower.split(" ").pop();
    return q.includes(nameLower) || q.includes(lastName);
  });
  if (hcpMatch) {
    const profile = getHcpProfile(hcpMatch.id);
    const recentTopics = profile.signals.slice(0, 3).map(s => `• ${escapeHtml(s.topic)} (${escapeHtml(s.depth)})`).join("<br>");
    return `<strong>${escapeHtml(hcpMatch.name)}</strong> — ${escapeHtml(hcpMatch.specialty)}<br>${escapeHtml(hcpMatch.institution)} · ${escapeHtml(hcpMatch.tier)} tier<br><br><strong>${profile.signalCount} signals</strong> · ${profile.totalEngagementMinutes} minutes engaged<br>Disease focus: ${profile.diseaseAreas.map(d => escapeHtml(d)).join(", ")}<br>${profile.hasPriority ? "🔴 Has active priority alerts" : "No priority alerts"}<br><br><strong>Recent activity:</strong><br>${recentTopics}`;
  }

  // KOL activity
  if (q.includes("kol") || q.includes("key opinion")) {
    const kols = HCP_PROFILES.filter(h => h.tier === "KOL");
    const items = kols.map(h => {
      const p = getHcpProfile(h.id);
      return `<strong>${escapeHtml(h.name)}</strong> · ${escapeHtml(h.specialty)}<br>${p.signalCount} signals · ${p.totalEngagementMinutes}m engaged · ${p.hasPriority ? "🔴 Priority" : "Standard"}`;
    }).join("<br><br>");
    return `<strong>${kols.length} KOLs</strong> tracked in MedVerse:<br><br>${items}`;
  }

  // Disease-specific
  const diseaseMap = [
    [/atopic|dermatitis|\bad\b/, "Atopic Dermatitis"],
    [/asthma/, "Severe Asthma"],
    [/copd/, "COPD"],
    [/rheumatoid|ra\b/, "Rheumatoid Arthritis"],
    [/eoe|eosinophilic/, "EoE"],
    [/cross.?ta|immunology/, "Cross-TA Immunology"],
    [/ibd|crohn|colitis/, "GI / Dermatology"],
  ];
  let diseaseMatch = null;
  for (const [re, area] of diseaseMap) {
    if (re.test(q)) { diseaseMatch = area; break; }
  }
  if (diseaseMatch) {
    const signals = SIGNALS.filter(s => s.diseaseArea === diseaseMatch);
    if (signals.length) {
      const items = signals.slice(0, 4).map(s => {
        const hcp = HCP_PROFILES.find(h => h.id === s.hcpId);
        return `<strong>${escapeHtml(hcp?.name || s.hcpId)}</strong> — ${escapeHtml(s.depth)}<br>${escapeHtml(s.topic)}`;
      }).join("<br><br>");
      const totalMin = signals.reduce((sum, s) => sum + s.sessionDuration, 0);
      return `<strong>${signals.length} signals</strong> for ${escapeHtml(diseaseMatch)}:<br><br>${items}<br><br>Total engagement: <strong>${totalMin} minutes</strong>.`;
    }
  }

  // Engagement patterns
  if (q.includes("engagement") || q.includes("pattern") || q.includes("summary") || q.includes("overview")) {
    const deepSignals = SIGNALS.filter(s => s.depth.includes("Deep") || s.depth.includes("High"));
    return `<strong>Engagement overview:</strong><br><br>• <strong>${analytics.totalSignals}</strong> total signals from <strong>${analytics.uniqueHcps}</strong> unique HCPs<br>• <strong>${analytics.priorityAlerts}</strong> priority alerts pending<br>• <strong>${deepSignals.length}</strong> deep/high-value engagements<br>• <strong>${analytics.totalEngagementMinutes}m</strong> total engagement time<br>• Top areas: ${Object.entries(analytics.diseaseAreas).sort((a,b) => b[1]-a[1]).slice(0,3).map(([a,c]) => `${escapeHtml(a)} (${c})`).join(", ")}`;
  }

  // MSL actions
  if (q.includes("msl") || q.includes("action") || q.includes("follow.?up") || q.includes("queue")) {
    const queue = getMslActionQueue();
    const items = queue.slice(0, 4).map(s => {
      const isPri = s.orionAction.startsWith("PRIORITY");
      return `${isPri ? "🔴" : "🟢"} <strong>${escapeHtml(s.hcpName)}</strong><br>${escapeHtml(s.orionAction.replace(/^PRIORITY:\s*/, "").replace(/^Queue for MSL follow-up —\s*/, ""))}`;
    }).join("<br><br>");
    return `<strong>${queue.length} items in MSL action queue</strong>:<br><br>${items}`;
  }

  // Fallback
  return `I'm tracking <strong>${analytics.totalSignals} signals</strong> from <strong>${analytics.uniqueHcps} HCPs</strong> with <strong>${analytics.priorityAlerts} priority alerts</strong>. Try asking about:<br><br>• Priority alerts or MSL action queue<br>• Trending topics today<br>• A specific HCP (e.g. Dr. Chen, Dr. Gonzalez)<br>• Disease area signals (AD, COPD, asthma)<br>• KOL activity summary<br>• Engagement overview`;
}

async function sendChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";
  chatSend.disabled = true;
  chatSuggestions.style.display = "none";
  addChatUserMsg(text);
  const typing = addChatTyping();
  await wait(800 + Math.random() * 600);
  typing.remove();
  const response = generateChatResponse(text);
  addChatAIMsg(response);

  const lq = text.toLowerCase();
  let followUps = [];
  if (lq.includes("priority")) followUps = ["MSL action queue", "KOL activity summary", "Engagement overview"];
  else if (lq.includes("trend")) followUps = ["Priority alerts", "AD engagement signals", "Dr. Chen activity"];
  else if (lq.includes("chen") || lq.includes("gonzalez")) followUps = ["Priority alerts", "KOL activity summary", "Trending topics"];
  else if (lq.includes("kol")) followUps = ["Tell me about Dr. Chen", "Dr. Gonzalez signals", "Priority alerts"];
  else followUps = ["Priority alerts", "What's trending today?", "Engagement overview"];

  chatSuggestions.innerHTML = followUps.map(s => `<button class="chat-suggestion">${escapeHtml(s)}</button>`).join("");
  chatSuggestions.style.display = "flex";
  bindSuggestionClicks();
}

function bindChat() {
  if (chatInput && chatSend) {
    chatSend.addEventListener("click", sendChat);
    chatInput.addEventListener("keydown", e => {
      if (e.key === "Enter") sendChat();
    });
    chatInput.addEventListener("input", () => {
      chatSend.disabled = !chatInput.value.trim();
    });
  }
  if (chatClearBtn) chatClearBtn.addEventListener("click", resetChat);
  bindSuggestionClicks();
}

// ─── CHAT DEMO ───

const CHAT_DEMO_SEQUENCE = [
  { persona: "MSL", css: "msl", question: "Show me all priority alerts" },
  { persona: "Med Affairs", css: "med-affairs", question: "What's trending across HCPs today?" },
  { persona: "MSL", css: "msl", question: "Tell me about Dr. Sarah Chen's engagement" },
  { persona: "Field Ops", css: "field-ops", question: "What are the AD engagement signals?" },
  { persona: "Med Affairs", css: "med-affairs", question: "Summarize KOL activity" },
  { persona: "MSL", css: "msl", question: "What's in the MSL action queue?" },
  { persona: "Field Ops", css: "field-ops", question: "Give me an engagement overview" },
  { persona: "MSL", css: "msl", question: "Tell me about Dr. Gonzalez" },
];

let chatDemoRunning = false;

async function typeIntoChat(text) {
  chatInput.value = "";
  for (let i = 0; i < text.length; i++) {
    chatInput.value += text[i];
    await wait(25 + Math.random() * 20);
  }
}

async function runChatDemo() {
  if (chatDemoRunning) return;
  chatDemoRunning = true;
  chatDemoBtn.disabled = true;
  chatDemoBtn.innerHTML = '<i class="ti ti-loader-2" style="font-size:13px;animation:spin 1s linear infinite"></i> Running…';
  resetChat();
  await wait(600);

  await narrate("Orion AI chat demo — multi-persona questions about HCP engagement signals");

  for (const step of CHAT_DEMO_SEQUENCE) {
    await narrate(`${step.persona} asks: "${step.question.substring(0, 50)}..."`);
    await typeIntoChat(step.question);
    await wait(300);
    chatSuggestions.style.display = "none";
    addChatPersonaMsg(step.question, step.persona, step.css);
    chatInput.value = "";
    const typing = addChatTyping();
    await wait(1000 + Math.random() * 800);
    typing.remove();
    const response = generateChatResponse(step.question);
    addChatAIMsg(response);
    await narrate("AI analyzes real-time engagement signals and HCP profiles to generate insights");
  }

  addChatAIMsg(`<strong>Demo complete!</strong> ${CHAT_DEMO_SEQUENCE.length} questions answered across ${SIGNALS.length} signals and ${HCP_PROFILES.length} HCP profiles. The Orion Intelligence Agent turns behavioral signals into actionable MSL intelligence.`);
  narrateOff();

  chatDemoRunning = false;
  chatDemoBtn.disabled = false;
  chatDemoBtn.innerHTML = '<i class="ti ti-player-play" style="font-size:13px"></i> Demo';
}

function bindChatDemo() {
  if (chatDemoBtn) chatDemoBtn.addEventListener("click", runChatDemo);
}

bindChat();
bindChatDemo();

// Ingest cross-module signals from localStorage before init renders
const storedSignals = loadStoredSignals();
storedSignals.forEach(s => {
  if (!SIGNALS.find(existing => existing.id === s.id)) {
    addSignal(s);
  }
});

init();

// Listen for real-time cross-module signals from other tabs
onSignalReceived((signal) => {
  if (!SIGNALS.find(existing => existing.id === signal.id)) {
    addSignal(signal);
    newSignalCount++;
    renderDiseaseBreakdown();
    applyFilters();
    // Flash the new signal count badge
    const liveBtn = document.getElementById("live-toggle");
    if (liveBtn && !liveInterval) {
      const badge = document.createElement("span");
      badge.className = "cross-module-badge";
      badge.textContent = newSignalCount;
      badge.style.cssText = "position:absolute;top:-4px;right:-4px;background:#dc2626;color:white;font-size:10px;font-weight:700;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;animation:pulse 0.5s ease-out;";
      liveBtn.style.position = "relative";
      const existing = liveBtn.querySelector(".cross-module-badge");
      if (existing) existing.remove();
      liveBtn.appendChild(badge);
    }
    if (window.mvToast) mvToast("New signal from " + (signal._source || "MedVerse"), "info");
  }
});
