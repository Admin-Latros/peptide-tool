import { useState, useEffect } from "react";

const T = {
  bg: "#07080a", surface: "#0d0f12", card: "#111418", border: "#1c2028",
  borderBright: "#2a3040", blue: "#4d9fff", blueDim: "#1a3a6a",
  blueGlow: "rgba(77,159,255,0.08)", green: "#3dd68c", gold: "#f0a500",
  red: "#ff5c5c", purple: "#a78bfa", pink: "#f472b6", orange: "#fb923c",
  text: "#dde2ec", dim: "#6b7590", faint: "#2a3040",
  mono: "'Courier New', monospace", sans: "system-ui, sans-serif",
};

const CAT_COLORS = {
  "GLP-1": T.blue, "GH Axis": T.green, "Recovery": T.orange,
  "Cognitive": T.purple, "Longevity": T.gold, "Skin": T.pink,
  "Sexual Health": T.red, "Metabolic": T.green, "Other": T.dim,
};

const COMPOUNDS = [
  // GLP-1
  { id:"sm5", name:"Semaglutide 5mg", vialMg:5, cat:"GLP-1", doses:[0.25,0.5,1,1.5,2], freq:"weekly", weeks:12, reconVol:1, notes:"Start 0.25mg weekly x4 weeks, then 0.5mg x4, titrate to 1-2mg. Inject SubQ abdomen or thigh.", storage:"Refrigerate 2-8°C. Use within 28 days of reconstitution." },
  { id:"sm10", name:"Semaglutide 10mg", vialMg:10, cat:"GLP-1", doses:[0.25,0.5,1,1.5,2], freq:"weekly", weeks:12, reconVol:2, notes:"Same titration as SM5. Higher concentration vial.", storage:"Refrigerate 2-8°C. Use within 28 days." },
  { id:"sm20", name:"Semaglutide 20mg", vialMg:20, cat:"GLP-1", doses:[0.5,1,1.5,2,2.4], freq:"weekly", weeks:16, reconVol:2, notes:"Extended research supply. 2mg maintenance typical.", storage:"Refrigerate 2-8°C." },
  { id:"tz10", name:"Tirzepatide 10mg", vialMg:10, cat:"GLP-1", doses:[2.5,5,7.5,10], freq:"weekly", weeks:12, reconVol:2, notes:"Dual GIP/GLP-1 agonist. Start 2.5mg weekly x4, increase by 2.5mg every 4 weeks to 10mg.", storage:"Refrigerate 2-8°C. Use within 28 days." },
  { id:"tz20", name:"Tirzepatide 20mg", vialMg:20, cat:"GLP-1", doses:[2.5,5,7.5,10,15], freq:"weekly", weeks:12, reconVol:2, notes:"Higher dose vial. Same titration protocol.", storage:"Refrigerate 2-8°C." },
  { id:"rt20", name:"Retatrutide 20mg", vialMg:20, cat:"GLP-1", doses:[0.5,1,2,4,6,8], freq:"weekly", weeks:12, reconVol:2, notes:"Triple agonist GLP-1/GIP/Glucagon. Start 0.5-1mg weekly, titrate slowly. Monitor GI effects.", storage:"Refrigerate 2-8°C." },
  { id:"rt30", name:"Retatrutide 30mg", vialMg:30, cat:"GLP-1", doses:[0.5,1,2,4,6,8], freq:"weekly", weeks:12, reconVol:2, notes:"Same as RT20 protocol.", storage:"Refrigerate 2-8°C." },
  { id:"rt40", name:"Retatrutide 40mg", vialMg:40, cat:"GLP-1", doses:[1,2,4,6,8,10], freq:"weekly", weeks:16, reconVol:2, notes:"Extended cycle supply.", storage:"Refrigerate 2-8°C." },
  { id:"rt50", name:"Retatrutide 50mg", vialMg:50, cat:"GLP-1", doses:[1,2,4,6,8,10], freq:"weekly", weeks:16, reconVol:2, notes:"High concentration. Extended research.", storage:"Refrigerate 2-8°C." },
  { id:"rt60", name:"Retatrutide 60mg", vialMg:60, cat:"GLP-1", doses:[2,4,6,8,10,12], freq:"weekly", weeks:20, reconVol:2, notes:"Maximum supply vial.", storage:"Refrigerate 2-8°C." },
  { id:"cgl5", name:"Cagrilintide 5mg", vialMg:5, cat:"GLP-1", doses:[0.16,0.3,0.6,1.2,2.4], freq:"weekly", weeks:12, reconVol:1, notes:"Amylin analogue. Often combined with semaglutide. Start 0.16mg weekly.", storage:"Refrigerate 2-8°C." },
  { id:"maz10", name:"Mazdutide 10mg", vialMg:10, cat:"GLP-1", doses:[3,4.5,6,9], freq:"weekly", weeks:12, reconVol:2, notes:"GLP-1/Glucagon dual agonist. 3mg weekly starting dose.", storage:"Refrigerate 2-8°C." },
  { id:"sur10", name:"Survodutide 10mg", vialMg:10, cat:"GLP-1", doses:[0.3,0.6,1.2,2.4,3.6], freq:"weekly", weeks:12, reconVol:2, notes:"GLP-1/Glucagon dual agonist.", storage:"Refrigerate 2-8°C." },
  { id:"aod5", name:"AOD9604 5mg", vialMg:5, cat:"GLP-1", doses:[0.3,0.5,1], freq:"daily", weeks:12, reconVol:2, notes:"GH fragment. 0.3-0.5mg daily SubQ. Often taken fasted in the morning.", storage:"Refrigerate after reconstitution." },

  // GH Axis
  { id:"cnd5", name:"CJC No DAC 5mg", vialMg:5, cat:"GH Axis", doses:[0.1,0.2,0.3], freq:"daily", weeks:12, reconVol:2, notes:"100mcg SubQ before bed. Often combined with Ipamorelin 2:1 ratio. Stimulates natural GH pulse.", storage:"Refrigerate 2-8°C." },
  { id:"cnd10", name:"CJC No DAC 10mg", vialMg:10, cat:"GH Axis", doses:[0.1,0.2,0.3], freq:"daily", weeks:16, reconVol:2, notes:"Same protocol as CND5.", storage:"Refrigerate 2-8°C." },
  { id:"cd5", name:"CJC-1295 DAC 5mg", vialMg:5, cat:"GH Axis", doses:[0.5,1,2], freq:"weekly", weeks:12, reconVol:1, notes:"Long acting GHRH. 1-2mg twice weekly SubQ. Causes blunted GH pulse, less ideal than No DAC for natural rhythms.", storage:"Refrigerate 2-8°C." },
  { id:"ip5", name:"Ipamorelin 5mg", vialMg:5, cat:"GH Axis", doses:[0.1,0.2,0.3,0.5], freq:"daily", weeks:12, reconVol:2, notes:"GHRP. 200-300mcg before bed or 3x daily. Clean GH release with minimal cortisol/prolactin.", storage:"Refrigerate 2-8°C." },
  { id:"ip10", name:"Ipamorelin 10mg", vialMg:10, cat:"GH Axis", doses:[0.1,0.2,0.3,0.5], freq:"daily", weeks:16, reconVol:2, notes:"Same as IP5.", storage:"Refrigerate 2-8°C." },
  { id:"cp10", name:"CJC No DAC + Ipa 10mg", vialMg:10, cat:"GH Axis", doses:[0.1,0.2,0.3], freq:"daily", weeks:12, reconVol:2, notes:"Pre-blended stack. 100-300mcg SubQ before bed. Gold standard GH secretagogue combination.", storage:"Refrigerate 2-8°C." },
  { id:"g25", name:"GHRP-2 5mg", vialMg:5, cat:"GH Axis", doses:[0.1,0.2,0.3], freq:"3x_week", weeks:12, reconVol:1, notes:"Potent GH secretagogue. 100-300mcg SubQ. Increases cortisol and prolactin more than Ipa. Take fasted.", storage:"Refrigerate 2-8°C." },
  { id:"g210", name:"GHRP-2 10mg", vialMg:10, cat:"GH Axis", doses:[0.1,0.2,0.3], freq:"3x_week", weeks:16, reconVol:2, notes:"Same as G25.", storage:"Refrigerate 2-8°C." },
  { id:"smo5", name:"Sermorelin 5mg", vialMg:5, cat:"GH Axis", doses:[0.1,0.2,0.3], freq:"daily", weeks:12, reconVol:1, notes:"GHRH analogue. 0.2-0.3mg SubQ before bed. Gentle GH stimulation. Good for anti-aging protocols.", storage:"Refrigerate 2-8°C." },
  { id:"smo10", name:"Sermorelin 10mg", vialMg:10, cat:"GH Axis", doses:[0.1,0.2,0.3], freq:"daily", weeks:16, reconVol:2, notes:"Same as SMO5.", storage:"Refrigerate 2-8°C." },
  { id:"tesa5", name:"Tesamorelin 5mg", vialMg:5, cat:"GH Axis", doses:[1,2], freq:"daily", weeks:12, reconVol:2, notes:"FDA-approved GHRH analog. 1-2mg SubQ daily. Targets visceral adipose tissue. Morning administration ideal.", storage:"Refrigerate 2-8°C." },
  { id:"tesa10", name:"Tesamorelin 10mg", vialMg:10, cat:"GH Axis", doses:[1,2], freq:"daily", weeks:16, reconVol:2, notes:"Same as TESA5.", storage:"Refrigerate 2-8°C." },
  { id:"ig1", name:"IGF-1 LR3 1mg", vialMg:1, cat:"GH Axis", doses:[0.02,0.04,0.06,0.1], freq:"daily", weeks:4, reconVol:1, notes:"20-100mcg SubQ or IM post-workout. 4-week cycles with 4-week breaks. Potent anabolic effects in research.", storage:"Refrigerate. Use within 3 weeks of reconstitution." },
  { id:"ig01", name:"IGF-1 LR3 0.1mg", vialMg:0.1, cat:"GH Axis", doses:[0.02,0.04,0.06], freq:"daily", weeks:4, reconVol:1, notes:"Micro dose vial. Same protocol as IG1.", storage:"Refrigerate 2-8°C." },
  { id:"igd", name:"IGF-DES 1mg", vialMg:1, cat:"GH Axis", doses:[0.05,0.1,0.15], freq:"daily", weeks:4, reconVol:1, notes:"Short-acting IGF variant. Site-specific injection post-workout. 50-150mcg local injection.", storage:"Refrigerate 2-8°C." },
  { id:"fmp2", name:"PEG-MGF 2mg", vialMg:2, cat:"GH Axis", doses:[0.1,0.2,0.3], freq:"3x_week", weeks:8, reconVol:1, notes:"PEGylated MGF. 200mcg post-workout site specific injection. Muscle repair and growth factor.", storage:"Refrigerate 2-8°C." },

  // Recovery
  { id:"bc5", name:"BPC-157 5mg", vialMg:5, cat:"Recovery", doses:[0.25,0.5,1], freq:"daily", weeks:8, reconVol:2, notes:"250-500mcg SubQ near injury site 1-2x daily. Systemic or local injection both studied. Oral dosing also researched.", storage:"Refrigerate 2-8°C. Stable up to 4 weeks reconstituted." },
  { id:"bc10", name:"BPC-157 10mg", vialMg:10, cat:"Recovery", doses:[0.25,0.5,1], freq:"daily", weeks:12, reconVol:2, notes:"Same as BC5.", storage:"Refrigerate 2-8°C." },
  { id:"tb5", name:"TB-500 5mg", vialMg:5, cat:"Recovery", doses:[2.5,5], freq:"weekly", weeks:6, reconVol:2, notes:"2.5-5mg SubQ weekly for 4-6 weeks loading phase, then monthly maintenance. Systemic healing peptide.", storage:"Refrigerate 2-8°C." },
  { id:"tb10", name:"TB-500 10mg", vialMg:10, cat:"Recovery", doses:[2.5,5], freq:"weekly", weeks:8, reconVol:2, notes:"Same as TB5. Higher dose vial.", storage:"Refrigerate 2-8°C." },
  { id:"bb10", name:"BPC-157/TB-500 Blend 10mg", vialMg:10, cat:"Recovery", doses:[0.5,1,2], freq:"daily", weeks:8, reconVol:2, notes:"BPC 5mg + TB 5mg blend. 0.5-1mg daily SubQ. Synergistic healing combination.", storage:"Refrigerate 2-8°C." },
  { id:"bb20", name:"BPC-157/TB-500 Blend 20mg", vialMg:20, cat:"Recovery", doses:[0.5,1,2], freq:"daily", weeks:12, reconVol:2, notes:"Extended supply blend.", storage:"Refrigerate 2-8°C." },
  { id:"kpv5", name:"KPV 5mg", vialMg:5, cat:"Recovery", doses:[0.5,1,2], freq:"daily", weeks:8, reconVol:2, notes:"Anti-inflammatory tripeptide. 0.5-2mg daily SubQ. Oral or topical also researched for GI inflammation.", storage:"Refrigerate 2-8°C." },
  { id:"kpv10", name:"KPV 10mg", vialMg:10, cat:"Recovery", doses:[0.5,1,2], freq:"daily", weeks:12, reconVol:2, notes:"Same as KPV5.", storage:"Refrigerate 2-8°C." },
  { id:"375", name:"LL-37 5mg", vialMg:5, cat:"Recovery", doses:[0.5,1,2], freq:"daily", weeks:4, reconVol:1, notes:"Antimicrobial peptide. 1-2mg daily. Immune modulation and wound healing research.", storage:"Refrigerate 2-8°C." },
  { id:"ra10", name:"Ara-290 10mg", vialMg:10, cat:"Recovery", doses:[4], freq:"daily", weeks:8, reconVol:2, notes:"Erythropoietin analogue for nerve repair. 4mg daily SubQ. Neuroprotective research.", storage:"Refrigerate 2-8°C." },

  // Cognitive
  { id:"xa5", name:"Semax 5mg", vialMg:5, cat:"Cognitive", doses:[0.25,0.5,1], freq:"daily", weeks:4, reconVol:2, notes:"0.25-0.5mg intranasal or SubQ 1-3x daily. Cycle 2 weeks on, 2 weeks off. Nootropic and neuroprotective.", storage:"Refrigerate 2-8°C. Intranasal solution standard." },
  { id:"xa10", name:"Semax 10mg", vialMg:10, cat:"Cognitive", doses:[0.25,0.5,1], freq:"daily", weeks:6, reconVol:2, notes:"Same as XA5.", storage:"Refrigerate 2-8°C." },
  { id:"sk5", name:"Selank 5mg", vialMg:5, cat:"Cognitive", doses:[0.25,0.5], freq:"daily", weeks:4, reconVol:2, notes:"250-500mcg intranasal 2-3x daily. Anxiolytic and nootropic. Cycle 2 weeks on, 2 weeks off.", storage:"Refrigerate 2-8°C." },
  { id:"sk10", name:"Selank 10mg", vialMg:10, cat:"Cognitive", doses:[0.25,0.5], freq:"daily", weeks:6, reconVol:2, notes:"Same as SK5.", storage:"Refrigerate 2-8°C." },
  { id:"ds5", name:"DSIP 5mg", vialMg:5, cat:"Cognitive", doses:[0.5,1,2], freq:"daily", weeks:4, reconVol:2, notes:"Delta sleep inducing peptide. 0.5-2mg SubQ before bed. Short 2-4 week cycles recommended.", storage:"Refrigerate 2-8°C." },
  { id:"ds15", name:"DSIP 15mg", vialMg:15, cat:"Cognitive", doses:[0.5,1,2], freq:"daily", weeks:8, reconVol:2, notes:"Extended supply. Same protocol as DS5.", storage:"Refrigerate 2-8°C." },
  { id:"pi5", name:"Pinealon 5mg", vialMg:5, cat:"Cognitive", doses:[0.5,1], freq:"daily", weeks:4, reconVol:1, notes:"Tripeptide. 0.5-1mg daily intranasal or SubQ. Circadian rhythm and cognitive research.", storage:"Refrigerate 2-8°C." },
  { id:"pi10", name:"Pinealon 10mg", vialMg:10, cat:"Cognitive", doses:[0.5,1], freq:"daily", weeks:6, reconVol:2, notes:"Same as PI5.", storage:"Refrigerate 2-8°C." },
  { id:"cbl60", name:"Cerebrolysin 60mg", vialMg:60, cat:"Cognitive", doses:[5,10,20], freq:"daily", weeks:4, reconVol:2, notes:"5-20mg IM daily for 5 days on 2 days off. Neuropeptide mixture for cognitive enhancement and neuroprotection.", storage:"Refrigerate 2-8°C." },
  { id:"2s10", name:"SS-31 10mg", vialMg:10, cat:"Cognitive", doses:[1,2,5], freq:"daily", weeks:8, reconVol:2, notes:"Mitochondria-targeted antioxidant. 1-5mg SubQ daily. Powerful mitochondrial protection research.", storage:"Refrigerate 2-8°C." },
  { id:"2s50", name:"SS-31 50mg", vialMg:50, cat:"Cognitive", doses:[1,2,5], freq:"daily", weeks:12, reconVol:2, notes:"Same as 2S10.", storage:"Refrigerate 2-8°C." },

  // Longevity
  { id:"nj500", name:"NAD+ 500mg", vialMg:500, cat:"Longevity", doses:[100,250,500], freq:"daily", weeks:4, reconVol:5, notes:"100-500mg SubQ or IV daily. Start low due to flushing. Split dosing helps. 4-8 week cycles.", storage:"Room temp lyophilized. Refrigerate after reconstitution. Use within 24-48hrs." },
  { id:"nj1000", name:"NAD+ 1000mg", vialMg:1000, cat:"Longevity", doses:[100,250,500], freq:"daily", weeks:8, reconVol:5, notes:"Same as NJ500. Extended supply.", storage:"Room temp lyophilized. Refrigerate after reconstitution." },
  { id:"et10", name:"Epithalon 10mg", vialMg:10, cat:"Longevity", doses:[5,10], freq:"daily", weeks:2, reconVol:2, notes:"Telomerase activator. 5-10mg daily SubQ for 10-20 days. 1-2 cycles per year typical research protocol.", storage:"Refrigerate 2-8°C." },
  { id:"et50", name:"Epithalon 50mg", vialMg:50, cat:"Longevity", doses:[5,10], freq:"daily", weeks:4, reconVol:2, notes:"Extended supply. Same protocol.", storage:"Refrigerate 2-8°C." },
  { id:"ms10", name:"MOTS-C 10mg", vialMg:10, cat:"Longevity", doses:[5,10,15], freq:"3x_week", weeks:8, reconVol:2, notes:"Mitochondrial derived peptide. 5-15mg SubQ 3x weekly. Exercise and metabolic enhancement research.", storage:"Refrigerate 2-8°C." },
  { id:"ms40", name:"MOTS-C 40mg", vialMg:40, cat:"Longevity", doses:[5,10,15,20], freq:"3x_week", weeks:12, reconVol:2, notes:"Same as MS10.", storage:"Refrigerate 2-8°C." },
  { id:"5am", name:"5-Amino-1MQ 5mg", vialMg:5, cat:"Longevity", doses:[0.5,1,2], freq:"daily", weeks:8, reconVol:1, notes:"NNMT inhibitor. Metabolic enhancement. 0.5-2mg daily.", storage:"Refrigerate 2-8°C." },
  { id:"50am", name:"5-Amino-1MQ 50mg", vialMg:50, cat:"Longevity", doses:[0.5,1,2,5], freq:"daily", weeks:12, reconVol:2, notes:"Same as 5AM.", storage:"Refrigerate 2-8°C." },
  { id:"ty10", name:"Thymalin 10mg", vialMg:10, cat:"Longevity", doses:[5,10], freq:"daily", weeks:2, reconVol:2, notes:"Thymus peptide. 5-10mg daily for 10 days. Immune modulation and longevity research.", storage:"Refrigerate 2-8°C." },
  { id:"fn1", name:"Follistatin 1mg", vialMg:1, cat:"Longevity", doses:[0.05,0.1], freq:"daily", weeks:4, reconVol:1, notes:"Myostatin inhibitor. 50-100mcg daily SubQ. Muscle growth and satellite cell activation research.", storage:"Refrigerate 2-8°C. Very sensitive." },
  { id:"ae1", name:"ACE-031 1mg", vialMg:1, cat:"Longevity", doses:[0.05,0.1], freq:"weekly", weeks:8, reconVol:1, notes:"Myostatin inhibitor receptor. 50-100mcg weekly. Powerful muscle building research compound.", storage:"Refrigerate 2-8°C." },
  { id:"slu332", name:"SLU-PP-332 5mg", vialMg:5, cat:"Longevity", doses:[0.5,1,2], freq:"daily", weeks:8, reconVol:2, notes:"ERR agonist. Exercise mimetic. 0.5-2mg daily. Research shows enhanced endurance and metabolic function.", storage:"Refrigerate 2-8°C." },
  { id:"ta5", name:"Thymosin Alpha-1 5mg", vialMg:5, cat:"Longevity", doses:[1.6], freq:"weekly", weeks:6, reconVol:1, notes:"Immune modulator. 1.6mg SubQ 2x weekly for 6 weeks. Used in immune support research.", storage:"Refrigerate 2-8°C." },
  { id:"ta10", name:"Thymosin Alpha-1 10mg", vialMg:10, cat:"Longevity", doses:[1.6], freq:"weekly", weeks:12, reconVol:2, notes:"Same as TA5.", storage:"Refrigerate 2-8°C." },

  // Skin
  { id:"bbg70", name:"GLOW Stack 70mg", vialMg:70, cat:"Skin", doses:[1,2,3], freq:"daily", weeks:8, reconVol:2, notes:"BPC-157 10mg + GHK-Cu 50mg + TB-500 10mg. 1-3mg daily SubQ. Comprehensive skin and tissue repair blend.", storage:"Refrigerate 2-8°C." },
  { id:"bbgk", name:"KLOW Stack 80mg", vialMg:80, cat:"Skin", doses:[1,2,3], freq:"daily", weeks:8, reconVol:2, notes:"BPC-157 10mg + GHK-Cu 50mg + TB-500 10mg + KPV 10mg. 1-3mg daily. Recovery and skin healing blend.", storage:"Refrigerate 2-8°C." },
  { id:"cu50", name:"GHK-Cu 50mg", vialMg:50, cat:"Skin", doses:[2,5,10], freq:"daily", weeks:8, reconVol:2, notes:"Copper peptide. 2-10mg daily SubQ or topical. Collagen synthesis, skin regeneration, anti-aging research.", storage:"Refrigerate 2-8°C." },
  { id:"cu100", name:"GHK-Cu 100mg", vialMg:100, cat:"Skin", doses:[2,5,10], freq:"daily", weeks:12, reconVol:2, notes:"Same as CU50.", storage:"Refrigerate 2-8°C." },
  { id:"gtt", name:"Glutathione 1500mg", vialMg:1500, cat:"Skin", doses:[200,400,600,1000], freq:"weekly", weeks:8, reconVol:10, notes:"Master antioxidant. 200-1000mg IV or SubQ weekly. Skin lightening, detoxification, antioxidant research.", storage:"Refrigerate after reconstitution. Use within 24hrs." },
  { id:"ml10", name:"Melanotan II 10mg", vialMg:10, cat:"Skin", doses:[0.25,0.5,1], freq:"daily", weeks:4, reconVol:2, notes:"0.25mg loading dose, increase to 0.5-1mg daily. Tan maintained with 0.5mg 2-3x weekly.", storage:"Refrigerate 2-8°C." },
  { id:"mt1", name:"Melanotan I 10mg", vialMg:10, cat:"Skin", doses:[0.25,0.5,1], freq:"daily", weeks:6, reconVol:2, notes:"Longer acting than MT-2. 0.25-0.5mg daily SubQ. Less sexual side effects than MT-2.", storage:"Refrigerate 2-8°C." },

  // Sexual Health
  { id:"p41", name:"PT-141 10mg", vialMg:10, cat:"Sexual Health", doses:[0.5,1,2], freq:"as_needed", weeks:8, reconVol:2, notes:"Bremelanotide. 0.5-2mg SubQ 45-60 min before activity. Start low. Nausea possible at higher doses.", storage:"Refrigerate 2-8°C." },
  { id:"ks5", name:"Kisspeptin-10 5mg", vialMg:5, cat:"Sexual Health", doses:[0.5,1,2], freq:"daily", weeks:4, reconVol:1, notes:"0.5-2mg SubQ daily. LH/FSH stimulator. Testosterone and fertility research.", storage:"Refrigerate 2-8°C." },
  { id:"ks10", name:"Kisspeptin-10 10mg", vialMg:10, cat:"Sexual Health", doses:[0.5,1,2], freq:"daily", weeks:6, reconVol:2, notes:"Same as KS5.", storage:"Refrigerate 2-8°C." },
  { id:"ot2", name:"Oxytocin 2mg", vialMg:2, cat:"Sexual Health", doses:[0.5,1,2], freq:"as_needed", weeks:4, reconVol:2, notes:"0.5-2mg SubQ or intranasal. Social bonding, intimacy, and trust research. Intranasal delivery common.", storage:"Refrigerate 2-8°C." },
  { id:"hmg75", name:"HMG 75 IU", vialMg:75, cat:"Sexual Health", doses:[75], freq:"3x_week", weeks:12, reconVol:1, notes:"Human menopausal gonadotropin. 75 IU IM or SubQ 3x weekly. FSH/LH activity for fertility research.", storage:"Refrigerate 2-8°C." },
  { id:"hcg5k", name:"HCG 5000 IU", vialMg:5000, cat:"Sexual Health", doses:[500,1000,2000], freq:"weekly", weeks:8, reconVol:5, notes:"500-2000 IU SubQ or IM 2-3x weekly. LH mimetic. Testosterone and fertility research.", storage:"Refrigerate after reconstitution. Use within 30 days." },
  { id:"hcg10k", name:"HCG 10000 IU", vialMg:10000, cat:"Sexual Health", doses:[500,1000,2000,5000], freq:"weekly", weeks:12, reconVol:5, notes:"Same as HCG5K.", storage:"Refrigerate after reconstitution." },
  { id:"dr5", name:"Dermorphin 5mg", vialMg:5, cat:"Sexual Health", doses:[0.1,0.2,0.5], freq:"as_needed", weeks:4, reconVol:1, notes:"Opioid peptide from frog skin. 100-500mcg. Pain research and analgesic studies.", storage:"Refrigerate 2-8°C." },

  // Other
  { id:"epo140", name:"EPO 3000 IU", vialMg:3000, cat:"Other", doses:[1000,2000,3000], freq:"3x_week", weeks:8, reconVol:1, notes:"Erythropoietin. 1000-3000 IU SubQ 3x weekly. Red blood cell production and endurance research.", storage:"Refrigerate 2-8°C. Do not freeze." },
  { id:"pc10", name:"PNC-27 10mg", vialMg:10, cat:"Other", doses:[1,2,5], freq:"daily", weeks:4, reconVol:2, notes:"Cancer research peptide. Selective cancer cell membrane disruption studies. 1-5mg daily.", storage:"Refrigerate 2-8°C." },
  { id:"ap5", name:"Adipotide 5mg", vialMg:5, cat:"Other", doses:[0.5,1], freq:"daily", weeks:4, reconVol:1, notes:"Proapoptotic peptide targeting vasculature of white adipose tissue. 0.5-1mg daily SubQ.", storage:"Refrigerate 2-8°C." },
  { id:"gkp70", name:"GKP Blend 70mg", vialMg:70, cat:"Other", doses:[1,2,3], freq:"daily", weeks:8, reconVol:2, notes:"GHK-Cu + KPV + BPC-157 blend. Anti-inflammatory and regenerative combination.", storage:"Refrigerate 2-8°C." },
  { id:"hhb", name:"Hair/Skin/Nails Blend", vialMg:150, cat:"Other", doses:[1,2,3], freq:"daily", weeks:12, reconVol:5, notes:"Niacinamide, Biotin, B vitamins blend in 10ml vial. IV or SubQ. Cosmetic peptide research blend.", storage:"Refrigerate 2-8°C." },
  { id:"lc500", name:"L-Carnitine 500mg", vialMg:500, cat:"Other", doses:[500,1000,2000], freq:"daily", weeks:8, reconVol:5, notes:"500-2000mg IV or SubQ daily. Fatty acid metabolism and exercise performance research.", storage:"Room temp. Refrigerate after opening." },
  { id:"b12", name:"B12 10mg", vialMg:10, cat:"Other", doses:[1,5,10], freq:"weekly", weeks:8, reconVol:2, notes:"1-10mg IM or SubQ weekly. Energy and neurological function research.", storage:"Refrigerate away from light." },
  { id:"aicar50", name:"AICAR 50mg", vialMg:50, cat:"Other", doses:[10,20,50], freq:"daily", weeks:4, reconVol:2, notes:"AMPK activator. 10-50mg daily SubQ. Exercise mimetic and metabolic research.", storage:"Refrigerate 2-8°C." },
  { id:"np810", name:"Snap-8 10mg", vialMg:10, cat:"Other", doses:[1,2,5], freq:"daily", weeks:8, reconVol:2, notes:"Botox alternative peptide. Topical or SubQ. Facial muscle relaxation research.", storage:"Refrigerate 2-8°C." },
];

