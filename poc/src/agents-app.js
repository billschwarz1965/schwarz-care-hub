import { BUSINESS_AGENTS, COMPLIANCE_AGENTS, SYSTEM_AGENTS, AGENT_DEMOS, CHART_DATA } from "./agents-data.js";
import { speak, speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";

let activeDemo = null;
let demoRunning = false;
let activePersona = null;

const PERSONA_MAP = {
  "MSLs": {
    icon: "user-star",
    title: "MSL Field Teams",
    desc: "AI copilots and intelligence tools that make every field interaction data-driven, compliant, and actionable",
    userTags: ["MSLs", "Field Medical"],
  },
  "HCPs": {
    icon: "stethoscope",
    title: "Healthcare Professionals",
    desc: "Point-of-care intelligence, clinical trial matching, ingredient safety, and on-demand MSL connections",
    userTags: ["HCPs", "Pharmacists"],
  },
  "Patients": {
    icon: "heart",
    title: "Patients & Caregivers",
    desc: "Treatment navigation, support programs, and safety-first interactions with built-in pharmacovigilance",
    userTags: ["Patients"],
  },
  "Home office": {
    icon: "building",
    title: "Home Office & Medical Affairs",
    desc: "Strategic intelligence, expert landscape analysis, segmentation, and evidence generation planning",
    userTags: ["Home Office", "Medical Affairs", "Clinical Operations"],
  },
};

function init() {
  renderStats();
  renderArchitecture();
  bindPersonas();
  bindHubPods();
  bindGovPods();
  renderHubSection();
  renderComplianceStrip();
  renderAgentGrid();
  bindStatPills();
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

function bindStatPills() {
  const row = document.querySelector(".stats-row");
  row.addEventListener("click", (e) => {
    const pill = e.target.closest(".stat-pill[data-target]");
    if (!pill) return;
    const targetId = pill.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;

    document.querySelectorAll(".stat-pill.stat-active").forEach(el => el.classList.remove("stat-active"));
    pill.classList.add("stat-active");
    setTimeout(() => pill.classList.remove("stat-active"), 2000);

    const section = target.closest(".section");
    if (section) {
      section.classList.remove("section-highlight");
      void section.offsetWidth;
      section.classList.add("section-highlight");
      setTimeout(() => section.classList.remove("section-highlight"), 1500);
    }

    const el = section || target;
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  });
}

function renderArchitecture() {
  const hubConsumers = document.getElementById("arch-hub-consumers");
  const hubAgents = BUSINESS_AGENTS.filter(a => a.hubDependency?.includes("hcp-explorer"));
  hubConsumers.innerHTML = hubAgents.map(a =>
    `<span class="arch-consumer" data-agent-id="${a.id}"><i class="ti ti-${a.icon}"></i> ${esc(a.name)}</span>`
  ).join("");

  hubConsumers.addEventListener("click", (e) => {
    const pod = e.target.closest(".arch-consumer[data-agent-id]");
    if (!pod) return;
    const agentId = pod.dataset.agentId;
    const card = document.querySelector(`.agent-card[data-id="${agentId}"]`);
    if (!card) return;

    document.querySelectorAll(".arch-consumer.pod-active").forEach(el => el.classList.remove("pod-active"));
    pod.classList.add("pod-active");

    document.querySelectorAll(".agent-card.pod-highlight").forEach(el => el.classList.remove("pod-highlight"));
    card.classList.add("pod-highlight");
    card.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      card.classList.remove("pod-highlight");
      pod.classList.remove("pod-active");
    }, 2400);
  });
}

function bindPersonas() {
  const uxLayer = document.querySelector(".arch-ux-personas");
  if (!uxLayer) return;

  uxLayer.addEventListener("click", (e) => {
    const span = e.target.closest(".arch-ux-personas span");
    if (!span) return;
    const label = span.textContent.trim();
    const persona = PERSONA_MAP[label];
    if (!persona) return;

    if (activePersona === label) {
      closePersonaPanel();
      return;
    }

    document.querySelectorAll(".arch-ux-personas span.persona-active").forEach(el => el.classList.remove("persona-active"));
    span.classList.add("persona-active");
    activePersona = label;
    renderPersonaPanel(label, persona);
  });
}

function renderPersonaPanel(label, persona) {
  const panel = document.getElementById("persona-panel");
  const agents = BUSINESS_AGENTS.filter(a =>
    a.users.some(u => persona.userTags.includes(u))
  );
  const activeCount = agents.filter(a => a.status === "active").length;
  const plannedCount = agents.filter(a => a.status === "planned").length;

  panel.innerHTML = `
    <div class="persona-panel-header">
      <div>
        <div class="persona-panel-title"><i class="ti ti-${persona.icon}"></i> ${esc(persona.title)}</div>
        <div class="persona-panel-desc">${esc(persona.desc)}</div>
      </div>
      <button class="persona-panel-close" id="persona-close"><i class="ti ti-x"></i></button>
    </div>
    <div class="persona-panel-body">
      <div class="persona-stat-row">
        <div class="persona-stat"><div class="persona-stat-num">${agents.length}</div><div class="persona-stat-label">Available agents</div></div>
        <div class="persona-stat"><div class="persona-stat-num">${activeCount}</div><div class="persona-stat-label">Active</div></div>
        ${plannedCount > 0 ? `<div class="persona-stat"><div class="persona-stat-num">${plannedCount}</div><div class="persona-stat-label">Planned</div></div>` : ""}
        <div class="persona-stat"><div class="persona-stat-num">${agents.reduce((s, a) => s + a.compliancePartners.length, 0)}</div><div class="persona-stat-label">Governance checks</div></div>
      </div>
      <div class="persona-agent-list">
        ${agents.map(a => `
          <div class="persona-agent" data-agent-id="${a.id}">
            <div class="persona-agent-top">
              <div class="persona-agent-icon"><i class="ti ti-${a.icon}"></i></div>
              <div class="persona-agent-name">${esc(a.name)}</div>
              <span class="persona-agent-status ${a.status}">${a.status === "active" ? "Active" : "Planned"}</span>
            </div>
            <div class="persona-agent-desc">${esc(a.desc)}</div>
          </div>
        `).join("")}
      </div>
    </div>`;

  panel.classList.add("visible");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });

  panel.querySelector("#persona-close").addEventListener("click", closePersonaPanel);

  panel.querySelectorAll(".persona-agent[data-agent-id]").forEach(el => {
    el.addEventListener("click", () => {
      const card = document.querySelector(`.agent-card[data-id="${el.dataset.agentId}"]`);
      if (!card) return;
      document.querySelectorAll(".agent-card.pod-highlight").forEach(c => c.classList.remove("pod-highlight"));
      card.classList.add("pod-highlight");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => card.classList.remove("pod-highlight"), 2400);
    });
  });
}

