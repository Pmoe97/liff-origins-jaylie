// =======================
// Tesska Phase 0 Trigger Function
// =======================

setup.tesska_Conversation_Options_Phase0 = function () {
	console.log("Tesska Ordered Drink:", State.variables.tesskaOrderedDrink);
	setup.smartChoices([
		{ label: "Can I get a drink?", target: "Tesska_GetDrink" },
		{ label: "It's kind of quiet in here tonight.", target: "Tesska_QuietNight" },
		{ label: "Do you always work nights?", target: "Tesska_WorkNights" },
		{ label: "How long have you and Harroc been running this place?", target: "Tesska_RunningThePlace", logic: "and", variable: "tesskaAskedWorkNights", hide: true },
		{ label: "Do you get many unusual customers?", target: "Tesska_UnusualCustomers" },
		{label: "Thanks, I think I'll just sit quietly for a bit.",	target: "Tesska_Exit", variable: "!tesskaOrderedDrink",	hide: true },
		{label: "Thanks, I think I'm going to nurse this drink for a while.",	target: "Tesska_ExitDrink",	variable: "tesskaOrderedDrink",	hide: true },
		  
	]);
};