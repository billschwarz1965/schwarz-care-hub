import"./narrator-BE1zjzk_.js";let E=!1,l=!1,r=!1;function B(){if(E)return;E=!0;const o=document.createElement("div");o.id="demo-nav-overlay",o.innerHTML=`
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
    </div>`,document.body.appendChild(o);const p=document.createElement("style");p.textContent=`
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
  `,document.head.appendChild(p);const m=document.createElement("div");m.className="demo-nav-checkpoint",m.id="demo-nav-checkpoint",document.body.appendChild(m),document.getElementById("demo-nav-close").addEventListener("click",()=>{s()})}function L(){B(),document.getElementById("demo-nav-overlay").classList.add("visible")}function s(){const o=document.getElementById("demo-nav-overlay");o&&o.classList.remove("visible")}function v(){const o=document.getElementById("demo-nav-checkpoint");o&&o.classList.remove("visible")}function M(o){const{moduleName:p,moduleIcon:m,agents:t,runAgent:$}=o;B(),l=!1,r=!1;function b(e,n){const a=document.getElementById("demo-nav-title");a.innerHTML=`<i class="ti ti-${m}" style="margin-right:6px"></i> ${p}`;const i=document.getElementById("demo-nav-progress");i.innerHTML=t.map((c,d)=>`<div class="demo-nav-pip ${d<e?"done":""} ${d===e?"current":""}"></div>`).join("");const u=document.getElementById("demo-nav-toc");u.innerHTML=t.map((c,d)=>`
      <button class="demo-nav-item ${d<e?"completed":""} ${d===e?"active":""}" data-idx="${d}">
        <div class="demo-nav-item-icon"><i class="ti ti-${c.icon}"></i></div>
        <div class="demo-nav-item-info">
          <div class="demo-nav-item-name">${c.name}</div>
        </div>
        <i class="ti ti-check demo-nav-item-check"></i>
      </button>
    `).join(""),u.querySelectorAll(".demo-nav-item").forEach(c=>{c.addEventListener("click",()=>{const d=parseInt(c.dataset.idx);s(),n&&n({action:"goto",index:d})})});const z=document.getElementById("demo-nav-actions"),x=e<=0;z.innerHTML=`
      ${x?`<button class="demo-nav-btn demo-nav-btn-playall" id="dnav-playall">
        <i class="ti ti-player-play-filled"></i> Play All
      </button>`:""}
      ${!x&&e<t.length?`<button class="demo-nav-btn demo-nav-btn-secondary" id="dnav-next">
        <i class="ti ti-player-skip-forward"></i> Next: ${t[e].name}
      </button>`:""}
      ${e>=t.length?`<button class="demo-nav-btn demo-nav-btn-secondary" id="dnav-done">
        <i class="ti ti-check"></i> Done
      </button>`:""}
      <button class="demo-nav-btn demo-nav-btn-stop" id="dnav-stop">
        <i class="ti ti-player-stop"></i> End Demo
      </button>
    `;const y=document.getElementById("dnav-playall");y&&y.addEventListener("click",()=>{l=!0,s(),n&&n({action:"playall"})});const h=document.getElementById("dnav-next");h&&h.addEventListener("click",()=>{s(),n&&n({action:"goto",index:e})});const k=document.getElementById("dnav-done");k&&k.addEventListener("click",()=>{s(),n&&n({action:"stop"})});const w=document.getElementById("dnav-stop");w&&w.addEventListener("click",()=>{s(),r=!0,n&&n({action:"stop"})})}function f(e){if(l||r)return Promise.resolve({action:"next"});if(e>=t.length-1)return Promise.resolve({action:"next"});const n=document.getElementById("demo-nav-checkpoint"),a=t[e+1];return n.innerHTML=`
      <span class="demo-nav-cp-label">${e+1}/${t.length} complete</span>
      <button class="demo-nav-cp-btn demo-nav-cp-next" id="cp-next">
        <i class="ti ti-player-skip-forward"></i> Next: ${a.name}
      </button>
      <button class="demo-nav-cp-btn demo-nav-cp-menu" id="cp-menu">
        <i class="ti ti-list"></i> Menu
      </button>
    `,n.classList.add("visible"),new Promise(i=>{document.getElementById("cp-next").addEventListener("click",()=>{n.classList.remove("visible"),i({action:"next"})}),document.getElementById("cp-menu").addEventListener("click",()=>{n.classList.remove("visible"),b(e+1,i),L()})})}async function g(){return r=!1,l=!1,v(),new Promise(e=>{b(0,e),L()})}async function I(){const e=await g();let n=0;if(e.action==="stop")return;e.action==="playall"?(l=!0,n=0):e.action==="goto"&&(n=e.index);let a=n;for(;a<t.length&&!r&&(await $(a,t[a]),!(r||a>=t.length-1));){const i=await f(a);if(i.action==="stop")break;i.action==="goto"?a=i.index:a++}v()}return{startDemo:g,runFullDemo:I,showCheckpoint:f,hideCheckpoint:v,hideNavOverlay:s,get playAllMode(){return l},get aborted(){return r},abort(){r=!0}}}export{M as c};