function closePersonaPanel() {
  const panel = document.getElementById("persona-panel");
  panel.classList.remove("visible");
  document.querySelectorAll(".arch-ux-personas span.persona-active").forEach(el => el.classList.remove("persona-active"));
  activePersona = null;
}

function bindGovPods() {
  const container = document.getElementById("arch-gov-pods");
  container.innerHTML = COMPLIANCE_AGENTS.map(c =>
    `<span class="arch-gov-pod" data-gov-id="${c.id}"><i class="ti ti-${c.icon}"></i> ${esc(c.name)}</span>`
  ).join("");

  container.addEventListener("click", (e) => {
    const pod = e.target.closest(".arch-gov-pod[data-gov-id]");
    if (!pod) return;
    const govId = pod.dataset.govId;
    const comp = COMPLIANCE_AGENTS.find(c => c.id === govId);
    if (!comp) return;

    const chip = document.querySelector(`.comp-chip[data-id="${govId}"]`);
    if (chip) {
      const section = chip.closest(".section");
      const top = (section || chip).getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });

      setTimeout(() => chip.click(), 500);
    }

    document.querySelectorAll(".arch-gov-pod.gov-pod-active").forEach(el => el.classList.remove("gov-pod-active"));
    pod.classList.add("gov-pod-active");
    setTimeout(() => pod.classList.remove("gov-pod-active"), 2500);
  });
}

let activeHubPod = null;

function bindHubPods() {
  const container = document.getElementById("arch-hub-pods");
  container.innerHTML = SYSTEM_AGENTS.map(hub =>
    `<span class="arch-hub-pod" data-hub-id="${hub.id}"><i class="ti ti-${hub.icon}"></i> ${esc(hub.name)}</span>`
  ).join("");

  container.addEventListener("click", (e) => {
    const pod = e.target.closest(".arch-hub-pod[data-hub-id]");
    if (!pod) return;
    const hubId = pod.dataset.hubId;

    if (activeHubPod === hubId) {
      closeHubDepPanel();
      return;
    }

    const hub = SYSTEM_AGENTS.find(h => h.id === hubId);
    if (!hub) return;

    document.querySelectorAll(".arch-hub-pod.hub-pod-active").forEach(el => el.classList.remove("hub-pod-active"));
    pod.classList.add("hub-pod-active");
    activeHubPod = hubId;
    renderHubDepPanel(hub);
  });
}

function renderHubDepPanel(hub) {
  const panel = document.getElementById("hub-dep-panel");
  const dependents = BUSINESS_AGENTS.filter(a => (a.hubDependency || []).includes(hub.id));

  panel.innerHTML = `
    <div class="hub-dep-panel-header">
      <div>
        <div class="hub-dep-panel-title"><i class="ti ti-${hub.icon}"></i> ${esc(hub.name)}</div>
        <div class="hub-dep-panel-desc">${esc(hub.desc)}</div>
      </div>
      <button class="hub-dep-panel-close" id="hub-dep-close"><i class="ti ti-x"></i></button>
    </div>
    <div class="hub-dep-panel-body">
      <div class="hub-dep-stat-row">
        <div class="hub-dep-stat"><div class="hub-dep-stat-num">${dependents.length}</div><div class="hub-dep-stat-label">Dependent agents</div></div>
        <div class="hub-dep-stat"><div class="hub-dep-stat-num">${dependents.filter(a => a.status === "active").length}</div><div class="hub-dep-stat-label">Active</div></div>
        <div class="hub-dep-stat"><div class="hub-dep-stat-num">${hub.dataSources.length}</div><div class="hub-dep-stat-label">Data sources</div></div>
      </div>
      <div class="hub-dep-agent-list">
        ${dependents.map(a => `
          <div class="hub-dep-agent" data-agent-id="${a.id}">
            <div class="hub-dep-agent-top">
              <div class="hub-dep-agent-icon"><i class="ti ti-${a.icon}"></i></div>
              <div class="hub-dep-agent-name">${esc(a.name)}</div>
            </div>
            <div class="hub-dep-agent-desc">${esc(a.desc)}</div>
          </div>
        `).join("")}
      </div>
    </div>`;

  panel.classList.add("visible");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });

  panel.querySelector("#hub-dep-close").addEventListener("click", closeHubDepPanel);

  panel.querySelectorAll(".hub-dep-agent[data-agent-id]").forEach(el => {
    el.addEventListener("click", () => {
      const card = document.querySelector(`.agent-card[data-id="${el.dataset.agentId}"]`);
      if (!card) return;
      document.querySelectorAll(".agent-card.pod-highlight").forEach(c => c.classList.remove("pod-highlight"));
      card.classList.add("pod-highlight");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => card.classList.remove("pod-highlight"), 2400);
    });
  });
}

