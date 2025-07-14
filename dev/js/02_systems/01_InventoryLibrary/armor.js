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
=    Unarmored - Robes         =
============================= */
setup.ItemData.robe_cloth = {
  id: "robe_cloth",
  name: "Cloth Robe",
  type: "armor",
  subtype: "robe",
  tags: ["chest", "unarmored", "mage"],
  material: "Cloth",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 0 },
  weight: 2.0,
  value: 20,
  img: "item_armor_robe_cloth.png",
  description: "Simple cloth robes offering no protection but unrestricted movement."
};

setup.ItemData.robe_silk = {
  id: "robe_silk",
  name: "Silk Robe",
  type: "armor",
  subtype: "robe",
  tags: ["chest", "unarmored", "mage", "comfortable"],
  material: "Silk",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 1 },
  weight: 1.5,
  value: 120,
  img: "item_armor_robe_silk.png",
  description: "Luxurious silk robes favored by wealthy mages and nobles."
};

setup.ItemData.robe_enchanted = {
  id: "robe_enchanted",
  name: "Enchanted Robe",
  type: "armor",
  subtype: "robe",
  tags: ["chest", "unarmored", "mage", "magic-conductive"],
  material: "Enchanted Silk",
  rarity: 1,
  resist: { slashing: 1, piercing: 1, blunt: 2, magic: 3 },
  weight: 1.8,
  value: 680,
  img: "item_armor_robe_enchanted.png",
  description: "Robes woven with protective enchantments. Offers magical resistance."
};

/* =============================
=   Unarmored - Tunics         =
============================= */
setup.ItemData.tunic_cloth = {
  id: "tunic_cloth",
  name: "Cloth Tunic",
  type: "armor",
  subtype: "tunic",
  tags: ["chest", "unarmored"],
  material: "Cloth",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 0 },
  weight: 1.5,
  value: 15,
  img: "item_armor_tunic_cloth.png",
  description: "A simple cloth tunic. Comfortable but offers no protection."
};

setup.ItemData.tunic_wool = {
  id: "tunic_wool",
  name: "Wool Tunic",
  type: "armor",
  subtype: "tunic",
  tags: ["chest", "unarmored", "warm"],
  material: "Wool",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 1 },
  weight: 2.2,
  value: 35,
  img: "item_armor_tunic_wool.png",
  description: "A thick wool tunic providing warmth in cold climates."
};

setup.ItemData.tunic_fine = {
  id: "tunic_fine",
  name: "Fine Tunic",
  type: "armor",
  subtype: "tunic",
  tags: ["chest", "unarmored", "noble"],
  material: "Fine Cloth",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 0 },
  weight: 1.3,
  value: 85,
  img: "item_armor_tunic_fine.png",
  description: "An expertly tailored tunic suitable for court appearances."
};

/* =============================
=   Unarmored - Cloaks         =
============================= */
setup.ItemData.cloak_travelers = {
  id: "cloak_travelers",
  name: "Traveler's Cloak",
  type: "armor",
  subtype: "cloak",
  tags: ["shoulders", "unarmored", "weather-resistant"],
  material: "Oiled Cloth",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 1 },
  weight: 2.5,
  value: 45,
  img: "item_armor_cloak_travelers.png",
  description: "A weatherproof cloak essential for long journeys."
};

setup.ItemData.cloak_hooded = {
  id: "cloak_hooded",
  name: "Hooded Cloak",
  type: "armor",
  subtype: "cloak",
  tags: ["shoulders", "unarmored", "concealing"],
  material: "Wool",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 1 },
  weight: 3.0,
  value: 55,
  img: "item_armor_cloak_hooded.png",
  description: "A heavy cloak with deep hood. Perfect for staying anonymous."
};

setup.ItemData.cloak_elvish = {
  id: "cloak_elvish",
  name: "Elvish Cloak",
  type: "armor",
  subtype: "cloak",
  tags: ["shoulders", "unarmored", "stealth", "lightweight"],
  material: "Elvish Silk",
  rarity: 1,
  resist: { slashing: 1, piercing: 0, blunt: 1 },
  weight: 1.0,
  value: 420,
  img: "item_armor_cloak_elvish.png",
  description: "A cloak that seems to blend with shadows and foliage."
};

