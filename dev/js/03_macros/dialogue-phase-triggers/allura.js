setup.allura_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{label: "Were you watching me?", target: "Allura_Watching" },
		{label: "Don’t take this the wrong way, but you feel out of place here a little.",target: "Allura_OutOfPlace"},
		{ label: "Do you actually enjoy doing this?", target: "Allura_Enjoyment" },
		{ label: "Can I do anything to make your night?", 	target: "Allura_WhatCanIDo"},
		{label: "Would you mind ordering a drink for me?", target: "Allura_DrinkOrder"},
		{ label: "Would you want to go somewhere more private?", target: "Allura_GoSomewherePrivate", trust: ["allura", 4], aff: ["allura", 4], logic: "and", hide: false},
		{ label: "We can talk more later.", target: "Allura_ReturnToParlor", reuse: 1, notVariable: "Read_Phase0_allura_Allura_GoSomewherePrivate", hide: true}
	]);
};

setup.allura_Conversation_Options_Phase1 = function () {
	setup.smartChoices([
		{
		label: "Your room is beautiful. Do they all look like this?",
		target: "AlluraRoom",
		notVariable: "Read_Phase1_allura_Allura_GetComfortable",
		hide: true
		},
		{
		label: "So… what do we do now?",
		target: "Allura_WhatDoNow",
		notVariable: "Read_Phase1_allura_Allura_GetComfortable",
		hide: true
		},
		{ label: "Do you mind if I get comfortable with you?", target: "Allura_GetComfortable" },
		{ label: "I want to get to know you better.", target: "AlluraOpenConvoMinigameOne", variable: "Read_Phase1_allura_Allura_GetComfortable", hide: false },
		{ label: "Can I ask you a little bit about your past?", target: "BackstoryStart", variable: "Read_Phase1_allura_Allura_GetComfortable", hide: false },
		{
			label: "Can I kiss you?",
			target: "KissAllura",
			variable: "Read_Phase1_allura_Allura_GetComfortable",
			notVariable: "Read_Phase1_allura_JustLay",
			aff: ["allura", 9],
			trust: ["allura", 10],
			hide: true
		},
		{
			label: "If it's alright… I’d like to just lay here with you.",
			target: "JustLay",
			variable: "Read_Phase1_allura_Allura_GetComfortable",
			notVariable: "Read_Phase1_allura_KissAllura",
			hide: true
		}
		  
		
	]);
};

setup.allura_Conversation_Options_alluraBackstory = function () {
	setup.smartChoices([
		{ label: "Where did you grow up?", target: "WhereAlluraGrewUp" },
		{ label: "Do you know much about your parents?", target: "Parentage" },
		{ label: "If you could go anywhere in the world, where would it be?", target: "TravelWish" },
		{ label: "What's the worst or strangest client you've ever had?", target: "StrangeClient" },
		{ label: "Let’s talk about something else.", target: "BackstoryExit", reuse: 1 }
	]);
};

