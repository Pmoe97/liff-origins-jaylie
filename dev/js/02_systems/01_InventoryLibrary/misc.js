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
