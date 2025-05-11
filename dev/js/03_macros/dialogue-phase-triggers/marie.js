setup.marie_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "How are you doing?", target: "Marie_Howareyoudoing" },
		{ label: "Looks like you've had a rough night.", target: "Marie_ToughNight" },
		{ label: "I'm a good listener.", target: "Marie_SilentTreatment" },
		{ label: "I'm sorry, I'll go.", target: "Marie_ImSorryIllGo", variable: "marieCanApologize", hide: true }
	]);
};

setup.marie_Conversation_Options_Phase1 = function () {
	setup.smartChoices([
		{ label: "Why did you choose this kind of work?", target: "Marie_WhyThisWork" },
		{ label: "Are you friends with any of the other hosts?", target: "Marie_HostsOrFriends" },
		{ label: "Do you like it at the Noctail?", target: "DoYouLikeItHere" },
		{ label: "Have you ever lived anywhere else?", target: "Marie_LivedAnywhereElse" },
		{ label: "Are you looking forward to the fair tomorrow?", target: "Marie_TheFairTomorrow" },
		{ label: "I'd like to get to know you better.", target: "Marie_StartMinigameOne", reuse: 0 },
		{ label: "Do you think we could go somewhere more private?", target: "Marie_GoUpstairs", aff: ["marie", 8], trust: ["marie", 8], logic: "or", hide: false}, //The option in question.
		{ label: "We can talk more later.", target: "Marie_Phase1Goodbye", notVariable: "Read_Phase1_marie_Marie_GoUpstairs", hide: true},
		

	]);
};

setup.marie_Conversation_Options_Phase2 = function () {
	setup.smartChoices([
		{
			label: "I really like your room. Do they all look like this?",
			target: "Marie_RoomComment"
		},
		{
			label: "What do you want to do now?",
			target: "Marie_WhatNow"
		},
		{
			label: "Do you want to talk about what happened outside?",
			target: "Marie_TalkAboutIt_Success",
			compare: {
			  value: "characters.marie.trust",
			  op: ">=",
			  against: 10
			},
			hide: true
		},  
		{
			label: "Do you want to talk about what happened outside?",
			target: "Marie_TalkAboutIt_Fail",
			compare: {
				value: "characters.marie.trust",
				op: "<",
				against: 10
			},
			hide: true
		},  
		{
			label: "Can I touch you?",
			target: "Marie_AskToTouch",
			aff: ["marie", 15],
			notVariable: "Read_Phase2_marie_Marie_LayAndTalk",
			hide: true,
		},
		{
			label: "Want to just lay here and talk for a bit?",
			target: "Marie_LayAndTalk",
			notVariable: "Read_Phase2_marie_Marie_AskToTouch",
			hide: true			
		}
	]);
};


setup.marie_Conversation_Options_TheFight = function () {
	setup.smartChoices([
		{
			label: "How long have you and Kallot been... whatever you are?",
			target: "Marie_Fight_HowLong"
		},
		{
			label: "Do you think he meant to hurt you?",
			target: "Marie_Fight_Intent"
		},
		{
			label: "Has he ever scared you before tonight?",
			target: "Marie_Fight_Pattern"
		},
		{
			label: "Do you think you’ll talk to him again after this?",
			target: "Marie_Fight_Forgiveness"
		},
		{
			label: "I helped him, you know...",
			target: "Jaylie_Helped_Kallot",
			variable: "helpedkallot",
			variable: "Read_TheFight_marie_Marie_Fight_Forgiveness",
			hide: true
			
		},
		{
			label: "What were you like before all this? Before the Noctail?",
			target: "Marie_Fight_Backstory"
		},
		{
			label: "We can talk about something else.",
			target: "Marie_Fight_Exit",
			reuse: 1
		}
	]);
};
