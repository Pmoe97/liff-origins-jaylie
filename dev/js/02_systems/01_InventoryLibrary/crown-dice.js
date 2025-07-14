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
