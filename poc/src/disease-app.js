import { DISEASES, PATHWAYS, getDiseaseById, getConnectedDiseases, getDiseasesByPathway, getPathway } from "./disease-data.js";
import { speak, speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";

const gridEl = document.getElementById("disease-grid");
const detailEl = document.getElementById("disease-detail");
const detailContent = document.getElementById("detail-content");
const closeBtn = document.getElementById("detail-close");
const filterBtns = document.querySelectorAll(".filter-btn");

let activeFilter = "all";
let activeDiseaseId = null;
let chatDemoRunning = false;

function init() {
  renderStats();
  renderGrid();
  bindFilters();
  closeBtn.addEventListener("click", closeDetail);
  bindDemo();
  bindChat();
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

// ─── DEMO ───
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
  stopSpeaking();
  hideControls();
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function bindDemo() {
  const btn = document.getElementById("run-demo");
  if (!btn) return;
  btn.addEventListener("click", runDemo);
}

async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;
  const btn = document.getElementById("run-demo");
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader-2 ti-spin"></i> Running...';

  closeDetail();
  await delay(400);

  await narrate("Welcome to the Disease State Navigator — Sanofi's cross-TA intelligence map");

  await narrate("Let's start by filtering to Type 2 Inflammation — the pathway behind Dupixent");
  const type2Btn = document.querySelector('.filter-btn[data-pathway="type2"]');
  if (type2Btn) type2Btn.click();
  await delay(500);

  await narrate("7 diseases share this pathway — now let's explore Atopic Dermatitis");
  const adCard = gridEl.querySelector('.disease-card[data-id="ad"]');
  if (adCard) { adCard.scrollIntoView({ behavior: "smooth", block: "center" }); await delay(600); adCard.click(); }
  await delay(500);

  await narrate("AD connects to 4 other conditions via the atopic march — notice the gold highlights");

  await narrate("Let's follow the connection to Type 2 Asthma — same IL-4/IL-13 pathway");
  const asthmaLink = detailContent.querySelector('.connected-card[data-id="asthma"]');
  if (asthmaLink) asthmaLink.click();
  await delay(500);

  await narrate("Asthma connects back to AD, CRSwNP, and EoE — the unified airway concept");

  await narrate("Now let's follow to EoE — type 2 inflammation in the esophagus");
  const eoeLink = detailContent.querySelector('.connected-card[data-id="eoe"]');
  if (eoeLink) eoeLink.click();
  await delay(500);

  await narrate("Dupixent is the first FDA-approved treatment for EoE — ages 1 and up");

  await narrate("Let's switch to a different pathway — IL-23/Th17");
  closeDetail();
  await delay(400);
  const th17Btn = document.querySelector('.filter-btn[data-pathway="il23th17"]');
  if (th17Btn) th17Btn.click();
  await delay(500);

  await narrate("Psoriasis and IBD share the IL-23/Th17 axis — different organs, same biology");
  const psoCard = gridEl.querySelector('.disease-card[data-id="psoriasis"]');
  if (psoCard) { psoCard.scrollIntoView({ behavior: "smooth", block: "center" }); await delay(600); psoCard.click(); }
  await delay(500);

  await narrate("MedVerse maps these connections so MSLs can tell cross-specialty stories");

  closeDetail();
  const allBtn = document.querySelector('.filter-btn[data-pathway="all"]');
  if (allBtn) allBtn.click();
  await delay(500);

  await narrate("That's the Disease State Navigator — explore freely or use the chat to ask questions");
  narrateOff();

  demoRunning = false;
  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-player-play"></i> Guided Tour';
}

// ─── CHAT ───

function resetChat() {
  const messages = document.getElementById("chat-messages");
  const suggestions = document.getElementById("chat-suggestions");
  messages.innerHTML = '<div class="chat-msg ai">Hi! I\'m the Disease Navigator AI. Ask me about disease states, inflammatory pathways, treatment landscapes, and Sanofi\'s therapeutic positioning.<br><br>Try a suggestion below, or type your own question.</div>';
  suggestions.innerHTML = [
    "What is type 2 inflammation?",
    "Tell me about atopic dermatitis",
    "Dupixent competitive landscape",
    "AD competitors vs Dupixent"
  ].map(s => `<button class="chat-suggestion">${s}</button>`).join("");
  document.getElementById("chat-input").value = "";
  document.getElementById("chat-send").disabled = true;
}

function bindChat() {
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const suggestions = document.getElementById("chat-suggestions");
  const chatDemoBtn = document.getElementById("chat-demo-btn");
  const clearBtn = document.getElementById("chat-clear");

  if (chatDemoBtn) chatDemoBtn.addEventListener("click", runChatDemo);
  if (clearBtn) clearBtn.addEventListener("click", resetChat);

  sendBtn.addEventListener("click", () => submitChat());
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && input.value.trim()) submitChat(); });
  input.addEventListener("input", () => { sendBtn.disabled = !input.value.trim(); });

  suggestions.addEventListener("click", (e) => {
    const btn = e.target.closest(".chat-suggestion");
    if (!btn) return;
    input.value = btn.textContent;
    submitChat();
  });
}

