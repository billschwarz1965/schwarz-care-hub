import"./enhancements-yqlzMlQc.js";import{G as u,b as $,Q as r,C as h,a as q,f as I,E as y,N as k,d as M,e as S,i as L,j as C}from"./population-data-REeethYq.js";import{a as A}from"./orion-bridge-4A-0m1g1.js";import{s as N,a as o,b as G,h as H}from"./narrator-BE1zjzk_.js";import"./taxonomy-B-xcL3O-.js";let l="need",c=null,g=null;function a(e){const t=document.createElement("div");return t.textContent=e==null?"":String(e),t.innerHTML}function v(e,t){const n=Math.max(0,Math.min(1,e/100));if(t==="engagement"){const s=["#e1f5ee","#a7ddc9","#5cbb9c","#219873","#0f6e56"];return s[Math.min(s.length-1,Math.floor(n*s.length))]}const i=["#f0e6ff","#d7b3f5","#b366e8","#8f1fd6","#5c0aa0"];return i[Math.min(i.length-1,Math.floor(n*i.length))]}function D(e){return l==="need"?v(e.needIndex,"need"):l==="engagement"?v(e.engagementIndex,"engagement"):r[e.quadrant].color}function P(){const e=$(),t=e.quadrantCounts["education-gap"],n=e.quadrantCounts["evidence-gap"],i=[{num:e.totalCohort.toLocaleString(),label:"Deidentified cohort",cls:""},{num:e.stateCount,label:"Geographies",cls:""},{num:t,label:"Education-gap states",cls:"stat-danger"},{num:n,label:"Evidence-gap states",cls:"stat-warn"},{num:e.cohortInGapPct+"%",label:"Cohort in a gap",cls:"stat-warn"}];document.getElementById("stats-grid").innerHTML=i.map(s=>`
    <div class="stat-card ${s.cls}">
      <div class="stat-card-num">${a(s.num)}</div>
      <div class="stat-card-label">${a(s.label)}</div>
    </div>`).join("")}function m(){const e=u.map(t=>{const n=g&&t.quadrant!==g,i=c&&c.code===t.code;l==="engagement"?t.engagementIndex:t.needIndex;const s=`${t.name} — need ${t.needIndex}, engagement ${t.engagementIndex}, ${r[t.quadrant].label}`;return`<div class="tile${n?" dim":""}${i?" selected":""}"
      data-code="${a(t.code)}"
      style="grid-row:${t.row};grid-column:${t.col};background:${D(t)};"
      title="${a(s)}">${a(t.code)}</div>`}).join("");document.getElementById("tile-map").innerHTML=e,document.querySelectorAll(".tile[data-code]").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.code;c=c&&c.code===n?null:u.find(i=>i.code===n),m(),f(),c&&O(c)})}),R()}function R(){const e=document.getElementById("map-legend");if(l==="quadrant"){e.innerHTML=Object.values(r).sort((s,d)=>s.severity-d.severity).map(s=>`<div class="legend-item">
        <span class="legend-swatch" style="background:${s.color}"></span>${a(s.label)}
      </div>`).join("");return}const t=l==="engagement"?"engagement":"need",n=l==="engagement"?"Scientific engagement index":"Clinical need index",i=[10,30,50,70,90].map(s=>v(s,t));e.innerHTML=`<div class="legend-scale">
      <span>Low</span>
      <span class="legend-bar" style="background:linear-gradient(90deg,${i.join(",")})"></span>
      <span>High</span>
    </div>
    <div class="legend-item" style="margin-left:6px;">${a(n)} · 0–100</div>`}function f(){const e=document.getElementById("detail-panel");if(!c){e.innerHTML=`<div class="detail-card"><div class="detail-empty">
      <i class="ti ti-hand-click" style="font-size:26px;display:block;margin-bottom:8px;opacity:0.5;"></i>
      Select a geography to see its care-gap profile.<br>
      Detail is reported at state level — the aggregation floor.
    </div></div>`;return}const t=c,n=r[t.quadrant],i=h.map(d=>{const x=t.gapRates[d.id],p=q(t,d.id),E=p>0?"up":"down",T=(p>0?"+":"")+p+(d.unit==="mo"?"mo":"pp");return`<div class="gap-row">
      <span class="gap-name">${a(d.shortName)}
        ${d.safetyRelevant?'<span class="safety-pill">SAFETY</span>':""}</span>
      <span class="gap-val">${x}${d.unit==="mo"?" mo":"%"}</span>
      <span class="gap-delta ${E}">${a(T)}</span>
    </div>`}).join(""),s=I(t.region);e.innerHTML=`<div class="detail-card">
    <div class="detail-name">${a(t.name)}</div>
    <div class="detail-region">${a(t.region)} region · ${a(t.geoId)}</div>
    <div class="detail-quadrant" style="background:${n.color}">
      <i class="ti ti-target"></i> ${a(n.label)}
    </div>
    <div class="detail-metrics">
      <div class="dm"><div class="dm-num">${t.needIndex}</div><div class="dm-label">Need index</div></div>
      <div class="dm"><div class="dm-num">${t.engagementIndex}</div><div class="dm-label">Engagement</div></div>
      <div class="dm"><div class="dm-num">${t.cohort.toLocaleString()}</div><div class="dm-label">Cohort (aggregate)</div></div>
      <div class="dm"><div class="dm-num">${t.dermPer100k}</div><div class="dm-label">Derm / 100k</div></div>
    </div>
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:var(--text-muted);margin-bottom:2px;">Care gaps</div>
    ${i}
    <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.5;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
      <strong>Recommended:</strong> ${a(n.action)}
    </div>
    ${s.length?`<div style="font-size:11px;color:var(--text-muted);margin-top:10px;">
      <i class="ti ti-users"></i> ${s.length} scientific engagement candidate${s.length>1?"s":""} in ${a(t.region)}
    </div>`:""}
  </div>`}function b(){const t=$().quadrantCounts,n=i=>{const s=r[i],d=g===i;return`<div class="quad-cell" data-quad="${i}"
      style="background:${s.color}1a;border-color:${d?s.color:"var(--border)"};${d?`box-shadow:0 0 0 2px ${s.color}`:""}">
      <div class="quad-cell-label" style="color:${s.color}">${a(s.label)}</div>
      <div class="quad-cell-count" style="color:${s.color}">${t[i]}</div>
      <div class="quad-cell-desc">${a(s.description)}</div>
    </div>`};document.getElementById("quad-matrix").innerHTML=`
    <div></div>
    <div class="quad-axis">Low engagement (&lt;${y})</div>
    <div class="quad-axis">High engagement (≥${y})</div>
    <div class="quad-axis v">High need (≥${k})</div>
    ${n("education-gap")}
    ${n("evidence-gap")}
    <div class="quad-axis v">Low need</div>
    ${n("monitor")}
    ${n("well-served")}
  `,document.querySelectorAll(".quad-cell[data-quad]").forEach(i=>{i.addEventListener("click",()=>{g=g===i.dataset.quad?null:i.dataset.quad,b(),m()})})}function B(){const e=M(6),t=e.length?e[0].priorityScore:1;document.getElementById("edu-body").innerHTML=e.map(n=>`
    <tr>
      <td><strong>${a(n.region)}</strong></td>
      <td>${a(n.gap.shortName)} ${n.gap.safetyRelevant?'<span class="safety-pill">SAFETY</span>':""}</td>
      <td>${n.rate}${n.gap.unit==="mo"?" mo":"%"}</td>
      <td><span class="badge badge-danger">+${n.delta}${n.gap.unit==="mo"?"mo":"pp"}</span></td>
      <td><div class="bar-wrap">
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(n.priorityScore/t*100)}%;background:var(--accent)"></div></div>
        <span style="font-size:11px;font-weight:700;">${n.priorityScore}</span>
      </div></td>
    </tr>`).join("")}function j(){const e=S(),t=Math.max(...e.map(n=>n.eventsPer10k));document.getElementById("event-body").innerHTML=e.map(n=>{const i=n.eventsPer10k<t/3;return`<tr>
      <td><strong>${a(n.region)}</strong></td>
      <td>${n.needIndex}</td>
      <td>${n.totalEvents}</td>
      <td><div class="bar-wrap">
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(n.eventsPer10k/t*100)}%;background:${i?"var(--danger)":"var(--success)"}"></div></div>
        <span style="font-size:11px;font-weight:700;">${n.eventsPer10k}</span>
      </div></td>
      <td>${i?'<span class="badge badge-danger">Under-sited</span>':""}</td>
    </tr>`}).join("")}function z(){document.getElementById("gap-body").innerHTML=h.map(e=>{const t=e.gapType==="safety"?"badge-danger":e.gapType==="access"?"badge-warn":e.gapType==="diagnostic"?"badge-info":"badge-accent";return`<tr>
      <td><strong>${a(e.name)}</strong></td>
      <td><span class="badge ${t}">${a(e.gapType)}</span></td>
      <td>${e.nationalRate}${e.unit==="mo"?" mo":"%"}</td>
      <td style="color:var(--text-secondary);font-size:11.5px;">${a(e.definition)}</td>
      <td style="font-size:11.5px;">${a(e.educationNeed)}</td>
    </tr>`}).join("")}function F(){document.getElementById("cand-grid").innerHTML=L.map(e=>{const t=h.find(i=>i.id===e.regionalGapContext),n=e.name.replace(/^Dr\.\s*/,"").split(/\s+/).map(i=>i[0]).join("").slice(0,2);return`<div class="cand-card">
      <div class="cand-top">
        <div class="cand-av">${a(n)}</div>
        <div style="flex:1;">
          <div class="cand-name">${a(e.name)}</div>
          <div class="cand-meta">${a(e.specialty)} · ${a(e.institution)}</div>
          <div class="cand-meta">${a(e.region)} · ${a(e.state)}</div>
        </div>
      </div>
      <div class="cand-line"><strong>Scientific profile:</strong> ${a(e.scientificProfile)}</div>
      <div class="cand-line"><strong>Regional gap:</strong> ${a(t?t.name:e.regionalGapContext)}</div>
      <div class="cand-line"><strong>Information-seeking:</strong> ${e.informationSeeking.map(a).join("; ")}</div>
      <div class="cand-line"><strong>Suggested topic:</strong> ${a(e.suggestedTopic)}</div>
      <div class="cand-nocount"><i class="ti ti-shield-check"></i> Patient count withheld by Commercial Firewall</div>
      <div class="cand-basis"><i class="ti ti-microscope"></i> ${a(e.engagementBasis)}</div>
    </div>`}).join("")}function O(e){const t=C(e,1)[0];if(!t)return;const n=r[e.quadrant],i=t.gap.safetyRelevant?"SAFETY SIGNAL":e.quadrant==="education-gap"?"EDUCATION GAP":e.quadrant==="evidence-gap"?"EVIDENCE GAP":"FIELD INSIGHT";A({geoId:e.geoId,geoName:e.name,aggregationLevel:"state",cohortSize:e.cohort,gapId:t.gap.id,gapName:t.gap.name,gapRate:t.rate,nationalRate:t.gap.nationalRate,nationalDelta:t.delta,needIndex:e.needIndex,engagementIndex:e.engagementIndex,quadrant:e.quadrant,medicalAction:`${i}: ${e.name} — ${t.gap.shortName} at ${t.rate}${t.gap.unit==="mo"?"mo":"%"} vs ${t.gap.nationalRate}${t.gap.unit==="mo"?"mo":"%"} national. ${n.action}.`,educationNeed:t.gap.educationNeed,_source:"Population Intelligence"}),window.mvToast&&window.mvToast(`Population signal incorporated into medical insights and analytics — ${e.name}`,"info")}function V(){document.querySelectorAll(".metric-btn[data-metric]").forEach(e=>{e.addEventListener("click",()=>{l=e.dataset.metric,document.querySelectorAll(".metric-btn").forEach(n=>n.classList.remove("active")),e.classList.add("active");const t={need:"Map A is clinical need from deidentified RWD — care gaps, diagnostic delay, undertreatment and guideline non-adherence, aggregated to state level.",engagement:"Map B is scientific engagement rolled up from MedVerse behavioural signals — content consumption, Med Info inquiries and congress activity, joined at region level only.",quadrant:"The delta. High need with low engagement is an education gap. High need with high engagement means the evidence is not answering the question being asked."};document.getElementById("map-sub").textContent=t[l],m()})})}async function w(){const e=document.getElementById("demo-play-btn");e.disabled=!0,N();try{await o("Population Intelligence brings deidentified real-world evidence into MedVerse. Let's start with clinical need."),document.querySelector('[data-metric="need"]').click(),await o("Map A shows where the clinical need is. Nine hundred and eleven thousand patients in the deidentified moderate-to-severe cohort, mapped to state level. The Southeast and Appalachia carry the highest burden."),c=u.find(n=>n.code==="MS"),m(),f(),await o("Mississippi is the clearest case. Need index eighty-four. Eighty percent of the moderate-to-severe cohort remains on prolonged topical therapy — thirty-nine points above the national rate. Under one dermatologist per hundred thousand people."),await o("Notice what is not here. There is no patient count attached to any named physician. Patient Services holds that linkage. The Commercial Firewall withholds it, because a patient opportunity figure cannot be the trigger for a medical engagement."),document.querySelector('[data-metric="engagement"]').click(),await o("Map B is the half only MedVerse has — scientific engagement. Content consumption, medical information inquiries, congress activity. Mississippi scores thirteen out of one hundred."),document.querySelector('[data-metric="quadrant"]').click(),await o("Overlay the two and the delta appears. Twenty-two states sit in the education gap quadrant — high clinical need, low scientific engagement. That is the Medical Affairs action list."),await o("Four states show high need and high engagement. Those clinicians are looking and the gap persists anyway. That is not an education problem, it is an evidence problem — it routes to publication planning and real-world evidence study design."),document.getElementById("event-body").scrollIntoView({behavior:"smooth",block:"center"}),await o("The event geography makes the mismatch concrete. The Southeast carries the highest need in the country and has hosted three medical events in eighteen months. The Northeast, with lower need, hosted twenty-nine. Point one four events per ten thousand patients versus two point nine — a twenty-fold difference in siting."),document.getElementById("cand-grid").scrollIntoView({behavior:"smooth",block:"center"}),await o("Engagement candidates are ranked from care-gap context, scientific profile, and the clinician's own information-seeking. Doctor Okonkwo publishes on health-system access barriers and practises in the highest-need geography. That selection is independently derivable — it needs no patient count, which is exactly what makes it defensible."),await o("Real-world data tells us where the clinical need is. MedVerse tells us where the scientific engagement is. The gap between those two maps is what Medical Affairs is uniquely positioned to close.")}finally{G(),H(),e.disabled=!1}}function _(){P(),m(),f(),b(),B(),j(),z(),F(),V(),document.getElementById("demo-play-btn").addEventListener("click",w)}_();window.location.hash==="#autoplay"&&setTimeout(w,800);
