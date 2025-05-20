setup.redmarrow_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "You always dress this sharp?", target: "Redmarrow_ArmorFlattery" },
		{ label: "What do you do for work?", target: "Redmarrow_JobPrompt" },
		{ label: "Redmarrow? That your real name?", target: "Redmarrow_NameOrigin", variable: "Read_Phase0_redmarrow_Redmarrow_JobPrompt", hide: true },
		{ label: "Can anyone take work from the Guild?", target: "Redmarrow_BountyQuest", variable: "Read_Phase0_redmarrow_Redmarrow_JobPrompt", hide: true },
		{ label: "Enjoy your night.", target: "Redmarrow_Exit", reuse: 1 }
	]);
};
 