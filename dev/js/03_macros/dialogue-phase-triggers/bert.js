setup.bert_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "What's on the menu?", target: "Bert_OpenShop", reuse: 1 },
		{ label: "What kind of drink would you make for me?", target: "Bert_CustomDrink" },
		{ label: "Why so serious?",	target: "Bert_SeriousResponse" },
		{label: "I want to get to know you better.", target: "Bert_DenyMinigame" },
		{ label: "Nevermind.", target: "Bert_ReturnToParlor", reuse: 1 }
	]);
};
