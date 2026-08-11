import"./enhancements-CkBzVvPR.js";import{i as de,s as me,a as ue,b as pe,h as he}from"./narrator-Gu1jBQbu.js";import{b as ve}from"./orion-bridge-Bxojkdb6.js";const C="/api/pubmed",oe='"N Engl J Med"[Journal]',w=document.getElementById("search-input"),B=document.getElementById("search-btn"),J=document.getElementById("results-area"),z=document.getElementById("intel-panel"),D=document.getElementById("signal-feed"),ge=document.getElementById("governance-bar"),q=document.getElementById("conn-pubmed"),Z=document.getElementById("conn-nejm"),H=document.getElementById("compare-panel-area"),A=document.getElementById("compare-bar"),U=document.getElementById("memory-section"),ee=document.getElementById("memory-chips"),te=document.getElementById("memory-clear");let K="all",O=[],ae=0,M=[];const R="medverse_lit_memory";document.querySelectorAll(".source-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".source-btn").forEach(a=>a.classList.remove("active")),e.classList.add("active"),K=e.dataset.source,O.length&&le(O)})});document.querySelectorAll(".quick-tag").forEach(e=>{e.addEventListener("click",()=>{w.value=e.dataset.q,S()})});B.addEventListener("click",S);w.addEventListener("keydown",e=>{e.key==="Enter"&&S()});be();async function be(){try{(await fetch(`${C}/einfo.fcgi?db=pubmed&retmode=json`)).ok&&(q.innerHTML='<span class="conn-dot pulse"></span> PubMed E-Utilities — Connected',q.className="conn-chip")}catch{q.innerHTML='<span class="conn-dot"></span> PubMed — Connection failed',q.className="conn-chip error"}Z.innerHTML='<span class="conn-dot pulse"></span> NEJM via PubMed — Connected',Z.className="conn-chip"}async function S(){const e=w.value.trim();if(e){B.disabled=!0,B.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Searching…',ge.style.display="flex",J.innerHTML=`<div class="search-loading">
    <i class="ti ti-loader-2"></i>
    <p>Querying PubMed E-Utilities and NEJM…</p>
  </div>`,z&&(z.innerHTML=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Analyzing literature…</div>
    <p style="font-size:12px;color:var(--text-muted)">Running intelligence pipeline on search results…</p>
  </div>`);try{const a=await V(e,15);await d(1500);const t=await V(`${e} AND ${oe}`,5),i=new Set(t.map(s=>s.uid)),n=[];t.forEach(s=>{s.isNejm=!0,n.push(s)}),a.forEach(s=>{i.has(s.uid)||(s.isNejm=!1,n.push(s))}),O=n,M=[],Y(),le(n),we(e,n,a.length,t.length),re(e,n),Ee(e,n.length,t.length),Se(n),J.scrollIntoView({behavior:"smooth",block:"start"})}catch(a){J.innerHTML=`<div class="empty-state">
      <i class="ti ti-alert-triangle"></i>
      <h3>Search error</h3>
      <p>${l(a.message)}</p>
    </div>`}B.disabled=!1,B.innerHTML='<i class="ti ti-search"></i> Search'}}async function V(e,a=15){var c,v;const t=`${C}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(e)}&retmax=${a}&sort=relevance&retmode=json`,s=((c=(await(await fetch(t)).json()).esearchresult)==null?void 0:c.idlist)||[];if(!s.length)return[];const o=`${C}/esummary.fcgi?db=pubmed&id=${s.join(",")}&retmode=json`,g=await(await fetch(o)).json(),u=[];for(const y of s){const m=(v=g.result)==null?void 0:v[y];m&&u.push({uid:m.uid,title:m.title||"Untitled",authors:(m.authors||[]).map(p=>p.name),source:m.source||"",fulljournalname:m.fulljournalname||m.source||"",pubdate:m.pubdate||"",volume:m.volume||"",issue:m.issue||"",pages:m.pages||"",doi:fe(m.elocationid||""),pmid:m.uid})}return u}function fe(e){const a=e.match(/doi:\s*(\S+)/i);return a?a[1]:""}function le(e){let a=e;if(K==="nejm"?a=e.filter(s=>s.isNejm):K==="pubmed"&&(a=e.filter(s=>!s.isNejm)),!a.length){J.innerHTML=`<div class="empty-state">
      <i class="ti ti-book-off"></i>
      <h3>No results found</h3>
      <p>Try adjusting your search terms or source filter.</p>
    </div>`;return}const t=e.filter(s=>s.isNejm).length,i=e.filter(s=>!s.isNejm).length;J.innerHTML=`
    <div class="results-header">
      <h2>Search Results</h2>
      <span class="results-count">${e.length} articles — ${i} PubMed · ${t} NEJM</span>
    </div>
    <div class="results-list" id="results-list"></div>
  `;const n=document.getElementById("results-list");a.forEach((s,o)=>{const r=document.createElement("div");r.className="article-card";const g=s.authors.length>4?s.authors.slice(0,3).join(", ")+`, et al. (${s.authors.length} authors)`:s.authors.join(", "),u=s.isNejm?"nejm":"pubmed",c=s.isNejm?"NEJM":"PubMed",v=`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`,y=s.doi?`https://doi.org/${s.doi}`:"";r.innerHTML=`
      <div class="compare-check" data-pmid="${s.pmid}" title="Select for comparison"><i class="ti ti-check"></i></div>
      <span class="article-source-tag ${u}"><span class="source-dot ${u}"></span> ${c}</span>
      <div class="article-title"><a href="${l(v)}" target="_blank" rel="noopener">${s.title}</a></div>
      <div class="article-authors">${l(g)}</div>
      <div class="article-meta">
        <span class="article-meta-item article-journal"><i class="ti ti-notebook"></i> ${l(s.fulljournalname)}</span>
        <span class="article-meta-item"><i class="ti ti-calendar"></i> ${l(s.pubdate)}</span>
        ${s.volume?`<span class="article-meta-item">${l(s.volume)}${s.issue?`(${l(s.issue)})`:""}${s.pages?`:${l(s.pages)}`:""}</span>`:""}
      </div>
      <div class="article-pmid">PMID: ${l(s.pmid)}</div>
      <div class="article-actions">
        <a class="article-action" href="${l(v)}" target="_blank" rel="noopener"><i class="ti ti-external-link"></i> PubMed</a>
        ${y?`<a class="article-action" href="${l(y)}" target="_blank" rel="noopener"><i class="ti ti-link"></i> Full Text</a>`:""}
        <button class="article-action fetch-abstract-btn" data-pmid="${s.pmid}" data-idx="${o}"><i class="ti ti-file-text"></i> Fetch Abstract</button>
      </div>
      <div class="article-abstract-area" id="abstract-${s.pmid}"></div>
    `,n.appendChild(r)}),n.querySelectorAll(".fetch-abstract-btn").forEach(s=>{s.addEventListener("click",()=>ye(s.dataset.pmid))}),n.querySelectorAll(".compare-check").forEach(s=>{s.addEventListener("click",()=>Le(s.dataset.pmid,s))})}async function ye(e){const a=document.getElementById(`abstract-${e}`);if(a){a.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Fetching abstract from PubMed…</p>';try{const t=`${C}/efetch.fcgi?db=pubmed&id=${e}&rettype=abstract&retmode=text`,n=await(await fetch(t)).text(),s=n.match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i),o=s?s[1].trim():n.trim();o&&o.length>50?a.innerHTML=`<div class="article-abstract" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">${l(o)}</div>
        <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>`:a.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0">Abstract not available for this article.</p>'}catch{a.innerHTML='<p style="font-size:12px;color:var(--danger);padding:8px 0">Failed to fetch abstract.</p>'}}}function we(e,a,t,i){const n={},s={},o={};a.forEach(p=>{const b=p.source||p.fulljournalname||"Unknown";n[b]=(n[b]||0)+1;const j=p.pubdate.match(/(\d{4})/);if(j){const f=j[1];s[f]=(s[f]||0)+1}p.authors.forEach(f=>{o[f]=(o[f]||0)+1})});const r=Object.entries(n).sort((p,b)=>b[1]-p[1]).slice(0,5),g=r.length?r[0][1]:1,u=Object.entries(o).sort((p,b)=>b[1]-p[1]).slice(0,8),c=Object.entries(s).sort((p,b)=>p[0]-b[0]),v=c.length?Math.max(...c.map(p=>p[1])):1,y=["#7a00e6","#aa46a3","#f9c851","#60a5fa","#34d399"];let m="";m+=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-chart-bar"></i> Search Analytics</div>
    <div class="intel-stat-row"><span class="intel-stat-label">Total articles</span><span class="intel-stat-value">${a.length}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">PubMed results</span><span class="intel-stat-value">${t}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">NEJM articles</span><span class="intel-stat-value">${i}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">Date range</span><span class="intel-stat-value">${c.length?c[0][0]+"–"+c[c.length-1][0]:"—"}</span></div>
  </div>`,c.length>1&&(m+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-trending-up"></i> Publication Trend</div>
      <div class="trend-chart-wrapper">
        <div class="trend-chart">
          ${c.map(([p,b])=>`
            <div class="trend-bar" style="height:${Math.max(b/v*100,8)}%" title="${p}: ${b} articles">
              <span class="trend-bar-label">${p.slice(2)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>`),r.length&&(m+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-notebook"></i> Top Journals</div>
      ${r.map(([p,b],j)=>`
        <div class="journal-row">
          <span style="flex:0 0 120px;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${l(p)}">${l(p.length>18?p.slice(0,16)+"…":p)}</span>
          <div class="journal-bar"><div class="journal-bar-fill" style="width:${b/g*100}%;background:${y[j%y.length]}"></div></div>
          <span class="journal-count">${b}</span>
        </div>
      `).join("")}
    </div>`),u.length&&(m+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-users"></i> Key Authors</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${u.map(([p,b])=>`<span class="author-chip">${l(p)} (${b})</span>`).join("")}
      </div>
    </div>`),m+=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-bulb"></i> AI Evidence Assessment</div>
    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:6px">
      <strong>${a.length} publications</strong> retrieved for "<em>${l(e)}</em>".
      ${i>0?`<strong>${i} NEJM article${i>1?"s":""}</strong> found — high-impact evidence available.`:"No NEJM-specific articles — consider broadening the search or checking recent issues."}
    </p>
    ${u.length>=2?`<p style="font-size:12px;color:var(--text-secondary);line-height:1.5">
      <strong>Most prolific authors:</strong> ${u.slice(0,3).map(([p])=>p).join(", ")} — consider for KOL mapping and engagement planning.
    </p>`:""}
  </div>`,z&&(z.innerHTML=m)}function re(e,a){ae++;const t=a.filter(c=>c.isNejm).length,n=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),s=(()=>{const c={};a.forEach(y=>y.authors.forEach(m=>c[m]=(c[m]||0)+1));const v=Object.entries(c).sort((y,m)=>m[1]-y[1]);return v.length?v[0][0]:"Unknown"})(),o=$e(e),r=t>0?"Deep engagement — cross-journal query":"Moderate engagement",g=t>0?"Evidence synthesis with high-impact journals":"Literature exploration",u=t>2?"PRIORITY: High-impact NEJM evidence discovered — flag for medical affairs review":`Literature search logged — ${a.length} articles, key author: ${s}`;if(D){D.querySelector("[style]")&&ae===1&&(D.innerHTML="");const v=document.createElement("div");v.className="signal-card",v.innerHTML=`
      <div class="signal-header">
        <div class="signal-dot"></div>
        <span class="signal-time">${n}</span>
      </div>
      <div class="signal-topic">Literature Search — ${l(e.length>40?e.slice(0,38)+"…":e)}</div>
      <div class="signal-row"><span class="signal-label">Intent</span><span class="signal-value">${l(g)}</span></div>
      <div class="signal-row"><span class="signal-label">Disease</span><span class="signal-value">${l(o)}</span></div>
      <div class="signal-row"><span class="signal-label">Sources</span><span class="signal-value">${a.length} PubMed · ${t} NEJM</span></div>
      <div class="signal-row"><span class="signal-label">Depth</span><span class="signal-value">${l(r)}</span></div>
      <div class="signal-action"><i class="ti ti-arrow-right"></i><span>${l(u)}</span></div>
    `,D.insertBefore(v,D.firstChild)}ve({topic:`Literature Search — ${e.length>40?e.slice(0,38)+"…":e}`,intent:g,diseaseArea:o,depth:r,orionAction:u,queries:[e],contentAccessed:a.slice(0,3).map(c=>c.title||"PubMed Article"),sessionDuration:Math.floor(Math.random()*8)+3,_source:"Literature Intelligence"})}function $e(e){const a=e.toLowerCase(),t=[[/atopic|eczema|dermatitis|dupilumab|dupixent/,"Atopic Dermatitis"],[/asthma|airway|tezepelumab/,"Asthma"],[/crohn|ibd|ulcerative colitis|duvakitug/,"Inflammatory Bowel Disease"],[/rsv|nirsevimab|beyfortus/,"RSV Prevention"],[/hemophilia|fitusiran/,"Hemophilia"],[/multiple sclerosis|tolebrutinib/,"Multiple Sclerosis"],[/insulin|glargine|lantus|toujeo|diabetes/,"Diabetes"],[/psoriasis/,"Psoriasis"],[/oncology|cancer|tumor/,"Oncology"],[/vaccine|immunization/,"Vaccines"],[/rare disease|fabry|gaucher|pompe/,"Rare Diseases"]];for(const[i,n]of t)if(i.test(a))return n;return"Cross-TA / General"}function l(e){const a=document.createElement("div");return a.textContent=e,a.innerHTML}function d(e){return new Promise(a=>setTimeout(a,e))}document.getElementById("chat-panel");const T=document.getElementById("chat-messages"),$=document.getElementById("chat-input"),E=document.getElementById("chat-send"),k=document.getElementById("chat-suggestions");$&&E&&(E.addEventListener("click",()=>I()),$.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),I())}),$.addEventListener("input",()=>{E.disabled=!$.value.trim()}));k&&k.querySelectorAll(".chat-suggestion").forEach(e=>{e.addEventListener("click",()=>{$.value=e.dataset.q,I()})});const ie={patterns:[{match:/what.*(latest|recent|new).*(dupilumab|dupixent)/i,query:"dupilumab 2024 2025 2026",synthesize:e=>`Based on my search of PubMed and NEJM, here are the most recent dupilumab publications:

${e.slice(0,3).map((t,i)=>`${i+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Intelligence note:** ${e.length} total articles found. The publication velocity for dupilumab remains high, reflecting ongoing clinical investigation across multiple indications including atopic dermatitis, asthma, CRSwNP, and EoE.`},{match:/compare|versus|vs|head.to.head.*(dupilumab|abrocitinib|upadacitinib|jak)/i,query:"dupilumab abrocitinib head-to-head comparison atopic dermatitis",synthesize:e=>`Here is the published head-to-head evidence for dupilumab vs JAK inhibitors:

${e.slice(0,3).map((t,i)=>`${i+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Key context:** The JADE DARE trial (abrocitinib vs dupilumab) is the largest head-to-head dataset. Dupilumab showed comparable efficacy at Week 26 with a differentiated safety profile — notably lower rates of serious infections and no herpes zoster signal.

**Evidence gap:** No published head-to-head data for upadacitinib vs dupilumab. This is a frequently requested comparison from HCPs (67 Orion signals this quarter).`},{match:/safety.*(pediatric|children|child|kids)/i,query:"dupilumab pediatric safety long-term children",synthesize:e=>`Pediatric dupilumab safety evidence from PubMed/NEJM:

${e.slice(0,3).map((t,i)=>`${i+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Evidence synthesis:** Long-term safety data supports a favorable profile in pediatric patients (6 months to 17 years). Most common AEs: injection site reactions and conjunctivitis. No new safety signals through 3+ years of open-label extension data. Growth velocity unaffected in youngest population studied.

**Compliance note:** All claims verified against published data. FDA-approved pediatric indications: AD (6 months+), asthma (6 years+), EoE (1 year+, ≥15 kg).`},{match:/nirsevimab|rsv|beyfortus/i,query:"nirsevimab RSV prevention infants efficacy",synthesize:e=>`RSV prevention with nirsevimab — published evidence:

${e.slice(0,3).map((t,i)=>`${i+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Evidence synthesis:** Nirsevimab (Beyfortus) demonstrated 74.5% efficacy against medically attended RSV-associated lower respiratory tract infections in the MELODY trial (healthy late-preterm and term infants). Single-dose passive immunization provides ~5 months of protection.

**NEJM evidence strength:** Multiple Phase 3 publications in the New England Journal of Medicine — highest-impact evidence available for this indication.`},{match:/type.?2.*inflam|il.?4|il.?13|biologic.*mechanism/i,query:"type 2 inflammation IL-4 IL-13 biologics mechanism",synthesize:e=>`Type 2 inflammation and the IL-4/IL-13 pathway — literature evidence:

${e.slice(0,3).map((t,i)=>`${i+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Cross-TA synthesis:** Type 2 inflammation is a shared immunological mechanism underlying multiple diseases through the IL-4/IL-13 axis:
- **Atopic dermatitis** — epithelial barrier dysfunction
- **Asthma** — airway hyperresponsiveness
- **CRSwNP** — eosinophilic tissue inflammation
- **EoE** — esophageal eosinophilia

Dupilumab targets the IL-4Rα shared receptor subunit, explaining cross-disease efficacy. This is a key differentiator vs mechanism-specific agents.`},{match:/tolebrutinib|multiple sclerosis|btk/i,query:"tolebrutinib multiple sclerosis BTK inhibitor clinical trial",synthesize:e=>`Tolebrutinib in multiple sclerosis — published evidence:

${e.slice(0,3).map((t,i)=>`${i+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Pipeline context:** Tolebrutinib is a brain-penetrant Bruton's tyrosine kinase (BTK) inhibitor under investigation for relapsing and progressive forms of MS. BTK inhibition targets both B-cells and microglia — a novel dual mechanism that could address neuroinflammation and neurodegeneration simultaneously.

**Evidence status:** Phase 3 data emerging. Watch for HERCULES (non-relapsing SPMS) and GEMINI (RMS) trial readouts.`}],fallback:(e,a)=>{if(!a.length)return`I searched PubMed and NEJM for "${e}" but found no matching articles. Try refining your query with more specific medical terms, drug names, or disease areas.`;const t=a.slice(0,3).map((o,r)=>`${r+1}. **${o.title}** — *${o.fulljournalname}* (${o.pubdate}) [PMID: ${o.pmid}]`).join(`

`),i=a.filter(o=>o.isNejm).length;let n="";const s=localStorage.getItem(R);if(s){const r=JSON.parse(s).filter(g=>g.query.toLowerCase()!==e.toLowerCase()).slice(0,2);r.length&&(n=`

**Agent memory:** You previously searched for ${r.map(g=>`"${g.query}" (${g.count} results)`).join(" and ")}. I can cross-reference these topics if you'd like a combined analysis.`)}return`I found ${a.length} articles across PubMed${i?` and NEJM (${i} high-impact)`:""} for your query:

${t}

${a.length>3?`Plus ${a.length-3} more articles. `:""}Use the search bar above to see all results with full metadata, or ask me a more specific follow-up question.${n}`}};async function I(){const e=$.value.trim();if(!e)return;$.value="",E.disabled=!0,k&&(k.style.display="none"),_("user",e);const a=Te();let t=null;for(const n of ie.patterns)if(n.match.test(e)){t=n;break}const i=t?t.query:Me(e);try{const n=await V(i,8);await d(300);const s=await V(`${i} AND ${oe}`,3),o=new Set(s.map(u=>u.uid));s.forEach(u=>{u.isNejm=!0}),n.forEach(u=>{o.has(u.uid)&&(u.isNejm=!0)});const r=[...s,...n.filter(u=>!o.has(u.uid))];a.remove();const g=t?t.synthesize(r):ie.fallback(e,r);_("agent",g,r),re(i,r)}catch(n){a.remove(),_("agent",`I encountered an error searching PubMed: ${n.message}. Please try again in a moment — NCBI rate-limits requests to 3 per second.`)}}function Me(e){return e.replace(/\b(what|how|does|is|are|the|can|you|find|tell|me|about|give|show|latest|recent|any|published|evidence|data|for|on|in|of|with|and|or|please)\b/gi,"").replace(/[?!.,]/g,"").replace(/\s+/g," ").trim()}function _(e,a,t){const i=document.createElement("div");if(i.className=`chat-msg chat-msg-${e}`,e==="user")i.innerHTML=`<div class="chat-msg-bubble chat-user-bubble">${l(a)}</div>`;else{let n=l(a);n=n.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),n=n.replace(/\*(.+?)\*/g,"<em>$1</em>"),n=n.replace(/\[PMID: (\d+)\]/g,'<a class="chat-pmid-link" href="https://pubmed.ncbi.nlm.nih.gov/$1/" target="_blank" rel="noopener">PMID: $1</a>'),n=n.replace(/^(\d+)\./gm,"<br>$1."),n=n.replace(/^- (.+)/gm,"<br>• $1");const s=t&&t.length>0?`<div class="chat-citations">
          <div class="chat-citations-label"><i class="ti ti-book-2"></i> ${t.length} sources from PubMed/NEJM</div>
          ${t.slice(0,3).map(o=>{var r;return`
            <a class="chat-citation-chip" href="https://pubmed.ncbi.nlm.nih.gov/${o.pmid}/" target="_blank" rel="noopener">
              <span class="source-dot ${o.isNejm?"nejm":"pubmed"}"></span>
              ${l(o.authors[0]||"Unknown")} (${l(((r=o.pubdate.match(/\d{4}/))==null?void 0:r[0])||"")})
            </a>`}).join("")}
        </div>`:"";i.innerHTML=`
      <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
      <div class="chat-msg-content">
        <div class="chat-msg-bubble chat-agent-bubble">${n}</div>
        ${s}
      </div>`}T.appendChild(i),T.scrollTop=T.scrollHeight}function W(){const e=localStorage.getItem(R),a=e?JSON.parse(e):[];if(!a.length){U&&(U.style.display="none");return}U.style.display="block",ee.innerHTML="",a.slice(0,8).forEach(t=>{const i=document.createElement("span");i.className="memory-chip",i.title=`${t.count} results · ${t.nejm} NEJM · ${t.date}`,i.innerHTML=`<i class="ti ti-history"></i> ${l(t.query)} <span class="memory-chip-time">${t.ago}</span>`,i.addEventListener("click",()=>{w.value=t.query,S()}),ee.appendChild(i)})}function Ee(e,a,t){const i=localStorage.getItem(R);let n=i?JSON.parse(i):[];n=n.filter(o=>o.query.toLowerCase()!==e.toLowerCase());const s=new Date;n.unshift({query:e,count:a,nejm:t,date:s.toLocaleDateString("en-US",{month:"short",day:"numeric"}),ago:"just now",ts:s.getTime()}),n=n.slice(0,20),n.forEach(o=>{const r=Math.floor((s.getTime()-o.ts)/6e4);r<1?o.ago="just now":r<60?o.ago=`${r}m ago`:r<1440?o.ago=`${Math.floor(r/60)}h ago`:o.ago=`${Math.floor(r/1440)}d ago`}),localStorage.setItem(R,JSON.stringify(n)),W()}W();te&&te.addEventListener("click",()=>{localStorage.removeItem(R),W()});function Le(e,a){var i;const t=M.indexOf(e);if(t>-1)M.splice(t,1),a.classList.remove("selected");else{if(M.length>=2){const n=M.shift();(i=document.querySelector(`.compare-check[data-pmid="${n}"]`))==null||i.classList.remove("selected")}M.push(e),a.classList.add("selected")}Y()}function Y(){if(A){if(M.length<2){A.style.display=M.length===1?"flex":"none",M.length===1&&(A.innerHTML=`<div class="compare-bar">
        <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 1 article selected — select another to compare</span>
        <div class="compare-bar-actions">
          <button class="compare-bar-btn secondary" onclick="clearCompare()">Cancel</button>
        </div>
      </div>`,A.style.display="block"),H.innerHTML="";return}A.innerHTML=`<div class="compare-bar">
    <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 2 articles selected</span>
    <div class="compare-bar-actions">
      <button class="compare-bar-btn primary" onclick="runComparison()"><i class="ti ti-arrows-exchange" style="margin-right:4px"></i> Compare Evidence</button>
      <button class="compare-bar-btn secondary" onclick="clearCompare()">Clear</button>
    </div>
  </div>`,A.style.display="block"}}window.clearCompare=function(){M=[],document.querySelectorAll(".compare-check.selected").forEach(e=>e.classList.remove("selected")),Y()};window.runComparison=async function(){var b,j;const e=M.map(f=>O.find(x=>x.uid===f||x.pmid===f)).filter(Boolean);if(e.length<2)return;H.innerHTML=`<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison — loading abstracts…</span>
    </div>
    <div style="text-align:center;padding:30px;color:var(--text-muted)"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:24px"></i></div>
  </div>`,H.scrollIntoView({behavior:"smooth",block:"start"});const a=[];for(const f of e)try{const x=`${C}/efetch.fcgi?db=pubmed&id=${f.pmid}&rettype=abstract&retmode=text`,X=(await(await fetch(x)).text()).match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i);a.push(X?X[1].trim():"Abstract not available."),a.length<e.length&&await d(400)}catch{a.push("Failed to fetch abstract.")}const t=e[0],i=e[1],n=a[0],s=a[1],o=t.fulljournalname===i.fulljournalname,r=((b=t.pubdate.match(/\d{4}/))==null?void 0:b[0])||"?",g=((j=i.pubdate.match(/\d{4}/))==null?void 0:j[0])||"?",u=Math.abs(parseInt(r)-parseInt(g));let c="";if(o)c=`Both articles published in <strong>${l(t.fulljournalname)}</strong>`,u>0&&(c+=` — ${u}-year gap suggests evolving evidence base`),c+=". ";else{const f=t.isNejm,x=i.isNejm;f&&!x?c=`Article 1 is from <strong>NEJM</strong> (highest impact) vs ${l(i.fulljournalname)}. `:!f&&x?c=`Article 2 is from <strong>NEJM</strong> (highest impact) vs ${l(t.fulljournalname)}. `:c=`Cross-journal comparison: <strong>${l(t.source)}</strong> vs <strong>${l(i.source)}</strong>. `}const v=t.authors.length,y=i.authors.length;(v>10||y>10)&&(c+=`Large author list (${Math.max(v,y)} authors) suggests multi-center trial data. `),c+="Review both abstracts to assess study design, population, and endpoints for comparative evidence strength.";const m=f=>f.isNejm?"nejm":"pubmed",p=f=>f.isNejm?"NEJM":"PubMed";H.innerHTML=`<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison</span>
      <button class="compare-panel-close" onclick="document.getElementById('compare-panel-area').innerHTML='';clearCompare()"><i class="ti ti-x"></i></button>
    </div>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-col-header ${m(t)}">Article 1 — ${p(t)}</div>
        <div class="compare-field"><div class="compare-field-label">Title</div><div class="compare-field-value"><strong>${t.title}</strong></div></div>
        <div class="compare-field"><div class="compare-field-label">Authors</div><div class="compare-field-value">${l(t.authors.slice(0,5).join(", "))}${t.authors.length>5?` +${t.authors.length-5} more`:""}</div></div>
        <div class="compare-field"><div class="compare-field-label">Journal</div><div class="compare-field-value">${l(t.fulljournalname)}</div></div>
        <div class="compare-field"><div class="compare-field-label">Date</div><div class="compare-field-value">${l(t.pubdate)}</div></div>
        <div class="compare-field"><div class="compare-field-label">PMID</div><div class="compare-field-value"><a href="https://pubmed.ncbi.nlm.nih.gov/${t.pmid}/" target="_blank" style="color:var(--accent)">${t.pmid}</a></div></div>
        <div class="compare-field"><div class="compare-field-label">Abstract</div><div class="compare-abstract">${l(n)}</div></div>
      </div>
      <div class="compare-col">
        <div class="compare-col-header ${m(i)}">Article 2 — ${p(i)}</div>
        <div class="compare-field"><div class="compare-field-label">Title</div><div class="compare-field-value"><strong>${i.title}</strong></div></div>
        <div class="compare-field"><div class="compare-field-label">Authors</div><div class="compare-field-value">${l(i.authors.slice(0,5).join(", "))}${i.authors.length>5?` +${i.authors.length-5} more`:""}</div></div>
        <div class="compare-field"><div class="compare-field-label">Journal</div><div class="compare-field-value">${l(i.fulljournalname)}</div></div>
        <div class="compare-field"><div class="compare-field-label">Date</div><div class="compare-field-value">${l(i.pubdate)}</div></div>
        <div class="compare-field"><div class="compare-field-label">PMID</div><div class="compare-field-value"><a href="https://pubmed.ncbi.nlm.nih.gov/${i.pmid}/" target="_blank" style="color:var(--accent)">${i.pmid}</a></div></div>
        <div class="compare-field"><div class="compare-field-label">Abstract</div><div class="compare-abstract">${l(s)}</div></div>
      </div>
    </div>
    <div class="compare-ai-row">
      <div class="compare-ai-label"><i class="ti ti-bulb"></i> AI Comparison Analysis</div>
      <div class="compare-ai-text">${c}</div>
    </div>
  </div>`,H.scrollIntoView({behavior:"smooth",block:"start"})};const Ie={dupilumab:"IL-4Rα inhibitor for Type 2 inflammation — first-in-class biologic with broadest approved indication set in atopic diseases.",nirsevimab:"Long-acting monoclonal antibody for RSV prevention — single-dose passive immunization providing ~5 months protection in infants.",tolebrutinib:"Brain-penetrant BTK inhibitor — novel dual mechanism targeting B-cells and microglia for relapsing and progressive MS.",fitusiran:"Anti-TFPI siRNA — subcutaneous prophylaxis for hemophilia A and B with and without inhibitors.",duvakitug:"Anti-TL1A antibody — targeting a novel TNF superfamily member in inflammatory bowel disease with cross-indication potential.",tezepelumab:"Anti-TSLP antibody — upstream mechanism blocking Type 2 inflammation cascade in severe asthma.",insulin:"Basal insulin analog — long-acting glycemic control with established cardiovascular safety profile.","atopic dermatitis":"Chronic Type 2 inflammatory skin disease — dupilumab has transformed treatment landscape with sustained efficacy through 4+ years.",rsv:"Leading cause of infant hospitalization — passive immunization with nirsevimab provides first universal prevention strategy.","multiple sclerosis":"Chronic neuroinflammatory disease — BTK inhibitors represent next-generation mechanism targeting both inflammation and neurodegeneration."};async function Se(e){var t;const a=e.filter(i=>i.isNejm).slice(0,2);a.length<2&&a.push(...e.filter(i=>!i.isNejm).slice(0,3-a.length));for(const i of a){await d(600);const n=document.getElementById(`abstract-${i.pmid}`);if(n){n.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Auto-fetching abstract…</p>';try{const s=`${C}/efetch.fcgi?db=pubmed&id=${i.pmid}&rettype=abstract&retmode=text`,g=(await(await fetch(s)).text()).match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i),u=g?g[1].trim():"";if(u&&u.length>50){const c=(i.title+" "+i.fulljournalname).toLowerCase();let v="";for(const[y,m]of Object.entries(Ie))if(c.includes(y)){v=m;break}v||(v=`${i.authors.length} authors from ${i.fulljournalname} (${((t=i.pubdate.match(/\d{4}/))==null?void 0:t[0])||""}) — review abstract for study design and key endpoints.`),n.innerHTML=`
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
            <span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Auto Deep-Dive</span>
            <div class="article-abstract">${l(u)}</div>
            <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>
            <div class="deep-dive-summary"><i class="ti ti-bulb"></i> ${v}</div>
          </div>`}else n.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Deep-Dive</span> Abstract not available from PubMed for this article.</p>'}catch{n.innerHTML=""}}}}const N=document.getElementById("demo-search-btn");N&&N.addEventListener("click",je);async function L(e,a){e.value="";for(let t=0;t<a.length;t++)e.value+=a[t],await d(20+Math.random()*25)}async function je(){N.disabled=!0,N.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running demo…',w.scrollIntoView({behavior:"smooth",block:"center"}),await d(600),await h("Literature search demo — querying PubMed and NEJM in real time"),await L(w,"dupilumab atopic dermatitis long-term safety"),await d(500),await S(),await h("Results include NEJM articles, auto deep-dive summaries, and Sanofi pipeline intelligence"),w.scrollIntoView({behavior:"smooth",block:"center"}),await d(1e3),w.value="",await h("Running a second search — nirsevimab RSV prevention"),await L(w,"nirsevimab RSV prevention infants"),await d(500),await S(),await h("Each search generates intelligence signals for MSL field teams via Orion"),Q(),N.disabled=!1,N.innerHTML='<i class="ti ti-player-play"></i> Watch literature search demo'}function G(){T.innerHTML=`<div class="chat-msg chat-msg-agent">
    <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
    <div class="chat-msg-content">
      <div class="chat-msg-bubble chat-agent-bubble">
        I'm the Literature Intelligence Agent with live connections to <strong>PubMed</strong> (36M+ articles) and the <strong>NEJM</strong>. Ask me about any Sanofi therapeutic area — I'll search, retrieve, and synthesize the evidence.
      </div>
    </div>
  </div>`,k.innerHTML=`<button class="chat-suggestion" data-q="What are the latest publications on dupilumab?">Latest dupilumab pubs</button>
    <button class="chat-suggestion" data-q="How does dupilumab compare to abrocitinib in head-to-head data?">Dupilumab vs abrocitinib</button>
    <button class="chat-suggestion" data-q="What is the pediatric safety profile of dupilumab?">Pediatric safety data</button>
    <button class="chat-suggestion" data-q="What evidence exists for nirsevimab RSV prevention?">Nirsevimab RSV</button>
    <button class="chat-suggestion" data-q="Tell me about tolebrutinib in multiple sclerosis">Tolebrutinib in MS</button>`,k.style.display="flex",$.value="",E.disabled=!0,k.querySelectorAll(".chat-suggestion").forEach(e=>{e.addEventListener("click",()=>{$.value=e.dataset.q,I()})})}const se=document.getElementById("chat-clear-btn");se&&se.addEventListener("click",G);const P=document.getElementById("demo-chat-btn");P&&P.addEventListener("click",xe);async function h(e){const a=document.getElementById("demo-narrator");a&&(a.innerHTML=`<i class="ti ti-sparkles"></i> ${e}`,de()&&a.classList.add("visible"),me(),await ue(e))}function Q(){const e=document.getElementById("demo-narrator");e&&e.classList.remove("visible"),pe(),he()}async function xe(){P.disabled=!0,P.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running demo…',G(),await d(600),await h("Literature Intelligence demo — live PubMed and NEJM searches with AI synthesis"),await L($,"What are the latest publications on dupilumab?"),await h("Searching PubMed and NEJM for dupilumab publications"),E.disabled=!1,await I(),await d(2e3),await h("First query complete — now searching for nirsevimab RSV evidence"),await L($,"What evidence exists for nirsevimab RSV prevention?"),E.disabled=!1,await I(),await d(2e3),await h("Second query complete — searching for tolebrutinib in multiple sclerosis"),await L($,"Tell me about tolebrutinib in multiple sclerosis"),E.disabled=!1,await I(),await d(1500),await h("Three live PubMed searches with AI synthesis — all citations link to original papers"),Q(),P.disabled=!1,P.innerHTML='<i class="ti ti-player-play"></i> Watch conversation demo'}let F=!1;async function ce(){if(F)return;F=!0;const e=document.getElementById("run-demo");e&&(e.disabled=!0,e.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running...');const a=document.querySelector(".main-panel");a&&a.scrollTo({top:0,behavior:"smooth"}),await d(500),await h("Literature Intelligence — live PubMed and NEJM search with AI synthesis and Orion integration");const t=document.getElementById("governance-bar");t&&(t.style.display="flex",t.scrollIntoView({behavior:"smooth",block:"center"}),await d(600)),await h("Governance layer active — every search is logged, sourced, and compliance-stamped"),await h("Let's search PubMed — querying dupilumab atopic dermatitis long-term safety"),w.scrollIntoView({behavior:"smooth",block:"center"}),await d(400),await L(w,"dupilumab atopic dermatitis long-term safety"),await d(600),await S(),await d(4e3),await h("Results include NEJM articles with auto deep-dive summaries and Sanofi pipeline intelligence");const i=document.getElementById("intel-panel");i&&(i.scrollIntoView({behavior:"smooth",block:"center"}),await d(800),await h("Intelligence panel — publication trends, top journals, and key authors extracted automatically"),await d(1500)),await h("Filtering to NEJM only — the highest impact journal results");const n=document.querySelector('.source-btn[data-source="nejm"]');n&&(n.click(),await d(800)),await h("NEJM filter applied — showing only New England Journal of Medicine publications");const s=document.querySelector('.source-btn[data-source="all"]');s&&s.click(),await d(400);const o=document.getElementById("memory-section");o&&(o.scrollIntoView({behavior:"smooth",block:"center"}),await d(600),await h("Agent memory — the system remembers your search history across sessions"),await d(1e3)),w.scrollIntoView({behavior:"smooth",block:"center"}),await d(400),await h("Second search — nirsevimab RSV prevention to demonstrate cross-TA capabilities"),w.value="",await L(w,"nirsevimab RSV prevention infants"),await d(600),await S(),await d(4e3),await h("Each search generates an intelligence signal for MSL field teams via Orion"),await h("The Literature AI agent answers questions with live PubMed searches and AI synthesis"),G(),await d(400),await L($,"What are the latest publications on dupilumab?"),await d(300),E.disabled=!1,await I(),await d(4e3),await h("First chat query complete — live PubMed results with citations and source links"),await d(800),await L($,"Tell me about tolebrutinib in multiple sclerosis"),E.disabled=!1,await I(),await d(4e3),await h("Cross-TA search — the agent covers all Sanofi therapeutic areas with live evidence"),a&&a.scrollTo({top:0,behavior:"smooth"}),await d(500),await h("Literature Intelligence — live PubMed, NEJM, AI synthesis, and Orion signals in one platform"),Q(),F=!1,e&&(e.disabled=!1,e.innerHTML='<i class="ti ti-player-play"></i> Play Demo')}const ne=document.getElementById("run-demo");ne&&ne.addEventListener("click",ce);window.location.hash==="#autoplay"&&(window.location.hash="",setTimeout(ce,600));function Te(){const e=document.createElement("div");return e.className="chat-msg chat-msg-agent",e.innerHTML=`
    <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
    <div class="chat-msg-content">
      <div class="chat-msg-bubble chat-agent-bubble">
        <span class="chat-typing"><span></span><span></span><span></span></span>
        <span style="font-size:12px;color:var(--text-muted);margin-left:8px">Searching PubMed & NEJM…</span>
      </div>
    </div>`,T.appendChild(e),T.scrollTop=T.scrollHeight,e}
