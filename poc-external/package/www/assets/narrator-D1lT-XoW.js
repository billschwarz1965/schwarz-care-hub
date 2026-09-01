let s=!0,m=!0,M=!1;const w=.92,k=1,C=/Edg\//.test(navigator.userAgent),A=C?4e3:400,E={female:["Microsoft Jenny Online","Microsoft Aria Online","Microsoft Jenny","Microsoft Aria","Microsoft Zira","Google US English","Samantha"],male:["Microsoft Guy Online","Microsoft Andrew Online","Microsoft Guy","Microsoft David","Microsoft Mark","Alex"]},B=["Microsoft Jenny Online","Microsoft Aria Online","Microsoft Guy Online","Microsoft Andrew Online"],L=["Microsoft Jenny Online","Microsoft Guy Online","Microsoft Aria Online","Microsoft Jenny","Microsoft Guy","Microsoft Aria","Microsoft Zira","Microsoft David","Microsoft Mark","Alex","Samantha"],O="medverse-narrator-voice-mode",b=["female","male","mixed"],p={female:{icon:"gender-female",label:"Female voice"},male:{icon:"gender-male",label:"Male voice"},mixed:{icon:"arrows-shuffle",label:"Mixed voices"}};function D(){const e=localStorage.getItem(O);return b.includes(e)?e:"female"}let a=D();function x(e,t){for(const n of t){const i=e.find(o=>o.name.includes(n)&&o.lang.startsWith("en"));if(i)return i}return null}let g=null;function v(){return g||(g=new Promise(e=>{let t=!1;const n=i=>{if(t)return;const o=speechSynthesis.getVoices();if(!o.length&&!i)return;if(o.some(r=>B.some(c=>r.name.includes(c)))||i){t=!0;const r=x(o,E.female),c=x(o,E.male),d=o.find(f=>f.lang.startsWith("en"))||o[0]||null,y=L.map(f=>o.find(u=>u.name.includes(f)&&u.lang.startsWith("en"))).filter(Boolean).filter((f,u,S)=>S.findIndex(T=>T.name===f.name)===u).slice(0,3);e({female:r||d,male:c||d,rotation:y.length?y:[d].filter(Boolean)})}};speechSynthesis.addEventListener("voiceschanged",()=>n(!1)),n(!1),setTimeout(()=>n(!0),A)}),g)}let h=0;async function P(){const e=await v();if(a==="male")return e.male;if(a==="mixed"){const t=e.rotation[h%e.rotation.length]||e.female;return h++,t}return e.female}async function _(e){const t=await v(),n=i=>i?i.name.replace(/^Microsoft /,"").replace(/ - English.*$/,""):"system default";return e==="male"?`Male voice (${n(t.male)})`:e==="mixed"?`Mixed voices (${t.rotation.map(n).join(", ")})`:`Female voice (${n(t.female)})`}function I(e){_(a).then(t=>{e.title=`${t} — click to change`})}function $(){if(M)return;M=!0;const e=document.createElement("div");e.id="narrator-controls",e.innerHTML=`
    <button id="narrator-voice-mode-btn" title="${p[a].label} — click to change">
      <i class="ti ti-${p[a].icon}"></i>
    </button>
    <button id="narrator-voice-btn" title="Toggle voice narration">
      <i class="ti ti-volume"></i>
    </button>
    <button id="narrator-cc-btn" title="Toggle closed captions" class="nc-active">
      CC
    </button>
  `,document.body.appendChild(e);const t=document.createElement("style");t.textContent=`
    #narrator-controls {
      position: fixed; bottom: 70px; right: 20px;
      display: flex; gap: 6px; z-index: 1200;
      opacity: 0; pointer-events: none; transition: opacity 0.3s;
    }
    #narrator-controls.nc-visible { opacity: 1; pointer-events: auto; }
    #narrator-controls button {
      width: 38px; height: 38px; border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.25);
      background: rgba(10,10,20,0.85); color: #fff;
      cursor: pointer; display: flex; align-items: center;
      justify-content: center; font-size: 15px;
      backdrop-filter: blur(6px); transition: all 0.15s;
      font-family: var(--font, 'Work Sans', sans-serif);
    }
    #narrator-controls button:hover { border-color: #7a00e6; background: rgba(122,0,230,0.25); }
    #narrator-controls button.nc-active { border-color: #7a00e6; color: #c084fc; }
    #narrator-controls button.nc-muted { opacity: 0.45; }
    #narrator-controls #narrator-cc-btn { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
  `,document.head.appendChild(t);const n=document.getElementById("narrator-voice-mode-btn");I(n),n.addEventListener("click",()=>{a=b[(b.indexOf(a)+1)%b.length],localStorage.setItem(O,a),h=0,n.innerHTML=`<i class="ti ti-${p[a].icon}"></i>`,n.title=`${p[a].label} — resolving…`,I(n)}),document.getElementById("narrator-voice-btn").addEventListener("click",()=>{s=!s;const i=document.getElementById("narrator-voice-btn");i.innerHTML=s?'<i class="ti ti-volume"></i>':'<i class="ti ti-volume-off"></i>',i.classList.toggle("nc-muted",!s),s||speechSynthesis.cancel()}),document.getElementById("narrator-cc-btn").addEventListener("click",()=>{m=!m,document.getElementById("narrator-cc-btn").classList.toggle("nc-active",m);const o=document.getElementById("demo-narrator");o&&!m&&o.classList.remove("visible")})}v();async function G(e,t=2e3){if(!e)return;const n=e.replace(/<[^>]+>/g,"").replace(/&[^;]+;/g,""),i=Date.now();if(!s){await new Promise(l=>setTimeout(l,t));return}const o=await P();return new Promise(l=>{speechSynthesis.cancel();const r=new SpeechSynthesisUtterance(n);o&&(r.voice=o),r.rate=w,r.pitch=k,r.volume=.85,r.onend=()=>{const c=Date.now()-i,d=Math.max(0,t-c);setTimeout(l,d)},r.onerror=()=>{const c=Date.now()-i;setTimeout(l,Math.max(0,t-c))},speechSynthesis.speak(r)})}function V(){speechSynthesis.cancel()}function R(){$(),document.getElementById("narrator-controls").classList.add("nc-visible")}function W(){const e=document.getElementById("narrator-controls");e&&e.classList.remove("nc-visible")}function J(){return m}export{R as a,G as b,W as h,J as i,V as s};