const CHAT_DEMO_SEQUENCE = [
  { persona: "MSL", css: "msl", icon: "ti-stethoscope", question: "What is type 2 inflammation?" },
  { persona: "HCP", css: "hcp", icon: "ti-heartbeat", question: "Tell me about atopic dermatitis" },
  { persona: "Med Affairs", css: "med-affairs", icon: "ti-briefcase", question: "Dupixent competitive landscape" },
  { persona: "HCP", css: "hcp", icon: "ti-heartbeat", question: "AD competitors vs Dupixent" },
  { persona: "MSL", css: "msl", icon: "ti-stethoscope", question: "How are AD and asthma connected?" },
  { persona: "Med Affairs", css: "med-affairs", icon: "ti-briefcase", question: "What diseases does Dupixent treat?" },
  { persona: "Patient Advocate", css: "patient", icon: "ti-heart", question: "What is the atopic march?" },
  { persona: "HCP", css: "hcp", icon: "ti-heartbeat", question: "What treats rheumatoid arthritis?" },
];

async function runChatDemo() {
  if (chatDemoRunning) return;
  chatDemoRunning = true;

  const messages = document.getElementById("chat-messages");
  const suggestions = document.getElementById("chat-suggestions");
  const input = document.getElementById("chat-input");
  const demoBtn = document.getElementById("chat-demo-btn");

  demoBtn.disabled = true;
  demoBtn.innerHTML = '<i class="ti ti-loader-2 ti-spin"></i> Running...';

  messages.innerHTML = '<div class="chat-msg ai">Starting demo — simulating questions from different MedVerse users...</div>';
  suggestions.innerHTML = "";
  scrollChat();
  await delay(2000);

  for (let i = 0; i < CHAT_DEMO_SEQUENCE.length; i++) {
    const step = CHAT_DEMO_SEQUENCE[i];

    messages.innerHTML += `<div class="chat-persona-label ${step.css}"><i class="${step.icon}" style="font-size:10px"></i> ${step.persona}</div>`;
    scrollChat();
    await delay(400);

    input.value = "";
    for (const ch of step.question) {
      input.value += ch;
      await delay(25 + Math.random() * 20);
    }
    scrollChat();
    await delay(500);

    await submitChat();
    await delay(2500);
  }

  messages.innerHTML += '<div class="chat-msg ai" style="border-left:3px solid var(--gold);padding-left:12px"><strong>Demo complete.</strong> The Disease Navigator AI answered 8 questions from 4 different user personas — MSLs, HCPs, Medical Affairs, and Patient Advocates — using pattern-matched intelligence and live PubMed search.</div>';
  scrollChat();

  chatDemoRunning = false;
  demoBtn.disabled = false;
  demoBtn.innerHTML = '<i class="ti ti-player-play"></i> Demo';
}

