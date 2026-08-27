// ─── Ask MedVerse — home page entry box ───
// The form itself posts to ask.html with target="_blank", so results open in a
// new tab with no JS required. This only adds the example chips and stops an
// empty query from opening a blank results tab.

const SUGGESTIONS = [
  "Options for moderate-to-severe AD after topicals failed",
  "Is Dupixent safe with a polysorbate allergy?",
  "Early detection and screening for type 1 diabetes",
  "Who is my MSL for dermatology?",
  "What Sanofi data was presented at AAD 2026?",
  "Inheritance patterns in Gaucher disease"
];

const form = document.getElementById("ask-home-form");
const input = document.getElementById("ask-home-input");
const hints = document.getElementById("ask-home-hints");

if (form && input) {
  form.addEventListener("submit", (e) => {
    if (!input.value.trim()) {
      e.preventDefault();
      input.focus();
    }
  });
}

if (hints) {
  // Rotate which examples appear so the page doesn't feel canned, but keep the
  // order stable within a single page load.
  const picks = SUGGESTIONS.slice(0, 4);
  picks.forEach(text => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "ask-home-chip";
    chip.textContent = text;
    chip.addEventListener("click", () => {
      input.value = text;
      // Match the form's own behaviour — results in a new tab.
      window.open("ask.html?q=" + encodeURIComponent(text), "_blank");
    });
    hints.appendChild(chip);
  });
}
