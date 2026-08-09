/* Patient Concierge — 10 patient-focused agents */
import { speakAndWait, stopSpeaking, showControls, hideControls, isCCEnabled } from "./narrator.js";
import { createDemoController } from "./demo-nav.js";

// ── NAV STATE ──
const hub = document.getElementById('hub');
const backBtn = document.getElementById('back-btn');
const headerHome = document.getElementById('header-home');
const mainScroll = document.getElementById('main-scroll');

function showHub() {
  document.querySelectorAll('.agent-panel').forEach(p => p.classList.remove('active'));
  hub.style.display = '';
  backBtn.classList.remove('visible');
  mainScroll.scrollTop = 0;
}
function showPanel(id) {
  hub.style.display = 'none';
  document.querySelectorAll('.agent-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  backBtn.classList.add('visible');
  mainScroll.scrollTop = 0;
}

backBtn.addEventListener('click', showHub);
headerHome.addEventListener('click', (e) => { e.preventDefault(); showHub(); });

document.querySelectorAll('.agent-card').forEach(card => {
  card.addEventListener('click', () => showPanel(card.dataset.agent));
});

// ── SEARCH ──
const searchInput = document.getElementById('hub-search-input');
const searchBtn = document.getElementById('hub-search-btn');
const searchHintsEl = document.getElementById('hub-search-hints');

const searchHints = [
  'What are Dupixent side effects?',
  'Find trials for eczema',
  'Copay help for Kevzara',
  'Prepare for my dermatologist visit',
  'Track my injection side effects',
  'What is atopic dermatitis?'
];
searchHintsEl.innerHTML = searchHints.map(h => `<span class="hub-search-hint-chip">${h}</span>`).join('');
searchHintsEl.querySelectorAll('.hub-search-hint-chip').forEach(chip => {
  chip.addEventListener('click', () => { searchInput.value = chip.textContent; routeSearch(chip.textContent); });
});

searchBtn.addEventListener('click', () => { if (searchInput.value.trim()) routeSearch(searchInput.value.trim()); });
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && searchInput.value.trim()) routeSearch(searchInput.value.trim()); });

function routeSearch(q) {
  const low = q.toLowerCase();
  if (/side effect|reaction|adverse|injection site/i.test(low)) { showPanel('side-effects'); prefillSideEffect(q); }
  else if (/dosing|dose|how.*take|storage|interact|medication|drug/i.test(low)) { showPanel('medications'); prefillMed(q); }
  else if (/symptom|feeling|pain|itch|rash|wheez|cough|joint/i.test(low)) { showPanel('symptoms'); prefillSymptom(q); }
  else if (/trial|study|enroll|clinical/i.test(low)) { showPanel('trial-finder'); }
  else if (/copay|insurance|cost|afford|assist|financial|pay/i.test(low)) { showPanel('insurance'); }
  else if (/appoint|visit|doctor|question|prepare|ask/i.test(low)) { showPanel('appt-prep'); }
  else if (/treat|therapy|biologic|option|switch/i.test(low)) { showPanel('treatment'); }
  else if (/caregiv|family|support.*loved|child.*care/i.test(low)) { showPanel('caregiver'); }
  else if (/track|journal|mood|energy|wellness|log/i.test(low)) { showPanel('wellness'); renderWellness(); }
  else if (/what is|learn|condition|disease|about/i.test(low)) { showPanel('conditions'); }
  else { showPanel('medications'); prefillMed(q); }
}

function prefillMed(q) {
  const meds = ['dupixent','kevzara','aubagio','praluent','methotrexate','prednisone','altuviiio'];
  const found = meds.find(m => q.toLowerCase().includes(m));
  if (found) { document.getElementById('med-search').value = found.charAt(0).toUpperCase() + found.slice(1); flashPrefill('med-search'); }
}
function prefillSymptom(q) { document.getElementById('sym-description').value = q; flashPrefill('sym-description'); }
function prefillSideEffect(q) {
  const meds = ['dupixent','kevzara','aubagio','praluent','methotrexate','prednisone'];
  const found = meds.find(m => q.toLowerCase().includes(m));
  if (found) { document.getElementById('se-med').value = found.charAt(0).toUpperCase() + found.slice(1); flashPrefill('se-med'); }
}
function flashPrefill(id) {
  const el = document.getElementById(id);
  el.style.borderColor = 'var(--accent)';
  el.style.boxShadow = '0 0 0 4px rgba(122,0,230,.12)';
  setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 1500);
}

// ── CHIP SELECTION HELPER ──
function setupChips(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.form-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });
}
function getSelectedChips(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return [];
  return [...container.querySelectorAll('.form-chip.selected')].map(c => c.dataset.val);
}

setupChips('tx-stage');
setupChips('ins-status');
setupChips('cg-needs');

// ── LOADING HELPER ──
function showLoading(el, icon, msg) {
  el.innerHTML = `<div style="text-align:center;padding:30px 20px;"><i class="ti ti-loader-2" style="font-size:28px;color:var(--accent);animation:spin 1s linear infinite;display:block;margin-bottom:8px;"></i><span style="font-size:13px;color:var(--text-muted);">${msg}</span></div>`;
}

// ══════════════════════════════════════
// 1. MY MEDICATIONS
// ══════════════════════════════════════
const medicationDB = {
  dupixent: {
    brand: 'Dupixent', generic: 'dupilumab', class: 'IL-4/IL-13 inhibitor (biologic)',
    form: 'Pre-filled syringe or pen for subcutaneous injection',
    dosing: 'Adults with AD: Loading dose of 600 mg (two 300 mg injections), followed by 300 mg every other week.',
    commonSE: ['Injection site reactions (redness, swelling)', 'Eye problems (conjunctivitis, dry eyes)', 'Cold sores (oral herpes)', 'Headache'],
    seriousSE: ['Allergic reactions (rare)', 'Eye inflammation (keratitis)', 'Joint pain (arthralgia)'],
    storage: 'Refrigerate at 36-46°F (2-8°C). May be kept at room temperature (up to 77°F / 25°C) for up to 14 days. Do not freeze. Protect from light.',
    tips: 'Rotate injection sites. Let the pen reach room temperature 30-45 minutes before injecting. Do NOT shake.',
    interactions: 'Avoid live vaccines during treatment. Safe to use with most other medications. Tell your doctor about all medicines you take.'
  },
  kevzara: {
    brand: 'Kevzara', generic: 'sarilumab', class: 'IL-6 receptor antagonist (biologic)',
    form: 'Pre-filled syringe or pen for subcutaneous injection',
    dosing: '200 mg every 2 weeks via subcutaneous injection. Dose may be reduced to 150 mg for management of side effects.',
    commonSE: ['Injection site reactions', 'Upper respiratory infections', 'Urinary tract infections', 'Nasal congestion'],
    seriousSE: ['Serious infections (call doctor if fever, chills)', 'Low blood cell counts (neutropenia)', 'Liver enzyme elevations', 'Gastrointestinal perforation (rare)'],
    storage: 'Refrigerate at 36-46°F (2-8°C). May be kept at room temperature up to 77°F (25°C) for up to 14 days. Do not freeze.',
    tips: 'Get regular blood tests as directed. Report any signs of infection immediately. Rotate injection sites.',
    interactions: 'Avoid live vaccines. May affect levels of other medicines metabolized by CYP450 enzymes. Tell your doctor about all medications.'
  },
  methotrexate: {
    brand: 'Methotrexate', generic: 'methotrexate', class: 'Disease-modifying antirheumatic drug (DMARD)',
    form: 'Tablets or injectable solution',
    dosing: 'For RA: Usually 7.5-25 mg once weekly. Always taken ONCE PER WEEK, not daily. Take folic acid supplement as directed.',
    commonSE: ['Nausea, mouth sores', 'Fatigue', 'Hair thinning', 'Loss of appetite'],
    seriousSE: ['Liver damage (requires regular blood tests)', 'Lung problems (shortness of breath, cough)', 'Low blood counts', 'Serious infections'],
    storage: 'Store at room temperature 68-77°F (20-25°C). Keep away from light and moisture.',
    tips: 'Take folic acid daily to reduce side effects. Avoid alcohol. Do NOT take if pregnant or planning pregnancy. Take on the same day each week.',
    interactions: 'Avoid NSAIDs (ibuprofen, naproxen) unless approved by doctor. Avoid alcohol. Do not take with trimethoprim/sulfamethoxazole.'
  },
  prednisone: {
    brand: 'Prednisone', generic: 'prednisone', class: 'Corticosteroid',
    form: 'Oral tablets or liquid',
    dosing: 'Varies widely by condition. Follow your doctor\'s specific instructions. Usually taken in the morning with food.',
    commonSE: ['Increased appetite, weight gain', 'Mood changes, difficulty sleeping', 'Elevated blood sugar', 'Stomach irritation'],
    seriousSE: ['Bone weakening (osteoporosis) with long-term use', 'Increased infection risk', 'Adrenal suppression', 'Cataracts, glaucoma'],
    storage: 'Room temperature 68-77°F (20-25°C). Keep in a dry place.',
    tips: 'Take with food. Never stop suddenly — must taper gradually. Long-term use may need calcium and vitamin D supplementation.',
    interactions: 'NSAIDs increase stomach ulcer risk. May affect diabetes medications. Tell your doctor about all medicines and supplements.'
  },
  praluent: {
    brand: 'Praluent', generic: 'alirocumab', class: 'PCSK9 inhibitor (biologic)',
    form: 'Pre-filled pen for subcutaneous injection',
    dosing: '75 mg or 150 mg every 2 weeks, OR 300 mg every 4 weeks.',
    commonSE: ['Injection site reactions', 'Common cold symptoms', 'Flu-like symptoms', 'Muscle pain'],
    seriousSE: ['Allergic reactions (rare)', 'Liver problems (rare)'],
    storage: 'Refrigerate at 36-46°F (2-8°C). May keep at room temperature (up to 77°F) for up to 30 days. Do not freeze.',
    tips: 'Continue your statin and diet plan. Let pen warm to room temperature before injecting. Rotate injection sites.',
    interactions: 'Typically used with statins. No major drug interactions. Tell your doctor about all medications.'
  },
  aubagio: {
    brand: 'Aubagio', generic: 'teriflunomide', class: 'Immunomodulator',
    form: 'Oral tablets',
    dosing: '7 mg or 14 mg once daily.',
    commonSE: ['Headache', 'Diarrhea', 'Nausea', 'Hair thinning', 'Abnormal liver tests'],
    seriousSE: ['Liver damage (requires monitoring)', 'Serious infections', 'Peripheral neuropathy', 'Birth defects — do NOT use in pregnancy'],
    storage: 'Room temperature 68-77°F (20-25°C).',
    tips: 'Requires regular liver function tests. Women of childbearing age must use reliable contraception. Takes weeks to months to see full effect.',
    interactions: 'Avoid live vaccines. May interact with warfarin, some diabetes medications, and certain antibiotics. Tell your doctor about all medicines.'
  },
  altuviiio: {
    brand: 'Altuviiio', generic: 'efanesoctocog alfa', class: 'Factor VIII replacement (biologic)',
    form: 'Intravenous infusion',
    dosing: '50 IU/kg once weekly for prophylaxis.',
    commonSE: ['Headache', 'Joint pain', 'Rash'],
    seriousSE: ['Inhibitor development (neutralizing antibodies)', 'Allergic/anaphylactic reactions'],
    storage: 'Refrigerate at 36-46°F (2-8°C). May store at room temperature (up to 86°F / 30°C) for up to 6 months. Do not freeze.',
    tips: 'Once-weekly dosing designed for convenience. Track your infusion schedule. Report any unusual bleeding or bruising.',
    interactions: 'No known significant drug interactions. Tell your doctor about all medications and supplements.'
  }
};

