import { generateResponse, suggestedPrompts } from "./rag-engine.js";

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

  signalsContainer.innerHTML = `<div class="sidebar-empty"><i class="ti ti-radar-2"></i>No signals yet. Ask a question to generate behavioral intelligence for Orion.</div>`;

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

// Render suggested prompts
suggestedPrompts.forEach(p => {
  const card = document.createElement("div");
  card.className = "prompt-card";
  card.innerHTML = `<i class="ti ti-${p.icon}"></i><span>${p.short}</span>`;
  card.addEventListener("click", () => submitQuery(p.text));
  promptsGrid.appendChild(card);
});

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

  // Add Orion signal
  if (result.signal) {
    addOrionSignal(result.signal);
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

// === AUTO-DEMO ===
const demoBtn = document.getElementById("run-clinical-demo");
if (demoBtn) {
  demoBtn.addEventListener("click", runClinicalDemo);
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
  demoBtn.disabled = true;
  demoBtn.innerHTML = '<i class="ti ti-loader-2 ti-spin"></i> Running demo…';

  const question1 = "What are my options for a 45-year-old patient with moderate-to-severe atopic dermatitis who failed topicals?";
  await typeIntoInput(question1);
  await delay(400);
  await submitQuery(question1);
  await delay(2500);

  const question2 = "How does dupilumab compare to abrocitinib in head-to-head data?";
  await typeIntoInput(question2);
  await delay(400);
  await submitQuery(question2);
  await delay(2000);

  const question3 = "Explain type 2 inflammation and how it connects multiple diseases";
  await typeIntoInput(question3);
  await delay(400);
  await submitQuery(question3);
}
