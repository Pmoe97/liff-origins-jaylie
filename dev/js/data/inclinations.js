/* ======================================================
   Inclination Library (Sexual Preferences / Kinks)
   ------------------------------------------------------
   These values are used to influence NSFW interactions,
   seduction-based fight actions, scene branching, and
   character compatibility. Future systems will allow 
   toggling content categories per player preference.
========================================================= */

// dev/js/data/inclinations.js
// Refactored to integrate sexual act tags directly for compatibility with NSFW preference logic

setup.Inclinations = {

  vanilla: {
    tags: ["safe", "basic"],
    acts: ["Kissing", "Cuddling", "EyeContact", "Oral_G", "Oral_R", "Vaginal_P"],
    soft: true,
    optional: true
  },

  praise: {
    tags: ["affirmation", "emotional"],
    acts: ["Praise_G", "DirtyTalk_G", "Dominate", "Kissing"],
    likes: ["being adored", "gentle domination"],
    optional: true
  },

  domination: {
    tags: ["dominant"],
    acts: ["Dominate", "Spank_G", "Choke_G", "Bondage_G", "HairPulling_G", "DirtyTalk_G", "OrgasmControl_G"],
    optional: true
  },

  submission: {
    tags: ["submissive"],
    acts: ["Submit", "Bondage_R", "Choke_R", "Spank_R", "HairPulling_R", "OrgasmControl_R"],
    optional: true
  },

  service: {
    tags: ["giving", "obedient"],
    acts: ["Oral_G", "Handjob_G", "Praise_G", "Cuddling", "Toys_Use", "Blindfold_G"],
    optional: true
  },

  exhibitionism: {
    tags: ["exposed", "thrill"],
    acts: ["Exhibition_Solo", "Exhibition_Sex", "Kissing", "FaceSit"],
    optional: true
  },

  voyeurism: {
    tags: ["watching", "observation"],
    acts: ["Voyeurism"],
    optional: true
  },

  roughplay: {
    tags: ["aggressive", "intense"],
    acts: ["Spank_G", "Choke_G", "HairPulling_G", "Bite_G", "Degrade_G"],
    optional: true
  },

  bondage: {
    tags: ["restraint", "control"],
    acts: ["Bondage_G", "Bondage_R", "Gag_Use", "Blindfold_R", "Blindfold_G"],
    optional: true
  },

  sensual: {
    tags: ["tender", "stimulating"],
    acts: ["Lick_Body", "NipplePlay_G", "NipplePlay_R", "Fingering_G", "Fingering_R", "BreastPlay_G", "BreastPlay_R"],
    optional: true
  },

  breeding: {
    tags: ["reproductive", "climax"],
    acts: ["Creampie", "Breeding_Kink", "Creampie_Preference"],
    optional: true
  },

  verbal: {
    tags: ["dirty talk", "expression"],
    acts: ["DirtyTalk_G", "DirtyTalk_R", "Praise_G", "Degrade_G", "Degrade_G"],
    optional: true
  },

  sensory: {
    tags: ["stimulus", "touch"],
    acts: ["Blindfold_R", "Blindfold_G", "WaxPlay"],
    optional: true
  },

  roleplay: {
    tags: ["imaginative", "character-based"],
    acts: ["Roleplay_Master", "Roleplay_Servant", "Roleplay_Teacher", "Roleplay_Stranger"],
    optional: true
  },

  riskplay: {
    tags: ["danger", "excitement"],
    acts: ["Risk_BeingCaught", "PowerImbalance"],
    optional: true
  }

};
