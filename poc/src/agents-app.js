import { BUSINESS_AGENTS, COMPLIANCE_AGENTS, SYSTEM_AGENTS, AGENT_DEMOS, CHART_DATA } from "./agents-data.js";

let activeDemo = null;
let demoRunning = false;

function init() {
  renderStats();
  renderArchitecture();
  renderHubSection();
  renderComplianceStrip();
  renderAgentGrid();
  bindClose();
}

function renderStats() {
  document.getElementById("stat-business").textContent = BUSINESS_AGENTS.length;
  document.getElementById("stat-compliance").textContent = COMPLIANCE_AGENTS.length;
  document.getElementById("stat-hub").textContent = SYSTEM_AGENTS.length;
  const totalSources = SYSTEM_AGENTS.reduce((s, a) => s + a.dataSources.length, 0);
  document.getElementById("stat-sources").textContent = totalSources;
  document.getElementById("stat-pairings").textContent = BUSINESS_AGENTS.reduce((s, a) => s + a.compliancePartners.length, 0);
}

function renderArchitecture() {
  const hubConsumers = document.getElementById("arch-hub-consumers");
  const hubAgents = BUSINESS_AGENTS.filter(a => a.hubDependency?.includes("hcp-explorer"));
  hubConsumers.innerHTML = hubAgents.map(a =>
    `<span class="arch-consumer"><i class="ti ti-${a.icon}"></i> ${esc(a.name)}</span>`
  ).join("");
}

function renderHubSection() {
  const container = document.getElementById("hub-cards");
  container.innerHTML = SYSTEM_AGENTS.map(hub => {
    const hasDemo = !!AGENT_DEMOS[hub.id];
    return `<div class="hub-card ${hasDemo ? "has-demo" : ""}" data-id="${hub.id}">
      <div class="hub-card-header">
        <div class="hub-icon"><i class="ti ti-${hub.icon}"></i></div>
        <div>
          <div class="hub-name">${esc(hub.name)}</div>
          <div class="hub-subtitle">${esc(hub.subtitle)}</div>
        </div>
      </div>
      <div class="hub-desc">${esc(hub.desc)}</div>
      <div class="hub-data-row">
        ${hub.dataSources.map(ds => `<div class="hub-data-chip"><i class="ti ti-${ds.icon}"></i><span class="hub-data-val">${esc(ds.value)}</span><span class="hub-data-label">${esc(ds.label)}</span></div>`).join("")}
      </div>
      <div class="hub-capabilities">
        <div class="hub-cap-label">Core functions</div>
        ${hub.capabilities.map(c => `<div class="hub-cap"><i class="ti ti-check"></i> ${esc(c)}</div>`).join("")}
      </div>
      <div class="hub-consumers-section">
        <div class="hub-cap-label">Powers these agents</div>
        <div class="hub-consumer-tags">
          ${hub.consumers.map(cid => {
            const agent = BUSINESS_AGENTS.find(a => a.id === cid);
            return agent ? `<span class="hub-consumer-tag"><i class="ti ti-${agent.icon}"></i> ${esc(agent.name)}</span>` : "";
          }).join("")}
        </div>
      </div>
      ${hub.id === "literature-intel" ? '<a class="hub-launch-cta" href="/literature.html"><i class="ti ti-external-link"></i> Launch Literature Agent — Live PubMed &amp; NEJM</a>' : ""}
      ${hasDemo ? '<div class="hub-demo-cta"><i class="ti ti-player-play"></i> Run simulated demo</div>' : ""}
    </div>`;
  }).join("");

  container.querySelectorAll(".hub-card.has-demo").forEach(card => {
    card.addEventListener("click", () => openDemo(card.dataset.id));
  });
}

function renderComplianceStrip() {
  const strip = document.getElementById("compliance-strip");
  strip.innerHTML = COMPLIANCE_AGENTS.map(c =>
    `<div class="comp-chip" data-id="${c.id}" title="${esc(c.desc)}">
      <i class="ti ti-${c.icon}"></i><span>${esc(c.name)}</span>
    </div>`
  ).join("");
}

