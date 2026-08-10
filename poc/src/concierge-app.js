import { generateResponse, suggestedPrompts } from "./rag-engine.js";
import { speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";
import { broadcastSignal } from "./orion-bridge.js";
import { createDemoController } from "./demo-nav.js";

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

// === UNIVERSAL SEARCH ===
const hubSearchInput = document.getElementById("hub-search-input");
const hubSearchBtn = document.getElementById("hub-search-btn");
const hubSearchHints = document.getElementById("hub-search-hints");

const searchHints = [
  { text: "Dupixent storage conditions", agent: "temp-stab" },
  { text: "Is Dupixent safe for latex allergy?", agent: "ingredient" },
  { text: "Find trials for atopic dermatitis", agent: "trial-match" },
  { text: "Treatment options for moderate AD", agent: "clinical-qa" },
  { text: "Find my MSL for dermatology", agent: "msl-connect" },
  { text: "Care pathway for RA patient", agent: "patient-nav" },
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
    { keywords: ["storage", "temperature", "cold chain", "freeze", "refrigerat", "excursion", "travel", "stability", "room temp"], agent: "temp-stab" },
    { keywords: ["ingredient", "excipient", "allergy", "latex", "polysorbate", "contraindication", "interaction", "safety profile", "safe for"], agent: "ingredient" },
    { keywords: ["trial", "enroll", "eligib", "study", "phase 3", "phase 2", "clinical study", "recruit"], agent: "trial-match" },
    { keywords: ["msl", "liaison", "field team", "schedule meeting", "find my", "connect with"], agent: "msl-connect" },
    { keywords: ["pathway", "care path", "treatment sequence", "step-by-step", "navigator", "patient profile", "comorbid"], agent: "patient-nav" },
    { keywords: ["literature", "pubmed", "publication", "journal", "meta-analysis", "systematic review", "evidence", "paper"], agent: "literature" },
    { keywords: ["scout", "monitor", "alert", "new paper", "guideline update", "recent pub"], agent: "lit-scout" },
    { keywords: ["disease", "pathophysiology", "mechanism", "treatment landscape", "cross-ta", "epidemiology"], agent: "disease-nav" },
    { keywords: ["congress", "eadv", "aad", "acr", "ats", "aaaai", "ddw", "meeting", "symposium", "poster", "abstract", "presentation"], agent: "congress" },
  ];

  for (const route of routes) {
    if (route.keywords.some(k => q.includes(k))) {
      showPanel(route.agent);
      prefillAgent(route.agent, query);
      return;
    }
  }

  showPanel("clinical-qa");
  submitChat(query);
}

function prefillAgent(agent, query) {
  if (agent === "clinical-qa") { submitChat(query); return; }
  if (agent === "temp-stab") {
    const product = detectProduct(query);
    if (product) document.getElementById("ts-product").value = product;
    flashPrefill("ts-submit");
  } else if (agent === "ingredient") {
    const product = detectIngredientProduct(query);
    if (product) document.getElementById("ing-product").value = product;
    const allergy = extractAllergy(query);
    if (allergy) document.getElementById("ing-allergy").value = allergy;
    flashPrefill("ing-submit");
  } else if (agent === "trial-match") {
    const indication = detectIndication(query);
    if (indication) document.getElementById("tm-indication").value = indication;
    flashPrefill("tm-submit");
  } else if (agent === "msl-connect") {
    const ta = detectTA(query);
    if (ta) document.getElementById("msl-ta").value = ta;
    flashPrefill("msl-submit");
  } else if (agent === "patient-nav") {
    const dx = detectDiagnosis(query);
    if (dx) document.getElementById("pn-diagnosis").value = dx;
    flashPrefill("pn-submit");
  }
}

function detectProduct(q) {
  q = q.toLowerCase();
  if (q.includes("pen")) return "Dupixent (dupilumab) — Pre-filled pen";
  if (q.includes("syringe")) return "Dupixent (dupilumab) — Pre-filled syringe";
  if (q.includes("dupixent") || q.includes("dupilumab")) return "Dupixent (dupilumab) — Pre-filled syringe";
  if (q.includes("kevzara") || q.includes("sarilumab")) return "Kevzara (sarilumab) — Pre-filled syringe";
  if (q.includes("praluent") || q.includes("alirocumab")) return "Praluent (alirocumab) — Pre-filled pen";
  if (q.includes("sarclisa") || q.includes("isatuximab")) return "Sarclisa (isatuximab) — IV vial";
  return "";
}

function detectIngredientProduct(q) {
  q = q.toLowerCase();
  if (q.includes("dupixent") || q.includes("dupilumab")) return "Dupixent (dupilumab)";
  if (q.includes("kevzara") || q.includes("sarilumab")) return "Kevzara (sarilumab)";
  if (q.includes("aubagio") || q.includes("teriflunomide")) return "Aubagio (teriflunomide)";
  if (q.includes("praluent") || q.includes("alirocumab")) return "Praluent (alirocumab)";
  if (q.includes("sarclisa") || q.includes("isatuximab")) return "Sarclisa (isatuximab)";
  return "";
}

function extractAllergy(q) {
  q = q.toLowerCase();
  const allergies = ["latex", "polysorbate", "histidine", "lactose"];
  return allergies.find(a => q.includes(a)) || "";
}

function detectIndication(q) {
  q = q.toLowerCase();
  if (q.includes("atopic") || q.includes(" ad ") || q.includes("eczema")) return "Atopic Dermatitis";
  if (q.includes("asthma")) return "Asthma";
  if (q.includes("crswn") || q.includes("nasal poly") || q.includes("sinus")) return "CRSwNP";
  if (q.includes("eoe") || q.includes("eosinophilic esoph")) return "Eosinophilic Esophagitis";
  if (q.includes("copd")) return "COPD";
  if (q.includes("urticaria")) return "Chronic Spontaneous Urticaria";
  if (q.includes("rheumatoid") || q.includes(" ra ")) return "Rheumatoid Arthritis";
  return "";
}

function detectTA(q) {
  q = q.toLowerCase();
  if (q.includes("derm") || q.includes("atopic") || q.includes("ad ")) return "Dermatology / Atopic Dermatitis";
  if (q.includes("immun") || q.includes("rheum") || q.includes(" ra ")) return "Immunology / Rheumatology";
  if (q.includes("respiratory") || q.includes("asthma") || q.includes("lung")) return "Respiratory / Asthma";
  if (q.includes("rare")) return "Rare Diseases";
  if (q.includes("onc")) return "Oncology";
  return "";
}

function detectDiagnosis(q) {
  q = q.toLowerCase();
  if (q.includes("atopic") || q.includes(" ad ") || q.includes("eczema")) return "Atopic Dermatitis (moderate-to-severe)";
  if (q.includes("asthma")) return "Asthma (moderate-to-severe eosinophilic)";
  if (q.includes("rheumatoid") || q.includes(" ra ")) return "Rheumatoid Arthritis";
  if (q.includes("crswn") || q.includes("nasal poly")) return "CRSwNP (Chronic Rhinosinusitis with Nasal Polyps)";
  if (q.includes("eoe") || q.includes("eosinophilic esoph")) return "Eosinophilic Esophagitis";
  if (q.includes("copd")) return "COPD (Type 2 high)";
  return "";
}

function flashPrefill(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.style.animation = "none";
  btn.offsetHeight;
  btn.style.boxShadow = "0 0 0 4px rgba(122,0,230,.25)";
  setTimeout(() => { btn.style.boxShadow = ""; }, 2000);
}

// === UTILITY ===
function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================================
// 1. CLINICAL Q&A
// ============================================================
const chatMessages = document.getElementById("chat-messages");
const chatWelcome = document.getElementById("chat-welcome");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatPrompts = document.getElementById("chat-prompts");
const signalsContainer = document.getElementById("signals-container");

let signalCount = 0, topicsSet = new Set(), depthScores = [], highestPriority = null;
const depthMap = { "Light engagement": 1, "Moderate engagement": 2, "Deep engagement": 3, "Deep engagement — cross-TA query": 4, "Deep engagement — cross-TA": 4, "High-value engagement": 4 };

if (chatPrompts) {
  suggestedPrompts.forEach(p => {
    const chip = document.createElement("button");
    chip.className = "chat-prompt-chip";
    chip.textContent = p.short;
    chip.addEventListener("click", () => submitChat(p.text));
    chatPrompts.appendChild(chip);
  });
}

chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto";
  chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + "px";
  chatSend.disabled = !chatInput.value.trim();
});
chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (chatInput.value.trim()) submitChat(chatInput.value.trim()); }
});
chatSend.addEventListener("click", () => { if (chatInput.value.trim()) submitChat(chatInput.value.trim()); });

async function submitChat(query) {
  if (chatWelcome) chatWelcome.style.display = "none";
  addChatMsg("user", query);
  chatInput.value = ""; chatInput.style.height = "auto"; chatSend.disabled = true;
  const typing = addTyping();
  await delay(800 + Math.random() * 1000);
  const result = generateResponse(query);
  typing.remove();
  addAIMsg(result);
  if (result.signal) addSignal(result.signal);
  scrollChat();
}

function addChatMsg(role, text) {
  const div = document.createElement("div");
  div.className = `msg msg-${role}`;
  if (role === "user") div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
  chatMessages.appendChild(div);
  scrollChat();
  return div;
}

