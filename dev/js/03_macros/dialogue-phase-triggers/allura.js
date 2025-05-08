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
