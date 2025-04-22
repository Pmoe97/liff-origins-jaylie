/**
 * Darian Conversation Setup Functions
 * Phase-based choice logic matching the .tw widget definitions.
 */

/* Adds options for Phase 0: initial conversation */
setup.darian_Conversation_Options_Phase0 = function () {
    setup.addChoices([
      ["So how long have you worked here?", "Darian_HowLongHere"],
      ["Do you actually like working here?", "Darian_DoYouLikeJob"],
      ["That bracelet... where did you get it?", "Darian_Bracelet"],
      ["Do you think you could help me get a drink?", "Darian_GetDrink"],
      ["I just want to get to know you better.", "Darian_StartMinigame"]
    ]);
  };

/* Adds options unlocked if Jaylie passes the trust threshold for bracelet backstory */
setup.darian_Conversation_Options_SisterBranch = function () {
    setup.addChoices([
      ["What was your sister like?", "Darian_Sister_WhatWasSheLike"],
      ["How did your sister die?", "Darian_Sister_HowDidSheDie"],
      ["Tell me more about the bracelet.", "Darian_Sister_BraceletMemory"],
      ["We can talk about something else now.", "Darian_Sister_ReturnToMain"]
    ]);
  };

/* Placeholder for Phase 1 — can be implemented after minigame or relationship gain */
setup.darian_Conversation_Options_Phase1 = function () {
    setup.addChoices([
      ["Do you ever miss singing?", "Darian_MissSinging"],
      ["Do you actually like people... or is it just the job?", "Darian_LikesPeople"],
      ["You’re kind of terrible at flirting when you’re nervous.", "Darian_BadFlirt"],
      ...setup.if(State.variables.characters.darian.affection >= 6, [
        ["Would you go upstairs with me?", "Darian_GoUpstairs"]
      ]),
      ["Let’s go back to lighter conversation.", "PHASE_0"]
    ]);
  };
