# Site map options vs. poc-external — content-sourcing alignment

**Question:** once `medical.campus.sanofi` is built, its educational content becomes
a data source poc-external's Disease Navigator (and possibly HCP Concierge) pulls
from. Given that, which of the three site map options (`poc/sitemap-options/`) is
structurally the best fit for poc-external's actual content model?

**Correction to an earlier verbal answer:** in the same conversation, before
reading the three prototypes in full, I guessed Option 3 would be the worst fit
"because it has no global tier for cross-TA content." That's wrong, and the
matrix below explains why — read the finding in [§3](#3-what-each-option-actually-provides-as-built)
before trusting the summary table alone.

**Update 1:** §3 originally flagged Option 2's prototype as missing its
Immunology/disease-taxonomy branch and Programs node, unlike Option 1 and 3.
That's now fixed in `poc/sitemap-options/option-2.html` — Option 2's local
instance shows the same depth as the other two. §5's recommendation is revised
accordingly below; the caveat that used to hinge on "is Option 2 unfinished or
deliberately narrower" no longer applies.

**Update 2:** Option 3 has since been rebuilt against
`Medverse_Sitemap_Workbook.xlsx` — the actual sitemap workbook, not just the
one-line descriptions this doc originally worked from. It now models the real
6-TA taxonomy (Immunology, Rare Diseases, Neurology, Oncology, Diabetes,
Vaccines) with the workbook's confirmed 3-tier Disease State layer
(TA → Disease State → specific disease), across **two** local instances
(`/en-us` and `/fr-fr`) that deliberately differ in one confirmed way: Rare
Blood Disorders is a standalone TA in the US and a Disease State nested under
Rare Diseases in France. Options 1 and 2 have **not** been rebuilt to this
depth — they still show the older, simplified taxonomy (Immunology only, one
locale, generic "specific disease articles" placeholders). §3 and §4 flag
this fidelity gap explicitly; don't read the matrix as apples-to-apples until
1 and 2 catch up.

## 1. Method

1. Extract poc-external's actual content model from code, not from the About
   page's marketing copy.
2. Extract each site map option's actual structure from the built HTML
   prototypes, not from the one-line description on the comparison index.
3. Match one against the other field-by-field, and note where the prototypes
   don't actually support a claim the index page makes about them.

## 2. What poc-external actually needs (from code)

Source: `poc/src/disease-data.js`, `poc/src/agents-data.js`.

- **Pathway → disease → connections model.** `disease-data.js` defines 3
  pathways (`type2`, `il23th17`, `il6jak`) and 10 diseases, each with
  `pathways: [...]` and `connections: [...]` arrays. The Disease Navigator's
  entire cross-TA feature (the demo script: AD → asthma → CRSwNP resolving to
  one type-2 mechanism) depends on this join existing *somewhere* — the
  question is whether the future website's content is organized the same way,
  since that's what would get pulled.
- **Provenance gap, partially closed.** `disease-data.js` records still have no
  `source`, `url`, or `citedFrom` field on the pathophysiology/treatment
  content itself — that part is unchanged. But the disease detail view
  (`disease-app.js`'s `openDetail`) now backs a "References" section with a
  live PubMed search per disease, reusing `searchPubMedLive()` — the same
  mechanism Literature Intelligence already used, just not previously wired
  to this view. Each disease now surfaces 3 real, clickable
  `pubmed.ncbi.nlm.nih.gov/{pmid}/` articles. This is disease-level
  bibliography, not claim-level citation — a specific sentence in
  "Pathophysiology" still doesn't link to the specific source for that
  sentence — so `poc-external`'s "every claim traces back to a publication"
  promise (`poc-external/index.html:212`) is closer to kept than before, not
  fully kept. Wiring to `medical.campus.sanofi` once it exists remains the
  path to claim-level attribution; this fix was the same-day, no-new-integration
  version of "stop citing nothing."
- **No country/locale concept anywhere in poc-external.** Every module —
  Disease Navigator, Literature Intelligence, Congress Intelligence — is
  written as if there's one global answer to a clinical question. There's no
  `locale` field, no country selector, nothing. This matters more than it
  looks: §3's rebuilt Option 3 proves at least one TA (Rare Blood Disorders)
  genuinely changes shape by market. Any sourcing integration would need to
  pick one market's shape as canonical, or grow the locale awareness
  poc-external doesn't have today.
- **Concrete taxonomy overlap, now checkable.** `disease-data.js`'s `type2`
  pathway lists 7 diseases (Atopic Dermatitis, Type 2 Asthma, CRSwNP, EoE,
  COPD, Prurigo Nodularis, Chronic Spontaneous Urticaria). The workbook's
  "Disease State Taxonomy" tab lists 13 diseases under Immunology's Type 2
  Inflammation Disease State — **all 7 of poc-external's diseases are a
  subset of those 13.** The other 6 (Bullous Pemphigoid, Hidradenitis
  Suppurativa, Allergic Fungal Rhinosinusitis, Alopecia Areata, Eosinophilic
  Gastritis, Chronic Pruritus Unknown Origin) aren't in poc-external's data at
  all. Practically: sourcing from `medical.campus.sanofi` wouldn't just add
  citations to existing Disease Navigator content — it would extend the
  disease list Disease Navigator can answer about in the first place.

## 3. What each option actually provides, as built

I read the interactive part of each prototype (`onclick` handlers and the
"Full sitemap" tree), not just the comparison table on `index.html`.

**Load-bearing finding, still true after the Option 3 rebuild: none of the
three options put disease-level content in a global, country-agnostic tier.**
Compare (Option 1 and 2 are as originally built; Option 3 reflects the
workbook-grounded rebuild, so its column is at a different level of detail —
see the fidelity-gap note below the table):

| | Global tier contents | Local tier contents |
|---|---|---|
| **Option 1** | `/diabetes`, `/oncology`, `/immunology`, `/vaccines` (flat, unbranded TA landing pages), `/talent` (shared LMS) | `/en-us` only. Immunology → Type 2 Inflammation → disease articles; Rare Blood Disorders (US-only); Vaccines → population hubs; Programs (IMMERSE, ADVENT, Bridge, RD University, Nerve Nexus); Talent |
| **Option 2** | `/diabetes` → `/bridge`; `/oncology` (flat, no confirmed program); `/immunology` → `/advent`, `/immerse`; `/talent` | `/en-us` only. Diabetes → Bridge; Oncology (flat); Immunology → Type 2 Inflammation, ADVENT, IMMERSE; Rare Blood Disorders; Vaccines → population hubs; Programs (RD University, Nerve Nexus); Talent |
| **Option 3** | *(none — root is a country selector only)* | **Two locales**, same template, one confirmed structural difference: `/en-us` has 6 TAs (Immunology, Rare Blood Disorders, Rare Diseases, Neurology, Oncology, Diabetes, Vaccines) with Rare Blood Disorders standalone; `/fr-fr` has the same 6 TAs but Rare Blood Disorders nests under Rare Diseases instead |

So the premise "no global tier = worse for cross-TA content" still doesn't
hold — it's not that Option 3 lacks disease content, it's that Option 3 has
*no global layer at all* to put anything in, cross-TA or otherwise.

**Fidelity gap between Option 3 and Options 1/2, worth fixing before this
matrix is a fair comparison:** Option 3 now reflects 6 real TAs, real disease
names, and confirmed per-market variance, sourced from the workbook. Options 1
and 2 still show only Immunology, with generic "specific disease articles"
placeholders and a single locale — the pre-workbook level of detail. This
doc's criteria (§4) are written to be robust to that gap (they test structural
properties, not disease counts), but if Options 1/2 get the same rebuild
treatment, some specific comparisons here (e.g. "Option 2's Immunology
matches Option 3's") should be re-verified against the deeper structure rather
than assumed to still hold.

**Data-completeness gap, now fixed:** Option 2's local tree was missing the
Immunology/Type-2/disease-article node and the Programs node that both Option
1 and Option 3 show — `index.html`'s claim that "every prototype shares the
identical local `/en-us` depth" (line 68) wasn't true of the prototypes as
built. `option-2.html` now has an Immunology → Type 2 Inflammation → disease
articles branch and a Programs branch (RD University, Nerve Nexus — the two
programs Option 2's TA-nesting hadn't already placed under Diabetes or
Oncology), matching Option 1 and 3's local depth. The matrix below reflects
the fixed state, not the original gap.

**Also corrected:** ADVENT and IMMERSE were originally placed under `/oncology`
and `/diabetes` respectively — wrong; both are Immunology programs. Both now
nest under `/immunology` (and under `Immunology` locally) at global and local
level. Bridge stays under `/diabetes`, unchanged. `/oncology` and `Oncology`
are now flat entries with no confirmed program, rather than incorrectly
anchoring ADVENT.

## 4. Matrix — criteria that actually matter to poc-external

| Criterion | Option 1 (flat global) | Option 2 (TA-nested global) | Option 3 (no global) |
|---|---|---|---|
| Disease/pathway taxonomy present at all, anywhere | Yes — local instance | Yes — local instance (fixed) | Yes — local instance |
| A country-agnostic URL poc-external could hardcode as "the" source for a TA | Yes — `medical.campus.sanofi/immunology` | Yes — `medical.campus.sanofi/immunology` | **No.** Global root has no TA content; the only real content lives at `/en-us/immunology`, a US-specific path pretending to be the global answer |
| Predictable per-disease join key for an automated pull | Partial — flat TAs, but disease-article path *inside* Immunology isn't specified beyond "specific disease articles" (option-1.html:66) | Same gap, but the TA node itself now confirmed present | Same gap as Option 1, since local structure is identical |
| Matches poc-external's own `pathway → disease` model shape | Close — Immunology (≈ pathway grouping) → Type 2 Inflammation (≈ exact pathway name) → disease articles | Slightly closer — same Immunology → Type 2 Inflammation nesting, plus programs are explicitly joined to their TA (`/diabetes/bridge`), mirroring `disease-data.js`'s own TA-first grouping more literally | Identical to Option 1 |
| Content requires HCP self-attestation | Yes, at the local instance (all three gate this identically — orthogonal to which option is picked) | Yes | Yes, plus a country gate on top |
| Effort to extend sourcing to a second market later | Shared global TA shape already exists; adding a market mostly means standing up its local instance | Same, plus the TA-nested pattern is already proven at both global and local level, so a new market and a new program both slot into the same shape | **Now demonstrated, not hypothetical:** the rebuilt prototype proves at least one TA (Rare Blood Disorders) changes shape per market. A sourcing integration built against Option 3 would need per-market taxonomy logic from day one — poc-external has none today (§2) |
| Can poc-external assume one canonical TA shape, or does it need per-market logic? | Global tier gives one canonical shape to source from; local variance (if any) is a fallback case, not the default path | Same as Option 1 | **No canonical shape exists.** Every market's shape is equally "local" — Option 3 offers no default to fall back to before per-market logic is built |

## 5. Recommendation

With Option 2's completeness gap fixed, **Option 2** is the best fit for what
poc-external will actually need to consume:

- It has the same local disease taxonomy as Option 1 and 3 (verified, not
  assumed) — no fit penalty there.
- Unlike Option 3, it has a global, country-agnostic TA landing page
  (`/immunology`) poc-external can point to as a stable reference even before
  any non-US market exists. Option 3 has structurally nothing at that layer,
  meaning poc-external would have to hardcode a US-specific path and call it
  global — which contradicts poc-external's own framing as a platform for
  HCPs generally, not US HCPs specifically.
- Its TA-nesting (`/diabetes/bridge`) gives poc-external a more explicit
  `{TA}/{program}` join key than Option 1's flat structure, and it matches
  `disease-data.js`'s own TA-first grouping (`pathways: [...]`) more literally.
  The same nesting pattern applies at both the global and local level, so a
  future TA or a future market both extend the same shape rather than
  introducing a second convention.

Option 1 remains a reasonable fallback — the gap between it and Option 2 is
one of degree (predictability of the join key), not a functional blocker.

Option 3 is the clear weakest fit, and the rebuild strengthened that
conclusion rather than softening it. It's no longer just "no global tier" in
the abstract — the rebuilt prototype now demonstrates a second, concrete
problem: at least one TA's shape genuinely depends on which market you're in.
Options 1 and 2 give poc-external one canonical global shape to source from
by default. Option 3 gives it none — every market is equally "local," so a
sourcing integration would need per-market taxonomy logic on day one, for a
codebase (§2) that currently has zero locale concept anywhere. That's a
larger lift than the "no global URL to hardcode" framing this doc used
before the rebuild.

## 6. Risk that applies regardless of which option is chosen

All three options gate the local instance behind HCP self-attestation. If
poc-external's automated content pull needs to run as a script (not a logged-in
browser session), that pull will hit the same gate a public visitor would —
this needs a service-level exception or an open/ungated content tier
carved out for the specific pages Disease Navigator sources from, independent
of the sitemap shape. Deciding the sitemap option does not resolve this; it's a
separate decision the site's owners need to make before the integration is
buildable at all.
