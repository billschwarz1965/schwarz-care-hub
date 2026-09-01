import { CONGRESSES, PRESENTATIONS, getCongressById, getPresentationsByCongressId, getCongressStats } from "./congress-data.js";
import { speak, speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";
import { matchesDiseaseArea } from "./taxonomy.js";

const stats = getCongressStats();
let activeCongressId = null;
let activeFilter = "all";
let activeChip = null;

function init() {
  renderStats();
  renderTimeline();
  renderHighlights();
  renderPresentations();
  bindFilters();
  bindStatChips();
  bindPosterOverlay();
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
      activeChip = null;
      activeFilter = "all";
      document.querySelectorAll(".pres-filter").forEach(b => b.classList.remove("active"));
      const allBtn = document.querySelector('.pres-filter[data-filter="all"]');
      if (allBtn) allBtn.classList.add("active");
      const row = document.getElementById("stats-row");
      if (row) row.querySelectorAll(".stat-chip").forEach(c => c.classList.remove("chip-active"));
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
    <div class="highlight-card" data-pres-id="${p.id}">
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

  container.querySelectorAll(".highlight-card").forEach(card => {
    card.addEventListener("click", () => openPoster(card.dataset.presId));
  });
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

  let headingLabel = activeCongressId ? getCongressById(activeCongressId)?.abbrev : "All Congresses";
  if (activeChip === "sanofi") headingLabel = "Sanofi Data";
  else if (activeChip === "high-impact") headingLabel = "High Impact";
  else if (activeChip === "congresses") headingLabel = "All Congresses";
  else if (activeChip === "presentations") headingLabel = "All Presentations";
  else if (activeChip === "diseases") headingLabel = "By Disease Area";

  document.getElementById("pres-heading").textContent = headingLabel;
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

  container.querySelectorAll(".pres-card").forEach(card => {
    card.addEventListener("click", () => openPoster(card.dataset.id));
  });
}

function bindFilters() {
  document.querySelectorAll(".pres-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pres-filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;

      // Sync chip state
      activeChip = activeFilter === "sanofi" ? "sanofi" : activeFilter === "high-impact" ? "high-impact" : null;
      const row = document.getElementById("stats-row");
      if (row) {
        row.querySelectorAll(".stat-chip").forEach(c => c.classList.remove("chip-active"));
        if (activeChip) {
          const match = row.querySelector(`.stat-chip[data-chip="${activeChip}"]`);
          if (match) match.classList.add("chip-active");
        }
      }

      renderPresentations();
    });
  });
}

