/* =============================
= ITEM METADATA LOADER - START =
============================= */
if (typeof setup === 'undefined') {
	setup = {};
}
if (typeof setup.ItemData === 'undefined') {
	setup.ItemData = {};
}
/* =============================
=     Weapons - Daggers     =
============================= */
setup.ItemData.dagger_silver = {
  id: "longsword_silver",
  name: "Silvered Dagger",
  type: "weapon",
  subtype: "dagger",
  tags: ["piercing", "1H", "anti-undead"],
  material: "Silver",
  rarity: 1,
  damage: { piercing:[3,6]},
  weight: 1.5,
  value: 450,
  img: "weapon_dagger_silver.png",
  description: "A silver-plated longsword favored by monster hunters. Effective against undead."
};

/* =============================
=     Weapons - Longswords     =
============================= */
setup.ItemData.test_longsword = {
  id: "test_longsword",
  name: "TEST_Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "1H", "devOnly"],
  material: "Debugium",
  rarity: 0,
  damage: { slashing: 1 },
  weight: 1.0,
  value: 0,
  img: "default.png",
  description: "Developer test item. Should never appear in gameplay."
};
setup.ItemData.longsword_wood = {
  id: "longsword_wood",
  name: "Wooden Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "piercing", "1H"],
  material: "Wood",
  rarity: 1,
  damage: { slashing: 1, blunt: 1 },
  weight: 4.5,
  value: 35,
  img: "longsword_wood.png",
  description: "A crude longsword carved from hardwood. Splinters easily but better than bare fists."
};
setup.ItemData.longsword_iron = {
  id: "longsword_iron",
  name: "Iron Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "piercing", "1H"],
  material: "Iron",
  rarity: 1,
  damage: { slashing: 4, piercing: 2 },
  weight: 6.0,
  value: 120,
  img: "longsword_iron.png",
  description: "A basic iron longsword. Cheap, functional, and widely available."
};
setup.ItemData.longsword_steel = {
  id: "longsword_steel",
  name: "Steel Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "piercing", "1H"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 6, piercing: 3 },
  weight: 5.5,
  value: 280,
  img: "longsword_steel.png",
  description: "A dependable steel blade with a good balance of weight and edge."
};
setup.ItemData.longsword_silver = {
  id: "longsword_silver",
  name: "Silvered Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "piercing", "1H", "anti-undead"],
  material: "Silver",
  rarity: 1,
  damage: { slashing: 6, piercing: 4 },
  weight: 5.5,
  value: 750,
  img: "longsword_silver.png",
  description: "A silver-plated longsword favored by monster hunters. Effective against undead."
};
setup.ItemData.longsword_mithril = {
  id: "longsword_mithril",
  name: "Mithril Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "piercing", "1H", "lightweight"],
  material: "Mithril",
  rarity: 1,
  damage: { slashing: 12, piercing: 10 },
  weight: 2.5,
  value: 5555,
  img: "longsword_mithril.png",
  description: "An elegantly forged mithril blade—light as air, sharp as steel."
};
setup.ItemData.longsword_adamantine = {
  id: "longsword_adamantine",
  name: "Adamantine Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "piercing", "1H", "armor-piercing"],
  material: "Adamantine",
  rarity: 1,
  damage: { slashing: 14, piercing: 9 },
  weight: 7.0,
  value: 6000,
  img: "longsword_adamantine.png",
  description: "A heavy, unyielding blade forged from adamantine. Ideal for cleaving through armor."
};
setup.ItemData.longsword_obsidian = {
  id: "longsword_obsidian",
  name: "Obsidian Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "piercing", "1H", "brittle"],
  material: "Obsidian",
  rarity: 1,
  damage: { slashing: 12, piercing: 4 },
  weight: 5.0,
  value: 420,
  img: "longsword_obsidian.png",
  description: "Forged from volcanic glass. Razor sharp but fragile—handle with care."
};
setup.ItemData.longsword_eldwood = {
  id: "longsword_eldwood",
  name: "Eldwood Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "piercing", "1H", "nature-attuned", "lightweight"],
  material: "Eldwood",
  rarity: 1,
  damage: { slashing: 7, piercing: 5 },
  weight: 2.5,
  value: 400,
  img: "longsword_eldwood.png",
  description: "Made from magically reinforced Eldwood. Lighter than steel and flexible."
};
setup.ItemData.longsword_starforged = {
  id: "longsword_starforged",
  name: "Starforged Longsword",
  type: "weapon",
  subtype: "longsword",
  tags: ["slashing", "piercing", "1H", "magic-conductive"],
  material: "Starforged Alloy",
  rarity: 1,
  damage: { slashing: 18, piercing: 12 },
  weight: 4.0,
  value: 11480,
  img: "longsword_starforged.png",
  description: "Forged from metal fallen from the stars. Emits a faint, pulsing energy."
};

