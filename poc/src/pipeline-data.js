// ─── Sanofi R&D pipeline ───
// Scraped from sanofi.com/en/our-science/our-pipeline (page states "Updated on
// July 30, 2026"). 61 clinical-stage projects; 60 extracted cleanly below.
//
// Per-project phase is deliberately absent. The page renders phase as a visual
// 1-2-3-R progress marker that did not yield a reliable value, and inventing a
// phase for a pipeline asset would be worse than omitting it — an HCP or an MSL
// could repeat it. Only the aggregate counts published on the page are recorded.
//
// `ta` is the therapeutic area. `businessUnit` is a separate axis and only
// appears on the Vaccines block below — see the comment there. The two are not
// interchangeable and the same value never appears in both; a Vaccines row
// carries a business unit and a null `ta`. Read them with pipelineAreaLabel()
// rather than touching `ta` directly, so a row with no therapeutic area renders
// as nothing instead of "null".
//
// One block — Ophthalmology — takes its `ta` from studies-data.js rather than
// from the pipeline page, because the page filed those assets under a grouping
// that did not match the indication. That is noted at the block itself.

export const PIPELINE_SUMMARY = {
  updated: "July 30, 2026",
  totalProjects: 61,
  phase3OrSubmitted: 24,
  byPhase: { phase1: 16, phase2: 21, phase3: 20, registration: 4 },
  source: "https://www.sanofi.com/en/our-science/our-pipeline"
};

