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
	  bgColor: "rgba(162, 72, 87, 0.8)"
	},
	adda: {
	  name: "Mistress Adda",
	  defaultName: "Brothel Mistress",
	  known: false,
	  avatar: "images/portrait_mistressadda.png",
	  color: "white",
	  bgColor: "rgba(32, 32, 32, 0.8)"
	},
	drunkman: {
	  name: "Kallot",
	  defaultName: "Drunk Man",
	  known: false,
	  avatar: "images/portrait_kallot.png",
	  color: "white",
	  bgColor: "rgba(159, 172, 138, 0.8)"
	},
	marie: {
	  name: "Marie",
	  defaultName: "Brothel Girl",
	  known: false,
	  avatar: "images/portrait_marie.png",
	  color: "white",
	  bgColor: "rgba(197, 126, 65, 0.8)"
	},
	eristan: {
	  name: "Eristan Velthar",
	  defaultName: "Madman",
	  known: false,
	  avatar: "images/portrait_eristan.png",
	  color: "white",
	  bgColor: "rgba(53, 18, 4, 0.8)"
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
	  }
	
  };
  
  /* Character Dialogue & Avatars - End */