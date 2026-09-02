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

  // ═══ POC DISCLAIMER BANNER ═══
  // Every page across every edition loads this file, so one banner here
  // covers the whole app instead of editing each page's header markup.
  // Dismiss is per-tab-session only (sessionStorage) — it comes back on a
  // fresh visit, so a demo audience isn't left thinking this is production.
  const POC_BANNER_KEY = 'medverse-poc-banner-dismissed';
  function initPocBanner() {
    if (sessionStorage.getItem(POC_BANNER_KEY)) return;
    const header = document.querySelector('.header');
    if (!header) return;

    const style = document.createElement('style');
    style.textContent = `
      .mv-poc-banner { display: flex; align-items: center; gap: 10px; padding: 8px 24px;
        background: var(--warning-bg, #fef9c3); color: var(--warning, #854d0e);
        border-bottom: 1px solid var(--border, #e4dff0); font-family: var(--font, inherit);
        font-size: 12.5px; line-height: 1.5; flex-shrink: 0; }
      .mv-poc-banner i.ti-flask-2 { font-size: 16px; flex-shrink: 0; }
      .mv-poc-banner strong { font-weight: 700; }
      .mv-poc-banner-text { flex: 1; }
      .mv-poc-banner-close { background: none; border: none; color: inherit; opacity: 0.6;
        cursor: pointer; font-size: 15px; padding: 2px 4px; flex-shrink: 0; }
      .mv-poc-banner-close:hover { opacity: 1; }
      html.dark .mv-poc-banner, [data-theme="dark"] .mv-poc-banner {
        background: rgba(249,200,81,0.1); color: #f9c851; }
    `;
    document.head.appendChild(style);

    const banner = document.createElement('div');
    banner.className = 'mv-poc-banner';
    banner.innerHTML = `
      <i class="ti ti-flask-2"></i>
      <span class="mv-poc-banner-text"><strong>Proof of concept</strong> — illustrative demo with example/synthetic data and a few live read-only connections (e.g. PubMed, ClinicalTrials.gov). Not built or reviewed for production use.</span>
      <button class="mv-poc-banner-close" title="Dismiss for this session"><i class="ti ti-x"></i></button>
    `;
    header.insertAdjacentElement('afterend', banner);
    banner.querySelector('.mv-poc-banner-close').addEventListener('click', () => {
      banner.remove();
      sessionStorage.setItem(POC_BANNER_KEY, '1');
    });
  }

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
  const chatPages = ['medical.html', 'patient.html', 'msl-copilot.html', 'system-tools.html', 'concierge.html'];
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
    orion: 'Interaction Signals: 3 new signals detected this week. High priority: increased off-label interest in Type 2 inflammation across rheumatology. Medium: competitive launch activity in asthma market. Signal confidence: 87%.',
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
    const isMSL = page.includes('msl-copilot');
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
      ? ['Interaction signals', 'Disease landscape', 'Literature search', 'Congress updates']
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

  // ═══ VOICE SEARCH ═══
  function initVoiceSearch() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const targets = document.querySelectorAll(
      '.hub-search-input, #search-input, #chat-input, #trial-search-input, #demo-prompt-input, #mv-chat-input, .form-input[type="text"], input.form-input:not([type])'
    );

    targets.forEach(input => {
      if (input._mvMic) return;
      input._mvMic = true;

      const wrap = input.parentElement;
      if (!wrap) return;
      if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';

      const mic = document.createElement('button');
      mic.type = 'button';
      mic.className = 'mv-voice-btn';
      mic.title = 'Voice search';
      mic.innerHTML = '<i class="ti ti-microphone"></i>';
      input.after(mic);

      let recognition = null;

      mic.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mic.classList.contains('listening')) {
          if (recognition) recognition.stop();
          return;
        }
        recognition = new SpeechRec();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        mic.classList.add('listening');
        mic.innerHTML = '<i class="ti ti-loader-2 mv-spin"></i>';

        recognition.onresult = (ev) => {
          let transcript = '';
          for (let i = ev.resultIndex; i < ev.results.length; i++) {
            transcript += ev.results[i][0].transcript;
          }
          input.value = transcript;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        };
        recognition.onend = () => {
          mic.classList.remove('listening');
          mic.innerHTML = '<i class="ti ti-microphone"></i>';
          recognition = null;
          if (input.value.trim()) {
            const form = input.closest('form');
            const goBtn = input.parentElement.querySelector('.hub-search-go, [id$="-submit"], .mv-chat-send, button[type="submit"]')
              || input.nextElementSibling?.matches?.('button') && input.nextElementSibling;
            if (goBtn && goBtn !== mic) goBtn.click();
            else input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          }
        };
        recognition.onerror = (ev) => {
          mic.classList.remove('listening');
          mic.innerHTML = '<i class="ti ti-microphone"></i>';
          if (ev.error !== 'aborted' && ev.error !== 'no-speech') {
            if (window.mvToast) mvToast('Voice input unavailable: ' + ev.error, 'warning');
          }
        };
        recognition.start();
      });
    });
  }

  // ═══ SEARCHABLE SELECTS ═══
  function initSearchableSelects() {
    document.querySelectorAll('select.form-select, select[class*="form-"]').forEach(sel => {
      if (sel._mvSearchable || sel.options.length < 4) return;
      sel._mvSearchable = true;

      const wrapper = document.createElement('div');
      wrapper.className = 'mv-searchsel';
      sel.parentNode.insertBefore(wrapper, sel);

      const display = document.createElement('button');
      display.type = 'button';
      display.className = 'mv-searchsel-btn';
      const selText = () => sel.options[sel.selectedIndex]?.text || 'Select…';
      display.innerHTML = `<span class="mv-searchsel-text">${selText()}</span><i class="ti ti-chevron-down mv-searchsel-arrow"></i>`;

      const dropdown = document.createElement('div');
      dropdown.className = 'mv-searchsel-dropdown';

      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.className = 'mv-searchsel-search';
      searchInput.placeholder = 'Type to filter…';

      const list = document.createElement('div');
      list.className = 'mv-searchsel-list';

      function buildOptions(filter) {
        list.innerHTML = '';
        const f = (filter || '').toLowerCase();
        Array.from(sel.options).forEach((opt, i) => {
          if (f && !opt.text.toLowerCase().includes(f)) return;
          const item = document.createElement('div');
          item.className = 'mv-searchsel-item' + (i === sel.selectedIndex ? ' selected' : '');
          item.textContent = opt.text;
          item.addEventListener('click', () => {
            sel.selectedIndex = i;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            display.querySelector('.mv-searchsel-text').textContent = opt.text;
            close();
          });
          list.appendChild(item);
        });
      }

      searchInput.addEventListener('input', () => buildOptions(searchInput.value));
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const first = list.querySelector('.mv-searchsel-item');
          if (first) first.click();
        }
        if (e.key === 'Escape') close();
      });

      dropdown.appendChild(searchInput);
      dropdown.appendChild(list);
      wrapper.appendChild(display);
      wrapper.appendChild(dropdown);

      sel.style.display = 'none';
      wrapper.appendChild(sel);

      function open() {
        wrapper.classList.add('open');
        searchInput.value = '';
        buildOptions('');
        requestAnimationFrame(() => searchInput.focus());
      }
      function close() {
        wrapper.classList.remove('open');
      }

      display.addEventListener('click', (e) => {
        e.stopPropagation();
        if (wrapper.classList.contains('open')) close();
        else {
          document.querySelectorAll('.mv-searchsel.open').forEach(w => w.classList.remove('open'));
          open();
        }
      });

      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) close();
      });

      sel.addEventListener('change', () => {
        display.querySelector('.mv-searchsel-text').textContent = selText();
      });
    });
  }

  // ═══ DEMO LAUNCHER ═══
  // Every module had its own demo trigger with its own label ("Run Demo",
  // "Play Demo", "Guided Tour") in its own spot — some in the header, some
  // mid-page. This harmonizes the label everywhere and guarantees a header
  // launcher on every page, so a demo is always one click away from the top.
  const DEMO_LABEL = 'Play Demo';
  const PRIMARY_TRIGGERS = ['#run-demo', '#demo-play-btn'];

  function findPrimaryTrigger() {
    for (const sel of PRIMARY_TRIGGERS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function setDemoLabel(btn) {
    const icon = btn.querySelector('i');
    const iconClass = icon ? icon.className : 'ti ti-player-play';
    btn.innerHTML = `<i class="${iconClass}"></i> ${DEMO_LABEL}`;
  }

  function initDemoLauncher() {
    const trigger = findPrimaryTrigger();

    // Harmonize the in-page trigger's label wherever it lives.
    if (trigger) setDemoLabel(trigger);

    // If the page's own trigger is already visible in the header, relabeling it
    // is the whole job — injecting another would show two "Play Demo" buttons.
    const headerEl = document.querySelector('.header, header');
    if (trigger && headerEl && headerEl.contains(trigger)) return;

    // Prefer the dedicated actions container; a few pages only have the outer
    // header row, so fall back to that rather than skipping the launcher.
    let actions = document.querySelector('.header-actions');
    if (!actions) {
      const inner = document.querySelector('.header-inner');
      if (inner) {
        actions = document.createElement('div');
        actions.className = 'header-actions';
        actions.style.marginLeft = 'auto';
        actions.style.display = 'flex';
        actions.style.alignItems = 'center';
        actions.style.gap = '10px';
        // Keep any existing right-aligned badge to the right of the button.
        const badge = inner.querySelector('.header-badge');
        if (badge) {
          inner.insertBefore(actions, badge);
          actions.appendChild(badge);
        } else {
          inner.appendChild(actions);
        }
      }
    }
    if (!actions) return;

    const btn = document.createElement('button');
    btn.className = 'mv-header-demo-btn';
    btn.id = 'mv-header-demo';
    btn.title = trigger
      ? 'Play this module\'s demo'
      : 'Open the MedVerse demo hub';
    btn.innerHTML = `<i class="ti ti-player-play"></i> ${DEMO_LABEL}`;

    btn.addEventListener('click', () => {
      const live = findPrimaryTrigger();
      if (live) {
        live.scrollIntoView({ behavior: 'smooth', block: 'center' });
        live.click();
      } else {
        // No demo on this page — send them to the demo hub instead.
        window.location.href = 'demo.html';
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      .mv-header-demo-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 14px; background: var(--accent, #7a00e6); color: #fff;
        border: none; border-radius: 8px; cursor: pointer;
        font-family: var(--font, 'Work Sans', sans-serif);
        font-size: 12px; font-weight: 600; white-space: nowrap;
        transition: opacity .15s;
      }
      .mv-header-demo-btn:hover { opacity: .9; }
    `;
    document.head.appendChild(style);

    actions.insertBefore(btn, actions.firstChild);
  }

  // ═══ PERSISTENT ASK BAR ═══
  // Ask MedVerse used to live only on the home page, so getting back to it from
  // any module meant navigating away first. This puts it on every page as a slim
  // bar under the module nav — except where the page already has its own (the
  // home hero box and the results page's own bar), so nothing doubles up.
  //
  // Gated on a <meta name="medverse-ask"> tag naming the results page, because
  // the single-module editions (poc-agents, poc-patient) ship no ask.html and
  // must not get a bar that leads nowhere.
  function initAskBar() {
    const meta = document.querySelector('meta[name="medverse-ask"]');
    if (!meta) return;
    const target = meta.getAttribute('content') || 'ask.html';

    // Already has a search entry point? Leave it alone.
    if (document.getElementById('ask-home-form') || document.getElementById('ask-form')) return;

    // Normally sits under the module nav, else under the header. The standalone
    // dashboard pages (build-economics, user-journeys) carry no app chrome at
    // all, so there the bar goes at the top of the body — the point is that
    // search is reachable from every page without navigating away.
    const anchor = document.querySelector('.module-nav')
      || document.querySelector('.header')
      || document.querySelector('header');

    const style = document.createElement('style');
    style.textContent = `
      .mv-askbar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 8px 24px; flex-shrink: 0; }
      .mv-askbar form { display: flex; gap: 8px; max-width: 1100px; margin: 0 auto; position: relative; }
      .mv-askbar-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 15px; color: var(--accent); pointer-events: none; z-index: 1; }
      .mv-askbar input { flex: 1; padding: 8px 12px 8px 36px; border: 1.5px solid var(--border); border-radius: 9px;
        font-family: var(--font); font-size: 12.5px; outline: none; background: var(--bg); color: var(--text);
        transition: border-color .15s, box-shadow .15s; }
      .mv-askbar input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(122,0,230,.07); }
      .mv-askbar input::placeholder { color: var(--text-muted); }
      .mv-askbar button { padding: 8px 16px; background: var(--accent); color: #fff; border: none; border-radius: 9px;
        font-family: var(--font); font-size: 12.5px; font-weight: 600; cursor: pointer; white-space: nowrap;
        display: inline-flex; align-items: center; gap: 5px; transition: background .15s; }
      .mv-askbar button:hover { background: var(--accent-hover); }
      @media (max-width: 640px) { .mv-askbar { padding: 8px 14px; } .mv-askbar button span { display: none; } }
    `;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.className = 'mv-askbar';
    wrap.innerHTML = `
      <form id="mv-askbar-form" action="${target}" method="get" target="_blank">
        <i class="ti ti-sparkles mv-askbar-icon"></i>
        <input id="mv-askbar-input" name="q" type="text" autocomplete="off"
               placeholder="Ask MedVerse anything — routed to the right agents, opens in a new tab">
        <button type="submit"><i class="ti ti-arrow-right"></i> <span>Ask</span></button>
      </form>`;

    wrap.querySelector('form').addEventListener('submit', (e) => {
      if (!wrap.querySelector('input').value.trim()) {
        e.preventDefault();
        wrap.querySelector('input').focus();
      }
    });

    if (anchor) anchor.insertAdjacentElement('afterend', wrap);
    else document.body.insertBefore(wrap, document.body.firstChild);

    // "/" focuses the bar from anywhere, as long as you are not already typing.
    document.addEventListener('keydown', (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      wrap.querySelector('input').focus();
    });
  }

  // ═══ INIT ═══
  function init() {
    initPocBanner();
    initDarkMode();
    initDemoLauncher();
    initAskBar();
    initKeyboard();
    setTimeout(addBadges, 300);
    setTimeout(autoEnhanceButtons, 500);
    wireDeadButtons();
    initChatWidget();
    setTimeout(initVoiceSearch, 600);
    setTimeout(initSearchableSelects, 400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ═══ SERVICE WORKER ═══
// On localhost, actively tear the worker down and purge its caches. An earlier
// version cached /src/*.js cache-first, which meant a browser could keep
// serving code that no longer matched the source — fixes appeared not to work,
// and a stale build could be demoed as if it were current. Unregistering here
// self-heals any browser still holding that state.
if ('serviceWorker' in navigator) {
  const isDev = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);

  if (isDev) {
    navigator.serviceWorker.getRegistrations()
      .then(regs => Promise.all(regs.map(r => r.unregister())))
      .then(() => (window.caches ? caches.keys() : []))
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .catch(() => { /* nothing to clean up */ });
  } else {
    // Page-relative, not '/sw.js'. The demo builds are served from a sub-path
    // on GitHub Pages (/Medverse/poc-external/ and friends), where a
    // root-absolute path resolves to an origin-root URL that does not exist —
    // the registration 404'd on every page of every edition, so the worker
    // never installed at all. Resolving against document.baseURI also keeps
    // the worker's scope at the edition directory, which stops the three
    // editions sharing one origin from competing for a single root scope.
    navigator.serviceWorker
      .register(new URL('sw.js', document.baseURI).href)
      .catch((err) => {
        // Surfaced rather than swallowed: a failure here means offline support
        // is silently absent, which is exactly how the bug above went unseen.
        console.warn('Service worker registration failed:', err);
      });
  }
}

// ═══ UI SOUNDS ═══
import('./audio.js');

