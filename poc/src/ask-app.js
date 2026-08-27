// ─── Ask MedVerse results page ───
// Reads ?q= from the URL, routes it across every module this edition ships,
// and renders the answer plus deep links. Each edition's ask.html declares the
// pages it actually has via <body data-modules="...">.

import { askMedVerse, capabilityLink } from "./ask-router.js";

const EDU_ICON = { podcast: "microphone-2", video: "player-play", infographic: "chart-infographic", article: "file-text" };

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderMd(text) {
  let h = esc(text);
  h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/\*(.+?)\*/g, "<em>$1</em>");
  h = h.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  h = h.replace(/^- (.+)$/gm, "<li>$1</li>");
  h = h.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
  h = h.replace(/\[(\d+)\]/g, '<span class="cite-ref">$1</span>');

  // Markdown tables → real tables.
  h = h.replace(/((?:^\|.*\|\s*$\n?)+)/gm, (block) => {
    const rows = block.trim().split("\n").filter(r => r.trim().startsWith("|"));
    if (rows.length < 2) return block;
    const cells = (r) => r.split("|").slice(1, -1).map(c => c.trim());
    const head = cells(rows[0]);
    const body = rows.slice(2).map(cells);
    if (!body.length) return block;
    return `<table><thead><tr>${head.map(c => `<th>${c}</th>`).join("")}</tr></thead>` +
      `<tbody>${body.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  });

  return h.split(/\n{2,}/).map(p => /^<(h3|ul|table)/.test(p.trim()) ? p : `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
}

const availableModules = (document.body.dataset.modules || "")
  .split(",").map(s => s.trim()).filter(Boolean);

const params = new URLSearchParams(location.search);
const query = (params.get("q") || "").trim();

const input = document.getElementById("ask-input");
const form = document.getElementById("ask-form");
const results = document.getElementById("ask-results");
const queryEcho = document.getElementById("ask-query-echo");

if (input) input.value = query;

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    // Same tab on the results page itself — you're already here.
    location.search = "?q=" + encodeURIComponent(q);
  });
}

function render() {
  if (!query) {
    results.innerHTML = `<div class="ask-empty">
      <i class="ti ti-sparkles"></i>
      <h2>Ask MedVerse anything</h2>
      <p>One question, routed to whichever agents can answer it — clinical evidence, medical information, trials, congress data, literature, or your MSL.</p>
    </div>`;
    return;
  }

  if (queryEcho) queryEcho.textContent = query;
  document.title = `${query} — Ask MedVerse`;

  const r = askMedVerse(query, availableModules);

  const agentChips = r.agents.map(a => `
    <a class="ask-agent-card" href="${esc(capabilityLink(a, query))}">
      <div class="ask-agent-icon"><i class="ti ti-${esc(a.icon)}"></i></div>
      <div class="ask-agent-body">
        <div class="ask-agent-name">${esc(a.name)}</div>
        <div class="ask-agent-blurb">${esc(a.blurb)}</div>
      </div>
      <i class="ti ti-arrow-right ask-agent-go"></i>
    </a>`).join("");

  const citations = (r.answer.citations || []).length ? `
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-quote"></i> Sources</div>
      ${r.answer.citations.map((c, i) => `
        <div class="ask-citation">
          <div class="ask-citation-num">${i + 1}</div>
          <div>
            <div class="ask-citation-title">${esc(c.title)}</div>
            <div class="ask-citation-meta">${esc(c.source)} · ${esc(c.date)}<span class="ask-citation-type">${esc(c.sourceType)}</span></div>
          </div>
        </div>`).join("")}
    </div>` : "";

  const resources = (r.resources || []).length ? `
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-books"></i> Learning resources</div>
      ${r.resources.map(x => `
        <a class="ask-resource" href="${esc(x.url)}" target="_blank" rel="noopener">
          <div class="ask-resource-icon"><i class="ti ti-${EDU_ICON[x.contentType] || "file-text"}"></i></div>
          <div>
            <div class="ask-resource-title">${esc(x.title)}</div>
            <div class="ask-resource-meta"><span class="ask-resource-type">${esc(x.contentType)}</span> · ${esc(x.program)}${x.duration ? ` · ${esc(x.duration)}` : ""}</div>
          </div>
          <i class="ti ti-external-link ask-resource-go"></i>
        </a>`).join("")}
    </div>` : "";

  const hasAnswer = (r.answer.citations || []).length > 0;

  const answerBlock = `
    <div class="ask-answer-card">
      <div class="ask-answer-head">
        <div class="ask-answer-icon"><i class="ti ti-sparkles"></i></div>
        <div>
          <div class="ask-answer-title">${hasAnswer ? "Evidence-based answer" : "No indexed clinical evidence for this yet"}</div>
          <div class="ask-answer-sub">${hasAnswer ? "Drawn from governed Sanofi medical content" : "Try one of the agents below, or explore the learning resources"}</div>
        </div>
      </div>
      <div class="ask-answer-body rendered">${renderMd(r.answer.answer)}</div>
      ${citations}
    </div>`;

  const signalBlock = r.answer.signal ? `
    <div class="ask-signal">
      <div class="ask-signal-head"><span class="ask-signal-dot"></span> Interaction signal generated</div>
      <div class="ask-signal-row"><span>Topic</span><strong>${esc(r.answer.signal.topic)}</strong></div>
      <div class="ask-signal-row"><span>Intent</span><strong>${esc(r.answer.signal.intent)}</strong></div>
      <div class="ask-signal-row"><span>Disease area</span><strong>${esc(r.answer.signal.diseaseArea)}</strong></div>
      <div class="ask-signal-action"><i class="ti ti-arrow-right"></i> ${esc(r.answer.signal.orionAction)}</div>
    </div>` : "";

  results.innerHTML = `
    <div class="ask-layout">
      <div class="ask-main">
        ${answerBlock}
        ${resources}
      </div>
      <div class="ask-side">
        <div class="ask-section">
          <div class="ask-section-label"><i class="ti ti-route"></i> ${r.unmatched ? "Suggested agent" : `Agents invoked (${r.agents.length})`}</div>
          ${agentChips || '<div class="ask-empty-small">No specific agent matched — try rephrasing.</div>'}
        </div>
        ${signalBlock}
      </div>
    </div>`;
}

render();