const FREQ_LABEL = { daily:"Daily", weekly:"Weekly", "3x_week":"3x / Week", as_needed:"As Needed" };
const FREQ_DPW = { daily:7, weekly:1, "3x_week":3, as_needed:1 };

const PROTOCOLS = [
  { id:"fat_loss", name:"Fat Loss Protocol", icon:"🔥", desc:"GLP-1 based comprehensive fat loss research stack", compounds:[
    { id:"tz10", dose:5, freq:"weekly", weeks:12, notes:"Core GLP-1 compound. Titrate from 2.5mg." },
    { id:"tesa10", dose:2, freq:"daily", weeks:12, notes:"Visceral fat targeting." },
    { id:"ms40", dose:10, freq:"3x_week", weeks:12, notes:"Metabolic enhancement." },
    { id:"aod5", dose:0.5, freq:"daily", weeks:12, notes:"GH fragment for fat metabolism." },
  ]},
  { id:"recovery", name:"Recovery Protocol", icon:"⚡", desc:"Comprehensive tissue repair and injury recovery", compounds:[
    { id:"bb10", dose:1, freq:"daily", weeks:8, notes:"Core healing blend." },
    { id:"cu100", dose:5, freq:"daily", weeks:8, notes:"Collagen and tissue repair." },
    { id:"ta10", dose:1.6, freq:"weekly", weeks:6, notes:"Immune support." },
    { id:"kpv10", dose:1, freq:"daily", weeks:8, notes:"Anti-inflammatory." },
  ]},
  { id:"antiaging", name:"Anti-Aging Protocol", icon:"⏳", desc:"Longevity and cellular rejuvenation research stack", compounds:[
    { id:"et50", dose:10, freq:"daily", weeks:2, notes:"Telomerase activation cycle." },
    { id:"nj1000", dose:250, freq:"daily", weeks:8, notes:"Cellular energy production." },
    { id:"ms40", dose:10, freq:"3x_week", weeks:8, notes:"Mitochondrial function." },
    { id:"ghkcu100", dose:5, freq:"daily", weeks:8, notes:"Skin and tissue regeneration." },
  ]},
  { id:"cognitive", name:"Cognitive Protocol", icon:"🧠", desc:"Nootropic and neuroprotective peptide combination", compounds:[
    { id:"xa10", dose:0.5, freq:"daily", weeks:4, notes:"Primary nootropic. Intranasal preferred." },
    { id:"sk10", dose:0.5, freq:"daily", weeks:4, notes:"Anxiety reduction and focus." },
    { id:"2s10", dose:2, freq:"daily", weeks:8, notes:"Mitochondrial protection." },
    { id:"nj500", dose:250, freq:"daily", weeks:4, notes:"NAD+ for brain energy." },
  ]},
  { id:"gh_optimization", name:"GH Optimization", icon:"📈", desc:"Natural growth hormone secretagogue protocol", compounds:[
    { id:"cp10", dose:0.2, freq:"daily", weeks:12, notes:"Gold standard GH secretagogue blend. Before bed." },
    { id:"tesa10", dose:1, freq:"daily", weeks:12, notes:"GHRH for GH and fat loss." },
    { id:"ig1", dose:0.05, freq:"daily", weeks:4, notes:"IGF-1 for muscle research. 4 weeks max." },
  ]},
  { id:"skin_beauty", name:"Skin & Beauty Protocol", icon:"✨", desc:"Comprehensive skin rejuvenation research stack", compounds:[
    { id:"bbg70", dose:2, freq:"daily", weeks:8, notes:"Core healing blend." },
    { id:"cu100", dose:5, freq:"daily", weeks:8, notes:"Collagen synthesis." },
    { id:"gtt", dose:400, freq:"weekly", weeks:8, notes:"Antioxidant and brightening." },
    { id:"et50", dose:5, freq:"daily", weeks:2, notes:"Anti-aging cycle." },
  ]},
];

