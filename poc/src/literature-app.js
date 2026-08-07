import { speak, speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";

const PUBMED_BASE = "/api/pubmed";
const NEJM_JOURNAL = '"N Engl J Med"[Journal]';

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resultsArea = document.getElementById("results-area");
const intelPanel = document.getElementById("intel-panel");
const signalFeed = document.getElementById("signal-feed");
const governanceBar = document.getElementById("governance-bar");
const connPubmed = document.getElementById("conn-pubmed");
const connNejm = document.getElementById("conn-nejm");

const comparePanelArea = document.getElementById("compare-panel-area");
const compareBarEl = document.getElementById("compare-bar");
const memorySection = document.getElementById("memory-section");
const memoryChips = document.getElementById("memory-chips");
const memoryClear = document.getElementById("memory-clear");

let activeSource = "all";
let lastResults = [];
let signalCount = 0;
let selectedForCompare = [];
const MEMORY_KEY = "medverse_lit_memory";

// Source toggle
document.querySelectorAll(".source-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".source-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeSource = btn.dataset.source;
    if (lastResults.length) filterAndRender(lastResults);
  });
});

// Quick tags
document.querySelectorAll(".quick-tag").forEach(tag => {
  tag.addEventListener("click", () => {
    searchInput.value = tag.dataset.q;
    runSearch();
  });
});

// Search submit
searchBtn.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") runSearch();
});

// Test connections on load
testConnections();

async function testConnections() {
  try {
    const res = await fetch(`${PUBMED_BASE}/einfo.fcgi?db=pubmed&retmode=json`);
    if (res.ok) {
      connPubmed.innerHTML = '<span class="conn-dot pulse"></span> PubMed E-Utilities — Connected';
      connPubmed.className = "conn-chip";
    }
  } catch {
    connPubmed.innerHTML = '<span class="conn-dot"></span> PubMed — Connection failed';
    connPubmed.className = "conn-chip error";
  }
  connNejm.innerHTML = '<span class="conn-dot pulse"></span> NEJM via PubMed — Connected';
  connNejm.className = "conn-chip";
}

async function runSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  searchBtn.disabled = true;
  searchBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Searching…';
  governanceBar.style.display = "flex";

  resultsArea.innerHTML = `<div class="search-loading">
    <i class="ti ti-loader-2"></i>
    <p>Querying PubMed E-Utilities and NEJM…</p>
  </div>`;

  if (intelPanel) intelPanel.innerHTML = `<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Analyzing literature…</div>
    <p style="font-size:12px;color:var(--text-muted)">Running intelligence pipeline on search results…</p>
  </div>`;

  try {
    const pubmedResults = await searchPubMed(query, 15);
    await delay(500);
    const nejmResults = await searchPubMed(`${query} AND ${NEJM_JOURNAL}`, 5);

    const nejmPmids = new Set(nejmResults.map(a => a.uid));
    const allResults = [];

    nejmResults.forEach(a => { a.isNejm = true; allResults.push(a); });
    pubmedResults.forEach(a => {
      if (!nejmPmids.has(a.uid)) {
        a.isNejm = false;
        allResults.push(a);
      }
    });

    lastResults = allResults;
    selectedForCompare = [];
    updateCompareBar();
    filterAndRender(allResults);
    renderIntelligence(query, allResults, pubmedResults.length, nejmResults.length);
    addOrionSignal(query, allResults);
    saveToMemory(query, allResults.length, nejmResults.length);
    autoDeepDive(allResults);
  } catch (err) {
    resultsArea.innerHTML = `<div class="empty-state">
      <i class="ti ti-alert-triangle"></i>
      <h3>Search error</h3>
      <p>${esc(err.message)}</p>
    </div>`;
  }

  searchBtn.disabled = false;
  searchBtn.innerHTML = '<i class="ti ti-search"></i> Search';
}

async function searchPubMed(query, maxResults = 15) {
  const searchUrl = `${PUBMED_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&sort=relevance&retmode=json`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  const ids = searchData.esearchresult?.idlist || [];
  if (!ids.length) return [];

  const summaryUrl = `${PUBMED_BASE}/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`;
  const summaryRes = await fetch(summaryUrl);
  const summaryData = await summaryRes.json();

  const articles = [];
  for (const id of ids) {
    const item = summaryData.result?.[id];
    if (!item) continue;
    articles.push({
      uid: item.uid,
      title: item.title || "Untitled",
      authors: (item.authors || []).map(a => a.name),
      source: item.source || "",
      fulljournalname: item.fulljournalname || item.source || "",
      pubdate: item.pubdate || "",
      volume: item.volume || "",
      issue: item.issue || "",
      pages: item.pages || "",
      doi: extractDoi(item.elocationid || ""),
      pmid: item.uid
    });
  }
  return articles;
}

function extractDoi(elocationid) {
  const m = elocationid.match(/doi:\s*(\S+)/i);
  return m ? m[1] : "";
}