function renderAgentGrid() {
  const grid = document.getElementById("agent-grid");
  grid.innerHTML = BUSINESS_AGENTS.map(a => {
    const hasDemo = !!AGENT_DEMOS[a.id];
    const hubDeps = (a.hubDependency || []).map(hid => {
      const h = SYSTEM_AGENTS.find(s => s.id === hid);
      return h ? h.name : "";
    }).filter(Boolean);
    return `<div class="agent-card ${hasDemo ? "has-demo" : ""}" data-id="${a.id}">
      <div class="agent-card-top">
        <div class="agent-icon"><i class="ti ti-${a.icon}"></i></div>
        <span class="agent-status ${a.status}">${a.status === "active" ? "Active" : "Planned"}</span>
      </div>
      <div class="agent-name">${esc(a.name)}</div>
      <div class="agent-desc">${esc(a.desc)}</div>
      <div class="agent-users">${a.users.map(u => `<span class="agent-user-tag">${esc(u)}</span>`).join("")}</div>
      ${hubDeps.length ? `<div class="agent-hub-dep"><span class="agent-partners-label">Intelligence hub:</span>${hubDeps.map(h => `<span class="hub-dep-badge"><i class="ti ti-topology-star-ring-3"></i> ${esc(h)}</span>`).join("")}</div>` : ""}
      <div class="agent-partners">
        <span class="agent-partners-label">Governance:</span>
        ${a.compliancePartners.map(pid => {
          const c = COMPLIANCE_AGENTS.find(x => x.id === pid);
          return c ? `<span class="agent-partner-badge"><i class="ti ti-${c.icon}"></i> ${esc(c.name)}</span>` : "";
        }).join("")}
      </div>
      ${a.id === "literature-scout" ? '<a class="agent-launch-cta" href="/literature.html"><i class="ti ti-external-link"></i> Launch Live Agent</a>' : ""}
      ${hasDemo ? '<div class="agent-demo-cta"><i class="ti ti-player-play"></i> Run simulated demo</div>' : '<div class="agent-demo-cta planned"><i class="ti ti-clock"></i> Demo coming soon</div>'}
    </div>`;
  }).join("");

  grid.querySelectorAll(".agent-card.has-demo").forEach(card => {
    card.addEventListener("click", () => openDemo(card.dataset.id));
  });
}

