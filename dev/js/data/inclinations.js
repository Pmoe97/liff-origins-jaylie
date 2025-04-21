/* ======================================================
   Inclination Library (Sexual Preferences / Kinks)
   ------------------------------------------------------
   These values are used to influence NSFW interactions,
   seduction-based fight actions, scene branching, and
   character compatibility. Future systems will allow 
   toggling content categories per player preference.
========================================================= */

setup.Inclinations = {
    // Vanilla / Softcore
    vanilla: {
      tags: ["safe", "basic"],
      soft: true,
      optional: true
    },
    praise: {
      tags: ["affirmation", "emotional"],
      likes: ["being adored", "gentle domination"],
      optional: true
    },
    teasing: {
      tags: ["playful"],
      likes: ["build-up", "denial"],
      optional: true
    },
    service: {
      tags: ["submissive"],
      likes: ["pleasing others", "obedience"],
      optional: true
    },
    exhibitionism: {
      tags: ["public", "bold"],
      optional: true
    },
    voyeurism: {
      tags: ["watching", "curiosity"],
      optional: true
    },
  
    // BDSM Core
    bondage: {
      tags: ["restraint", "control"],
      optional: true
    },
    domination: {
      tags: ["dominant"],
      optional: true
    },
    submission: {
      tags: ["submissive"],
      optional: true
    },
    sadism: {
      tags: ["pain giver", "intensity"],
      optional: true
    },
    masochism: {
      tags: ["pain receiver", "endurance"],
      optional: true
    },
    degradation: {
      tags: ["verbal", "humiliation"],
      optional: true
    },
    humiliation: {
      tags: ["embarrassment", "control"],
      optional: true
    },
    spanking: {
      tags: ["impact"],
      optional: true
    },
    edging: {
      tags: ["denial", "control"],
      optional: true
    },
  
    // Fetish Play
    footFetish: {
      tags: ["fetish"],
      optional: true
    },
    breathPlay: {
      tags: ["intensity"],
      optional: true
    },
    sensoryPlay: {
      tags: ["sensory", "tactile"],
      optional: true
    },
    roleplay: {
      tags: ["acting", "scenario"],
      optional: true
    },
    temperaturePlay: {
      tags: ["hot", "cold"],
      optional: true
    },
  
    // Hardcore / Extreme
    deepThroat: {
      tags: ["oral", "intensity"],
      optional: true
    },
    doublePenetration: {
      tags: ["penetration", "group"],
      optional: true
    },
    gangbang: {
      tags: ["group"],
      optional: true
    },
    fisting: {
      tags: ["extreme", "penetration"],
      optional: true
    },
    watersports: {
      tags: ["wet", "taboo"],
      optional: true
    },
    facials: {
      tags: ["oral", "climax"],
      optional: true
    },
    creampie: {
      tags: ["internal", "climax"],
      optional: true
    },
    breeding: {
      tags: ["fertility", "climax"],
      optional: true
    },
    sizePlay: {
      tags: ["size", "extreme"],
      optional: true
    },
  
    // Taboo / Optional Filters
    incest: {
      tags: ["taboo"],
      optional: true
    },
    nonCon: {
      tags: ["taboo", "forced"],
      optional: true
    },
    monster: {
      tags: ["nonhuman", "taboo"],
      optional: true
    },
    transformation: {
      tags: ["fantasy", "nonstandard"],
      optional: true
    }
  };
  