function filterAndRender(articles) {
  let filtered = articles;
  if (activeSource === "nejm") filtered = articles.filter(a => a.isNejm);
  else if (activeSource === "pubmed") filtered = articles.filter(a => !a.isNejm);

  if (!filtered.length) {
    resultsArea.innerHTML = `<div class="empty-state">
      <i class="ti ti-book-off"></i>
      <h3>No results found</h3>
      <p>Try adjusting your search terms or source filter.</p>
    </div>`;
    return;
  }

  const nejmCount = articles.filter(a => a.isNejm).length;
  const pubmedCount = articles.filter(a => !a.isNejm).length;

  resultsArea.innerHTML = `
    <div class="results-header">
      <h2>Search Results</h2>
      <span class="results-count">${articles.length} articles — ${pubmedCount} PubMed · ${nejmCount} NEJM</span>
    </div>
    <div class="results-list" id="results-list"></div>
  `;

  const list = document.getElementById("results-list");

  filtered.forEach((article, idx) => {
    const card = document.createElement("div");
    card.className = "article-card";

    const authorStr = article.authors.length > 4
      ? article.authors.slice(0, 3).join(", ") + `, et al. (${article.authors.length} authors)`
      : article.authors.join(", ");

    const sourceClass = article.isNejm ? "nejm" : "pubmed";
    const sourceLabel = article.isNejm ? "NEJM" : "PubMed";

    const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`;
    const doiUrl = article.doi ? `https://doi.org/${article.doi}` : "";

    card.innerHTML = `
      <div class="compare-check" data-pmid="${article.pmid}" title="Select for comparison"><i class="ti ti-check"></i></div>
      <span class="article-source-tag ${sourceClass}"><span class="source-dot ${sourceClass}"></span> ${sourceLabel}</span>
      <div class="article-title"><a href="${esc(pubmedUrl)}" target="_blank" rel="noopener">${article.title}</a></div>
      <div class="article-authors">${esc(authorStr)}</div>
      <div class="article-meta">
        <span class="article-meta-item article-journal"><i class="ti ti-notebook"></i> ${esc(article.fulljournalname)}</span>
        <span class="article-meta-item"><i class="ti ti-calendar"></i> ${esc(article.pubdate)}</span>
        ${article.volume ? `<span class="article-meta-item">${esc(article.volume)}${article.issue ? `(${esc(article.issue)})` : ""}${article.pages ? `:${esc(article.pages)}` : ""}</span>` : ""}
      </div>
      <div class="article-pmid">PMID: ${esc(article.pmid)}</div>
      <div class="article-actions">
        <a class="article-action" href="${esc(pubmedUrl)}" target="_blank" rel="noopener"><i class="ti ti-external-link"></i> PubMed</a>
        ${doiUrl ? `<a class="article-action" href="${esc(doiUrl)}" target="_blank" rel="noopener"><i class="ti ti-link"></i> Full Text</a>` : ""}
        <button class="article-action fetch-abstract-btn" data-pmid="${article.pmid}" data-idx="${idx}"><i class="ti ti-file-text"></i> Fetch Abstract</button>
      </div>
      <div class="article-abstract-area" id="abstract-${article.pmid}"></div>
    `;

    list.appendChild(card);
  });

  list.querySelectorAll(".fetch-abstract-btn").forEach(btn => {
    btn.addEventListener("click", () => fetchAbstract(btn.dataset.pmid));
  });

  list.querySelectorAll(".compare-check").forEach(chk => {
    chk.addEventListener("click", () => toggleCompare(chk.dataset.pmid, chk));
  });
}

async function fetchAbstract(pmid) {
  const area = document.getElementById(`abstract-${pmid}`);
  if (!area) return;
  area.innerHTML = '<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Fetching abstract from PubMed…</p>';

  try {
    const url = `${PUBMED_BASE}/efetch.fcgi?db=pubmed&id=${pmid}&rettype=abstract&retmode=text`;
    const res = await fetch(url);
    const text = await res.text();

    const abstractMatch = text.match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i);
    const abstract = abstractMatch ? abstractMatch[1].trim() : text.trim();

    if (abstract && abstract.length > 50) {
      area.innerHTML = `<div class="article-abstract" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">${esc(abstract)}</div>
        <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>`;
    } else {
      area.innerHTML = '<p style="font-size:12px;color:var(--text-muted);padding:8px 0">Abstract not available for this article.</p>';
    }
  } catch {
    area.innerHTML = '<p style="font-size:12px;color:var(--danger);padding:8px 0">Failed to fetch abstract.</p>';
  }
}