/* =============================
=   Unarmored - Hats           =
============================= */
setup.ItemData.hat_cloth = {
  id: "hat_cloth",
  name: "Cloth Hat",
  type: "armor",
  subtype: "hat",
  tags: ["head", "unarmored"],
  material: "Cloth",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 0 },
  weight: 0.3,
  value: 10,
  img: "item_armor_hat_cloth.png",
  description: "A simple cloth hat. Keeps the sun off but little else."
};

setup.ItemData.hat_wizard = {
  id: "hat_wizard",
  name: "Wizard Hat",
  type: "armor",
  subtype: "hat",
  tags: ["head", "unarmored", "mage"],
  material: "Enchanted Felt",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 0, magic: 2 },
  weight: 0.5,
  value: 180,
  img: "item_armor_hat_wizard.png",
  description: "A pointed hat that enhances magical focus."
};

/* =============================
=   Unarmored - Pants		  =
============================= */


/* =============================
=  Light Armor - Leather       =
============================= */
setup.ItemData.leather_vest = {
  id: "leather_vest",
  name: "Leather Vest",
  type: "armor",
  subtype: "leather",
  tags: ["chest", "light"],
  material: "Leather",
  rarity: 1,
  resist: { slashing: 2, piercing: 1, blunt: 2 },
  weight: 4.0,
  value: 60,
  img: "item_armor_leather_vest.png",
  description: "A basic leather vest offering modest protection."
};

setup.ItemData.leather_armor = {
  id: "leather_armor",
  name: "Leather Armor",
  type: "armor",
  subtype: "leather",
  tags: ["chest", "light"],
  material: "Leather",
  rarity: 1,
  resist: { slashing: 3, piercing: 2, blunt: 3 },
  weight: 6.0,
  value: 100,
  img: "item_armor_leather_armor.png",
  description: "Full leather body armor. Standard protection for scouts."
};

setup.ItemData.leather_reinforced = {
  id: "leather_reinforced",
  name: "Reinforced Leather",
  type: "armor",
  subtype: "leather",
  tags: ["chest", "light"],
  material: "Reinforced Leather",
  rarity: 1,
  resist: { slashing: 4, piercing: 3, blunt: 4 },
  weight: 7.5,
  value: 180,
  img: "item_armor_leather_reinforced.png",
  description: "Leather armor with strategic metal reinforcements."
};

setup.ItemData.leather_cap = {
  id: "leather_cap",
  name: "Leather Cap",
  type: "armor",
  subtype: "cap",
  tags: ["head", "light"],
  material: "Leather",
  rarity: 1,
  resist: { slashing: 1, piercing: 1, blunt: 2 },
  weight: 0.8,
  value: 35,
  img: "item_armor_cap_leather.png",
  description: "A simple leather cap providing basic head protection."
};

setup.ItemData.leather_gloves = {
  id: "leather_gloves",
  name: "Leather Gloves",
  type: "armor",
  subtype: "gloves",
  tags: ["hands", "light"],
  material: "Leather",
  rarity: 1,
  resist: { slashing: 1, piercing: 0, blunt: 1 },
  weight: 0.5,
  value: 25,
  img: "item_armor_gloves_leather.png",
  description: "Supple leather gloves that don't impede dexterity."
};

setup.ItemData.leather_boots = {
  id: "leather_boots",
  name: "Leather Boots",
  type: "armor",
  subtype: "boots",
  tags: ["shoes", "light"],
  material: "Leather",
  rarity: 1,
  resist: { slashing: 1, piercing: 1, blunt: 2 },
  weight: 1.5,
  value: 40,
  img: "item_armor_boots_leather.png",
  description: "Sturdy leather boots suitable for long travels."
};

setup.ItemData.leather_pants = {
  id: "leather_pants",
  name: "Leather Pants",
  type: "armor",
  subtype: "pants",
  tags: ["legs", "light"],
  material: "Leather",
  rarity: 1,
  resist: { slashing: 2, piercing: 1, blunt: 2 },
  weight: 3.0,
  value: 50,
  img: "item_armor_pants_leather.png",
  description: "Durable leather pants offering leg protection."
};

