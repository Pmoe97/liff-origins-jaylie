setup.SexualActsDB = {
	Oral_Penis_G_Tease: {
		label: "Tease Their Cock With Your Mouth",
		category: "Oral",
		actionType: "oral",
		stageGroup: "oral_penis",
		stageLevel: 0,
		giver: "player",
		receiver: "npc",
		subjectParts: ["mouth"],
		objectParts: ["penis"],
		canTakeVirginity: false,
		skillsRequired: {},
		baseExcitement: { subject: 1, object: 8 },
		preferenceTags: ["Oral_R", "Penis"],
		inclinationTags: ["tease", "service"],
		togglable: true
	},

	Oral_Penis_G_Suck: {
		label: "Suck Their Cock",
		category: "Oral",
		actionType: "oral",
		stageGroup: "oral_penis",
		stageLevel: 1,
		giver: "player",
		receiver: "npc",
		subjectParts: ["mouth"],
		objectParts: ["penis"],
		canTakeVirginity: false,
		skillsRequired: {},
		baseExcitement: { subject: 2, object: 15 },
		preferenceTags: ["Oral_R", "Penis"],
		inclinationTags: ["submission", "service"],
		togglable: true
	},

	Anal_G_Tease: {
		label: "Tease Their Asshole With Your Cock",
		category: "Anal",
		actionType: "anal",
		stageGroup: "anal_penis",
		stageLevel: 0,
		giver: "player",
		receiver: "npc",
		subjectParts: ["penis"],
		objectParts: ["anus"],
		canTakeVirginity: true,
		skillsRequired: {},
		baseExcitement: { subject: 6, object: 10 },
		preferenceTags: ["Anal_P", "Dominate"],
		inclinationTags: ["penetration", "dominance"],
		togglable: true
	},

	Anal_G_Penetrate: {
		label: "Penetrate Their Ass",
		category: "Anal",
		actionType: "anal",
		stageGroup: "anal_penis",
		stageLevel: 1,
		giver: "player",
		receiver: "npc",
		subjectParts: ["penis"],
		objectParts: ["anus"],
		canTakeVirginity: true,
		skillsRequired: {},
		baseExcitement: { subject: 12, object: 18 },
		preferenceTags: ["Anal_P", "Rough"],
		inclinationTags: ["penetration", "dominance"],
		togglable: true
	},

	Handjob_Clit_G_Tease: {
		label: "Tease Their Clit With Your Fingers",
		category: "Manual",
		actionType: "clitoral",
		stageGroup: "handjob_clit",
		stageLevel: 0,
		giver: "player",
		receiver: "npc",
		subjectParts: ["hand"],
		objectParts: ["clitoris"],
		canTakeVirginity: false,
		skillsRequired: {},
		baseExcitement: { subject: 1, object: 10 },
		preferenceTags: ["Clit_Rub", "Tease"],
		inclinationTags: ["gentle", "foreplay"],
		togglable: true
	},

	Handjob_Clit_G: {
		label: "Rub Their Clit",
		category: "Manual",
		actionType: "clitoral",
		stageGroup: "handjob_clit",
		stageLevel: 1,
		giver: "player",
		receiver: "npc",
		subjectParts: ["hand"],
		objectParts: ["clitoris"],
		canTakeVirginity: false,
		skillsRequired: {},
		baseExcitement: { subject: 2, object: 14 },
		preferenceTags: ["Clit_Rub", "Stimulation"],
		inclinationTags: ["service", "direct"],
		togglable: true
	},

	Boobjob_G_Tease: {
		label: "Tease Their Cock With Your Breasts",
		category: "Breast",
		actionType: "boobjob",
		stageGroup: "boobjob_penis",
		stageLevel: 0,
		giver: "player",
		receiver: "npc",
		subjectParts: ["breasts"],
		objectParts: ["penis"],
		canTakeVirginity: false,
		skillsRequired: {},
		baseExcitement: { subject: 1, object: 9 },
		preferenceTags: ["BreastPlay_R", "Oral_G"],
		inclinationTags: ["tease", "visual"],
		togglable: true
	},

	Boobjob_G: {
		label: "Give Them a Boobjob",
		category: "Breast",
		actionType: "boobjob",
		stageGroup: "boobjob_penis",
		stageLevel: 1,
		giver: "player",
		receiver: "npc",
		subjectParts: ["breasts"],
		objectParts: ["penis"],
		canTakeVirginity: false,
		skillsRequired: {},
		baseExcitement: { subject: 2, object: 16 },
		preferenceTags: ["BreastPlay_R", "Stimulation"],
		inclinationTags: ["visual", "submission"],
		togglable: true
	},

	Footjob_Vagina_G_Tease: {
		label: "Tease Their Pussy With Your Foot",
		category: "Feet",
		actionType: "footjob",
		stageGroup: "footjob_vagina",
		stageLevel: 0,
		giver: "player",
		receiver: "npc",
		subjectParts: ["feet"],
		objectParts: ["vagina"],
		canTakeVirginity: false,
		skillsRequired: {},
		baseExcitement: { subject: 1, object: 9 },
		preferenceTags: ["Feet", "Pussy"],
		inclinationTags: ["fetish", "control"],
		togglable: true
	},

	Footjob_Vagina_G: {
		label: "Give Them a Footjob",
		category: "Feet",
		actionType: "footjob",
		stageGroup: "footjob_vagina",
		stageLevel: 1,
		giver: "player",
		receiver: "npc",
		subjectParts: ["feet"],
		objectParts: ["vagina"],
		canTakeVirginity: false,
		skillsRequired: {},
		baseExcitement: { subject: 2, object: 13 },
		preferenceTags: ["Feet", "Pussy", "Stimulation"],
		inclinationTags: ["fetish", "playful"],
		togglable: true
	},

	Player_Cum_Anal_Inside: {
	label: "Cum Deep In Their Ass",
	category: "Orgasm",
	actionType: "orgasm",
	stageLevel: 0,
	isCumming: true,
	giver: "player",
	receiver: "npc",
	subjectParts: ["penis"],
	objectParts: ["anus"],
	orgasmTags: ["anal_internal", "penetration"],
	preferenceTags: ["Anal_P", "Orgasm_Inside"],
	inclinationTags: ["dominance", "release"],
	togglable: false
	},

	Player_Cum_Vaginal_Inside: {
		label: "Cum Deep In Their Pussy",
		category: "Orgasm",
		actionType: "orgasm",
		stageLevel: 0,
		isCumming: true,
		giver: "player",
		receiver: "npc",
		subjectParts: ["penis"],
		objectParts: ["vagina"],
		orgasmTags: ["vaginal_internal", "penetration"],
		preferenceTags: ["Vaginal_P", "Orgasm_Inside"],
		inclinationTags: ["intimacy", "release"],
		togglable: false
	},

	Player_Cum_On_Face: {
		label: "Cum On Their Face",
		category: "Orgasm",
		actionType: "orgasm",
		stageLevel: 0,
		isCumming: true,
		giver: "player",
		receiver: "npc",
		subjectParts: ["penis"],
		objectParts: ["face"], // not a tracked body part, but logically targeted
		orgasmTags: ["facial", "external"],
		preferenceTags: ["Oral_G", "Face_Cum"],
		inclinationTags: ["control", "messy"],
		togglable: false
	},







	/*  NPC ACTION LIST */
	/* HAND */
	Handjob_Penis_NPC_Tease: {
	label: "Stroke Your Cock Teasingly",
	giver: "npc",
	receiver: "player",
	subjectParts: ["hand"],
	objectParts: ["penis"],
	stageGroup: "Handjob_NPC",
	stageLevel: 0,
	baseExcitement: { subject: 5, object: 10 },
	inclinationTags: ["tease"],
	togglable: false
	},




	/* MOUTH */




	/* FEET */




	/* ANUS */




	/* PENIS */





	/* VAGINA */





	/* BREASTS */





};