// dev/js/01_core/02_playerdata.js

State.variables.player = {
	// === Identity ===
	name: "Unnamed",
	age: 18,
	dob: "Unknown",
	race: "Human",
	gender: "Unknown",
  
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
	  athletics: 0,
	  acrobatics: 0,
	  sleightOfHand: 0,
	  stealth: 0,
	  fortitude: 0,
	  willpower: 0,
	  deception: 0,
	  intimidation: 0,
	  performance: 0,
	  persuasion: 0,
	  magic: 0,
	  investigation: 0,
	  religion: 0,
	  history: 0,
	  perception: 0,
	  survival: 0,
	  medicine: 0
	},
  
	// === Secondary Skills (Earn XP individually) ===
	secondarySkills: {
	  riding: 100,
	  dancing: 100,
	  swimming: 100,
	  cleaning: 100,
	  disguise: 100,
	  hands: 100,
	  mouth: 100,
	  breasts: 100,
	  vagina: 100,
	  anus: 100
	},
  
	// === Equipment ===
	equipment: {
	  weaponMain: "Fists",
	  weaponOffhand: "None",
	  armor: "Simple Clothes"
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
  
	  // Conditional Status Effects
	  poisoned: false,
	  intoxicated: false,
	  charmed: false,
	  burning: false,
	  bleeding: false,
	  stunned: false
	}
  };
  console.log("PlayerData is loaded.");