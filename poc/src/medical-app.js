// ── Medical Concierge — 11-agent hub for Medical Affairs ──
import { broadcastSignal, broadcastPopulationSignal } from "./orion-bridge.js";
import { speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";
import { createDemoController } from "./demo-nav.js";
import {
  QUADRANTS, getNationalSummary, getAllRegionRollups, getEducationPriorities,
  getEventGeographyAnalysis,
} from "./population-data.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// ── NAV ──
const hub = $('#hub');
const panels = $$('.agent-panel');
const backBtn = $('#back-btn');
const headerHome = $('#header-home');
const mainScroll = $('#main-scroll');

function showHub() {
  panels.forEach(p => p.classList.remove('active'));
  hub.style.display = '';
  backBtn.classList.remove('visible');
  mainScroll.scrollTop = 0;
}

function showPanel(id) {
  hub.style.display = 'none';
  panels.forEach(p => p.classList.remove('active'));
  const panel = $(`#panel-${id}`);
  if (panel) panel.classList.add('active');
  backBtn.classList.add('visible');
  mainScroll.scrollTop = 0;
}

backBtn.addEventListener('click', showHub);
headerHome.addEventListener('click', (e) => { e.preventDefault(); showHub(); });

$$('.agent-card').forEach(card => {
  card.addEventListener('click', () => showPanel(card.dataset.agent));
});

// ── SEARCH ──
const searchInput = $('#hub-search-input');
const searchBtn = $('#hub-search-btn');
const hints = [
  'Dupixent dosing MIR',
  'EADV publication timeline',
  'AD advisory board plan',
  'dupilumab safety signals',
  'Disease state education atopic dermatitis',
  'atopic dermatitis evidence gap',
];
const hintsEl = $('#hub-search-hints');
hints.forEach(h => {
  const chip = document.createElement('span');
  chip.className = 'hub-search-hint-chip';
  chip.textContent = h;
  chip.addEventListener('click', () => { searchInput.value = h; routeSearch(h); });
  hintsEl.appendChild(chip);
});

function routeSearch(q) {
  const lq = q.toLowerCase();
  if (/\bmir\b|medical info|response letter/i.test(lq)) { showPanel('med-info'); prefillMIR(q); }
  else if (/abstract|poster|slide|draft|content/i.test(lq)) { showPanel('sci-comms'); prefillSciComms(q); }
  else if (/label|approv|regulatory|fda|ema/i.test(lq)) showPanel('regulatory');
  else if (/safety|signal|adverse|pharmacovig|icsr/i.test(lq)) showPanel('pharma-vig');
  else if (/publicat|manuscript|journal|pub plan/i.test(lq)) showPanel('pub-planner');
  else if (/advisory|board|kol/i.test(lq)) showPanel('advisory');
  else if (/education|training|disease state|patient education|hcp education/i.test(lq)) showPanel('med-ed');
  else if (/evidence|rwe|systematic|meta.analy|slr/i.test(lq)) showPanel('evidence');
  else if (/strategy|landscape|unmet|kpi|medical plan/i.test(lq)) showPanel('med-strategy');
  else if (/literature|pubmed|search|citation/i.test(lq)) showPanel('literature');
  else if (/congress|eadv|aad|acr|ats|aaaai|ddw|symposium/i.test(lq)) showPanel('congress');
  else showPanel('med-info');
}

searchBtn.addEventListener('click', () => { if (searchInput.value.trim()) routeSearch(searchInput.value.trim()); });
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && searchInput.value.trim()) routeSearch(searchInput.value.trim()); });

// ── CHIP HELPERS ──
function setupChips(containerId) {
  const chips = $$(`#${containerId} .form-chip`);
  chips.forEach(c => c.addEventListener('click', () => c.classList.toggle('selected')));
}
function getSelectedChips(containerId) {
  return $$(`#${containerId} .form-chip.selected`).map(c => c.dataset.val);
}

setupChips('mir-requestor');
setupChips('sc-audience');
setupChips('ab-format');
setupChips('ev-type');
setupChips('lit-type');
setupChips('cg-focus');

// ── PREFILL HELPERS ──
function prefillMIR(q) {
  const products = { dupixent: 'Dupixent (dupilumab)', kevzara: 'Kevzara (sarilumab)', praluent: 'Praluent (alirocumab)', aubagio: 'Aubagio (teriflunomide)', altuviiio: 'Altuviiio (efanesoctocog alfa)' };
  for (const [key, val] of Object.entries(products)) {
    if (q.toLowerCase().includes(key)) { $('#mir-product').value = val; break; }
  }
  if (/dos/i.test(q)) $('#mir-topic').value = 'Dosing & Administration';
  else if (/safe|adverse/i.test(q)) $('#mir-topic').value = 'Safety / Adverse Events';
  else if (/effica/i.test(q)) $('#mir-topic').value = 'Efficacy Data';
}

function prefillSciComms(q) {
  if (/abstract/i.test(q)) $('#sc-type').value = 'Congress Abstract';
  else if (/slide/i.test(q)) $('#sc-type').value = 'Slide Deck';
  else if (/poster/i.test(q)) $('#sc-type').value = 'Poster Summary';
}

// ══════════════════════════════════════════════
// 1. MEDICAL INFORMATION (MIR)
// ══════════════════════════════════════════════
const mirDB = {
  'Dupixent (dupilumab)': {
    'Dosing & Administration': {
      summary: 'Dupixent (dupilumab) is administered via subcutaneous injection. For adults with atopic dermatitis, the recommended dose is an initial 600 mg (two 300 mg injections) followed by 300 mg every other week. For asthma, the recommended dose is 200 mg or 300 mg every other week depending on the indication.',
      keyPoints: ['Initial loading dose: 600 mg SC (2 × 300 mg)', 'Maintenance: 300 mg SC every 2 weeks (Q2W)', 'Rotate injection sites (thigh, abdomen, upper arm)', 'Allow prefilled syringe to reach room temperature (~45 min)', 'Can be self-administered after training'],
      refs: ['Dupixent US Prescribing Information, Revised 2024', 'Simpson EL, et al. N Engl J Med 2016;375:2335-2348', 'Blauvelt A, et al. Lancet 2017;389:2287-2303'],
    },
    'Safety / Adverse Events': {
      summary: 'In clinical trials, the most common adverse reactions (≥1%) with Dupixent include injection site reactions, conjunctivitis, blepharitis, oral herpes, keratitis, eye pruritus, other herpes simplex virus infection, and dry eye.',
      keyPoints: ['Injection site reactions: 10% vs 6% placebo', 'Conjunctivitis: 10% vs 2% placebo (AD trials)', 'Hypersensitivity reactions reported (rare)', 'No clinically meaningful laboratory abnormalities', 'Helminth infections: treat before initiating', 'No live vaccines during treatment'],
      refs: ['Dupixent US PI, Section 6: Adverse Reactions', 'Blauvelt A, et al. JAAD 2019;80:89-98', 'Thyssen JP, et al. Br J Dermatol 2021;184:437-449'],
    },
    'Efficacy Data': {
      summary: 'In pivotal Phase 3 trials (SOLO 1 & SOLO 2), dupilumab demonstrated significant improvements in EASI-75 (primary endpoint) at week 16. In SOLO 1, 38% of patients achieved EASI-75 vs 10% placebo (p<0.001). In SOLO 2, 36% achieved EASI-75 vs 9% placebo (p<0.001).',
      keyPoints: ['SOLO 1: EASI-75 at wk16: 38% vs 10% (p<0.001)', 'SOLO 2: EASI-75 at wk16: 36% vs 9% (p<0.001)', 'IGA 0/1: 37-38% vs 8-10% placebo', 'Rapid itch relief: NRS improvement by week 2', 'Long-term OLE: sustained efficacy through 3 years', 'CHRONOS: dupilumab + TCS superior to TCS alone'],
      refs: ['Simpson EL, et al. N Engl J Med 2016;375:2335-2348', 'Blauvelt A, et al. Lancet 2017;389:2287-2303', 'Beck LA, et al. JAMA Dermatol 2020;156:131-143'],
    },
    'Mechanism of Action': {
      summary: 'Dupilumab is a fully human monoclonal antibody that specifically binds to the shared IL-4Rα subunit, inhibiting signaling of both IL-4 and IL-13. These type 2 cytokines are key drivers of type 2 inflammation in atopic dermatitis, asthma, CRSwNP, EoE, and other conditions.',
      keyPoints: ['Targets IL-4 receptor alpha subunit', 'Blocks both IL-4 and IL-13 signaling', 'Reduces type 2 inflammation biomarkers (IgE, TARC, eotaxin-3)', 'Does not broadly immunosuppress', 'Preserves T-cell, B-cell, and innate immune function'],
      refs: ['Gandhi NA, et al. Nat Rev Drug Discov 2016;15:35-50', 'Dupixent US PI, Section 12: Clinical Pharmacology'],
    },
    'Drug Interactions': {
      summary: 'No formal drug interaction studies have been conducted with Dupixent. CYP450 enzyme formation may be altered by increased levels of certain cytokines during chronic inflammation. Dupilumab-mediated inhibition of IL-4/IL-13 may normalize CYP450 activity.',
      keyPoints: ['No formal PK interaction studies completed', 'Monitor drugs metabolized by CYP450 (e.g. warfarin, theophylline)', 'No dose adjustment needed for concomitant TCS', 'Avoid live vaccines during treatment', 'No interaction with systemic immunosuppressants (clinical data limited)'],
      refs: ['Dupixent US PI, Section 7: Drug Interactions', 'Kovalenko P, et al. Clin Pharmacol Ther 2020;108:1303-1312'],
    },
    'Pregnancy / Lactation': {
      summary: 'There are no adequate and well-controlled studies of Dupixent in pregnant women. Animal reproduction studies showed no evidence of harm at doses up to 10× the MRHD. Dupixent should only be used during pregnancy if the potential benefit justifies the potential risk.',
      keyPoints: ['Pregnancy Category: no adequate human data', 'Animal studies: no adverse developmental effects', 'IgG4 antibodies cross placenta in 3rd trimester', 'Unknown if excreted in human milk', 'Consider benefit/risk for nursing mothers', 'Pregnancy registry available: 1-877-311-8972'],
      refs: ['Dupixent US PI, Section 8: Use in Specific Populations', 'Kage P, et al. JAAD 2020;82:e241-e242'],
    },
    'Pediatric Use': {
      summary: 'Dupixent is approved for atopic dermatitis in patients aged 6 months and older. Dosing is weight-based for pediatric patients. Safety and efficacy in the pediatric population were established in Phase 3 trials (LIBERTY AD PEDS and others).',
      keyPoints: ['6 months to 5 years (5-<15 kg): 200 mg Q4W', '6 months to 5 years (15-<30 kg): 300 mg Q4W', '6-11 years (<60 kg): 200 mg Q2W or 300 mg Q4W', '6-11 years (≥60 kg): 200 mg Q2W', '12-17 years (<60 kg): 200 mg Q2W or 300 mg Q4W', '12-17 years (≥60 kg): 300 mg Q2W'],
      refs: ['Paller AS, et al. JAAD 2020;83:1282-1293', 'Cork MJ, et al. Br J Dermatol 2021;184:857-866'],
    },
    'Storage & Handling': {
      summary: 'Dupixent should be stored refrigerated at 2°C to 8°C (36°F to 46°F). It may be kept at room temperature up to 25°C (77°F) for a maximum of 14 days. Protect from light. Do not freeze or shake.',
      keyPoints: ['Store refrigerated: 2-8°C (36-46°F)', 'Room temp excursion: up to 25°C for 14 days max', 'Protect from light, keep in original carton', 'Do not freeze or shake', 'Do not use if cloudy, discolored, or contains particles'],
      refs: ['Dupixent US PI, Section 16: How Supplied/Storage'],
    },
  },
  'Kevzara (sarilumab)': {
    'Dosing & Administration': {
      summary: 'Kevzara is administered 200 mg SC every 2 weeks. Dose reduction to 150 mg every 2 weeks is recommended for management of neutropenia, thrombocytopenia, and liver enzyme elevations.',
      keyPoints: ['Standard dose: 200 mg SC every 2 weeks', 'Dose reduce to 150 mg Q2W for lab abnormalities', 'Interrupt if ANC <1000, platelets <50,000, or ALT/AST >5× ULN', 'Can be used as monotherapy or with DMARDs', 'Self-administration after proper training'],
      refs: ['Kevzara US Prescribing Information, Revised 2023', 'Fleischmann R, et al. Arthritis Rheumatol 2017;69:277-290'],
    },
    'Safety / Adverse Events': {
      summary: 'The most common adverse reactions are neutropenia, increased ALT, injection site erythema, upper respiratory infections, and urinary tract infections. Serious infections including pneumonia and cellulitis have been reported.',
      keyPoints: ['Neutropenia: 13% vs 0.4% placebo', 'ALT elevation ≥3× ULN: 5% vs 3% placebo', 'Injection site reactions: 9% vs 8% placebo', 'GI perforation risk (monitor diverticulitis)', 'Lipid elevations observed', 'Monitor CBC, LFTs, lipids at baseline and regularly'],
      refs: ['Kevzara US PI, Section 6', 'Genovese MC, et al. Arthritis Rheumatol 2015;67:1424-1437'],
    },
  },
  'Praluent (alirocumab)': {
    'Dosing & Administration': {
      summary: 'Praluent is given as 75 mg SC every 2 weeks or 300 mg SC every 4 weeks. If LDL-C response is inadequate, the dose may be increased to 150 mg every 2 weeks.',
      keyPoints: ['Starting dose: 75 mg SC Q2W or 300 mg SC Q4W', 'Titrate to 150 mg Q2W if LDL-C not at goal', 'Measure LDL-C 4-8 weeks after initiation/titration', 'Can be used with statins or other lipid-lowering therapy', 'Room temp for 30-40 min before injection'],
      refs: ['Praluent US Prescribing Information, Revised 2023', 'Robinson JG, et al. N Engl J Med 2015;372:1489-1499'],
    },
  },
  'Aubagio (teriflunomide)': {
    'Dosing & Administration': {
      summary: 'Aubagio is an oral disease-modifying therapy for relapsing forms of MS. The recommended dose is 7 mg or 14 mg orally once daily. Liver function must be assessed before and during treatment.',
      keyPoints: ['Dose: 7 mg or 14 mg orally once daily', 'Take with or without food', 'Check ALT/AST, bilirubin within 6 months before start', 'Monitor ALT monthly for 6 months after initiation', 'Accelerated elimination procedure available with cholestyramine'],
      refs: ['Aubagio US Prescribing Information, Revised 2023', 'OConnor P, et al. N Engl J Med 2011;365:1293-1303'],
    },
  },
  'Altuviiio (efanesoctocog alfa)': {
    'Dosing & Administration': {
      summary: 'Altuviiio is a factor VIII replacement therapy for hemophilia A. The recommended prophylactic dose is 50 IU/kg once weekly. For on-demand treatment, dose by severity and site of bleeding.',
      keyPoints: ['Prophylaxis: 50 IU/kg IV once weekly', 'On-demand: 50 IU/kg (minor) to 50 IU/kg (major)', 'Perioperative: 50 IU/kg pre-op, repeat as needed', 'Single-dose vial reconstitution with diluent', 'Administer IV over several minutes'],
      refs: ['Altuviiio US Prescribing Information, 2023', 'Pipe SW, et al. N Engl J Med 2023;388:310-320'],
    },
  },
};

