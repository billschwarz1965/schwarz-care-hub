// ─── Suggested questions library ───
// A browsable catalogue of demo-worthy questions, opened from a link under the
// Ask MedVerse search bar. Clicking a question drops it into the search box;
// the copy button puts it on the clipboard for pasting elsewhere.
//
// Lives here rather than in each edition's ask.html so all three editions get
// it from the one import in ask-app.js — they share this directory.

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// `note` is the demo hint — what the question is meant to prove when you run
// it in front of an audience. It is deliberately not part of the query text.
const CATEGORIES = [
  {
    label: "Worth demoing deliberately",
    icon: "shield-check",
    blurb: "These show the system declining to invent an answer.",
    questions: [
      { q: "Who is my MSL for dermatology?", note: "MSL Connect" },
      { q: "Is Dupixent safe for a patient with a polysorbate allergy?", note: "Ingredient Safety" },
      { q: "Dupixent was left out of the fridge overnight, is it still usable?", note: "Temperature Stability" },
      { q: "How do I request compassionate use for an unapproved medicine?", note: "Medical Information + all four HCP access pathways (MAP, iEnvision portal, PTA)" }
    ]
  },
  {
    label: "Trials and pipeline",
    icon: "flask",
    questions: [
      { q: "What trials are recruiting for atopic dermatitis?", note: "5 real studies with NCT IDs, phase, enrollment, sites" },
      { q: "What clinical trials are available for cancer?", note: "5 oncology trials + ASCO / AACR / ASH / COMy" },
      { q: "What is in the pipeline for Gaucher disease?", note: "venglustat (Gaucher type 3) + 6 RDU resources" }
    ]
  },
  {
    label: "The honest-failure demo",
    icon: "help-circle",
    blurb: "The behaviour that makes everything else trustworthy — no nearest-document guess.",
    questions: [
      { q: "Treatment options for pancreatic cancer", note: "Answers \"no indexed clinical evidence\" rather than serving the nearest document" }
    ]
  },
  {
    label: "Injection site reactions",
    icon: "vaccine",
    questions: [
      { q: "Is it normal to have pain, swelling, or redness at the injection site?" },
      { q: "How long do injection site reactions typically last?" },
      { q: "What can I do to minimize injection site reactions?" }
    ]
  },
  {
    label: "Allergic or hypersensitivity reactions",
    icon: "alert-triangle",
    questions: [
      { q: "What signs of an allergic reaction should I watch for?" },
      { q: "If I develop a rash or hives, should I stop taking Dupixent?" },
      { q: "What's the difference between a normal reaction and a serious allergic response?" }
    ]
  },
  {
    label: "Infection-related symptoms",
    icon: "virus",
    questions: [
      { q: "Am I at higher risk for infections like cold sores or shingles?" },
      { q: "Should I be concerned about unusual skin infections?" },
      { q: "Do I need any special precautions regarding vaccinations?" }
    ]
  },
  {
    label: "Joint and muscle symptoms",
    icon: "bone",
    questions: [
      { q: "Is joint pain a known side effect of Dupixent?" },
      { q: "Should I report muscle aches or joint swelling?" }
    ]
  },
  {
    label: "Skin changes",
    icon: "mood-sick",
    questions: [
      { q: "Can Dupixent cause new skin rashes or psoriasis-like symptoms?" },
      { q: "What facial skin reactions have been reported?" }
    ]
  },
  {
    label: "General monitoring",
    icon: "activity-heartbeat",
    questions: [
      { q: "How often should I have blood work done to monitor eosinophil levels?" },
      { q: "What symptoms would require me to stop taking Dupixent immediately?" },
      { q: "Who should I contact if I experience concerning symptoms?" }
    ]
  }
];

const FOOTER_NOTE = "Always report any new or worsening symptoms to your healthcare provider promptly. Most adverse effects are manageable, but early detection is key.";

