setup.SexualActsDB = {
  // 🔸 ORAL
  OralVag_G: { label: "Give Oral", category: "Oral", giver: "player", receiver: "npc", pairedWith: "OralVag_R", togglable: false, preferenceTags: ["OralVag_R"] },
  
  OralVag_R: { label: "Receive Oral", category: "Oral", giver: "npc", receiver: "player", pairedWith: "OralVag_G", togglable: false, preferenceTags: ["OralVag_G"] },
  
  OralPenis_G: {label: "Suck Their Cock",  category: "Oral",  giver: "player", receiver: "npc",  pairedWith: "OralPenis_R",  togglable: true,  preferenceTags: ["Oral_R", "Penis"]},

  OralPenis_R: {  label: "Get Your Cock Sucked",  category: "Oral",  giver: "npc",  receiver: "player",  pairedWith: "OralPenis_G",  togglable: true,  preferenceTags: ["Oral_G", "Penis"]},

  Deepthroat_G: {  label: "Deepthroat Them",  category: "Oral",  giver: "player",  receiver: "npc",  pairedWith: "Deepthroat_R",  togglable: true,  preferenceTags: ["Oral_R", "Penis", "Throatplay", "SubPlay"]},

  Deepthroat_R: {  label: "Get Deepthroated",  category: "Oral",  giver: "npc",  receiver: "player",  pairedWith: "Deepthroat_G",  togglable: true,  preferenceTags: ["Oral_G", "Penis", "Throatplay", "SubPlay"]},

  OralAnal_G: { label: "Rim Their Ass", category: "Oral", giver: "player", receiver: "npc", pairedWith: "OralAnal_R", togglable: false, preferenceTags: ["OralAnal_R"] },
  
  OralAnal_R: { label: "Get Rimmed", category: "Oral", giver: "npc", receiver: "player", pairedWith: "OralAnal_G", togglable: false, preferenceTags: ["OralAnal_G"] },
  
  FaceSit_G: { label: "Sit on Their Face", category: "Oral", giver: "player", receiver: "npc", pairedWith: "FaceSit_R", togglable: true, preferenceTags: ["Oral_R"] },
  
  FaceSit_R: { label: "Get Sat On", category: "Oral", giver: "npc", receiver: "player", pairedWith: "FaceSit_G", togglable: true, preferenceTags: ["Oral_G"] },

  // 🔸 PENETRATION
  Anal_P_G: { label: "Penetrate Their Ass", category: "Penetration", giver: "player", receiver: "npc", pairedWith: "Anal_R", togglable: true, preferenceTags: ["Anal_R"] },
  
  Anal_R: { label: "Get Fucked in the Ass", category: "Penetration", giver: "player", receiver: "npc", pairedWith: "Anal_P_R", togglable: true, preferenceTags: ["Anal_P"] },
  
  Anal_P_R: { label: "Get Anally Penetrated", category: "Penetration", giver: "npc", receiver: "player", pairedWith: "Anal_G", togglable: true, preferenceTags: ["Anal_G"] },
  
  Anal_G: { label: "Fuck Their Ass", category: "Penetration", giver: "npc", receiver: "player", pairedWith: "Anal_P_G", togglable: true, preferenceTags: ["Anal_P"] },

  // 🔸 MANUAL STIMULATION
  FingeringVag_G: { label: "Finger Their Pussy", category: "Manual", giver: "player", receiver: "npc", pairedWith: null, togglable: true, preferenceTags: ["FingeringVag_R"] },
  
  FingeringVag_R: {  label: "Get Fingered",  category: "Manual",  giver: "npc",  receiver: "player",  pairedWith: "FingeringVag_G",  togglable: true,  preferenceTags: ["FingeringVag_G", "Vaginal", "Manual", "SubPlay"]},

  Handjob_G: {  label: "Stroke Their Cock",  category: "Manual",  giver: "player",  receiver: "npc",  pairedWith: "Handjob_R",  togglable: true,  preferenceTags: ["Manual", "Penis", "Handplay"]},

  Handjob_R: {  label: "Get a Handjob",  category: "Manual",  giver: "npc",  receiver: "player",  pairedWith: "Handjob_G",  togglable: true,  preferenceTags: ["Manual", "Penis", "Handplay"]},
  
  ClitRub_G: {  label: "Rub Their Clit",  category: "Manual",  giver: "player",  receiver: "npc",  pairedWith: "ClitRub_R",  togglable: true,  preferenceTags: ["Clitoral", "Manual", "SubPlay"]},

  ClitRub_R: {  label: "Get Your Clit Rubbed",  category: "Manual",  giver: "npc",  receiver: "player",  pairedWith: "ClitRub_G",  togglable: true,  preferenceTags: ["Clitoral", "Manual", "SubPlay"]},

  BreastPlay_G: { label: "Touch Their Breasts", category: "Manual", giver: "player", receiver: "npc", pairedWith: "BreastPlay_R", togglable: true, preferenceTags: ["BreastPlay_R"] },
  
  BreastPlay_R: { label: "Fondle Their Breasts", category: "Manual", giver: "player", receiver: "npc", pairedWith: "BreastPlay_G", togglable: true, preferenceTags: ["BreastPlay_R"] },
  
  NipplePlay_G: { label: "Play with Their Nipples", category: "Manual", giver: "player", receiver: "npc", pairedWith: "NipplePlay_R", togglable: true, preferenceTags: ["NipplePlay_R"] },
  
  NipplePlay_R: { label: "Get Your Nipples Played With", category: "Manual", giver: "player", receiver: "npc", pairedWith: "NipplePlay_G", togglable: true, preferenceTags: ["NipplePlay_G"] },
  
  Spank_G: { label: "Spank Them", category: "Manual", giver: "player", receiver: "npc", pairedWith: "Spank_R", togglable: true, preferenceTags: ["Spank_R"] },
  
  Spank_R: { label: "Get Spanked", category: "Manual", giver: "npc", receiver: "player", pairedWith: "Spank_G", togglable: true, preferenceTags: ["Spank_G"] },
  
  HairPulling_G: { label: "Pull Their Hair", category: "Manual", giver: "player", receiver: "npc", pairedWith: "HairPulling_R", togglable: true, preferenceTags: ["HairPulling_R"] },
  
  HairPulling_R: { label: "Get Your Hair Pulled", category: "Manual", giver: "npc", receiver: "player", pairedWith: "HairPulling_G", togglable: true, preferenceTags: ["HairPulling_G"] },

  // 🔸 POWER / DOM-SUB
  Dominate: { label: "Take Control", category: "Power", giver: "player", receiver: "npc", pairedWith: "Submit", togglable: true, preferenceTags: ["Submit"] },
  
  Submit: { label: "Submit", category: "Power", giver: "player", receiver: "npc", pairedWith: "Dominate", togglable: false, preferenceTags: ["Dominate"] },
  
  Choke_G: { label: "Choke Them", category: "Power", giver: "player", receiver: "npc", pairedWith: "Choke_R", togglable: true, preferenceTags: ["Choke_R"] },
  
  Choke_R: { label: "Get Choked", category: "Power", giver: "npc", receiver: "player", pairedWith: "Choke_G", togglable: true, preferenceTags: ["Choke_G"] },
  
  Bondage_G: { label: "Bind Them", category: "Power", giver: "player", receiver: "npc", pairedWith: "Bondage_R", togglable: false, preferenceTags: ["Bondage_R"] },
  
  Bondage_R: { label: "Get Bound", category: "Power", giver: "npc", receiver: "player", pairedWith: "Bondage_G", togglable: false, preferenceTags: ["Bondage_G"] },

  // 🔸 CLIMAX
  CreampieVag_G: { label: "Cum in Their Pussy", category: "Climax", giver: "player", receiver: "npc", pairedWith: "CreampieVag_R", togglable: false, preferenceTags: ["Creampie", "Breeding_Kink", "Vaginal_P"] },
  
  CreampieVag_R: { label: "Get Creampied in the Pussy", category: "Climax", giver: "npc", receiver: "player", pairedWith: "CreampieVag_G", togglable: false, preferenceTags: ["Creampie", "Breeding_Kink", "Vaginal_P"] },
  
  CreampieAnal_G: { label: "Cum in Their Ass", category: "Climax", giver: "player", receiver: "npc", pairedWith: "CreampieAnal_R", togglable: false, preferenceTags: ["Creampie", "Breeding_Kink", "Anal_P"] },
  
  CreampieAnal_R: { label: "Get Creampied in the Ass", category: "Climax", giver: "npc", receiver: "player", pairedWith: "CreampieAnal_G", togglable: false, preferenceTags: ["Creampie", "Breeding_Kink", "Anal_P"] },
  
  CreampieOral_G: { label: "Cum in Their Mouth", category: "Climax", giver: "player", receiver: "npc", pairedWith: "CreampieOral_R", togglable: false, preferenceTags: ["Oral_R", "Creampie", "Breeding_Kink"] },
  
  CreampieOral_R: { label: "Get Creampied in the Mouth", category: "Climax", giver: "npc", receiver: "player", pairedWith: "CreampieOral_G", togglable: false, preferenceTags: ["Oral_G", "Creampie", "Breeding_Kink"] },

  // 🔸 TOYS
  Toys_Use: { label: "Use a Toy on Them", category: "Toys", giver: "player", receiver: "npc", pairedWith: "Toys_Receive", togglable: true, preferenceTags: ["Toys_Receive"] },
  
  Toys_Receive: { label: "Get Toyed With", category: "Toys", giver: "npc", receiver: "player", pairedWith: "Toys_Use", togglable: true, preferenceTags: ["Toys_Use"] },
  
  Toys_OnSelf: { label: "Use a Toy on Yourself", category: "Toys", giver: "player", receiver: "player", pairedWith: null, togglable: true, preferenceTags: ["Toys_OnSelf"] },
  
  Gag_R: { label: "Get Gagged", category: "Toys", giver: "npc", receiver: "player", pairedWith: "Gag_G", togglable: true, preferenceTags: ["Gag_G"] },
  
  Gag_G: { label: "Gag Them", category: "Toys", giver: "player", receiver: "npc", pairedWith: "Gag_R", togglable: true, preferenceTags: ["Gag_R"] },
  
  Blindfold_G: { label: "Blindfold Them", category: "Toys", giver: "player", receiver: "npc", pairedWith: "Blindfold_R", togglable: true, preferenceTags: ["Blindfold_R"] },
  
  WaxPlay_G: { label: "Drip Wax on Them", category: "Toys", giver: "player", receiver: "npc", pairedWith: null, togglable: false, requiresItem: "melting_candle", preferenceTags: ["WaxPlay", "SensoryPlay", "SubPlay"] },
  
  WaxPlay_R: { label: "Get Wax Dripped on You", category: "Toys", giver: "npc", receiver: "player", pairedWith: "WaxPlay_G", togglable: false, requiresItem: "melting_candle", preferenceTags: ["WaxPlay", "SensoryPlay", "DomPlay"] },

  // 🔸 VERBAL
  DirtyTalk_G: { label: "Talk Dirty", category: "Verbal", giver: "player", receiver: "npc", pairedWith: "DirtyTalk_R", togglable: false, preferenceTags: ["DirtyTalk_R"] },
  
  DirtyTalk_R: { label: "Get Talked Dirty To", category: "Verbal", giver: "npc", receiver: "player", pairedWith: "DirtyTalk_G", togglable: false, preferenceTags: ["DirtyTalk_G"] },
  
  Praise_G: { label: "Praise Them", category: "Verbal", giver: "player", receiver: "npc", pairedWith: "Praise_R", togglable: false, preferenceTags: ["Praise"] },
  
  Praise_R: { label: "Get Praised", category: "Verbal", giver: "npc", receiver: "player", pairedWith: "Praise_G", togglable: false, preferenceTags: ["Praise_G"] },
  
  Degrade_G: { label: "Degrade Them", category: "Verbal", giver: "player", receiver: "npc", pairedWith: "Degrade_R", togglable: false, preferenceTags: ["Degrade_R"] },
  
  Degrade_R: { label: "Get Degraded", category: "Verbal", giver: "npc", receiver: "player", pairedWith: "Degrade_G", togglable: false, preferenceTags: ["Degrade_G"] },

  // 🔸 EMOTIONAL
  Kissing: { label: "Kiss Them", category: "Emotional", giver: "player", receiver: "npc", pairedWith: "Kissing", togglable: false, preferenceTags: ["Kissing"] },

  // 🔸 AFTERCARE
  Cuddling: { label: "Cuddle Them", category: "Aftercare", giver: "player", receiver: "npc", pairedWith: "Cuddling", togglable: false, preferenceTags: ["Cuddling"] },

  // 🔸 SCENE CONTROL
  Edging: { label: "Edge Them", category: "SceneControl", giver: "player", receiver: "npc", pairedWith: "Edging_R", togglable: false, preferenceTags: ["Edging"] },
  
  Edging_R: { label: "Get Edged", category: "SceneControl", giver: "npc", receiver: "player", pairedWith: "Edging", togglable: false, preferenceTags: ["Edging"] }
};