const interactionDB = {
  'dupixent+ibuprofen': { safe: true, note: 'Dupixent does not interact with ibuprofen. Safe to use together.' },
  'dupixent+methotrexate': { safe: true, note: 'Dupixent can be used with methotrexate. No known interaction.' },
  'methotrexate+ibuprofen': { safe: false, note: 'Caution: NSAIDs like ibuprofen can increase methotrexate levels and toxicity. Avoid unless your doctor specifically approves.' },
  'methotrexate+alcohol': { safe: false, note: 'Do NOT combine. Alcohol significantly increases the risk of liver damage with methotrexate.' },
  'prednisone+ibuprofen': { safe: false, note: 'Increased risk of stomach ulcers and GI bleeding. Avoid combining unless your doctor directs otherwise.' },
  'prednisone+methotrexate': { safe: true, note: 'Often used together under medical supervision. Prednisone may help manage inflammation while methotrexate takes effect.' },
  'kevzara+methotrexate': { safe: true, note: 'Commonly used together for rheumatoid arthritis. Your doctor will monitor blood counts and liver function.' }
};

document.getElementById('med-submit').addEventListener('click', () => {
  const q = document.getElementById('med-search').value.trim().toLowerCase();
  const results = document.getElementById('med-results');
  if (!q) return;
  showLoading(results, 'pill', 'Looking up medication…');
  setTimeout(() => {
    const med = medicationDB[q] || medicationDB[Object.keys(medicationDB).find(k => medicationDB[k].brand.toLowerCase() === q || medicationDB[k].generic.toLowerCase() === q)];
    if (!med) {
      results.innerHTML = `<div class="result-empty"><i class="ti ti-pill"></i>Medication "${q}" not found in our database. Try searching for Dupixent, Kevzara, methotrexate, prednisone, Praluent, Aubagio, or Altuviiio.</div>`;
      return;
    }
    results.innerHTML = `
      <div class="med-card">
        <div class="med-header">
          <div class="med-icon"><i class="ti ti-pill"></i></div>
          <div><div class="med-name">${med.brand}</div><div class="med-generic">${med.generic} — ${med.class}</div></div>
        </div>
        <div style="margin-bottom:12px;font-size:12px;color:var(--text-muted);"><strong>Form:</strong> ${med.form}</div>
        <div class="med-grid">
          <div class="med-section">
            <div class="med-section-title"><i class="ti ti-clock"></i> How to Take It</div>
            <div class="med-section-body">${med.dosing}</div>
          </div>
          <div class="med-section">
            <div class="med-section-title"><i class="ti ti-snowflake"></i> Storage</div>
            <div class="med-section-body">${med.storage}</div>
          </div>
          <div class="med-section">
            <div class="med-section-title"><i class="ti ti-alert-circle"></i> Common Side Effects</div>
            <div class="med-section-body">${med.commonSE.map(s => `<div style="margin-bottom:3px;">• ${s}</div>`).join('')}</div>
          </div>
          <div class="med-section warning-section">
            <div class="med-section-title"><i class="ti ti-alert-triangle"></i> Serious Side Effects</div>
            <div class="med-section-body">${med.seriousSE.map(s => `<div style="margin-bottom:3px;">• ${s}</div>`).join('')}</div>
          </div>
          <div class="med-section full-width">
            <div class="med-section-title"><i class="ti ti-bulb"></i> Tips</div>
            <div class="med-section-body">${med.tips}</div>
          </div>
          <div class="med-section full-width">
            <div class="med-section-title"><i class="ti ti-exchange"></i> Interactions</div>
            <div class="med-section-body">${med.interactions}</div>
          </div>
        </div>
      </div>
      <div style="padding:10px 14px;background:var(--warning-bg);border-radius:8px;font-size:11px;color:var(--warning);display:flex;align-items:center;gap:6px;">
        <i class="ti ti-info-circle" style="font-size:16px;flex-shrink:0;"></i>
        This information is for educational purposes. Always follow your doctor's specific instructions.
      </div>`;
  }, 800);
});

document.getElementById('med-interact-btn').addEventListener('click', () => {
  const d1 = document.getElementById('med-drug1').value.trim().toLowerCase();
  const d2 = document.getElementById('med-drug2').value.trim().toLowerCase();
  const results = document.getElementById('med-results');
  if (!d1 || !d2) return;
  showLoading(results, 'exchange', 'Checking interaction…');
  setTimeout(() => {
    const key1 = d1 + '+' + d2;
    const key2 = d2 + '+' + d1;
    const interaction = interactionDB[key1] || interactionDB[key2];
    if (!interaction) {
      results.innerHTML = `<div class="result-card"><div class="result-card-header"><span class="result-badge badge-info">NO DATA</span><div class="result-title">${d1} + ${d2}</div></div><div class="result-body">No interaction data found for this combination. This does not mean it is safe — please consult your doctor or pharmacist.</div></div>`;
      return;
    }
    const cls = interaction.safe ? 'badge-success' : 'badge-danger';
    const label = interaction.safe ? 'LIKELY SAFE' : 'CAUTION';
    const icon = interaction.safe ? 'ti-circle-check' : 'ti-alert-triangle';
    results.innerHTML = `<div class="result-card"><div class="result-card-header"><span class="result-badge ${cls}">${label}</span><div class="result-title">${d1} + ${d2}</div></div><div class="result-body"><p><i class="${icon}" style="margin-right:4px;"></i> ${interaction.note}</p></div><div style="margin-top:10px;padding:8px 12px;background:var(--warning-bg);border-radius:6px;font-size:11px;color:var(--warning);"><i class="ti ti-info-circle"></i> Always confirm with your doctor or pharmacist.</div></div>`;
  }, 600);
});

// ══════════════════════════════════════
// 2. SYMPTOM CHECKER
// ══════════════════════════════════════
const symptomAssessments = {
  itch: { condition: 'Possible Atopic Dermatitis Flare', urgency: 'moderate', advice: 'Apply prescribed moisturizer and topical treatment. If itch is severe and disrupting sleep, contact your dermatologist. Avoid triggers like hot water, harsh soaps, and known allergens.', when: 'See your doctor if: symptoms worsen despite treatment, skin becomes infected (oozing, crusting), or you develop fever.' },
  rash: { condition: 'Skin Inflammation', urgency: 'moderate', advice: 'Note the location, size, and any changes. Apply gentle moisturizer. Avoid scratching. Take photos to show your doctor.', when: 'Seek medical attention if: rash spreads rapidly, you have difficulty breathing, fever develops, or it looks infected.' },
  wheez: { condition: 'Possible Asthma Exacerbation', urgency: 'high', advice: 'Use your rescue inhaler (albuterol) immediately. Sit upright and try to stay calm. Follow your asthma action plan.', when: 'Call 911 or go to the ER if: rescue inhaler doesn\'t help within 15 minutes, you can\'t speak in full sentences, lips or fingernails turn blue.' },
  joint: { condition: 'Joint Inflammation', urgency: 'moderate', advice: 'Rest the affected joint. Apply ice for 15-20 minutes. Over-the-counter pain relief may help. Track which joints are affected and when.', when: 'See your doctor if: multiple joints are swollen, morning stiffness lasts more than 30 minutes, pain is worsening, or you have fever with joint pain.' },
  headache: { condition: 'Headache Assessment', urgency: 'low', advice: 'Stay hydrated, rest in a quiet dark room. Over-the-counter pain relief can help. Track frequency and triggers.', when: 'Seek immediate care if: sudden severe headache ("worst headache of my life"), headache with fever and stiff neck, or vision changes.' },
  fatigue: { condition: 'Fatigue Assessment', urgency: 'low', advice: 'Ensure adequate sleep (7-9 hours). Stay hydrated and maintain regular meals. Light exercise can sometimes help. Track when fatigue is worst.', when: 'See your doctor if: fatigue persists more than 2 weeks, accompanied by weight loss, fever, or new symptoms, or interferes with daily activities.' },
  cough: { condition: 'Respiratory Assessment', urgency: 'moderate', advice: 'Stay hydrated. Use honey (if over 1 year old) for throat soothing. Monitor for changes in color or amount of any mucus.', when: 'See your doctor if: cough lasts more than 3 weeks, you cough up blood, you have shortness of breath at rest, or you have a high fever.' },
  pain: { condition: 'Pain Assessment', urgency: 'moderate', advice: 'Note the location, type (sharp, dull, burning), and what makes it better or worse. Over-the-counter pain relief may help for mild pain.', when: 'Seek medical attention if: pain is sudden and severe, accompanied by chest tightness or shortness of breath, or is worsening despite treatment.' }
};

