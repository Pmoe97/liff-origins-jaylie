 setup.harroc_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "Could I get a drink, please?", target: "Harroc_OrderDrink" },
		{ label: "Do you have a food menu, or is it just drinks?", target: "Harroc_OpenShop" },
		{ label: "Has it always been this quiet in here?", target: "Harroc_RecentEvents" },
		{ label: "Heard any interesting rumors lately?", target: "Harroc_RumorIntro" },
		{ label: "Never mind. I’ll let you get back to it.", target: "Harroc_Phase0_Goodbye", reuse: 1 }
	]);
};

setup.harroc_Conversation_Options_Rumors = function () {
	setup.smartChoices([
		{ label: "What’s going on with the docks?", target: "Harroc_Rumor_Docks" },
		{ label: "Why so many guards in the outer wards?", target: "Harroc_Rumor_Wards" },
		{ label: "What really happened in the lower market?", target: "Harroc_Rumor_MarketCollapse" },
		{ label: "Let’s talk about something else.", target: "Harroc_Rumor_Exit", reuse: 1 }
	]);
};