async function submitChat() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");
  const suggestions = document.getElementById("chat-suggestions");
  const query = input.value.trim();
  if (!query) return;

  suggestions.innerHTML = "";
  messages.innerHTML += `<div class="chat-msg user">${escapeHtml(query)}</div>`;
  input.value = "";
  document.getElementById("chat-send").disabled = true;
  scrollChat();

  const typing = document.createElement("div");
  typing.className = "chat-typing";
  typing.innerHTML = "<span></span><span></span><span></span>";
  messages.appendChild(typing);
  scrollChat();

  const response = generateChatResponse(query);

  if (response.liveSearch) {
    typing.querySelector("span:last-of-type")?.insertAdjacentHTML("afterend",
      '<span style="font-size:11px;color:var(--text-muted);margin-left:6px">Searching PubMed…</span>');
    try {
      const articles = await searchPubMedLive(response.liveSearch, 5);
      typing.remove();
      if (articles.length) {
        const articleHtml = articles.map((a, i) =>
          `<div class="chat-finding"><i class="ti ti-file-text"></i> <strong>${escapeHtml(a.title)}</strong><br>` +
          `<span style="font-size:11px;color:var(--text-muted)">${escapeHtml(a.authors)} — ${escapeHtml(a.journal)} (${escapeHtml(a.year)})</span> ` +
          `<a href="https://pubmed.ncbi.nlm.nih.gov/${a.pmid}/" target="_blank" rel="noopener" style="font-size:11px;color:var(--accent);font-weight:600">PMID ${a.pmid}</a></div>`
        ).join("");
        response.html = `I searched PubMed for "<em>${escapeHtml(query)}</em>" and found <strong>${articles.length} articles</strong>:<br><br>${articleHtml}<br>` +
          `<span style="font-size:12px;color:var(--text-muted)">For deeper analysis, visit the <a href="/literature.html" style="color:var(--accent);font-weight:600">Literature Intelligence</a> page.</span>`;
        response.followUps = ["What is type 2 inflammation?", "Tell me about atopic dermatitis", "What diseases does Dupixent treat?"];
      } else {
        response.html = `I searched PubMed for "<em>${escapeHtml(query)}</em>" but didn't find results. Try rephrasing or ask about a specific disease, pathway, or treatment.`;
        response.followUps = ["What diseases are in the navigator?", "What is type 2 inflammation?", "Show me all pathways"];
      }
    } catch {
      typing.remove();
      response.html = `I wasn't able to reach PubMed right now. You can ask about diseases, pathways, treatments, or connections mapped in the navigator.`;
      response.followUps = ["What diseases are in the navigator?", "What is type 2 inflammation?", "Tell me about atopic dermatitis"];
    }
  } else {
    await delay(600 + Math.random() * 800);
    typing.remove();
  }

  messages.innerHTML += `<div class="chat-msg ai">${response.html}</div>`;
  scrollChat();

  if (response.followUps.length > 0) {
    suggestions.innerHTML = response.followUps.map(f => `<button class="chat-suggestion">${escapeHtml(f)}</button>`).join("");
  }

  if (response.openDisease) {
    await delay(300);
    openDetail(response.openDisease);
  }
}

function scrollChat() {
  const el = document.getElementById("chat-messages");
  requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
}