/* =============================
=        Weapons - Spears      =
============================= */
setup.ItemData.spear_wood = {
  id: "spear_wood",
  name: "Wooden Spear",
  type: "weapon",
  subtype: "spear",
  tags: ["piercing", "2H", "reach"],
  material: "Wood",
  rarity: 1,
  damage: { piercing: 2 },
  weight: 4.0,
  value: 30,
  img: "spear_wood.png",
  description: "A long wooden shaft sharpened to a point. Basic, but effective at range."
};
setup.ItemData.spear_obsidian = {
	id: "spear_obsidian",
	name: "Obsidian Spear",
	type: "weapon",
	subtype: "spear",
	tags: ["piercing", "2H", "reach", "brittle"],
	material: "Obsidian",
	rarity: 1,
	damage: { piercing: 11, slashing: 1 },
	weight: 4.5,
	value: 390,
	img: "spear_obsidian.png",
	description: "A razor-sharp obsidian tip gives this spear excellent cutting power—if it doesn't shatter."
};
setup.ItemData.spear_eldwood = {
	id: "spear_eldwood",
	name: "Eldwood Spear",
	type: "weapon",
	subtype: "spear",
	tags: ["piercing", "2H", "reach", "nature-attuned", "lightweight"],
	material: "Eldwood",
	rarity: 1,
	damage: { piercing: 9 },
	weight: 2.8,
	value: 390,
	img: "spear_eldwood.png",
	description: "Light, flexible, and magically attuned to natural energies. A favorite of forest guardians."
};
setup.ItemData.spear_starforged = {
	id: "spear_starforged",
	name: "Starforged Spear",
	type: "weapon",
	subtype: "spear",
	tags: ["piercing", "2H", "reach", "magic-conductive"],
	material: "Starforged Alloy",
	rarity: 1,
	damage: { piercing: 16, slashing: 2 },
	weight: 3.8,
	value: 11000,
	img: "spear_starforged.png",
	description: "A sleek weapon of alien alloy, humming faintly with arcane resonance."
};

/* =============================
=          Armor Items         =
============================= */
setup.ItemData.test_helmet = {
	id: "test_helmet",
	name: "TEST_Helmet",
	type: "armor",
	subtype: "helmet",
	tags: ["head", "light", "devOnly"],
	material: "Debugium",
	rarity: 0,
	resist: { slashing: 1, blunt: 1 },
	weight: 0.5,
	value: 0,
	img: "default.png",
	description: "Developer test helmet. Not for actual use."
};

/* =============================
=      Consumable Items        =
============================= */
setup.ItemData.test_snack = {
	id: "test_snack",
	name: "TEST_Snack",
	type: "consumable",
	subtype: "food",
	tags: ["healing", "devOnly"],
	stats: { health: 1, energy: 1 },
	weight: 0.1,
	value: 0,
	img: "default.png",
	description: "Consumable test item. Used for system validation."
};
/* =============================
=      Literature Items        =
============================= */
 setup.ItemData["scroll_firebolt"] = {
	id: "scroll_firebolt",
	name: "Scroll of Firebolt",
	type: "literature",
	subtype: "scroll",
	tags: ["magic", "single-use", "spell"],
	weight: 0.1,
	value: 35,
	img: "scroll_firebolt.png",
	description: "A tightly rolled parchment containing the incantation for Firebolt.",
	effects: "Casts Firebolt when read. Consumed upon use."
};
 
  
/* =============================
=       Quest Items            =
============================= */
setup.ItemData.test_scroll = {
	id: "test_questscroll",
	name: "TEST_QuestScroll",
	type: "quest",
	subtype: "debug",
	tags: ["quest", "devOnly"],
	weight: 0.0,
	value: 0,
	img: "default.png",
	description: "Placeholder scroll for quest system testing."
};

/* =============================
=         Misc Items           =
============================= */
setup.ItemData.test_token = {
	id: "test_token",
	name: "TEST_Token",
	type: "misc",
	subtype: "debug",
	tags: ["trinket", "devOnly"],
	weight: 0.2,
	value: 0,
	img: "default.png",
	description: "Debug token for inventory/UI validation. Not obtainable."
};
setup.ItemData.gold_coin = {
	id: "gold_coin",
	name: "Gold Coin",
	type: "misc",
	subtype: "currency",
	tags: ["currency", "non-negotiable"],
	weight: 0.00,
	value: 1,
	img: "item_currency_gold_coin.png",
	description: "A single gold coin. Stamped and standardized. Its value never fluctuates.",
	fixedValue: true
};
setup.ItemData.lucky_horseshoe = {
	id: "lucky_horseshoe",
	name: "Lucky Horseshoe",
	type: "misc",
	subtype: "curio",
	tags: ["trinket", "buff-lucky"],
	weight: 0.3,
	value: 10,
	img: "default.png",
	description: "A slightly bent iron horseshoe said to bring good fortune to its bearer.",
	effects: "Grants the 'Lucky' buff while in inventory. Increases favorability of dice rolls."
};

