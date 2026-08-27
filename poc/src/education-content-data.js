// External HCP educational content indexed from Sanofi's medical education properties.
// Distinct from knowledgeBase (clinical evidence docs) — these are multimedia learning
// resources (podcasts, videos, infographics, articles) whose *location* (source program +
// URL) is the point of citing them, not a clinical claim.
export const educationContent = [
  // --- ADVENT (adventprogram.com) — Sanofi & Regeneron type 2 inflammation education ---
  {
    id: "EDU-ADV-001",
    title: "ADVENT On-Air Podcast: Growth and Children With AD",
    contentType: "podcast",
    duration: "13 min",
    diseaseArea: "Atopic Dermatitis",
    therapeuticArea: "Immunology",
    program: "ADVENT",
    url: "https://adventprogram.com",
    keywords: ["atopic dermatitis", "AD", "children", "pediatric", "growth", "podcast"]
  },
  {
    id: "EDU-ADV-002",
    title: "The Type 2 Inflammatory Link in AD, CSU, and PN",
    contentType: "video",
    duration: "15 min",
    diseaseArea: "Cross-TA Immunology",
    therapeuticArea: "Immunology",
    program: "ADVENT",
    url: "https://adventprogram.com",
    keywords: ["type 2 inflammation", "atopic dermatitis", "AD", "chronic spontaneous urticaria", "CSU", "prurigo nodularis", "PN", "cross-TA", "shared pathway", "IL-4", "IL-13"]
  },
  {
    id: "EDU-ADV-003",
    title: "Unpacking the Significant Burdens of Atopic Dermatitis",
    contentType: "video",
    duration: "2 min",
    diseaseArea: "Atopic Dermatitis",
    therapeuticArea: "Immunology",
    program: "ADVENT",
    url: "https://adventprogram.com",
    keywords: ["atopic dermatitis", "AD", "disease burden", "quality of life"]
  },
  {
    id: "EDU-ADV-004",
    title: "ADVENT On Air | Dysphagia in EoE: How Can You See Beyond Patients' Adaptive Behaviors?",
    contentType: "podcast",
    duration: "17 min",
    diseaseArea: "Eosinophilic Esophagitis",
    therapeuticArea: "Immunology / Gastroenterology",
    program: "ADVENT",
    url: "https://adventprogram.com",
    keywords: ["EoE", "eosinophilic esophagitis", "dysphagia", "type 2 inflammation", "gastroenterology"]
  },
  {
    id: "EDU-ADV-005",
    title: "On-Treatment Asthma Remission Infographic",
    contentType: "infographic",
    duration: "10 min",
    diseaseArea: "Type 2 Asthma",
    therapeuticArea: "Immunology / Pulmonology",
    program: "ADVENT",
    url: "https://adventprogram.com",
    keywords: ["asthma", "type 2 asthma", "remission", "IL-4", "IL-13", "IL-5", "eosinophils", "FeNO"]
  },
  {
    id: "EDU-ADV-006",
    title: "AFRS Disease Burden Infographic",
    contentType: "infographic",
    duration: "10 min",
    diseaseArea: "CRSwNP",
    therapeuticArea: "Immunology / Rhinology",
    program: "ADVENT",
    url: "https://adventprogram.com",
    keywords: ["AFRS", "CRSwNP", "chronic rhinosinusitis", "nasal polyps", "rhinology", "disease burden"]
  },
  {
    id: "EDU-ADV-007",
    title: "Pediatric EoE: An Interactive Learning Symposium",
    contentType: "video",
    duration: "45 min",
    diseaseArea: "Eosinophilic Esophagitis",
    therapeuticArea: "Immunology / Gastroenterology",
    program: "ADVENT",
    url: "https://adventprogram.com",
    keywords: ["EoE", "eosinophilic esophagitis", "pediatric", "symposium", "gastroenterology"]
  },
  // --- Rare Diseases University (rdu-online.com) ---
  {
    id: "EDU-RDU-001",
    title: "Module 1: Introduction to Hemophilia",
    contentType: "article",
    diseaseArea: "Hemophilia",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["hemophilia", "rare blood disorder", "RBD", "introduction", "course"]
  },
  {
    id: "EDU-RDU-002",
    title: "Monitoring and Managing ILD in Patients With ASMD (Prof. Bonella)",
    contentType: "video",
    diseaseArea: "ASMD",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["ASMD", "acid sphingomyelinase deficiency", "ILD", "interstitial lung disease", "lysosomal storage disease", "LSD"]
  },
  {
    id: "EDU-RDU-003",
    title: "Genetic Tools for Fabry Disease Diagnosis and Screening: A Cardiologist's Perspective",
    contentType: "article",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Fabry", "genetic testing", "diagnosis", "screening", "cardiology", "lysosomal storage disease", "LSD"]
  },
  // --- BR1DGE (bridget1d.com) — Sanofi presymptomatic type 1 diabetes education ---
  {
    id: "EDU-B1D-001",
    title: "The T1D Early Detection Toolkit",
    contentType: "infographic",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://bridget1d.com",
    keywords: ["T1D", "type 1 diabetes", "early detection", "screening", "toolkit", "presymptomatic"]
  },
  {
    id: "EDU-B1D-002",
    title: "What Do People with T1D Think About Screening for T1D",
    contentType: "video",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://bridget1d.com",
    keywords: ["T1D", "type 1 diabetes", "screening", "patient perspective", "early-stage"]
  },
  {
    id: "EDU-B1D-003",
    title: "Technology Advances and the Persistent Burden of T1D",
    contentType: "video",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://bridget1d.com",
    keywords: ["T1D", "type 1 diabetes", "insulin delivery", "glycemic outcomes", "technology", "disease burden"]
  },
  // --- Sanofi Congress Library (congress.sanofimedical.com) ---
  {
    id: "EDU-CONG-001",
    title: "EAACI 2026 Sanofi | Regeneron — European Academy of Allergy and Clinical Immunology",
    contentType: "article",
    duration: "Jun 12–15, 2026",
    diseaseArea: "Cross-TA Immunology",
    therapeuticArea: "Immunology / Asthma / CRSwNP",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/eaaci-2026-sanofi-regeneron",
    keywords: ["EAACI", "congress", "allergy", "clinical immunology", "asthma", "CRSwNP", "type 2 inflammation"]
  },
  {
    id: "EDU-CONG-002",
    title: "ESPGHAN 2026 Sanofi | Regeneron — European Society for Paediatric Gastroenterology, Hepatology and Nutrition",
    contentType: "article",
    duration: "Jun 24–27, 2026",
    diseaseArea: "Eosinophilic Esophagitis",
    therapeuticArea: "Immunology / Gastroenterology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/espghan-2026-sanofi-regeneron",
    keywords: ["ESPGHAN", "congress", "pediatric", "gastroenterology", "EoE", "eosinophilic esophagitis"]
  },
  {
    id: "EDU-CONG-003",
    title: "EAN 2026 — European Academy of Neurology Congress",
    contentType: "article",
    duration: "Jun 27–30, 2026",
    diseaseArea: "Multiple Sclerosis / Neuromuscular",
    therapeuticArea: "Neurology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/ean-2026",
    keywords: ["EAN", "congress", "neurology", "multiple sclerosis", "neuromuscular"]
  },
  {
    id: "EDU-CONG-004",
    title: "AAIC 2026 — Alzheimer's Association International Conference",
    contentType: "article",
    duration: "Jul 12–15, 2026",
    diseaseArea: "Neurology",
    therapeuticArea: "Neurology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/aaic-2026",
    keywords: ["AAIC", "congress", "Alzheimer's", "neurology", "dementia"]
  },
  {
    id: "EDU-CONG-005",
    title: "ATC 2026 — American Transplant Congress",
    contentType: "article",
    duration: "Jun 20–24, 2026",
    diseaseArea: "Transplant",
    therapeuticArea: "Transplant",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/atc-2026",
    keywords: ["ATC", "congress", "transplant"]
  },
  {
    id: "EDU-CONG-006",
    title: "ISTH 2026 — International Society on Thrombosis and Haemostasis Congress",
    contentType: "article",
    duration: "Jul 11–15, 2026",
    diseaseArea: "Hemophilia",
    therapeuticArea: "Rare Blood Disorders",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/isth-2026",
    keywords: ["ISTH", "congress", "thrombosis", "haemostasis", "hemophilia", "rare blood disorders"]
  },
  {
    id: "EDU-CONG-007",
    title: "NBDF 2026 — National Bleeding Disorders Foundation Annual Meeting",
    contentType: "article",
    duration: "Aug 13–15, 2026",
    diseaseArea: "Hemophilia",
    therapeuticArea: "Rare Blood Disorders",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/nbdf-2026",
    keywords: ["NBDF", "congress", "bleeding disorders", "hemophilia", "rare blood disorders"]
  },
  {
    id: "EDU-CONG-008",
    title: "SSIEM 2026 — Society for the Study of Inborn Errors of Metabolism Annual Symposium",
    contentType: "article",
    duration: "Aug 25–28, 2026",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/ssiem-2026",
    keywords: ["SSIEM", "congress", "inborn errors of metabolism", "lysosomal storage disease", "LSD", "Fabry", "ASMD", "Gaucher", "rare diseases"]
  },
  {
    id: "EDU-CONG-009",
    title: "AAD 2026 Sanofi | Regeneron — American Academy of Dermatology Annual Meeting",
    contentType: "article",
    duration: "Mar 27–31, 2026",
    diseaseArea: "Atopic Dermatitis",
    therapeuticArea: "Immunology / Dermatology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/aad-2026-sanofi-regeneron",
    keywords: ["AAD", "congress", "dermatology", "atopic dermatitis", "dupilumab", "dupixent"]
  },
  {
    id: "EDU-CONG-010",
    title: "EULAR 2026 Sanofi | Regeneron — European Alliance of Associations for Rheumatology Congress",
    contentType: "article",
    duration: "Jun 3–6, 2026",
    diseaseArea: "Rheumatoid Arthritis",
    therapeuticArea: "Immunology / Rheumatology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/eular-2026-sanofi-regeneron",
    keywords: ["EULAR", "congress", "rheumatology", "rheumatoid arthritis", "sarilumab", "kevzara", "IL-6"]
  },
  {
    id: "EDU-CONG-011",
    title: "AAAAI 2026 Sanofi | Regeneron — American Academy of Allergy, Asthma & Immunology Meeting",
    contentType: "article",
    duration: "Feb 27–Mar 2, 2026",
    diseaseArea: "Type 2 Asthma",
    therapeuticArea: "Immunology / Allergy",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/aaaai-2026-sanofi-regeneron",
    keywords: ["AAAAI", "congress", "allergy", "asthma", "immunology", "type 2 inflammation"]
  },
  {
    id: "EDU-CONG-012",
    title: "ATS 2026 Sanofi | Regeneron — American Thoracic Society International Conference",
    contentType: "article",
    duration: "May 15–20, 2026",
    diseaseArea: "Type 2 Asthma",
    therapeuticArea: "Immunology / Pulmonology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/ats-2026-sanofi-regeneron",
    keywords: ["ATS", "congress", "pulmonology", "asthma", "COPD", "respiratory"]
  },
  {
    id: "EDU-CONG-013",
    title: "DDW 2026 Sanofi | Regeneron — Digestive Disease Week",
    contentType: "article",
    duration: "May 2–5, 2026",
    diseaseArea: "Eosinophilic Esophagitis",
    therapeuticArea: "Immunology / Gastroenterology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/ddw-2026-sanofi-regeneron",
    keywords: ["DDW", "congress", "gastroenterology", "EoE", "eosinophilic esophagitis", "digestive disease"]
  },
  {
    id: "EDU-CONG-014",
    title: "CEORL-HNS 2026 Sanofi | Regeneron — Confederation of European ORL-Head and Neck Surgery Congress",
    contentType: "article",
    duration: "Apr 25–29, 2026",
    diseaseArea: "CRSwNP",
    therapeuticArea: "Immunology / Rhinology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/ceorl-hns-2026-sanofi-regeneron",
    keywords: ["CEORL-HNS", "congress", "rhinology", "CRSwNP", "chronic rhinosinusitis", "ENT"]
  },
  {
    id: "EDU-CONG-015",
    title: "Winter Clinical Miami 2026 — Winter Clinical Dermatology Conference",
    contentType: "article",
    duration: "Jan 25–29, 2026",
    diseaseArea: "Atopic Dermatitis",
    therapeuticArea: "Immunology / Dermatology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/winter-clinical-miami-2026",
    keywords: ["Winter Clinical Miami", "congress", "dermatology", "atopic dermatitis"]
  },
  {
    id: "EDU-CONG-016",
    title: "Maui Derm Hawaii 2026 — Maui Derm for Dermatologists",
    contentType: "article",
    duration: "Jan 25–29, 2026",
    diseaseArea: "Atopic Dermatitis",
    therapeuticArea: "Immunology / Dermatology",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/maui-derm-hawaii-2026",
    keywords: ["Maui Derm", "congress", "dermatology", "atopic dermatitis"]
  },
  {
    id: "EDU-CONG-017",
    title: "WFH 2026 Sanofi | Sobi — World Federation of Hemophilia World Congress",
    contentType: "article",
    duration: "Apr 19–22, 2026",
    diseaseArea: "Hemophilia",
    therapeuticArea: "Rare Blood Disorders",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/wfh-2026-sanofi-sobi",
    keywords: ["WFH", "congress", "hemophilia", "rare blood disorders", "bleeding disorders"]
  },
  {
    id: "EDU-CONG-018",
    title: "EHA 2026 — European Hematology Association Annual Meeting",
    contentType: "article",
    duration: "Jun 11–14, 2026",
    diseaseArea: "Hemophilia",
    therapeuticArea: "Rare Blood Disorders / Oncology / Rare Diseases",
    program: "Sanofi Congress Library",
    url: "https://congress.sanofimedical.com/eha-2026",
    keywords: ["EHA", "congress", "hematology", "rare blood disorders", "oncology"]
  },
  // --- Sanofi Medical Campus (medical.campus.sanofi) — program directory ---
  {
    id: "EDU-CAMPUS-001",
    title: "IMMERSE Program — Global Immunology Medical Education",
    contentType: "article",
    diseaseArea: "Cross-TA Immunology",
    therapeuticArea: "Immunology",
    program: "Sanofi Medical Campus",
    url: "https://medical.campus.sanofi",
    keywords: ["IMMERSE", "immunology", "medical education", "non-promotional"]
  },
  {
    id: "EDU-CAMPUS-002",
    title: "Nerve Nexus — MS and Neuromuscular Disease Education",
    contentType: "article",
    diseaseArea: "Multiple Sclerosis / Neuromuscular",
    therapeuticArea: "Neurology",
    program: "Sanofi Medical Campus",
    url: "https://medical.campus.sanofi",
    keywords: ["Nerve Nexus", "multiple sclerosis", "MS", "neuromuscular", "neurology"]
  },
  {
    id: "EDU-CAMPUS-003",
    title: "Library of Congresses — On-Demand Scientific Publications",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Medical Campus",
    url: "https://medical.campus.sanofi",
    keywords: ["congress", "library", "publications", "on-demand", "scientific"]
  }
];

export function searchEducationContent(query, diseaseArea, limit = 3) {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const scored = educationContent.map(item => {
    let score = 0;
    const kwLower = item.keywords.join(" ").toLowerCase();
    const titleLower = item.title.toLowerCase();

    for (const term of terms) {
      if (titleLower.includes(term)) score += 4;
      if (kwLower.includes(term)) score += 3;
    }
    if (diseaseArea && item.diseaseArea.toLowerCase().includes(diseaseArea.toLowerCase())) score += 5;
    if (diseaseArea && diseaseArea.toLowerCase().includes("cross-ta")) score += 2;

    return { ...item, score };
  });

  return scored
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
