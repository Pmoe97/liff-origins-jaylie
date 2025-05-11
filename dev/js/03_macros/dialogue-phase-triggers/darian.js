/**
 * Darian Conversation Setup Functions
 * Phase-based choice logic matching the .tw widget definitions.
 */

/* Adds options for Phase 0: initial conversation */
setup.darian_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{
			label: "How long have you worked here?",
			target: "Darian_HowLongHere"
		},
		{
			label: "Do you actually enjoy this job?",
			target: "Darian_DoYouLikeJob"
		},
		{
			label: "That bracelet you're wearing... where did it come from?",
			target: "Darian_Bracelet"
		},
		{
			label: "Any chance I could convince you to pour me a drink?",
			target: "Darian_GetDrink"
		},
		{
			label: "You hum a lot. Were you a musician once?",
			target: "Darian_Humming"
		},		
		{
			label: "I’d like to get to know you better.",
			target: "Darian_StartMinigame",
			reuse: 0
		},
		{
			label: "Do you think we could go somewhere more private?",
			target: "Darian_GoPrivate",
			trust: ["darian", 8],
			aff: ["darian", 8],
			logic: "or"
		},
		{
			label: "Nevermind.",
			target: "Darian_ReturnToParlor",
			reuse: 1
		}
	]);
};


/* Adds options unlocked if Jaylie passes the trust threshold for bracelet backstory */
setup.darian_Conversation_Options_SisterBranch = function () {
	setup.addChoices([
		["What was your sister like?", "Darian_Sister_WhatWasSheLike", 0],
		["How did your sister die?", "Darian_Sister_HowDidSheDie", 0],
		["Tell me more about the bracelet.", "Darian_Sister_BraceletMemory", 0],
		["We can talk about something else now.", "Darian_Sister_ReturnToMain", 1] // ✅ Return branch
	]);
};


/* Placeholder for Phase 1 — can be implemented after minigame or relationship gain */
setup.darian_Conversation_Options_Phase1 = function () {
	setup.addChoices([
		["Do you ever miss singing?", "Darian_MissSinging", 0],
		["Do you actually like people... or is it just the job?", "Darian_LikesPeople", 0],
		["You're kind of terrible at flirting when you're nervous.", "Darian_BadFlirt", 0],
		...setup.if(State.variables.characters.darian.affection >= 6, [
			["Would you go upstairs with me?", "Darian_GoUpstairs", 0]
		]),
		["Let's go back to lighter conversation.", "PHASE_0", 1] // ✅ Phase switcher
	]);
};