/* =============================
=       Crown Dice Items       =
============================= */
setup.ItemData.crown_die_balanced = {
	id: "crown_die_balanced",
	name: "Balanced Crown Die",
	type: "misc",
	subtype: "crown-die",
	tags: ["crown-die", "balanced"],
	weight: 0.1,
	value: 50,
	img: "default.png",
	description: "A perfectly balanced eight-sided die made from polished bone. Standard d8 probabilities.",
	roll() {
		return Math.ceil(Math.random() * 8);
	}
};

setup.ItemData.crown_die_even_weighted = {
	id: "crown_die_even_weighted",
	name: "Even-Weighted Crown Die",
	type: "misc",
	subtype: "crown-die",
	tags: ["crown-die", "even-weighted"],
	weight: 0.1,
	value: 120,
	img: "default.png",
	description: "A crown die with subtle weight distribution favoring even numbers (2, 4, 6, 8).",
	roll() {
		const rand = Math.random();
		// 60% chance for even numbers (2,4,6,8), 40% for odd (1,3,5,7)
		if (rand < 0.6) {
			return [2, 4, 6, 8][Math.floor(Math.random() * 4)];
		} else {
			return [1, 3, 5, 7][Math.floor(Math.random() * 4)];
		}
	}
};

setup.ItemData.crown_die_odd_weighted = {
	id: "crown_die_odd_weighted",
	name: "Odd-Weighted Crown Die",
	type: "misc",
	subtype: "crown-die",
	tags: ["crown-die", "odd-weighted"],
	weight: 0.1,
	value: 120,
	img: "default.png",
	description: "A crown die with subtle weight distribution favoring odd numbers (1, 3, 5, 7).",
	roll() {
		const rand = Math.random();
		// 60% chance for odd numbers (1,3,5,7), 40% for even (2,4,6,8)
		if (rand < 0.6) {
			return [1, 3, 5, 7][Math.floor(Math.random() * 4)];
		} else {
			return [2, 4, 6, 8][Math.floor(Math.random() * 4)];
		}
	}
};

setup.ItemData.crown_die_high_weighted = {
	id: "crown_die_high_weighted",
	name: "High-Weighted Crown Die",
	type: "misc",
	subtype: "crown-die",
	tags: ["crown-die", "high-weighted"],
	weight: 0.1,
	value: 180,
	img: "default.png",
	description: "A crown die weighted to favor higher numbers (5, 6, 7, 8).",
	roll() {
		const rand = Math.random();
		// 65% chance for high numbers (5,6,7,8), 35% for low (1,2,3,4)
		if (rand < 0.65) {
			return [5, 6, 7, 8][Math.floor(Math.random() * 4)];
		} else {
			return [1, 2, 3, 4][Math.floor(Math.random() * 4)];
		}
	}
};

setup.ItemData.crown_die_low_weighted = {
	id: "crown_die_low_weighted",
	name: "Low-Weighted Crown Die",
	type: "misc",
	subtype: "crown-die",
	tags: ["crown-die", "low-weighted"],
	weight: 0.1,
	value: 180,
	img: "default.png",
	description: "A crown die weighted to favor lower numbers (1, 2, 3, 4).",
	roll() {
		const rand = Math.random();
		// 65% chance for low numbers (1,2,3,4), 35% for high (5,6,7,8)
		if (rand < 0.65) {
			return [1, 2, 3, 4][Math.floor(Math.random() * 4)];
		} else {
			return [5, 6, 7, 8][Math.floor(Math.random() * 4)];
		}
	}
};

setup.ItemData.crown_die_lucky = {
	id: "crown_die_lucky",
	name: "Lucky Crown Die",
	type: "misc",
	subtype: "crown-die",
	tags: ["crown-die", "lucky", "rare"],
	weight: 0.1,
	value: 300,
	img: "default.png",
	description: "A rare crown die carved from lucky stone. Slightly favors rolling 7s and 8s.",
	roll() {
		const rand = Math.random();
		// 30% chance for 7 or 8, 70% for normal distribution
		if (rand < 0.15) {
			return 7;
		} else if (rand < 0.30) {
			return 8;
		} else {
			return Math.ceil(Math.random() * 8);
		}
	}
};

console.log("✅ ItemData loaded:", Object.keys(setup.ItemData));
/* =============================
= ITEM METADATA LOADER - END =
============================= */