export const pipeline = [
  // ── Immunology ──
  { ta: "Immunology", name: "SAR446422", desc: "CD28xOX40 bispecific Ab", indication: "Inflammatory indication" },
  { ta: "Immunology", name: "SAR447971", desc: "IRAK4 degrader", indication: "Hidradenitis suppurativa" },
  { ta: "Immunology", name: "SAR448501", desc: "CD20 bispecific mAb", indication: "Inflammatory indication" },
  { ta: "Immunology", name: "brivekimig", desc: "TNFaxOX40L Nanobody VHH", indication: "Type 1 diabetes, stage 3" },
  { ta: "Immunology", name: "brivekimig", desc: "TNFaxOX40L Nanobody VHH", indication: "Crohn's disease" },
  { ta: "Immunology", name: "brivekimig", desc: "TNFaxOX40L Nanobody VHH", indication: "Ulcerative colitis" },
  { ta: "Immunology", name: "brivekimig", desc: "TNFaxOX40L Nanobody VHH", indication: "Hidradenitis suppurativa" },
  { ta: "Immunology", name: "frexalimab", desc: "CD40L mAb", indication: "Type 1 diabetes, stage 3" },
  { ta: "Immunology", name: "frexalimab", desc: "CD40L mAb", indication: "Kidney transplant rejection" },
  { ta: "Immunology", name: "lunsekimig", desc: "IL13xTSLP Nanobody VHH", indication: "Asthma, high-risk" },
  { ta: "Immunology", name: "lunsekimig", desc: "IL13xTSLP Nanobody VHH", indication: "Asthma" },
  { ta: "Immunology", name: "lunsekimig", desc: "IL13xTSLP Nanobody VHH", indication: "Chronic rhinosinusitis with nasal polyps" },
  { ta: "Immunology", name: "lunsekimig", desc: "IL13xTSLP Nanobody VHH", indication: "Chronic obstructive pulmonary disease" },
  { ta: "Immunology", name: "SAR444336", desc: "Non-beta IL2 Synthorin", indication: "Microscopic colitis" },
  { ta: "Immunology", name: "SAR445399", desc: "IL1R3 mAb", indication: "Hidradenitis suppurativa" },
  { ta: "Immunology", name: "SAR449028", desc: "Wild-type KIT inhibitor", indication: "Chronic urticaria" },
  { ta: "Immunology", name: "Dupixent", desc: "IL4R mAb", indication: "Chronic pruritus of unknown origin" },
  { ta: "Immunology", name: "duvakitug", desc: "TL1A mAb", indication: "Crohn's disease" },
  { ta: "Immunology", name: "duvakitug", desc: "TL1A mAb", indication: "Ulcerative colitis" },
  { ta: "Immunology", name: "Rezurock", desc: "ROCK2 inhibitor", indication: "Chronic lung allograft dysfunction" },

  // ── Neurology ──
  { ta: "Neurology", name: "SAR448851", desc: "TREM2 agonist", indication: "Alzheimer's disease" },
  { ta: "Neurology", name: "frexalimab", desc: "CD40L mAb", indication: "Relapsing multiple sclerosis" },
  { ta: "Neurology", name: "frexalimab", desc: "CD40L mAb", indication: "Non-relapsing secondary progressive MS" },
  { ta: "Neurology", name: "riliprubart", desc: "C1s mAb", indication: "IVIg-treated CIDP" },

  // ── Ophthalmology ──
  // Both are retinal indications that the pipeline page listed under its
  // Neurology grouping, which does not fit the indication. The therapeutic area
  // here is NOT taken from the pipeline page — it is carried across from
  // studies-data.js, which records these same two assets by drug code
  // (SAR446597 / NCT07215234 and SAR402663 / NCT06660667) under
  // `ta: "Ophthalmology"`. Different source from the rest of this file, so the
  // provenance is recorded rather than silently blended.
  { ta: "Ophthalmology", name: "SAR446597", desc: "BbxC1s AAV gene therapy", indication: "Geographic atrophy in dry age-related macular degeneration" },
  { ta: "Ophthalmology", name: "SAR402663", desc: "sFLT01 AAV gene therapy", indication: "Wet age-related macular degeneration" },

  // ── Oncology ──
  { ta: "Oncology", name: "SAR445953", desc: "CEACAM5-Topo1 ADC", indication: "Colorectal cancer" },
  { ta: "Oncology", name: "SAR446523", desc: "GPRC5D mAb", indication: "Relapsed/refractory multiple myeloma" },
  { ta: "Oncology", name: "SAR449336", desc: "Pan KRAS inhibitor", indication: "Colorectal cancer" },
  { ta: "Oncology", name: "SAR445877", desc: "PD1xIL15 fusion protein", indication: "Solid tumors" },
  { ta: "Oncology", name: "Sarclisa", desc: "CD38 mAb", indication: "Relapsed/refractory multiple myeloma in combination" },
  { ta: "Oncology", name: "Sarclisa", desc: "CD38 mAb", indication: "NDMM, transplant-eligible (IsKia)" },
  { ta: "Oncology", name: "Sarclisa", desc: "CD38 mAb", indication: "NDMM, transplant-eligible (HD7)" },
  { ta: "Oncology", name: "Sarclisa", desc: "CD38 mAb", indication: "Smoldering multiple myeloma (ITHACA)" },
  { ta: "Oncology", name: "Sarclisa", desc: "CD38 mAb subcutaneous", indication: "Multiple myeloma (CN)" },

  // ── Rare Diseases ──
  { ta: "Rare Diseases", name: "SAR446268", desc: "DMPK AAV gene therapy", indication: "Myotonic dystrophy type 1" },
  { ta: "Rare Diseases", name: "efdoralprin alfa", desc: "AAT fusion protein", indication: "Alpha-1 antitrypsin deficiency emphysema" },
  { ta: "Rare Diseases", name: "frexalimab, rilzabrutinib, brivekimig", desc: "CD40L mAb, BTK inhibitor, TNFaxOX40L Nanobody VHH", indication: "Focal segmental glomerulosclerosis / minimal change disease" },
  { ta: "Rare Diseases", name: "Wayrilz", desc: "BTK inhibitor", indication: "Graves' disease" },
  { ta: "Rare Diseases", name: "Wayrilz", desc: "BTK inhibitor", indication: "IgG4-related disease" },
  { ta: "Rare Diseases", name: "Wayrilz", desc: "BTK inhibitor", indication: "Sickle cell disease" },
  { ta: "Rare Diseases", name: "Wayrilz", desc: "BTK inhibitor", indication: "Warm autoimmune hemolytic anemia" },
  { ta: "Rare Diseases", name: "elenestinib", desc: "D816V-mutated KIT inhibitor", indication: "Indolent/smoldering systemic mastocytosis" },
  { ta: "Rare Diseases", name: "fitusiran", desc: "RNAi targeting antithrombin", indication: "Hemophilia A and B (EU, JP)" },
  { ta: "Rare Diseases", name: "Nexviazyme", desc: "Enzyme replacement therapy", indication: "Infantile-onset Pompe disease (US)" },
  { ta: "Rare Diseases", name: "venglustat", desc: "Oral GCS inhibitor", indication: "Gaucher disease type 3 (US, EU, JP)" },

  // ── Vaccines ──
  // These 14 rows carry `businessUnit` instead of `ta`. "Vaccines" is a Sanofi
  // global business unit, not a therapeutic area, and it was previously stored
  // in `ta` — which meant the UI presented a business unit to external HCPs in
  // the same pill it uses for Immunology and Oncology. Business unit and
  // therapeutic area are different axes, so the value moved rather than being
  // relabelled.
  //
  // `ta` is null here, not guessed. The source page groups these by business
  // unit and never states a therapeutic area for them, and the `indication`
  // values below are indications (Chlamydia, Shingles, Influenza), not areas.
  // Same reasoning as the missing per-project phase above: omitting a value an
  // HCP could repeat is better than inventing one.
  // TODO(business): supply the therapeutic area for each vaccine asset.
  { businessUnit: "Vaccines", ta: null, name: "SP0269", desc: "mRNA vaccine", indication: "Chlamydia" },
  { businessUnit: "Vaccines", ta: null, name: "SP0287", desc: "Flublok + Nuvaxovid", indication: "Influenza + COVID-19" },
  { businessUnit: "Vaccines", ta: null, name: "SP0291", desc: "mRNA vaccine", indication: "RSV + hMPV + PIV3 (older adults)" },
  { businessUnit: "Vaccines", ta: null, name: "SP0340", desc: "Subunit vaccine", indication: "RSV + hMPV (older adults)" },
  { businessUnit: "Vaccines", ta: null, name: "SP0341", desc: "Subunit vaccine", indication: "RSV + hMPV + PIV3 (older adults)" },
  { businessUnit: "Vaccines", ta: null, name: "SP0342", desc: "Subunit adjuvanted vaccine", indication: "Shingles" },
  { businessUnit: "Vaccines", ta: null, name: "SP0256", desc: "mRNA vaccine", indication: "RSV + hMPV (older adults)" },
  { businessUnit: "Vaccines", ta: null, name: "SP0268", desc: "mRNA vaccine", indication: "Acne" },
  { businessUnit: "Vaccines", ta: null, name: "SP0289", desc: "mRNA vaccine", indication: "Influenza H5 pandemic" },
  { businessUnit: "Vaccines", ta: null, name: "SP0335", desc: "Inactivated adjuvanted vaccine", indication: "Influenza H5 pandemic" },
  { businessUnit: "Vaccines", ta: null, name: "SP0202", desc: "21-valent conjugate vaccine", indication: "Pneumococcal disease (children)" },
  { businessUnit: "Vaccines", ta: null, name: "SP0218", desc: "Vero cell vaccine", indication: "Yellow fever" },
  { businessUnit: "Vaccines", ta: null, name: "Fluzone HD", desc: "Multivalent inactivated vaccine", indication: "Influenza (50 years+) (US, EU)" },
  { businessUnit: "Vaccines", ta: null, name: "SP0087", desc: "Vero cell vaccine", indication: "Rabies (EU)" }
];