function generateChatResponse(query) {
  const q = query.toLowerCase();
  const result = { html: "", followUps: [], openDisease: null };

  const diseaseMatch = DISEASES.find(d =>
    q.includes(d.name.toLowerCase()) || q.includes(d.abbrev.toLowerCase()) ||
    (d.id === "ad" && (q.includes("atopic") || q.includes(" ad "))) ||
    (d.id === "eoe" && q.includes("eosinophilic esophag")) ||
    (d.id === "crswp" && (q.includes("nasal polyp") || q.includes("crswn"))) ||
    (d.id === "csu" && q.includes("urticaria")) ||
    (d.id === "pn" && q.includes("prurigo")) ||
    (d.id === "copd" && q.includes("copd")) ||
    (d.id === "ra" && (q.includes("rheumatoid") || q === "ra")) ||
    (d.id === "ibd" && (q.includes("inflammatory bowel") || q.includes("crohn") || q.includes("colitis")))
  );

  // Connection questions
  if (q.includes("connect") || q.includes("relat") || q.includes("link") || q.includes("comorbid")) {
    if (diseaseMatch) {
      const connected = getConnectedDiseases(diseaseMatch.id);
      result.html = `<strong>${diseaseMatch.name}</strong> connects to <strong>${connected.length}</strong> other conditions:<br>` +
        connected.map(c => `<div class="chat-finding"><i class="ti ti-link"></i> ${c.name} (${c.area})</div>`).join("") +
        `<br>${diseaseMatch.connectionReason}`;
      result.followUps = connected.slice(0, 2).map(c => `Tell me about ${c.name}`);
      result.followUps.push(`What treats ${diseaseMatch.abbrev}?`);
      result.openDisease = diseaseMatch.id;
    } else {
      const allConnections = new Set();
      DISEASES.forEach(d => d.connections.forEach(c => { allConnections.add([d.id, c].sort().join("-")); }));
      result.html = `The Disease Navigator maps <strong>${allConnections.size} cross-TA connections</strong> across ${DISEASES.length} diseases. The densest connections are through the <span class="chat-tag">Type 2 Inflammation</span> pathway, where AD, asthma, CRSwNP, EoE, and PN share IL-4/IL-13 biology.`;
      result.followUps = ["How are AD and asthma connected?", "What is type 2 inflammation?", "Show me the IL-23 pathway"];
    }
    return result;
  }

  // Pathway questions
  if (q.includes("type 2") || q.includes("type2") || q.includes("il-4") || q.includes("il-13") || q.includes("th2")) {
    const pw = PATHWAYS["type2"];
    const diseases = getDiseasesByPathway("type2");
    result.html = `<strong>Type 2 Inflammation</strong><br>${pw.description}<br><br>` +
      `<strong>Key cytokines:</strong> ${pw.cytokines.map(c => `<span class="chat-tag">${c}</span>`).join(" ")}<br><br>` +
      `<strong>${diseases.length} diseases</strong> in this pathway:<br>` +
      diseases.map(d => `<div class="chat-finding"><i class="ti ti-circle-check"></i> ${d.name} (${d.area})</div>`).join("");
    result.followUps = ["Tell me about atopic dermatitis", "How does Dupixent work?", "What connects these diseases?"];
    return result;
  }

  if (q.includes("il-23") || q.includes("th17") || q.includes("il-17")) {
    const pw = PATHWAYS["il23th17"];
    const diseases = getDiseasesByPathway("il23th17");
    result.html = `<strong>IL-23/Th17 Pathway</strong><br>${pw.description}<br><br>` +
      `<strong>Key cytokines:</strong> ${pw.cytokines.map(c => `<span class="chat-tag">${c}</span>`).join(" ")}<br><br>` +
      `<strong>${diseases.length} diseases</strong>:<br>` +
      diseases.map(d => `<div class="chat-finding"><i class="ti ti-circle-check"></i> ${d.name} (${d.area})</div>`).join("");
    result.followUps = ["Tell me about psoriasis", "How are psoriasis and IBD connected?"];
    return result;
  }

  if (q.includes("il-6") || q.includes("jak") || q.includes("jak-stat")) {
    const pw = PATHWAYS["il6jak"];
    const diseases = getDiseasesByPathway("il6jak");
    result.html = `<strong>IL-6/JAK-STAT Pathway</strong><br>${pw.description}<br><br>` +
      `<strong>Key cytokines:</strong> ${pw.cytokines.map(c => `<span class="chat-tag">${c}</span>`).join(" ")}<br><br>` +
      `<strong>${diseases.length} disease(s):</strong><br>` +
      diseases.map(d => `<div class="chat-finding"><i class="ti ti-circle-check"></i> ${d.name} (${d.area})</div>`).join("");
    result.followUps = ["Tell me about rheumatoid arthritis", "What is Kevzara?"];
    return result;
  }

  // Competitive landscape questions
  if (q.includes("competitor") || q.includes("competitive") || q.includes("versus") || q.includes(" vs ") ||
      q.includes("head to head") || q.includes("head-to-head") || q.includes("compare") ||
      q.includes("adbry") || q.includes("tralokinumab") || q.includes("ebglyss") || q.includes("lebrikizumab") ||
      q.includes("nemluvio") || q.includes("nemolizumab") || q.includes("rinvoq") || q.includes("upadacitinib") ||
      q.includes("cibinqo") || q.includes("abrocitinib") || q.includes("opzelura") || q.includes("ruxolitinib") ||
      q.includes("nucala") || q.includes("mepolizumab") || q.includes("xolair") || q.includes("omalizumab") ||
      q.includes("fasenra") || q.includes("benralizumab") || q.includes("tezspire") || q.includes("tezepelumab")) {

    if (diseaseMatch && diseaseMatch.competitivePosition) {
      result.html = `<strong>${diseaseMatch.name} — Competitive Landscape</strong><br><br>` +
        diseaseMatch.treatmentLandscape.map(t =>
          `<strong>${t.category}:</strong><br>` + t.agents.map(a =>
            `<div class="chat-finding"><i class="ti ti-${a.startsWith("★") ? "star-filled" : "pill"}"></i> ${a.replace("★ ", "")}</div>`
          ).join("")
        ).join("<br>") +
        `<br><br><div style="background:var(--accent-light);padding:10px 12px;border-radius:8px;font-size:12px"><strong style="color:var(--accent)">Sanofi Positioning:</strong> ${diseaseMatch.competitivePosition}</div>`;
      result.followUps = [`What treats ${diseaseMatch.abbrev}?`, `What connects ${diseaseMatch.abbrev} to other diseases?`, "Dupixent cross-disease platform"];
      result.openDisease = diseaseMatch.id;
      return result;
    }

    const dupixentDiseases = DISEASES.filter(d => d.competitivePosition);
    result.html = `<strong>Dupixent Competitive Landscape</strong><br><br>` +
      `Dupixent competes across <strong>${dupixentDiseases.length} indications</strong>, facing different competitors in each:<br><br>` +
      `<div class="chat-finding"><i class="ti ti-shield-check"></i> <strong>AD:</strong> Adbry (IL-13), Ebglyss (IL-13), Rinvoq & Cibinqo (JAK inhibitors)</div>` +
      `<div class="chat-finding"><i class="ti ti-shield-check"></i> <strong>Asthma:</strong> Nucala (IL-5), Fasenra (IL-5Rα), Tezspire (TSLP), Xolair (IgE)</div>` +
      `<div class="chat-finding"><i class="ti ti-shield-check"></i> <strong>CRSwNP:</strong> Xolair (IgE), Nucala (IL-5)</div>` +
      `<div class="chat-finding"><i class="ti ti-shield-check"></i> <strong>COPD:</strong> First-mover advantage — no approved biologic competitors yet</div>` +
      `<br><div style="background:var(--accent-light);padding:10px 12px;border-radius:8px;font-size:12px"><strong style="color:var(--accent)">Key differentiator:</strong> Dupixent is the only biologic blocking both IL-4 and IL-13 via the shared IL-4Rα receptor — addressing the broadest type 2 biology across all indications. JAK inhibitors offer rapid onset but carry boxed safety warnings (MACE, malignancy, thrombosis).</div>`;
    result.followUps = ["AD competitive landscape", "Asthma competitive landscape", "What diseases does Dupixent treat?"];
    return result;
  }

  // Dupixent / treatment questions
  if (q.includes("dupixent") || q.includes("dupilumab")) {
    const dupixentDiseases = DISEASES.filter(d => d.sanofiRole.includes("Dupixent") || d.sanofiRole.includes("dupilumab"));
    result.html = `<strong>Dupixent (dupilumab)</strong> targets IL-4Rα, blocking both IL-4 and IL-13 — key drivers of type 2 inflammation.<br><br>` +
      `<strong>Approved / in development for ${dupixentDiseases.length} conditions:</strong><br>` +
      dupixentDiseases.map(d => `<div class="chat-finding"><i class="ti ti-circle-check"></i> <strong>${d.name}</strong> — ${d.area}</div>`).join("") +
      `<br>This cross-disease platform approach makes Dupixent a cornerstone of Sanofi's immunology portfolio.`;
    result.followUps = ["Tell me about the atopic march", "How does type 2 inflammation work?", "What about Kevzara?"];
    return result;
  }

  if (q.includes("kevzara") || q.includes("sarilumab")) {
    const ra = getDiseaseById("ra");
    result.html = `<strong>Kevzara (sarilumab)</strong> — IL-6 receptor antagonist for moderate-to-severe RA.<br><br>${ra.sanofiRole}<br><br>` +
      `<strong>Key biomarkers:</strong> ${ra.keyBiomarkers.map(b => `<span class="chat-tag">${b}</span>`).join(" ")}`;
    result.followUps = ["Tell me about rheumatoid arthritis", "How does the IL-6 pathway work?"];
    result.openDisease = "ra";
    return result;
  }

  // Treatment landscape
  if (diseaseMatch && (q.includes("treat") || q.includes("therap") || q.includes("drug") || q.includes("medication"))) {
    result.html = `<strong>${diseaseMatch.name} Treatment Landscape</strong><br><br>` +
      diseaseMatch.treatmentLandscape.map(t =>
        `<strong>${t.category}:</strong><br>` + t.agents.map(a => `<div class="chat-finding"><i class="ti ti-pill"></i> ${a}</div>`).join("")
      ).join("<br>") +
      `<br><br><strong>Sanofi:</strong> ${diseaseMatch.sanofiRole}`;
    result.followUps = [`What connects ${diseaseMatch.abbrev} to other diseases?`, `What biomarkers track ${diseaseMatch.abbrev}?`];
    result.openDisease = diseaseMatch.id;
    return result;
  }

  // Biomarker questions
  if (diseaseMatch && (q.includes("biomarker") || q.includes("diagnos") || q.includes("test") || q.includes("measure"))) {
    result.html = `<strong>${diseaseMatch.name} Biomarkers</strong><br><br>` +
      `<strong>Key markers:</strong> ${diseaseMatch.keyBiomarkers.map(b => `<span class="chat-tag">${b}</span>`).join(" ")}<br><br>` +
      `<strong>Pathophysiology:</strong> ${diseaseMatch.pathophysiology}`;
    result.followUps = [`What treats ${diseaseMatch.abbrev}?`, `What connects ${diseaseMatch.abbrev} to other diseases?`];
    result.openDisease = diseaseMatch.id;
    return result;
  }

  // General disease info
  if (diseaseMatch) {
    result.html = `<strong>${diseaseMatch.name}</strong> (${diseaseMatch.area})<br><br>` +
      `<strong>Prevalence:</strong> ${diseaseMatch.prevalence}<br><br>` +
      `${diseaseMatch.burden}<br><br>` +
      `<strong>Pathway:</strong> <span class="chat-tag">${getPathway(diseaseMatch.pathways[0]).name}</span><br>` +
      `<strong>Connections:</strong> ${getConnectedDiseases(diseaseMatch.id).map(c => c.name).join(", ")}<br><br>` +
      `<strong>Sanofi:</strong> ${diseaseMatch.sanofiRole}`;
    result.followUps = [`What treats ${diseaseMatch.abbrev}?`, `What connects ${diseaseMatch.abbrev} to other diseases?`, `${diseaseMatch.abbrev} biomarkers`];
    result.openDisease = diseaseMatch.id;
    return result;
  }

  // Atopic march
  if (q.includes("atopic march") || q.includes("march")) {
    result.html = `The <strong>atopic march</strong> describes the progression of atopic diseases from infancy through adulthood:<br><br>` +
      `<div class="chat-finding"><i class="ti ti-arrow-right"></i> <strong>AD</strong> (infancy) → <strong>Asthma</strong> (childhood) → <strong>Allergic rhinitis/CRSwNP</strong> → <strong>EoE</strong></div><br>` +
      `All are driven by <span class="chat-tag">Type 2 Inflammation</span> (IL-4/IL-13). Dupixent's cross-disease efficacy targets this shared biology — intervening early may modify disease progression.`;
    result.followUps = ["Tell me about atopic dermatitis", "What is type 2 inflammation?", "What diseases does Dupixent treat?"];
    return result;
  }

  // Pathway list
  if (q.includes("pathway") || q.includes("how many")) {
    result.html = `The Disease Navigator tracks <strong>3 inflammatory pathways</strong> across <strong>${DISEASES.length} diseases</strong>:<br><br>` +
      Object.values(PATHWAYS).map(p => {
        const count = getDiseasesByPathway(p.id).length;
        return `<div class="chat-finding"><i class="ti ti-circle-check"></i> <strong>${p.name}</strong> — ${count} disease${count !== 1 ? "s" : ""}</div>`;
      }).join("") +
      `<br>Each pathway has distinct cytokine targets and therapeutic approaches.`;
    result.followUps = ["What is type 2 inflammation?", "Show me the IL-23 pathway", "What about IL-6?"];
    return result;
  }

  // Sanofi portfolio
  if (q.includes("sanofi") || q.includes("portfolio")) {
    const dupCount = DISEASES.filter(d => d.sanofiRole.includes("Dupixent")).length;
    result.html = `<strong>Sanofi Immunology Portfolio</strong><br><br>` +
      `<div class="chat-finding"><i class="ti ti-star-filled"></i> <strong>Dupixent (dupilumab)</strong> — IL-4Rα blockade across ${dupCount} type 2 conditions</div>` +
      `<div class="chat-finding"><i class="ti ti-star-filled"></i> <strong>Kevzara (sarilumab)</strong> — IL-6R antagonist for RA</div><br>` +
      `Dupixent's platform approach — one mechanism across multiple diseases — is unique in immunology.`;
    result.followUps = ["What diseases does Dupixent treat?", "Tell me about Kevzara", "What is the atopic march?"];
    return result;
  }

  // Fallback — try live PubMed search
  result.html = null;
  result.liveSearch = q;
  result.followUps = ["What is type 2 inflammation?", "Tell me about atopic dermatitis", "What diseases does Dupixent treat?"];
  return result;
}

async function searchPubMedLive(query, max = 5) {
  const terms = query.replace(/\b(what|how|is|are|the|can|tell|me|about|give|show|for|on|in|of|with|and|or|please|any)\b/gi, "").replace(/[?!.,]/g, "").replace(/\s+/g, " ").trim();
  const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(terms)}&retmax=${max}&sort=relevance&retmode=json`);
  const searchData = await searchRes.json();
  const ids = searchData.esearchresult?.idlist || [];
  if (!ids.length) return [];
  const sumRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`);
  const sumData = await sumRes.json();
  return ids.map(id => {
    const item = sumData.result?.[id];
    if (!item) return null;
    return {
      pmid: item.uid,
      title: item.title || "Untitled",
      authors: (item.authors || []).slice(0, 3).map(a => a.name).join(", ") + (item.authors?.length > 3 ? " et al." : ""),
      journal: item.fulljournalname || item.source || "",
      year: (item.pubdate || "").match(/\d{4}/)?.[0] || "",
    };
  }).filter(Boolean);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

init();
