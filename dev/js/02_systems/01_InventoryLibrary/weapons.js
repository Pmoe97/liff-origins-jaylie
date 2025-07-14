/* =============================
=     Weapons - Daggers     =
============================= */
setup.ItemData.dagger_silver = {
  id: "dagger_silver",
  name: "Silvered Dagger",
  type: "weapon",
  subtype: "dagger",
  tags: ["piercing", "1H", "anti-undead"],
  material: "Silver",
  rarity: 1,
  damage: { piercing: 5 },  // Changed from array to single value for consistency
  weight: 1.5,
  value: 450,
  img: "item_weapon_dagger_silver.png",
  description: "A silver-plated dagger favored by monster hunters. Effective against undead."  // Fixed description
};

setup.ItemData.dagger_iron = {
  id: "dagger_iron",
  name: "Iron Dagger",
  type: "weapon",
  subtype: "dagger",
  tags: ["piercing", "1H"],
  material: "Iron",
  rarity: 1,
  damage: { piercing: 3 },
  weight: 1.0,
  value: 80,
  img: "item_weapon_dagger_iron.png",
  description: "A simple iron dagger. Common and reliable."
};

setup.ItemData.dagger_steel = {
  id: "dagger_steel",
  name: "Steel Dagger",
  type: "weapon",
  subtype: "dagger",
  tags: ["piercing", "1H"],
  material: "Steel",
  rarity: 1,
  damage: { piercing: 4 },
  weight: 0.9,
  value: 200,
  img: "item_weapon_dagger_steel.png",
  description: "A well-crafted steel dagger with excellent balance."
};

setup.ItemData.dagger_obsidian = {
  id: "dagger_obsidian",
  name: "Obsidian Dagger",
  type: "weapon",
  subtype: "dagger",
  tags: ["piercing", "1H", "brittle"],
  material: "Obsidian",
  rarity: 1,
  damage: { piercing: 6, slashing: 2 },
  weight: 0.8,
  value: 280,
  img: "item_weapon_dagger_obsidian.png",
  description: "Razor-sharp volcanic glass blade. Deadly but fragile."
};

setup.ItemData.stiletto_steel = {
  id: "stiletto_steel",
  name: "Steel Stiletto",
  type: "weapon",
  subtype: "dagger",
  tags: ["piercing", "1H", "armor-piercing"],
  material: "Steel",
  rarity: 1,
  damage: { piercing: 5 },
  weight: 0.7,
  value: 250,
  img: "item_weapon_stiletto_steel.png",
  description: "A thin, needle-like blade designed to pierce armor."
};

setup.ItemData.throwing_knife_iron = {
  id: "throwing_knife_iron",
  name: "Iron Throwing Knife",
  type: "weapon",
  subtype: "dagger",
  tags: ["piercing", "1H", "thrown"],
  material: "Iron",
  rarity: 1,
  damage: { piercing: 2 },
  weight: 0.3,
  value: 40,
  img: "item_weapon_throwing_knife_iron.png",
  description: "A balanced knife designed for throwing. Best used in sets."
};

/* =============================
=     Weapons - Shortswords    =
============================= */
setup.ItemData.shortsword_iron = {
  id: "shortsword_iron",
  name: "Iron Shortsword",
  type: "weapon",
  subtype: "shortsword",
  tags: ["slashing", "piercing", "1H"],
  material: "Iron",
  rarity: 1,
  damage: { slashing: 3, piercing: 2 },
  weight: 3.0,
  value: 90,
  img: "item_weapon_shortsword_iron.png",
  description: "A compact blade ideal for close quarters combat."
};

setup.ItemData.shortsword_steel = {
  id: "shortsword_steel",
  name: "Steel Shortsword",
  type: "weapon",
  subtype: "shortsword",
  tags: ["slashing", "piercing", "1H"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 5, piercing: 3 },
  weight: 2.8,
  value: 210,
  img: "item_weapon_shortsword_steel.png",
  description: "A reliable steel shortsword, favored by scouts and rogues."
};

