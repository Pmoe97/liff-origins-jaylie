setup.allura_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{label: "Were you watching me?", target: "Allura_Watching" },
		{label: "Don’t take this the wrong way, but you feel out of place here a little.",target: "Allura_OutOfPlace"},
		{ label: "Do you actually enjoy doing this?", target: "Allura_Enjoyment" },
		{ label: "Can I do anything to make your night?", 	target: "Allura_WhatCanIDo"},
		{label: "Would you mind ordering a drink for me?", target: "Allura_DrinkOrder"},
		{ label: "Would you want to go somewhere more private?", target: "Allura_GoSomewherePrivate", trust: ["allura", 10], aff: ["allura", 10], logic: "or", hide: false	},
		{ label: "We can talk more later.", target: "Allura_ReturnToParlor", reuse: 1
		}
	]);
};

setup.allura_Conversation_Options_Phase1 = function () {
	setup.smartChoices([
		{ label: "Your room is beautiful. Do they all look like this?", target: "YourRoom" },
		{ label: "So… what do we do now?", target: "WhatNow" },
		{ label: "Do you mind if I get comfortable with you?", target: "GetComfortable" },
		{ label: "Would it be alright if I asked about you?", target: "BackstoryStart" },
		{ label: "Can I kiss you?", target: "Kiss" },
		{ label: "If it's alright… I’d like to just lay here with you.", target: "JustLay", reuse: 1 },
		{ label: "We can talk more later.", target: "ReturnToParlor", reuse: 1 }
	]);
};

setup.allura_Conversation_Options_Backstory = function () {
	setup.smartChoices([
		{ label: "Where did you grow up?", target: "WhereGrewUp" },
		{ label: "What was your childhood like?", target: "Childhood" },
		{ label: "Do you know who your parents were?", target: "Parentage" },
		{ label: "If you could go anywhere in the world, where would it be?", target: "TravelWish" },
		{ label: "Let’s talk about something else.", target: "BackstoryExit", reuse: 1 }
	]);
};
