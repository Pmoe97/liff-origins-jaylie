setup.bert_Conversation_Options_Phase0 = function () {
	setup.addChoices([
		["I want to get to know you better.", "Bert_DenyMinigame", 0],
		["What is on the menu?", "Bert_OpenShop", 1],
		["What kind of drink would you make for me?", "Bert_CustomDrink", 0],
		["You seem really serious.", "Bert_SeriousResponse", 0],
		["Nevermind.", "ReturnToParlor", 1]
	]);
};