function addAIMsg(result) {
  const div = document.createElement("div");
  div.className = "msg msg-ai";
  const rendered = renderMd(result.answer);
  const cites = result.citations?.length ? `<div class="citations-panel">${result.citations.map((c, i) =>
    `<div class="citation-card"><div class="citation-num">${i+1}</div><div><div class="citation-title">${escapeHtml(c.title)}</div><div class="citation-meta">${escapeHtml(c.source)} · ${escapeHtml(c.date)}<span class="citation-type">${escapeHtml(c.sourceType)}</span></div></div></div>`
  ).join("")}</div>` : "";
  const fups = result.followUps?.length ? `<div class="follow-ups">${result.followUps.map(f => `<button class="follow-up-chip">${escapeHtml(f)}</button>`).join("")}</div>` : "";
  div.innerHTML = `<div class="msg-ai-avatar"><i class="ti ti-stethoscope"></i></div><div class="msg-ai-content"><div class="msg-ai-text rendered">${rendered}</div>${cites}${fups}</div>`;
  div.querySelectorAll(".follow-up-chip").forEach(btn => btn.addEventListener("click", () => submitChat(btn.textContent)));
  chatMessages.appendChild(div);
  scrollChat();
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "msg msg-ai";
  div.innerHTML = `<div class="msg-ai-avatar"><i class="ti ti-stethoscope"></i></div><div class="msg-ai-content"><div class="typing"><span></span><span></span><span></span></div></div>`;
  chatMessages.appendChild(div);
  scrollChat();
  return div;
}

function addSignal(signal) {
  const empty = signalsContainer.querySelector(".sidebar-empty");
  if (empty) empty.remove();
  signalCount++; topicsSet.add(signal.diseaseArea);
  const ds = depthMap[signal.depth] || 2; depthScores.push(ds);
  if (signal.orionAction.startsWith("PRIORITY")) highestPriority = "HIGH";
  else if (!highestPriority && signal.depth.includes("Deep")) highestPriority = "MED";
  document.getElementById("stat-signals").textContent = signalCount;
  document.getElementById("stat-topics").textContent = topicsSet.size;
  const avg = depthScores.reduce((a, b) => a + b, 0) / depthScores.length;
  document.getElementById("stat-depth").textContent = avg >= 3 ? "Deep" : avg >= 2 ? "Med" : "Light";
  document.getElementById("stat-priority").textContent = highestPriority || "Low";
  const now = new Date();
  const card = document.createElement("div"); card.className = "signal-card";
  card.innerHTML = `<div class="signal-header"><div class="signal-dot"></div><span class="signal-time">${now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span></div>
    <div class="signal-topic">${escapeHtml(signal.topic)}</div>
    <div class="signal-row"><span class="signal-label">Intent</span><span class="signal-value">${escapeHtml(signal.intent)}</span></div>
    <div class="signal-row"><span class="signal-label">Disease</span><span class="signal-value">${escapeHtml(signal.diseaseArea)}</span></div>
    <div class="signal-row"><span class="signal-label">Depth</span><span class="signal-value">${escapeHtml(signal.depth)}</span></div>
    <div class="signal-action"><i class="ti ti-arrow-right"></i><span>${escapeHtml(signal.orionAction)}</span></div>`;
  signalsContainer.insertBefore(card, signalsContainer.firstChild);
  broadcastSignal({ ...signal, _source: "HCP Concierge" });
}

function scrollChat() { requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }); }

function renderMd(text) {
  let h = escapeHtml(text);
  h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/\*(.+?)\*/g, "<em>$1</em>");
  h = h.replace(/\[(\d+)\]/g, '<span class="cite-ref">$1</span>');
  h = h.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  h = h.replace(/\n(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/g, (_, hdr, sep, body) => {
    const ths = hdr.split("|").filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join("");
    const trs = body.trim().split("\n").map(r => `<tr>${r.split("|").filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join("")}</tr>`).join("");
    return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  });
  h = h.replace(/^- (.+)$/gm, "<li>$1</li>");
  h = h.replace(/((?:<li>.+<\/li>\n?)+)/g, "<ul>$1</ul>");
  h = h.split("\n\n").map(b => b.startsWith("<h3>") || b.startsWith("<ul>") || b.startsWith("<table>") ? b : `<p>${b}</p>`).join("\n");
  return h;
}

// ============================================================
// 2. PATIENT NAVIGATOR
// ============================================================
initChipGroups();

document.getElementById("pn-submit").addEventListener("click", () => {
  const age = document.getElementById("pn-age").value;
  const sex = document.getElementById("pn-sex").value;
  const dx = document.getElementById("pn-diagnosis").value;
  const comorbidities = getSelectedChips("pn-comorbidities");
  const priorTx = getSelectedChips("pn-prior-tx");

  if (!dx) { alert("Please select a primary diagnosis."); return; }
  const el = document.getElementById("pn-results");
  el.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:var(--accent);"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Generating care pathway…</div></div>';

  setTimeout(() => renderPatientNav(el, { age, sex, dx, comorbidities, priorTx }), 1200);
});

function renderPatientNav(el, p) {
  const pathways = getPatientPathway(p);
  el.innerHTML = `
    <div class="result-card">
      <div class="result-card-header"><div class="result-title">Care Pathway Recommendation</div><span class="result-badge badge-accent">AI-Generated</span></div>
      <div class="result-body">
        <p><strong>Patient:</strong> ${p.age ? p.age + "yo" : ""} ${p.sex || ""} with ${escapeHtml(p.dx)}</p>
        ${p.comorbidities.length ? `<p><strong>Comorbidities:</strong> ${p.comorbidities.join(", ")}</p>` : ""}
        ${p.priorTx.length ? `<p><strong>Failed treatments:</strong> ${p.priorTx.join(", ")}</p>` : ""}
      </div>
    </div>
    ${pathways.steps.map((s, i) => `
    <div class="result-card">
      <div class="result-card-header"><div class="result-title">Step ${i + 1}: ${escapeHtml(s.title)}</div><span class="result-badge ${s.badgeClass}">${s.badge}</span></div>
      <div class="result-body">${s.body}</div>
      ${s.meta ? `<div class="result-meta">${s.meta.map(m => `<span class="result-meta-item"><i class="ti ti-${m.icon}"></i> ${escapeHtml(m.text)}</span>`).join("")}</div>` : ""}
    </div>`).join("")}
    <div class="result-card" style="background:var(--orion-bg);border-color:#9fe1cb;">
      <div class="result-card-header"><div class="result-title" style="color:#085041;">Orion Signal Generated</div><span class="result-badge badge-orion">Intelligence</span></div>
      <div class="result-body" style="color:#085041;">${pathways.signal}</div>
    </div>`;
}

function getPatientPathway(p) {
  const isAD = p.dx.includes("Atopic");
  const isAsthma = p.dx.includes("Asthma");
  const isRA = p.dx.includes("Rheumatoid");
  const failedBiologic = p.priorTx.some(t => t.includes("JAK"));
  const hasComorbid = p.comorbidities.length > 0 && !p.comorbidities.includes("None");

  if (isAD) {
    return {
      steps: [
        { title: "Confirm Disease Severity", badge: "Assessment", badgeClass: "badge-info", body: "<strong>EASI score, IGA, BSA, DLQI</strong> — confirm moderate-to-severe classification. Document impact on sleep, QoL, and mental health (25–30% of AD patients experience depression).", meta: [{ icon: "clipboard-check", text: "EASI ≥16 for moderate-to-severe" }, { icon: "heart-rate-monitor", text: "Document PROs" }] },
        { title: "Escalate to Systemic Therapy", badge: "Treatment", badgeClass: "badge-accent", body: `<strong>Recommended first-line biologic: Dupilumab (Dupixent)</strong><br>Targets IL-4Rα, blocking both IL-4 and IL-13 — key drivers of type 2 inflammation. SOLO 1&2: 38% IGA 0/1 at Wk16 vs 10% placebo. No routine lab monitoring required.${failedBiologic ? "<br><br><strong>Note:</strong> Patient has failed JAK inhibitor — dupilumab offers a different mechanism with favorable long-term safety (3+ years data)." : ""}${hasComorbid && p.comorbidities.includes("Asthma") ? "<br><br><strong>Cross-TA benefit:</strong> Dupilumab also approved for moderate-to-severe asthma — addresses both conditions via shared IL-4/IL-13 pathway." : ""}`, meta: [{ icon: "vaccine", text: "300mg Q2W subcutaneous" }, { icon: "shield-check", text: "No lab monitoring" }] },
        { title: "Monitor & Optimize", badge: "Follow-up", badgeClass: "badge-success", body: "<strong>Week 16 assessment:</strong> Evaluate EASI-75 response. If adequate, continue. If partial response, consider combination with TCS. <strong>Long-term:</strong> LIBERTY AD CHRONOS showed sustained efficacy over 52 weeks.", meta: [{ icon: "calendar-event", text: "Week 16 primary endpoint" }, { icon: "chart-line", text: "52-week durability data" }] },
        { title: "Consider Clinical Trial Enrollment", badge: "Optional", badgeClass: "badge-warning", body: `Active trials: <strong>LIBERTY AD PED</strong> (pediatric extension), <strong>DUPIXENT REAL</strong> (real-world registry). ${parseInt(p.age) < 18 ? "<strong>Pediatric patient — eligible for LIBERTY AD PED.</strong>" : "Consider DUPIXENT REAL for real-world evidence contribution."}` }
      ],
      signal: `HCP navigated care pathway for ${p.age || ""}${p.sex ? " " + p.sex : ""} with ${p.dx}. ${hasComorbid ? "Cross-TA comorbidities noted (" + p.comorbidities.join(", ") + "). " : ""}Flag for MSL follow-up — treatment decision point.`
    };
  }

  if (isRA) {
    return {
      steps: [
        { title: "Assess Disease Activity", badge: "Assessment", badgeClass: "badge-info", body: "<strong>DAS28-ESR, CDAI, SDAI</strong> — confirm moderate-to-high disease activity despite conventional DMARDs. Document functional status and joint damage progression.", meta: [{ icon: "clipboard-check", text: "DAS28 > 3.2 for moderate" }] },
        { title: "Biologic Escalation — Sarilumab", badge: "Treatment", badgeClass: "badge-accent", body: "<strong>Sarilumab (Kevzara) 200mg Q2W:</strong> Anti-IL-6Rα — addresses both joint and systemic RA. MOBILITY: ACR20 66% vs 34% placebo. <strong>MONARCH:</strong> Superior to adalimumab as monotherapy (DAS28-ESR -3.28 vs -2.20).<br><br>Particularly suited for patients who cannot tolerate MTX — monotherapy data support standalone use.", meta: [{ icon: "vaccine", text: "200mg Q2W subcutaneous" }, { icon: "trophy", text: "MONARCH H2H superiority" }] },
        { title: "Treat-to-Target Monitoring", badge: "Follow-up", badgeClass: "badge-success", body: "Per EULAR guidelines: reassess at <strong>3 months</strong>, target low disease activity or remission by <strong>6 months</strong>. Monitor lipids and neutrophils per IL-6 pathway effects." }
      ],
      signal: `HCP navigated RA care pathway. Patient profile: ${p.age || ""}${p.sex ? " " + p.sex : ""}, ${p.priorTx.length ? "failed " + p.priorTx.join(", ") : "DMARD-inadequate"}. Flag for rheumatology MSL.`
    };
  }

  return {
    steps: [
      { title: "Disease Assessment", badge: "Assessment", badgeClass: "badge-info", body: `Comprehensive assessment for <strong>${escapeHtml(p.dx)}</strong>. Document disease severity scores, impact on quality of life, and treatment history.` },
      { title: "Treatment Recommendation", badge: "Treatment", badgeClass: "badge-accent", body: `Based on the patient profile and Sanofi portfolio: evaluate biologic therapy targeting the relevant inflammatory pathway. ${hasComorbid ? "Consider cross-TA implications of comorbidities: " + p.comorbidities.join(", ") + "." : ""} Consult your MSL for personalized treatment discussion.` },
      { title: "Follow-up & Monitoring", badge: "Follow-up", badgeClass: "badge-success", body: "Schedule follow-up assessment per treatment guidelines. Monitor response and adjust therapy as needed." }
    ],
    signal: `HCP navigated care pathway for ${escapeHtml(p.dx)}. Flag for appropriate TA MSL.`
  };
}