/* =============================
=  Light Armor - Studded       =
============================= */
setup.ItemData.studded_leather_armor = {
  id: "studded_leather_armor",
  name: "Studded Leather Armor",
  type: "armor",
  subtype: "studded",
  tags: ["chest", "light"],
  material: "Studded Leather",
  rarity: 1,
  resist: { slashing: 4, piercing: 3, blunt: 3 },
  weight: 8.0,
  value: 150,
  img: "item_armor_studded_leather.png",
  description: "Leather armor reinforced with metal studs for extra protection."
};

setup.ItemData.studded_bracers = {
  id: "studded_bracers",
  name: "Studded Bracers",
  type: "armor",
  subtype: "bracers",
  tags: ["arms", "light"],
  material: "Studded Leather",
  rarity: 1,
  resist: { slashing: 2, piercing: 1, blunt: 2 },
  weight: 1.2,
  value: 45,
  img: "item_armor_bracers_studded.png",
  description: "Leather arm guards reinforced with metal studs."
};

/* =============================
=  Light Armor - Hide          =
============================= */
setup.ItemData.hide_armor = {
  id: "hide_armor",
  name: "Hide Armor",
  type: "armor",
  subtype: "hide",
  tags: ["chest", "light"],
  material: "Hide",
  rarity: 1,
  resist: { slashing: 3, piercing: 2, blunt: 4 },
  weight: 7.0,
  value: 75,
  img: "item_armor_hide_armor.png",
  description: "Thick animal hide armor. Crude but effective."
};

setup.ItemData.hide_bear = {
  id: "hide_bear",
  name: "Bear Hide Armor",
  type: "armor",
  subtype: "hide",
  tags: ["chest", "light", "warm"],
  material: "Bear Hide",
  rarity: 1,
  resist: { slashing: 4, piercing: 2, blunt: 5 },
  weight: 9.0,
  value: 180,
  img: "item_armor_hide_bear.png",
  description: "Heavy bear hide providing excellent protection and warmth."
};

setup.ItemData.hide_wolf = {
  id: "hide_wolf",
  name: "Wolf Hide Cloak",
  type: "armor",
  subtype: "cloak",
  tags: ["shoulders", "light", "warm"],
  material: "Wolf Hide",
  rarity: 1,
  resist: { slashing: 2, piercing: 1, blunt: 2 },
  weight: 4.0,
  value: 120,
  img: "item_armor_cloak_wolf.png",
  description: "A cloak made from wolf pelts. Intimidating and warm."
};

/* =============================
=  Light Armor - Padded        =
============================= */
setup.ItemData.padded_armor = {
  id: "padded_armor",
  name: "Padded Armor",
  type: "armor",
  subtype: "padded",
  tags: ["chest", "light"],
  material: "Quilted Cloth",
  rarity: 1,
  resist: { slashing: 1, piercing: 1, blunt: 3 },
  weight: 5.0,
  value: 45,
  img: "item_armor_padded_armor.png",
  description: "Layers of quilted cloth providing cushioning against blows."
};

setup.ItemData.padded_gambeson = {
  id: "padded_gambeson",
  name: "Gambeson",
  type: "armor",
  subtype: "gambeson",
  tags: ["chest", "light"],
  material: "Quilted Linen",
  rarity: 1,
  resist: { slashing: 2, piercing: 1, blunt: 4 },
  weight: 6.0,
  value: 80,
  img: "item_armor_gambeson_padded.png",
  description: "A military padded jacket worn under heavier armor or alone."
};

/* =============================
=  Light Armor - Accessories   =
============================= */
setup.ItemData.belt_leather = {
  id: "belt_leather",
  name: "Leather Belt",
  type: "armor",
  subtype: "belt",
  tags: ["waist", "light", "utility"],
  material: "Leather",
  rarity: 1,
  resist: { slashing: 0, piercing: 0, blunt: 1 },
  weight: 0.5,
  value: 20,
  img: "item_armor_belt_leather.png",
  description: "A sturdy leather belt with pouches for small items."
};