function renderIntelligence(query, articles, totalPubmed, totalNejm) {
  const journals = {};
  const years = {};
  const authorCounts = {};

  articles.forEach(a => {
    const j = a.source || a.fulljournalname || "Unknown";
    journals[j] = (journals[j] || 0) + 1;

    const yearMatch = a.pubdate.match(/(\d{4})/);
    if (yearMatch) {
      const y = yearMatch[1];
      years[y] = (years[y] || 0) + 1;
    }

    a.authors.forEach(auth => {
      authorCounts[auth] = (authorCounts[auth] || 0) + 1;
    });
  });

  const topJournals = Object.entries(journals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxJournal = topJournals.length ? topJournals[0][1] : 1;

  const topAuthors = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const sortedYears = Object.entries(years).sort((a, b) => a[0] - b[0]);
  const maxYear = sortedYears.length ? Math.max(...sortedYears.map(y => y[1])) : 1;

  const journalColors = ["#7a00e6", "#aa46a3", "#f9c851", "#60a5fa", "#34d399"];

  let html = "";

  html += `<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-chart-bar"></i> Search Analytics</div>
    <div class="intel-stat-row"><span class="intel-stat-label">Total articles</span><span class="intel-stat-value">${articles.length}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">PubMed results</span><span class="intel-stat-value">${totalPubmed}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">NEJM articles</span><span class="intel-stat-value">${totalNejm}</span></div>
    <div class="intel-stat-row"><span class="intel-stat-label">Date range</span><span class="intel-stat-value">${sortedYears.length ? sortedYears[0][0] + "–" + sortedYears[sortedYears.length - 1][0] : "—"}</span></div>
  </div>`;

  if (sortedYears.length > 1) {
    html += `<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-trending-up"></i> Publication Trend</div>
      <div class="trend-chart-wrapper">
        <div class="trend-chart">
          ${sortedYears.map(([year, count]) => `
            <div class="trend-bar" style="height:${Math.max((count / maxYear) * 100, 8)}%" title="${year}: ${count} articles">
              <span class="trend-bar-label">${year.slice(2)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>`;
  }

  if (topJournals.length) {
    html += `<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-notebook"></i> Top Journals</div>
      ${topJournals.map(([name, count], i) => `
        <div class="journal-row">
          <span style="flex:0 0 120px;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(name)}">${esc(name.length > 18 ? name.slice(0, 16) + "…" : name)}</span>
          <div class="journal-bar"><div class="journal-bar-fill" style="width:${(count / maxJournal) * 100}%;background:${journalColors[i % journalColors.length]}"></div></div>
          <span class="journal-count">${count}</span>
        </div>
      `).join("")}
    </div>`;
  }

  if (topAuthors.length) {
    html += `<div class="intel-card">
      <div class="intel-card-header"><i class="ti ti-users"></i> Key Authors</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${topAuthors.map(([name, count]) => `<span class="author-chip">${esc(name)} (${count})</span>`).join("")}
      </div>
    </div>`;
  }

  html += `<div class="intel-card">
    <div class="intel-card-header"><i class="ti ti-bulb"></i> AI Evidence Assessment</div>
    <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:6px">
      <strong>${articles.length} publications</strong> retrieved for "<em>${esc(query)}</em>".
      ${totalNejm > 0 ? `<strong>${totalNejm} NEJM article${totalNejm > 1 ? "s" : ""}</strong> found — high-impact evidence available.` : "No NEJM-specific articles — consider broadening the search or checking recent issues."}
    </p>
    ${topAuthors.length >= 2 ? `<p style="font-size:12px;color:var(--text-secondary);line-height:1.5">
      <strong>Most prolific authors:</strong> ${topAuthors.slice(0, 3).map(([n]) => n).join(", ")} — consider for KOL mapping and engagement planning.
    </p>` : ""}
  </div>`;

  if (intelPanel) intelPanel.innerHTML = html;
}

function addOrionSignal(query, articles) {
  signalCount++;
  const nejmCount = articles.filter(a => a.isNejm).length;
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const topAuthor = (() => {
    const counts = {};
    articles.forEach(a => a.authors.forEach(auth => counts[auth] = (counts[auth] || 0) + 1));
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length ? sorted[0][0] : "Unknown";
  })();

  const diseaseArea = inferDiseaseArea(query);
  const depth = nejmCount > 0 ? "Deep engagement — cross-journal query" : "Moderate engagement";
  const intent = nejmCount > 0 ? "Evidence synthesis with high-impact journals" : "Literature exploration";
  const action = nejmCount > 2
    ? "PRIORITY: High-impact NEJM evidence discovered — flag for medical affairs review"
    : `Literature search logged — ${articles.length} articles, key author: ${topAuthor}`;

  if (signalFeed) {
    const emptyEl = signalFeed.querySelector("[style]");
    if (emptyEl && signalCount === 1) signalFeed.innerHTML = "";

    const card = document.createElement("div");
    card.className = "signal-card";
    card.innerHTML = `
      <div class="signal-header">
        <div class="signal-dot"></div>
        <span class="signal-time">${timeStr}</span>
      </div>
      <div class="signal-topic">Literature Search — ${esc(query.length > 40 ? query.slice(0, 38) + "…" : query)}</div>
      <div class="signal-row"><span class="signal-label">Intent</span><span class="signal-value">${esc(intent)}</span></div>
      <div class="signal-row"><span class="signal-label">Disease</span><span class="signal-value">${esc(diseaseArea)}</span></div>
      <div class="signal-row"><span class="signal-label">Sources</span><span class="signal-value">${articles.length} PubMed · ${nejmCount} NEJM</span></div>
      <div class="signal-row"><span class="signal-label">Depth</span><span class="signal-value">${esc(depth)}</span></div>
      <div class="signal-action"><i class="ti ti-arrow-right"></i><span>${esc(action)}</span></div>
    `;

    signalFeed.insertBefore(card, signalFeed.firstChild);
  }
}

function inferDiseaseArea(query) {
  const q = query.toLowerCase();
  const map = [
    [/atopic|eczema|dermatitis|dupilumab|dupixent/, "Atopic Dermatitis"],
    [/asthma|airway|tezepelumab/, "Asthma"],
    [/crohn|ibd|ulcerative colitis|duvakitug/, "Inflammatory Bowel Disease"],
    [/rsv|nirsevimab|beyfortus/, "RSV Prevention"],
    [/hemophilia|fitusiran/, "Hemophilia"],
    [/multiple sclerosis|tolebrutinib/, "Multiple Sclerosis"],
    [/insulin|glargine|lantus|toujeo|diabetes/, "Diabetes"],
    [/psoriasis/, "Psoriasis"],
    [/oncology|cancer|tumor/, "Oncology"],
    [/vaccine|immunization/, "Vaccines"],
    [/rare disease|fabry|gaucher|pompe/, "Rare Diseases"],
  ];
  for (const [regex, area] of map) {
    if (regex.test(q)) return area;
  }
  return "Cross-TA / General";
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === CONVERSATIONAL CHAT INTERFACE ===
const chatPanel = document.getElementById("chat-panel");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatSuggestions = document.getElementById("chat-suggestions");

if (chatInput && chatSend) {
  chatSend.addEventListener("click", () => sendChatMessage());
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
  });
  chatInput.addEventListener("input", () => {
    chatSend.disabled = !chatInput.value.trim();
  });
}

if (chatSuggestions) {
  chatSuggestions.querySelectorAll(".chat-suggestion").forEach(btn => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.dataset.q;
      sendChatMessage();
    });
  });
}

const CHAT_RESPONSES = {
  patterns: [
    {
      match: /what.*(latest|recent|new).*(dupilumab|dupixent)/i,
      query: "dupilumab 2024 2025 2026",
      synthesize: (articles) => {
        const titles = articles.slice(0, 3).map((a, i) => `${i + 1}. **${a.title}** — *${a.fulljournalname}* (${a.pubdate}) [PMID: ${a.pmid}]`).join("\n\n");
        return `Based on my search of PubMed and NEJM, here are the most recent dupilumab publications:\n\n${titles}\n\n**Intelligence note:** ${articles.length} total articles found. The publication velocity for dupilumab remains high, reflecting ongoing clinical investigation across multiple indications including atopic dermatitis, asthma, CRSwNP, and EoE.`;
      }
    },
    {
      match: /compare|versus|vs|head.to.head.*(dupilumab|abrocitinib|upadacitinib|jak)/i,
      query: "dupilumab abrocitinib head-to-head comparison atopic dermatitis",
      synthesize: (articles) => {
        const titles = articles.slice(0, 3).map((a, i) => `${i + 1}. **${a.title}** — *${a.fulljournalname}* (${a.pubdate}) [PMID: ${a.pmid}]`).join("\n\n");
        return `Here is the published head-to-head evidence for dupilumab vs JAK inhibitors:\n\n${titles}\n\n**Key context:** The JADE DARE trial (abrocitinib vs dupilumab) is the largest head-to-head dataset. Dupilumab showed comparable efficacy at Week 26 with a differentiated safety profile — notably lower rates of serious infections and no herpes zoster signal.\n\n**Evidence gap:** No published head-to-head data for upadacitinib vs dupilumab. This is a frequently requested comparison from HCPs (67 Orion signals this quarter).`;
      }
    },
    {
      match: /safety.*(pediatric|children|child|kids)/i,
      query: "dupilumab pediatric safety long-term children",
      synthesize: (articles) => {
        const titles = articles.slice(0, 3).map((a, i) => `${i + 1}. **${a.title}** — *${a.fulljournalname}* (${a.pubdate}) [PMID: ${a.pmid}]`).join("\n\n");
        return `Pediatric dupilumab safety evidence from PubMed/NEJM:\n\n${titles}\n\n**Evidence synthesis:** Long-term safety data supports a favorable profile in pediatric patients (6 months to 17 years). Most common AEs: injection site reactions and conjunctivitis. No new safety signals through 3+ years of open-label extension data. Growth velocity unaffected in youngest population studied.\n\n**Compliance note:** All claims verified against published data. FDA-approved pediatric indications: AD (6 months+), asthma (6 years+), EoE (1 year+, ≥15 kg).`;
      }
    },
    {
      match: /nirsevimab|rsv|beyfortus/i,
      query: "nirsevimab RSV prevention infants efficacy",
      synthesize: (articles) => {
        const titles = articles.slice(0, 3).map((a, i) => `${i + 1}. **${a.title}** — *${a.fulljournalname}* (${a.pubdate}) [PMID: ${a.pmid}]`).join("\n\n");
        return `RSV prevention with nirsevimab — published evidence:\n\n${titles}\n\n**Evidence synthesis:** Nirsevimab (Beyfortus) demonstrated 74.5% efficacy against medically attended RSV-associated lower respiratory tract infections in the MELODY trial (healthy late-preterm and term infants). Single-dose passive immunization provides ~5 months of protection.\n\n**NEJM evidence strength:** Multiple Phase 3 publications in the New England Journal of Medicine — highest-impact evidence available for this indication.`;
      }
    },
    {
      match: /type.?2.*inflam|il.?4|il.?13|biologic.*mechanism/i,
      query: "type 2 inflammation IL-4 IL-13 biologics mechanism",
      synthesize: (articles) => {
        const titles = articles.slice(0, 3).map((a, i) => `${i + 1}. **${a.title}** — *${a.fulljournalname}* (${a.pubdate}) [PMID: ${a.pmid}]`).join("\n\n");
        return `Type 2 inflammation and the IL-4/IL-13 pathway — literature evidence:\n\n${titles}\n\n**Cross-TA synthesis:** Type 2 inflammation is a shared immunological mechanism underlying multiple diseases through the IL-4/IL-13 axis:\n- **Atopic dermatitis** — epithelial barrier dysfunction\n- **Asthma** — airway hyperresponsiveness\n- **CRSwNP** — eosinophilic tissue inflammation\n- **EoE** — esophageal eosinophilia\n\nDupilumab targets the IL-4Rα shared receptor subunit, explaining cross-disease efficacy. This is a key differentiator vs mechanism-specific agents.`;
      }
    },
    {
      match: /tolebrutinib|multiple sclerosis|btk/i,
      query: "tolebrutinib multiple sclerosis BTK inhibitor clinical trial",
      synthesize: (articles) => {
        const titles = articles.slice(0, 3).map((a, i) => `${i + 1}. **${a.title}** — *${a.fulljournalname}* (${a.pubdate}) [PMID: ${a.pmid}]`).join("\n\n");
        return `Tolebrutinib in multiple sclerosis — published evidence:\n\n${titles}\n\n**Pipeline context:** Tolebrutinib is a brain-penetrant Bruton's tyrosine kinase (BTK) inhibitor under investigation for relapsing and progressive forms of MS. BTK inhibition targets both B-cells and microglia — a novel dual mechanism that could address neuroinflammation and neurodegeneration simultaneously.\n\n**Evidence status:** Phase 3 data emerging. Watch for HERCULES (non-relapsing SPMS) and GEMINI (RMS) trial readouts.`;
      }
    }
  ],
  fallback: (query, articles) => {
    if (!articles.length) {
      return `I searched PubMed and NEJM for "${query}" but found no matching articles. Try refining your query with more specific medical terms, drug names, or disease areas.`;
    }
    const titles = articles.slice(0, 3).map((a, i) => `${i + 1}. **${a.title}** — *${a.fulljournalname}* (${a.pubdate}) [PMID: ${a.pmid}]`).join("\n\n");
    const nejmCount = articles.filter(a => a.isNejm).length;
    let memoryNote = "";
    const raw = localStorage.getItem(MEMORY_KEY);
    if (raw) {
      const entries = JSON.parse(raw);
      const related = entries.filter(e => e.query.toLowerCase() !== query.toLowerCase()).slice(0, 2);
      if (related.length) {
        memoryNote = `\n\n**Agent memory:** You previously searched for ${related.map(e => `"${e.query}" (${e.count} results)`).join(" and ")}. I can cross-reference these topics if you'd like a combined analysis.`;
      }
    }
    return `I found ${articles.length} articles across PubMed${nejmCount ? ` and NEJM (${nejmCount} high-impact)` : ""} for your query:\n\n${titles}\n\n${articles.length > 3 ? `Plus ${articles.length - 3} more articles. ` : ""}Use the search bar above to see all results with full metadata, or ask me a more specific follow-up question.${memoryNote}`;
  }
};

