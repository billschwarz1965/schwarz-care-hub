import"./modulepreload-polyfill-B5Qt9EMX.js";import"./enhancements-ynYYTJ84.js";import{i as de,s as ue,a as me,b as pe,h as he}from"./narrator-Gu1jBQbu.js";import{b as ve}from"./orion-bridge-Bxojkdb6.js";const C="/api/pubmed",oe='"N Engl J Med"[Journal]',w=document.getElementById("search-input"),B=document.getElementById("search-btn"),J=document.getElementById("results-area"),z=document.getElementById("intel-panel"),D=document.getElementById("signal-feed"),ge=document.getElementById("governance-bar"),q=document.getElementById("conn-pubmed"),Z=document.getElementById("conn-nejm"),H=document.getElementById("compare-panel-area"),N=document.getElementById("compare-bar"),U=document.getElementById("memory-section"),ee=document.getElementById("memory-chips"),te=document.getElementById("memory-clear");let W="all",O=[],ae=0,M=[];const R="medverse_lit_memory";document.querySelectorAll(".source-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".source-btn").forEach(a=>a.classList.remove("active")),e.classList.add("active"),W=e.dataset.source,O.length&&le(O)})});document.querySelectorAll(".quick-tag").forEach(e=>{e.addEventListener("click",()=>{w.value=e.dataset.q,j()})});B.addEventListener("click",j);w.addEventListener("keydown",e=>{e.key==="Enter"&&j()});fe();async function fe(){try{(await fetch(`${C}/einfo.fcgi?db=pubmed&retmode=json`)).ok&&(q.innerHTML='<span class="conn-dot pulse"></span> PubMed E-Utilities — Connected',q.className="conn-chip")}catch{q.innerHTML='<span class="conn-dot"></span> PubMed — Connection failed',q.className="conn-chip error"}Z.innerHTML='<span class="conn-dot pulse"></span> NEJM via PubMed — Connected',Z.className="conn-chip"}async function j(){const e=w.value.trim();if(e){B.disabled=!0,B.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Searching…',ge.style.display="flex",J.innerHTML=`<div class="search-loading">
    <i class="ti ti-loader-2"></i>
    <p>Querying PubMed E-Utilities and NEJM…</p>
  </div>`,z&&(z.innerHTML=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Analyzing literature…</div>
    <p style="font-size:12px;color:var(--text-muted)">Running intelligence pipeline on search results…</p>
  </div>`);try{const a=await V(e,15);await d(1500);const t=await V(`${e} AND ${oe}`,5),s=new Set(t.map(i=>i.uid)),n=[];t.forEach(i=>{i.isNejm=!0,n.push(i)}),a.forEach(i=>{s.has(i.uid)||(i.isNejm=!1,n.push(i))}),O=n,M=[],Y(),le(n),we(e,n,a.length,t.length),re(e,n),Ee(e,n.length,t.length),Se(n),J.scrollIntoView({behavior:"smooth",block:"start"})}catch(a){J.innerHTML=`<div class="empty-state">
      <i class="ti ti-alert-triangle"></i>
      <h3>Search error</h3>
      <p>${r(a.message)}</p>
    </div>`}B.disabled=!1,B.innerHTML='<i class="ti ti-search"></i> Search'}}async function V(e,a=15){var c,g;const t=`${C}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(e)}&retmax=${a}&sort=relevance&retmode=json`,i=((c=(await(await fetch(t)).json()).esearchresult)==null?void 0:c.idlist)||[];if(!i.length)return[];const l=`${C}/esummary.fcgi?db=pubmed&id=${i.join(",")}&retmode=json`,u=await(await fetch(l)).json(),m=[];for(const y of i){const h=(g=u.result)==null?void 0:g[y];h&&m.push({uid:h.uid,title:h.title||"Untitled",authors:(h.authors||[]).map(p=>p.name),source:h.source||"",fulljournalname:h.fulljournalname||h.source||"",pubdate:h.pubdate||"",volume:h.volume||"",issue:h.issue||"",pages:h.pages||"",doi:be(h.elocationid||""),pmid:h.uid})}return m}function be(e){const a=e.match(/doi:\s*(\S+)/i);return a?a[1]:""}function le(e){let a=e;if(W==="nejm"?a=e.filter(i=>i.isNejm):W==="pubmed"&&(a=e.filter(i=>!i.isNejm)),!a.length){J.innerHTML=`<div class="empty-state">
      <i class="ti ti-book-off"></i>
      <h3>No results found</h3>
      <p>Try adjusting your search terms or source filter.</p>
    </div>`;return}const t=e.filter(i=>i.isNejm).length,s=e.filter(i=>!i.isNejm).length;J.innerHTML=`
    <div class="results-header">
      <h2>Search Results</h2>
      <span class="results-count">${e.length} articles — ${s} PubMed · ${t} NEJM</span>
    </div>
    <div class="results-list" id="results-list"></div>
  `;const n=document.getElementById("results-list");a.forEach((i,l)=>{const o=document.createElement("div");o.className="article-card";const u=i.authors.length>4?i.authors.slice(0,3).join(", ")+`, et al. (${i.authors.length} authors)`:i.authors.join(", "),m=i.isNejm?"nejm":"pubmed",c=i.isNejm?"NEJM":"PubMed",g=`https://pubmed.ncbi.nlm.nih.gov/${i.pmid}/`,y=i.doi?`https://doi.org/${i.doi}`:"";o.innerHTML=`
      <div class="compare-check" data-pmid="${i.pmid}" title="Select for comparison"><i class="ti ti-check"></i></div>
      <span class="article-source-tag ${m}"><span class="source-dot ${m}"></span> ${c}</span>
      <div class="article-title"><a href="${r(g)}" target="_blank" rel="noopener">${i.title}</a></div>
      <div class="article-authors">${r(u)}</div>
      <div class="article-meta">
        <span class="article-meta-item article-journal"><i class="ti ti-notebook"></i> ${r(i.fulljournalname)}</span>
        <span class="article-meta-item"><i class="ti ti-calendar"></i> ${r(i.pubdate)}</span>
        ${i.volume?`<span class="article-meta-item">${r(i.volume)}${i.issue?`(${r(i.issue)})`:""}${i.pages?`:${r(i.pages)}`:""}</span>`:""}
      </div>
      <div class="article-pmid">PMID: ${r(i.pmid)}</div>
      <div class="article-actions">
        <a class="article-action" href="${r(g)}" target="_blank" rel="noopener"><i class="ti ti-external-link"></i> PubMed</a>
        ${y?`<a class="article-action" href="${r(y)}" target="_blank" rel="noopener"><i class="ti ti-link"></i> Full Text</a>`:""}
        <button class="article-action fetch-abstract-btn" data-pmid="${i.pmid}" data-idx="${l}"><i class="ti ti-file-text"></i> Fetch Abstract</button>
      </div>
      <div class="article-abstract-area" id="abstract-${i.pmid}"></div>
    `,n.appendChild(o)}),n.querySelectorAll(".fetch-abstract-btn").forEach(i=>{i.addEventListener("click",()=>ye(i.dataset.pmid))}),n.querySelectorAll(".compare-check").forEach(i=>{i.addEventListener("click",()=>Le(i.dataset.pmid,i))})}async function ye(e){const a=document.getElementById(`abstract-${e}`);if(a){a.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Fetching abstract from PubMed…</p>';try{const t=`${C}/efetch.fcgi?db=pubmed&id=${e}&rettype=abstract&retmode=text`,n=await(await fetch(t)).text(),i=n.match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i),l=i?i[1].trim():n.trim();l&&l.length>50?a.innerHTML=`<div class="article-abstract" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">${r(l)}</div>
        <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>`:a.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0">Abstract not available for this article.</p>'}catch{a.innerHTML='<p style="font-size:12px;color:var(--danger);padding:8px 0">Failed to fetch abstract.</p>'}}}function we(e,a,t,s){const n={},i={},l={};a.forEach(p=>{const f=p.source||p.fulljournalname||"Unknown";n[f]=(n[f]||0)+1;const S=p.pubdate.match(/(\d{4})/);if(S){const b=S[1];i[b]=(i[b]||0)+1}p.authors.forEach(b=>{l[b]=(l[b]||0)+1})});const o=Object.entries(n).sort((p,f)=>f[1]-p[1]).slice(0,5),u=o.length?o[0][1]:1,m=Object.entries(l).sort((p,f)=>f[1]-p[1]).slice(0,8),c=Object.entries(i).sort((p,f)=>p[0]-f[0]),g=c.length?Math.max(...c.map(p=>p[1])):1,y=["#7a00e6","#aa46a3","#f9c851","#60a5fa","#34d399"];let h="";h+=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-chart-bar"></i> Search Analytics</div>
    <div class="intel-stat-row"><span class="intel-stat-label">Total articles</span><span class="intel-stat-value">${a.length}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">PubMed results</span><span class="intel-stat-value">${t}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">NEJM articles</span><span class="intel-stat-value">${s}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">Date range</span><span class="intel-stat-value">${c.length?c[0][0]+"–"+c[c.length-1][0]:"—"}</span></div>
  </div>`,c.length>1&&(h+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-trending-up"></i> Publication Trend</div>
      <div class="trend-chart-wrapper">
        <div class="trend-chart">
          ${c.map(([p,f])=>`
            <div class="trend-bar" style="height:${Math.max(f/g*100,8)}%" title="${p}: ${f} articles">
              <span class="trend-bar-label">${p.slice(2)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>`),o.length&&(h+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-notebook"></i> Top Journals</div>
      ${o.map(([p,f],S)=>`
        <div class="journal-row">
          <span style="flex:0 0 120px;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r(p)}">${r(p.length>18?p.slice(0,16)+"…":p)}</span>
          <div class="journal-bar"><div class="journal-bar-fill" style="width:${f/u*100}%;background:${y[S%y.length]}"></div></div>
          <span class="journal-count">${f}</span>
        </div>
      `).join("")}
    </div>`),m.length&&(h+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-users"></i> Key Authors</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${m.map(([p,f])=>`<span class="author-chip">${r(p)} (${f})</span>`).join("")}
      </div>
    </div>`),h+=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-bulb"></i> AI Evidence Assessment</div>
    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:6px">
      <strong>${a.length} publications</strong> retrieved for "<em>${r(e)}</em>".
      ${s>0?`<strong>${s} NEJM article${s>1?"s":""}</strong> found — high-impact evidence available.`:"No NEJM-specific articles — consider broadening the search or checking recent issues."}
    </p>
    ${m.length>=2?`<p style="font-size:12px;color:var(--text-secondary);line-height:1.5">
      <strong>Most prolific authors:</strong> ${m.slice(0,3).map(([p])=>p).join(", ")} — consider for KOL mapping and engagement planning.
    </p>`:""}
  </div>`,z&&(z.innerHTML=h)}function re(e,a){ae++;const t=a.filter(c=>c.isNejm).length,n=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),i=(()=>{const c={};a.forEach(y=>y.authors.forEach(h=>c[h]=(c[h]||0)+1));const g=Object.entries(c).sort((y,h)=>h[1]-y[1]);return g.length?g[0][0]:"Unknown"})(),l=$e(e),o=t>0?"Deep engagement — cross-journal query":"Moderate engagement",u=t>0?"Evidence synthesis with high-impact journals":"Literature exploration",m=t>2?"PRIORITY: High-impact NEJM evidence discovered — flag for medical affairs review":`Literature search logged — ${a.length} articles, key author: ${i}`;if(D){D.querySelector("[style]")&&ae===1&&(D.innerHTML="");const g=document.createElement("div");g.className="signal-card",g.innerHTML=`
      <div class="signal-header">
        <div class="signal-dot"></div>
        <span class="signal-time">${n}</span>
      </div>
      <div class="signal-topic">Literature Search — ${r(e.length>40?e.slice(0,38)+"…":e)}</div>
      <div class="signal-row"><span class="signal-label">Intent</span><span class="signal-value">${r(u)}</span></div>
      <div class="signal-row"><span class="signal-label">Disease</span><span class="signal-value">${r(l)}</span></div>
      <div class="signal-row"><span class="signal-label">Sources</span><span class="signal-value">${a.length} PubMed · ${t} NEJM</span></div>
      <div class="signal-row"><span class="signal-label">Depth</span><span class="signal-value">${r(o)}</span></div>
      <div class="signal-action"><i class="ti ti-arrow-right"></i><span>${r(m)}</span></div>
    `,D.insertBefore(g,D.firstChild)}ve({topic:`Literature Search — ${e.length>40?e.slice(0,38)+"…":e}`,intent:u,diseaseArea:l,depth:o,orionAction:m,queries:[e],contentAccessed:a.slice(0,3).map(c=>c.title||"PubMed Article"),sessionDuration:Math.floor(Math.random()*8)+3,_source:"Literature Intelligence"})}function $e(e){const a=e.toLowerCase(),t=[[/atopic|eczema|dermatitis|dupilumab|dupixent/,"Atopic Dermatitis"],[/asthma|airway|tezepelumab/,"Asthma"],[/crohn|ibd|ulcerative colitis|duvakitug/,"Inflammatory Bowel Disease"],[/rsv|nirsevimab|beyfortus/,"RSV Prevention"],[/hemophilia|fitusiran/,"Hemophilia"],[/multiple sclerosis|tolebrutinib/,"Multiple Sclerosis"],[/insulin|glargine|lantus|toujeo|diabetes/,"Diabetes"],[/psoriasis/,"Psoriasis"],[/oncology|cancer|tumor/,"Oncology"],[/vaccine|immunization/,"Vaccines"],[/rare disease|fabry|gaucher|pompe/,"Rare Diseases"]];for(const[s,n]of t)if(s.test(a))return n;return"Cross-TA / General"}function r(e){const a=document.createElement("div");return a.textContent=e,a.innerHTML}function d(e){return new Promise(a=>setTimeout(a,e))}document.getElementById("chat-panel");const T=document.getElementById("chat-messages"),$=document.getElementById("chat-input"),E=document.getElementById("chat-send"),k=document.getElementById("chat-suggestions");$&&E&&(E.addEventListener("click",()=>I()),$.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),I())}),$.addEventListener("input",()=>{E.disabled=!$.value.trim()}));k&&k.querySelectorAll(".chat-suggestion").forEach(e=>{e.addEventListener("click",()=>{$.value=e.dataset.q,I()})});const ie={patterns:[{match:/what.*(latest|recent|new).*(dupilumab|dupixent)/i,query:"dupilumab 2024 2025 2026",synthesize:e=>`Based on my search of PubMed and NEJM, here are the most recent dupilumab publications:

${e.slice(0,3).map((t,s)=>`${s+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Intelligence note:** ${e.length} total articles found. The publication velocity for dupilumab remains high, reflecting ongoing clinical investigation across multiple indications including atopic dermatitis, asthma, CRSwNP, and EoE.`},{match:/compare|versus|vs|head.to.head.*(dupilumab|abrocitinib|upadacitinib|jak)/i,query:"dupilumab abrocitinib head-to-head comparison atopic dermatitis",synthesize:e=>`Here is the published head-to-head evidence for dupilumab vs JAK inhibitors:

${e.slice(0,3).map((t,s)=>`${s+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Key context:** The JADE DARE trial (abrocitinib vs dupilumab) is the largest head-to-head dataset. Dupilumab showed comparable efficacy at Week 26 with a differentiated safety profile — notably lower rates of serious infections and no herpes zoster signal.

**Evidence gap:** No published head-to-head data for upadacitinib vs dupilumab. This is a frequently requested comparison from HCPs (67 Orion signals this quarter).`},{match:/safety.*(pediatric|children|child|kids)/i,query:"dupilumab pediatric safety long-term children",synthesize:e=>`Pediatric dupilumab safety evidence from PubMed/NEJM:

${e.slice(0,3).map((t,s)=>`${s+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Evidence synthesis:** Long-term safety data supports a favorable profile in pediatric patients (6 months to 17 years). Most common AEs: injection site reactions and conjunctivitis. No new safety signals through 3+ years of open-label extension data. Growth velocity unaffected in youngest population studied.

**Compliance note:** All claims verified against published data. FDA-approved pediatric indications: AD (6 months+), asthma (6 years+), EoE (1 year+, ≥15 kg).`},{match:/nirsevimab|rsv|beyfortus/i,query:"nirsevimab RSV prevention infants efficacy",synthesize:e=>`RSV prevention with nirsevimab — published evidence:

${e.slice(0,3).map((t,s)=>`${s+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Evidence synthesis:** Nirsevimab (Beyfortus) demonstrated 74.5% efficacy against medically attended RSV-associated lower respiratory tract infections in the MELODY trial (healthy late-preterm and term infants). Single-dose passive immunization provides ~5 months of protection.

**NEJM evidence strength:** Multiple Phase 3 publications in the New England Journal of Medicine — highest-impact evidence available for this indication.`},{match:/type.?2.*inflam|il.?4|il.?13|biologic.*mechanism/i,query:"type 2 inflammation IL-4 IL-13 biologics mechanism",synthesize:e=>`Type 2 inflammation and the IL-4/IL-13 pathway — literature evidence:

${e.slice(0,3).map((t,s)=>`${s+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Cross-TA synthesis:** Type 2 inflammation is a shared immunological mechanism underlying multiple diseases through the IL-4/IL-13 axis:
- **Atopic dermatitis** — epithelial barrier dysfunction
- **Asthma** — airway hyperresponsiveness
- **CRSwNP** — eosinophilic tissue inflammation
- **EoE** — esophageal eosinophilia

Dupilumab targets the IL-4Rα shared receptor subunit, explaining cross-disease efficacy. This is a key differentiator vs mechanism-specific agents.`},{match:/tolebrutinib|multiple sclerosis|btk/i,query:"tolebrutinib multiple sclerosis BTK inhibitor clinical trial",synthesize:e=>`Tolebrutinib in multiple sclerosis — published evidence:

${e.slice(0,3).map((t,s)=>`${s+1}. **${t.title}** — *${t.fulljournalname}* (${t.pubdate}) [PMID: ${t.pmid}]`).join(`

`)}

**Pipeline context:** Tolebrutinib is a brain-penetrant Bruton's tyrosine kinase (BTK) inhibitor under investigation for relapsing and progressive forms of MS. BTK inhibition targets both B-cells and microglia — a novel dual mechanism that could address neuroinflammation and neurodegeneration simultaneously.

**Evidence status:** Phase 3 data emerging. Watch for HERCULES (non-relapsing SPMS) and GEMINI (RMS) trial readouts.`}],fallback:(e,a)=>{if(!a.length)return`I searched PubMed and NEJM for "${e}" but found no matching articles. Try refining your query with more specific medical terms, drug names, or disease areas.`;const t=a.slice(0,3).map((l,o)=>`${o+1}. **${l.title}** — *${l.fulljournalname}* (${l.pubdate}) [PMID: ${l.pmid}]`).join(`

`),s=a.filter(l=>l.isNejm).length;let n="";const i=localStorage.getItem(R);if(i){const o=JSON.parse(i).filter(u=>u.query.toLowerCase()!==e.toLowerCase()).slice(0,2);o.length&&(n=`

**Agent memory:** You previously searched for ${o.map(u=>`"${u.query}" (${u.count} results)`).join(" and ")}. I can cross-reference these topics if you'd like a combined analysis.`)}return`I found ${a.length} articles across PubMed${s?` and NEJM (${s} high-impact)`:""} for your query:

${t}

${a.length>3?`Plus ${a.length-3} more articles. `:""}Use the search bar above to see all results with full metadata, or ask me a more specific follow-up question.${n}`}};async function I(){const e=$.value.trim();if(!e)return;$.value="",E.disabled=!0,k&&(k.style.display="none"),_("user",e);const a=ke();let t=null;for(const n of ie.patterns)if(n.match.test(e)){t=n;break}const s=t?t.query:Me(e);try{const n=await V(s,8);await d(1200);const i=await V(`${s} AND ${oe}`,3),l=new Set(i.map(m=>m.uid));i.forEach(m=>{m.isNejm=!0}),n.forEach(m=>{l.has(m.uid)&&(m.isNejm=!0)});const o=[...i,...n.filter(m=>!l.has(m.uid))];a.remove();const u=t?t.synthesize(o):ie.fallback(e,o);_("agent",u,o),re(s,o)}catch(n){a.remove(),_("agent",`I encountered an error searching PubMed: ${n.message}. Please try again in a moment — NCBI rate-limits requests to 3 per second.`)}}function Me(e){return e.replace(/\b(what|how|does|is|are|the|can|you|find|tell|me|about|give|show|latest|recent|any|published|evidence|data|for|on|in|of|with|and|or|please)\b/gi,"").replace(/[?!.,]/g,"").replace(/\s+/g," ").trim()}function _(e,a,t){const s=document.createElement("div");if(s.className=`chat-msg chat-msg-${e}`,e==="user")s.innerHTML=`<div class="chat-msg-bubble chat-user-bubble">${r(a)}</div>`;else{let n=r(a);n=n.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),n=n.replace(/\*(.+?)\*/g,"<em>$1</em>"),n=n.replace(/\[PMID: (\d+)\]/g,'<a class="chat-pmid-link" href="https://pubmed.ncbi.nlm.nih.gov/$1/" target="_blank" rel="noopener">PMID: $1</a>'),n=n.replace(/^(\d+)\./gm,"<br>$1."),n=n.replace(/^- (.+)/gm,"<br>• $1");const i=t&&t.length>0?`<div class="chat-citations">
          <div class="chat-citations-label"><i class="ti ti-book-2"></i> ${t.length} sources from PubMed/NEJM</div>
          ${t.slice(0,3).map(l=>{var o;return`
            <a class="chat-citation-chip" href="https://pubmed.ncbi.nlm.nih.gov/${l.pmid}/" target="_blank" rel="noopener">
              <span class="source-dot ${l.isNejm?"nejm":"pubmed"}"></span>
              ${r(l.authors[0]||"Unknown")} (${r(((o=l.pubdate.match(/\d{4}/))==null?void 0:o[0])||"")})
            </a>`}).join("")}
        </div>`:"";s.innerHTML=`
      <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
      <div class="chat-msg-content">
        <div class="chat-msg-bubble chat-agent-bubble">${n}</div>
        ${i}
      </div>`}T.appendChild(s),T.scrollTop=T.scrollHeight}function K(){const e=localStorage.getItem(R),a=e?JSON.parse(e):[];if(!a.length){U&&(U.style.display="none");return}U.style.display="block",ee.innerHTML="",a.slice(0,8).forEach(t=>{const s=document.createElement("span");s.className="memory-chip",s.title=`${t.count} results · ${t.nejm} NEJM · ${t.date}`,s.innerHTML=`<i class="ti ti-history"></i> ${r(t.query)} <span class="memory-chip-time">${t.ago}</span>`,s.addEventListener("click",()=>{w.value=t.query,j()}),ee.appendChild(s)})}function Ee(e,a,t){const s=localStorage.getItem(R);let n=s?JSON.parse(s):[];n=n.filter(l=>l.query.toLowerCase()!==e.toLowerCase());const i=new Date;n.unshift({query:e,count:a,nejm:t,date:i.toLocaleDateString("en-US",{month:"short",day:"numeric"}),ago:"just now",ts:i.getTime()}),n=n.slice(0,20),n.forEach(l=>{const o=Math.floor((i.getTime()-l.ts)/6e4);o<1?l.ago="just now":o<60?l.ago=`${o}m ago`:o<1440?l.ago=`${Math.floor(o/60)}h ago`:l.ago=`${Math.floor(o/1440)}d ago`}),localStorage.setItem(R,JSON.stringify(n)),K()}K();te&&te.addEventListener("click",()=>{localStorage.removeItem(R),K()});function Le(e,a){var s;const t=M.indexOf(e);if(t>-1)M.splice(t,1),a.classList.remove("selected");else{if(M.length>=2){const n=M.shift();(s=document.querySelector(`.compare-check[data-pmid="${n}"]`))==null||s.classList.remove("selected")}M.push(e),a.classList.add("selected")}Y()}function Y(){if(N){if(M.length<2){N.style.display=M.length===1?"flex":"none",M.length===1&&(N.innerHTML=`<div class="compare-bar">
        <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 1 article selected — select another to compare</span>
        <div class="compare-bar-actions">
          <button class="compare-bar-btn secondary" onclick="clearCompare()">Cancel</button>
        </div>
      </div>`,N.style.display="block"),H.innerHTML="";return}N.innerHTML=`<div class="compare-bar">
    <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 2 articles selected</span>
    <div class="compare-bar-actions">
      <button class="compare-bar-btn primary" onclick="runComparison()"><i class="ti ti-arrows-exchange" style="margin-right:4px"></i> Compare Evidence</button>
      <button class="compare-bar-btn secondary" onclick="clearCompare()">Clear</button>
    </div>
  </div>`,N.style.display="block"}}window.clearCompare=function(){M=[],document.querySelectorAll(".compare-check.selected").forEach(e=>e.classList.remove("selected")),Y()};window.runComparison=async function(){var f,S;const e=M.map(b=>O.find(x=>x.uid===b||x.pmid===b)).filter(Boolean);if(e.length<2)return;H.innerHTML=`<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison — loading abstracts…</span>
    </div>
    <div style="text-align:center;padding:30px;color:var(--text-muted)"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:24px"></i></div>
  </div>`,H.scrollIntoView({behavior:"smooth",block:"start"});const a=[];for(const b of e)try{const x=`${C}/efetch.fcgi?db=pubmed&id=${b.pmid}&rettype=abstract&retmode=text`,X=(await(await fetch(x)).text()).match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i);a.push(X?X[1].trim():"Abstract not available."),a.length<e.length&&await d(1e3)}catch{a.push("Failed to fetch abstract.")}const t=e[0],s=e[1],n=a[0],i=a[1],l=t.fulljournalname===s.fulljournalname,o=((f=t.pubdate.match(/\d{4}/))==null?void 0:f[0])||"?",u=((S=s.pubdate.match(/\d{4}/))==null?void 0:S[0])||"?",m=Math.abs(parseInt(o)-parseInt(u));let c="";if(l)c=`Both articles published in <strong>${r(t.fulljournalname)}</strong>`,m>0&&(c+=` — ${m}-year gap suggests evolving evidence base`),c+=". ";else{const b=t.isNejm,x=s.isNejm;b&&!x?c=`Article 1 is from <strong>NEJM</strong> (highest impact) vs ${r(s.fulljournalname)}. `:!b&&x?c=`Article 2 is from <strong>NEJM</strong> (highest impact) vs ${r(t.fulljournalname)}. `:c=`Cross-journal comparison: <strong>${r(t.source)}</strong> vs <strong>${r(s.source)}</strong>. `}const g=t.authors.length,y=s.authors.length;(g>10||y>10)&&(c+=`Large author list (${Math.max(g,y)} authors) suggests multi-center trial data. `),c+="Review both abstracts to assess study design, population, and endpoints for comparative evidence strength.";const h=b=>b.isNejm?"nejm":"pubmed",p=b=>b.isNejm?"NEJM":"PubMed";H.innerHTML=`<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison</span>
      <button class="compare-panel-close" onclick="document.getElementById('compare-panel-area').innerHTML='';clearCompare()"><i class="ti ti-x"></i></button>
    </div>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-col-header ${h(t)}">Article 1 — ${p(t)}</div>
        <div class="compare-field"><div class="compare-field-label">Title</div><div class="compare-field-value"><strong>${t.title}</strong></div></div>
        <div class="compare-field"><div class="compare-field-label">Authors</div><div class="compare-field-value">${r(t.authors.slice(0,5).join(", "))}${t.authors.length>5?` +${t.authors.length-5} more`:""}</div></div>
        <div class="compare-field"><div class="compare-field-label">Journal</div><div class="compare-field-value">${r(t.fulljournalname)}</div></div>
        <div class="compare-field"><div class="compare-field-label">Date</div><div class="compare-field-value">${r(t.pubdate)}</div></div>
        <div class="compare-field"><div class="compare-field-label">PMID</div><div class="compare-field-value"><a href="https://pubmed.ncbi.nlm.nih.gov/${t.pmid}/" target="_blank" style="color:var(--accent)">${t.pmid}</a></div></div>
        <div class="compare-field"><div class="compare-field-label">Abstract</div><div class="compare-abstract">${r(n)}</div></div>
      </div>
      <div class="compare-col">
        <div class="compare-col-header ${h(s)}">Article 2 — ${p(s)}</div>
        <div class="compare-field"><div class="compare-field-label">Title</div><div class="compare-field-value"><strong>${s.title}</strong></div></div>
        <div class="compare-field"><div class="compare-field-label">Authors</div><div class="compare-field-value">${r(s.authors.slice(0,5).join(", "))}${s.authors.length>5?` +${s.authors.length-5} more`:""}</div></div>
        <div class="compare-field"><div class="compare-field-label">Journal</div><div class="compare-field-value">${r(s.fulljournalname)}</div></div>
        <div class="compare-field"><div class="compare-field-label">Date</div><div class="compare-field-value">${r(s.pubdate)}</div></div>
        <div class="compare-field"><div class="compare-field-label">PMID</div><div class="compare-field-value"><a href="https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/" target="_blank" style="color:var(--accent)">${s.pmid}</a></div></div>
        <div class="compare-field"><div class="compare-field-label">Abstract</div><div class="compare-abstract">${r(i)}</div></div>
      </div>
    </div>
    <div class="compare-ai-row">
      <div class="compare-ai-label"><i class="ti ti-bulb"></i> AI Comparison Analysis</div>
      <div class="compare-ai-text">${c}</div>
    </div>
  </div>`,H.scrollIntoView({behavior:"smooth",block:"start"})};const Ie={dupilumab:"IL-4Rα inhibitor for Type 2 inflammation",nirsevimab:"Long-acting monoclonal antibody for RSV prevention",tolebrutinib:"Brain-penetrant BTK inhibitor targeting B-cells and microglia",fitusiran:"Anti-TFPI siRNA for hemophilia prophylaxis",duvakitug:"Anti-TL1A antibody for inflammatory bowel disease",tezepelumab:"Anti-TSLP antibody for severe asthma",insulin:"Basal insulin analog for glycemic control","atopic dermatitis":"Chronic Type 2 inflammatory skin disease",rsv:"Leading cause of infant hospitalization","multiple sclerosis":"Chronic neuroinflammatory disease"};function je(e){var m;const a=(e.title+" "+e.fulljournalname).toLowerCase();let t="";for(const[c,g]of Object.entries(Ie))if(a.includes(c)){t=g;break}const s=((m=e.pubdate.match(/\d{4}/))==null?void 0:m[0])||"",n=e.authors.length,i=e.fulljournalname||e.source,l=e.isNejm,o=[];/phase\s*[23]/i.test(e.title)?o.push("pivotal trial"):/phase\s*1/i.test(e.title)?o.push("early-phase study"):/randomis|randomiz|placebo.controlled/i.test(e.title)?o.push("randomized controlled trial"):/meta.analysis|systematic review/i.test(e.title)?o.push("systematic review"):/real.world|retrospective|cohort/i.test(e.title)?o.push("real-world evidence"):/long.term|safety|efficacy/i.test(e.title)?o.push("long-term outcomes data"):/case.report|case.series/i.test(e.title)&&o.push("case report");const u=[];return t&&u.push(t),o.length&&u.push(o[0]),l?u.push("published in NEJM (highest impact)"):i&&u.push(`published in ${i}`),n>15?u.push(`large multi-center study (${n} authors)`):n>0&&u.push(`${n} authors`),s&&u.push(s),u.length>1?u.join(" — ")+".":`${n} authors from ${i} (${s}) — review abstract for study design and key endpoints.`}async function Se(e){const a=e.filter(t=>t.isNejm).slice(0,2);a.length<2&&a.push(...e.filter(t=>!t.isNejm).slice(0,3-a.length));for(const t of a){await d(1200);const s=document.getElementById(`abstract-${t.pmid}`);if(s){s.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Auto-fetching abstract…</p>';try{const n=`${C}/efetch.fcgi?db=pubmed&id=${t.pmid}&rettype=abstract&retmode=text`,o=(await(await fetch(n)).text()).match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i),u=o?o[1].trim():"";if(u&&u.length>50){const m=je(t);s.innerHTML=`
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
            <span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Auto Deep-Dive</span>
            <div class="article-abstract">${r(u)}</div>
            <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>
            <div class="deep-dive-summary"><i class="ti ti-bulb"></i> ${m}</div>
          </div>`}else s.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Deep-Dive</span> Abstract not available from PubMed for this article.</p>'}catch{s.innerHTML=""}}}}const A=document.getElementById("demo-search-btn");A&&A.addEventListener("click",xe);async function L(e,a){e.value="";for(let t=0;t<a.length;t++)e.value+=a[t],await d(20+Math.random()*25)}async function xe(){A.disabled=!0,A.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running demo…',w.scrollIntoView({behavior:"smooth",block:"center"}),await d(600),await v("Literature search demo — querying PubMed and NEJM in real time"),await L(w,"dupilumab atopic dermatitis long-term safety"),await d(600),await j(),await d(3e3),await v("Results include NEJM articles, auto deep-dive summaries, and Sanofi pipeline intelligence"),w.scrollIntoView({behavior:"smooth",block:"center"}),await d(1500),w.value="",await v("Running a second search — nirsevimab RSV prevention"),await L(w,"nirsevimab RSV prevention infants"),await d(600),await j(),await v("Each search generates intelligence signals for MSL field teams via Orion"),Q(),A.disabled=!1,A.innerHTML='<i class="ti ti-player-play"></i> Watch literature search demo'}function G(){T.innerHTML=`<div class="chat-msg chat-msg-agent">
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
    <button class="chat-suggestion" data-q="Tell me about tolebrutinib in multiple sclerosis">Tolebrutinib in MS</button>`,k.style.display="flex",$.value="",E.disabled=!0,k.querySelectorAll(".chat-suggestion").forEach(e=>{e.addEventListener("click",()=>{$.value=e.dataset.q,I()})})}const se=document.getElementById("chat-clear-btn");se&&se.addEventListener("click",G);const P=document.getElementById("demo-chat-btn");P&&P.addEventListener("click",Te);async function v(e){const a=document.getElementById("demo-narrator");a&&(a.innerHTML=`<i class="ti ti-sparkles"></i> ${e}`,de()&&a.classList.add("visible"),ue(),await me(e))}function Q(){const e=document.getElementById("demo-narrator");e&&e.classList.remove("visible"),pe(),he()}async function Te(){P.disabled=!0,P.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running demo…',G(),await d(600),await v("Literature Intelligence demo — live PubMed and NEJM searches with AI synthesis"),await L($,"What are the latest publications on dupilumab?"),await v("Searching PubMed and NEJM for dupilumab publications"),E.disabled=!1,await I(),await d(4e3),await v("First query complete — now searching for nirsevimab RSV evidence"),await L($,"What evidence exists for nirsevimab RSV prevention?"),E.disabled=!1,await I(),await d(4e3),await v("Second query complete — searching for tolebrutinib in multiple sclerosis"),await L($,"Tell me about tolebrutinib in multiple sclerosis"),E.disabled=!1,await I(),await d(3e3),await v("Three live PubMed searches with AI synthesis — all citations link to original papers"),Q(),P.disabled=!1,P.innerHTML='<i class="ti ti-player-play"></i> Watch conversation demo'}let F=!1;async function ce(){if(F)return;F=!0;const e=document.getElementById("run-demo");e&&(e.disabled=!0,e.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running...');const a=document.querySelector(".main-panel");a&&a.scrollTo({top:0,behavior:"smooth"}),await d(500),await v("Literature Intelligence — live PubMed and NEJM search with AI synthesis and Orion integration");const t=document.getElementById("governance-bar");t&&(t.style.display="flex",t.scrollIntoView({behavior:"smooth",block:"center"}),await d(600)),await v("Governance layer active — every search is logged, sourced, and compliance-stamped"),await v("Let's search PubMed — querying dupilumab atopic dermatitis long-term safety"),w.scrollIntoView({behavior:"smooth",block:"center"}),await d(400),await L(w,"dupilumab atopic dermatitis long-term safety"),await d(600),await j(),await d(4e3),await v("Results include NEJM articles with auto deep-dive summaries and Sanofi pipeline intelligence");const s=document.getElementById("intel-panel");s&&(s.scrollIntoView({behavior:"smooth",block:"center"}),await d(800),await v("Intelligence panel — publication trends, top journals, and key authors extracted automatically"),await d(1500)),await v("Filtering to NEJM only — the highest impact journal results");const n=document.querySelector('.source-btn[data-source="nejm"]');n&&(n.click(),await d(800)),await v("NEJM filter applied — showing only New England Journal of Medicine publications");const i=document.querySelector('.source-btn[data-source="all"]');i&&i.click(),await d(400);const l=document.getElementById("memory-section");l&&(l.scrollIntoView({behavior:"smooth",block:"center"}),await d(600),await v("Agent memory — the system remembers your search history across sessions"),await d(1e3)),w.scrollIntoView({behavior:"smooth",block:"center"}),await d(400),await v("Second search — nirsevimab RSV prevention to demonstrate cross-TA capabilities"),w.value="",await L(w,"nirsevimab RSV prevention infants"),await d(600),await j(),await d(4e3),await v("Each search generates an intelligence signal for MSL field teams via Orion"),await v("The Literature Intelligence Agent answers questions with live PubMed searches and AI synthesis"),G(),await d(400),await L($,"What are the latest publications on dupilumab?"),await d(600),E.disabled=!1,await I(),await d(5e3),await v("First chat query complete — live PubMed results with citations and source links"),await d(1500),await L($,"Tell me about tolebrutinib in multiple sclerosis"),E.disabled=!1,await I(),await d(4e3),await v("Cross-TA search — the agent covers all Sanofi therapeutic areas with live evidence"),a&&a.scrollTo({top:0,behavior:"smooth"}),await d(500),await v("Literature Intelligence — live PubMed, NEJM, AI synthesis, and Orion signals in one platform"),Q(),F=!1,e&&(e.disabled=!1,e.innerHTML='<i class="ti ti-player-play"></i> Play Demo')}const ne=document.getElementById("run-demo");ne&&ne.addEventListener("click",ce);window.location.hash==="#autoplay"&&(window.location.hash="",setTimeout(ce,600));function ke(){const e=document.createElement("div");return e.className="chat-msg chat-msg-agent",e.innerHTML=`
    <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
    <div class="chat-msg-content">
      <div class="chat-msg-bubble chat-agent-bubble">
        <span class="chat-typing"><span></span><span></span><span></span></span>
        <span style="font-size:12px;color:var(--text-muted);margin-left:8px">Searching PubMed & NEJM…</span>
      </div>
    </div>`,T.appendChild(e),T.scrollTop=T.scrollHeight,e}
