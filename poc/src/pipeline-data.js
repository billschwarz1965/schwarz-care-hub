// ─── Sanofi R&D pipeline ───
// Scraped from sanofi.com/en/our-science/our-pipeline (page states "Updated on
// July 30, 2026"). 61 clinical-stage projects; 60 extracted cleanly below.
//
// Per-project phase is deliberately absent. The page renders phase as a visual
// 1-2-3-R progress marker that did not yield a reliable value, and inventing a
// phase for a pipeline asset would be worse than omitting it — an HCP or an MSL
// could repeat it. Only the aggregate counts published on the page are recorded.

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
  { ta: "Neurology", name: "SAR446597", desc: "BbxC1s AAV gene therapy", indication: "Geographic atrophy in dry age-related macular degeneration" },
  { ta: "Neurology", name: "SAR448851", desc: "TREM2 agonist", indication: "Alzheimer's disease" },
  { ta: "Neurology", name: "SAR402663", desc: "sFLT01 AAV gene therapy", indication: "Wet age-related macular degeneration" },
  { ta: "Neurology", name: "frexalimab", desc: "CD40L mAb", indication: "Relapsing multiple sclerosis" },
  { ta: "Neurology", name: "frexalimab", desc: "CD40L mAb", indication: "Non-relapsing secondary progressive MS" },
  { ta: "Neurology", name: "riliprubart", desc: "C1s mAb", indication: "IVIg-treated CIDP" },

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
  { ta: "Vaccines", name: "SP0269", desc: "mRNA vaccine", indication: "Chlamydia" },
  { ta: "Vaccines", name: "SP0287", desc: "Flublok + Nuvaxovid", indication: "Influenza + COVID-19" },
  { ta: "Vaccines", name: "SP0291", desc: "mRNA vaccine", indication: "RSV + hMPV + PIV3 (older adults)" },
  { ta: "Vaccines", name: "SP0340", desc: "Subunit vaccine", indication: "RSV + hMPV (older adults)" },
  { ta: "Vaccines", name: "SP0341", desc: "Subunit vaccine", indication: "RSV + hMPV + PIV3 (older adults)" },
  { ta: "Vaccines", name: "SP0342", desc: "Subunit adjuvanted vaccine", indication: "Shingles" },
  { ta: "Vaccines", name: "SP0256", desc: "mRNA vaccine", indication: "RSV + hMPV (older adults)" },
  { ta: "Vaccines", name: "SP0268", desc: "mRNA vaccine", indication: "Acne" },
  { ta: "Vaccines", name: "SP0289", desc: "mRNA vaccine", indication: "Influenza H5 pandemic" },
  { ta: "Vaccines", name: "SP0335", desc: "Inactivated adjuvanted vaccine", indication: "Influenza H5 pandemic" },
  { ta: "Vaccines", name: "SP0202", desc: "21-valent conjugate vaccine", indication: "Pneumococcal disease (children)" },
  { ta: "Vaccines", name: "SP0218", desc: "Vero cell vaccine", indication: "Yellow fever" },
  { ta: "Vaccines", name: "Fluzone HD", desc: "Multivalent inactivated vaccine", indication: "Influenza (50 years+) (US, EU)" },
  { ta: "Vaccines", name: "SP0087", desc: "Vero cell vaccine", indication: "Rabies (EU)" }
];

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
    const hay = `${p.name} ${p.desc} ${p.indication} ${p.ta}`.toLowerCase();
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