setup.ItemData.shortsword_mithril = {
  id: "shortsword_mithril",
  name: "Mithril Shortsword",
  type: "weapon",
  subtype: "shortsword",
  tags: ["slashing", "piercing", "1H", "lightweight"],
  material: "Mithril",
  rarity: 1,
  damage: { slashing: 8, piercing: 6 },
  weight: 1.5,
  value: 3200,
  img: "item_weapon_shortsword_mithril.png",
  description: "An exceptionally light blade that moves like quicksilver."
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
=     Weapons - Greatswords    =
============================= */
setup.ItemData.greatsword_iron = {
  id: "greatsword_iron",
  name: "Iron Greatsword",
  type: "weapon",
  subtype: "greatsword",
  tags: ["slashing", "2H", "heavy"],
  material: "Iron",
  rarity: 1,
  damage: { slashing: 8, blunt: 2 },
  weight: 10.0,
  value: 180,
  img: "item_weapon_greatsword_iron.png",
  description: "A massive two-handed sword. Slow but devastating."
};

setup.ItemData.greatsword_steel = {
  id: "greatsword_steel",
  name: "Steel Greatsword",
  type: "weapon",
  subtype: "greatsword",
  tags: ["slashing", "2H", "heavy"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 12, blunt: 3 },
  weight: 9.0,
  value: 420,
  img: "item_weapon_greatsword_steel.png",
  description: "A well-balanced greatsword capable of cleaving through multiple foes."
};

setup.ItemData.greatsword_adamantine = {
  id: "greatsword_adamantine",
  name: "Adamantine Greatsword",
  type: "weapon",
  subtype: "greatsword",
  tags: ["slashing", "2H", "heavy", "armor-piercing"],
  material: "Adamantine",
  rarity: 1,
  damage: { slashing: 20, blunt: 5 },
  weight: 12.0,
  value: 9000,
  img: "item_weapon_greatsword_adamantine.png",
  description: "An unstoppable force of destruction. Nothing can withstand its cleave."
};

setup.ItemData.claymore_steel = {
  id: "claymore_steel",
  name: "Steel Claymore",
  type: "weapon",
  subtype: "greatsword",
  tags: ["slashing", "2H", "heavy"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 11, piercing: 2 },
  weight: 8.5,
  value: 380,
  img: "item_weapon_claymore_steel.png",
  description: "A traditional highland blade with a distinctive crossguard."
};

/* =============================
=     Weapons - Curved Blades  =
============================= */
setup.ItemData.scimitar_iron = {
  id: "scimitar_iron",
  name: "Iron Scimitar",
  type: "weapon",
  subtype: "scimitar",
  tags: ["slashing", "1H", "curved"],
  material: "Iron",
  rarity: 1,
  damage: { slashing: 5 },
  weight: 4.0,
  value: 110,
  img: "item_weapon_scimitar_iron.png",
  description: "A curved blade optimized for slashing attacks."
};

setup.ItemData.scimitar_steel = {
  id: "scimitar_steel",
  name: "Steel Scimitar",
  type: "weapon",
  subtype: "scimitar",
  tags: ["slashing", "1H", "curved"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 7 },
  weight: 3.8,
  value: 260,
  img: "item_weapon_scimitar_steel.png",
  description: "A finely crafted curved blade favored by desert warriors."
};

setup.ItemData.katana_steel = {
  id: "katana_steel",
  name: "Steel Katana",
  type: "weapon",
  subtype: "katana",
  tags: ["slashing", "1H", "curved", "precise"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 8, piercing: 2 },
  weight: 3.5,
  value: 480,
  img: "item_weapon_katana_steel.png",
  description: "A masterfully folded blade from the eastern lands. Swift and deadly."
};

setup.ItemData.katana_mithril = {
  id: "katana_mithril",
  name: "Mithril Katana",
  type: "weapon",
  subtype: "katana",
  tags: ["slashing", "1H", "curved", "precise", "lightweight"],
  material: "Mithril",
  rarity: 1,
  damage: { slashing: 14, piercing: 4 },
  weight: 2.0,
  value: 6800,
  img: "item_weapon_katana_mithril.png",
  description: "An ethereally light blade that cuts like the wind itself."
};

setup.ItemData.saber_steel = {
  id: "saber_steel",
  name: "Steel Saber",
  type: "weapon",
  subtype: "saber",
  tags: ["slashing", "1H", "curved"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 6, piercing: 2 },
  weight: 3.2,
  value: 240,
  img: "item_weapon_saber_steel.png",
  description: "A cavalry sword with a gentle curve. Excellent for mounted combat."
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

setup.ItemData.spear_iron = {
  id: "spear_iron",
  name: "Iron Spear",
  type: "weapon",
  subtype: "spear",
  tags: ["piercing", "2H", "reach"],
  material: "Iron",
  rarity: 1,
  damage: { piercing: 5 },
  weight: 5.0,
  value: 85,
  img: "item_weapon_spear_iron.png",
  description: "A simple iron-tipped spear. Effective and easy to use."
};

setup.ItemData.spear_steel = {
  id: "spear_steel",
  name: "Steel Spear",
  type: "weapon",
  subtype: "spear",
  tags: ["piercing", "2H", "reach"],
  material: "Steel",
  rarity: 1,
  damage: { piercing: 7 },
  weight: 4.8,
  value: 200,
  img: "item_weapon_spear_steel.png",
  description: "A well-balanced spear with a keen steel point."
};

setup.ItemData.spear_adamantine = {
  id: "spear_adamantine",
  name: "Adamantine Spear",
  type: "weapon",
  subtype: "spear",
  tags: ["piercing", "2H", "reach", "armor-piercing"],
  material: "Adamantine",
  rarity: 1,
  damage: { piercing: 15 },
  weight: 6.5,
  value: 5400,
  img: "item_weapon_spear_adamantine.png",
  description: "A spear that can pierce through the thickest armor and scales."
};

/* =============================
=      Weapons - Halberds      =
============================= */
setup.ItemData.halberd_iron = {
  id: "halberd_iron",
  name: "Iron Halberd",
  type: "weapon",
  subtype: "halberd",
  tags: ["slashing", "piercing", "2H", "reach", "heavy"],
  material: "Iron",
  rarity: 1,
  damage: { slashing: 6, piercing: 4 },
  weight: 8.0,
  value: 140,
  img: "item_weapon_halberd_iron.png",
  description: "A versatile polearm combining axe blade and spear point."
};

setup.ItemData.halberd_steel = {
  id: "halberd_steel",
  name: "Steel Halberd",
  type: "weapon",
  subtype: "halberd",
  tags: ["slashing", "piercing", "2H", "reach", "heavy"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 9, piercing: 6 },
  weight: 7.5,
  value: 320,
  img: "item_weapon_halberd_steel.png",
  description: "A guard's weapon of choice. Effective against both infantry and cavalry."
};

setup.ItemData.halberd_mithril = {
  id: "halberd_mithril",
  name: "Mithril Halberd",
  type: "weapon",
  subtype: "halberd",
  tags: ["slashing", "piercing", "2H", "reach", "lightweight"],
  material: "Mithril",
  rarity: 1,
  damage: { slashing: 13, piercing: 9 },
  weight: 4.0,
  value: 7200,
  img: "item_weapon_halberd_mithril.png",
  description: "An impossibly light halberd that strikes with supernatural speed."
};

/* =============================
=       Weapons - Clubs        =
============================= */
setup.ItemData.club_wood = {
  id: "club_wood",
  name: "Wooden Club",
  type: "weapon",
  subtype: "club",
  tags: ["blunt", "1H"],
  material: "Wood",
  rarity: 1,
  damage: { blunt: 3 },
  weight: 3.5,
  value: 15,
  img: "item_weapon_club_wood.png",
  description: "A crude bludgeon carved from hardwood. Simple but effective."
};

setup.ItemData.club_iron = {
  id: "club_iron",
  name: "Iron-Bound Club",
  type: "weapon",
  subtype: "club",
  tags: ["blunt", "1H"],
  material: "Iron",
  rarity: 1,
  damage: { blunt: 5 },
  weight: 5.0,
  value: 65,
  img: "item_weapon_club_iron.png",
  description: "A wooden club reinforced with iron bands and studs."
};

/* =============================
=       Weapons - Maces        =
============================= */
setup.ItemData.mace_iron = {
  id: "mace_iron",
  name: "Iron Mace",
  type: "weapon",
  subtype: "mace",
  tags: ["blunt", "1H"],
  material: "Iron",
  rarity: 1,
  damage: { blunt: 6 },
  weight: 6.0,
  value: 100,
  img: "item_weapon_mace_iron.png",
  description: "A flanged mace designed to crush armor and bone alike."
};

setup.ItemData.mace_steel = {
  id: "mace_steel",
  name: "Steel Mace",
  type: "weapon",
  subtype: "mace",
  tags: ["blunt", "1H"],
  material: "Steel",
  rarity: 1,
  damage: { blunt: 8 },
  weight: 5.5,
  value: 240,
  img: "item_weapon_mace_steel.png",
  description: "A well-balanced mace with pronounced flanges for maximum impact."
};

setup.ItemData.mace_adamantine = {
  id: "mace_adamantine",
  name: "Adamantine Mace",
  type: "weapon",
  subtype: "mace",
  tags: ["blunt", "1H", "armor-piercing"],
  material: "Adamantine",
  rarity: 1,
  damage: { blunt: 14 },
  weight: 7.5,
  value: 6600,
  img: "item_weapon_mace_adamantine.png",
  description: "A devastating mace that can shatter the strongest shields."
};

/* =============================
=      Weapons - Hammers       =
============================= */
setup.ItemData.warhammer_iron = {
  id: "warhammer_iron",
  name: "Iron Warhammer",
  type: "weapon",
  subtype: "warhammer",
  tags: ["blunt", "1H"],
  material: "Iron",
  rarity: 1,
  damage: { blunt: 7, piercing: 1 },
  weight: 7.0,
  value: 120,
  img: "item_weapon_warhammer_iron.png",
  description: "A military hammer with a blunt face and armor-piercing spike."
};

setup.ItemData.warhammer_steel = {
  id: "warhammer_steel",
  name: "Steel Warhammer",
  type: "weapon",
  subtype: "warhammer",
  tags: ["blunt", "1H"],
  material: "Steel",
  rarity: 1,
  damage: { blunt: 9, piercing: 2 },
  weight: 6.5,
  value: 280,
  img: "item_weapon_warhammer_steel.png",
  description: "A balanced warhammer favored by knights and templars."
};

setup.ItemData.maul_iron = {
  id: "maul_iron",
  name: "Iron Maul",
  type: "weapon",
  subtype: "maul",
  tags: ["blunt", "2H", "heavy"],
  material: "Iron",
  rarity: 1,
  damage: { blunt: 12 },
  weight: 12.0,
  value: 160,
  img: "item_weapon_maul_iron.png",
  description: "A massive two-handed hammer. Slow but utterly crushing."
};

setup.ItemData.maul_steel = {
  id: "maul_steel",
  name: "Steel Maul",
  type: "weapon",
  subtype: "maul",
  tags: ["blunt", "2H", "heavy"],
  material: "Steel",
  rarity: 1,
  damage: { blunt: 16 },
  weight: 11.0,
  value: 380,
  img: "item_weapon_maul_steel.png",
  description: "A terrifying weapon that can pulverize stone and steel."
};

/* =============================
=       Weapons - Flails       =
============================= */
setup.ItemData.flail_iron = {
  id: "flail_iron",
  name: "Iron Flail",
  type: "weapon",
  subtype: "flail",
  tags: ["blunt", "1H", "flexible"],
  material: "Iron",
  rarity: 1,
  damage: { blunt: 6, piercing: 1 },
  weight: 5.5,
  value: 130,
  img: "item_weapon_flail_iron.png",
  description: "A spiked ball on a chain. Unpredictable and hard to block."
};

setup.ItemData.flail_steel = {
  id: "flail_steel",
  name: "Steel Flail",
  type: "weapon",
  subtype: "flail",
  tags: ["blunt", "1H", "flexible"],
  material: "Steel",
  rarity: 1,
  damage: { blunt: 8, piercing: 2 },
  weight: 5.0,
  value: 300,
  img: "item_weapon_flail_steel.png",
  description: "A military flail with reinforced chain and wicked spikes."
};

/* =============================
=     Weapons - Hand Axes      =
============================= */
setup.ItemData.handaxe_iron = {
  id: "handaxe_iron",
  name: "Iron Hand Axe",
  type: "weapon",
  subtype: "handaxe",
  tags: ["slashing", "1H", "thrown"],
  material: "Iron",
  rarity: 1,
  damage: { slashing: 4 },
  weight: 2.5,
  value: 70,
  img: "item_weapon_handaxe_iron.png",
  description: "A small axe suitable for both melee and throwing."
};

setup.ItemData.handaxe_steel = {
  id: "handaxe_steel",
  name: "Steel Hand Axe",
  type: "weapon",
  subtype: "handaxe",
  tags: ["slashing", "1H", "thrown"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 6 },
  weight: 2.3,
  value: 180,
  img: "item_weapon_handaxe_steel.png",
  description: "A well-balanced hand axe with a keen edge."
};

setup.ItemData.throwing_axe_steel = {
  id: "throwing_axe_steel",
  name: "Steel Throwing Axe",
  type: "weapon",
  subtype: "handaxe",
  tags: ["slashing", "1H", "thrown", "balanced"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 5 },
  weight: 1.8,
  value: 160,
  img: "item_weapon_throwing_axe_steel.png",
  description: "Perfectly balanced for throwing. Deadly at range."
};

/* =============================
=    Weapons - Battle Axes     =
============================= */
setup.ItemData.battleaxe_iron = {
  id: "battleaxe_iron",
  name: "Iron Battle Axe",
  type: "weapon",
  subtype: "battleaxe",
  tags: ["slashing", "1H"],
  material: "Iron",
  rarity: 1,
  damage: { slashing: 7 },
  weight: 5.5,
  value: 110,
  img: "item_weapon_battleaxe_iron.png",
  description: "A single-bladed axe designed for warfare."
};

setup.ItemData.battleaxe_steel = {
  id: "battleaxe_steel",
  name: "Steel Battle Axe",
  type: "weapon",
  subtype: "battleaxe",
  tags: ["slashing", "1H"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 9 },
  weight: 5.0,
  value: 260,
  img: "item_weapon_battleaxe_steel.png",
  description: "A fearsome weapon that cleaves through flesh and mail."
};

setup.ItemData.battleaxe_silver = {
  id: "battleaxe_silver",
  name: "Silvered Battle Axe",
  type: "weapon",
  subtype: "battleaxe",
  tags: ["slashing", "1H", "anti-undead"],
  material: "Silver",
  rarity: 1,
  damage: { slashing: 9 },
  weight: 5.2,
  value: 850,
  img: "item_weapon_battleaxe_silver.png",
  description: "A silver-plated axe blessed by priests. Bane of the undead."
};

/* =============================
=     Weapons - Great Axes     =
============================= */
setup.ItemData.greataxe_iron = {
  id: "greataxe_iron",
  name: "Iron Greataxe",
  type: "weapon",
  subtype: "greataxe",
  tags: ["slashing", "2H", "heavy"],
  material: "Iron",
  rarity: 1,
  damage: { slashing: 11 },
  weight: 9.0,
  value: 150,
  img: "item_weapon_greataxe_iron.png",
  description: "A massive two-handed axe. Favored by berserkers."
};

setup.ItemData.greataxe_steel = {
  id: "greataxe_steel",
  name: "Steel Greataxe",
  type: "weapon",
  subtype: "greataxe",
  tags: ["slashing", "2H", "heavy"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 15 },
  weight: 8.5,
  value: 360,
  img: "item_weapon_greataxe_steel.png",
  description: "A double-bladed executioner's weapon. Brutally efficient."
};

setup.ItemData.greataxe_obsidian = {
  id: "greataxe_obsidian",
  name: "Obsidian Greataxe",
  type: "weapon",
  subtype: "greataxe",
  tags: ["slashing", "2H", "heavy", "brittle"],
  material: "Obsidian",
  rarity: 1,
  damage: { slashing: 18 },
  weight: 7.5,
  value: 620,
  img: "item_weapon_greataxe_obsidian.png",
  description: "A terrifying axe of volcanic glass. Devastating but fragile."
};

/* =============================
=  Weapons - Unarmed/Natural   =
============================= */
setup.ItemData.brass_knuckles = {
  id: "brass_knuckles",
  name: "Brass Knuckles",
  type: "weapon",
  subtype: "knuckles",
  tags: ["blunt", "1H", "unarmed"],
  material: "Brass",
  rarity: 1,
  damage: { blunt: 3 },
  weight: 0.5,
  value: 50,
  img: "item_weapon_knuckles_brass.png",
  description: "Metal knuckles that add weight to your punches."
};

setup.ItemData.spiked_gauntlets = {
  id: "spiked_gauntlets",
  name: "Spiked Gauntlets",
  type: "weapon",
  subtype: "gauntlets",
  tags: ["blunt", "piercing", "1H", "unarmed"],
  material: "Steel",
  rarity: 1,
  damage: { blunt: 3, piercing: 2 },
  weight: 2.0,
  value: 180,
  img: "item_weapon_gauntlets_spiked.png",
  description: "Armored gloves with vicious spikes. Protection and punishment."
};

setup.ItemData.claws_iron = {
  id: "claws_iron",
  name: "Iron Claws",
  type: "weapon",
  subtype: "claws",
  tags: ["slashing", "1H", "unarmed"],
  material: "Iron",
  rarity: 1,
  damage: { slashing: 4 },
  weight: 1.0,
  value: 90,
  img: "item_weapon_claws_iron.png",
  description: "Strapped metal claws that extend from the knuckles."
};

setup.ItemData.claws_steel = {
  id: "claws_steel",
  name: "Steel Claws",
  type: "weapon",
  subtype: "claws",
  tags: ["slashing", "1H", "unarmed"],
  material: "Steel",
  rarity: 1,
  damage: { slashing: 6 },
  weight: 0.9,
  value: 220,
  img: "item_weapon_claws_steel.png",
  description: "Razor-sharp steel talons for those who fight like beasts."
};

/* =============================
=        Weapons - Bows        =
============================= */
setup.ItemData.shortbow_wood = {
  id: "shortbow_wood",
  name: "Wooden Shortbow",
  type: "weapon",
  subtype: "shortbow",
  tags: ["ranged", "2H", "bow"],
  material: "Wood",
  rarity: 1,
  damage: { piercing: 3 },
  weight: 2.0,
  value: 40,
  img: "item_weapon_shortbow_wood.png",
  description: "A simple hunting bow. Quick to draw but limited range."
};

setup.ItemData.shortbow_eldwood = {
  id: "shortbow_eldwood",
  name: "Eldwood Shortbow",
  type: "weapon",
  subtype: "shortbow",
  tags: ["ranged", "2H", "bow", "nature-attuned"],
  material: "Eldwood",
  rarity: 1,
  damage: { piercing: 6 },
  weight: 1.5,
  value: 320,
  img: "item_weapon_shortbow_eldwood.png",
  description: "A living wood bow that seems to guide arrows to their mark."
};

setup.ItemData.longbow_wood = {
  id: "longbow_wood",
  name: "Wooden Longbow",
  type: "weapon",
  subtype: "longbow",
  tags: ["ranged", "2H", "bow"],
  material: "Wood",
  rarity: 1,
  damage: { piercing: 5 },
  weight: 3.0,
  value: 80,
  img: "item_weapon_longbow_wood.png",
  description: "A tall bow requiring strength to draw. Excellent range and power."
};

setup.ItemData.longbow_yew = {
  id: "longbow_yew",
  name: "Yew Longbow",
  type: "weapon",
  subtype: "longbow",
  tags: ["ranged", "2H", "bow"],
  material: "Yew",
  rarity: 1,
  damage: { piercing: 7 },
  weight: 2.8,
  value: 240,
  img: "item_weapon_longbow_yew.png",
  description: "A masterwork bow carved from ancient yew. Prized by elite archers."
};

setup.ItemData.longbow_composite = {
  id: "longbow_composite",
  name: "Composite Longbow",
  type: "weapon",
  subtype: "longbow",
  tags: ["ranged", "2H", "bow"],
  material: "Composite",
  rarity: 1,
  damage: { piercing: 9 },
  weight: 3.2,
  value: 480,
  img: "item_weapon_longbow_composite.png",
  description: "Layered horn and sinew create exceptional draw strength."
};

/* =============================
=     Weapons - Crossbows      =
============================= */
setup.ItemData.crossbow_wood = {
  id: "crossbow_wood",
  name: "Wooden Crossbow",
  type: "weapon",
  subtype: "crossbow",
  tags: ["ranged", "2H", "crossbow"],
  material: "Wood",
  rarity: 1,
  damage: { piercing: 6 },
  weight: 5.0,
  value: 120,
  img: "item_weapon_crossbow_wood.png",
  description: "A mechanical bow that's easy to aim but slow to reload."
};

setup.ItemData.crossbow_steel = {
  id: "crossbow_steel",
  name: "Steel Crossbow",
  type: "weapon",
  subtype: "crossbow",
  tags: ["ranged", "2H", "crossbow"],
  material: "Steel",
  rarity: 1,
  damage: { piercing: 10 },
  weight: 6.5,
  value: 380,
  img: "item_weapon_crossbow_steel.png",
  description: "A powerful crossbow with steel arms. Punches through armor."
};

setup.ItemData.crossbow_repeating = {
  id: "crossbow_repeating",
  name: "Repeating Crossbow",
  type: "weapon",
  subtype: "crossbow",
  tags: ["ranged", "2H", "crossbow", "rapid-fire"],
  material: "Steel",
  rarity: 1,
  damage: { piercing: 6 },
  weight: 7.0,
  value: 680,
  img: "item_weapon_crossbow_repeating.png",
  description: "An ingenious design allowing multiple shots before reloading."
};

/* =============================
=   Weapons - Thrown Weapons   =
============================= */
setup.ItemData.javelin_iron = {
  id: "javelin_iron",
  name: "Iron Javelin",
  type: "weapon",
  subtype: "javelin",
  tags: ["piercing", "thrown", "1H"],
  material: "Iron",
  rarity: 1,
  damage: { piercing: 4 },
  weight: 2.0,
  value: 35,
  img: "item_weapon_javelin_iron.png",
  description: "A light spear designed for throwing. Can be used in melee if needed."
};

setup.ItemData.javelin_steel = {
  id: "javelin_steel",
  name: "Steel Javelin",
  type: "weapon",
  subtype: "javelin",
  tags: ["piercing", "thrown", "1H"],
  material: "Steel",
  rarity: 1,
  damage: { piercing: 6 },
  weight: 1.8,
  value: 85,
  img: "item_weapon_javelin_steel.png",
  description: "A balanced throwing spear with excellent penetration."
};