setup.brakka_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "How are you doing tonight?", target: "Brakka_Howareyoutonight" },
        { label: "Why 'Silks'?", target: "Brakka_WhySilks", compare: {value: "$calledSilks", op: ">=", against: 3 }, hide: true },
		{ label: "You look like you’ve seen some fights.", target: "Brakka_FightComment" },
		{ label: "I just wanted to say hi.", target: "Brakka_HelloAttempt" },
		{ label: "Enjoy your meal.", target: "Brakka_ExitwithTournyInvite", notVariable: "Read_Phase0_brakka_Brakka_ExitwithTournyInvite", hide: true },
        { label: "Enjoy your meal.", target: "Brakka_ExitNormally", variable: "Read_Phase0_brakka_Brakka_ExitwithTournyInvite", reuse: 1, hide: true}
	]);
};
