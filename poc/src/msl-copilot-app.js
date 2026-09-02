import { speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";
import { broadcastSignal, broadcastPopulationSignal } from "./orion-bridge.js";
import { createDemoController } from "./demo-nav.js";
import {
  CARE_GAPS, getRegionRollup, getCandidatesForRegion, getEventFootprint,
} from "./population-data.js";
import { mountTileMap } from "./population-map.js";

// === NAV STATE ===
const hub = document.getElementById("hub");
const backBtn = document.getElementById("back-btn");
const headerHome = document.getElementById("header-home");
const mainScroll = document.getElementById("main-scroll");
let activePanel = null;

function showHub() {
  document.querySelectorAll(".agent-panel").forEach(p => p.classList.remove("active"));
  hub.style.display = "";
  backBtn.classList.remove("visible");
  activePanel = null;
  mainScroll.scrollTop = 0;
}

function showPanel(agentId) {
  hub.style.display = "none";
  document.querySelectorAll(".agent-panel").forEach(p => p.classList.remove("active"));
  const panel = document.getElementById(`panel-${agentId}`);
  if (panel) panel.classList.add("active");
  backBtn.classList.add("visible");
  activePanel = agentId;
  mainScroll.scrollTop = 0;
}

document.querySelectorAll(".agent-card").forEach(card => {
  card.addEventListener("click", () => showPanel(card.dataset.agent));
});
backBtn.addEventListener("click", showHub);
headerHome.addEventListener("click", e => { e.preventDefault(); showHub(); });

// === SEARCH ===
const hubSearchInput = document.getElementById("hub-search-input");
const hubSearchBtn = document.getElementById("hub-search-btn");
const hubSearchHints = document.getElementById("hub-search-hints");

const searchHints = [
  { text: "Prep for Dr. Chen meeting", agent: "precall" },
  { text: "My territory this week", agent: "territory" },
  { text: "Dupixent vs abrocitinib H2H data", agent: "competitive" },
  { text: "Compliance check for lunch & learn", agent: "compliance" },
  { text: "EADV 2026 congress plan", agent: "congress" },
  { text: "Dr. Nakamura KOL profile", agent: "kol" },
];

if (hubSearchHints) {
  searchHints.forEach(h => {
    const chip = document.createElement("button");
    chip.className = "hub-search-hint-chip";
    chip.textContent = h.text;
    chip.addEventListener("click", () => { hubSearchInput.value = h.text; routeSearch(h.text); });
    hubSearchHints.appendChild(chip);
  });
}

if (hubSearchBtn) hubSearchBtn.addEventListener("click", () => { const q = hubSearchInput.value.trim(); if (q) routeSearch(q); });
if (hubSearchInput) hubSearchInput.addEventListener("keydown", e => { if (e.key === "Enter") { const q = hubSearchInput.value.trim(); if (q) routeSearch(q); } });

function routeSearch(query) {
  const q = query.toLowerCase();
  const routes = [
    { keywords: ["prep", "briefing", "look up", "hcp profile", "pre-call", "meeting with dr"], agent: "precall", prefill: q },
    { keywords: ["territory", "dashboard", "this week", "upcoming", "my meetings", "stats"], agent: "territory" },
    { keywords: ["signal", "post-call", "submit", "report call", "after meeting"], agent: "postcall" },
    { keywords: ["medical info", "unsolicited", "dosing", "request letter", "mir "], agent: "medinfo" },
    { keywords: ["competitive", "h2h", "head-to-head", "versus", " vs ", "competitor", "abrocitinib", "upadacitinib", "rinvoq", "cibinqo"], agent: "competitive" },
    { keywords: ["congress", "eadv", "acr ", "aaaai", "ats ", "ash ", "symposium", "poster"], agent: "congress" },
    { keywords: ["kol", "key opinion", "profile", "influence", "publication", "speaker"], agent: "kol", prefill: q },
    { keywords: ["compliance", "compliant", "fair balance", "gift", "meal", "guardrail"], agent: "compliance" },
    { keywords: ["literature", "pubmed", "publication", "journal", "meta-analysis", "evidence", "paper"], agent: "literature" },
    { keywords: ["scout", "monitor", "alert", "new paper", "guideline update", "recent pub"], agent: "lit-scout" },
    { keywords: ["disease", "pathophysiology", "mechanism", "treatment landscape", "cross-ta"], agent: "disease-nav" },
    { keywords: ["orion", "signal", "intelligence", "trending", "engagement intel", "heatmap"], agent: "orion" },
  ];

  for (const route of routes) {
    if (route.keywords.some(k => q.includes(k))) {
      showPanel(route.agent);
      if (route.prefill) prefillFromSearch(route.agent, query);
      return;
    }
  }
  showPanel("precall");
  document.getElementById("pc-hcp-search").value = query;
}

function prefillFromSearch(agent, query) {
  if (agent === "precall") {
    const nameMatch = query.match(/dr\.?\s*(\w+)/i);
    if (nameMatch) document.getElementById("pc-hcp-search").value = "Dr. " + nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
  } else if (agent === "kol") {
    const nameMatch = query.match(/dr\.?\s*(\w+)/i);
    if (nameMatch) document.getElementById("kol-name").value = "Dr. " + nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
  }
}

// === UTILITY ===
function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function loader(color) {
  return `<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:${color};"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Processing…</div></div>`;
}

// === HCP DATABASE ===
const hcpDatabase = {
  "chen": {
    name: "Dr. Sarah Chen, MD", specialty: "Dermatology", institution: "Massachusetts General Hospital", city: "Boston, MA",
    tier: "Tier 1 — KOL", lastMeeting: "2026-06-12", meetingType: "Scientific Exchange",
    topics: ["Dupixent long-term AD data", "Type 2 inflammation cross-TA"],
    interests: ["Pediatric AD management", "Biologic sequencing", "Real-world evidence"],
    orionSignals: 14, engagement: "High",
    recentQueries: ["Dupilumab vs abrocitinib H2H data", "AD in children under 5", "EASI-75 durability beyond 52 weeks"],
    nextAction: "Schedule pre-EADV briefing on CRSwNP data",
    trials: ["LIBERTY AD PED (site PI)", "DUPIXENT REAL (participating)"],
    publications: 3, congressAttendance: ["AAD 2026", "EADV 2025"],
    kolScore: 87, hIndex: 24, advisoryBoards: 6, speakerPrograms: 4
  },
  "torres": {
    name: "Dr. Michael Torres, MD, PhD", specialty: "Rheumatology", institution: "Johns Hopkins Hospital", city: "Baltimore, MD",
    tier: "Tier 2 — Regional Influencer", lastMeeting: "2026-05-28", meetingType: "Advisory Board",
    topics: ["Sarilumab monotherapy data", "IL-6 pathway in RA fatigue"],
    interests: ["Biologic monotherapy", "Patient-reported outcomes", "RA comorbidities"],
    orionSignals: 8, engagement: "Moderate",
    recentQueries: ["MONARCH trial sarilumab vs adalimumab", "IL-6 and fatigue mechanisms"],
    nextAction: "Share MONARCH long-term extension data when available",
    trials: [], publications: 1, congressAttendance: ["ACR 2025"],
    kolScore: 62, hIndex: 15, advisoryBoards: 2, speakerPrograms: 1
  },
  "nakamura": {
    name: "Dr. Emily Nakamura, MD", specialty: "Allergy & Immunology", institution: "Stanford Health Care", city: "Palo Alto, CA",
    tier: "Tier 1 — Emerging KOL", lastMeeting: "2026-07-03", meetingType: "Lunch & Learn (group)",
    topics: ["Type 2 inflammation across diseases", "Dupixent in asthma + AD comorbidity"],
    interests: ["Cross-TA immunology", "Shared pathway therapeutics", "Eosinophilic diseases"],
    orionSignals: 22, engagement: "Very High",
    recentQueries: ["Type 2 inflammation cross-disease connections", "EoE emerging treatments", "Dupixent asthma + CRSwNP overlap"],
    nextAction: "Invite to EADV 2026 satellite symposium; share EoE Phase 3 data",
    trials: ["LIBERTY CUPID (referring)"], publications: 5, congressAttendance: ["AAAAI 2026", "AAD 2026", "EADV 2025"],
    kolScore: 91, hIndex: 31, advisoryBoards: 8, speakerPrograms: 6
  }
};

function findHcp(query) {
  const q = query.toLowerCase().replace(/^dr\.?\s*/, "");
  return Object.values(hcpDatabase).find(h => h.name.toLowerCase().includes(q) || Object.keys(hcpDatabase).some(k => q.includes(k) && hcpDatabase[k] === h));
}

// === TERRITORY DATA ===
const territoryData = {
  upcomingMeetings: [
    { hcp: "Dr. Sarah Chen", date: "2026-08-12", type: "Pre-call prep", topic: "EADV preview + CRSwNP data", status: "confirmed" },
    { hcp: "Dr. Emily Nakamura", date: "2026-08-14", type: "Scientific Exchange", topic: "EoE Phase 3 deep-dive", status: "confirmed" },
    { hcp: "Dr. James Liu", date: "2026-08-18", type: "Lunch & Learn", topic: "Dupixent in pediatric AD", status: "pending" },
    { hcp: "Dr. Michael Torres", date: "2026-08-22", type: "Virtual meeting", topic: "MONARCH extension data", status: "requested" }
  ],
  alerts: [
    { type: "priority", text: "Dr. Chen queried competitor landscape — H2H data request", time: "2h ago" },
    { type: "signal", text: "Dr. Nakamura showed cross-TA interest (EoE + asthma overlap)", time: "1d ago" },
    { type: "congress", text: "EADV 2026 agenda released — 3 HCPs in your territory attending", time: "3d ago" }
  ],
  stats: { totalHcps: 47, activeEngagements: 12, signalsThisMonth: 38, meetingsThisWeek: 3 }
};

// ============================================================
// 1. PRE-CALL INTELLIGENCE
// ============================================================
document.getElementById("pc-submit").addEventListener("click", () => {
  const q = document.getElementById("pc-hcp-search").value.trim();
  if (!q) { alert("Please enter an HCP name."); return; }
  const el = document.getElementById("pc-results");
  el.innerHTML = loader("var(--accent)");

  setTimeout(() => {
    const hcp = findHcp(q);
    if (!hcp) {
      el.innerHTML = `<div class="result-empty"><i class="ti ti-search-off"></i>No HCP found matching "${escapeHtml(q)}". Try: Dr. Sarah Chen, Dr. Torres, or Dr. Nakamura.</div>`;
      return;
    }
    const engColor = hcp.engagement === "Very High" ? "var(--success)" : hcp.engagement === "High" ? "var(--orion-accent)" : "var(--warning)";
    el.innerHTML = `
      <div class="briefing-card">
        <div class="briefing-header">
          <div class="briefing-avatar"><i class="ti ti-user-circle"></i></div>
          <div class="briefing-name-block">
            <div class="briefing-name">${escapeHtml(hcp.name)}</div>
            <div class="briefing-meta">${escapeHtml(hcp.specialty)} · ${escapeHtml(hcp.institution)}</div>
            <div class="briefing-meta">${escapeHtml(hcp.city)}</div>
          </div>
          <div class="briefing-badges">
            <span class="badge tier">${escapeHtml(hcp.tier)}</span>
            <span class="badge engagement" style="color:${engColor};border-color:${engColor};">${escapeHtml(hcp.engagement)} engagement</span>
          </div>
        </div>
        <div class="briefing-grid">
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-history"></i> Last Interaction</div>
            <div class="section-body">
              <div class="detail-row"><span class="detail-label">Date</span><span>${escapeHtml(hcp.lastMeeting)}</span></div>
              <div class="detail-row"><span class="detail-label">Type</span><span>${escapeHtml(hcp.meetingType)}</span></div>
              <div class="detail-row"><span class="detail-label">Topics</span><span>${hcp.topics.map(t => escapeHtml(t)).join(", ")}</span></div>
            </div>
          </div>
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-bulb"></i> Scientific Interests</div>
            <div class="section-body">${hcp.interests.map(i => `<span class="interest-chip">${escapeHtml(i)}</span>`).join("")}</div>
          </div>
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-radar-2"></i> Orion Intelligence (${hcp.orionSignals} signals)</div>
            <div class="section-body">
              ${hcp.recentQueries.map(r => `<div class="query-item"><i class="ti ti-message-dots" style="color:var(--accent);font-size:13px;"></i> ${escapeHtml(r)}</div>`).join("")}
            </div>
          </div>
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-flask"></i> Trial Involvement</div>
            <div class="section-body">
              ${hcp.trials.length ? hcp.trials.map(t => `<div class="trial-item">${escapeHtml(t)}</div>`).join("") : '<div class="detail-muted">No active trial participation</div>'}
            </div>
          </div>
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-calendar-event"></i> Congress Activity</div>
            <div class="section-body">
              <div class="detail-row"><span class="detail-label">Publications</span><span>${hcp.publications} recent</span></div>
              <div class="detail-row"><span class="detail-label">Attended</span><span>${hcp.congressAttendance.join(", ")}</span></div>
            </div>
          </div>
          <div class="briefing-section highlight">
            <div class="section-title"><i class="ti ti-target-arrow"></i> Recommended Next Action</div>
            <div class="section-body"><div class="next-action">${escapeHtml(hcp.nextAction)}</div></div>
          </div>
        </div>
      </div>`;
    broadcastSignal({ topic: `Pre-Call Briefing — ${hcp.name}`, intent: "Clinical decision support", diseaseArea: hcp.interests[0] || "General", depth: "Deep engagement", orionAction: `Queue for MSL follow-up — pre-call intelligence generated for ${hcp.name} (${hcp.tier})`, queries: [`Pre-call briefing: ${hcp.name}`], contentAccessed: [`${hcp.name} HCP Profile`, "Orion Signal History"], _source: "MSL Copilot" });
  }, 1000);
});
document.getElementById("pc-hcp-search").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("pc-submit").click();
});