const CATEGORIES = ["All", ...Object.keys(CAT_COLORS)];

const calcVials = (dose, freq, weeks, vialMg) => {
  const dpw = FREQ_DPW[freq] || 1;
  const total = dpw * weeks * dose;
  return { total, vials: Math.ceil(total / vialMg) };
};

const Badge = ({ label, color = T.blue, small }) => (
  <span style={{
    fontSize: small ? 8 : 9, padding: small ? "1px 6px" : "2px 8px", borderRadius: 20,
    background: color + "18", color, border: `1px solid ${color}30`,
    fontFamily: T.mono, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
  }}>{label}</span>
);

const Pill = ({ active, onClick, children, color }) => (
  <button onClick={onClick} style={{
    padding: "5px 13px", fontSize: 11, borderRadius: 20, cursor: "pointer",
    background: active ? (color || T.blue) + "20" : "transparent",
    color: active ? (color || T.blue) : T.dim,
    border: `1px solid ${active ? (color || T.blue) + "50" : T.border}`,
    transition: "all 0.15s", whiteSpace: "nowrap",
  }}>{children}</button>
);

const Inp = ({ value, onChange, placeholder, type = "number", style: s }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
    width: "100%", padding: "8px 12px", background: T.surface,
    border: `1px solid ${T.border}`, borderRadius: 6, color: T.text,
    fontSize: 13, boxSizing: "border-box", fontFamily: T.mono, ...s,
  }} />
);