document.getElementById('sym-submit').addEventListener('click', () => {
  const desc = document.getElementById('sym-description').value.trim();
  const duration = document.getElementById('sym-duration').value;
  const severity = parseInt(document.getElementById('sym-severity').value) || 5;
  const results = document.getElementById('sym-results');
  if (!desc) return;
  showLoading(results, 'heartbeat', 'Analyzing symptoms…');
  setTimeout(() => {
    const low = desc.toLowerCase();
    let match = symptomAssessments.pain;
    for (const [key, val] of Object.entries(symptomAssessments)) {
      if (low.includes(key)) { match = val; break; }
    }
    if (severity >= 8) match = { ...match, urgency: 'high' };
    else if (severity <= 3) match = { ...match, urgency: 'low' };

    const urgencyMap = { low: { cls: 'urgency-low', icon: 'ti-circle-check', label: 'Low Urgency' }, moderate: { cls: 'urgency-moderate', icon: 'ti-alert-circle', label: 'Moderate — Monitor Closely' }, high: { cls: 'urgency-high', icon: 'ti-alert-triangle', label: 'High — Contact Your Doctor' } };
    const u = urgencyMap[match.urgency];

    results.innerHTML = `
      <div class="urgency-banner ${u.cls}"><i class="ti ${u.icon}"></i> ${u.label}</div>
      <div class="result-card">
        <div class="result-card-header"><span class="result-badge badge-accent">${match.condition}</span></div>
        <div class="result-body">
          <p><strong>Your symptoms:</strong> ${desc}</p>
          ${duration ? `<p><strong>Duration:</strong> ${duration}</p>` : ''}
          <p><strong>Severity:</strong> ${severity}/10</p>
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><span class="result-badge badge-info">GUIDANCE</span><div class="result-title">What You Can Do</div></div>
        <div class="result-body"><p>${match.advice}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><span class="result-badge badge-warning">WHEN TO SEEK CARE</span><div class="result-title">See a Doctor If…</div></div>
        <div class="result-body"><p>${match.when}</p></div>
      </div>
      <div style="padding:10px 14px;background:var(--danger-bg);border-radius:8px;font-size:11px;color:var(--danger);display:flex;align-items:center;gap:6px;">
        <i class="ti ti-alert-triangle" style="font-size:16px;flex-shrink:0;"></i>
        This is not a medical diagnosis. If you feel your symptoms are an emergency, call 911 or go to the nearest emergency room immediately.
      </div>`;
  }, 1000);
});

// ══════════════════════════════════════
// 3. TREATMENT EXPLORER
// ══════════════════════════════════════
const treatmentData = {
  'Atopic Dermatitis (Eczema)': {
    overview: 'Eczema treatment follows a stepwise approach, starting with basic skin care and stepping up to stronger treatments as needed.',
    steps: [
      { name: 'Step 1: Moisturize & Avoid Triggers', type: 'Foundation', desc: 'Daily fragrance-free moisturizer, lukewarm showers, avoid known triggers (certain fabrics, soaps, allergens). This is the foundation of ALL eczema care.', badge: 'badge-success' },
      { name: 'Step 2: Topical Treatments', type: 'First-Line', desc: 'Topical corticosteroids (hydrocortisone to stronger prescriptions) and non-steroid options like tacrolimus or crisaborole. Applied directly to affected skin.', badge: 'badge-info' },
      { name: 'Step 3: Phototherapy', type: 'Second-Line', desc: 'Controlled UV light therapy, usually 2-3 times per week at a clinic. Can be very effective but requires regular visits.', badge: 'badge-warning' },
      { name: 'Step 4: Systemic Therapies', type: 'Advanced', desc: 'Oral medications like methotrexate, cyclosporine, or JAK inhibitors (upadacitinib, abrocitinib). For moderate-to-severe cases when topicals aren\'t enough.', badge: 'badge-accent' },
      { name: 'Step 5: Biologic Therapy (Dupixent)', type: 'Targeted', desc: 'Dupixent (dupilumab) targets specific immune pathways (IL-4/IL-13) involved in eczema. Given as an injection every 2 weeks. Can significantly clear skin and reduce itch.', badge: 'badge-accent' }
    ]
  },
  'Asthma': {
    overview: 'Asthma treatment aims to control symptoms, prevent attacks, and maintain normal activity. Treatment is adjusted based on how well-controlled your asthma is.',
    steps: [
      { name: 'Rescue Inhaler', type: 'As-Needed', desc: 'Short-acting beta-agonist (e.g., albuterol) for quick relief during symptoms or before exercise. Everyone with asthma should have one.', badge: 'badge-danger' },
      { name: 'Low-Dose Inhaled Corticosteroid', type: 'Step 1', desc: 'Daily controller inhaler (e.g., fluticasone, budesonide) to reduce airway inflammation. The cornerstone of asthma control.', badge: 'badge-info' },
      { name: 'Add-On Therapies', type: 'Step 2-3', desc: 'Long-acting beta-agonists (LABA), leukotriene modifiers (montelukast), or combination inhalers when a low-dose ICS isn\'t enough.', badge: 'badge-warning' },
      { name: 'Biologic Therapy (Dupixent)', type: 'Severe Asthma', desc: 'For moderate-to-severe eosinophilic asthma. Dupixent targets IL-4/IL-13 pathways, reducing attacks and steroid dependence. Injection every 2 weeks.', badge: 'badge-accent' }
    ]
  },
  'Rheumatoid Arthritis': {
    overview: 'RA treatment focuses on controlling inflammation, preventing joint damage, and maintaining function. Early, aggressive treatment leads to better outcomes.',
    steps: [
      { name: 'NSAIDs & Corticosteroids', type: 'Symptom Relief', desc: 'Ibuprofen, naproxen, or short-term prednisone for pain and inflammation while waiting for DMARDs to take effect.', badge: 'badge-info' },
      { name: 'Conventional DMARDs', type: 'First-Line', desc: 'Methotrexate is the gold standard, often combined with hydroxychloroquine or sulfasalazine. Takes 6-12 weeks to feel full effect.', badge: 'badge-warning' },
      { name: 'Biologic DMARDs', type: 'Advanced', desc: 'If conventional DMARDs aren\'t enough: Kevzara (sarilumab, IL-6 inhibitor), TNF inhibitors, or other targeted biologics. Usually combined with methotrexate.', badge: 'badge-accent' },
      { name: 'JAK Inhibitors', type: 'Oral Option', desc: 'Tofacitinib or upadacitinib — oral pills that target specific immune pathways. An alternative for patients who prefer pills over injections.', badge: 'badge-accent' }
    ]
  },
  'Nasal Polyps (CRSwNP)': {
    overview: 'Treatment focuses on reducing polyp size, relieving nasal congestion, and restoring sense of smell.',
    steps: [
      { name: 'Nasal Corticosteroid Sprays', type: 'First-Line', desc: 'Daily nasal sprays (fluticasone, mometasone) to shrink polyps and reduce inflammation. Used long-term.', badge: 'badge-info' },
      { name: 'Short-Term Oral Steroids', type: 'Rescue', desc: 'Oral prednisone courses to rapidly shrink large polyps. Used sparingly due to side effects.', badge: 'badge-warning' },
      { name: 'Biologic Therapy (Dupixent)', type: 'Advanced', desc: 'Dupixent (dupilumab) can significantly shrink polyps and restore sense of smell. Given as injection every 2 weeks, avoiding surgery for many patients.', badge: 'badge-accent' },
      { name: 'Surgery (Endoscopic)', type: 'Surgical Option', desc: 'Endoscopic sinus surgery to remove polyps. Polyps often recur; biologics may reduce recurrence.', badge: 'badge-danger' }
    ]
  },
  'Eosinophilic Esophagitis': {
    overview: 'EoE treatment focuses on reducing eosinophilic inflammation in the esophagus to relieve swallowing difficulties.',
    steps: [
      { name: 'Dietary Modifications', type: 'Lifestyle', desc: 'Elimination diets to identify trigger foods (common: dairy, wheat, eggs, soy, nuts, seafood). Work with a dietitian.', badge: 'badge-success' },
      { name: 'Proton Pump Inhibitors', type: 'First-Line', desc: 'High-dose PPIs (omeprazole, pantoprazole) can reduce eosinophilic inflammation in some patients.', badge: 'badge-info' },
      { name: 'Swallowed Topical Steroids', type: 'Second-Line', desc: 'Fluticasone or budesonide swallowed (not inhaled) to coat the esophagus and reduce inflammation.', badge: 'badge-warning' },
      { name: 'Dupixent', type: 'Biologic', desc: 'Dupixent (dupilumab) is the first FDA-approved biologic for EoE. Targets underlying Type 2 inflammation.', badge: 'badge-accent' }
    ]
  },
  'Prurigo Nodularis': {
    overview: 'PN treatment targets the itch-scratch cycle and underlying inflammation to reduce nodules and relieve intense itch.',
    steps: [
      { name: 'Topical Therapies', type: 'First-Line', desc: 'Potent topical corticosteroids, calcineurin inhibitors (tacrolimus), or menthol-based anti-itch creams.', badge: 'badge-info' },
      { name: 'Oral Medications', type: 'Second-Line', desc: 'Gabapentin or pregabalin for nerve-related itch. Antihistamines may provide mild relief.', badge: 'badge-warning' },
      { name: 'Dupixent', type: 'Biologic', desc: 'Dupixent (dupilumab) is FDA-approved for PN. Targets IL-4/IL-13 pathways driving the itch and inflammation.', badge: 'badge-accent' }
    ]
  },
  'COPD': {
    overview: 'COPD treatment aims to improve breathing, reduce flare-ups, and maintain quality of life.',
    steps: [
      { name: 'Bronchodilators', type: 'Foundation', desc: 'Short-acting (rescue) and long-acting inhalers to open airways. Tiotropium, formoterol, or combination inhalers.', badge: 'badge-info' },
      { name: 'Inhaled Corticosteroids', type: 'Add-On', desc: 'Added for patients with frequent exacerbations, often in combination inhalers (ICS/LABA or triple therapy).', badge: 'badge-warning' },
      { name: 'Pulmonary Rehab', type: 'Lifestyle', desc: 'Supervised exercise and education program. Highly effective at improving exercise capacity and quality of life.', badge: 'badge-success' },
      { name: 'Biologic Therapy', type: 'Type 2 High', desc: 'For COPD with Type 2 (eosinophilic) inflammation, targeted biologics like Dupixent are being studied and may offer benefit.', badge: 'badge-accent' }
    ]
  }
};

