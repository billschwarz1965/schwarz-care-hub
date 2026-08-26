# HCP Concierge — Demo Run-Books

Four presenter scripts, each self-contained. Every input below is verified against
the current build — if you type what it says, you will get what it describes.

**Setup for all four:** `npm --prefix poc run dev`, then
**http://localhost:5180/concierge.html**. Reload (F5) before starting so the
signal sidebar begins empty.

| Demo | Audience | Runtime | Agents shown |
|---|---|---|---|
| [1 — The five-minute overview](#demo-1--the-five-minute-overview) | Executives, first-time viewers | 5 min | Clinical Q&A, Trial Matching, MSL Connect |
| [2 — Evidence you can check](#demo-2--evidence-you-can-check) | Medical, MLR, scientific audiences | 10 min | Clinical Q&A, Literature Intelligence, Literature Scout |
| [3 — One mechanism, three diseases](#demo-3--one-mechanism-three-diseases) | Scientific leadership, cross-TA | 10 min | Disease Navigator, Congress Intelligence, Clinical Q&A |
| [4 — Point-of-care practicalities](#demo-4--point-of-care-practicalities) | Field medical, pharmacy, ops | 8 min | Ingredient Safety, Temperature Stability, Patient Navigator, MSL Connect |

---

## Demo 1 — The five-minute overview

**The point:** an HCP asks a question in plain language, gets a cited answer, and
every interaction becomes an interaction signal.

### 1. Open on the agent grid (30s)

Land on `concierge.html` without clicking anything.

> "This is what a healthcare professional sees. Ten agents, each owning one job.
> No menus to learn — they can also just ask."

**On screen:** ten agent cards. Point out the right-hand **Interaction Signals**
sidebar reading zero.

### 2. Clinical Q&A (2 min)

Click **Clinical Q&A**. Click the suggested prompt chip **"AD treatment options"**.

> "A 45-year-old with moderate-to-severe atopic dermatitis who has failed
> topicals. This is the question a dermatologist actually asks."

**On screen, after ~2s:** a structured treatment answer, source citations beneath
it, and follow-up chips appear ("How does dupilumab compare to abrocitinib in
head-to-head data?", "What are the active clinical trials in the dupilumab
program?", "Explain type 2 inflammation…").

**Now point at the sidebar** — it has gone from 0 to 1.

> "That's the part that matters. The answer helped the clinician. The signal tells
> Medical Affairs which questions are actually being asked."

### 3. Trial Matching (1.5 min)

Back arrow → **Trial Matching Agent**. Enter:

| Field | Value |
|---|---|
| Indication | `Atopic Dermatitis` |
| Age | `32` |
| Prior biologics | `Biologic-naïve` |
| Region | `United States` |

Click **Find Matching Trials**.

**On screen:** `3 trials found` — LIBERTY AD PED (ENROLLING), DUPIXENT REAL
(OPEN), and a third. Each row has **View Protocol** and **Contact MSL**.

> "Eligibility, phase, site count, geography. And a route to a human on every
> result."

### 4. MSL Connect (1 min)

Back arrow → **MSL Connect**. Enter:

| Field | Value |
|---|---|
| Therapeutic area | `Dermatology / Atopic Dermatitis` |
| Region | `Northeast US` |
| Topic | `Dupixent long-term safety data` |

Click **Find My MSL**.

**On screen:** Dr. Amanda Rodriguez, PharmD — Northeast US, availability, listed
expertise, **Request Meeting** button.

> "The loop closes with a person. The AI did the triage; the scientific exchange
> is still human."

### Close

> "Ten agents, one question box, and a signal from every interaction."

---

## Demo 2 — Evidence you can check

**The point:** nothing is asserted without a source, and the platform watches the
literature so the clinician doesn't have to.

### 1. Clinical Q&A with a comparative question (3 min)

**Clinical Q&A** → click the chip **"Dupixent competitors"** (or type
`How does dupilumab compare to abrocitinib in head-to-head data?`).

**On screen:** a comparative answer with named trial data and citations.

> "Note what it did *not* do — it didn't declare a winner. Comparative efficacy
> with the safety context attached, sourced."

Scroll to the citations.

> "Every claim resolves to a document. If MLR asks where a number came from,
> it's right here."

### 2. Literature Intelligence (3 min)

Back arrow → **Literature Intelligence**. Enter:

| Field | Value |
|---|---|
| Query | `dupilumab atopic dermatitis long-term safety` |
| Publication type | `All types` |
| Date range | `Any time` |

Click **Search Literature**.

**On screen:** `5 results found`, led by *LIBERTY AD CHRONOS 4-Year Results*
(J Am Acad Dermatol, 2026), tagged `Clinical Trial` and `HIGH IMPACT`, each with
**PubMed** and **Summary** actions.

Now change **Publication type** to `Meta-Analysis` and search again.

> "Same query, filtered to the evidence tier they trust."

### 3. Literature Scout (3 min)

Back arrow → **Literature Scout**. Enter:

| Field | Value |
|---|---|
| Therapeutic area | `Atopic Dermatitis` |
| Keywords | `biologic sequencing` |

Click **Check for Alerts**.

**On screen:** `4 recent publication alerts`, including a `COMPETITOR`-tagged JAK
inhibitor safety item and a `GUIDELINE`-tagged AAD update. Several are marked
**Priority Read** with an **AI Summary** action.

> "This is the difference between search and surveillance. Search is what you do
> when you already know to look. Scout tells you a competitor's safety signal
> landed in the BMJ this month."

### Close

> "Cited on demand, and monitored continuously."

---

## Demo 3 — One mechanism, three diseases

**The point:** the cross-therapeutic-area story — MedVerse's strongest scientific
differentiator.

### 1. Disease Navigator (4 min)

**Disease Navigator** → Disease `Atopic Dermatitis`, Focus Area `Full overview`
→ **Load Disease Profile**.

**On screen:** disease profile with Pathophysiology, Treatment Landscape,
**Cross-TA Connections**, and Sanofi Pipeline sections.

> "Barrier dysfunction, then IL-4 and IL-13 driving the type 2 response."

Scroll to **Cross-TA Connections**.

> "Here's the move. The same mechanism shows up in asthma, in nasal polyps, in
> eosinophilic esophagitis. A dermatologist and a pulmonologist are treating one
> immunologic process in two organs."

⚠️ **Presenter note:** leave Focus Area on `Full overview`. The dropdown is
currently inert — changing it produces identical output, so don't invite the
comparison. Stick to `Atopic Dermatitis` or `Rheumatoid Arthritis`; the other five
options return a "being developed" stub.

### 2. Congress Intelligence (3 min)

Back arrow → **Congress Intelligence**. Select
`AAD 2026 — American Academy of Dermatology` → **Load Coverage**.

**On screen:** AAD 2026, San Francisco, Mar 20–24 2026, `COMPLETED`;
**Key Highlights** (3 items, including 4-year dupilumab AD safety data);
**Presentations** (4 total); **View Full Congress Coverage**.

**Point at the signals sidebar** — Congress Intelligence writes a cross-module
signal.

> "That one's visible platform-wide, not just in this session."

### 3. Tie it back with Clinical Q&A (2 min)

Back arrow → **Clinical Q&A** → chip **"Type 2 inflammation"**.

> "The clinician doesn't need to know we have a disease module and a congress
> module. They ask one question, and the answer draws on both."

### Close

> "Single mechanism, multiple organ systems, one evidence base."

---

## Demo 4 — Point-of-care practicalities

**The point:** the unglamorous questions that actually block a prescription.

### 1. Ingredient Safety (2.5 min)

**Ingredient Safety** → Product `Dupixent (dupilumab)`, Allergy/restriction
`latex` → **Check Ingredients**.

**On screen:** a `WARNING` **Allergy Alert** — the pre-filled syringe needle cap
contains a natural rubber latex derivative, *use the pen device for
latex-allergic patients* — above the full excipient list (L-histidine, L-arginine
hydrochloride, and so on).

> "That's a real prescribing decision. Same molecule, different device, and the
> agent tells them which one."

Optionally rerun with `polysorbate`.

### 2. Temperature Stability (2.5 min)

Back arrow → **Temperature Stability** → Product
`Dupixent (dupilumab) — Pre-filled syringe`, Scenario `Room temperature excursion`
→ **Check Stability**.

**On screen:** refrigerated range 2–8°C, 36-month shelf life, and a
`Room Temperature Storage ALLOWED` block — max 25°C, **max 14 days**.

> "A patient left it on the counter. Is it still good? Fourteen days at 25 degrees.
> That's a phone call answered in five seconds instead of a wasted prescription."

### 3. Patient Navigator (2 min)

Back arrow → **Patient Navigator**. Enter:

| Field | Value |
|---|---|
| Age | `45` |
| Sex | `Female` |
| Primary diagnosis | `Atopic Dermatitis (moderate-to-severe)` |
| Comorbidities | click `Asthma` |
| Prior therapy | click `Topical CS` |

Click **Generate Care Pathway**.

**On screen:** *Care Pathway Recommendation*, badged `AI-GENERATED`, headed
"Patient: 45yo Female with Atopic Dermatitis (moderate-to-severe)", then
**Step 1: Confirm Disease Severity** (`ASSESSMENT`) — EASI, IGA, BSA, DLQI — and
subsequent steps.

> "Note the comorbid asthma changes the reasoning. One mechanism, two
> indications — that's an argument for a systemic choice, not two local ones."

### 4. MSL Connect (1 min)

Back arrow → **MSL Connect** → `Dermatology / Atopic Dermatitis`, `West US`,
topic `Device options for latex-allergic patients` → **Find My MSL**.

**On screen:** Dr. James Park, PhD — West US.

### Close

> "Formulation, cold chain, care pathway, and a human. The whole point is removing
> friction from the moment of decision."

---

## Presenter cheat-sheet

| Agent | Fastest input that always produces a rich result |
|---|---|
| Clinical Q&A | Prompt chip "AD treatment options" |
| Patient Navigator | `45` / `Female` / `Atopic Dermatitis (moderate-to-severe)` |
| Trial Matching | `Atopic Dermatitis` / `32` / `Biologic-naïve` / `United States` |
| MSL Connect | `Dermatology / Atopic Dermatitis` / `Northeast US` |
| Ingredient Safety | `Dupixent (dupilumab)` / `latex` |
| Temperature Stability | `Dupixent … Pre-filled syringe` / `Room temperature excursion` |
| Literature Intelligence | `dupilumab atopic dermatitis long-term safety` |
| Literature Scout | `Atopic Dermatitis` / `biologic sequencing` |
| Disease Navigator | `Atopic Dermatitis` / `Full overview` |
| Congress Intelligence | `AAD 2026 — American Academy of Dermatology` |

**Avoid on stage:** Disease Navigator focus areas other than `Full overview`;
Disease Navigator diseases other than Atopic Dermatitis and Rheumatoid Arthritis;
MSL Connect regions other than Northeast US, West US, or EU — Germany.