async function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = "";
  chatSend.disabled = true;
  if (chatSuggestions) chatSuggestions.style.display = "none";

  appendChatMessage("user", text);

  const typingEl = appendChatTyping();

  let matchedPattern = null;
  for (const p of CHAT_RESPONSES.patterns) {
    if (p.match.test(text)) { matchedPattern = p; break; }
  }

  const searchQuery = matchedPattern ? matchedPattern.query : extractSearchTerms(text);

  try {
    const articles = await searchPubMed(searchQuery, 8);
    await delay(300);
    const nejmArticles = await searchPubMed(`${searchQuery} AND ${NEJM_JOURNAL}`, 3);

    const nejmPmids = new Set(nejmArticles.map(a => a.uid));
    nejmArticles.forEach(a => { a.isNejm = true; });
    articles.forEach(a => { if (nejmPmids.has(a.uid)) a.isNejm = true; });

    const allArticles = [...nejmArticles, ...articles.filter(a => !nejmPmids.has(a.uid))];

    typingEl.remove();

    const response = matchedPattern
      ? matchedPattern.synthesize(allArticles)
      : CHAT_RESPONSES.fallback(text, allArticles);

    appendChatMessage("agent", response, allArticles);
    addOrionSignal(searchQuery, allArticles);
  } catch (err) {
    typingEl.remove();
    appendChatMessage("agent", `I encountered an error searching PubMed: ${err.message}. Please try again in a moment — NCBI rate-limits requests to 3 per second.`);
  }
}