async function openDemo(agentId) {
  if (demoRunning) return;
  const agent = BUSINESS_AGENTS.find(a => a.id === agentId) || SYSTEM_AGENTS.find(a => a.id === agentId);
  const demo = AGENT_DEMOS[agentId];
  if (!agent || !demo) return;

  activeDemo = agentId;
  demoRunning = true;

  const panel = document.getElementById("demo-panel");
  const content = document.getElementById("demo-content");
  const title = document.getElementById("demo-title");
  const subtitle = document.getElementById("demo-subtitle");

  title.innerHTML = `<i class="ti ti-${agent.icon}"></i> ${esc(agent.name)}`;
  subtitle.textContent = demo.title;
  content.innerHTML = "";
  panel.style.display = "block";
  document.body.style.overflow = "hidden";
  clearComplianceHighlights();

  for (const step of demo.steps) {
    await delay(600);
    const stepEl = document.createElement("div");
    stepEl.className = `demo-step demo-step-${step.type}`;

    if (step.type === "input") {
      stepEl.innerHTML = `<div class="demo-step-label"><i class="ti ti-message"></i> ${esc(step.label)}</div>
        <div class="demo-input-bubble">${esc(step.content)}</div>`;
      content.appendChild(stepEl);
    } else if (step.type === "processing") {
      stepEl.innerHTML = `<div class="demo-step-label"><i class="ti ti-loader"></i> ${esc(step.label)}</div>
        <div class="demo-processing"></div>`;
      content.appendChild(stepEl);
      const proc = stepEl.querySelector(".demo-processing");
      for (const item of step.items) {
        await delay(400);
        const line = document.createElement("div");
        line.className = "demo-proc-line";
        line.innerHTML = `<i class="ti ti-check"></i> ${esc(item)}`;
        proc.appendChild(line);
        scrollDemo();
      }
    } else if (step.type === "draft") {
      stepEl.innerHTML = `<div class="demo-step-label"><i class="ti ti-file-text"></i> ${esc(step.label)}</div>
        <div class="demo-draft">${renderMd(step.content)}</div>`;
      content.appendChild(stepEl);
    } else if (step.type === "chart") {
      const chartData = CHART_DATA[step.chartId];
      if (chartData) {
        stepEl.innerHTML = `<div class="demo-step-label"><i class="ti ti-chart-bar"></i> ${esc(chartData.title)}</div>
          ${chartData.subtitle ? `<div class="demo-chart-subtitle">${esc(chartData.subtitle)}</div>` : ""}
          <div class="demo-chart-container" id="chart-${step.chartId}"></div>`;
        content.appendChild(stepEl);
        await delay(300);
        renderChart(step.chartId, chartData);
      }
    } else if (step.type === "compliance") {
      stepEl.innerHTML = `<div class="demo-step-label demo-compliance-label"><i class="ti ti-shield-check"></i> ${esc(step.label)}</div>
        <div class="demo-checks"></div>`;
      content.appendChild(stepEl);
      const checksEl = stepEl.querySelector(".demo-checks");
      for (const check of step.checks) {
        await delay(600);
        highlightCompliance(check.agentId);
        const statusClass = check.status === "pass" ? "check-pass" : check.status === "warn" ? "check-warn" : check.status === "flag" ? "check-flag" : "check-logged";
        const statusIcon = check.status === "pass" ? "circle-check" : check.status === "warn" ? "alert-triangle" : check.status === "flag" ? "alert-octagon" : "clipboard-check";
        const statusLabel = check.status === "pass" ? "PASS" : check.status === "warn" ? "CORRECTION" : check.status === "flag" ? "FLAGGED" : "LOGGED";
        const checkEl = document.createElement("div");
        checkEl.className = `demo-check ${statusClass}`;
        checkEl.innerHTML = `<div class="demo-check-header">
            <span class="demo-check-agent"><i class="ti ti-${statusIcon}"></i> ${esc(check.agent)}</span>
            <span class="demo-check-status">${statusLabel}</span>
          </div>
          <div class="demo-check-detail">${esc(check.detail)}</div>`;
        checksEl.appendChild(checkEl);
        scrollDemo();
      }
    } else if (step.type === "output") {
      stepEl.innerHTML = `<div class="demo-step-label demo-output-label"><i class="ti ti-circle-check"></i> ${esc(step.label)}</div>
        ${step.badge ? `<div class="demo-output-badge">${esc(step.badge)}</div>` : ""}
        <div class="demo-output">${esc(step.content)}</div>`;
      content.appendChild(stepEl);
    }
    scrollDemo();
  }
  demoRunning = false;
}

function renderChart(chartId, data) {
  const container = document.getElementById(`chart-${chartId}`);
  if (!container) return;

  if (chartId === "expertPublicationTrend") {
    renderBarChart(container, data);
  } else if (chartId === "expertSegmentation") {
    renderHorizontalBarChart(container, data);
  } else if (chartId === "engagementGap") {
    renderGapTable(container, data);
  } else if (chartId === "congressExpertOverlap") {
    renderCongressChart(container, data);
  } else if (chartId === "advisoryBoardOptimization") {
    renderRosterScoreChart(container, data);
  } else if (chartId === "strategyLandscape") {
    renderHorizontalBarChart(container, data);
  } else if (chartId === "kolInfluenceGrowth") {
    renderBarChart(container, data);
  } else if (chartId === "gapExpertMatch") {
    renderGapExpertChart(container, data);
  }
}

