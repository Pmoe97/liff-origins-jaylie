setup.adda_Conversation_Options_Phase0 = function () {
	setup.smartChoices([
		{ label: "This place... it’s yours?", target: "Adda_ThisPlaceIsYours" },
		{ label: "Your hosts really seem to care about you.", target: "Adda_HostsCare" },
		{ label: "You seem... different from the others.", target: "Adda_Different" },
		{ label: "How’d you end up starting this place?", target: "Adda_OriginStory", variable: "addaMentionedTakeover", hide: true },
		{ label: "You don’t seem like someone people say no to.", target: "Adda_CommandPresence" },
		{ label: "Could you help me get a drink?", target: "Adda_OrderDrink" },
		{ label: "Can I get to know you better?", target: "Adda_StartMinigame", reuse: 1 },
		{ label: "Would you ever step away for something a little more private?", target: "Adda_GoPrivate", aff: ["adda", 10], trust: ["adda", 10], hide: true, logic: "or"},
        { label: "We can talk more later.", target: "GoodbyeAddaZero", reuse: 1 }
        
	]);
};

setup.adda_Conversation_Options_NoctailOrigin = function () {
	setup.smartChoices([
		{ label: "What was the brothel like before you took over?", target: "Adda_Origin_WhatWasItLike" },
		{ label: "Who was the previous owner?", target: "Adda_Origin_PreviousOwner" },
		{ label: "How did you get control of the place?", target: "Adda_Origin_HowSheTookIt" },
		{ label: "What changed under your leadership?", target: "Adda_Origin_ChangesMade" },
		{ label: "Any enemies left over from those days?", target: "Adda_Origin_LocalPolitics" },
		{ label: "Let’s talk about something else.", target: "Adda_Origin_Exit", reuse: 1 }
	]);
};