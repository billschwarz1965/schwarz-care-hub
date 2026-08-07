import { DISEASES, PATHWAYS, getDiseaseById, getConnectedDiseases, getDiseasesByPathway, getPathway } from "./disease-data.js";

const gridEl = document.getElementById("disease-grid");
const detailEl = document.getElementById("disease-detail");
const detailContent = document.getElementById("detail-content");
const closeBtn = document.getElementById("detail-close");
const filterBtns = document.querySelectorAll(".filter-btn");

let activeFilter = "all";
let activeDiseaseId = null;

function init() {
  renderStats();
  renderGrid();
  bindFilters();
  closeBtn.addEventListener("click", closeDetail);
}

function renderStats() {
  document.getElementById("stat-diseases").textContent = DISEASES.length;
  document.getElementById("stat-pathways").textContent = Object.keys(PATHWAYS).length;
  const allConnections = new Set();
  DISEASES.forEach(d => d.connections.forEach(c => {
    const key = [d.id, c].sort().join("-");
    allConnections.add(key);
  }));
  document.getElementById("stat-connections").textContent = allConnections.size;
  const sanofiCount = DISEASES.filter(d => d.sanofiRole.includes("Dupixent") || d.sanofiRole.includes("Kevzara")).length;
  document.getElementById("stat-sanofi").textContent = sanofiCount;
}

function renderGrid() {
  const filtered = activeFilter === "all"
    ? DISEASES
    : DISEASES.filter(d => d.pathways.includes(activeFilter));

  gridEl.innerHTML = filtered.map(d => {
    const pathway = getPathway(d.pathways[0]);
    const isActive = d.id === activeDiseaseId;
    const isConnected = activeDiseaseId && getDiseaseById(activeDiseaseId)?.connections.includes(d.id);
    const hasSanofi = d.sanofiRole.includes("Dupixent") || d.sanofiRole.includes("Kevzara");

    return `
    <div class="disease-card ${isActive ? "card-active" : ""} ${isConnected ? "card-connected" : ""}" data-id="${d.id}">
      <div class="card-top">
        <div class="card-icon"><i class="ti ti-${d.icon}"></i></div>
        <div class="card-area">${escapeHtml(d.area)}</div>
      </div>
      <div class="card-name">${escapeHtml(d.name)}</div>
      <div class="card-prevalence">${escapeHtml(d.prevalence)}</div>
      <div class="card-tags">
        <span class="pathway-tag" style="background:${pathway.color}15;color:${pathway.color};border:1px solid ${pathway.color}30">${escapeHtml(pathway.name)}</span>
        ${hasSanofi ? '<span class="sanofi-tag"><i class="ti ti-star-filled"></i> Sanofi</span>' : ""}
      </div>
      <div class="card-connections">
        <i class="ti ti-link"></i> ${d.connections.length} connection${d.connections.length !== 1 ? "s" : ""}
      </div>
    </div>`;
  }).join("");

  gridEl.querySelectorAll(".disease-card").forEach(card => {
    card.addEventListener("click", () => openDetail(card.dataset.id));
  });
}

function openDetail(id) {
  const d = getDiseaseById(id);
  if (!d) return;
  activeDiseaseId = id;
  renderGrid();

  const pathway = getPathway(d.pathways[0]);
  const connected = getConnectedDiseases(id);

  detailContent.innerHTML = `
    <div class="detail-header">
      <div class="detail-icon" style="background:${pathway.color}15;color:${pathway.color}"><i class="ti ti-${d.icon}"></i></div>
      <div>
        <h2>${escapeHtml(d.name)}</h2>
        <div class="detail-area">${escapeHtml(d.area)} · ${escapeHtml(d.abbrev)}</div>
      </div>
    </div>

    <div class="detail-section">
      <h3>Prevalence</h3>
      <p>${escapeHtml(d.prevalence)}</p>
    </div>

    <div class="detail-section">
      <h3>Disease Burden</h3>
      <p>${escapeHtml(d.burden)}</p>
    </div>

    <div class="detail-section">
      <h3>Pathophysiology</h3>
      <p>${escapeHtml(d.pathophysiology)}</p>
    </div>

    <div class="detail-section">
      <h3>Key Biomarkers</h3>
      <div class="biomarker-tags">
        ${d.keyBiomarkers.map(b => `<span class="biomarker-tag">${escapeHtml(b)}</span>`).join("")}
      </div>
    </div>

    <div class="detail-section">
      <h3>Inflammatory Pathway</h3>
      <div class="pathway-detail" style="border-left:3px solid ${pathway.color}">
        <div class="pathway-name" style="color:${pathway.color}">${escapeHtml(pathway.name)}</div>
        <p>${escapeHtml(pathway.description)}</p>
        <div class="cytokine-row">
          <span class="cytokine-label">Cytokines:</span>
          ${pathway.cytokines.map(c => `<span class="cytokine-chip">${escapeHtml(c)}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h3>Treatment Landscape</h3>
      ${d.treatmentLandscape.map(t => `
        <div class="tx-category">
          <div class="tx-cat-label">${escapeHtml(t.category)}</div>
          <div class="tx-agents">${t.agents.map(a => `<span class="tx-agent">${escapeHtml(a)}</span>`).join("")}</div>
        </div>
      `).join("")}
    </div>

    <div class="detail-section sanofi-section">
      <h3><i class="ti ti-star-filled"></i> Sanofi Positioning</h3>
      <p>${escapeHtml(d.sanofiRole)}</p>
    </div>

    <div class="detail-section">
      <h3><i class="ti ti-link"></i> Cross-TA Connections</h3>
      <p class="connection-reason">${escapeHtml(d.connectionReason)}</p>
      <div class="connected-cards">
        ${connected.map(c => `
          <div class="connected-card" data-id="${c.id}">
            <i class="ti ti-${c.icon}"></i>
            <div>
              <div class="connected-name">${escapeHtml(c.name)}</div>
              <div class="connected-area">${escapeHtml(c.area)}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  detailContent.querySelectorAll(".connected-card").forEach(card => {
    card.addEventListener("click", () => {
      openDetail(card.dataset.id);
      detailEl.scrollTop = 0;
    });
  });

  detailEl.classList.add("open");
  detailEl.scrollTop = 0;
}

function closeDetail() {
  detailEl.classList.remove("open");
  activeDiseaseId = null;
  renderGrid();
}

function bindFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.pathway;
      closeDetail();
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

init();
