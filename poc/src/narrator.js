let voiceEnabled = true;
let ccEnabled = true;
let controlsInjected = false;

const RATE = 0.92;
const PITCH = 1.0;

// Female voices only — first match found wins. No male fallback: if none of
// these are installed, the browser's own default is used as a last resort
// rather than risking a male voice we didn't choose.
const FEMALE_VOICE_PREFS = [
  "Microsoft Jenny Online", "Microsoft Aria Online",
  "Microsoft Jenny", "Microsoft Aria", "Microsoft Zira",
  "Google US English", "Samantha",
];

function pickVoice(voices) {
  for (const name of FEMALE_VOICE_PREFS) {
    const v = voices.find(v => v.name.includes(name) && v.lang.startsWith("en"));
    if (v) return v;
  }
  return voices.find(v => v.lang.startsWith("en")) || voices[0] || null;
}

// speechSynthesis.getVoices() is frequently empty (or incomplete) on the
// first call. Local voices populate almost immediately, but Edge's "Online"
// neural voices (Jenny, Aria) are enumerated via a network call to
// Microsoft's speech service and can take a few seconds to show up in a
// later "voiceschanged" event. Resolving on the first voiceschanged — or on
// a short timeout — locks in a local voice (Zira/David) before the better
// online one ever arrives.
//
// So: keep listening across multiple voiceschanged events, and only settle
// early once we actually see one of our top-priority (online) voices.
// Otherwise wait out a longer timeout for them to arrive before falling
// back to whatever's best in the local list. Resolves once and caches the
// result so every speak() call — including the first — waits for it.
const TOP_PRIORITY_VOICES = ["Microsoft Jenny Online", "Microsoft Aria Online"];
// Only Edge exposes the online neural voices, and only over a network call —
// worth a longer wait there. Chrome/Firefox never will, so don't stall
// every first utterance for voices that can't arrive.
const IS_EDGE = /Edg\//.test(navigator.userAgent);
const VOICE_WAIT_MS = IS_EDGE ? 4000 : 400;

let voiceReadyPromise = null;
function ensureVoice() {
  if (voiceReadyPromise) return voiceReadyPromise;
  voiceReadyPromise = new Promise((resolve) => {
    let settled = false;
    const attempt = (isFinal) => {
      if (settled) return;
      const voices = speechSynthesis.getVoices();
      if (!voices.length && !isFinal) return;
      const hasTopPriority = voices.some(v => TOP_PRIORITY_VOICES.some(name => v.name.includes(name)));
      if (hasTopPriority || isFinal) {
        settled = true;
        resolve(pickVoice(voices));
      }
    };
    speechSynthesis.addEventListener("voiceschanged", () => attempt(false));
    attempt(false); // in case the list (or online voices) are already loaded
    // Give Edge's online voices time to enumerate over the network before
    // settling for a local fallback; elsewhere just wait for the local list.
    setTimeout(() => attempt(true), VOICE_WAIT_MS);
  });
  return voiceReadyPromise;
}

function injectControls() {
  if (controlsInjected) return;
  controlsInjected = true;

  const el = document.createElement("div");
  el.id = "narrator-controls";
  el.innerHTML = `
    <button id="narrator-voice-btn" title="Toggle voice narration">
      <i class="ti ti-volume"></i>
    </button>
    <button id="narrator-cc-btn" title="Toggle closed captions" class="nc-active">
      CC
    </button>
  `;
  document.body.appendChild(el);

  const style = document.createElement("style");
  style.textContent = `
    #narrator-controls {
      position: fixed; bottom: 70px; right: 20px;
      display: flex; gap: 6px; z-index: 1200;
      opacity: 0; pointer-events: none; transition: opacity 0.3s;
    }
    #narrator-controls.nc-visible { opacity: 1; pointer-events: auto; }
    #narrator-controls button {
      width: 38px; height: 38px; border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.25);
      background: rgba(10,10,20,0.85); color: #fff;
      cursor: pointer; display: flex; align-items: center;
      justify-content: center; font-size: 15px;
      backdrop-filter: blur(6px); transition: all 0.15s;
      font-family: var(--font, 'Work Sans', sans-serif);
    }
    #narrator-controls button:hover { border-color: #7a00e6; background: rgba(122,0,230,0.25); }
    #narrator-controls button.nc-active { border-color: #7a00e6; color: #c084fc; }
    #narrator-controls button.nc-muted { opacity: 0.45; }
    #narrator-controls #narrator-cc-btn { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
  `;
  document.head.appendChild(style);

  document.getElementById("narrator-voice-btn").addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;
    const btn = document.getElementById("narrator-voice-btn");
    btn.innerHTML = voiceEnabled ? '<i class="ti ti-volume"></i>' : '<i class="ti ti-volume-off"></i>';
    btn.classList.toggle("nc-muted", !voiceEnabled);
    if (!voiceEnabled) speechSynthesis.cancel();
  });

  document.getElementById("narrator-cc-btn").addEventListener("click", () => {
    ccEnabled = !ccEnabled;
    const btn = document.getElementById("narrator-cc-btn");
    btn.classList.toggle("nc-active", ccEnabled);
    const bar = document.getElementById("demo-narrator");
    if (bar && !ccEnabled) bar.classList.remove("visible");
  });

}

// Start resolving the voice list as soon as this module loads, well before
// the first speak() call, so that first call doesn't have to wait either.
ensureVoice();

export async function speak(text) {
  if (!voiceEnabled || !text) return;
  const voice = await ensureVoice();
  speechSynthesis.cancel();

  const plain = text.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, "");
  const utter = new SpeechSynthesisUtterance(plain);
  if (voice) utter.voice = voice;
  utter.rate = RATE;
  utter.pitch = PITCH;
  utter.volume = 0.85;
  speechSynthesis.speak(utter);
}

export async function speakAndWait(text, minMs = 2000) {
  if (!text) return;

  const plain = text.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, "");
  const start = Date.now();

  if (!voiceEnabled) {
    await new Promise(resolve => setTimeout(resolve, minMs));
    return;
  }

  const voice = await ensureVoice();

  return new Promise(resolve => {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(plain);
    if (voice) utter.voice = voice;
    utter.rate = RATE;
    utter.pitch = PITCH;
    utter.volume = 0.85;

    utter.onend = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minMs - elapsed);
      setTimeout(resolve, remaining);
    };
    utter.onerror = () => {
      const elapsed = Date.now() - start;
      setTimeout(resolve, Math.max(0, minMs - elapsed));
    };

    speechSynthesis.speak(utter);
  });
}

export function stopSpeaking() {
  speechSynthesis.cancel();
}

export function showControls() {
  injectControls();
  document.getElementById("narrator-controls").classList.add("nc-visible");
}

export function hideControls() {
  const el = document.getElementById("narrator-controls");
  if (el) el.classList.remove("nc-visible");
}

export function isCCEnabled() {
  return ccEnabled;
}
