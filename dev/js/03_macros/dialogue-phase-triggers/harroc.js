 setup.harroc_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "Could I get a drink, please?", target: "Harroc_OrderDrink" },
		{ label: "[Open Shop *placeholder*] Do you have a food menu, or is it just drinks?", target: "Harroc_OpenShop" },
		{ label: "Has it always been this quiet in here?", target: "Harroc_RecentEvents" },
		{ label: "Heard any interesting rumors lately?", target: "Harroc_Rumors" },
		{ label: "I'll let you get back to it.", target: "Harroc_Phase0_Goodbye", reuse: 1 }
	]);
};
