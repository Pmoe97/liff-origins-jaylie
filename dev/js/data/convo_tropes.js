/* ======================================================
   Relationship Conversation Minigame Core System
   ------------------------------------------------------
   This system powers the turn-based interaction minigame
   between the player and NPCs, using: 
   - Traits to affect success chances
   - Rapport, Affection, Trust, and Tension stats
   - Motivations to influence prompt theming
   - Gifts to affect rapport/tension
   - Results screen on exit
   - Skill XP gain based on trope usage (1–3 XP)
========================================================= */

// ================================
// Conversation Tropes Definition
// ================================

setup.ConvoTropes = {
    flirt: {
      label: "Flirt",
      skill: "persuasion",
      baseDifficulty: 10,
      effects: { affection: 2 }
    },
    joke: {
      label: "Tell a Joke",
      skill: "performance",
      baseDifficulty: 12,
      effects: { trust: 1 }
    },
    relate: {
      label: "Relate to Them",
      skill: "insight",
      baseDifficulty: 8,
      effects: { trust: 1 }
    },
    compliment: {
      label: "Give Compliment",
      skill: "persuasion",
      baseDifficulty: 10,
      effects: { affection: 1, trust: 1 }
    },
    shareSecret: {
      label: "Share a Secret",
      skill: "insight",
      baseDifficulty: 14,
      effects: { trust: 2, affection: 1 }
    },
    touch: {
      label: "Touch Their Arm",
      skill: "hands",
      baseDifficulty: 16,
      effects: { affection: 3 }
    },
    kiss: {
      label: "Kiss Them",
      skill: "mouth",
      baseDifficulty: 18,
      effects: { affection: 4 }
    },
    intimidate: {
      label: "Assert Dominance",
      skill: "intimidation",
      baseDifficulty: 15,
      effects: { trust: 1 }
    },
    deceive: {
      label: "Tell a White Lie",
      skill: "deception",
      baseDifficulty: 13,
      effects: { trust: 1 }
    },
    askQuestion: {
      label: "Ask a Deep Question",
      skill: "insight",
      baseDifficulty: 12,
      effects: { trust: 2 }
    },
    tease: {
      label: "Tease Playfully",
      skill: "performance",
      baseDifficulty: 11,
      effects: { affection: 1 }
    },
    staySilent: {
      label: "Stay Silent",
      skill: "willpower",
      baseDifficulty: 7,
      effects: { trust: 1 }
    }
  };
  
  // ================================
  // Utility to randomly pick N trope keys
  // ================================
  
  setup.pickRandomTropes = function (count = 6) {
    const all = Object.keys(setup.ConvoTropes);
    const shuffled = all.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
  