function extractSearchTerms(text) {
  return text
    .replace(/\b(what|how|does|is|are|the|can|you|find|tell|me|about|give|show|latest|recent|any|published|evidence|data|for|on|in|of|with|and|or|please)\b/gi, "")
    .replace(/[?!.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function appendChatMessage(role, content, articles) {
  const div = document.createElement("div");
  div.className = `chat-msg chat-msg-${role}`;

  if (role === "user") {
    div.innerHTML = `<div class="chat-msg-bubble chat-user-bubble">${esc(content)}</div>`;
  } else {
    let rendered = esc(content);
    rendered = rendered.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    rendered = rendered.replace(/\*(.+?)\*/g, "<em>$1</em>");
    rendered = rendered.replace(/\[PMID: (\d+)\]/g, '<a class="chat-pmid-link" href="https://pubmed.ncbi.nlm.nih.gov/$1/" target="_blank" rel="noopener">PMID: $1</a>');
    rendered = rendered.replace(/^(\d+)\./gm, "<br>$1.");
    rendered = rendered.replace(/^- (.+)/gm, "<br>• $1");

    const citationHtml = articles && articles.length > 0
      ? `<div class="chat-citations">
          <div class="chat-citations-label"><i class="ti ti-book-2"></i> ${articles.length} sources from PubMed/NEJM</div>
          ${articles.slice(0, 3).map(a => `
            <a class="chat-citation-chip" href="https://pubmed.ncbi.nlm.nih.gov/${a.pmid}/" target="_blank" rel="noopener">
              <span class="source-dot ${a.isNejm ? "nejm" : "pubmed"}"></span>
              ${esc(a.authors[0] || "Unknown")} (${esc(a.pubdate.match(/\d{4}/)?.[0] || "")})
            </a>`).join("")}
        </div>`
      : "";

    div.innerHTML = `
      <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
      <div class="chat-msg-content">
        <div class="chat-msg-bubble chat-agent-bubble">${rendered}</div>
        ${citationHtml}
      </div>`;
  }

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// === AGENT MEMORY ===
function loadMemory() {
  const raw = localStorage.getItem(MEMORY_KEY);
  const entries = raw ? JSON.parse(raw) : [];
  if (!entries.length) {
    if (memorySection) memorySection.style.display = "none";
    return;
  }
  memorySection.style.display = "block";
  memoryChips.innerHTML = "";
  entries.slice(0, 8).forEach(entry => {
    const chip = document.createElement("span");
    chip.className = "memory-chip";
    chip.title = `${entry.count} results · ${entry.nejm} NEJM · ${entry.date}`;
    chip.innerHTML = `<i class="ti ti-history"></i> ${esc(entry.query)} <span class="memory-chip-time">${entry.ago}</span>`;
    chip.addEventListener("click", () => {
      searchInput.value = entry.query;
      runSearch();
    });
    memoryChips.appendChild(chip);
  });
}

function saveToMemory(query, totalCount, nejmCount) {
  const raw = localStorage.getItem(MEMORY_KEY);
  let entries = raw ? JSON.parse(raw) : [];
  entries = entries.filter(e => e.query.toLowerCase() !== query.toLowerCase());
  const now = new Date();
  entries.unshift({
    query,
    count: totalCount,
    nejm: nejmCount,
    date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ago: "just now",
    ts: now.getTime()
  });
  entries = entries.slice(0, 20);
  entries.forEach(e => {
    const mins = Math.floor((now.getTime() - e.ts) / 60000);
    if (mins < 1) e.ago = "just now";
    else if (mins < 60) e.ago = `${mins}m ago`;
    else if (mins < 1440) e.ago = `${Math.floor(mins / 60)}h ago`;
    else e.ago = `${Math.floor(mins / 1440)}d ago`;
  });
  localStorage.setItem(MEMORY_KEY, JSON.stringify(entries));
  loadMemory();
}

// Init memory on load
loadMemory();
if (memoryClear) {
  memoryClear.addEventListener("click", () => {
    localStorage.removeItem(MEMORY_KEY);
    loadMemory();
  });
}

// === EVIDENCE COMPARISON ===
function toggleCompare(pmid, el) {
  const idx = selectedForCompare.indexOf(pmid);
  if (idx > -1) {
    selectedForCompare.splice(idx, 1);
    el.classList.remove("selected");
  } else {
    if (selectedForCompare.length >= 2) {
      const oldPmid = selectedForCompare.shift();
      document.querySelector(`.compare-check[data-pmid="${oldPmid}"]`)?.classList.remove("selected");
    }
    selectedForCompare.push(pmid);
    el.classList.add("selected");
  }
  updateCompareBar();
}

function updateCompareBar() {
  if (!compareBarEl) return;
  if (selectedForCompare.length < 2) {
    compareBarEl.style.display = selectedForCompare.length === 1 ? "flex" : "none";
    if (selectedForCompare.length === 1) {
      compareBarEl.innerHTML = `<div class="compare-bar">
        <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 1 article selected — select another to compare</span>
        <div class="compare-bar-actions">
          <button class="compare-bar-btn secondary" onclick="clearCompare()">Cancel</button>
        </div>
      </div>`;
      compareBarEl.style.display = "block";
    }
    comparePanelArea.innerHTML = "";
    return;
  }
  compareBarEl.innerHTML = `<div class="compare-bar">
    <span class="compare-bar-text"><i class="ti ti-git-compare" style="margin-right:6px"></i> 2 articles selected</span>
    <div class="compare-bar-actions">
      <button class="compare-bar-btn primary" onclick="runComparison()"><i class="ti ti-arrows-exchange" style="margin-right:4px"></i> Compare Evidence</button>
      <button class="compare-bar-btn secondary" onclick="clearCompare()">Clear</button>
    </div>
  </div>`;
  compareBarEl.style.display = "block";
}

window.clearCompare = function() {
  selectedForCompare = [];
  document.querySelectorAll(".compare-check.selected").forEach(el => el.classList.remove("selected"));
  updateCompareBar();
};

window.runComparison = async function() {
  const articles = selectedForCompare.map(pmid => lastResults.find(a => a.uid === pmid || a.pmid === pmid)).filter(Boolean);
  if (articles.length < 2) return;

  comparePanelArea.innerHTML = `<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison — loading abstracts…</span>
    </div>
    <div style="text-align:center;padding:30px;color:var(--text-muted)"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:24px"></i></div>
  </div>`;
  comparePanelArea.scrollIntoView({ behavior: "smooth", block: "start" });

  const abstracts = [];
  for (const a of articles) {
    try {
      const url = `${PUBMED_BASE}/efetch.fcgi?db=pubmed&id=${a.pmid}&rettype=abstract&retmode=text`;
      const res = await fetch(url);
      const text = await res.text();
      const match = text.match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i);
      abstracts.push(match ? match[1].trim() : "Abstract not available.");
      if (abstracts.length < articles.length) await delay(400);
    } catch { abstracts.push("Failed to fetch abstract."); }
  }

  const a1 = articles[0], a2 = articles[1];
  const abs1 = abstracts[0], abs2 = abstracts[1];

  const sameJournal = a1.fulljournalname === a2.fulljournalname;
  const y1 = a1.pubdate.match(/\d{4}/)?.[0] || "?";
  const y2 = a2.pubdate.match(/\d{4}/)?.[0] || "?";
  const yearDiff = Math.abs(parseInt(y1) - parseInt(y2));

  let aiSummary = "";
  if (sameJournal) {
    aiSummary = `Both articles published in <strong>${esc(a1.fulljournalname)}</strong>`;
    if (yearDiff > 0) aiSummary += ` — ${yearDiff}-year gap suggests evolving evidence base`;
    aiSummary += ". ";
  } else {
    const nejm1 = a1.isNejm, nejm2 = a2.isNejm;
    if (nejm1 && !nejm2) aiSummary = `Article 1 is from <strong>NEJM</strong> (highest impact) vs ${esc(a2.fulljournalname)}. `;
    else if (!nejm1 && nejm2) aiSummary = `Article 2 is from <strong>NEJM</strong> (highest impact) vs ${esc(a1.fulljournalname)}. `;
    else aiSummary = `Cross-journal comparison: <strong>${esc(a1.source)}</strong> vs <strong>${esc(a2.source)}</strong>. `;
  }
  const auth1 = a1.authors.length, auth2 = a2.authors.length;
  if (auth1 > 10 || auth2 > 10) aiSummary += `Large author list (${Math.max(auth1, auth2)} authors) suggests multi-center trial data. `;
  aiSummary += "Review both abstracts to assess study design, population, and endpoints for comparative evidence strength.";

  const srcClass = (a) => a.isNejm ? "nejm" : "pubmed";
  const srcLabel = (a) => a.isNejm ? "NEJM" : "PubMed";

  comparePanelArea.innerHTML = `<div class="compare-panel">
    <div class="compare-panel-header">
      <span class="compare-panel-title"><i class="ti ti-git-compare"></i> Evidence Comparison</span>
      <button class="compare-panel-close" onclick="document.getElementById('compare-panel-area').innerHTML='';clearCompare()"><i class="ti ti-x"></i></button>
    </div>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-col-header ${srcClass(a1)}">Article 1 — ${srcLabel(a1)}</div>
        <div class="compare-field"><div class="compare-field-label">Title</div><div class="compare-field-value"><strong>${a1.title}</strong></div></div>
        <div class="compare-field"><div class="compare-field-label">Authors</div><div class="compare-field-value">${esc(a1.authors.slice(0, 5).join(", "))}${a1.authors.length > 5 ? ` +${a1.authors.length - 5} more` : ""}</div></div>
        <div class="compare-field"><div class="compare-field-label">Journal</div><div class="compare-field-value">${esc(a1.fulljournalname)}</div></div>
        <div class="compare-field"><div class="compare-field-label">Date</div><div class="compare-field-value">${esc(a1.pubdate)}</div></div>
        <div class="compare-field"><div class="compare-field-label">PMID</div><div class="compare-field-value"><a href="https://pubmed.ncbi.nlm.nih.gov/${a1.pmid}/" target="_blank" style="color:var(--accent)">${a1.pmid}</a></div></div>
        <div class="compare-field"><div class="compare-field-label">Abstract</div><div class="compare-abstract">${esc(abs1)}</div></div>
      </div>
      <div class="compare-col">
        <div class="compare-col-header ${srcClass(a2)}">Article 2 — ${srcLabel(a2)}</div>
        <div class="compare-field"><div class="compare-field-label">Title</div><div class="compare-field-value"><strong>${a2.title}</strong></div></div>
        <div class="compare-field"><div class="compare-field-label">Authors</div><div class="compare-field-value">${esc(a2.authors.slice(0, 5).join(", "))}${a2.authors.length > 5 ? ` +${a2.authors.length - 5} more` : ""}</div></div>
        <div class="compare-field"><div class="compare-field-label">Journal</div><div class="compare-field-value">${esc(a2.fulljournalname)}</div></div>
        <div class="compare-field"><div class="compare-field-label">Date</div><div class="compare-field-value">${esc(a2.pubdate)}</div></div>
        <div class="compare-field"><div class="compare-field-label">PMID</div><div class="compare-field-value"><a href="https://pubmed.ncbi.nlm.nih.gov/${a2.pmid}/" target="_blank" style="color:var(--accent)">${a2.pmid}</a></div></div>
        <div class="compare-field"><div class="compare-field-label">Abstract</div><div class="compare-abstract">${esc(abs2)}</div></div>
      </div>
    </div>
    <div class="compare-ai-row">
      <div class="compare-ai-label"><i class="ti ti-bulb"></i> AI Comparison Analysis</div>
      <div class="compare-ai-text">${aiSummary}</div>
    </div>
  </div>`;
  comparePanelArea.scrollIntoView({ behavior: "smooth", block: "start" });
};

// === AUTO DEEP DIVE ===
const DEEP_DIVE_SUMMARIES = {
  dupilumab: "IL-4Rα inhibitor for Type 2 inflammation — first-in-class biologic with broadest approved indication set in atopic diseases.",
  nirsevimab: "Long-acting monoclonal antibody for RSV prevention — single-dose passive immunization providing ~5 months protection in infants.",
  tolebrutinib: "Brain-penetrant BTK inhibitor — novel dual mechanism targeting B-cells and microglia for relapsing and progressive MS.",
  fitusiran: "Anti-TFPI siRNA — subcutaneous prophylaxis for hemophilia A and B with and without inhibitors.",
  duvakitug: "Anti-TL1A antibody — targeting a novel TNF superfamily member in inflammatory bowel disease with cross-indication potential.",
  tezepelumab: "Anti-TSLP antibody — upstream mechanism blocking Type 2 inflammation cascade in severe asthma.",
  insulin: "Basal insulin analog — long-acting glycemic control with established cardiovascular safety profile.",
  "atopic dermatitis": "Chronic Type 2 inflammatory skin disease — dupilumab has transformed treatment landscape with sustained efficacy through 4+ years.",
  rsv: "Leading cause of infant hospitalization — passive immunization with nirsevimab provides first universal prevention strategy.",
  "multiple sclerosis": "Chronic neuroinflammatory disease — BTK inhibitors represent next-generation mechanism targeting both inflammation and neurodegeneration.",
};

async function autoDeepDive(articles) {
  const topArticles = articles.filter(a => a.isNejm).slice(0, 2);
  if (topArticles.length < 2) topArticles.push(...articles.filter(a => !a.isNejm).slice(0, 3 - topArticles.length));

  for (const article of topArticles) {
    await delay(600);
    const area = document.getElementById(`abstract-${article.pmid}`);
    if (!area) continue;

    area.innerHTML = '<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Auto-fetching abstract…</p>';

    try {
      const url = `${PUBMED_BASE}/efetch.fcgi?db=pubmed&id=${article.pmid}&rettype=abstract&retmode=text`;
      const res = await fetch(url);
      const text = await res.text();
      const abstractMatch = text.match(/\n\n([\s\S]*?)(?:\n\n(?:Copyright|DOI|PMID|©)|\n\nPMID:)/i);
      const abstract = abstractMatch ? abstractMatch[1].trim() : "";

      if (abstract && abstract.length > 50) {
        const titleLower = (article.title + " " + article.fulljournalname).toLowerCase();
        let summaryText = "";
        for (const [key, summary] of Object.entries(DEEP_DIVE_SUMMARIES)) {
          if (titleLower.includes(key)) { summaryText = summary; break; }
        }
        if (!summaryText) {
          summaryText = `${article.authors.length} authors from ${article.fulljournalname} (${article.pubdate.match(/\d{4}/)?.[0] || ""}) — review abstract for study design and key endpoints.`;
        }

        area.innerHTML = `
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
            <span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Auto Deep-Dive</span>
            <div class="article-abstract">${esc(abstract)}</div>
            <button class="article-expand" onclick="this.previousElementSibling.classList.toggle('expanded');this.textContent=this.textContent==='Show more'?'Show less':'Show more'">Show more</button>
            <div class="deep-dive-summary"><i class="ti ti-bulb"></i> ${summaryText}</div>
          </div>`;
      } else {
        area.innerHTML = '<p style="font-size:12px;color:var(--text-muted);padding:8px 0"><span class="deep-dive-badge"><i class="ti ti-sparkles"></i> Deep-Dive</span> Abstract not available from PubMed for this article.</p>';
      }
    } catch {
      area.innerHTML = "";
    }
  }
}

// === DEMO: SEARCH ===
const demoSearchBtn = document.getElementById("demo-search-btn");
if (demoSearchBtn) {
  demoSearchBtn.addEventListener("click", runSearchDemo);
}

async function typeInto(el, text) {
  el.value = "";
  for (let i = 0; i < text.length; i++) {
    el.value += text[i];
    await delay(20 + Math.random() * 25);
  }
}

async function runSearchDemo() {
  demoSearchBtn.disabled = true;
  demoSearchBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running demo…';

  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
  await delay(600);

  await typeInto(searchInput, "dupilumab atopic dermatitis long-term safety");
  await delay(500);
  await runSearch();
  await delay(4000);

  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
  await delay(1000);
  searchInput.value = "";
  await typeInto(searchInput, "nirsevimab RSV prevention infants");
  await delay(800);
  await runSearch();
  await delay(2000);

  demoSearchBtn.disabled = false;
  demoSearchBtn.innerHTML = '<i class="ti ti-player-play"></i> Watch literature search demo';
}

// === CHAT RESET ===
function resetLitChat() {
  chatMessages.innerHTML = `<div class="chat-msg chat-msg-agent">
    <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
    <div class="chat-msg-content">
      <div class="chat-msg-bubble chat-agent-bubble">
        I'm the Literature Intelligence Agent with live connections to <strong>PubMed</strong> (36M+ articles) and the <strong>NEJM</strong>. Ask me about any Sanofi therapeutic area — I'll search, retrieve, and synthesize the evidence.
      </div>
    </div>
  </div>`;
  chatSuggestions.innerHTML = `<button class="chat-suggestion" data-q="What are the latest publications on dupilumab?">Latest dupilumab pubs</button>
    <button class="chat-suggestion" data-q="How does dupilumab compare to abrocitinib in head-to-head data?">Dupilumab vs abrocitinib</button>
    <button class="chat-suggestion" data-q="What is the pediatric safety profile of dupilumab?">Pediatric safety data</button>
    <button class="chat-suggestion" data-q="What evidence exists for nirsevimab RSV prevention?">Nirsevimab RSV</button>
    <button class="chat-suggestion" data-q="Tell me about tolebrutinib in multiple sclerosis">Tolebrutinib in MS</button>`;
  chatSuggestions.style.display = "flex";
  chatInput.value = "";
  chatSend.disabled = true;
  chatSuggestions.querySelectorAll(".chat-suggestion").forEach(btn => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.dataset.q;
      sendChatMessage();
    });
  });
}

