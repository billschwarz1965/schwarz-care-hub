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