// ============================================================
// 3. TRIAL MATCHING
// ============================================================
const trialDatabase = [
  { name: "LIBERTY AD PED", phase: "Phase 3", indication: "Atopic Dermatitis", detail: "Dupilumab in children 6 months – 5 years with moderate-to-severe AD", status: "Enrolling", sites: "42 sites (US, EU, Japan)", ageRange: "0.5–5", bioReq: "Biologic-naïve", regions: ["United States", "EU (Germany, France, UK)", "Japan"] },
  { name: "LIBERTY CUPID", phase: "Phase 3", indication: "Chronic Spontaneous Urticaria", detail: "Dupilumab for chronic spontaneous urticaria inadequately controlled by H1-antihistamines", status: "Enrolling", sites: "65 sites globally", ageRange: "18–75", bioReq: "any", regions: ["United States", "EU (Germany, France, UK)", "Japan", "Rest of World"] },
  { name: "LIBERTY CSNP SINUS-52+", phase: "Phase 3", indication: "CRSwNP", detail: "Dupilumab long-term extension in CRSwNP — sinus surgery outcomes", status: "Active", sites: "38 sites (US, EU)", ageRange: "18–65", bioReq: "any", regions: ["United States", "EU (Germany, France, UK)"] },
  { name: "LIBERTY-BF", phase: "Phase 3", indication: "Bullous Pemphigoid", detail: "Dupilumab in moderate-to-severe bullous pemphigoid", status: "Enrolling", sites: "28 sites (US, EU)", ageRange: "18+", bioReq: "any", regions: ["United States", "EU (Germany, France, UK)"] },
  { name: "DUPIXENT REAL", phase: "Observational", indication: "Multiple", detail: "Real-world evidence registry across type 2 inflammatory conditions", status: "Open", sites: "120+ sites globally", ageRange: "any", bioReq: "any", regions: ["United States", "EU (Germany, France, UK)", "Japan", "Rest of World"] },
  { name: "BOREAS-2", phase: "Phase 3", indication: "COPD", detail: "Dupilumab in COPD with type 2 inflammation — confirmatory study", status: "Enrolling", sites: "55 sites globally", ageRange: "40–85", bioReq: "Biologic-naïve", regions: ["United States", "EU (Germany, France, UK)", "Rest of World"] },
  { name: "LIBERTY EoE TREET-2", phase: "Phase 3", indication: "Eosinophilic Esophagitis", detail: "Dupilumab long-term maintenance in eosinophilic esophagitis", status: "Active", sites: "34 sites (US, EU)", ageRange: "12+", bioReq: "any", regions: ["United States", "EU (Germany, France, UK)"] },
  { name: "LIBERTY AD HALO", phase: "Phase 3", indication: "Atopic Dermatitis", detail: "Dupilumab in adults with moderate AD (IGA 3) — broadening access", status: "Enrolling", sites: "50 sites (US)", ageRange: "18–65", bioReq: "Biologic-naïve", regions: ["United States"] }
];

document.getElementById("tm-submit").addEventListener("click", () => {
  const ind = document.getElementById("tm-indication").value;
  const age = parseInt(document.getElementById("tm-age").value) || 0;
  const bio = document.getElementById("tm-bio").value;
  const region = document.getElementById("tm-region").value;
  if (!ind) { alert("Please select an indication."); return; }

  const el = document.getElementById("tm-results");
  el.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:var(--orion-accent);"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Searching clinical trials…</div></div>';

  setTimeout(() => {
    const matches = trialDatabase.filter(t => {
      const indMatch = t.indication === ind || t.indication === "Multiple";
      const regionMatch = !region || t.regions.includes(region);
      return indMatch && regionMatch;
    });

    if (!matches.length) {
      el.innerHTML = '<div class="result-empty"><i class="ti ti-flask"></i>No matching trials found for these criteria. Consider broadening your search or contact your MSL for pipeline information.</div>';
      return;
    }

    el.innerHTML = `<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${matches.length} trial${matches.length > 1 ? "s" : ""} found</div>` +
      matches.map(t => {
        const statusColor = t.status === "Enrolling" ? "badge-success" : t.status === "Active" ? "badge-info" : "badge-warning";
        return `<div class="result-card">
          <div class="result-card-header"><div class="result-title">${escapeHtml(t.name)}</div><span class="result-badge ${statusColor}">${t.status}</span></div>
          <div class="result-body"><p>${escapeHtml(t.detail)}</p></div>
          <div class="result-meta">
            <span class="result-meta-item"><i class="ti ti-flask"></i> ${t.phase}</span>
            <span class="result-meta-item"><i class="ti ti-map-pin"></i> ${t.sites}</span>
            <span class="result-meta-item"><i class="ti ti-user"></i> Ages ${t.ageRange}</span>
          </div>
          <div class="result-actions">
            <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-file-text"></i> View Protocol</button>
            <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-users"></i> Contact MSL</button>
          </div>
        </div>`;
      }).join("");
  }, 1000);
});

// ============================================================
// 4. MSL CONNECT
// ============================================================
const mslDatabase = [
  { name: "Dr. Amanda Rodriguez, PharmD", ta: "Dermatology / Atopic Dermatitis", region: "Northeast US", expertise: ["Dupixent clinical data", "AD real-world evidence", "Pediatric dermatology"], availability: "Available this week", phone: "+1 (617) 555-0142", email: "amanda.rodriguez@sanofi.com" },
  { name: "Dr. James Park, PhD", ta: "Dermatology / Atopic Dermatitis", region: "West US", expertise: ["Type 2 inflammation", "Biologic sequencing", "Clinical trials"], availability: "Available next week", phone: "+1 (415) 555-0198", email: "james.park@sanofi.com" },
  { name: "Dr. Lisa Hoffman, MD, PhD", ta: "Immunology / Rheumatology", region: "Northeast US", expertise: ["Kevzara clinical evidence", "IL-6 pathway", "RA monotherapy"], availability: "Available this week", phone: "+1 (212) 555-0167", email: "lisa.hoffman@sanofi.com" },
  { name: "Dr. Robert Kim, PharmD", ta: "Immunology / Rheumatology", region: "Midwest US", expertise: ["DMARD sequencing", "Biologic safety profiles", "PROs in RA"], availability: "Available Thursday", phone: "+1 (312) 555-0134", email: "robert.kim@sanofi.com" },
  { name: "Dr. Sarah Mitchell, PhD", ta: "Respiratory / Asthma", region: "Southeast US", expertise: ["Dupixent in asthma", "Eosinophilic phenotyping", "COPD type 2"], availability: "Available this week", phone: "+1 (404) 555-0156", email: "sarah.mitchell@sanofi.com" },
  { name: "Dr. Thomas Weber, MD", ta: "Dermatology / Atopic Dermatitis", region: "EU — Germany", expertise: ["European guidelines", "AD in adolescents", "Real-world evidence"], availability: "Available Mon–Wed", phone: "+49 69 555 0123", email: "thomas.weber@sanofi.com" },
  { name: "Dr. Claire Dupont, PharmD", ta: "Immunology / Rheumatology", region: "EU — France", expertise: ["IL-6 inhibitors", "French treatment guidelines", "Clinical trials"], availability: "Available this week", phone: "+33 1 55 00 12 34", email: "claire.dupont@sanofi.com" }
];

