setup.attributes = {
	strength: 4,
	agility: 4,
	toughness: 4,
	charisma: 4,
	intelligence: 4,
	insight: 4
};

setup.skills = {
	athletics: { value: 1, parent: "strength" },
	acrobatics: { value: 0, parent: "agility" },
	sleightofhand: { value: 0, parent: "agility" },
	stealth: { value: 0, parent: "agility" },
	magic: { value: 0, parent: "intelligence" },
	history: { value: 0, parent: "intelligence" },
	investigation: { value: 0, parent: "intelligence" },
	nature: { value: 0, parent: "intelligence" },
	religion: { value: 0, parent: "intelligence" },
	beasts: { value: 0, parent: "insight" },
	insight: { value: 0, parent: "insight" },
	deception: { value: 0, parent: "charisma" },
	persuasion: { value: 0, parent: "charisma" },
	intimidation: { value: 0, parent: "charisma" }
};
