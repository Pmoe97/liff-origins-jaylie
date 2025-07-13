State.variables.player = {
	// === Identity ===
	name: "Jaylie",
	age: 18, //calculated from date of birth
	dob: "15th of Rain, 12219 AI ",
	race: "Human",
	gender: "Female",

	// === Leveling ===
	level: 1, //max level 100
	experience: 69, //max experience scales with level
	experienceToNextLevel: 100,

	// === Attributes (Perk-based) === //max value 50. Attributes are raised through leveling up. The player will recieve a certain number of attribute points each level, which can be assigned to any attribute. Attributes are used to calculate bonuses for primary skills, and also determine the player's maximum health, fatigue, composure, and carry weight.
	// Base attributes are set to 3, which is the average value. Attributes can be raised through leveling up, training, and certain perks.
	attributes: {
		strength: 3,
		agility: 3,
		toughness: 3,
		charisma: 3,
		intelligence: 3,
		insight: 3
	},

	// === Primary Skills (Earn XP individually, XP max scales with level) === //max level value 100. Primary Skills recieve bonuses from attributes = appropriate attribute / 2
	primarySkills: {
		athletics: { value: 1, xp: 0 },
		acrobatics: { value: 1, xp: 0 },
		sleightOfHand: { value: 1, xp: 0 },
		stealth: { value: 1, xp: 0 },
		fortitude: { value: 0, xp: 0 },
		willpower: { value: 0, xp: 0 },
		deception: { value: 0, xp: 0 },
		intimidation: { value: 0, xp: 0 },
		performance: { value: 0, xp: 0 },
		persuasion: { value: 0, xp: 0 },
		magic: { value: 0, xp: 0 },
		investigation: { value: 0, xp: 0 },
		religion: { value: 0, xp: 0 },
		history: { value: 0, xp: 0 },
		perception: { value: 0, xp: 0 },
		survival: { value: 0, xp: 0 },
		medicine: { value: 0, xp: 0 }
	},

	// === Secondary Skills (Earn XP individually) === //max level value 100. Secondary Skills do not recieve bonuses from attributes, but can be improved through practice, use, repetition and training. Secondary skills are divided into two categories: "General" and "Sexual". General skills are useful in a variety of situations, while sexual skills are used in intimate encounters.
	secondarySkills: {
		riding: { value: 100, xp: 0 },
		dancing: { value: 100, xp: 0 },
		swimming: { value: 100, xp: 0 },
		cleaning: { value: 100, xp: 0 },
		disguise: { value: 100, xp: 0 },
		hands: { value: 100, xp: 0 },
		mouth: { value: 100, xp: 0 },
		breasts: { value: 100, xp: 0 },
		vagina: { value: 100, xp: 0 },
		anus: { value: 100, xp: 0 }
	},

	// === Equipment === // This section is supposed to reference the items equipped by the player in the inventory system.
	equipment: {
		weaponMain: "Fists",
		weaponOffhand: "None",
		armorChest: "Simple Clothes",
		gloves: "None", //There are two glove slots in the inventory page, but both of them are used for the same item.
		armorLegs: "None",
		armorShoes: "None",

		accessoryFace: "None",
		accessoryNeck: "None",
		accessoryBack: "None", // this is more shoulders, for capes and cloaks as of righting this, I am contemplated adding an additional slot for backpacks.
		accessoryRing1: "None",
		accessoryRing2: "None",
		accessoryRing3: "None",
	},

	// === Body Anatomy === // Displayed in character sheet "Appearance" tab
	body: {
		height: 64, // inches
		breastSize: 2, // modest
		buttSize: 2, // modest
		bodyType: 3, // average
		lipFullness: 2, // modest
		skinTone: "fair",
		muscleTone: 2, // fit
		hipWidth: 2, // wide
		bodyHair: 1, // light
		voiceTone: "gentle",
		hairColor: "auburn",
		hairStyle: "wavy",
		hairLength: 20, // mid-back
		eyeColor: "hazel green",

		// Functional anatomy
		vagina: true,
		clitoris: true,
	},

	// === Current Status ===
	status: {
		health: 100, 
		maxHealth: 100, // scales with toughness attribute
		fatigue: 25,
		maxFatigue: 100, // scales with with agility attribute
		composure: 100,
		maxComposure: 100, // scales compound with toughness and intelligence.
		excitement: 0,
		maxExcitement: 100,
		isCumming: false,

		// Conditional Status Effects -- Only appear if necessary (if value >0 and/or true)
		poisoned: 0,
		maxPoisoned: 100,
		intoxicated: 0,
		maxIntoxicated: 100,
		charmed: 0,
		maxCharmed: 100,
		burning: false,
		bleeding: 0,
		maxBleeding: 50,
		stunned: false
	},

	/* ==================== */
	/* - Player Inventory - */
	/* ==================== */

		/* === Carry === */ // Max Carryweight scales with Strength attribute
	carryWeight: {
		current: 0,
	}, 

	startingInventory: {
		gold_coin: 100,
		dagger_silver: 1,
	}
};