document.getElementById('tx-submit').addEventListener('click', () => {
  const condition = document.getElementById('tx-condition').value;
  const results = document.getElementById('tx-results');
  if (!condition) return;
  showLoading(results, 'list-check', 'Loading treatment options…');
  setTimeout(() => {
    const data = treatmentData[condition];
    if (!data) { results.innerHTML = `<div class="result-empty"><i class="ti ti-list-check"></i>No treatment data available for this condition yet.</div>`; return; }
    results.innerHTML = `
      <div class="result-card">
        <div class="result-card-header"><span class="result-badge badge-accent">${condition}</span></div>
        <div class="result-body"><p>${data.overview}</p></div>
      </div>
      ${data.steps.map(s => `
        <div class="result-card">
          <div class="result-card-header"><span class="result-badge ${s.badge}">${s.type}</span><div class="result-title">${s.name}</div></div>
          <div class="result-body"><p>${s.desc}</p></div>
        </div>`).join('')}
      <div style="padding:10px 14px;background:var(--accent-light);border-radius:8px;font-size:11px;color:var(--accent-text);display:flex;align-items:center;gap:6px;">
        <i class="ti ti-bulb" style="font-size:16px;flex-shrink:0;"></i>
        Discuss these options with your doctor to find the best fit for you. Every patient's journey is different.
      </div>`;
  }, 800);
});

// ══════════════════════════════════════
// 4. CLINICAL TRIAL FINDER
// ══════════════════════════════════════
const trialData = [
  { id: 'NCT05064800', title: 'LIBERTY-AD HITCH: Dupilumab in Adolescents with Atopic Dermatitis', condition: 'Atopic Dermatitis', phase: 'Phase 3', status: 'Recruiting', locations: 'Boston MA, New York NY, Chicago IL, Los Angeles CA', ages: '12-80', sponsor: 'Sanofi / Regeneron', desc: 'Evaluating dupilumab (Dupixent) in adolescents and adults with moderate-to-severe atopic dermatitis inadequately controlled by topical therapies.' },
  { id: 'NCT04901195', title: 'Dupilumab in Pediatric Asthma (VOYAGE)', condition: 'Asthma (eosinophilic)', phase: 'Phase 3', status: 'Recruiting', locations: 'Houston TX, Philadelphia PA, Denver CO', ages: '6-11', sponsor: 'Sanofi / Regeneron', desc: 'Assessing efficacy and safety of dupilumab in children aged 6-11 with uncontrolled moderate-to-severe asthma.' },
  { id: 'NCT05399641', title: 'SARIL-RA-COMPARE: Sarilumab Monotherapy in RA', condition: 'Rheumatoid Arthritis', phase: 'Phase 3', status: 'Recruiting', locations: 'Atlanta GA, Seattle WA, Phoenix AZ', ages: '18-75', sponsor: 'Sanofi / Regeneron', desc: 'Comparing sarilumab (Kevzara) monotherapy versus adalimumab in RA patients intolerant to methotrexate.' },
  { id: 'NCT05215808', title: 'Dupilumab in CRSwNP (SINUS-52 Extension)', condition: 'CRSwNP', phase: 'Phase 3', status: 'Enrolling', locations: 'San Francisco CA, Miami FL, Portland OR', ages: '18-70', sponsor: 'Sanofi / Regeneron', desc: 'Long-term safety and efficacy of dupilumab in adults with chronic rhinosinusitis with nasal polyps.' },
  { id: 'NCT06012345', title: 'LIBERTY-EoE TREET: Dupilumab in Eosinophilic Esophagitis', condition: 'Eosinophilic Esophagitis', phase: 'Phase 3', status: 'Recruiting', locations: 'Nashville TN, Omaha NE, Baltimore MD', ages: '12-65', sponsor: 'Sanofi / Regeneron', desc: 'Evaluating dupilumab for histological and symptomatic improvement in EoE patients.' },
  { id: 'NCT05052983', title: 'Dupilumab in Prurigo Nodularis (PRIME2)', condition: 'Prurigo Nodularis', phase: 'Phase 3', status: 'Recruiting', locations: 'Dallas TX, Minneapolis MN, Tampa FL', ages: '18-80', sponsor: 'Sanofi / Regeneron', desc: 'Assessing dupilumab for itch reduction and nodule clearance in prurigo nodularis.' },
  { id: 'NCT05155371', title: 'NOTUS: Dupilumab in Type 2 COPD', condition: 'COPD', phase: 'Phase 3', status: 'Recruiting', locations: 'Pittsburgh PA, Detroit MI, Charlotte NC', ages: '40-85', sponsor: 'Sanofi / Regeneron', desc: 'Evaluating dupilumab for reduction of exacerbations in COPD with Type 2 inflammation.' }
];

document.getElementById('tf-submit').addEventListener('click', () => {
  const age = parseInt(document.getElementById('tf-age').value) || 0;
  const condition = document.getElementById('tf-condition').value;
  const results = document.getElementById('tf-results');
  if (!condition) return;
  showLoading(results, 'flask', 'Searching clinical trials…');
  setTimeout(() => {
    const matches = trialData.filter(t => t.condition === condition || t.condition.includes(condition.split(' ')[0]));
    if (!matches.length) {
      results.innerHTML = `<div class="result-empty"><i class="ti ti-flask"></i>No matching trials found. New trials are added regularly — check back soon.</div>`;
      return;
    }
    results.innerHTML = `<div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);"><strong>${matches.length} trial(s)</strong> found for ${condition}</div>` +
      matches.map(t => {
        const statusCls = t.status === 'Recruiting' ? 'badge-success' : 'badge-info';
        return `<div class="result-card">
          <div class="result-card-header"><span class="result-badge ${statusCls}">${t.status}</span><div class="result-title">${t.title}</div></div>
          <div class="result-body"><p>${t.desc}</p></div>
          <div class="result-meta">
            <span class="result-meta-item"><i class="ti ti-test-pipe"></i> ${t.phase}</span>
            <span class="result-meta-item"><i class="ti ti-users"></i> Ages: ${t.ages}</span>
            <span class="result-meta-item"><i class="ti ti-building-hospital"></i> ${t.sponsor}</span>
          </div>
          <div style="margin-top:10px;font-size:12px;color:var(--text-secondary);"><strong>Locations:</strong> ${t.locations}</div>
          <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">ID: ${t.id}</div>
        </div>`;
      }).join('');
  }, 1000);
});

// ══════════════════════════════════════
// 5. INSURANCE & ACCESS
// ══════════════════════════════════════
const programData = {
  'Dupixent (dupilumab)': {
    programs: [
      { name: 'DUPIXENT MyWay Copay Card', type: 'Copay Assistance', icon: 'ti-credit-card', iconBg: '#dbeafe', iconColor: '#2563eb', eligible: 'commercial', desc: 'Eligible commercially insured patients may pay as little as $0 per month for Dupixent. Maximum annual benefit applies.', eligibility: 'Available to patients with commercial insurance. Not valid for government-funded insurance (Medicare, Medicaid, VA).' },
      { name: 'DUPIXENT MyWay Patient Assistance', type: 'Free Medication', icon: 'ti-gift', iconBg: 'var(--success-bg)', iconColor: 'var(--success)', eligible: 'uninsured', desc: 'Provides Dupixent at no cost to eligible uninsured or underinsured patients who meet income requirements.', eligibility: 'For uninsured patients or those denied coverage. Income-based eligibility applies.' },
      { name: 'DUPIXENT MyWay Nurse Support', type: 'Injection Training', icon: 'ti-heart', iconBg: '#fce7f3', iconColor: '#be185d', eligible: 'all', desc: 'Free nurse educator support for injection training, treatment questions, and ongoing encouragement. Available by phone or video.', eligibility: 'Available to all Dupixent patients, regardless of insurance status.' },
      { name: 'Medicare Coverage Support', type: 'Benefits Investigation', icon: 'ti-search', iconBg: '#fef3c7', iconColor: '#b45309', eligible: 'medicare', desc: 'DUPIXENT MyWay specialists will research your Medicare plan coverage and help identify the most affordable option for you.', eligibility: 'Available to all Medicare beneficiaries prescribed Dupixent.' }
    ]
  },
  'Kevzara (sarilumab)': {
    programs: [
      { name: 'Kevzara Copay Card', type: 'Copay Assistance', icon: 'ti-credit-card', iconBg: '#dbeafe', iconColor: '#2563eb', eligible: 'commercial', desc: 'Eligible patients with commercial insurance may pay $0 per month for Kevzara.', eligibility: 'Commercial insurance required. Not valid for government programs.' },
      { name: 'Kevzara Patient Assistance', type: 'Free Medication', icon: 'ti-gift', iconBg: 'var(--success-bg)', iconColor: 'var(--success)', eligible: 'uninsured', desc: 'Provides Kevzara at no cost for eligible uninsured patients meeting income criteria.', eligibility: 'Uninsured or underinsured patients. Income-based.' }
    ]
  },
  'Aubagio (teriflunomide)': {
    programs: [
      { name: 'Aubagio Copay Program', type: 'Copay Assistance', icon: 'ti-credit-card', iconBg: '#dbeafe', iconColor: '#2563eb', eligible: 'commercial', desc: 'Commercially insured patients may pay as little as $0 per prescription.', eligibility: 'Commercial insurance required.' },
      { name: 'MS Patient Assistance', type: 'Free Medication', icon: 'ti-gift', iconBg: 'var(--success-bg)', iconColor: 'var(--success)', eligible: 'uninsured', desc: 'Provides Aubagio at no cost for qualified patients without adequate insurance.', eligibility: 'Uninsured or underinsured. Income limits apply.' }
    ]
  },
  'Praluent (alirocumab)': {
    programs: [
      { name: 'Praluent Copay Card', type: 'Copay Assistance', icon: 'ti-credit-card', iconBg: '#dbeafe', iconColor: '#2563eb', eligible: 'commercial', desc: 'Eligible patients may pay as little as $0 per month with commercial insurance.', eligibility: 'Commercial insurance. Not valid for Medicare/Medicaid.' },
      { name: 'Praluent Patient Assistance', type: 'Free Medication', icon: 'ti-gift', iconBg: 'var(--success-bg)', iconColor: 'var(--success)', eligible: 'uninsured', desc: 'Praluent provided at no cost for eligible uninsured patients.', eligibility: 'Income-based eligibility.' }
    ]
  },
  'Altuviiio (efanesoctocog alfa)': {
    programs: [
      { name: 'Altuviiio Copay Support', type: 'Copay Assistance', icon: 'ti-credit-card', iconBg: '#dbeafe', iconColor: '#2563eb', eligible: 'commercial', desc: 'Financial assistance for commercially insured hemophilia A patients on Altuviiio.', eligibility: 'Commercial insurance required.' },
      { name: 'Hemophilia Patient Assistance', type: 'Free Medication', icon: 'ti-gift', iconBg: 'var(--success-bg)', iconColor: 'var(--success)', eligible: 'uninsured', desc: 'Factor products provided at no cost for eligible patients without adequate insurance.', eligibility: 'Uninsured or underinsured patients.' }
    ]
  }
};

