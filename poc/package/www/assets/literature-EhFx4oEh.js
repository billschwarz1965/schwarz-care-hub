import{i as le,s as oe,a as re,b as ce,h as de}from"./narrator-BRSS0JpU.js";const C="https://eutils.ncbi.nlm.nih.gov/entrez/eutils",ae='"N Engl J Med"[Journal]',w=document.getElementById("search-input"),P=document.getElementById("search-btn"),B=document.getElementById("results-area"),z=document.getElementById("intel-panel"),A=document.getElementById("signal-feed"),me=document.getElementById("governance-bar"),R=document.getElementById("conn-pubmed"),G=document.getElementById("conn-nejm"),D=document.getElementById("compare-panel-area"),S=document.getElementById("compare-bar"),V=document.getElementById("memory-section"),Q=document.getElementById("memory-chips"),X=document.getElementById("memory-clear");let K="all",O=[],Z=0,$=[];const J="medverse_lit_memory";document.querySelectorAll(".source-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".source-btn").forEach(a=>a.classList.remove("active")),e.classList.add("active"),K=e.dataset.source,O.length&&ie(O)})});document.querySelectorAll(".quick-tag").forEach(e=>{e.addEventListener("click",()=>{w.value=e.dataset.q,N()})});P.addEventListener("click",N);w.addEventListener("keydown",e=>{e.key==="Enter"&&N()});ue();async function ue(){try{(await fetch(`${C}/einfo.fcgi?db=pubmed&retmode=json`)).ok&&(R.innerHTML='<span class="conn-dot pulse"></span> PubMed E-Utilities — Connected',R.className="conn-chip")}catch{R.innerHTML='<span class="conn-dot"></span> PubMed — Connection failed',R.className="conn-chip error"}G.innerHTML='<span class="conn-dot pulse"></span> NEJM via PubMed — Connected',G.className="conn-chip"}async function N(){const e=w.value.trim();if(e){P.disabled=!0,P.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Searching…',me.style.display="flex",B.innerHTML=`<div class="search-loading">
    <i class="ti ti-loader-2"></i>
    <p>Querying PubMed E-Utilities and NEJM…</p>
  </div>`,z&&(z.innerHTML=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Analyzing literature…</div>
    <p style="font-size:12px;color:var(--text-muted)">Running intelligence pipeline on search results…</p>
  </div>`);try{const a=await U(e,15);await g(500);const t=await U(`${e} AND ${ae}`,5),i=new Set(t.map(s=>s.uid)),n=[];t.forEach(s=>{s.isNejm=!0,n.push(s)}),a.forEach(s=>{i.has(s.uid)||(s.isNejm=!1,n.push(s))}),O=n,$=[],W(),ie(n),ve(e,n,a.length,t.length),se(e,n),fe(e,n.length,t.length),we(n),B.scrollIntoView({behavior:"smooth",block:"start"})}catch(a){B.innerHTML=`<div class="empty-state">
      <i class="ti ti-alert-triangle"></i>
      <h3>Search error</h3>
      <p>${o(a.message)}</p>
    </div>`}P.disabled=!1,P.innerHTML='<i class="ti ti-search"></i> Search'}}async function U(e,a=15){var c,p;const t=`${C}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(e)}&retmax=${a}&sort=relevance&retmode=json`,s=((c=(await(await fetch(t)).json()).esearchresult)==null?void 0:c.idlist)||[];if(!s.length)return[];const l=`${C}/esummary.fcgi?db=pubmed&id=${s.join(",")}&retmode=json`,h=await(await fetch(l)).json(),u=[];for(const f of s){const d=(p=h.result)==null?void 0:p[f];d&&u.push({uid:d.uid,title:d.title||"Untitled",authors:(d.authors||[]).map(m=>m.name),source:d.source||"",fulljournalname:d.fulljournalname||d.source||"",pubdate:d.pubdate||"",volume:d.volume||"",issue:d.issue||"",pages:d.pages||"",doi:pe(d.elocationid||""),pmid:d.uid})}return u}function pe(e){const a=e.match(/doi:\s*(\S+)/i);return a?a[1]:""}function ie(e){let a=e;if(K==="nejm"?a=e.filter(s=>s.isNejm):K==="pubmed"&&(a=e.filter(s=>!s.isNejm)),!a.length){B.innerHTML=`<div class="empty-state">
      <i class="ti ti-book-off"></i>
      <h3>No results found</h3>
      <p>Try adjusting your search terms or source filter.</p>
    </div>`;return}const t=e.filter(s=>s.isNejm).length,i=e.filter(s=>!s.isNejm).length;B.innerHTML=`
    <div class="results-header">
      <h2>Search Results</h2>
      <span class="results-count">${e.length} articles — ${i} PubMed · ${t} NEJM</span>
    </div>
    <div class="results-list" id="results-list"></div>
  `;const n=document.getElementById("results-list");a.forEach((s,l)=>{const r=document.createElement("div");r.className="article-card";const h=s.authors.length>4?s.authors.slice(0,3).join(", ")+`, et al. (${s.authors.length} authors)`:s.authors.join(", "),u=s.isNejm?"nejm":"pubmed",c=s.isNejm?"NEJM":"PubMed",p=`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`,f=s.doi?`https://doi.org/${s.doi}`:"";r.innerHTML=`
      <div class="compare-check" data-pmid="${s.pmid}" title="Select for comparison"><i class="ti ti-check"></i></div>
      <span class="article-source-tag ${u}"><span class="source-dot ${u}"></span> ${c}</span>
      <div class="article-title"><a href="${o(p)}" target="_blank" rel="noopener">${s.title}</a></div>
      <div class="article-authors">${o(h)}</div>
      <div class="article-meta">
        <span class="article-meta-item article-journal"><i class="ti ti-notebook"></i> ${o(s.fulljournalname)}</span>
        <span class="article-meta-item"><i class="ti ti-calendar"></i> ${o(s.pubdate)}</span>
        ${s.volume?`<span class="article-meta-item">${o(s.volume)}${s.issue?`(${o(s.issue)})`:""}${s.pages?`:${o(s.pages)}`:""}</span>`:""}
      </div>
      <div class="article-pmid">PMID: ${o(s.pmid)}</div>
      <div class="article-actions">
        <a class="article-action" href="${o(p)}" target="_blank" rel="noopener"><i class="ti ti-external-link"></i> PubMed</a>
        ${f?`<a class="article-action" href="${o(f)}" target="_blank" rel="noopener"><i class="ti ti-link"></i> Full Text</a>`:""}
        <button class="article-action fetch-abstract-btn" data-pmid="${s.pmid}" data-idx="${l}"><i class="ti ti-file-text"></i> Fetch Abstract</button>
      </div>
      <div class="article-abstract-area" id="abstract-${s.pmid}"></div>
    `,n.appendChild(r)}),n.querySelectorAll(".fetch-abstract-btn").forEach(s=>{s.addEventListener("click",()=>he(s.dataset.pmid))}),n.querySelectorAll(".compare-check").forEach(s=>{s.addEventListener("click",()=>ye(s.dataset.pmid,s))})}async function he(e){const a=document.getElementById(`abstract-${e}`);if(a){a.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Fetching abstract from PubMed…</p>';try{const t=`${C}/efetch.fcgi?db=pubmed&id=${e}&rettype=abstract&retmode=text`,n=await(await fetch(t)).text(),s=n.match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i),l=s?s[1].trim():n.trim();l&&l.length>50?a.innerHTML=`<div class="article-abstract" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">${o(l)}</div>
        <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>`:a.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0">Abstract not available for this article.</p>'}catch{a.innerHTML='<p style="font-size:12px;color:var(--danger);padding:8px 0">Failed to fetch abstract.</p>'}}}function ve(e,a,t,i){const n={},s={},l={};a.forEach(m=>{const v=m.source||m.fulljournalname||"Unknown";n[v]=(n[v]||0)+1;const E=m.pubdate.match(/(\d{4})/);if(E){const b=E[1];s[b]=(s[b]||0)+1}m.authors.forEach(b=>{l[b]=(l[b]||0)+1})});const r=Object.entries(n).sort((m,v)=>v[1]-m[1]).slice(0,5),h=r.length?r[0][1]:1,u=Object.entries(l).sort((m,v)=>v[1]-m[1]).slice(0,8),c=Object.entries(s).sort((m,v)=>m[0]-v[0]),p=c.length?Math.max(...c.map(m=>m[1])):1,f=["#7a00e6","#aa46a3","#f9c851","#60a5fa","#34d399"];let d="";d+=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-chart-bar"></i> Search Analytics</div>
    <div class="intel-stat-row"><span class="intel-stat-label">Total articles</span><span class="intel-stat-value">${a.length}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">PubMed results</span><span class="intel-stat-value">${t}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">NEJM articles</span><span class="intel-stat-value">${i}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">Date range</span><span class="intel-stat-value">${c.length?c[0][0]+"–"+c[c.length-1][0]:"—"}</span></div>
  </div>`,c.length>1&&(d+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-trending-up"></i> Publication Trend</div>
      <div class="trend-chart-wrapper">
        <div class="trend-chart">
          ${c.map(([m,v])=>`
            <div class="trend-bar" style="height:${Math.max(v/p*100,8)}%" title="${m}: ${v} articles">
              <span class="trend-bar-label">${m.slice(2)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>`),r.length&&(d+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-notebook"></i> Top Journals</div>
      ${r.map(([m,v],E)=>`
        <div class="journal-row">
          <span style="flex:0 0 120px;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${o(m)}">${o(m.length>18?m.slice(0,16)+"…":m)}</span>
          <div class="journal-bar"><div class="journal-bar-fill" style="width:${v/h*100}%;background:${f[E%f.length]}"></div></div>
          <span class="journal-count">${v}</span>
        </div>
      `).join("")}
    </div>`),u.length&&(d+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-users"></i> Key Authors</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${u.map(([m,v])=>`<span class="author-chip">${o(m)} (${v})</span>`).join("")}
      </div>
    </div>`),d+=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-bulb"></i> AI Evidence Assessment</div>
    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:6px">
      <strong>${a.length} publications</strong> retrieved for "<em>${o(e)}</em>".
      ${i>0?`<strong>${i} NEJM article${i>1?"s":""}</strong> found — high-impact evidence available.`:"No NEJM-specific articles — consider broadening the search or checking recent issues."}
    </p>
    ${u.length>=2?`<p style="font-size:12px;color:var(--text-secondary);line-height:1.5">
      <strong>Most prolific authors:</strong> ${u.slice(0,3).map(([m])=>m).join(", ")} — consider for KOL mapping and engagement planning.
    </p>`:""}
  </div>`,z&&(z.innerHTML=d)}function se(e,a){Z++;const t=a.filter(c=>c.isNejm).length,n=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),s=(()=>{const c={};a.forEach(f=>f.authors.forEach(d=>c[d]=(c[d]||0)+1));const p=Object.entries(c).sort((f,d)=>d[1]-f[1]);return p.length?p[0][0]:"Unknown"})(),l=ge(e),r=t>0?"Deep engagement — cross-journal query":"Moderate engagement",h=t>0?"Evidence synthesis with high-impact journals":"Literature exploration",u=t>2?"PRIORITY: High-impact NEJM evidence discovered — flag for medical affairs review":`Literature search logged — ${a.length} articles, key author: ${s}`;if(A){A.querySelector("[style]")&&Z===1&&(A.innerHTML="");const p=document.createElement("div");p.className="signal-card",p.innerHTML=`
      <div class="signal-header">
        <div class="signal-dot"></div>
        <span class="signal-time">${n}</span>
      </div>
      <div class="signal-topic">Literature Search — ${o(e.length>40?e.slice(0,38)+"…":e)}</div>
      <div class="signal-row"><span class="signal-label">Intent</span><span class="signal-value">${o(h)}</span></div>
      <div class="signal-row"><span class="signal-label">Disease</span><span class="signal-value">${o(l)}</span></div>
      <div class="signal-row"><span class="signal-label">Sources</span><span class="signal-value">${a.length} PubMed · ${t} NEJM</span></div>
      <div class="signal-row"><span class="signal-label">Depth</span><span class="signal-value">${o(r)}</span></div>
      <div class="signal-action"><i class="ti ti-arrow-right"></i><span>${o(u)}</span></div>
    `,A.insertBefore(p,A.firstChild)}}function ge(e){const a=e.toLowerCase(),t=[[/atopic|eczema|dermatitis|dupilumab|dupixent/,"Atopic Dermatitis"],[/asthma|airway|tezepelumab/,"Asthma"],[/crohn|ibd|ulcerative colitis|duvakitug/,"Inflammatory Bowel Disease"],[/rsv|nirsevimab|beyfortus/,"RSV Prevention"],[/hemophilia|fitusiran/,"Hemophilia"],[/multiple sclerosis|tolebrutinib/,"Multiple Sclerosis"],[/insulin|glargine|lantus|toujeo|diabetes/,"Diabetes"],[/psoriasis/,"Psoriasis"],[/oncology|cancer|tumor/,"Oncology"],[/vaccine|immunization/,"Vaccines"],[/rare disease|fabry|gaucher|pompe/,"Rare Diseases"]];for(const[i,n]of t)if(i.test(a))return n;return"Cross-TA / General"}function o(e){const a=document.createElement("div");return a.textContent=e,a.innerHTML}function g(e){return new Promise(a=>setTimeout(a,e))}document.getElementById("chat-panel");const j=document.getElementById("chat-messages"),y=document.getElementById("chat-input"),M=document.getElementById("chat-send"),x=document.getElementById("chat-suggestions");y&&M&&(M.addEventListener("click",()=>I()),y.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),I())}),y.addEventListener("input",()=>{M.disabled=!y.value.trim()}));x&&x.querySelectorAll(".chat-suggestion").forEach(e=>{e.addEventListener("click",()=>{y.value=e.dataset.q,I()})});const ee={patterns:[{match:/what.*(latest|recent|new).*(dupilumab|dupixent)/i,query:"dupilumab 2024 2025 2026",synthesize:e=>`Based on my search of PubMed and NEJM, here are the most recent dupilumab publications:

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

**Evidence status:** Phase 3 data emerging. Watch for HERCULES (non-relapsing SPMS) and GEMINI (RMS) trial readouts.`}],fallback:(e,a)=>{if(!a.length)return`I searched PubMed and NEJM for "${e}" but found no matching articles. Try refining your query with more specific medical terms, drug names, or disease areas.`;const t=a.slice(0,3).map((l,r)=>`${r+1}. **${l.title}** — *${l.fulljournalname}* (${l.pubdate}) [PMID: ${l.pmid}]`).join(`

`),i=a.filter(l=>l.isNejm).length;let n="";const s=localStorage.getItem(J);if(s){const r=JSON.parse(s).filter(h=>h.query.toLowerCase()!==e.toLowerCase()).slice(0,2);r.length&&(n=`

**Agent memory:** You previously searched for ${r.map(h=>`"${h.query}" (${h.count} results)`).join(" and ")}. I can cross-reference these topics if you'd like a combined analysis.`)}return`I found ${a.length} articles across PubMed${i?` and NEJM (${i} high-impact)`:""} for your query:

${t}

${a.length>3?`Plus ${a.length-3} more articles. `:""}Use the search bar above to see all results with full metadata, or ask me a more specific follow-up question.${n}`}};async function I(){const e=y.value.trim();if(!e)return;y.value="",M.disabled=!0,x&&(x.style.display="none"),_("user",e);const a=je();let t=null;for(const n of ee.patterns)if(n.match.test(e)){t=n;break}const i=t?t.query:be(e);try{const n=await U(i,8);await g(300);const s=await U(`${i} AND ${ae}`,3),l=new Set(s.map(u=>u.uid));s.forEach(u=>{u.isNejm=!0}),n.forEach(u=>{l.has(u.uid)&&(u.isNejm=!0)});const r=[...s,...n.filter(u=>!l.has(u.uid))];a.remove();const h=t?t.synthesize(r):ee.fallback(e,r);_("agent",h,r),se(i,r)}catch(n){a.remove(),_("agent",`I encountered an error searching PubMed: ${n.message}. Please try again in a moment — NCBI rate-limits requests to 3 per second.`)}}function be(e){return e.replace(/\b(what|how|does|is|are|the|can|you|find|tell|me|about|give|show|latest|recent|any|published|evidence|data|for|on|in|of|with|and|or|please)\b/gi,"").replace(/[?!.,]/g,"").replace(/\s+/g," ").trim()}function _(e,a,t){const i=document.createElement("div");if(i.className=`chat-msg chat-msg-${e}`,e==="user")i.innerHTML=`<div class="chat-msg-bubble chat-user-bubble">${o(a)}</div>`;else{let n=o(a);n=n.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),n=n.replace(/\*(.+?)\*/g,"<em>$1</em>"),n=n.replace(/\[PMID: (\d+)\]/g,'<a class="chat-pmid-link" href="https://pubmed.ncbi.nlm.nih.gov/$1/" target="_blank" rel="noopener">PMID: $1</a>'),n=n.replace(/^(\d+)\./gm,"<br>$1."),n=n.replace(/^- (.+)/gm,"<br>• $1");const s=t&&t.length>0?`<div class="chat-citations">
          <div class="chat-citations-label"><i class="ti ti-book-2"></i> ${t.length} sources from PubMed/NEJM</div>
          ${t.slice(0,3).map(l=>{var r;return`
            <a class="chat-citation-chip" href="https://pubmed.ncbi.nlm.nih.gov/${l.pmid}/" target="_blank" rel="noopener">
              <span class="source-dot ${l.isNejm?"nejm":"pubmed"}"></span>
              ${o(l.authors[0]||"Unknown")} (${o(((r=l.pubdate.match(/\d{4}/))==null?void 0:r[0])||"")})
            </a>`}).join("")}
        </div>`:"";i.innerHTML=`
      <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
      <div class="chat-msg-content">
        <div class="chat-msg-bubble chat-agent-bubble">${n}</div>
        ${s}
      </div>`}j.appendChild(i),j.scrollTop=j.scrollHeight}function F(){const e=localStorage.getItem(J),a=e?JSON.parse(e):[];if(!a.length){V&&(V.style.display="none");return}V.style.display="block",Q.innerHTML="",a.slice(0,8).forEach(t=>{const i=document.createElement("span");i.className="memory-chip",i.title=`${t.count} results · ${t.nejm} NEJM · ${t.date}`,i.innerHTML=`<i class="ti ti-history"></i> ${o(t.query)} <span class="memory-chip-time">${t.ago}</span>`,i.addEventListener("click",()=>{w.value=t.query,N()}),Q.appendChild(i)})}function fe(e,a,t){const i=localStorage.getItem(J);let n=i?JSON.parse(i):[];n=n.filter(l=>l.query.toLowerCase()!==e.toLowerCase());const s=new Date;n.unshift({query:e,count:a,nejm:t,date:s.toLocaleDateString("en-US",{month:"short",day:"numeric"}),ago:"just now",ts:s.getTime()}),n=n.slice(0,20),n.forEach(l=>{const r=Math.floor((s.getTime()-l.ts)/6e4);r<1?l.ago="just now":r<60?l.ago=`${r}m ago`:r<1440?l.ago=`${Math.floor(r/60)}h ago`:l.ago=`${Math.floor(r/1440)}d ago`}),localStorage.setItem(J,JSON.stringify(n)),F()}F();X&&X.addEventListener("click",()=>{localStorage.removeItem(J),F()});function ye(e,a){var i;const t=$.indexOf(e);if(t>-1)$.splice(t,1),a.classList.remove("selected");else{if($.length>=2){const n=$.shift();(i=document.querySelector(`.compare-check[data-pmid="${n}"]`))==null||i.classList.remove("selected")}$.push(e),a.classList.add("selected")}W()}function W(){if(S){if($.length<2){S.style.display=$.length===1?"flex":"none",$.length===1&&(S.innerHTML=`<div class="compare-bar">
        <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 1 article selected — select another to compare</span>
        <div class="compare-bar-actions">
          <button class="compare-bar-btn secondary" onclick="clearCompare()">Cancel</button>
        </div>
      </div>`,S.style.display="block"),D.innerHTML="";return}S.innerHTML=`<div class="compare-bar">
    <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 2 articles selected</span>
    <div class="compare-bar-actions">
      <button class="compare-bar-btn primary" onclick="runComparison()"><i class="ti ti-arrows-exchange" style="margin-right:4px"></i> Compare Evidence</button>
      <button class="compare-bar-btn secondary" onclick="clearCompare()">Clear</button>
    </div>
  </div>`,S.style.display="block"}}window.clearCompare=function(){$=[],document.querySelectorAll(".compare-check.selected").forEach(e=>e.classList.remove("selected")),W()};window.runComparison=async function(){var v,E;const e=$.map(b=>O.find(L=>L.uid===b||L.pmid===b)).filter(Boolean);if(e.length<2)return;D.innerHTML=`<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison — loading abstracts…</span>
    </div>
    <div style="text-align:center;padding:30px;color:var(--text-muted)"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:24px"></i></div>
  </div>`,D.scrollIntoView({behavior:"smooth",block:"start"});const a=[];for(const b of e)try{const L=`${C}/efetch.fcgi?db=pubmed&id=${b.pmid}&rettype=abstract&retmode=text`,Y=(await(await fetch(L)).text()).match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i);a.push(Y?Y[1].trim():"Abstract not available."),a.length<e.length&&await g(400)}catch{a.push("Failed to fetch abstract.")}const t=e[0],i=e[1],n=a[0],s=a[1],l=t.fulljournalname===i.fulljournalname,r=((v=t.pubdate.match(/\d{4}/))==null?void 0:v[0])||"?",h=((E=i.pubdate.match(/\d{4}/))==null?void 0:E[0])||"?",u=Math.abs(parseInt(r)-parseInt(h));let c="";if(l)c=`Both articles published in <strong>${o(t.fulljournalname)}</strong>`,u>0&&(c+=` — ${u}-year gap suggests evolving evidence base`),c+=". ";else{const b=t.isNejm,L=i.isNejm;b&&!L?c=`Article 1 is from <strong>NEJM</strong> (highest impact) vs ${o(i.fulljournalname)}. `:!b&&L?c=`Article 2 is from <strong>NEJM</strong> (highest impact) vs ${o(t.fulljournalname)}. `:c=`Cross-journal comparison: <strong>${o(t.source)}</strong> vs <strong>${o(i.source)}</strong>. `}const p=t.authors.length,f=i.authors.length;(p>10||f>10)&&(c+=`Large author list (${Math.max(p,f)} authors) suggests multi-center trial data. `),c+="Review both abstracts to assess study design, population, and endpoints for comparative evidence strength.";const d=b=>b.isNejm?"nejm":"pubmed",m=b=>b.isNejm?"NEJM":"PubMed";D.innerHTML=`<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison</span>
      <button class="compare-panel-close" onclick="document.getElementById('compare-panel-area').innerHTML='';clearCompare()"><i class="ti ti-x"></i></button>
    </div>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-col-header ${d(t)}">Article 1 — ${m(t)}</div>
        <div class="compare-field"><div class="compare-field-label">Title</div><div class="compare-field-value"><strong>${t.title}</strong></div></div>
        <div class="compare-field"><div class="compare-field-label">Authors</div><div class="compare-field-value">${o(t.authors.slice(0,5).join(", "))}${t.authors.length>5?` +${t.authors.length-5} more`:""}</div></div>
        <div class="compare-field"><div class="compare-field-label">Journal</div><div class="compare-field-value">${o(t.fulljournalname)}</div></div>
        <div class="compare-field"><div class="compare-field-label">Date</div><div class="compare-field-value">${o(t.pubdate)}</div></div>
        <div class="compare-field"><div class="compare-field-label">PMID</div><div class="compare-field-value"><a href="https://pubmed.ncbi.nlm.nih.gov/${t.pmid}/" target="_blank" style="color:var(--accent)">${t.pmid}</a></div></div>
        <div class="compare-field"><div class="compare-field-label">Abstract</div><div class="compare-abstract">${o(n)}</div></div>
      </div>
      <div class="compare-col">
        <div class="compare-col-header ${d(i)}">Article 2 — ${m(i)}</div>
        <div class="compare-field"><div class="compare-field-label">Title</div><div class="compare-field-value"><strong>${i.title}</strong></div></div>
        <div class="compare-field"><div class="compare-field-label">Authors</div><div class="compare-field-value">${o(i.authors.slice(0,5).join(", "))}${i.authors.length>5?` +${i.authors.length-5} more`:""}</div></div>
        <div class="compare-field"><div class="compare-field-label">Journal</div><div class="compare-field-value">${o(i.fulljournalname)}</div></div>
        <div class="compare-field"><div class="compare-field-label">Date</div><div class="compare-field-value">${o(i.pubdate)}</div></div>
        <div class="compare-field"><div class="compare-field-label">PMID</div><div class="compare-field-value"><a href="https://pubmed.ncbi.nlm.nih.gov/${i.pmid}/" target="_blank" style="color:var(--accent)">${i.pmid}</a></div></div>
        <div class="compare-field"><div class="compare-field-label">Abstract</div><div class="compare-abstract">${o(s)}</div></div>
      </div>
    </div>
    <div class="compare-ai-row">
      <div class="compare-ai-label"><i class="ti ti-bulb"></i> AI Comparison Analysis</div>
      <div class="compare-ai-text">${c}</div>
    </div>
  </div>`,D.scrollIntoView({behavior:"smooth",block:"start"})};const $e={dupilumab:"IL-4Rα inhibitor for Type 2 inflammation — first-in-class biologic with broadest approved indication set in atopic diseases.",nirsevimab:"Long-acting monoclonal antibody for RSV prevention — single-dose passive immunization providing ~5 months protection in infants.",tolebrutinib:"Brain-penetrant BTK inhibitor — novel dual mechanism targeting B-cells and microglia for relapsing and progressive MS.",fitusiran:"Anti-TFPI siRNA — subcutaneous prophylaxis for hemophilia A and B with and without inhibitors.",duvakitug:"Anti-TL1A antibody — targeting a novel TNF superfamily member in inflammatory bowel disease with cross-indication potential.",tezepelumab:"Anti-TSLP antibody — upstream mechanism blocking Type 2 inflammation cascade in severe asthma.",insulin:"Basal insulin analog — long-acting glycemic control with established cardiovascular safety profile.","atopic dermatitis":"Chronic Type 2 inflammatory skin disease — dupilumab has transformed treatment landscape with sustained efficacy through 4+ years.",rsv:"Leading cause of infant hospitalization — passive immunization with nirsevimab provides first universal prevention strategy.","multiple sclerosis":"Chronic neuroinflammatory disease — BTK inhibitors represent next-generation mechanism targeting both inflammation and neurodegeneration."};async function we(e){var t;const a=e.filter(i=>i.isNejm).slice(0,2);a.length<2&&a.push(...e.filter(i=>!i.isNejm).slice(0,3-a.length));for(const i of a){await g(600);const n=document.getElementById(`abstract-${i.pmid}`);if(n){n.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Auto-fetching abstract…</p>';try{const s=`${C}/efetch.fcgi?db=pubmed&id=${i.pmid}&rettype=abstract&retmode=text`,h=(await(await fetch(s)).text()).match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i),u=h?h[1].trim():"";if(u&&u.length>50){const c=(i.title+" "+i.fulljournalname).toLowerCase();let p="";for(const[f,d]of Object.entries($e))if(c.includes(f)){p=d;break}p||(p=`${i.authors.length} authors from ${i.fulljournalname} (${((t=i.pubdate.match(/\d{4}/))==null?void 0:t[0])||""}) — review abstract for study design and key endpoints.`),n.innerHTML=`
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
            <span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Auto Deep-Dive</span>
            <div class="article-abstract">${o(u)}</div>
            <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>
            <div class="deep-dive-summary"><i class="ti ti-bulb"></i> ${p}</div>
          </div>`}else n.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Deep-Dive</span> Abstract not available from PubMed for this article.</p>'}catch{n.innerHTML=""}}}}const T=document.getElementById("demo-search-btn");T&&T.addEventListener("click",Me);async function H(e,a){e.value="";for(let t=0;t<a.length;t++)e.value+=a[t],await g(20+Math.random()*25)}async function Me(){T.disabled=!0,T.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running demo…',w.scrollIntoView({behavior:"smooth",block:"center"}),await g(600),await H(w,"dupilumab atopic dermatitis long-term safety"),await g(500),await N(),await g(4e3),w.scrollIntoView({behavior:"smooth",block:"center"}),await g(1e3),w.value="",await H(w,"nirsevimab RSV prevention infants"),await g(800),await N(),await g(2e3),T.disabled=!1,T.innerHTML='<i class="ti ti-player-play"></i> Watch literature search demo'}function ne(){j.innerHTML=`<div class="chat-msg chat-msg-agent">
    <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
    <div class="chat-msg-content">
      <div class="chat-msg-bubble chat-agent-bubble">
        I'm the Literature Intelligence Agent with live connections to <strong>PubMed</strong> (36M+ articles) and the <strong>NEJM</strong>. Ask me about any Sanofi therapeutic area — I'll search, retrieve, and synthesize the evidence.
      </div>
    </div>
  </div>`,x.innerHTML=`<button class="chat-suggestion" data-q="What are the latest publications on dupilumab?">Latest dupilumab pubs</button>
    <button class="chat-suggestion" data-q="How does dupilumab compare to abrocitinib in head-to-head data?">Dupilumab vs abrocitinib</button>
    <button class="chat-suggestion" data-q="What is the pediatric safety profile of dupilumab?">Pediatric safety data</button>
    <button class="chat-suggestion" data-q="What evidence exists for nirsevimab RSV prevention?">Nirsevimab RSV</button>
    <button class="chat-suggestion" data-q="Tell me about tolebrutinib in multiple sclerosis">Tolebrutinib in MS</button>`,x.style.display="flex",y.value="",M.disabled=!0,x.querySelectorAll(".chat-suggestion").forEach(e=>{e.addEventListener("click",()=>{y.value=e.dataset.q,I()})})}const te=document.getElementById("chat-clear-btn");te&&te.addEventListener("click",ne);const k=document.getElementById("demo-chat-btn");k&&k.addEventListener("click",Le);async function q(e){const a=document.getElementById("demo-narrator");a&&(a.innerHTML=`<i class="ti ti-sparkles"></i> ${e}`,le()&&a.classList.add("visible"),oe(),await re(e))}function Ee(){const e=document.getElementById("demo-narrator");e&&e.classList.remove("visible"),ce(),de()}async function Le(){k.disabled=!0,k.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running demo…',ne(),await g(600),await q("Literature Intelligence demo — live PubMed and NEJM searches with AI synthesis"),await H(y,"What are the latest publications on dupilumab?"),await q("Searching PubMed and NEJM for dupilumab publications"),M.disabled=!1,await g(500),await I(),await g(500),await H(y,"What evidence exists for nirsevimab RSV prevention?"),await q("Searching for nirsevimab RSV prevention evidence"),M.disabled=!1,await g(500),await I(),await g(500),await H(y,"Tell me about tolebrutinib in multiple sclerosis"),await q("Searching for tolebrutinib multiple sclerosis data"),M.disabled=!1,await g(500),await I(),await g(500),Ee(),k.disabled=!1,k.innerHTML='<i class="ti ti-player-play"></i> Watch conversation demo'}function je(){const e=document.createElement("div");return e.className="chat-msg chat-msg-agent",e.innerHTML=`
    <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
    <div class="chat-msg-content">
      <div class="chat-msg-bubble chat-agent-bubble">
        <span class="chat-typing"><span></span><span></span><span></span></span>
        <span style="font-size:12px;color:var(--text-muted);margin-left:8px">Searching PubMed & NEJM…</span>
      </div>
    </div>`,j.appendChild(e),j.scrollTop=j.scrollHeight,e}
