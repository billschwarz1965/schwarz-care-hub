import { CONGRESSES, PRESENTATIONS, getCongressById, getPresentationsByCongressId, getCongressStats } from "./congress-data.js";

const stats = getCongressStats();
let activeCongressId = null;
let activeFilter = "all";

function init() {
  renderStats();
  renderTimeline();
  renderHighlights();
  renderPresentations();
  bindFilters();
}

function renderStats() {
  document.getElementById("stat-congresses").textContent = stats.totalCongresses;
  document.getElementById("stat-presentations").textContent = stats.trackedPresentations;
  document.getElementById("stat-sanofi").textContent = stats.sanofiPresentations;
  document.getElementById("stat-diseases").textContent = stats.diseaseAreas;
  document.getElementById("stat-high-impact").textContent = stats.highImpactCount;
}

function renderTimeline() {
  const container = document.getElementById("congress-timeline");
  container.innerHTML = CONGRESSES.map(c => {
    const isActive = c.id === activeCongressId;
    const presCount = getPresentationsByCongressId(c.id).length;
    return `
    <div class="congress-card ${isActive ? "congress-active" : ""} ${c.status === "upcoming" ? "congress-upcoming" : ""}" data-id="${c.id}">
      <div class="congress-color-bar" style="background:${c.color}"></div>
      <div class="congress-card-body">
        <div class="congress-card-top">
          <div class="congress-icon" style="background:${c.color}15;color:${c.color}"><i class="ti ti-${c.icon}"></i></div>
          <span class="congress-status-badge ${c.status}">${c.status === "completed" ? "Completed" : "Upcoming"}</span>
        </div>
        <div class="congress-name">${esc(c.abbrev)}</div>
        <div class="congress-society">${esc(c.society)}</div>
        <div class="congress-meta">
          <span><i class="ti ti-calendar"></i> ${esc(c.dates)}</span>
          <span><i class="ti ti-map-pin"></i> ${esc(c.location)}</span>
        </div>
        <div class="congress-tags">
          ${c.diseaseAreas.slice(0, 3).map(d => `<span class="congress-tag">${esc(d)}</span>`).join("")}
          ${c.diseaseAreas.length > 3 ? `<span class="congress-tag">+${c.diseaseAreas.length - 3}</span>` : ""}
        </div>
        <div class="congress-pres-count">
          ${presCount > 0 ? `<i class="ti ti-file-text"></i> ${presCount} tracked presentation${presCount !== 1 ? "s" : ""}` : '<i class="ti ti-clock"></i> Data pending'}
        </div>
      </div>
    </div>`;
  }).join("");

  container.querySelectorAll(".congress-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      activeCongressId = activeCongressId === id ? null : id;
      renderTimeline();
      renderHighlights();
      renderPresentations();
    });
  });
}

function renderHighlights() {
  const container = document.getElementById("highlights");
  const pool = activeCongressId
    ? PRESENTATIONS.filter(p => p.congressId === activeCongressId)
    : PRESENTATIONS;
  const highImpact = pool.filter(p => p.impact === "high").slice(0, 4);
  const medium = highImpact.length < 4
    ? pool.filter(p => p.impact !== "high").slice(0, 4 - highImpact.length)
    : [];
  const highlights = [...highImpact, ...medium];

  const heading = document.getElementById("highlights-heading");
  if (heading) {
    const congress = activeCongressId ? getCongressById(activeCongressId) : null;
    heading.textContent = congress ? `${congress.abbrev} — Key highlights` : "High impact highlights";
  }

  if (highlights.length === 0) {
    container.innerHTML = `<div class="pres-empty"><i class="ti ti-file-search"></i> No presentations yet for this congress.</div>`;
    return;
  }

  container.innerHTML = highlights.map(p => {
    const congress = getCongressById(p.congressId);
    return `
    <div class="highlight-card">
      <div class="highlight-top">
        <span class="highlight-congress" style="color:${congress.color}">${esc(congress.abbrev)}</span>
        <span class="highlight-type">${esc(p.type)}</span>
      </div>
      <div class="highlight-title">${esc(p.title)}</div>
      <div class="highlight-findings">
        ${p.keyFindings.slice(0, 2).map(f => `<div class="highlight-finding"><i class="ti ti-check"></i> ${esc(f)}</div>`).join("")}
      </div>
      <div class="highlight-impact"><i class="ti ti-${p.impact === "high" ? "flame" : "star"}""></i> ${p.impact === "high" ? "High impact" : "Notable"} · ${esc(p.diseaseArea)}</div>
    </div>`;
  }).join("");
}

function renderPresentations() {
  const container = document.getElementById("presentations-list");

  let filtered = activeCongressId
    ? PRESENTATIONS.filter(p => p.congressId === activeCongressId)
    : [...PRESENTATIONS];

  if (activeFilter === "sanofi") {
    filtered = filtered.filter(p => p.sanofiData);
  } else if (activeFilter === "high-impact") {
    filtered = filtered.filter(p => p.impact === "high");
  }

  const congressLabel = activeCongressId ? getCongressById(activeCongressId)?.abbrev : "All Congresses";
  document.getElementById("pres-heading").textContent = congressLabel;
  document.getElementById("pres-count").textContent = `${filtered.length} presentation${filtered.length !== 1 ? "s" : ""}`;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="pres-empty"><i class="ti ti-file-search"></i>No presentations match the current filters.</div>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const congress = getCongressById(p.congressId);
    return `
    <div class="pres-card" data-id="${p.id}">
      <div class="pres-card-header">
        <div class="pres-type-badge" style="background:${congress.color}15;color:${congress.color}">${esc(p.type)}</div>
        <span class="pres-congress-label" style="color:${congress.color}">${esc(congress.abbrev)}</span>
        ${p.sanofiData ? '<span class="pres-sanofi"><i class="ti ti-star-filled"></i> Sanofi</span>' : ""}
        ${p.impact === "high" ? '<span class="pres-impact"><i class="ti ti-flame"></i> High impact</span>' : ""}
      </div>
      <div class="pres-title">${esc(p.title)}</div>
      <div class="pres-authors">${esc(p.authors)}</div>
      <div class="pres-abstract">${esc(p.abstract)}</div>
      <div class="pres-findings-section">
        <div class="pres-findings-label">Key Findings</div>
        ${p.keyFindings.map(f => `<div class="pres-finding"><i class="ti ti-arrow-right"></i> ${esc(f)}</div>`).join("")}
      </div>
      <div class="pres-msl-section">
        <div class="pres-msl-label"><i class="ti ti-user-star"></i> MSL Talking Points</div>
        <p>${esc(p.mslTalkingPoints)}</p>
      </div>
      <div class="pres-disease-tag">${esc(p.diseaseArea)}</div>
    </div>`;
  }).join("");
}

function bindFilters() {
  document.querySelectorAll(".pres-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pres-filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderPresentations();
    });
  });
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

init();
