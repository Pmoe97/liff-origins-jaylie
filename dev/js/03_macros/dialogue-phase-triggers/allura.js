/* Allura Conversation Options Phase 0 */
setup.allura_Conversation_Options_Phase0 = function () {
	setup.addChoices([
		["You seem very sure of yourself.", "Allura_SureOfSelf", 0],
		["What brings someone like you to a place like this?", "Allura_WhyHere", 0],
		["What would you do with someone like me?", "Allura_TeaseIntent", 0],
		["Do you think you could help me get a drink?", "Allura_OrderDrink", 0 ],
		["I just want to get to know you better.", "Allura_StartMinigame", 1],  // ✅ marked reusable
		["Nevermind.", "ReturnToParlor", 1]  // ✅ marked reusable
	]);
};

/* Allura Conversation Options Phase 1 */
setup.allura_Conversation_Options_Phase1 = function () {
	setup.addChoices([
		["What do you really want from people?", "Allura_WhatSheWants", 0],
		["Do you ever feel alone, even here?", "Allura_FeelsAlone", 0],
		["Is there someone you miss?", "Allura_SomeoneMissed", 0],
		["Do you believe in love?", "Allura_BelievesInLove", 0],
		["We don’t have to talk about this.", "Allura_ReturnToLight", 1]  // ✅ reusable (exit option)
	]);
};
