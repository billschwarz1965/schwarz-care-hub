# HCP Concierge — Manual Test Scripts

Three test scripts for each of the module's ten agents. Every expected result below
was verified by execution against the current build, except the three marked
`KNOWN DEFECT`, which assert intended behaviour and currently fail.

**Setup:** `npm --prefix poc run dev` → **http://localhost:5180/concierge.html**.
Reload (F5) before each test. Return to the agent grid with the header back arrow.

**Timing:** every agent simulates a 0.8–2.5s delay before rendering. Wait for the
spinner to clear before judging a result.

## Summary

| Agent | Tests | Known defects |
|---|---|---|
| Clinical Q&A | TC-CQA-01 … 03 | TC-CQA-03 |
| Patient Navigator | TC-PNV-01 … 03 | — |
| Trial Matching | TC-TRM-01 … 03 | — |
| MSL Connect | TC-MSL-01 … 03 | — |
| Ingredient Safety | TC-ING-01 … 03 | — |
| Temperature Stability | TC-TST-01 … 03 | — |
| Literature Intelligence | TC-LIT-01 … 03 | — |
| Literature Scout | TC-SCT-01 … 03 | — |
| Disease Navigator | TC-DNV-01 … 03 | TC-DNV-02, TC-DNV-03 |
| Congress Intelligence | TC-CGI-01 … 03 | — |

---

## Clinical Q&A

### TC-CQA-01 — Suggested prompt returns a cited answer and generates a signal

| | |
|---|---|
| **Precondition** | Page freshly reloaded; Interaction Signals sidebar shows 0 |

1. Click **Clinical Q&A**
2. Note the signal count in the right-hand sidebar
3. Click the suggested prompt chip **AD treatment options**
4. Wait for the typing indicator to clear

**Expected:** A structured treatment answer renders for a 45-year-old with
moderate-to-severe AD who failed topicals. Source citations appear beneath the
answer. Follow-up prompt chips appear. **The sidebar signal count increases by 1.**

| Actual | Pass / Fail |
|---|---|
| | |

### TC-CQA-02 — Typed cross-TA question returns pathway-level answer

1. Click **Clinical Q&A**
2. Type into the question box: `Explain type 2 inflammation and how it connects multiple diseases`
3. Press the send button

**Expected:** An answer describing the type 2 inflammation pathway and the
conditions sharing it, with citations. A new interaction signal is added to the
sidebar.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-CQA-03 — Off-topic question is declined gracefully · `KNOWN DEFECT`

1. Click **Clinical Q&A**
2. Type: `What is the capital of Portugal?`
3. Press send

**Expected (intended):** The agent states it has no MedVerse content matching the
query and lists the topics it can help with (atopic dermatitis, rheumatoid
arthritis, cross-TA immunology, congress intelligence).

**Actual on current build:** Returns the **Atopic Dermatitis Treatment Algorithm**
with citations, as though it answered the question. `generateResponse()` in
`rag-engine.js` falls through to its generic "top retrieved doc" branch because
`searchKnowledgeBase()` still returns documents for an unrelated query, so the
no-match branch is never reached.

| Actual | Pass / Fail |
|---|---|
| | |

---

## Patient Navigator

### TC-PNV-01 — AD care pathway generated for a full patient profile

1. Click **Patient Navigator**
2. Age `45`, Sex `Female`, Primary diagnosis `Atopic Dermatitis (moderate-to-severe)`
3. Click the comorbidity chip `Asthma` and the prior-therapy chip `Topical CS`
4. Click **Generate Care Pathway**

**Expected:** A card titled *Care Pathway Recommendation* badged `AI-GENERATED`,
headed "Patient: 45yo Female with Atopic Dermatitis (moderate-to-severe)", opening
with **Step 1: Confirm Disease Severity** (`ASSESSMENT`) citing EASI, IGA, BSA and
DLQI, followed by further numbered steps.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-PNV-02 — Missing diagnosis is blocked

1. Click **Patient Navigator**
2. Leave **Primary diagnosis** on `Select condition…` (enter an age if you like)
3. Click **Generate Care Pathway**

**Expected:** A browser alert reading exactly **"Please select a primary
diagnosis."** No result renders. Dismissing the alert leaves the form intact.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-PNV-03 — Pathway is diagnosis-specific, not generic

1. Click **Patient Navigator**
2. Age `58`, Sex `Male`, Primary diagnosis `Rheumatoid Arthritis`
3. Click **Generate Care Pathway**

**Expected:** Header reads "Patient: 58yo Male with Rheumatoid Arthritis" and
**Step 1 is "Assess Disease Activity"** citing **DAS28-ESR, CDAI, SDAI** — a
different assessment set from the AD pathway in TC-PNV-01. This confirms the
pathway is selected by diagnosis rather than templated.