document.getElementById('ins-submit').addEventListener('click', () => {
  const med = document.getElementById('ins-med').value;
  const statuses = getSelectedChips('ins-status');
  const results = document.getElementById('ins-results');
  if (!med) return;
  const status = statuses[0] || 'commercial';
  showLoading(results, 'wallet', 'Finding assistance programs…');
  setTimeout(() => {
    const data = programData[med];
    if (!data) { results.innerHTML = `<div class="result-empty"><i class="ti ti-wallet"></i>No program data found.</div>`; return; }
    const filtered = data.programs.filter(p => p.eligible === 'all' || p.eligible === status);
    results.innerHTML = `<div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);"><strong>${filtered.length} program(s)</strong> available for ${med} (${status} insurance)</div>` +
      filtered.map(p => `
        <div class="program-card">
          <div class="program-header">
            <div class="program-icon" style="background:${p.iconBg};color:${p.iconColor};"><i class="ti ${p.icon}"></i></div>
            <div><div class="program-name">${p.name}</div><div class="program-type">${p.type}</div></div>
          </div>
          <div class="program-details"><p>${p.desc}</p></div>
          <div class="program-eligibility"><i class="ti ti-circle-check"></i> ${p.eligibility}</div>
        </div>`).join('') +
      (filtered.length === 0 ? `<div class="result-empty"><i class="ti ti-wallet"></i>No programs match your insurance status. Try selecting a different option or call your Sanofi support team.</div>` : '');
  }, 800);
});

// ══════════════════════════════════════
// 6. APPOINTMENT PREP
// ══════════════════════════════════════
const questionTemplates = {
  'New patient / First visit': [
    'What tests do I need to confirm my diagnosis?',
    'What are my treatment options, starting from the least invasive?',
    'What should I expect in terms of timeline for improvement?',
    'Are there lifestyle changes that could help my condition?',
    'What are the possible side effects of the recommended treatment?',
    'Should I get a second opinion before starting treatment?',
    'How often will I need follow-up visits?'
  ],
  'Follow-up visit': [
    'Is my current treatment working as expected?',
    'Should we adjust my dosage or try something different?',
    'I\'ve been experiencing [symptom] — is this related to my treatment?',
    'Do I need any new lab tests or imaging?',
    'When should I schedule my next appointment?'
  ],
  'Treatment review': [
    'How do we measure if this treatment is working?',
    'What are the long-term risks of continuing this medication?',
    'Are there newer treatment options I should consider?',
    'Can we discuss reducing or stopping any of my medications?',
    'What happens if I miss a dose?'
  ],
  'Second opinion': [
    'Based on my records, do you agree with my current diagnosis?',
    'Would you recommend the same treatment approach?',
    'Are there alternative treatments my current doctor hasn\'t mentioned?',
    'What is your experience treating patients with my condition?',
    'What outcomes can I realistically expect?'
  ],
  'Specialist referral': [
    'What made my primary doctor refer me to you?',
    'Do you need any additional tests before making recommendations?',
    'How does your specialty approach differ from what I\'ve tried?',
    'Will you coordinate with my other doctors?',
    'What is the next step after today\'s consultation?'
  ]
};

let appointmentQuestions = [];

document.getElementById('appt-submit').addEventListener('click', () => {
  const type = document.getElementById('appt-type').value;
  const condition = document.getElementById('appt-condition').value.trim();
  const concern = document.getElementById('appt-concern').value.trim();
  const results = document.getElementById('appt-results');
  if (!type) return;
  showLoading(results, 'clipboard-check', 'Building your question list…');
  setTimeout(() => {
    appointmentQuestions = [...(questionTemplates[type] || questionTemplates['Follow-up visit'])];
    if (concern) appointmentQuestions.unshift(`I want to discuss: ${concern}`);
    renderQuestionList(results, type, condition);
    document.getElementById('appt-custom-card').style.display = '';
  }, 700);
});

function renderQuestionList(results, type, condition) {
  results.innerHTML = `
    <div class="result-card">
      <div class="result-card-header"><span class="result-badge badge-info">${type}</span>${condition ? `<div class="result-title">${condition}</div>` : ''}</div>
      <div class="result-body"><p><strong>${appointmentQuestions.length} questions</strong> prepared for your visit</p></div>
    </div>
    <div class="form-card" style="padding:14px;">
      <h4 style="margin-bottom:10px;"><i class="ti ti-list-check"></i> Your Question List</h4>
      <ul class="question-list" id="q-list">
        ${appointmentQuestions.map((q, i) => `<li><i class="ti ti-circle-check"></i><span>${q}</span><i class="ti ti-x q-remove" data-idx="${i}"></i></li>`).join('')}
      </ul>
    </div>
    <div class="result-card">
      <div class="result-card-header"><span class="result-badge badge-success">TIP</span><div class="result-title">Before Your Visit</div></div>
      <div class="result-body">
        <p>• Bring a list of all current medications and dosages</p>
        <p>• Write down any symptoms you've had since your last visit</p>
        <p>• Bring someone along to help remember what the doctor says</p>
        <p>• Ask the doctor to explain anything you don't understand</p>
      </div>
    </div>`;

  results.querySelectorAll('.q-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      appointmentQuestions.splice(idx, 1);
      renderQuestionList(results, type, condition);
    });
  });
}

document.getElementById('appt-add-q').addEventListener('click', () => {
  const input = document.getElementById('appt-custom-q');
  const q = input.value.trim();
  if (!q) return;
  appointmentQuestions.push(q);
  input.value = '';
  const type = document.getElementById('appt-type').value;
  const condition = document.getElementById('appt-condition').value.trim();
  renderQuestionList(document.getElementById('appt-results'), type, condition);
});

// ══════════════════════════════════════
// 7. SIDE EFFECT TRACKER
// ══════════════════════════════════════
let sideEffectLog = [];

document.getElementById('se-date').valueAsDate = new Date();

document.getElementById('se-submit').addEventListener('click', () => {
  const med = document.getElementById('se-med').value.trim();
  const effect = document.getElementById('se-effect').value.trim();
  const severity = document.getElementById('se-severity').value;
  const date = document.getElementById('se-date').value;
  const notes = document.getElementById('se-notes').value.trim();
  if (!med || !effect || !severity) return;

  sideEffectLog.unshift({ med, effect, severity, date: date || new Date().toISOString().slice(0, 10), notes });
  document.getElementById('se-effect').value = '';
  document.getElementById('se-notes').value = '';
  renderSideEffectLog();
});

