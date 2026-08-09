import { speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";

let navInjected = false;
let playAllMode = false;
let demoAborted = false;
let currentResolve = null;

function injectNavUI() {
  if (navInjected) return;
  navInjected = true;

  const overlay = document.createElement("div");
  overlay.id = "demo-nav-overlay";
  overlay.innerHTML = `
    <div class="demo-nav-panel">
      <div class="demo-nav-header">
        <span class="demo-nav-title" id="demo-nav-title">Demo Navigation</span>
        <button class="demo-nav-close" id="demo-nav-close"><i class="ti ti-x"></i></button>
      </div>
      <div class="demo-nav-body">
        <div class="demo-nav-progress" id="demo-nav-progress"></div>
        <div class="demo-nav-toc" id="demo-nav-toc"></div>
      </div>
      <div class="demo-nav-actions" id="demo-nav-actions"></div>
    </div>`;
  document.body.appendChild(overlay);

  const style = document.createElement("style");
  style.textContent = `
    #demo-nav-overlay {
      position:fixed;inset:0;z-index:1500;background:rgba(0,0,0,0.65);
      display:none;align-items:center;justify-content:center;
      backdrop-filter:blur(4px);animation:dnavFadeIn .25s ease;
    }
    #demo-nav-overlay.visible { display:flex; }
    @keyframes dnavFadeIn { from{opacity:0} to{opacity:1} }
    .demo-nav-panel {
      background:#13131a;border:1px solid rgba(122,0,230,0.3);border-radius:16px;
      width:min(480px,92vw);max-height:85vh;display:flex;flex-direction:column;
      box-shadow:0 20px 60px rgba(0,0,0,0.6);
    }
    .demo-nav-header {
      display:flex;align-items:center;justify-content:space-between;
      padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,0.07);
    }
    .demo-nav-title {
      font-size:16px;font-weight:600;color:#fff;
      font-family:var(--font,'Work Sans',sans-serif);
    }
    .demo-nav-close {
      background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;
      font-size:18px;padding:4px;border-radius:6px;transition:all .15s;
    }
    .demo-nav-close:hover { color:#fff;background:rgba(255,255,255,0.08); }
    .demo-nav-body { padding:16px 22px;overflow-y:auto;flex:1; }
    .demo-nav-progress {
      display:flex;gap:4px;margin-bottom:16px;
    }
    .demo-nav-pip {
      flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,0.1);transition:background .3s;
    }
    .demo-nav-pip.done { background:#7a00e6; }
    .demo-nav-pip.current { background:#c084fc; }
    .demo-nav-toc { display:flex;flex-direction:column;gap:4px; }
    .demo-nav-item {
      display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;
      cursor:pointer;transition:all .15s;border:1px solid transparent;
      font-family:var(--font,'Work Sans',sans-serif);background:none;
      text-align:left;width:100%;color:rgba(255,255,255,0.7);font-size:13.5px;
    }
    .demo-nav-item:hover { background:rgba(122,0,230,0.1);border-color:rgba(122,0,230,0.2); }
    .demo-nav-item.active { background:rgba(122,0,230,0.15);border-color:rgba(122,0,230,0.35);color:#fff; }
    .demo-nav-item.completed { color:rgba(255,255,255,0.45); }
    .demo-nav-item-icon {
      width:28px;height:28px;border-radius:8px;display:flex;align-items:center;
      justify-content:center;font-size:14px;flex-shrink:0;
      background:rgba(122,0,230,0.12);color:#c084fc;
    }
    .demo-nav-item.completed .demo-nav-item-icon { background:rgba(122,0,230,0.08);color:rgba(122,0,230,0.5); }
    .demo-nav-item-info { flex:1;min-width:0; }
    .demo-nav-item-name { font-weight:500; }
    .demo-nav-item-check {
      font-size:14px;color:#7a00e6;opacity:0;transition:opacity .2s;
    }
    .demo-nav-item.completed .demo-nav-item-check { opacity:1; }
    .demo-nav-actions {
      padding:14px 22px 18px;border-top:1px solid rgba(255,255,255,0.07);
      display:flex;gap:10px;flex-wrap:wrap;
    }
    .demo-nav-btn {
      flex:1;padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;
      font-family:var(--font,'Work Sans',sans-serif);cursor:pointer;
      display:flex;align-items:center;justify-content:center;gap:7px;
      transition:all .15s;border:none;min-width:120px;
    }
    .demo-nav-btn-primary {
      background:#7a00e6;color:#fff;
    }
    .demo-nav-btn-primary:hover { background:#8b1cf7; }
    .demo-nav-btn-secondary {
      background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);
      border:1px solid rgba(255,255,255,0.1);
    }
    .demo-nav-btn-secondary:hover { background:rgba(255,255,255,0.1); }
    .demo-nav-btn-playall {
      background:linear-gradient(135deg,#7a00e6,#4f46e5);color:#fff;
      width:100%;flex:none;
    }
    .demo-nav-btn-playall:hover { filter:brightness(1.1); }
    .demo-nav-btn-stop {
      background:rgba(239,68,68,0.15);color:#f87171;
      border:1px solid rgba(239,68,68,0.25);
    }
    .demo-nav-btn-stop:hover { background:rgba(239,68,68,0.25); }

    .demo-nav-checkpoint {
      position:fixed;bottom:60px;left:50%;transform:translateX(-50%);
      z-index:1300;display:none;align-items:center;gap:10px;
      background:rgba(13,13,20,0.92);border:1px solid rgba(122,0,230,0.3);
      border-radius:14px;padding:10px 16px;backdrop-filter:blur(8px);
      box-shadow:0 8px 30px rgba(0,0,0,0.5);
      animation:dnavSlideUp .3s ease;
    }
    .demo-nav-checkpoint.visible { display:flex; }
    @keyframes dnavSlideUp { from{transform:translateX(-50%) translateY(20px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }
    .demo-nav-cp-label {
      color:rgba(255,255,255,0.6);font-size:12px;
      font-family:var(--font,'Work Sans',sans-serif);white-space:nowrap;
    }
    .demo-nav-cp-btn {
      padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;
      font-family:var(--font,'Work Sans',sans-serif);cursor:pointer;
      display:flex;align-items:center;gap:5px;transition:all .15s;border:none;
      white-space:nowrap;
    }
    .demo-nav-cp-next { background:#7a00e6;color:#fff; }
    .demo-nav-cp-next:hover { background:#8b1cf7; }
    .demo-nav-cp-menu { background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.8); }
    .demo-nav-cp-menu:hover { background:rgba(255,255,255,0.14); }
  `;
  document.head.appendChild(style);

  const cpEl = document.createElement("div");
  cpEl.className = "demo-nav-checkpoint";
  cpEl.id = "demo-nav-checkpoint";
  document.body.appendChild(cpEl);

  document.getElementById("demo-nav-close").addEventListener("click", () => {
    hideNavOverlay();
  });
}

function showNavOverlay() {
  injectNavUI();
  document.getElementById("demo-nav-overlay").classList.add("visible");
}

function hideNavOverlay() {
  const el = document.getElementById("demo-nav-overlay");
  if (el) el.classList.remove("visible");
}

function hideCheckpoint() {
  const el = document.getElementById("demo-nav-checkpoint");
  if (el) el.classList.remove("visible");
}

export function createDemoController(config) {
  const { moduleName, moduleIcon, agents, runAgent } = config;
  injectNavUI();
  playAllMode = false;
  demoAborted = false;

  function renderTOC(currentIndex, resolve) {
    const titleEl = document.getElementById("demo-nav-title");
    titleEl.innerHTML = `<i class="ti ti-${moduleIcon}" style="margin-right:6px"></i> ${moduleName}`;

    const progress = document.getElementById("demo-nav-progress");
    progress.innerHTML = agents.map((_, i) =>
      `<div class="demo-nav-pip ${i < currentIndex ? 'done' : ''} ${i === currentIndex ? 'current' : ''}"></div>`
    ).join("");

    const toc = document.getElementById("demo-nav-toc");
    toc.innerHTML = agents.map((a, i) => `
      <button class="demo-nav-item ${i < currentIndex ? 'completed' : ''} ${i === currentIndex ? 'active' : ''}" data-idx="${i}">
        <div class="demo-nav-item-icon"><i class="ti ti-${a.icon}"></i></div>
        <div class="demo-nav-item-info">
          <div class="demo-nav-item-name">${a.name}</div>
        </div>
        <i class="ti ti-check demo-nav-item-check"></i>
      </button>
    `).join("");

    toc.querySelectorAll(".demo-nav-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx);
        hideNavOverlay();
        if (resolve) resolve({ action: "goto", index: idx });
      });
    });

    const actions = document.getElementById("demo-nav-actions");
    const isStart = currentIndex <= 0;
    actions.innerHTML = `
      ${isStart ? `<button class="demo-nav-btn demo-nav-btn-playall" id="dnav-playall">
        <i class="ti ti-player-play-filled"></i> Play All
      </button>` : ""}
      ${!isStart && currentIndex < agents.length ? `<button class="demo-nav-btn demo-nav-btn-secondary" id="dnav-next">
        <i class="ti ti-player-skip-forward"></i> Next: ${agents[currentIndex].name}
      </button>` : ""}
      ${currentIndex >= agents.length ? `<button class="demo-nav-btn demo-nav-btn-secondary" id="dnav-done">
        <i class="ti ti-check"></i> Done
      </button>` : ""}
      <button class="demo-nav-btn demo-nav-btn-stop" id="dnav-stop">
        <i class="ti ti-player-stop"></i> End Demo
      </button>
    `;

    const playallBtn = document.getElementById("dnav-playall");
    if (playallBtn) playallBtn.addEventListener("click", () => {
      playAllMode = true;
      hideNavOverlay();
      if (resolve) resolve({ action: "playall" });
    });

    const nextBtn = document.getElementById("dnav-next");
    if (nextBtn) nextBtn.addEventListener("click", () => {
      hideNavOverlay();
      if (resolve) resolve({ action: "goto", index: currentIndex });
    });

    const doneBtn = document.getElementById("dnav-done");
    if (doneBtn) doneBtn.addEventListener("click", () => {
      hideNavOverlay();
      if (resolve) resolve({ action: "stop" });
    });

    const stopBtn = document.getElementById("dnav-stop");
    if (stopBtn) stopBtn.addEventListener("click", () => {
      hideNavOverlay();
      demoAborted = true;
      if (resolve) resolve({ action: "stop" });
    });
  }

  function showCheckpoint(currentIndex) {
    if (playAllMode || demoAborted) return Promise.resolve({ action: "next" });
    if (currentIndex >= agents.length - 1) return Promise.resolve({ action: "next" });

    const cp = document.getElementById("demo-nav-checkpoint");
    const next = agents[currentIndex + 1];
    cp.innerHTML = `
      <span class="demo-nav-cp-label">${currentIndex + 1}/${agents.length} complete</span>
      <button class="demo-nav-cp-btn demo-nav-cp-next" id="cp-next">
        <i class="ti ti-player-skip-forward"></i> Next: ${next.name}
      </button>
      <button class="demo-nav-cp-btn demo-nav-cp-menu" id="cp-menu">
        <i class="ti ti-list"></i> Menu
      </button>
    `;
    cp.classList.add("visible");

    return new Promise(resolve => {
      currentResolve = resolve;
      document.getElementById("cp-next").addEventListener("click", () => {
        cp.classList.remove("visible");
        resolve({ action: "next" });
      });
      document.getElementById("cp-menu").addEventListener("click", () => {
        cp.classList.remove("visible");
        renderTOC(currentIndex + 1, resolve);
        showNavOverlay();
      });
    });
  }

  async function startDemo() {
    demoAborted = false;
    playAllMode = false;
    hideCheckpoint();

    return new Promise(resolve => {
      renderTOC(0, resolve);
      showNavOverlay();
    });
  }

  async function runFullDemo() {
    const startChoice = await startDemo();

    let startIndex = 0;
    if (startChoice.action === "stop") return;
    if (startChoice.action === "playall") {
      playAllMode = true;
      startIndex = 0;
    } else if (startChoice.action === "goto") {
      startIndex = startChoice.index;
    }

    let i = startIndex;
    while (i < agents.length && !demoAborted) {
      await runAgent(i, agents[i]);

      if (demoAborted) break;
      if (i >= agents.length - 1) break;

      const choice = await showCheckpoint(i);
      if (choice.action === "stop") break;
      if (choice.action === "goto") {
        i = choice.index;
      } else {
        i++;
      }
    }

    hideCheckpoint();
  }

  return { startDemo, runFullDemo, showCheckpoint, hideCheckpoint, hideNavOverlay,
    get playAllMode() { return playAllMode; },
    get aborted() { return demoAborted; },
    abort() { demoAborted = true; } };
}
