/* ======================================================
   Conversation Prompt Library
   ------------------------------------------------------
   Random prompt selector for the minigame. Each prompt:
   - Has a theme
   - Adjusts base difficulty
   - Unlocks at a trust+affection threshold
========================================================= */

setup.ConvoPrompts = [

  // Tier 1 - Small Talk, Light Curiosity
  { text: "What's your drink of choice?", theme: "light", baseDifficultyMod: 0, heatTier: 1 },
  { text: "What kind of weather puts you in a good mood?", theme: "light", baseDifficultyMod: 0, heatTier: 1 },
  { text: "If you could have any animal as a companion, what would it be?", theme: "whimsy", baseDifficultyMod: 1, heatTier: 1 },
  { text: "Is there a food you just can't stand?", theme: "quirky", baseDifficultyMod: 0, heatTier: 1 },
  { text: "What's the strangest dream you've ever had?", theme: "weird", baseDifficultyMod: 2, heatTier: 1 },
  { text: "What do you think people misunderstand about you?", theme: "personal", baseDifficultyMod: 2, heatTier: 1 },
  { text: "What's your idea of comfort food?", theme: "quirky", baseDifficultyMod: 0, heatTier: 1 },
  { text: "Tell me a sound that makes you feel calm.", theme: "soft", baseDifficultyMod: 1, heatTier: 1 },
  { text: "What's something small that always makes you smile?", theme: "light", baseDifficultyMod: 1, heatTier: 1 },
  { text: "Are you more of a sunrise or sunset person?", theme: "whimsy", baseDifficultyMod: 0, heatTier: 1 },
  { text: "What's the most unusual habit you have?", theme: "quirky", baseDifficultyMod: 1, heatTier: 1 },
  { text: "Do you talk to yourself? Out loud?", theme: "oddball", baseDifficultyMod: 1, heatTier: 1 },
  { text: "Do you find silence peaceful or uncomfortable?", theme: "introspective", baseDifficultyMod: 1, heatTier: 1 },
  { text: "What do you notice first when you walk into a room?", theme: "perception", baseDifficultyMod: 1, heatTier: 1 },
  { text: "What's your favorite way to waste time?", theme: "quirky", baseDifficultyMod: 0, heatTier: 1 },
  { text: "If money wasn't an issue, what would you do every day?", theme: "dreamy", baseDifficultyMod: 1, heatTier: 1 },
  { text: "What kind of music makes you feel alive?", theme: "personal", baseDifficultyMod: 1, heatTier: 1 },
  { text: "How do you normally spend your nights?", theme: "smalltalk", baseDifficultyMod: 1, heatTier: 1 },
  { text: "Do you believe in fate, or is everything just random?", theme: "philosophy", baseDifficultyMod: 2, heatTier: 1 },
  { text: "What's the last thing that made you laugh really hard?", theme: "joy", baseDifficultyMod: 1, heatTier: 1 },

  // Tier 2 – Flirty, Teasing, Growing Interest
  { text: "Do you think I'm attractive?", theme: "flirty", baseDifficultyMod: 2, heatTier: 2 },
  { text: "What part of your body do you secretly like the most?", theme: "personal", baseDifficultyMod: 2, heatTier: 2 },
  { text: "How would you react if I told you I had a crush on you?", theme: "flirty", baseDifficultyMod: 2, heatTier: 2 },
  { text: "What's the most flattering thing someone's said to you?", theme: "vanity", baseDifficultyMod: 2, heatTier: 2 },
  { text: "What's something subtle that turns you on?", theme: "flirty", baseDifficultyMod: 3, heatTier: 2 },
  { text: "Would you let someone kiss you without asking?", theme: "boundaries", baseDifficultyMod: 3, heatTier: 2 },
  { text: "What does your ideal first kiss look like?", theme: "romantic", baseDifficultyMod: 2, heatTier: 2 },
  { text: "Do you like it when someone takes the lead?", theme: "flirty", baseDifficultyMod: 3, heatTier: 2 },
  { text: "What's your idea of a perfect flirtation?", theme: "flirty", baseDifficultyMod: 3, heatTier: 2 },
  { text: "Have you ever been caught checking someone out?", theme: "tease", baseDifficultyMod: 2, heatTier: 2 },
  { text: "Where would you want someone to touch you during a slow dance?", theme: "suggestive", baseDifficultyMod: 3, heatTier: 2 },
  { text: "What compliment would melt you every time?", theme: "vanity", baseDifficultyMod: 2, heatTier: 2 },
  { text: "Do you like when someone teases you?", theme: "playful", baseDifficultyMod: 3, heatTier: 2 },
  { text: "What's your favorite place to be kissed?", theme: "flirty", baseDifficultyMod: 3, heatTier: 2 },
  { text: "Would you let someone feed you something sweet?", theme: "intimate", baseDifficultyMod: 2, heatTier: 2 },
  { text: "Would you be the one to make the first move?", theme: "challenge", baseDifficultyMod: 3, heatTier: 2 },
  { text: "What kind of looks make your heart skip?", theme: "romantic", baseDifficultyMod: 2, heatTier: 2 },
  { text: "If I leaned in just a little… what would you do?", theme: "intimate", baseDifficultyMod: 3, heatTier: 2 },
  { text: "Would you let someone touch your face?", theme: "boundaries", baseDifficultyMod: 3, heatTier: 2 },
  { text: "What's something someone could say that would fluster you?", theme: "tease", baseDifficultyMod: 3, heatTier: 2 },

  // Tier 3 – Confessional, Vulnerability, Connection
  { text: "What scares you most about getting close to someone?", theme: "vulnerable", baseDifficultyMod: 3, heatTier: 3 },
  { text: "Have you ever fallen for someone you shouldn't have?", theme: "romantic", baseDifficultyMod: 2, heatTier: 3 },
  { text: "Is there a secret you've never told anyone?", theme: "confessional", baseDifficultyMod: 3, heatTier: 3 },
  { text: "What part of yourself do you hide from most people?", theme: "shadow", baseDifficultyMod: 4, heatTier: 3 },
  { text: "What would you do if we were alone right now?", theme: "intimate", baseDifficultyMod: 4, heatTier: 3 },
  { text: "Have you ever been hurt so badly it changed you?", theme: "emotional", baseDifficultyMod: 4, heatTier: 3 },
  { text: "What do you crave more—intimacy or understanding?", theme: "introspective", baseDifficultyMod: 4, heatTier: 3 },
  { text: "What's something that always makes you feel safe?", theme: "comfort", baseDifficultyMod: 3, heatTier: 3 },
  { text: "How do you act when you're falling in love?", theme: "romantic", baseDifficultyMod: 4, heatTier: 3 },
  { text: "What does your ideal night look like—no limits?", theme: "dreamy", baseDifficultyMod: 3, heatTier: 3 },
  { text: "Is there something you've never forgiven yourself for?", theme: "emotional", baseDifficultyMod: 4, heatTier: 3 },
  { text: "Do you trust easily? Or does it take time?", theme: "guarded", baseDifficultyMod: 3, heatTier: 3 },
  { text: "What would hurt you more—being forgotten or being betrayed?", theme: "trust", baseDifficultyMod: 4, heatTier: 3 },
  { text: "What do you miss most about being a child?", theme: "nostalgia", baseDifficultyMod: 3, heatTier: 3 },
  { text: "What kind of touch calms you down the most?", theme: "sensual", baseDifficultyMod: 3, heatTier: 3 },
  { text: "If you could erase one regret, would you do it?", theme: "contemplative", baseDifficultyMod: 2, heatTier: 3 },
  { text: "What would you do if you weren't afraid of failing?", theme: "aspiration", baseDifficultyMod: 3, heatTier: 3 },
  { text: "Do you believe people can really change?", theme: "philosophy", baseDifficultyMod: 3, heatTier: 3 },
  { text: "How do you know when someone truly cares?", theme: "introspective", baseDifficultyMod: 3, heatTier: 3 },
  { text: "What's something beautiful that makes you sad?", theme: "melancholy", baseDifficultyMod: 3, heatTier: 3 },

  // Tier 4 – Romantic, Physical, Sensual
  { text: "Would you let someone undress you with their eyes?", theme: "bold", baseDifficultyMod: 4, heatTier: 4 },
  { text: "Do you like the sound of your own name on someone else's lips?", theme: "flirty", baseDifficultyMod: 3, heatTier: 4 },
  { text: "What would you do if I leaned in closer right now?", theme: "intimate", baseDifficultyMod: 3, heatTier: 4 },
  { text: "Where do you like being kissed the most?", theme: "sensual", baseDifficultyMod: 4, heatTier: 4 },
  { text: "If I kissed you without warning, would you stop me?", theme: "challenge", baseDifficultyMod: 4, heatTier: 4 },
  { text: "What would you whisper in someone's ear to make them shiver?", theme: "tease", baseDifficultyMod: 4, heatTier: 4 },
  { text: "Do you like it rough, or slow and teasing?", theme: "sensual", baseDifficultyMod: 4, heatTier: 4 },
  { text: "What's the most intimate moment you've ever shared with someone?", theme: "romantic", baseDifficultyMod: 4, heatTier: 4 },
  { text: "Where would your hands wander first?", theme: "suggestive", baseDifficultyMod: 5, heatTier: 4 },
  { text: "Would you like to be touched like a secret?", theme: "poetic", baseDifficultyMod: 5, heatTier: 4 },
  { text: "Have you ever fantasized about someone in this room?", theme: "fantasy", baseDifficultyMod: 4, heatTier: 4 },
  { text: "If I traced your skin, would you shiver or smirk?", theme: "intimate", baseDifficultyMod: 5, heatTier: 4 },
  { text: "What part of your body do you wish someone adored more?", theme: "vulnerable", baseDifficultyMod: 4, heatTier: 4 },
  { text: "What's the most seductive thing someone's said to you?", theme: "memory", baseDifficultyMod: 4, heatTier: 4 },
  { text: "Do you want someone who obeys… or someone who leads?", theme: "dominance", baseDifficultyMod: 4, heatTier: 4 },
  { text: "If I said 'touch me,' where would your hands go first?", theme: "command", baseDifficultyMod: 5, heatTier: 4 },
  { text: "If you were told to beg, would you?", theme: "powerplay", baseDifficultyMod: 5, heatTier: 4 },
  { text: "Would you prefer devotion or desire?", theme: "endearment", baseDifficultyMod: 4, heatTier: 4 },
  { text: "Do you like being worshipped?", theme: "worship", baseDifficultyMod: 5, heatTier: 4 },
  { text: "If I pulled you into my lap, what would you do?", theme: "assertive", baseDifficultyMod: 5, heatTier: 4 },

  // Tier 5 – Erotic, Emotional Endgame
  { text: "Do you love me? Be honest.", theme: "serious", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Could you ever see us having a future together?", theme: "endgame", baseDifficultyMod: 5, heatTier: 5 },
  { text: "If I needed you to run away with me, would you?", theme: "commitment", baseDifficultyMod: 6, heatTier: 5 },
  { text: "What would it take for you to give up everything for someone?", theme: "sacrifice", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Would you still care for me if I lost everything?", theme: "devotion", baseDifficultyMod: 6, heatTier: 5 },
  { text: "If you woke up and I was gone forever, what would you miss most?", theme: "melancholy", baseDifficultyMod: 6, heatTier: 5 },
  { text: "If I asked you to disappear with me, would you say yes?", theme: "devotion", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Do you think soulmates are real… and are we?", theme: "endgame", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Could you be happy with just me, and no one else?", theme: "commitment", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Would you wait a lifetime if it meant we'd be together in the end?", theme: "patience", baseDifficultyMod: 6, heatTier: 5 },
  { text: "If I forgot who you were tomorrow, how would you remind me?", theme: "devastation", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Could you walk away from me if it meant I'd be safer?", theme: "sacrifice", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Would you rather die in my arms, or live not knowing if I loved you?", theme: "tragedy", baseDifficultyMod: 7, heatTier: 5 },
  { text: "If this world burned down tomorrow, would you still choose me?", theme: "rideordie", baseDifficultyMod: 6, heatTier: 5 },
  { text: "What scares you more—losing me or never having me at all?", theme: "attachment", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Would you still love me if I lost my mind?", theme: "devotion", baseDifficultyMod: 6, heatTier: 5 },
  { text: "What's more important—freedom or loyalty?", theme: "conflict", baseDifficultyMod: 6, heatTier: 5 },
  { text: "If I gave you everything, would it be enough?", theme: "yearning", baseDifficultyMod: 6, heatTier: 5 },
  { text: "If I whispered 'stay', would you?", theme: "poetic", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Are you mine?", theme: "claiming", baseDifficultyMod: 7, heatTier: 5 },
  { text: "Would you kneel for someone like me?", theme: "submission", baseDifficultyMod: 6, heatTier: 5 },
  { text: "If I pushed you against the wall, would you resist?", theme: "dominance", baseDifficultyMod: 7, heatTier: 5 },
  { text: "Do you want to be ruined slowly… or all at once?", theme: "control", baseDifficultyMod: 7, heatTier: 5 },
  { text: "What would you do if I told you not to make a sound?", theme: "tease", baseDifficultyMod: 7, heatTier: 5 },
  { text: "Where would you want me to bite first?", theme: "nsfw", baseDifficultyMod: 7, heatTier: 5 },
  { text: "Would you let me use you, if I promised to worship you after?", theme: "powerplay", baseDifficultyMod: 7, heatTier: 5 },
  { text: "If I said 'hands behind your back,' what would you do?", theme: "command", baseDifficultyMod: 7, heatTier: 5 },
  { text: "Do you ache for the kind of touch that leaves bruises or poetry?", theme: "poetic", baseDifficultyMod: 7, heatTier: 5 },
  { text: "Would you obey if I told you not to move?", theme: "control", baseDifficultyMod: 6, heatTier: 5 },
  { text: "Would you rather moan my name or beg for forgiveness?", theme: "blasphemy", baseDifficultyMod: 8, heatTier: 5 },
  { text: "What would you whisper in my ear if I were on my knees?", theme: "reversal", baseDifficultyMod: 7, heatTier: 5 },
  { text: "What part of your body begs for attention but never asks?", theme: "vulnerable", baseDifficultyMod: 6, heatTier: 5 },
  { text: "If I told you I dreamed of tying you up, would you sleep better or worse tonight?", theme: "fantasy", baseDifficultyMod: 7, heatTier: 5 },
  { text: "Would you still want me if I said you'd have to earn every touch?", theme: "challenge", baseDifficultyMod: 6, heatTier: 5 },
  { text: "What would you let me do… if I said please?", theme: "restraint", baseDifficultyMod: 6, heatTier: 5 }

];

  
  // ================================
  // Select a valid prompt based on relationship
  // ================================
  
  setup.getConvoPrompt = function (npc) {
    const turn = State.temporary.convo?.turn ?? 1;
    const currentHeatTier = Math.min(5, Math.ceil(turn / 5)); // One tier per 5 turns
  
    const valid = setup.ConvoPrompts.filter(p => p.heatTier === currentHeatTier);
    const unseen = setup.ConvoPromptTracker.filterUnseen(valid);
  
    const chosen = unseen.length > 0 ? randomFrom(unseen) : randomFrom(valid);
  
    setup.ConvoPromptTracker.markShown(chosen.text);
    return chosen;
  };
  
  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
// ================================
// Prompt Tracker (optional enhancement)
// ================================

setup.ConvoPromptTracker = {
    shownThisSession: [],
  
    reset() {
      this.shownThisSession = [];
      console.log("[ConvoPrompt] Tracker reset");
    },
  
    markShown(promptText) {
      this.shownThisSession.push(promptText);
    },
  
    filterUnseen(validPrompts) {
      return validPrompts.filter(p => !this.shownThisSession.includes(p.text));
    }
  };
  