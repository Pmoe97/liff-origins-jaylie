setup.redmarrow_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "You always dress this sharp?", target: "Redmarrow_ArmorFlattery" },
		{ label: "What do you do for work?", target: "Redmarrow_JobPrompt" },
		{ label: "Redmarrow? That your real name?", target: "Redmarrow_NameOrigin", variable: "Read_Phase0_redmarrow_Redmarrow_JobPrompt", hide: true },
		{ label: "Can anyone take work from the Guild?", target: "Redmarrow_BountyQuest", variable: "Read_Phase0_redmarrow_Redmarrow_JobPrompt", hide: true },
		{ label: "About that job...", target: "Redmarrow_TheJob", variable: "readyForBoutyQuestion", hide: true, reuse:1 },
		{ label: "Enjoy your night.", target: "Redmarrow_Exit", reuse: 1 }
	]);
};

 

setup.redmarrow_Conversation_Options_TheFirstBounty = function () {
	setup.smartChoices([
		{
			label: "[Pay 20 :coin:] I would like to sign up for the guild.",
			target: "Redmarrow_BountySignUp",
			item: ["gold_coin", 20],
			hide: false
		},
        {label: "Can you tell who the target is again?", target: "Redmarrow_WhoIsItAgain", variable: "Read_TheFirstBounty_redmarrow_Redmarrow_BountySignUp", hide: true, reuse: 1},
		{label: "How should I find him?", target: "HowFindTelVaras", variable: "Read_TheFirstBounty_redmarrow_Redmarrow_BountySignUp", hide: true, reuse: 1},
		{label: "How much is this job paying again?", target: "TelVarasHowMuchPay", variable: "Read_TheFirstBounty_redmarrow_Redmarrow_BountySignUp", hide: true, reuse: 1},
		{label: "Is there anything else I should know?", target: "TelVarasAnythingElse", variable: "Read_TheFirstBounty_redmarrow_Redmarrow_BountySignUp", hide: true, reuse: 1 },
       	{ label: "Let's talk about something else.", target: "Redmarrow_ReturnBountytoPhase0", reuse: 1}
	]);

	// 👇 Inject Lucide icons for any :coin: placeholders
	setTimeout(() => {
	// Replace any span or text node that includes :coin: with actual icon injection
	$("#convoChoices p.dialogue-choice").each(function () {
		const $this = $(this);
		const html = $this.html();
		if (html.includes(":coin:")) {
			$this.html(html.replace(/:coin:/g, '<i data-lucide="coins"></i>'));
		}
	});
	if (window.lucide) lucide.createIcons();
}, 0);

};