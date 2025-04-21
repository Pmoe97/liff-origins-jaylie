/* ======================================================
   Conversation Prompt Library
   ------------------------------------------------------
   Random prompt selector for the minigame. Each prompt:
   - Has a theme
   - Adjusts base difficulty
   - Unlocks at a trust+affection threshold
========================================================= */

setup.ConvoPrompts = [
    // Relationship Level: 0+ (Neutral)
    {text: "I almost didn’t get out of bed this morning.", theme: "emotional", baseDifficultyMod: 0, unlockAt: 0 },
    {text: "Ever think about just leaving it all behind?", theme: "contemplative", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "You seem different from the others here. Why is that?", theme: "curious", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "How do you normally spend your nights?", theme: "smalltalk", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "What do you think people misunderstand about you?", theme: "personal", baseDifficultyMod: 2, unlockAt: 0 },
    {text: "What’s your drink of choice?", theme: "light", baseDifficultyMod: 0, unlockAt: 0 },
    {text: "What kind of weather puts you in a good mood?", theme: "light", baseDifficultyMod: 0, unlockAt: 0 },
    {text: "If you could have any animal as a companion, what would it be?", theme: "whimsy", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "Is there a food you just can’t stand?", theme: "quirky", baseDifficultyMod: 0, unlockAt: 0 },
    {text: "What’s the strangest dream you’ve ever had?", theme: "weird", baseDifficultyMod: 2, unlockAt: 0 },
    {text: "So… what do you think people assume about me?", theme: "reflective", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "Ever have one of those days where everything feels fake?", theme: "melancholy", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "Do you believe in fate, or is everything just random?", theme: "philosophy", baseDifficultyMod: 2, unlockAt: 0 },
    {text: "What would your perfect day look like if no one was watching?", theme: "dreamy", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "Do you ever feel like you’re just pretending to be okay?", theme: "emotional", baseDifficultyMod: 2, unlockAt: 0 },
    {text: "If you could erase one regret, would you do it?", theme: "contemplative", baseDifficultyMod: 2, unlockAt: 0 },
    {text: "What’s your idea of comfort food?", theme: "quirky", baseDifficultyMod: 0, unlockAt: 0 },
    {text: "Tell me a sound that makes you feel calm.", theme: "soft", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "What’s something small that always makes you smile?", theme: "light", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "What do you do when no one’s watching?", theme: "curious", baseDifficultyMod: 2, unlockAt: 0 },
    {text: "Are you more of a sunrise or sunset person?", theme: "whimsy", baseDifficultyMod: 0, unlockAt: 0 },
    {text: "What's the most unusual habit you have?", theme: "quirky", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "Do you talk to yourself? Out loud?", theme: "oddball", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "Do you find silence peaceful or uncomfortable?", theme: "introspective", baseDifficultyMod: 1, unlockAt: 0 },
    {text: "What do you notice first when you walk into a room?", theme: "perception", baseDifficultyMod: 1, unlockAt: 0 },

    // Relationship Level: 25+ (Getting Close)
    {text: "Do you think I’m attractive?", theme: "flirty", baseDifficultyMod: 2, unlockAt: 25 },
    {text: "What kind of touch calms you down the most?", theme: "sensual", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "Have you ever fallen for someone you shouldn’t have?", theme: "romantic", baseDifficultyMod: 2, unlockAt: 25 },
    {text: "Do you like the sound of your own name on someone else's lips?", theme: "flirty", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "What would you do if I leaned in closer right now?", theme: "intimate", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "Would you rather share a bed with someone or sleep alone?", theme: "personal", baseDifficultyMod: 2, unlockAt: 25 },
    {text: "How do you know when you’re falling for someone?", theme: "romantic", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "What’s the most romantic thing someone’s done for you?", theme: "romantic", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "How would you react if I told you I had a crush on you?", theme: "flirty", baseDifficultyMod: 2, unlockAt: 25 },
    {text: "What’s the most flattering thing someone’s said to you?", theme: "vanity", baseDifficultyMod: 2, unlockAt: 25 },
    {text: "What part of your body do you secretly like the most?", theme: "personal", baseDifficultyMod: 2, unlockAt: 25 },
    {text: "What’s something subtle that turns you on?", theme: "flirty", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "Would you let someone kiss you without asking?", theme: "boundaries", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "What does your ideal first kiss look like?", theme: "romantic", baseDifficultyMod: 2, unlockAt: 25 },
    {text: "Do you like it when someone takes the lead?", theme: "flirty", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "If I whispered something naughty to you, would you blush or smirk?", theme: "tease", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "How long would it take you to fall for someone like me?", theme: "challenge", baseDifficultyMod: 3, unlockAt: 25 },
    {text: "What’s the difference between lust and affection for you?", theme: "philosophical", baseDifficultyMod: 2, unlockAt: 25 },

    // Relationship Level: 50+ (Personal)
    {text: "What would you do if we were alone right now?", theme: "intimate", baseDifficultyMod: 4, unlockAt: 50 },
    {text: "Is there a secret you’ve never told anyone?", theme: "confessional", baseDifficultyMod: 3, unlockAt: 50 },
    {text: "What scares you most about getting close to someone?", theme: "vulnerable", baseDifficultyMod: 3, unlockAt: 50 },
    {text: "What does your ideal night look like—no limits?", theme: "dreamy", baseDifficultyMod: 3, unlockAt: 50 },
    {text: "Do you trust easily? Or does it take time?", theme: "guarded", baseDifficultyMod: 3, unlockAt: 50 },
    {text: "Have you ever been hurt so badly it changed you?", theme: "emotional", baseDifficultyMod: 4, unlockAt: 50 },
    {text: "If you could forget one memory forever, what would it be?", theme: "regret", baseDifficultyMod: 4, unlockAt: 50 },
    {text: "Is there something you’ve never forgiven yourself for?", theme: "emotional", baseDifficultyMod: 4, unlockAt: 50 },
    {text: "How do you act when you're falling in love?", theme: "romantic", baseDifficultyMod: 4, unlockAt: 50 },
    {text: "What do you crave more—intimacy or understanding?", theme: "introspective", baseDifficultyMod: 4, unlockAt: 50 },
    {text: "What’s something that always makes you feel safe?", theme: "comfort", baseDifficultyMod: 3, unlockAt: 50 },
    {text: "What’s your biggest fear about being loved?", theme: "vulnerability", baseDifficultyMod: 4, unlockAt: 50 },
    {text: "What part of yourself do you hide from most people?", theme: "shadow", baseDifficultyMod: 4, unlockAt: 50 },
    {text: "What do you miss most about being a child?", theme: "nostalgia", baseDifficultyMod: 3, unlockAt: 50 },
    {text: "How do you know when it’s safe to open up?", theme: "defense", baseDifficultyMod: 3, unlockAt: 50 },
    {text: "What would hurt you more—being forgotten or being betrayed?", theme: "trust", baseDifficultyMod: 4, unlockAt: 50 },
    
    // Relationship Level: 75+ (Erotic / Deep Trust)
    {text: "What’s the dirtiest thought you’ve had today?", theme: "nsfw", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "Would you let someone tie you up?", theme: "kink", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "If we had just one night together, how would it go?", theme: "fantasy", baseDifficultyMod: 4, unlockAt: 75 },
    {text: "Where do you like to be touched most?", theme: "sensual", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "What’s something you’ve always wanted to try but haven’t?", theme: "bold", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "Do you like being teased? Or do you prefer control?", theme: "playful", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "What’s your favorite way to be kissed?", theme: "nsfw", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "What would you do if I bit your lip mid-sentence?", theme: "tease", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "Do you like it slow, or do you prefer when things get rough?", theme: "nsfw", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "What’s your favorite part of foreplay?", theme: "sensual", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "If I blindfolded you right now, what would you imagine me doing?", theme: "fantasy", baseDifficultyMod: 6, unlockAt: 75 },
    {text: "Would you rather tease or be teased?", theme: "kinkplay", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "Where do your thoughts go when your hands are idle?", theme: "suggestive", baseDifficultyMod: 5, unlockAt: 75 },
    {text: "If you were told to beg, would you?", theme: "dominance", baseDifficultyMod: 6, unlockAt: 75 },
    {text: "Do you want to be touched like a secret or like a prayer?", theme: "poetic", baseDifficultyMod: 6, unlockAt: 75 },
    {text: "If we were alone, right now, what would your hands do first?", theme: "anticipation", baseDifficultyMod: 6, unlockAt: 75 },

    // Relationship Level: 100+ (Devotion)
    {text: "Do you love me? Be honest.", theme: "serious", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "Could you ever see us having a future together?", theme: "endgame", baseDifficultyMod: 5, unlockAt: 100 },
    {text: "If I needed you to run away with me, would you?", theme: "commitment", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "What would it take for you to give up everything for someone?", theme: "sacrifice", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "If this world burned down tomorrow, would you still choose me?", theme: "rideordie", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "Would you still care for me if I lost everything?", theme: "devotion", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "If you woke up and I was gone forever, what would you miss most?", theme: "melancholy", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "What scares you more—losing me or never having me at all?", theme: "attachment", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "If I asked you to disappear with me, would you say yes?", theme: "devotion", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "Do you think soulmates are real… and are we?", theme: "endgame", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "Could you be happy with just me, and no one else?", theme: "commitment", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "Would you rather die in my arms, or live not knowing if I loved you?", theme: "tragedy", baseDifficultyMod: 7, unlockAt: 100 },
    {text: "Would you wait a lifetime if it meant we'd be together in the end?", theme: "patience", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "If I forgot who you were tomorrow, how would you remind me?", theme: "devastation", baseDifficultyMod: 6, unlockAt: 100 },
    {text: "Could you walk away from me if it meant I’d be safer?", theme: "sacrifice", baseDifficultyMod: 6, unlockAt: 100 },

  ];
  
  // ================================
  // Select a valid prompt based on relationship
  // ================================
  
  setup.getConvoPrompt = function (npc) {
    const intimacy = (npc.trust ?? 0) + (npc.affection ?? 0);
    const valid = setup.ConvoPrompts.filter(p => intimacy >= p.unlockAt);
    return valid.length > 0 ? randomFrom(valid) : {
      text: "You sit together in silence.", theme: "neutral", baseDifficultyMod: 0, unlockAt: 0
    };
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
  