| Actual | Pass / Fail |
|---|---|
| | |

---

## Trial Matching Agent

### TC-TRM-01 — Matching trials returned for a biologic-naïve AD patient

1. Click **Trial Matching Agent**
2. Indication `Atopic Dermatitis`, Age `32`, Prior biologics `Biologic-naïve`, Region `United States`
3. Click **Find Matching Trials**

**Expected:** Header reads **`3 trials found`**. Results include **LIBERTY AD PED**
(badged `ENROLLING`, Phase 3, 42 sites across US/EU/Japan, ages 0.5–5) and
**DUPIXENT REAL** (badged `OPEN`). Each result offers **View Protocol** and
**Contact MSL**.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-TRM-02 — Missing indication is blocked

1. Click **Trial Matching Agent**
2. Leave **Indication** on `Select indication…`; fill age `40` if you like
3. Click **Find Matching Trials**

**Expected:** Browser alert reading exactly **"Please select an indication."** No
results render.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-TRM-03 — Result set changes with indication

1. Click **Trial Matching Agent**
2. Indication `Rheumatoid Arthritis`, Age `55`, Prior biologics `2+ prior biologics`, Region `Japan`
3. Click **Find Matching Trials**
4. Note the count, then repeat with Indication `Chronic Spontaneous Urticaria`

**Expected:** Rheumatoid Arthritis returns **`1 trial found`**; Chronic Spontaneous
Urticaria returns **`2 trials found`**. The result set is indication-driven.

| Actual | Pass / Fail |
|---|---|
| | |

---

## MSL Connect

### TC-MSL-01 — Exact territory match returns the assigned MSL

1. Click **MSL Connect**
2. Therapeutic area `Dermatology / Atopic Dermatitis`, Region `Northeast US`, Topic `Dupixent long-term safety data`
3. Click **Find My MSL**

**Expected:** **Dr. Amanda Rodriguez, PharmD** — Northeast US · Dermatology /
Atopic Dermatitis, with availability ("Available this week"), an expertise list
(Dupixent clinical data, AD real-world evidence, pediatric dermatology) and a
**Request Meeting** button. No "no exact match" banner.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-MSL-02 — Uncovered region falls back to therapeutic-area list

1. Click **MSL Connect**
2. Therapeutic area `Dermatology / Atopic Dermatitis`, Region `Midwest US`, Topic `safety data`
3. Click **Find My MSL**

**Expected:** A banner reading **"No exact region match — showing all MSLs in this
therapeutic area:"** followed by the available dermatology MSLs (Northeast US
appears first). The agent degrades rather than returning nothing.

> Only **Northeast US**, **West US** and **EU — Germany** have dermatology MSL
> coverage in the data. The other four regions all take this path.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-MSL-03 — Missing therapeutic area is blocked

1. Click **MSL Connect**
2. Leave **Therapeutic area** on `Select…`, pick any region
3. Click **Find My MSL**

**Expected:** Browser alert reading exactly **"Please select a therapeutic area."**

| Actual | Pass / Fail |
|---|---|
| | |

---

## Ingredient Safety

### TC-ING-01 — Latex allergy raises a device-level warning

1. Click **Ingredient Safety**
2. Product `Dupixent (dupilumab)`, Allergy/restriction `latex`
3. Click **Check Ingredients**

**Expected:** An **Allergy Alert** card badged `WARNING` stating the pre-filled
**syringe** needle cap contains a natural rubber (latex derivative) and advising
the **pen** device for latex-allergic patients. Below it, the product summary
(`MONOCLONAL ANTIBODY (ANTI-IL-4Rα)`, active ingredient dupilumab) and the full
excipient list including L-histidine and L-arginine hydrochloride.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-ING-02 — Non-matching allergen returns formulation without a false alarm

1. Click **Ingredient Safety**
2. Product `Dupixent (dupilumab)`, Allergy/restriction `penicillin`
3. Click **Check Ingredients**

**Expected:** **No Allergy Alert card.** The result opens directly with the product
summary and excipient list. The agent does not manufacture a warning for an
allergen absent from the formulation.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-ING-03 — Missing product is blocked; second product returns its own formulation

1. Click **Ingredient Safety**, leave Product on `Select product…`, click **Check Ingredients**
2. Expect the alert, dismiss it
3. Select Product `Sarclisa (isatuximab)`, leave allergy blank, click **Check Ingredients**

**Expected:** Step 1 raises a browser alert reading exactly **"Please select a
product."** Step 3 renders Sarclisa as `MONOCLONAL ANTIBODY (ANTI-CD38)`, active
ingredient **isatuximab-irfc**, with a **different** excipient list from Dupixent
(includes **sucrose**).

| Actual | Pass / Fail |
|---|---|
| | |

