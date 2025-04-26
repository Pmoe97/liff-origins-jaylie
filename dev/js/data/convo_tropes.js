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

setup.ConvoTropesByTier = {
  1: [ // Icebreakers, low risk
    {
      key: "joke",
      label: "Tell a Joke",
      skill: "performance",
      baseDifficulty: 8,
      effects: { trust: 1 },
      heatTier: 1
    },
    {
      key: "ask_hobby",
      label: "Ask about their hobbies",
      skill: "insight",
      baseDifficulty: 7,
      effects: { trust: 1 },
      heatTier: 1
    },
    {
      key: "relate",
      label: "Relate to them",
      skill: "insight",
      baseDifficulty: 8,
      effects: { trust: 1 },
      heatTier: 1
    },
    {
      key: "compliment_clothes",
      label: "Compliment their outfit",
      skill: "persuasion",
      baseDifficulty: 9,
      effects: { affection: 1 },
      heatTier: 1
    },
    {
      key: "tease_light",
      label: "Tease playfully",
      skill: "performance",
      baseDifficulty: 10,
      effects: { affection: 1 },
      heatTier: 1
    },
    {
      key: "stay_silent",
      label: "Stay silent and observe",
      skill: "willpower",
      baseDifficulty: 6,
      effects: { trust: 1 },
      heatTier: 1
    },
    {
      key: "make_fun_of_self",
      label: "Poke fun at yourself",
      skill: "wit",
      baseDifficulty: 9,
      effects: { trust: 1 },
      heatTier: 1
    },
    {
      key: "ask_question",
      label: "Ask a personal question",
      skill: "insight",
      baseDifficulty: 10,
      effects: { trust: 2 },
      heatTier: 1
    },
    {
      key: "flirt_subtle",
      label: "Flirt (subtle)",
      skill: "persuasion",
      baseDifficulty: 10,
      effects: { affection: 1 },
      heatTier: 1
    },
    {
      key: "observe_room",
      label: "Comment on the room",
      skill: "wit",
      baseDifficulty: 7,
      effects: { trust: 1 },
      heatTier: 1
    },
    {
      key: "compliment_eyes",
      label: "Compliment their eyes",
      skill: "persuasion",
      baseDifficulty: 11,
      effects: { affection: 1 },
      heatTier: 1
    },
    {
      key: "open_up_small",
      label: "Share a small truth",
      skill: "insight",
      baseDifficulty: 9,
      effects: { trust: 1 },
      heatTier: 1
    }
  ],
  2: [ // Flirty, bolder
    {
      key: "compliment_scent",
      label: "Compliment their scent",
      skill: "persuasion",
      baseDifficulty: 12,
      effects: { affection: 2 },
      heatTier: 2
    },
    {
      key: "eye_contact",
      label: "Hold eye contact",
      skill: "willpower",
      baseDifficulty: 11,
      effects: { trust: 1, affection: 1 },
      heatTier: 2
    },
    {
      key: "comment_smile",
      label: "Compliment their smile",
      skill: "persuasion",
      baseDifficulty: 10,
      effects: { affection: 2 },
      heatTier: 2
    },
    {
      key: "ask_romantic_prefs",
      label: "Ask what they're into",
      skill: "insight",
      baseDifficulty: 13,
      effects: { trust: 1 },
      heatTier: 2
    },
    {
      key: "tease_back",
      label: "Tease them right back",
      skill: "performance",
      baseDifficulty: 13,
      effects: { affection: 2 },
      heatTier: 2
    },
    {
      key: "flirt_open",
      label: "Openly flirt",
      skill: "persuasion",
      baseDifficulty: 14,
      effects: { affection: 2 },
      heatTier: 2
    },
    {
      key: "drop_innuendo",
      label: "Drop a suggestive line",
      skill: "wit",
      baseDifficulty: 15,
      effects: { affection: 2 },
      heatTier: 2
    },
    {
      key: "mention_touch",
      label: "Mention how close they are",
      skill: "observation",
      baseDifficulty: 13,
      effects: { affection: 1 },
      heatTier: 2
    },
    {
      key: "mirror_posture",
      label: "Match their posture",
      skill: "hands",
      baseDifficulty: 10,
      effects: { trust: 1 },
      heatTier: 2
    },
    {
      key: "ask_dating",
      label: "Ask about past relationships",
      skill: "insight",
      baseDifficulty: 14,
      effects: { trust: 2 },
      heatTier: 2
    },
    {
      key: "touch_hand",
      label: "Gently touch their hand",
      skill: "hands",
      baseDifficulty: 16,
      effects: { affection: 3 },
      heatTier: 2
    },
    {
      key: "smile_genuine",
      label: "Smile genuinely",
      skill: "performance",
      baseDifficulty: 10,
      effects: { affection: 1 },
      heatTier: 2
    }
  ],
  3: [ // Emotional, bold, physical
    {
      key: "touch_face",
      label: "Brush a strand of hair aside",
      skill: "hands",
      baseDifficulty: 17,
      effects: { affection: 3 },
      heatTier: 3
    },
    {
      key: "share_secret",
      label: "Share a vulnerable secret",
      skill: "insight",
      baseDifficulty: 16,
      effects: { trust: 3 },
      heatTier: 3
    },
    {
      key: "compliment_body",
      label: "Compliment their body",
      skill: "persuasion",
      baseDifficulty: 17,
      effects: { affection: 2 },
      heatTier: 3
    },
    {
      key: "ask_fantasy",
      label: "Ask about a fantasy",
      skill: "insight",
      baseDifficulty: 18,
      effects: { trust: 2 },
      heatTier: 3
    },
    {
      key: "trace_finger",
      label: "Trace a finger on their arm",
      skill: "hands",
      baseDifficulty: 19,
      effects: { affection: 3 },
      heatTier: 3
    },
    {
      key: "confess_feelings",
      label: "Confess attraction",
      skill: "persuasion",
      baseDifficulty: 17,
      effects: { affection: 3, trust: 1 },
      heatTier: 3
    },
    {
      key: "talk_about_touch",
      label: "Ask how they feel about being touched",
      skill: "insight",
      baseDifficulty: 16,
      effects: { trust: 2 },
      heatTier: 3
    },
    {
      key: "suggest_alone",
      label: "Suggest going somewhere private",
      skill: "persuasion",
      baseDifficulty: 18,
      effects: { affection: 2 },
      heatTier: 3
    },
    {
      key: "touch_back",
      label: "Place a hand on their lower back",
      skill: "hands",
      baseDifficulty: 18,
      effects: { affection: 3 },
      heatTier: 3
    },
    {
      key: "make_promise",
      label: "Promise not to hurt them",
      skill: "willpower",
      baseDifficulty: 17,
      effects: { trust: 2 },
      heatTier: 3
    }
  ],
  4: [ // Intimate, romantic, dominant
    {
      key: "kiss",
      label: "Kiss them",
      skill: "mouth",
      baseDifficulty: 20,
      effects: { affection: 5 },
      heatTier: 4
    },
    {
      key: "bite_lip",
      label: "Bite your lip",
      skill: "performance",
      baseDifficulty: 19,
      effects: { affection: 3 },
      heatTier: 4
    },
    {
      key: "pull_closer",
      label: "Pull them closer",
      skill: "hands",
      baseDifficulty: 20,
      effects: { affection: 4 },
      heatTier: 4
    },
    {
      key: "whisper",
      label: "Whisper into their ear",
      skill: "mouth",
      baseDifficulty: 19,
      effects: { affection: 4 },
      heatTier: 4
    },
    {
      key: "ask_to_trust",
      label: "Ask them to trust you",
      skill: "persuasion",
      baseDifficulty: 21,
      effects: { trust: 3 },
      heatTier: 4
    },
    {
      key: "confess_lust",
      label: "Confess your desire",
      skill: "persuasion",
      baseDifficulty: 22,
      effects: { affection: 4 },
      heatTier: 4
    },
    {
      key: "hand_on_hip",
      label: "Place a hand on their hip",
      skill: "hands",
      baseDifficulty: 21,
      effects: { affection: 4 },
      heatTier: 4
    },
    {
      key: "slide_fingers",
      label: "Slide your fingers over theirs",
      skill: "hands",
      baseDifficulty: 20,
      effects: { affection: 3 },
      heatTier: 4
    },
    {
      key: "let_guard_down",
      label: "Let your guard down",
      skill: "willpower",
      baseDifficulty: 19,
      effects: { trust: 3 },
      heatTier: 4
    }
  ],
  5: [ // 🔞 Explicit, devotional, dominant/submissive
    {
      key: "submit",
      label: "Submit to their touch",
      skill: "willpower",
      baseDifficulty: 23,
      effects: { affection: 4 },
      heatTier: 5
    },
    {
      key: "bite_neck",
      label: "Bite their neck",
      skill: "mouth",
      baseDifficulty: 24,
      effects: { affection: 5 },
      heatTier: 5
    },
    {
      key: "worship",
      label: "Worship them softly",
      skill: "persuasion",
      baseDifficulty: 25,
      effects: { affection: 5, trust: 2 },
      heatTier: 5
    },
    {
      key: "dominant_command",
      label: "Command them to obey",
      skill: "intimidation",
      baseDifficulty: 26,
      effects: { trust: 2, affection: 3 },
      heatTier: 5
    },
    {
      key: "confess_fantasy",
      label: "Confess a fantasy",
      skill: "insight",
      baseDifficulty: 25,
      effects: { affection: 5 },
      heatTier: 5
    },
    {
      key: "pull_into_lap",
      label: "Pull them into your lap",
      skill: "hands",
      baseDifficulty: 26,
      effects: { affection: 5 },
      heatTier: 5
    },
    {
      key: "touch_thigh",
      label: "Touch their thigh",
      skill: "hands",
      baseDifficulty: 24,
      effects: { affection: 4 },
      heatTier: 5
    },
    {
      key: "look_down",
      label: "Look them over slowly",
      skill: "observation",
      baseDifficulty: 22,
      effects: { affection: 4 },
      heatTier: 5
    }
  ]
};