// ── CALCULATOR ───────────────────────────────────────────────
const Calculator = ({ onSave, BuyCTA }) => {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(null);
  const [dose, setDose] = useState("");
  const [weeks, setWeeks] = useState("");
  const [freq, setFreq] = useState("daily");
  const [bac, setBac] = useState(2);
  const [result, setResult] = useState(null);

  const filtered = COMPOUNDS.filter(c =>
    (cat === "All" || c.cat === cat) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const calc = () => {
    if (!sel || !dose || !weeks) return;
    const d = parseFloat(dose), w = parseInt(weeks);
    const { total, vials } = calcVials(d, freq, w, sel.vialMg);
    const conc = sel.vialMg / bac;
    const vol = d / conc;
    setResult({ total, vials, conc, vol, dose: d, weeks: w, freq, compound: sel });
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Dose Calculator</h2>
        <p style={{ fontSize: 12, color: T.dim }}>Calculate vials needed for any research protocol.</p>
      </div>

      <Inp value={search} onChange={e => setSearch(e.target.value)} placeholder="Search compounds..." type="text" style={{ marginBottom: 12 }} />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {CATEGORIES.map(c => <Pill key={c} active={cat === c} onClick={() => { setCat(c); setSel(null); setResult(null); }} color={CAT_COLORS[c]}>{c}</Pill>)}
      </div>

      <div style={{ maxHeight: 200, overflowY: "auto", border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 20 }}>
        {filtered.map((c, i) => (
          <button key={c.id} onClick={() => { setSel(c); setDose(""); setWeeks(c.weeks.toString()); setFreq(c.freq); setResult(null); }} style={{
            display: "flex", width: "100%", padding: "10px 14px", textAlign: "left",
            background: sel?.id === c.id ? T.blue + "12" : i % 2 === 0 ? T.card : T.surface,
            border: "none", borderBottom: `1px solid ${T.border}`, cursor: "pointer",
            justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: sel?.id === c.id ? T.blue : T.text }}>{c.name}</span>
            <Badge label={c.cat} color={CAT_COLORS[c.cat]} small />
          </button>
        ))}
      </div>

      {sel && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{sel.name}</div>
            <Badge label={sel.cat} color={CAT_COLORS[sel.cat]} />
          </div>

          <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.7, marginBottom: 14, padding: "10px 12px", background: T.blueGlow, borderRadius: 6 }}>{sel.notes}</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, fontFamily: T.mono }}>DOSE (mg)</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                {sel.doses.map(d => <button key={d} onClick={() => setDose(d.toString())} style={{ padding: "3px 9px", fontSize: 11, cursor: "pointer", borderRadius: 4, background: dose === d.toString() ? T.blue + "20" : T.surface, color: dose === d.toString() ? T.blue : T.dim, border: `1px solid ${dose === d.toString() ? T.blue + "50" : T.border}` }}>{d}</button>)}
              </div>
              <Inp value={dose} onChange={e => setDose(e.target.value)} placeholder="Custom dose" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, fontFamily: T.mono }}>FREQUENCY</div>
              {Object.entries(FREQ_LABEL).map(([k, v]) => (
                <button key={k} onClick={() => setFreq(k)} style={{ display: "block", width: "100%", padding: "6px 10px", marginBottom: 3, textAlign: "left", cursor: "pointer", borderRadius: 4, background: freq === k ? T.blue + "15" : T.surface, color: freq === k ? T.blue : T.dim, border: `1px solid ${freq === k ? T.blue + "40" : T.border}`, fontSize: 11 }}>{v}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, fontFamily: T.mono }}>CYCLE WEEKS</div>
              <Inp value={weeks} onChange={e => setWeeks(e.target.value)} placeholder="Weeks" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, fontFamily: T.mono }}>BAC WATER (mL)</div>
              <Inp value={bac} onChange={e => setBac(parseFloat(e.target.value))} placeholder="mL" />
            </div>
          </div>

          <button onClick={calc} style={{ width: "100%", padding: "11px", background: T.blue, color: "#000", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Calculate</button>
        </div>
      )}

      {result && (
        <div style={{ background: T.card, border: `1px solid ${T.green}40`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 10, color: T.green, fontFamily: T.mono, marginBottom: 14, letterSpacing: "0.1em" }}>RESULTS</div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: T.border, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
            {[
              ["Vials Needed", Math.ceil(result.vials), T.blue],
              ["Total mg", result.total.toFixed(1), T.text],
              ["mL per dose", result.vol.toFixed(3), T.gold],
              ["Units (syringe)", Math.round(result.vol * 100), T.gold],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: T.surface, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: T.mono }}>{v}</div>
                <div style={{ fontSize: 8, color: T.dim, marginTop: 2, lineHeight: 1.4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Reconstitution summary */}
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 8 }}>RECONSTITUTION</div>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 2 }}>
              Add <span style={{ color: T.blue, fontWeight: 700 }}>{bac}mL</span> bac water to vial
              → concentration <span style={{ color: T.green, fontWeight: 700 }}>{result.conc.toFixed(2)}mg/mL</span><br />
              Per <span style={{ fontWeight: 700 }}>{result.dose}mg</span> dose draw{" "}
              <span style={{ color: T.gold, fontWeight: 700 }}>{result.vol.toFixed(3)}mL</span>
              {" "}={" "}
              <span style={{ color: T.gold, fontWeight: 700 }}>{Math.round(result.vol * 100)} units</span> on insulin syringe
            </div>
          </div>

          {/* Visual syringe */}
          <div style={{ background: T.surface, borderRadius: 8, padding: 14, marginBottom: 16 }}>
            <SyringeVisual units={Math.round(result.vol * 100)} vol={result.vol.toFixed(3)} />
          </div>

          {/* Visual vials */}
          <div style={{ background: T.surface, borderRadius: 8, padding: 14, marginBottom: 16 }}>
            <VialVisual
              vials={result.vials}
              usedMg={result.dose}
              totalMg={result.total}
              concentration={result.conc.toFixed(2)}
              bacMl={bac}
            />
          </div>

          <button onClick={() => onSave(result)} style={{ width: "100%", padding: "10px", background: "transparent", color: T.green, border: `1px solid ${T.green}50`, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>+ Save Protocol</button>
          {BuyCTA && <BuyCTA compound={result.compound} vials={result.vials} />}
        </div>
      )}
    </div>
  );
};