document.getElementById("msl-submit").addEventListener("click", () => {
  const ta = document.getElementById("msl-ta").value;
  const region = document.getElementById("msl-region").value;
  if (!ta) { alert("Please select a therapeutic area."); return; }

  const el = document.getElementById("msl-results");
  el.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:#be185d;"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Finding your MSL…</div></div>';

  setTimeout(() => {
    const matches = mslDatabase.filter(m => m.ta === ta && (!region || m.region === region));
    const broader = !matches.length ? mslDatabase.filter(m => m.ta === ta) : [];
    const results = matches.length ? matches : broader;

    if (!results.length) {
      el.innerHTML = '<div class="result-empty"><i class="ti ti-users"></i>No MSL found for this combination. Please try a broader search or contact medical information at 1-800-633-1610.</div>';
      return;
    }

    el.innerHTML = (broader.length ? '<div style="font-size:12px;color:var(--warning);margin-bottom:10px;">No exact region match — showing all MSLs in this therapeutic area:</div>' : '') +
      results.map(m => `<div class="result-card">
        <div class="msl-profile">
          <div class="msl-avatar"><i class="ti ti-user"></i></div>
          <div>
            <div class="msl-name">${escapeHtml(m.name)}</div>
            <div class="msl-meta">${escapeHtml(m.region)} · ${escapeHtml(m.ta)}</div>
            <div class="msl-meta" style="color:var(--success);font-weight:500;">${escapeHtml(m.availability)}</div>
          </div>
        </div>
        <div class="result-body"><strong>Expertise:</strong> ${m.expertise.join(", ")}</div>
        <div class="result-actions">
          <button class="form-btn form-btn-primary" style="font-size:11px;padding:7px 14px;"><i class="ti ti-calendar-plus"></i> Request Meeting</button>
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:7px 14px;"><i class="ti ti-mail"></i> Email</button>
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:7px 14px;"><i class="ti ti-phone"></i> Call</button>
        </div>
      </div>`).join("");
  }, 900);
});

// ============================================================
// 5. INGREDIENT SAFETY
// ============================================================
const ingredientData = {
  "Dupixent (dupilumab)": {
    active: "Dupilumab",
    class: "Monoclonal antibody (anti-IL-4Rα)",
    excipients: ["L-histidine", "L-histidine hydrochloride monohydrate", "L-arginine hydrochloride", "Polysorbate 80", "Sucrose", "Water for injection"],
    contraindications: ["Known hypersensitivity to dupilumab or any excipients"],
    warnings: ["Hypersensitivity reactions (rare <1%)", "Conjunctivitis / keratitis (monitor)", "Helminth infections — treat before initiating", "Do not discontinue systemic corticosteroids abruptly"],
    interactions: ["No formal drug interaction studies needed (biologic)", "Avoid live vaccines during treatment", "No impact on CYP450 enzymes", "Can use with topical corticosteroids"],
    allergyFlags: { "polysorbate": "Contains Polysorbate 80 — cross-reactivity possible in patients with polysorbate allergy.", "latex": "Pre-filled syringe needle cap contains natural rubber (latex derivative). Use pen device for latex-allergic patients.", "histidine": "Contains L-histidine as buffer. Clinically significant reactions to histidine excipient are extremely rare." },
    monitoring: "No routine laboratory monitoring required. Monitor for injection site reactions and new-onset eye symptoms.",
    pregnancy: "Category — limited data. Use only if benefit outweighs risk. Pregnancy registry available (OTIS)."
  },
  "Kevzara (sarilumab)": {
    active: "Sarilumab",
    class: "Monoclonal antibody (anti-IL-6Rα)",
    excipients: ["L-histidine", "L-histidine hydrochloride monohydrate", "L-arginine hydrochloride", "Polysorbate 20", "Sucrose", "Water for injection"],
    contraindications: ["Known hypersensitivity to sarilumab or any excipients", "Active serious infections"],
    warnings: ["Serious infections (TB screening required)", "Neutropenia — monitor ANC", "Hepatotoxicity — monitor ALT/AST", "GI perforations (use caution in diverticulitis)", "Lipid elevations — check lipids 4–8 weeks post-initiation"],
    interactions: ["May normalize CYP450 enzymes elevated by IL-6 — monitor CYP substrates (warfarin, theophylline, cyclosporine)", "Avoid combination with other biologics (e.g., TNF inhibitors)", "Avoid live vaccines"],
    allergyFlags: { "polysorbate": "Contains Polysorbate 20. Lower cross-reactivity risk than PS80 but caution advised.", "latex": "Needle shield contains natural rubber (latex). Alternative administration may be needed." },
    monitoring: "Neutrophils and platelets at baseline, 4–8 weeks, then per clinical judgment. ALT/AST at same intervals. Lipids at 4–8 weeks.",
    pregnancy: "Based on animal data, may cause fetal harm. Advise effective contraception."
  },
  "Aubagio (teriflunomide)": {
    active: "Teriflunomide",
    class: "Pyrimidine synthesis inhibitor (DHODH)",
    excipients: ["Lactose monohydrate", "Maize starch", "Hydroxypropyl cellulose", "Microcrystalline cellulose", "Sodium starch glycolate", "Magnesium stearate"],
    contraindications: ["Severe hepatic impairment", "Pregnancy or women of childbearing potential not using reliable contraception", "Co-administration with leflunomide"],
    warnings: ["Hepatotoxicity — ALT monitoring monthly for 6 months", "Teratogenicity — pregnancy must be excluded", "Peripheral neuropathy", "Bone marrow effects — CBC monitoring", "Interstitial lung disease (rare)"],
    interactions: ["CYP2C8 substrates (repaglinide, paclitaxel) — increased exposure", "Warfarin — decreased INR (monitor closely)", "OAT3 substrates (cefaclor, furosemide) — increased exposure", "Breast cancer resistance protein (BCRP) substrates — rosuvastatin increased 2.6x"],
    allergyFlags: { "lactose": "Contains lactose monohydrate. Patients with galactose intolerance or Lapp lactase deficiency should not take." },
    monitoring: "ALT monthly for first 6 months, then periodically. CBC within 6 months before starting. TB screening. Blood pressure monitoring.",
    pregnancy: "CONTRAINDICATED. Accelerated elimination procedure available (cholestyramine or activated charcoal) if pregnancy occurs."
  },
  "Praluent (alirocumab)": {
    active: "Alirocumab",
    class: "Monoclonal antibody (anti-PCSK9)",
    excipients: ["L-histidine", "L-histidine hydrochloride monohydrate", "Sucrose", "Polysorbate 20", "Water for injection"],
    contraindications: ["Known hypersensitivity to alirocumab or any excipients"],
    warnings: ["Allergic reactions including pruritus, rash, urticaria (rare)", "Neurocognitive events under evaluation (ODYSSEY OUTCOMES: no signal)"],
    interactions: ["No clinically significant pharmacokinetic interactions", "Can co-administer with statins, ezetimibe", "No impact on CYP enzymes"],
    allergyFlags: { "polysorbate": "Contains Polysorbate 20." },
    monitoring: "LDL-C at 4–8 weeks after initiation or dose adjustment. No routine safety labs required beyond lipid panel.",
    pregnancy: "Limited data. Use only if benefit justifies risk."
  },
  "Sarclisa (isatuximab)": {
    active: "Isatuximab-irfc",
    class: "Monoclonal antibody (anti-CD38)",
    excipients: ["Sucrose", "L-histidine", "L-histidine hydrochloride monohydrate", "Polysorbate 80", "Water for injection"],
    contraindications: ["Known severe hypersensitivity to isatuximab or any excipients"],
    warnings: ["Infusion-related reactions (38%) — premedicate with corticosteroid, antipyretic, H1/H2 antagonist", "Neutropenia — monitor CBC regularly", "Second primary malignancies — monitor", "Interference with blood typing — notify blood bank"],
    interactions: ["No formal PK interaction studies", "Interferes with anti-CD38 serological testing — type and screen before treatment", "May affect M-protein assessment (serum protein electrophoresis)"],
    allergyFlags: { "polysorbate": "Contains Polysorbate 80." },
    monitoring: "CBC prior to each cycle. Blood type and screen before first dose. Monitor for infusion reactions during and 2h post-infusion.",
    pregnancy: "May cause fetal harm based on mechanism. Effective contraception required during and 5 months after last dose."
  }
};

document.getElementById("ing-submit").addEventListener("click", () => {
  const product = document.getElementById("ing-product").value;
  const allergy = document.getElementById("ing-allergy").value.trim().toLowerCase();
  if (!product) { alert("Please select a product."); return; }

  const el = document.getElementById("ing-results");
  el.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:#b45309;"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Checking safety profile…</div></div>';

  setTimeout(() => {
    const data = ingredientData[product];
    if (!data) { el.innerHTML = '<div class="result-empty">Product data not available.</div>'; return; }

    const allergyAlerts = allergy ? Object.entries(data.allergyFlags).filter(([k]) => allergy.includes(k)).map(([, v]) => v) : [];

    el.innerHTML = `
      ${allergyAlerts.length ? `<div class="result-card" style="background:var(--danger-bg);border-color:#fca5a5;">
        <div class="result-card-header"><div class="result-title" style="color:var(--danger);">Allergy Alert</div><span class="result-badge badge-danger">Warning</span></div>
        <div class="result-body" style="color:var(--danger);">${allergyAlerts.map(a => `<p>${a}</p>`).join("")}</div>
      </div>` : ""}
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${escapeHtml(product)}</div><span class="result-badge badge-accent">${escapeHtml(data.class)}</span></div>
        <div class="result-body"><strong>Active ingredient:</strong> ${escapeHtml(data.active)}</div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Excipients</div></div>
        <div class="result-body">${data.excipients.map(e => `<span style="display:inline-block;padding:3px 10px;margin:2px 3px;background:var(--surface-dim);border-radius:10px;font-size:11px;">${escapeHtml(e)}</span>`).join("")}</div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Contraindications</div><span class="result-badge badge-danger">Safety</span></div>
        <div class="result-body"><ul>${data.contraindications.map(c => `<li>${escapeHtml(c)}</li>`).join("")}</ul></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Warnings & Precautions</div><span class="result-badge badge-warning">Monitor</span></div>
        <div class="result-body"><ul>${data.warnings.map(w => `<li>${w}</li>`).join("")}</ul></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Drug Interactions</div></div>
        <div class="result-body"><ul>${data.interactions.map(i => `<li>${i}</li>`).join("")}</ul></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Monitoring Requirements</div><span class="result-badge badge-info">Labs</span></div>
        <div class="result-body"><p>${data.monitoring}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Pregnancy</div></div>
        <div class="result-body"><p>${data.pregnancy}</p></div>
      </div>`;
  }, 1000);
});

