import"./enhancements-DokCBmAo.js";import{i as B,s as N,a as O,b as q,h as z}from"./narrator-Gu1jBQbu.js";import{b as C}from"./orion-bridge-Bxojkdb6.js";const P=document.getElementById("hub"),S=document.getElementById("back-btn"),j=document.getElementById("header-home"),M=document.getElementById("main-scroll");function w(){document.querySelectorAll(".agent-panel").forEach(t=>t.classList.remove("active")),P.style.display="",S.classList.remove("visible"),M.scrollTop=0}function v(t){P.style.display="none",document.querySelectorAll(".agent-panel").forEach(e=>e.classList.remove("active"));const s=document.getElementById(`panel-${t}`);s&&s.classList.add("active"),S.classList.add("visible"),M.scrollTop=0}document.querySelectorAll(".agent-card").forEach(t=>{t.addEventListener("click",()=>v(t.dataset.agent))});S.addEventListener("click",w);j.addEventListener("click",t=>{t.preventDefault(),w()});const b=document.getElementById("hub-search-input"),I=document.getElementById("hub-search-btn"),L=document.getElementById("hub-search-hints"),W=[{text:"Prep for Dr. Chen meeting",agent:"precall"},{text:"My territory this week",agent:"territory"},{text:"Dupixent vs abrocitinib H2H data",agent:"competitive"},{text:"Compliance check for lunch & learn",agent:"compliance"},{text:"EADV 2026 congress plan",agent:"congress"},{text:"Dr. Nakamura KOL profile",agent:"kol"}];L&&W.forEach(t=>{const s=document.createElement("button");s.className="hub-search-hint-chip",s.textContent=t.text,s.addEventListener("click",()=>{b.value=t.text,$(t.text)}),L.appendChild(s)});I&&I.addEventListener("click",()=>{const t=b.value.trim();t&&$(t)});b&&b.addEventListener("keydown",t=>{if(t.key==="Enter"){const s=b.value.trim();s&&$(s)}});function $(t){const s=t.toLowerCase(),e=[{keywords:["prep","briefing","look up","hcp profile","pre-call","meeting with dr"],agent:"precall",prefill:s},{keywords:["territory","dashboard","this week","upcoming","my meetings","stats"],agent:"territory"},{keywords:["signal","post-call","submit","report call","after meeting"],agent:"postcall"},{keywords:["medical info","unsolicited","dosing","request letter","mir "],agent:"medinfo"},{keywords:["competitive","h2h","head-to-head","versus"," vs ","competitor","abrocitinib","upadacitinib","rinvoq","cibinqo"],agent:"competitive"},{keywords:["congress","eadv","acr ","aaaai","ats ","ash ","symposium","poster"],agent:"congress"},{keywords:["kol","key opinion","profile","influence","publication","speaker"],agent:"kol",prefill:s},{keywords:["compliance","compliant","fair balance","gift","meal","guardrail"],agent:"compliance"},{keywords:["literature","pubmed","publication","journal","meta-analysis","evidence","paper"],agent:"literature"},{keywords:["scout","monitor","alert","new paper","guideline update","recent pub"],agent:"lit-scout"},{keywords:["disease","pathophysiology","mechanism","treatment landscape","cross-ta"],agent:"disease-nav"},{keywords:["orion","signal","intelligence","trending","engagement intel","heatmap"],agent:"orion"}];for(const n of e)if(n.keywords.some(i=>s.includes(i))){v(n.agent),n.prefill&&J(n.agent,t);return}v("precall"),document.getElementById("pc-hcp-search").value=t}function J(t,s){if(t==="precall"){const e=s.match(/dr\.?\s*(\w+)/i);e&&(document.getElementById("pc-hcp-search").value="Dr. "+e[1].charAt(0).toUpperCase()+e[1].slice(1))}else if(t==="kol"){const e=s.match(/dr\.?\s*(\w+)/i);e&&(document.getElementById("kol-name").value="Dr. "+e[1].charAt(0).toUpperCase()+e[1].slice(1))}}function a(t){const s=document.createElement("div");return s.textContent=t,s.innerHTML}function c(t){return new Promise(s=>setTimeout(s,t))}function V(t){return new Date(t+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}function m(t){return`<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:${t};"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Processing…</div></div>`}const A={chen:{name:"Dr. Sarah Chen, MD",specialty:"Dermatology",institution:"Massachusetts General Hospital",city:"Boston, MA",tier:"Tier 1 — KOL",lastMeeting:"2026-06-12",meetingType:"Scientific Exchange",topics:["Dupixent long-term AD data","Type 2 inflammation cross-TA"],interests:["Pediatric AD management","Biologic sequencing","Real-world evidence"],orionSignals:14,engagement:"High",recentQueries:["Dupilumab vs abrocitinib H2H data","AD in children under 5","EASI-75 durability beyond 52 weeks"],nextAction:"Schedule pre-EADV briefing on CRSwNP data",trials:["LIBERTY AD PED (site PI)","DUPIXENT REAL (participating)"],publications:3,congressAttendance:["AAD 2026","EADV 2025"],kolScore:87,hIndex:24,advisoryBoards:6,speakerPrograms:4},torres:{name:"Dr. Michael Torres, MD, PhD",specialty:"Rheumatology",institution:"Johns Hopkins Hospital",city:"Baltimore, MD",tier:"Tier 2 — Regional Influencer",lastMeeting:"2026-05-28",meetingType:"Advisory Board",topics:["Sarilumab monotherapy data","IL-6 pathway in RA fatigue"],interests:["Biologic monotherapy","Patient-reported outcomes","RA comorbidities"],orionSignals:8,engagement:"Moderate",recentQueries:["MONARCH trial sarilumab vs adalimumab","IL-6 and fatigue mechanisms"],nextAction:"Share MONARCH long-term extension data when available",trials:[],publications:1,congressAttendance:["ACR 2025"],kolScore:62,hIndex:15,advisoryBoards:2,speakerPrograms:1},nakamura:{name:"Dr. Emily Nakamura, MD",specialty:"Allergy & Immunology",institution:"Stanford Health Care",city:"Palo Alto, CA",tier:"Tier 1 — Emerging KOL",lastMeeting:"2026-07-03",meetingType:"Lunch & Learn (group)",topics:["Type 2 inflammation across diseases","Dupixent in asthma + AD comorbidity"],interests:["Cross-TA immunology","Shared pathway therapeutics","Eosinophilic diseases"],orionSignals:22,engagement:"Very High",recentQueries:["Type 2 inflammation cross-disease connections","EoE emerging treatments","Dupixent asthma + CRSwNP overlap"],nextAction:"Invite to EADV 2026 satellite symposium; share EoE Phase 3 data",trials:["LIBERTY CUPID (referring)"],publications:5,congressAttendance:["AAAAI 2026","AAD 2026","EADV 2025"],kolScore:91,hIndex:31,advisoryBoards:8,speakerPrograms:6}};function k(t){const s=t.toLowerCase().replace(/^dr\.?\s*/,"");return Object.values(A).find(e=>e.name.toLowerCase().includes(s)||Object.keys(A).some(n=>s.includes(n)&&A[n]===e))}const E={upcomingMeetings:[{hcp:"Dr. Sarah Chen",date:"2026-08-12",type:"Pre-call prep",topic:"EADV preview + CRSwNP data",status:"confirmed"},{hcp:"Dr. Emily Nakamura",date:"2026-08-14",type:"Scientific Exchange",topic:"EoE Phase 3 deep-dive",status:"confirmed"},{hcp:"Dr. James Liu",date:"2026-08-18",type:"Lunch & Learn",topic:"Dupixent in pediatric AD",status:"pending"},{hcp:"Dr. Michael Torres",date:"2026-08-22",type:"Virtual meeting",topic:"MONARCH extension data",status:"requested"}],alerts:[{type:"priority",text:"Dr. Chen queried competitor landscape — H2H data request",time:"2h ago"},{type:"signal",text:"Dr. Nakamura showed cross-TA interest (EoE + asthma overlap)",time:"1d ago"},{type:"congress",text:"EADV 2026 agenda released — 3 HCPs in your territory attending",time:"3d ago"}],stats:{totalHcps:47,activeEngagements:12,signalsThisMonth:38,meetingsThisWeek:3}};document.getElementById("pc-submit").addEventListener("click",()=>{const t=document.getElementById("pc-hcp-search").value.trim();if(!t){alert("Please enter an HCP name.");return}const s=document.getElementById("pc-results");s.innerHTML=m("var(--accent)"),setTimeout(()=>{const e=k(t);if(!e){s.innerHTML=`<div class="result-empty"><i class="ti ti-search-off"></i>No HCP found matching "${a(t)}". Try: Dr. Sarah Chen, Dr. Torres, or Dr. Nakamura.</div>`;return}const n=e.engagement==="Very High"?"var(--success)":e.engagement==="High"?"var(--orion-accent)":"var(--warning)";s.innerHTML=`
      <div class="briefing-card">
        <div class="briefing-header">
          <div class="briefing-avatar"><i class="ti ti-user-circle"></i></div>
          <div class="briefing-name-block">
            <div class="briefing-name">${a(e.name)}</div>
            <div class="briefing-meta">${a(e.specialty)} · ${a(e.institution)}</div>
            <div class="briefing-meta">${a(e.city)}</div>
          </div>
          <div class="briefing-badges">
            <span class="badge tier">${a(e.tier)}</span>
            <span class="badge engagement" style="color:${n};border-color:${n};">${a(e.engagement)} engagement</span>
          </div>
        </div>
        <div class="briefing-grid">
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-history"></i> Last Interaction</div>
            <div class="section-body">
              <div class="detail-row"><span class="detail-label">Date</span><span>${a(e.lastMeeting)}</span></div>
              <div class="detail-row"><span class="detail-label">Type</span><span>${a(e.meetingType)}</span></div>
              <div class="detail-row"><span class="detail-label">Topics</span><span>${e.topics.map(i=>a(i)).join(", ")}</span></div>
            </div>
          </div>
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-bulb"></i> Scientific Interests</div>
            <div class="section-body">${e.interests.map(i=>`<span class="interest-chip">${a(i)}</span>`).join("")}</div>
          </div>
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-radar-2"></i> Orion Intelligence (${e.orionSignals} signals)</div>
            <div class="section-body">
              ${e.recentQueries.map(i=>`<div class="query-item"><i class="ti ti-message-dots" style="color:var(--accent);font-size:13px;"></i> ${a(i)}</div>`).join("")}
            </div>
          </div>
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-flask"></i> Trial Involvement</div>
            <div class="section-body">
              ${e.trials.length?e.trials.map(i=>`<div class="trial-item">${a(i)}</div>`).join(""):'<div class="detail-muted">No active trial participation</div>'}
            </div>
          </div>
          <div class="briefing-section">
            <div class="section-title"><i class="ti ti-calendar-event"></i> Congress Activity</div>
            <div class="section-body">
              <div class="detail-row"><span class="detail-label">Publications</span><span>${e.publications} recent</span></div>
              <div class="detail-row"><span class="detail-label">Attended</span><span>${e.congressAttendance.join(", ")}</span></div>
            </div>
          </div>
          <div class="briefing-section highlight">
            <div class="section-title"><i class="ti ti-target-arrow"></i> Recommended Next Action</div>
            <div class="section-body"><div class="next-action">${a(e.nextAction)}</div></div>
          </div>
        </div>
      </div>`,C({topic:`Pre-Call Briefing — ${e.name}`,intent:"Clinical decision support",diseaseArea:e.interests[0]||"General",depth:"Deep engagement",orionAction:`Queue for MSL follow-up — pre-call intelligence generated for ${e.name} (${e.tier})`,queries:[`Pre-call briefing: ${e.name}`],contentAccessed:[`${e.name} HCP Profile`,"Orion Signal History"],_source:"MSL Copilot"})},1e3)});document.getElementById("pc-hcp-search").addEventListener("keydown",t=>{t.key==="Enter"&&document.getElementById("pc-submit").click()});function K(){const t=document.getElementById("territory-content");if(!t)return;const s=E.stats;t.innerHTML=`
    <div class="stats-grid">
      <div class="stat-tile"><div class="stat-num">${s.totalHcps}</div><div class="stat-label">HCPs in Territory</div></div>
      <div class="stat-tile"><div class="stat-num">${s.activeEngagements}</div><div class="stat-label">Active Engagements</div></div>
      <div class="stat-tile"><div class="stat-num">${s.signalsThisMonth}</div><div class="stat-label">Orion Signals (Aug)</div></div>
      <div class="stat-tile"><div class="stat-num">${s.meetingsThisWeek}</div><div class="stat-label">Meetings This Week</div></div>
    </div>
    <div class="territory-grid">
      <div class="territory-section">
        <h3><i class="ti ti-calendar-event"></i> Upcoming Meetings</h3>
        <div id="dash-meetings"></div>
      </div>
      <div class="territory-section">
        <h3><i class="ti ti-bell-ringing"></i> Orion Alerts</h3>
        <div id="dash-alerts"></div>
      </div>
    </div>`;const e=document.getElementById("dash-meetings");e.innerHTML=E.upcomingMeetings.map(i=>{const r=i.status==="confirmed"?"success":i.status==="pending"?"warning":"muted",o=i.status==="confirmed"?"check":i.status==="pending"?"clock":"send";return`<div class="meeting-card">
      <div class="meeting-date">${V(i.date)}</div>
      <div class="meeting-info">
        <div class="meeting-hcp">${i.hcp}</div>
        <div class="meeting-topic">${i.topic}</div>
        <div class="meeting-meta"><span class="meeting-type">${i.type}</span><span class="meeting-status ${r}"><i class="ti ti-${o}"></i> ${i.status}</span></div>
      </div>
    </div>`}).join("");const n=document.getElementById("dash-alerts");n.innerHTML=E.alerts.map(i=>{const r=i.type==="priority"?"alert-triangle":i.type==="signal"?"radar-2":"calendar-event",o=i.type==="priority"?"var(--danger)":i.type==="signal"?"var(--orion-accent)":"var(--accent)";return`<div class="alert-card"><i class="ti ti-${r}" style="color:${o};font-size:16px;flex-shrink:0;margin-top:2px;"></i><div class="alert-text"><div>${i.text}</div><div class="alert-time">${i.time}</div></div></div>`}).join("")}K();const f=document.getElementById("sig-hcp"),y=document.getElementById("sig-type"),d=document.getElementById("sig-submit");[f,y].forEach(t=>t.addEventListener("input",()=>{d.disabled=!(f.value.trim()&&y.value)}));y.addEventListener("change",()=>{d.disabled=!(f.value.trim()&&y.value)});let x=[];d.addEventListener("click",()=>{const t=f.value.trim(),s=y.value,e=document.getElementById("sig-meeting-type").value,n=document.getElementById("sig-notes").value.trim();!t||!s||(d.disabled=!0,d.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Submitting…',setTimeout(()=>{d.innerHTML='<i class="ti ti-check"></i> Signal Submitted',d.style.background="var(--orion-accent)";const i={hcp:t,type:s,meetingType:e,notes:n,time:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})};x.unshift(i);const r=document.getElementById("sig-results");r.innerHTML=`
      <div class="result-card" style="background:var(--orion-bg);border-color:#9fe1cb;">
        <div class="result-card-header"><div class="result-title" style="color:#085041;">Signal Submitted Successfully</div><span class="result-badge badge-orion">Orion</span></div>
        <div class="result-body" style="color:#085041;">
          <p><strong>HCP:</strong> ${a(t)}</p>
          <p><strong>Signal:</strong> ${a(s)}</p>
          ${e?`<p><strong>Meeting:</strong> ${a(e)}</p>`:""}
          ${n?`<p><strong>Notes:</strong> ${a(n)}</p>`:""}
          <p style="margin-top:8px;"><i class="ti ti-arrow-right" style="font-size:13px;"></i> Routed to Orion → MSL field team dashboard</p>
        </div>
      </div>
      ${x.length>1?'<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Previous signals this session:</div>':""}
      ${x.slice(1).map(o=>`<div class="signal-card">
        <div class="signal-header"><div class="signal-dot"></div><span class="signal-time">${o.time}</span></div>
        <div class="signal-topic">${a(o.type)}</div>
        <div class="signal-row"><span class="signal-label">HCP</span><span class="signal-value">${a(o.hcp)}</span></div>
      </div>`).join("")}`,setTimeout(()=>{d.innerHTML='<i class="ti ti-radar-2"></i> Submit Signal to Orion',d.style.background="",d.disabled=!0,f.value="",y.value="",document.getElementById("sig-meeting-type").value="",document.getElementById("sig-notes").value=""},2e3)},1200))});const Q={"Dupixent (dupilumab)":{"Dosing & Administration":{title:"Dupixent Dosing & Administration",body:"<strong>Adults (Atopic Dermatitis):</strong> Loading dose 600mg (two 300mg injections), followed by 300mg every 2 weeks (Q2W) subcutaneously.<br><br><strong>Adolescents (12–17 years, ≥60kg):</strong> Same as adult dosing.<br><br><strong>Children (6–11 years):</strong> Weight-based — ≥60kg: adult dose; 30–59kg: 400mg loading → 200mg Q2W; 15–29kg: 600mg loading → 300mg Q4W.<br><br><strong>Administration:</strong> Subcutaneous injection into thigh, abdomen (except 2 inches around navel), or upper arm. Rotate injection sites. Allow to reach room temperature (45 min) before injection.",citations:["Dupixent USPI §2.1 (Rev 03/2026)","Sanofi Data on File — Pediatric Dosing Guide"]},"Safety / AE Profile":{title:"Dupixent Safety Profile",body:"<strong>Most common adverse reactions (≥1%):</strong> Injection site reactions (10%), conjunctivitis (10% AD, 3% asthma), keratitis (1%), oral herpes, eosinophilia.<br><br><strong>Serious warnings:</strong> Hypersensitivity reactions (rare, <1%). Do not discontinue systemic corticosteroids abruptly.<br><br><strong>Long-term safety:</strong> 3+ year data from LIBERTY AD CHRONOS demonstrate consistent safety. No routine laboratory monitoring required. No increased malignancy or serious infection signal vs placebo.",citations:["LIBERTY AD SOLO 1&2 (Simpson et al., NEJM 2016)","LIBERTY AD CHRONOS 3-year extension data"]},"Pregnancy / Lactation":{title:"Dupixent in Pregnancy & Lactation",body:"<strong>Pregnancy:</strong> Limited human data. Animal reproduction studies (monkeys) showed no adverse developmental effects at doses up to 10x human dose. IgG antibodies cross the placenta — transfer increases in third trimester.<br><br><strong>Lactation:</strong> No data on presence in human milk. IgG is present in human milk; clinical significance unknown.<br><br><strong>Recommendation:</strong> Weigh benefits vs risks. Pregnancy exposure registry available (OTIS Autoimmune Diseases in Pregnancy Study).",citations:["Dupixent USPI §8.1–8.2 (Rev 03/2026)"]}}};document.getElementById("mi-submit").addEventListener("click",()=>{const t=document.getElementById("mi-hcp").value.trim(),s=document.getElementById("mi-type").value,e=document.getElementById("mi-product").value,n=document.getElementById("mi-question").value.trim();if(!s||!e){alert("Please select request type and product.");return}const i=document.getElementById("mi-results");i.innerHTML=m("#be185d"),setTimeout(()=>{const r=Q[e],o=r==null?void 0:r[s];o?i.innerHTML=`
        <div class="result-card">
          <div class="result-card-header"><div class="result-title">${o.title}</div><span class="result-badge badge-accent">Medical Information</span></div>
          <div class="result-body">${o.body}</div>
          <div class="result-meta">${o.citations.map(p=>`<span class="result-meta-item"><i class="ti ti-file-text"></i> ${a(p)}</span>`).join("")}</div>
        </div>
        <div class="result-card" style="background:var(--warning-bg);border-color:#fde68a;">
          <div class="result-card-header"><div class="result-title" style="color:var(--warning);">Compliance Notice</div><span class="result-badge badge-warning">Required</span></div>
          <div class="result-body" style="color:var(--warning);">This response is for unsolicited medical information requests only. All information is from approved labeling and published literature. Response must be documented and filed per SOP-MIR-001. ${t?`Requesting HCP: ${a(t)}`:"HCP not specified — document before sending."}</div>
        </div>
        <div class="result-actions">
          <button class="form-btn form-btn-primary" style="font-size:11px;padding:7px 14px;"><i class="ti ti-download"></i> Export Response Letter</button>
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:7px 14px;"><i class="ti ti-mail"></i> Send to HCP</button>
        </div>`:i.innerHTML=`
        <div class="result-card">
          <div class="result-card-header"><div class="result-title">Response Pending</div><span class="result-badge badge-info">In Queue</span></div>
          <div class="result-body">
            <p>A detailed response for <strong>${a(s)}</strong> regarding <strong>${a(e)}</strong> is being prepared.</p>
            ${n?`<p><strong>Question details:</strong> ${a(n)}</p>`:""}
            <p style="margin-top:8px;">Standard MIR response time: 24–48 hours. For urgent requests, contact Medical Information at 1-800-633-1610.</p>
          </div>
        </div>`},1200)});const U={"Dupixent (dupilumab)|Abrocitinib (Cibinqo) — Pfizer":{ta:"Atopic Dermatitis",h2hTrial:"JADE DARE (Pfizer-sponsored)",summary:"JADE DARE compared abrocitinib 200mg vs dupilumab 300mg in adults with moderate-to-severe AD. Co-primary endpoints: EASI-90 response and PP-NRS4 at Week 12.",table:[["Endpoint","Dupilumab 300mg Q2W","Abrocitinib 200mg QD","Significance"],["EASI-90 Wk12","39.0%","48.4%","Abrocitinib met superiority"],["PP-NRS4 Wk2","24.5%","49.1%","Abrocitinib met superiority (itch speed)"],["EASI-90 Wk26*","~50%","~45%","Dupilumab numerically higher at Wk26"],["Safety — SAEs","3.0%","4.7%","Higher SAE rate with abrocitinib"],["Herpes zoster","0.3%","2.8%","10x higher with JAK inhibitor"],["Lab monitoring","Not required","Required (CBC, lipids, LFTs)","Dupilumab advantage"]],keyMessages:["JADE DARE was Pfizer-sponsored and powered for Week 12 — favoring rapid-onset JAK mechanism","Dupilumab durability at Week 26+ shows sustained/improving response vs JAK plateau","Safety profile strongly favors dupilumab: no JAK-class warnings (VTE, MACE, malignancy, herpes zoster)","Dupilumab requires no routine lab monitoring — significant practical advantage","FDA boxed warning on all JAK inhibitors (not on dupilumab)"]},"Dupixent (dupilumab)|Upadacitinib (Rinvoq) — AbbVie":{ta:"Atopic Dermatitis",h2hTrial:"Heads Up (AbbVie-sponsored)",summary:"Heads Up compared upadacitinib 30mg vs dupilumab in adults with moderate-to-severe AD. Primary: EASI-75 at Week 16.",table:[["Endpoint","Dupilumab 300mg Q2W","Upadacitinib 30mg QD","Significance"],["EASI-75 Wk16","61.1%","71.0%","Upadacitinib met superiority"],["EASI-90 Wk16","38.8%","60.6%","Upadacitinib met superiority"],["Safety — SAEs","5.0%","8.1%","Higher SAE rate with upadacitinib"],["Acne (new onset)","1.6%","15.8%","10x higher with upadacitinib"],["CPK elevation","1.8%","5.7%","3x higher with upadacitinib"],["Lab monitoring","Not required","Required (CBC, lipids, LFTs, CPK)","Dupilumab advantage"]],keyMessages:["Heads Up used 30mg upadacitinib (higher dose) — 15mg dose not tested H2H","Safety profile strongly favors dupilumab across all metrics","JAK-class boxed warning applies to upadacitinib (not dupilumab)","Long-term data: dupilumab has 5+ years; upadacitinib has limited long-term data","Acne and CPK elevations are dose-limiting for upadacitinib in clinical practice"]},"Kevzara (sarilumab)|Tocilizumab (Actemra) — Roche":{ta:"Rheumatoid Arthritis",h2hTrial:"MONARCH (Sanofi-sponsored)",summary:"MONARCH compared sarilumab 200mg Q2W vs adalimumab 40mg Q2W as monotherapy in RA. Primary: DAS28-ESR change at Week 24.",table:[["Endpoint","Sarilumab 200mg Q2W","Adalimumab 40mg Q2W","Significance"],["DAS28-ESR Δ Wk24","-3.28","-2.20","Sarilumab superior (p<0.0001)"],["ACR20 Wk24","71.7%","58.4%","Sarilumab superior"],["HAQ-DI Δ Wk24","-0.61","-0.43","Sarilumab superior"],["DAS28 remission","26.6%","7.0%","Sarilumab 4x higher remission"]],keyMessages:["MONARCH is the only H2H monotherapy trial showing superiority vs adalimumab — a key differentiator","Sarilumab particularly suited for patients who cannot tolerate MTX","IL-6 pathway addresses both joint and systemic RA manifestations including fatigue","Note: comparison is vs adalimumab, not tocilizumab — different IL-6 mechanism (receptor vs cytokine)"]}};document.getElementById("ci-submit").addEventListener("click",()=>{const t=document.getElementById("ci-product").value,s=document.getElementById("ci-competitor").value;if(!t||!s){alert("Please select both a Sanofi product and competitor.");return}const e=document.getElementById("ci-results");e.innerHTML=m("#b45309"),setTimeout(()=>{const n=`${t}|${s}`,i=U[n];if(!i){e.innerHTML=`<div class="result-card"><div class="result-card-header"><div class="result-title">No H2H Data Available</div><span class="result-badge badge-warning">Limited</span></div><div class="result-body"><p>No direct head-to-head comparison data found for <strong>${a(t)}</strong> vs <strong>${a(s)}</strong>.</p><p style="margin-top:8px;">Contact your Medical Affairs team for indirect comparison data or network meta-analyses. You can also check the Literature Intelligence module for published comparisons.</p></div></div>`;return}e.innerHTML=`
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${a(i.h2hTrial)}</div><span class="result-badge badge-accent">${a(i.ta)}</span></div>
        <div class="result-body"><p>${i.summary}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Comparative Data</div><span class="result-badge badge-info">H2H Trial</span></div>
        <div class="result-body">
          <table class="comp-table">
            <thead><tr>${i.table[0].map(r=>`<th>${r}</th>`).join("")}</tr></thead>
            <tbody>${i.table.slice(1).map(r=>`<tr>${r.map((o,p)=>`<td${p===1?' class="comp-highlight"':""}>${o}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
      <div class="result-card" style="background:var(--accent-light);border-color:var(--accent)33;">
        <div class="result-card-header"><div class="result-title" style="color:var(--accent-text);">Key Scientific Exchange Messages</div></div>
        <div class="result-body"><ul>${i.keyMessages.map(r=>`<li style="margin-bottom:6px;">${r}</li>`).join("")}</ul></div>
      </div>`},1200)});const Y={"EADV 2026 — European Academy of Dermatology (Sep 2026)":{fullName:"EADV 2026",location:"Vienna, Austria",dates:"Sep 23–27, 2026",sanofiPresence:"2 oral presentations, 5 poster presentations, 1 satellite symposium",hcpsAttending:["Dr. Sarah Chen (site PI — LIBERTY AD PED)","Dr. Emily Nakamura (invited speaker)"],presentations:[{title:"LIBERTY AD CHRONOS: 4-Year Safety & Efficacy of Dupilumab in Adults",type:"Oral",session:"Late-Breaking Session 2",presenter:"Prof. Eric Simpson"},{title:"Real-World Effectiveness of Dupilumab in Pediatric AD: DUPIXENT REAL Registry",type:"Poster",session:"E-Poster Hall",presenter:"Dr. Amy Paller"},{title:"Dupilumab in Prurigo Nodularis: PRIME 2 Trial 52-Week Results",type:"Oral",session:"Clinical Trials Session",presenter:"Prof. Shawn Kwatra"}],actions:["Schedule 1:1 with Dr. Chen to preview CRSwNP poster data","Confirm Dr. Nakamura satellite symposium invitation","Prepare LIBERTY AD CHRONOS 4-year talking points","Book exhibition booth meeting slots"]},"ACR 2026 — American College of Rheumatology (Nov 2026)":{fullName:"ACR 2026",location:"Washington, DC",dates:"Nov 14–18, 2026",sanofiPresence:"1 oral presentation, 3 poster presentations",hcpsAttending:["Dr. Michael Torres (Advisory Board member)"],presentations:[{title:"MONARCH Long-Term Extension: Sarilumab Monotherapy Durability at 3 Years",type:"Oral",session:"RA Treatment Session",presenter:"Prof. Gerd Burmester"},{title:"Sarilumab Impact on Patient-Reported Fatigue in RA: MONARCH PRO Analysis",type:"Poster",session:"PROs in Rheumatology",presenter:"Dr. Vibeke Strand"}],actions:["Share MONARCH extension data with Dr. Torres pre-congress","Prepare IL-6 fatigue mechanism slide deck","Register for competitor symposia (adalimumab biosimilar landscape)"]}};document.getElementById("cg-submit").addEventListener("click",()=>{const t=document.getElementById("cg-congress").value;if(!t){alert("Please select a congress.");return}const s=document.getElementById("cg-results");s.innerHTML=m("#0369a1"),setTimeout(()=>{const e=Y[t];if(!e){s.innerHTML=`<div class="result-card"><div class="result-card-header"><div class="result-title">Planning in Progress</div><span class="result-badge badge-info">Coming Soon</span></div><div class="result-body"><p>Congress planning data for <strong>${a(t)}</strong> is not yet available. Check back closer to the event or contact your Medical Affairs lead.</p></div></div>`;return}const n=e.fullName.toLowerCase().replace(/\s+/g,"-");s.innerHTML=`
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${a(e.fullName)}</div><span class="result-badge badge-info">${a(e.dates)}</span></div>
        <div class="result-body">
          <p><strong>Location:</strong> ${a(e.location)}</p>
          <p><strong>Sanofi presence:</strong> ${a(e.sanofiPresence)}</p>
          <a href="/congress.html#congress=${n}" style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:12px;font-weight:600;color:#dc2626;text-decoration:none;" target="_blank"><i class="ti ti-external-link" style="font-size:14px;"></i> View Full Congress Coverage</a>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Your HCPs Attending</div><span class="result-badge badge-accent">Territory</span></div>
        <div class="result-body">${e.hcpsAttending.map(i=>`<div class="msl-profile" style="margin-bottom:6px;"><div class="msl-avatar" style="width:36px;height:36px;font-size:16px;border-radius:10px;"><i class="ti ti-user"></i></div><div><div class="msl-name" style="font-size:13px;">${a(i)}</div></div></div>`).join("")}</div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Sanofi Presentations</div><span class="result-badge badge-orion">Scientific</span></div>
        <div class="result-body">${e.presentations.map(i=>`<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
          <div style="font-weight:600;font-size:13px;margin-bottom:4px;">${a(i.title)}</div>
          <div class="result-meta"><span class="result-meta-item"><i class="ti ti-presentation"></i> ${a(i.type)}</span><span class="result-meta-item"><i class="ti ti-clock"></i> ${a(i.session)}</span><span class="result-meta-item"><i class="ti ti-user"></i> ${a(i.presenter)}</span></div>
          <a href="/congress.html#congress=${n}" style="display:inline-flex;align-items:center;gap:3px;margin-top:4px;font-size:11px;font-weight:500;color:var(--accent);text-decoration:none;" target="_blank"><i class="ti ti-file-description" style="font-size:12px;"></i> View Poster Overview</a>
        </div>`).join("")}</div>
      </div>
      <div class="result-card" style="background:var(--accent-light);border-color:var(--accent)33;">
        <div class="result-card-header"><div class="result-title" style="color:var(--accent-text);">Action Items</div><span class="result-badge badge-accent">To-Do</span></div>
        <div class="result-body"><ul>${e.actions.map(i=>`<li style="margin-bottom:6px;">${a(i)}</li>`).join("")}</ul></div>
      </div>`,C({topic:`Congress Planning — ${e.fullName}`,intent:"Congress intelligence",diseaseArea:"Multi-indication",depth:"Deep engagement",orionAction:`PRIORITY: MSL planning congress engagement — ${e.presentations.length} presentations`,queries:[`${e.fullName} HCP attendance and presentations`],contentAccessed:e.presentations.map(i=>i.title),_source:"MSL Copilot"})},1e3)});document.getElementById("kol-submit").addEventListener("click",()=>{const t=document.getElementById("kol-name").value.trim();if(document.getElementById("kol-focus").value,!t){alert("Please enter a KOL name.");return}const s=document.getElementById("kol-results");s.innerHTML=m("#a21caf"),setTimeout(()=>{const e=k(t);if(!e){s.innerHTML=`<div class="result-empty"><i class="ti ti-star"></i>No KOL found matching "${a(t)}". Try: Dr. Sarah Chen, Dr. Torres, or Dr. Nakamura.</div>`;return}const n=e.kolScore>=80?"var(--success)":e.kolScore>=60?"var(--warning)":"var(--text-muted)",i=e.kolScore>=80?"High Influence":e.kolScore>=60?"Rising Influence":"Emerging";s.innerHTML=`
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${a(e.name)}</div><span class="result-badge badge-accent">${a(e.tier)}</span></div>
        <div class="result-body">
          <p><strong>${a(e.specialty)}</strong> · ${a(e.institution)}</p>
          <p>${a(e.city)}</p>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">KOL Influence Score</div><span class="result-badge" style="background:${n}22;color:${n};">${i}</span></div>
        <div class="result-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div style="text-align:center;padding:12px;background:var(--surface-dim);border-radius:8px;">
              <div style="font-size:28px;font-weight:700;color:${n};">${e.kolScore}</div>
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">Overall Score</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--surface-dim);border-radius:8px;">
              <div style="font-size:28px;font-weight:700;color:var(--accent);">${e.hIndex}</div>
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">h-Index</div>
            </div>
          </div>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Engagement Metrics</div></div>
        <div class="result-body">
          <div class="detail-row"><span class="detail-label">Publications</span><span><strong>${e.publications}</strong> recent (Sanofi-relevant)</span></div>
          <div class="detail-row"><span class="detail-label">Advisory Boards</span><span><strong>${e.advisoryBoards}</strong> lifetime</span></div>
          <div class="detail-row"><span class="detail-label">Speaker Programs</span><span><strong>${e.speakerPrograms}</strong> lifetime</span></div>
          <div class="detail-row"><span class="detail-label">Orion Signals</span><span><strong>${e.orionSignals}</strong> total engagements</span></div>
          <div class="detail-row"><span class="detail-label">Congress</span><span>${e.congressAttendance.join(", ")}</span></div>
          <div class="detail-row"><span class="detail-label">Active Trials</span><span>${e.trials.length?e.trials.join("; "):"None"}</span></div>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Scientific Interests</div></div>
        <div class="result-body">${e.interests.map(r=>`<span class="interest-chip">${a(r)}</span>`).join("")}</div>
      </div>
      <div class="result-card" style="background:var(--orion-bg);border-color:#9fe1cb;">
        <div class="result-card-header"><div class="result-title" style="color:#085041;">Recent MedVerse Activity</div><span class="result-badge badge-orion">Orion Intel</span></div>
        <div class="result-body" style="color:#085041;">${e.recentQueries.map(r=>`<div class="query-item"><i class="ti ti-message-dots" style="color:var(--orion-accent);font-size:13px;"></i> ${a(r)}</div>`).join("")}</div>
      </div>`},1200)});document.getElementById("kol-name").addEventListener("keydown",t=>{t.key==="Enter"&&document.getElementById("kol-submit").click()});document.getElementById("comp-submit").addEventListener("click",()=>{const t=document.getElementById("comp-hcp").value.trim(),s=document.getElementById("comp-type").value,e=document.getElementById("comp-topics").value.trim(),n=document.getElementById("comp-meal").value;if(!s){alert("Please select an interaction type.");return}const i=document.getElementById("comp-results");i.innerHTML=m("var(--success)"),setTimeout(()=>{const r=[];if(r.push({status:"pass",label:"Interaction Type",text:`${s} is an approved MSL interaction type per SOP-MSL-003.`}),e&&(["off-label","unapproved","promotion"].some(h=>e.toLowerCase().includes(h))?r.push({status:"fail",label:"Topic Review",text:"Potential off-label or promotional language detected. MSL interactions must be limited to scientific exchange on approved indications. Review topics with Medical Affairs before proceeding."}):r.push({status:"pass",label:"Topic Review",text:"Topics appear consistent with scientific exchange guidelines. Ensure fair balance is maintained in all discussions."})),n==="none"?r.push({status:"pass",label:"Meal / Gift",text:"No meal or gift — no additional compliance requirements."}):n==="modest"?r.push({status:"pass",label:"Meal / Gift",text:"Modest meal (≤$75) is within PhRMA Code and Sunshine Act thresholds. Must be incidental to the scientific exchange, not the primary purpose."}):n==="meal"?r.push({status:"warn",label:"Meal / Gift",text:"Meal value $75–$150 requires manager pre-approval. Verify state-specific limits (some states cap at $50). Document business purpose."}):n==="gift"&&r.push({status:"pass",label:"Meal / Gift",text:"Educational reprints are permissible when related to the HCP's practice. Ensure no promotional materials are included."}),t){const l=k(t);if(l){const h=l.orionSignals||0;h>15?r.push({status:"warn",label:"Frequency Check",text:`${l.name} has ${h} recorded interactions. High-frequency engagement may require documentation of scientific rationale per SOP-MSL-005.`}):r.push({status:"pass",label:"Frequency Check",text:`${l.name} — interaction frequency within normal range (${h} signals).`})}}r.push({status:"pass",label:"Sunshine Act",text:"Reminder: All transfers of value >$10 must be reported under the Physician Payments Sunshine Act (Open Payments). Ensure accurate recording."}),r.push({status:"pass",label:"Documentation",text:"Post-call CRM entry required within 24 hours. Submit Orion signal for intelligence routing."});const o=r.some(l=>l.status==="warn"),p=r.some(l=>l.status==="fail"),R=p?"Issues Found":o?"Proceed with Caution":"All Clear",H=p?"badge-danger":o?"badge-warning":"badge-success";i.innerHTML=`
      <div class="result-card" style="background:${p?"var(--danger-bg)":o?"var(--warning-bg)":"var(--success-bg)"};border-color:${p?"#fca5a5":o?"#fde68a":"#86efac"};">
        <div class="result-card-header"><div class="result-title">${R}</div><span class="result-badge ${H}">Compliance</span></div>
        <div class="result-body">${p?"One or more compliance issues require attention before proceeding.":o?"Meeting can proceed — review flagged items below.":"All compliance checks passed. You are clear to proceed with this interaction."}</div>
      </div>
      ${r.map(l=>`<div class="checklist-item checklist-${l.status}">
        <div class="checklist-icon"><i class="ti ti-${l.status==="pass"?"check":l.status==="warn"?"alert-triangle":"x"}"></i></div>
        <div class="checklist-text"><div class="checklist-label">${a(l.label)}</div><div>${l.text}</div></div>
      </div>`).join("")}`},1e3)});const T=[{title:"Long-term Safety and Efficacy of Dupilumab in Adults with Moderate-to-Severe AD: LIBERTY AD CHRONOS 4-Year Results",authors:"Simpson EL, Paller AS, et al.",journal:"J Am Acad Dermatol",year:"2026",type:"Clinical Trial",impact:"High"},{title:"Dupilumab vs Abrocitinib in Adults with Moderate-to-Severe AD: JADE DARE Randomized Trial",authors:"Reich K, Thyssen JP, et al.",journal:"NEJM",year:"2025",type:"Clinical Trial",impact:"Very High"},{title:"Real-World Effectiveness of Dupilumab Across Type 2 Inflammatory Conditions: Systematic Review",authors:"Wollenberg A, et al.",journal:"Allergy",year:"2026",type:"Meta-Analysis",impact:"High"},{title:"Patient-Reported Outcomes with Dupilumab in Prurigo Nodularis: PRIME 2 Trial",authors:"Kwatra SG, et al.",journal:"Br J Dermatol",year:"2026",type:"Clinical Trial",impact:"Medium"},{title:"IL-4/IL-13 Pathway Blockade in Eosinophilic Esophagitis: Insights from LIBERTY EoE TREET",authors:"Dellon ES, et al.",journal:"Gastroenterology",year:"2025",type:"Clinical Trial",impact:"High"},{title:"Sarilumab Monotherapy Superiority over Adalimumab: MONARCH 3-Year Extension",authors:"Burmester GR, et al.",journal:"Ann Rheum Dis",year:"2026",type:"Clinical Trial",impact:"High"}];document.getElementById("msl-lit-submit").addEventListener("click",()=>{const t=document.getElementById("msl-lit-query").value.trim();if(!t){alert("Please enter a search query.");return}const s=document.getElementById("msl-lit-results");s.innerHTML=m("#a21caf"),setTimeout(()=>{const e=t.toLowerCase();let n=T.filter(r=>e.split(/\s+/).some(o=>(r.title+" "+r.authors).toLowerCase().includes(o)));n.length||(n=T.slice(0,3));const i=r=>r==="Very High"?"badge-danger":r==="High"?"badge-accent":"badge-info";s.innerHTML=`<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${n.length} results</div>`+n.map(r=>`<div class="result-card">
        <div class="result-card-header"><div class="result-title" style="font-size:13px;">${a(r.title)}</div></div>
        <div class="result-body"><p>${a(r.authors)}</p></div>
        <div class="result-meta">
          <span class="result-meta-item"><i class="ti ti-book"></i> ${a(r.journal)} (${r.year})</span>
          <span class="result-meta-item"><i class="ti ti-flask"></i> ${a(r.type)}</span>
          <span class="result-badge ${i(r.impact)}" style="font-size:9px;">${r.impact} impact</span>
        </div>
        <div class="result-actions">
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-external-link"></i> PubMed</button>
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-file-text"></i> Summary</button>
        </div>
      </div>`).join("")},1e3)});document.getElementById("msl-lit-query").addEventListener("keydown",t=>{t.key==="Enter"&&document.getElementById("msl-lit-submit").click()});const F={"Atopic Dermatitis":[{title:"New JAK inhibitor long-term safety data raises concerns (BMJ, Jul 2026)",type:"Competitor",urgency:"high"},{title:"AAD updates AD treatment guidelines — biologics as first-line option (JAAD, Jun 2026)",type:"Guideline",urgency:"high"},{title:"Real-world Dupixent adherence data: 82% persistence at 2 years (Dermatol Ther, Jul 2026)",type:"Sanofi",urgency:"medium"}],"Asthma (Type 2)":[{title:"Dupilumab COPD Phase 3 BOREAS-2 interim: sustained FEV1 benefit (NEJM, Jul 2026)",type:"Sanofi",urgency:"high"},{title:"GINA 2026 update: biologic add-on therapy algorithm revised (Eur Respir J, May 2026)",type:"Guideline",urgency:"high"}],"Rheumatoid Arthritis":[{title:"MONARCH 3-year extension confirms sarilumab monotherapy durability (Ann Rheum Dis, Jul 2026)",type:"Sanofi",urgency:"high"},{title:"EULAR 2026 RA recommendations update — IL-6 pathway positioning strengthened",type:"Guideline",urgency:"high"}]};document.getElementById("msl-scout-submit").addEventListener("click",()=>{const t=document.getElementById("msl-scout-ta").value;if(!t){alert("Please select a therapeutic area.");return}const s=document.getElementById("msl-scout-results");s.innerHTML=m("#c2410c"),setTimeout(()=>{const e=F[t]||[];if(!e.length){s.innerHTML='<div class="result-empty"><i class="ti ti-binoculars"></i>No recent alerts. Check back soon.</div>';return}const n=i=>i==="Sanofi"?"badge-accent":i==="Competitor"?"badge-danger":"badge-info";s.innerHTML=`<div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${e.length} alerts for ${a(t)}</div>`+e.map(i=>`<div class="result-card">
        <div class="result-card-header"><div class="result-title" style="font-size:13px;">${a(i.title)}</div></div>
        <div class="result-meta">
          <span class="result-badge ${n(i.type)}">${a(i.type)}</span>
          <span class="result-meta-item" style="color:${i.urgency==="high"?"var(--danger)":"var(--warning)"};"><i class="ti ti-${i.urgency==="high"?"alert-triangle":"info-circle"}"></i> ${i.urgency==="high"?"Priority":"Monitor"}</span>
        </div>
        <div class="result-actions">
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-external-link"></i> Read</button>
          <button class="form-btn form-btn-secondary" style="font-size:11px;padding:6px 12px;"><i class="ti ti-file-text"></i> AI Summary</button>
        </div>
      </div>`).join("")},1e3)});const G={"Atopic Dermatitis":{overview:"Chronic, relapsing inflammatory skin disease driven by <strong>type 2 inflammation</strong> (IL-4, IL-13, IL-31). Affects ~10% of adults and up to 25% of children.",pathophysiology:"Epidermal barrier dysfunction → allergen penetration → Th2 immune activation → IL-4/IL-13 overexpression → IgE elevation, eosinophilia, pruritus (IL-31).",treatments:[{name:"Dupixent (dupilumab)",class:"Anti-IL-4Rα mAb",status:"Approved",note:"First-line biologic. Blocks IL-4 and IL-13."},{name:"Abrocitinib (Cibinqo)",class:"JAK1 inhibitor",status:"Competitor",note:"Pfizer. Oral. Faster itch onset but JAK safety concerns."},{name:"Upadacitinib (Rinvoq)",class:"JAK1 inhibitor",status:"Competitor",note:"AbbVie. Oral. Boxed warning."}],crossTA:["Asthma (shared IL-4/IL-13)","CRSwNP (type 2 comorbidity)","Eosinophilic Esophagitis","Food allergy"],pipeline:"Dupixent extensions: pediatric <6mo, moderate-only (IGA3), prurigo nodularis, COPD, CSU, bullous pemphigoid"},"Rheumatoid Arthritis":{overview:"Chronic autoimmune inflammatory arthritis affecting ~1% of the population. Driven by TNF, IL-6, IL-1, and T/B cell activation.",pathophysiology:"Synovial inflammation → pannus formation → cartilage/bone erosion. IL-6 pathway drives joint + systemic effects (fatigue, anemia).",treatments:[{name:"Kevzara (sarilumab)",class:"Anti-IL-6Rα mAb",status:"Approved",note:"MONARCH: superior to adalimumab as monotherapy."},{name:"Adalimumab (Humira)",class:"Anti-TNF mAb",status:"Competitor",note:"Standard of care. Multiple biosimilars."}],crossTA:["Cardiovascular risk","Depression/fatigue (systemic IL-6)","Interstitial lung disease"],pipeline:"Sarilumab: monotherapy positioning, real-world evidence"}};document.getElementById("msl-dn-submit").addEventListener("click",()=>{const t=document.getElementById("msl-dn-disease").value;if(!t){alert("Please select a disease.");return}const s=document.getElementById("msl-dn-results");s.innerHTML=m("#059669"),setTimeout(()=>{const e=G[t];if(!e){s.innerHTML=`<div class="result-card"><div class="result-card-header"><div class="result-title">${a(t)}</div><span class="result-badge badge-info">Profile</span></div><div class="result-body"><p>Detailed profile for <strong>${a(t)}</strong> coming soon. Visit the <a href="/disease.html" style="color:var(--accent);">Disease Navigator module</a> for full information.</p></div></div>`;return}const n=i=>i==="Approved"?"badge-success":"badge-danger";s.innerHTML=`
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">${a(t)}</div><span class="result-badge badge-accent">Disease Profile</span></div>
        <div class="result-body"><p>${e.overview}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Pathophysiology</div><span class="result-badge badge-info">Mechanism</span></div>
        <div class="result-body"><p>${e.pathophysiology}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Treatment Landscape</div></div>
        <div class="result-body">${e.treatments.map(i=>`<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border);">
          <span class="result-badge ${n(i.status)}" style="flex-shrink:0;margin-top:2px;">${i.status}</span>
          <div><div style="font-weight:600;font-size:12px;">${a(i.name)} <span style="font-weight:400;color:var(--text-muted);">(${a(i.class)})</span></div><div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${a(i.note)}</div></div>
        </div>`).join("")}</div>
      </div>
      <div class="result-card" style="background:var(--orion-bg);border-color:#9fe1cb;">
        <div class="result-card-header"><div class="result-title" style="color:#085041;">Cross-TA Connections</div><span class="result-badge badge-orion">Type 2</span></div>
        <div class="result-body">${e.crossTA.map(i=>`<span class="interest-chip" style="background:#c6f1dc;color:#085041;">${a(i)}</span>`).join("")}</div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Sanofi Pipeline</div><span class="result-badge badge-accent">Pipeline</span></div>
        <div class="result-body"><p>${a(e.pipeline)}</p></div>
      </div>`},1e3)});function _(){const t=document.getElementById("orion-content");if(!t)return;const s=[{hcp:"Dr. Sarah Chen",topic:"Dupilumab vs abrocitinib H2H data",intent:"Competitive comparison",disease:"Atopic Dermatitis",depth:"Deep engagement",action:"PRIORITY: Prepare H2H data deck for next meeting",time:"2h ago"},{hcp:"Dr. Emily Nakamura",topic:"Type 2 inflammation cross-disease connections",intent:"Scientific exploration",disease:"Multi-TA (AD + Asthma + EoE)",depth:"Deep engagement — cross-TA query",action:"Invite to EADV satellite symposium",time:"1d ago"},{hcp:"Dr. Michael Torres",topic:"MONARCH sarilumab vs adalimumab monotherapy",intent:"Treatment decision",disease:"Rheumatoid Arthritis",depth:"Moderate engagement",action:"Share MONARCH extension data when available",time:"3d ago"},{hcp:"Dr. James Liu",topic:"Dupixent pediatric AD dosing",intent:"Dosing information",disease:"Atopic Dermatitis",depth:"Light engagement",action:"Route to MIR team",time:"4d ago"},{hcp:"Dr. Sarah Chen",topic:"EASI-75 durability beyond 52 weeks",intent:"Long-term efficacy",disease:"Atopic Dermatitis",depth:"Deep engagement",action:"Include CHRONOS 4-year data in next briefing",time:"5d ago"}],e=[{label:"Type 2 Inflammation",count:34,trend:"+12%"},{label:"Competitive Landscape",count:22,trend:"+28%"},{label:"Pediatric Dosing",count:18,trend:"+5%"},{label:"Real-World Evidence",count:15,trend:"+15%"},{label:"Cross-TA Comorbidities",count:12,trend:"+40%"}];t.innerHTML=`
    <div class="stats-grid">
      <div class="stat-tile"><div class="stat-num">142</div><div class="stat-label">Total Signals (Aug)</div></div>
      <div class="stat-tile"><div class="stat-num">38</div><div class="stat-label">Your Territory</div></div>
      <div class="stat-tile"><div class="stat-num">7</div><div class="stat-label">Priority Alerts</div></div>
      <div class="stat-tile"><div class="stat-num">4.2</div><div class="stat-label">Avg Depth Score</div></div>
    </div>
    <div class="territory-grid">
      <div class="territory-section">
        <h3><i class="ti ti-trending-up"></i> Trending Topics</h3>
        ${e.map(n=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);">
          <div style="flex:1;font-size:13px;font-weight:500;">${a(n.label)}</div>
          <div style="font-size:14px;font-weight:600;color:var(--accent);">${n.count}</div>
          <div style="font-size:11px;color:var(--success);font-weight:500;">${n.trend}</div>
        </div>`).join("")}
      </div>
      <div class="territory-section">
        <h3><i class="ti ti-radar-2"></i> Recent Signals</h3>
        ${s.slice(0,3).map(n=>`<div class="signal-card">
          <div class="signal-header"><div class="signal-dot"></div><span class="signal-time">${n.time}</span></div>
          <div class="signal-topic">${a(n.topic)}</div>
          <div class="signal-row"><span class="signal-label">HCP</span><span class="signal-value">${a(n.hcp)}</span></div>
          <div class="signal-row"><span class="signal-label">Disease</span><span class="signal-value">${a(n.disease)}</span></div>
          <div class="signal-row"><span class="signal-label">Depth</span><span class="signal-value">${a(n.depth)}</span></div>
          <div class="signal-action"><i class="ti ti-arrow-right"></i><span>${a(n.action)}</span></div>
        </div>`).join("")}
      </div>
    </div>
    <div style="margin-top:16px;">
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">All Territory Signals</div><span class="result-badge badge-orion">${s.length} signals</span></div>
        <div class="result-body">${s.map(n=>`<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);align-items:flex-start;">
          <div style="min-width:80px;font-size:11px;color:var(--text-muted);">${n.time}</div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:600;">${a(n.hcp)}</div>
            <div style="font-size:12px;color:var(--text-secondary);">${a(n.topic)}</div>
            <div style="font-size:11px;color:var(--orion-accent);margin-top:2px;">${a(n.action)}</div>
          </div>
          <span class="result-badge badge-orion" style="font-size:9px;flex-shrink:0;">${a(n.depth.split(" — ")[0])}</span>
        </div>`).join("")}</div>
      </div>
    </div>`}_();const g=document.getElementById("run-demo");let D=!1;async function u(t){const s=document.getElementById("demo-narrator");s&&(s.innerHTML=`<i class="ti ti-sparkles"></i> ${a(t)}`,B()&&s.classList.add("visible"),N(),await O(t))}function X(){const t=document.getElementById("demo-narrator");t&&t.classList.remove("visible"),q(),z()}g&&g.addEventListener("click",Z);async function Z(){if(D)return;D=!0,g.disabled=!0,g.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running…',await c(500),await u("MSL Copilot demo — eight AI-powered business agents for Medical Science Liaisons"),await u("The hub shows all agents — Pre-Call Intelligence, Territory Dashboard, Post-Call Reporting, Medical Information, Competitive Intelligence, Congress Planning, KOL Profiling, and Compliance Advisor"),await c(1500),await u("Let's start with Pre-Call Intelligence — preparing for a meeting with Dr. Sarah Chen"),v("precall"),await c(800);const t=document.getElementById("pc-hcp-search");t.value="Dr. Sarah Chen",await c(500),document.getElementById("pc-submit").click(),await c(2500),await u("The agent pulls her profile, scientific interests, Orion signals, trial involvement, and recommended talking points"),await c(2e3),await u("Next — Competitive Intelligence for a head-to-head discussion"),v("competitive"),await c(800),document.getElementById("ci-ta").value="Atopic Dermatitis",document.getElementById("ci-product").value="Dupixent (dupilumab)",document.getElementById("ci-competitor").value="Abrocitinib (Cibinqo) — Pfizer",await c(800),document.getElementById("ci-submit").click(),await c(2500),await u("Full comparison table with JADE DARE trial data and key scientific exchange messages for fair-balance discussions"),await c(2e3),await u("Before the meeting — the Compliance Advisor runs a pre-meeting check"),v("compliance"),await c(800),document.getElementById("comp-hcp").value="Dr. Sarah Chen",document.getElementById("comp-type").value="Scientific Exchange (1:1)",document.getElementById("comp-topics").value="Dupilumab long-term safety, EADV preview",document.getElementById("comp-meal").value="modest",await c(800),document.getElementById("comp-submit").click(),await c(2e3),await u("All checks passed — interaction type, topics, meal value, frequency, and documentation requirements verified"),await c(2e3),await u("Eight agents working together — from preparation through execution to reporting. The MSL Copilot command center"),w(),await c(1e3),X(),D=!1,g.disabled=!1,g.innerHTML='<i class="ti ti-player-play"></i> Run Demo'}
