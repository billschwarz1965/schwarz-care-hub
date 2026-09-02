import { generateResponse, suggestedPrompts } from "./rag-engine.js";
import { speak, speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";
import { broadcastSignal } from "./orion-bridge.js";

const messagesEl = document.getElementById("messages");
const welcomeEl = document.getElementById("welcome");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("send-btn");
const promptsGrid = document.getElementById("prompts-grid");
const signalsContainer = document.getElementById("signals-container");
const headerHome = document.getElementById("header-home");
const newChatBtn = document.getElementById("new-chat-btn");

let signalCount = 0;
let topicsSet = new Set();
let depthScores = [];
let highestPriority = null;
let activeSignalFilter = null;

const depthMap = { "Light engagement": 1, "Moderate engagement": 2, "Deep engagement": 3, "Deep engagement — cross-TA query": 4, "Deep engagement — cross-TA": 4, "High-value engagement": 4 };
const priorityOrder = ["Low", "Standard", "Standard", "PRIORITY"];

// Navigation: reset chat
function resetChat() {
  const chatMessages = messagesEl.querySelectorAll(".msg");
  chatMessages.forEach(m => m.remove());

  if (welcomeEl) welcomeEl.style.display = "";

  signalCount = 0;
  topicsSet = new Set();
  depthScores = [];
  highestPriority = null;

  document.getElementById("stat-signals").textContent = "0";
  document.getElementById("stat-topics").textContent = "0";
  document.getElementById("stat-depth").textContent = "—";
  document.getElementById("stat-priority").textContent = "—";

  signalsContainer.innerHTML = `<div class="sidebar-empty"><i class="ti ti-radar-2"></i>No signals yet. Ask a question to generate behavioral intelligence for medical insights and analytics.</div>`;

  activeSignalFilter = null;
  document.querySelectorAll(".signal-stat").forEach(s => s.classList.remove("active"));

  newChatBtn.classList.remove("visible");
  inputEl.value = "";
  inputEl.style.height = "auto";
  sendBtn.disabled = true;
  inputEl.focus();
}

headerHome.addEventListener("click", (e) => {
  e.preventDefault();
  resetChat();
});

newChatBtn.addEventListener("click", () => resetChat());

// Render suggested prompts in main panel
suggestedPrompts.forEach(p => {
  const card = document.createElement("div");
  card.className = "prompt-card";
  card.innerHTML = `<i class="ti ti-${p.icon}"></i><span>${p.short}</span>`;
  card.addEventListener("click", () => submitQuery(p.text));
  promptsGrid.appendChild(card);
});

// Render sidebar suggestion chips
const sidebarSuggestions = document.getElementById("sidebar-suggestions");
if (sidebarSuggestions) {
  suggestedPrompts.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "sidebar-suggestion";
    btn.textContent = p.short;
    btn.addEventListener("click", () => submitQuery(p.text));
    sidebarSuggestions.appendChild(btn);
  });
}

// Sidebar clear button
const sidebarClearBtn = document.getElementById("sidebar-clear-btn");
if (sidebarClearBtn) sidebarClearBtn.addEventListener("click", () => resetChat());

// Sidebar input
const sidebarInput = document.getElementById("sidebar-input");
const sidebarSendBtn = document.getElementById("sidebar-send");
if (sidebarInput && sidebarSendBtn) {
  sidebarSendBtn.addEventListener("click", () => {
    const text = sidebarInput.value.trim();
    if (text) { sidebarInput.value = ""; sidebarSendBtn.disabled = true; submitQuery(text); }
  });
  sidebarInput.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); const text = sidebarInput.value.trim(); if (text) { sidebarInput.value = ""; sidebarSendBtn.disabled = true; submitQuery(text); } }
  });
  sidebarInput.addEventListener("input", () => { sidebarSendBtn.disabled = !sidebarInput.value.trim(); });
}

// Input handling
inputEl.addEventListener("input", () => {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
  sendBtn.disabled = !inputEl.value.trim();
});

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (inputEl.value.trim()) submitQuery(inputEl.value.trim());
  }
});

