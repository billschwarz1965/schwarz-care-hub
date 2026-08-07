import { searchKnowledgeBase } from "./knowledge-base.js";

const responseTemplates = [
  {
    patterns: ["failed topicals", "atopic dermatitis", "options", "moderate-to-severe", "what are my options", "topical", "AD patient"],
    buildResponse(docs) {
      const algo = docs.find(d => d.id === "AD-002") || docs.find(d => d.category === "treatment-algorithm");
      const dupixent = docs.find(d => d.id === "AD-001") || docs.find(d => d.keywords?.includes("dupilumab"));
      const safety = docs.find(d => d.id === "AD-003") || docs.find(d => d.category === "safety");
      const disease = docs.find(d => d.id === "DS-001");
      const citations = [algo, dupixent, safety, disease].filter(Boolean);

      return {
        answer: `For a patient with moderate-to-severe atopic dermatitis who has failed topical therapies, current guidelines recommend escalation to systemic therapy [1].

**Recommended first-line biologic: Dupilumab (Dupixent)**

Dupilumab targets the IL-4Rα subunit, blocking both IL-4 and IL-13 signaling — the key drivers of type 2 inflammation in AD. Clinical evidence supports its use as first-line biologic therapy [2]:

- **SOLO 1 & 2 trials:** 38% of patients achieved clear/almost clear skin (IGA 0/1) at Week 16 vs. 10% placebo
- **EASI-75 response:** 51% dupilumab vs. 15% placebo
- **LIBERTY AD CHRONOS:** Sustained efficacy over 52 weeks with combination TCS

**Safety profile** — Long-term data (3+ years) show a favorable safety profile with no increased risk of serious infections, malignancy, or MACE. Most common AEs: injection site reactions (15%) and conjunctivitis (9.5%). Notably, no routine lab monitoring is required — differentiating it from JAK inhibitors and systemic immunosuppressants [3].

**Alternative systemic options** for discussion:
- JAK inhibitors (abrocitinib, baricitinib, upadacitinib) — rapid onset but require lab monitoring
- Tralokinumab (anti-IL-13) — alternative biologic mechanism
- Phototherapy (narrowband UVB) — non-systemic option

AD affects up to 10% of adults, with 60–80% reporting sleep disturbance and 25–30% experiencing depression — the treatment decision should consider the full disease burden beyond skin clearance [4].`,
        citations,
        followUps: [
          "How does dupilumab compare to abrocitinib in head-to-head data?",
          "What are the active clinical trials in the dupilumab program?",
          "Explain type 2 inflammation and how it connects multiple diseases"
        ],
        signal: {
          topic: "Atopic Dermatitis — Treatment Escalation",
          intent: "Clinical decision support",
          diseaseArea: "Atopic Dermatitis",
          stage: "Treatment selection (biologic-naïve)",
          depth: "Deep engagement",
          orionAction: "Flag for dermatology MSL — HCP evaluating biologic initiation in AD. Pre-engagement opportunity."
        }
      };
    }
  },
  {
    patterns: ["sarilumab", "kevzara", "rheumatoid", "MTX-inadequate", "methotrexate", "RA patient", "IL-6"],
    buildResponse(docs) {
      const kevzara = docs.find(d => d.id === "RA-001");
      const disease = docs.find(d => d.id === "DS-002");
      const citations = [kevzara, disease].filter(Boolean);

      return {
        answer: `For MTX-inadequate rheumatoid arthritis, **sarilumab (Kevzara)** is a targeted biologic option that addresses the IL-6 pathway — a key driver of both joint inflammation and systemic RA manifestations [1].

**Key clinical evidence:**

- **MOBILITY Part B:** Sarilumab 200 mg Q2W + MTX achieved ACR20 66% vs. 34% placebo, ACR50 46% vs. 17%, ACR70 25% vs. 7% at Week 24
- **MONARCH (head-to-head):** Sarilumab monotherapy demonstrated superiority over adalimumab monotherapy in DAS28-ESR change (-3.28 vs. -2.20, p<0.0001) — the only anti-IL-6R antibody with this distinction

**Why IL-6 matters in RA:** IL-6 drives both local joint inflammation and systemic features including fatigue, anemia of chronic disease, and elevated acute phase reactants. Targeting IL-6Rα addresses both dimensions of disease burden [2].

**Treatment positioning:**
- Consider for patients with inadequate response to conventional DMARDs (MTX, leflunomide)
- MONARCH data support use as monotherapy when MTX is not tolerated
- Aligns with EULAR treat-to-target recommendations for biologic escalation

Connect with your rheumatology MSL for detailed clinical discussion and real-world experience data.`,
        citations,
        followUps: [
          "Tell me about the IL-23/Th17 pathway overlap between psoriasis and IBD",
          "What are the active clinical trials in the dupilumab program?",
          "Explain type 2 inflammation and how it connects multiple diseases"
        ],
        signal: {
          topic: "Rheumatoid Arthritis — Biologic Selection",
          intent: "Treatment comparison / clinical evidence",
          diseaseArea: "Rheumatoid Arthritis",
          stage: "DMARD escalation (MTX-IR)",
          depth: "Moderate engagement",
          orionAction: "Flag for rheumatology MSL — HCP exploring IL-6 pathway options for MTX-inadequate RA."
        }
      };
    }
  },
  {
    patterns: ["type 2 inflammation", "cross-TA", "shared pathway", "IL-4", "IL-13", "comorbid", "asthma and AD", "multiple diseases"],
    buildResponse(docs) {
      const crossTA = docs.find(d => d.id === "IMM-001");
      const ad = docs.find(d => d.id === "DS-001");
      const dupixent = docs.find(d => d.id === "AD-001");
      const citations = [crossTA, ad, dupixent].filter(Boolean);

      return {
        answer: `Type 2 inflammation is a shared immunological mechanism underlying multiple diseases — this cross-TA perspective is increasingly important for clinical decision-making [1].

**The IL-4/IL-13 axis connects:**
- **Atopic dermatitis** — epithelial barrier dysfunction, pruritus
- **Asthma** — airway hyperresponsiveness, mucus hypersecretion
- **Chronic rhinosinusitis with nasal polyps (CRSwNP)** — eosinophilic tissue inflammation
- **Eosinophilic esophagitis (EoE)** — esophageal eosinophilia
- **Prurigo nodularis** — chronic pruritus, neural sensitization

**Clinical implications:** Approximately 50–70% of AD patients have comorbid allergic conditions. When evaluating a patient with AD and concurrent asthma or CRSwNP, the overlapping type 2 pathophysiology supports considering therapies that address the shared pathway [2].

**Dupilumab** targets IL-4Rα — the shared receptor subunit — explaining its demonstrated efficacy across AD, asthma, CRSwNP, EoE, and prurigo nodularis [3]. This cross-disease efficacy supports a holistic patient management approach rather than disease-siloed treatment.

This has implications for both clinical practice and medical education: understanding shared pathways enables more informed cross-specialty conversations.`,
        citations,
        followUps: [
          "What are my options for a patient with moderate-to-severe atopic dermatitis who failed topicals?",
          "What Sanofi data was presented at AAD 2026?",
          "Tell me about the IL-23/Th17 pathway overlap between psoriasis and IBD"
        ],
        signal: {
          topic: "Type 2 Inflammation — Cross-TA Synthesis",
          intent: "Pathophysiology understanding / cross-specialty",
          diseaseArea: "Cross-TA Immunology",
          stage: "Evidence exploration",
          depth: "Deep engagement — cross-TA query",
          orionAction: "High-value signal — HCP exploring cross-disease mechanisms. Flag for multi-TA MSL coordination."
        }
      };
    }
  },
  {
    patterns: ["AAD", "EADV", "congress", "conference", "meeting", "presentation", "poster", "session"],
    buildResponse(docs) {
      const aad = docs.find(d => d.id === "CON-001");
      const eadv = docs.find(d => d.id === "CON-002");
      const citations = [aad, eadv].filter(Boolean);

      return {
        answer: `Here's the latest Sanofi Medical congress intelligence for dermatology:

**AAD 2026 — Key Highlights** [1]

- 📋 **Late-breaking oral:** 3-year OLE data — sustained IGA 0/1 in 42% of adolescents on dupilumab
- 📊 **PROSE Registry poster:** Real-world dupilumab persistence rates of 87% at 12 months in US community dermatology
- 🎓 **Symposium:** "Beyond the Surface — Type 2 Inflammation in Dermatology" featuring Dr. Emma Guttman-Yassky
- 📈 **Satellite session:** AD burden and patient-reported outcomes — DLQI and caregiver QoL
- 🔬 **MSL booth:** Hall B, Booth #2417 — available for scientific exchange

**EADV 2026 — September, Amsterdam (Preview)** [2]

- IMMERSE local expansion launching (Japan, Germany, Greater Gulf)
- Expected data: dupilumab in hand eczema (Phase 3), prurigo nodularis long-term follow-up
- Key sessions to watch: AI in dermatology, AD phenotyping for personalized medicine, biologics sequencing
- MedVerse digital congress companion with personalized session recommendations

Would you like me to connect you with a dermatology MSL for deeper discussion on any of these presentations?`,
        citations,
        followUps: [
          "How does dupilumab compare to abrocitinib in head-to-head data?",
          "What are the active clinical trials in the dupilumab program?",
          "Explain type 2 inflammation and how it connects multiple diseases"
        ],
        signal: {
          topic: "Congress Intelligence — AAD/EADV 2026",
          intent: "Congress preparation / session discovery",
          diseaseArea: "Dermatology",
          stage: "Information gathering",
          depth: "Moderate engagement",
          orionAction: "Congress-engaged HCP — flag for MSL outreach at AAD/EADV. Potential booth visit."
        }
      };
    }
  },
  {
    patterns: ["clinical trial", "trial", "recruiting", "enroll", "study", "Phase 3", "pipeline", "development"],
    buildResponse(docs) {
      const trials = docs.find(d => d.id === "CT-001");
      const citations = [trials].filter(Boolean);

      return {
        answer: `Here's a summary of active Sanofi clinical trials in the dupilumab program [1]:

**Actively enrolling / ongoing:**

| Trial | Phase | Indication | Key Detail |
|-------|-------|-----------|------------|
| LIBERTY AD PED | Phase 3 | AD in children 6mo–5yr | Pediatric extension |
| LIBERTY CUPID | Phase 3 | Chronic spontaneous urticaria | New indication |
| LIBERTY CSNP | Phase 3 | CRSwNP | Sinus surgery outcomes |
| LIBERTY-BF | Phase 3 | Bullous pemphigoid | New indication |
| DUPIXENT REAL | Observational | Multiple type 2 conditions | Real-world evidence |

**Post-marketing commitments:** Pediatric extension studies and pregnancy registry (OTIS) are ongoing.

For patient referral or detailed trial eligibility, contact your regional MSL or visit clinicaltrials.gov directly. MedVerse can connect you to the appropriate MSL for your territory.`,
        citations,
        followUps: [
          "What are my options for a patient with moderate-to-severe atopic dermatitis who failed topicals?",
          "Explain type 2 inflammation and how it connects multiple diseases",
          "What Sanofi data was presented at AAD 2026?"
        ],
        signal: {
          topic: "Clinical Trial Interest — Dupilumab Program",
          intent: "Trial awareness / potential referral",
          diseaseArea: "Multiple (Immunology)",
          stage: "Trial exploration",
          depth: "High-value engagement",
          orionAction: "PRIORITY — HCP expressing trial interest. Route to clinical operations MSL for referral pathway."
        }
      };
    }
  },
  {
    patterns: ["compare", "abrocitinib", "head-to-head", "JAK", "dupilumab vs", "versus", "JADE DARE"],
    buildResponse(docs) {
      const h2h = docs.find(d => d.id === "AD-004") || docs.find(d => d.keywords?.includes("head-to-head"));
      const safety = docs.find(d => d.id === "AD-003");
      const algo = docs.find(d => d.id === "AD-002");
      const citations = [h2h, safety, algo].filter(Boolean);

      return {
        answer: `Great question — head-to-head data is critical for informed treatment decisions. The **JADE DARE trial** provides the first direct comparison of dupilumab vs. abrocitinib in moderate-to-severe AD [1].

**JADE DARE — Key Results (Week 26):**

| Endpoint | Dupilumab 300mg Q2W | Abrocitinib 200mg QD |
|----------|-------------------|---------------------|
| IGA 0/1 | Similar response rates | Similar response rates |
| Itch relief onset | Weeks 4–6 | Weeks 1–2 (faster) |
| Long-term durability | More sustained | Less data beyond 26wk |

**The critical differentiator is safety:**

Dupilumab does **not** require routine laboratory monitoring. Most common AEs are injection site reactions (15%) and conjunctivitis (9.5%) [2].

Abrocitinib (JAK inhibitor) requires baseline and periodic **CBC, liver function, and lipid monitoring**. Additionally, JAK inhibitors carry a **class-wide boxed warning** for serious infections, malignancy, MACE, and thrombosis — based on the tofacitinib ORAL Surveillance cardiovascular outcomes trial [1].

**Clinical positioning:** For biologic-naïve patients, current guidelines recommend dupilumab as first-line biologic given the long-term safety profile. Abrocitinib may be considered when rapid itch relief is the primary goal, but the risk-benefit discussion around the JAK class warning is essential [3].

This comparison is particularly relevant for younger patients and those with cardiovascular risk factors where long-term safety is paramount.`,
        citations,
        followUps: [
          "What are the active clinical trials in the dupilumab program?",
          "Explain type 2 inflammation and how it connects multiple diseases",
          "What Sanofi data was presented at AAD 2026?"
        ],
        signal: {
          topic: "AD Treatment — Head-to-Head Comparison",
          intent: "Comparative effectiveness / treatment selection",
          diseaseArea: "Atopic Dermatitis",
          stage: "Treatment comparison (biologic vs JAK)",
          depth: "Deep engagement",
          orionAction: "High-value signal — HCP comparing dupilumab vs JAK inhibitor. Flag for dermatology MSL with H2H discussion guide."
        }
      };
    }
  },
  {
    patterns: ["competitor", "competitive landscape", "market", "alternatives", "adbry", "ebglyss", "lebrikizumab", "nemluvio", "nemolizumab", "nucala", "xolair", "fasenra", "tezspire", "rinvoq", "cibinqo", "opzelura"],
    buildResponse(docs) {
      const cl = docs.find(d => d.id === "CL-001");
      const dupixent = docs.find(d => d.id === "AD-001");
      const safety = docs.find(d => d.id === "AD-003");
      const citations = [cl, dupixent, safety].filter(Boolean);

      return {
        answer: `Here's the competitive landscape for Dupixent across its approved and pipeline indications [1]:

**Atopic Dermatitis — Most Competitive Market:**
- **IL-13 biologics:** Adbry (tralokinumab, ages 12+), Ebglyss (lebrikizumab) — target IL-13 only vs Dupixent's dual IL-4/IL-13 blockade
- **IL-31 biologic:** Nemluvio (nemolizumab) — targets itch specifically via IL-31 receptor
- **Oral JAK inhibitors:** Rinvoq (upadacitinib, AbbVie), Cibinqo (abrocitinib, Pfizer) — rapid itch onset but carry boxed warnings for MACE, malignancy, thrombosis
- **Topicals:** Opzelura (ruxolitinib, topical JAK), Eucrisa (crisaborole, PDE4)

**Asthma — Biologic Differentiation:**
- **Anti-IL-5:** Nucala (mepolizumab, GSK), Fasenra (benralizumab, AstraZeneca) — eosinophil-focused only
- **Anti-TSLP:** Tezspire (tezepelumab, AstraZeneca) — phenotype-independent but newer
- **Anti-IgE:** Xolair (omalizumab) — limited to allergic/IgE-high phenotypes

**CRSwNP:** Dupixent first-to-market; Xolair and Nucala approved with narrower profiles
**COPD (type 2 high):** First-mover advantage — no approved biologic competitors (BOREAS/NOTUS Phase 3 positive)

**Dupixent's key competitive advantages** [2][3]:
- Only biologic blocking **both IL-4 and IL-13** via IL-4Rα — broadest type 2 mechanism
- **Broadest age range** approved (ages 6 months+ in AD)
- **No routine lab monitoring** required — unlike JAK inhibitors
- **3+ years of long-term safety data** with favorable profile
- **Cross-disease platform** — one mechanism addressing 7+ indications`,
        citations,
        followUps: [
          "How does dupilumab compare to abrocitinib in head-to-head data?",
          "What are the active clinical trials in the dupilumab program?",
          "Explain type 2 inflammation and how it connects multiple diseases"
        ],
        signal: {
          topic: "Dupixent Competitive Landscape Analysis",
          intent: "Competitive intelligence / market positioning",
          diseaseArea: "Cross-TA Immunology",
          stage: "Competitive assessment",
          depth: "Deep engagement",
          orionAction: "PRIORITY — HCP exploring competitive landscape. Flag for MSL with competitive positioning guide and H2H data deck."
        }
      };
    }
  },
  {
    patterns: ["psoriasis", "IBD", "IL-23", "Th17", "IL-17", "Crohn", "overlap"],
    buildResponse(docs) {
      const il23 = docs.find(d => d.id === "IMM-002");
      const citations = [il23].filter(Boolean);

      return {
        answer: `The psoriasis–IBD overlap is driven by the shared **IL-23/Th17 pathway** — an important cross-TA consideration [1].

**Shared mechanism:**
- IL-23 drives Th17 cell differentiation → IL-17A, IL-17F, IL-22 production
- In **psoriasis:** IL-17A causes keratinocyte hyperproliferation and neutrophil recruitment
- In **IBD (Crohn's disease):** IL-23-driven Th17 responses cause intestinal mucosal damage

**Epidemiological link:** Psoriasis patients have a **1.5–2x increased risk of IBD** compared to the general population.

**Critical therapeutic consideration:**
While anti-IL-17 agents (e.g., secukinumab, ixekizumab) are highly effective in psoriasis, some have shown **paradoxical worsening or new-onset IBD** — a critical safety consideration for HCPs managing patients with both conditions or GI risk factors.

This cross-TA synthesis is exactly the type of clinical intelligence that helps inform treatment selection beyond the single-disease lens. For patients with psoriasis and GI symptoms, a multidisciplinary approach involving both dermatology and gastroenterology is recommended.`,
        citations,
        followUps: [
          "Explain type 2 inflammation and how it connects multiple diseases",
          "What are my options for a patient with moderate-to-severe atopic dermatitis who failed topicals?",
          "What Sanofi data was presented at AAD 2026?"
        ],
        signal: {
          topic: "Psoriasis–IBD Overlap — IL-23/Th17",
          intent: "Cross-specialty clinical reasoning",
          diseaseArea: "Dermatology / Gastroenterology",
          stage: "Evidence exploration — safety consideration",
          depth: "Deep engagement — cross-TA",
          orionAction: "Multi-specialty signal — flag for both dermatology and GI MSL teams. Cross-TA clinical reasoning."
        }
      };
    }
  }
];

