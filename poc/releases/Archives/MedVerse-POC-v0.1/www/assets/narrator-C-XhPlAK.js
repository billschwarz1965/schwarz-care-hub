(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}})();let s=!0,i=!0,l=!1;const d=1,u=1;function f(){const n=speechSynthesis.getVoices(),c=["Zira","Google US English","Samantha","David","Alex"];for(const t of c){const o=n.find(e=>e.name.includes(t)&&e.lang.startsWith("en"));if(o)return o}return n.find(t=>t.lang.startsWith("en"))||n[0]||null}function p(){if(l)return;l=!0;const n=document.createElement("div");n.id="narrator-controls",n.innerHTML=`
    <button id="narrator-voice-btn" title="Toggle voice narration">
      <i class="ti ti-volume"></i>
    </button>
    <button id="narrator-cc-btn" title="Toggle closed captions" class="nc-active">
      CC
    </button>
  `,document.body.appendChild(n);const c=document.createElement("style");c.textContent=`
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
  `,document.head.appendChild(c),document.getElementById("narrator-voice-btn").addEventListener("click",()=>{s=!s;const t=document.getElementById("narrator-voice-btn");t.innerHTML=s?'<i class="ti ti-volume"></i>':'<i class="ti ti-volume-off"></i>',t.classList.toggle("nc-muted",!s),s||speechSynthesis.cancel()}),document.getElementById("narrator-cc-btn").addEventListener("click",()=>{i=!i,document.getElementById("narrator-cc-btn").classList.toggle("nc-active",i);const o=document.getElementById("demo-narrator");o&&!i&&o.classList.remove("visible")}),speechSynthesis.getVoices().length===0&&speechSynthesis.addEventListener("voiceschanged",()=>{},{once:!0})}function m(n){if(!s||!n)return;speechSynthesis.cancel();const c=n.replace(/<[^>]+>/g,"").replace(/&[^;]+;/g,""),t=new SpeechSynthesisUtterance(c),o=f();o&&(t.voice=o),t.rate=d,t.pitch=u,t.volume=.85,speechSynthesis.speak(t)}function g(){speechSynthesis.cancel()}function b(){p(),document.getElementById("narrator-controls").classList.add("nc-visible")}function h(){const n=document.getElementById("narrator-controls");n&&n.classList.remove("nc-visible")}function y(){return i}export{b as a,g as b,h,y as i,m as s};