setup.ItemData.backpack_leather = {
  id: "backpack_leather",
  name: "Leather Backpack",
  type: "armor",
  subtype: "backpack",
  tags: ["backpack", "utility"],
  material: "Leather",
  rarity: 1,
  resist: { slashing: 1, piercing: 0, blunt: 1 },
  weight: 2.0,
  value: 50,
  carryCapacity: 30,
  img: "item_armor_backpack_leather.png",
  description: "A well-crafted leather backpack for carrying supplies."
};

setup.ItemData.mask_leather = {
  id: "mask_leather",
  name: "Leather Mask",
  type: "armor",
  subtype: "mask",
  tags: ["face", "light", "concealing"],
  material: "Leather",
  rarity: 1,
  resist: { slashing: 1, piercing: 0, blunt: 1 },
  weight: 0.3,
  value: 35,
  img: "item_armor_mask_leather.png",
  description: "A leather mask covering the lower face. Popular among rogues."
};

/* =============================
=     Rings - Basic            =
============================= */
setup.ItemData.ring_copper = {
  id: "ring_copper",
  name: "Copper Ring",
  type: "armor",
  subtype: "ring",
  tags: ["ring", "accessory"],
  material: "Copper",
  rarity: 1,
  resist: { magic: 1 },
  weight: 0.05,
  value: 15,
  img: "item_armor_ring_copper.png",
  description: "A simple copper band. Provides minimal magical resistance."
};

setup.ItemData.ring_silver = {
  id: "ring_silver",
  name: "Silver Ring",
  type: "armor",
  subtype: "ring",
  tags: ["ring", "accessory"],
  material: "Silver",
  rarity: 1,
  resist: { magic: 2 },
  weight: 0.05,
  value: 85,
  img: "item_armor_ring_silver.png",
  description: "A polished silver ring offering protection against curses."
};

setup.ItemData.ring_gold = {
  id: "ring_gold",
  name: "Gold Ring",
  type: "armor",
  subtype: "ring",
  tags: ["ring", "accessory"],
  material: "Gold",
  rarity: 1,
  resist: { magic: 3 },
  weight: 0.08,
  value: 250,
  img: "item_armor_ring_gold.png",
  description: "An ornate gold ring that channels protective energies."
};

/* =============================
=     Necklaces - Basic        =
============================= */
setup.ItemData.necklace_leather = {
  id: "necklace_leather",
  name: "Leather Cord Necklace",
  type: "armor",
  subtype: "necklace",
  tags: ["neck", "accessory"],
  material: "Leather",
  rarity: 1,
  resist: { blunt: 1 },
  weight: 0.1,
  value: 10,
  img: "item_armor_necklace_leather.png",
  description: "A simple leather cord worn around the neck."
};

setup.ItemData.necklace_silver = {
	  id: "necklace_silver",
	  name: "Silver Necklace",
	  type: "armor",
	  subtype: "necklace",
	  tags: ["neck", "accessory"],
	  material: "Silver",
	  rarity: 1,
	  resist: { magic: 2 },
	  weight: 0.2,
	  value: 75,
	  img: "item_armor_necklace_silver.png",
	  description: "A delicate silver necklace that enhances magical resistance."
};

setup.ItemData.necklace_chain = {
  id: "necklace_chain",
  name: "Chain Necklace",
  type: "armor",
  subtype: "necklace",
  tags: ["neck", "accessory"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 1 },
  weight: 0.3,
  value: 45,
  img: "item_armor_necklace_chain.png",
  description: "A sturdy iron chain that offers slight neck protection."
};

/* =============================
=   Medium Armor - Chainmail   =
============================= */
setup.ItemData.chainmail_shirt = {
  id: "chainmail_shirt",
  name: "Chainmail Shirt",
  type: "armor",
  subtype: "chainmail",
  tags: ["chest", "medium"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 6, piercing: 3, blunt: 2 },
  weight: 12.0,
  value: 200,
  img: "item_armor_chainmail_shirt.png",
  description: "A shirt of interlocking iron rings. Excellent against slashing attacks."
};

