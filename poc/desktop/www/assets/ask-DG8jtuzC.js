import"./enhancements-yqlzMlQc.js";import{g as O,s as H}from"./rag-engine-ChWXz4Hk.js";import{b as E,i as V,s as z,a as j,h as W}from"./narrator-BE1zjzk_.js";import"./taxonomy-B-xcL3O-.js";const U=[{nct:"NCT05363319",title:"Study of Routine Use of an Immunotherapy for Advanced Non-Small Cell Lung Cancer",status:"Recruiting",phase:"Observational",conditions:["Non-small Cell Lung Cancer"],therapeuticArea:"Oncology",enrollment:300,sites:28,keywords:["lung cancer","NSCLC","non-small cell","immunotherapy","oncology","cancer","real-world"]},{nct:"NCT05584670",title:"Study of an Investigational Study Drug Alone or With Other Treatments for Advanced Solid Tumors",status:"Recruiting",phase:"Phase 1/2",conditions:["Solid Tumor"],therapeuticArea:"Oncology",enrollment:542,sites:22,keywords:["solid tumor","advanced","metastatic","oncology","cancer","cetuximab","bevacizumab","melanoma","kidney cancer","mesothelioma"]},{nct:"NCT06131840",title:"Study of an Investigational Antibody-Drug Conjugate for Advanced Solid Tumors",status:"Recruiting",phase:"Phase 1",conditions:["Colorectal Neoplasms","Non-Small-Cell Lung Carcinoma","Stomach Neoplasms","Pancreatic Ductal Adenocarcinoma"],therapeuticArea:"Oncology",enrollment:914,sites:52,keywords:["antibody-drug conjugate","ADC","colorectal","gastric","lung cancer","pancreatic","oncology","cancer","solid tumor"]},{nct:"NCT07629960",title:"Study of an Investigational Study Drug for Metastatic KRAS-Mutant Cancers",status:"Recruiting",phase:"Phase 1/2",conditions:["Advanced Solid Tumor","Non-Small Cell Lung Cancer","Colorectal Neoplasms","Pancreatic Ductal Adenocarcinoma"],therapeuticArea:"Oncology",enrollment:265,sites:2,keywords:["KRAS","G12C","G12D","mutation","metastatic","pancreatic","colorectal","lung cancer","oncology","cancer","biomarker"]},{nct:"NCT07692204",title:"Study of an Investigational Study Drug for Advanced Stomach or Gastroesophageal Junction Cancer",status:"Recruiting",phase:"Phase 2",conditions:["Gastric Cancer","Oesophageal Carcinoma"],therapeuticArea:"Oncology",enrollment:30,sites:1,keywords:["gastric cancer","stomach cancer","gastroesophageal","oesophageal","HER2","oncology","cancer"]},{nct:"NCT06241118",title:"Study of an Investigational Injection for Moderate-to-Severe Atopic Dermatitis",status:"Recruiting",phase:"Phase 3",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:636,sites:155,keywords:["atopic dermatitis","eczema","moderate-to-severe","injection","dermatology","immunology"]},{nct:"NCT06039241",title:"Study of Long-Term Treatment With an Approved Medicine for Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:900,sites:55,keywords:["atopic dermatitis","eczema","long-term","safety","dermatology","immunology"]},{nct:"NCT06837454",title:"Study of Real-World Care for Adults With Moderate to Severe Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:600,sites:64,keywords:["atopic dermatitis","eczema","real-world","adults","dermatology","immunology"]},{nct:"NCT07290803",title:"Study of Long-Term Real-World Systemic Treatments for Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:1e3,sites:80,keywords:["atopic dermatitis","eczema","systemic","real-world","long-term","dermatology"]},{nct:"NCT03936335",title:"Study of Pregnancy and Infant Outcomes in Women With Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Adverse Pregnancy Outcomes","Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:3930,sites:1,keywords:["atopic dermatitis","pregnancy","infant","registry","outcomes","dermatology"]},{nct:"NCT06192563",title:"Study of Dupilumab Treatment in Children and Teens With Severe Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:230,sites:9,keywords:["atopic dermatitis","dupilumab","children","pediatric","adolescent","severe","dermatology"]},{nct:"NCT07467564",title:"Study of a Treatment's Effects on Mental Health in Moderate-to-Severe Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:184,sites:7,keywords:["atopic dermatitis","mental health","depression","anxiety","quality of life","dermatology"]}],B=new Set(["trial","trials","study","studies","clinical","available","recruiting","patient","patients","the","and","for","are","any","what","which","with","from","about","this","that","does","advanced","treatment","investigational","drug","severe","moderate","adults","multiple"]);function F(e,t=5){const n=e.toLowerCase().split(/[^a-z0-9-]+/).filter(i=>i.length>2&&!B.has(i));return n.length?U.map(i=>{const s=`${i.title} ${i.conditions.join(" ")} ${i.keywords.join(" ")} ${i.therapeuticArea}`.toLowerCase(),l=new Set(s.split(/[^a-z0-9-]+/).filter(Boolean));let c=0;for(const d of n)l.has(d)?c+=4:s.includes(d)&&(c+=2);return{...i,score:c}}).filter(i=>i.score>0).sort((i,s)=>s.score-i.score||s.sites-i.sites).slice(0,t):[]}function G(e){return`https://clinicaltrials.gov/study/${e.nct}`}const K=[{ta:"Immunology",name:"SAR446422",desc:"CD28xOX40 bispecific Ab",indication:"Inflammatory indication"},{ta:"Immunology",name:"SAR447971",desc:"IRAK4 degrader",indication:"Hidradenitis suppurativa"},{ta:"Immunology",name:"SAR448501",desc:"CD20 bispecific mAb",indication:"Inflammatory indication"},{ta:"Immunology",name:"brivekimig",desc:"TNFaxOX40L Nanobody VHH",indication:"Type 1 diabetes, stage 3"},{ta:"Immunology",name:"brivekimig",desc:"TNFaxOX40L Nanobody VHH",indication:"Crohn's disease"},{ta:"Immunology",name:"brivekimig",desc:"TNFaxOX40L Nanobody VHH",indication:"Ulcerative colitis"},{ta:"Immunology",name:"brivekimig",desc:"TNFaxOX40L Nanobody VHH",indication:"Hidradenitis suppurativa"},{ta:"Immunology",name:"frexalimab",desc:"CD40L mAb",indication:"Type 1 diabetes, stage 3"},{ta:"Immunology",name:"frexalimab",desc:"CD40L mAb",indication:"Kidney transplant rejection"},{ta:"Immunology",name:"lunsekimig",desc:"IL13xTSLP Nanobody VHH",indication:"Asthma, high-risk"},{ta:"Immunology",name:"lunsekimig",desc:"IL13xTSLP Nanobody VHH",indication:"Asthma"},{ta:"Immunology",name:"lunsekimig",desc:"IL13xTSLP Nanobody VHH",indication:"Chronic rhinosinusitis with nasal polyps"},{ta:"Immunology",name:"lunsekimig",desc:"IL13xTSLP Nanobody VHH",indication:"Chronic obstructive pulmonary disease"},{ta:"Immunology",name:"SAR444336",desc:"Non-beta IL2 Synthorin",indication:"Microscopic colitis"},{ta:"Immunology",name:"SAR445399",desc:"IL1R3 mAb",indication:"Hidradenitis suppurativa"},{ta:"Immunology",name:"SAR449028",desc:"Wild-type KIT inhibitor",indication:"Chronic urticaria"},{ta:"Immunology",name:"Dupixent",desc:"IL4R mAb",indication:"Chronic pruritus of unknown origin"},{ta:"Immunology",name:"duvakitug",desc:"TL1A mAb",indication:"Crohn's disease"},{ta:"Immunology",name:"duvakitug",desc:"TL1A mAb",indication:"Ulcerative colitis"},{ta:"Immunology",name:"Rezurock",desc:"ROCK2 inhibitor",indication:"Chronic lung allograft dysfunction"},{ta:"Neurology",name:"SAR448851",desc:"TREM2 agonist",indication:"Alzheimer's disease"},{ta:"Neurology",name:"frexalimab",desc:"CD40L mAb",indication:"Relapsing multiple sclerosis"},{ta:"Neurology",name:"frexalimab",desc:"CD40L mAb",indication:"Non-relapsing secondary progressive MS"},{ta:"Neurology",name:"riliprubart",desc:"C1s mAb",indication:"IVIg-treated CIDP"},{ta:"Ophthalmology",name:"SAR446597",desc:"BbxC1s AAV gene therapy",indication:"Geographic atrophy in dry age-related macular degeneration"},{ta:"Ophthalmology",name:"SAR402663",desc:"sFLT01 AAV gene therapy",indication:"Wet age-related macular degeneration"},{ta:"Oncology",name:"SAR445953",desc:"CEACAM5-Topo1 ADC",indication:"Colorectal cancer"},{ta:"Oncology",name:"SAR446523",desc:"GPRC5D mAb",indication:"Relapsed/refractory multiple myeloma"},{ta:"Oncology",name:"SAR449336",desc:"Pan KRAS inhibitor",indication:"Colorectal cancer"},{ta:"Oncology",name:"SAR445877",desc:"PD1xIL15 fusion protein",indication:"Solid tumors"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb",indication:"Relapsed/refractory multiple myeloma in combination"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb",indication:"NDMM, transplant-eligible (IsKia)"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb",indication:"NDMM, transplant-eligible (HD7)"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb",indication:"Smoldering multiple myeloma (ITHACA)"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb subcutaneous",indication:"Multiple myeloma (CN)"},{ta:"Rare Diseases",name:"SAR446268",desc:"DMPK AAV gene therapy",indication:"Myotonic dystrophy type 1"},{ta:"Rare Diseases",name:"efdoralprin alfa",desc:"AAT fusion protein",indication:"Alpha-1 antitrypsin deficiency emphysema"},{ta:"Rare Diseases",name:"frexalimab, rilzabrutinib, brivekimig",desc:"CD40L mAb, BTK inhibitor, TNFaxOX40L Nanobody VHH",indication:"Focal segmental glomerulosclerosis / minimal change disease"},{ta:"Rare Diseases",name:"Wayrilz",desc:"BTK inhibitor",indication:"Graves' disease"},{ta:"Rare Diseases",name:"Wayrilz",desc:"BTK inhibitor",indication:"IgG4-related disease"},{ta:"Rare Diseases",name:"Wayrilz",desc:"BTK inhibitor",indication:"Sickle cell disease"},{ta:"Rare Diseases",name:"Wayrilz",desc:"BTK inhibitor",indication:"Warm autoimmune hemolytic anemia"},{ta:"Rare Diseases",name:"elenestinib",desc:"D816V-mutated KIT inhibitor",indication:"Indolent/smoldering systemic mastocytosis"},{ta:"Rare Diseases",name:"fitusiran",desc:"RNAi targeting antithrombin",indication:"Hemophilia A and B (EU, JP)"},{ta:"Rare Diseases",name:"Nexviazyme",desc:"Enzyme replacement therapy",indication:"Infantile-onset Pompe disease (US)"},{ta:"Rare Diseases",name:"venglustat",desc:"Oral GCS inhibitor",indication:"Gaucher disease type 3 (US, EU, JP)"},{businessUnit:"Vaccines",ta:null,name:"SP0269",desc:"mRNA vaccine",indication:"Chlamydia"},{businessUnit:"Vaccines",ta:null,name:"SP0287",desc:"Flublok + Nuvaxovid",indication:"Influenza + COVID-19"},{businessUnit:"Vaccines",ta:null,name:"SP0291",desc:"mRNA vaccine",indication:"RSV + hMPV + PIV3 (older adults)"},{businessUnit:"Vaccines",ta:null,name:"SP0340",desc:"Subunit vaccine",indication:"RSV + hMPV (older adults)"},{businessUnit:"Vaccines",ta:null,name:"SP0341",desc:"Subunit vaccine",indication:"RSV + hMPV + PIV3 (older adults)"},{businessUnit:"Vaccines",ta:null,name:"SP0342",desc:"Subunit adjuvanted vaccine",indication:"Shingles"},{businessUnit:"Vaccines",ta:null,name:"SP0256",desc:"mRNA vaccine",indication:"RSV + hMPV (older adults)"},{businessUnit:"Vaccines",ta:null,name:"SP0268",desc:"mRNA vaccine",indication:"Acne"},{businessUnit:"Vaccines",ta:null,name:"SP0289",desc:"mRNA vaccine",indication:"Influenza H5 pandemic"},{businessUnit:"Vaccines",ta:null,name:"SP0335",desc:"Inactivated adjuvanted vaccine",indication:"Influenza H5 pandemic"},{businessUnit:"Vaccines",ta:null,name:"SP0202",desc:"21-valent conjugate vaccine",indication:"Pneumococcal disease (children)"},{businessUnit:"Vaccines",ta:null,name:"SP0218",desc:"Vero cell vaccine",indication:"Yellow fever"},{businessUnit:"Vaccines",ta:null,name:"Fluzone HD",desc:"Multivalent inactivated vaccine",indication:"Influenza (50 years+) (US, EU)"},{businessUnit:"Vaccines",ta:null,name:"SP0087",desc:"Vero cell vaccine",indication:"Rabies (EU)"}];function I(e){return e.ta||e.businessUnit||""}const _=new Set(["pipeline","project","projects","drug","drugs","molecule","compound","development","clinical","stage","phase","the","and","for","are","any","what","which","with","from","about","this","that","does","sanofi","new","indication","indications","treatment","disease","patient","patients","multiple","chronic","type"]);function X(e,t=6){const n=e.toLowerCase().split(/[^a-z0-9-]+/).filter(i=>i.length>2&&!_.has(i));return n.length?K.map(i=>{const s=`${i.name} ${i.desc} ${i.indication} ${I(i)}`.toLowerCase(),l=new Set(s.split(/[^a-z0-9-]+/).filter(Boolean));let c=0;for(const d of n)l.has(d)?c+=4:s.includes(d)&&(c+=2);return{...i,score:c}}).filter(i=>i.score>0).sort((i,s)=>s.score-i.score).slice(0,t):[]}const N=[{id:"clinical-qa",name:"Clinical Q&A",icon:"stethoscope",page:"concierge.html",agent:"clinical-qa",blurb:"Evidence-based answer with citations from governed Sanofi content",keywords:["treatment","dosing","dose","efficacy","safety","mechanism","moa","guideline","first-line","first line","biologic","compare","versus","evidence","indication","contraindication","pathway","inflammation","how does","options for","my options","topicals","failed topicals","atopic dermatitis","eczema","prescribe","switch to","what should i"]},{id:"medinfo",name:"Medical Information",icon:"file-question",page:"concierge.html",agent:"medinfo",blurb:"Approved answer now, formal written response when it goes beyond the label",keywords:["medical information","med info","submit a question","written response","off-label","off label","renal dose","hepatic dose","dialysis","not in the label","prescribing information","unapproved","lot number","product quality"]},{id:"trial-match",name:"Trial Matching",icon:"flask",page:"concierge.html",agent:"trial-match",blurb:"Match a patient profile to eligible Sanofi trials",keywords:["trial","trials","enroll","enrolment","enrollment","eligib","recruiting","study site","clinical study","refer a patient","phase 3","phase 2"]},{id:"msl-connect",name:"MSL Connect",icon:"users",page:"concierge.html",agent:"msl-connect",blurb:"Find the right Medical Science Liaison for your territory and topic",keywords:["msl","liaison","field team","field medical","who is my","schedule meeting","connect with","scientific exchange","sanofi contact"]},{id:"ingredient",name:"Ingredient Safety",icon:"shield-check",page:"concierge.html",agent:"ingredient",blurb:"Excipient and allergy cross-reference before prescribing",keywords:["ingredient","excipient","allergy","allergic","latex","polysorbate","lactose","halal","kosher","gelatin","preservative","safe for"]},{id:"temp-stab",name:"Temperature Stability",icon:"temperature",page:"concierge.html",agent:"temp-stab",blurb:"Cold chain and temperature excursion assessment",keywords:["storage","temperature","cold chain","fridge","refrigerat","freeze","frozen","excursion","left out","room temp","stability","expired","travel with"]},{id:"patient-nav",name:"Patient Navigator",icon:"route",page:"concierge.html",agent:"patient-nav",blurb:"Care pathway, treatment sequencing, and referral guidance",keywords:["care pathway","pathway for","treatment sequence","next step","referral","navigator","patient profile","comorbid","journey"]},{id:"medical",name:"Medical Concierge",icon:"building-hospital",page:"medical.html",blurb:"Medical Affairs view — evidence, product data, and scientific response support",keywords:["treatment","dosing","dose","efficacy","safety","mechanism","moa","guideline","first-line","biologic","evidence","indication","contraindication","medical affairs","scientific response","atopic dermatitis","rheumatoid","asthma"]},{id:"msl",name:"MSL Copilot",icon:"briefcase",page:"msl-copilot.html",blurb:"Pre-call briefing, KOL intelligence, and field guidance",keywords:["pre-call","precall","briefing","kol","territory","field visit","call plan","hcp profile","engagement history","talking points"]},{id:"literature",name:"Literature Intelligence",icon:"book-2",page:"literature.html",blurb:"Live PubMed and NEJM search with evidence synthesis",keywords:["literature","pubmed","publication","published","paper","journal","meta-analysis","systematic review","nejm","lancet","citation","abstract"]},{id:"disease",name:"Disease State Navigator",icon:"dna",page:"disease.html",blurb:"Disease biology, pathways, and cross-therapeutic-area connections",keywords:["pathophysiology","disease state","biology","cytokine","il-4","il-13","il-5","il-6","il-23","th17","biomarker","phenotype","cross-ta","comorbidity","epidemiology","prevalence","gaucher","fabry","asmd","mps i","pompe","hemophilia","rare disease","lysosomal","inheritance","genotype","autosomal","gene variant","mutation","screening for","newborn screening","diabetes","t1d"]},{id:"congress",name:"Congress Intelligence",icon:"calendar-event",page:"congress.html",blurb:"Congress presentations, key findings, and MSL talking points",keywords:["congress","conference","aad","eadv","eaaci","ats","acr","eular","ddw","ash","isth","wfh","symposium","poster","late-breaker","presented at"]},{id:"agents",name:"Agent Ecosystem",icon:"topology-star-ring-3",page:"agents.html",blurb:"The full agent and governance architecture",keywords:["agent","agents","governance","compliance","audit","architecture","orchestration","ecosystem","which agent","peer connect","kol","advisory board","expert"]},{id:"population",name:"Population Insights",icon:"map-2",page:"population.html",blurb:"Regional disease burden, care gaps, and event geography",keywords:["population","regional","geography","burden by","care gap","cohort","real-world","rwd","state","county","unmet need","heat map"]},{id:"orion",name:"Interaction Signals",icon:"broadcast",page:"orion.html",blurb:"Field intelligence signals generated from HCP engagement",keywords:["signal","signals","field intelligence","engagement pattern","orion","interaction data","territory"]},{id:"patient-concierge",name:"Patient Concierge",icon:"heart",page:"patient.html",blurb:"Patient-friendly treatment guidance and support programs",keywords:["my treatment","side effects i","support program","copay","financial assistance","injection training","caregiver","what should i expect"]}],J=new Set(["msl-connect","trial-match","medinfo","temp-stab","ingredient","patient-nav"]),Q=new Set(["sanofi","medverse","medical","clinical","data","information","patient","patients","disease","treatment","therapy","safety","efficacy","dose","dosing","study","trial","trials","content","program","agent","team"]),Y=new Set(["the","and","for","are","what","which","who","how","why","when","where","any","all","can","does","did","has","have","was","were","with","from","into","about","this","that","there","you","your","our","its","been","more","most","some","such","than","then","also","but","not","use","used","using","get","got","may","should","would","could","need","want","know","tell","give","show","find","see","please","help","just","only","very","too","now","here"]);function Z(e,t){const n=t.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`\\b${n}\\b`).test(e)}function ee(e,t){const n=e.toLowerCase(),r=t&&t.length?new Set(t):null;return N.filter(s=>!r||r.has(s.page)).map(s=>{let l=0;const c=[];for(const d of s.keywords)Z(n,d)&&(l+=d.includes(" ")?6:3,c.push(d));return{...s,score:l,hits:c}}).filter(s=>s.score>0).sort((s,l)=>l.score-s.score)}function te(e,t){var C;const n=ee(e,t),r=O(e),i=e.toLowerCase().split(/[^a-z0-9-]+/).filter(f=>f.length>2&&!Y.has(f)),s=r.citations||[],l=s.length>0&&s.some(f=>{const P=new Set(`${f.title} ${(f.keywords||[]).join(" ")}`.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean));return i.some(T=>!Q.has(T)&&P.has(T))}),d=n.length>0&&J.has(n[0].id)?"action":l?"evidence":n.length?"action":"none",p=H(e,l?(C=r.signal)==null?void 0:C.diseaseArea:null,6),a=n.length?[]:N.filter(f=>["clinical-qa","medical","literature"].includes(f.id)&&(!t||!t.length||t.includes(f.page))).slice(0,1),u=F(e,5),v=X(e,6);return{query:e,terms:i,agents:n.length?n.slice(0,4):a,unmatched:!n.length,answer:r,answerMode:d,answerIsOnTopic:l,resources:p,trials:u,pipeline:v}}function $(e,t){const n=new URLSearchParams;t&&n.set("q",t),e.agent&&n.set("agent",e.agent);const r=n.toString();return r?`${e.page}?${r}`:e.page}const g=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),ie=[{label:"Worth demoing deliberately",icon:"shield-check",blurb:"These show the system declining to invent an answer.",questions:[{q:"Who is my MSL for dermatology?",note:"MSL Connect"},{q:"Is Dupixent safe for a patient with a polysorbate allergy?",note:"Ingredient Safety"},{q:"Dupixent was left out of the fridge overnight, is it still usable?",note:"Temperature Stability"},{q:"How do I request compassionate use for an unapproved medicine?",note:"Medical Information + all four HCP access pathways (MAP, iEnvision portal, PTA)"}]},{label:"Trials and pipeline",icon:"flask",questions:[{q:"What trials are recruiting for atopic dermatitis?",note:"5 real studies with NCT IDs, phase, enrollment, sites"},{q:"What clinical trials are available for cancer?",note:"5 oncology trials + ASCO / AACR / ASH / COMy"},{q:"What is in the pipeline for Gaucher disease?",note:"venglustat (Gaucher type 3) + 6 RDU resources"}]},{label:"The honest-failure demo",icon:"help-circle",blurb:"The behaviour that makes everything else trustworthy — no nearest-document guess.",questions:[{q:"Treatment options for pancreatic cancer",note:'Answers "no indexed clinical evidence" rather than serving the nearest document'}]},{label:"Injection site reactions",icon:"vaccine",questions:[{q:"Is it normal to have pain, swelling, or redness at the injection site?"},{q:"How long do injection site reactions typically last?"},{q:"What can I do to minimize injection site reactions?"}]},{label:"Allergic or hypersensitivity reactions",icon:"alert-triangle",questions:[{q:"What signs of an allergic reaction should I watch for?"},{q:"If I develop a rash or hives, should I stop taking Dupixent?"},{q:"What's the difference between a normal reaction and a serious allergic response?"}]},{label:"Infection-related symptoms",icon:"virus",questions:[{q:"Am I at higher risk for infections like cold sores or shingles?"},{q:"Should I be concerned about unusual skin infections?"},{q:"Do I need any special precautions regarding vaccinations?"}]},{label:"Joint and muscle symptoms",icon:"bone",questions:[{q:"Is joint pain a known side effect of Dupixent?"},{q:"Should I report muscle aches or joint swelling?"}]},{label:"Skin changes",icon:"mood-sick",questions:[{q:"Can Dupixent cause new skin rashes or psoriasis-like symptoms?"},{q:"What facial skin reactions have been reported?"}]},{label:"General monitoring",icon:"activity-heartbeat",questions:[{q:"How often should I have blood work done to monitor eosinophil levels?"},{q:"What symptoms would require me to stop taking Dupixent immediately?"},{q:"Who should I contact if I experience concerning symptoms?"}]}],ae="Always report any new or worsening symptoms to your healthcare provider promptly. Most adverse effects are manageable, but early detection is key.",ne=`
  .mv-prompts-trigger { display: inline-flex; align-items: center; gap: 7px; background: none; border: none;
    padding: 0; font-family: var(--font, sans-serif); font-size: 12.5px; font-weight: 600;
    color: var(--accent, #7a00e6); cursor: pointer; }
  .mv-prompts-trigger:hover { text-decoration: underline; }
  .mv-prompts-trigger-row { margin: 2px 0 20px; }
  .ask-wrap.ask-landing .mv-prompts-trigger-row { text-align: center; margin: 12px 0 0; }

  .mv-prompts-overlay { position: fixed; inset: 0; background: rgba(10,10,20,.55); z-index: 900;
    display: none; align-items: flex-start; justify-content: center; padding: 5vh 18px; }
  .mv-prompts-overlay.open { display: flex; }
  .mv-prompts-modal { background: var(--surface, #fff); border: 1px solid var(--border, #e4dff0);
    border-radius: var(--radius-lg, 16px); width: 100%; max-width: 720px; max-height: 88vh;
    display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 64px rgba(10,10,20,.28); }
  .mv-prompts-head { display: flex; align-items: flex-start; gap: 12px; padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border, #e4dff0); flex-shrink: 0; }
  .mv-prompts-head-icon { width: 36px; height: 36px; border-radius: 11px; flex-shrink: 0;
    background: var(--accent-light, #f0e6ff); color: var(--accent, #7a00e6);
    display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .mv-prompts-title { font-size: 15px; font-weight: 700; color: var(--text, #1a1a2e); }
  .mv-prompts-sub { font-size: 12px; color: var(--text-muted, #918da3); margin-top: 2px; line-height: 1.5; }
  .mv-prompts-close { margin-left: auto; background: none; border: none; cursor: pointer; flex-shrink: 0;
    color: var(--text-muted, #918da3); font-size: 20px; line-height: 1; padding: 2px 4px; }
  .mv-prompts-close:hover { color: var(--text, #1a1a2e); }

  .mv-prompts-filter-row { padding: 12px 20px; border-bottom: 1px solid var(--border, #e4dff0);
    position: relative; flex-shrink: 0; }
  .mv-prompts-filter-icon { position: absolute; left: 33px; top: 50%; transform: translateY(-50%);
    font-size: 14px; color: var(--text-muted, #918da3); pointer-events: none; }
  .mv-prompts-filter { width: 100%; padding: 9px 12px 9px 34px; border: 1.5px solid var(--border, #e4dff0);
    border-radius: 9px; font-family: var(--font, sans-serif); font-size: 12.5px; outline: none;
    background: var(--bg, #f7f5fa); color: var(--text, #1a1a2e); }
  .mv-prompts-filter:focus { border-color: var(--accent, #7a00e6); }

  .mv-prompts-body { overflow-y: auto; padding: 6px 20px 4px; }
  .mv-prompts-body::-webkit-scrollbar { width: 6px; }
  .mv-prompts-body::-webkit-scrollbar-thumb { background: var(--border, #e4dff0); border-radius: 3px; }
  .mv-prompts-cat { padding: 14px 0 4px; }
  .mv-prompts-cat-label { display: flex; align-items: center; gap: 7px; font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .5px; color: var(--text-muted, #918da3); margin-bottom: 4px; }
  .mv-prompts-cat-blurb { font-size: 11.5px; color: var(--text-secondary, #5a5672); line-height: 1.5; margin-bottom: 9px; }
  .mv-prompts-item { display: flex; align-items: flex-start; gap: 10px; border: 1px solid var(--border, #e4dff0);
    border-radius: 11px; padding: 10px 12px; margin-bottom: 7px; }
  .mv-prompts-item:hover { border-color: var(--accent, #7a00e6); background: var(--accent-light, #f0e6ff); }
  .mv-prompts-pick { flex: 1; min-width: 0; text-align: left; background: none; border: none; padding: 0;
    cursor: pointer; font-family: var(--font, sans-serif); color: inherit; }
  .mv-prompts-q { font-size: 13px; line-height: 1.45; color: var(--text, #1a1a2e); }
  .mv-prompts-note { font-size: 11px; color: var(--text-muted, #918da3); line-height: 1.45; margin-top: 3px;
    display: flex; gap: 5px; }
  .mv-prompts-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
  .mv-prompts-copy, .mv-prompts-run { background: none; border: 1px solid var(--border, #e4dff0);
    border-radius: 8px; width: 28px; height: 28px; cursor: pointer; color: var(--text-muted, #918da3);
    display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .mv-prompts-copy:hover { border-color: var(--accent, #7a00e6); color: var(--accent, #7a00e6); }
  .mv-prompts-copy.copied { color: var(--success, #166534); border-color: var(--success, #166534); }
  .mv-prompts-run { background: var(--accent, #7a00e6); border-color: var(--accent, #7a00e6); color: #fff; }
  .mv-prompts-run:hover { background: var(--accent-hover, #6600c2); }
  .mv-prompts-none { font-size: 12.5px; color: var(--text-muted, #918da3); padding: 24px 0; text-align: center; }

  .mv-prompts-foot { padding: 12px 20px 14px; border-top: 1px solid var(--border, #e4dff0);
    font-size: 11.5px; line-height: 1.55; color: var(--text-secondary, #5a5672); flex-shrink: 0;
    display: flex; gap: 7px; }
  .mv-prompts-foot i { color: var(--accent, #7a00e6); flex-shrink: 0; margin-top: 1px; }

  @media (max-width: 640px) {
    .mv-prompts-overlay { padding: 2vh 10px; }
    .mv-prompts-modal { max-height: 94vh; }
  }
`;function q(e){return new Promise((t,n)=>{const r=document.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",document.body.appendChild(r),r.select();let i=!1;try{i=document.execCommand("copy")}catch{}r.remove(),i?t():n(new Error("copy failed"))})}function se(e){var t;return(t=navigator.clipboard)!=null&&t.writeText?navigator.clipboard.writeText(e).catch(()=>q(e)):q(e)}function x(e,t){const n=t.trim().toLowerCase(),r=ie.map(i=>({...i,questions:i.questions.filter(s=>!n||s.q.toLowerCase().includes(n)||i.label.toLowerCase().includes(n))})).filter(i=>i.questions.length);if(!r.length){e.innerHTML=`<div class="mv-prompts-none">No suggested question matches “${g(t)}”.</div>`;return}e.innerHTML=r.map(i=>`
    <div class="mv-prompts-cat">
      <div class="mv-prompts-cat-label"><i class="ti ti-${g(i.icon)}"></i> ${g(i.label)}</div>
      ${i.blurb?`<div class="mv-prompts-cat-blurb">${g(i.blurb)}</div>`:""}
      ${i.questions.map(s=>`
        <div class="mv-prompts-item">
          <button type="button" class="mv-prompts-pick" data-q="${g(s.q)}" title="Fill the search box without running it">
            <div class="mv-prompts-q">${g(s.q)}</div>
            ${s.note?`<div class="mv-prompts-note"><i class="ti ti-arrow-right"></i> ${g(s.note)}</div>`:""}
          </button>
          <div class="mv-prompts-actions">
            <button type="button" class="mv-prompts-run" data-q="${g(s.q)}" title="Fill and run this question">
              <i class="ti ti-player-play"></i>
            </button>
            <button type="button" class="mv-prompts-copy" data-q="${g(s.q)}" title="Copy question">
              <i class="ti ti-copy"></i>
            </button>
          </div>
        </div>`).join("")}
    </div>`).join("")}function oe(){const e=document.getElementById("ask-form"),t=document.getElementById("ask-input");if(!e||!t)return;const n=document.createElement("style");n.textContent=ne,document.head.appendChild(n);const r=document.createElement("div");r.className="mv-prompts-trigger-row",r.innerHTML=`
    <button type="button" class="mv-prompts-trigger" id="mv-prompts-trigger">
      <i class="ti ti-list-search"></i> Browse suggested questions
    </button>`,e.insertAdjacentElement("afterend",r);const i=document.createElement("div");i.className="mv-prompts-overlay",i.innerHTML=`
    <div class="mv-prompts-modal" role="dialog" aria-modal="true" aria-label="Suggested questions">
      <div class="mv-prompts-head">
        <div class="mv-prompts-head-icon"><i class="ti ti-list-search"></i></div>
        <div>
          <div class="mv-prompts-title">Suggested questions</div>
          <div class="mv-prompts-sub">Click a question to drop it into the Ask MedVerse box, use <i class="ti ti-player-play"></i> to run it immediately, or copy it to paste anywhere.</div>
        </div>
        <button type="button" class="mv-prompts-close" title="Close">&times;</button>
      </div>
      <div class="mv-prompts-filter-row">
        <i class="ti ti-search mv-prompts-filter-icon"></i>
        <input type="text" class="mv-prompts-filter" placeholder="Filter questions…" autocomplete="off">
      </div>
      <div class="mv-prompts-body"></div>
      <div class="mv-prompts-foot">
        <i class="ti ti-info-circle"></i>
        <span>${g(ae)}</span>
      </div>
    </div>`,document.body.appendChild(i);const s=i.querySelector(".mv-prompts-body"),l=i.querySelector(".mv-prompts-filter");x(s,"");function c(){i.classList.add("open"),l.value="",x(s,""),requestAnimationFrame(()=>l.focus())}function d(){i.classList.remove("open")}r.querySelector("#mv-prompts-trigger").addEventListener("click",c),i.querySelector(".mv-prompts-close").addEventListener("click",d),i.addEventListener("click",p=>{p.target===i&&d()}),document.addEventListener("keydown",p=>{p.key==="Escape"&&i.classList.contains("open")&&d()}),l.addEventListener("input",()=>x(s,l.value)),s.addEventListener("click",p=>{const a=p.target.closest(".mv-prompts-run");if(a){t.value=a.getAttribute("data-q"),d(),e.requestSubmit?e.requestSubmit():e.submit();return}const u=p.target.closest(".mv-prompts-pick");if(u){t.value=u.getAttribute("data-q"),d(),t.focus();return}const v=p.target.closest(".mv-prompts-copy");v&&se(v.getAttribute("data-q")).then(()=>{v.classList.add("copied"),v.innerHTML='<i class="ti ti-check"></i>',setTimeout(()=>{v.classList.remove("copied"),v.innerHTML='<i class="ti ti-copy"></i>'},1600),window.mvToast&&window.mvToast("Question copied to clipboard","success",2e3)}).catch(()=>{window.mvToast&&window.mvToast("Could not access the clipboard — select and copy manually","warning")})})}const re={podcast:"microphone-2",video:"player-play",infographic:"chart-infographic",article:"file-text"},o=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function ce(e){let t=o(e);return t=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*(.+?)\*/g,"<em>$1</em>"),t=t.replace(/^### (.+)$/gm,"<h3>$1</h3>"),t=t.replace(/^- (.+)$/gm,"<li>$1</li>"),t=t.replace(/(<li>.*<\/li>)/s,"<ul>$1</ul>"),t=t.replace(/\[(\d+)\]/g,'<span class="cite-ref">$1</span>'),t=t.replace(/((?:^\|.*\|\s*$\n?)+)/gm,n=>{const r=n.trim().split(`
`).filter(c=>c.trim().startsWith("|"));if(r.length<2)return n;const i=c=>c.split("|").slice(1,-1).map(d=>d.trim()),s=i(r[0]),l=r.slice(2).map(i);return l.length?`<table><thead><tr>${s.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${l.map(c=>`<tr>${c.map(d=>`<td>${d}</td>`).join("")}</tr>`).join("")}</tbody></table>`:n}),t.split(/\n{2,}/).map(n=>/^<(h3|ul|table)/.test(n.trim())?n:`<p>${n.replace(/\n/g,"<br>")}</p>`).join("")}const le=(document.body.dataset.modules||"").split(",").map(e=>e.trim()).filter(Boolean),de=new URLSearchParams(location.search);let h=(de.get("q")||"").trim();const m=document.getElementById("ask-input"),L=document.getElementById("ask-form"),S=document.getElementById("ask-results"),R=document.getElementById("ask-query-echo");m&&(m.value=h);L&&L.addEventListener("submit",e=>{e.preventDefault();const t=m.value.trim();t&&(location.search="?q="+encodeURIComponent(t))});const me=["What are my options for a patient with moderate-to-severe atopic dermatitis who failed topicals?","Early detection and screening for type 1 diabetes","What trials are recruiting for atopic dermatitis?","Who is my MSL for dermatology?","Cardiac manifestations and biomarkers in Fabry disease","How do I request compassionate use for an unapproved medicine?"],b=document.querySelector(".ask-wrap"),w=document.querySelector(".ask-echo");function M(){var p;if(!h){b&&b.classList.add("ask-landing"),w&&(w.style.display="none"),document.title="Ask MedVerse",S.innerHTML=`
      <div class="ask-examples">
        <div class="ask-examples-label">Or try one of these</div>
        ${me.map(a=>`<button type="button" class="ask-example" data-q="${o(a)}">${o(a)}</button>`).join("")}
      </div>`,S.querySelectorAll(".ask-example").forEach(a=>{a.addEventListener("click",()=>{const u=a.getAttribute("data-q");m&&(m.value=u),location.search="?q="+encodeURIComponent(u)})}),m&&m.focus();return}b&&b.classList.remove("ask-landing"),w&&(w.style.display=""),R&&(R.textContent=h),document.title=`${h} — Ask MedVerse`;const e=te(h,le),t=e.agents.map(a=>`
    <a class="ask-agent-card" href="${o($(a,h))}">
      <div class="ask-agent-icon"><i class="ti ti-${o(a.icon)}"></i></div>
      <div class="ask-agent-body">
        <div class="ask-agent-name">${o(a.name)}</div>
        <div class="ask-agent-blurb">${o(a.blurb)}</div>
      </div>
      <i class="ti ti-arrow-right ask-agent-go"></i>
    </a>`).join(""),n=(e.answer.citations||[]).length?`
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-quote"></i> Sources</div>
      ${e.answer.citations.map((a,u)=>`
        <div class="ask-citation">
          <div class="ask-citation-num">${u+1}</div>
          <div>
            <div class="ask-citation-title">${o(a.title)}</div>
            <div class="ask-citation-meta">${o(a.source)} · ${o(a.date)}<span class="ask-citation-type">${o(a.sourceType)}</span></div>
          </div>
        </div>`).join("")}
    </div>`:"",r=(e.trials||[]).length?`
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-flask"></i> Recruiting studies (${e.trials.length})</div>
      ${e.trials.map(a=>`
        <a class="ask-trial" href="${o(G(a))}" target="_blank" rel="noopener">
          <div class="ask-trial-head">
            <span class="ask-trial-status">${o(a.status)}</span>
            <span class="ask-trial-nct">${o(a.nct)}</span>
          </div>
          <div class="ask-trial-title">${o(a.title)}</div>
          <div class="ask-trial-meta">
            <span><i class="ti ti-target"></i> ${o(a.phase)}</span>
            <span><i class="ti ti-users"></i> ${a.enrollment.toLocaleString()} participants</span>
            <span><i class="ti ti-map-pin"></i> ${a.sites} site${a.sites===1?"":"s"}</span>
          </div>
          <div class="ask-trial-conds">${a.conditions.map(u=>`<span class="ask-trial-cond">${o(u)}</span>`).join("")}</div>
        </a>`).join("")}
      <p class="ask-trial-note">Eligibility shown is a summary. Full inclusion and exclusion criteria are on ClinicalTrials.gov — open a study to review them before referring a patient.</p>
    </div>`:"",i=(e.pipeline||[]).length?`
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-git-branch"></i> R&amp;D pipeline (${e.pipeline.length})</div>
      ${e.pipeline.map(a=>`
        <div class="ask-pipe">
          <div class="ask-pipe-top">
            <span class="ask-pipe-name">${o(a.name)}</span>
            ${I(a)?`<span class="ask-pipe-ta">${o(I(a))}</span>`:""}
          </div>
          <div class="ask-pipe-ind">${o(a.indication)}</div>
          <div class="ask-pipe-mech">${o(a.desc)}</div>
        </div>`).join("")}
      <p class="ask-trial-note">Investigational unless stated otherwise. Development phase is not shown here — check the
        <a href="https://www.sanofi.com/en/our-science/our-pipeline" target="_blank" rel="noopener">Sanofi pipeline page</a>
        for current phase and status before citing any of this.</p>
    </div>`:"",s=(e.resources||[]).length?`
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-books"></i> Learning resources</div>
      ${e.resources.map(a=>`
        <a class="ask-resource" href="${o(a.url)}" target="_blank" rel="noopener">
          <div class="ask-resource-icon"><i class="ti ti-${re[a.contentType]||"file-text"}"></i></div>
          <div>
            <div class="ask-resource-title">${o(a.title)}</div>
            <div class="ask-resource-meta"><span class="ask-resource-type">${o(a.contentType)}</span> · ${o(a.program)}${a.duration?` · ${o(a.duration)}`:""}</div>
          </div>
          <i class="ti ti-external-link ask-resource-go"></i>
        </a>`).join("")}
    </div>`:"";let l;if(e.answerMode==="evidence")l=`
    <div class="ask-answer-card">
      <div class="ask-answer-head">
        <div class="ask-answer-icon"><i class="ti ti-sparkles"></i></div>
        <div>
          <div class="ask-answer-title">Evidence-based answer</div>
          <div class="ask-answer-sub">Drawn from governed Sanofi medical content</div>
        </div>
      </div>
      <div class="ask-answer-body rendered">${ce(e.answer.answer)}</div>
      ${n}
    </div>`;else if(e.answerMode==="action"&&e.agents.length){const a=e.agents[0];l=`
    <div class="ask-answer-card">
      <div class="ask-answer-head">
        <div class="ask-answer-icon"><i class="ti ti-${o(a.icon)}"></i></div>
        <div>
          <div class="ask-answer-title">${o(a.name)} handles this</div>
          <div class="ask-answer-sub">This is a lookup rather than an evidence question — the agent gives you the live answer</div>
        </div>
      </div>
      <div class="ask-answer-body">
        <p>${o(a.blurb)}.</p>
        <p style="margin-top:10px;"><a class="ask-action-btn" href="${o($(a,h))}"><i class="ti ti-arrow-right"></i> Open ${o(a.name)}</a></p>
      </div>
    </div>`}else l=`
    <div class="ask-answer-card">
      <div class="ask-answer-head">
        <div class="ask-answer-icon"><i class="ti ti-help-circle"></i></div>
        <div>
          <div class="ask-answer-title">No indexed answer for this yet</div>
          <div class="ask-answer-sub">Nothing in the governed content matches closely enough to answer confidently</div>
        </div>
      </div>
      <div class="ask-answer-body">
        <p>Rather than guess, MedVerse is telling you it does not know. Try rephrasing, or explore the learning resources below${e.agents.length?" and the suggested agent":""}.</p>
      </div>
    </div>`;let c=null;if(e.answerMode==="evidence"&&e.answer.signal)c=e.answer.signal;else if(e.agents.length){const a=e.agents[0];c={topic:h,intent:`${a.name} request`,diseaseArea:((p=e.answer.signal)==null?void 0:p.diseaseArea)||"General",orionAction:`Routed to ${a.name}. Logged as an HCP-initiated ${a.name.toLowerCase()} request.`}}const d=c?`
    <div class="ask-signal">
      <div class="ask-signal-head"><span class="ask-signal-dot"></span> Interaction signal generated</div>
      <div class="ask-signal-row"><span>Topic</span><strong>${o(c.topic)}</strong></div>
      <div class="ask-signal-row"><span>Intent</span><strong>${o(c.intent)}</strong></div>
      <div class="ask-signal-row"><span>Disease area</span><strong>${o(c.diseaseArea)}</strong></div>
      <div class="ask-signal-action"><i class="ti ti-arrow-right"></i> ${o(c.orionAction)}</div>
    </div>`:"";S.innerHTML=`
    <div class="ask-layout">
      <div class="ask-main">
        ${l}
        ${r}
        ${i}
        ${s}
      </div>
      <div class="ask-side">
        <div class="ask-section">
          <div class="ask-section-label"><i class="ti ti-route"></i> ${e.unmatched?"Suggested agent":`Agents invoked (${e.agents.length})`}</div>
          ${t||'<div class="ask-empty-small">No specific agent matched — try rephrasing.</div>'}
        </div>
        ${d}
      </div>
    </div>`}M();const k=e=>new Promise(t=>setTimeout(t,e));async function A(e){const t=document.getElementById("demo-narrator");t&&(t.innerHTML=`<i class="ti ti-sparkles"></i> ${o(e)}`,V()&&t.classList.add("visible"),z(),await j(e))}function pe(){const e=document.getElementById("demo-narrator");e&&e.classList.remove("visible"),E(),W()}function ue(e){h=e,m&&(m.value=e),M(),window.scrollTo({top:0,behavior:"smooth"})}async function ge(e,t=14){if(m){m.value="",m.focus();for(let n=0;n<e.length;n++)m.value=e.slice(0,n+1),n%3===0&&await k(t);await k(220)}}const he=[{q:"What are my options for a patient with moderate-to-severe atopic dermatitis who failed topicals?",before:"A dermatologist has a patient who has failed topical therapy and is deciding what to do next. She types the question the way she would say it.",after:"The treatment algorithm, the trial data, and the disease burden - each claim numbered back to governed Sanofi content. Underneath: the studies recruiting in this condition, and the education already published on it."},{q:"Is Dupixent safe for a patient with a polysorbate allergy?",before:"Now a safety question before prescribing. This one needs two different things at once.",after:"It invoked two agents: Ingredient Safety for the excipient cross-reference, and Medical Information for the part that goes past the label. Either one opens with the question already filled in."},{q:"Dupixent was left out of the fridge overnight, is it still usable?",before:"This is the kind of question a nurse or pharmacist asks on a Monday morning, and it has a real answer or it does not.",after:"No paragraph invented. It routes straight to Temperature Stability, which does the actual excursion assessment against the product's cold chain limits."},{q:"Early detection and screening for type 1 diabetes",before:"A paediatrician wants to understand screening. Answers here are not limited to internal documents.",after:"Six BR one D G E resources, all type 1 diabetes - the early detection toolkit, two articles, three expert videos. Each keeps its content type, its source programme, and a link back to where it actually lives."},{q:"What trials are recruiting for atopic dermatitis?",before:"She has a patient who is running out of options and asks about trials.",after:"Real studies, each with its N C T number, phase, enrolment target and open sites. The links go to Clinical Trials dot gov, because the summary here is not enough to refer a patient on - and the page says so."},{q:"Who is my MSL for dermatology?",before:"She wants to talk to someone at Sanofi about the long-term data. Today that means finding the right person.",after:"No prose, because the question has no prose answer. It hands her to the agent that performs the real lookup. An early build answered this with congress highlights, because that record mentioned an M S L booth - confidently wrong is worse than nothing."},{q:"How do I request compassionate use for an unapproved medicine?",before:"Her patient has exhausted approved options. This is one of the hardest things for a clinician to navigate.",after:"Managed Access, the request portal, and Post Trial Access - the actual pathways, in one place. And every question she asked left an interaction signal describing the topic, intent and disease area, which is what the field team can act on."},{q:"Treatment options for pancreatic cancer",before:"Last one, and it matters most. There is no pancreatic cancer evidence in the indexed content.",after:"So it says so. It does not hand her the nearest document and let it look like an answer. For something a clinician would rely on, being able to say I do not know is what makes everything else trustworthy."}];let y=!1;async function ve(){if(y)return;y=!0;const e=document.getElementById("run-demo");e&&(e.disabled=!0,e.innerHTML='<i class="ti ti-loader"></i> Running…');try{for(const t of he){if(!y||(await A(t.before),!y)||(await ge(t.q),ue(t.q),await k(700),!y))break;await A(t.after),await k(600)}y&&await A("Eight questions a clinician would actually ask, one box, and governance underneath that does not depend on anyone remembering to apply it.")}finally{pe(),y=!1,e&&(e.disabled=!1,e.innerHTML='<i class="ti ti-player-play"></i> Play Demo')}}const D=document.getElementById("run-demo");D&&D.addEventListener("click",ve);window.addEventListener("beforeunload",()=>{y=!1,E()});oe();