function closeHubDepPanel() {
  const panel = document.getElementById("hub-dep-panel");
  panel.classList.remove("visible");
  document.querySelectorAll(".arch-hub-pod.hub-pod-active").forEach(el => el.classList.remove("hub-pod-active"));
  activeHubPod = null;
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

let activeGovernance = null;

function renderComplianceStrip() {
  const strip = document.getElementById("compliance-strip");
  strip.innerHTML = COMPLIANCE_AGENTS.map(c =>
    `<div class="comp-chip" data-id="${c.id}" title="${esc(c.desc)}">
      <i class="ti ti-${c.icon}"></i><span>${esc(c.name)}</span>
    </div>`
  ).join("");

  strip.addEventListener("click", (e) => {
    const chip = e.target.closest(".comp-chip[data-id]");
    if (!chip) return;
    const compId = chip.dataset.id;

    if (activeGovernance === compId) {
      closeGovernancePanel();
      return;
    }

    const comp = COMPLIANCE_AGENTS.find(c => c.id === compId);
    if (!comp) return;

    document.querySelectorAll(".comp-chip.comp-selected").forEach(el => el.classList.remove("comp-selected"));
    chip.classList.add("comp-selected");
    activeGovernance = compId;
    renderGovernancePanel(comp);
  });
}

function renderGovernancePanel(comp) {
  const panel = document.getElementById("governance-panel");
  const supervised = BUSINESS_AGENTS.filter(a => a.compliancePartners.includes(comp.id));

  const hasDemo = !!AGENT_DEMOS[comp.id];
  panel.innerHTML = `
    <div class="governance-panel-header">
      <div>
        <div class="governance-panel-title"><i class="ti ti-${comp.icon}"></i> ${esc(comp.name)}</div>
        <div class="governance-panel-desc">${esc(comp.desc)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        ${hasDemo ? `<button class="governance-demo-btn" id="governance-demo-btn"><i class="ti ti-player-play"></i> Run demo</button>` : ""}
        <button class="governance-panel-close" id="governance-close"><i class="ti ti-x"></i></button>
      </div>
    </div>
    <div class="governance-panel-body">
      <div class="governance-stat-row">
        <div class="governance-stat"><div class="governance-stat-num">${supervised.length}</div><div class="governance-stat-label">Supervised agents</div></div>
        <div class="governance-stat"><div class="governance-stat-num">${supervised.filter(a => a.status === "active").length}</div><div class="governance-stat-label">Active</div></div>
      </div>
      <div class="governance-agent-list">
        ${supervised.map(a => `
          <div class="governance-agent" data-agent-id="${a.id}">
            <div class="governance-agent-top">
              <div class="governance-agent-icon"><i class="ti ti-${a.icon}"></i></div>
              <div class="governance-agent-name">${esc(a.name)}</div>
            </div>
            <div class="governance-agent-desc">${esc(a.desc)}</div>
          </div>
        `).join("")}
      </div>
    </div>`;

  panel.classList.add("visible");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });

  panel.querySelector("#governance-close").addEventListener("click", closeGovernancePanel);

  const demoBtn = panel.querySelector("#governance-demo-btn");
  if (demoBtn) demoBtn.addEventListener("click", () => openDemo(comp.id));

  panel.querySelectorAll(".governance-agent[data-agent-id]").forEach(el => {
    el.addEventListener("click", () => {
      const card = document.querySelector(`.agent-card[data-id="${el.dataset.agentId}"]`);
      if (!card) return;
      document.querySelectorAll(".agent-card.pod-highlight").forEach(c => c.classList.remove("pod-highlight"));
      card.classList.add("pod-highlight");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => card.classList.remove("pod-highlight"), 2400);
    });
  });
}

function closeGovernancePanel() {
  const panel = document.getElementById("governance-panel");
  panel.classList.remove("visible");
  document.querySelectorAll(".comp-chip.comp-selected").forEach(el => el.classList.remove("comp-selected"));
  activeGovernance = null;
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
      ${a.id === "trial-intel" ? '<div class="agent-launch-cta" style="cursor:pointer" data-action="live-trials"><i class="ti ti-flask"></i> Live Trial Search</div>' : ""}
      ${hasDemo ? '<div class="agent-demo-cta"><i class="ti ti-player-play"></i> Run simulated demo</div>' : '<div class="agent-demo-cta planned"><i class="ti ti-clock"></i> Demo coming soon</div>'}
    </div>`;
  }).join("");

  grid.querySelectorAll("[data-action='live-trials']").forEach(btn => {
    btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); openTrialSearch(); });
  });
  grid.querySelectorAll(".agent-card.has-demo").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-action='live-trials']")) return;
      if (e.target.closest(".agent-launch-cta")) return;
      openDemo(card.dataset.id);
    });
  });
}

async function openDemo(agentId) {
  if (demoRunning) return;
  const agent = BUSINESS_AGENTS.find(a => a.id === agentId) || SYSTEM_AGENTS.find(a => a.id === agentId) || COMPLIANCE_AGENTS.find(a => a.id === agentId);
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
  showDemoPrompt(agentId);
}

function showDemoPrompt(agentId) {
  const promptRow = document.getElementById("demo-prompt-row");
  const promptInput = document.getElementById("demo-prompt-input");
  const promptSend = document.getElementById("demo-prompt-send");
  if (!promptRow) return;

  const PROMPT_AGENTS = ["advisory-board", "expert-segment", "strategy-advisor", "gap-expert"];
  if (!PROMPT_AGENTS.includes(agentId)) { promptRow.style.display = "none"; return; }

  const placeholders = {
    "advisory-board": "Ask about advisory board design...",
    "expert-segment": "Ask about expert segmentation...",
    "strategy-advisor": "Ask about medical strategy...",
    "gap-expert": "Ask about engagement gaps..."
  };
  promptInput.placeholder = placeholders[agentId] || "Ask a follow-up question...";
  promptRow.style.display = "flex";
  promptInput.value = "";
  promptSend.disabled = true;
  promptInput.focus();
}

function generateDemoPromptResponse(agentId, query) {
  const q = query.toLowerCase();

  if (agentId === "advisory-board") {
    if (/roster|member|who|list|recommend/i.test(q))
      return `<strong>Roster Recommendation</strong><br>Based on your criteria, the Advisory Board Builder would query the Expert Intelligence Hub across 4,200+ dermatology profiles. The optimization algorithm balances scientific impact (40%), geographic representation (20%), expertise diversity (20%), engagement history (10%), and community mix (10%).<br><br>For a typical 14-member Global AD board: 8 US, 4 EU, 2 APAC — with 43% women representation and biomarker expertise coverage across TARC/CCL17, IgE phenotyping, and filaggrin genotyping.`;
    if (/criteria|constraint|require|rule/i.test(q))
      return `<strong>Configurable Constraints</strong><br>The Advisory Board Builder supports these optimization parameters:<br>• <strong>Regional quotas</strong> — specify seats per region (US/EU/APAC/LATAM)<br>• <strong>Academic/community mix</strong> — target ratio for practice setting diversity<br>• <strong>Expertise tags</strong> — required specializations (e.g., biomarkers, PRO measures)<br>• <strong>Exclusions</strong> — speaker bureau, competitor engagement, recent participation<br>• <strong>Tier mix</strong> — Global KOL, National KOL, Rising Star, Community Influencer`;
    if (/score|rank|method|algorithm|how/i.test(q))
      return `<strong>Scoring Methodology</strong><br>Each candidate receives a composite score (0–100) based on:<br>• <strong>Publication impact</strong> (40%) — h-index, recent AD-specific citations, first/last author ratio<br>• <strong>Geographic representation</strong> (20%) — fills gaps in current roster geography<br>• <strong>Expertise diversity</strong> (20%) — unique sub-specialty coverage vs. existing members<br>• <strong>Engagement history</strong> (10%) — prior Sanofi interactions, relationship strength from OneCRM<br>• <strong>Community balance</strong> (10%) — academic vs. community practice setting<br><br>Governance layer validates PHI protection, explainability of selection, and creates an immutable audit trail.`;
    if (/compliance|governance|audit|privacy/i.test(q))
      return `<strong>Governance Layer</strong><br>Every advisory board roster passes through 3 compliance agents before delivery:<br>• <strong>PHI Protection</strong> — ensures only professional profiles are exposed, no personal data or compensation history<br>• <strong>AI Explainability</strong> — provides full selection rationale with weightings, so Medical Affairs can defend each choice<br>• <strong>Audit Trail</strong> — logs candidate pool size, constraints applied, and final selections with compliance record ID`;
    if (/region|geo|country|eu|apac|us|global/i.test(q))
      return `<strong>Geographic Coverage</strong><br>The Expert Intelligence Hub profiles HCPs across 42 countries. For advisory boards, the builder can optimize across:<br>• <strong>US</strong> — 2,100+ profiled AD experts, academic medical centers and community practices<br>• <strong>EU</strong> — 1,400+ experts across UK, Germany, France, Netherlands, Nordics<br>• <strong>APAC</strong> — 500+ experts in Japan, Korea, Australia, China<br>• <strong>LATAM</strong> — 200+ emerging profiles in Brazil, Mexico, Argentina<br><br>The algorithm automatically balances geographic slots to maximize perspective diversity while meeting regional quota constraints.`;
    if (/pediatric|child|paediatric/i.test(q))
      return `<strong>Pediatric Focus</strong><br>For pediatric-focused advisory boards, the builder filters for:<br>• Investigators with pediatric AD trial experience<br>• Authors of pediatric-specific publications and guidelines<br>• Experts at children's hospitals or pediatric dermatology programs<br><br>Example: Dr. S. Barbarot (CHU Nantes) — pediatric AD expert, EASI validation lead, scores 91/100 for a pediatric-weighted board.`;
    return `<strong>Advisory Board Builder</strong><br>I can help with advisory board design questions. Try asking about:<br>• Roster recommendations and member selection<br>• Scoring methodology and ranking algorithms<br>• Configurable constraints and optimization parameters<br>• Geographic coverage and regional quotas<br>• Compliance and governance review process`;
  }

  if (agentId === "expert-segment") {
    if (/rising|star|emerging/i.test(q))
      return `<strong>Rising Stars</strong><br>The segmentation model identifies rising stars through: >40% publication growth (3-year trend), increasing congress abstract acceptance, early-career PI roles, and low current Sanofi engagement. These represent the highest-value outreach targets for MSL teams.`;
    if (/tier|kol|classif/i.test(q))
      return `<strong>Tier Classification</strong><br>Experts are classified into 4 tiers based on composite scoring:<br>• <strong>Global KOL</strong> — guideline authors, major trial PIs, 50+ publications<br>• <strong>National KOL</strong> — regional thought leaders, 20+ publications, society roles<br>• <strong>Rising Star</strong> — high publication growth, emerging congress presence<br>• <strong>Community Influencer</strong> — high patient volume, practice pattern leadership`;
    return `<strong>Expert Segmentation</strong><br>I can help with segmentation questions. Try asking about tier classifications, rising star identification, or engagement gap analysis.`;
  }

  return `<strong>${esc(agentId)}</strong><br>This agent's prompt capabilities are available. Try asking a specific question about its domain.`;
}

