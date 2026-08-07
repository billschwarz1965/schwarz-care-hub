import { SIGNALS, HCP_PROFILES, getAnalytics, getHcpProfile, getMslActionQueue, generateTalkingPoints, generateLiveSignal, addSignal } from "./orion-data.js";

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

function narrate(text) {
  const el = document.getElementById("demo-narrator");
  el.innerHTML = `<i class="ti ti-sparkles"></i> ${escapeHtml(text)}`;
  el.classList.add("visible");
}

function narrateOff() {
  document.getElementById("demo-narrator").classList.remove("visible");
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
  narrate("Starting the live signal feed — new HCP engagement signals stream in real-time");
  const liveBtn = document.getElementById("live-toggle");
  highlight(liveBtn);
  await wait(1500);

  liveBtn.click();
  await wait(7000);

  unhighlight(liveBtn);
  narrate("Two new signals detected — stats and action queue updated automatically");
  await wait(3000);

  liveBtn.click();
  await wait(1000);

  // ── ACT 2: Disease Filter ──
  narrate("Filtering by disease area — click any disease bar to focus the dashboard");
  const dashboard = document.querySelector(".dashboard");
  const diseasePanel = document.getElementById("disease-breakdown");
  scrollIntoViewSmooth(diseasePanel);
  await wait(1200);

  highlight(diseasePanel.closest(".dash-panel"));
  await wait(1500);

  const adRow = diseasePanel.querySelector('.disease-row[data-disease="Atopic Dermatitis"]');
  if (adRow) {
    adRow.click();
    unhighlight(diseasePanel.closest(".dash-panel"));
    narrate("Filtered to Atopic Dermatitis — all panels now show only AD-related signals");
    await wait(3500);
  }

  // ── ACT 3: Signal Drill-Down from timeline ──
  narrate("Click any signal to drill down into full engagement details");
  const timelineContainer = document.getElementById("signal-timeline");
  scrollIntoViewSmooth(timelineContainer);
  await wait(1200);

  const firstTimeline = timelineContainer.querySelector(".timeline-card");
  if (firstTimeline) {
    highlight(firstTimeline);
    await wait(1500);
    unhighlight(firstTimeline);
    firstTimeline.click();
    narrate("Signal detail panel — queries asked, content accessed, and AI-generated MSL talking points");
    await wait(5000);
    closeOverlayIfOpen();
    await wait(800);
  }

  // ── ACT 4: Clear filter, switch to HCP filter ──
  narrate("Clearing filter — now filtering by HCP to see individual engagement profiles");
  clearFilterIfActive();
  await wait(1000);

  const hcpGrid = document.getElementById("hcp-profiles");
  scrollIntoViewSmooth(hcpGrid);
  await wait(1200);

  const chenCard = hcpGrid.querySelector('.hcp-card[data-hcp-id="HCP-4821"]');
  if (chenCard) {
    highlight(chenCard);
    await wait(1500);
    unhighlight(chenCard);
    chenCard.click();
    narrate("Filtered to Dr. Sarah Chen (KOL) — 2 signals, 34 minutes engaged, Deep+ depth");
    await wait(3500);
  }

  // ── ACT 5: Drill-down from action queue ──
  narrate("Opening a priority action from the MSL queue");
  const actionContainer = document.getElementById("action-queue");
  scrollIntoViewSmooth(actionContainer);
  await wait(1000);

  const firstAction = actionContainer.querySelector(".action-card");
  if (firstAction) {
    highlight(firstAction);
    await wait(1200);
    unhighlight(firstAction);
    firstAction.click();
    narrate("Priority alert — deep pipeline interest signals advisory board potential");
    await wait(5000);
    closeOverlayIfOpen();
    await wait(800);
  }

  // ── ACT 6: Reset and wrap up ──
  clearFilterIfActive();
  dashboard.scrollTo({ top: 0, behavior: "smooth" });
  await wait(800);
  narrate("Orion Signal Intelligence — turning every MedVerse interaction into MSL-ready insight");
  await wait(4000);
  narrateOff();

  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-player-play-filled"></i> Play Demo';
  demoRunning = false;
}

document.getElementById("demo-play-btn").addEventListener("click", runDemo);

init();
