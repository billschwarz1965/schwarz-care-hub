// Sanofi US Clinical Studies — sourced from sanofistudies.com (91 studies)
//
// This is a portfolio inventory: one compact row per study, one `disease` each,
// `ta` for the therapeutic area — or `businessUnit` instead, on the vaccine rows
// where no therapeutic area is recorded. trials-data.js models the same domain
// differently (`therapeuticArea`, `conditions[]`) and the two are NOT merged —
// see the "TRIAL SCHEMA RECONCILIATION" note in taxonomy.js for why, and for
// trialFacets(), which reads either shape and returns canonical area ids so one
// filter can query both.
//
// `disease` here is finer-grained than the `diseaseArea` vocabulary elsewhere in
// the POC (Crohn's Disease and Ulcerative Colitis rather than IBD). That is
// correct for an inventory and taxonomy.js handles it: those two carry
// `parent: "inflammatory-bowel-disease"`, so a filter at either granularity
// finds both.
export const SANOFI_STUDIES = [
  { nct: "NCT06241118", drug: "Amlitelimab", ta: "Dermatology", disease: "Atopic Dermatitis", title: "Atopic Dermatitis (biologic-refractory, 12+)", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT05769777", drug: "Amlitelimab", ta: "Dermatology", disease: "Atopic Dermatitis", title: "Atopic Dermatitis OLE (12+)", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06407934", drug: "Amlitelimab", ta: "Dermatology", disease: "Atopic Dermatitis", title: "Atopic Dermatitis dose regimen (12+)", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT06444451", drug: "Amlitelimab", ta: "Dermatology", disease: "Alopecia Areata", title: "Alopecia Areata (severe)", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT06790121", drug: "Lunsekimig", ta: "Dermatology", disease: "Atopic Dermatitis", title: "Atopic Dermatitis (moderate-severe)", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT07170917", drug: "Brivekimig", ta: "Dermatology", disease: "Hidradenitis Suppurativa", title: "HS (moderate-severe) Ph2", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT07225569", drug: "SAR445399", ta: "Dermatology", disease: "Hidradenitis Suppurativa", title: "HS (moderate-severe)", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT05263206", drug: "Dupilumab", ta: "Dermatology", disease: "Prurigo Nodularis", title: "CPUO Phase 3", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06293053", drug: "Dupilumab", ta: "Dermatology", disease: "Prurigo Nodularis", title: "Prurigo Nodularis pediatric (6m-18y)", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06687967", drug: "Dupilumab", ta: "Dermatology", disease: "Lichen Simplex Chronicus", title: "Lichen Simplex Chronicus STYLE 1", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT06687980", drug: "Dupilumab", ta: "Dermatology", disease: "Lichen Simplex Chronicus", title: "Lichen Simplex Chronicus STYLE 2", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT05983068", drug: "Dupilumab", ta: "Dermatology", disease: "Atopic Dermatitis", title: "AD skin barrier pediatric Ph4", phase: "Phase 4", status: "Active NR" },
  { nct: "NCT06481904", drug: "Teplizumab (TZIELD)", ta: "Diabetes", disease: "Type 1 Diabetes", title: "Stage 2 T1D registry", phase: "N/A", status: "Recruiting" },
  { nct: "NCT07088068", drug: "Teplizumab (TZIELD)", ta: "Diabetes", disease: "Type 1 Diabetes", title: "Stage 3 T1D (1-25 yrs)", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT05757713", drug: "Teplizumab (TZIELD)", ta: "Diabetes", disease: "Type 1 Diabetes", title: "Pediatric Stage 2 T1D", phase: "Phase 4", status: "Active NR" },
  { nct: "NCT06812988", drug: "Anti-OX40L/Anti-TNF", ta: "Diabetes", disease: "Type 1 Diabetes", title: "T1D nanobody", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT06111586", drug: "Frexalimab", ta: "Diabetes", disease: "Type 1 Diabetes", title: "T1D insulin preservation FABULINUS", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06557772", drug: "Amlitelimab", ta: "Gastroenterology", disease: "Celiac Disease", title: "Nonresponsive Celiac Disease", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT07184931", drug: "Duvakitug", ta: "Gastroenterology", disease: "Crohn's Disease", title: "Crohn's Disease Induction", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT07184944", drug: "Duvakitug", ta: "Gastroenterology", disease: "Crohn's Disease", title: "Crohn's Disease Maintenance", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT07184996", drug: "Duvakitug", ta: "Gastroenterology", disease: "Ulcerative Colitis", title: "Ulcerative Colitis Induction", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT07185009", drug: "Duvakitug", ta: "Gastroenterology", disease: "Ulcerative Colitis", title: "Ulcerative Colitis Maintenance", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06637631", drug: "SAR441566", ta: "Gastroenterology", disease: "Crohn's Disease", title: "Crohn's Disease Ph2", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06867094", drug: "SAR441566", ta: "Gastroenterology", disease: "Ulcerative Colitis", title: "Ulcerative Colitis Ph2", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06958536", drug: "SAR442970", ta: "Gastroenterology", disease: "Crohn's Disease", title: "Crohn's Disease SAR442970", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06975722", drug: "SAR442970", ta: "Gastroenterology", disease: "Ulcerative Colitis", title: "Ulcerative Colitis SAR442970", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT05731128", drug: "Dupilumab", ta: "Gastroenterology", disease: "Ulcerative Colitis", title: "UC eosinophilic phenotype", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT05588843", drug: "SAR443122", ta: "Gastroenterology", disease: "Ulcerative Colitis", title: "UC dose-finding SAR443122", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT06101095", drug: "Dupilumab", ta: "Gastroenterology", disease: "Eosinophilic Esophagitis", title: "EoE remodeling OLE", phase: "Phase 4", status: "Active NR" },
  { nct: "NCT07086976", drug: "Rilzabrutinib", ta: "Hematology", disease: "Warm AIHA", title: "Warm Autoimmune Hemolytic Anemia Ph3", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT07007962", drug: "Rilzabrutinib", ta: "Hematology", disease: "ITP", title: "Immune Thrombocytopenia (ITP) Ph3", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT07190196", drug: "Rilzabrutinib", ta: "Hematology", disease: "IgG4-RD", title: "IgG4-related Disease Ph3", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06975865", drug: "Rilzabrutinib", ta: "Hematology", disease: "Sickle Cell Disease", title: "Sickle Cell Disease Ph3", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT05002777", drug: "Rilzabrutinib", ta: "Hematology", disease: "Warm AIHA", title: "Warm AIHA Phase 2 OLE", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT05039840", drug: "Frexalimab", ta: "Immunology", disease: "Lupus", title: "Systemic Lupus Erythematosus SLE Ph2", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06141486", drug: "Frexalimab", ta: "Neurology", disease: "Multiple Sclerosis", title: "Nonrelapsing SPMS", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06141473", drug: "Frexalimab", ta: "Neurology", disease: "Multiple Sclerosis", title: "Relapsing Forms of MS", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT07325292", drug: "Frexalimab", ta: "Neurology", disease: "Multiple Sclerosis", title: "MS SC vs IV formulation non-inferiority", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT04879628", drug: "Frexalimab", ta: "Neurology", disease: "Multiple Sclerosis", title: "Relapsing MS proof-of-concept", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT06372145", drug: "Tolebrutinib", ta: "Neurology", disease: "Multiple Sclerosis", title: "MS long-term safety OLE", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT06290128", drug: "Riliprubart", ta: "Neurology / Immunology", disease: "CIDP", title: "CIDP (Refractory to standard treatment)", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06290141", drug: "Riliprubart", ta: "Neurology / Immunology", disease: "CIDP", title: "CIDP vs IVIg active comparator", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT05584670", drug: "SAR445877", ta: "Oncology", disease: "Solid Tumors", title: "Advanced Solid Tumors Ph1/2", phase: "Phase 1/2", status: "Recruiting" },
  { nct: "NCT06356571", drug: "Isatuximab SC", ta: "Oncology", disease: "Multiple Myeloma", title: "Relapsed/Refractory MM isatuximab SC", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06630806", drug: "SAR446523", ta: "Oncology", disease: "Multiple Myeloma", title: "RRMM SAR446523", phase: "Phase 1", status: "Recruiting" },
  { nct: "NCT04643002", drug: "Isatuximab", ta: "Oncology", disease: "Multiple Myeloma", title: "RRMM master protocol", phase: "Phase 1", status: "Recruiting" },
  { nct: "NCT05405166", drug: "Isatuximab SC", ta: "Oncology", disease: "Multiple Myeloma", title: "RRMM SC vs IV non-inferiority Ph3", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT05669989", drug: "Isatuximab", ta: "Oncology", disease: "Multiple Myeloma", title: "MM treatment extension OLE Ph2", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT07215234", drug: "SAR446597", ta: "Ophthalmology", disease: "Geographic Atrophy", title: "Geographic Atrophy AMD Ph1", phase: "Phase 1", status: "Recruiting" },
  { nct: "NCT06660667", drug: "SAR402663", ta: "Ophthalmology", disease: "Neovascular AMD", title: "Neovascular AMD one-time injection Ph1", phase: "Phase 1", status: "Recruiting" },
  { nct: "NCT07146750", drug: "Amlitelimab", ta: "Other", disease: "Bioequivalence", title: "Bioequivalence device study (healthy adults)", phase: "Phase 1", status: "Active NR" },
  { nct: "NCT07272629", drug: "Balinatunfib", ta: "Other", disease: "Cardiac", title: "Cardiac Repolarization healthy volunteers Ph1", phase: "Phase 1", status: "Recruiting" },
  { nct: "NCT06805513", drug: "Tadalafil 5 mg", ta: "Other", disease: "Urology", title: "Actual Use Trial Ph3", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06500702", drug: "Frexalimab/Brivekimig/Rilzabrutinib", ta: "Rare Diseases", disease: "FSGS", title: "FSGS / Minimal Change Disease", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06941870", drug: "Efanesoctocog alfa", ta: "Rare Diseases", disease: "Hemophilia A", title: "Hemophilia A synovial hypertrophy Ph4", phase: "Phase 4", status: "Recruiting" },
  { nct: "NCT07285460", drug: "Fitusiran", ta: "Rare Diseases", disease: "Hemophilia", title: "Hemophilia A/B pediatric (1-12y)", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06145373", drug: "Fitusiran", ta: "Rare Diseases", disease: "Hemophilia", title: "Hemophilia switch from emicizumab Ph4", phase: "Phase 4", status: "Recruiting" },
  { nct: "NCT05662319", drug: "Fitusiran", ta: "Rare Diseases", disease: "Hemophilia", title: "Hemophilia A/B adolescent/adult", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT05911763", drug: "Efanesoctocog alfa", ta: "Rare Diseases", disease: "Hemophilia A", title: "Hemophilia A long-term joint health", phase: "N/A", status: "Active NR" },
  { nct: "NCT05897424", drug: "SAR447537 (INBRX-101)", ta: "Rare Diseases", disease: "AATD", title: "Alpha-1 Antitrypsin Deficiency", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06843214", drug: "SAR446268", ta: "Rare Diseases", disease: "Myotonic Dystrophy", title: "Myotonic Dystrophy Type 1 gene therapy", phase: "Phase 1", status: "Recruiting" },
  { nct: "NCT07116031", drug: "Belumosudil", ta: "Rare Diseases", disease: "Chronic GvHD", title: "Chronic GvHD pediatric", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06082037", drug: "Belumosudil", ta: "Rare Diseases", disease: "Chronic GvHD", title: "Chronic Lung Allograft Dysfunction Ph3", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06143891", drug: "Belumosudil", ta: "Rare Diseases", disease: "Chronic GvHD", title: "Newly Diagnosed Chronic GvHD (12+)", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT05280548", drug: "Venglustat", ta: "Rare Diseases", disease: "Fabry Disease", title: "Fabry Disease LV mass index Ph3", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT05222906", drug: "Venglustat", ta: "Rare Diseases", disease: "Gaucher Disease", title: "Gaucher Disease Type 3 Ph3", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT05206773", drug: "Venglustat", ta: "Rare Diseases", disease: "Fabry Disease", title: "Fabry Disease neuropathic pain Ph3", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT04910776", drug: "Avalglucosidase alfa", ta: "Rare Diseases", disease: "Pompe Disease", title: "IOPD treatment-naive infants Ph3", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT05156710", drug: "BIVV020 (SAR445088)", ta: "Rare Diseases", disease: "Antibody-mediated Rejection", title: "Antibody-mediated Rejection transplant", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT05972629", drug: "SAR444836", ta: "Rare Diseases", disease: "Phenylketonuria", title: "Phenylketonuria Ph1", phase: "Phase 1", status: "Active NR" },
  { nct: "NCT06033833", drug: "Amlitelimab", ta: "Respiratory", disease: "Asthma", title: "Moderate-severe Asthma OLE", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT06676319", drug: "Lunsekimig", ta: "Respiratory", disease: "Asthma", title: "High-risk Asthma (18-80)", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06609239", drug: "Lunsekimig", ta: "Respiratory", disease: "Asthma", title: "Asthma long-term OLE", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06191315", drug: "Dupilumab", ta: "Respiratory", disease: "Asthma", title: "Asthma/Wheeze (2-6 yrs) TREKIDS", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT05097287", drug: "Dupilumab", ta: "Respiratory", disease: "Asthma", title: "Asthma lung function decline (adults)", phase: "Phase 4", status: "Recruiting" },
  { nct: "NCT07190222", drug: "Lunsekimig", ta: "Respiratory", disease: "COPD", title: "COPD eosinophilic phenotype Study A", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT07190209", drug: "Lunsekimig", ta: "Respiratory", disease: "COPD", title: "COPD eosinophilic phenotype Study B", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT07053423", drug: "Dupilumab", ta: "Respiratory", disease: "COPD", title: "COPD airway inflammation AEOLUS", phase: "Phase 4", status: "Recruiting" },
  { nct: "NCT06208306", drug: "Itepekimab", ta: "Respiratory", disease: "COPD", title: "COPD long-term safety", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT06834347", drug: "Itepekimab", ta: "Respiratory", disease: "CRSwNP", title: "Chronic Rhinosinusitis with Nasal Polyps 1", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06834360", drug: "Itepekimab", ta: "Respiratory", disease: "CRSwNP", title: "Chronic Rhinosinusitis with Nasal Polyps 2", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06914908", drug: "Lunsekimig", ta: "Respiratory", disease: "CRSwNP", title: "CRSwNP long-term OLE", phase: "Phase 2", status: "Recruiting" },
  { nct: "NCT06454240", drug: "Lunsekimig", ta: "Respiratory", disease: "CRSwNP", title: "CRSwNP proof-of-concept", phase: "Phase 2", status: "Active NR" },
  { nct: "NCT06691113", drug: "Itepekimab", ta: "Respiratory", disease: "CRS", title: "CRS without Nasal Polyps", phase: "Phase 2", status: "Active NR" },
  // These 7 rows carry `businessUnit` instead of `ta`, for the same reason as
  // the Vaccines block in pipeline-data.js: "Vaccines" is a Sanofi global
  // business unit, not a therapeutic area, and storing it in `ta` made the two
  // axes indistinguishable. Unlike the pipeline rows, these do record a real
  // `disease`, so only the area is unknown.
  // TODO(business): supply the therapeutic area for each vaccine study.
  { nct: "NCT07247188", drug: "PCV21", ta: null, businessUnit: "Vaccines", disease: "Pneumococcal", title: "PCV21 Sickle Cell Disease Ph3", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06824194", drug: "PCV21", ta: null, businessUnit: "Vaccines", disease: "Pneumococcal", title: "PCV21 healthy infants safety Ph3", phase: "Phase 3", status: "Recruiting" },
  { nct: "NCT06824181", drug: "PCV21/PCV20", ta: null, businessUnit: "Vaccines", disease: "Pneumococcal", title: "Mixed vaccination schedule infants Ph3", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT07079670", drug: "NVX-CoV2705", ta: null, businessUnit: "Vaccines", disease: "COVID-19", title: "COVID-19 vaccine Ph3", phase: "Phase 3", status: "Active NR" },
  { nct: "NCT06907511", drug: "mRNA H5 Flu vaccine", ta: null, businessUnit: "Vaccines", disease: "Influenza", title: "Pandemic Influenza H5 healthy adults Ph1", phase: "Phase 1", status: "Active NR" },
  { nct: "NCT06695117", drug: "COVID+Flu combo", ta: null, businessUnit: "Vaccines", disease: "COVID/Flu", title: "COVID+Flu combo (50+) Study A Ph1", phase: "Phase 1", status: "Active NR" },
  { nct: "NCT06695130", drug: "COVID+Flu combo", ta: null, businessUnit: "Vaccines", disease: "COVID/Flu", title: "COVID+Flu combo (50+) Study B Ph1", phase: "Phase 1", status: "Active NR" }
];

export function findStudiesByDisease(keyword) {
  const kw = keyword.toLowerCase();
  return SANOFI_STUDIES.filter(s =>
    s.disease.toLowerCase().includes(kw) || s.title.toLowerCase().includes(kw)
  );
}

export function findRecruitingStudies(disease) {
  return findStudiesByDisease(disease).filter(s => s.status === "Recruiting");
}

export function getStudyStats() {
  const recruiting = SANOFI_STUDIES.filter(s => s.status === "Recruiting").length;
  // Boolean filter, because the vaccine rows carry no `ta` — counting null as a
  // therapeutic area would report the same total as before the split and hide
  // the fact that seven studies have no area recorded.
  const tas = new Set(SANOFI_STUDIES.map(s => s.ta).filter(Boolean));
  const drugs = new Set(SANOFI_STUDIES.map(s => s.drug));
  return {
    total: SANOFI_STUDIES.length,
    recruiting,
    tas: tas.size,
    drugs: drugs.size,
    withoutTa: SANOFI_STUDIES.filter(s => !s.ta).length,
  };
}