// ============================================================
// 6. TEMPERATURE STABILITY
// ============================================================
const tempData = {
  "Dupixent (dupilumab) — Pre-filled syringe": {
    product: "Dupixent 300mg/2mL Pre-filled Syringe", storage: "Refrigerate at 2°C – 8°C (36°F – 46°F)", shelfLife: "36 months from manufacture (refrigerated)", lightProtection: "Store in original carton to protect from light",
    roomTemp: { allowed: true, maxTemp: "25°C (77°F)", maxDuration: "14 days", note: "Once removed from refrigerator, must be used within 14 days or discarded. Do not return to refrigerator." },
    freeze: "Do NOT freeze. Do NOT use if frozen, even if subsequently thawed.",
    excursion: "Brief excursions up to 30°C tolerated for <72 hours (transportation data). Beyond this, product integrity cannot be assured.",
    travel: "Use insulated carry case with cool pack (do not place in direct contact — risk of freezing). Suitable for travel up to 14 days at room temperature.",
    inUse: "Single use only. Administer within 45 minutes of removing needle cap. Discard unused portion.",
    visual: "Clear to slightly opalescent, colorless to pale yellow. Do not use if discolored, cloudy, or particles visible."
  },
  "Dupixent (dupilumab) — Pre-filled pen": {
    product: "Dupixent 300mg/2mL Pre-filled Pen", storage: "Refrigerate at 2°C – 8°C (36°F – 46°F)", shelfLife: "36 months from manufacture (refrigerated)", lightProtection: "Store in original carton to protect from light",
    roomTemp: { allowed: true, maxTemp: "25°C (77°F)", maxDuration: "14 days", note: "Same as syringe. Record date of removal from refrigerator on carton." },
    freeze: "Do NOT freeze. Do NOT shake.", excursion: "Brief excursions up to 30°C tolerated for <72 hours.",
    travel: "Pen device is travel-friendly. Insulated case recommended. No special orientation needed.", inUse: "Single use. Allow to reach room temperature (45 min) before injection.", visual: "Inspect through viewing window — clear to slightly opalescent."
  },
  "Kevzara (sarilumab) — Pre-filled syringe": {
    product: "Kevzara 200mg/1.14mL Pre-filled Syringe", storage: "Refrigerate at 2°C – 8°C (36°F – 46°F)", shelfLife: "24 months from manufacture (refrigerated)", lightProtection: "Store in original carton to protect from light",
    roomTemp: { allowed: true, maxTemp: "25°C (77°F)", maxDuration: "14 days", note: "Must use or discard within 14 days at room temperature." },
    freeze: "Do NOT freeze. Discard if frozen.", excursion: "Limited excursion data. Keep within 2–25°C. Contact Sanofi medical information for excursion assessment.",
    travel: "Use insulated bag with cool pack. Do not leave in car or direct sunlight.", inUse: "Single use. Administer within 30 minutes of preparation.", visual: "Clear, colorless to pale yellow. No particles."
  },
  "Praluent (alirocumab) — Pre-filled pen": {
    product: "Praluent 75mg/mL or 150mg/mL Pre-filled Pen", storage: "Refrigerate at 2°C – 8°C (36°F – 46°F)", shelfLife: "36 months (refrigerated)", lightProtection: "Store in original carton",
    roomTemp: { allowed: true, maxTemp: "25°C (77°F)", maxDuration: "30 days", note: "Extended room temp stability — 30 days at ≤25°C. Must be used within this period." },
    freeze: "Do NOT freeze.", excursion: "Up to 30°C for limited periods acceptable. Contact medical information for extended excursions.",
    travel: "30-day room temp window makes Praluent highly travel-friendly. Insulated case recommended for >25°C environments.", inUse: "Single use. Warm 30–40 minutes before injection.", visual: "Clear, colorless to pale yellow."
  },
  "Sarclisa (isatuximab) — IV vial": {
    product: "Sarclisa 100mg/5mL and 500mg/25mL IV Vials", storage: "Refrigerate at 2°C – 8°C (36°F – 46°F)", shelfLife: "36 months (unopened, refrigerated)", lightProtection: "Store in original carton. Protect diluted solution from light.",
    roomTemp: { allowed: true, maxTemp: "25°C (77°F)", maxDuration: "24 hours", note: "Diluted infusion solution: stable 24 hours refrigerated or 8 hours at room temperature (including infusion time)." },
    freeze: "Do NOT freeze.", excursion: "Unopened vials: limited room temp data. Keep refrigerated until preparation.",
    travel: "N/A — hospital/infusion center product.", inUse: "Dilute in 250mL NaCl 0.9% or D5W. Begin infusion within 8 hours at RT. Infuse over ≥150 min (first), ≥90 min (subsequent).", visual: "Colorless to slightly yellow. Do not use if particulate matter present."
  }
};

document.getElementById("ts-submit").addEventListener("click", () => {
  const product = document.getElementById("ts-product").value;
  const scenario = document.getElementById("ts-scenario").value;
  if (!product) { alert("Please select a product."); return; }

  const el = document.getElementById("ts-results");
  el.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:#0369a1;"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Loading storage information…</div></div>';

  setTimeout(() => {
    const d = tempData[product];
    if (!d) { el.innerHTML = '<div class="result-empty">Product data not available.</div>'; return; }

    el.innerHTML = `
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${escapeHtml(d.product)}</div></div>
        <div class="result-body">
          <p><strong>Storage:</strong> ${escapeHtml(d.storage)}</p>
          <p><strong>Shelf life:</strong> ${escapeHtml(d.shelfLife)}</p>
          <p><strong>Light:</strong> ${escapeHtml(d.lightProtection)}</p>
        </div>
      </div>
      <div class="result-card" style="background:#e0f2fe;border-color:#7dd3fc;">
        <div class="result-card-header"><div class="result-title" style="color:#0369a1;">Room Temperature Storage</div><span class="result-badge badge-info">${d.roomTemp.allowed ? "Allowed" : "Not recommended"}</span></div>
        <div class="result-body" style="color:#0c4a6e;">
          <p><strong>Max temperature:</strong> ${escapeHtml(d.roomTemp.maxTemp)}</p>
          <p><strong>Max duration:</strong> ${escapeHtml(d.roomTemp.maxDuration)}</p>
          <p>${escapeHtml(d.roomTemp.note)}</p>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Freeze Protection</div><span class="result-badge badge-danger">Critical</span></div>
        <div class="result-body"><p>${escapeHtml(d.freeze)}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Temperature Excursion</div><span class="result-badge badge-warning">Guidance</span></div>
        <div class="result-body"><p>${escapeHtml(d.excursion)}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Travel & Transport</div></div>
        <div class="result-body"><p>${escapeHtml(d.travel)}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">In-Use Stability</div></div>
        <div class="result-body"><p>${escapeHtml(d.inUse)}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Visual Inspection</div></div>
        <div class="result-body"><p>${escapeHtml(d.visual)}</p></div>
      </div>`;
  }, 800);
});

// ============================================================
// 7. LITERATURE INTELLIGENCE
// ============================================================
const litDatabase = [
  { title: "Long-term Safety and Efficacy of Dupilumab in Adults with Moderate-to-Severe Atopic Dermatitis: LIBERTY AD CHRONOS 4-Year Results", authors: "Simpson EL, Paller AS, et al.", journal: "J Am Acad Dermatol", year: "2026", type: "Clinical Trial", impact: "High", pmid: "39012345" },
  { title: "Dupilumab vs Abrocitinib in Adults with Moderate-to-Severe AD: JADE DARE Randomized Trial", authors: "Reich K, Thyssen JP, et al.", journal: "NEJM", year: "2025", type: "Clinical Trial", impact: "Very High", pmid: "38567890" },
  { title: "Real-World Effectiveness of Dupilumab Across Type 2 Inflammatory Conditions: Systematic Review and Meta-Analysis", authors: "Wollenberg A, et al.", journal: "Allergy", year: "2026", type: "Meta-Analysis", impact: "High", pmid: "39234567" },
  { title: "Patient-Reported Outcomes with Dupilumab in Prurigo Nodularis: PRIME 2 Trial Results", authors: "Kwatra SG, et al.", journal: "Br J Dermatol", year: "2026", type: "Clinical Trial", impact: "Medium", pmid: "39345678" },
  { title: "IL-4/IL-13 Pathway Blockade in Eosinophilic Esophagitis: Mechanistic Insights from LIBERTY EoE TREET", authors: "Dellon ES, et al.", journal: "Gastroenterology", year: "2025", type: "Clinical Trial", impact: "High", pmid: "38678901" },
  { title: "Type 2 Inflammation as a Unifying Paradigm: Cross-Disease Implications for Biologic Therapy", authors: "Gandhi NA, et al.", journal: "Nat Rev Immunol", year: "2025", type: "Review", impact: "Very High", pmid: "38789012" },
  { title: "Sarilumab Monotherapy Superiority over Adalimumab: MONARCH 3-Year Extension", authors: "Burmester GR, et al.", journal: "Ann Rheum Dis", year: "2026", type: "Clinical Trial", impact: "High", pmid: "39456789" },
  { title: "Dupilumab in Pediatric Atopic Dermatitis: Safety Profile in Children Aged 6 Months to 5 Years", authors: "Paller AS, et al.", journal: "Pediatrics", year: "2026", type: "Clinical Trial", impact: "Medium", pmid: "39567890" },
];

