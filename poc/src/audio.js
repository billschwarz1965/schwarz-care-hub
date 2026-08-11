// ── MedVerse UI Sound Effects ──
// Subtle click/tap sounds via Web Audio API — no ambient, no music

(function () {
  const AUDIO_KEY = 'medverse-audio';
  let ctx = null;
  let masterGain = null;
  let enabled = localStorage.getItem(AUDIO_KEY) !== 'off';

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = enabled ? 0.4 : 0;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Soft tap — nav tabs, general buttons
  function playTap() {
    if (!enabled) return;
    const c = getCtx();
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Slightly brighter tap — agent/tool card selection
  function playSelect() {
    if (!enabled) return;
    const c = getCtx();
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.04);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Quick two-tone — search submit, confirmations
  function playConfirm() {
    if (!enabled) return;
    const c = getCtx();
    const now = c.currentTime;
    [700, 900].forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = now + i * 0.07;
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.09);
    });
  }

  // ═══ TOGGLE ═══
  function setEnabled(on) {
    enabled = on;
    localStorage.setItem(AUDIO_KEY, on ? 'on' : 'off');
    if (masterGain) masterGain.gain.value = on ? 0.4 : 0;
    updateIcon();
  }

  function updateIcon() {
    const btn = document.getElementById('mv-audio-toggle');
    if (!btn) return;
    btn.innerHTML = enabled
      ? '<i class="ti ti-volume"></i>'
      : '<i class="ti ti-volume-off"></i>';
    btn.title = enabled ? 'Sound on' : 'Sound off';
  }

  function injectToggle() {
    if (document.getElementById('mv-audio-toggle')) return;

    const btn = document.createElement('button');
    btn.id = 'mv-audio-toggle';
    btn.addEventListener('click', (e) => { e.stopPropagation(); setEnabled(!enabled); });

    const style = document.createElement('style');
    style.textContent = `
      .mv-audio-btn {
        background: none; border: 1px solid var(--border, #e4dff0); border-radius: 8px;
        width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: var(--text-secondary, #5a5672); font-size: 18px; transition: all 0.15s;
      }
      .mv-audio-btn:hover { border-color: var(--accent, #7a00e6); color: var(--accent, #7a00e6); }
    `;
    document.head.appendChild(style);

    // Standard pages with header-actions
    const actions = document.querySelector('.header-actions');
    if (actions) {
      btn.className = 'mv-audio-btn';
      actions.insertBefore(btn, actions.firstChild);
      updateIcon();
      return;
    }

    // Demo page — float near theme toggle
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
      btn.className = 'mv-audio-btn';
      btn.style.cssText = 'position:fixed;top:70px;right:20px;z-index:200;width:42px;height:42px;border-radius:50%;background:var(--surface,#fff);box-shadow:0 2px 10px rgba(0,0,0,0.15);';
      document.body.appendChild(btn);
      updateIcon();
    }
  }

  // ═══ WIRE SOUNDS ═══
  function wire() {
    document.querySelectorAll('.module-tab').forEach(el =>
      el.addEventListener('click', playTap));

    document.querySelectorAll('.agent-card, .tool-card, .toc-card, .fw-card').forEach(el =>
      el.addEventListener('click', playSelect));

    document.querySelectorAll('[class*="search-btn"], .playall-btn').forEach(el =>
      el.addEventListener('click', playConfirm));
  }

  function init() {
    injectToggle();
    wire();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.MedVerseAudio = { playTap, playSelect, playConfirm };
})();