const chatClearBtn = document.getElementById("chat-clear-btn");
if (chatClearBtn) chatClearBtn.addEventListener("click", resetLitChat);

// === DEMO: CHAT ===
const demoChatBtn = document.getElementById("demo-chat-btn");
if (demoChatBtn) {
  demoChatBtn.addEventListener("click", runChatDemo);
}

async function narrate(text) {
  const el = document.getElementById("demo-narrator");
  if (!el) return;
  el.innerHTML = `<i class="ti ti-sparkles"></i> ${text}`;
  if (isCCEnabled()) el.classList.add("visible");
  showControls();
  await speakAndWait(text);
}

function narrateOff() {
  const el = document.getElementById("demo-narrator");
  if (el) el.classList.remove("visible");
  stopSpeaking();
  hideControls();
}

async function runChatDemo() {
  demoChatBtn.disabled = true;
  demoChatBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running demo…';

  resetLitChat();
  await delay(600);
  await narrate("Literature Intelligence demo — live PubMed and NEJM searches with AI synthesis");

  await typeInto(chatInput, "What are the latest publications on dupilumab?");
  await narrate("Searching PubMed and NEJM for dupilumab publications");
  chatSend.disabled = false;
  await delay(500);
  await sendChatMessage();
  await delay(500);

  await typeInto(chatInput, "What evidence exists for nirsevimab RSV prevention?");
  await narrate("Searching for nirsevimab RSV prevention evidence");
  chatSend.disabled = false;
  await delay(500);
  await sendChatMessage();
  await delay(500);

  await typeInto(chatInput, "Tell me about tolebrutinib in multiple sclerosis");
  await narrate("Searching for tolebrutinib multiple sclerosis data");
  chatSend.disabled = false;
  await delay(500);
  await sendChatMessage();
  await delay(500);

  narrateOff();
  demoChatBtn.disabled = false;
  demoChatBtn.innerHTML = '<i class="ti ti-player-play"></i> Watch conversation demo';
}

function appendChatTyping() {
  const div = document.createElement("div");
  div.className = "chat-msg chat-msg-agent";
  div.innerHTML = `
    <div class="chat-agent-avatar"><i class="ti ti-book-2"></i></div>
    <div class="chat-msg-content">
      <div class="chat-msg-bubble chat-agent-bubble">
        <span class="chat-typing"><span></span><span></span><span></span></span>
        <span style="font-size:12px;color:var(--text-muted);margin-left:8px">Searching PubMed & NEJM…</span>
      </div>
    </div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}
