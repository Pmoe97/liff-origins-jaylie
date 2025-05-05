/* Allura Conversation Options Phase 0 */
setup.allura_Conversation_Options_Phase0 = function () {
	setup.addSmartChoices([
		{ label: "You seem very sure of yourself.", target: "Allura_SureOfSelf" },
		{ label: "What brings someone like you to a place like this?", target: "Allura_WhyHere" },
		{ label: "What would you do with someone like me?", target: "Allura_TeaseIntent" },
		{ label: "Do you think you could help me get a drink?", target: "Allura_OrderDrink" },
		{ label: "I just want to get to know you better.", target: "Allura_StartMinigame" },
		{ label: "Do you think maybe we could go somewhere more private?", target: "Allura_GoUpstairs", affection},
		{ label: "Nevermind.", target: "ReturnToParlor", reuse: 1 }
	]);
};

/* Allura Conversation Options Phase 1 */
setup.allura_Conversation_Options_Phase1 = function () {
	setup.addSmartChoices([
		{ label: "What do you really want from people?", target: "Allura_WhatSheWants" },
		{ label: "Do you ever feel alone, even here?", target: "Allura_FeelsAlone" },
		{ label: "Is there someone you miss?", target: "Allura_SomeoneMissed" },
		{ label: "Do you believe in love?", target: "Allura_BelievesInLove" },
		{ label: "We don’t have to talk about this.", target: "Allura_ReturnToLight", reuse: 1 }
	]);
};