// ============================================================
// 2. TERRITORY DASHBOARD
// ============================================================
function renderTerritory() {
  const el = document.getElementById("territory-content");
  if (!el) return;
  const s = territoryData.stats;

  el.innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile"><div class="stat-num">${s.totalHcps}</div><div class="stat-label">HCPs in Territory</div></div>
      <div class="stat-tile"><div class="stat-num">${s.activeEngagements}</div><div class="stat-label">Active Engagements</div></div>
      <div class="stat-tile"><div class="stat-num">${s.signalsThisMonth}</div><div class="stat-label">Orion Signals (Aug)</div></div>
      <div class="stat-tile"><div class="stat-num">${s.meetingsThisWeek}</div><div class="stat-label">Meetings This Week</div></div>
    </div>
    <div class="territory-grid">
      <div class="territory-section">
        <h3><i class="ti ti-calendar-event"></i> Upcoming Meetings</h3>
        <div id="dash-meetings"></div>
      </div>
      <div class="territory-section">
        <h3><i class="ti ti-bell-ringing"></i> Orion Alerts</h3>
        <div id="dash-alerts"></div>
      </div>
    </div>`;

  const meetingsEl = document.getElementById("dash-meetings");
  meetingsEl.innerHTML = territoryData.upcomingMeetings.map(m => {
    const sc = m.status === "confirmed" ? "success" : m.status === "pending" ? "warning" : "muted";
    const si = m.status === "confirmed" ? "check" : m.status === "pending" ? "clock" : "send";
    return `<div class="meeting-card">
      <div class="meeting-date">${formatDate(m.date)}</div>
      <div class="meeting-info">
        <div class="meeting-hcp">${m.hcp}</div>
        <div class="meeting-topic">${m.topic}</div>
        <div class="meeting-meta"><span class="meeting-type">${m.type}</span><span class="meeting-status ${sc}"><i class="ti ti-${si}"></i> ${m.status}</span></div>
      </div>
    </div>`;
  }).join("");

  const alertsEl = document.getElementById("dash-alerts");
  alertsEl.innerHTML = territoryData.alerts.map(a => {
    const icon = a.type === "priority" ? "alert-triangle" : a.type === "signal" ? "radar-2" : "calendar-event";
    const color = a.type === "priority" ? "var(--danger)" : a.type === "signal" ? "var(--orion-accent)" : "var(--accent)";
    return `<div class="alert-card"><i class="ti ti-${icon}" style="color:${color};font-size:16px;flex-shrink:0;margin-top:2px;"></i><div class="alert-text"><div>${a.text}</div><div class="alert-time">${a.time}</div></div></div>`;
  }).join("");
}
renderTerritory();

// ============================================================
// 3. POST-CALL REPORTING
// ============================================================
const sigHcp = document.getElementById("sig-hcp");
const sigType = document.getElementById("sig-type");
const sigSubmit = document.getElementById("sig-submit");

[sigHcp, sigType].forEach(el => el.addEventListener("input", () => { sigSubmit.disabled = !(sigHcp.value.trim() && sigType.value); }));
sigType.addEventListener("change", () => { sigSubmit.disabled = !(sigHcp.value.trim() && sigType.value); });

let submittedSignals = [];

sigSubmit.addEventListener("click", () => {
  const hcpName = sigHcp.value.trim();
  const type = sigType.value;
  const meetingType = document.getElementById("sig-meeting-type").value;
  const notes = document.getElementById("sig-notes").value.trim();
  if (!hcpName || !type) return;

  sigSubmit.disabled = true;
  sigSubmit.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Submitting…';

  setTimeout(() => {
    sigSubmit.innerHTML = '<i class="ti ti-check"></i> Signal Submitted';
    sigSubmit.style.background = "var(--orion-accent)";

    const signal = { hcp: hcpName, type, meetingType, notes, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) };
    submittedSignals.unshift(signal);

    const el = document.getElementById("sig-results");
    el.innerHTML = `
      <div class="result-card" style="background:var(--orion-bg);border-color:#9fe1cb;">
        <div class="result-card-header"><div class="result-title" style="color:#085041;">Signal Submitted Successfully</div><span class="result-badge badge-orion">Orion</span></div>
        <div class="result-body" style="color:#085041;">
          <p><strong>HCP:</strong> ${escapeHtml(hcpName)}</p>
          <p><strong>Signal:</strong> ${escapeHtml(type)}</p>
          ${meetingType ? `<p><strong>Meeting:</strong> ${escapeHtml(meetingType)}</p>` : ""}
          ${notes ? `<p><strong>Notes:</strong> ${escapeHtml(notes)}</p>` : ""}
          <p style="margin-top:8px;"><i class="ti ti-arrow-right" style="font-size:13px;"></i> Routed to Orion → MSL field team dashboard</p>
        </div>
      </div>
      ${submittedSignals.length > 1 ? `<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Previous signals this session:</div>` : ""}
      ${submittedSignals.slice(1).map(s => `<div class="signal-card">
        <div class="signal-header"><div class="signal-dot"></div><span class="signal-time">${s.time}</span></div>
        <div class="signal-topic">${escapeHtml(s.type)}</div>
        <div class="signal-row"><span class="signal-label">HCP</span><span class="signal-value">${escapeHtml(s.hcp)}</span></div>
      </div>`).join("")}`;

    setTimeout(() => {
      sigSubmit.innerHTML = '<i class="ti ti-radar-2"></i> Submit Signal to Orion';
      sigSubmit.style.background = "";
      sigSubmit.disabled = true;
      sigHcp.value = ""; sigType.value = "";
      document.getElementById("sig-meeting-type").value = "";
      document.getElementById("sig-notes").value = "";
    }, 2000);
  }, 1200);
});

// ============================================================
// 4. MEDICAL INFORMATION
// ============================================================
const medInfoResponses = {
  "Dupixent (dupilumab)": {
    "Dosing & Administration": { title: "Dupixent Dosing & Administration", body: "<strong>Adults (Atopic Dermatitis):</strong> Loading dose 600mg (two 300mg injections), followed by 300mg every 2 weeks (Q2W) subcutaneously.<br><br><strong>Adolescents (12–17 years, ≥60kg):</strong> Same as adult dosing.<br><br><strong>Children (6–11 years):</strong> Weight-based — ≥60kg: adult dose; 30–59kg: 400mg loading → 200mg Q2W; 15–29kg: 600mg loading → 300mg Q4W.<br><br><strong>Administration:</strong> Subcutaneous injection into thigh, abdomen (except 2 inches around navel), or upper arm. Rotate injection sites. Allow to reach room temperature (45 min) before injection.", citations: ["Dupixent USPI §2.1 (Rev 03/2026)", "Sanofi Data on File — Pediatric Dosing Guide"] },
    "Safety / AE Profile": { title: "Dupixent Safety Profile", body: "<strong>Most common adverse reactions (≥1%):</strong> Injection site reactions (10%), conjunctivitis (10% AD, 3% asthma), keratitis (1%), oral herpes, eosinophilia.<br><br><strong>Serious warnings:</strong> Hypersensitivity reactions (rare, <1%). Do not discontinue systemic corticosteroids abruptly.<br><br><strong>Long-term safety:</strong> 3+ year data from LIBERTY AD CHRONOS demonstrate consistent safety. No routine laboratory monitoring required. No increased malignancy or serious infection signal vs placebo.", citations: ["LIBERTY AD SOLO 1&2 (Simpson et al., NEJM 2016)", "LIBERTY AD CHRONOS 3-year extension data"] },
    "Pregnancy / Lactation": { title: "Dupixent in Pregnancy & Lactation", body: "<strong>Pregnancy:</strong> Limited human data. Animal reproduction studies (monkeys) showed no adverse developmental effects at doses up to 10x human dose. IgG antibodies cross the placenta — transfer increases in third trimester.<br><br><strong>Lactation:</strong> No data on presence in human milk. IgG is present in human milk; clinical significance unknown.<br><br><strong>Recommendation:</strong> Weigh benefits vs risks. Pregnancy exposure registry available (OTIS Autoimmune Diseases in Pregnancy Study).", citations: ["Dupixent USPI §8.1–8.2 (Rev 03/2026)"] }
  }
};

document.getElementById("mi-submit").addEventListener("click", () => {
  const hcp = document.getElementById("mi-hcp").value.trim();
  const type = document.getElementById("mi-type").value;
  const product = document.getElementById("mi-product").value;
  const question = document.getElementById("mi-question").value.trim();
  if (!type || !product) { alert("Please select request type and product."); return; }

  const el = document.getElementById("mi-results");
  el.innerHTML = loader("#be185d");

  setTimeout(() => {
    const productData = medInfoResponses[product];
    const response = productData?.[type];

    if (response) {
      el.innerHTML = `
        <div class="result-card">
          <div class="result-card-header"><div class="result-title">${response.title}</div><span class="result-badge badge-accent">Medical Information</span></div>
          <div class="result-body">${response.body}</div>
          <div class="result-meta">${response.citations.map(c => `<span class="result-meta-item"><i class="ti ti-file-text"></i> ${escapeHtml(c)}</span>`).join("")}</div>
        </div>
        <div class="result-card" style="background:var(--warning-bg);border-color:#fde68a;">
          <div class="result-card-header"><div class="result-title" style="color:var(--warning);">Compliance Notice</div><span class="result-badge badge-warning">Required</span></div>
          <div class="result-body" style="color:var(--warning);">This response is for unsolicited medical information requests only. All information is from approved labeling and published literature. Response must be documented and filed per SOP-MIR-001. ${hcp ? `Requesting HCP: ${escapeHtml(hcp)}` : "HCP not specified — document before sending."}</div>
        </div>
        <div class="result-actions">
          <button class="form-btn form-btn-primary" style="font-size:11px;padding:7px 14px;"><i class="ti ti-download"></i> Export Response Letter</button>
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:7px 14px;"><i class="ti ti-mail"></i> Send to HCP</button>
        </div>`;
    } else {
      el.innerHTML = `
        <div class="result-card">
          <div class="result-card-header"><div class="result-title">Response Pending</div><span class="result-badge badge-info">In Queue</span></div>
          <div class="result-body">
            <p>A detailed response for <strong>${escapeHtml(type)}</strong> regarding <strong>${escapeHtml(product)}</strong> is being prepared.</p>
            ${question ? `<p><strong>Question details:</strong> ${escapeHtml(question)}</p>` : ""}
            <p style="margin-top:8px;">Standard MIR response time: 24–48 hours. For urgent requests, contact Medical Information at 1-800-633-1610.</p>
          </div>
        </div>`;
    }
  }, 1200);
});

// ============================================================
// 5. COMPETITIVE INTELLIGENCE
// ============================================================
const competitiveData = {
  "Dupixent (dupilumab)|Abrocitinib (Cibinqo) — Pfizer": {
    ta: "Atopic Dermatitis",
    h2hTrial: "JADE DARE (Pfizer-sponsored)",
    summary: "JADE DARE compared abrocitinib 200mg vs dupilumab 300mg in adults with moderate-to-severe AD. Co-primary endpoints: EASI-90 response and PP-NRS4 at Week 12.",
    table: [
      ["Endpoint", "Dupilumab 300mg Q2W", "Abrocitinib 200mg QD", "Significance"],
      ["EASI-90 Wk12", "39.0%", "48.4%", "Abrocitinib met superiority"],
      ["PP-NRS4 Wk2", "24.5%", "49.1%", "Abrocitinib met superiority (itch speed)"],
      ["EASI-90 Wk26*", "~50%", "~45%", "Dupilumab numerically higher at Wk26"],
      ["Safety — SAEs", "3.0%", "4.7%", "Higher SAE rate with abrocitinib"],
      ["Herpes zoster", "0.3%", "2.8%", "10x higher with JAK inhibitor"],
      ["Lab monitoring", "Not required", "Required (CBC, lipids, LFTs)", "Dupilumab advantage"],
    ],
    keyMessages: [
      "JADE DARE was Pfizer-sponsored and powered for Week 12 — favoring rapid-onset JAK mechanism",
      "Dupilumab durability at Week 26+ shows sustained/improving response vs JAK plateau",
      "Safety profile strongly favors dupilumab: no JAK-class warnings (VTE, MACE, malignancy, herpes zoster)",
      "Dupilumab requires no routine lab monitoring — significant practical advantage",
      "FDA boxed warning on all JAK inhibitors (not on dupilumab)"
    ]
  },
  "Dupixent (dupilumab)|Upadacitinib (Rinvoq) — AbbVie": {
    ta: "Atopic Dermatitis",
    h2hTrial: "Heads Up (AbbVie-sponsored)",
    summary: "Heads Up compared upadacitinib 30mg vs dupilumab in adults with moderate-to-severe AD. Primary: EASI-75 at Week 16.",
    table: [
      ["Endpoint", "Dupilumab 300mg Q2W", "Upadacitinib 30mg QD", "Significance"],
      ["EASI-75 Wk16", "61.1%", "71.0%", "Upadacitinib met superiority"],
      ["EASI-90 Wk16", "38.8%", "60.6%", "Upadacitinib met superiority"],
      ["Safety — SAEs", "5.0%", "8.1%", "Higher SAE rate with upadacitinib"],
      ["Acne (new onset)", "1.6%", "15.8%", "10x higher with upadacitinib"],
      ["CPK elevation", "1.8%", "5.7%", "3x higher with upadacitinib"],
      ["Lab monitoring", "Not required", "Required (CBC, lipids, LFTs, CPK)", "Dupilumab advantage"],
    ],
    keyMessages: [
      "Heads Up used 30mg upadacitinib (higher dose) — 15mg dose not tested H2H",
      "Safety profile strongly favors dupilumab across all metrics",
      "JAK-class boxed warning applies to upadacitinib (not dupilumab)",
      "Long-term data: dupilumab has 5+ years; upadacitinib has limited long-term data",
      "Acne and CPK elevations are dose-limiting for upadacitinib in clinical practice"
    ]
  },
  "Kevzara (sarilumab)|Tocilizumab (Actemra) — Roche": {
    ta: "Rheumatoid Arthritis",
    h2hTrial: "MONARCH (Sanofi-sponsored)",
    summary: "MONARCH compared sarilumab 200mg Q2W vs adalimumab 40mg Q2W as monotherapy in RA. Primary: DAS28-ESR change at Week 24.",
    table: [
      ["Endpoint", "Sarilumab 200mg Q2W", "Adalimumab 40mg Q2W", "Significance"],
      ["DAS28-ESR Δ Wk24", "-3.28", "-2.20", "Sarilumab superior (p<0.0001)"],
      ["ACR20 Wk24", "71.7%", "58.4%", "Sarilumab superior"],
      ["HAQ-DI Δ Wk24", "-0.61", "-0.43", "Sarilumab superior"],
      ["DAS28 remission", "26.6%", "7.0%", "Sarilumab 4x higher remission"],
    ],
    keyMessages: [
      "MONARCH is the only H2H monotherapy trial showing superiority vs adalimumab — a key differentiator",
      "Sarilumab particularly suited for patients who cannot tolerate MTX",
      "IL-6 pathway addresses both joint and systemic RA manifestations including fatigue",
      "Note: comparison is vs adalimumab, not tocilizumab — different IL-6 mechanism (receptor vs cytokine)"
    ]
  }
};

document.getElementById("ci-submit").addEventListener("click", () => {
  const product = document.getElementById("ci-product").value;
  const competitor = document.getElementById("ci-competitor").value;
  if (!product || !competitor) { alert("Please select both a Sanofi product and competitor."); return; }

  const el = document.getElementById("ci-results");
  el.innerHTML = loader("#b45309");

  setTimeout(() => {
    const key = `${product}|${competitor}`;
    const data = competitiveData[key];

    if (!data) {
      el.innerHTML = `<div class="result-card"><div class="result-card-header"><div class="result-title">No H2H Data Available</div><span class="result-badge badge-warning">Limited</span></div><div class="result-body"><p>No direct head-to-head comparison data found for <strong>${escapeHtml(product)}</strong> vs <strong>${escapeHtml(competitor)}</strong>.</p><p style="margin-top:8px;">Contact your Medical Affairs team for indirect comparison data or network meta-analyses. You can also check the Literature Intelligence module for published comparisons.</p></div></div>`;
      return;
    }

    el.innerHTML = `
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${escapeHtml(data.h2hTrial)}</div><span class="result-badge badge-accent">${escapeHtml(data.ta)}</span></div>
        <div class="result-body"><p>${data.summary}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Comparative Data</div><span class="result-badge badge-info">H2H Trial</span></div>
        <div class="result-body">
          <table class="comp-table">
            <thead><tr>${data.table[0].map(h => `<th>${h}</th>`).join("")}</tr></thead>
            <tbody>${data.table.slice(1).map(r => `<tr>${r.map((c, i) => `<td${i === 1 ? ' class="comp-highlight"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
      <div class="result-card" style="background:var(--accent-light);border-color:var(--accent)33;">
        <div class="result-card-header"><div class="result-title" style="color:var(--accent-text);">Key Scientific Exchange Messages</div></div>
        <div class="result-body"><ul>${data.keyMessages.map(m => `<li style="margin-bottom:6px;">${m}</li>`).join("")}</ul></div>
      </div>`;
  }, 1200);
});

// ============================================================
// 6. CONGRESS PLANNER
// ============================================================
const congressData = {
  "EADV 2026 — European Academy of Dermatology (Sep 2026)": {
    fullName: "EADV 2026", location: "Vienna, Austria", dates: "Sep 23–27, 2026",
    sanofiPresence: "2 oral presentations, 5 poster presentations, 1 satellite symposium",
    hcpsAttending: ["Dr. Sarah Chen (site PI — LIBERTY AD PED)", "Dr. Emily Nakamura (invited speaker)"],
    presentations: [
      { title: "LIBERTY AD CHRONOS: 4-Year Safety & Efficacy of Dupilumab in Adults", type: "Oral", session: "Late-Breaking Session 2", presenter: "Prof. Eric Simpson" },
      { title: "Real-World Effectiveness of Dupilumab in Pediatric AD: DUPIXENT REAL Registry", type: "Poster", session: "E-Poster Hall", presenter: "Dr. Amy Paller" },
      { title: "Dupilumab in Prurigo Nodularis: PRIME 2 Trial 52-Week Results", type: "Oral", session: "Clinical Trials Session", presenter: "Prof. Shawn Kwatra" }
    ],
    actions: ["Schedule 1:1 with Dr. Chen to preview CRSwNP poster data", "Confirm Dr. Nakamura satellite symposium invitation", "Prepare LIBERTY AD CHRONOS 4-year talking points", "Book exhibition booth meeting slots"]
  },
  "ACR 2026 — American College of Rheumatology (Nov 2026)": {
    fullName: "ACR 2026", location: "Washington, DC", dates: "Nov 14–18, 2026",
    sanofiPresence: "1 oral presentation, 3 poster presentations",
    hcpsAttending: ["Dr. Michael Torres (Advisory Board member)"],
    presentations: [
      { title: "MONARCH Long-Term Extension: Sarilumab Monotherapy Durability at 3 Years", type: "Oral", session: "RA Treatment Session", presenter: "Prof. Gerd Burmester" },
      { title: "Sarilumab Impact on Patient-Reported Fatigue in RA: MONARCH PRO Analysis", type: "Poster", session: "PROs in Rheumatology", presenter: "Dr. Vibeke Strand" }
    ],
    actions: ["Share MONARCH extension data with Dr. Torres pre-congress", "Prepare IL-6 fatigue mechanism slide deck", "Register for competitor symposia (adalimumab biosimilar landscape)"]
  }
};

document.getElementById("cg-submit").addEventListener("click", () => {
  const congress = document.getElementById("cg-congress").value;
  if (!congress) { alert("Please select a congress."); return; }

  const el = document.getElementById("cg-results");
  el.innerHTML = loader("#0369a1");

  setTimeout(() => {
    const data = congressData[congress];
    if (!data) {
      el.innerHTML = `<div class="result-card"><div class="result-card-header"><div class="result-title">Planning in Progress</div><span class="result-badge badge-info">Coming Soon</span></div><div class="result-body"><p>Congress planning data for <strong>${escapeHtml(congress)}</strong> is not yet available. Check back closer to the event or contact your Medical Affairs lead.</p></div></div>`;
      return;
    }

    const congressSlug = data.fullName.toLowerCase().replace(/\s+/g, '-');
    el.innerHTML = `
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${escapeHtml(data.fullName)}</div><span class="result-badge badge-info">${escapeHtml(data.dates)}</span></div>
        <div class="result-body">
          <p><strong>Location:</strong> ${escapeHtml(data.location)}</p>
          <p><strong>Sanofi presence:</strong> ${escapeHtml(data.sanofiPresence)}</p>
          <a href="/congress.html#congress=${congressSlug}" style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:12px;font-weight:600;color:#dc2626;text-decoration:none;" target="_blank"><i class="ti ti-external-link" style="font-size:14px;"></i> View Full Congress Coverage</a>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Your HCPs Attending</div><span class="result-badge badge-accent">Territory</span></div>
        <div class="result-body">${data.hcpsAttending.map(h => `<div class="msl-profile" style="margin-bottom:6px;"><div class="msl-avatar" style="width:36px;height:36px;font-size:16px;border-radius:10px;"><i class="ti ti-user"></i></div><div><div class="msl-name" style="font-size:13px;">${escapeHtml(h)}</div></div></div>`).join("")}</div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Sanofi Presentations</div><span class="result-badge badge-orion">Scientific</span></div>
        <div class="result-body">${data.presentations.map(p => `<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
          <div style="font-weight:600;font-size:13px;margin-bottom:4px;">${escapeHtml(p.title)}</div>
          <div class="result-meta"><span class="result-meta-item"><i class="ti ti-presentation"></i> ${escapeHtml(p.type)}</span><span class="result-meta-item"><i class="ti ti-clock"></i> ${escapeHtml(p.session)}</span><span class="result-meta-item"><i class="ti ti-user"></i> ${escapeHtml(p.presenter)}</span></div>
          <a href="/congress.html#congress=${congressSlug}" style="display:inline-flex;align-items:center;gap:3px;margin-top:4px;font-size:11px;font-weight:500;color:var(--accent);text-decoration:none;" target="_blank"><i class="ti ti-file-description" style="font-size:12px;"></i> View Poster Overview</a>
        </div>`).join("")}</div>
      </div>
      <div class="result-card" style="background:var(--accent-light);border-color:var(--accent)33;">
        <div class="result-card-header"><div class="result-title" style="color:var(--accent-text);">Action Items</div><span class="result-badge badge-accent">To-Do</span></div>
        <div class="result-body"><ul>${data.actions.map(a => `<li style="margin-bottom:6px;">${escapeHtml(a)}</li>`).join("")}</ul></div>
      </div>`;
    broadcastSignal({ topic: `Congress Planning — ${data.fullName}`, intent: "Congress intelligence", diseaseArea: "Multi-indication", depth: "Deep engagement", orionAction: `PRIORITY: MSL planning congress engagement — ${data.presentations.length} presentations`, queries: [`${data.fullName} HCP attendance and presentations`], contentAccessed: data.presentations.map(p => p.title), _source: "MSL Copilot" });
  }, 1000);
});

// ============================================================
// 7. KOL PROFILING
// ============================================================
document.getElementById("kol-submit").addEventListener("click", () => {
  const name = document.getElementById("kol-name").value.trim();
  const focus = document.getElementById("kol-focus").value;
  if (!name) { alert("Please enter a KOL name."); return; }

  const el = document.getElementById("kol-results");
  el.innerHTML = loader("#a21caf");

  setTimeout(() => {
    const hcp = findHcp(name);
    if (!hcp) {
      el.innerHTML = `<div class="result-empty"><i class="ti ti-star"></i>No KOL found matching "${escapeHtml(name)}". Try: Dr. Sarah Chen, Dr. Torres, or Dr. Nakamura.</div>`;
      return;
    }

    const scoreColor = hcp.kolScore >= 80 ? "var(--success)" : hcp.kolScore >= 60 ? "var(--warning)" : "var(--text-muted)";
    const scoreLabel = hcp.kolScore >= 80 ? "High Influence" : hcp.kolScore >= 60 ? "Rising Influence" : "Emerging";

    el.innerHTML = `
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${escapeHtml(hcp.name)}</div><span class="result-badge badge-accent">${escapeHtml(hcp.tier)}</span></div>
        <div class="result-body">
          <p><strong>${escapeHtml(hcp.specialty)}</strong> · ${escapeHtml(hcp.institution)}</p>
          <p>${escapeHtml(hcp.city)}</p>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">KOL Influence Score</div><span class="result-badge" style="background:${scoreColor}22;color:${scoreColor};">${scoreLabel}</span></div>
        <div class="result-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div style="text-align:center;padding:12px;background:var(--surface-dim);border-radius:8px;">
              <div style="font-size:28px;font-weight:700;color:${scoreColor};">${hcp.kolScore}</div>
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">Overall Score</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--surface-dim);border-radius:8px;">
              <div style="font-size:28px;font-weight:700;color:var(--accent);">${hcp.hIndex}</div>
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">h-Index</div>
            </div>
          </div>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Engagement Metrics</div></div>
        <div class="result-body">
          <div class="detail-row"><span class="detail-label">Publications</span><span><strong>${hcp.publications}</strong> recent (Sanofi-relevant)</span></div>
          <div class="detail-row"><span class="detail-label">Advisory Boards</span><span><strong>${hcp.advisoryBoards}</strong> lifetime</span></div>
          <div class="detail-row"><span class="detail-label">Speaker Programs</span><span><strong>${hcp.speakerPrograms}</strong> lifetime</span></div>
          <div class="detail-row"><span class="detail-label">Orion Signals</span><span><strong>${hcp.orionSignals}</strong> total engagements</span></div>
          <div class="detail-row"><span class="detail-label">Congress</span><span>${hcp.congressAttendance.join(", ")}</span></div>
          <div class="detail-row"><span class="detail-label">Active Trials</span><span>${hcp.trials.length ? hcp.trials.join("; ") : "None"}</span></div>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Scientific Interests</div></div>
        <div class="result-body">${hcp.interests.map(i => `<span class="interest-chip">${escapeHtml(i)}</span>`).join("")}</div>
      </div>
      <div class="result-card" style="background:var(--orion-bg);border-color:#9fe1cb;">
        <div class="result-card-header"><div class="result-title" style="color:#085041;">Recent MedVerse Activity</div><span class="result-badge badge-orion">Orion Intel</span></div>
        <div class="result-body" style="color:#085041;">${hcp.recentQueries.map(q => `<div class="query-item"><i class="ti ti-message-dots" style="color:var(--orion-accent);font-size:13px;"></i> ${escapeHtml(q)}</div>`).join("")}</div>
      </div>`;
  }, 1200);
});
document.getElementById("kol-name").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("kol-submit").click();
});

// ============================================================
// 8. COMPLIANCE ADVISOR
// ============================================================
document.getElementById("comp-submit").addEventListener("click", () => {
  const hcp = document.getElementById("comp-hcp").value.trim();
  const type = document.getElementById("comp-type").value;
  const topics = document.getElementById("comp-topics").value.trim();
  const meal = document.getElementById("comp-meal").value;
  if (!type) { alert("Please select an interaction type."); return; }

  const el = document.getElementById("comp-results");
  el.innerHTML = loader("var(--success)");

  setTimeout(() => {
    const checks = [];

    // Interaction type check
    checks.push({ status: "pass", label: "Interaction Type", text: `${type} is an approved MSL interaction type per SOP-MSL-003.` });

    // Topics check
    if (topics) {
      const offLabel = ["off-label", "unapproved", "promotion"].some(w => topics.toLowerCase().includes(w));
      if (offLabel) {
        checks.push({ status: "fail", label: "Topic Review", text: "Potential off-label or promotional language detected. MSL interactions must be limited to scientific exchange on approved indications. Review topics with Medical Affairs before proceeding." });
      } else {
        checks.push({ status: "pass", label: "Topic Review", text: "Topics appear consistent with scientific exchange guidelines. Ensure fair balance is maintained in all discussions." });
      }
    }

    // Meal check
    if (meal === "none") {
      checks.push({ status: "pass", label: "Meal / Gift", text: "No meal or gift — no additional compliance requirements." });
    } else if (meal === "modest") {
      checks.push({ status: "pass", label: "Meal / Gift", text: "Modest meal (≤$75) is within PhRMA Code and Sunshine Act thresholds. Must be incidental to the scientific exchange, not the primary purpose." });
    } else if (meal === "meal") {
      checks.push({ status: "warn", label: "Meal / Gift", text: "Meal value $75–$150 requires manager pre-approval. Verify state-specific limits (some states cap at $50). Document business purpose." });
    } else if (meal === "gift") {
      checks.push({ status: "pass", label: "Meal / Gift", text: "Educational reprints are permissible when related to the HCP's practice. Ensure no promotional materials are included." });
    }

    // HCP check
    if (hcp) {
      const hcpData = findHcp(hcp);
      if (hcpData) {
        const interactions = hcpData.orionSignals || 0;
        if (interactions > 15) {
          checks.push({ status: "warn", label: "Frequency Check", text: `${hcpData.name} has ${interactions} recorded interactions. High-frequency engagement may require documentation of scientific rationale per SOP-MSL-005.` });
        } else {
          checks.push({ status: "pass", label: "Frequency Check", text: `${hcpData.name} — interaction frequency within normal range (${interactions} signals).` });
        }
      }
    }

    // Sunshine Act
    checks.push({ status: "pass", label: "Sunshine Act", text: "Reminder: All transfers of value >$10 must be reported under the Physician Payments Sunshine Act (Open Payments). Ensure accurate recording." });

    // Documentation
    checks.push({ status: "pass", label: "Documentation", text: "Post-call CRM entry required within 24 hours. Submit Orion signal for intelligence routing." });

    const hasWarn = checks.some(c => c.status === "warn");
    const hasFail = checks.some(c => c.status === "fail");
    const overallStatus = hasFail ? "Issues Found" : hasWarn ? "Proceed with Caution" : "All Clear";
    const overallBadge = hasFail ? "badge-danger" : hasWarn ? "badge-warning" : "badge-success";

    el.innerHTML = `
      <div class="result-card" style="background:${hasFail ? 'var(--danger-bg)' : hasWarn ? 'var(--warning-bg)' : 'var(--success-bg)'};border-color:${hasFail ? '#fca5a5' : hasWarn ? '#fde68a' : '#86efac'};">
        <div class="result-card-header"><div class="result-title">${overallStatus}</div><span class="result-badge ${overallBadge}">Compliance</span></div>
        <div class="result-body">${hasFail ? "One or more compliance issues require attention before proceeding." : hasWarn ? "Meeting can proceed — review flagged items below." : "All compliance checks passed. You are clear to proceed with this interaction."}</div>
      </div>
      ${checks.map(c => `<div class="checklist-item checklist-${c.status}">
        <div class="checklist-icon"><i class="ti ti-${c.status === "pass" ? "check" : c.status === "warn" ? "alert-triangle" : "x"}"></i></div>
        <div class="checklist-text"><div class="checklist-label">${escapeHtml(c.label)}</div><div>${c.text}</div></div>
      </div>`).join("")}`;
  }, 1000);
});

// ============================================================
// 9. LITERATURE INTELLIGENCE (MSL)
// ============================================================
const litDatabase = [
  { title: "Long-term Safety and Efficacy of Dupilumab in Adults with Moderate-to-Severe AD: LIBERTY AD CHRONOS 4-Year Results", authors: "Simpson EL, Paller AS, et al.", journal: "J Am Acad Dermatol", year: "2026", type: "Clinical Trial", impact: "High" },
  { title: "Dupilumab vs Abrocitinib in Adults with Moderate-to-Severe AD: JADE DARE Randomized Trial", authors: "Reich K, Thyssen JP, et al.", journal: "NEJM", year: "2025", type: "Clinical Trial", impact: "Very High" },
  { title: "Real-World Effectiveness of Dupilumab Across Type 2 Inflammatory Conditions: Systematic Review", authors: "Wollenberg A, et al.", journal: "Allergy", year: "2026", type: "Meta-Analysis", impact: "High" },
  { title: "Patient-Reported Outcomes with Dupilumab in Prurigo Nodularis: PRIME 2 Trial", authors: "Kwatra SG, et al.", journal: "Br J Dermatol", year: "2026", type: "Clinical Trial", impact: "Medium" },
  { title: "IL-4/IL-13 Pathway Blockade in Eosinophilic Esophagitis: Insights from LIBERTY EoE TREET", authors: "Dellon ES, et al.", journal: "Gastroenterology", year: "2025", type: "Clinical Trial", impact: "High" },
  { title: "Sarilumab Monotherapy Superiority over Adalimumab: MONARCH 3-Year Extension", authors: "Burmester GR, et al.", journal: "Ann Rheum Dis", year: "2026", type: "Clinical Trial", impact: "High" },
];

document.getElementById("msl-lit-submit").addEventListener("click", () => {
  const query = document.getElementById("msl-lit-query").value.trim();
  if (!query) { alert("Please enter a search query."); return; }
  const el = document.getElementById("msl-lit-results");
  el.innerHTML = loader("#a21caf");

  setTimeout(() => {
    const q = query.toLowerCase();
    let matches = litDatabase.filter(p => q.split(/\s+/).some(w => (p.title + " " + p.authors).toLowerCase().includes(w)));
    if (!matches.length) matches = litDatabase.slice(0, 3);
    const impactColor = i => i === "Very High" ? "badge-danger" : i === "High" ? "badge-accent" : "badge-info";

    el.innerHTML = `<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${matches.length} results</div>` +
      matches.map(p => `<div class="result-card">
        <div class="result-card-header"><div class="result-title" style="font-size:13px;">${escapeHtml(p.title)}</div></div>
        <div class="result-body"><p>${escapeHtml(p.authors)}</p></div>
        <div class="result-meta">
          <span class="result-meta-item"><i class="ti ti-book"></i> ${escapeHtml(p.journal)} (${p.year})</span>
          <span class="result-meta-item"><i class="ti ti-flask"></i> ${escapeHtml(p.type)}</span>
          <span class="result-badge ${impactColor(p.impact)}" style="font-size:9px;">${p.impact} impact</span>
        </div>
        <div class="result-actions">
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-external-link"></i> PubMed</button>
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-file-text"></i> Summary</button>
        </div>
      </div>`).join("");
  }, 1000);
});
document.getElementById("msl-lit-query").addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("msl-lit-submit").click(); });

// ============================================================
// 10. LITERATURE SCOUT (MSL)
// ============================================================
const scoutAlerts = {
  "Atopic Dermatitis": [
    { title: "New JAK inhibitor long-term safety data raises concerns (BMJ, Jul 2026)", type: "Competitor", urgency: "high" },
    { title: "AAD updates AD treatment guidelines — biologics as first-line option (JAAD, Jun 2026)", type: "Guideline", urgency: "high" },
    { title: "Real-world Dupixent adherence data: 82% persistence at 2 years (Dermatol Ther, Jul 2026)", type: "Sanofi", urgency: "medium" },
  ],
  "Asthma (Type 2)": [
    { title: "Dupilumab COPD Phase 3 BOREAS-2 interim: sustained FEV1 benefit (NEJM, Jul 2026)", type: "Sanofi", urgency: "high" },
    { title: "GINA 2026 update: biologic add-on therapy algorithm revised (Eur Respir J, May 2026)", type: "Guideline", urgency: "high" },
  ],
  "Rheumatoid Arthritis": [
    { title: "MONARCH 3-year extension confirms sarilumab monotherapy durability (Ann Rheum Dis, Jul 2026)", type: "Sanofi", urgency: "high" },
    { title: "EULAR 2026 RA recommendations update — IL-6 pathway positioning strengthened", type: "Guideline", urgency: "high" },
  ]
};

document.getElementById("msl-scout-submit").addEventListener("click", () => {
  const ta = document.getElementById("msl-scout-ta").value;
  if (!ta) { alert("Please select a therapeutic area."); return; }
  const el = document.getElementById("msl-scout-results");
  el.innerHTML = loader("#c2410c");

  setTimeout(() => {
    const alerts = scoutAlerts[ta] || [];
    if (!alerts.length) { el.innerHTML = '<div class="result-empty"><i class="ti ti-binoculars"></i>No recent alerts. Check back soon.</div>'; return; }
    const typeColor = t => t === "Sanofi" ? "badge-accent" : t === "Competitor" ? "badge-danger" : "badge-info";

    el.innerHTML = `<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${alerts.length} alerts for ${escapeHtml(ta)}</div>` +
      alerts.map(a => `<div class="result-card">
        <div class="result-card-header"><div class="result-title" style="font-size:13px;">${escapeHtml(a.title)}</div></div>
        <div class="result-meta">
          <span class="result-badge ${typeColor(a.type)}">${escapeHtml(a.type)}</span>
          <span class="result-meta-item" style="color:${a.urgency === "high" ? "var(--danger)" : "var(--warning)"};"><i class="ti ti-${a.urgency === "high" ? "alert-triangle" : "info-circle"}"></i> ${a.urgency === "high" ? "Priority" : "Monitor"}</span>
        </div>
        <div class="result-actions">
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-external-link"></i> Read</button>
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-file-text"></i> AI Summary</button>
        </div>
      </div>`).join("");
  }, 1000);
});

// ============================================================
// 11. DISEASE NAVIGATOR (MSL)
// ============================================================
const diseaseProfiles = {
  "Atopic Dermatitis": {
    overview: "Chronic, relapsing inflammatory skin disease driven by <strong>type 2 inflammation</strong> (IL-4, IL-13, IL-31). Affects ~10% of adults and up to 25% of children.",
    pathophysiology: "Epidermal barrier dysfunction → allergen penetration → Th2 immune activation → IL-4/IL-13 overexpression → IgE elevation, eosinophilia, pruritus (IL-31).",
    treatments: [
      { name: "Dupixent (dupilumab)", class: "Anti-IL-4Rα mAb", status: "Approved", note: "First-line biologic. Blocks IL-4 and IL-13." },
      { name: "Abrocitinib (Cibinqo)", class: "JAK1 inhibitor", status: "Competitor", note: "Pfizer. Oral. Faster itch onset but JAK safety concerns." },
      { name: "Upadacitinib (Rinvoq)", class: "JAK1 inhibitor", status: "Competitor", note: "AbbVie. Oral. Boxed warning." },
    ],
    crossTA: ["Asthma (shared IL-4/IL-13)", "CRSwNP (type 2 comorbidity)", "Eosinophilic Esophagitis", "Food allergy"],
    pipeline: "Dupixent extensions: pediatric <6mo, moderate-only (IGA3), prurigo nodularis, COPD, CSU, bullous pemphigoid"
  },
  "Rheumatoid Arthritis": {
    overview: "Chronic autoimmune inflammatory arthritis affecting ~1% of the population. Driven by TNF, IL-6, IL-1, and T/B cell activation.",
    pathophysiology: "Synovial inflammation → pannus formation → cartilage/bone erosion. IL-6 pathway drives joint + systemic effects (fatigue, anemia).",
    treatments: [
      { name: "Kevzara (sarilumab)", class: "Anti-IL-6Rα mAb", status: "Approved", note: "MONARCH: superior to adalimumab as monotherapy." },
      { name: "Adalimumab (Humira)", class: "Anti-TNF mAb", status: "Competitor", note: "Standard of care. Multiple biosimilars." },
    ],
    crossTA: ["Cardiovascular risk", "Depression/fatigue (systemic IL-6)", "Interstitial lung disease"],
    pipeline: "Sarilumab: monotherapy positioning, real-world evidence"
  }
};

document.getElementById("msl-dn-submit").addEventListener("click", () => {
  const disease = document.getElementById("msl-dn-disease").value;
  if (!disease) { alert("Please select a disease."); return; }
  const el = document.getElementById("msl-dn-results");
  el.innerHTML = loader("#059669");

  setTimeout(() => {
    const data = diseaseProfiles[disease];
    if (!data) {
      el.innerHTML = `<div class="result-card"><div class="result-card-header"><div class="result-title">${escapeHtml(disease)}</div><span class="result-badge badge-info">Profile</span></div><div class="result-body"><p>Detailed profile for <strong>${escapeHtml(disease)}</strong> coming soon. Visit the <a href="/disease.html" style="color:var(--accent);">Disease Navigator module</a> for full information.</p></div></div>`;
      return;
    }
    const statusColor = s => s === "Approved" ? "badge-success" : "badge-danger";

    el.innerHTML = `
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${escapeHtml(disease)}</div><span class="result-badge badge-accent">Disease Profile</span></div>
        <div class="result-body"><p>${data.overview}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Pathophysiology</div><span class="result-badge badge-info">Mechanism</span></div>
        <div class="result-body"><p>${data.pathophysiology}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Treatment Landscape</div></div>
        <div class="result-body">${data.treatments.map(t => `<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border);">
          <span class="result-badge ${statusColor(t.status)}" style="flex-shrink:0;margin-top:2px;">${t.status}</span>
          <div><div style="font-weight:600;font-size:12px;">${escapeHtml(t.name)} <span style="font-weight:400;color:var(--text-muted);">(${escapeHtml(t.class)})</span></div><div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${escapeHtml(t.note)}</div></div>
        </div>`).join("")}</div>
      </div>
      <div class="result-card" style="background:var(--orion-bg);border-color:#9fe1cb;">
        <div class="result-card-header"><div class="result-title" style="color:#085041;">Cross-TA Connections</div><span class="result-badge badge-orion">Type 2</span></div>
        <div class="result-body">${data.crossTA.map(c => `<span class="interest-chip" style="background:#c6f1dc;color:#085041;">${escapeHtml(c)}</span>`).join("")}</div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Sanofi Pipeline</div><span class="result-badge badge-accent">Pipeline</span></div>
        <div class="result-body"><p>${escapeHtml(data.pipeline)}</p></div>
      </div>`;
  }, 1000);
});

// ============================================================
// 12. ORION INTELLIGENCE (MSL Embedded)
// ============================================================
function renderOrion() {
  const el = document.getElementById("orion-content");
  if (!el) return;

  const signals = [
    { hcp: "Dr. Sarah Chen", topic: "Dupilumab vs abrocitinib H2H data", intent: "Competitive comparison", disease: "Atopic Dermatitis", depth: "Deep engagement", action: "PRIORITY: Prepare H2H data deck for next meeting", time: "2h ago" },
    { hcp: "Dr. Emily Nakamura", topic: "Type 2 inflammation cross-disease connections", intent: "Scientific exploration", disease: "Multi-TA (AD + Asthma + EoE)", depth: "Deep engagement — cross-TA query", action: "Invite to EADV satellite symposium", time: "1d ago" },
    { hcp: "Dr. Michael Torres", topic: "MONARCH sarilumab vs adalimumab monotherapy", intent: "Treatment decision", disease: "Rheumatoid Arthritis", depth: "Moderate engagement", action: "Share MONARCH extension data when available", time: "3d ago" },
    { hcp: "Dr. James Liu", topic: "Dupixent pediatric AD dosing", intent: "Dosing information", disease: "Atopic Dermatitis", depth: "Light engagement", action: "Route to MIR team", time: "4d ago" },
    { hcp: "Dr. Sarah Chen", topic: "EASI-75 durability beyond 52 weeks", intent: "Long-term efficacy", disease: "Atopic Dermatitis", depth: "Deep engagement", action: "Include CHRONOS 4-year data in next briefing", time: "5d ago" },
  ];

  const trendData = [
    { label: "Type 2 Inflammation", count: 34, trend: "+12%" },
    { label: "Competitive Landscape", count: 22, trend: "+28%" },
    { label: "Pediatric Dosing", count: 18, trend: "+5%" },
    { label: "Real-World Evidence", count: 15, trend: "+15%" },
    { label: "Cross-TA Comorbidities", count: 12, trend: "+40%" },
  ];

  el.innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile"><div class="stat-num">142</div><div class="stat-label">Total Signals (Aug)</div></div>
      <div class="stat-tile"><div class="stat-num">38</div><div class="stat-label">Your Territory</div></div>
      <div class="stat-tile"><div class="stat-num">7</div><div class="stat-label">Priority Alerts</div></div>
      <div class="stat-tile"><div class="stat-num">4.2</div><div class="stat-label">Avg Depth Score</div></div>
    </div>
    <div class="territory-grid">
      <div class="territory-section">
        <h3><i class="ti ti-trending-up"></i> Trending Topics</h3>
        ${trendData.map(t => `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);">
          <div style="flex:1;font-size:13px;font-weight:500;">${escapeHtml(t.label)}</div>
          <div style="font-size:14px;font-weight:600;color:var(--accent);">${t.count}</div>
          <div style="font-size:11px;color:var(--success);font-weight:500;">${t.trend}</div>
        </div>`).join("")}
      </div>
      <div class="territory-section">
        <h3><i class="ti ti-radar-2"></i> Recent Signals</h3>
        ${signals.slice(0, 3).map(s => `<div class="signal-card">
          <div class="signal-header"><div class="signal-dot"></div><span class="signal-time">${s.time}</span></div>
          <div class="signal-topic">${escapeHtml(s.topic)}</div>
          <div class="signal-row"><span class="signal-label">HCP</span><span class="signal-value">${escapeHtml(s.hcp)}</span></div>
          <div class="signal-row"><span class="signal-label">Disease</span><span class="signal-value">${escapeHtml(s.disease)}</span></div>
          <div class="signal-row"><span class="signal-label">Depth</span><span class="signal-value">${escapeHtml(s.depth)}</span></div>
          <div class="signal-action"><i class="ti ti-arrow-right"></i><span>${escapeHtml(s.action)}</span></div>
        </div>`).join("")}
      </div>
    </div>
    <div style="margin-top:16px;">
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">All Territory Signals</div><span class="result-badge badge-orion">${signals.length} signals</span></div>
        <div class="result-body">${signals.map(s => `<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);align-items:flex-start;">
          <div style="min-width:80px;font-size:11px;color:var(--text-muted);">${s.time}</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:600;">${escapeHtml(s.hcp)}</div>
            <div style="font-size:12px;color:var(--text-secondary);">${escapeHtml(s.topic)}</div>
            <div style="font-size:11px;color:var(--orion-accent);margin-top:2px;">${escapeHtml(s.action)}</div>
          </div>
          <span class="result-badge badge-orion" style="font-size:9px;flex-shrink:0;">${escapeHtml(s.depth.split(" — ")[0])}</span>
        </div>`).join("")}</div>
      </div>
    </div>`;
}
renderOrion();

// ============================================================
// DEMO
// ============================================================
const demoBtn = document.getElementById("run-demo");
let demoRunning = false;

async function narrate(text) {
  const el = document.getElementById("demo-narrator");
  if (!el) return;
  el.innerHTML = `<i class="ti ti-sparkles"></i> ${escapeHtml(text)}`;
  if (isCCEnabled()) el.classList.add("visible");
  showControls();
  await speakAndWait(text);
}
function narrateOff() {
  const el = document.getElementById("demo-narrator");
  if (el) el.classList.remove("visible");
  stopSpeaking(); hideControls();
}

// === TERRITORY CARE GAPS ===
// Region-level only. There is deliberately no patient count and no HCP-linked
// figure here — Patient Services holds that linkage and the Commercial
// Firewall withholds it from field medical.
function renderCareGaps(region) {
  const el = document.getElementById("tcg-results");
  if (!el) return;
  el.innerHTML = loader("#c2410c");

  setTimeout(() => {
    const r = getRegionRollup(region);
    if (!r) {
      el.innerHTML = '<div class="result-empty"><i class="ti ti-chart-histogram"></i>No aggregate data for that region.</div>';
      return;
    }
    const ranked = CARE_GAPS
      .map(g => ({ g, rate: r.gapRates[g.id], delta: Math.round((r.gapRates[g.id] - g.nationalRate) * 10) / 10 }))
      .sort((a, b) => {
        if (a.g.safetyRelevant !== b.g.safetyRelevant) return a.g.safetyRelevant ? -1 : 1;
        return b.delta - a.delta;
      });

    const gapRows = ranked.map(({ g, rate, delta }) => {
      const unit = g.unit === "mo" ? " mo" : "%";
      const dTxt = (delta > 0 ? "+" : "") + delta + (g.unit === "mo" ? "mo" : "pp");
      const dColor = delta > 0 ? "var(--danger)" : "var(--success)";
      return `<tr>
        <td><strong>${escapeHtml(g.name)}</strong>${g.safetyRelevant
          ? ' <span style="font-size:9.5px;font-weight:700;padding:2px 6px;border-radius:4px;background:var(--danger-bg);color:var(--danger);">SAFETY</span>' : ""}</td>
        <td>${rate}${unit}</td>
        <td style="color:var(--text-muted);">${g.nationalRate}${unit}</td>
        <td style="color:${dColor};font-weight:700;">${escapeHtml(dTxt)}</td>
        <td style="font-size:11.5px;">${escapeHtml(g.educationNeed)}</td>
      </tr>`;
    }).join("");

    const cands = getCandidatesForRegion(region);
    const candCards = cands.length ? cands.map(c => `
      <div style="background:var(--surface-dim);border:1px solid var(--border);border-radius:10px;padding:13px;">
        <div style="font-size:13.5px;font-weight:700;">${escapeHtml(c.name)}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:7px;">${escapeHtml(c.specialty)} · ${escapeHtml(c.institution)}</div>
        <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.5;"><strong>Why:</strong> ${escapeHtml(c.rationale)}</div>
        <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.5;margin-top:5px;"><strong>Discuss:</strong> ${escapeHtml(c.suggestedTopic)}</div>
        <div style="font-size:10px;font-weight:700;color:var(--success);margin-top:8px;display:flex;align-items:center;gap:4px;">
          <i class="ti ti-shield-check"></i> Patient count withheld by Commercial Firewall
        </div>
      </div>`).join("") : '<div style="font-size:12px;color:var(--text-muted);">No candidates surfaced for this region.</div>';

    const f = getEventFootprint(region) || { advisoryBoards: 0, symposia: 0, congressSessions: 0 };
    const totalEvents = f.advisoryBoards + f.symposia + f.congressSessions;

    el.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:12px;background:var(--surface);border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:10px;padding:13px 16px;margin-bottom:16px;">
        <i class="ti ti-shield-lock" style="font-size:19px;color:var(--accent-text);"></i>
        <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.55;">
          <strong style="color:var(--text);">Aggregate region-level data only.</strong> Source is licensed deidentified real-world evidence.
          Patient-to-HCP linkage stays with Patient Services and does not reach field medical. Engagement candidates below are
          selected on scientific merit and regional care context — never on patient volume.
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;">
        <div style="background:var(--surface-dim);border:1px solid var(--border);border-radius:9px;padding:12px;text-align:center;">
          <div style="font-size:19px;font-weight:700;color:var(--accent);">${r.needIndex}</div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">Need index</div></div>
        <div style="background:var(--surface-dim);border:1px solid var(--border);border-radius:9px;padding:12px;text-align:center;">
          <div style="font-size:19px;font-weight:700;color:var(--orion-accent);">${r.engagementIndex}</div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">Engagement</div></div>
        <div style="background:var(--surface-dim);border:1px solid var(--border);border-radius:9px;padding:12px;text-align:center;">
          <div style="font-size:19px;font-weight:700;">${r.dermPer100k}</div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">Derm / 100k</div></div>
        <div style="background:var(--surface-dim);border:1px solid var(--border);border-radius:9px;padding:12px;text-align:center;">
          <div style="font-size:19px;font-weight:700;color:${totalEvents < 5 ? "var(--danger)" : "var(--text)"};">${totalEvents}</div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">Events 18mo</div></div>
      </div>

      <div style="font-size:13px;font-weight:700;margin-bottom:9px;">Care gaps — ${escapeHtml(region)} (${r.stateCount} states, ${r.cohort.toLocaleString()} cohort)</div>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-bottom:22px;">
        <thead><tr style="text-align:left;">
          <th style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10.5px;text-transform:uppercase;color:var(--text-muted);">Gap</th>
          <th style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10.5px;text-transform:uppercase;color:var(--text-muted);">Region</th>
          <th style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10.5px;text-transform:uppercase;color:var(--text-muted);">National</th>
          <th style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10.5px;text-transform:uppercase;color:var(--text-muted);">Delta</th>
          <th style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10.5px;text-transform:uppercase;color:var(--text-muted);">Education need</th>
        </tr></thead>
        <tbody>${gapRows}</tbody>
      </table>

      <div style="font-size:13px;font-weight:700;margin-bottom:9px;">Scientific engagement candidates</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:11px;">${candCards}</div>
    `;

    const top = ranked[0];
    broadcastPopulationSignal({
      geoId: `US-REGION-${region.toUpperCase().replace(/[^A-Z]/g, "")}`,
      geoName: region,
      aggregationLevel: "region",
      cohortSize: r.cohort,
      gapId: top.g.id,
      gapName: top.g.name,
      gapRate: top.rate,
      nationalRate: top.g.nationalRate,
      nationalDelta: top.delta,
      needIndex: r.needIndex,
      engagementIndex: r.engagementIndex,
      quadrant: r.quadrant,
      medicalAction: `FIELD INSIGHT: ${region} territory — ${top.g.shortName} at ${top.rate}${top.g.unit === "mo" ? "mo" : "%"} vs ${top.g.nationalRate}${top.g.unit === "mo" ? "mo" : "%"} national. Education need: ${top.g.educationNeed}.`,
      educationNeed: top.g.educationNeed,
      _source: "MSL Copilot",
    });
  }, 700);
}

document.getElementById("tcg-submit").addEventListener("click", () => {
  const region = document.getElementById("tcg-region").value;
  renderCareGaps(region);
});

mountTileMap({
  tileMapId: "tcg-tile-map",
  legendId: "tcg-map-legend",
  toggleId: "tcg-map-toggle",
  subId: "tcg-map-sub",
  onSelect: (geo) => {
    if (!geo) return;
    document.getElementById("tcg-region").value = geo.region;
    renderCareGaps(geo.region);
  }
});

const MSL_AGENTS = [
  { id: "voice-search", name: "Voice Search", icon: "microphone" },
  { id: "territory", name: "Territory Dashboard", icon: "map" },
  { id: "caregaps", name: "Territory Care Gaps", icon: "chart-histogram" },
  { id: "precall", name: "Pre-Call Intelligence", icon: "report-search" },
  { id: "kol", name: "KOL Profiling", icon: "user-star" },
  { id: "compliance", name: "Compliance Advisor", icon: "shield-check" },
  { id: "literature", name: "Literature Intelligence", icon: "book-2" },
  { id: "lit-scout", name: "Literature Scout", icon: "bell" },
  { id: "competitive", name: "Competitive Intelligence", icon: "arrows-exchange" },
  { id: "disease-nav", name: "Disease Navigator", icon: "dna" },
  { id: "congress", name: "Congress Planner", icon: "calendar-event" },
  { id: "medinfo", name: "Medical Information", icon: "file-text" },
  { id: "postcall", name: "Post-Call Reporting", icon: "send" },
  { id: "orion", name: "Orion Intelligence", icon: "broadcast" },
  { id: "assistant", name: "MSL Copilot Assistant", icon: "message-circle" },
  { id: "trial-match", name: "Trial Matching Agent", icon: "flask" },
];

const $ = id => document.getElementById(id);
const set = (id, v) => { const el = $(id); if (el) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } };
const click = id => { const el = $(id); if (el) el.click(); };
const type = (id, v) => { const el = $(id); if (el) { el.value = v; el.dispatchEvent(new Event("input", {bubbles:true})); } };

async function runAgentDemo(index, agent) {
  switch (agent.id) {
    case "voice-search": {
      await narrate("Let's start with voice search — tap the microphone and speak your query, completely hands-free");
      showHub();
      await delay(600);
      const vsInput = $("hub-search-input");
      const vsMic = vsInput?.parentElement?.querySelector('.mv-voice-btn');
      if (vsMic) { vsMic.classList.add('listening'); vsMic.innerHTML = '<i class="ti ti-loader-2 mv-spin"></i>'; }
      await delay(1200);
      if (vsInput) { vsInput.value = ''; for (const ch of "Dupixent long-term safety data") { vsInput.value += ch; vsInput.dispatchEvent(new Event('input', { bubbles: true })); await delay(30); } }
      await delay(400);
      if (vsMic) { vsMic.classList.remove('listening'); vsMic.innerHTML = '<i class="ti ti-microphone"></i>'; }
      await delay(300);
      routeSearch("Dupixent long-term safety data");
      await delay(1800);
      await narrate("Voice recognized and query routed — the hub search dispatches to the right agent automatically");
      await delay(1500);
      break;
    }
    case "territory":
      await narrate("Morning starts at the Territory Dashboard — your mission control");
      showPanel("territory");
      await delay(2000);
      await narrate("Forty-seven HCPs, three meetings this week, and thirty-eight Orion signals to review");
      await delay(2000);
      break;
    case "caregaps":
      await narrate("Territory Care Gaps brings real-world evidence into field planning");
      showPanel("caregaps");
      await delay(700);
      click("tcg-submit");
      await delay(2200);
      await narrate("Two safety-relevant gaps top the Southeast list — recurrent systemic steroid exposure running thirteen points above national, and JAK inhibitors used ahead of a biologic trial");
      await delay(2400);
      await narrate("Every figure here is region-level. No patient counts, and nothing tied to a named physician — the Commercial Firewall withholds that. What reaches the field is the scientific reason to engage");
      await delay(2400);
      break;
    case "precall":
      await narrate("First meeting today: Dr. Sarah Chen. Let's pull her pre-call briefing");
      showPanel("precall");
      await delay(600);
      type("pc-hcp-search", "Dr. Sarah Chen");
      await delay(400);
      click("pc-submit");
      await delay(2200);
      await narrate("Profile loaded — Tier 1 KOL, LIBERTY AD investigator, interested in long-term dupilumab data");
      await delay(1800);
      break;
    case "kol":
      await narrate("Deeper KOL analysis — what's her influence score and recent activity?");
      showPanel("kol");
      await delay(600);
      type("kol-name", "Dr. Sarah Chen");
      set("kol-focus", "Publication Impact");
      await delay(400);
      click("kol-submit");
      await delay(2200);
      await narrate("KOL score 87, h-index 24 — high influence. Six advisory boards, active in AAD and EADV");
      await delay(1800);
      break;
    case "compliance":
      await narrate("Before any meeting — the Compliance Advisor checks everything");
      showPanel("compliance");
      await delay(600);
      type("comp-hcp", "Dr. Sarah Chen");
      set("comp-type", "Scientific Exchange (1:1)");
      type("comp-topics", "Dupilumab long-term safety data, EADV 2026 preview");
      set("comp-meal", "modest");
      await delay(400);
      click("comp-submit");
      await delay(1800);
      await narrate("All clear — topics approved, modest meal within PhRMA limits, documentation reminders set");
      await delay(1800);
      break;
    case "literature":
      await narrate("Dr. Chen will ask about long-term data — let's search the latest evidence");
      showPanel("literature");
      await delay(600);
      type("msl-lit-query", "dupilumab long-term safety efficacy");
      set("msl-lit-type", "Clinical Trial");
      set("msl-lit-date", "Last 1 year");
      await delay(400);
      click("msl-lit-submit");
      await delay(1800);
      await narrate("LIBERTY AD CHRONOS four-year results and real-world effectiveness data — exactly what we need");
      await delay(1800);
      break;
    case "lit-scout":
      await narrate("Any new publications we should know about? Literature Scout monitors the landscape");
      showPanel("lit-scout");
      await delay(600);
      set("msl-scout-ta", "Atopic Dermatitis");
      await delay(400);
      click("msl-scout-submit");
      await delay(1800);
      await narrate("Three alerts — new JAK safety concerns, updated AAD guidelines, and Dupixent persistence data");
      await delay(1800);
      break;
    case "competitive":
      await narrate("Dr. Chen may ask about JAK inhibitors. Let's prepare the head-to-head data");
      showPanel("competitive");
      await delay(600);
      set("ci-ta", "Atopic Dermatitis");
      set("ci-product", "Dupixent (dupilumab)");
      set("ci-competitor", "Abrocitinib (Cibinqo) — Pfizer");
      await delay(400);
      click("ci-submit");
      await delay(2200);
      await narrate("JADE DARE comparison — efficacy, safety, and the key message: no JAK class warnings with Dupixent");
      await delay(1800);
      break;
    case "disease-nav":
      await narrate("Quick disease landscape review before the meeting");
      showPanel("disease-nav");
      await delay(600);
      set("msl-dn-disease", "Atopic Dermatitis");
      set("msl-dn-focus", "Treatment Landscape");
      await delay(400);
      click("msl-dn-submit");
      await delay(1800);
      await narrate("Full AD landscape — pathophysiology, treatment options, cross-TA connections, and pipeline");
      await delay(1800);
      break;
    case "congress":
      await narrate("EADV is next month — let's check the congress plan");
      showPanel("congress");
      await delay(600);
      set("cg-congress", "EADV 2026 — European Academy of Dermatology (Sep 2026)");
      await delay(400);
      click("cg-submit");
      await delay(1800);
      await narrate("Two orals, five posters, and Dr. Chen is attending. Schedule a one-on-one to preview the data");
      await delay(1800);
      break;
    case "medinfo":
      await narrate("During the meeting, Dr. Chen asks about pediatric dosing — an unsolicited MIR");
      showPanel("medinfo");
      await delay(600);
      type("mi-hcp", "Dr. Sarah Chen");
      set("mi-type", "Dosing & Administration");
      set("mi-product", "Dupixent (dupilumab)");
      type("mi-question", "What is the dosing regimen for pediatric patients under 30kg?");
      await delay(400);
      click("mi-submit");
      await delay(2000);
      await narrate("Approved dosing information with citations — compliant response ready to share");
      await delay(1800);
      break;
    case "postcall":
      await narrate("Meeting complete. Now we submit the signal to Orion");
      showPanel("postcall");
      await delay(600);
      type("sig-hcp", "Dr. Sarah Chen");
      set("sig-type", "Requested head-to-head comparative data");
      set("sig-meeting-type", "Scientific Exchange (1:1)");
      type("sig-notes", "Discussed JADE DARE H2H data, CHRONOS 4yr safety. Interested in EADV CHRONOS presentation. Follow up with pediatric MIR response.");
      await delay(400);
      click("sig-submit");
      await delay(2200);
      await narrate("Signal submitted — routed to Orion for the entire field team to see");
      await delay(1800);
      break;
    case "orion":
      await narrate("Finally, the Orion dashboard — where every signal becomes field intelligence");
      showPanel("orion");
      await delay(2000);
      await narrate("One hundred forty-two signals this month, trending topics, and priority actions — the MSL network, connected");
      await delay(2000);
      break;
    case "assistant":
      await narrate("The MSL Copilot Assistant — your AI companion for any question, any time");
      showHub();
      await delay(600);
      const fab = document.querySelector(".mv-chat-fab");
      if (fab) { fab.click(); await delay(800); }
      const chatInput = document.getElementById("mv-chat-input");
      if (chatInput) {
        chatInput.value = "";
        for (const ch of "KOL insights for Dr. Chen") {
          chatInput.value += ch; await delay(25);
        }
        await delay(400);
        document.getElementById("mv-chat-send")?.click();
        await delay(2000);
      }
      await narrate("Instant KOL intelligence — the assistant draws from all thirteen agents to answer any question");
      await delay(1500);
      if (fab) fab.click();
      await delay(400);
      break;
    case "trial-match":
      await narrate("The Trial Matching Agent — linking patients to eligible Sanofi clinical trials based on diagnosis, demographics, and treatment history");
      showHub();
      await delay(600);
      const tmCard = document.querySelector('[data-agent="trial-match"]');
      if (tmCard) {
        tmCard.scrollIntoView({ behavior: "smooth", block: "center" });
        await delay(400);
        tmCard.classList.add("highlight");
        await delay(2000);
        tmCard.classList.remove("highlight");
      }
      await delay(1500);
      break;
  }
}

const demoCtrl = createDemoController({
  moduleName: "MSL Copilot",
  moduleIcon: "briefcase",
  agents: MSL_AGENTS,
  runAgent: runAgentDemo,
});

async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;
  demoBtn.disabled = true;
  demoBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running…';

  await narrate("A day in the life of a Sanofi MSL — featuring fifteen AI agents, one mission. Let's follow the journey");
  await demoCtrl.runFullDemo();

  await narrate("With thirteen agents on one platform, from morning prep to post-call intelligence — the MSL Copilot");
  showHub();
  await delay(1500);

  narrateOff();
  demoRunning = false;
  demoBtn.disabled = false;
  demoBtn.innerHTML = '<i class="ti ti-player-play"></i> Run Demo';
}

if (demoBtn) demoBtn.addEventListener("click", runDemo);

if (window.location.hash === "#autoplay") {
  window.location.hash = "";
  setTimeout(runDemo, 600);
}