---

## Temperature Stability

### TC-TST-01 — Room-temperature excursion returns a bounded tolerance

1. Click **Temperature Stability**
2. Product `Dupixent (dupilumab) — Pre-filled syringe`, Scenario `Room temperature excursion`
3. Click **Check Stability**

**Expected:** Refrigerated storage **2°C – 8°C**, shelf life **36 months**, store in
original carton; then a `Room Temperature Storage ALLOWED` block giving max
temperature **25°C** and max duration **14 days**.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-TST-02 — Different product and scenario returns that product's profile

1. Click **Temperature Stability**
2. Product `Sarclisa (isatuximab) — IV vial`, Scenario `Patient travel / transport`
3. Click **Check Stability**

**Expected:** Result headed **"Sarclisa 100mg/5mL and 500mg/25mL IV Vials"** with
its own storage range (2–8°C), shelf life (36 months unopened, refrigerated) and
light-protection guidance — distinct from the Dupixent syringe result.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-TST-03 — Missing product is blocked

1. Click **Temperature Stability**
2. Leave Product on `Select product…`, choose any scenario
3. Click **Check Stability**

**Expected:** Browser alert reading exactly **"Please select a product."**

| Actual | Pass / Fail |
|---|---|
| | |

---

## Literature Intelligence

### TC-LIT-01 — Query returns ranked, tagged publications

1. Click **Literature Intelligence**
2. Query `dupilumab atopic dermatitis long-term safety`, Publication type `All types`, Date range `Any time`
3. Click **Search Literature**

**Expected:** **`5 results found`**, led by *Long-term Safety and Efficacy of
Dupilumab … LIBERTY AD CHRONOS 4-Year Results* (Simpson EL, Paller AS, et al.,
*J Am Acad Dermatol* 2026), tagged `Clinical Trial` and `HIGH IMPACT`. Each result
offers **PubMed** and **Summary** actions.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-LIT-02 — Publication-type filter narrows the result set

1. Repeat TC-LIT-01 to establish the 5-result baseline
2. Change **Publication type** to `Meta-Analysis`
3. Click **Search Literature**

**Expected:** **`1 result found`** — *Real-World Effectiveness of Dupilumab Across
Type 2 Inflammatory Conditions: Systematic Review and Meta-Analysis*. The filter
demonstrably reduces the set from 5 to 1.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-LIT-03 — Empty query is blocked

1. Click **Literature Intelligence**
2. Leave the query box empty
3. Click **Search Literature**

**Expected:** Browser alert reading exactly **"Please enter a search query."**

> Note for testers: the query match is loose. An off-topic query such as
> `zzzqqq nonexistent topic xyz` still returns 2 dupilumab results rather than an
> empty state. That is current behaviour, not a test failure.

| Actual | Pass / Fail |
|---|---|
| | |

---

## Literature Scout

### TC-SCT-01 — Alerts returned with competitor and guideline tagging

1. Click **Literature Scout**
2. Therapeutic area `Atopic Dermatitis`, Keywords `biologic sequencing`
3. Click **Check for Alerts**

**Expected:** **`4 recent publication alerts for Atopic Dermatitis`**, including a
`COMPETITOR`-tagged item on JAK inhibitor long-term safety (*BMJ*, Jul 2026) and a
`GUIDELINE`-tagged item on AAD treatment guidelines (*JAAD*, Jun 2026). Items are
marked **Priority Read** and offer **AI Summary**.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-SCT-02 — Therapeutic area with no alerts shows the empty state

1. Click **Literature Scout**
2. Therapeutic area `COPD`, Keywords blank
3. Click **Check for Alerts**

**Expected:** The empty state — **"No recent alerts for this therapeutic area.
Check back soon or set up monitoring."** Not an error, and not fabricated alerts.

> `CRSwNP` and `Eosinophilic Esophagitis` behave the same way. Only
> **Atopic Dermatitis** has seeded alerts.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-SCT-03 — Missing therapeutic area is blocked

1. Click **Literature Scout**
2. Leave Therapeutic area on `Select…`, type any keywords
3. Click **Check for Alerts**

**Expected:** Browser alert reading exactly **"Please select a therapeutic area."**

| Actual | Pass / Fail |
|---|---|
| | |

---

## Disease Navigator

### TC-DNV-01 — Full disease profile renders with cross-TA section

1. Click **Disease Navigator**
2. Disease `Atopic Dermatitis`, Focus Area `Full overview`
3. Click **Load Disease Profile**

**Expected:** A profile badged `DISEASE PROFILE` describing type 2 inflammation
(IL-4, IL-13, IL-31) and prevalence (~10% of adults, up to 25% of children), with
sections **Pathophysiology**, **Treatment Landscape**, **Cross-TA Connections** and
**Sanofi Pipeline**.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-DNV-02 — Focus Area filters the profile · `KNOWN DEFECT`

