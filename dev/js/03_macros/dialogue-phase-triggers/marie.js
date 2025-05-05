setup.marie_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "How are you doing?", target: "Marie_Howareyoudoing" },
		{ label: "Looks like you've had a rough night.", target: "Marie_ToughNight" },
		{ label: "I'm a good listener.", target: "Marie_SilentTreatment" },
		{ label: "I'm sorry, I'll go.", target: "Marie_ImSorryIllGo", variable: "marieCanApologize", hide: true }
	]);
};

setup.marie_Conversation_Options_Phase1 = function () {
	setup.smartChoices([
		{ label: "Why did you choose this kind of work?", target: "Marie_WhyThisWork" },
		{ label: "Are you friends with any of the other hosts?", target: "Marie_HostsOrFriends" },
		{ label: "Do you like it at the Noctail?", target: "DoYouLikeItHere" },
		{ label: "Have you ever lived anywhere else?", target: "Marie_LivedAnywhereElse" },
		{ label: "Are you looking forward to the fair tomorrow?", target: "Marie_TheFairTomorrow" },
		{ label: "I'd like to get to know you better.", target: "Marie_StartMinigameOne", reuse: 1 },
		{ label: "We can talk more later.", target: "Marie_Phase1Goodbye" },
		{ label: "Do you think we could go somewhere more private?", target: "Marie_GoUpstairs", aff: ["marie", 8], trust: ["marie", 8], logic: "or", hide: false} //The option in question.

	]);
};