setup.ItemData.chainmail_hauberk = {
  id: "chainmail_hauberk",
  name: "Chainmail Hauberk",
  type: "armor",
  subtype: "chainmail",
  tags: ["chest", "medium"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 8, piercing: 4, blunt: 3 },
  weight: 18.0,
  value: 400,
  img: "item_armor_chainmail_hauberk.png",
  description: "A long chainmail coat extending to the knees. Standard military protection."
};

setup.ItemData.chainmail_coif = {
  id: "chainmail_coif",
  name: "Chainmail Coif",
  type: "armor",
  subtype: "coif",
  tags: ["head", "medium"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 4, piercing: 2, blunt: 1 },
  weight: 3.0,
  value: 80,
  img: "item_armor_coif_chainmail.png",
  description: "A hood of chainmail protecting the head and neck."
};

setup.ItemData.chainmail_gloves = {
  id: "chainmail_gloves",
  name: "Chainmail Gloves",
  type: "armor",
  subtype: "gloves",
  tags: ["hands", "medium"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 3, piercing: 1, blunt: 1 },
  weight: 1.5,
  value: 65,
  img: "item_armor_gloves_chainmail.png",
  description: "Flexible mail gloves allowing dexterity while protecting hands."
};

/* =============================
=   Medium Armor - Scale       =
============================= */
setup.ItemData.scale_armor_iron = {
  id: "scale_armor_iron",
  name: "Iron Scale Armor",
  type: "armor",
  subtype: "scale",
  tags: ["chest", "medium"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 5, piercing: 6, blunt: 4 },
  weight: 15.0,
  value: 250,
  img: "item_armor_scale_iron.png",
  description: "Overlapping metal scales provide flexible protection."
};

setup.ItemData.scale_armor_steel = {
  id: "scale_armor_steel",
  name: "Steel Scale Armor",
  type: "armor",
  subtype: "scale",
  tags: ["chest", "medium"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 7, piercing: 8, blunt: 5 },
  weight: 14.0,
  value: 480,
  img: "item_armor_scale_steel.png",
  description: "High-quality steel scales offering excellent all-around defense."
};

setup.ItemData.scale_armor_dragon = {
  id: "scale_armor_dragon",
  name: "Dragonscale Armor",
  type: "armor",
  subtype: "scale",
  tags: ["chest", "medium", "fire-resistant"],
  material: "Dragonscale",
  rarity: 1,
  resist: { slashing: 8, piercing: 9, blunt: 6, fire: 10 },
  weight: 12.0,
  value: 2800,
  img: "item_armor_scale_dragon.png",
  description: "Armor crafted from genuine dragon scales. Highly resistant to fire."
};

/* =============================
=   Medium Armor - Lamellar    =
============================= */
setup.ItemData.lamellar_iron = {
  id: "lamellar_iron",
  name: "Iron Lamellar",
  type: "armor",
  subtype: "lamellar",
  tags: ["chest", "medium"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 6, piercing: 5, blunt: 5 },
  weight: 13.0,
  value: 220,
  img: "item_armor_lamellar_iron.png",
  description: "Small rectangular plates laced together. Popular in eastern lands."
};

setup.ItemData.lamellar_steel = {
  id: "lamellar_steel",
  name: "Steel Lamellar",
  type: "armor",
  subtype: "lamellar",
  tags: ["chest", "medium"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 8, piercing: 7, blunt: 6 },
  weight: 12.5,
  value: 450,
  img: "item_armor_lamellar_steel.png",
  description: "Expertly crafted lamellar providing superior protection and flexibility."
};

/* =============================
= Medium Armor - Reinforced    =
============================= */
setup.ItemData.reinforced_leather_heavy = {
  id: "reinforced_leather_heavy",
  name: "Heavy Reinforced Leather",
  type: "armor",
  subtype: "reinforced",
  tags: ["chest", "medium"],
  material: "Reinforced Leather",
  rarity: 1,
  resist: { slashing: 5, piercing: 4, blunt: 5 },
  weight: 10.0,
  value: 280,
  img: "item_armor_reinforced_heavy.png",
  description: "Thick leather armor with extensive metal reinforcement."
};

