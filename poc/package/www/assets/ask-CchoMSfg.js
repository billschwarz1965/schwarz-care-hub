import"./enhancements-wiYHDXSW.js";import{g as q,s as R}from"./rag-engine-ChWXz4Hk.js";import"./taxonomy-B-xcL3O-.js";const D=[{nct:"NCT05363319",title:"Study of Routine Use of an Immunotherapy for Advanced Non-Small Cell Lung Cancer",status:"Recruiting",phase:"Observational",conditions:["Non-small Cell Lung Cancer"],therapeuticArea:"Oncology",enrollment:300,sites:28,keywords:["lung cancer","NSCLC","non-small cell","immunotherapy","oncology","cancer","real-world"]},{nct:"NCT05584670",title:"Study of an Investigational Study Drug Alone or With Other Treatments for Advanced Solid Tumors",status:"Recruiting",phase:"Phase 1/2",conditions:["Solid Tumor"],therapeuticArea:"Oncology",enrollment:542,sites:22,keywords:["solid tumor","advanced","metastatic","oncology","cancer","cetuximab","bevacizumab","melanoma","kidney cancer","mesothelioma"]},{nct:"NCT06131840",title:"Study of an Investigational Antibody-Drug Conjugate for Advanced Solid Tumors",status:"Recruiting",phase:"Phase 1",conditions:["Colorectal Neoplasms","Non-Small-Cell Lung Carcinoma","Stomach Neoplasms","Pancreatic Ductal Adenocarcinoma"],therapeuticArea:"Oncology",enrollment:914,sites:52,keywords:["antibody-drug conjugate","ADC","colorectal","gastric","lung cancer","pancreatic","oncology","cancer","solid tumor"]},{nct:"NCT07629960",title:"Study of an Investigational Study Drug for Metastatic KRAS-Mutant Cancers",status:"Recruiting",phase:"Phase 1/2",conditions:["Advanced Solid Tumor","Non-Small Cell Lung Cancer","Colorectal Neoplasms","Pancreatic Ductal Adenocarcinoma"],therapeuticArea:"Oncology",enrollment:265,sites:2,keywords:["KRAS","G12C","G12D","mutation","metastatic","pancreatic","colorectal","lung cancer","oncology","cancer","biomarker"]},{nct:"NCT07692204",title:"Study of an Investigational Study Drug for Advanced Stomach or Gastroesophageal Junction Cancer",status:"Recruiting",phase:"Phase 2",conditions:["Gastric Cancer","Oesophageal Carcinoma"],therapeuticArea:"Oncology",enrollment:30,sites:1,keywords:["gastric cancer","stomach cancer","gastroesophageal","oesophageal","HER2","oncology","cancer"]},{nct:"NCT06241118",title:"Study of an Investigational Injection for Moderate-to-Severe Atopic Dermatitis",status:"Recruiting",phase:"Phase 3",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:636,sites:155,keywords:["atopic dermatitis","eczema","moderate-to-severe","injection","dermatology","immunology"]},{nct:"NCT06039241",title:"Study of Long-Term Treatment With an Approved Medicine for Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:900,sites:55,keywords:["atopic dermatitis","eczema","long-term","safety","dermatology","immunology"]},{nct:"NCT06837454",title:"Study of Real-World Care for Adults With Moderate to Severe Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:600,sites:64,keywords:["atopic dermatitis","eczema","real-world","adults","dermatology","immunology"]},{nct:"NCT07290803",title:"Study of Long-Term Real-World Systemic Treatments for Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:1e3,sites:80,keywords:["atopic dermatitis","eczema","systemic","real-world","long-term","dermatology"]},{nct:"NCT03936335",title:"Study of Pregnancy and Infant Outcomes in Women With Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Adverse Pregnancy Outcomes","Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:3930,sites:1,keywords:["atopic dermatitis","pregnancy","infant","registry","outcomes","dermatology"]},{nct:"NCT06192563",title:"Study of Dupilumab Treatment in Children and Teens With Severe Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:230,sites:9,keywords:["atopic dermatitis","dupilumab","children","pediatric","adolescent","severe","dermatology"]},{nct:"NCT07467564",title:"Study of a Treatment's Effects on Mental Health in Moderate-to-Severe Atopic Dermatitis",status:"Recruiting",phase:"Observational",conditions:["Atopic Dermatitis"],therapeuticArea:"Immunology",enrollment:184,sites:7,keywords:["atopic dermatitis","mental health","depression","anxiety","quality of life","dermatology"]}],N=new Set(["trial","trials","study","studies","clinical","available","recruiting","patient","patients","the","and","for","are","any","what","which","with","from","about","this","that","does","advanced","treatment","investigational","drug","severe","moderate","adults","multiple"]);function P(e,a=5){const s=e.toLowerCase().split(/[^a-z0-9-]+/).filter(t=>t.length>2&&!N.has(t));return s.length?D.map(t=>{const n=`${t.title} ${t.conditions.join(" ")} ${t.keywords.join(" ")} ${t.therapeuticArea}`.toLowerCase(),l=new Set(n.split(/[^a-z0-9-]+/).filter(Boolean));let r=0;for(const d of s)l.has(d)?r+=4:n.includes(d)&&(r+=2);return{...t,score:r}}).filter(t=>t.score>0).sort((t,n)=>n.score-t.score||n.sites-t.sites).slice(0,a):[]}function E(e){return`https://clinicaltrials.gov/study/${e.nct}`}const M=[{ta:"Immunology",name:"SAR446422",desc:"CD28xOX40 bispecific Ab",indication:"Inflammatory indication"},{ta:"Immunology",name:"SAR447971",desc:"IRAK4 degrader",indication:"Hidradenitis suppurativa"},{ta:"Immunology",name:"SAR448501",desc:"CD20 bispecific mAb",indication:"Inflammatory indication"},{ta:"Immunology",name:"brivekimig",desc:"TNFaxOX40L Nanobody VHH",indication:"Type 1 diabetes, stage 3"},{ta:"Immunology",name:"brivekimig",desc:"TNFaxOX40L Nanobody VHH",indication:"Crohn's disease"},{ta:"Immunology",name:"brivekimig",desc:"TNFaxOX40L Nanobody VHH",indication:"Ulcerative colitis"},{ta:"Immunology",name:"brivekimig",desc:"TNFaxOX40L Nanobody VHH",indication:"Hidradenitis suppurativa"},{ta:"Immunology",name:"frexalimab",desc:"CD40L mAb",indication:"Type 1 diabetes, stage 3"},{ta:"Immunology",name:"frexalimab",desc:"CD40L mAb",indication:"Kidney transplant rejection"},{ta:"Immunology",name:"lunsekimig",desc:"IL13xTSLP Nanobody VHH",indication:"Asthma, high-risk"},{ta:"Immunology",name:"lunsekimig",desc:"IL13xTSLP Nanobody VHH",indication:"Asthma"},{ta:"Immunology",name:"lunsekimig",desc:"IL13xTSLP Nanobody VHH",indication:"Chronic rhinosinusitis with nasal polyps"},{ta:"Immunology",name:"lunsekimig",desc:"IL13xTSLP Nanobody VHH",indication:"Chronic obstructive pulmonary disease"},{ta:"Immunology",name:"SAR444336",desc:"Non-beta IL2 Synthorin",indication:"Microscopic colitis"},{ta:"Immunology",name:"SAR445399",desc:"IL1R3 mAb",indication:"Hidradenitis suppurativa"},{ta:"Immunology",name:"SAR449028",desc:"Wild-type KIT inhibitor",indication:"Chronic urticaria"},{ta:"Immunology",name:"Dupixent",desc:"IL4R mAb",indication:"Chronic pruritus of unknown origin"},{ta:"Immunology",name:"duvakitug",desc:"TL1A mAb",indication:"Crohn's disease"},{ta:"Immunology",name:"duvakitug",desc:"TL1A mAb",indication:"Ulcerative colitis"},{ta:"Immunology",name:"Rezurock",desc:"ROCK2 inhibitor",indication:"Chronic lung allograft dysfunction"},{ta:"Neurology",name:"SAR448851",desc:"TREM2 agonist",indication:"Alzheimer's disease"},{ta:"Neurology",name:"frexalimab",desc:"CD40L mAb",indication:"Relapsing multiple sclerosis"},{ta:"Neurology",name:"frexalimab",desc:"CD40L mAb",indication:"Non-relapsing secondary progressive MS"},{ta:"Neurology",name:"riliprubart",desc:"C1s mAb",indication:"IVIg-treated CIDP"},{ta:"Ophthalmology",name:"SAR446597",desc:"BbxC1s AAV gene therapy",indication:"Geographic atrophy in dry age-related macular degeneration"},{ta:"Ophthalmology",name:"SAR402663",desc:"sFLT01 AAV gene therapy",indication:"Wet age-related macular degeneration"},{ta:"Oncology",name:"SAR445953",desc:"CEACAM5-Topo1 ADC",indication:"Colorectal cancer"},{ta:"Oncology",name:"SAR446523",desc:"GPRC5D mAb",indication:"Relapsed/refractory multiple myeloma"},{ta:"Oncology",name:"SAR449336",desc:"Pan KRAS inhibitor",indication:"Colorectal cancer"},{ta:"Oncology",name:"SAR445877",desc:"PD1xIL15 fusion protein",indication:"Solid tumors"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb",indication:"Relapsed/refractory multiple myeloma in combination"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb",indication:"NDMM, transplant-eligible (IsKia)"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb",indication:"NDMM, transplant-eligible (HD7)"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb",indication:"Smoldering multiple myeloma (ITHACA)"},{ta:"Oncology",name:"Sarclisa",desc:"CD38 mAb subcutaneous",indication:"Multiple myeloma (CN)"},{ta:"Rare Diseases",name:"SAR446268",desc:"DMPK AAV gene therapy",indication:"Myotonic dystrophy type 1"},{ta:"Rare Diseases",name:"efdoralprin alfa",desc:"AAT fusion protein",indication:"Alpha-1 antitrypsin deficiency emphysema"},{ta:"Rare Diseases",name:"frexalimab, rilzabrutinib, brivekimig",desc:"CD40L mAb, BTK inhibitor, TNFaxOX40L Nanobody VHH",indication:"Focal segmental glomerulosclerosis / minimal change disease"},{ta:"Rare Diseases",name:"Wayrilz",desc:"BTK inhibitor",indication:"Graves' disease"},{ta:"Rare Diseases",name:"Wayrilz",desc:"BTK inhibitor",indication:"IgG4-related disease"},{ta:"Rare Diseases",name:"Wayrilz",desc:"BTK inhibitor",indication:"Sickle cell disease"},{ta:"Rare Diseases",name:"Wayrilz",desc:"BTK inhibitor",indication:"Warm autoimmune hemolytic anemia"},{ta:"Rare Diseases",name:"elenestinib",desc:"D816V-mutated KIT inhibitor",indication:"Indolent/smoldering systemic mastocytosis"},{ta:"Rare Diseases",name:"fitusiran",desc:"RNAi targeting antithrombin",indication:"Hemophilia A and B (EU, JP)"},{ta:"Rare Diseases",name:"Nexviazyme",desc:"Enzyme replacement therapy",indication:"Infantile-onset Pompe disease (US)"},{ta:"Rare Diseases",name:"venglustat",desc:"Oral GCS inhibitor",indication:"Gaucher disease type 3 (US, EU, JP)"},{businessUnit:"Vaccines",ta:null,name:"SP0269",desc:"mRNA vaccine",indication:"Chlamydia"},{businessUnit:"Vaccines",ta:null,name:"SP0287",desc:"Flublok + Nuvaxovid",indication:"Influenza + COVID-19"},{businessUnit:"Vaccines",ta:null,name:"SP0291",desc:"mRNA vaccine",indication:"RSV + hMPV + PIV3 (older adults)"},{businessUnit:"Vaccines",ta:null,name:"SP0340",desc:"Subunit vaccine",indication:"RSV + hMPV (older adults)"},{businessUnit:"Vaccines",ta:null,name:"SP0341",desc:"Subunit vaccine",indication:"RSV + hMPV + PIV3 (older adults)"},{businessUnit:"Vaccines",ta:null,name:"SP0342",desc:"Subunit adjuvanted vaccine",indication:"Shingles"},{businessUnit:"Vaccines",ta:null,name:"SP0256",desc:"mRNA vaccine",indication:"RSV + hMPV (older adults)"},{businessUnit:"Vaccines",ta:null,name:"SP0268",desc:"mRNA vaccine",indication:"Acne"},{businessUnit:"Vaccines",ta:null,name:"SP0289",desc:"mRNA vaccine",indication:"Influenza H5 pandemic"},{businessUnit:"Vaccines",ta:null,name:"SP0335",desc:"Inactivated adjuvanted vaccine",indication:"Influenza H5 pandemic"},{businessUnit:"Vaccines",ta:null,name:"SP0202",desc:"21-valent conjugate vaccine",indication:"Pneumococcal disease (children)"},{businessUnit:"Vaccines",ta:null,name:"SP0218",desc:"Vero cell vaccine",indication:"Yellow fever"},{businessUnit:"Vaccines",ta:null,name:"Fluzone HD",desc:"Multivalent inactivated vaccine",indication:"Influenza (50 years+) (US, EU)"},{businessUnit:"Vaccines",ta:null,name:"SP0087",desc:"Vero cell vaccine",indication:"Rabies (EU)"}];function x(e){return e.ta||e.businessUnit||""}const O=new Set(["pipeline","project","projects","drug","drugs","molecule","compound","development","clinical","stage","phase","the","and","for","are","any","what","which","with","from","about","this","that","does","sanofi","new","indication","indications","treatment","disease","patient","patients","multiple","chronic","type"]);function V(e,a=6){const s=e.toLowerCase().split(/[^a-z0-9-]+/).filter(t=>t.length>2&&!O.has(t));return s.length?M.map(t=>{const n=`${t.name} ${t.desc} ${t.indication} ${x(t)}`.toLowerCase(),l=new Set(n.split(/[^a-z0-9-]+/).filter(Boolean));let r=0;for(const d of s)l.has(d)?r+=4:n.includes(d)&&(r+=2);return{...t,score:r}}).filter(t=>t.score>0).sort((t,n)=>n.score-t.score).slice(0,a):[]}const T=[{id:"clinical-qa",name:"Clinical Q&A",icon:"stethoscope",page:"concierge.html",agent:"clinical-qa",blurb:"Evidence-based answer with citations from governed Sanofi content",keywords:["treatment","dosing","dose","efficacy","safety","mechanism","moa","guideline","first-line","first line","biologic","compare","versus","evidence","indication","contraindication","pathway","inflammation","how does","options for","my options","topicals","failed topicals","atopic dermatitis","eczema","prescribe","switch to","what should i"]},{id:"medinfo",name:"Medical Information",icon:"file-question",page:"concierge.html",agent:"medinfo",blurb:"Approved answer now, formal written response when it goes beyond the label",keywords:["medical information","med info","submit a question","written response","off-label","off label","renal dose","hepatic dose","dialysis","not in the label","prescribing information","unapproved","lot number","product quality"]},{id:"trial-match",name:"Trial Matching",icon:"flask",page:"concierge.html",agent:"trial-match",blurb:"Match a patient profile to eligible Sanofi trials",keywords:["trial","trials","enroll","enrolment","enrollment","eligib","recruiting","study site","clinical study","refer a patient","phase 3","phase 2"]},{id:"msl-connect",name:"MSL Connect",icon:"users",page:"concierge.html",agent:"msl-connect",blurb:"Find the right Medical Science Liaison for your territory and topic",keywords:["msl","liaison","field team","field medical","who is my","schedule meeting","connect with","scientific exchange","sanofi contact"]},{id:"ingredient",name:"Ingredient Safety",icon:"shield-check",page:"concierge.html",agent:"ingredient",blurb:"Excipient and allergy cross-reference before prescribing",keywords:["ingredient","excipient","allergy","allergic","latex","polysorbate","lactose","halal","kosher","gelatin","preservative","safe for"]},{id:"temp-stab",name:"Temperature Stability",icon:"temperature",page:"concierge.html",agent:"temp-stab",blurb:"Cold chain and temperature excursion assessment",keywords:["storage","temperature","cold chain","fridge","refrigerat","freeze","frozen","excursion","left out","room temp","stability","expired","travel with"]},{id:"patient-nav",name:"Patient Navigator",icon:"route",page:"concierge.html",agent:"patient-nav",blurb:"Care pathway, treatment sequencing, and referral guidance",keywords:["care pathway","pathway for","treatment sequence","next step","referral","navigator","patient profile","comorbid","journey"]},{id:"medical",name:"Medical Concierge",icon:"building-hospital",page:"medical.html",blurb:"Medical Affairs view — evidence, product data, and scientific response support",keywords:["treatment","dosing","dose","efficacy","safety","mechanism","moa","guideline","first-line","biologic","evidence","indication","contraindication","medical affairs","scientific response","atopic dermatitis","rheumatoid","asthma"]},{id:"msl",name:"MSL Copilot",icon:"briefcase",page:"msl-copilot.html",blurb:"Pre-call briefing, KOL intelligence, and field guidance",keywords:["pre-call","precall","briefing","kol","territory","field visit","call plan","hcp profile","engagement history","talking points"]},{id:"literature",name:"Literature Intelligence",icon:"book-2",page:"literature.html",blurb:"Live PubMed and NEJM search with evidence synthesis",keywords:["literature","pubmed","publication","published","paper","journal","meta-analysis","systematic review","nejm","lancet","citation","abstract"]},{id:"disease",name:"Disease State Navigator",icon:"dna",page:"disease.html",blurb:"Disease biology, pathways, and cross-therapeutic-area connections",keywords:["pathophysiology","disease state","biology","cytokine","il-4","il-13","il-5","il-6","il-23","th17","biomarker","phenotype","cross-ta","comorbidity","epidemiology","prevalence","gaucher","fabry","asmd","mps i","pompe","hemophilia","rare disease","lysosomal","inheritance","genotype","autosomal","gene variant","mutation","screening for","newborn screening","diabetes","t1d"]},{id:"congress",name:"Congress Intelligence",icon:"calendar-event",page:"congress.html",blurb:"Congress presentations, key findings, and MSL talking points",keywords:["congress","conference","aad","eadv","eaaci","ats","acr","eular","ddw","ash","isth","wfh","symposium","poster","late-breaker","presented at"]},{id:"agents",name:"Agent Ecosystem",icon:"topology-star-ring-3",page:"agents.html",blurb:"The full agent and governance architecture",keywords:["agent","agents","governance","compliance","audit","architecture","orchestration","ecosystem","which agent","peer connect","kol","advisory board","expert"]},{id:"population",name:"Population Insights",icon:"map-2",page:"population.html",blurb:"Regional disease burden, care gaps, and event geography",keywords:["population","regional","geography","burden by","care gap","cohort","real-world","rwd","state","county","unmet need","heat map"]},{id:"orion",name:"Interaction Signals",icon:"broadcast",page:"orion.html",blurb:"Field intelligence signals generated from HCP engagement",keywords:["signal","signals","field intelligence","engagement pattern","orion","interaction data","territory"]},{id:"patient-concierge",name:"Patient Concierge",icon:"heart",page:"patient.html",blurb:"Patient-friendly treatment guidance and support programs",keywords:["my treatment","side effects i","support program","copay","financial assistance","injection training","caregiver","what should i expect"]}],H=new Set(["msl-connect","trial-match","medinfo","temp-stab","ingredient","patient-nav"]),z=new Set(["sanofi","medverse","medical","clinical","data","information","patient","patients","disease","treatment","therapy","safety","efficacy","dose","dosing","study","trial","trials","content","program","agent","team"]),j=new Set(["the","and","for","are","what","which","who","how","why","when","where","any","all","can","does","did","has","have","was","were","with","from","into","about","this","that","there","you","your","our","its","been","more","most","some","such","than","then","also","but","not","use","used","using","get","got","may","should","would","could","need","want","know","tell","give","show","find","see","please","help","just","only","very","too","now","here"]);function U(e,a){const s=` ${e.toLowerCase()} `,c=a&&a.length?new Set(a):null;return T.filter(n=>!c||c.has(n.page)).map(n=>{let l=0;const r=[];for(const d of n.keywords)s.includes(d.toLowerCase())&&(l+=d.includes(" ")?6:3,r.push(d));return{...n,score:l,hits:r}}).filter(n=>n.score>0).sort((n,l)=>l.score-n.score)}function W(e,a){var S;const s=U(e,a),c=q(e),t=e.toLowerCase().split(/[^a-z0-9-]+/).filter(h=>h.length>2&&!j.has(h)),n=c.citations||[],l=n.length>0&&n.some(h=>{const L=new Set(`${h.title} ${(h.keywords||[]).join(" ")}`.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean));return t.some(A=>!z.has(A)&&L.has(A))}),d=s.length>0&&H.has(s[0].id)?"action":l?"evidence":s.length?"action":"none",m=R(e,l?(S=c.signal)==null?void 0:S.diseaseArea:null,6),i=s.length?[]:T.filter(h=>["clinical-qa","medical","literature"].includes(h.id)&&(!a||!a.length||a.includes(h.page))).slice(0,1),p=P(e,5),g=V(e,6);return{query:e,terms:t,agents:s.length?s.slice(0,4):i,unmatched:!s.length,answer:c,answerMode:d,answerIsOnTopic:l,resources:m,trials:p,pipeline:g}}function C(e,a){const s=new URLSearchParams;a&&s.set("q",a),e.agent&&s.set("agent",e.agent);const c=s.toString();return c?`${e.page}?${c}`:e.page}const u=e=>String(e??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a]),B=[{label:"Worth demoing deliberately",icon:"shield-check",blurb:"These show the system declining to invent an answer.",questions:[{q:"Who is my MSL for dermatology?",note:"MSL Connect"},{q:"Is Dupixent safe for a patient with a polysorbate allergy?",note:"Ingredient Safety"},{q:"Dupixent was left out of the fridge overnight, is it still usable?",note:"Temperature Stability"},{q:"How do I request compassionate use for an unapproved medicine?",note:"Medical Information + all four HCP access pathways (MAP, iEnvision portal, PTA)"}]},{label:"Trials and pipeline",icon:"flask",questions:[{q:"What trials are recruiting for atopic dermatitis?",note:"5 real studies with NCT IDs, phase, enrollment, sites"},{q:"What clinical trials are available for cancer?",note:"5 oncology trials + ASCO / AACR / ASH / COMy"},{q:"What is in the pipeline for Gaucher disease?",note:"venglustat (Gaucher type 3) + 6 RDU resources"}]},{label:"The honest-failure demo",icon:"help-circle",blurb:"The behaviour that makes everything else trustworthy — no nearest-document guess.",questions:[{q:"Treatment options for pancreatic cancer",note:'Answers "no indexed clinical evidence" rather than serving the nearest document'}]},{label:"Injection site reactions",icon:"vaccine",questions:[{q:"Is it normal to have pain, swelling, or redness at the injection site?"},{q:"How long do injection site reactions typically last?"},{q:"What can I do to minimize injection site reactions?"}]},{label:"Allergic or hypersensitivity reactions",icon:"alert-triangle",questions:[{q:"What signs of an allergic reaction should I watch for?"},{q:"If I develop a rash or hives, should I stop taking Dupixent?"},{q:"What's the difference between a normal reaction and a serious allergic response?"}]},{label:"Infection-related symptoms",icon:"virus",questions:[{q:"Am I at higher risk for infections like cold sores or shingles?"},{q:"Should I be concerned about unusual skin infections?"},{q:"Do I need any special precautions regarding vaccinations?"}]},{label:"Joint and muscle symptoms",icon:"bone",questions:[{q:"Is joint pain a known side effect of Dupixent?"},{q:"Should I report muscle aches or joint swelling?"}]},{label:"Skin changes",icon:"mood-sick",questions:[{q:"Can Dupixent cause new skin rashes or psoriasis-like symptoms?"},{q:"What facial skin reactions have been reported?"}]},{label:"General monitoring",icon:"activity-heartbeat",questions:[{q:"How often should I have blood work done to monitor eosinophil levels?"},{q:"What symptoms would require me to stop taking Dupixent immediately?"},{q:"Who should I contact if I experience concerning symptoms?"}]}],F="Always report any new or worsening symptoms to your healthcare provider promptly. Most adverse effects are manageable, but early detection is key.",G=`
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
`;function K(e){var a;return(a=navigator.clipboard)!=null&&a.writeText?navigator.clipboard.writeText(e):new Promise((s,c)=>{const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();const n=document.execCommand("copy");t.remove(),n?s():c(new Error("copy failed"))})}function w(e,a){const s=a.trim().toLowerCase(),c=B.map(t=>({...t,questions:t.questions.filter(n=>!s||n.q.toLowerCase().includes(s)||t.label.toLowerCase().includes(s))})).filter(t=>t.questions.length);if(!c.length){e.innerHTML=`<div class="mv-prompts-none">No suggested question matches “${u(a)}”.</div>`;return}e.innerHTML=c.map(t=>`
    <div class="mv-prompts-cat">
      <div class="mv-prompts-cat-label"><i class="ti ti-${u(t.icon)}"></i> ${u(t.label)}</div>
      ${t.blurb?`<div class="mv-prompts-cat-blurb">${u(t.blurb)}</div>`:""}
      ${t.questions.map(n=>`
        <div class="mv-prompts-item">
          <button type="button" class="mv-prompts-pick" data-q="${u(n.q)}" title="Fill the search box without running it">
            <div class="mv-prompts-q">${u(n.q)}</div>
            ${n.note?`<div class="mv-prompts-note"><i class="ti ti-arrow-right"></i> ${u(n.note)}</div>`:""}
          </button>
          <div class="mv-prompts-actions">
            <button type="button" class="mv-prompts-run" data-q="${u(n.q)}" title="Fill and run this question">
              <i class="ti ti-player-play"></i>
            </button>
            <button type="button" class="mv-prompts-copy" data-q="${u(n.q)}" title="Copy question">
              <i class="ti ti-copy"></i>
            </button>
          </div>
        </div>`).join("")}
    </div>`).join("")}function _(){const e=document.getElementById("ask-form"),a=document.getElementById("ask-input");if(!e||!a)return;const s=document.createElement("style");s.textContent=G,document.head.appendChild(s);const c=document.createElement("div");c.className="mv-prompts-trigger-row",c.innerHTML=`
    <button type="button" class="mv-prompts-trigger" id="mv-prompts-trigger">
      <i class="ti ti-list-search"></i> Browse suggested questions
    </button>`,e.insertAdjacentElement("afterend",c);const t=document.createElement("div");t.className="mv-prompts-overlay",t.innerHTML=`
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
        <span>${u(F)}</span>
      </div>
    </div>`,document.body.appendChild(t);const n=t.querySelector(".mv-prompts-body"),l=t.querySelector(".mv-prompts-filter");w(n,"");function r(){t.classList.add("open"),l.value="",w(n,""),requestAnimationFrame(()=>l.focus())}function d(){t.classList.remove("open")}c.querySelector("#mv-prompts-trigger").addEventListener("click",r),t.querySelector(".mv-prompts-close").addEventListener("click",d),t.addEventListener("click",m=>{m.target===t&&d()}),document.addEventListener("keydown",m=>{m.key==="Escape"&&t.classList.contains("open")&&d()}),l.addEventListener("input",()=>w(n,l.value)),n.addEventListener("click",m=>{const i=m.target.closest(".mv-prompts-run");if(i){a.value=i.getAttribute("data-q"),d(),e.requestSubmit?e.requestSubmit():e.submit();return}const p=m.target.closest(".mv-prompts-pick");if(p){a.value=p.getAttribute("data-q"),d(),a.focus();return}const g=m.target.closest(".mv-prompts-copy");g&&K(g.getAttribute("data-q")).then(()=>{g.classList.add("copied"),g.innerHTML='<i class="ti ti-check"></i>',setTimeout(()=>{g.classList.remove("copied"),g.innerHTML='<i class="ti ti-copy"></i>'},1600),window.mvToast&&window.mvToast("Question copied to clipboard","success",2e3)}).catch(()=>{window.mvToast&&window.mvToast("Could not access the clipboard — select and copy manually","warning")})})}const X={podcast:"microphone-2",video:"player-play",infographic:"chart-infographic",article:"file-text"},o=e=>String(e??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a]);function J(e){let a=o(e);return a=a.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),a=a.replace(/\*(.+?)\*/g,"<em>$1</em>"),a=a.replace(/^### (.+)$/gm,"<h3>$1</h3>"),a=a.replace(/^- (.+)$/gm,"<li>$1</li>"),a=a.replace(/(<li>.*<\/li>)/s,"<ul>$1</ul>"),a=a.replace(/\[(\d+)\]/g,'<span class="cite-ref">$1</span>'),a=a.replace(/((?:^\|.*\|\s*$\n?)+)/gm,s=>{const c=s.trim().split(`
`).filter(r=>r.trim().startsWith("|"));if(c.length<2)return s;const t=r=>r.split("|").slice(1,-1).map(d=>d.trim()),n=t(c[0]),l=c.slice(2).map(t);return l.length?`<table><thead><tr>${n.map(r=>`<th>${r}</th>`).join("")}</tr></thead><tbody>${l.map(r=>`<tr>${r.map(d=>`<td>${d}</td>`).join("")}</tr>`).join("")}</tbody></table>`:s}),a.split(/\n{2,}/).map(s=>/^<(h3|ul|table)/.test(s.trim())?s:`<p>${s.replace(/\n/g,"<br>")}</p>`).join("")}const Q=(document.body.dataset.modules||"").split(",").map(e=>e.trim()).filter(Boolean),Y=new URLSearchParams(location.search),v=(Y.get("q")||"").trim(),f=document.getElementById("ask-input"),I=document.getElementById("ask-form"),k=document.getElementById("ask-results"),$=document.getElementById("ask-query-echo");f&&(f.value=v);I&&I.addEventListener("submit",e=>{e.preventDefault();const a=f.value.trim();a&&(location.search="?q="+encodeURIComponent(a))});const Z=["What are my options for a patient with moderate-to-severe atopic dermatitis who failed topicals?","Early detection and screening for type 1 diabetes","What trials are recruiting for atopic dermatitis?","Who is my MSL for dermatology?","Cardiac manifestations and biomarkers in Fabry disease","How do I request compassionate use for an unapproved medicine?","What's in Sanofi's R&D pipeline for atopic dermatitis?"],y=document.querySelector(".ask-wrap"),b=document.querySelector(".ask-echo");function ee(){var m;if(!v){y&&y.classList.add("ask-landing"),b&&(b.style.display="none"),document.title="Ask MedVerse",k.innerHTML=`
      <div class="ask-examples">
        <div class="ask-examples-label">Or try one of these</div>
        ${Z.map(i=>`<button type="button" class="ask-example" data-q="${o(i)}">${o(i)}</button>`).join("")}
      </div>`,k.querySelectorAll(".ask-example").forEach(i=>{i.addEventListener("click",()=>{const p=i.getAttribute("data-q");f&&(f.value=p),location.search="?q="+encodeURIComponent(p)})}),f&&f.focus();return}y&&y.classList.remove("ask-landing"),b&&(b.style.display=""),$&&($.textContent=v),document.title=`${v} — Ask MedVerse`;const e=W(v,Q),a=e.agents.map(i=>`
    <a class="ask-agent-card" href="${o(C(i,v))}">
      <div class="ask-agent-icon"><i class="ti ti-${o(i.icon)}"></i></div>
      <div class="ask-agent-body">
        <div class="ask-agent-name">${o(i.name)}</div>
        <div class="ask-agent-blurb">${o(i.blurb)}</div>
      </div>
      <i class="ti ti-arrow-right ask-agent-go"></i>
    </a>`).join(""),s=(e.answer.citations||[]).length?`
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-quote"></i> Sources</div>
      ${e.answer.citations.map((i,p)=>`
        <div class="ask-citation">
          <div class="ask-citation-num">${p+1}</div>
          <div>
            <div class="ask-citation-title">${o(i.title)}</div>
            <div class="ask-citation-meta">${o(i.source)} · ${o(i.date)}<span class="ask-citation-type">${o(i.sourceType)}</span></div>
          </div>
        </div>`).join("")}
    </div>`:"",c=(e.trials||[]).length?`
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-flask"></i> Recruiting studies (${e.trials.length})</div>
      ${e.trials.map(i=>`
        <a class="ask-trial" href="${o(E(i))}" target="_blank" rel="noopener">
          <div class="ask-trial-head">
            <span class="ask-trial-status">${o(i.status)}</span>
            <span class="ask-trial-nct">${o(i.nct)}</span>
          </div>
          <div class="ask-trial-title">${o(i.title)}</div>
          <div class="ask-trial-meta">
            <span><i class="ti ti-target"></i> ${o(i.phase)}</span>
            <span><i class="ti ti-users"></i> ${i.enrollment.toLocaleString()} participants</span>
            <span><i class="ti ti-map-pin"></i> ${i.sites} site${i.sites===1?"":"s"}</span>
          </div>
          <div class="ask-trial-conds">${i.conditions.map(p=>`<span class="ask-trial-cond">${o(p)}</span>`).join("")}</div>
        </a>`).join("")}
      <p class="ask-trial-note">Eligibility shown is a summary. Full inclusion and exclusion criteria are on ClinicalTrials.gov — open a study to review them before referring a patient.</p>
    </div>`:"",t=(e.pipeline||[]).length?`
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-git-branch"></i> R&amp;D pipeline (${e.pipeline.length})</div>
      ${e.pipeline.map(i=>`
        <div class="ask-pipe">
          <div class="ask-pipe-top">
            <span class="ask-pipe-name">${o(i.name)}</span>
            ${x(i)?`<span class="ask-pipe-ta">${o(x(i))}</span>`:""}
          </div>
          <div class="ask-pipe-ind">${o(i.indication)}</div>
          <div class="ask-pipe-mech">${o(i.desc)}</div>
        </div>`).join("")}
      <p class="ask-trial-note">Investigational unless stated otherwise. Development phase is not shown here — check the
        <a href="https://www.sanofi.com/en/our-science/our-pipeline" target="_blank" rel="noopener">Sanofi pipeline page</a>
        for current phase and status before citing any of this.</p>
    </div>`:"",n=(e.resources||[]).length?`
    <div class="ask-section">
      <div class="ask-section-label"><i class="ti ti-books"></i> Learning resources</div>
      ${e.resources.map(i=>`
        <a class="ask-resource" href="${o(i.url)}" target="_blank" rel="noopener">
          <div class="ask-resource-icon"><i class="ti ti-${X[i.contentType]||"file-text"}"></i></div>
          <div>
            <div class="ask-resource-title">${o(i.title)}</div>
            <div class="ask-resource-meta"><span class="ask-resource-type">${o(i.contentType)}</span> · ${o(i.program)}${i.duration?` · ${o(i.duration)}`:""}</div>
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
      <div class="ask-answer-body rendered">${J(e.answer.answer)}</div>
      ${s}
    </div>`;else if(e.answerMode==="action"&&e.agents.length){const i=e.agents[0];l=`
    <div class="ask-answer-card">
      <div class="ask-answer-head">
        <div class="ask-answer-icon"><i class="ti ti-${o(i.icon)}"></i></div>
        <div>
          <div class="ask-answer-title">${o(i.name)} handles this</div>
          <div class="ask-answer-sub">This is a lookup rather than an evidence question — the agent gives you the live answer</div>
        </div>
      </div>
      <div class="ask-answer-body">
        <p>${o(i.blurb)}.</p>
        <p style="margin-top:10px;"><a class="ask-action-btn" href="${o(C(i,v))}"><i class="ti ti-arrow-right"></i> Open ${o(i.name)}</a></p>
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
    </div>`;let r=null;if(e.answerMode==="evidence"&&e.answer.signal)r=e.answer.signal;else if(e.agents.length){const i=e.agents[0];r={topic:v,intent:`${i.name} request`,diseaseArea:((m=e.answer.signal)==null?void 0:m.diseaseArea)||"General",orionAction:`Routed to ${i.name}. Logged as an HCP-initiated ${i.name.toLowerCase()} request.`}}const d=r?`
    <div class="ask-signal">
      <div class="ask-signal-head"><span class="ask-signal-dot"></span> Interaction signal generated</div>
      <div class="ask-signal-row"><span>Topic</span><strong>${o(r.topic)}</strong></div>
      <div class="ask-signal-row"><span>Intent</span><strong>${o(r.intent)}</strong></div>
      <div class="ask-signal-row"><span>Disease area</span><strong>${o(r.diseaseArea)}</strong></div>
      <div class="ask-signal-action"><i class="ti ti-arrow-right"></i> ${o(r.orionAction)}</div>
    </div>`:"";k.innerHTML=`
    <div class="ask-layout">
      <div class="ask-main">
        ${l}
        ${c}
        ${t}
        ${n}
      </div>
      <div class="ask-side">
        <div class="ask-section">
          <div class="ask-section-label"><i class="ti ti-route"></i> ${e.unmatched?"Suggested agent":`Agents invoked (${e.agents.length})`}</div>
          ${a||'<div class="ask-empty-small">No specific agent matched — try rephrasing.</div>'}
        </div>
        ${d}
      </div>
    </div>`}ee();_();