function bindStatChips() {
  const row = document.getElementById("stats-row");
  if (!row) return;

  row.addEventListener("click", (e) => {
    const chip = e.target.closest(".stat-chip");
    if (!chip) return;
    const key = chip.dataset.chip;

    // Toggle: same chip clears, different chip activates
    if (activeChip === key) {
      activeChip = null;
      activeFilter = "all";
      activeCongressId = null;
    } else {
      activeChip = key;
      activeCongressId = null;

      if (key === "sanofi") {
        activeFilter = "sanofi";
      } else if (key === "high-impact") {
        activeFilter = "high-impact";
      } else {
        activeFilter = "all";
      }
    }

    // Update chip visual states
    row.querySelectorAll(".stat-chip").forEach(c => c.classList.remove("chip-active"));
    if (activeChip) chip.classList.add("chip-active");

    // Sync filter buttons
    document.querySelectorAll(".pres-filter").forEach(b => b.classList.remove("active"));
    const matchingFilter = document.querySelector(`.pres-filter[data-filter="${activeFilter}"]`);
    if (matchingFilter) matchingFilter.classList.add("active");

    renderTimeline();
    renderHighlights();
    renderPresentations();

    // Scroll to relevant section
    const target = key === "congresses"
      ? document.getElementById("congress-timeline")
      : document.getElementById("presentations-list");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function openPoster(presId) {
  const p = PRESENTATIONS.find(pr => pr.id === presId);
  if (!p) return;
  const congress = getCongressById(p.congressId);
  const modal = document.getElementById("poster-modal");

  modal.innerHTML = `
    <div class="poster-banner" style="background: linear-gradient(135deg, ${congress.color}, ${congress.color}cc);">
      <button class="poster-banner-close" id="poster-close"><i class="ti ti-x"></i></button>
      <div class="poster-banner-badges">
        <span class="poster-badge">${esc(p.type)}</span>
        ${p.sanofiData ? '<span class="poster-badge sanofi">Sanofi data</span>' : ""}
        ${p.impact === "high" ? '<span class="poster-badge impact">High impact</span>' : ""}
      </div>
      <div class="poster-title">${esc(p.title)}</div>
      <div class="poster-authors">${esc(p.authors)}</div>
      <div class="poster-congress-info">
        <span><i class="ti ti-calendar-event"></i> ${esc(congress.name)}</span>
        <span><i class="ti ti-map-pin"></i> ${esc(congress.location)}</span>
        <span><i class="ti ti-calendar"></i> ${esc(congress.dates)}</span>
      </div>
    </div>
    <div class="poster-body">
      <div class="poster-section">
        <div class="poster-section-label"><i class="ti ti-file-text"></i> Abstract</div>
        <div class="poster-abstract">${esc(p.abstract)}</div>
      </div>
      <div class="poster-section">
        <div class="poster-section-label"><i class="ti ti-list-check"></i> Key Findings</div>
        <div class="poster-findings-grid">
          ${p.keyFindings.map(f => `<div class="poster-finding-item"><i class="ti ti-circle-check"></i> ${esc(f)}</div>`).join("")}
        </div>
      </div>
      <div class="poster-section">
        <div class="poster-msl-box">
          <div class="poster-section-label"><i class="ti ti-user-star"></i> MSL Talking Points — Internal Only</div>
          <div class="poster-msl-text">${esc(p.mslTalkingPoints)}</div>
        </div>
      </div>
      <div class="poster-footer">
        <span class="poster-footer-tag">${esc(p.diseaseArea)}</span>
        <span class="poster-footer-id">${esc(p.id)}</span>
      </div>
    </div>`;

  const overlay = document.getElementById("poster-overlay");
  overlay.classList.add("visible");
  overlay.scrollTop = 0;

  document.getElementById("poster-close").addEventListener("click", closePoster);
}

function closePoster() {
  document.getElementById("poster-overlay").classList.remove("visible");
}

function bindPosterOverlay() {
  const overlay = document.getElementById("poster-overlay");
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePoster();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePoster();
  });
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ─── CHAT ───

const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatSuggestions = document.getElementById("chat-suggestions");
const chatDemoBtn = document.getElementById("chatDemoBtn");
const chatClearBtn = document.getElementById("chatClearBtn");

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function resetChat() {
  chatMessages.innerHTML = `<div class="chat-msg ai">
    <div class="chat-ai-avatar"><i class="ti ti-calendar-event"></i></div>
    <div class="chat-bubble chat-ai-bubble">
      I'm the Congress Intelligence Agent. I track presentations across <strong>6 congresses</strong> — AAD, EADV, ATS, ACR, AAAAI, and DDW. Ask me about key findings, MSL talking points, or Sanofi data from any congress.
    </div>
  </div>`;
  chatSuggestions.innerHTML = [
    "Key Dupixent data at AAD",
    "High-impact findings",
    "COPD data from ATS",
    "EoE evidence at DDW",
    "What's upcoming at EADV?"
  ].map(s => `<button class="chat-suggestion">${esc(s)}</button>`).join("");
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
  div.innerHTML = `<div class="chat-ai-avatar"><i class="ti ti-calendar-event"></i></div><div class="chat-bubble chat-ai-bubble">${html}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "chat-msg ai chat-typing-msg";
  div.innerHTML = `<div class="chat-ai-avatar"><i class="ti ti-calendar-event"></i></div><div class="chat-bubble chat-ai-bubble"><span class="chat-typing"><span></span><span></span><span></span></span></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function generateResponse(query) {
  const q = query.toLowerCase();

  // Congress-specific queries
  const congressMatch = CONGRESSES.find(c => {
    const abbrevBase = c.abbrev.toLowerCase().replace(/\s*\d{4}$/, "");
    return q.includes(c.abbrev.toLowerCase()) || q.includes(abbrevBase) || q.includes(c.society.toLowerCase().split(" ")[0]);
  });

  // Disease-specific queries. Values are canonical taxonomy spellings and the
  // two filters below compare through matchesDiseaseArea, so this map stays
  // correct even though congress-data.js records "Type 2 Asthma" and "IBD".
  const diseaseMap = [
    [/atopic|eczema|dermatitis|\bad\b/, "Atopic Dermatitis"],
    [/copd|chronic obstructive/, "COPD"],
    [/asthma/, "Asthma"],
    [/eoe|eosinophilic esophag/, "Eosinophilic Esophagitis"],
    [/prurigo|pn\b/, "Prurigo Nodularis"],
    [/urticaria|csu\b/, "Chronic Spontaneous Urticaria"],
    [/crohn|ibd/, "Inflammatory Bowel Disease"],
    [/rheumatoid|ra\b/, "Rheumatoid Arthritis"],
    [/psoriasis/, "Psoriasis"],
    [/nasal poly|crswnp/, "CRSwNP"],
    [/cross.?ta|immunology|type.?2.*inflam/, "Cross-TA Immunology"],
  ];
  let diseaseMatch = null;
  for (const [re, area] of diseaseMap) {
    if (re.test(q)) { diseaseMatch = area; break; }
  }

  // Upcoming congress query
  if (q.includes("upcoming") || q.includes("expected") || q.includes("what's next")) {
    const upcoming = CONGRESSES.filter(c => c.status === "upcoming");
    if (upcoming.length) {
      const items = upcoming.map(c => `<strong>${esc(c.abbrev)}</strong> — ${esc(c.society)}<br>${esc(c.dates)} · ${esc(c.location)}<br><em>${esc(c.summary)}</em>`).join("<br><br>");
      return `Upcoming congresses on our radar:<br><br>${items}`;
    }
  }

  // High-impact query
  if (q.includes("high impact") || q.includes("high-impact") || q.includes("key findings") || q.includes("top findings")) {
    const highImpact = PRESENTATIONS.filter(p => p.impact === "high");
    const items = highImpact.slice(0, 5).map(p => {
      const c = getCongressById(p.congressId);
      return `<strong>${esc(c.abbrev)}</strong> · ${esc(p.type)}<br>${esc(p.title)}<br>→ ${esc(p.keyFindings[0])}`;
    }).join("<br><br>");
    return `<strong>${highImpact.length} high-impact presentations</strong> tracked across all congresses:<br><br>${items}`;
  }

  // Head-to-head query
  if (q.includes("head to head") || q.includes("head-to-head") || q.includes("h2h") || q.includes("compare") || q.includes("vs")) {
    const h2h = PRESENTATIONS.filter(p => /head.to.head|compar|versus|vs\./i.test(p.title));
    if (h2h.length) {
      const items = h2h.map(p => {
        const c = getCongressById(p.congressId);
        return `<strong>${esc(c.abbrev)}</strong> · ${esc(p.type)}<br>${esc(p.title)}<br>→ ${p.keyFindings.map(f => esc(f)).join("<br>→ ")}`;
      }).join("<br><br>");
      return `Head-to-head comparison data from congress presentations:<br><br>${items}`;
    }
  }

  // MSL talking points query
  if (q.includes("msl") || q.includes("talking point")) {
    let pool = PRESENTATIONS;
    if (diseaseMatch) pool = pool.filter(p => matchesDiseaseArea(p.diseaseArea, diseaseMatch));
    if (congressMatch) pool = pool.filter(p => p.congressId === congressMatch.id);
    const items = pool.slice(0, 4).map(p => {
      const c = getCongressById(p.congressId);
      return `<strong>${esc(p.title.slice(0, 60))}…</strong> (${esc(c.abbrev)})<br>💡 ${esc(p.mslTalkingPoints)}`;
    }).join("<br><br>");
    return `MSL talking points${diseaseMatch ? " for " + diseaseMatch : ""}:<br><br>${items}`;
  }

  // Sanofi data query
  if (q.includes("sanofi")) {
    let pool = PRESENTATIONS.filter(p => p.sanofiData);
    if (congressMatch) pool = pool.filter(p => p.congressId === congressMatch.id);
    const items = pool.slice(0, 5).map(p => {
      const c = getCongressById(p.congressId);
      return `★ <strong>${esc(c.abbrev)}</strong> · ${esc(p.type)}<br>${esc(p.title)}<br>→ ${esc(p.keyFindings[0])}`;
    }).join("<br><br>");
    return `<strong>${pool.length} Sanofi-sponsored presentations</strong>${congressMatch ? " at " + congressMatch.abbrev : ""}:<br><br>${items}`;
  }

  // Congress-specific match
  if (congressMatch) {
    const pres = getPresentationsByCongressId(congressMatch.id);
    if (!pres.length) {
      return `<strong>${esc(congressMatch.name)}</strong><br>${esc(congressMatch.dates)} · ${esc(congressMatch.location)}<br><br>${esc(congressMatch.summary)}<br><br>Presentation data is pending — this congress is ${congressMatch.status}.`;
    }
    const items = pres.slice(0, 4).map(p =>
      `${p.impact === "high" ? "🔥 " : ""}${p.sanofiData ? "★ " : ""}<strong>${esc(p.type)}</strong>: ${esc(p.title)}<br>→ ${esc(p.keyFindings[0])}`
    ).join("<br><br>");
    return `<strong>${esc(congressMatch.name)}</strong> — ${pres.length} tracked presentations:<br><br>${items}${pres.length > 4 ? `<br><br>Plus ${pres.length - 4} more presentations.` : ""}`;
  }

  // Disease-specific match
  if (diseaseMatch) {
    const pres = PRESENTATIONS.filter(p => matchesDiseaseArea(p.diseaseArea, diseaseMatch));
    if (pres.length) {
      const items = pres.slice(0, 4).map(p => {
        const c = getCongressById(p.congressId);
        return `<strong>${esc(c.abbrev)}</strong> · ${esc(p.type)}<br>${esc(p.title)}<br>→ ${esc(p.keyFindings[0])}`;
      }).join("<br><br>");
      return `<strong>${diseaseMatch}</strong> presentations across congresses (${pres.length} total):<br><br>${items}`;
    }
  }

  // Fallback
  return `I found <strong>${PRESENTATIONS.length} tracked presentations</strong> across <strong>${CONGRESSES.length} congresses</strong>. Try asking about:<br><br>• A specific congress (AAD, ATS, AAAAI, DDW)<br>• A disease area (AD, COPD, EoE, asthma)<br>• High-impact findings or MSL talking points<br>• Head-to-head comparison data<br>• Upcoming congresses`;
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
  const response = generateResponse(text);
  addAIMsg(response);

  // Follow-up suggestions based on query
  const q = text.toLowerCase();
  let followUps = [];
  if (q.includes("aad")) followUps = ["Head-to-head AD data", "MSL talking points for AD", "Sanofi data at AAD"];
  else if (q.includes("ats") || q.includes("copd")) followUps = ["COPD MSL talking points", "Unified airway data", "Sanofi respiratory data"];
  else if (q.includes("eoe") || q.includes("ddw")) followUps = ["EoE pediatric data", "Long-term EoE durability", "Real-world EoE evidence"];
  else if (q.includes("high impact")) followUps = ["MSL talking points", "Sanofi data highlights", "Head-to-head comparisons"];
  else followUps = ["High-impact findings", "Upcoming congresses", "Sanofi data across congresses"];

  chatSuggestions.innerHTML = followUps.map(s => `<button class="chat-suggestion">${esc(s)}</button>`).join("");
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

// Editions with no MSL or Medical Affairs persona (host page sets
// <body data-audience="hcp">) get every demo question asked by an HCP
// instead — asking as a role that doesn't exist in that build would be
// confusing, not illustrative.
const IS_HCP_ONLY_AUDIENCE = document.body.dataset.audience === "hcp";

const INTERNAL_CHAT_DEMO_SEQUENCE = [
  { persona: "MSL", css: "msl", question: "What were the key Dupixent presentations at AAD 2026?" },
  { persona: "Med Affairs", css: "med-affairs", question: "Tell me about the head-to-head comparison data" },
  { persona: "MSL", css: "msl", question: "What are the MSL talking points for COPD data?" },
  { persona: "Med Affairs", css: "med-affairs", question: "Summarize the high-impact findings across all congresses" },
  { persona: "MSL", css: "msl", question: "What EoE data was presented at DDW?" },
  { persona: "Med Affairs", css: "med-affairs", question: "What's upcoming at EADV 2026?" },
  { persona: "MSL", css: "msl", question: "What findings were reported for prurigo nodularis?" },
  { persona: "Med Affairs", css: "med-affairs", question: "What Sanofi data was presented at ATS 2026?" },
];

const HCP_CHAT_DEMO_SEQUENCE = [
  { persona: "HCP", css: "hcp", question: "What were the key Dupixent presentations at AAD 2026?" },
  { persona: "HCP", css: "hcp", question: "Tell me about the head-to-head comparison data" },
  { persona: "HCP", css: "hcp", question: "What was presented on Dupixent for COPD?" },
  { persona: "HCP", css: "hcp", question: "Summarize the high-impact findings across all congresses" },
  { persona: "HCP", css: "hcp", question: "What EoE data was presented at DDW?" },
  { persona: "HCP", css: "hcp", question: "What's upcoming at EADV 2026?" },
  { persona: "HCP", css: "hcp", question: "What findings were reported for prurigo nodularis?" },
  { persona: "HCP", css: "hcp", question: "What Sanofi data was presented at ATS 2026?" },
];

const CHAT_DEMO_SEQUENCE = IS_HCP_ONLY_AUDIENCE ? HCP_CHAT_DEMO_SEQUENCE : INTERNAL_CHAT_DEMO_SEQUENCE;

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
  await narrate(IS_HCP_ONLY_AUDIENCE
    ? "Congress Intelligence demo — AI answers HCP questions about medical congress data"
    : "Congress Intelligence demo — AI answers about medical congress data across personas");

  for (const step of CHAT_DEMO_SEQUENCE) {
    await narrate(step.persona + " asks about congress intelligence");
    await typeIntoChat(step.question);
    await delay(300);
    chatSuggestions.style.display = "none";
    addPersonaUserMsg(step.question, step.persona, step.css);
    chatInput.value = "";
    const typing = addTyping();
    await delay(1000 + Math.random() * 800);
    typing.remove();
    const response = generateResponse(step.question);
    addAIMsg(response);
    await narrate("AI surfaces findings from " + PRESENTATIONS.length + " presentations across " + CONGRESSES.length + " congresses");
  }

  addAIMsg(`<strong>Demo complete!</strong> ${CHAT_DEMO_SEQUENCE.length} questions answered across ${CONGRESSES.length} congresses and ${PRESENTATIONS.length} presentations. The Congress Intelligence Agent can surface key findings, MSL talking points, and competitive data from any tracked congress.`);

  narrateOff();
  chatDemoRunning = false;
  chatDemoBtn.disabled = false;
  chatDemoBtn.innerHTML = '<i class="ti ti-player-play" style="font-size:13px"></i> Demo';
}

function bindChatDemo() {
  if (chatDemoBtn) chatDemoBtn.addEventListener("click", runChatDemo);
}

// ─── FULL DEMO ───

let demoRunning = false;

function highlight(el) { if (el) el.style.outline = "2px solid #7a00e6"; }
function unhighlight(el) { if (el) el.style.outline = ""; }
function scrollSmooth(el) { if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }

async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;
  const btn = document.getElementById("run-demo");
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running...'; }

  const mainEl = document.querySelector(".main");
  if (mainEl) mainEl.scrollTo({ top: 0, behavior: "smooth" });
  activeCongressId = null;
  activeFilter = "all";
  activeChip = null;
  renderTimeline();
  renderHighlights();
  renderPresentations();
  await delay(500);

  // ACT 1: Overview stats
  await narrate("Congress Intelligence — tracking scientific data across 6 major medical congresses");
  const statsRow = document.getElementById("stats-row");
  highlight(statsRow);
  await delay(2500);
  await narrate("10 tracked presentations, 7 with Sanofi data, spanning 5 disease areas");
  unhighlight(statsRow);

  // ACT 2: Congress timeline
  await narrate("The congress timeline shows all tracked congresses — completed and upcoming");
  const timeline = document.getElementById("congress-timeline");
  scrollSmooth(timeline);
  await delay(1000);

  await narrate("Let's filter to AAD 2026 — the dermatology congress with the most Sanofi data");
  const aadCard = document.querySelector('.congress-card[data-id="aad-2026"]');
  if (aadCard) {
    highlight(aadCard);
    await delay(600);
    unhighlight(aadCard);
    aadCard.click();
    await delay(800);
  }
  await narrate("Filtered to AAD — highlights and presentations now show only dermatology congress data");

  // ACT 3: Highlights
  const highlightsGrid = document.getElementById("highlights");
  scrollSmooth(highlightsGrid);
  await delay(800);
  await narrate("High-impact highlights — late-breaker results and oral presentations at the top");
  const firstHighlight = highlightsGrid.querySelector(".highlight-card");
  if (firstHighlight) {
    highlight(firstHighlight);
    await delay(1500);
    unhighlight(firstHighlight);
  }

  // ACT 4: Poster drill-down
  await narrate("Click any presentation for the full poster view — abstract, findings, and MSL talking points");
  if (firstHighlight) {
    firstHighlight.click();
    await delay(1500);
    await narrate("The 5-year dupilumab open-label extension — high impact late-breaker with Sanofi data");
    await delay(2000);
    closePoster();
    await delay(500);
  }

  // ACT 5: Filter by Sanofi data
  await narrate("Filtering to Sanofi data only — see all presentations with company-sponsored results");
  const sanofiChip = document.querySelector('.stat-chip[data-chip="sanofi"]');
  if (sanofiChip) {
    scrollSmooth(sanofiChip);
    await delay(400);
    sanofiChip.click();
    await delay(800);
  }
  await narrate("Seven Sanofi presentations across dermatology, respiratory, rheumatology, and GI");

  // ACT 6: Switch to ATS
  await narrate("Switching to ATS 2026 — the respiratory congress");
  activeCongressId = null;
  activeChip = null;
  activeFilter = "all";
  document.querySelectorAll(".pres-filter").forEach(b => b.classList.remove("active"));
  const allFilterBtn = document.querySelector('.pres-filter[data-filter="all"]');
  if (allFilterBtn) allFilterBtn.classList.add("active");
  const row = document.getElementById("stats-row");
  if (row) row.querySelectorAll(".stat-chip").forEach(c => c.classList.remove("chip-active"));
  renderTimeline();
  renderHighlights();
  renderPresentations();
  await delay(300);

  const atsCard = document.querySelector('.congress-card[data-id="ats-2026"]');
  if (atsCard) {
    scrollSmooth(atsCard);
    await delay(400);
    atsCard.click();
    await delay(800);
  }
  await narrate("ATS respiratory data — COPD and asthma presentations with field-ready talking points");

  // ACT 7: High impact filter
  const presList = document.getElementById("presentations-list");
  scrollSmooth(presList);
  await delay(600);
  await narrate("Filtering to high-impact only — the presentations that matter most to MSL conversations");
  const hiFilterBtn = document.querySelector('.pres-filter[data-filter="high-impact"]');
  if (hiFilterBtn) {
    hiFilterBtn.click();
    await delay(800);
  }
  const firstPres = presList.querySelector(".pres-card");
  if (firstPres) {
    highlight(firstPres);
    await delay(1500);
    unhighlight(firstPres);
    firstPres.click();
    await delay(1500);
    await narrate("Full poster detail — every presentation includes MSL talking points for field conversations");
    await delay(1500);
    closePoster();
  }

  // ACT 8: Chat demo
  await narrate("The Congress AI agent answers questions across all 6 congresses");
  const chatPanel = document.querySelector(".chat-sidebar");
  if (chatPanel) scrollSmooth(chatPanel);
  await delay(600);

  resetChat();
  await delay(400);
  await typeIntoChat("What were the key Dupixent presentations at AAD 2026?");
  await delay(300);
  chatSuggestions.style.display = "none";
  addPersonaUserMsg("What were the key Dupixent presentations at AAD 2026?", "MSL", "msl");
  chatInput.value = "";
  const typing = addTyping();
  await delay(1200);
  typing.remove();
  const response = generateResponse("What were the key Dupixent presentations at AAD 2026?");
  addAIMsg(response);
  await delay(1000);
  await narrate("MSL asks about AAD Dupixent data — the agent surfaces presentations with key findings");

  // Reset and wrap up
  activeCongressId = null;
  activeChip = null;
  activeFilter = "all";
  document.querySelectorAll(".pres-filter").forEach(b => b.classList.remove("active"));
  if (allFilterBtn) allFilterBtn.classList.add("active");
  if (row) row.querySelectorAll(".stat-chip").forEach(c => c.classList.remove("chip-active"));
  renderTimeline();
  renderHighlights();
  renderPresentations();
  if (mainEl) mainEl.scrollTo({ top: 0, behavior: "smooth" });
  await delay(500);

  await narrate("Congress Intelligence — six congresses, ten presentations, field-ready insights for every MSL conversation");
  narrateOff();

  demoRunning = false;
  if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ti ti-player-play"></i> Play Demo'; }
}

function bindDemo() {
  const btn = document.getElementById("run-demo");
  if (btn) btn.addEventListener("click", runDemo);
}

init();
bindChat();
bindChatDemo();
bindDemo();

if (window.location.hash === "#autoplay") {
  window.location.hash = "";
  setTimeout(runDemo, 600);
}

// Hash-based deep linking: #congress=aad-2026 or #poster=P-001
(function handleHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const params = new URLSearchParams(hash);
  const congressId = params.get("congress");
  const posterId = params.get("poster");
  if (congressId) {
    activeCongressId = congressId;
    renderTimeline();
    renderHighlights();
    renderPresentations();
    const card = document.querySelector(`.congress-card[data-id="${congressId}"]`);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  if (posterId) {
    setTimeout(() => openPoster(posterId), 400);
  }
})();