$('#mir-submit').addEventListener('click', () => {
  const product = $('#mir-product').value;
  const topic = $('#mir-topic').value;
  const requestor = getSelectedChips('mir-requestor')[0] || 'HCP';
  const details = $('#mir-details').value.trim();
  const container = $('#mir-results');
  const btn = $('#mir-submit');
  if (!product || !topic) { container.innerHTML = '<div class="result-empty" style="color:var(--danger)"><i class="ti ti-alert-circle"></i>Please select a product and topic.</div>'; return; }

  if (window.mvBtnLoading) mvBtnLoading(btn, 'Generating…');
  container.innerHTML = '<div class="result-empty"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Generating compliant MIR response letter…</div>';

  setTimeout(() => {
    const data = mirDB[product]?.[topic];
    if (!data) {
      container.innerHTML = `<div class="result-empty"><i class="ti ti-file-description"></i>No standard response available for ${product} / ${topic}. A custom MIR would be routed to the medical information team.</div>`;
      return;
    }
    const today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
    const caseId = 'MIR-' + Date.now().toString(36).toUpperCase().slice(-6);
    container.innerHTML = `
      <div class="mir-letter">
        <div class="mir-letter-header">
          <div class="mir-letter-title">Standard Response Letter</div>
          <div class="mir-letter-meta">Case ID: ${caseId} &nbsp;|&nbsp; Date: ${today} &nbsp;|&nbsp; Requestor: ${requestor}</div>
        </div>
        <div class="mir-letter-body">
          <h5>RE: ${product} — ${topic}</h5>
          <p>${data.summary}</p>
          <h5>Key Points</h5>
          <ul style="margin:0 0 8px 18px;font-size:12.5px;line-height:1.7;">
            ${data.keyPoints.map(k => `<li>${k}</li>`).join('')}
          </ul>
          ${details ? `<h5>Additional Context</h5><p>${details}</p>` : ''}
        </div>
        <div class="mir-disclaimer"><i class="ti ti-alert-triangle"></i>This information is provided for educational purposes. It does not constitute medical advice. Please refer to the full prescribing information.</div>
        <div class="mir-refs"><strong>References:</strong><br>${data.refs.map((r,i) => `${i+1}. ${r}`).join('<br>')}</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="form-btn form-btn-secondary" onclick="navigator.clipboard.writeText(this.closest('.form-results').querySelector('.mir-letter').innerText)"><i class="ti ti-copy"></i> Copy</button>
        <button class="form-btn form-btn-secondary" onclick="if(window.mvToast)mvToast('MIR routed to Medical Review queue','success')"><i class="ti ti-send"></i> Route for Review</button>
      </div>`;
    if (window.mvBtnSuccess) mvBtnSuccess(btn, 'Generated');
    if (window.mvToast) mvToast('Standard response letter generated', 'success');
    if (window.mvPulse) mvPulse(container.querySelector('.mir-letter'));
    broadcastSignal({ topic: `MIR Response — ${data.drug}`, intent: "Medical information request", diseaseArea: data.indication || "General", depth: "Deep engagement", orionAction: "Queue for MSL follow-up — HCP submitted MIR via Medical Concierge", _source: "Medical Concierge" });
  }, 1200);
});

// ══════════════════════════════════════════════
// 2. SCIENTIFIC COMMUNICATIONS
// ══════════════════════════════════════════════
const contentTemplates = {
  'Congress Abstract': { sections: ['Background', 'Methods', 'Results', 'Conclusions'], wordLimit: '400 words' },
  'Slide Deck': { sections: ['Title Slide', 'Background & Rationale', 'Study Design', 'Key Results', 'Conclusions', 'References'], wordLimit: '~20 slides' },
  'Poster Summary': { sections: ['Introduction', 'Methods', 'Results', 'Discussion', 'Conclusions'], wordLimit: '300 words' },
  'Medical Letter': { sections: ['Dear [Recipient]', 'Background', 'Clinical Evidence', 'Conclusions', 'Sincerely'], wordLimit: '1 page' },
  'Plain Language Summary': { sections: ['What was this study about?', 'Who participated?', 'What happened during the study?', 'What were the results?', 'What do these results mean?'], wordLimit: '500 words, 8th grade reading level' },
};

$('#sc-submit').addEventListener('click', () => {
  const type = $('#sc-type').value;
  const product = $('#sc-product').value.trim();
  const message = $('#sc-message').value.trim();
  const audiences = getSelectedChips('sc-audience');
  const container = $('#sc-results');
  const btn = $('#sc-submit');
  if (!type) { container.innerHTML = '<div class="result-empty" style="color:var(--danger)"><i class="ti ti-alert-circle"></i>Please select a content type.</div>'; return; }
  if (window.mvBtnLoading) mvBtnLoading(btn, 'Drafting…');

  container.innerHTML = '<div class="result-empty"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Generating draft outline…</div>';

  setTimeout(() => {
    const tmpl = contentTemplates[type];
    container.innerHTML = `
      <div class="result-card">
        <div class="result-card-header">
          <span class="result-badge badge-info">${type}</span>
          <div class="result-title">${product || 'Draft'} — ${type}</div>
        </div>
        <div class="result-body">
          <p><strong>Target:</strong> ${audiences.length ? audiences.join(', ') : 'General'} &nbsp;|&nbsp; <strong>Format:</strong> ${tmpl.wordLimit}</p>
          ${message ? `<p style="margin-top:6px"><strong>Key message:</strong> ${message}</p>` : ''}
          <h5 style="font-size:12px;font-weight:700;margin:12px 0 6px;text-transform:uppercase;letter-spacing:.3px;">Recommended Sections</h5>
          ${tmpl.sections.map((s,i) => `
            <div class="checklist-item checklist-info" style="margin-bottom:4px">
              <div class="checklist-icon"><span style="font-size:11px;font-weight:700">${i+1}</span></div>
              <div class="checklist-text"><span class="checklist-label">${s}</span></div>
            </div>`).join('')}
        </div>
        <div class="result-actions">
          <button class="form-btn form-btn-primary" style="font-size:12px"><i class="ti ti-pencil"></i> Generate Full Draft</button>
          <button class="form-btn form-btn-secondary" style="font-size:12px"><i class="ti ti-share"></i> Send to MLR Review</button>
        </div>
      </div>
      <div class="result-card" style="border-left:3px solid var(--accent);">
        <div class="result-body" style="font-size:12px">
          <strong style="color:var(--accent)">Fair Balance Check</strong>
          <div class="checklist-item checklist-pass" style="margin-top:8px"><div class="checklist-icon"><i class="ti ti-check"></i></div><div class="checklist-text">Benefit-risk language balanced</div></div>
          <div class="checklist-item checklist-pass"><div class="checklist-icon"><i class="ti ti-check"></i></div><div class="checklist-text">Safety information included</div></div>
          <div class="checklist-item checklist-warn"><div class="checklist-icon"><i class="ti ti-alert-triangle"></i></div><div class="checklist-text">Ensure off-label content is excluded</div></div>
          <div class="checklist-item checklist-pass"><div class="checklist-icon"><i class="ti ti-check"></i></div><div class="checklist-text">References traceable to approved sources</div></div>
        </div>
      </div>`;
    if (window.mvBtnSuccess) mvBtnSuccess(btn, 'Draft Ready');
    if (window.mvToast) mvToast(`${type} outline generated with fair balance check`, 'success');
  }, 1400);
});