function renderBarChart(container, data) {
  const maxVal = Math.max(...data.datasets[0].data);
  container.innerHTML = `<div class="chart-bar-group">
    ${data.labels.map((label, i) => {
      const val = data.datasets[0].data[i];
      const pct = (val / maxVal) * 100;
      return `<div class="chart-bar-col">
        <div class="chart-bar-value">${val}</div>
        <div class="chart-bar-track"><div class="chart-bar-fill" style="height:${pct}%;background:${data.datasets[0].color}"></div></div>
        <div class="chart-bar-label">${esc(label)}</div>
      </div>`;
    }).join("")}
  </div>
  ${data.datasets[1] ? `<div class="chart-legend"><span style="color:${data.datasets[0].color}">● ${esc(data.datasets[0].label)}</span> <span style="color:${data.datasets[1].color}">● ${esc(data.datasets[1].label)}: ${data.datasets[1].data[data.datasets[1].data.length-1]}</span></div>` : ""}`;
}

function renderHorizontalBarChart(container, data) {
  const maxVal = Math.max(...data.data);
  container.innerHTML = `<div class="chart-hbar-group">
    ${data.labels.map((label, i) => {
      const val = data.data[i];
      const pct = (val / maxVal) * 100;
      return `<div class="chart-hbar-row">
        <div class="chart-hbar-label">${esc(label)}</div>
        <div class="chart-hbar-track"><div class="chart-hbar-fill" style="width:${pct}%;background:${data.colors[i]}"></div></div>
        <div class="chart-hbar-value">${val}</div>
      </div>`;
    }).join("")}
  </div>`;
}

function renderGapTable(container, data) {
  container.innerHTML = `<div class="chart-gap-grid">
    ${data.experts.map(e => `<div class="chart-gap-card">
      <div class="chart-gap-header">
        <span class="chart-gap-name">${esc(e.name)}</span>
        <span class="chart-gap-tier">${esc(e.tier)}</span>
      </div>
      <div class="chart-gap-inst">${esc(e.institution)} · ${esc(e.area)}</div>
      <div class="chart-gap-bars">
        <div class="chart-gap-metric">
          <span>Pub growth</span>
          <div class="chart-gap-bar-track"><div class="chart-gap-bar-fill" style="width:${e.pubGrowth}%;background:#7a00e6"></div></div>
          <span class="chart-gap-pct">+${e.pubGrowth}%</span>
        </div>
        <div class="chart-gap-metric">
          <span>Sanofi engagement</span>
          <div class="chart-gap-bar-track"><div class="chart-gap-bar-fill" style="width:${Math.max(e.sanofiInteractions * 25, 3)}%;background:${e.sanofiInteractions === 0 ? '#ef4444' : '#f59e0b'}"></div></div>
          <span class="chart-gap-pct ${e.sanofiInteractions === 0 ? 'gap-zero' : ''}">${e.sanofiInteractions === 0 ? 'None' : e.sanofiInteractions}</span>
        </div>
      </div>
    </div>`).join("")}
  </div>`;
}

