# MedVerse Executive Demo — Narrated Script & Shot List

**Purpose:** Get executive buy-in for MedVerse as an AI gateway feeding field intelligence — not "another website" — and show how it aligns with Project Orion and the medical organization's goals.
**Target runtime:** ~5–6 minutes
**Audience:** Executive sponsors evaluating investment/alignment, not hands-on users — keep pace brisk, keep narration strategic, let the product speak for the details.
**Where to record:** `http://localhost:5180/` (the main POC build — has HCP Concierge, Medical Concierge, MSL Copilot, and the full Agent Ecosystem in one place). Confirm the dev server is running before recording (`npm run dev` from `poc/`).

## How to record

1. Use Windows screen recording (Win+G / Xbox Game Bar) or OBS to capture the browser window at 1920×1080.
2. **Mute the app's built-in narration** before recording (click the speaker icon in the top-right of each page) — you'll read the script below live instead, so your voice carries the strategic framing the app's generic narration doesn't have.
3. Each demo in the app already runs itself once you click "Play Demo" / "Run Demo" / "Guided Tour" — you don't need to click through steps manually. Just narrate over it and use Next/Skip if a section runs long.
4. Record in one continuous take per scene if possible — easier to re-cut than to sync narration to playback afterward.
5. If a line says "(pause here)" — stop talking and let the visual land for 2–3 seconds before continuing.

---

## Scene 1 — Cold open: the thesis (30 sec)

**Screen:** `agents.html` (Agent Ecosystem), scrolled to the "Four-layer architecture" diagram.

**Say:**
> "Everyone's first reaction to MedVerse is that it's a website. It's not. It's an AI gateway — the layer that sits between every HCP interaction and Sanofi's scientific knowledge, and it feeds what it learns back to our field teams. What you're about to see are seven pieces of that system, live, today — not mockups."

**Action:** Hover over the four layers (User Experience → Agent Orchestration → Intelligence Hub → Compliance & Governance) as you say "layer."

---

## Scene 2 — HCP Concierge: the front door (45 sec)

**Screen:** `concierge.html` (HCP Concierge)

**Say:**
> "This is the front door for any HCP. One search box. Behind it: Clinical Q&A, Patient Navigator, Trial Matching, MSL Connect, Ingredient Safety, Stability Assessment — all routed automatically, all evidence-cited."

**Action:** Type or select the Clinical Q&A demo prompt. Let it answer.

**Say (as citations appear):**
> "Every answer is sourced — no hallucinated claims, and it's on-label by design. But here's the part that matters for Orion —"

**Action:** Point to / narrate the "Orion signal generation" language in the Clinical Q&A card description if visible, or state it directly.

**Say:**
> "— every one of these interactions generates a signal back to the field. When an HCP asks about a specific product or topic here, that's intelligence Orion can route to their MSL. This is the bi-directional loop: HCP self-service feeding field engagement, not a one-way FAQ page."

---

## Scene 3 — Expert Intelligence Hub: the foundation (40 sec)

**Screen:** `agents.html` → click the **Expert Intelligence Hub** card (or hub tile) to open its demo.

**Say:**
> "Underneath almost everything you'll see today is one hub: the Expert Intelligence Hub. 4.9 million HCP profiles, 13 million publications, 22 million congress participations, and now a live connection into Veeva Link's KOL directory. Every downstream agent — MSL Copilot, Advisory Board Builder, Congress Planning, Peer Connect — queries this hub before it makes a recommendation. Build it once, reuse it everywhere. That's platform thinking, not page-building."

**Action:** Let the demo run through its processing/output steps; no need to narrate every line.

---

## Scene 4 — MSL Copilot: field enablement (35 sec)

**Screen:** `msl-copilot.html`, run the pre-call briefing demo.

**Say:**
> "For our field teams, that same hub powers a pre-call briefing in seconds — expert profile, trial history, prior interactions, and a governance check before anything goes out. This is what Orion's field experience should feel like: the system already knows the HCP before the MSL walks in the room."

**Action:** Let the compliance-check step render (PASS / LOGGED badges) — this is a good visual, let it breathe. *(pause here)*

---

## Scene 5 — Congress Intelligence: breadth in real time (35 sec)

**Screen:** `congress.html`, run demo, or click a filter chip (e.g. AAD 2026).

**Say:**
> "Six major congresses, tracked continuously — key findings, MSL talking points, and Sanofi data flagged automatically. This isn't static content someone uploaded once. It's a living index the whole organization can query."

---

## Scene 6 — Peer & Expert Connect: newest capability (45 sec)

**Screen:** `agents.html` → **Peer & Expert Connect** card, run the demo, click into one expert's Veeva Link profile.

**Say:**
> "This one's brand new, and it's a good example of how fast we can move once the platform exists. An HCP describes a clinical problem they're trying to solve — here, a rheumatologist looking for peers with real-world experience combining two therapies in a hard-to-treat lupus nephritis population. The system searches Veeva Link, returns a ranked roster of matching peers and KOLs, and lets her open a full profile before requesting a scientific exchange."

**Action:** Click "View Veeva Link profile" on one card — let the expanded detail render. *(pause here)*

**Say:**
> "Built in under a day, on top of the same hub you saw earlier. That's the leverage this architecture gives us."

---

## Scene 7 — Compliance by design (30 sec)

**Screen:** Any open demo's compliance step (Peer Connect or MSL Copilot work well) — scroll to the PHI Protection / Promotional Risk / Audit Trail checks.

**Say:**
> "None of this works without trust. Every single interaction — HCP-facing or field-facing — passes through PHI protection, promotional risk screening, and an immutable audit log before anything reaches a person. Compliance isn't a review gate we bolt on afterward. It's in the architecture."

---

## Scene 8 — Close: the ask (30–40 sec)

**Screen:** Back to `agents.html` architecture diagram, or the stats row (business agents / hubs / governance agents / data sources).

**Say:**
> "What you saw today is real, running software — not a concept deck. Seven capabilities, one shared intelligence hub, and a compliance layer that runs underneath all of it. The next step is connecting this gateway to Orion's 2027 rollout, so every HCP interaction here becomes field intelligence there. What I need from this group is alignment to fund the next phase as a platform investment — not a website line item."

**Action:** End on a static frame of the architecture diagram or the MedVerse home screen.

---

## Optional trims if you need it shorter (~3–4 min)

Cut Scene 5 (Congress Intelligence) and Scene 7 (Compliance) into a single combined 30-second beat — mention compliance verbally over Scene 4's briefing output instead of giving it its own scene. Keep Scenes 1, 2, 3, 6, and 8 — those four carry the platform thesis, the newest proof point, and the ask.