// ══════════════════════════════════════════════
// 3. REGULATORY INTELLIGENCE
// ══════════════════════════════════════════════
const regData = [
  { product: 'Dupixent', event: 'sNDA Approval — Prurigo Nodularis', agency: 'FDA', date: '2022-09-28', status: 'Approved', impact: 'New indication for PN in adults; 7th approved indication' },
  { product: 'Dupixent', event: 'Type II Variation — COPD', agency: 'EMA', date: '2024-06-15', status: 'Under Review', impact: 'CHMP review for uncontrolled COPD with T2 phenotype' },
  { product: 'Dupixent', event: 'Label Update — Pediatric AD (6 mo+)', agency: 'FDA', date: '2023-06-01', status: 'Approved', impact: 'Extended age range to 6 months; weight-based dosing' },
  { product: 'Kevzara', event: 'Safety Labeling Update — GI Perforation', agency: 'FDA', date: '2024-02-10', status: 'Implemented', impact: 'Added GI perforation warning language to Warnings section' },
  { product: 'Praluent', event: 'Supplemental Approval — CV Risk Reduction', agency: 'FDA', date: '2019-04-28', status: 'Approved', impact: 'CV risk reduction indication based on ODYSSEY OUTCOMES' },
  { product: 'Aubagio', event: 'REMS Modification', agency: 'FDA', date: '2023-11-15', status: 'Implemented', impact: 'Updated pregnancy prevention counseling requirements' },
  { product: 'Altuviiio', event: 'BLA Approval', agency: 'FDA', date: '2023-02-21', status: 'Approved', impact: 'First and only once-weekly factor VIII for hemophilia A prophylaxis' },
  { product: 'Dupixent', event: 'Type II Variation — EoE', agency: 'EMA', date: '2023-12-14', status: 'Approved', impact: 'Eosinophilic esophagitis indication for adults and adolescents ≥12 years' },
];

function renderRegulatory() {
  const container = $('#reg-content');
  const statusColors = { 'Approved': 'badge-success', 'Under Review': 'badge-warning', 'Implemented': 'badge-info' };
  container.innerHTML = `
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-tile"><div class="stat-num">${regData.length}</div><div class="stat-label">Total Actions</div></div>
      <div class="stat-tile"><div class="stat-num">${regData.filter(r => r.status === 'Approved').length}</div><div class="stat-label">Approvals</div></div>
      <div class="stat-tile"><div class="stat-num">${regData.filter(r => r.status === 'Under Review').length}</div><div class="stat-label">Under Review</div></div>
      <div class="stat-tile"><div class="stat-num">${new Set(regData.map(r => r.product)).size}</div><div class="stat-label">Products</div></div>
    </div>
    ${regData.map(r => `
      <div class="result-card">
        <div class="result-card-header">
          <span class="result-badge ${statusColors[r.status] || 'badge-accent'}">${r.status}</span>
          <div class="result-title">${r.event}</div>
        </div>
        <div class="result-body">
          <p><strong>${r.product}</strong> — ${r.impact}</p>
        </div>
        <div class="result-meta">
          <div class="result-meta-item"><i class="ti ti-building"></i>${r.agency}</div>
          <div class="result-meta-item"><i class="ti ti-calendar"></i>${r.date}</div>
        </div>
      </div>`).join('')}`;
}
renderRegulatory();

// ══════════════════════════════════════════════
// 4. PHARMACOVIGILANCE
// ══════════════════════════════════════════════
const pvSignals = {
  'Dupixent (dupilumab)': [
    { signal: 'Conjunctivitis (all forms)', status: 'Ongoing Monitoring', severity: 'Moderate', lastReview: '2024-Q2', detail: 'Rates consistent with label. No new risk identified. Monitoring continues per RMP.', casesYTD: 342 },
    { signal: 'Facial erythema / flushing', status: 'New Signal Under Review', severity: 'Low', lastReview: '2024-Q3', detail: 'Emerging cluster of 28 cases. Under evaluation by PSMF. Causality assessment pending.', casesYTD: 28 },
    { signal: 'Arthralgia (new-onset)', status: 'Closed — No Action', severity: 'Low', lastReview: '2024-Q1', detail: 'Disproportionality analysis did not confirm signal. Background rate consistent with disease population.', casesYTD: 15 },
    { signal: 'Eosinophilic pneumonia', status: 'Ongoing Monitoring', severity: 'High', lastReview: '2024-Q2', detail: 'Rare but serious. 12 cumulative cases post-marketing. Included in SmPC warnings.', casesYTD: 4 },
  ],
  'Kevzara (sarilumab)': [
    { signal: 'Neutropenia (Grade 3+)', status: 'Ongoing Monitoring', severity: 'Moderate', lastReview: '2024-Q2', detail: 'Consistent with known profile. Dose modification guidance in label adequate.', casesYTD: 89 },
    { signal: 'Hepatic injury (ALT >5× ULN)', status: 'Ongoing Monitoring', severity: 'Moderate', lastReview: '2024-Q2', detail: 'No pattern of hepatotoxicity beyond expected transaminase elevations. Monitoring continues.', casesYTD: 34 },
  ],
  'Praluent (alirocumab)': [
    { signal: 'Injection site reactions (severe)', status: 'Closed — No Action', severity: 'Low', lastReview: '2024-Q1', detail: 'Review of 2023 data shows rates within expected range. No action required.', casesYTD: 12 },
  ],
  'Aubagio (teriflunomide)': [
    { signal: 'Peripheral neuropathy', status: 'Label Update Recommended', severity: 'Moderate', lastReview: '2024-Q3', detail: 'Signal confirmed via FAERS analysis. Recommendation to add peripheral neuropathy to warnings.', casesYTD: 22 },
    { signal: 'Hepatotoxicity (severe)', status: 'Ongoing Monitoring', severity: 'High', lastReview: '2024-Q2', detail: 'Boxed Warning in place. 3 new serious cases in 2024. Enhanced monitoring via REMS.', casesYTD: 3 },
  ],
  'Altuviiio (efanesoctocog alfa)': [
    { signal: 'Hypersensitivity / anaphylaxis', status: 'Ongoing Monitoring', severity: 'High', lastReview: '2024-Q2', detail: 'Post-marketing surveillance active. 2 confirmed cases of anaphylaxis. Anti-drug antibody testing ongoing.', casesYTD: 2 },
  ],
};

$('#pv-submit').addEventListener('click', () => {
  const product = $('#pv-product').value;
  const category = $('#pv-category').value;
  const container = $('#pv-results');
  const btn = $('#pv-submit');
  if (!product) { container.innerHTML = '<div class="result-empty" style="color:var(--danger)"><i class="ti ti-alert-circle"></i>Please select a product.</div>'; return; }

  if (window.mvBtnLoading) mvBtnLoading(btn, 'Querying…');
  container.innerHTML = '<div class="result-empty"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Querying safety signal database…</div>';

  setTimeout(() => {
    let signals = pvSignals[product] || [];
    if (category) signals = signals.filter(s => s.status === category);
    if (!signals.length) {
      if (window.mvBtnReset) mvBtnReset(btn);
      container.innerHTML = '<div class="result-empty"><i class="ti ti-shield-check"></i>No signals matching criteria for this product.</div>';
      return;
    }

    const sevColors = { 'High': 'badge-danger', 'Moderate': 'badge-warning', 'Low': 'badge-success' };
    const statusColors = { 'New Signal Under Review': 'badge-danger', 'Ongoing Monitoring': 'badge-warning', 'Label Update Recommended': 'badge-accent', 'Closed — No Action': 'badge-success' };
    container.innerHTML = signals.map(s => `
      <div class="result-card">
        <div class="result-card-header">
          <span class="result-badge ${statusColors[s.status]}">${s.status}</span>
          <span class="result-badge ${sevColors[s.severity]}">${s.severity}</span>
        </div>
        <div class="result-title" style="margin-bottom:8px">${s.signal}</div>
        <div class="result-body">
          <p>${s.detail}</p>
        </div>
        <div class="result-meta">
          <div class="result-meta-item"><i class="ti ti-calendar"></i>Last Review: ${s.lastReview}</div>
          <div class="result-meta-item"><i class="ti ti-report-medical"></i>Cases YTD: ${s.casesYTD}</div>
        </div>
      </div>`).join('');
    if (window.mvBtnSuccess) mvBtnSuccess(btn, 'Done', 2000);
    if (window.mvToast) mvToast(`${signals.length} safety signal${signals.length > 1 ? 's' : ''} retrieved`, 'info');
    if (window.mvPulse) container.querySelectorAll('.result-card').forEach(c => mvPulse(c));
  }, 1000);
});

// ══════════════════════════════════════════════
// 5. PUBLICATION PLANNER
// ══════════════════════════════════════════════
const pubPipeline = [
  { id: 'PUB-001', title: 'LIBERTY AD HIVE: 3-year real-world dupilumab outcomes', type: 'Original Article', journal: 'JAMA Dermatology', status: 'Under Review', product: 'Dupixent', target: '2024 Q4', authors: 'Simpson EL, Thaçi D, et al.', stage: 'Peer Review' },
  { id: 'PUB-002', title: 'Dupilumab in COPD: BOREAS trial 52-week results', type: 'Original Article', journal: 'N Engl J Med', status: 'Accepted', product: 'Dupixent', target: '2024 Q3', authors: 'Bhatt SP, Rabe KF, et al.', stage: 'In Press' },
  { id: 'PUB-003', title: 'EADV 2024 Late-Breaker: Dupilumab in chronic hand eczema', type: 'Congress Abstract', journal: 'EADV Congress', status: 'Submitted', product: 'Dupixent', target: 'EADV Oct 2024', authors: 'Blauvelt A, Cork M, et al.', stage: 'Abstract Review' },
  { id: 'PUB-004', title: 'Sarilumab monotherapy vs adalimumab: MONARCH 3-year follow-up', type: 'Original Article', journal: 'Ann Rheum Dis', status: 'Draft', product: 'Kevzara', target: '2025 Q1', authors: 'Burmester GR, et al.', stage: 'Internal Review' },
  { id: 'PUB-005', title: 'ODYSSEY OUTCOMES: 5-year CV mortality follow-up', type: 'Research Letter', journal: 'Lancet', status: 'Planning', product: 'Praluent', target: '2025 Q2', authors: 'Schwartz GG, et al.', stage: 'Protocol Development' },
  { id: 'PUB-006', title: 'Plain language summary: What patients should know about Dupixent for EoE', type: 'PLS', journal: 'Patient Education', status: 'Draft', product: 'Dupixent', target: '2024 Q4', authors: 'Medical Communications', stage: 'MLR Review' },
  { id: 'PUB-007', title: 'Efanesoctocog alfa XTEND-1: patient-reported outcomes', type: 'Original Article', journal: 'Blood', status: 'Submitted', product: 'Altuviiio', target: '2024 Q4', authors: 'Pipe SW, Leebeek F, et al.', stage: 'Peer Review' },
];

