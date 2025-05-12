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
			trust: ["darian", 6],
			aff: ["darian", 3],
			logic: "and"
		},
		{
			label: "Nevermind.",
			target: "Darian_ReturnToParlor",
			notVariable: "Read_Phase0_darian_Darian_GoPrivate",
			reuse: 1,
			hide: true
		}
	]);
};

setup.darian_Conversation_Options_Phase1 = function () {
	setup.smartChoices([
		{
			label: "I like your room. Are they all like this?",
			target: "Darian_RoomComment"
		},
		{
			label: "So... what do we do now?",
			target: "Darian_WhatNow"
		},
		{
			label: "So how has your night been?",
			target: "Darian_HowsYourNight"
		},
		{
			label: "Do you mind if I ask you some more personal questions?",
			target: "Darian_AskDeeper",
			reuse: 1
		},
		{
			label: "Do you mind if I kiss you?",
			target: "Darian_AskToKiss",
			trust: ["darian", 9],
			aff: ["darian", 6],
			logic: "and",
			notVariable: "Read_Phase1_darian_Darian_MusicRequest"
		},
		{
			label: "Would it be too much trouble to pass the time with some music?",
			target: "Darian_MusicRequest",
			trust: ["darian", 14],
			aff: ["darian", 9],
			logic: "and",
			notVariable: "Read_Phase1_darian_Darian_AskToKiss"
		}
	]);
};

setup.darian_Conversation_Options_DarianDialogueDuet = function () {
	setup.smartChoices([
		{
			label: "Who gave you that bracelet?",
			target: "DarianDuet_Bracelet"
		},
		{
			label: "What was it like to travel around performing?",
			target: "DarianDuet_Performing"
		},
		{
			label: "Why did you start working at the Noctail?",
			target: "DarianDuet_WhyNoctail"
		},
		{
			label: "Did you ever fall in love on stage?",
			target: "DarianDuet_StageLove"
		},
		{
			label: "Do you ever miss the life you had before all this?",
			target: "DarianDuet_MissOldLife"
		},
		{
			label: "What’s the most beautiful thing you’ve ever seen?",
			target: "DarianDuet_MostBeautiful"
		},
		{
			label: "Let's talk about something else.",
			target: "ReturnToDarianPhase1",
			reuse: 1
		}
	]);
};