function renderSideEffectLog() {
  const results = document.getElementById('se-results');
  if (!sideEffectLog.length) {
    results.innerHTML = `<div class="result-empty"><i class="ti ti-alert-triangle"></i>No side effects logged yet.</div>`;
    return;
  }
  const sevColors = { Mild: 'severity-mild', Moderate: 'severity-moderate', Severe: 'severity-severe' };
  const sevBadges = { Mild: 'badge-success', Moderate: 'badge-warning', Severe: 'badge-danger' };

  results.innerHTML = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);"><strong>${sideEffectLog.length} entries</strong> logged</div>
    ${sideEffectLog.map(e => `
      <div class="se-log-entry">
        <div class="se-log-date">${formatDate(e.date)}</div>
        <div class="se-log-body">
          <div class="se-log-title"><span class="severity-dot ${sevColors[e.severity]}"></span>${e.effect}</div>
          <div class="se-log-detail"><span class="result-badge ${sevBadges[e.severity]}" style="font-size:9px;padding:1px 6px;">${e.severity}</span> — ${e.med}</div>
          ${e.notes ? `<div class="se-log-detail" style="margin-top:4px;font-style:italic;">"${e.notes}"</div>` : ''}
        </div>
      </div>`).join('')}
    <div style="margin-top:12px;padding:10px 14px;background:var(--accent-light);border-radius:8px;font-size:11px;color:var(--accent-text);display:flex;align-items:center;gap:6px;">
      <i class="ti ti-printer" style="font-size:14px;"></i> Share this log with your doctor at your next appointment.
    </div>`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ══════════════════════════════════════
// 8. CONDITION LIBRARY
// ══════════════════════════════════════
const conditionLibrary = {
  'Atopic Dermatitis (Eczema)': {
    icon: 'ti-droplet', what: 'Eczema is a chronic skin condition that causes dry, itchy, inflamed skin. It affects about 10% of adults and up to 20% of children. It tends to come and go in flare-ups.',
    causes: 'Caused by a combination of genetic factors (weakened skin barrier) and immune system overactivity. The same immune pathway (Type 2 inflammation) also drives asthma and allergies.',
    symptoms: ['Dry, cracked skin', 'Intense itching (often worse at night)', 'Red or brownish patches', 'Thickened, scaly skin', 'Small, raised bumps that may leak fluid'],
    triggers: ['Stress', 'Dry weather', 'Certain soaps and detergents', 'Dust mites', 'Certain foods (especially in children)', 'Wool or synthetic fabrics'],
    livingWith: 'Moisturize daily, identify and avoid your triggers, manage stress, and work with your dermatologist to find the right treatment. Many people achieve significant improvement with modern treatments.'
  },
  'Asthma': {
    icon: 'ti-lungs', what: 'Asthma is a chronic condition where your airways become inflamed and narrowed, making it hard to breathe. It affects about 25 million Americans.',
    causes: 'Involves airway inflammation and hypersensitivity. In eosinophilic asthma, a specific type of white blood cell (eosinophils) causes inflammation driven by Type 2 immune pathways.',
    symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing (especially at night or early morning)', 'Difficulty exercising'],
    triggers: ['Allergens (pollen, dust mites, pet dander)', 'Cold air or weather changes', 'Exercise', 'Respiratory infections', 'Smoke and air pollution', 'Strong emotions or stress'],
    livingWith: 'Take controller medications as prescribed, keep your rescue inhaler accessible, know your triggers, and follow an asthma action plan. Most people with asthma can live active, normal lives.'
  },
  'Rheumatoid Arthritis': {
    icon: 'ti-bone', what: 'RA is an autoimmune disease where your immune system mistakenly attacks the lining of your joints, causing pain, swelling, and eventually joint damage.',
    causes: 'The immune system attacks the synovial membrane (joint lining), causing inflammation. The exact cause is unknown, but genetics, hormones, and environmental factors play a role.',
    symptoms: ['Joint pain and stiffness (especially in the morning)', 'Swollen, warm, tender joints', 'Fatigue', 'Usually affects joints symmetrically (both hands, both knees)', 'Can also affect organs like lungs and heart'],
    triggers: ['Smoking', 'Stress', 'Infections', 'Hormonal changes', 'Family history'],
    livingWith: 'Early treatment is key to preventing joint damage. Regular exercise, joint protection, and stress management help. Modern medications can put RA into remission for many patients.'
  },
  'Nasal Polyps (CRSwNP)': {
    icon: 'ti-nose', what: 'Nasal polyps are soft, painless growths in the lining of your sinuses or nasal passages. They can block airflow and reduce your sense of smell.',
    causes: 'Related to chronic inflammation in the sinuses, often driven by Type 2 inflammation. Associated with asthma and aspirin sensitivity.',
    symptoms: ['Persistent nasal congestion', 'Reduced or lost sense of smell', 'Runny nose', 'Facial pressure or headache', 'Snoring', 'Post-nasal drip'],
    triggers: ['Allergies', 'Infections', 'Aspirin sensitivity', 'Asthma', 'Environmental irritants'],
    livingWith: 'Nasal steroid sprays are the foundation. If polyps keep returning, biologics like Dupixent can help avoid repeated surgeries and restore sense of smell.'
  },
  'Eosinophilic Esophagitis': {
    icon: 'ti-apple', what: 'EoE is a chronic allergic condition where eosinophils (a type of white blood cell) build up in the esophagus, causing inflammation and difficulty swallowing.',
    causes: 'An immune response to foods or environmental allergens causes eosinophils to accumulate in the esophagus. Related to Type 2 inflammation.',
    symptoms: ['Difficulty swallowing (dysphagia)', 'Food getting stuck in the throat', 'Chest pain', 'Heartburn that doesn\'t respond to antacids', 'In children: feeding difficulties, vomiting'],
    triggers: ['Common food triggers: dairy, wheat, eggs, soy, nuts, seafood', 'Environmental allergens', 'Family history of allergic conditions'],
    livingWith: 'Work with a gastroenterologist and allergist. Dietary management and medications can control symptoms. Dupixent is now approved for EoE.'
  },
  'Prurigo Nodularis': {
    icon: 'ti-hand-finger', what: 'PN is a chronic skin condition characterized by intensely itchy, hard lumps (nodules) on the skin. The itch-scratch cycle makes nodules worse over time.',
    causes: 'The exact cause is complex — involves nerve signaling, immune system dysfunction, and Type 2 inflammation. Often occurs alongside other conditions like eczema or kidney disease.',
    symptoms: ['Hard, itchy bumps (nodules)', 'Intense itch that may be constant', 'Nodules on arms, legs, and trunk', 'Skin thickening from scratching', 'Sleep disruption from itch'],
    triggers: ['Stress', 'Heat and sweating', 'Dry skin', 'Tight clothing', 'Scratching (worsens the cycle)'],
    livingWith: 'Breaking the itch-scratch cycle is essential. Keep nails short, use cold compresses for itch relief, and work with your dermatologist. Dupixent is now approved for PN.'
  },
  'Type 2 Diabetes': {
    icon: 'ti-droplet-half-2', what: 'Type 2 diabetes is a chronic condition where your body doesn\'t use insulin properly, causing blood sugar levels to rise. It\'s the most common form of diabetes.',
    causes: 'Combination of insulin resistance (your body doesn\'t respond well to insulin) and insufficient insulin production. Genetics, weight, and lifestyle all play a role.',
    symptoms: ['Increased thirst and urination', 'Fatigue', 'Blurred vision', 'Slow-healing cuts or infections', 'Numbness or tingling in hands or feet', 'Many people have no symptoms initially'],
    triggers: ['Excess weight', 'Physical inactivity', 'Family history', 'Age (risk increases after 45)', 'Unhealthy diet'],
    livingWith: 'Diet, exercise, weight management, and medications work together. Regular blood sugar monitoring and A1C tests help track progress. Many people manage diabetes successfully long-term.'
  },
  'High Cholesterol': {
    icon: 'ti-heart-rate-monitor', what: 'High cholesterol means you have too much of a fatty substance (cholesterol) in your blood, increasing your risk of heart disease and stroke.',
    causes: 'Caused by diet, lack of exercise, obesity, and genetics. Familial hypercholesterolemia is an inherited form that causes very high LDL levels.',
    symptoms: ['Usually no symptoms — that\'s why regular testing is important', 'In severe cases: yellowish deposits around eyes or tendons'],
    triggers: ['Saturated and trans fats in diet', 'Lack of exercise', 'Smoking', 'Obesity', 'Family history'],
    livingWith: 'Heart-healthy diet, regular exercise, and medications (statins, or PCSK9 inhibitors like Praluent for tough cases) can effectively lower cholesterol and reduce heart risk.'
  },
  'Multiple Sclerosis': {
    icon: 'ti-brain', what: 'MS is a chronic disease where the immune system attacks the protective covering (myelin) of nerve fibers, disrupting communication between brain and body.',
    causes: 'An autoimmune condition — the immune system mistakenly attacks myelin. Genetics, vitamin D deficiency, certain infections, and geography may contribute.',
    symptoms: ['Numbness or tingling', 'Vision problems', 'Muscle weakness or spasms', 'Balance and coordination difficulties', 'Fatigue', 'Cognitive changes'],
    triggers: ['Stress', 'Heat', 'Infections', 'Smoking'],
    livingWith: 'Disease-modifying therapies (like Aubagio) can reduce relapses and slow progression. Physical therapy, occupational therapy, and support groups help maintain quality of life.'
  },
  'Hemophilia A': {
    icon: 'ti-droplet', what: 'Hemophilia A is a genetic bleeding disorder where blood doesn\'t clot properly due to missing or low levels of clotting factor VIII.',
    causes: 'Caused by a mutation in the gene for factor VIII. Usually inherited, primarily affecting males. Severity depends on how much factor VIII your body makes.',
    symptoms: ['Prolonged bleeding from cuts or injuries', 'Easy bruising', 'Bleeding into joints (pain and swelling)', 'Nosebleeds', 'Blood in urine or stool'],
    triggers: ['Injuries or surgery', 'Dental procedures', 'Certain medications (aspirin, NSAIDs)', 'Physical activity without protection'],
    livingWith: 'Prophylactic factor replacement (like Altuviiio, once weekly) prevents most bleeds. Regular activity is encouraged with proper protection. Wear a medical ID bracelet.'
  }
};

document.getElementById('cond-submit').addEventListener('click', () => {
  const condition = document.getElementById('cond-select').value;
  const results = document.getElementById('cond-results');
  if (!condition) return;
  showLoading(results, 'book-2', 'Loading condition information…');
  setTimeout(() => {
    const c = conditionLibrary[condition];
    if (!c) { results.innerHTML = `<div class="result-empty"><i class="ti ti-book-2"></i>Information not yet available for this condition.</div>`; return; }
    results.innerHTML = `
      <div class="result-card" style="border-left:3px solid var(--accent);">
        <div class="result-card-header"><span class="result-badge badge-accent">OVERVIEW</span><div class="result-title">${condition}</div></div>
        <div class="result-body"><p>${c.what}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><span class="result-badge badge-info">CAUSES</span></div>
        <div class="result-body"><p>${c.causes}</p></div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><span class="result-badge badge-warning">SYMPTOMS</span></div>
        <div class="result-body">${c.symptoms.map(s => `<p>• ${s}</p>`).join('')}</div>
      </div>
      <div class="result-card">
        <div class="result-card-header"><span class="result-badge badge-danger">COMMON TRIGGERS</span></div>
        <div class="result-body">${c.triggers.map(t => `<p>• ${t}</p>`).join('')}</div>
      </div>
      <div class="result-card" style="border-left:3px solid var(--success);">
        <div class="result-card-header"><span class="result-badge badge-success">LIVING WITH IT</span></div>
        <div class="result-body"><p>${c.livingWith}</p></div>
      </div>`;
  }, 800);
});

// ══════════════════════════════════════
// 9. CAREGIVER RESOURCES
// ══════════════════════════════════════
const caregiverResources = {
  'daily-care': [
    { title: 'Daily Skin Care Routine for Eczema', desc: 'Step-by-step guide: gentle cleansing, moisturizing within 3 minutes of bathing, applying medications, and choosing the right products.', icon: 'ti-droplet', bg: '#dbeafe', color: '#2563eb', tag: 'Guide', tagBg: '#dbeafe', tagColor: '#1d4ed8' },
    { title: 'Managing Medication Schedules', desc: 'Tips for keeping track of doses, injection schedules, and refill dates. Setting reminders and organizing supplies.', icon: 'ti-clock', bg: 'var(--accent-light)', color: 'var(--accent)', tag: 'Organization', tagBg: 'var(--accent-light)', tagColor: 'var(--accent-text)' },
    { title: 'Injection Day Tips for Caregivers', desc: 'How to prepare, distract, and comfort your loved one during biologic injections. Age-appropriate strategies for children.', icon: 'ti-vaccine', bg: '#fce7f3', color: '#be185d', tag: 'Practical', tagBg: '#fce7f3', tagColor: '#be185d' }
  ],
  'emotional': [
    { title: 'Caregiver Burnout: Signs & Solutions', desc: 'Recognize the signs of burnout — fatigue, irritability, withdrawal. Learn strategies for self-care and when to ask for help.', icon: 'ti-heart', bg: '#fee2e2', color: '#dc2626', tag: 'Wellness', tagBg: '#fee2e2', tagColor: '#991b1b' },
    { title: 'Talking to Children About Their Condition', desc: 'Age-appropriate ways to explain chronic illness to children. Building resilience and a positive self-image.', icon: 'ti-message-heart', bg: '#fce7f3', color: '#be185d', tag: 'Communication', tagBg: '#fce7f3', tagColor: '#be185d' },
    { title: 'Managing Caregiver Guilt', desc: 'You\'re doing more than you think. Strategies for managing guilt, setting realistic expectations, and celebrating small wins.', icon: 'ti-mood-smile', bg: 'var(--success-bg)', color: 'var(--success)', tag: 'Mental Health', tagBg: 'var(--success-bg)', tagColor: 'var(--success)' }
  ],
  'financial': [
    { title: 'Navigating Insurance for Biologics', desc: 'Step-by-step guide to prior authorizations, appeals, and insurance denials. Know your rights and how to advocate for coverage.', icon: 'ti-file-dollar', bg: '#fef3c7', color: '#b45309', tag: 'Insurance', tagBg: '#fef3c7', tagColor: '#92400e' },
    { title: 'Patient Assistance Programs Guide', desc: 'Overview of Sanofi and third-party patient assistance programs, copay cards, and foundation grants for medication costs.', icon: 'ti-gift', bg: 'var(--success-bg)', color: 'var(--success)', tag: 'Financial Aid', tagBg: 'var(--success-bg)', tagColor: 'var(--success)' }
  ],
  'education': [
    { title: 'Understanding Type 2 Inflammation', desc: 'Learn how the immune system drives conditions like eczema, asthma, and nasal polyps — and how targeted treatments work.', icon: 'ti-microscope', bg: 'var(--accent-light)', color: 'var(--accent)', tag: 'Science', tagBg: 'var(--accent-light)', tagColor: 'var(--accent-text)' },
    { title: 'What to Expect from Biologic Treatment', desc: 'Timeline of improvement, what the first weeks look like, managing expectations, and recognizing signs of response.', icon: 'ti-timeline', bg: '#dbeafe', color: '#2563eb', tag: 'Treatment', tagBg: '#dbeafe', tagColor: '#1d4ed8' }
  ],
  'community': [
    { title: 'Finding a Support Group', desc: 'National Eczema Association, Asthma and Allergy Foundation, Arthritis Foundation — how to connect with others who understand.', icon: 'ti-users', bg: '#fae8ff', color: '#a21caf', tag: 'Community', tagBg: '#fae8ff', tagColor: '#86198f' },
    { title: 'Online Communities for Caregivers', desc: 'Vetted online forums and social media groups where caregivers share tips, encouragement, and real-world experience.', icon: 'ti-world', bg: '#e0f2fe', color: '#0369a1', tag: 'Online', tagBg: '#e0f2fe', tagColor: '#0c4a6e' }
  ]
};

document.getElementById('cg-submit').addEventListener('click', () => {
  const condition = document.getElementById('cg-condition').value;
  const needs = getSelectedChips('cg-needs');
  const results = document.getElementById('cg-results');
  if (!needs.length) return;
  showLoading(results, 'friends', 'Finding resources…');
  setTimeout(() => {
    let allResources = [];
    needs.forEach(n => { if (caregiverResources[n]) allResources.push(...caregiverResources[n]); });
    if (!allResources.length) {
      results.innerHTML = `<div class="result-empty"><i class="ti ti-friends"></i>No resources found for your selection. Try different options.</div>`;
      return;
    }
    results.innerHTML = `<div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);"><strong>${allResources.length} resources</strong> found${condition ? ` for ${condition}` : ''}</div>` +
      allResources.map(r => `
        <div class="resource-card">
          <div class="resource-icon" style="background:${r.bg};color:${r.color};"><i class="ti ${r.icon}"></i></div>
          <div class="resource-body">
            <div class="resource-title">${r.title}</div>
            <div class="resource-desc">${r.desc}</div>
            <span class="resource-tag" style="background:${r.tagBg};color:${r.tagColor};">${r.tag}</span>
          </div>
        </div>`).join('');
  }, 700);
});

