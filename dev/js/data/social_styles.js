/* ======================================================
   Social Style Library (Tone, Mannerisms, Social Presence)
   ------------------------------------------------------
   Affects how NPCs present themselves socially — their
   tone, word choice, mannerisms, and general vibe.
   Often blends with class, personality, or upbringing.
   Does NOT directly influence conversation mechanics.
========================================================= */

setup.SocialStyles = {
    warm: {
      tags: ["friendly", "open"],
      notes: "Speaks kindly, often smiles, tends to put others at ease."
    },
    cold: {
      tags: ["distant", "guarded"],
      notes: "Rarely emotive, hard to read, often blunt."
    },
    polite: {
      tags: ["formal", "measured"],
      notes: "Courteous and restrained, avoids vulgarity or informality."
    },
    crude: {
      tags: ["vulgar", "casual"],
      notes: "Swears, jokes off-color, generally relaxed in speech."
    },
    seductive: {
      tags: ["flirty", "charming"],
      notes: "Uses innuendo, body language, and tone to entice."
    },
    arrogant: {
      tags: ["haughty", "entitled"],
      notes: "Talks down to others, may use elevated or dismissive language."
    },
    humble: {
      tags: ["meek", "respectful"],
      notes: "Deferential, often puts themselves second, avoids spotlight."
    },
    theatrical: {
      tags: ["dramatic", "expressive"],
      notes: "Big hand gestures, vivid language, flair for storytelling."
    },
    stern: {
      tags: ["strict", "firm"],
      notes: "Controlled voice, serious tone, rarely jokes."
    },
    aloof: {
      tags: ["disengaged", "quiet"],
      notes: "Short answers, little emotion, easily distracted."
    },
    bubbly: {
      tags: ["energetic", "playful"],
      notes: "Talks fast, giggles, prone to tangents or excitement."
    },
    stoic: {
      tags: ["reserved", "emotionless"],
      notes: "Rarely shows emotion even under stress, speaks flatly."
    },
    scholarly: {
      tags: ["academic", "precise"],
      notes: "Careful wording, references theory or history, avoids slang."
    },
    cunning: {
      tags: ["subtle", "manipulative"],
      notes: "May flatter or provoke to gain an edge, reads people quickly."
    }
  };
