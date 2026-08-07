(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function o(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(t){if(t.ep)return;t.ep=!0;const e=o(t);fetch(t.href,e)}})();let c=!0,a=!0,d=!1;const f=.92,p=1;function m(){const n=speechSynthesis.getVoices(),r=["Microsoft Jenny Online","Microsoft Aria Online","Microsoft Guy Online","Microsoft Jenny","Microsoft Aria","Google US English","Samantha","Alex","Microsoft Zira","Microsoft David"];for(const o of r){const i=n.find(t=>t.name.includes(o)&&t.lang.startsWith("en"));if(i)return i}return n.find(o=>o.lang.startsWith("en"))||n[0]||null}function g(){if(d)return;d=!0;const n=document.createElement("div");n.id="narrator-controls",n.innerHTML=`
    <button id="narrator-voice-btn" title="Toggle voice narration">
      <i class="ti ti-volume"></i>
    </button>
    <button id="narrator-cc-btn" title="Toggle closed captions" class="nc-active">
      CC
    </button>
  `,document.body.appendChild(n);const r=document.createElement("style");r.textContent=`
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
  `,document.head.appendChild(r),document.getElementById("narrator-voice-btn").addEventListener("click",()=>{c=!c;const o=document.getElementById("narrator-voice-btn");o.innerHTML=c?'<i class="ti ti-volume"></i>':'<i class="ti ti-volume-off"></i>',o.classList.toggle("nc-muted",!c),c||speechSynthesis.cancel()}),document.getElementById("narrator-cc-btn").addEventListener("click",()=>{a=!a,document.getElementById("narrator-cc-btn").classList.toggle("nc-active",a);const i=document.getElementById("demo-narrator");i&&!a&&i.classList.remove("visible")}),speechSynthesis.getVoices().length===0&&speechSynthesis.addEventListener("voiceschanged",()=>{},{once:!0})}function h(n,r=2e3){return new Promise(o=>{if(!n){o();return}const i=n.replace(/<[^>]+>/g,"").replace(/&[^;]+;/g,""),t=Date.now();if(!c){setTimeout(o,r);return}speechSynthesis.cancel();const e=new SpeechSynthesisUtterance(i),s=m();s&&(e.voice=s),e.rate=f,e.pitch=p,e.volume=.85,e.onend=()=>{const l=Date.now()-t,u=Math.max(0,r-l);setTimeout(o,u)},e.onerror=()=>{const l=Date.now()-t;setTimeout(o,Math.max(0,r-l))},speechSynthesis.speak(e)})}function b(){speechSynthesis.cancel()}function y(){g(),document.getElementById("narrator-controls").classList.add("nc-visible")}function v(){const n=document.getElementById("narrator-controls");n&&n.classList.remove("nc-visible")}function x(){return a}export{h as a,b,v as h,x as i,y as s};
