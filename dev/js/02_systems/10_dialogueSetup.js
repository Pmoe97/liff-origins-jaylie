// ===============================
// 📦 Dialogue Layout Macros
// ===============================

// Injects the side-by-side convo UI and moves passage content to convoBox
Macro.add("StartDialogueLayout", {
	handler() {
		const backdrop = document.getElementById('text-backdrop');
		if (!backdrop) {
			console.warn("<<StartDialogueLayout>> failed: #text-backdrop not found.");
			return;
		}

		backdrop.classList.add("in-dialogue");
		backdrop.innerHTML = `
			<div id="convoLayoutContainer">
				<div id="convoChoicesPanel"><div id="convoChoices"></div></div>
				<div id="convoBoxPanel"><div id="convoBox"></div></div>
			</div>
		`;

		const tryInjectPassage = () => {
			const passage = document.querySelector('#passages > .passage');
			const convoBox = document.getElementById('convoBox');
			if (passage && convoBox) {
				convoBox.appendChild(passage);
			} else {
				requestAnimationFrame(tryInjectPassage);
			}
		};

		tryInjectPassage();
	}
});

// Removes dialogue layout formatting
Macro.add("EndDialogueLayout", {
	handler() {
		const backdrop = document.getElementById('text-backdrop');
		if (backdrop) {
			backdrop.classList.remove("in-dialogue");
		}
	}
});

// Clears the choices box
setup.clearConvoChoices = function () {
	const choicesPanel = document.getElementById("convoChoices");
	if (choicesPanel) {
		choicesPanel.innerHTML = "";
	}
};

// Core choice injector
setup.addChoices = function (list) {
	const $container = $("#convoChoices");
	if (!$container.length) {
		console.warn("[addChoices] convoChoices not found.");
		return;
	}

	$container.empty();
	State.variables.usedDialogueOptions ??= {};

	list.forEach(([label, target, reuseFlag = 0, status = "normal"]) => {
		const reusable = reuseFlag === 1 || reuseFlag === "1";
		const used = State.variables.usedDialogueOptions[target];

		// Locked choice (unmet requirements)
		if (status === "locked") {
			const $button = $("<p>")
				.addClass("dialogue-choice locked")
				.text(label);
			$container.append($button);
			return;
		}

		// Skip used non-reusable
		if (used && !reusable) {
			console.log(`[addChoices] Skipping used non-reusable choice: ${target}`);
			return;
		}

		const macroCall = `<<dialogueChoice "${label}" "${target}" "${reusable ? 1 : 0}">>`;
		console.log(`[addChoices] Injecting: ${macroCall}`);
		new Wikifier($container[0], macroCall);
	});
};

// Internal helper to add a single choice (just wraps in a list)
setup.addChoice = function (label, passage, reuseFlag = 0) {
	setup.addChoices([[label, passage, reuseFlag]]);
};

// ✅ New: Universal smartChoice function
setup.smartChoice = function (label, target, {
	aff = null,
	trust = null,
	rapport = null,
	tension = null,
	cooldown = null,
	variable = null,
	notVariable = null,
	item = null,
	quest = null,
	compare = null,       // Example: compare: { value: "$gold", op: ">=", against: 500 }
	conditions = null,    // Custom function(v) => boolean
	usedMin = null,
	logic = "and",
	hide = false,
	reuse = 0,
	logUnlock = null,
	tags = []
} = {}) {
	const v = State.variables;
	const t = State.temporary;
	const chars = v.characters;
	const npc = v.currentNPC;
	const phase = v.currentPhase;

	let checks = [];

	// Core character metric checks
	if (aff) {
		const [id, min] = aff;
		checks.push((chars?.[id]?.affection ?? 0) >= min);
	}
	if (trust) {
		const [id, min] = trust;
		checks.push((chars?.[id]?.trust ?? 0) >= min);
	}
	if (rapport) {
		const [id, min] = rapport;
		checks.push((chars?.[id]?.rapport ?? 0) >= min);
	}
	if (tension) {
		const [id, max] = tension;
		checks.push((chars?.[id]?.tension ?? 0) <= max);
	}
	if (cooldown) {
		const [id, max] = cooldown;
		checks.push((chars?.[id]?.cooldown ?? 0) <= max);
	}

	// Variable checks
	if (variable) checks.push(!!v[variable]);
	if (notVariable) checks.push(!v[notVariable]);

	// Inventory check
	if (item) {
		const [id, count] = item;
		checks.push((v.inventory?.[id] ?? 0) >= count);
	}

	// Quest progress check
	if (quest) {
		const [path, min] = quest;
		const val = path.split(".").reduce((o, k) => o?.[k], v.quests ?? {});
		checks.push((val ?? 0) >= min);
	}

	// Custom boolean logic
	if (typeof conditions === "function") {
		checks.push(!!conditions(v));
	}

	// UsedMin scoped to this NPC + phase
	if (usedMin !== null && npc && phase !== undefined) {
		const readVars = v[`Read_Phase${phase}_${npc}`] ?? {};
		const count = Object.values(readVars).filter(v => v >= 1).length;
		checks.push(count >= usedMin);
	}

	// Advanced operator
	if (compare) {
		const value = typeof compare.value === "string" ? setup._resolvePath(compare.value, v) : compare.value;
		const against = typeof compare.against === "string" ? setup._resolvePath(compare.against, v) : compare.against;
		const result = {
			"==": value == against,
			"===": value === against,
			"!=": value != against,
			"!==": value !== against,
			"<": value < against,
			"<=": value <= against,
			">": value > against,
			">=": value >= against
		}[compare.op];
		checks.push(!!result);
	}

	// Check logic
	const passed = logic === "or" ? checks.some(Boolean) : checks.every(Boolean);

	// Log tags
	if (passed && tags?.length > 0) {
		v.choiceTags ??= [];
		tags.forEach(tag => {
			if (!v.choiceTags.includes(tag)) v.choiceTags.push(tag);
		});
	}

	// Log unlock variable
	if (passed && logUnlock) {
		v[logUnlock] = true;
	}

	// Handle output
	if (passed) {
		return [label, target, reuse];
	}

	if (!hide) {
		return [label, null, reuse, "locked"];
	}

	return null;
};

// Path resolver (supports nested vars like "$characters.marie.affection")
setup._resolvePath = function (path, source = State.variables) {
	return path.split(".").reduce((acc, key) => acc?.[key], source);
};



// ✅ Batch version: Array of smartChoice calls
setup.smartChoices = function (list) {
	const final = [];
	for (const opt of list) {
		const entry = setup.smartChoice(opt.label, opt.target, {
			aff: opt.aff,
			trust: opt.trust,
			variable: opt.variable,
			item: opt.item,
			quest: opt.quest,
			hide: opt.hide ?? false,
			reuse: opt.reuse ?? 0,
			logic: opt.logic ?? "and"
		});
		if (entry) final.push(entry);
	}
	setup.addChoices(final);
};

