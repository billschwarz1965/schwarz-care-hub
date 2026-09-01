// ─── Ask MedVerse results page ───
// Reads ?q= from the URL, routes it across every module this edition ships,
// and renders the answer plus deep links. Each edition's ask.html declares the
// pages it actually has via <body data-modules="...">.

import { askMedVerse, capabilityLink, trialLink, pipelineAreaLabel } from "./ask-router.js";
import { speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";

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
// Reassignable: the in-page demo renders one query after another without
// navigating, since a reload would kill the demo mid-run.
let query = (params.get("q") || "").trim();

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
  "How do I request compassionate use for an unapproved medicine?"
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
            ${pipelineAreaLabel(p) ? `<span class="ask-pipe-ta">${esc(pipelineAreaLabel(p))}</span>` : ""}
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

// ============================================================
// GUIDED DEMO
// ============================================================
// Walks the real page through real queries: narrates each capability, types the
// question into the actual search box, and renders the actual result. Nothing is
// mocked — every step runs the same router the user does.

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function narrate(text) {
  const el = document.getElementById("demo-narrator");
  if (!el) return;
  el.innerHTML = `<i class="ti ti-sparkles"></i> ${esc(text)}`;
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

/** Render results for an arbitrary query without navigating. */
function showResultsFor(q) {
  query = q;
  if (input) input.value = q;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Type into the search box so the viewer sees the question being asked. */
async function typeQuery(q, perChar = 14) {
  if (!input) return;
  input.value = "";
  input.focus();
  for (let i = 0; i < q.length; i++) {
    input.value = q.slice(0, i + 1);
    if (i % 3 === 0) await delay(perChar);
  }
  await delay(220);
}

// Every question here is one a clinician would actually type, framed as the
// clinical moment that prompts it. Corporate-facing questions (pipeline,
// competitive landscape) are deliberately left out — an HCP does not ask those.
const DEMO_STEPS = [
  {
    q: "What are my options for a patient with moderate-to-severe atopic dermatitis who failed topicals?",
    before: "A dermatologist has a patient who has failed topical therapy and is deciding what to do next. She types the question the way she would say it.",
    after: "The treatment algorithm, the trial data, and the disease burden - each claim numbered back to governed Sanofi content. Underneath: the studies recruiting in this condition, and the education already published on it."
  },
  {
    q: "Is Dupixent safe for a patient with a polysorbate allergy?",
    before: "Now a safety question before prescribing. This one needs two different things at once.",
    after: "It invoked two agents: Ingredient Safety for the excipient cross-reference, and Medical Information for the part that goes past the label. Either one opens with the question already filled in."
  },
  {
    q: "Dupixent was left out of the fridge overnight, is it still usable?",
    before: "This is the kind of question a nurse or pharmacist asks on a Monday morning, and it has a real answer or it does not.",
    after: "No paragraph invented. It routes straight to Temperature Stability, which does the actual excursion assessment against the product's cold chain limits."
  },
  {
    q: "Early detection and screening for type 1 diabetes",
    before: "A paediatrician wants to understand screening. Answers here are not limited to internal documents.",
    after: "Six BR one D G E resources, all type 1 diabetes - the early detection toolkit, two articles, three expert videos. Each keeps its content type, its source programme, and a link back to where it actually lives."
  },
  {
    q: "What trials are recruiting for atopic dermatitis?",
    before: "She has a patient who is running out of options and asks about trials.",
    after: "Real studies, each with its N C T number, phase, enrolment target and open sites. The links go to Clinical Trials dot gov, because the summary here is not enough to refer a patient on - and the page says so."
  },
  {
    q: "Who is my MSL for dermatology?",
    before: "She wants to talk to someone at Sanofi about the long-term data. Today that means finding the right person.",
    after: "No prose, because the question has no prose answer. It hands her to the agent that performs the real lookup. An early build answered this with congress highlights, because that record mentioned an M S L booth - confidently wrong is worse than nothing."
  },
  {
    q: "How do I request compassionate use for an unapproved medicine?",
    before: "Her patient has exhausted approved options. This is one of the hardest things for a clinician to navigate.",
    after: "Managed Access, the request portal, and Post Trial Access - the actual pathways, in one place. And every question she asked left an interaction signal describing the topic, intent and disease area, which is what the field team can act on."
  },
  {
    q: "Treatment options for pancreatic cancer",
    before: "Last one, and it matters most. There is no pancreatic cancer evidence in the indexed content.",
    after: "So it says so. It does not hand her the nearest document and let it look like an answer. For something a clinician would rely on, being able to say I do not know is what makes everything else trustworthy."
  }
];

let demoRunning = false;

async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;

  const btn = document.getElementById("run-demo");
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-loader"></i> Running…'; }

  try {
    for (const step of DEMO_STEPS) {
      if (!demoRunning) break;
      await narrate(step.before);
      if (!demoRunning) break;
      await typeQuery(step.q);
      showResultsFor(step.q);
      await delay(700);
      if (!demoRunning) break;
      await narrate(step.after);
      await delay(600);
    }
    if (demoRunning) {
      await narrate("Eight questions a clinician would actually ask, one box, and governance underneath that does not depend on anyone remembering to apply it.");
    }
  } finally {
    narrateOff();
    demoRunning = false;
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ti ti-player-play"></i> Play Demo'; }
  }
}

const demoBtn = document.getElementById("run-demo");
if (demoBtn) demoBtn.addEventListener("click", runDemo);

// Leaving the page mid-demo should not keep talking.
window.addEventListener("beforeunload", () => { demoRunning = false; stopSpeaking(); });