1. Click **Disease Navigator**
2. Disease `Atopic Dermatitis`, Focus Area `Pathophysiology` → **Load Disease Profile**
3. Note which sections render
4. Change Focus Area to `Sanofi Pipeline` → **Load Disease Profile** again

**Expected (intended):** Each focus value narrows or reorders the profile — picking
`Pathophysiology` should not render the full five-section profile.

**Actual on current build:** All five focus values (`Full overview`,
`Pathophysiology`, `Treatment Landscape`, `Cross-TA Connections`, `Sanofi Pipeline`)
render **byte-identical output** — the same 1,166-character full profile. The
`dn-focus` element is never read anywhere in `poc/src/concierge-app.js`; the
dropdown is decorative.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-DNV-03 — All dropdown diseases return a profile · `KNOWN DEFECT`

1. Click **Disease Navigator**
2. Work through each disease in the dropdown, clicking **Load Disease Profile** for each

**Expected (intended):** All seven options return a disease profile.

**Actual on current build:** Only **Atopic Dermatitis** (1,166 chars) and
**Rheumatoid Arthritis** (1,073 chars) have profiles. The other five —
`Asthma (Type 2 Eosinophilic)`, `CRSwNP`, `Eosinophilic Esophagitis`,
`Prurigo Nodularis`, `COPD (Type 2 High)` — return the stub *"Detailed disease
profile … is being developed. Full profiles are available for Atopic Dermatitis and
Rheumatoid Arthritis."*

| Actual | Pass / Fail |
|---|---|
| | |

---

## Congress Intelligence

### TC-CGI-01 — Congress coverage renders and emits a cross-module signal

| | |
|---|---|
| **Precondition** | Console: `localStorage.removeItem('medverse_orion_signals')`, then reload |

1. Click **Congress Intelligence**
2. Select `AAD 2026 — American Academy of Dermatology`
3. Click **Load Coverage**
4. In the browser console, run `JSON.parse(localStorage.getItem('medverse_orion_signals')).length`

**Expected:** *AAD 2026 Annual Meeting*, badged `COMPLETED`, San Francisco CA,
Mar 20–24 2026, with **Key Highlights** (`3 ITEMS`, including 4-year dupilumab AD
safety data), **Presentations** (`4 TOTAL`) and a **View Full Congress Coverage**
action. Step 4 returns **1** — this is the only Concierge agent that writes a
persisted cross-module signal.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-CGI-02 — Missing congress is blocked inline, not by alert

1. Click **Congress Intelligence**
2. Leave the congress selector on `Select congress…`
3. Click **Load Coverage**

**Expected:** **No browser alert.** An inline message renders in the results area
in the danger colour: **"Please select a congress."**

> This is the only one of the nine forms that validates inline; the other eight use
> a browser `alert()`. Worth noting as a UX inconsistency.

| Actual | Pass / Fail |
|---|---|
| | |

### TC-CGI-03 — A second congress returns its own coverage

1. Click **Congress Intelligence**
2. Select `ACR 2026 — American College of Rheumatology`
3. Click **Load Coverage**

**Expected:** ACR-specific coverage — its own location, dates, highlights and
presentation count, distinct from AAD 2026. All six congresses in the dropdown have
seeded coverage, so none should return "not yet available".

| Actual | Pass / Fail |
|---|---|
| | |

---

## Result log

| Test | Pass | Fail | Notes |
|---|---|---|---|
| TC-CQA-01 | | | |
| TC-CQA-02 | | | |
| TC-CQA-03 | | | `KNOWN DEFECT` — expected to fail |
| TC-PNV-01 | | | |
| TC-PNV-02 | | | |
| TC-PNV-03 | | | |
| TC-TRM-01 | | | |
| TC-TRM-02 | | | |
| TC-TRM-03 | | | |
| TC-MSL-01 | | | |
| TC-MSL-02 | | | |
| TC-MSL-03 | | | |
| TC-ING-01 | | | |
| TC-ING-02 | | | |
| TC-ING-03 | | | |
| TC-TST-01 | | | |
| TC-TST-02 | | | |
| TC-TST-03 | | | |
| TC-LIT-01 | | | |
| TC-LIT-02 | | | |
| TC-LIT-03 | | | |
| TC-SCT-01 | | | |
| TC-SCT-02 | | | |
| TC-SCT-03 | | | |
| TC-DNV-01 | | | |
| TC-DNV-02 | | | `KNOWN DEFECT` — expected to fail |
| TC-DNV-03 | | | `KNOWN DEFECT` — expected to fail |
| TC-CGI-01 | | | |
| TC-CGI-02 | | | |
| TC-CGI-03 | | | |