setup.ItemData.plated_gambeson = {
  id: "plated_gambeson",
  name: "Plated Gambeson",
  type: "armor",
  subtype: "gambeson",
  tags: ["chest", "medium"],
  material: "Steel-Reinforced Cloth",
  rarity: 1,
  resist: { slashing: 4, piercing: 3, blunt: 6 },
  weight: 9.0,
  value: 180,
  img: "item_armor_gambeson_plated.png",
  description: "A padded jacket reinforced with metal plates at vital areas."
};

/* =============================
= Medium Armor - Bone/Chitin   =
============================= */
setup.ItemData.bone_armor = {
  id: "bone_armor",
  name: "Bone Armor",
  type: "armor",
  subtype: "bone",
  tags: ["chest", "medium", "tribal"],
  material: "Bone",
  rarity: 1,
  resist: { slashing: 4, piercing: 5, blunt: 3 },
  weight: 11.0,
  value: 120,
  img: "item_armor_bone_armor.png",
  description: "Armor crafted from treated bones. Primitive but surprisingly effective."
};

setup.ItemData.chitin_armor = {
  id: "chitin_armor",
  name: "Chitin Armor",
  type: "armor",
  subtype: "chitin",
  tags: ["chest", "medium", "lightweight"],
  material: "Chitin",
  rarity: 1,
  resist: { slashing: 5, piercing: 6, blunt: 4 },
  weight: 8.0,
  value: 320,
  img: "item_armor_chitin_armor.png",
  description: "Armor made from giant insect shells. Light yet durable."
};

/* =============================
= Medium Armor - Accessories   =
============================= */
setup.ItemData.helmet_kettle = {
  id: "helmet_kettle",
  name: "Kettle Helm",
  type: "armor",
  subtype: "helmet",
  tags: ["head", "medium"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 4, piercing: 3, blunt: 5 },
  weight: 3.5,
  value: 120,
  img: "item_armor_helmet_kettle.png",
  description: "A wide-brimmed helmet offering good protection and visibility."
};

setup.ItemData.boots_chainmail = {
  id: "boots_chainmail",
  name: "Chainmail Boots",
  type: "armor",
  subtype: "boots",
  tags: ["shoes", "medium"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 3, piercing: 2, blunt: 2 },
  weight: 3.0,
  value: 85,
  img: "item_armor_boots_chainmail.png",
  description: "Boots reinforced with chainmail for battlefield protection."
};

/* =============================
=   Heavy Armor - Plate        =
============================= */
setup.ItemData.plate_armor_iron = {
  id: "plate_armor_iron",
  name: "Iron Plate Armor",
  type: "armor",
  subtype: "plate",
  tags: ["chest", "heavy"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 10, piercing: 8, blunt: 7 },
  weight: 25.0,
  value: 500,
  img: "item_armor_plate_iron.png",
  description: "Full plate armor offering maximum protection at the cost of mobility."
};

setup.ItemData.plate_armor_steel = {
  id: "plate_armor_steel",
  name: "Steel Plate Armor",
  type: "armor",
  subtype: "plate",
  tags: ["chest", "heavy"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 14, piercing: 11, blunt: 9 },
  weight: 22.0,
  value: 1200,
  img: "item_armor_plate_steel.png",
  description: "Masterwork steel plates providing unparalleled protection."
};

setup.ItemData.plate_armor_mithril = {
  id: "plate_armor_mithril",
  name: "Mithril Plate Armor",
  type: "armor",
  subtype: "plate",
  tags: ["chest", "heavy", "lightweight"],
  material: "Mithril",
  rarity: 1,
  resist: { slashing: 16, piercing: 13, blunt: 10 },
  weight: 12.0,
  value: 8500,
  img: "item_armor_plate_mithril.png",
  description: "Impossibly light mithril plates offering heavy protection without the weight."
};

setup.ItemData.plate_armor_adamantine = {
  id: "plate_armor_adamantine",
  name: "Adamantine Plate Armor",
  type: "armor",
  subtype: "plate",
  tags: ["chest", "heavy", "indestructible"],
  material: "Adamantine",
  rarity: 1,
  resist: { slashing: 20, piercing: 18, blunt: 15 },
  weight: 30.0,
  value: 12000,
  img: "item_armor_plate_adamantine.png",
  description: "Nearly indestructible armor forged from adamantine. The ultimate protection."
};

