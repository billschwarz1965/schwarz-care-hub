// ─── Ask MedVerse results page ───
// Reads ?q= from the URL, routes it across every module this edition ships,
// and renders the answer plus deep links. Each edition's ask.html declares the
// pages it actually has via <body data-modules="...">.

import { askMedVerse, capabilityLink, trialLink } from "./ask-router.js";

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

// Examples chosen because each one demonstrably returns something real from a
// different part of the index — evidence, a lookup agent, trials, and the
// external education library.
const EXAMPLES = [
  "What are my options for a patient with moderate-to-severe atopic dermatitis who failed topicals?",
  "Early detection and screening for type 1 diabetes",
  "What trials are recruiting for atopic dermatitis?",
  "Who is my MSL for dermatology?",
  "Cardiac manifestations and biomarkers in Fabry disease",
  "How do I request compassionate use for an unapproved medicine?",
  "What's in Sanofi's R&D pipeline for atopic dermatitis?",
  "I need a peer expert to consult on a refractory case"
];

const wrap = document.querySelector(".ask-wrap");
const echoRow = document.querySelector(".ask-echo");

function render() {
  // No query: the page is just the search bar, centred, with examples. This is
  // the landing state — nothing else competes with the input.
  if (!query) {
    if (wrap) wrap.classList.add("ask-landing");
    if (echoRow) echoRow.style.display = "none";
    document.title = "Ask MedVerse";

    results.innerHTML = `
      <div class="ask-examples">
        <div class="ask-examples-label">Try one of these</div>
        ${EXAMPLES.map(x => `<button type="button" class="ask-example" data-q="${esc(x)}">${esc(x)}</button>`).join("")}
      </div>`;

    results.querySelectorAll(".ask-example").forEach(btn => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-q");
        if (input) input.value = q;
        location.search = "?q=" + encodeURIComponent(q);
      });
    });

    if (input) input.focus();
    return;
  }

  if (wrap) wrap.classList.remove("ask-landing");
  if (echoRow) echoRow.style.display = "";
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

  // Real recruiting studies. Linked to ClinicalTrials.gov rather than a Sanofi
  // page so the HCP reads the actual protocol and eligibility criteria.
  const trialsBlock = (r.trials || []).length ? `
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-flask"></i> Recruiting studies (${r.trials.length})</div>
      ${r.trials.map(t => `
        <a class="ask-trial" href="${esc(trialLink(t))}" target="_blank" rel="noopener">
          <div class="ask-trial-head">
            <span class="ask-trial-status">${esc(t.status)}</span>
            <span class="ask-trial-nct">${esc(t.nct)}</span>
          </div>
          <div class="ask-trial-title">${esc(t.title)}</div>
          <div class="ask-trial-meta">
            <span><i class="ti ti-target"></i> ${esc(t.phase)}</span>
            <span><i class="ti ti-users"></i> ${t.enrollment.toLocaleString()} participants</span>
            <span><i class="ti ti-map-pin"></i> ${t.sites} site${t.sites === 1 ? "" : "s"}</span>
          </div>
          <div class="ask-trial-conds">${t.conditions.map(cd => `<span class="ask-trial-cond">${esc(cd)}</span>`).join("")}</div>
        </a>`).join("")}
      <p class="ask-trial-note">Eligibility shown is a summary. Full inclusion and exclusion criteria are on ClinicalTrials.gov — open a study to review them before referring a patient.</p>
    </div>` : "";

  // Pipeline assets. No per-project phase is shown because the source page did
  // not yield one reliably — see pipeline-data.js.
  const pipelineBlock = (r.pipeline || []).length ? `
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-git-branch"></i> R&amp;D pipeline (${r.pipeline.length})</div>
      ${r.pipeline.map(p => `
        <div class="ask-pipe">
          <div class="ask-pipe-top">
            <span class="ask-pipe-name">${esc(p.name)}</span>
            <span class="ask-pipe-ta">${esc(p.ta)}</span>
          </div>
          <div class="ask-pipe-ind">${esc(p.indication)}</div>
          <div class="ask-pipe-mech">${esc(p.desc)}</div>
        </div>`).join("")}
      <p class="ask-trial-note">Investigational unless stated otherwise. Development phase is not shown here — check the
        <a href="https://www.sanofi.com/en/our-science/our-pipeline" target="_blank" rel="noopener">Sanofi pipeline page</a>
        for current phase and status before citing any of this.</p>
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

  // Only present an evidence answer when the retrieved content is genuinely
  // about the question. Otherwise hand the user to the agent that can actually
  // do the thing — a lookup question has no prose answer, and inventing one
  // reads as authoritative when it isn't.
  let answerBlock;
  if (r.answerMode === "evidence") {
    answerBlock = `
    <div class="ask-answer-card">
      <div class="ask-answer-head">
        <div class="ask-answer-icon"><i class="ti ti-sparkles"></i></div>
        <div>
          <div class="ask-answer-title">Evidence-based answer</div>
          <div class="ask-answer-sub">Drawn from governed Sanofi medical content</div>
        </div>
      </div>
      <div class="ask-answer-body rendered">${renderMd(r.answer.answer)}</div>
      ${citations}
    </div>`;
  } else if (r.answerMode === "action" && r.agents.length) {
    const top = r.agents[0];
    answerBlock = `
    <div class="ask-answer-card">
      <div class="ask-answer-head">
        <div class="ask-answer-icon"><i class="ti ti-${esc(top.icon)}"></i></div>
        <div>
          <div class="ask-answer-title">${esc(top.name)} handles this</div>
          <div class="ask-answer-sub">This is a lookup rather than an evidence question — the agent gives you the live answer</div>
        </div>
      </div>
      <div class="ask-answer-body">
        <p>${esc(top.blurb)}.</p>
        <p style="margin-top:10px;"><a class="ask-action-btn" href="${esc(capabilityLink(top, query))}"><i class="ti ti-arrow-right"></i> Open ${esc(top.name)}</a></p>
      </div>
    </div>`;
  } else {
    answerBlock = `
    <div class="ask-answer-card">
      <div class="ask-answer-head">
        <div class="ask-answer-icon"><i class="ti ti-help-circle"></i></div>
        <div>
          <div class="ask-answer-title">No indexed answer for this yet</div>
          <div class="ask-answer-sub">Nothing in the governed content matches closely enough to answer confidently</div>
        </div>
      </div>
      <div class="ask-answer-body">
        <p>Rather than guess, MedVerse is telling you it does not know. Try rephrasing, or explore the learning resources below${r.agents.length ? " and the suggested agent" : ""}.</p>
      </div>
    </div>`;
  }

  // The signal must describe what the HCP actually asked. When the retrieved
  // document was off-topic, its signal is off-topic too — derive one from the
  // query and the routed agent instead of reporting the wrong subject upstream.
  let signal = null;
  if (r.answerMode === "evidence" && r.answer.signal) {
    signal = r.answer.signal;
  } else if (r.agents.length) {
    const top = r.agents[0];
    signal = {
      topic: query,
      intent: `${top.name} request`,
      diseaseArea: r.answer.signal?.diseaseArea || "General",
      orionAction: `Routed to ${top.name}. Logged as an HCP-initiated ${top.name.toLowerCase()} request.`
    };
  }

  const signalBlock = signal ? `
    <div class="ask-signal">
      <div class="ask-signal-head"><span class="ask-signal-dot"></span> Interaction signal generated</div>
      <div class="ask-signal-row"><span>Topic</span><strong>${esc(signal.topic)}</strong></div>
      <div class="ask-signal-row"><span>Intent</span><strong>${esc(signal.intent)}</strong></div>
      <div class="ask-signal-row"><span>Disease area</span><strong>${esc(signal.diseaseArea)}</strong></div>
      <div class="ask-signal-action"><i class="ti ti-arrow-right"></i> ${esc(signal.orionAction)}</div>
    </div>` : "";

  results.innerHTML = `
    <div class="ask-layout">
      <div class="ask-main">
        ${answerBlock}
        ${trialsBlock}
        ${pipelineBlock}
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
