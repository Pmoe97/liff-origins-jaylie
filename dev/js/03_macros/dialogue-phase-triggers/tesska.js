// =======================
// Tesska Phase 0 Trigger Function
// =======================

setup.tesska_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "Can I get a drink?", target: "Tesska_GetDrink" },
		{ label: "It's kind of quiet in here tonight.", target: "Tesska_QuietNight" },
		{ label: "Do you always work nights?", target: "Tesska_WorkNights" },
		{ label: "Thanks, I think I’ll just sit quietly for a bit.", target: "Tesska_Exit", hide: State.variables.tesskaOrderedDrink === true },
		{ label: "Thanks, I think I’m going to nurse this drink for a while.", target: "Tesska_ExitDrink", hide: State.variables.tesskaOrderedDrink !== true },
		{ label: "How long have you and Harroc been running this place?", target: "Tesska_RunningThePlace", logic: "and", variable: "tesskaAskedWorkNights" },
		{ label: "Do you get many unusual customers?", target: "Tesska_UnusualCustomers" },
	]);
};