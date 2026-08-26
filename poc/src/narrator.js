let voiceEnabled = true;
let ccEnabled = true;
let controlsInjected = false;

const RATE = 0.92;
const PITCH = 1.0;

// Only Edge exposes the online neural voices (Jenny, Aria, Guy, ...), and
// only over a network call to Microsoft's speech service — worth waiting
// longer for there. Chrome/Firefox never will, so don't stall every first
// utterance for voices that can't arrive.
const IS_EDGE = /Edg\//.test(navigator.userAgent);
const VOICE_WAIT_MS = IS_EDGE ? 4000 : 400;

const VOICE_PREFS = {
  female: [
    "Microsoft Jenny Online", "Microsoft Aria Online",
    "Microsoft Jenny", "Microsoft Aria", "Microsoft Zira",
    "Google US English", "Samantha",
  ],
  male: [
    "Microsoft Guy Online", "Microsoft Andrew Online",
    "Microsoft Guy", "Microsoft David", "Microsoft Mark", "Alex",
  ],
};
// Names that count as "we found one of the good online voices, stop waiting".
const TOP_PRIORITY_VOICES = [
  "Microsoft Jenny Online", "Microsoft Aria Online",
  "Microsoft Guy Online", "Microsoft Andrew Online",
];
// Explicit, named order for "mixed" mode — Jenny leads deliberately rather
// than however the browser happens to list voices, so she's always in the
// rotation whenever she's installed, with Guy and Aria filling out the mix.
const MIXED_VOICE_ORDER = [
  "Microsoft Jenny Online", "Microsoft Guy Online", "Microsoft Aria Online",
  "Microsoft Jenny", "Microsoft Guy", "Microsoft Aria",
  "Microsoft Zira", "Microsoft David", "Microsoft Mark", "Alex", "Samantha",
];

const MODE_KEY = "medverse-narrator-voice-mode";
const MODES = ["female", "male", "mixed"];
const MODE_META = {
  female: { icon: "gender-female", label: "Female voice" },
  male: { icon: "gender-male", label: "Male voice" },
  mixed: { icon: "arrows-shuffle", label: "Mixed voices" },
};

function loadMode() {
  const saved = localStorage.getItem(MODE_KEY);
  return MODES.includes(saved) ? saved : "female";
}
let voiceMode = loadMode();

function findByPrefs(voices, prefs) {
  for (const name of prefs) {
    const v = voices.find(v => v.name.includes(name) && v.lang.startsWith("en"));
    if (v) return v;
  }
  return null;
}

// Resolves once to the full classified voice set (best female match, best
// male match, and an ordered "mixed" rotation of every distinct natural
// voice found). speechSynthesis.getVoices() is frequently empty — or
// missing Edge's online voices, which enumerate over the network — on the
// first call, so this waits out voiceschanged (bounded by VOICE_WAIT_MS)
// before caching a result every speak() call then reuses.
let voiceSetPromise = null;
function ensureVoiceSet() {
  if (voiceSetPromise) return voiceSetPromise;
  voiceSetPromise = new Promise((resolve) => {
    let settled = false;
    const attempt = (isFinal) => {
      if (settled) return;
      const voices = speechSynthesis.getVoices();
      if (!voices.length && !isFinal) return;
      const hasTopPriority = voices.some(v => TOP_PRIORITY_VOICES.some(name => v.name.includes(name)));
      if (hasTopPriority || isFinal) {
        settled = true;
        const female = findByPrefs(voices, VOICE_PREFS.female);
        const male = findByPrefs(voices, VOICE_PREFS.male);
        const anyEnglish = voices.find(v => v.lang.startsWith("en")) || voices[0] || null;
        const rotation = MIXED_VOICE_ORDER
          .map(name => voices.find(v => v.name.includes(name) && v.lang.startsWith("en")))
          .filter(Boolean)
          .filter((v, i, arr) => arr.findIndex(o => o.name === v.name) === i)
          .slice(0, 3);
        resolve({ female: female || anyEnglish, male: male || anyEnglish, rotation: rotation.length ? rotation : [anyEnglish].filter(Boolean) });
      }
    };
    speechSynthesis.addEventListener("voiceschanged", () => attempt(false));
    attempt(false); // in case the list (or online voices) is already loaded
    setTimeout(() => attempt(true), VOICE_WAIT_MS);
  });
  return voiceSetPromise;
}

let mixedIndex = 0;
async function pickVoiceForUtterance() {
  const set = await ensureVoiceSet();
  if (voiceMode === "male") return set.male;
  if (voiceMode === "mixed") {
    const voice = set.rotation[mixedIndex % set.rotation.length] || set.female;
    mixedIndex++;
    return voice;
  }
  return set.female;
}

function injectControls() {
  if (controlsInjected) return;
  controlsInjected = true;

  const el = document.createElement("div");
  el.id = "narrator-controls";
  el.innerHTML = `
    <button id="narrator-voice-mode-btn" title="${MODE_META[voiceMode].label} — click to change">
      <i class="ti ti-${MODE_META[voiceMode].icon}"></i>
    </button>
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

  document.getElementById("narrator-voice-mode-btn").addEventListener("click", () => {
    const btn = document.getElementById("narrator-voice-mode-btn");
    voiceMode = MODES[(MODES.indexOf(voiceMode) + 1) % MODES.length];
    localStorage.setItem(MODE_KEY, voiceMode);
    mixedIndex = 0;
    btn.innerHTML = `<i class="ti ti-${MODE_META[voiceMode].icon}"></i>`;
    btn.title = `${MODE_META[voiceMode].label} — click to change`;
  });

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

// Start resolving the voice set as soon as this module loads, well before
// the first speak() call, so that first call doesn't have to wait either.
ensureVoiceSet();

export async function speak(text) {
  if (!voiceEnabled || !text) return;
  const voice = await pickVoiceForUtterance();
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

  const voice = await pickVoiceForUtterance();

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