sendBtn.addEventListener("click", () => {
  if (inputEl.value.trim()) submitQuery(inputEl.value.trim());
});

async function submitQuery(query) {
  // Hide welcome, show new chat button
  if (welcomeEl) welcomeEl.style.display = "none";
  newChatBtn.classList.add("visible");

  // Add user message
  addMessage("user", query);

  // Clear input
  inputEl.value = "";
  inputEl.style.height = "auto";
  sendBtn.disabled = true;

  // Show typing indicator
  const typingEl = addTypingIndicator();

  // Simulate RAG latency
  await delay(800 + Math.random() * 1200);

  // Generate response
  const result = generateResponse(query);

  // Remove typing
  typingEl.remove();

  // Add AI response
  addAIMessage(result);

  // Add interaction signal
  if (result.signal) {
    addOrionSignal(result.signal);
    broadcastSignal({ ...result.signal, _source: "MSL Copilot" });
  }

  scrollToBottom();
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg msg-${role}`;
  if (role === "user") {
    div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
  }
  messagesEl.appendChild(div);
  scrollToBottom();
  return div;
}

function addAIMessage(result) {
  const div = document.createElement("div");
  div.className = "msg msg-ai";

  const rendered = renderMarkdown(result.answer);
  const citationsHtml = result.citations.length > 0
    ? `<div class="citations-panel">${result.citations.map((c, i) => `
        <div class="citation-card">
          <div class="citation-num">${i + 1}</div>
          <div class="citation-info">
            <div class="citation-title">${escapeHtml(c.title)}</div>
            <div class="citation-meta">
              ${escapeHtml(c.source)} · ${escapeHtml(c.date)}
              <span class="citation-type">${escapeHtml(c.sourceType)}</span>
            </div>
          </div>
        </div>`).join("")}</div>`
    : "";

  const followUpsHtml = result.followUps && result.followUps.length > 0
    ? `<div class="follow-ups">${result.followUps.map(f =>
        `<button class="follow-up-chip">${escapeHtml(f)}</button>`
      ).join("")}</div>`
    : "";

  div.innerHTML = `
    <div class="msg-ai-avatar"><i class="ti ti-brain"></i></div>
    <div class="msg-ai-content">
      <div class="msg-ai-text rendered">${rendered}</div>
      ${citationsHtml}
      ${followUpsHtml}
    </div>`;

  div.querySelectorAll(".follow-up-chip").forEach(btn => {
    btn.addEventListener("click", () => submitQuery(btn.textContent));
  });

  messagesEl.appendChild(div);
  scrollToBottom();
}

function addTypingIndicator() {
  const div = document.createElement("div");
  div.className = "msg msg-ai";
  div.innerHTML = `
    <div class="msg-ai-avatar"><i class="ti ti-brain"></i></div>
    <div class="msg-ai-content">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>`;
  messagesEl.appendChild(div);
  scrollToBottom();
  return div;
}

function addOrionSignal(signal) {
  // Remove empty state
  const emptyEl = signalsContainer.querySelector(".sidebar-empty");
  if (emptyEl) emptyEl.remove();

  signalCount++;
  topicsSet.add(signal.diseaseArea);
  const dScore = depthMap[signal.depth] || 2;
  depthScores.push(dScore);

  if (signal.orionAction.startsWith("PRIORITY")) {
    highestPriority = "HIGH";
  } else if (!highestPriority && signal.depth.includes("Deep")) {
    highestPriority = "MED";
  }

  // Update stats
  document.getElementById("stat-signals").textContent = signalCount;
  document.getElementById("stat-topics").textContent = topicsSet.size;
  const avgDepth = depthScores.reduce((a, b) => a + b, 0) / depthScores.length;
  document.getElementById("stat-depth").textContent = avgDepth >= 3 ? "Deep" : avgDepth >= 2 ? "Med" : "Light";
  document.getElementById("stat-priority").textContent = highestPriority || "Low";

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const card = document.createElement("div");
  card.className = "signal-card";
  card.dataset.disease = signal.diseaseArea;
  card.dataset.depth = signal.depth;
  card.dataset.priority = signal.orionAction.startsWith("PRIORITY") ? "high" : signal.depth.includes("Deep") ? "med" : "low";
  card.innerHTML = `
    <div class="signal-header">
      <div class="signal-dot"></div>
      <span class="signal-time">${timeStr}</span>
    </div>
    <div class="signal-topic">${escapeHtml(signal.topic)}</div>
    <div class="signal-row"><span class="signal-label">Intent</span><span class="signal-value">${escapeHtml(signal.intent)}</span></div>
    <div class="signal-row"><span class="signal-label">Disease</span><span class="signal-value">${escapeHtml(signal.diseaseArea)}</span></div>
    <div class="signal-row"><span class="signal-label">Stage</span><span class="signal-value">${escapeHtml(signal.stage)}</span></div>
    <div class="signal-row"><span class="signal-label">Depth</span><span class="signal-value">${escapeHtml(signal.depth)}</span></div>
    <div class="signal-action">
      <i class="ti ti-arrow-right"></i>
      <span>${escapeHtml(signal.orionAction)}</span>
    </div>`;

  signalsContainer.insertBefore(card, signalsContainer.firstChild);
  if (activeSignalFilter) applySignalFilter(activeSignalFilter);
}

function renderMarkdown(text) {
  let html = escapeHtml(text);

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Citation references [1], [2], etc.
  html = html.replace(/\[(\d+)\]/g, '<span class="cite-ref" title="See citation $1">$1</span>');

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");

  // Tables
  html = html.replace(/\n(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/g, (match, headerRow, sepRow, bodyRows) => {
    const headers = headerRow.split("|").filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join("");
    const rows = bodyRows.trim().split("\n").map(row => {
      const cells = row.split("|").filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("");
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Paragraphs
  html = html.split("\n\n").map(block => {
    if (block.startsWith("<h3>") || block.startsWith("<ul>") || block.startsWith("<table>") || block.startsWith("<ol>")) {
      return block;
    }
    return `<p>${block}</p>`;
  }).join("\n");

  // Clean up stray newlines in paragraphs
  html = html.replace(/<p>\n/g, "<p>");
  html = html.replace(/\n<\/p>/g, "</p>");

  return html;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === AUTO-DEMOS ===
const demoBtn = document.getElementById("run-clinical-demo");
const topicDemoBtn = document.getElementById("run-topic-demo");
let demoRunning = false;

if (demoBtn) demoBtn.addEventListener("click", runClinicalDemo);
if (topicDemoBtn) topicDemoBtn.addEventListener("click", runTopicDemo);

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

function setDemoBtnsDisabled(disabled) {
  if (demoBtn) { demoBtn.disabled = disabled; }
  if (topicDemoBtn) { topicDemoBtn.disabled = disabled; }
}

async function typeIntoInput(text) {
  inputEl.value = "";
  inputEl.style.height = "auto";
  for (let i = 0; i < text.length; i++) {
    inputEl.value += text[i];
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
    sendBtn.disabled = false;
    await delay(18 + Math.random() * 22);
  }
}

async function runClinicalDemo() {
  if (demoRunning) return;
  demoRunning = true;
  setDemoBtnsDisabled(true);
  demoBtn.innerHTML = '<i class="ti ti-loader-2" style="font-size:13px;animation:spin 1s linear infinite"></i> Running…';

  resetChat();
  await delay(600);

  await narrate("Medical Concierge demo — AI-powered clinical question answering with citations");

  const question1 = "What are my options for a 45-year-old patient with moderate-to-severe atopic dermatitis who failed topicals?";
  await narrate("An HCP asks about treatment options for moderate-to-severe atopic dermatitis");
  await typeIntoInput(question1);
  await delay(400);
  await submitQuery(question1);
  await narrate("The AI retrieves cited answers from Sanofi medical content and generates an interaction signal");

  const question2 = "How does dupilumab compare to abrocitinib in head-to-head data?";
  await narrate("Follow-up: comparing dupilumab versus abrocitinib in head-to-head trials");
  await typeIntoInput(question2);
  await delay(400);
  await submitQuery(question2);
  await narrate("Each response includes source citations and contributes to engagement intelligence");

  const question3 = "Explain type 2 inflammation and how it connects multiple diseases";
  await narrate("Cross-therapeutic area question — type 2 inflammation across disease states");
  await typeIntoInput(question3);
  await delay(400);
  await submitQuery(question3);
  await narrate("MedVerse connects knowledge across atopic dermatitis, asthma, and other type 2 diseases");

  narrateOff();
  demoRunning = false;
  setDemoBtnsDisabled(false);
  demoBtn.innerHTML = '<i class="ti ti-player-play" style="font-size:13px"></i> Demo';
}

async function runTopicDemo() {
  if (demoRunning) return;
  demoRunning = true;
  setDemoBtnsDisabled(true);
  topicDemoBtn.innerHTML = '<i class="ti ti-loader-2 ti-spin"></i> Running…';

  resetChat();
  await delay(600);

  const promptCards = Array.from(promptsGrid.querySelectorAll(".prompt-card"));
  const topicsToDemo = [0, 1, 2];

  await narrate("One-click topic queries — HCPs explore Sanofi medical content with a single tap");

  for (let idx = 0; idx < topicsToDemo.length; idx++) {
    const cardIdx = topicsToDemo[idx];
    const card = promptCards[cardIdx];
    if (!card) continue;

    if (welcomeEl && welcomeEl.style.display === "none") {
      await narrate("Resetting for the next topic query");
      resetChat();
      await delay(800);
    }

    const label = card.querySelector("span")?.textContent || "";
    await narrate(`Topic ${idx + 1} of ${topicsToDemo.length}: "${label}" — highlighting the card`);
    card.classList.add("demo-highlight");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    await delay(800);

    await narrate(`Clicking "${label}" — query sent instantly, no typing needed`);
    card.classList.remove("demo-highlight");
    card.click();
    await delay(3000);

    await narrate("AI response with citations and interaction signal generated simultaneously");

    const followUps = messagesEl.querySelectorAll(".follow-up-chip");
    if (followUps.length > 0 && idx < topicsToDemo.length - 1) {
      await narrate("Follow-up suggestions let HCPs dive deeper with one more click");
      followUps[0].scrollIntoView({ behavior: "smooth", block: "center" });
      await delay(1000);
    }
  }

  await narrate("Every interaction generates behavioral intelligence for medical insights and analytics");
  const sidebar = document.querySelector(".sidebar-content");
  if (sidebar) sidebar.scrollTo({ top: 0, behavior: "smooth" });
  await delay(1500);

  narrateOff();
  demoRunning = false;
  setDemoBtnsDisabled(false);
  topicDemoBtn.innerHTML = '<i class="ti ti-player-play"></i> One-click topics demo';
}

// === SIGNAL STAT FILTERS ===
document.getElementById("signal-stats").addEventListener("click", (e) => {
  const tile = e.target.closest(".signal-stat");
  if (!tile) return;
  const filter = tile.dataset.filter;

  if (activeSignalFilter === filter || filter === "all") {
    activeSignalFilter = null;
    document.querySelectorAll(".signal-stat").forEach(s => s.classList.remove("active"));
    applySignalFilter(null);
  } else {
    activeSignalFilter = filter;
    document.querySelectorAll(".signal-stat").forEach(s => s.classList.remove("active"));
    tile.classList.add("active");
    applySignalFilter(filter);
  }
});

function applySignalFilter(filter) {
  const cards = signalsContainer.querySelectorAll(".signal-card");
  const seenTopics = new Set();

  cards.forEach(card => {
    card.classList.remove("filtered-out");

    if (!filter) return;

    if (filter === "topics") {
      const disease = card.dataset.disease;
      if (seenTopics.has(disease)) {
        card.classList.add("filtered-out");
      } else {
        seenTopics.add(disease);
      }
    } else if (filter === "deep") {
      if (!card.dataset.depth.includes("Deep") && !card.dataset.depth.includes("High")) {
        card.classList.add("filtered-out");
      }
    } else if (filter === "priority") {
      if (card.dataset.priority !== "high") {
        card.classList.add("filtered-out");
      }
    }
  });
}