// ══════════════════════════════════════
// 10. WELLNESS JOURNAL
// ══════════════════════════════════════
let wellnessEntries = [
  { date: '2026-08-07', symptom: 4, mood: 7, energy: 6, medTaken: true, note: '' },
  { date: '2026-08-06', symptom: 5, mood: 6, energy: 5, medTaken: true, note: 'Mild flare on arms' },
  { date: '2026-08-05', symptom: 3, mood: 8, energy: 7, medTaken: true, note: '' },
  { date: '2026-08-04', symptom: 6, mood: 5, energy: 4, medTaken: false, note: 'Missed injection — pharmacy delay' },
  { date: '2026-08-03', symptom: 4, mood: 7, energy: 6, medTaken: true, note: '' },
  { date: '2026-08-02', symptom: 3, mood: 8, energy: 7, medTaken: true, note: 'Good day' },
  { date: '2026-08-01', symptom: 5, mood: 6, energy: 5, medTaken: true, note: '' }
];

function renderWellness() {
  const content = document.getElementById('wellness-content');
  const avgSymptom = (wellnessEntries.reduce((s, e) => s + e.symptom, 0) / wellnessEntries.length).toFixed(1);
  const avgMood = (wellnessEntries.reduce((s, e) => s + e.mood, 0) / wellnessEntries.length).toFixed(1);
  const adherence = Math.round((wellnessEntries.filter(e => e.medTaken).length / wellnessEntries.length) * 100);

  content.innerHTML = `
    <div class="wellness-grid">
      <div class="wellness-stat">
        <div class="wellness-stat-num">${avgSymptom}</div>
        <div class="wellness-stat-label">Avg Symptom Score</div>
        <div class="wellness-chart-row">${wellnessEntries.slice().reverse().map((e, i) => `<div class="wellness-bar${i === wellnessEntries.length - 1 ? ' today' : ''}" style="height:${e.symptom * 10}%"></div>`).join('')}</div>
      </div>
      <div class="wellness-stat">
        <div class="wellness-stat-num">${avgMood}</div>
        <div class="wellness-stat-label">Avg Mood Score</div>
        <div class="wellness-chart-row">${wellnessEntries.slice().reverse().map((e, i) => `<div class="wellness-bar${i === wellnessEntries.length - 1 ? ' today' : ''}" style="height:${e.mood * 10}%"></div>`).join('')}</div>
      </div>
      <div class="wellness-stat">
        <div class="wellness-stat-num">${adherence}%</div>
        <div class="wellness-stat-label">Med Adherence</div>
        <div class="wellness-chart-row">${wellnessEntries.slice().reverse().map((e, i) => `<div class="wellness-bar${i === wellnessEntries.length - 1 ? ' today' : ''}" style="height:${e.medTaken ? 100 : 20}%;background:${e.medTaken ? '' : 'var(--danger-bg)'};"></div>`).join('')}</div>
      </div>
    </div>

    <div class="form-card">
      <h4><i class="ti ti-plus"></i> Today's Entry</h4>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Symptom Severity (1-10)</label><input class="form-input" id="well-symptom" type="number" min="1" max="10" placeholder="1 = none, 10 = worst"></div>
        <div class="form-group"><label class="form-label">Mood (1-10)</label><input class="form-input" id="well-mood" type="number" min="1" max="10" placeholder="1 = low, 10 = great"></div>
        <div class="form-group"><label class="form-label">Energy (1-10)</label><input class="form-input" id="well-energy" type="number" min="1" max="10" placeholder="1 = exhausted, 10 = energetic"></div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Medication Taken Today?</label>
          <select class="form-select" id="well-med">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Notes (optional)</label>
          <input class="form-input" id="well-note" type="text" placeholder="Anything to note…">
        </div>
      </div>
      <button class="form-btn form-btn-primary" id="well-submit"><i class="ti ti-check"></i> Save Today's Entry</button>
    </div>

    <div class="form-card" style="padding:14px;">
      <h4 style="margin-bottom:10px;"><i class="ti ti-history"></i> Recent Entries</h4>
      ${wellnessEntries.map(e => {
        const sevClass = e.symptom >= 7 ? 'badge-danger' : e.symptom >= 4 ? 'badge-warning' : 'badge-success';
        return `<div style="display:flex;align-items:center;gap:12px;padding:8px 10px;border-radius:6px;margin-bottom:4px;background:var(--surface-dim);font-size:12px;">
          <span style="min-width:55px;font-weight:600;color:var(--accent);">${formatDate(e.date)}</span>
          <span class="result-badge ${sevClass}" style="font-size:9px;padding:1px 6px;">Sym: ${e.symptom}</span>
          <span style="color:var(--text-secondary);">Mood: ${e.mood} | Energy: ${e.energy}</span>
          <span style="margin-left:auto;font-size:11px;${e.medTaken ? 'color:var(--success)' : 'color:var(--danger)'};">${e.medTaken ? '✓ Med taken' : '✗ Missed'}</span>
        </div>`;
      }).join('')}
    </div>`;

  document.getElementById('well-submit').addEventListener('click', () => {
    const symptom = parseInt(document.getElementById('well-symptom').value);
    const mood = parseInt(document.getElementById('well-mood').value);
    const energy = parseInt(document.getElementById('well-energy').value);
    const medTaken = document.getElementById('well-med').value === 'yes';
    const note = document.getElementById('well-note').value.trim();
    if (!symptom || !mood || !energy) return;
    wellnessEntries.unshift({ date: new Date().toISOString().slice(0, 10), symptom, mood, energy, medTaken, note });
    renderWellness();
  });
}