/* =============================
=   Heavy Armor - Helmets      =
============================= */
setup.ItemData.helmet_great_iron = {
  id: "helmet_great_iron",
  name: "Iron Great Helm",
  type: "armor",
  subtype: "great_helm",
  tags: ["head", "heavy"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 6, piercing: 5, blunt: 7 },
  weight: 5.0,
  value: 180,
  img: "item_armor_helmet_great_iron.png",
  description: "A full-coverage helmet with limited visibility but excellent protection."
};

setup.ItemData.helmet_great_steel = {
  id: "helmet_great_steel",
  name: "Steel Great Helm",
  type: "armor",
  subtype: "great_helm",
  tags: ["head", "heavy"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 8, piercing: 7, blunt: 9 },
  weight: 4.5,
  value: 380,
  img: "item_armor_helmet_great_steel.png",
  description: "A knight's helmet offering maximum head protection."
};

setup.ItemData.helmet_barbute = {
  id: "helmet_barbute",
  name: "Barbute Helmet",
  type: "armor",
  subtype: "barbute",
  tags: ["head", "heavy"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 7, piercing: 6, blunt: 8 },
  weight: 4.0,
  value: 320,
  img: "item_armor_helmet_barbute.png",
  description: "A T-shaped visor helmet balancing protection and visibility."
};

/* =============================
=  Heavy Armor - Gauntlets     =
============================= */
setup.ItemData.gauntlets_plate_iron = {
  id: "gauntlets_plate_iron",
  name: "Iron Plate Gauntlets",
  type: "armor",
  subtype: "gauntlets",
  tags: ["hands", "heavy"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 4, piercing: 3, blunt: 5 },
  weight: 2.5,
  value: 100,
  img: "item_armor_gauntlets_plate_iron.png",
  description: "Articulated iron gauntlets allowing surprising dexterity."
};

setup.ItemData.gauntlets_plate_steel = {
  id: "gauntlets_plate_steel",
  name: "Steel Plate Gauntlets",
  type: "armor",
  subtype: "gauntlets",
  tags: ["hands", "heavy"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 5, piercing: 4, blunt: 6 },
  weight: 2.2,
  value: 220,
  img: "item_armor_gauntlets_plate_steel.png",
  description: "Masterwork steel gauntlets with intricate articulation."
};

/* =============================
=   Heavy Armor - Greaves      =
============================= */
setup.ItemData.greaves_plate_iron = {
  id: "greaves_plate_iron",
  name: "Iron Plate Greaves",
  type: "armor",
  subtype: "greaves",
  tags: ["legs", "heavy"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 6, piercing: 5, blunt: 6 },
  weight: 8.0,
  value: 200,
  img: "item_armor_greaves_plate_iron.png",
  description: "Heavy leg armor protecting from knee to ankle."
};

setup.ItemData.greaves_plate_steel = {
  id: "greaves_plate_steel",
  name: "Steel Plate Greaves",
  type: "armor",
  subtype: "greaves",
  tags: ["legs", "heavy"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 8, piercing: 7, blunt: 7 },
  weight: 7.0,
  value: 420,
  img: "item_armor_greaves_plate_steel.png",
  description: "Well-crafted steel greaves offering superior leg protection."
};

/* =============================
=  Heavy Armor - Sabatons      =
============================= */
setup.ItemData.sabatons_iron = {
  id: "sabatons_iron",
  name: "Iron Sabatons",
  type: "armor",
  subtype: "sabatons",
  tags: ["shoes", "heavy"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 4, piercing: 3, blunt: 5 },
  weight: 4.0,
  value: 120,
  img: "item_armor_sabatons_iron.png",
  description: "Armored boots with articulated plates for foot protection."
};

setup.ItemData.sabatons_steel = {
  id: "sabatons_steel",
  name: "Steel Sabatons",
  type: "armor",
  subtype: "sabatons",
  tags: ["shoes", "heavy"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 5, piercing: 4, blunt: 6 },
  weight: 3.5,
  value: 280,
  img: "item_armor_sabatons_steel.png",
  description: "Expertly crafted armored boots allowing surprising mobility."
};

