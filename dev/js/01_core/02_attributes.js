setup.attributes = {
	strength: 5,
	agility: 5,
	toughness: 5,
	charisma: 5,
	intelligence: 5,
	insight: 5
  };
  
  setup.skills = {
	// Strength-based
	athletics:        { value: 0, parent: "strength", type: "primary" },
	intimidation:     { value: 0, parent: "strength", type: "primary" },
  
	// Agility-based
	acrobatics:       { value: 0, parent: "agility", type: "primary" },
	sleightofhand:    { value: 0, parent: "agility", type: "primary" },
	stealth:          { value: 0, parent: "agility", type: "primary" },
  
	// Toughness-based
	fortitude:        { value: 0, parent: "toughness", type: "primary" },
	willpower:        { value: 0, parent: "toughness", type: "primary" },
  
	// Charisma-based
	persuasion:       { value: 0, parent: "charisma", type: "primary" },
	deception:        { value: 0, parent: "charisma", type: "primary" },
	performance:      { value: 0, parent: "charisma", type: "primary" },
  
	// Intelligence-based
	medicine:         { value: 0, parent: "intelligence", type: "primary" },
	arcana:           { value: 0, parent: "intelligence", type: "primary" },
	tinkering:        { value: 0, parent: "intelligence", type: "primary" },
  
	// Insight-based
	insight:          { value: 0, parent: "insight", type: "primary" },
	perception:       { value: 0, parent: "insight", type: "primary" },
	investigation:    { value: 0, parent: "insight", type: "primary" },
  
	// Secondary - Mundane
	cooking:          { value: 0, parent: null, type: "mundane" },
	cleaning:         { value: 0, parent: null, type: "mundane" },
	riding:           { value: 0, parent: null, type: "mundane" },
	crafting:         { value: 0, parent: null, type: "mundane" },
	forgery:          { value: 0, parent: null, type: "mundane" },
	trading:          { value: 0, parent: null, type: "mundane" },
	traveling:        { value: 0, parent: null, type: "mundane" },
	foraging:         { value: 0, parent: null, type: "mundane" },
  
	// Secondary - Sexual
	hands:            { value: 0, parent: null, type: "sexual" },
	mouth:            { value: 0, parent: null, type: "sexual" },
	feet:             { value: 0, parent: null, type: "sexual" },
	penis:            { value: 0, parent: null, type: "sexual" },
	vagina:           { value: 0, parent: null, type: "sexual" },
	anus:             { value: 0, parent: null, type: "sexual" },
	teasing:          { value: 0, parent: null, type: "sexual" },
	domination:       { value: 0, parent: null, type: "sexual" },
	submission:       { value: 0, parent: null, type: "sexual" },
	voyeurism:        { value: 0, parent: null, type: "sexual" },
	exhibitionism:    { value: 0, parent: null, type: "sexual" },
	bondage:          { value: 0, parent: null, type: "sexual" }
  };
  