function renderCongressChart(container, data) {
  container.innerHTML = `<div class="chart-congress">
    <div class="chart-congress-stats">
      <div class="chart-congress-stat"><div class="chart-congress-num">${data.presenting}</div><div>Presenting</div></div>
      <div class="chart-congress-stat"><div class="chart-congress-num">${data.publishingNewData}</div><div>New data</div></div>
      <div class="chart-congress-stat" style="color:#166534"><div class="chart-congress-num">${data.sanofiEngaged}</div><div>Sanofi engaged</div></div>
      <div class="chart-congress-stat" style="color:#991b1b"><div class="chart-congress-num">${data.unengagedHighValue}</div><div>Unengaged (high-value)</div></div>
    </div>
    <div class="chart-congress-tracks">
      ${data.byTrack.map(t => `<div class="chart-congress-track">
        <div class="chart-congress-track-label">${esc(t.track)}</div>
        <div class="chart-congress-track-bar">
          <div class="chart-congress-engaged" style="width:${((t.experts - t.sanofiGap) / t.experts) * 100}%"></div>
          <div class="chart-congress-gap" style="width:${(t.sanofiGap / t.experts) * 100}%"></div>
        </div>
        <div class="chart-congress-track-nums"><span>${t.experts} experts</span><span class="chart-gap-flag">${t.sanofiGap} unengaged</span></div>
      </div>`).join("")}
    </div>
    <div class="chart-legend"><span style="color:#7a00e6">● Sanofi engaged</span> <span style="color:#ef4444">● Engagement gap</span></div>
  </div>`;
}

function renderRosterScoreChart(container, data) {
  container.innerHTML = `<div class="chart-roster">
    <div class="chart-roster-constraints">${esc(data.constraints)}</div>
    ${data.roster.map(r => `<div class="chart-roster-row">
      <div class="chart-roster-info">
        <div class="chart-roster-name">${esc(r.name)}</div>
        <div class="chart-roster-inst">${esc(r.institution)} · ${esc(r.region)}</div>
      </div>
      <div class="chart-roster-score-bar">
        <div class="chart-roster-fill" style="width:${r.score}%"></div>
      </div>
      <div class="chart-roster-score">${r.score}</div>
      <span class="chart-roster-tier">${esc(r.tier)}</span>
    </div>`).join("")}
  </div>`;
}

function renderGapExpertChart(container, data) {
  container.innerHTML = `<div class="chart-gap-expert">
    <div class="chart-gap-expert-legend">
      ${data.data.map(d => `<span class="chart-gap-expert-key"><span class="chart-gap-expert-dot" style="background:${d.color}"></span>${esc(d.name)}</span>`).join("")}
    </div>
    ${data.labels.map((label, i) => `<div class="chart-gap-expert-row">
      <div class="chart-gap-expert-label">${esc(label)}</div>
      <div class="chart-gap-expert-bars">
        ${data.data.map(d => `<div class="chart-gap-expert-bar-wrap">
          <div class="chart-gap-expert-bar" style="width:${d.scores[i]}%;background:${d.color}"></div>
          <span class="chart-gap-expert-val">${d.scores[i]}</span>
        </div>`).join("")}
      </div>
    </div>`).join("")}
  </div>`;
}

function closeDemo() {
  document.getElementById("demo-panel").style.display = "none";
  document.body.style.overflow = "";
  activeDemo = null;
  demoRunning = false;
  clearComplianceHighlights();
}

function bindClose() {
  document.getElementById("demo-close").addEventListener("click", closeDemo);
  document.getElementById("demo-panel").addEventListener("click", (e) => {
    if (e.target.id === "demo-panel") closeDemo();
  });
}

function highlightCompliance(agentId) {
  const chip = document.querySelector(`.comp-chip[data-id="${agentId}"]`);
  if (chip) chip.classList.add("comp-active");
}

function clearComplianceHighlights() {
  document.querySelectorAll(".comp-chip.comp-active").forEach(c => c.classList.remove("comp-active"));
}

function scrollDemo() {
  const content = document.getElementById("demo-content");
  requestAnimationFrame(() => { content.scrollTop = content.scrollHeight; });
}

function renderMd(text) {
  let html = esc(text);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/\n(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/g, (match, headerRow, sepRow, bodyRows) => {
    const headers = headerRow.split("|").filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join("");
    const rows = bodyRows.trim().split("\n").map(row => {
      const cells = row.split("|").filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("");
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, "<ul>$1</ul>");
  html = html.split("\n\n").map(block => {
    if (block.startsWith("<") || block.trim() === "") return block;
    return `<p>${block}</p>`;
  }).join("\n");
  return html;
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

init();