// ── RECONSTITUTION GUIDE ─────────────────────────────────────
const ReconGuide = () => {
  const [vialMg, setVialMg] = useState("");
  const [bacMl, setBacMl] = useState("");
  const [dose, setDose] = useState("");
  const conc = vialMg && bacMl ? (parseFloat(vialMg) / parseFloat(bacMl)).toFixed(4) : null;
  const units = conc && dose ? ((parseFloat(dose) / parseFloat(conc)) * 1000).toFixed(0) : null;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Reconstitution Guide</h2>
        <p style={{ fontSize: 12, color: T.dim }}>Calculate concentration and draw volume for any vial.</p>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: T.blue, fontFamily: T.mono, marginBottom: 14 }}>RECONSTITUTION CALCULATOR</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, fontFamily: T.mono }}>VIAL SIZE (mg)</div>
            <Inp value={vialMg} onChange={e => setVialMg(e.target.value)} placeholder="e.g. 10" />
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, fontFamily: T.mono }}>BAC WATER (mL)</div>
            <Inp value={bacMl} onChange={e => setBacMl(e.target.value)} placeholder="e.g. 2" />
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 6, fontFamily: T.mono }}>YOUR DOSE (mg)</div>
            <Inp value={dose} onChange={e => setDose(e.target.value)} placeholder="e.g. 0.5" />
          </div>
        </div>
        {conc && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
              <div style={{ background: T.blueGlow, border: `1px solid ${T.blue}30`, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.blue, fontFamily: T.mono }}>{conc}</div>
                <div style={{ fontSize: 9, color: T.dim, marginTop: 4 }}>mg/mL</div>
              </div>
              {units && (<>
                <div style={{ background: T.greenDim, border: `1px solid ${T.green}30`, borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.green, fontFamily: T.mono }}>{units} units</div>
                  <div style={{ fontSize: 9, color: T.dim, marginTop: 4 }}>on syringe</div>
                </div>
                <div style={{ background: T.goldGlow || T.gold + "10", border: `1px solid ${T.gold}30`, borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.gold, fontFamily: T.mono }}>{(parseFloat(units) / 100).toFixed(3)}mL</div>
                  <div style={{ fontSize: 9, color: T.dim, marginTop: 4 }}>volume drawn</div>
                </div>
              </>)}
            </div>
            {units && (
              <div style={{ background: T.surface, borderRadius: 8, padding: 14 }}>
                <SyringeVisual units={parseInt(units)} vol={(parseFloat(units) / 100).toFixed(3)} />
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: T.blue, fontFamily: T.mono, marginBottom: 14 }}>STANDARD RECONSTITUTION REFERENCE</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Vial Size", "Bac Water", "Concentration", "0.1mg dose", "0.25mg dose", "0.5mg dose", "1mg dose"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: T.dim, fontFamily: T.mono, fontSize: 9, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [1, 1, "1mg/mL", "10 units", "25 units", "50 units", "100 units"],
                [2, 1, "2mg/mL", "5 units", "12.5 units", "25 units", "50 units"],
                [5, 1, "5mg/mL", "2 units", "5 units", "10 units", "20 units"],
                [5, 2, "2.5mg/mL", "4 units", "10 units", "20 units", "40 units"],
                [10, 2, "5mg/mL", "2 units", "5 units", "10 units", "20 units"],
                [10, 1, "10mg/mL", "1 unit", "2.5 units", "5 units", "10 units"],
                [15, 2, "7.5mg/mL", "1.3 units", "3.3 units", "6.7 units", "13.3 units"],
                [20, 2, "10mg/mL", "1 unit", "2.5 units", "5 units", "10 units"],
                [30, 2, "15mg/mL", "0.67 units", "1.7 units", "3.3 units", "6.7 units"],
                [40, 2, "20mg/mL", "0.5 units", "1.25 units", "2.5 units", "5 units"],
                [50, 2, "25mg/mL", "0.4 units", "1 unit", "2 units", "4 units"],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? "transparent" : T.surface + "50" }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "8px 10px", color: j === 2 ? T.blue : j > 2 ? T.green : T.text, fontFamily: j >= 2 ? T.mono : T.sans, whiteSpace: "nowrap" }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
        <div style={{ fontSize: 11, color: T.blue, fontFamily: T.mono, marginBottom: 14 }}>STEP BY STEP PROTOCOL</div>
        {[
          ["01", "Gather supplies", "Lyophilized peptide vial, bacteriostatic water, alcohol swabs, insulin syringe (1mL/100 unit)."],
          ["02", "Clean both tops", "Wipe rubber stopper of both peptide vial and bac water vial with alcohol swab. Let dry 30 seconds."],
          ["03", "Draw bac water", "Draw the required mL of bacteriostatic water into your syringe."],
          ["04", "Inject slowly", "Insert needle into peptide vial at an angle. Slowly inject bac water down the side of the glass. Never shoot directly onto the powder — this can degrade the peptide."],
          ["05", "Swirl gently", "Gently swirl or roll the vial between your palms until fully dissolved. Never shake — this damages the peptide structure."],
          ["06", "Inspect the solution", "Solution should be clear and colorless. Slight yellow tint acceptable for some peptides. Discard if cloudy or particulate."],
          ["07", "Label and store", "Label with compound name, date reconstituted, and concentration. Refrigerate at 2-8°C immediately."],
          ["08", "Draw your dose", "Use the concentration you calculated to draw the correct number of units on your insulin syringe."],
          ["09", "Injection site", "Rotate SubQ injection sites: abdomen, thigh, upper arm. Pinch skin, inject at 45° angle, release slowly."],
          ["10", "Dispose safely", "Recap needles safely. Use sharps container. Never reuse needles."],
        ].map(([num, title, desc]) => (
          <div key={num} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 18, color: T.blue + "40", fontFamily: T.mono, flexShrink: 0, width: 28 }}>{num}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.7 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── VISUAL SYRINGE ───────────────────────────────────────────
const SyringeVisual = ({ units, maxUnits = 100, vol }) => {
  const pct = Math.min((units / maxUnits) * 100, 100);
  const marks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  return (
    <div>
      <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 10, letterSpacing: "0.08em" }}>INSULIN SYRINGE (100 units / 1mL)</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Plunger handle */}
        <div style={{ width: 14, height: 10, background: T.dim, borderRadius: 2, flexShrink: 0 }} />
        {/* Plunger rod */}
        <div style={{ position: "relative", flex: 1, height: 32 }}>
          {/* Barrel */}
          <div style={{ position: "absolute", inset: 0, background: T.surface, border: `1px solid ${T.borderBright}`, borderRadius: "0 4px 4px 0", overflow: "hidden" }}>
            {/* Filled amount */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: `linear-gradient(90deg, ${T.blue}60, ${T.blue}40)`, transition: "width 0.4s" }} />
            {/* Target line */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, width: 2, background: T.gold, boxShadow: `0 0 6px ${T.gold}`, transition: "left 0.4s" }} />
            {/* Tick marks */}
            {marks.map(m => (
              <div key={m} style={{ position: "absolute", left: `${m}%`, top: 0, bottom: 0, width: 1, background: m % 20 === 0 ? T.borderBright : T.border + "80" }} />
            ))}
          </div>
          {/* Scale labels */}
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {[0, 25, 50, 75, 100].map(m => (
              <span key={m} style={{ fontSize: 8, color: T.faint, fontFamily: T.mono }}>{m}</span>
            ))}
          </div>
        </div>
        {/* Needle */}
        <div style={{ width: 24, height: 2, background: T.dim, borderRadius: 1, flexShrink: 0 }} />
      </div>
      <div style={{ marginTop: 20, display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: T.gold, fontFamily: T.mono }}>{units}</div>
          <div style={{ fontSize: 9, color: T.dim, marginTop: 2 }}>UNITS on syringe</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: T.blue, fontFamily: T.mono }}>{vol}</div>
          <div style={{ fontSize: 9, color: T.dim, marginTop: 2 }}>mL drawn</div>
        </div>
        <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.8, flex: 1, paddingTop: 4 }}>
          Draw to the <span style={{ color: T.gold, fontWeight: 700 }}>{units} unit mark</span> on your insulin syringe. This equals <span style={{ color: T.blue, fontWeight: 700 }}>{vol}mL</span>.
        </div>
      </div>
    </div>
  );
};