export function generateResponse(query) {
  const queryLower = query.toLowerCase();
  const docs = searchKnowledgeBase(query);

  // Find best matching template
  let bestTemplate = null;
  let bestScore = 0;

  for (const template of responseTemplates) {
    const matchCount = template.patterns.filter(p => queryLower.includes(p.toLowerCase())).length;
    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestTemplate = template;
    }
  }

  if (bestTemplate && bestScore > 0) {
    return bestTemplate.buildResponse(docs);
  }

  // Fallback: generic response from retrieved docs
  if (docs.length > 0) {
    const topDoc = docs[0];
    return {
      answer: `Based on MedVerse medical content, here's what I found on your query:

**${topDoc.title}**

${topDoc.content.substring(0, 500)}...

This information is sourced from ${topDoc.source} [1]. For a more detailed clinical discussion or to explore related topics, you can ask a follow-up question or connect with your regional MSL.`,
      citations: [topDoc],
      signal: {
        topic: topDoc.title,
        intent: "Information retrieval",
        diseaseArea: topDoc.diseaseArea,
        stage: "General query",
        depth: "Light engagement",
        orionAction: `Content engagement signal — HCP queried ${topDoc.diseaseArea} topic.`
      }
    };
  }

  // No match
  return {
    answer: `I don't have specific MedVerse content matching that query in my current knowledge base. Here's what I can help with:

- **Atopic dermatitis** — treatment algorithms, Dupixent clinical data, disease overview
- **Rheumatoid arthritis** — Kevzara (sarilumab) evidence, IL-6 pathway
- **Cross-TA immunology** — type 2 inflammation, IL-23/Th17 pathways
- **Congress intelligence** — AAD 2026 highlights, EADV 2026 preview
- **Clinical trials** — active dupilumab development program

Try asking: *"What are my options for a patient with moderate-to-severe AD who has failed topicals?"*`,
    citations: [],
    signal: null
  };
}

export const suggestedPrompts = [
  {
    text: "What are my options for a 45-year-old patient with moderate-to-severe atopic dermatitis who failed topicals?",
    short: "AD treatment options",
    icon: "stethoscope"
  },
  {
    text: "Tell me about the IL-23/Th17 pathway overlap between psoriasis and IBD",
    short: "Psoriasis–IBD overlap",
    icon: "arrows-split"
  },
  {
    text: "What Sanofi data was presented at AAD 2026?",
    short: "AAD 2026 highlights",
    icon: "calendar-event"
  },
  {
    text: "What are the active clinical trials in the dupilumab program?",
    short: "Dupilumab trials",
    icon: "flask"
  },
  {
    text: "Explain type 2 inflammation and how it connects multiple diseases",
    short: "Type 2 inflammation",
    icon: "brain"
  },
  {
    text: "What is the competitive landscape for Dupixent across its indications?",
    short: "Dupixent competitors",
    icon: "chart-bar"
  },
  {
    text: "I have an MTX-inadequate RA patient. What does the sarilumab evidence show?",
    short: "Sarilumab in RA",
    icon: "pill"
  }
];
