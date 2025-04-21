/* ======================================================
   Motivation Library (Internal Drives / Narrative Goals)
   ------------------------------------------------------
   These define what makes an NPC "tick" and shape:
   - Personal quests
   - Loyalty and betrayal conditions
   - Behavioral patterns in and out of scenes
========================================================= */

setup.Motivations = {
    // Core Motivations
    justice: {
      tags: ["moral", "lawful"],
      notes: "Seeks fairness, hates corruption. May trigger vigilante behavior or formal quests."
    },
    revenge: {
      tags: ["vengeful", "emotional"],
      notes: "Drives actions based on past wrongs. Likely to spark intense personal quests."
    },
    power: {
      tags: ["ambition", "dominance"],
      notes: "Desires authority or superiority. Often manipulative or assertive."
    },
    knowledge: {
      tags: ["intellectual", "curious"],
      notes: "Seeks truth, secrets, arcane lore. May align with Scholar or Witchling archetypes."
    },
    survival: {
      tags: ["primal", "realist"],
      notes: "Wants to live above all. Can make pragmatic or cold decisions."
    },
    family: {
      tags: ["emotional", "relational"],
      notes: "Protective of kin or those they consider family. Likely to abandon duty to save them."
    },
    loyalty: {
      tags: ["duty", "bonded"],
      notes: "Values allegiances and service. Driven by oath, honor, or gratitude."
    },
    legacy: {
      tags: ["ambition", "mortal"],
      notes: "Wants to be remembered. Motivated by creation, influence, or children."
    },
  
    // Romantic / Intimate Motivations
    love: {
      tags: ["romantic", "emotional"],
      notes: "Seeks intimacy, connection. Will follow heart even at great cost."
    },
    lust: {
      tags: ["pleasure", "impulse"],
      notes: "Prioritizes desire, beauty, sex. May interfere with duty or logic."
    },
    thrill: {
      tags: ["risk", "chaotic"],
      notes: "Lives for danger, excitement. Motivated by unpredictability and adrenaline."
    },
  
    // Status-Based / Material
    wealth: {
      tags: ["greed", "material"],
      notes: "Motivated by money, luxuries, or gain. Can bribe, steal, or manipulate."
    },
    fame: {
      tags: ["recognition", "external"],
      notes: "Wants to be admired, known, or praised. May exaggerate deeds."
    },
    freedom: {
      tags: ["independence", "liberty"],
      notes: "Hates constraints. Resists authority and avoids entrapment."
    },
  
    // Kink-Aligned / Subtle Drives
    control: {
      tags: ["dominance", "power"],
      notes: "Wants to control others emotionally, socially, or sexually."
    },
    devotion: {
      tags: ["service", "loyalty"],
      notes: "Finds fulfillment in pleasing others. Can become obsessive."
    },
    shame: {
      tags: ["taboo", "emotional"],
      notes: "Defines self by guilt or desire for punishment. May seek degradation scenes."
    }
  };
  