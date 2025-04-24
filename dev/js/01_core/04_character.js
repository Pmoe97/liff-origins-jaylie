/* ================================
=  Character Dialogue & Avatars  =
================================ */

State.variables.characters = {
	jaylie: {
	  name: "Jaylie",
	  defaultName: "Jaylie",
	  known: true,
	  avatar: "images/portrait_jaylie.png",
	  color: "white",
	  bgColor: "rgba(162, 72, 87, 0.8)",
  
	  // Player character, not tracked with affection/trust
	  isPlayer: true
	},
  
	adda: {
	  name: "Mistress Adda",
	  defaultName: "Brothel Mistress",
	  known: false,
	  avatar: "images/portrait_mistressadda.png",
	  color: "white",
	  bgColor: "rgba(32, 32, 32, 0.8)",
  
	  trust: 35,
	  affection: 28,
	  rapport: 1.2,
	  tension: 0,
	  cooldown: 0,
  
	  traits: ["Dominant", "Cynical", "Flirty"],
	  inclinations: ["Bondage", "Praise-Kink"],
	  motivations: ["Control", "Pleasure"],
	  socialStyle: "Regal"
	},
  
	kallot: {
	  name: "Kallot",
	  defaultName: "Drunk Man",
	  known: false,
	  avatar: "images/portrait_kallot.png",
	  color: "white",
	  bgColor: "rgba(159, 172, 138, 0.8)",
  
	  trust: 12,
	  affection: 5,
	  rapport: 1.0,
	  tension: 0,
	  cooldown: 0,
  
	  traits: ["Cynical", "Melancholic", "Awkward"],
	  inclinations: ["Voyeurism"],
	  motivations: ["Redemption", "Connection"],
	  socialStyle: "Humble"
	},
  
	marie: {
	  name: "Marie",
	  defaultName: "Brothel Girl",
	  known: false,
	  avatar: "images/portrait_marie.png",
	  color: "white",
	  bgColor: "rgba(197, 126, 65, 0.8)",
  
	  trust: 22,
	  affection: 14,
	  rapport: 1.1,
	  tension: 0,
	  cooldown: 0,
  
	  traits: ["Introverted", "Guarded", "Submissive"],
	  inclinations: ["Praise-Kink", "Service-Oriented"],
	  motivations: ["Safety", "Freedom"],
	  socialStyle: "Reserved"
	},
  
	eristan: {
	  name: "Eristan Velthar",
	  defaultName: "Madman",
	  known: false,
	  avatar: "images/portrait_eristan.png",
	  color: "white",
	  bgColor: "rgba(53, 18, 4, 0.8)",
  
	  trust: 8,
	  affection: 4,
	  rapport: 0.9,
	  tension: 0,
	  cooldown: 0,
  
	  traits: ["Detached", "Curious", "Traumatized"],
	  inclinations: ["Chastity-Kink"],
	  motivations: ["Prophecy", "Protection"],
	  socialStyle: "Unhinged"
	},

	harroc: {
		name: "Harroc",
		defaultName: "Barkeep",
		known: true,
		avatar: "images/portrait_harroc.png",
		color: "white",
		bgColor: "rgba(65, 48, 35, 0.8)",
	
		trust: 50,
		affection: 10,
		rapport: 1.1,
		tension: 0,
		cooldown: 0,
	
		traits: ["Stoic", "Kind", "Guarded"],
		inclinations: [],
		motivations: ["Duty", "Redemption"],
		socialStyle: "Grizzled"
	  },

	tesska: {
		name: "Tesska",
		defaultName: "Barmaid",
		known: false,
		avatar: "images/portrait_tesska.png", 
		color: "white",
		bgColor: "rgba(189, 108, 99, 0.85)",
	
		trust: 15,
		affection: 20,
		rapport: 1.0,
		tension: 0,
		cooldown: 0,
	
		traits: ["Flirty", "Crude", "Confident"],
		inclinations: ["Exhibitionist", "Teasing"],
		motivations: ["Freedom", "Excitement"],
		socialStyle: "Feisty"
	  },
	allura: {
		name: "Allura",
		defaultName: "Exotic Hostess",
		known: false,
		avatar: "images/portrait_allura.png",
		color: "white",
		bgColor: "rgba(20, 152, 232, 0.6)",
		
		trust: 0,
		affection: 0,
		rapport: 1.0,
		tension: 0,
		cooldown: 0,

		traits: ["Flirty", "Cynical", "Confident"],
		inclinations: ["Bondage", "Dominant"],
		motivations: ["Pleasure", "Family"],
		socialStyle: "Flirty"
	  },
	darian: {
		name: "Darian",
		defaultName: "Male Host",
		known: false,
		avatar: "images/portrait_darian.png",
		color: "white",
		bgColor: "rgba(126, 66, 0, 0.6)",

		trust: 3,
		affection: 0,
		rapport: 1.0,
		tension: 0,
		cooldown: 0,

		traits: ["Flirty", "Confident", "Charming"],
		inclinations: ["Voyeurism", "Exhibitionist"],
		motivations: ["Pleasure", "Connection"],
		socialStyle: "Charming"
	  },
	bert: {
		name: "Bert",
		defaultName: "Brothel Bartender",
		known: false,
		avatar: "images/portrait_bert.png",
		color: "white",
		bgColor: "rgba(74, 76, 69, 0.6)",

		trust:0,
		affection: 0,
		rapport: 1.0,
		tension: 0,
		cooldown: 0,

		traits: ["Stoic", "Cynical", "Guarded"],
		inclinations: ["Voyeurism"],
		motivations: ["Loyalty", "Devotion"],
		socialStyle: "Stoic"
	}
};
  
  /* Character Dialogue & Avatars - End */