// Auto-render wellness if panel is active
const wellnessPanel = document.getElementById('panel-wellness');
const observer = new MutationObserver(() => {
  if (wellnessPanel.classList.contains('active')) renderWellness();
});
observer.observe(wellnessPanel, { attributes: true, attributeFilter: ['class'] });

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

const PATIENT_AGENTS = [
  { id: "conditions",   name: "Condition Library",     icon: "book-2" },
  { id: "treatment",    name: "Treatment Explorer",    icon: "list-check" },
  { id: "medications",  name: "My Medications",        icon: "pill" },
  { id: "symptoms",     name: "Symptom Checker",       icon: "heartbeat" },
  { id: "side-effects", name: "Side Effect Tracker",   icon: "alert-triangle" },
  { id: "appt-prep",    name: "Appointment Prep",      icon: "clipboard-check" },
  { id: "insurance",    name: "Insurance & Access",     icon: "wallet" },
  { id: "trial-finder", name: "Clinical Trial Finder",  icon: "flask" },
  { id: "caregiver",    name: "Caregiver Resources",   icon: "friends" },
  { id: "wellness",     name: "Wellness Journal",      icon: "chart-line" },
  { id: "assistant",    name: "Patient Support Assistant", icon: "message-circle" }
];

const $ = id => document.getElementById(id);
const set = (id, v) => { const el = $(id); if (el) el.value = v; };
const click = id => { const el = $(id); if (el) el.click(); };
const selectChip = (containerId, val) => {
  const container = $(containerId);
  if (!container) return;
  container.querySelectorAll('.form-chip').forEach(c => {
    if (c.dataset.val === val && !c.classList.contains('selected')) c.click();
  });
};

async function runAgentDemo(index, agent) {
  switch (agent.id) {
    case "conditions":
      await narrate("It starts with learning. A patient recently diagnosed with eczema opens the Condition Library to understand their disease");
      showPanel('conditions');
      await delay(600);
      set('cond-select', 'Atopic Dermatitis (Eczema)');
      await narrate("Looking up Atopic Dermatitis");
      await delay(400);
      click('cond-submit');
      await delay(1500);
      await narrate("A clear overview — what it is, what causes it, symptoms to watch for, common triggers, and practical tips for living with it. All in patient-friendly language");
      await delay(1500);
      break;

    case "treatment":
      await narrate("Understanding the condition, the patient explores treatment options. The Treatment Explorer shows the stepwise approach");
      showPanel('treatment');
      await delay(600);
      set('tx-condition', 'Atopic Dermatitis (Eczema)');
      await narrate("Loading treatment options for eczema");
      await delay(400);
      click('tx-submit');
      await delay(1500);
      await narrate("Five treatment steps — from basic moisturizing through topicals, phototherapy, systemic therapy, to biologic therapy with Dupixent. Each explained in plain language with what to expect");
      await delay(1500);
      break;

    case "medications":
      await narrate("The doctor prescribes Dupixent. The patient looks it up in My Medications to learn everything about their new treatment");
      showPanel('medications');
      await delay(600);
      set('med-search', 'Dupixent');
      await narrate("Searching for Dupixent");
      await delay(400);
      click('med-submit');
      await delay(1500);
      await narrate("A complete medication card — dosing schedule of 300 milligrams every other week, common side effects like injection site reactions, storage at 36 to 46 degrees, injection tips, and drug interactions. Everyday language, no medical jargon");
      await delay(1500);
      break;

    case "symptoms":
      await narrate("Two weeks into treatment, the patient notices symptoms. The Symptom Checker helps assess whether they need to call their doctor");
      showPanel('symptoms');
      await delay(600);
      set('sym-description', 'Itchy skin on my arms and legs, worse at night, some redness around injection site');
      set('sym-duration', '1-3 days'); set('sym-severity', '5');
      await narrate("Describing itchy skin worse at night, with injection site redness, severity 5 out of 10");
      await delay(400);
      click('sym-submit');
      await delay(1500);
      await narrate("Moderate urgency assessment — guidance to apply moisturizer, avoid triggers, and specific red flags that mean call your doctor immediately");
      await delay(1500);
      break;

    case "side-effects":
      await narrate("The patient logs the injection site reaction in the Side Effect Tracker to share with their doctor at the next visit");
      showPanel('side-effects');
      await delay(600);
      set('se-med', 'Dupixent'); set('se-effect', 'Injection site redness and mild swelling');
      set('se-severity', 'Mild'); set('se-notes', 'Resolved within 2 days');
      await narrate("Logging a mild injection site reaction — redness and swelling that resolved in 2 days");
      await delay(400);
      click('se-submit');
      await delay(1500);
      await narrate("Entry logged with date, severity, and notes. The tracker builds a printable history to share with your healthcare team");
      await delay(1500);
      break;

    case "appt-prep":
      await narrate("A follow-up appointment is coming. Appointment Prep generates a personalized question list so the patient makes the most of their visit");
      showPanel('appt-prep');
      await delay(600);
      set('appt-type', 'Follow-up visit'); set('appt-condition', 'Atopic Dermatitis');
      set('appt-concern', 'Injection site reactions and when to expect improvement');
      await narrate("Preparing for a follow-up visit about eczema, with concerns about injection reactions and timeline");
      await delay(400);
      click('appt-submit');
      await delay(1500);
      await narrate("Six tailored questions generated — from treatment effectiveness to dosage adjustments, plus practical tips like bringing a medication list and noting symptoms since last visit");
      await delay(1500);
      break;

    case "insurance":
      await narrate("The patient needs help with medication costs. The Insurance and Access agent finds financial assistance programs");
      showPanel('insurance');
      await delay(600);
      set('ins-med', 'Dupixent (dupilumab)');
      selectChip('ins-status', 'commercial');
      await narrate("Searching assistance programs for Dupixent with commercial insurance");
      await delay(400);
      click('ins-submit');
      await delay(1500);
      await narrate("Two programs found — the DUPIXENT MyWay Copay Card for as little as zero dollars per month, plus free nurse educator support for injection training and ongoing encouragement");
      await delay(1500);
      break;

    case "trial-finder":
      await narrate("The patient asks about clinical trials. The Trial Finder searches for studies accepting participants");
      showPanel('trial-finder');
      await delay(600);
      set('tf-age', '38'); set('tf-condition', 'Atopic Dermatitis');
      await narrate("Searching trials for a 38-year-old with Atopic Dermatitis");
      await delay(400);
      click('tf-submit');
      await delay(1500);
      await narrate("Matching trials found with plain-language descriptions, recruiting status, locations, and age eligibility — empowering the patient to discuss options with their doctor");
      await delay(1500);
      break;

    case "caregiver":
      await narrate("The patient's partner needs support too. Caregiver Resources provides practical guides and emotional support");
      showPanel('caregiver');
      await delay(600);
      set('cg-condition', 'Atopic Dermatitis (adult)');
      selectChip('cg-needs', 'daily-care');
      selectChip('cg-needs', 'emotional');
      await narrate("Finding daily care and emotional support resources for an eczema caregiver");
      await delay(400);
      click('cg-submit');
      await delay(1500);
      await narrate("Six resources — from daily skin care routines and injection day tips to managing caregiver burnout and talking to children about their condition. Real support for the whole family");
      await delay(1500);
      break;

    case "wellness":
      await narrate("Finally — the Wellness Journal tracks symptoms, mood, energy, and medication adherence over time");
      showPanel('wellness');
      renderWellness();
      await delay(600);
      await narrate("Seven days of data visualized — average symptom score, mood trends, and 86 percent medication adherence. The patient missed one injection due to a pharmacy delay, clearly tracked");
      await delay(1500);
      await narrate("Patients can log daily entries and share the trend data with their healthcare team to optimize treatment together");
      await delay(1500);
      break;
    case "assistant":
      await narrate("The Patient Support Assistant — your A.I. companion for questions about conditions, treatments, and access programs");
      showHub();
      await delay(600);
      const fab = document.querySelector(".mv-chat-fab");
      if (fab) { fab.click(); await delay(800); }
      const chatIn = document.getElementById("mv-chat-input");
      if (chatIn) {
        chatIn.value = "";
        for (const ch of "Copay assistance for Dupixent") {
          chatIn.value += ch; await delay(25);
        }
        await delay(400);
        document.getElementById("mv-chat-send")?.click();
        await delay(2000);
      }
      await narrate("Instant answers on copay programs, dosing, side effects, and clinical trials — the assistant helps patients navigate their care journey");
      await delay(1500);
      if (fab) fab.click();
      await delay(400);
      break;
  }
}

const demoCtrl = createDemoController({
  moduleName: "Patient Concierge",
  moduleIcon: "heart-handshake",
  agents: PATIENT_AGENTS,
  runAgent: runAgentDemo
});

if (demoBtn) demoBtn.addEventListener("click", runDemo);

async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;
  demoBtn.disabled = true;
  demoBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Running…';

  await delay(500);
  await narrate("Patient Concierge — a day in the life. Ten A.I. agents empowering patients and caregivers to understand their conditions, manage treatment, and navigate the healthcare system");

  await demoCtrl.runFullDemo();

  // ── Wrap up ──
  showHub();
  await delay(500);
  await narrate("Ten agents. One platform. From diagnosis to daily wellness — the Patient Concierge puts patients at the center of their care journey with clear, actionable, and compassionate support");
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
