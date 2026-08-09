// ── MedVerse Enhancements Layer ──
// Dark mode, toasts, notification badges, keyboard nav, micro-interactions

(function () {
  const THEME_KEY = 'medverse-theme';

  // ═══ DARK MODE ═══
  function initDarkMode() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    const actions = document.querySelector('.header-actions');
    if (!actions) return;
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.title = 'Toggle dark mode';
    btn.innerHTML = isDark() ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>';
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      btn.innerHTML = next === 'dark' ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>';
    });
    actions.insertBefore(btn, actions.firstChild);
  }
  function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }

  // ═══ TOAST SYSTEM ═══
  let toastContainer;
  function ensureToastContainer() {
    if (toastContainer) return toastContainer;
    toastContainer = document.createElement('div');
    toastContainer.className = 'mv-toast-container';
    document.body.appendChild(toastContainer);
    return toastContainer;
  }

  window.mvToast = function (message, type = 'info', duration = 3000) {
    const container = ensureToastContainer();
    const icons = { success: 'ti-circle-check', info: 'ti-info-circle', warning: 'ti-alert-triangle', error: 'ti-alert-circle', accent: 'ti-sparkles' };
    const toast = document.createElement('div');
    toast.className = `mv-toast mv-toast-${type}`;
    toast.innerHTML = `<i class="ti ${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('visible')));
    setTimeout(() => {
      toast.classList.remove('visible');
      toast.classList.add('exiting');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  };

  // ═══ NOTIFICATION BADGES ═══
  function addBadges() {
    const tabs = document.querySelectorAll('.module-tab');
    tabs.forEach(tab => {
      const href = tab.getAttribute('href') || '';
      if (href.includes('system-tools') && !tab.classList.contains('active')) {
        addBadgeDot(tab);
      }
    });
  }
  function addBadgeDot(tab) {
    if (tab.querySelector('.tab-badge-dot')) return;
    const dot = document.createElement('span');
    dot.className = 'tab-badge-dot';
    tab.appendChild(dot);
  }

  // ═══ KEYBOARD NAVIGATION ═══
  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const backBtn = document.getElementById('back-btn');
        if (backBtn && backBtn.classList.contains('visible')) {
          backBtn.click();
          return;
        }
        const overlay = document.querySelector('.overlay.open, .signal-overlay.open, .poster-overlay.open');
        if (overlay) {
          const closeBtn = overlay.querySelector('.close-btn, [class*="close"]');
          if (closeBtn) closeBtn.click();
        }
      }
    });
  }

  // ═══ BUTTON LOADING STATES ═══
  window.mvBtnLoading = function (btn, loadingText) {
    if (!btn) return;
    btn._origHTML = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = `<i class="ti ti-loader-2"></i> ${loadingText || 'Processing…'}`;
  };
  window.mvBtnSuccess = function (btn, successText, resetMs = 2000) {
    if (!btn) return;
    btn.classList.remove('loading');
    btn.classList.add('success');
    btn.innerHTML = `<i class="ti ti-check"></i> ${successText || 'Done'}`;
    setTimeout(() => {
      btn.classList.remove('success');
      btn.innerHTML = btn._origHTML || btn.innerHTML;
    }, resetMs);
  };
  window.mvBtnReset = function (btn) {
    if (!btn) return;
    btn.classList.remove('loading', 'success');
    if (btn._origHTML) btn.innerHTML = btn._origHTML;
  };

  // ═══ PULSE NEW CONTENT ═══
  window.mvPulse = function (el) {
    if (!el) return;
    el.classList.remove('pulse-new');
    void el.offsetWidth;
    el.classList.add('pulse-new');
  };

  // ═══ AUTO-ENHANCE SUBMIT BUTTONS ═══
  function autoEnhanceButtons() {
    document.querySelectorAll('[id$="-submit"]').forEach(btn => {
      if (btn._mvEnhanced) return;
      btn._mvEnhanced = true;
      btn.addEventListener('click', () => {
        const container = btn.closest('.agent-panel, .panel-body, .form-card')
          ?.querySelector('[id$="-results"], [id$="-content"], .results-container');
        if (container) {
          const observer = new MutationObserver(() => {
            const cards = container.querySelectorAll('.result-card:not(.pulse-done)');
            if (cards.length) {
              cards.forEach(c => { c.classList.add('pulse-done'); window.mvPulse(c); });
              observer.disconnect();
            }
          });
          observer.observe(container, { childList: true, subtree: true });
          setTimeout(() => observer.disconnect(), 10000);
        }
      });
    });
  }

  // ═══ DEAD BUTTON WIRING ═══
  function wireDeadButtons() {
    const actions = {
      'View Protocol': { msg: 'Protocol document opening in new tab…', type: 'info' },
      'Contact MSL': { msg: 'MSL contact request queued — you will receive a response within 24 hours', type: 'success' },
      'Request Meeting': { msg: 'Meeting request sent — calendar invite pending', type: 'success' },
      'Email': { msg: 'Opening email compose…', type: 'info' },
      'Call': { msg: 'Initiating call connection…', type: 'info' },
      'PubMed': { msg: 'Opening PubMed article in new tab…', type: 'info' },
      'Summary': { msg: 'AI summary generation in progress…', type: 'accent' },
      'Read': { msg: 'Opening full article view…', type: 'info' },
      'AI Summary': { msg: 'Generating AI-powered summary…', type: 'accent' },
      'Set Up Weekly Alert': { msg: 'Weekly alert configured — updates will arrive every Monday', type: 'success' },
      'Export Response Letter': { msg: 'Exporting response letter as PDF…', type: 'info' },
      'Send to HCP': { msg: 'Response letter queued for HCP delivery via secure channel', type: 'success' },
      'Generate Full Draft': { msg: 'Full draft generation in progress — estimated 2 minutes', type: 'accent' },
      'Send to MLR Review': { msg: 'Content submitted to MLR review queue — tracking ID assigned', type: 'success' },
    };
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.form-btn');
      if (!btn || btn._mvWired) return;
      const text = btn.textContent.trim();
      for (const [label, config] of Object.entries(actions)) {
        if (text.includes(label)) {
          e.preventDefault();
          if (window.mvBtnLoading) mvBtnLoading(btn, 'Processing…');
          setTimeout(() => {
            if (window.mvBtnSuccess) mvBtnSuccess(btn, 'Done', 2000);
            if (window.mvToast) mvToast(config.msg, config.type);
          }, 800);
          return;
        }
      }
    });
  }

  // ═══ FLOATING CHAT WIDGET ═══
  const chatPages = ['medical.html', 'patient.html', 'index.html', 'system-tools.html', 'concierge.html'];
  const chatResponses = {
    dupixent: 'Dupixent (dupilumab) is a monoclonal antibody targeting IL-4/IL-13. It is approved for atopic dermatitis, asthma, CRSwNP, EoE, prurigo nodularis, and COPD. For specific clinical questions, please use the Medical Information agent.',
    kevzara: 'Kevzara (sarilumab) is an IL-6 receptor antagonist approved for rheumatoid arthritis. The MONARCH trial demonstrated superiority vs. adalimumab as monotherapy.',
    praluent: 'Praluent (alirocumab) is a PCSK9 inhibitor for LDL-C reduction. ODYSSEY OUTCOMES showed significant CV risk reduction in post-ACS patients.',
    safety: 'For safety and adverse event reporting, please use the Pharmacovigilance agent. For urgent safety concerns, contact Sanofi Medical Information at 1-800-633-1610.',
    trial: 'To search for clinical trials, use the Trial Matching agent in HCP Concierge or search ClinicalTrials.gov. Current recruiting studies span AD, asthma, COPD, and hemophilia A.',
    dosing: 'Dupixent dosing varies by indication and age group. Adults with AD: 600mg loading dose, then 300mg every 2 weeks. For specific dosing, use the Medical Information agent.',
    copay: 'Sanofi offers the Dupixent MyWay copay assistance program. Eligible commercially insured patients may pay as little as $0 per fill. Visit dupixentmyway.com for details.',
    side: 'Common adverse reactions for Dupixent include injection site reactions, conjunctivitis, and oral herpes. Please consult the full prescribing information for complete safety data.',
    precall: 'Pre-call planning agent activated. Based on your territory data, Dr. Chen has upcoming meetings focused on atopic dermatitis. Key talking points: LIBERTY AD CHRONOS 3-year data, new pediatric indication, and competitive landscape vs. JAK inhibitors.',
    territory: 'Your Northeast territory covers 42 HCPs across 3 medical centers. This quarter: 12 visits completed, 8 pending. Top priority targets: Dr. Chen (AD KOL), Dr. Patel (asthma specialist), Dr. Williams (EoE researcher).',
    kol: 'KOL Intelligence: Dr. Sarah Chen — Tier 1 AD specialist, 47 publications, 12 congress presentations. Recent focus: long-term biologic safety in pediatric populations. Sentiment: positive toward Dupixent. Last interaction: June 2025.',
    orion: 'Orion Signal Intelligence: 3 new signals detected this week. High priority: increased off-label interest in Type 2 inflammation across rheumatology. Medium: competitive launch activity in asthma market. Signal confidence: 87%.',
    landscape: 'Disease Landscape: Type 2 inflammation spans 8 Sanofi therapeutic areas. Key pathways: IL-4/IL-13 (Dupixent), IL-6 (Kevzara), PCSK9 (Praluent). Emerging targets: OX40, TSLP, IL-33.',
    literature: 'Literature Intelligence: 127 new publications this month across your therapeutic areas. Top finding: NEJM meta-analysis confirms Dupixent long-term safety profile across all approved indications. 12 publications flagged for field team review.',
    congress: 'Congress Intelligence: 3 upcoming congresses in your areas. AAD Annual Meeting — 14 Sanofi presentations scheduled. ATS International — 6 respiratory abstracts accepted. EADV — dupilumab real-world evidence symposium confirmed.',
    default: 'I can help with general questions about Sanofi products, clinical data, and medical affairs processes. For detailed queries, please use the specialized agents available in this concierge.',
  };

  function matchChatResponse(input) {
    const q = input.toLowerCase();
    if (/pre.?call|planning/.test(q)) return chatResponses.precall;
    if (/territory|territor|overview/.test(q)) return chatResponses.territory;
    if (/kol|key opinion|insight/.test(q)) return chatResponses.kol;
    if (/orion|signal/.test(q)) return chatResponses.orion;
    if (/landscape|disease/.test(q)) return chatResponses.landscape;
    if (/literature|pubmed|publication|search/.test(q)) return chatResponses.literature;
    if (/congress|meeting|conference/.test(q)) return chatResponses.congress;
    if (/dupix|dupilumab/.test(q)) return chatResponses.dupixent;
    if (/kevzara|sarilumab/.test(q)) return chatResponses.kevzara;
    if (/praluent|alirocumab|pcsk9/.test(q)) return chatResponses.praluent;
    if (/safe|adverse|side.?effect|ae\b/.test(q)) return chatResponses.side;
    if (/trial|study|recruit/.test(q)) return chatResponses.trial;
    if (/dos|administ/.test(q)) return chatResponses.dosing;
    if (/copay|cost|assist|afford/.test(q)) return chatResponses.copay;
    if (/pharma/.test(q)) return chatResponses.safety;
    return chatResponses.default;
  }

  function initChatWidget() {
    const page = location.pathname.split('/').pop();
    if (!chatPages.some(p => page.includes(p.replace('.html', '')))) return;

    const isMedical = page.includes('medical');
    const isMSL = page.includes('index');
    const isPowerApps = page.includes('system-tools');
    const isHCP = page.includes('concierge');
    const title = isMSL ? 'MSL Copilot Assistant'
      : isPowerApps ? 'Power Agents Assistant'
      : isMedical ? 'Medical Affairs Assistant'
      : isHCP ? 'HCP Concierge Assistant'
      : 'Patient Support Assistant';
    const greeting = isMSL ? 'MSL Copilot'
      : isPowerApps ? 'Power Agents'
      : isMedical ? 'Medical Affairs'
      : isHCP ? 'HCP Concierge'
      : 'Patient Support';
    const chips = isMSL
      ? ['Pre-call planning', 'KOL insights', 'Dupixent data', 'Territory overview']
      : isPowerApps
      ? ['Orion signals', 'Disease landscape', 'Literature search', 'Congress updates']
      : isMedical
      ? ['Dupixent MOA', 'Kevzara safety', 'Find clinical trials', 'Dosing info']
      : isHCP
      ? ['Dupixent storage', 'Find a clinical trial', 'MSL connection', 'Ingredient safety']
      : ['Side effects', 'Copay assistance', 'Find a trial', 'Dupixent dosing'];

    const fab = document.createElement('button');
    fab.className = 'mv-chat-fab';
    fab.innerHTML = '<i class="ti ti-message-circle"></i>';
    fab.title = 'Open AI assistant';

    const panel = document.createElement('div');
    panel.className = 'mv-chat-panel';
    panel.innerHTML = `
      <div class="mv-chat-header">
        <i class="ti ti-sparkles"></i>
        <div><div class="mv-chat-header-title">${title}</div><div class="mv-chat-header-sub">Powered by MedVerse AI</div></div>
      </div>
      <div class="mv-chat-body" id="mv-chat-body">
        <div class="mv-chat-msg bot">Hello! I'm your ${greeting} assistant. How can I help you today?</div>
      </div>
      <div class="mv-chat-chips" id="mv-chat-chips">
        ${chips.map(c => `<button class="mv-chat-chip">${c}</button>`).join('')}
      </div>
      <div class="mv-chat-input-row">
        <input class="mv-chat-input" id="mv-chat-input" placeholder="Type a question…" />
        <button class="mv-chat-send" id="mv-chat-send"><i class="ti ti-send"></i></button>
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener('click', () => {
      fab.classList.toggle('open');
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        document.getElementById('mv-chat-input').focus();
      }
    });

    function sendMsg(text) {
      const body = document.getElementById('mv-chat-body');
      const chipsEl = document.getElementById('mv-chat-chips');
      if (chipsEl) chipsEl.style.display = 'none';

      const userMsg = document.createElement('div');
      userMsg.className = 'mv-chat-msg user';
      userMsg.textContent = text;
      body.appendChild(userMsg);

      const typing = document.createElement('div');
      typing.className = 'mv-chat-msg bot typing';
      typing.textContent = 'Thinking';
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      setTimeout(() => {
        typing.remove();
        const botMsg = document.createElement('div');
        botMsg.className = 'mv-chat-msg bot';
        botMsg.textContent = matchChatResponse(text);
        body.appendChild(botMsg);
        body.scrollTop = body.scrollHeight;
        if (window.mvPulse) mvPulse(botMsg);
      }, 800 + Math.random() * 600);
    }

    document.getElementById('mv-chat-send').addEventListener('click', () => {
      const input = document.getElementById('mv-chat-input');
      if (input.value.trim()) { sendMsg(input.value.trim()); input.value = ''; }
    });
    document.getElementById('mv-chat-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) { sendMsg(e.target.value.trim()); e.target.value = ''; }
    });
    panel.querySelectorAll('.mv-chat-chip').forEach(chip => {
      chip.addEventListener('click', () => sendMsg(chip.textContent));
    });
  }

  // ═══ INIT ═══
  function init() {
    initDarkMode();
    initKeyboard();
    setTimeout(addBadges, 300);
    setTimeout(autoEnhanceButtons, 500);
    wireDeadButtons();
    initChatWidget();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