function renderPublications() {
  const container = $('#pub-content');
  const statusColors = { 'Planning': 'badge-accent', 'Draft': 'badge-warning', 'Submitted': 'badge-info', 'Under Review': 'badge-info', 'Accepted': 'badge-success', 'Published': 'badge-success' };
  const stageOrder = ['Protocol Development', 'Internal Review', 'MLR Review', 'Abstract Review', 'Peer Review', 'In Press', 'Published'];

  container.innerHTML = `
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-tile"><div class="stat-num">${pubPipeline.length}</div><div class="stat-label">Total Pubs</div></div>
      <div class="stat-tile"><div class="stat-num">${pubPipeline.filter(p => p.status === 'Submitted' || p.status === 'Under Review').length}</div><div class="stat-label">In Review</div></div>
      <div class="stat-tile"><div class="stat-num">${pubPipeline.filter(p => p.status === 'Accepted').length}</div><div class="stat-label">Accepted</div></div>
      <div class="stat-tile"><div class="stat-num">${new Set(pubPipeline.map(p => p.product)).size}</div><div class="stat-label">Products</div></div>
    </div>
    ${pubPipeline.map(p => `
      <div class="result-card">
        <div class="result-card-header">
          <span class="result-badge ${statusColors[p.status] || 'badge-accent'}">${p.status}</span>
          <span class="result-badge badge-accent">${p.type}</span>
        </div>
        <div class="result-title" style="margin-bottom:4px">${p.title}</div>
        <div class="result-body">
          <p><strong>${p.product}</strong> &nbsp;|&nbsp; ${p.authors}</p>
          <p style="margin-top:4px"><strong>Target:</strong> ${p.journal} — ${p.target}</p>
        </div>
        <div class="result-meta">
          <div class="result-meta-item"><i class="ti ti-git-branch"></i>Stage: ${p.stage}</div>
          <div class="result-meta-item"><i class="ti ti-hash"></i>${p.id}</div>
        </div>
      </div>`).join('')}`;
}
renderPublications();

// ══════════════════════════════════════════════
// 6. ADVISORY BOARD MANAGER
// ══════════════════════════════════════════════
const abKOLs = {
  'Atopic Dermatitis': [
    { name: 'Dr. Emma Simpson', institution: 'Oregon Health & Science University', expertise: 'Clinical trials, biologics', tier: 'Tier 1' },
    { name: 'Dr. Andrew Blauvelt', institution: 'Oregon Medical Research Center', expertise: 'Immunology, clinical dermatology', tier: 'Tier 1' },
    { name: 'Dr. Diamant Thaçi', institution: 'University of Lübeck', expertise: 'AD severity, biomarkers', tier: 'Tier 1' },
    { name: 'Dr. Marjolein de Bruin-Weller', institution: 'UMC Utrecht', expertise: 'Real-world evidence, patient outcomes', tier: 'Tier 2' },
  ],
  'Asthma': [
    { name: 'Dr. Klaus Rabe', institution: 'LungenClinic Grosshansdorf', expertise: 'Severe asthma, T2 biology', tier: 'Tier 1' },
    { name: 'Dr. Mario Castro', institution: 'University of Kansas', expertise: 'Biomarkers, phenotyping', tier: 'Tier 1' },
    { name: 'Dr. Ian Pavord', institution: 'University of Oxford', expertise: 'Eosinophilic inflammation', tier: 'Tier 2' },
  ],
  'Rheumatoid Arthritis': [
    { name: 'Dr. Gerd Burmester', institution: 'Charité Berlin', expertise: 'Biologic DMARDs, IL-6 pathway', tier: 'Tier 1' },
    { name: 'Dr. Mark Genovese', institution: 'Stanford University', expertise: 'JAK inhibitors, combination therapy', tier: 'Tier 1' },
    { name: 'Dr. Ronald van Vollenhoven', institution: 'Amsterdam UMC', expertise: 'Treatment strategies, remission', tier: 'Tier 2' },
  ],
  'Immunology (Cross-TA)': [
    { name: 'Dr. George Yancopoulos', institution: 'Regeneron', expertise: 'IL-4/IL-13 biology, drug development', tier: 'Tier 1' },
    { name: 'Dr. Nami Shrestha Palikhe', institution: 'McMaster University', expertise: 'Immunopathology, T2 cytokines', tier: 'Tier 2' },
  ],
};

