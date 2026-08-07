const PATHWAYS = {
  "type2": {
    id: "type2", name: "Type 2 Inflammation",
    description: "An immune response driven by Th2 cells, ILC2s, and key cytokines IL-4, IL-13, and IL-5. Underlies multiple atopic and eosinophilic conditions across organ systems.",
    cytokines: ["IL-4", "IL-13", "IL-5", "TSLP", "IL-33", "IL-25"],
    biomarkers: ["IgE", "Eosinophils", "FeNO", "Periostin", "TARC"],
    color: "#7a00e6",
  },
  "il23th17": {
    id: "il23th17", name: "IL-23/Th17 Pathway",
    description: "The IL-23/Th17 axis drives neutrophilic and mixed inflammation in autoimmune conditions, particularly psoriasis and inflammatory bowel disease.",
    cytokines: ["IL-23", "IL-17A", "IL-17F", "IL-22", "TNF-α"],
    biomarkers: ["CRP", "Neutrophils", "IL-17 serum levels"],
    color: "#e5a800",
  },
  "il6jak": {
    id: "il6jak", name: "IL-6/JAK-STAT Pathway",
    description: "IL-6 signals through the JAK-STAT cascade to drive systemic inflammation, joint destruction, and acute-phase responses in rheumatic diseases.",
    cytokines: ["IL-6", "TNF-α", "IL-1β", "GM-CSF"],
    biomarkers: ["CRP", "ESR", "RF", "Anti-CCP", "SAA"],
    color: "#0f6e56",
  },
};