/**
 * The grouping label to show for a pipeline asset: its therapeutic area, or its
 * business unit when no therapeutic area is recorded. Returns "" rather than a
 * placeholder — an empty pill is honest, "null" or "Unknown TA" is not.
 */
export function pipelineAreaLabel(p) {
  return p.ta || p.businessUnit || "";
}

const PIPELINE_GENERIC_TERMS = new Set([
  "pipeline", "project", "projects", "drug", "drugs", "molecule", "compound",
  "development", "clinical", "stage", "phase", "the", "and", "for", "are",
  "any", "what", "which", "with", "from", "about", "this", "that", "does",
  "sanofi", "new", "indication", "indications", "treatment", "disease",
  "patient", "patients", "multiple", "chronic", "type"
]);

/**
 * Match pipeline assets on indication, mechanism, molecule name or therapeutic
 * area. Returns nothing when the query names none of those — a pipeline list is
 * only useful when it is about the thing that was asked.
 */
export function searchPipeline(query, limit = 6) {
  const terms = query.toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter(t => t.length > 2 && !PIPELINE_GENERIC_TERMS.has(t));

  if (!terms.length) return [];

  const scored = pipeline.map(p => {
    // pipelineAreaLabel rather than p.ta: a vaccine row has no therapeutic
    // area, and interpolating null would put the word "null" in the haystack
    // and let a query for "null" match every vaccine.
    const hay = `${p.name} ${p.desc} ${p.indication} ${pipelineAreaLabel(p)}`.toLowerCase();
    const words = new Set(hay.split(/[^a-z0-9-]+/).filter(Boolean));
    let score = 0;
    for (const t of terms) {
      if (words.has(t)) score += 4;
      else if (hay.includes(t)) score += 2;
    }
    return { ...p, score };
  });

  return scored
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