document.getElementById("lit-submit").addEventListener("click", () => {
  const query = document.getElementById("lit-query").value.trim();
  const type = document.getElementById("lit-type").value;
  if (!query) { alert("Please enter a search query."); return; }

  const el = document.getElementById("lit-results");
  el.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:#a21caf;"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Searching literature…</div></div>';

  setTimeout(() => {
    const q = query.toLowerCase();
    let matches = litDatabase.filter(p => {
      const text = (p.title + " " + p.authors + " " + p.journal).toLowerCase();
      return q.split(/\s+/).some(w => text.includes(w));
    });
    if (type) matches = matches.filter(p => p.type === type || p.type === "Review");
    if (!matches.length) matches = litDatabase.slice(0, 3);

    const impactColor = i => i === "Very High" ? "badge-danger" : i === "High" ? "badge-accent" : "badge-info";

    el.innerHTML = `<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${matches.length} result${matches.length !== 1 ? "s" : ""} found</div>` +
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
document.getElementById("lit-query").addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("lit-submit").click(); });

// ============================================================
// 8. LITERATURE SCOUT
// ============================================================
const scoutAlerts = {
  "Atopic Dermatitis": [
    { title: "New JAK inhibitor long-term safety data raises concerns (BMJ, Jul 2026)", type: "Competitor", urgency: "high" },
    { title: "AAD updates AD treatment guidelines — biologics as first-line option (JAAD, Jun 2026)", type: "Guideline", urgency: "high" },
    { title: "Real-world Dupixent adherence data: 82% persistence at 2 years (Dermatol Ther, Jul 2026)", type: "Sanofi", urgency: "medium" },
    { title: "Pediatric AD burden study highlights unmet need in ages 6mo–5yr (Pediatrics, Jun 2026)", type: "Landscape", urgency: "medium" },
  ],
  "Asthma (Type 2)": [
    { title: "Dupilumab COPD Phase 3 BOREAS-2 interim: sustained FEV1 benefit (NEJM, Jul 2026)", type: "Sanofi", urgency: "high" },
    { title: "Tezepelumab real-world data: lower-than-expected exacerbation reduction (Lancet Respir, Jun 2026)", type: "Competitor", urgency: "medium" },
    { title: "GINA 2026 update: biologic add-on therapy algorithm revised (Eur Respir J, May 2026)", type: "Guideline", urgency: "high" },
  ],
  "Rheumatoid Arthritis": [
    { title: "MONARCH 3-year extension confirms sarilumab monotherapy durability (Ann Rheum Dis, Jul 2026)", type: "Sanofi", urgency: "high" },
    { title: "EULAR 2026 RA recommendations update — IL-6 pathway positioning strengthened", type: "Guideline", urgency: "high" },
    { title: "Adalimumab biosimilar market update: 6 products now available in US (Nat Rev Drug Discov, Jun 2026)", type: "Landscape", urgency: "medium" },
  ]
};

document.getElementById("scout-submit").addEventListener("click", () => {
  const ta = document.getElementById("scout-ta").value;
  if (!ta) { alert("Please select a therapeutic area."); return; }

  const el = document.getElementById("scout-results");
  el.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:#b45309;"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Scanning recent publications…</div></div>';

  setTimeout(() => {
    const alerts = scoutAlerts[ta] || [];
    if (!alerts.length) {
      el.innerHTML = '<div class="result-empty"><i class="ti ti-radar-2"></i>No recent alerts for this therapeutic area. Check back soon or set up monitoring.</div>';
      return;
    }

    const typeColor = t => t === "Sanofi" ? "badge-accent" : t === "Competitor" ? "badge-danger" : t === "Guideline" ? "badge-info" : "badge-warning";
    const urgIcon = u => u === "high" ? "alert-triangle" : "info-circle";
    const urgColor = u => u === "high" ? "var(--danger)" : "var(--warning)";

    el.innerHTML = `<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${alerts.length} recent publication alert${alerts.length !== 1 ? "s" : ""} for ${escapeHtml(ta)}</div>` +
      alerts.map(a => `<div class="result-card">
        <div class="result-card-header"><div class="result-title" style="font-size:13px;">${escapeHtml(a.title)}</div></div>
        <div class="result-meta">
          <span class="result-badge ${typeColor(a.type)}">${escapeHtml(a.type)}</span>
          <span class="result-meta-item" style="color:${urgColor(a.urgency)};"><i class="ti ti-${urgIcon(a.urgency)}"></i> ${a.urgency === "high" ? "Priority" : "Monitor"}</span>
        </div>
        <div class="result-actions">
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-external-link"></i> Read</button>
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-file-text"></i> AI Summary</button>
        </div>
      </div>`).join("") +
      `<div class="result-card" style="background:var(--surface-dim);border-style:dashed;">
        <div class="result-body" style="text-align:center;padding:8px;"><button class="form-btn form-btn-primary" style="font-size:11px;padding:7px 16px;"><i class="ti ti-bell-plus"></i> Set Up Weekly Alert for ${escapeHtml(ta)}</button></div>
      </div>`;
  }, 1000);
});

// ============================================================
// 9. DISEASE NAVIGATOR
// ============================================================
const diseaseProfiles = {
  "Atopic Dermatitis": {
    overview: "Chronic, relapsing inflammatory skin disease driven by <strong>type 2 inflammation</strong> (IL-4, IL-13, IL-31). Affects ~10% of adults and up to 25% of children worldwide.",
    pathophysiology: "Epidermal barrier dysfunction → allergen penetration → Th2 immune activation → IL-4/IL-13 overexpression → IgE elevation, eosinophilia, pruritus (IL-31). Disrupted filaggrin expression worsens barrier.",
    treatments: [
      { name: "Dupixent (dupilumab)", class: "Anti-IL-4Rα mAb", status: "Approved", note: "First-line biologic. Blocks IL-4 and IL-13. SOLO 1&2, CHRONOS data." },
      { name: "Abrocitinib (Cibinqo)", class: "JAK1 inhibitor", status: "Competitor", note: "Pfizer. Oral. Faster itch onset but JAK safety concerns." },
      { name: "Upadacitinib (Rinvoq)", class: "JAK1 inhibitor", status: "Competitor", note: "AbbVie. Oral. 15mg and 30mg. Boxed warning." },
      { name: "Tralokinumab (Adbry)", class: "Anti-IL-13 mAb", status: "Competitor", note: "LEO Pharma. IL-13 only (not IL-4). Lower efficacy vs dupilumab." }
    ],
    crossTA: ["Asthma (shared IL-4/IL-13)", "CRSwNP (type 2 comorbidity)", "Eosinophilic Esophagitis", "Food allergy (atopic march)"],
    pipeline: "Dupixent label extensions: pediatric <6mo, moderate-only (IGA3), prurigo nodularis, COPD, chronic spontaneous urticaria, bullous pemphigoid"
  },
  "Rheumatoid Arthritis": {
    overview: "Chronic autoimmune inflammatory arthritis affecting ~1% of the population. Driven by TNF, IL-6, IL-1, and T/B cell activation. Leads to joint destruction and systemic complications.",
    pathophysiology: "Synovial inflammation → pannus formation → cartilage/bone erosion. IL-6 pathway drives both local joint inflammation AND systemic effects (fatigue, anemia, acute phase response).",
    treatments: [
      { name: "Kevzara (sarilumab)", class: "Anti-IL-6Rα mAb", status: "Approved", note: "Superior to adalimumab as monotherapy (MONARCH). Best for MTX-intolerant." },
      { name: "Adalimumab (Humira)", class: "Anti-TNF mAb", status: "Competitor", note: "Standard of care. Multiple biosimilars now available." },
      { name: "Tocilizumab (Actemra)", class: "Anti-IL-6R mAb", status: "Competitor", note: "Roche. Same pathway as sarilumab (IL-6 receptor)." },
      { name: "Upadacitinib (Rinvoq)", class: "JAK1 inhibitor", status: "Competitor", note: "AbbVie. Oral. Boxed warning limits use." }
    ],
    crossTA: ["Cardiovascular risk (IL-6 role)", "Depression/fatigue (systemic IL-6)", "Interstitial lung disease"],
    pipeline: "Sarilumab: exploring monotherapy positioning, real-world evidence registry"
  }
};

document.getElementById("dn-submit").addEventListener("click", () => {
  const disease = document.getElementById("dn-disease").value;
  if (!disease) { alert("Please select a disease."); return; }

  const el = document.getElementById("dn-results");
  el.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:var(--success);"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Loading disease profile…</div></div>';

  setTimeout(() => {
    const data = diseaseProfiles[disease];
    if (!data) {
      el.innerHTML = `<div class="result-card"><div class="result-card-header"><div class="result-title">${escapeHtml(disease)}</div><span class="result-badge badge-info">Profile</span></div><div class="result-body"><p>Detailed disease profile for <strong>${escapeHtml(disease)}</strong> is being developed. Full profiles are available for Atopic Dermatitis and Rheumatoid Arthritis.</p><p style="margin-top:8px;">For now, visit the <a href="/disease.html" style="color:var(--accent);">Disease Navigator module</a> for comprehensive disease state information.</p></div></div>`;
      return;
    }

    const statusColor = s => s === "Approved" ? "badge-success" : s === "Competitor" ? "badge-danger" : "badge-info";

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
        <div class="result-body" style="color:#085041;">${data.crossTA.map(c => `<span class="interest-chip" style="background:#c6f1dc;color:#085041;">${escapeHtml(c)}</span>`).join("")}</div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Sanofi Pipeline</div><span class="result-badge badge-accent">Pipeline</span></div>
        <div class="result-body"><p>${escapeHtml(data.pipeline)}</p></div>
      </div>`;
  }, 1000);
});

// ============================================================
// 10. CONGRESS INTELLIGENCE
// ============================================================
const congressDB = {
  'AAD 2026': {
    fullName: 'AAD 2026 Annual Meeting', location: 'San Francisco, CA', dates: 'Mar 20–24, 2026', status: 'Completed',
    highlights: ['Dupilumab 4-year AD safety data presented', 'New PN real-world evidence poster', 'Type 2 inflammation symposium well-attended'],
    presentations: [
      { title: 'LIBERTY AD CHRONOS: 4-Year Safety & Efficacy of Dupilumab', type: 'Oral', session: 'Late-Breaking Session', impact: 'High', sanofi: true },
      { title: 'Real-World Dupilumab in Pediatric AD: Registry Update', type: 'Poster', session: 'E-Poster Hall', impact: 'Medium', sanofi: true },
      { title: 'Dupilumab in Prurigo Nodularis: PRIME 2 Results', type: 'Poster', session: 'Clinical Trials Posters', impact: 'High', sanofi: true },
      { title: 'JAK Inhibitors Long-Term Safety Meta-Analysis', type: 'Oral', session: 'Safety Session', impact: 'High', sanofi: false },
    ],
    competitors: ['Pfizer: Abrocitinib 52-week data', 'AbbVie: Upadacitinib vs dupilumab head-to-head subgroup', 'LEO Pharma: Tralokinumab combination data']
  },
  'EADV 2026': {
    fullName: 'EADV 2026 Congress', location: 'Vienna, Austria', dates: 'Sep 23–27, 2026', status: 'Upcoming',
    highlights: ['Expected: Dupilumab chronic hand eczema late-breaker', 'Sanofi satellite symposium confirmed', 'Key guideline update session on biologics'],
    presentations: [
      { title: 'Dupilumab in Chronic Hand Eczema: Phase 3 Results', type: 'Late-Breaker', session: 'Late-Breaking Session 2', impact: 'High', sanofi: true },
      { title: 'LIBERTY AD HIVE: 3-Year Real-World Outcomes', type: 'Oral', session: 'Real-World Evidence Session', impact: 'Medium', sanofi: true },
    ],
    competitors: ['AbbVie: Risankizumab in AD phase 2 update', 'Galderma: Nemolizumab pivotal results']
  },
  'ATS 2026': {
    fullName: 'ATS 2026 International Conference', location: 'San Diego, CA', dates: 'May 15–20, 2026', status: 'Completed',
    highlights: ['BOREAS COPD subgroup analysis featured', 'Type 2 biomarker-guided therapy debate', 'Sanofi respiratory pipeline highlighted'],
    presentations: [
      { title: 'BOREAS: Dupilumab in Uncontrolled COPD — Biomarker Subgroups', type: 'Oral', session: 'COPD Symposium', impact: 'High', sanofi: true },
      { title: 'Dupilumab in Severe Asthma: 3-Year Persistence Data', type: 'Poster', session: 'Asthma Posters', impact: 'Medium', sanofi: true },
    ],
    competitors: ['AstraZeneca: Tezepelumab COPD data', 'GSK: Depemokimab severe asthma results']
  },
  'ACR 2026': {
    fullName: 'ACR Convergence 2026', location: 'Washington, DC', dates: 'Nov 14–18, 2026', status: 'Upcoming',
    highlights: ['MONARCH 3-year extension expected', 'IL-6 monotherapy positioning data', 'Biosimilar landscape shifting'],
    presentations: [
      { title: 'MONARCH Long-Term Extension: Sarilumab Monotherapy at 3 Years', type: 'Oral', session: 'RA Treatment Session', impact: 'High', sanofi: true },
      { title: 'Sarilumab Impact on Patient-Reported Fatigue: MONARCH PRO', type: 'Poster', session: 'PROs in Rheumatology', impact: 'Medium', sanofi: true },
    ],
    competitors: ['AbbVie: Adalimumab biosimilar switching data', 'Lilly: Baricitinib long-term RA registry']
  },
  'AAAAI 2026': {
    fullName: 'AAAAI 2026 Annual Meeting', location: 'Phoenix, AZ', dates: 'Feb 28–Mar 3, 2026', status: 'Completed',
    highlights: ['Type 2 inflammation cross-disease symposium', 'Dupilumab allergy prevention data discussed', 'New EoE treatment algorithms'],
    presentations: [
      { title: 'Dupilumab in EoE: Histologic and Symptomatic Outcomes', type: 'Oral', session: 'GI Allergy Session', impact: 'High', sanofi: true },
      { title: 'CSU Phase 2 Dupilumab Results', type: 'Poster', session: 'Urticaria Posters', impact: 'Medium', sanofi: true },
    ],
    competitors: ['Regeneron: Next-gen IL-4R update', 'Novartis: Omalizumab CSU real-world data']
  },
  'DDW 2026': {
    fullName: 'DDW 2026 — Digestive Disease Week', location: 'Washington, DC', dates: 'May 30–Jun 2, 2026', status: 'Upcoming',
    highlights: ['Expected: EoE long-term dupilumab maintenance data', 'GI biologics landscape session', 'Eosinophilic GI disease emerging focus'],
    presentations: [
      { title: 'Dupilumab EoE Maintenance: 48-Week Extension Data', type: 'Oral', session: 'EoE Clinical Trials', impact: 'High', sanofi: true },
    ],
    competitors: ['AstraZeneca: Benralizumab in EoE pilot', 'Takeda: Eosinophilic GI pipeline']
  }
};

document.getElementById("cg-submit").addEventListener("click", () => {
  const congressVal = document.getElementById("cg-congress").value;
  const container = document.getElementById("cg-results");
  const btn = document.getElementById("cg-submit");
  if (!congressVal) { container.innerHTML = '<div class="result-empty" style="color:var(--danger)"><i class="ti ti-alert-circle"></i>Please select a congress.</div>'; return; }

  if (window.mvBtnLoading) mvBtnLoading(btn, 'Loading…');
  container.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:#dc2626;"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Loading congress coverage…</div></div>';

  setTimeout(() => {
    const key = congressVal.split(' — ')[0];
    const data = congressDB[key];
    if (!data) {
      if (window.mvBtnReset) mvBtnReset(btn);
      container.innerHTML = '<div class="result-empty"><i class="ti ti-calendar-event"></i>Coverage data for this congress is not yet available.</div>';
      return;
    }

    const impactColors = { High: 'badge-danger', Medium: 'badge-warning', Low: 'badge-success' };
    const statusBadge = data.status === 'Upcoming' ? '<span class="result-badge badge-warning">Upcoming</span>' : '<span class="result-badge badge-success">Completed</span>';
    const congressSlug = key.toLowerCase().replace(/\s+/g, '-');

    container.innerHTML = `
      <div class="result-card" style="border-left:3px solid #dc2626;">
        <div class="result-card-header"><div class="result-title">${escapeHtml(data.fullName)}</div>${statusBadge}</div>
        <div class="result-body">
          <p><strong>Location:</strong> ${escapeHtml(data.location)} &nbsp;|&nbsp; <strong>Dates:</strong> ${escapeHtml(data.dates)}</p>
          <a href="/congress.html#congress=${congressSlug}" style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:12px;font-weight:600;color:#dc2626;text-decoration:none;" target="_blank"><i class="ti ti-external-link" style="font-size:14px;"></i> View Full Congress Coverage</a>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Key Highlights</div><span class="result-badge badge-info">${data.highlights.length} Items</span></div>
        <div class="result-body"><ul style="margin:0;padding-left:18px;line-height:1.8;">${data.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Presentations</div><span class="result-badge badge-accent">${data.presentations.length} Total</span></div>
        <div class="result-body">${data.presentations.map(p => `
          <div style="padding:10px 0;border-bottom:1px solid var(--border);">
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
              <span class="result-badge ${impactColors[p.impact]}" style="font-size:9px;">${p.impact}</span>
              <span class="result-badge badge-info" style="font-size:9px;">${escapeHtml(p.type)}</span>
              ${p.sanofi ? '<span class="result-badge badge-accent" style="font-size:9px;">Sanofi</span>' : ''}
            </div>
            <div style="font-weight:600;font-size:13px;">${escapeHtml(p.title)}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;"><i class="ti ti-clock" style="font-size:12px;"></i> ${escapeHtml(p.session)}</div>
            <a href="/congress.html#congress=${congressSlug}" style="display:inline-flex;align-items:center;gap:3px;margin-top:4px;font-size:11px;font-weight:500;color:var(--accent);text-decoration:none;" target="_blank"><i class="ti ti-file-description" style="font-size:12px;"></i> View Poster Overview</a>
          </div>`).join('')}</div>
      </div>
      <div class="result-card" style="border-left:3px solid #b45309;">
        <div class="result-card-header"><div class="result-title" style="color:#b45309;">Competitor Intelligence</div><span class="result-badge badge-warning">${data.competitors.length} Items</span></div>
        <div class="result-body"><ul style="margin:0;padding-left:18px;line-height:1.8;">${data.competitors.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul></div>
      </div>`;
    if (window.mvBtnSuccess) mvBtnSuccess(btn, 'Loaded', 2000);
    if (window.mvToast) mvToast(`${data.fullName} coverage loaded — ${data.presentations.length} presentations`, 'success');
    if (window.mvPulse) container.querySelectorAll('.result-card').forEach(c => mvPulse(c));
    broadcastSignal({ topic: `Congress Coverage — ${data.fullName}`, intent: "Congress intelligence", diseaseArea: "Multi-indication", depth: "Deep engagement", orionAction: `PRIORITY: Congress data accessed — ${data.presentations.length} presentations reviewed via HCP Concierge`, queries: [`${data.fullName} presentations and highlights`], contentAccessed: data.presentations.map(p => p.title), _source: "HCP Concierge" });
  }, 1200);
});

// ============================================================
// CHIP GROUP TOGGLE
// ============================================================
function initChipGroups() {
  document.querySelectorAll(".form-chip-group").forEach(group => {
    group.querySelectorAll(".form-chip").forEach(chip => {
      chip.addEventListener("click", () => chip.classList.toggle("selected"));
    });
  });
}
function getSelectedChips(id) {
  return Array.from(document.querySelectorAll(`#${id} .form-chip.selected`)).map(c => c.dataset.val);
}

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

const HCP_AGENTS = [
  { id: "voice-search", name: "Voice Search",           icon: "microphone" },
  { id: "clinical-qa",  name: "Clinical Q&A",           icon: "stethoscope" },
  { id: "patient-nav",  name: "Patient Navigator",      icon: "map-pin" },
  { id: "trial-match",  name: "Trial Matching",         icon: "flask" },
  { id: "msl-connect",  name: "MSL Connect",            icon: "users" },
  { id: "ingredient",   name: "Ingredient Safety",      icon: "shield-check" },
  { id: "temp-stab",    name: "Temperature Stability",  icon: "temperature" },
  { id: "literature",   name: "Literature Intelligence", icon: "book-2" },
  { id: "lit-scout",    name: "Literature Scout",        icon: "radar-2" },
  { id: "disease-nav",  name: "Disease Navigator",       icon: "dna" },
  { id: "congress",     name: "Congress Intelligence",   icon: "building-arch" },
  { id: "assistant",    name: "HCP Concierge Assistant", icon: "message-circle" },
];

async function runAgentDemo(index, agent) {
  const $ = id => document.getElementById(id);
  const set = (id, v) => { const el = $(id); if (el) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } };
  const click = id => { const el = $(id); if (el) el.click(); };

  switch (agent.id) {
    case "voice-search": {
      await narrate("Let's start with voice search — tap the microphone and speak your clinical question, completely hands-free");
      showHub();
      await delay(600);
      const vsMic = hubSearchInput?.parentElement?.querySelector('.mv-voice-btn');
      if (vsMic) { vsMic.classList.add('listening'); vsMic.innerHTML = '<i class="ti ti-loader-2 mv-spin"></i>'; }
      await delay(1200);
      if (hubSearchInput) { hubSearchInput.value = ''; for (const ch of "Dupixent dosing for atopic dermatitis") { hubSearchInput.value += ch; hubSearchInput.dispatchEvent(new Event('input', { bubbles: true })); await delay(30); } }
      await delay(400);
      if (vsMic) { vsMic.classList.remove('listening'); vsMic.innerHTML = '<i class="ti ti-microphone"></i>'; }
      await delay(300);
      routeSearch("Dupixent dosing for atopic dermatitis");
      await delay(1800);
      await narrate("Voice recognized and query routed — the H C P Concierge finds the right agent automatically");
      await delay(1500);
      break;
    }
    case "clinical-qa": {
      await narrate("It starts with a clinical question. A dermatologist asks about treatment options for a patient with moderate-to-severe AD who has failed topicals");
      showPanel("clinical-qa");
      await delay(600);
      const q = "What are my options for a 45-year-old patient with moderate-to-severe atopic dermatitis who failed topicals?";
      chatInput.value = q; chatSend.disabled = false;
      await delay(400);
      await submitChat(q);
      await narrate("Cited evidence returned with treatment guidelines, clinical trial data, and an Orion signal generated for the field team");
      await delay(1500);
      break;
    }
    case "patient-nav": {
      await narrate("The answer leads to a treatment decision. The Patient Navigator builds a personalized care pathway");
      showPanel("patient-nav");
      await delay(600);
      set("pn-age", "45"); set("pn-sex", "Female"); set("pn-diagnosis", "Atopic Dermatitis (moderate-to-severe)");
      await narrate("Entering patient details — 45-year-old female, moderate-to-severe AD");
      await delay(400);
      click("pn-submit");
      await delay(2000);
      await narrate("A step-by-step care pathway generated — from severity assessment through biologic therapy to monitoring and trial enrollment options");
      await delay(1500);
      break;
    }
    case "trial-match": {
      await narrate("The patient is interested in clinical trials. The Trial Matching agent searches for eligible studies");
      showPanel("trial-match");
      await delay(600);
      set("tm-indication", "Atopic Dermatitis"); set("tm-age", "45"); set("tm-bio", "Biologic-naïve"); set("tm-region", "United States");
      await narrate("Filtering by indication, age, biologic status, and region");
      await delay(400);
      click("tm-submit");
      await delay(2000);
      await narrate("Multiple active trials found — LIBERTY AD PED, LIBERTY AD HALO, and the DUPIXENT REAL observational registry, with enrollment status and site locations");
      await delay(1500);
      break;
    }
    case "msl-connect": {
      await narrate("The HCP wants to discuss the latest data with a field medical liaison. MSL Connect finds the right person");
      showPanel("msl-connect");
      await delay(600);
      set("msl-ta", "Dermatology / Atopic Dermatitis"); set("msl-region", "Northeast US");
      await narrate("Searching for a dermatology MSL in the Northeast");
      await delay(400);
      click("msl-submit");
      await delay(1500);
      await narrate("Dr. Amanda Rodriguez, PharmD — available this week, specializing in Dupixent clinical data and AD real-world evidence. Meeting request, email, and phone options ready");
      await delay(1500);
      break;
    }
    case "ingredient": {
      await narrate("Before prescribing, the HCP checks a patient allergy concern. The Ingredient Safety agent cross-references drug excipients");
      showPanel("ingredient");
      await delay(600);
      set("ing-product", "Dupixent (dupilumab)"); set("ing-allergy", "latex");
      await narrate("Checking Dupixent against a latex allergy");
      await delay(400);
      click("ing-submit");
      await delay(2000);
      await narrate("Allergy alert — the pre-filled syringe needle cap contains a latex derivative. Agent recommends the pen device instead. Full excipient list, contraindications, and monitoring requirements displayed");
      await delay(1500);
      break;
    }
    case "temp-stab": {
      await narrate("The patient asks about traveling with their medication. Temperature Stability provides storage guidance");
      showPanel("temp-stab");
      await delay(600);
      set("ts-product", "Dupixent (dupilumab) — Pre-filled pen"); set("ts-scenario", "Patient travel / transport");
      await narrate("Looking up travel storage conditions for the Dupixent pre-filled pen");
      await delay(400);
      click("ts-submit");
      await delay(1500);
      await narrate("Room temperature up to 25 degrees Celsius for 14 days. Pen device is travel-friendly — insulated case recommended. Full freeze protection and visual inspection guidance included");
      await delay(1500);
      break;
    }
    case "literature": {
      await narrate("Meanwhile, the HCP wants to review the latest evidence. The Literature agent searches the Sanofi clinical database");
      showPanel("literature");
      await delay(600);
      set("lit-query", "dupilumab atopic dermatitis long-term safety"); set("lit-type", "Clinical Trial");
      await narrate("Searching for dupilumab long-term safety data in AD");
      await delay(400);
      click("lit-submit");
      await delay(2000);
      await narrate("Results include the LIBERTY AD CHRONOS 4-year data, the JADE DARE head-to-head trial, and real-world effectiveness meta-analysis — with impact ratings and PubMed links");
      await delay(1500);
      break;
    }
    case "lit-scout": {
      await narrate("Literature Scout proactively monitors for new publications. Let's check recent alerts for Atopic Dermatitis");
      showPanel("lit-scout");
      await delay(600);
      set("scout-ta", "Atopic Dermatitis");
      await narrate("Scanning recent publications in AD");
      await delay(400);
      click("scout-submit");
      await delay(2000);
      await narrate("Four alerts — including a competitor JAK inhibitor safety concern, an AAD guideline update promoting biologics first-line, and positive Dupixent adherence data. Each tagged by type and priority");
      await delay(1500);
      break;
    }
    case "disease-nav": {
      await narrate("The Disease Navigator provides a comprehensive disease landscape — pathophysiology, treatment positioning, and cross-TA connections");
      showPanel("disease-nav");
      await delay(600);
      set("dn-disease", "Atopic Dermatitis");
      await narrate("Loading the Atopic Dermatitis disease profile");
      await delay(400);
      click("dn-submit");
      await delay(2000);
      await narrate("Full profile — type 2 inflammation mechanism, competitive treatment landscape with Dupixent as first-line biologic, cross-TA links to asthma and CRSwNP, and the pipeline expansion strategy");
      await delay(1500);
      break;
    }
    case "congress": {
      await narrate("Finally — Congress Intelligence delivers coverage from major medical meetings. Let's review AAD 2026");
      showPanel("congress");
      await delay(600);
      set("cg-congress", "AAD 2026 — American Academy of Dermatology");
      await narrate("Loading AAD 2026 congress coverage");
      await delay(400);
      click("cg-submit");
      await delay(2000);
      await narrate("Four presentations including the CHRONOS 4-year oral, PRIME 2 prurigo nodularis poster, and competitor intelligence on JAK inhibitor safety data. Full highlights, Sanofi presentations, and competitive landscape");
      await delay(1500);
      break;
    }
    case "assistant": {
      await narrate("The H C P Concierge Assistant — your AI companion for clinical questions, any time");
      showHub();
      await delay(600);
      const fab = document.querySelector(".mv-chat-fab");
      if (fab) { fab.click(); await delay(800); }
      const assistInput = document.getElementById("mv-chat-input");
      if (assistInput) {
        assistInput.value = "";
        for (const ch of "Dupixent storage requirements") {
          assistInput.value += ch; await delay(25);
        }
        await delay(400);
        document.getElementById("mv-chat-send")?.click();
        await delay(2000);
      }
      await narrate("Instant answers drawing from all twelve agents, built for the healthcare professional workflow");
      await delay(1500);
      if (fab) fab.click();
      await delay(400);
      break;
    }
  }
}

const demoCtrl = createDemoController({
  moduleName: "HCP Concierge",
  moduleIcon: "heart-rate-monitor",
  agents: HCP_AGENTS,
  runAgent: runAgentDemo,
});

if (demoBtn) demoBtn.addEventListener("click", runDemo);

async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;
  demoBtn.disabled = true;
  demoBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running…';

  await delay(500);
  await narrate("H C P Concierge — a day in the life, featuring eleven AI agents supporting healthcare professionals across clinical practice, research, and field engagement");

  await demoCtrl.runFullDemo();

  // ── Wrap up ──
  showHub();
  await delay(500);
  await narrate("With twelve agents on one platform, from clinical questions to congress coverage — the H C P Concierge gives healthcare professionals the intelligence they need, when they need it");
  narrateOff();

  demoRunning = false;
  demoBtn.disabled = false;
  demoBtn.innerHTML = '<i class="ti ti-player-play"></i> Run Demo';
}

if (window.location.hash === "#autoplay") {
  window.location.hash = "";
  setTimeout(runDemo, 600);
}
