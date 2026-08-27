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
  {
    id: "EDU-RDU-004",
    title: "Module 1.3. Genetics and Genotype-Phenotype Correlations (MPS I)",
    contentType: "article",
    duration: "10 min",
    diseaseArea: "MPS I",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["MPS I", "mucopolysaccharidosis", "genetics", "genotype-phenotype", "autosomal recessive"]
  },
  {
    id: "EDU-RDU-005",
    title: "Genotype–Phenotype Correlations and Confirming an MPS I Diagnosis",
    contentType: "video",
    diseaseArea: "MPS I",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["MPS I", "genotype-phenotype", "diagnosis", "GAG biomarker", "International MPS I Registry"]
  },
  {
    id: "EDU-RDU-006",
    title: "Getting to Know MPS I",
    contentType: "video",
    diseaseArea: "MPS I",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["MPS I", "mucopolysaccharidosis", "lysosomal storage disorder", "GAG", "enzyme deficiency", "overview"]
  },
  {
    id: "EDU-RDU-007",
    title: "How Can a Simple Test Lead to an Early MPS I Diagnosis?",
    contentType: "video",
    diseaseArea: "MPS I",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["MPS I", "early diagnosis", "enzyme assay", "molecular genetic testing", "sibling testing"]
  },
  {
    id: "EDU-RDU-008",
    title: "Importance of Reaching an Early MPS I Diagnosis",
    contentType: "video",
    diseaseArea: "MPS I",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["MPS I", "diagnostic delay", "early diagnosis", "family impact"]
  },
  {
    id: "EDU-RDU-009",
    title: "Module 1.1. Overview and Epidemiology of ASMD",
    contentType: "article",
    duration: "25 min",
    diseaseArea: "ASMD",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["ASMD", "acid sphingomyelinase deficiency", "epidemiology", "carrier screening", "type A", "type B"]
  },
  {
    id: "EDU-RDU-010",
    title: "Module 1.2. Inheritance and Pathophysiology of ASMD",
    contentType: "article",
    duration: "25 min",
    diseaseArea: "ASMD",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["ASMD", "inheritance", "pathophysiology", "sphingolipid", "lysosome", "multi-organ"]
  },
  {
    id: "EDU-RDU-011",
    title: "Module 2.1. The ASMD Phenotypic Spectrum",
    contentType: "article",
    duration: "15 min",
    diseaseArea: "ASMD",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["ASMD", "phenotype", "type A", "type B", "clinical presentation"]
  },
  {
    id: "EDU-RDU-012",
    title: "Module 2.2. Genotype–Phenotype Correlations in ASMD",
    contentType: "article",
    duration: "10 min",
    diseaseArea: "ASMD",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["ASMD", "genotype-phenotype", "SMPD1", "gene variant"]
  },
  {
    id: "EDU-RDU-013",
    title: "Module 3.2. Methodology of ASMD Diagnosis",
    contentType: "article",
    duration: "15 min",
    diseaseArea: "ASMD",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["ASMD", "diagnosis", "ASM enzyme testing", "genetic testing", "diagnostic algorithm"]
  },
  {
    id: "EDU-RDU-014",
    title: "Module 1.4. Causes, Risk Factors, and Inheritance of Hemophilia",
    contentType: "article",
    duration: "10 min",
    diseaseArea: "Hemophilia",
    therapeuticArea: "Rare Blood Disorders",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["hemophilia", "inheritance", "factor mutations", "X-linked recessive", "acquired hemophilia"]
  },
  {
    id: "EDU-RDU-015",
    title: "Module 2.2. Clinical Classification/Phenotypes of Hemophilia A and B",
    contentType: "article",
    duration: "10 min",
    diseaseArea: "Hemophilia",
    therapeuticArea: "Rare Blood Disorders",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["hemophilia A", "hemophilia B", "factor VIII", "factor IX", "severity classification", "genotype-phenotype"]
  },
  {
    id: "EDU-RDU-016",
    title: "Module 4.3. Genetic Testing in Hemophilia",
    contentType: "article",
    duration: "5 min",
    diseaseArea: "Hemophilia",
    therapeuticArea: "Rare Blood Disorders",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["hemophilia", "genetic testing", "F8 gene", "F9 gene", "diagnosis"]
  },
  {
    id: "EDU-RDU-017",
    title: "Module 5.3. Nonfactor Therapies and Other Hemostatic Agents",
    contentType: "article",
    duration: "15 min",
    diseaseArea: "Hemophilia",
    therapeuticArea: "Rare Blood Disorders",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["hemophilia", "nonfactor therapy", "siRNA", "TFPI", "gene therapy", "WFH guidelines"]
  },
  {
    id: "EDU-RDU-018",
    title: "Module 2.2. Adjudication of Patient Phenotype Using Clinical Characteristics and Genotype (Fabry)",
    contentType: "article",
    duration: "10 min",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Fabry", "phenotype", "genotype", "GLA gene", "variant database"]
  },
  {
    id: "EDU-RDU-019",
    title: "Module 3.1. Fabry Disease Identification and Diagnosis",
    contentType: "article",
    duration: "20 min",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Fabry", "identification", "diagnosis", "genetic counseling", "awareness"]
  },
  {
    id: "EDU-RDU-020",
    title: "Module 3.2. Screening for Fabry Disease",
    contentType: "article",
    duration: "15 min",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Fabry", "screening", "risk factors", "newborn screening", "early identification"]
  },
  {
    id: "EDU-RDU-021",
    title: "Module 8.3. Expanding Our Understanding of Fabry Disease: Ongoing and Future Research",
    contentType: "article",
    duration: "10 min",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Fabry", "epigenetics", "methylation", "phenotypic variability", "research"]
  },
  {
    id: "EDU-RDU-022",
    title: "Module 4.3. Fabry Disease Cardiac Manifestations",
    contentType: "article",
    duration: "20 min",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Fabry", "cardiac", "morbidity", "mortality", "monitoring"]
  },
  {
    id: "EDU-RDU-023",
    title: "Diagnosing Lysosomal Storage Disorders (LSDs)",
    contentType: "article",
    duration: "19 min",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["LSD", "lysosomal storage disorder", "Fabry", "Pompe", "Gaucher", "ASMD", "MPS", "diagnosis", "dried blood spot", "DBS"]
  },
  {
    id: "EDU-RDU-024",
    title: "Dried Blood Spot (DBS) Sampling Guidelines",
    contentType: "video",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["DBS", "dried blood spot", "sampling", "LSD", "diagnosis"]
  },
  {
    id: "EDU-RDU-025",
    title: "Highlights From the RDU Ambassadors",
    contentType: "video",
    diseaseArea: "Rare Diseases",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["RDU ambassadors", "lysosomal storage disease conference", "clinical practice"]
  },
  {
    id: "EDU-RDU-026",
    title: "Sphingolipids and the Demise of Neurons in Neurologic Diseases",
    contentType: "video",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["sphingolipid", "neurons", "Parkinson disease", "ALS", "Gaucher", "Gaucher Leadership Forum"]
  },
  {
    id: "EDU-RDU-027",
    title: "Commission to End the Diagnostic Odyssey: Policy and Practice",
    contentType: "video",
    diseaseArea: "Rare Diseases",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["diagnostic odyssey", "policy", "patient advocacy", "Sanofi Rare Medical Forum"]
  },
  {
    id: "EDU-RDU-028",
    title: "Reducing the Diagnostic Odyssey via Newborn Screening by Genome Sequencing",
    contentType: "video",
    diseaseArea: "Rare Diseases",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["newborn screening", "genome sequencing", "diagnostic odyssey", "LSD", "next-generation sequencing"]
  },
  {
    id: "EDU-RDU-029",
    title: "Module 1.1. Gaucher Disease Overview",
    contentType: "article",
    duration: "15 min",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Gaucher", "GBA1 gene", "acid beta-glucosidase", "non-neuronopathic", "neuronopathic"]
  },
  {
    id: "EDU-RDU-030",
    title: "Module 2.1. Pathogenic Variants of the GBA1 Gene",
    contentType: "article",
    duration: "15 min",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Gaucher", "GBA1", "gene variant", "genetics", "inheritance"]
  },
  {
    id: "EDU-RDU-031",
    title: "Module 2.2. Inheritance Patterns in Gaucher Disease",
    contentType: "article",
    duration: "10 min",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Gaucher", "autosomal recessive", "inheritance"]
  },
  {
    id: "EDU-RDU-032",
    title: "Module 2.3. Genotype–Phenotype Correlations in Gaucher Disease",
    contentType: "article",
    duration: "5 min",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Rare Diseases University (RDU)",
    url: "https://rdu-online.com",
    keywords: ["Gaucher", "genotype-phenotype", "p.N370S", "central nervous system"]
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
    url: "https://www.bridget1d.com/resources/ar/Technology-Advances-and-the-Persistent-Burden-of-T1D-ATTD-2026",
    keywords: ["T1D", "type 1 diabetes", "insulin delivery", "glycemic outcomes", "technology", "disease burden"]
  },
  {
    id: "EDU-B1D-004",
    title: "IDS 2026 Symposium Summary",
    contentType: "article",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/IDS-2026-Symposium-Summary",
    keywords: ["T1D", "type 1 diabetes", "biomarker", "screening", "diagnosis", "monitoring", "autoantibodies", "C-peptide", "symposium"]
  },
  {
    id: "EDU-B1D-005",
    title: "Immune Dysregulation in T1D: Biomarkers and Therapeutic Targets",
    contentType: "video",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/Immune-dysregulation-in-T1D--biomarkers-and-therapeutic-targets-",
    keywords: ["T1D", "type 1 diabetes", "T-cell dysregulation", "pathophysiology", "biomarkers", "therapeutic targets"]
  },
  {
    id: "EDU-B1D-006",
    title: "Islet Autoantibodies as Biomarkers of Progression to Clinical T1D",
    contentType: "video",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/Islet-autoantibodies-as-biomarkers-of-progression-to-clinical-T1D-",
    keywords: ["T1D", "type 1 diabetes", "islet autoantibodies", "biomarkers", "progression", "risk"]
  },
  {
    id: "EDU-B1D-007",
    title: "Composite Risk Scores as Tools for Improved T1D Risk Prediction",
    contentType: "video",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/Composite-risk-scores-as-tools-for-improved-T1D-risk-prediction",
    keywords: ["T1D", "type 1 diabetes", "risk score", "risk prediction", "biomarkers"]
  },
  {
    id: "EDU-B1D-008",
    title: "ATTD 2026 Symposium Summary",
    contentType: "article",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/ATTD-2026-Symposium-Summary",
    keywords: ["T1D", "type 1 diabetes", "screening", "diagnosis", "monitoring", "management", "care journey", "symposium", "ATTD"]
  },
  {
    id: "EDU-B1D-009",
    title: "Early Detection of Type 1 Diabetes in Adults",
    contentType: "article",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/Early-Detection-of-Type-1-Diabetes-in-Adults-",
    keywords: ["T1D", "type 1 diabetes", "early detection", "adults", "misclassification", "type 2 diabetes", "islet autoantibody testing"]
  },
  {
    id: "EDU-B1D-010",
    title: "Early Detection of Type 1 Diabetes in Pediatric Populations",
    contentType: "article",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/Early-Detection-of-Type-1-Diabetes-in-Pediatric-Populations-",
    keywords: ["T1D", "type 1 diabetes", "early detection", "pediatric", "children", "DKA"]
  },
  {
    id: "EDU-B1D-011",
    title: "Education and Psychosocial Support After T1D Diagnosis – ATTD 2026",
    contentType: "video",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/Education-and-Psychosocial-Support-After-T1D-Diagnosis-ATTD-2026",
    keywords: ["T1D", "type 1 diabetes", "psychosocial support", "patient anxiety", "islet autoantibody", "education"]
  },
  {
    id: "EDU-B1D-012",
    title: "The Growing Global Burden of T1D",
    contentType: "video",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/The-Growing-Global-Burden-of-T1D-ATTD-2026",
    keywords: ["T1D", "type 1 diabetes", "disease burden", "adult-onset", "misclassification", "familial risk", "autoimmune comorbidities"]
  },
  {
    id: "EDU-B1D-013",
    title: "Identifying Type 1 Diabetes in Adults",
    contentType: "video",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/Identifying-Type-1-Diabetes-in-Adults-",
    keywords: ["T1D", "type 1 diabetes", "adults", "misclassification", "type 2 diabetes", "islet autoantibodies", "C-peptide"]
  },
  {
    id: "EDU-B1D-014",
    title: "The Autoimmune Pathophysiology of Early-Stage T1D",
    contentType: "video",
    diseaseArea: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology",
    program: "BR1DGE",
    url: "https://www.bridget1d.com/resources/ar/The-Autoimmune-Pathophysiology-of-Early-Stage-T1D-",
    keywords: ["T1D", "type 1 diabetes", "pathophysiology", "autoimmune cascade", "beta cell destruction"]
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
  // --- Sanofi Payer Medical (specialtymvo.sanofimedical.com) — payer/HCDM education ---
  {
    id: "EDU-MVO-001",
    title: "BP US Approval Data Deck — Dupilumab ADEPT Trial in Bullous Pemphigoid",
    contentType: "article",
    diseaseArea: "Bullous Pemphigoid",
    therapeuticArea: "Immunology",
    program: "Sanofi Payer Medical",
    url: "https://specialtymvo.sanofimedical.com/immunology/immunology-and-inflammation-resources-fda-approved-product-therapy-areas",
    keywords: ["bullous pemphigoid", "BP", "dupilumab", "ADEPT", "phase 2/3", "FDA approval", "payer"]
  },
  {
    id: "EDU-MVO-002",
    title: "CSU Data US Approval — Disease Burden and Management Review",
    contentType: "article",
    diseaseArea: "Chronic Spontaneous Urticaria",
    therapeuticArea: "Immunology",
    program: "Sanofi Payer Medical",
    url: "https://specialtymvo.sanofimedical.com/immunology/immunology-and-inflammation-resources-fda-approved-product-therapy-areas",
    keywords: ["CSU", "chronic spontaneous urticaria", "bullous pemphigoid", "atopic hand and foot dermatitis", "prurigo nodularis", "payer"]
  },
  {
    id: "EDU-MVO-003",
    title: "Dupilumab COPD NOTUS vs BOREAS Infographic",
    contentType: "infographic",
    diseaseArea: "COPD",
    therapeuticArea: "Immunology / Pulmonology",
    program: "Sanofi Payer Medical",
    url: "https://specialtymvo.sanofimedical.com/immunology/immunology-and-inflammation-resources-fda-approved-product-therapy-areas",
    keywords: ["COPD", "dupilumab", "NOTUS", "BOREAS", "payer", "value proposition"]
  },
  {
    id: "EDU-MVO-004",
    title: "MVO COPD Value Proposition Deck",
    contentType: "article",
    diseaseArea: "COPD",
    therapeuticArea: "Immunology / Pulmonology",
    program: "Sanofi Payer Medical",
    url: "https://specialtymvo.sanofimedical.com/immunology/immunology-and-inflammation-resources-fda-approved-product-therapy-areas",
    keywords: ["COPD", "pathophysiology", "disease burden", "economic burden", "dupilumab", "NOTUS", "BOREAS", "payer"]
  },
  {
    id: "EDU-MVO-005",
    title: "BOREAS NOTUS Efficacy COPD Eosinophil Subgroup Infographic (US)",
    contentType: "infographic",
    diseaseArea: "COPD",
    therapeuticArea: "Immunology / Pulmonology",
    program: "Sanofi Payer Medical",
    url: "https://specialtymvo.sanofimedical.com/immunology/immunology-and-inflammation-resources-fda-approved-product-therapy-areas",
    keywords: ["COPD", "eosinophil", "exacerbation", "NOTUS", "BOREAS", "posthoc", "payer"]
  },
  {
    id: "EDU-MVO-006",
    title: "Chronic Rhinosinusitis with Nasal Polyposis — EVEREST Trial Review",
    contentType: "article",
    diseaseArea: "CRSwNP",
    therapeuticArea: "Immunology / Rhinology",
    program: "Sanofi Payer Medical",
    url: "https://specialtymvo.sanofimedical.com/immunology/immunology-and-inflammation-resources-fda-approved-product-therapy-areas",
    keywords: ["CRSwNP", "EVEREST", "dupilumab", "omalizumab", "phase 4", "asthma", "payer"]
  },
  {
    id: "EDU-MVO-007",
    title: "Overview of Dupilumab in Allergic Fungal Rhinosinusitis (AFRS) — LIBERTY-AIMS",
    contentType: "article",
    diseaseArea: "CRSwNP",
    therapeuticArea: "Immunology / Rhinology",
    program: "Sanofi Payer Medical",
    url: "https://specialtymvo.sanofimedical.com/immunology/immunology-and-inflammation-resources-fda-approved-product-therapy-areas",
    keywords: ["AFRS", "allergic fungal rhinosinusitis", "dupilumab", "LIBERTY-AIMS", "payer"]
  },
  {
    id: "EDU-MVO-008",
    title: "Polymyalgia Rheumatica — Disease Management and IL-6 Inhibition Rationale",
    contentType: "article",
    diseaseArea: "Polymyalgia Rheumatica",
    therapeuticArea: "Immunology / Rheumatology",
    program: "Sanofi Payer Medical",
    url: "https://specialtymvo.sanofimedical.com/immunology/immunology-and-inflammation-resources-fda-approved-product-therapy-areas",
    keywords: ["PMR", "polymyalgia rheumatica", "IL-6", "glucocorticoids", "rheumatoid arthritis", "payer"]
  },
  {
    id: "EDU-MVO-009",
    title: "Current Understanding and Disease Management of Prurigo Nodularis",
    contentType: "article",
    diseaseArea: "Prurigo Nodularis",
    therapeuticArea: "Immunology / Dermatology",
    program: "Sanofi Payer Medical",
    url: "https://specialtymvo.sanofimedical.com/immunology/immunology-and-inflammation-resources-fda-approved-product-therapy-areas",
    keywords: ["prurigo nodularis", "PN", "epidemiology", "disease burden", "pathophysiology", "payer"]
  },
  // --- Sanofi Rare Diseases Medical (rarediseases.sanofimedical.com) ---
  {
    id: "EDU-RD-001",
    title: "Fabry Disease: Recognizing a Variable Condition",
    contentType: "article",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/fabry-disease",
    keywords: ["Fabry", "clinical features", "pathology", "nephropathy", "cardiovascular", "heterogeneous presentation"]
  },
  {
    id: "EDU-RD-002",
    title: "HCM-Fabry Cardiac Disease Symposium: Cardiac Involvement in Fabry Disease",
    contentType: "video",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/fabry-disease",
    keywords: ["Fabry", "hypertrophic cardiomyopathy", "HCM", "cardiac", "symposium"]
  },
  {
    id: "EDU-RD-003",
    title: "Genetic Testing and Genetic Counseling — Advisory Council Insights",
    contentType: "article",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/fabry-disease",
    keywords: ["genetic testing", "genetic counseling", "lysosomal storage disease", "LSD", "advisory council", "monograph"]
  },
  {
    id: "EDU-RD-004",
    title: "Lysosomal Storage Disease Biomarkers — Advisory Council Insights",
    contentType: "article",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/fabry-disease",
    keywords: ["biomarkers", "lysosomal storage disease", "LSD", "advisory council", "monograph"]
  },
  {
    id: "EDU-RD-005",
    title: "Risk Stratification Using Plasma LysoGb3 in Fabry Disease",
    contentType: "video",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/fabry-disease",
    keywords: ["Fabry", "lysoGb3", "risk stratification", "biomarker"]
  },
  {
    id: "EDU-RD-006",
    title: "Science Talk for Fabry Disease – Video Podcast 3: Monitoring Pediatric Patients",
    contentType: "podcast",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/fabry-disease",
    keywords: ["Fabry", "pediatric", "monitoring", "patient advocacy", "video podcast"]
  },
  {
    id: "EDU-RD-007",
    title: "Diagnosing Fabry Disease — Testing Brochure",
    contentType: "article",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/fabry-disease",
    keywords: ["Fabry", "diagnosis", "alpha-GAL A", "enzyme assay", "GLA sequencing", "testing"]
  },
  {
    id: "EDU-RD-008",
    title: "Kidney Panel Testing in Fabry Disease",
    contentType: "article",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/fabry-disease",
    keywords: ["Fabry", "chronic kidney disease", "CKD", "kidney panel"]
  },
  {
    id: "EDU-RD-009",
    title: "Cardiac Gene Panels in Fabry Disease",
    contentType: "article",
    diseaseArea: "Fabry Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/fabry-disease",
    keywords: ["Fabry", "hypertrophic cardiomyopathy", "cardiac gene panel", "genetics"]
  },
  {
    id: "EDU-RD-010",
    title: "Gaucher Disease Biomarker: Lyso-GL-1",
    contentType: "article",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/gaucher-disease",
    keywords: ["Gaucher", "Lyso-GL-1", "Lyso-GB-1", "biomarker", "glucocerebrosidase"]
  },
  {
    id: "EDU-RD-011",
    title: "Gaucher Disease Schedule of Assessments (ICGG)",
    contentType: "article",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/gaucher-disease",
    keywords: ["Gaucher", "monitoring", "schedule of assessments", "ICGG", "Type 1"]
  },
  {
    id: "EDU-RD-012",
    title: "GD3 Brochure — Neuronopathic Gaucher Disease",
    contentType: "article",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/gaucher-disease",
    keywords: ["Gaucher", "GD3", "neuronopathic", "Type 3"]
  },
  {
    id: "EDU-RD-013",
    title: "ASMD and Gaucher Disease Diagnosis — Testing Brochure",
    contentType: "article",
    diseaseArea: "ASMD",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/gaucher-disease",
    keywords: ["ASMD", "Gaucher", "Niemann-Pick", "enzyme assay", "GBA", "SMPD1", "diagnosis", "testing"]
  },
  {
    id: "EDU-RD-014",
    title: "NSGC 2025 Symposium: Carrier Testing and the Unexpected Parental Diagnosis",
    contentType: "video",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/gaucher-disease",
    keywords: ["Gaucher", "Fabry", "carrier screening", "genetic counseling", "NSGC", "symposium"]
  },
  {
    id: "EDU-RD-015",
    title: "ASHG 2025 Symposium: Addressing Diagnostic Delays for Rare Disease Patients",
    contentType: "video",
    diseaseArea: "Gaucher Disease",
    therapeuticArea: "Rare Diseases",
    program: "Sanofi Rare Diseases Medical",
    url: "https://www.rarediseases.sanofimedical.com/gaucher-disease",
    keywords: ["rare disease", "diagnostic delay", "patient journey", "ASHG", "symposium"]
  },
  // --- Sanofi Clinical Trials (sanofi.com/en/clinical-trials) ---
  // Public, patient/volunteer-facing trial education and the trial finder —
  // distinct in audience from the HCP medical-education programs above.
  {
    id: "EDU-CT-001",
    title: "Find a Clinical Trial — Sanofi Trial Search",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/search",
    keywords: ["clinical trial", "trial search", "find a trial", "enrollment", "recruiting", "eligibility", "location"]
  },
  {
    id: "EDU-CT-002",
    title: "Respiratory Clinical Trials & Studies",
    contentType: "article",
    diseaseArea: "Type 2 Asthma",
    therapeuticArea: "Respiratory",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/clinical-research-areas/respiratory",
    keywords: ["respiratory", "asthma", "COPD", "nasal polyps", "RSV", "influenza", "pneumococcal", "inflammatory biomarkers", "clinical trial"]
  },
  {
    id: "EDU-CT-003",
    title: "Dermatology & Acne Clinical Trials and Studies",
    contentType: "article",
    diseaseArea: "Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/clinical-research-areas/dermatology-and-acne",
    keywords: ["dermatology", "acne", "atopic dermatitis", "eczema", "prurigo nodularis", "lichen simplex chronicus", "chronic pruritus", "hidradenitis suppurativa", "acne vaccine", "clinical trial"]
  },
  {
    id: "EDU-CT-004",
    title: "IBD — Inflammatory Bowel Disease Clinical Trials & Studies",
    contentType: "article",
    diseaseArea: "IBD",
    therapeuticArea: "Immunology / Gastroenterology",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/clinical-research-areas/chronic-diseases/ibd",
    keywords: ["IBD", "inflammatory bowel disease", "Crohn", "ulcerative colitis", "gastroenterology", "clinical trial"]
  },
  {
    id: "EDU-CT-005",
    title: "Pediatric Clinical Trials & Studies",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "Pediatrics",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/clinical-research-areas/pediatric-clinical-trials",
    keywords: ["pediatric", "children", "infants", "adolescent", "clinical trial", "consent", "assent"]
  },
  {
    id: "EDU-CT-006",
    title: "Chronic Disease Clinical Trials and Studies",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "Chronic Disease",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/clinical-research-areas/chronic-diseases",
    keywords: ["chronic disease", "long-term condition", "clinical trial"]
  },
  {
    id: "EDU-CT-007",
    title: "Sanofi's Clinical Research Areas",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/clinical-research-areas",
    keywords: ["clinical research areas", "therapeutic areas", "pipeline", "clinical trial"]
  },
  {
    id: "EDU-CT-008",
    title: "What Is a Clinical Trial?",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/what-is-a-clinical-trial",
    keywords: ["what is a clinical trial", "trial phases", "protocol", "randomized", "placebo", "patient education"]
  },
  {
    id: "EDU-CT-009",
    title: "Why Volunteer for a Clinical Trial?",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/why-volunteer",
    keywords: ["volunteer", "participant", "trial participation", "informed consent", "patient education"]
  },
  {
    id: "EDU-CT-010",
    title: "Sanofi's Commitment to Diversity in Clinical Trials",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Clinical Trials",
    url: "https://www.sanofi.com/en/clinical-trials/commitment-to-diversity",
    keywords: ["diversity", "inclusion", "representation", "eligibility criteria", "health equity", "underrepresented", "clinical trial"]
  },
  // --- Sanofi Medical Information (sanofimedicalinformation.com) ---
  {
    id: "EDU-MI-001",
    title: "Sanofi US Medical Information Database — Search Approved Product Information",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Medical Information",
    url: "https://www.sanofimedicalinformation.com/s/?language=en_US&CN=US&HCP=Yes",
    keywords: ["medical information", "medinfo", "product information", "prescribing information", "evidence-based", "database", "unbiased"]
  },
  {
    id: "EDU-MI-002",
    title: "Submit a Medical Information Question",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Medical Information",
    url: "https://www.sanofimedicalinformation.com/s/submit-a-question?language=en_US&CN=US&HCP=Yes",
    keywords: ["submit a question", "medical information request", "MIR", "unsolicited request", "inquiry", "medinfo"]
  },
  {
    id: "EDU-MI-003",
    title: "Report an Adverse Event",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Medical Information",
    url: "https://www.sanofimedicalinformation.com/s/report-an-adverse-event?language=en_US&CN=US&HCP=Yes",
    keywords: ["adverse event", "AE", "pharmacovigilance", "safety reporting", "side effect"]
  },
  {
    id: "EDU-MI-004",
    title: "Ingredient Checker — Sanofi Product Excipient Lookup",
    contentType: "article",
    diseaseArea: "General",
    therapeuticArea: "General",
    program: "Sanofi Medical Information",
    url: "https://www.sanofimedicalinformation.com/s/ingredient-checker?language=en_US&CN=US&HCP=Yes",
    keywords: ["ingredient checker", "excipient", "allergy", "formulation", "inactive ingredient"]
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

// Words that appear across every therapeutic area — they must not, on their own,
// make an unrelated resource look like a match.
const EDU_GENERIC_TERMS = new Set([
  "disease", "diseases", "disorder", "disorders", "condition", "conditions",
  "type", "types", "test", "tests", "testing", "screening", "treatment",
  "therapy", "therapies", "diagnosis", "diagnostic", "management", "biomarker",
  "biomarkers", "genetic", "genetics", "clinical", "medical", "safety",
  "efficacy", "severe", "moderate", "chronic", "risk", "early", "adult",
  "adults", "children", "pediatric", "burden", "data", "patient", "patients",
  "what", "which", "how", "why", "when", "the", "and", "for", "are", "any",
  "with", "from", "about", "this", "that", "does", "used", "using", "congress"
]);

export function searchEducationContent(query, diseaseArea, limit = 3) {
  const terms = query.toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter(t => t.length > 2);

  const scored = educationContent.map(item => {
    let score = 0;
    let distinctiveHits = 0;
    const kwLower = item.keywords.join(" ").toLowerCase();
    const titleLower = item.title.toLowerCase();

    for (const term of terms) {
      const isDistinctive = !EDU_GENERIC_TERMS.has(term);
      if (titleLower.includes(term)) { score += 4; if (isDistinctive) distinctiveHits++; }
      if (kwLower.includes(term)) { score += 3; if (isDistinctive) distinctiveHits++; }
    }

    const areaMatch = diseaseArea && item.diseaseArea.toLowerCase().includes(diseaseArea.toLowerCase());
    if (areaMatch) score += 5;

    return { ...item, score, distinctiveHits, areaMatch };
  });

  // Require a real topical signal: either a distinctive query-term hit or an
  // explicit disease-area match. Returns fewer than `limit` rather than padding
  // the list with unrelated resources.
  return scored
    .filter(d => d.distinctiveHits > 0 || d.areaMatch)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