$('#ab-submit').addEventListener('click', () => {
  const ta = $('#ab-ta').value;
  const objective = $('#ab-objective').value;
  const formats = getSelectedChips('ab-format');
  const container = $('#ab-results');
  const btn = $('#ab-submit');
  if (!ta || !objective) { container.innerHTML = '<div class="result-empty" style="color:var(--danger)"><i class="ti ti-alert-circle"></i>Please select a therapeutic area and objective.</div>'; return; }

  if (window.mvBtnLoading) mvBtnLoading(btn, 'Planning…');
  container.innerHTML = '<div class="result-empty"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Generating advisory board plan…</div>';

  setTimeout(() => {
    const kols = abKOLs[ta] || [];
    const format = formats[0] || 'Virtual';
    container.innerHTML = `
      <div class="result-card" style="border-left:3px solid var(--accent);">
        <div class="result-card-header"><div class="result-title">Advisory Board Plan: ${ta}</div></div>
        <div class="result-body">
          <p><strong>Objective:</strong> ${objective}</p>
          <p><strong>Format:</strong> ${format} &nbsp;|&nbsp; <strong>Duration:</strong> ${format === 'In-Person' ? '1 day' : '3 hours'}</p>
          <p><strong>Recommended Size:</strong> 8-12 advisors</p>
        </div>
      </div>
      <div class="form-card">
        <h4><i class="ti ti-users"></i> Recommended KOLs (${ta})</h4>
        ${kols.map(k => `
          <div class="checklist-item checklist-info" style="margin-bottom:4px">
            <div class="checklist-icon"><i class="ti ti-user"></i></div>
            <div class="checklist-text">
              <span class="checklist-label">${k.name}</span> <span class="result-badge badge-accent" style="font-size:9px;margin-left:6px">${k.tier}</span>
              <div style="font-size:11px;color:var(--text-muted)">${k.institution} — ${k.expertise}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="result-card">
        <h4 style="font-size:13px;font-weight:600;margin-bottom:10px"><i class="ti ti-list-check" style="color:var(--accent)"></i> Suggested Agenda</h4>
        <div class="timeline">
          <div class="timeline-item"><div class="timeline-dot completed"></div><div class="timeline-date">Session 1</div><div class="timeline-text">Welcome & Objectives</div><div class="timeline-detail">10 minutes — Sanofi Medical Lead</div></div>
          <div class="timeline-item"><div class="timeline-dot completed"></div><div class="timeline-date">Session 2</div><div class="timeline-text">Data Presentation: ${objective}</div><div class="timeline-detail">30 minutes — Data review and context setting</div></div>
          <div class="timeline-item"><div class="timeline-dot active"></div><div class="timeline-date">Session 3</div><div class="timeline-text">Moderated Discussion</div><div class="timeline-detail">60 minutes — Key questions and expert perspectives</div></div>
          <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-date">Session 4</div><div class="timeline-text">Insights Capture & Next Steps</div><div class="timeline-detail">20 minutes — Summary and action items</div></div>
        </div>
      </div>
      <div class="result-card" style="border-left:3px solid #dc2626;">
        <div class="result-body" style="font-size:12px">
          <strong style="color:#dc2626">Compliance Checklist</strong>
          <div class="checklist-item checklist-pass" style="margin-top:8px"><div class="checklist-icon"><i class="ti ti-check"></i></div><div class="checklist-text">FMV compensation within guidelines</div></div>
          <div class="checklist-item checklist-pass"><div class="checklist-icon"><i class="ti ti-check"></i></div><div class="checklist-text">Legitimate business need documented</div></div>
          <div class="checklist-item checklist-warn"><div class="checklist-icon"><i class="ti ti-alert-triangle"></i></div><div class="checklist-text">HCP contracts must be executed 14 days before event</div></div>
          <div class="checklist-item checklist-pass"><div class="checklist-icon"><i class="ti ti-check"></i></div><div class="checklist-text">No prescribing obligations implied</div></div>
          <div class="checklist-item checklist-pass"><div class="checklist-icon"><i class="ti ti-check"></i></div><div class="checklist-text">Venue selection meets modest standards</div></div>
        </div>
      </div>`;
    if (window.mvBtnSuccess) mvBtnSuccess(btn, 'Plan Ready', 2000);
    if (window.mvToast) mvToast(`Advisory board plan generated for ${ta}`, 'success');
    if (window.mvPulse) container.querySelectorAll('.result-card').forEach(c => mvPulse(c));
  }, 1500);
});

// ══════════════════════════════════════════════
// 7. MEDICAL EDUCATION
// ══════════════════════════════════════════════
const medEdPrograms = [
  { title: 'Type 2 Inflammation: Pathophysiology & Therapeutic Targets', type: 'Disease State', source: 'Medical Affairs', hours: 2.5, status: 'Active', audience: 'MSLs, Medical Advisors', enrollment: 185, completion: 94, ta: 'AD / Asthma / CRSwNP' },
  { title: 'Atopic Dermatitis: From Immune Dysregulation to Biologic Therapy', type: 'Disease State', source: 'Medical Affairs', hours: 3.0, status: 'Active', audience: 'Field Medical, MSLs', enrollment: 142, completion: 91, ta: 'Atopic Dermatitis' },
  { title: 'Dupixent Clinical Evidence Compendium — 2026 Update', type: 'Scientific Training', source: 'Medical Affairs', hours: 4.0, status: 'Active', audience: 'MSLs, Medical Advisors', enrollment: 210, completion: 88, ta: 'Multi-TA' },
  { title: 'Eosinophilic Esophagitis: Disease Landscape & Unmet Need', type: 'Disease State', source: 'Medical Affairs', hours: 1.5, status: 'Active', audience: 'Field Medical', enrollment: 98, completion: 85, ta: 'EoE' },
  { title: 'COPD with Type 2 Inflammation: Scientific Rationale & Pipeline', type: 'Scientific Training', source: 'Medical Affairs', hours: 2.0, status: 'In Development', audience: 'MSLs, Medical Directors', enrollment: 0, completion: 0, ta: 'COPD' },
  { title: 'Rheumatoid Arthritis: IL-6 Pathway & Clinical Data Deep Dive', type: 'Disease State', source: 'Medical Affairs', hours: 2.0, status: 'Active', audience: 'MSLs, Rheumatology Team', enrollment: 76, completion: 92, ta: 'RA' },
  { title: 'Hemophilia A: Factor VIII Biology & Treatment Evolution', type: 'Disease State', source: 'Medical Affairs', hours: 2.5, status: 'Planning', audience: 'Field Medical, MSLs', enrollment: 0, completion: 0, ta: 'Hemophilia' },
  { title: 'MSL Onboarding: Immunology Portfolio Scientific Deep Dive', type: 'Scientific Training', source: 'Medical Affairs', hours: 16.0, status: 'Active', audience: 'New MSLs', enrollment: 32, completion: 78, ta: 'Immunology' },
  { title: 'Understanding Atopic Dermatitis: A Guide for HCPs', type: 'HCP Education', source: 'Medical Affairs', hours: 1.5, status: 'Active', audience: 'HCPs, Dermatologists', enrollment: 320, completion: 87, ta: 'Atopic Dermatitis' },
  { title: 'Living with Eczema: Patient & Caregiver Education Series', type: 'Patient Education', source: 'Medical Affairs', hours: 1.0, status: 'Active', audience: 'Patients, Caregivers', enrollment: 540, completion: 72, ta: 'Atopic Dermatitis' },
  { title: 'Asthma Management: Biologic Therapy Overview for HCPs', type: 'HCP Education', source: 'Medical Affairs', hours: 2.0, status: 'Active', audience: 'HCPs, Pulmonologists', enrollment: 198, completion: 90, ta: 'Asthma' },
  { title: 'Caregiver Support: Navigating Pediatric Asthma Treatment', type: 'Patient Education', source: 'Medical Affairs', hours: 0.5, status: 'In Development', audience: 'Caregivers, Parents', enrollment: 0, completion: 0, ta: 'Asthma' },
];

function renderMedEd() {
  const container = $('#med-ed-content');
  const statusColors = { 'Active': 'badge-success', 'In Development': 'badge-warning', 'Planning': 'badge-accent', 'Archived': 'badge-info' };
  const typeColors = { 'Disease State': 'badge-info', 'Scientific Training': 'badge-pink', 'HCP Education': 'badge-accent', 'Patient Education': 'badge-success' };

  container.innerHTML = `
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-tile"><div class="stat-num">${medEdPrograms.length}</div><div class="stat-label">Programs</div></div>
      <div class="stat-tile"><div class="stat-num">${medEdPrograms.filter(p => p.status === 'Active').length}</div><div class="stat-label">Active</div></div>
      <div class="stat-tile"><div class="stat-num">${medEdPrograms.reduce((s,p) => s + p.enrollment, 0).toLocaleString()}</div><div class="stat-label">Enrollments</div></div>
      <div class="stat-tile"><div class="stat-num">${medEdPrograms.reduce((s,p) => s + p.hours, 0)}</div><div class="stat-label">Total Hours</div></div>
    </div>
    ${medEdPrograms.map(p => `
      <div class="result-card">
        <div class="result-card-header">
          <span class="result-badge ${statusColors[p.status]}">${p.status}</span>
          <span class="result-badge ${typeColors[p.type] || 'badge-accent'}">${p.type}</span>
        </div>
        <div class="result-title" style="margin-bottom:6px">${p.title}</div>
        <div class="result-body">
          <p><strong>TA:</strong> ${p.ta} &nbsp;|&nbsp; <strong>Audience:</strong> ${p.audience}</p>
          <p><strong>Duration:</strong> ${p.hours} hrs ${p.enrollment > 0 ? `&nbsp;|&nbsp; <strong>Enrolled:</strong> ${p.enrollment} &nbsp;|&nbsp; <strong>Completion:</strong> ${p.completion}%` : ''}</p>
        </div>
      </div>`).join('')}`;
}
renderMedEd();

// ══════════════════════════════════════════════
// 8. EVIDENCE SYNTHESIS
// ══════════════════════════════════════════════
const evidenceDB = {
  dupixent: {
    product: 'Dupixent (dupilumab)',
    indication: 'Atopic Dermatitis',
    summary: 'Extensive evidence base with 10+ RCTs, multiple real-world studies, and meta-analyses supporting efficacy and safety across age groups.',
    evidence: [
      { type: 'RCT', title: 'SOLO 1 & 2 — Monotherapy in moderate-to-severe AD', n: 1379, result: 'EASI-75: 38% vs 10% placebo (p<0.001)', year: 2016, grade: 'High' },
      { type: 'RCT', title: 'CHRONOS — With concomitant TCS', n: 740, result: 'EASI-75: 69% vs 23% (p<0.001) at wk16', year: 2017, grade: 'High' },
      { type: 'RCT', title: 'LIBERTY AD PEDS — Pediatric (6 mo–5 yr)', n: 162, result: 'IGA 0/1: 28% vs 4% (p<0.001)', year: 2022, grade: 'High' },
      { type: 'Meta', title: 'Cochrane Review: Biologics for AD', n: 'NA', result: 'Dupilumab had highest certainty of evidence among biologics', year: 2023, grade: 'High' },
      { type: 'RWE', title: 'RELIEVE-AD: Global real-world registry', n: 3500, result: 'EASI improvement 65% at 12 months; low discontinuation rate', year: 2024, grade: 'Moderate' },
      { type: 'SLR', title: 'Systematic review: Dupilumab long-term safety', n: 'NA', result: 'Consistent safety profile over 4+ years; no new signals identified', year: 2023, grade: 'High' },
    ],
    gaps: [
      'Limited head-to-head data vs JAK inhibitors in moderate AD',
      'No RCTs in combination with phototherapy',
      'Long-term safety beyond 5 years still accruing',
      'Health economic data needed for COPD indication',
    ]
  },
  kevzara: {
    product: 'Kevzara (sarilumab)',
    indication: 'Rheumatoid Arthritis',
    summary: 'Phase 3 program (MOBILITY, TARGET, MONARCH) established efficacy as monotherapy and in combination with MTX.',
    evidence: [
      { type: 'RCT', title: 'MOBILITY — MTX-IR patients', n: 1197, result: 'ACR20: 66% vs 33% placebo (p<0.001)', year: 2015, grade: 'High' },
      { type: 'RCT', title: 'MONARCH — vs adalimumab monotherapy', n: 369, result: 'DAS28-ESR: -3.28 vs -2.20 (p<0.0001)', year: 2017, grade: 'High' },
      { type: 'RWE', title: 'REAL — US claims database analysis', n: 2800, result: '65% persistence at 12 months', year: 2022, grade: 'Moderate' },
    ],
    gaps: [
      'Head-to-head vs JAK inhibitors',
      'Long-term radiographic progression data beyond 3 years',
      'Real-world comparative effectiveness studies needed',
    ]
  }
};

$('#ev-submit').addEventListener('click', () => {
  const query = $('#ev-query').value.trim().toLowerCase();
  const types = getSelectedChips('ev-type');
  const container = $('#ev-results');
  const btn = $('#ev-submit');
  if (!query) { container.innerHTML = '<div class="result-empty" style="color:var(--danger)"><i class="ti ti-alert-circle"></i>Please enter a product or indication.</div>'; return; }

  if (window.mvBtnLoading) mvBtnLoading(btn, 'Synthesizing…');
  container.innerHTML = '<div class="result-empty"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Synthesizing available evidence…</div>';

  setTimeout(() => {
    let match = null;
    if (/dupix|dupilumab|atopic|ad\b/i.test(query)) match = evidenceDB.dupixent;
    else if (/kevzara|sarilumab|rheumat|ra\b/i.test(query)) match = evidenceDB.kevzara;

    if (!match) {
      if (window.mvBtnReset) mvBtnReset(btn);
      container.innerHTML = '<div class="result-empty"><i class="ti ti-chart-dots-3"></i>No curated evidence summary available for this query. Try: Dupixent, atopic dermatitis, Kevzara, or rheumatoid arthritis.</div>';
      return;
    }

    let filtered = match.evidence;
    if (types.length) filtered = filtered.filter(e => types.includes(e.type));

    const gradeColors = { 'High': 'badge-success', 'Moderate': 'badge-warning', 'Low': 'badge-danger' };

    container.innerHTML = `
      <div class="result-card" style="border-left:3px solid var(--accent);">
        <div class="result-title" style="margin-bottom:6px">${match.product} — ${match.indication}</div>
        <div class="result-body"><p>${match.summary}</p></div>
      </div>
      ${filtered.map(e => `
        <div class="result-card">
          <div class="result-card-header">
            <span class="result-badge badge-info">${e.type}</span>
            <span class="result-badge ${gradeColors[e.grade]}">Grade: ${e.grade}</span>
          </div>
          <div class="result-title" style="font-size:13px;margin-bottom:4px">${e.title}</div>
          <div class="result-body">
            <p><strong>Result:</strong> ${e.result}</p>
            ${e.n !== 'NA' ? `<p><strong>N=</strong>${e.n.toLocaleString()}</p>` : ''}
          </div>
          <div class="result-meta"><div class="result-meta-item"><i class="ti ti-calendar"></i>${e.year}</div></div>
        </div>`).join('')}
      <div class="result-card" style="border-left:3px solid #b45309;">
        <div class="result-body" style="font-size:12px">
          <strong style="color:#b45309">Evidence Gaps</strong>
          <ul style="margin:8px 0 0 16px;line-height:1.7">
            ${match.gaps.map(g => `<li>${g}</li>`).join('')}
          </ul>
        </div>
      </div>`;
    if (window.mvBtnSuccess) mvBtnSuccess(btn, 'Synthesized', 2000);
    if (window.mvToast) mvToast(`Evidence synthesis: ${filtered.length} source${filtered.length > 1 ? 's' : ''} + ${match.gaps.length} gaps identified`, 'success');
    if (window.mvPulse) container.querySelectorAll('.result-card').forEach(c => mvPulse(c));
  }, 1300);
});

// ══════════════════════════════════════════════
// 9. MEDICAL STRATEGY
// ══════════════════════════════════════════════
const strategyData = [
  { ta: 'Atopic Dermatitis', product: 'Dupixent', objective: 'Maintain market leadership in moderate-to-severe AD', kpi: 'TRx Share: 42%', trend: '+2.3% QoQ', priority: 'High', insight: 'JAK inhibitor launches creating competitive pressure; differentiate on long-term safety data' },
  { ta: 'Asthma', product: 'Dupixent', objective: 'Expand severe asthma T2 share vs Nucala/Fasenra', kpi: 'New-to-Brand: 58% of eligible', trend: '+4.1% QoQ', priority: 'High', insight: 'Eosinophilic data superiority messaging resonating; need more RWE' },
  { ta: 'COPD', product: 'Dupixent', objective: 'Prepare for potential COPD launch', kpi: 'Pre-launch KOL engagement: 78%', trend: 'On track', priority: 'Critical', insight: 'Regulatory decision expected Q1 2025; MSL readiness programs underway' },
  { ta: 'Rheumatoid Arthritis', product: 'Kevzara', objective: 'Grow monotherapy positioning vs anti-TNF', kpi: 'Monotherapy Share: 18%', trend: '+0.8% QoQ', priority: 'Medium', insight: 'MONARCH data differentiator; focus on adalimumab biosimilar conversion opportunity' },
  { ta: 'Cardiovascular', product: 'Praluent', objective: 'Differentiate on CV outcomes data', kpi: 'ASCVD market share: 12%', trend: '-0.5% QoQ', priority: 'Medium', insight: 'Inclisiran competition growing; emphasize ODYSSEY OUTCOMES mortality data' },
  { ta: 'Hemophilia A', product: 'Altuviiio', objective: 'Establish once-weekly prophylaxis standard of care', kpi: 'Switches from BIV: 120', trend: '+15/month', priority: 'High', insight: 'Convenience messaging resonating; need more payer coverage wins' },
];

function renderStrategy() {
  const container = $('#strategy-content');
  const priorityColors = { 'Critical': 'badge-danger', 'High': 'badge-warning', 'Medium': 'badge-info', 'Low': 'badge-success' };
  container.innerHTML = `
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-tile"><div class="stat-num">${strategyData.length}</div><div class="stat-label">Strategic Pillars</div></div>
      <div class="stat-tile"><div class="stat-num">${strategyData.filter(s => s.priority === 'Critical' || s.priority === 'High').length}</div><div class="stat-label">High Priority</div></div>
      <div class="stat-tile"><div class="stat-num">${new Set(strategyData.map(s => s.product)).size}</div><div class="stat-label">Products</div></div>
      <div class="stat-tile"><div class="stat-num">${new Set(strategyData.map(s => s.ta)).size}</div><div class="stat-label">TAs</div></div>
    </div>
    ${strategyData.map(s => `
      <div class="result-card">
        <div class="result-card-header">
          <span class="result-badge ${priorityColors[s.priority]}">${s.priority} Priority</span>
          <span class="result-badge badge-accent">${s.ta}</span>
        </div>
        <div class="result-title" style="margin-bottom:6px">${s.product} — ${s.objective}</div>
        <div class="result-body">
          <p><strong>KPI:</strong> ${s.kpi} &nbsp;|&nbsp; <strong>Trend:</strong> ${s.trend}</p>
          <p style="margin-top:6px"><strong>Strategic Insight:</strong> ${s.insight}</p>
        </div>
      </div>`).join('')}`;
}
renderStrategy();

// ══════════════════════════════════════════════
// 9b. POPULATION INTELLIGENCE
// ══════════════════════════════════════════════
// Aggregate deidentified RWD overlaid on scientific engagement. Education gaps
// route to Medical Education; evidence gaps route to Publication Planner.
function renderPopulation() {
  const container = $('#population-content');
  if (!container) return;
  const s = getNationalSummary();
  const regions = getAllRegionRollups().sort((a, b) => b.needIndex - a.needIndex);
  const priorities = getEducationPriorities(5);
  const events = getEventGeographyAnalysis();
  const maxPer10k = Math.max(...events.map(e => e.eventsPer10k));

  const regionRows = regions.map(r => {
    const q = QUADRANTS[r.quadrant];
    return `<tr>
      <td><strong>${escapeHtmlDemo(r.region)}</strong><div style="font-size:10.5px;color:var(--text-muted);">${r.stateCount} states</div></td>
      <td>${r.cohort.toLocaleString()}</td>
      <td><strong>${r.needIndex}</strong></td>
      <td>${r.engagementIndex}</td>
      <td>${r.dermPer100k}</td>
      <td><span class="badge" style="background:${q.color}22;color:${q.color};">${escapeHtmlDemo(q.label)}</span></td>
    </tr>`;
  }).join('');

  const priorityRows = priorities.map(p => `<tr>
      <td><strong>${escapeHtmlDemo(p.region)}</strong></td>
      <td>${escapeHtmlDemo(p.gap.shortName)}${p.gap.safetyRelevant
        ? ' <span style="font-size:9.5px;font-weight:700;padding:2px 5px;border-radius:4px;background:var(--danger-bg);color:var(--danger);">SAFETY</span>' : ''}</td>
      <td>${p.rate}${p.gap.unit === 'mo' ? ' mo' : '%'}</td>
      <td style="color:var(--danger);font-weight:700;">+${p.delta}${p.gap.unit === 'mo' ? 'mo' : 'pp'}</td>
      <td style="font-size:11.5px;">${escapeHtmlDemo(p.gap.educationNeed)}</td>
    </tr>`).join('');

  const eventRows = events.map(e => {
    const under = e.eventsPer10k < maxPer10k / 3;
    return `<tr>
      <td><strong>${escapeHtmlDemo(e.region)}</strong></td>
      <td>${e.needIndex}</td>
      <td>${e.advisoryBoards}</td>
      <td>${e.symposia}</td>
      <td>${e.congressSessions}</td>
      <td style="font-weight:700;color:${under ? 'var(--danger)' : 'var(--text)'};">${e.eventsPer10k}</td>
      <td>${under ? '<span class="badge badge-danger">Under-sited</span>' : ''}</td>
    </tr>`;
  }).join('');

  container.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px;background:var(--surface);border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:10px;padding:13px 16px;margin-bottom:20px;">
      <i class="ti ti-shield-lock" style="font-size:19px;color:var(--accent-text);"></i>
      <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.55;">
        <strong style="color:var(--text);">Commercial Firewall active — aggregation floor: state.</strong>
        Source is licensed deidentified real-world evidence. Patient Services holds the patient-to-HCP linkage and those
        counts do not cross into Medical. Cells below n=11 are suppressed.
      </div>
    </div>

    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-tile"><div class="stat-num">${s.totalCohort.toLocaleString()}</div><div class="stat-label">Deidentified Cohort</div></div>
      <div class="stat-tile"><div class="stat-num">${s.quadrantCounts['education-gap']}</div><div class="stat-label">Education Gaps</div></div>
      <div class="stat-tile"><div class="stat-num">${s.quadrantCounts['evidence-gap']}</div><div class="stat-label">Evidence Gaps</div></div>
      <div class="stat-tile"><div class="stat-num">${s.cohortInGapPct}%</div><div class="stat-label">Cohort In Gap</div></div>
    </div>

    <div class="result-card">
      <h4><i class="ti ti-map-2"></i> Regional burden vs. engagement</h4>
      <table class="data-table"><thead><tr>
        <th>Region</th><th>Cohort</th><th>Need</th><th>Engagement</th><th>Derm/100k</th><th>Classification</th>
      </tr></thead><tbody>${regionRows}</tbody></table>
    </div>

    <div class="result-card">
      <h4><i class="ti ti-school"></i> Education priorities</h4>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">Ranked by gap size weighted by how scientifically underserved the region is. Safety-relevant gaps weighted higher. Routes to Medical Education and Scientific Communications.</p>
      <table class="data-table"><thead><tr>
        <th>Region</th><th>Gap</th><th>Rate</th><th>vs Nat'l</th><th>Education need</th>
      </tr></thead><tbody>${priorityRows}</tbody></table>
    </div>

    <div class="result-card">
      <h4><i class="ti ti-map-pin"></i> Event geography — 18-month footprint</h4>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">Events normalised per 10,000 cohort. Exposes where siting follows existing engagement rather than unmet need.</p>
      <table class="data-table"><thead><tr>
        <th>Region</th><th>Need</th><th>Adv. boards</th><th>Symposia</th><th>Congress</th><th>Per 10k</th><th></th>
      </tr></thead><tbody>${eventRows}</tbody></table>
    </div>

    <div class="result-card" style="border-left:3px solid var(--accent);">
      <h4><i class="ti ti-arrow-ramp-right"></i> Recommended routing</h4>
      <div style="font-size:12.5px;line-height:1.75;color:var(--text-secondary);">
        <strong style="color:var(--text);">Education gaps</strong> (${s.quadrantCounts['education-gap']} geographies) — high need, low engagement.
        Deploy content and regional symposia; brief field medical at territory level.<br>
        <strong style="color:var(--text);">Evidence gaps</strong> (${s.quadrantCounts['evidence-gap']} geographies) — high need <em>and</em> high engagement.
        Clinicians are seeking answers the current evidence base does not provide. Route to Publication Planner and RWE study design.<br>
        <strong style="color:var(--text);">Event siting</strong> — reallocate advisory board and symposium capacity toward under-sited regions.
      </div>
    </div>
  `;

  const top = priorities[0];
  if (top) {
    const r = regions.find(x => x.region === top.region);
    broadcastPopulationSignal({
      geoId: `US-REGION-${top.region.toUpperCase().replace(/[^A-Z]/g, '')}`,
      geoName: top.region,
      aggregationLevel: 'region',
      cohortSize: r ? r.cohort : null,
      gapId: top.gap.id,
      gapName: top.gap.name,
      gapRate: top.rate,
      nationalRate: top.national,
      nationalDelta: top.delta,
      needIndex: r ? r.needIndex : null,
      engagementIndex: r ? r.engagementIndex : null,
      quadrant: top.quadrant,
      medicalAction: `EDUCATION GAP: ${top.region} — ${top.gap.shortName} at ${top.rate}${top.gap.unit === 'mo' ? 'mo' : '%'} vs ${top.national}${top.gap.unit === 'mo' ? 'mo' : '%'} national. Priority education need: ${top.gap.educationNeed}.`,
      educationNeed: top.gap.educationNeed,
      _source: 'Medical Concierge',
    });
  }
}
renderPopulation();

// ══════════════════════════════════════════════
// 10. LITERATURE INTELLIGENCE
// ══════════════════════════════════════════════
const litDB = [
  { title: 'Dupilumab in Adults with Moderate-to-Severe Atopic Dermatitis', authors: 'Simpson EL, Bieber T, Guttman-Yassky E, et al.', journal: 'N Engl J Med', year: 2016, type: 'Clinical Trial', pmid: '27690741', impact: 'Landmark SOLO 1 & 2 trials establishing dupilumab efficacy' },
  { title: 'Long-term management of moderate-to-severe atopic dermatitis with dupilumab (LIBERTY AD CHRONOS)', authors: 'Blauvelt A, de Bruin-Weller M, Gooderham M, et al.', journal: 'Lancet', year: 2017, type: 'Clinical Trial', pmid: '28478972', impact: 'Pivotal long-term combination therapy data' },
  { title: 'Dupilumab Efficacy and Safety in Moderate-to-Severe Uncontrolled Asthma (LIBERTY ASTHMA QUEST)', authors: 'Castro M, Corren J, Pavord ID, et al.', journal: 'N Engl J Med', year: 2018, type: 'Clinical Trial', pmid: '29782217', impact: 'Phase 3 asthma indication data' },
  { title: 'Sarilumab Plus Methotrexate in Patients With Active RA (MOBILITY)', authors: 'Genovese MC, Fleischmann R, Kivitz AJ, et al.', journal: 'Arthritis Rheumatol', year: 2015, type: 'Clinical Trial', pmid: '25604080', impact: 'Pivotal RA trial for Kevzara' },
  { title: 'Alirocumab and Cardiovascular Outcomes After Acute Coronary Syndrome (ODYSSEY OUTCOMES)', authors: 'Schwartz GG, Steg PG, Szarek M, et al.', journal: 'N Engl J Med', year: 2018, type: 'Clinical Trial', pmid: '30403574', impact: 'CV outcomes reduction with Praluent' },
  { title: 'Biologics for Atopic Dermatitis: A Cochrane Systematic Review', authors: 'Drucker AM, Ellis AG, Bohdanowicz M, et al.', journal: 'Cochrane Database Syst Rev', year: 2023, type: 'Meta-Analysis', pmid: '37041745', impact: 'Comprehensive review of biologic therapies for AD' },
  { title: 'European Guidelines for Atopic Eczema Treatment', authors: 'Wollenberg A, Kinberger M, Arents B, et al.', journal: 'J Eur Acad Dermatol Venereol', year: 2022, type: 'Guideline', pmid: '36056736', impact: 'Updated European treatment algorithms including dupilumab' },
  { title: 'Real-World Effectiveness of Dupilumab in Atopic Dermatitis (RELIEVE-AD)', authors: 'Augustin M, Silverberg JI, Guttman-Yassky E, et al.', journal: 'JAMA Dermatol', year: 2024, type: 'Clinical Trial', pmid: '38190120', impact: 'Large-scale real-world evidence confirming trial findings' },
];

$('#lit-submit').addEventListener('click', () => {
  const query = $('#lit-query').value.trim().toLowerCase();
  const types = getSelectedChips('lit-type');
  const container = $('#lit-results');
  const btn = $('#lit-submit');
  if (!query) { container.innerHTML = '<div class="result-empty" style="color:var(--danger)"><i class="ti ti-alert-circle"></i>Please enter a search query.</div>'; return; }

  if (window.mvBtnLoading) mvBtnLoading(btn, 'Searching…');
  container.innerHTML = '<div class="result-empty"><i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Searching literature database…</div>';

  setTimeout(() => {
    let results = litDB.filter(r => {
      const text = `${r.title} ${r.authors} ${r.journal} ${r.impact}`.toLowerCase();
      return query.split(/\s+/).some(w => text.includes(w));
    });
    if (types.length) results = results.filter(r => types.includes(r.type));

    if (!results.length) {
      if (window.mvBtnReset) mvBtnReset(btn);
      container.innerHTML = '<div class="result-empty"><i class="ti ti-book-2"></i>No matching publications found. Try broader search terms.</div>';
      return;
    }

    const typeColors = { 'Clinical Trial': 'badge-info', 'Review': 'badge-accent', 'Meta-Analysis': 'badge-warning', 'Guideline': 'badge-success' };
    container.innerHTML = `
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">${results.length} result${results.length > 1 ? 's' : ''} found</div>
      ${results.map(r => `
        <div class="result-card">
          <div class="result-card-header">
            <span class="result-badge ${typeColors[r.type] || 'badge-accent'}">${r.type}</span>
          </div>
          <div class="result-title" style="font-size:13px;margin-bottom:4px">${r.title}</div>
          <div class="result-body">
            <p>${r.authors}</p>
            <p style="margin-top:4px"><em>${r.journal}</em> (${r.year})</p>
            <p style="margin-top:4px"><strong>Impact:</strong> ${r.impact}</p>
          </div>
          <div class="result-meta">
            <div class="result-meta-item"><i class="ti ti-hash"></i>PMID: ${r.pmid}</div>
          </div>
        </div>`).join('')}`;
    if (window.mvBtnSuccess) mvBtnSuccess(btn, 'Found', 2000);
    if (window.mvToast) mvToast(`${results.length} publication${results.length > 1 ? 's' : ''} found`, 'info');
    if (window.mvPulse) container.querySelectorAll('.result-card').forEach(c => mvPulse(c));
  }, 1000);
});

// ============================================================
// 8. CONGRESS INTELLIGENCE
// ============================================================
function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

const congressDB = {
  'AAD 2026': {
    fullName: 'AAD 2026 Annual Meeting', location: 'San Francisco, CA', dates: 'Mar 20–24, 2026', status: 'Completed',
    highlights: ['Dupilumab 4-year AD safety data presented', 'New PN real-world evidence poster', 'Type 2 inflammation symposium well-attended'],
    presentations: [
      { title: 'LIBERTY AD CHRONOS: 4-Year Safety & Efficacy of Dupilumab', type: 'Oral', session: 'Late-Breaking Session', impact: 'High', sanofi: true },
      { title: 'Real-World Dupilumab in Pediatric AD: Registry Update', type: 'Poster', session: 'E-Poster Hall', impact: 'Medium', sanofi: true },
      { title: 'Dupilumab in Prurigo Nodularis: PRIME 2 Results', type: 'Poster', session: 'Clinical Trials Posters', impact: 'High', sanofi: true },
      { title: 'JAK Inhibitors Long-Term Safety Meta-Analysis', type: 'Oral', session: 'Safety Session', impact: 'High', sanofi: false },
    ],
    competitors: ['Pfizer: Abrocitinib 52-week data', 'AbbVie: Upadacitinib vs dupilumab head-to-head subgroup', 'LEO Pharma: Tralokinumab combination data']
  },
  'EADV 2026': {
    fullName: 'EADV 2026 Congress', location: 'Vienna, Austria', dates: 'Sep 23–27, 2026', status: 'Upcoming',
    highlights: ['Expected: Dupilumab chronic hand eczema late-breaker', 'Sanofi satellite symposium confirmed', 'Key guideline update session on biologics'],
    presentations: [
      { title: 'Dupilumab in Chronic Hand Eczema: Phase 3 Results', type: 'Late-Breaker', session: 'Late-Breaking Session 2', impact: 'High', sanofi: true },
      { title: 'LIBERTY AD HIVE: 3-Year Real-World Outcomes', type: 'Oral', session: 'Real-World Evidence Session', impact: 'Medium', sanofi: true },
    ],
    competitors: ['AbbVie: Risankizumab in AD phase 2 update', 'Galderma: Nemolizumab pivotal results']
  },
  'ATS 2026': {
    fullName: 'ATS 2026 International Conference', location: 'San Diego, CA', dates: 'May 15–20, 2026', status: 'Completed',
    highlights: ['BOREAS COPD subgroup analysis featured', 'Type 2 biomarker-guided therapy debate', 'Sanofi respiratory pipeline highlighted'],
    presentations: [
      { title: 'BOREAS: Dupilumab in Uncontrolled COPD — Biomarker Subgroups', type: 'Oral', session: 'COPD Symposium', impact: 'High', sanofi: true },
      { title: 'Dupilumab in Severe Asthma: 3-Year Persistence Data', type: 'Poster', session: 'Asthma Posters', impact: 'Medium', sanofi: true },
    ],
    competitors: ['AstraZeneca: Tezepelumab COPD data', 'GSK: Depemokimab severe asthma results']
  },
  'ACR 2026': {
    fullName: 'ACR Convergence 2026', location: 'Washington, DC', dates: 'Nov 14–18, 2026', status: 'Upcoming',
    highlights: ['MONARCH 3-year extension expected', 'IL-6 monotherapy positioning data', 'Biosimilar landscape shifting'],
    presentations: [
      { title: 'MONARCH Long-Term Extension: Sarilumab Monotherapy at 3 Years', type: 'Oral', session: 'RA Treatment Session', impact: 'High', sanofi: true },
      { title: 'Sarilumab Impact on Patient-Reported Fatigue: MONARCH PRO', type: 'Poster', session: 'PROs in Rheumatology', impact: 'Medium', sanofi: true },
    ],
    competitors: ['AbbVie: Adalimumab biosimilar switching data', 'Lilly: Baricitinib long-term RA registry']
  },
  'AAAAI 2026': {
    fullName: 'AAAAI 2026 Annual Meeting', location: 'Phoenix, AZ', dates: 'Feb 28–Mar 3, 2026', status: 'Completed',
    highlights: ['Type 2 inflammation cross-disease symposium', 'Dupilumab allergy prevention data discussed', 'New EoE treatment algorithms'],
    presentations: [
      { title: 'Dupilumab in EoE: Histologic and Symptomatic Outcomes', type: 'Oral', session: 'GI Allergy Session', impact: 'High', sanofi: true },
      { title: 'CSU Phase 2 Dupilumab Results', type: 'Poster', session: 'Urticaria Posters', impact: 'Medium', sanofi: true },
    ],
    competitors: ['Regeneron: Next-gen IL-4R update', 'Novartis: Omalizumab CSU real-world data']
  },
  'DDW 2026': {
    fullName: 'DDW 2026 — Digestive Disease Week', location: 'Washington, DC', dates: 'May 30–Jun 2, 2026', status: 'Upcoming',
    highlights: ['Expected: EoE long-term dupilumab maintenance data', 'GI biologics landscape session', 'Eosinophilic GI disease emerging focus'],
    presentations: [
      { title: 'Dupilumab EoE Maintenance: 48-Week Extension Data', type: 'Oral', session: 'EoE Clinical Trials', impact: 'High', sanofi: true },
    ],
    competitors: ['AstraZeneca: Benralizumab in EoE pilot', 'Takeda: Eosinophilic GI pipeline']
  }
};

document.getElementById("cg-submit").addEventListener("click", () => {
  const congressVal = document.getElementById("cg-congress").value;
  const container = document.getElementById("cg-results");
  const btn = document.getElementById("cg-submit");
  if (!congressVal) { container.innerHTML = '<div class="result-empty" style="color:var(--danger)"><i class="ti ti-alert-circle"></i>Please select a congress.</div>'; return; }

  if (window.mvBtnLoading) mvBtnLoading(btn, 'Loading…');
  container.innerHTML = '<div style="text-align:center;padding:30px;"><i class="ti ti-loader-2" style="font-size:24px;animation:spin 1s linear infinite;color:#dc2626;"></i><div style="margin-top:8px;font-size:12px;color:var(--text-muted);">Loading congress coverage…</div></div>';

  setTimeout(() => {
    const key = congressVal.split(' — ')[0];
    const data = congressDB[key];
    if (!data) {
      if (window.mvBtnReset) mvBtnReset(btn);
      container.innerHTML = '<div class="result-empty"><i class="ti ti-calendar-event"></i>Coverage data for this congress is not yet available.</div>';
      return;
    }

    const impactColors = { High: 'badge-danger', Medium: 'badge-warning', Low: 'badge-success' };
    const statusBadge = data.status === 'Upcoming' ? '<span class="result-badge badge-warning">Upcoming</span>' : '<span class="result-badge badge-success">Completed</span>';
    const congressSlug = key.toLowerCase().replace(/\s+/g, '-');

    container.innerHTML = `
      <div class="result-card" style="border-left:3px solid #dc2626;">
        <div class="result-card-header"><div class="result-title">${escapeHtml(data.fullName)}</div>${statusBadge}</div>
        <div class="result-body">
          <p><strong>Location:</strong> ${escapeHtml(data.location)} &nbsp;|&nbsp; <strong>Dates:</strong> ${escapeHtml(data.dates)}</p>
          <a href="/congress.html#congress=${congressSlug}" style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:12px;font-weight:600;color:#dc2626;text-decoration:none;" target="_blank"><i class="ti ti-external-link" style="font-size:14px;"></i> View Full Congress Coverage</a>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Key Highlights</div><span class="result-badge badge-info">${data.highlights.length} Items</span></div>
        <div class="result-body"><ul style="margin:0;padding-left:18px;line-height:1.8;">${data.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><div class="result-title">Presentations</div><span class="result-badge badge-accent">${data.presentations.length} Total</span></div>
        <div class="result-body">${data.presentations.map(p => `
          <div style="padding:10px 0;border-bottom:1px solid var(--border);">
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
              <span class="result-badge ${impactColors[p.impact]}" style="font-size:9px;">${p.impact}</span>
              <span class="result-badge badge-info" style="font-size:9px;">${escapeHtml(p.type)}</span>
              ${p.sanofi ? '<span class="result-badge badge-accent" style="font-size:9px;">Sanofi</span>' : ''}
            </div>
            <div style="font-weight:600;font-size:13px;">${escapeHtml(p.title)}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;"><i class="ti ti-clock" style="font-size:12px;"></i> ${escapeHtml(p.session)}</div>
            <a href="/congress.html#congress=${congressSlug}" style="display:inline-flex;align-items:center;gap:3px;margin-top:4px;font-size:11px;font-weight:500;color:var(--accent);text-decoration:none;" target="_blank"><i class="ti ti-file-description" style="font-size:12px;"></i> View Poster Overview</a>
          </div>`).join('')}</div>
      </div>
      <div class="result-card" style="border-left:3px solid #b45309;">
        <div class="result-card-header"><div class="result-title" style="color:#b45309;">Competitor Intelligence</div><span class="result-badge badge-warning">${data.competitors.length} Items</span></div>
        <div class="result-body"><ul style="margin:0;padding-left:18px;line-height:1.8;">${data.competitors.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul></div>
      </div>`;
    if (window.mvBtnSuccess) mvBtnSuccess(btn, 'Loaded', 2000);
    if (window.mvToast) mvToast(`${data.fullName} coverage loaded — ${data.presentations.length} presentations`, 'success');
    if (window.mvPulse) container.querySelectorAll('.result-card').forEach(c => mvPulse(c));
    broadcastSignal({ topic: `Congress Coverage — ${data.fullName}`, intent: "Congress intelligence", diseaseArea: "Multi-indication", depth: "Deep engagement", orionAction: `PRIORITY: Congress data accessed — ${data.presentations.length} presentations reviewed via Medical Concierge`, queries: [`${data.fullName} presentations and highlights`], contentAccessed: data.presentations.map(p => p.title), _source: "Medical Concierge" });
  }, 1200);
});

// ============================================================
// DEMO
// ============================================================
const demoBtn = document.getElementById("run-demo");
let demoRunning = false;

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function escapeHtmlDemo(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

async function narrate(text) {
  const el = document.getElementById("demo-narrator");
  if (!el) return;
  el.innerHTML = `<i class="ti ti-sparkles"></i> ${escapeHtmlDemo(text)}`;
  if (isCCEnabled()) el.classList.add("visible");
  showControls();
  await speakAndWait(text);
}
function narrateOff() {
  const el = document.getElementById("demo-narrator");
  if (el) el.classList.remove("visible");
  stopSpeaking(); hideControls();
}

// ── Agent roster ──
const MEDICAL_AGENTS = [
  { id: "voice-search",  name: "Voice Search",              icon: "microphone" },
  { id: "med-strategy",  name: "Medical Strategy",          icon: "chart-pie" },
  { id: "population",    name: "Population Intelligence",   icon: "map-2" },
  { id: "regulatory",    name: "Regulatory Intelligence",   icon: "gavel" },
  { id: "literature",    name: "Literature Intelligence",   icon: "book-2" },
  { id: "evidence",      name: "Evidence Synthesis",        icon: "chart-dots-3" },
  { id: "med-info",      name: "Medical Information",       icon: "file-description" },
  { id: "pharma-vig",    name: "Pharmacovigilance",         icon: "shield-check" },
  { id: "sci-comms",     name: "Scientific Communications", icon: "writing" },
  { id: "pub-planner",   name: "Publication Planner",       icon: "notebook" },
  { id: "advisory",      name: "Advisory Board",            icon: "users-group" },
  { id: "med-ed",        name: "Medical Education",         icon: "school" },
  { id: "congress",      name: "Congress Intelligence",     icon: "calendar-event" },
  { id: "assistant",     name: "Medical Affairs Assistant", icon: "message-circle" },
  { id: "trial-match",   name: "Trial Matching Agent",      icon: "flask" },
];

// ── Per-agent demo logic ──
const set = (sel, v) => { const el = $(sel); if (el) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } };
const type = (sel, v) => { const el = $(sel); if (el) { el.value = v; el.dispatchEvent(new Event("input", {bubbles:true})); } };
const click = (sel) => { const el = $(sel); if (el) el.click(); };

async function runAgentDemo(index, agent) {
  switch (agent.id) {
    case "voice-search": {
      await narrate("Let's start with voice search — tap the microphone and speak your query, completely hands-free");
      showHub();
      await delay(600);
      const vsMic = searchInput?.parentElement?.querySelector('.mv-voice-btn');
      if (vsMic) { vsMic.classList.add('listening'); vsMic.innerHTML = '<i class="ti ti-loader-2 mv-spin"></i>'; }
      await delay(1200);
      if (searchInput) { searchInput.value = ''; for (const ch of "Dupixent COPD regulatory update") { searchInput.value += ch; searchInput.dispatchEvent(new Event('input', { bubbles: true })); await delay(30); } }
      await delay(400);
      if (vsMic) { vsMic.classList.remove('listening'); vsMic.innerHTML = '<i class="ti ti-microphone"></i>'; }
      await delay(300);
      routeSearch("Dupixent COPD regulatory update");
      await delay(1800);
      await narrate("Voice recognized and query routed — hands-free search across all medical affairs agents");
      await delay(1500);
      break;
    }
    case "med-strategy":
      await narrate("Morning starts with the Medical Strategy dashboard — brand plans, KPIs, and competitive positioning");
      showPanel('med-strategy');
      await delay(2000);
      await narrate("Six therapeutic areas tracked — Dupixent AD leading at 42 percent share, COPD launch prep is critical priority");
      await delay(2000);
      break;

    case "population":
      await narrate("Population Intelligence brings deidentified real-world evidence into the medical plan");
      showPanel('population');
      await delay(2000);
      await narrate("Nine hundred eleven thousand patients in the deidentified cohort. The Southeast carries a need index of seventy-one against an engagement index of forty-one — our largest education gap");
      await delay(2400);
      await narrate("Notice the firewall banner. Patient Services holds the patient-to-HCP linkage and those counts do not cross into Medical. What we get instead is the reason the gap exists");
      await delay(2400);
      await narrate("The event geography is the actionable finding — the highest-need region in the country has hosted zero advisory boards in eighteen months");
      await delay(2200);
      break;

    case "regulatory":
      await narrate("Regulatory Intelligence — real-time tracking of approvals, submissions, and competitor filings");
      showPanel('regulatory');
      await delay(2000);
      await narrate("Dupixent COPD supplemental NDA under review, target PDUFA date January 2027. Two competitor approvals flagged");
      await delay(2000);
      break;

    case "literature":
      await narrate("Time to check the latest publications — Literature Intelligence searches PubMed and medical databases");
      showPanel('literature');
      await delay(600);
      type('#lit-query', 'dupilumab atopic dermatitis long-term');
      await delay(400);
      click('#lit-submit');
      await delay(1800);
      await narrate("Multiple high-impact results — CHRONOS four-year data and real-world registry updates");
      await delay(1800);
      break;

    case "evidence":
      await narrate("Now let's synthesize the evidence — pulling together clinical trials, meta-analyses, and real-world data");
      showPanel('evidence');
      await delay(600);
      type('#ev-query', 'Dupixent atopic dermatitis');
      await delay(400);
      click('#ev-submit');
      await delay(2000);
      await narrate("Four evidence sources graded by quality, plus identified gaps — head-to-head data and long-term radiographic data still needed");
      await delay(1800);
      break;

    case "med-info":
      await narrate("An unsolicited MIR comes in — the Medical Information agent generates a compliant response");
      showPanel('med-info');
      await delay(600);
      set('#mir-product', 'Dupixent (dupilumab)');
      set('#mir-topic', 'Safety / Adverse Events');
      type('#mir-details', 'HCP requesting long-term safety profile data for patient counseling');
      await delay(400);
      click('#mir-submit');
      await delay(2200);
      await narrate("Standard response letter generated with approved safety data, citations, and compliance routing");
      await delay(1800);
      break;

    case "pharma-vig":
      await narrate("The safety question triggers a Pharmacovigilance check — are there any active signals?");
      showPanel('pharma-vig');
      await delay(600);
      set('#pv-product', 'Dupixent (dupilumab)');
      await delay(400);
      click('#pv-submit');
      await delay(1800);
      await narrate("Four signals tracked — conjunctivitis under ongoing monitoring, one new eosinophilia signal under review");
      await delay(1800);
      break;

    case "sci-comms":
      await narrate("We need a congress abstract drafted — the Scientific Communications agent helps");
      showPanel('sci-comms');
      await delay(600);
      set('#sc-type', 'Congress Abstract');
      type('#sc-product', 'Dupixent, Atopic Dermatitis');
      type('#sc-message', 'LIBERTY AD CHRONOS 4-year safety and efficacy data for EADV 2026 submission');
      await delay(400);
      click('#sc-submit');
      await delay(2200);
      await narrate("Draft abstract generated with structured sections, word count, and compliance review checklist");
      await delay(1800);
      break;

    case "pub-planner":
      await narrate("Publication Planner tracks the full manuscript pipeline — timelines, status, and target journals");
      showPanel('pub-planner');
      await delay(2000);
      await narrate("Six manuscripts in the pipeline — two submitted, one in medical review, and three in preparation");
      await delay(2000);
      break;

    case "advisory":
      await narrate("Planning an advisory board — the agent generates the engagement plan");
      showPanel('advisory');
      await delay(600);
      set('#ab-ta', 'Atopic Dermatitis');
      set('#ab-objective', 'Real-World Evidence Discussion');
      await delay(400);
      click('#ab-submit');
      await delay(2000);
      await narrate("Full advisory board plan with recommended KOLs, agenda topics, logistics, and compliance requirements");
      await delay(1800);
      break;

    case "med-ed":
      await narrate("Medical Education — our scientific and disease state education library for MSLs, HCPs, patients, and caregivers");
      showPanel('med-ed');
      await delay(2000);
      await narrate("Twelve programs covering disease pathophysiology, clinical evidence, HCP education, and patient resources — developed by Medical Affairs for all audiences");
      await delay(2000);
      break;

    case "congress":
      await narrate("Finally, Congress Intelligence — full coverage of upcoming medical congresses");
      showPanel('congress');
      await delay(600);
      set('#cg-congress', 'EADV 2026 — European Academy of Dermatology');
      await delay(400);
      click('#cg-submit');
      await delay(1800);
      await narrate("EADV 2026 in Vienna — Sanofi presentations, competitor activity, and key sessions to attend");
      await delay(2000);
      break;
    case "assistant":
      await narrate("The Medical Affairs Assistant — your AI companion for strategy, regulatory, and evidence questions");
      showHub();
      await delay(600);
      const fab = document.querySelector(".mv-chat-fab");
      if (fab) { fab.click(); await delay(800); }
      const chatIn = document.getElementById("mv-chat-input");
      if (chatIn) {
        chatIn.value = "";
        for (const ch of "Dupixent MOA") {
          chatIn.value += ch; await delay(25);
        }
        await delay(400);
        document.getElementById("mv-chat-send")?.click();
        await delay(2000);
      }
      await narrate("Instant answers on products, clinical data, and medical affairs processes — the assistant draws from all fourteen agents");
      await delay(1500);
      if (fab) fab.click();
      await delay(400);
      break;

    case "trial-match":
      await narrate("Trial Matching Agent — matching patients to eligible Sanofi clinical trials based on diagnosis, demographics, and treatment history");
      showHub();
      await delay(600);
      {
        const card = document.querySelector('[data-agent="trial-match"]');
        if (card) { card.scrollIntoView({ behavior: "smooth", block: "center" }); card.classList.add("highlight"); }
        await delay(2000);
        await narrate("Filters across active protocols, eligibility criteria, and site availability to surface the best-fit trials for each patient");
        await delay(2000);
        if (card) card.classList.remove("highlight");
      }
      break;
  }
}

// ── Demo controller ──
const demoCtrl = createDemoController({
  moduleName: "Medical Concierge",
  moduleIcon: "building-hospital",
  agents: MEDICAL_AGENTS,
  runAgent: runAgentDemo,
});

if (demoBtn) demoBtn.addEventListener("click", runDemo);

async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;
  demoBtn.disabled = true;
  demoBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running…';

  await demoCtrl.runFullDemo();

  // Finale
  if (!demoCtrl.aborted) {
    await narrate("With fifteen agents on one Medical Affairs command center, from strategy to execution — the Medical Concierge");
    showHub();
    await delay(1500);
  }

  narrateOff();
  demoRunning = false;
  demoBtn.disabled = false;
  demoBtn.innerHTML = '<i class="ti ti-player-play"></i> Run Demo';
}

// ── Autoplay support ──
if (window.location.hash === "#autoplay") {
  window.location.hash = "";
  setTimeout(runDemo, 600);
}