// ── VISUAL VIAL ───────────────────────────────────────────────
const VialVisual = ({ vials, usedMg, totalMg, concentration, bacMl }) => {
  const fullVials = Math.floor(vials);
  const partialPct = ((vials % 1) === 0) ? 100 : ((vials % 1) * 100);
  const dosesPerVial = totalMg > 0 ? Math.floor(totalMg / vials) : 0;

  return (
    <div>
      <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 12, letterSpacing: "0.08em" }}>VIAL VISUALIZATION</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Array.from({ length: Math.min(vials, 10) }).map((_, i) => {
          const isLast = i === Math.min(vials, 10) - 1 && vials <= 10;
          const fillPct = isLast && partialPct < 100 ? partialPct : 100;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {/* Cap */}
              <div style={{ width: 18, height: 6, background: fillPct === 100 ? T.blue : T.gold, borderRadius: "2px 2px 0 0" }} />
              {/* Vial body */}
              <div style={{ width: 24, height: 56, border: `1.5px solid ${T.borderBright}`, borderRadius: 3, overflow: "hidden", background: T.surface, position: "relative" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${fillPct}%`, background: fillPct === 100 ? T.blue + "35" : T.gold + "35", transition: "height 0.4s" }} />
                {/* Line markers */}
                {[25, 50, 75].map(p => (
                  <div key={p} style={{ position: "absolute", left: 0, right: 0, bottom: `${p}%`, height: 1, background: T.border }} />
                ))}
              </div>
              <div style={{ fontSize: 7, color: T.dim, fontFamily: T.mono }}>{i + 1}</div>
            </div>
          );
        })}
        {vials > 10 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, fontSize: 11, color: T.dim }}>+{Math.ceil(vials) - 10}</div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          ["Vials Needed", Math.ceil(vials), T.blue],
          ["Doses Per Vial", Math.round(totalMg / usedMg) || "—", T.green],
          [`${bacMl}mL Bac Water`, `→ ${concentration}mg/mL`, T.gold],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: T.surface, borderRadius: 6, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: T.mono }}>{v}</div>
            <div style={{ fontSize: 9, color: T.dim, marginTop: 3, lineHeight: 1.4 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── PROTOCOLS ────────────────────────────────────────────────
const Protocols = ({ onSave }) => {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(COMPOUNDS[0]);
  const [dose, setDose] = useState("");
  const [bac, setBac] = useState(2);

  const filtered = COMPOUNDS.filter(c =>
    (cat === "All" || c.cat === cat) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const conc = sel && bac ? (sel.vialMg / bac) : 0;
  const doseVal = parseFloat(dose) || (sel?.doses[0] || 0);
  const volMl = conc > 0 ? (doseVal / conc) : 0;
  const units = Math.round(volMl * 100);
  const { vials, total } = sel ? calcVials(doseVal, sel.freq, sel.weeks, sel.vialMg) : { vials: 0, total: 0 };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Individual Protocols</h2>
        <p style={{ fontSize: 12, color: T.dim }}>Select any compound to see its full dosing protocol, reconstitution guide, and visual draw amount.</p>
      </div>

      <Inp value={search} onChange={e => setSearch(e.target.value)} placeholder="Search compounds..." type="text" style={{ marginBottom: 12 }} />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {CATEGORIES.map(c => <Pill key={c} active={cat === c} onClick={() => setCat(c)} color={CAT_COLORS[c]}>{c}</Pill>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16 }}>
        {/* Compound list */}
        <div style={{ maxHeight: 700, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
          {filtered.map(c => (
            <button key={c.id} onClick={() => { setSel(c); setDose(c.doses[0].toString()); }} style={{
              padding: "9px 12px", textAlign: "left", cursor: "pointer", borderRadius: 6,
              background: sel?.id === c.id ? CAT_COLORS[c.cat] + "15" : T.card,
              border: `1px solid ${sel?.id === c.id ? CAT_COLORS[c.cat] + "50" : T.border}`,
              color: sel?.id === c.id ? CAT_COLORS[c.cat] : T.dim,
              fontSize: 11, transition: "all 0.1s",
            }}>{c.name}</button>
          ))}
        </div>

        {/* Protocol detail */}
        {sel && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Header */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{sel.name}</div>
                <Badge label={sel.cat} color={CAT_COLORS[sel.cat]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
                {[
                  ["Vial Size", `${sel.vialMg}mg`],
                  ["Frequency", FREQ_LABEL[sel.freq]],
                  ["Cycle", `${sel.weeks} wks`],
                  ["Recon", `${sel.reconVol}mL`],
                ].map(([l, v]) => (
                  <div key={l} style={{ background: T.surface, borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{v}</div>
                    <div style={{ fontSize: 9, color: T.dim, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.8, padding: "10px 12px", background: T.blueGlow, borderRadius: 6 }}>{sel.notes}</div>
            </div>

            {/* Dose selector */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 10 }}>SELECT DOSE TO VISUALIZE</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {sel.doses.map(d => (
                  <button key={d} onClick={() => setDose(d.toString())} style={{
                    padding: "6px 14px", fontSize: 12, cursor: "pointer", borderRadius: 6,
                    background: dose === d.toString() ? T.blue + "20" : T.surface,
                    color: dose === d.toString() ? T.blue : T.dim,
                    border: `1px solid ${dose === d.toString() ? T.blue + "60" : T.border}`,
                    fontFamily: T.mono,
                  }}>{d}mg</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 6 }}>CUSTOM DOSE (mg)</div>
                  <Inp value={dose} onChange={e => setDose(e.target.value)} placeholder="mg" />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 6 }}>BAC WATER PER VIAL (mL)</div>
                  <Inp value={bac} onChange={e => setBac(parseFloat(e.target.value))} placeholder="2" />
                </div>
              </div>
            </div>

            {/* Visual syringe */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
              <SyringeVisual units={units} vol={volMl.toFixed(3)} />
            </div>

            {/* Visual vials */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
              <VialVisual
                vials={vials}
                usedMg={doseVal}
                totalMg={total}
                concentration={conc.toFixed(2)}
                bacMl={bac}
              />
            </div>

            {/* Storage */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 8 }}>STORAGE</div>
              <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.8 }}>{sel.storage}</div>
            </div>

            {/* Save button */}
            <button onClick={() => onSave({ compound: sel, dose: doseVal, freq: sel.freq, weeks: sel.weeks, vials, total, conc, vol: volMl })} style={{
              width: "100%", padding: "13px", background: T.blue, color: "#000",
              border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
            }}>
              + Save This Protocol to Tracker →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── GUIDE ────────────────────────────────────────────────────
const Guide = () => {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(COMPOUNDS[0]);

  const filtered = COMPOUNDS.filter(c =>
    (cat === "All" || c.cat === cat) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Compound Guide</h2>
        <p style={{ fontSize: 12, color: T.dim }}>{COMPOUNDS.length} compounds. For research purposes only.</p>
      </div>
      <Inp value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." type="text" style={{ marginBottom: 10 }} />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {CATEGORIES.map(c => <Pill key={c} active={cat === c} onClick={() => setCat(c)} color={CAT_COLORS[c]}>{c}</Pill>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 14 }}>
        <div style={{ maxHeight: 600, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
          {filtered.map(c => (
            <button key={c.id} onClick={() => setSel(c)} style={{ padding: "9px 12px", textAlign: "left", cursor: "pointer", borderRadius: 6, background: sel?.id === c.id ? CAT_COLORS[c.cat] + "15" : T.card, border: `1px solid ${sel?.id === c.id ? CAT_COLORS[c.cat] + "50" : T.border}`, color: sel?.id === c.id ? CAT_COLORS[c.cat] : T.dim, fontSize: 11, transition: "all 0.1s" }}>{c.name}</button>
          ))}
        </div>
        {sel && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{sel.name}</div>
              <Badge label={sel.cat} color={CAT_COLORS[sel.cat]} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[["Vial Size", `${sel.vialMg}mg`], ["Frequency", FREQ_LABEL[sel.freq]], ["Cycle Length", `${sel.weeks} weeks`], ["Reconstitution", `${sel.reconVol}mL bac water`]].map(([l, v]) => (
                <div key={l} style={{ background: T.surface, borderRadius: 6, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9, color: T.dim, fontFamily: T.mono, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: T.blueGlow, border: `1px solid ${T.blue}20`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.blue, fontFamily: T.mono, marginBottom: 8 }}>COMMON DOSES</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {sel.doses.map(d => <span key={d} style={{ padding: "3px 10px", background: T.blue + "15", color: T.blue, borderRadius: 4, fontSize: 12, fontFamily: T.mono }}>{d}mg</span>)}
              </div>
            </div>
            <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.dim, fontFamily: T.mono, marginBottom: 8 }}>PROTOCOL NOTES</div>
              <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.8 }}>{sel.notes}</div>
            </div>
            <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.dim, fontFamily: T.mono, marginBottom: 8 }}>STORAGE</div>
              <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.8 }}>{sel.storage}</div>
            </div>
            <div style={{ padding: "10px 12px", background: "#1a0a0a", border: `1px solid ${T.red}20`, borderRadius: 6 }}>
              <div style={{ fontSize: 9, color: T.red, fontFamily: T.mono, marginBottom: 4 }}>DISCLAIMER</div>
              <div style={{ fontSize: 10, color: T.dim, lineHeight: 1.7 }}>For research purposes only. Not for human or animal consumption. Not medical advice. TMPL Research Labs — tmplrlabs.com</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── TRACKER ──────────────────────────────────────────────────
const Tracker = ({ saved, setSaved }) => {
  const [logs, setLogs] = useState({});
  const [sel, setSel] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get("tmpl-logs-v2"); if (r?.value) setLogs(JSON.parse(r.value)); } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const saveLogs = async (nl) => { setLogs(nl); if (loaded) await window.storage.set("tmpl-logs-v2", JSON.stringify(nl)).catch(() => {}); };
  const toggle = (pid, d) => { const k = `${pid}-${d}`; saveLogs({ ...logs, [k]: !logs[k] }); };
  const isLogged = (pid, d) => !!logs[`${pid}-${d}`];

  if (saved.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📋</div>
      <div style={{ fontSize: 14, color: T.dim }}>No protocols saved yet</div>
      <div style={{ fontSize: 12, color: T.faint, marginTop: 4 }}>Use the Calculator tab to create a protocol</div>
    </div>
  );

  const proto = sel || saved[0];
  const start = new Date(proto.startDate);
  const totalDays = proto.weeks * 7;
  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(start); d.setDate(d.getDate() + i);
    const f = proto.frequency;
    let dose = f === "daily" ? true : f === "weekly" ? d.getDay() === start.getDay() : f === "3x_week" ? [1,3,5].includes(d.getDay()) : false;
    return { date: d, isDose: dose, str: d.toISOString().split("T")[0] };
  });
  const doseDays = days.filter(d => d.isDose);
  const dosed = doseDays.filter(d => isLogged(proto.id, d.str)).length;
  const pct = doseDays.length > 0 ? Math.round((dosed / doseDays.length) * 100) : 0;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Protocol Tracker</h2>
        <p style={{ fontSize: 12, color: T.dim }}>Track dose adherence across your research cycle.</p>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {saved.map(p => <Pill key={p.id} active={proto.id === p.id} onClick={() => setSel(p)}>{p.compound}</Pill>)}
        {saved.map(p => null).filter(Boolean).length > 0 && <button onClick={() => setSaved([])} style={{ padding: "5px 12px", fontSize: 11, borderRadius: 20, cursor: "pointer", background: T.red + "15", color: T.red, border: `1px solid ${T.red}30` }}>Clear all</button>}
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{proto.compound}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge label={`${proto.dose}mg`} color={T.blue} small />
              <Badge label={FREQ_LABEL[proto.frequency]} color={T.dim} small />
              <Badge label={`${proto.weeks} weeks`} color={T.dim} small />
              <Badge label={`${proto.vialsNeeded} vials`} color={T.gold} small />
            </div>
          </div>
          <button onClick={() => { setSaved(s => s.filter(p => p.id !== proto.id)); setSel(null); }} style={{ background: "none", border: "none", color: T.dim, cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.dim, marginBottom: 5 }}>
            <span>Adherence — {dosed}/{doseDays.length} doses</span>
            <span style={{ color: pct >= 80 ? T.green : pct >= 50 ? T.gold : T.red }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: T.surface, borderRadius: 2 }}>
            <div style={{ height: "100%", background: pct >= 80 ? T.green : pct >= 50 ? T.gold : T.red, width: `${pct}%`, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 8, color: T.faint, padding: "0 0 4px" }}>{d}</div>)}
          {Array.from({ length: start.getDay() }).map((_, i) => <div key={`p${i}`} />)}
          {days.map((day, i) => {
            const isToday = day.str === today;
            const logged = isLogged(proto.id, day.str);
            const past = day.date < new Date() && !isToday;
            let bg = "transparent", color = T.faint, border = T.border;
            if (day.isDose) {
              if (logged) { bg = T.green + "30"; color = T.green; border = T.green + "60"; }
              else if (past) { bg = T.red + "15"; color = T.red + "80"; border = T.red + "30"; }
              else { bg = T.blue + "15"; color = T.blue; border = T.blue + "40"; }
            }
            if (isToday) border = T.gold;
            return <button key={i} onClick={() => day.isDose && toggle(proto.id, day.str)} style={{ aspectRatio: "1", borderRadius: 3, cursor: day.isDose ? "pointer" : "default", background: bg, color, border: `1px solid ${border}`, fontSize: 8, fontFamily: T.mono, fontWeight: isToday ? 700 : 400, display: "flex", alignItems: "center", justifyContent: "center" }}>{day.date.getDate()}</button>;
          })}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
          {[[T.green,"Taken"],[T.blue,"Upcoming"],[T.red,"Missed"],[T.gold,"Today"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
              <span style={{ fontSize: 10, color: T.dim }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── TMPL IN-STOCK COMPOUNDS (for buy CTAs) ──────────────────
const TMPL_STOCK = {
  "rt20": true, "rt30": true, "rt40": true, "rt50": true, "rt60": true,
  "tz10": true, "tz20": true, "bb10": true, "bb20": true,
  "tesa10": true, "ms40": true, "bbg70": true, "bbgk": true,
  "nj1000": true, "kpv10": true, "cu100": true, "sk10": true, "xa10": true, "ds15": true,
};

// ── EMAIL CAPTURE MODAL ──────────────────────────────────────
const EmailModal = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const submit = () => { if (email) { onSubmit(email, name); onClose(); } };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 9, color: T.blue, letterSpacing: "0.2em", fontFamily: T.mono, marginBottom: 12 }}>TMPL RESEARCH COMMUNITY</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>Save your protocol + get exclusive access</h2>
        <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.8, marginBottom: 20 }}>Join our research community. Get new compound alerts, protocol updates, and early access to TMPL in-stock inventory. No spam.</p>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 6 }}>FIRST NAME</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: "10px 14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono, marginBottom: 6 }}>EMAIL ADDRESS</div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" style={{ width: "100%", padding: "10px 14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, boxSizing: "border-box" }} />
        </div>
        <button onClick={submit} disabled={!email} style={{ width: "100%", padding: "13px", background: email ? T.blue : T.faint, color: email ? "#000" : T.dim, border: "none", borderRadius: 8, cursor: email ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          Save Protocol + Join Community →
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: "10px", background: "transparent", color: T.dim, border: "none", cursor: "pointer", fontSize: 12 }}>Skip for now</button>
        <p style={{ fontSize: 10, color: T.faint, textAlign: "center", marginTop: 8, lineHeight: 1.6 }}>For research purposes only. Must be 21+. TMPL Research Labs — tmplrlabs.com</p>
      </div>
    </div>
  );
};

// ── BUY CTA BANNER ───────────────────────────────────────────
const BuyCTA = ({ compound, vials }) => {
  const inStock = TMPL_STOCK[compound?.id];
  if (!compound) return null;
  return (
    <div style={{ background: inStock ? "rgba(61,214,140,0.06)" : "rgba(77,159,255,0.06)", border: `1px solid ${inStock ? T.green : T.blue}30`, borderRadius: 10, padding: "16px 18px", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: inStock ? T.green : T.blue, fontFamily: T.mono, marginBottom: 4 }}>
            {inStock ? "✓ IN STOCK AT TMPL RESEARCH" : "AVAILABLE AT TMPL RESEARCH"}
          </div>
          <div style={{ fontSize: 13, color: T.text, fontWeight: 600, marginBottom: 2 }}>{compound.name}</div>
          <div style={{ fontSize: 11, color: T.dim }}>
            {inStock ? `You need ${vials} vials · Ships this week · Domestic USPS` : `You need ${vials} vials · Available to order`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          <a href="https://tmplrlabs.com" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", background: inStock ? T.green : T.blue, color: "#000", borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: "none", textAlign: "center", whiteSpace: "nowrap" }}>
            {inStock ? "Order from TMPL →" : "Inquire at TMPL →"}
          </a>
          <a href="https://wa.me/19548709089" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 20px", background: "transparent", color: T.dim, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 11, textDecoration: "none", textAlign: "center", whiteSpace: "nowrap" }}>
            WhatsApp Order
          </a>
        </div>
      </div>
    </div>
  );
};

// ── HERO SECTION ─────────────────────────────────────────────
const Hero = ({ onStart }) => (
  <div style={{ borderBottom: `1px solid ${T.border}`, background: T.surface }}>
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 20px 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 9, color: T.blue, letterSpacing: "0.25em", fontFamily: T.mono, marginBottom: 10 }}>FREE RESEARCH TOOL · {COMPOUNDS.length} COMPOUNDS</div>
          <h1 style={{ fontSize: "clamp(22px, 5vw, 36px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 12, letterSpacing: "-0.5px" }}>
            The most complete<br />peptide dose calculator<br /><span style={{ color: T.blue }}>available anywhere.</span>
          </h1>
          <p style={{ fontSize: 13, color: T.dim, lineHeight: 1.8, marginBottom: 20, maxWidth: 480 }}>
            Calculate exact vials needed for any protocol. Reconstitution guide with draw volumes. 6 pre-built research stacks. Visual cycle tracker. 100% free. No sign-up required.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={onStart} style={{ padding: "12px 24px", background: T.blue, color: "#000", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
              Use the Calculator →
            </button>
            <a href="https://tmplrlabs.com" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", background: "transparent", color: T.blue, border: `1px solid ${T.blue}50`, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Buy Compounds
            </a>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 180 }}>
          {[
            [`${COMPOUNDS.length}+`, "Compounds"],
            ["6", "Protocols"],
            ["Free", "Forever"],
            ["60+", "Guides"],
          ].map(([v, l]) => (
            <div key={l} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.blue, fontFamily: T.mono }}>{v}</div>
              <div style={{ fontSize: 9, color: T.dim, marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
        {[
          ["🔢", "Dose Calculator", "Exact vials for any protocol"],
          ["💉", "Reconstitution Guide", "Draw volume on insulin syringe"],
          ["📋", "Protocol Templates", "Pre-built research stacks"],
          ["📅", "Cycle Tracker", "Visual adherence calendar"],
          ["📖", "Compound Guide", "Notes for every peptide"],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start", minWidth: 180, flex: 1 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: 11, color: T.dim }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── TMPL SHOP BANNER ─────────────────────────────────────────
const ShopBanner = () => (
  <div style={{ background: "linear-gradient(135deg, #0a1628, #071020)", border: `1px solid ${T.blue}30`, borderRadius: 12, padding: "20px 24px", margin: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
    <div>
      <div style={{ fontSize: 9, color: T.blue, letterSpacing: "0.2em", fontFamily: T.mono, marginBottom: 6 }}>POWERED BY TMPL RESEARCH LABS</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>In-stock compounds. Ships this week.</div>
      <div style={{ fontSize: 12, color: T.dim }}>Retatrutide · Tirzepatide · BPC-157 · NAD+ · GLOW · KLOW and more · COA available</div>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      <a href="https://tmplrlabs.com" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", background: T.blue, color: "#000", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
        Browse In-Stock →
      </a>
      <a href="https://wa.me/19548709089" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 16px", background: "transparent", color: T.dim, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}>
        WhatsApp
      </a>
    </div>
  </div>
);

// ── MAIN ─────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [saved, setSaved] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("tmpl-protos-v2");
        if (r?.value) setSaved(JSON.parse(r.value));
        const e = await window.storage.get("tmpl-email");
        if (e?.value) setEmailCaptured(true);
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.storage.set("tmpl-protos-v2", JSON.stringify(saved)).catch(() => {});
  }, [saved, loaded]);

  const handleSave = (result) => {
    if (!emailCaptured) {
      setPendingSave(result);
      setShowEmail(true);
    } else {
      commitSave(result);
    }
  };

  const commitSave = (result) => {
    setSaved(prev => [...prev, {
      id: Date.now(), compound: result.compound.name, compoundId: result.compound.id,
      dose: result.dose, frequency: result.freq, weeks: result.weeks,
      vialsNeeded: result.vials, startDate: new Date().toISOString(),
    }]);
    setTab("tracker");
  };

  const handleEmailSubmit = async (email, name) => {
    setEmailCaptured(true);
    await window.storage.set("tmpl-email", JSON.stringify({ email, name, date: new Date().toISOString() })).catch(() => {});
    if (pendingSave) { commitSave(pendingSave); setPendingSave(null); }
  };

  const TABS = [
    { id: "home", label: "Home" },
    { id: "calc", label: "Calculator" },
    { id: "recon", label: "Reconstitution" },
    { id: "protocols", label: "Protocols" },
    { id: "guide", label: `Guide (${COMPOUNDS.length})` },
    { id: "tracker", label: `Tracker${saved.length > 0 ? ` (${saved.length})` : ""}` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.sans }}>
      {showEmail && <EmailModal onClose={() => setShowEmail(false)} onSubmit={handleEmailSubmit} />}

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${T.border}`, background: T.surface, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setTab("home")}>
          <div>
            <div style={{ fontSize: 9, color: T.blue, letterSpacing: "0.2em", fontFamily: T.mono }}>TMPL RESEARCH LABS</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Peptide Research Tool</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="https://tmplrlabs.com" target="_blank" rel="noopener noreferrer" style={{ padding: "7px 16px", background: T.blue, color: "#000", borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Buy Compounds →</a>
          <a href="https://wa.me/19548709089" target="_blank" rel="noopener noreferrer" style={{ padding: "7px 14px", background: "transparent", color: T.dim, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 11, textDecoration: "none" }}>WhatsApp</a>
        </div>
      </div>

      {/* Hero */}
      {tab === "home" && <Hero onStart={() => setTab("calc")} />}

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.surface, overflowX: "auto" }}>
        {TABS.filter(t => t.id !== "home").map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flexShrink: 0, padding: "11px 16px", border: "none", cursor: "pointer", background: "transparent", fontSize: 11, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? T.blue : T.dim, borderBottom: tab === t.id ? `2px solid ${T.blue}` : "2px solid transparent", whiteSpace: "nowrap" }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 16px", maxWidth: 860, margin: "0 auto" }}>
        <ShopBanner />
        {tab === "home" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Where would you like to start?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, maxWidth: 600, margin: "20px auto" }}>
              {[["🔢","Calculator","Calculate vials needed"],["💉","Reconstitution","Draw volume guide"],["📋","Protocols","Pre-built stacks"],["📖","Guide","All 60+ compounds"],["📅","Tracker","Track your cycle"]].map(([icon, label, desc]) => (
                <button key={label} onClick={() => setTab(label.toLowerCase().replace(" ",""))} style={{ padding: "20px 12px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 10, color: T.dim }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {tab === "calc" && <Calculator onSave={handleSave} BuyCTA={BuyCTA} />}
        {tab === "recon" && <ReconGuide />}
        {tab === "protocols" && <Protocols onSave={handleSave} />}
        {tab === "guide" && <Guide />}
        {tab === "tracker" && <Tracker saved={saved} setSaved={setSaved} />}
      </div>

      {/* Footer */}
      <div style={{ padding: "32px 20px", borderTop: `1px solid ${T.border}`, background: T.surface, marginTop: 40 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 9, color: T.blue, letterSpacing: "0.2em", fontFamily: T.mono, marginBottom: 8 }}>TMPL RESEARCH LABS</div>
            <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.8, maxWidth: 400 }}>
              Free peptide research tools provided by TMPL Research Labs. All compounds available for purchase at tmplrlabs.com. For research purposes only. Not for human or animal consumption. Must be 21+. No medical advice given.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "right" }}>
            <a href="https://tmplrlabs.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.blue, textDecoration: "none" }}>tmplrlabs.com</a>
            <a href="https://wa.me/19548709089" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.dim, textDecoration: "none" }}>WhatsApp Orders</a>
            <div style={{ fontSize: 10, color: T.faint }}>COA available on request</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PATCH CALCULATOR TO ACCEPT BuyCTA PROP ───────────────────
// Note: BuyCTA is passed as prop and rendered after results in Calculator