function handleDemoPrompt() {
  const input = document.getElementById("demo-prompt-input");
  const content = document.getElementById("demo-content");
  const query = input.value.trim();
  if (!query || demoRunning || !activeDemo) return;

  const qEl = document.createElement("div");
  qEl.className = "demo-prompt-q";
  qEl.textContent = query;
  content.appendChild(qEl);

  const response = generateDemoPromptResponse(activeDemo, query);
  const rEl = document.createElement("div");
  rEl.className = "demo-prompt-response";
  rEl.innerHTML = response;
  content.appendChild(rEl);

  input.value = "";
  document.getElementById("demo-prompt-send").disabled = true;
  content.scrollTop = content.scrollHeight;
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
  } else if (chartId === "mlrReviewSummary") {
    renderHorizontalBarChart(container, data);
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
  document.getElementById("demo-prompt-row").style.display = "none";
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
  const promptInput = document.getElementById("demo-prompt-input");
  const promptSend = document.getElementById("demo-prompt-send");
  if (promptInput && promptSend) {
    promptInput.addEventListener("input", () => { promptSend.disabled = !promptInput.value.trim(); });
    promptInput.addEventListener("keydown", (e) => { if (e.key === "Enter" && promptInput.value.trim()) handleDemoPrompt(); });
    promptSend.addEventListener("click", handleDemoPrompt);
  }
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

// ─── LIVE TRIAL SEARCH ───

const TRIALS_BASE = "/api/trials";
const trialOverlay = document.getElementById("trial-search-overlay");
const trialInput = document.getElementById("trial-search-input");
const trialSearchBtn = document.getElementById("trial-search-btn");
const trialResults = document.getElementById("trial-results");
const trialCloseBtn = document.getElementById("trial-search-close");

function openTrialSearch() {
  if (!trialOverlay) return;
  trialOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";
  trialInput.focus();
}

function closeTrialSearch() {
  if (!trialOverlay) return;
  trialOverlay.classList.remove("visible");
  document.body.style.overflow = "";
}

if (trialCloseBtn) {
  trialCloseBtn.addEventListener("click", closeTrialSearch);
  trialOverlay.addEventListener("click", (e) => { if (e.target === trialOverlay) closeTrialSearch(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && trialOverlay.classList.contains("visible")) closeTrialSearch(); });
}

if (trialSearchBtn) {
  trialSearchBtn.addEventListener("click", runTrialSearch);
  trialInput.addEventListener("keydown", (e) => { if (e.key === "Enter") runTrialSearch(); });
}

// ─── ECOSYSTEM CHAT ───

const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatSuggestions = document.getElementById("chat-suggestions");
const chatDemoBtn = document.getElementById("chatDemoBtn");
const chatClearBtn = document.getElementById("chatClearBtn");

const DEFAULT_SUGGESTIONS = [
  "How many agents are there?",
  "What agents serve MSLs?",
  "Explain governance layer",
  "What is the Expert Hub?",
  "Show agent architecture",
];

function resetChat() {
  if (!chatMessages) return;
  chatMessages.innerHTML = `<div class="chat-msg ai">
    <div class="chat-ai-avatar"><i class="ti ti-robot"></i></div>
    <div class="chat-bubble chat-ai-bubble">
      I'm the Ecosystem Intelligence Agent. Ask me about MedVerse's <strong>agent architecture</strong>, governance layers, intelligence hubs, or how agents work together.
    </div>
  </div>`;
  chatSuggestions.innerHTML = DEFAULT_SUGGESTIONS.map(s => `<button class="chat-suggestion">${esc(s)}</button>`).join("");
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

function addUserMsg(text) {
  const div = document.createElement("div");
  div.className = "chat-msg user";
  div.innerHTML = `<div class="chat-bubble">${esc(text)}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addPersonaUserMsg(text, persona, css) {
  const div = document.createElement("div");
  div.className = "chat-msg user";
  div.innerHTML = `<div><div class="chat-persona-label ${css}">${esc(persona)}</div><div class="chat-bubble" style="background:var(--accent);color:white;border-bottom-right-radius:4px">${esc(text)}</div></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addAIMsg(html) {
  const div = document.createElement("div");
  div.className = "chat-msg ai";
  div.innerHTML = `<div class="chat-ai-avatar"><i class="ti ti-robot"></i></div><div class="chat-bubble chat-ai-bubble">${html}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "chat-msg ai";
  div.innerHTML = `<div class="chat-ai-avatar"><i class="ti ti-robot"></i></div><div class="chat-bubble chat-ai-bubble"><span class="chat-typing"><span></span><span></span><span></span></span></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function generateChatResponse(query) {
  const q = query.toLowerCase();
  const allAgents = [...BUSINESS_AGENTS, ...SYSTEM_AGENTS.map(h => ({...h, _isHub: true})), ...COMPLIANCE_AGENTS.map(c => ({...c, _isGov: true}))];

  // Count / overview
  if (q.includes("how many") || (q.includes("count") && q.includes("agent")) || q.includes("overview") || q.includes("total")) {
    return `<strong>MedVerse Agent Ecosystem:</strong><br><br>` +
      `• <strong>${BUSINESS_AGENTS.length}</strong> business agents (orchestration layer)<br>` +
      `• <strong>${SYSTEM_AGENTS.length}</strong> intelligence hubs (platform layer)<br>` +
      `• <strong>${COMPLIANCE_AGENTS.length}</strong> governance agents (compliance layer)<br>` +
      `• <strong>${SYSTEM_AGENTS.reduce((s, a) => s + a.dataSources.length, 0)}</strong> connected data sources<br>` +
      `• <strong>${BUSINESS_AGENTS.reduce((s, a) => s + a.compliancePartners.length, 0)}</strong> governance pairings<br><br>` +
      `Every business agent has at least one governance partner ensuring compliance-by-design.`;
  }

  // Architecture
  if (q.includes("architect") || q.includes("layer") || q.includes("how.*work") || q.includes("structure")) {
    return `<strong>Four-layer architecture:</strong><br><br>` +
      `<strong>1. User Experience Layer</strong> — MSLs, HCPs, Patients, Home Office<br>` +
      `<strong>2. Agent Orchestration Layer</strong> — ${BUSINESS_AGENTS.length} business agents serving specific workflows<br>` +
      `<strong>3. Intelligence Hub Layer</strong> — ${SYSTEM_AGENTS.length} foundational knowledge graphs (${SYSTEM_AGENTS.map(h => h.name).join(", ")})<br>` +
      `<strong>4. Compliance & Governance Layer</strong> — ${COMPLIANCE_AGENTS.length} agents ensuring every interaction is monitored, validated, and audit-ready<br><br>` +
      `Business agents query intelligence hubs for data and are supervised by governance agents.`;
  }

  // Persona-specific: MSL
  if (q.includes("msl") || q.includes("field medical")) {
    const mslAgents = BUSINESS_AGENTS.filter(a => a.users.some(u => u.toLowerCase().includes("msl") || u.toLowerCase().includes("field")));
    const items = mslAgents.map(a => `• <strong>${esc(a.name)}</strong> — ${esc(a.desc.split(".")[0])}`).join("<br>");
    return `<strong>${mslAgents.length} agents serve MSL field teams:</strong><br><br>${items}`;
  }

  // Persona-specific: HCP
  if (q.includes("hcp") || q.includes("physician") || q.includes("healthcare pro")) {
    const hcpAgents = BUSINESS_AGENTS.filter(a => a.users.some(u => u.toLowerCase().includes("hcp") || u.toLowerCase().includes("pharmacist")));
    const items = hcpAgents.map(a => `• <strong>${esc(a.name)}</strong> — ${esc(a.desc.split(".")[0])}`).join("<br>");
    return `<strong>${hcpAgents.length} agents serve HCPs:</strong><br><br>${items}`;
  }

  // Persona-specific: Patient
  if (q.includes("patient")) {
    const patAgents = BUSINESS_AGENTS.filter(a => a.users.some(u => u.toLowerCase().includes("patient")));
    const items = patAgents.map(a => `• <strong>${esc(a.name)}</strong> — ${esc(a.desc.split(".")[0])}`).join("<br>");
    return `<strong>${patAgents.length} agents serve patients:</strong><br><br>${items}`;
  }

  // Governance / compliance
  if (q.includes("govern") || q.includes("compliance") || q.includes("mlr") || q.includes("audit")) {
    const items = COMPLIANCE_AGENTS.slice(0, 6).map(a => `• <strong>${esc(a.name)}</strong> — ${esc(a.desc.split(".")[0])}`).join("<br>");
    return `<strong>${COMPLIANCE_AGENTS.length} governance agents</strong> enforce compliance-by-design:<br><br>${items}<br><br>` +
      `Plus ${COMPLIANCE_AGENTS.length - 6} more: ${COMPLIANCE_AGENTS.slice(6).map(a => a.name).join(", ")}.`;
  }

  // Expert Hub
  if (q.includes("expert") && (q.includes("hub") || q.includes("intelligence"))) {
    const hub = SYSTEM_AGENTS.find(h => h.id === "hcp-explorer");
    if (hub) {
      const sources = hub.dataSources.map(d => `• ${d.value} ${esc(d.label)}`).join("<br>");
      const consumers = hub.consumers.map(id => BUSINESS_AGENTS.find(a => a.id === id)?.name).filter(Boolean);
      return `<strong>${esc(hub.name)}</strong><br>${esc(hub.subtitle)}<br><br>` +
        `<strong>Data sources:</strong><br>${sources}<br><br>` +
        `<strong>Powers ${consumers.length} agents:</strong> ${consumers.join(", ")}`;
    }
  }

  // Literature Intelligence hub
  if (q.includes("literature") && (q.includes("hub") || q.includes("intelligence") || q.includes("platform"))) {
    const hub = SYSTEM_AGENTS.find(h => h.id === "literature-intel");
    if (hub) {
      const sources = hub.dataSources.map(d => `• ${d.value} ${esc(d.label)}`).join("<br>");
      return `<strong>${esc(hub.name)}</strong><br>${esc(hub.subtitle)}<br><br>` +
        `<strong>Data sources:</strong><br>${sources}<br><br>` +
        `<strong>Capabilities:</strong><br>${hub.capabilities.map(c => "• " + esc(c)).join("<br>")}`;
    }
  }

  // Specific agent lookup
  const agentMatch = allAgents.find(a => {
    const name = a.name.toLowerCase();
    return q.includes(name) || name.split(" ").every(w => q.includes(w));
  });
  if (agentMatch) {
    let response = `<strong>${esc(agentMatch.name)}</strong><br>${esc(agentMatch.desc)}<br><br>`;
    if (agentMatch.users) response += `<strong>Users:</strong> ${agentMatch.users.join(", ")}<br>`;
    if (agentMatch.compliancePartners) {
      const govNames = agentMatch.compliancePartners.map(id => COMPLIANCE_AGENTS.find(c => c.id === id)?.name).filter(Boolean);
      response += `<strong>Governance:</strong> ${govNames.join(", ")}<br>`;
    }
    if (agentMatch.hubDependency?.length) {
      const hubNames = agentMatch.hubDependency.map(id => SYSTEM_AGENTS.find(h => h.id === id)?.name).filter(Boolean);
      response += `<strong>Intelligence hubs:</strong> ${hubNames.join(", ")}`;
    }
    if (agentMatch._isGov) {
      const supervised = BUSINESS_AGENTS.filter(a => a.compliancePartners.includes(agentMatch.id));
      response += `<strong>Supervises:</strong> ${supervised.map(a => a.name).join(", ")}`;
    }
    return response;
  }

  // Data sources
  if (q.includes("data source") || q.includes("data") && q.includes("connect")) {
    const allSources = SYSTEM_AGENTS.flatMap(h => h.dataSources.map(d => ({ ...d, hub: h.name })));
    const items = allSources.map(d => `• <strong>${d.value}</strong> ${esc(d.label)} (${esc(d.hub)})`).join("<br>");
    return `<strong>${allSources.length} connected data sources:</strong><br><br>${items}`;
  }

  // Fallback
  return `MedVerse has <strong>${BUSINESS_AGENTS.length} business agents</strong>, <strong>${SYSTEM_AGENTS.length} intelligence hubs</strong>, and <strong>${COMPLIANCE_AGENTS.length} governance agents</strong>. Try asking about:<br><br>` +
    `• Agent count or architecture overview<br>` +
    `• Agents for a persona (MSLs, HCPs, patients)<br>` +
    `• A specific agent (MSL Copilot, Advisory Board Builder)<br>` +
    `• Governance/compliance layer<br>` +
    `• Intelligence hubs (Expert Hub, Literature)`;
}

async function sendChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";
  chatSend.disabled = true;
  chatSuggestions.style.display = "none";
  addUserMsg(text);
  const typing = addTyping();
  await delay(800 + Math.random() * 600);
  typing.remove();
  addAIMsg(generateChatResponse(text));

  const lq = text.toLowerCase();
  let followUps = [];
  if (lq.includes("how many") || lq.includes("overview")) followUps = ["Show agent architecture", "What agents serve MSLs?", "Explain governance layer"];
  else if (lq.includes("msl")) followUps = ["What is the Expert Hub?", "How many agents?", "Explain governance"];
  else if (lq.includes("govern")) followUps = ["Architecture overview", "What agents serve HCPs?", "Data sources"];
  else if (lq.includes("hub") || lq.includes("expert")) followUps = ["Literature Intelligence hub", "Agents for MSLs", "Governance layer"];
  else followUps = ["How many agents?", "Show architecture", "What agents serve MSLs?"];

  chatSuggestions.innerHTML = followUps.map(s => `<button class="chat-suggestion">${esc(s)}</button>`).join("");
  chatSuggestions.style.display = "flex";
  bindSuggestionClicks();
}

if (chatInput && chatSend) {
  chatSend.addEventListener("click", sendChat);
  chatInput.addEventListener("keydown", e => { if (e.key === "Enter") sendChat(); });
  chatInput.addEventListener("input", () => { chatSend.disabled = !chatInput.value.trim(); });
}
if (chatClearBtn) chatClearBtn.addEventListener("click", resetChat);
bindSuggestionClicks();

const chatFab = document.getElementById("chatFab");
const chatPanel = document.getElementById("chatPanel");
if (chatFab && chatPanel) {
  chatFab.addEventListener("click", () => {
    chatPanel.classList.add("open");
    chatFab.classList.add("hidden");
    const input = document.getElementById("chat-input");
    if (input) input.focus();
  });
  chatClearBtn.addEventListener("click", () => {
    chatPanel.classList.remove("open");
    chatFab.classList.remove("hidden");
  });
}

// ─── CHAT DEMO ───

const CHAT_DEMO_SEQUENCE = [
  { persona: "Med Affairs", css: "med-affairs", question: "How many agents are in MedVerse?" },
  { persona: "MSL", css: "msl", question: "What agents are available for MSL field teams?" },
  { persona: "Med Affairs", css: "med-affairs", question: "Explain the governance layer" },
  { persona: "MSL", css: "msl", question: "What is the Expert Intelligence Hub?" },
  { persona: "HCP", css: "hcp", question: "What agents serve HCPs?" },
  { persona: "Med Affairs", css: "med-affairs", question: "Tell me about the MSL Copilot" },
  { persona: "Field Ops", css: "field-ops", question: "Show agent architecture" },
  { persona: "MSL", css: "msl", question: "What data sources are connected?" },
];

async function narrate(text) {
  const el = document.getElementById("demo-narrator");
  if (!el) return;
  el.innerHTML = `<i class="ti ti-sparkles"></i> ${text}`;
  if (isCCEnabled()) el.classList.add("visible");
  showControls();
  await speakAndWait(text);
}

function narrateOff() {
  const el = document.getElementById("demo-narrator");
  if (el) el.classList.remove("visible");
  stopSpeaking();
  hideControls();
}

let chatDemoRunning = false;

async function typeIntoChat(text) {
  chatInput.value = "";
  for (let i = 0; i < text.length; i++) {
    chatInput.value += text[i];
    await delay(25 + Math.random() * 20);
  }
}

async function runChatDemo() {
  if (chatDemoRunning) return;
  chatDemoRunning = true;
  chatDemoBtn.disabled = true;
  chatDemoBtn.innerHTML = '<i class="ti ti-loader-2" style="font-size:13px;animation:spin 1s linear infinite"></i> Running…';
  resetChat();
  await delay(600);
  await narrate("Agent Ecosystem demo — AI answers about architecture, governance, and agent capabilities");

  for (const step of CHAT_DEMO_SEQUENCE) {
    await narrate(step.persona + " asks about the agent ecosystem");
    await typeIntoChat(step.question);
    await delay(300);
    chatSuggestions.style.display = "none";
    addPersonaUserMsg(step.question, step.persona, step.css);
    chatInput.value = "";
    const typing = addTyping();
    await delay(1000 + Math.random() * 800);
    typing.remove();
    addAIMsg(generateChatResponse(step.question));
    await narrate("AI explains ecosystem across " + BUSINESS_AGENTS.length + " business agents and " + SYSTEM_AGENTS.length + " hubs");
  }

  addAIMsg(`<strong>Demo complete!</strong> ${CHAT_DEMO_SEQUENCE.length} questions answered across ${BUSINESS_AGENTS.length} business agents, ${SYSTEM_AGENTS.length} intelligence hubs, and ${COMPLIANCE_AGENTS.length} governance agents.`);

  narrateOff();
  chatDemoRunning = false;
  chatDemoBtn.disabled = false;
  chatDemoBtn.innerHTML = '<i class="ti ti-player-play" style="font-size:13px"></i> Demo';
}

if (chatDemoBtn) chatDemoBtn.addEventListener("click", runChatDemo);

document.querySelectorAll(".trial-quick-tag").forEach(tag => {
  tag.addEventListener("click", () => {
    trialInput.value = tag.dataset.q;
    runTrialSearch();
  });
});

async function runTrialSearch() {
  const query = trialInput.value.trim();
  if (!query) return;

  trialSearchBtn.disabled = true;
  trialSearchBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Searching…';
  trialResults.innerHTML = `<div class="trial-loading"><i class="ti ti-loader-2"></i><p>Querying ClinicalTrials.gov…</p></div>`;

  try {
    const params = new URLSearchParams({
      "query.term": query,
      pageSize: "20",
      format: "json",
      "fields": "NCTId,BriefTitle,OverallStatus,Phase,Condition,InterventionName,LeadSponsorName,EnrollmentCount,StartDate,PrimaryCompletionDate,StudyType,LocationCity"
    });
    const res = await fetch(`${TRIALS_BASE}/studies?${params}`);
    const data = await res.json();
    const studies = data.studies || [];
    const total = data.totalCount || studies.length;

    if (!studies.length) {
      trialResults.innerHTML = `<div class="trial-empty"><i class="ti ti-flask-off"></i><h4>No trials found</h4><p>Try different search terms or a broader query.</p></div>`;
    } else {
      renderTrialResults(studies, total, query);
    }
  } catch (err) {
    trialResults.innerHTML = `<div class="trial-empty"><i class="ti ti-alert-triangle"></i><h4>Search error</h4><p>${esc(err.message)}</p></div>`;
  }

  trialSearchBtn.disabled = false;
  trialSearchBtn.innerHTML = '<i class="ti ti-search"></i> Search';
}

function renderTrialResults(studies, total, query) {
  let html = `<div class="trial-results-header">
    <h4>Clinical Trials</h4>
    <span class="trial-results-count">${total.toLocaleString()} total — showing ${studies.length}</span>
  </div>`;

  for (const study of studies) {
    const proto = study.protocolSection || {};
    const id = proto.identificationModule || {};
    const status = proto.statusModule || {};
    const design = proto.designModule || {};
    const sponsor = proto.sponsorCollaboratorsModule || {};
    const conditions = proto.conditionsModule || {};
    const interventions = proto.armsInterventionsModule || {};
    const enrollment = design.enrollmentInfo || {};

    const nctId = id.nctId || "";
    const title = id.briefTitle || "Untitled";
    const overallStatus = status.overallStatus || "";
    const phases = (design.phases || []).join(", ");
    const leadSponsor = sponsor.leadSponsor?.name || "";
    const enrollCount = enrollment.count || "";
    const startDate = status.startDateStruct?.date || "";
    const condList = (conditions.conditions || []).slice(0, 4);
    const interventionNames = (interventions.interventions || []).map(i => i.name).slice(0, 3);

    const phaseClass = phases.includes("3") ? "phase3" : phases.includes("2") ? "phase2" : phases.includes("1") ? "phase1" : phases.includes("4") ? "phase4" : "";
    const statusClass = overallStatus === "RECRUITING" ? "recruiting" : overallStatus === "ACTIVE_NOT_RECRUITING" ? "active" : overallStatus === "COMPLETED" ? "completed" : "other";
    const statusLabel = overallStatus.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    html += `<div class="trial-card">
      <div class="trial-card-top">
        <a class="trial-nct" href="https://clinicaltrials.gov/study/${nctId}" target="_blank" rel="noopener">${esc(nctId)}</a>
        ${phases ? `<span class="trial-phase ${phaseClass}">${esc(phases)}</span>` : ""}
        <span class="trial-status-badge ${statusClass}">${esc(statusLabel)}</span>
        ${leadSponsor ? `<span style="font-size:10px;color:var(--text-muted)">${esc(leadSponsor)}</span>` : ""}
      </div>
      <div class="trial-card-title">${esc(title)}</div>
      <div class="trial-card-meta">
        ${enrollCount ? `<span><i class="ti ti-users"></i> ${enrollCount.toLocaleString()} enrolled</span>` : ""}
        ${startDate ? `<span><i class="ti ti-calendar"></i> ${esc(startDate)}</span>` : ""}
        ${interventionNames.length ? `<span><i class="ti ti-pill"></i> ${esc(interventionNames.join(", "))}</span>` : ""}
      </div>
      ${condList.length ? `<div class="trial-card-conditions">${condList.map(c => `<span class="trial-cond-tag">${esc(c)}</span>`).join("")}</div>` : ""}
    </div>`;
  }

  trialResults.innerHTML = html;
}

// ─── FULL UNIFIED DEMO ───

let fullDemoRunning = false;

function scrollTo(el) { if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }
function highlight(el) { if (el) { el.style.outline = "2px solid #7a00e6"; el.style.outlineOffset = "2px"; } }
function unhighlight(el) { if (el) { el.style.outline = ""; el.style.outlineOffset = ""; } }

async function runDemo() {
  if (fullDemoRunning || demoRunning) return;
  fullDemoRunning = true;
  const btn = document.getElementById("run-demo");
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running...'; }

  const mainScroll = document.getElementById("main-scroll");
  if (mainScroll) mainScroll.scrollTo({ top: 0, behavior: "smooth" });
  closePersonaPanel();
  await delay(500);

  // ACT 1: Stats overview
  await narrate("The Agent Ecosystem — featuring eighteen business agents, two intelligence hubs, and thirteen governance agents");
  const statsRow = document.querySelector(".stats-row");
  highlight(statsRow);
  await delay(2000);
  unhighlight(statsRow);

  // ACT 2: Four-layer architecture
  await narrate("The four-layer architecture — UX personas at top, agents, intelligence hubs, and governance at the base");
  const archSection = document.querySelector(".arch-section");
  if (archSection) {
    scrollTo(archSection);
    await delay(1500);
  }

  // ACT 3: Persona drill-down - MSLs
  await narrate("Let's explore the MSL persona — click to see which agents serve field medical teams");
  const mslSpan = document.querySelector('.arch-ux-personas span');
  if (mslSpan) {
    mslSpan.click();
    await delay(1500);
    await narrate("MSL field teams have access to agents for territory management, KOL profiling, compliance, and more");
    await delay(2000);
    closePersonaPanel();
    await delay(400);
  }

  // ACT 4: Intelligence Hub drill-down
  await narrate("Intelligence hubs power the agents — click the Expert Intelligence Hub");
  const hubSection = document.getElementById("hub-cards");
  if (hubSection) {
    scrollTo(hubSection);
    await delay(600);
    const expertHub = hubSection.querySelector('.hub-card[data-hub-id="hcp-explorer"]');
    if (expertHub) {
      highlight(expertHub);
      await delay(1000);
      unhighlight(expertHub);
    }
  }
  await narrate("The Expert Hub profiles over 4,200 HCPs with publication data, congress activity, and engagement history");

  // ACT 5: Governance layer
  await narrate("Every agent output passes through the governance layer — featuring thirteen compliance agents");
  const compStrip = document.getElementById("compliance-strip");
  if (compStrip) {
    scrollTo(compStrip);
    await delay(600);
    highlight(compStrip);
    await delay(1500);
    unhighlight(compStrip);
  }
  await narrate("MLR review, scientific verification, AE detection, PHI protection — all automated");

  // ACT 6: Business agent grid
  await narrate("The business agent grid — click any agent for a live demo");
  const agentGrid = document.getElementById("agent-grid");
  if (agentGrid) {
    scrollTo(agentGrid);
    await delay(800);
  }

  // ACT 7: Demo a key agent - Advisory Board Builder
  await narrate("Let's demo the Advisory Board Builder — an MSL favorite");
  const abCard = agentGrid?.querySelector('.agent-card[data-id="advisory-board"]');
  if (abCard) {
    scrollTo(abCard);
    await delay(400);
    highlight(abCard);
    await delay(600);
    unhighlight(abCard);
    openDemo("advisory-board");
    await delay(8000);
    const demoPanel = document.getElementById("demo-panel");
    if (demoPanel) demoPanel.style.display = "none";
    document.body.style.overflow = "";
    clearComplianceHighlights();
    await delay(400);
  }
  await narrate("Advisory Board — automated roster optimization with compliance review built in");

  // ACT 8: Demo Expert Segmentation
  await narrate("Next, the Expert Segmentation Agent — classifying KOLs by tier and influence");
  const esCard = agentGrid?.querySelector('.agent-card[data-id="expert-segment"]');
  if (esCard) {
    scrollTo(esCard);
    await delay(400);
    highlight(esCard);
    await delay(600);
    unhighlight(esCard);
    openDemo("expert-segment");
    await delay(6000);
    const demoPanel = document.getElementById("demo-panel");
    if (demoPanel) demoPanel.style.display = "none";
    document.body.style.overflow = "";
    clearComplianceHighlights();
    await delay(400);
  }

  // ACT 9: Live clinical trial search
  await narrate("Live Trial Search — querying ClinicalTrials.gov in real time from the ecosystem");
  openTrialSearch();
  await delay(600);
  if (trialInput) {
    trialInput.value = "";
    for (const ch of "dupilumab atopic dermatitis") {
      trialInput.value += ch;
      await delay(20);
    }
    await delay(300);
    await runTrialSearch();
    await delay(2500);
    await narrate("Real-time results from ClinicalTrials.gov — integrated directly into the agent platform");
    closeTrialSearch();
    await delay(400);
  }

  // ACT 10: Chat demo
  await narrate("The Ecosystem AI agent answers questions about architecture, agents, and governance");
  if (chatFab && chatPanel) {
    chatPanel.classList.add("open");
    chatFab.classList.add("hidden");
  }
  resetChat();
  await delay(400);
  await typeIntoChat("How many agents are in MedVerse?");
  await delay(300);
  chatSuggestions.style.display = "none";
  addUserMsg("How many agents are in MedVerse?");
  chatInput.value = "";
  const typing = addTyping();
  await delay(1000);
  typing.remove();
  addAIMsg(generateChatResponse("How many agents are in MedVerse?"));
  await delay(1500);
  await narrate("The ecosystem agent provides instant answers about the full platform architecture");

  // Reset
  if (chatPanel) {
    chatPanel.classList.remove("open");
    chatFab.classList.remove("hidden");
  }
  if (mainScroll) mainScroll.scrollTo({ top: 0, behavior: "smooth" });
  await delay(500);

  await narrate("Agent Ecosystem — featuring eighteen business agents, two intelligence hubs, and thirteen governance agents. One connected platform.");
  narrateOff();

  fullDemoRunning = false;
  if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ti ti-player-play"></i> Play Demo'; }
}

const runDemoBtn = document.getElementById("run-demo");
if (runDemoBtn) runDemoBtn.addEventListener("click", runDemo);

if (window.location.hash === "#autoplay") {
  window.location.hash = "";
  setTimeout(runDemo, 600);
}

init();
