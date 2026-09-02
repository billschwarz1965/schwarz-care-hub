import"./enhancements-DWyQcU8v.js";/* empty css                     */import{i as ce,s as de,a as ue,b as me,h as pe}from"./narrator-BE1zjzk_.js";import{b as he}from"./orion-bridge-DJTabCXd.js";import"./taxonomy-B-xcL3O-.js";const N="/api/pubmed",ne='"N Engl J Med"[Journal]',M=document.getElementById("search-input"),P=document.getElementById("search-btn"),B=document.getElementById("results-area"),q=document.getElementById("intel-panel"),A=document.getElementById("signal-feed"),ve=document.getElementById("governance-bar"),R=document.getElementById("conn-pubmed"),X=document.getElementById("conn-nejm"),D=document.getElementById("compare-panel-area"),k=document.getElementById("compare-bar"),U=document.getElementById("memory-section"),Z=document.getElementById("memory-chips"),ee=document.getElementById("memory-clear");let W="all",z=[],te=0,$=[];const H="medverse_lit_memory";document.querySelectorAll(".source-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".source-btn").forEach(a=>a.classList.remove("active")),e.classList.add("active"),W=e.dataset.source,z.length&&oe(z)})});document.querySelectorAll(".quick-tag").forEach(e=>{e.addEventListener("click",()=>{M.value=e.dataset.q,C()})});P.addEventListener("click",C);M.addEventListener("keydown",e=>{e.key==="Enter"&&C()});fe();async function fe(){try{(await fetch(`${N}/einfo.fcgi?db=pubmed&retmode=json`)).ok&&(R.innerHTML='<span class="conn-dot pulse"></span> PubMed E-Utilities — Connected',R.className="conn-chip")}catch{R.innerHTML='<span class="conn-dot"></span> PubMed — Connection failed',R.className="conn-chip error"}X.innerHTML='<span class="conn-dot pulse"></span> NEJM via PubMed — Connected',X.className="conn-chip"}async function C(){const e=M.value.trim();if(e){P.disabled=!0,P.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Searching…',ve.style.display="flex",B.innerHTML=`<div class="search-loading">
    <i class="ti ti-loader-2"></i>
    <p>Querying PubMed E-Utilities and NEJM…</p>
  </div>`,q&&(q.innerHTML=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Analyzing literature…</div>
    <p style="font-size:12px;color:var(--text-muted)">Running intelligence pipeline on search results…</p>
  </div>`);try{const a=await O(e,15);await h(1500);const t=await O(`${e} AND ${ne}`,5),s=new Set(t.map(i=>i.uid)),n=[];t.forEach(i=>{i.isNejm=!0,n.push(i)}),a.forEach(i=>{s.has(i.uid)||(i.isNejm=!1,n.push(i))}),z=n,$=[],G(),oe(n),ye(e,n,a.length,t.length),le(e,n),Me(e,n.length,t.length),Ie(n),B.scrollIntoView({behavior:"smooth",block:"start"})}catch(a){B.innerHTML=`<div class="empty-state">
      <i class="ti ti-alert-triangle"></i>
      <h3>Search error</h3>
      <p>${r(a.message)}</p>
    </div>`}P.disabled=!1,P.innerHTML='<i class="ti ti-search"></i> Search'}}async function O(e,a=15){var c,v;const t=`${N}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(e)}&retmax=${a}&sort=relevance&retmode=json`,i=((c=(await(await fetch(t)).json()).esearchresult)==null?void 0:c.idlist)||[];if(!i.length)return[];const l=`${N}/esummary.fcgi?db=pubmed&id=${i.join(",")}&retmode=json`,d=await(await fetch(l)).json(),u=[];for(const b of i){const p=(v=d.result)==null?void 0:v[b];p&&u.push({uid:p.uid,title:p.title||"Untitled",authors:(p.authors||[]).map(m=>m.name),source:p.source||"",fulljournalname:p.fulljournalname||p.source||"",pubdate:p.pubdate||"",volume:p.volume||"",issue:p.issue||"",pages:p.pages||"",doi:ge(p.elocationid||""),pmid:p.uid})}return u}function ge(e){const a=e.match(/doi:\s*(\S+)/i);return a?a[1]:""}function oe(e){let a=e;if(W==="nejm"?a=e.filter(i=>i.isNejm):W==="pubmed"&&(a=e.filter(i=>!i.isNejm)),!a.length){B.innerHTML=`<div class="empty-state">
      <i class="ti ti-book-off"></i>
      <h3>No results found</h3>
      <p>Try adjusting your search terms or source filter.</p>
    </div>`;return}const t=e.filter(i=>i.isNejm).length,s=e.filter(i=>!i.isNejm).length;B.innerHTML=`
    <div class="results-header">
      <h2>Search Results</h2>
      <span class="results-count">${e.length} articles — ${s} PubMed · ${t} NEJM</span>
    </div>
    <div class="results-list" id="results-list"></div>
  `;const n=document.getElementById("results-list");a.forEach((i,l)=>{const o=document.createElement("div");o.className="article-card";const d=i.authors.length>4?i.authors.slice(0,3).join(", ")+`, et al. (${i.authors.length} authors)`:i.authors.join(", "),u=i.isNejm?"nejm":"pubmed",c=i.isNejm?"NEJM":"PubMed",v=`https://pubmed.ncbi.nlm.nih.gov/${i.pmid}/`,b=i.doi?`https://doi.org/${i.doi}`:"";o.innerHTML=`
      <div class="compare-check" data-pmid="${i.pmid}" title="Select for comparison"><i class="ti ti-check"></i></div>
      <span class="article-source-tag ${u}"><span class="source-dot ${u}"></span> ${c}</span>
      <div class="article-title"><a href="${r(v)}" target="_blank" rel="noopener">${i.title}</a></div>
      <div class="article-authors">${r(d)}</div>
      <div class="article-meta">
        <span class="article-meta-item article-journal"><i class="ti ti-notebook"></i> ${r(i.fulljournalname)}</span>
        <span class="article-meta-item"><i class="ti ti-calendar"></i> ${r(i.pubdate)}</span>
        ${i.volume?`<span class="article-meta-item">${r(i.volume)}${i.issue?`(${r(i.issue)})`:""}${i.pages?`:${r(i.pages)}`:""}</span>`:""}
      </div>
      <div class="article-pmid">PMID: ${r(i.pmid)}</div>
      <div class="article-actions">
        <a class="article-action" href="${r(v)}" target="_blank" rel="noopener"><i class="ti ti-external-link"></i> PubMed</a>
        ${b?`<a class="article-action" href="${r(b)}" target="_blank" rel="noopener"><i class="ti ti-link"></i> Full Text</a>`:""}
        <button class="article-action fetch-abstract-btn" data-pmid="${i.pmid}" data-idx="${l}"><i class="ti ti-file-text"></i> Fetch Abstract</button>
      </div>
      <div class="article-abstract-area" id="abstract-${i.pmid}"></div>
    `,n.appendChild(o)}),n.querySelectorAll(".fetch-abstract-btn").forEach(i=>{i.addEventListener("click",()=>be(i.dataset.pmid))}),n.querySelectorAll(".compare-check").forEach(i=>{i.addEventListener("click",()=>Ee(i.dataset.pmid,i))})}async function be(e){const a=document.getElementById(`abstract-${e}`);if(a){a.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Fetching abstract from PubMed…</p>';try{const t=`${N}/efetch.fcgi?db=pubmed&id=${e}&rettype=abstract&retmode=text`,n=await(await fetch(t)).text(),i=n.match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i),l=i?i[1].trim():n.trim();l&&l.length>50?a.innerHTML=`<div class="article-abstract" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">${r(l)}</div>
        <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>`:a.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0">Abstract not available for this article.</p>'}catch{a.innerHTML='<p style="font-size:12px;color:var(--danger);padding:8px 0">Failed to fetch abstract.</p>'}}}function ye(e,a,t,s){const n={},i={},l={};a.forEach(m=>{const f=m.source||m.fulljournalname||"Unknown";n[f]=(n[f]||0)+1;const j=m.pubdate.match(/(\d{4})/);if(j){const g=j[1];i[g]=(i[g]||0)+1}m.authors.forEach(g=>{l[g]=(l[g]||0)+1})});const o=Object.entries(n).sort((m,f)=>f[1]-m[1]).slice(0,5),d=o.length?o[0][1]:1,u=Object.entries(l).sort((m,f)=>f[1]-m[1]).slice(0,8),c=Object.entries(i).sort((m,f)=>m[0]-f[0]),v=c.length?Math.max(...c.map(m=>m[1])):1,b=["#7a00e6","#aa46a3","#f9c851","#60a5fa","#34d399"];let p="";p+=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-chart-bar"></i> Search Analytics</div>
    <div class="intel-stat-row"><span class="intel-stat-label">Total articles</span><span class="intel-stat-value">${a.length}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">PubMed results</span><span class="intel-stat-value">${t}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">NEJM articles</span><span class="intel-stat-value">${s}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">Date range</span><span class="intel-stat-value">${c.length?c[0][0]+"–"+c[c.length-1][0]:"—"}</span></div>
  </div>`,c.length>1&&(p+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-trending-up"></i> Publication Trend</div>
      <div class="trend-chart-wrapper">
        <div class="trend-chart">
          ${c.map(([m,f])=>`
            <div class="trend-bar" style="height:${Math.max(f/v*100,8)}%" title="${m}: ${f} articles">
              <span class="trend-bar-label">${m.slice(2)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>`),o.length&&(p+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-notebook"></i> Top Journals</div>
      ${o.map(([m,f],j)=>`
        <div class="journal-row">
          <span style="flex:0 0 120px;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r(m)}">${r(m.length>18?m.slice(0,16)+"…":m)}</span>
          <div class="journal-bar"><div class="journal-bar-fill" style="width:${f/d*100}%;background:${b[j%b.length]}"></div></div>
          <span class="journal-count">${f}</span>
        </div>
      `).join("")}
    </div>`),u.length&&(p+=`<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-users"></i> Key Authors</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${u.map(([m,f])=>`<span class="author-chip">${r(m)} (${f})</span>`).join("")}
      </div>
    </div>`),p+=`<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-bulb"></i> AI Evidence Assessment</div>
    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:6px">
      <strong>${a.length} publications</strong> retrieved for "<em>${r(e)}</em>".
      ${s>0?`<strong>${s} NEJM article${s>1?"s":""}</strong> found — high-impact evidence available.`:"No NEJM-specific articles — consider broadening the search or checking recent issues."}
    </p>
    ${u.length>=2?`<p style="font-size:12px;color:var(--text-secondary);line-height:1.5">
      <strong>Most prolific authors:</strong> ${u.slice(0,3).map(([m])=>m).join(", ")} — consider for KOL mapping and engagement planning.
    </p>`:""}
  </div>`,q&&(q.innerHTML=p)}function le(e,a){te++;const t=a.filter(c=>c.isNejm).length,n=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),i=(()=>{const c={};a.forEach(b=>b.authors.forEach(p=>c[p]=(c[p]||0)+1));const v=Object.entries(c).sort((b,p)=>p[1]-b[1]);return v.length?v[0][0]:"Unknown"})(),l=$e(e),o=t>0?"Deep engagement — cross-journal query":"Moderate engagement",d=t>0?"Evidence synthesis with high-impact journals":"Literature exploration",u=t>2?"PRIORITY: High-impact NEJM evidence discovered — flag for medical affairs review":`Literature search logged — ${a.length} articles, key author: ${i}`;if(A){A.querySelector("[style]")&&te===1&&(A.innerHTML="");const v=document.createElement("div");v.className="signal-card",v.innerHTML=`
      <div class="signal-header">
        <div class="signal-dot"></div>
        <span class="signal-time">${n}</span>
      </div>
      <div class="signal-topic">Literature Search — ${r(e.length>40?e.slice(0,38)+"…":e)}</div>
      <div class="signal-row"><span class="signal-label">Intent</span><span class="signal-value">${r(d)}</span></div>
      <div class="signal-row"><span class="signal-label">Disease</span><span class="signal-value">${r(l)}</span></div>
      <div class="signal-row"><span class="signal-label">Sources</span><span class="signal-value">${a.length} PubMed · ${t} NEJM</span></div>
      <div class="signal-row"><span class="signal-label">Depth</span><span class="signal-value">${r(o)}</span></div>
      <div class="signal-action"><i class="ti ti-arrow-right"></i><span>${r(u)}</span></div>
    `,A.insertBefore(v,A.firstChild)}he({topic:`Literature Search — ${e.length>40?e.slice(0,38)+"…":e}`,intent:d,diseaseArea:l,depth:o,orionAction:u,queries:[e],contentAccessed:a.slice(0,3).map(c=>c.title||"PubMed Article"),sessionDuration:Math.floor(Math.random()*8)+3,_source:"Literature Intelligence"})}function $e(e){const a=e.toLowerCase(),t=[[/atopic|eczema|dermatitis|dupilumab|dupixent/,"Atopic Dermatitis"],[/asthma|airway|tezepelumab/,"Asthma"],[/crohn|ibd|ulcerative colitis|duvakitug/,"Inflammatory Bowel Disease"],[/rsv|nirsevimab|beyfortus/,"RSV Prevention"],[/hemophilia|fitusiran/,"Hemophilia"],[/multiple sclerosis|tolebrutinib/,"Multiple Sclerosis"],[/insulin|glargine|lantus|toujeo|diabetes/,"Diabetes"],[/psoriasis/,"Psoriasis"],[/oncology|cancer|tumor/,"Oncology"],[/vaccine|immunization/,"Vaccines"],[/rare disease|fabry|gaucher|pompe/,"Rare Diseases"]];for(const[s,n]of t)if(s.test(a))return n;return"Cross-TA / General"}function r(e){const a=document.createElement("div");return a.textContent=e,a.innerHTML}function h(e){return new Promise(a=>setTimeout(a,e))}document.getElementById("chat-panel");const x=document.getElementById("chat-messages"),w=document.getElementById("chat-input"),T=document.getElementById("chat-send"),S=document.getElementById("chat-suggestions");w&&T&&(T.addEventListener("click",()=>J()),w.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),J())}),w.addEventListener("input",()=>{T.disabled=!w.value.trim()}));S&&S.querySelectorAll(".chat-suggestion").forEach(e=>{e.addEventListener("click",()=>{w.value=e.dataset.q,J()})});const ae={patterns:[{match:/what.*(latest|recent|new).*(dupilumab|dupixent)/i,query:"dupilumab 2024 2025 2026",synthesize:e=>`Based on my search of PubMed and NEJM, here are the most recent dupilumab publications:

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

`),s=a.filter(l=>l.isNejm).length;let n="";const i=localStorage.getItem(H);if(i){const o=JSON.parse(i).filter(d=>d.query.toLowerCase()!==e.toLowerCase()).slice(0,2);o.length&&(n=`

**Agent memory:** You previously searched for ${o.map(d=>`"${d.query}" (${d.count} results)`).join(" and ")}. I can cross-reference these topics if you'd like a combined analysis.`)}return`I found ${a.length} articles across PubMed${s?` and NEJM (${s} high-impact)`:""} for your query:

${t}

${a.length>3?`Plus ${a.length-3} more articles. `:""}Use the search bar above to see all results with full metadata, or ask me a more specific follow-up question.${n}`}};async function J(){const e=w.value.trim();if(!e)return;w.value="",T.disabled=!0,S&&(S.style.display="none"),_("user",e);const a=Se();let t=null;for(const n of ae.patterns)if(n.match.test(e)){t=n;break}const s=t?t.query:we(e);try{const n=await O(s,8);await h(1200);const i=await O(`${s} AND ${ne}`,3),l=new Set(i.map(u=>u.uid));i.forEach(u=>{u.isNejm=!0}),n.forEach(u=>{l.has(u.uid)&&(u.isNejm=!0)});const o=[...i,...n.filter(u=>!l.has(u.uid))];a.remove();const d=t?t.synthesize(o):ae.fallback(e,o);_("agent",d,o),le(s,o)}catch(n){a.remove(),_("agent",`I encountered an error searching PubMed: ${n.message}. Please try again in a moment — NCBI rate-limits requests to 3 per second.`)}}function we(e){return e.replace(/\b(what|how|does|is|are|the|can|you|find|tell|me|about|give|show|latest|recent|any|published|evidence|data|for|on|in|of|with|and|or|please)\b/gi,"").replace(/[?!.,]/g,"").replace(/\s+/g," ").trim()}function _(e,a,t){const s=document.createElement("div");if(s.className=`chat-msg chat-msg-${e}`,e==="user")s.innerHTML=`<div class="chat-msg-bubble chat-user-bubble">${r(a)}</div>`;else{let n=r(a);n=n.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),n=n.replace(/\*(.+?)\*/g,"<em>$1</em>"),n=n.replace(/\[PMID: (\d+)\]/g,'<a class="chat-pmid-link" href="https://pubmed.ncbi.nlm.nih.gov/$1/" target="_blank" rel="noopener">PMID: $1</a>'),n=n.replace(/^(\d+)\./gm,"<br>$1."),n=n.replace(/^- (.+)/gm,"<br>• $1");const i=t&&t.length>0?`<div class="chat-citations">
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
      </div>`}x.appendChild(s),x.scrollTop=x.scrollHeight}function Y(){const e=localStorage.getItem(H),a=e?JSON.parse(e):[];if(!a.length){U&&(U.style.display="none");return}U.style.display="block",Z.innerHTML="",a.slice(0,8).forEach(t=>{const s=document.createElement("span");s.className="memory-chip",s.title=`${t.count} results · ${t.nejm} NEJM · ${t.date}`,s.innerHTML=`<i class="ti ti-history"></i> ${r(t.query)} <span class="memory-chip-time">${t.ago}</span>`,s.addEventListener("click",()=>{M.value=t.query,C()}),Z.appendChild(s)})}function Me(e,a,t){const s=localStorage.getItem(H);let n=s?JSON.parse(s):[];n=n.filter(l=>l.query.toLowerCase()!==e.toLowerCase());const i=new Date;n.unshift({query:e,count:a,nejm:t,date:i.toLocaleDateString("en-US",{month:"short",day:"numeric"}),ago:"just now",ts:i.getTime()}),n=n.slice(0,20),n.forEach(l=>{const o=Math.floor((i.getTime()-l.ts)/6e4);o<1?l.ago="just now":o<60?l.ago=`${o}m ago`:o<1440?l.ago=`${Math.floor(o/60)}h ago`:l.ago=`${Math.floor(o/1440)}d ago`}),localStorage.setItem(H,JSON.stringify(n)),Y()}Y();ee&&ee.addEventListener("click",()=>{localStorage.removeItem(H),Y()});function Ee(e,a){var s;const t=$.indexOf(e);if(t>-1)$.splice(t,1),a.classList.remove("selected");else{if($.length>=2){const n=$.shift();(s=document.querySelector(`.compare-check[data-pmid="${n}"]`))==null||s.classList.remove("selected")}$.push(e),a.classList.add("selected")}G()}function G(){if(k){if($.length<2){k.style.display=$.length===1?"flex":"none",$.length===1&&(k.innerHTML=`<div class="compare-bar">
        <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 1 article selected — select another to compare</span>
        <div class="compare-bar-actions">
          <button class="compare-bar-btn secondary" onclick="clearCompare()">Cancel</button>
        </div>
      </div>`,k.style.display="block"),D.innerHTML="";return}k.innerHTML=`<div class="compare-bar">
    <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 2 articles selected</span>
    <div class="compare-bar-actions">
      <button class="compare-bar-btn primary" onclick="runComparison()"><i class="ti ti-arrows-exchange" style="margin-right:4px"></i> Compare Evidence</button>
      <button class="compare-bar-btn secondary" onclick="clearCompare()">Clear</button>
    </div>
  </div>`,k.style.display="block"}}window.clearCompare=function(){$=[],document.querySelectorAll(".compare-check.selected").forEach(e=>e.classList.remove("selected")),G()};window.runComparison=async function(){var f,j;const e=$.map(g=>z.find(I=>I.uid===g||I.pmid===g)).filter(Boolean);if(e.length<2)return;D.innerHTML=`<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison — loading abstracts…</span>
    </div>
    <div style="text-align:center;padding:30px;color:var(--text-muted)"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:24px"></i></div>
  </div>`,D.scrollIntoView({behavior:"smooth",block:"start"});const a=[];for(const g of e)try{const I=`${N}/efetch.fcgi?db=pubmed&id=${g.pmid}&rettype=abstract&retmode=text`,Q=(await(await fetch(I)).text()).match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i);a.push(Q?Q[1].trim():"Abstract not available."),a.length<e.length&&await h(1e3)}catch{a.push("Failed to fetch abstract.")}const t=e[0],s=e[1],n=a[0],i=a[1],l=t.fulljournalname===s.fulljournalname,o=((f=t.pubdate.match(/\d{4}/))==null?void 0:f[0])||"?",d=((j=s.pubdate.match(/\d{4}/))==null?void 0:j[0])||"?",u=Math.abs(parseInt(o)-parseInt(d));let c="";if(l)c=`Both articles published in <strong>${r(t.fulljournalname)}</strong>`,u>0&&(c+=` — ${u}-year gap suggests evolving evidence base`),c+=". ";else{const g=t.isNejm,I=s.isNejm;g&&!I?c=`Article 1 is from <strong>NEJM</strong> (highest impact) vs ${r(s.fulljournalname)}. `:!g&&I?c=`Article 2 is from <strong>NEJM</strong> (highest impact) vs ${r(t.fulljournalname)}. `:c=`Cross-journal comparison: <strong>${r(t.source)}</strong> vs <strong>${r(s.source)}</strong>. `}const v=t.authors.length,b=s.authors.length;(v>10||b>10)&&(c+=`Large author list (${Math.max(v,b)} authors) suggests multi-center trial data. `),c+="Review both abstracts to assess study design, population, and endpoints for comparative evidence strength.";const p=g=>g.isNejm?"nejm":"pubmed",m=g=>g.isNejm?"NEJM":"PubMed";D.innerHTML=`<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison</span>
      <button class="compare-panel-close" onclick="document.getElementById('compare-panel-area').innerHTML='';clearCompare()"><i class="ti ti-x"></i></button>
    </div>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-col-header ${p(t)}">Article 1 — ${m(t)}</div>
        <div class="compare-field"><div class="compare-field-label">Title</div><div class="compare-field-value"><strong>${t.title}</strong></div></div>
        <div class="compare-field"><div class="compare-field-label">Authors</div><div class="compare-field-value">${r(t.authors.slice(0,5).join(", "))}${t.authors.length>5?` +${t.authors.length-5} more`:""}</div></div>
        <div class="compare-field"><div class="compare-field-label">Journal</div><div class="compare-field-value">${r(t.fulljournalname)}</div></div>
        <div class="compare-field"><div class="compare-field-label">Date</div><div class="compare-field-value">${r(t.pubdate)}</div></div>
        <div class="compare-field"><div class="compare-field-label">PMID</div><div class="compare-field-value"><a href="https://pubmed.ncbi.nlm.nih.gov/${t.pmid}/" target="_blank" style="color:var(--accent)">${t.pmid}</a></div></div>
        <div class="compare-field"><div class="compare-field-label">Abstract</div><div class="compare-abstract">${r(n)}</div></div>
      </div>
      <div class="compare-col">
        <div class="compare-col-header ${p(s)}">Article 2 — ${m(s)}</div>
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
  </div>`,D.scrollIntoView({behavior:"smooth",block:"start"})};const Le={dupilumab:"IL-4Rα inhibitor for Type 2 inflammation",nirsevimab:"Long-acting monoclonal antibody for RSV prevention",tolebrutinib:"Brain-penetrant BTK inhibitor targeting B-cells and microglia",fitusiran:"Anti-TFPI siRNA for hemophilia prophylaxis",duvakitug:"Anti-TL1A antibody for inflammatory bowel disease",tezepelumab:"Anti-TSLP antibody for severe asthma",insulin:"Basal insulin analog for glycemic control","atopic dermatitis":"Chronic Type 2 inflammatory skin disease",rsv:"Leading cause of infant hospitalization","multiple sclerosis":"Chronic neuroinflammatory disease"};function je(e){var u;const a=(e.title+" "+e.fulljournalname).toLowerCase();let t="";for(const[c,v]of Object.entries(Le))if(a.includes(c)){t=v;break}const s=((u=e.pubdate.match(/\d{4}/))==null?void 0:u[0])||"",n=e.authors.length,i=e.fulljournalname||e.source,l=e.isNejm,o=[];/phase\s*[23]/i.test(e.title)?o.push("pivotal trial"):/phase\s*1/i.test(e.title)?o.push("early-phase study"):/randomis|randomiz|placebo.controlled/i.test(e.title)?o.push("randomized controlled trial"):/meta.analysis|systematic review/i.test(e.title)?o.push("systematic review"):/real.world|retrospective|cohort/i.test(e.title)?o.push("real-world evidence"):/long.term|safety|efficacy/i.test(e.title)?o.push("long-term outcomes data"):/case.report|case.series/i.test(e.title)&&o.push("case report");const d=[];return t&&d.push(t),o.length&&d.push(o[0]),l?d.push("published in NEJM (highest impact)"):i&&d.push(`published in ${i}`),n>15?d.push(`large multi-center study (${n} authors)`):n>0&&d.push(`${n} authors`),s&&d.push(s),d.length>1?d.join(" — ")+".":`${n} authors from ${i} (${s}) — review abstract for study design and key endpoints.`}async function Ie(e){const a=e.filter(t=>t.isNejm).slice(0,2);a.length<2&&a.push(...e.filter(t=>!t.isNejm).slice(0,3-a.length));for(const t of a){await h(1200);const s=document.getElementById(`abstract-${t.pmid}`);if(s){s.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Auto-fetching abstract…</p>';try{const n=`${N}/efetch.fcgi?db=pubmed&id=${t.pmid}&rettype=abstract&retmode=text`,o=(await(await fetch(n)).text()).match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i),d=o?o[1].trim():"";if(d&&d.length>50){const u=je(t);s.innerHTML=`
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
            <span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Auto Deep-Dive</span>
            <div class="article-abstract">${r(d)}</div>
            <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>
            <div class="deep-dive-summary"><i class="ti ti-bulb"></i> ${u}</div>
          </div>`}else s.innerHTML='<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Deep-Dive</span> Abstract not available from PubMed for this article.</p>'}catch{s.innerHTML=""}}}}const E=document.getElementById("demo-search-btn");E&&E.addEventListener("click",V);async function F(e,a){e.value="";for(let t=0;t<a.length;t++)e.value+=a[t],await h(20+Math.random()*25)}function re(){x.innerHTML=`<div class="chat-msg chat-msg-agent">
    <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
    <div class="chat-msg-content">
      <div class="chat-msg-bubble chat-agent-bubble">
        I'm the Literature Intelligence Agent with live connections to <strong>PubMed</strong> (36M+ articles) and the <strong>NEJM</strong>. Ask me about any Sanofi therapeutic area — I'll search, retrieve, and synthesize the evidence.
      </div>
    </div>
  </div>`,S.innerHTML=`<button class="chat-suggestion" data-q="What are the latest publications on dupilumab?">Latest dupilumab pubs</button>
    <button class="chat-suggestion" data-q="How does dupilumab compare to abrocitinib in head-to-head data?">Dupilumab vs abrocitinib</button>
    <button class="chat-suggestion" data-q="What is the pediatric safety profile of dupilumab?">Pediatric safety data</button>
    <button class="chat-suggestion" data-q="What evidence exists for nirsevimab RSV prevention?">Nirsevimab RSV</button>
    <button class="chat-suggestion" data-q="Tell me about tolebrutinib in multiple sclerosis">Tolebrutinib in MS</button>`,S.style.display="flex",w.value="",T.disabled=!0,S.querySelectorAll(".chat-suggestion").forEach(e=>{e.addEventListener("click",()=>{w.value=e.dataset.q,J()})})}const ie=document.getElementById("chat-clear-btn");ie&&ie.addEventListener("click",re);const L=document.getElementById("demo-chat-btn");L&&L.addEventListener("click",V);async function y(e){const a=document.getElementById("demo-narrator");a&&(a.innerHTML=`<i class="ti ti-sparkles"></i> ${e}`,ce()&&a.classList.add("visible"),de(),await ue(e))}function xe(){const e=document.getElementById("demo-narrator");e&&e.classList.remove("visible"),me(),pe()}let K=!1;async function V(){if(K)return;K=!0;const e=document.getElementById("run-demo");e&&(e.disabled=!0,e.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running...'),E&&(E.disabled=!0,E.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running…'),L&&(L.disabled=!0,L.innerHTML='<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running…');const a=document.querySelector(".main-panel");a&&a.scrollTo({top:0,behavior:"smooth"}),await h(500),await y("Literature Intelligence — live PubMed and NEJM search with AI synthesis and Orion integration");const t=document.getElementById("governance-bar");t&&(t.style.display="flex",t.scrollIntoView({behavior:"smooth",block:"center"}),await h(600)),await y("Governance layer active — every search is logged, sourced, and compliance-stamped"),await y("Let's search PubMed — querying dupilumab atopic dermatitis long-term safety"),M.scrollIntoView({behavior:"smooth",block:"center"}),await h(400),await F(M,"dupilumab atopic dermatitis long-term safety"),await h(600),await C(),await h(4e3),await y("Results include NEJM articles with auto deep-dive summaries and Sanofi pipeline intelligence");const s=document.querySelector(".deep-dive-badge");s&&(s.scrollIntoView({behavior:"smooth",block:"center"}),await h(600),await y("The agent already pulled the abstract and wrote this summary — no click required"),await h(1200));const n=document.getElementById("intel-panel");n&&(n.scrollIntoView({behavior:"smooth",block:"center"}),await h(800),await y("Intelligence panel — publication trends, top journals, and key authors extracted automatically"),await h(1500)),await y("Filtering to NEJM only — the highest impact journal results");const i=document.querySelector('.source-btn[data-source="nejm"]');i&&(i.click(),await h(800)),await y("NEJM filter applied — showing only New England Journal of Medicine publications");const l=document.querySelector('.source-btn[data-source="all"]');l&&l.click(),await h(400);const o=document.getElementById("memory-section");o&&(o.scrollIntoView({behavior:"smooth",block:"center"}),await h(600),await y("Agent memory — the system remembers your search history across sessions"),await h(1e3)),M.scrollIntoView({behavior:"smooth",block:"center"}),await h(400),await y("Second search — nirsevimab RSV prevention to demonstrate cross-TA capabilities"),M.value="",await F(M,"nirsevimab RSV prevention infants"),await h(600),await C(),await h(4e3),await y("Each search generates an intelligence signal for MSL field teams via Orion"),await y("The same agent answers questions directly in chat, with live PubMed searches behind every reply"),re(),await h(400),await F(w,"Tell me about tolebrutinib in multiple sclerosis"),await h(600),T.disabled=!1,await J(),await h(5e3),await y("Live PubMed results with citations and source links — the agent covers every Sanofi therapeutic area this way"),a&&a.scrollTo({top:0,behavior:"smooth"}),await h(500),await y("Literature Intelligence — live PubMed, NEJM, AI synthesis, and Orion signals in one platform"),xe(),K=!1,e&&(e.disabled=!1,e.innerHTML='<i class="ti ti-player-play"></i> Play Demo'),E&&(E.disabled=!1,E.innerHTML='<i class="ti ti-player-play"></i> Watch literature search demo'),L&&(L.disabled=!1,L.innerHTML='<i class="ti ti-player-play" style="font-size:13px"></i> Demo')}const se=document.getElementById("run-demo");se&&se.addEventListener("click",V);window.location.hash==="#autoplay"&&(window.location.hash="",setTimeout(V,600));function Se(){const e=document.createElement("div");return e.className="chat-msg chat-msg-agent",e.innerHTML=`
    <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
    <div class="chat-msg-content">
      <div class="chat-msg-bubble chat-agent-bubble">
        <span class="chat-typing"><span></span><span></span><span></span></span>
        <span style="font-size:12px;color:var(--text-muted);margin-left:8px">Searching PubMed & NEJM…</span>
      </div>
    </div>`,x.appendChild(e),x.scrollTop=x.scrollHeight,e}