const STYLE = `
  .mv-prompts-trigger { display: inline-flex; align-items: center; gap: 7px; background: none; border: none;
    padding: 0; font-family: var(--font, sans-serif); font-size: 12.5px; font-weight: 600;
    color: var(--accent, #7a00e6); cursor: pointer; }
  .mv-prompts-trigger:hover { text-decoration: underline; }
  .mv-prompts-trigger-row { margin: 2px 0 20px; }
  .ask-wrap.ask-landing .mv-prompts-trigger-row { text-align: center; margin: 12px 0 0; }

  .mv-prompts-overlay { position: fixed; inset: 0; background: rgba(10,10,20,.55); z-index: 900;
    display: none; align-items: flex-start; justify-content: center; padding: 5vh 18px; }
  .mv-prompts-overlay.open { display: flex; }
  .mv-prompts-modal { background: var(--surface, #fff); border: 1px solid var(--border, #e4dff0);
    border-radius: var(--radius-lg, 16px); width: 100%; max-width: 720px; max-height: 88vh;
    display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 64px rgba(10,10,20,.28); }
  .mv-prompts-head { display: flex; align-items: flex-start; gap: 12px; padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border, #e4dff0); flex-shrink: 0; }
  .mv-prompts-head-icon { width: 36px; height: 36px; border-radius: 11px; flex-shrink: 0;
    background: var(--accent-light, #f0e6ff); color: var(--accent, #7a00e6);
    display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .mv-prompts-title { font-size: 15px; font-weight: 700; color: var(--text, #1a1a2e); }
  .mv-prompts-sub { font-size: 12px; color: var(--text-muted, #918da3); margin-top: 2px; line-height: 1.5; }
  .mv-prompts-close { margin-left: auto; background: none; border: none; cursor: pointer; flex-shrink: 0;
    color: var(--text-muted, #918da3); font-size: 20px; line-height: 1; padding: 2px 4px; }
  .mv-prompts-close:hover { color: var(--text, #1a1a2e); }

  .mv-prompts-filter-row { padding: 12px 20px; border-bottom: 1px solid var(--border, #e4dff0);
    position: relative; flex-shrink: 0; }
  .mv-prompts-filter-icon { position: absolute; left: 33px; top: 50%; transform: translateY(-50%);
    font-size: 14px; color: var(--text-muted, #918da3); pointer-events: none; }
  .mv-prompts-filter { width: 100%; padding: 9px 12px 9px 34px; border: 1.5px solid var(--border, #e4dff0);
    border-radius: 9px; font-family: var(--font, sans-serif); font-size: 12.5px; outline: none;
    background: var(--bg, #f7f5fa); color: var(--text, #1a1a2e); }
  .mv-prompts-filter:focus { border-color: var(--accent, #7a00e6); }

  .mv-prompts-body { overflow-y: auto; padding: 6px 20px 4px; }
  .mv-prompts-body::-webkit-scrollbar { width: 6px; }
  .mv-prompts-body::-webkit-scrollbar-thumb { background: var(--border, #e4dff0); border-radius: 3px; }
  .mv-prompts-cat { padding: 14px 0 4px; }
  .mv-prompts-cat-label { display: flex; align-items: center; gap: 7px; font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .5px; color: var(--text-muted, #918da3); margin-bottom: 4px; }
  .mv-prompts-cat-blurb { font-size: 11.5px; color: var(--text-secondary, #5a5672); line-height: 1.5; margin-bottom: 9px; }
  .mv-prompts-item { display: flex; align-items: flex-start; gap: 10px; border: 1px solid var(--border, #e4dff0);
    border-radius: 11px; padding: 10px 12px; margin-bottom: 7px; }
  .mv-prompts-item:hover { border-color: var(--accent, #7a00e6); background: var(--accent-light, #f0e6ff); }
  .mv-prompts-pick { flex: 1; min-width: 0; text-align: left; background: none; border: none; padding: 0;
    cursor: pointer; font-family: var(--font, sans-serif); color: inherit; }
  .mv-prompts-q { font-size: 13px; line-height: 1.45; color: var(--text, #1a1a2e); }
  .mv-prompts-note { font-size: 11px; color: var(--text-muted, #918da3); line-height: 1.45; margin-top: 3px;
    display: flex; gap: 5px; }
  .mv-prompts-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
  .mv-prompts-copy, .mv-prompts-run { background: none; border: 1px solid var(--border, #e4dff0);
    border-radius: 8px; width: 28px; height: 28px; cursor: pointer; color: var(--text-muted, #918da3);
    display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .mv-prompts-copy:hover { border-color: var(--accent, #7a00e6); color: var(--accent, #7a00e6); }
  .mv-prompts-copy.copied { color: var(--success, #166534); border-color: var(--success, #166534); }
  .mv-prompts-run { background: var(--accent, #7a00e6); border-color: var(--accent, #7a00e6); color: #fff; }
  .mv-prompts-run:hover { background: var(--accent-hover, #6600c2); }
  .mv-prompts-none { font-size: 12.5px; color: var(--text-muted, #918da3); padding: 24px 0; text-align: center; }

  .mv-prompts-foot { padding: 12px 20px 14px; border-top: 1px solid var(--border, #e4dff0);
    font-size: 11.5px; line-height: 1.55; color: var(--text-secondary, #5a5672); flex-shrink: 0;
    display: flex; gap: 7px; }
  .mv-prompts-foot i { color: var(--accent, #7a00e6); flex-shrink: 0; margin-top: 1px; }

  @media (max-width: 640px) {
    .mv-prompts-overlay { padding: 2vh 10px; }
    .mv-prompts-modal { max-height: 94vh; }
  }
`;

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  // Older browsers on locked-down demo laptops have no async clipboard.
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    ok ? resolve() : reject(new Error("copy failed"));
  });
}