/* =============================
=  Heavy Armor - Banded Mail   =
============================= */
setup.ItemData.banded_mail_iron = {
  id: "banded_mail_iron",
  name: "Iron Banded Mail",
  type: "armor",
  subtype: "banded",
  tags: ["chest", "heavy"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 9, piercing: 7, blunt: 8 },
  weight: 20.0,
  value: 380,
  img: "item_armor_banded_iron.png",
  description: "Horizontal bands of iron providing good all-around protection."
};

setup.ItemData.banded_mail_steel = {
  id: "banded_mail_steel",
  name: "Steel Banded Mail",
  type: "armor",
  subtype: "banded",
  tags: ["chest", "heavy"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 12, piercing: 9, blunt: 10 },
  weight: 18.0,
  value: 780,
  img: "item_armor_banded_steel.png",
  description: "Overlapping steel bands offering excellent protection with some flexibility."
};

/* =============================
=  Heavy Armor - Accessories   =
============================= */
setup.ItemData.pauldrons_iron = {
  id: "pauldrons_iron",
  name: "Iron Pauldrons",
  type: "armor",
  subtype: "pauldrons",
  tags: ["shoulders", "heavy"],
  material: "Iron",
  rarity: 1,
  resist: { slashing: 5, piercing: 4, blunt: 5 },
  weight: 5.0,
  value: 150,
  img: "item_armor_pauldrons_iron.png",
  description: "Heavy shoulder guards protecting the upper arms and shoulders."
};

setup.ItemData.pauldrons_steel = {
  id: "pauldrons_steel",
  name: "Steel Pauldrons",
  type: "armor",
  subtype: "pauldrons",
  tags: ["shoulders", "heavy"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 7, piercing: 6, blunt: 7 },
  weight: 4.5,
  value: 340,
  img: "item_armor_pauldrons_steel.png",
  description: "Articulated shoulder armor allowing arm movement while maintaining protection."
};

setup.ItemData.gorget_steel = {
  id: "gorget_steel",
  name: "Steel Gorget",
  type: "armor",
  subtype: "gorget",
  tags: ["neck", "heavy"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 6, piercing: 5, blunt: 4 },
  weight: 2.0,
  value: 180,
  img: "item_armor_gorget_steel.png",
  description: "A steel collar protecting the throat and neck."
};

/* =============================
=   Special Material Items     =
============================= */
setup.ItemData.backpack_mithril = {
  id: "backpack_mithril",
  name: "Mithril-Threaded Pack",
  type: "armor",
  subtype: "backpack",
  tags: ["backpack", "utility", "lightweight"],
  material: "Mithril-Thread",
  rarity: 1,
  resist: { slashing: 2, piercing: 1, blunt: 1 },
  weight: 0.8,
  value: 680,
  carryCapacity: 50,
  img: "item_armor_backpack_mithril.png",
  description: "A backpack woven with mithril thread. Incredibly light yet spacious."
};

setup.ItemData.mask_steel = {
  id: "mask_steel",
  name: "Steel War Mask",
  type: "armor",
  subtype: "mask",
  tags: ["face", "heavy", "intimidating"],
  material: "Steel",
  rarity: 1,
  resist: { slashing: 4, piercing: 3, blunt: 3 },
  weight: 1.5,
  value: 220,
  img: "item_armor_mask_steel.png",
  description: "A menacing steel mask that protects the face in battle."
};

/* =============================
=   Jewelry - Rings             =
============================= */
setup.ItemData.RalmorasRing = {
  id: "ralmoras_ring",
  name: "Ralmora's Ring",
  type: "armor",
  subtype: "ring",
  tags: ["ring", "accessory", "enchanted"],
  material: "Mithril",
  rarity: 2,
  resist: { magic: 5 },
  weight: 0.05,
  value: 1500,
  img: "item_armor_ring_ralmora.png",
  description: "A mithril ring worn by Jaylie's mother, Ralmora. It was given to her by her father when he proposed to her."
};