const DISEASES = [
  {
    id: "ad", name: "Atopic Dermatitis", abbrev: "AD",
    area: "Dermatology", icon: "droplet",
    pathways: ["type2"],
    prevalence: "Up to 10% of adults; 20% of children globally",
    burden: "Chronic, relapsing skin inflammation with intense pruritus. Significant impact on sleep, mental health, and quality of life. Disease burden often underestimated.",
    pathophysiology: "Skin barrier dysfunction (filaggrin mutations) combined with type 2 immune dysregulation. IL-4 and IL-13 drive IgE class switching, eosinophil recruitment, barrier disruption, and pruritus. IL-31 mediates itch signaling.",
    keyBiomarkers: ["IgE", "Eosinophils", "TARC/CCL17", "Periostin", "EASI score"],
    treatmentLandscape: [
      { category: "Topical", agents: ["Corticosteroids", "Calcineurin inhibitors", "PDE4 inhibitors (crisaborole)", "JAK inhibitors (ruxolitinib)"] },
      { category: "Systemic", agents: ["Dupilumab (IL-4Rα)", "Tralokinumab (IL-13)", "JAK inhibitors (abrocitinib, upadacitinib, baricitinib)"] },
      { category: "Pipeline", agents: ["Nemolizumab (IL-31Rα)", "Lebrikizumab (IL-13)", "Amlitelimab (OX40L)"] },
    ],
    sanofiRole: "Dupixent (dupilumab) — first biologic approved for moderate-to-severe AD. Targets IL-4Rα, blocking both IL-4 and IL-13 signaling. Approved in adults and children 6 months+.",
    connections: ["asthma", "crswp", "eoe", "pn"],
    connectionReason: "Shared type 2 inflammatory pathway — patients often progress through the 'atopic march' from AD to asthma, rhinosinusitis, and food allergy.",
  },
  {
    id: "asthma", name: "Type 2 Asthma", abbrev: "T2 Asthma",
    area: "Respiratory", icon: "lungs",
    pathways: ["type2"],
    prevalence: "~300M worldwide; ~50-70% have type 2 phenotype",
    burden: "Chronic airway inflammation with recurrent exacerbations. Uncontrolled asthma drives ER visits, hospitalizations, oral corticosteroid dependence, and airway remodeling.",
    pathophysiology: "Allergen or innate triggers activate epithelial alarmins (TSLP, IL-33, IL-25), driving Th2 and ILC2 responses. IL-4/IL-13 cause mucus hypersecretion, airway hyperresponsiveness, and remodeling. IL-5 drives eosinophilic inflammation.",
    keyBiomarkers: ["FeNO", "Blood eosinophils", "IgE", "Periostin"],
    treatmentLandscape: [
      { category: "Controller", agents: ["ICS/LABA", "LTRA (montelukast)", "LAMA (tiotropium)"] },
      { category: "Biologic", agents: ["Dupilumab (IL-4Rα)", "Tezepelumab (TSLP)", "Omalizumab (IgE)", "Mepolizumab (IL-5)", "Benralizumab (IL-5Rα)"] },
      { category: "Pipeline", agents: ["Itepekimab (IL-33)", "Astegolimab (IL-33)"] },
    ],
    sanofiRole: "Dupixent (dupilumab) — approved as add-on maintenance for moderate-to-severe eosinophilic/OCS-dependent asthma. Reduces exacerbations and OCS dependence.",
    connections: ["ad", "crswp", "eoe"],
    connectionReason: "Type 2 inflammation drives both allergic and eosinophilic asthma. Comorbidity with AD and CRSwNP is extremely common.",
  },
  {
    id: "crswp", name: "CRSwNP", abbrev: "CRSwNP",
    area: "Rhinology", icon: "nose",
    pathways: ["type2"],
    prevalence: "~2-4% of general population; nasal polyps in ~25-30% of CRS",
    burden: "Chronic rhinosinusitis with nasal polyps causes nasal obstruction, anosmia, facial pain, and recurrent infections. High surgical recurrence rates. Major QoL impact.",
    pathophysiology: "Type 2 inflammation drives eosinophilic infiltration, edema, and polyp formation. IL-4 and IL-13 promote tissue remodeling, mucus production, and IgE-mediated responses. Often co-exists with asthma and NSAID-exacerbated respiratory disease.",
    keyBiomarkers: ["Tissue eosinophils", "IgE", "Periostin", "NPS (nasal polyp score)", "SNOT-22"],
    treatmentLandscape: [
      { category: "Medical", agents: ["Intranasal corticosteroids", "Short-course oral steroids", "Saline irrigation"] },
      { category: "Biologic", agents: ["Dupilumab (IL-4Rα)", "Omalizumab (IgE)", "Mepolizumab (IL-5)"] },
      { category: "Surgical", agents: ["Endoscopic sinus surgery (ESS)"] },
    ],
    sanofiRole: "Dupixent (dupilumab) — first biologic approved for CRSwNP. Reduces nasal polyp size, improves congestion and smell, and delays need for surgery.",
    connections: ["asthma", "ad"],
    connectionReason: "Part of the unified airway concept — type 2 inflammation affects upper and lower airways simultaneously. >50% of CRSwNP patients have comorbid asthma.",
  },
  {
    id: "eoe", name: "Eosinophilic Esophagitis", abbrev: "EoE",
    area: "Gastroenterology", icon: "bottle",
    pathways: ["type2"],
    prevalence: "~1 in 2,000 adults; rising incidence over past two decades",
    burden: "Chronic esophageal inflammation causing dysphagia, food impaction, and stricture formation. Progressive disease leads to esophageal remodeling and fibrosis. Patients develop adaptive eating behaviors.",
    pathophysiology: "Allergen-driven type 2 response in esophageal epithelium. IL-13 is the dominant effector cytokine, driving eotaxin-3 expression, eosinophil recruitment, epithelial barrier disruption, and fibrostenotic remodeling.",
    keyBiomarkers: ["Esophageal eosinophil count (≥15/HPF)", "Eotaxin-3", "DSQ score", "Endoscopic EREFS"],
    treatmentLandscape: [
      { category: "Dietary", agents: ["Elimination diets (6-food, 2-food)", "Elemental diet"] },
      { category: "Medical", agents: ["Dupilumab (IL-4Rα)", "Swallowed topical corticosteroids (budesonide, fluticasone)"] },
      { category: "Interventional", agents: ["Esophageal dilation"] },
    ],
    sanofiRole: "Dupixent (dupilumab) — first and only FDA-approved treatment specifically for EoE (ages 1+). Reduces esophageal eosinophils, improves dysphagia and histologic outcomes.",
    connections: ["ad", "asthma"],
    connectionReason: "Part of the atopic march. ~50-75% of EoE patients have concurrent atopic disease (AD, asthma, allergic rhinitis). Shared IL-4/IL-13 pathway.",
  },
  {
    id: "copd", name: "COPD", abbrev: "COPD",
    area: "Respiratory", icon: "wind",
    pathways: ["type2"],
    prevalence: "~380M worldwide; type 2 high phenotype in ~30-40%",
    burden: "Progressive airflow limitation with frequent exacerbations. Leading cause of mortality. Type 2 high COPD subgroup has elevated eosinophils and may respond to targeted therapy.",
    pathophysiology: "Mixed inflammatory phenotype. Type 2 high COPD features eosinophilic airway inflammation driven by IL-4, IL-13, and IL-5, superimposed on structural damage. Overlaps with asthma-COPD overlap (ACO).",
    keyBiomarkers: ["Blood eosinophils ≥300 cells/µL", "FeNO", "IgE", "Exacerbation history"],
    treatmentLandscape: [
      { category: "Standard", agents: ["LAMA/LABA", "ICS/LAMA/LABA triple therapy", "PDE4 inhibitors (roflumilast)"] },
      { category: "Biologic (emerging)", agents: ["Dupilumab (IL-4Rα — Phase 3)", "Benralizumab (IL-5Rα)", "Tezepelumab (TSLP — investigational)"] },
    ],
    sanofiRole: "Dupixent (dupilumab) — BOREAS and NOTUS Phase 3 trials showed significant exacerbation reduction in type 2 high COPD. Regulatory submissions underway.",
    connections: ["asthma"],
    connectionReason: "Type 2 high COPD shares eosinophilic inflammation pathway with type 2 asthma. Asthma-COPD overlap is a recognized clinical entity.",
  },
  {
    id: "pn", name: "Prurigo Nodularis", abbrev: "PN",
    area: "Dermatology", icon: "circles",
    pathways: ["type2"],
    prevalence: "~72 per 100,000; underdiagnosed, disproportionately affects Black patients",
    burden: "Intensely pruritic nodules causing severe itch, sleep disruption, and psychiatric comorbidity. Often refractory to conventional therapies. Significant health disparities in diagnosis and treatment.",
    pathophysiology: "Neuroimmune disorder driven by type 2 inflammation. IL-4, IL-13, and IL-31 drive itch and nodule formation through sensory neuron sensitization and cutaneous inflammation. Neural-immune crosstalk is central.",
    keyBiomarkers: ["Eosinophils", "IgE", "IL-31", "Pruritus NRS", "IGA-PN score"],
    treatmentLandscape: [
      { category: "Topical", agents: ["High-potency corticosteroids", "Calcineurin inhibitors"] },
      { category: "Systemic", agents: ["Dupilumab (IL-4Rα)", "Nemolizumab (IL-31Rα — approved 2024)"] },
      { category: "Neuromodulators", agents: ["Gabapentin", "SSRIs", "Naltrexone"] },
    ],
    sanofiRole: "Dupixent (dupilumab) — FDA approved for PN. Reduces itch and nodule count by targeting the IL-4/IL-13 axis driving neuroimmune inflammation.",
    connections: ["ad"],
    connectionReason: "Shares type 2 inflammatory drivers with AD. Many PN patients have atopic background. IL-4Rα blockade effective in both conditions.",
  },
  {
    id: "csu", name: "Chronic Spontaneous Urticaria", abbrev: "CSU",
    area: "Dermatology / Allergy", icon: "flame",
    pathways: ["type2"],
    prevalence: "~0.5-1% of the population; women affected 2:1",
    burden: "Recurrent wheals and/or angioedema lasting >6 weeks. Unpredictable flares severely impact daily functioning, work productivity, and mental health.",
    pathophysiology: "Mast cell-driven condition with autoimmune (IgG anti-FcεRI/IgE) and type 2 (IgE-mediated) components. IL-4 and IL-13 contribute to IgE class switching and mast cell priming.",
    keyBiomarkers: ["Total IgE", "IgG anti-FcεRI", "D-dimer", "CRP", "UAS7 score"],
    treatmentLandscape: [
      { category: "First-line", agents: ["Second-generation H1-antihistamines (up to 4x dose)"] },
      { category: "Biologic", agents: ["Omalizumab (IgE)", "Dupilumab (IL-4Rα — approved 2024)"] },
      { category: "Other", agents: ["Cyclosporine", "Ligelizumab (anti-IgE — investigational)"] },
    ],
    sanofiRole: "Dupixent (dupilumab) — approved for CSU inadequately controlled by H1-antihistamines. Targets the type 2 axis contributing to IgE-driven mast cell activation.",
    connections: ["ad", "asthma"],
    connectionReason: "IgE-mediated pathophysiology links CSU to the broader type 2 inflammatory landscape. Atopic comorbidities common in CSU patients.",
  },
  {
    id: "ra", name: "Rheumatoid Arthritis", abbrev: "RA",
    area: "Rheumatology", icon: "bone",
    pathways: ["il6jak"],
    prevalence: "~0.5-1% worldwide; 2-3x more common in women",
    burden: "Chronic, progressive joint destruction with systemic inflammation. Untreated leads to disability. Extra-articular manifestations affect cardiovascular, pulmonary systems.",
    pathophysiology: "Autoimmune synovitis driven by TNF-α, IL-6, and IL-1. IL-6 signals through JAK-STAT to amplify inflammation, drive CRP/SAA production, promote osteoclastogenesis and joint erosion. T cell and B cell autoimmunity central.",
    keyBiomarkers: ["RF", "Anti-CCP", "CRP", "ESR", "DAS28 score"],
    treatmentLandscape: [
      { category: "csDMARD", agents: ["Methotrexate", "Sulfasalazine", "Leflunomide", "Hydroxychloroquine"] },
      { category: "Biologic", agents: ["TNF inhibitors (adalimumab, etanercept)", "Sarilumab (IL-6R)", "Tocilizumab (IL-6R)", "Abatacept (CTLA-4)", "Rituximab (CD20)"] },
      { category: "tsDMARD", agents: ["JAK inhibitors (tofacitinib, baricitinib, upadacitinib)"] },
    ],
    sanofiRole: "Kevzara (sarilumab) — IL-6 receptor antagonist for moderate-to-severe RA. Monotherapy and combination with methotrexate. Superior to adalimumab monotherapy in MONARCH trial.",
    connections: ["psoriasis"],
    connectionReason: "Shared autoimmune mechanisms and JAK-STAT pathway involvement. TNF-α is a common therapeutic target. RA and psoriatic arthritis have overlapping treatment paradigms.",
  },
  {
    id: "psoriasis", name: "Psoriasis", abbrev: "PsO",
    area: "Dermatology", icon: "ripple",
    pathways: ["il23th17"],
    prevalence: "~2-3% of population; psoriatic arthritis in ~30%",
    burden: "Chronic inflammatory skin disease with systemic comorbidities (cardiovascular, metabolic, psychiatric). Visible lesions cause significant stigma and psychological burden.",
    pathophysiology: "IL-23 activates Th17 cells producing IL-17A/F, driving keratinocyte hyperproliferation, neutrophil recruitment, and epidermal thickening. TNF-α amplifies the inflammatory cascade.",
    keyBiomarkers: ["PASI score", "BSA", "CRP", "Neutrophils", "Skin biopsy (Munro microabscesses)"],
    treatmentLandscape: [
      { category: "Topical", agents: ["Corticosteroids", "Vitamin D analogues", "PDE4 inhibitors"] },
      { category: "Systemic", agents: ["Methotrexate", "Cyclosporine", "Apremilast"] },
      { category: "Biologic", agents: ["IL-23 inhibitors (guselkumab, risankizumab)", "IL-17 inhibitors (secukinumab, ixekizumab, bimekizumab)", "TNF inhibitors"] },
    ],
    sanofiRole: "MedVerse provides disease education and cross-TA context. Psoriasis–IBD comorbidity pathway is an area of active scientific exchange.",
    connections: ["ibd", "ra"],
    connectionReason: "IL-23/Th17 pathway drives both psoriasis and IBD. ~10% of psoriasis patients develop IBD. Shared therapeutic targets but paradoxical responses possible.",
  },
  {
    id: "ibd", name: "Inflammatory Bowel Disease", abbrev: "IBD",
    area: "Gastroenterology", icon: "intestine",
    pathways: ["il23th17"],
    prevalence: "~6-8M worldwide; Crohn's and UC roughly equal",
    burden: "Chronic relapsing GI inflammation (Crohn's disease and ulcerative colitis). Progressive bowel damage, surgical resections, colorectal cancer risk. Major QoL impact.",
    pathophysiology: "Mixed Th1/Th17 in Crohn's, Th2/Th17 in UC. IL-23 drives pathogenic Th17 responses and tissue destruction. Mucosal barrier dysfunction and dysbiosis contribute. TNF-α, IL-12/23, and integrins are key therapeutic targets.",
    keyBiomarkers: ["Fecal calprotectin", "CRP", "Endoscopic scores (SES-CD, Mayo)", "Mucosal healing"],
    treatmentLandscape: [
      { category: "Conventional", agents: ["5-ASA (mesalamine)", "Corticosteroids", "Thiopurines", "Methotrexate"] },
      { category: "Biologic", agents: ["TNF inhibitors (infliximab, adalimumab)", "IL-23 inhibitors (risankizumab, guselkumab, mirikizumab)", "Integrin inhibitors (vedolizumab)"] },
      { category: "Small molecule", agents: ["JAK inhibitors (tofacitinib, upadacitinib)", "S1P modulators (ozanimod)"] },
    ],
    sanofiRole: "MedVerse provides cross-TA disease education. IBD–psoriasis comorbidity and IL-23 pathway overlap are key scientific education topics.",
    connections: ["psoriasis", "eoe"],
    connectionReason: "IL-23/Th17 pathway shared with psoriasis. GI-specific type 2 overlap with EoE. Comorbidity management requires cross-specialty coordination.",
  },
];

function getDiseaseById(id) {
  return DISEASES.find(d => d.id === id);
}

function getConnectedDiseases(id) {
  const disease = getDiseaseById(id);
  if (!disease) return [];
  return disease.connections.map(cid => getDiseaseById(cid)).filter(Boolean);
}

function getDiseasesByPathway(pathwayId) {
  return DISEASES.filter(d => d.pathways.includes(pathwayId));
}

function getPathway(id) {
  return PATHWAYS[id];
}

export { DISEASES, PATHWAYS, getDiseaseById, getConnectedDiseases, getDiseasesByPathway, getPathway };