function renderList(body, filter) {
  const f = filter.trim().toLowerCase();
  const cats = CATEGORIES
    .map(c => ({ ...c, questions: c.questions.filter(x => !f || x.q.toLowerCase().includes(f) || c.label.toLowerCase().includes(f)) }))
    .filter(c => c.questions.length);

  if (!cats.length) {
    body.innerHTML = `<div class="mv-prompts-none">No suggested question matches “${esc(filter)}”.</div>`;
    return;
  }

  body.innerHTML = cats.map(c => `
    <div class="mv-prompts-cat">
      <div class="mv-prompts-cat-label"><i class="ti ti-${esc(c.icon)}"></i> ${esc(c.label)}</div>
      ${c.blurb ? `<div class="mv-prompts-cat-blurb">${esc(c.blurb)}</div>` : ""}
      ${c.questions.map(x => `
        <div class="mv-prompts-item">
          <button type="button" class="mv-prompts-pick" data-q="${esc(x.q)}" title="Fill the search box without running it">
            <div class="mv-prompts-q">${esc(x.q)}</div>
            ${x.note ? `<div class="mv-prompts-note"><i class="ti ti-arrow-right"></i> ${esc(x.note)}</div>` : ""}
          </button>
          <div class="mv-prompts-actions">
            <button type="button" class="mv-prompts-run" data-q="${esc(x.q)}" title="Fill and run this question">
              <i class="ti ti-player-play"></i>
            </button>
            <button type="button" class="mv-prompts-copy" data-q="${esc(x.q)}" title="Copy question">
              <i class="ti ti-copy"></i>
            </button>
          </div>
        </div>`).join("")}
    </div>`).join("");
}

export function initAskPrompts() {
  const form = document.getElementById("ask-form");
  const input = document.getElementById("ask-input");
  if (!form || !input) return;

  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.appendChild(style);

  const triggerRow = document.createElement("div");
  triggerRow.className = "mv-prompts-trigger-row";
  triggerRow.innerHTML = `
    <button type="button" class="mv-prompts-trigger" id="mv-prompts-trigger">
      <i class="ti ti-list-search"></i> Browse suggested questions
    </button>`;
  form.insertAdjacentElement("afterend", triggerRow);

  const overlay = document.createElement("div");
  overlay.className = "mv-prompts-overlay";
  overlay.innerHTML = `
    <div class="mv-prompts-modal" role="dialog" aria-modal="true" aria-label="Suggested questions">
      <div class="mv-prompts-head">
        <div class="mv-prompts-head-icon"><i class="ti ti-list-search"></i></div>
        <div>
          <div class="mv-prompts-title">Suggested questions</div>
          <div class="mv-prompts-sub">Click a question to drop it into the Ask MedVerse box, use <i class="ti ti-player-play"></i> to run it immediately, or copy it to paste anywhere.</div>
        </div>
        <button type="button" class="mv-prompts-close" title="Close">&times;</button>
      </div>
      <div class="mv-prompts-filter-row">
        <i class="ti ti-search mv-prompts-filter-icon"></i>
        <input type="text" class="mv-prompts-filter" placeholder="Filter questions…" autocomplete="off">
      </div>
      <div class="mv-prompts-body"></div>
      <div class="mv-prompts-foot">
        <i class="ti ti-info-circle"></i>
        <span>${esc(FOOTER_NOTE)}</span>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const body = overlay.querySelector(".mv-prompts-body");
  const filter = overlay.querySelector(".mv-prompts-filter");
  renderList(body, "");

  function open() {
    overlay.classList.add("open");
    filter.value = "";
    renderList(body, "");
    requestAnimationFrame(() => filter.focus());
  }
  function close() {
    overlay.classList.remove("open");
  }

  triggerRow.querySelector("#mv-prompts-trigger").addEventListener("click", open);
  overlay.querySelector(".mv-prompts-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });
  filter.addEventListener("input", () => renderList(body, filter.value));

  body.addEventListener("click", (e) => {
    const run = e.target.closest(".mv-prompts-run");
    if (run) {
      input.value = run.getAttribute("data-q");
      close();
      form.requestSubmit ? form.requestSubmit() : form.submit();
      return;
    }
    const pick = e.target.closest(".mv-prompts-pick");
    if (pick) {
      // Populate rather than submit: the presenter decides when to run it.
      input.value = pick.getAttribute("data-q");
      close();
      input.focus();
      return;
    }
    const copy = e.target.closest(".mv-prompts-copy");
    if (copy) {
      copyToClipboard(copy.getAttribute("data-q")).then(() => {
        copy.classList.add("copied");
        copy.innerHTML = '<i class="ti ti-check"></i>';
        setTimeout(() => {
          copy.classList.remove("copied");
          copy.innerHTML = '<i class="ti ti-copy"></i>';
        }, 1600);
        if (window.mvToast) window.mvToast("Question copied to clipboard", "success", 2000);
      }).catch(() => {
        if (window.mvToast) window.mvToast("Could not access the clipboard — select and copy manually", "warning");
      });
    }
  });
}
