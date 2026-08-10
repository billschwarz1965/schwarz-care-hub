let c=!0,s=!0,d=!1;const p=.92,f=1;function b(){const t=speechSynthesis.getVoices(),n=["Microsoft Jenny Online","Microsoft Aria Online","Microsoft Guy Online","Microsoft Jenny","Microsoft Aria","Google US English","Samantha","Alex","Microsoft Zira","Microsoft David"];for(const e of n){const o=t.find(i=>i.name.includes(e)&&i.lang.startsWith("en"));if(o)return o}return t.find(e=>e.lang.startsWith("en"))||t[0]||null}function m(){if(d)return;d=!0;const t=document.createElement("div");t.id="narrator-controls",t.innerHTML=`
    <button id="narrator-voice-btn" title="Toggle voice narration">
      <i class="ti ti-volume"></i>
    </button>
    <button id="narrator-cc-btn" title="Toggle closed captions" class="nc-active">
      CC
    </button>
  `,document.body.appendChild(t);const n=document.createElement("style");n.textContent=`
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
  `,document.head.appendChild(n),document.getElementById("narrator-voice-btn").addEventListener("click",()=>{c=!c;const e=document.getElementById("narrator-voice-btn");e.innerHTML=c?'<i class="ti ti-volume"></i>':'<i class="ti ti-volume-off"></i>',e.classList.toggle("nc-muted",!c),c||speechSynthesis.cancel()}),document.getElementById("narrator-cc-btn").addEventListener("click",()=>{s=!s,document.getElementById("narrator-cc-btn").classList.toggle("nc-active",s);const o=document.getElementById("demo-narrator");o&&!s&&o.classList.remove("visible")}),speechSynthesis.getVoices().length===0&&speechSynthesis.addEventListener("voiceschanged",()=>{},{once:!0})}function g(t,n=2e3){return new Promise(e=>{if(!t){e();return}const o=t.replace(/<[^>]+>/g,"").replace(/&[^;]+;/g,""),i=Date.now();if(!c){setTimeout(e,n);return}speechSynthesis.cancel();const r=new SpeechSynthesisUtterance(o),l=b();l&&(r.voice=l),r.rate=p,r.pitch=f,r.volume=.85,r.onend=()=>{const a=Date.now()-i,u=Math.max(0,n-a);setTimeout(e,u)},r.onerror=()=>{const a=Date.now()-i;setTimeout(e,Math.max(0,n-a))},speechSynthesis.speak(r)})}function h(){speechSynthesis.cancel()}function y(){m(),document.getElementById("narrator-controls").classList.add("nc-visible")}function v(){const t=document.getElementById("narrator-controls");t&&t.classList.remove("nc-visible")}function x(){return s}export{g as a,h as b,v as h,x as i,y as s};
