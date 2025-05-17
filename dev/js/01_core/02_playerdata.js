State.variables.player = {
	// === Identity ===
	name: "Jaylie",
	age: 18,
	dob: "Unknown",
	race: "Human",
	gender: "Female",

	// === Leveling ===
	level: 1,
	experience: 69,
	experienceToNextLevel: 100,

	// === Attributes (Perk-based) ===
	attributes: {
		strength: 5,
		agility: 5,
		toughness: 5,
		charisma: 5,
		intelligence: 5,
		insight: 5
	},

	// === Primary Skills (Earn XP individually) ===
	primarySkills: {
		athletics: { value: 0, xp: 0 },
		acrobatics: { value: 0, xp: 0 },
		sleightOfHand: { value: 0, xp: 0 },
		stealth: { value: 0, xp: 0 },
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

	// === Secondary Skills (Earn XP individually) ===
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

	// === Equipment ===
	equipment: {
		weaponMain: "Fists",
		weaponOffhand: "None",
		armor: "Simple Clothes"
	},

	// === Body Anatomy ===
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
		penisSize: 5 // Placeholder For testing
	},

	// === Current Status ===
	status: {
		health: 100,
		maxHealth: 100,
		fatigue: 25,
		maxFatigue: 100,
		composure: 100,
		maxComposure: 100,
		excitement: 15,
		maxExcitement: 100,
		isCumming: false,

		// Conditional Status Effects
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
	}
};

console.log("✅ PlayerData loaded successfully.");
