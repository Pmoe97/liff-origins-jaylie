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

		// Force sidebar layout class sync (compensate margin)
		const sidebar = document.getElementById("custom-sidebar");
		if (sidebar) {
			if (sidebar.classList.contains("collapsed")) {
				document.body.classList.add("sidebar-collapsed");
			} else {
				document.body.classList.remove("sidebar-collapsed");
			}
		}
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
	compare = null,
	conditions = null,
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

	const debug = true;
	let checks = [];

	if (debug) {
		console.groupCollapsed(`[smartChoice] ${label}`);
		console.log("Target:", target);
		console.log("Character:", npc, "| Phase:", phase);
	}

	// Relationship stats
	if (aff) {
		const [id, min] = aff;
		const result = (chars?.[id]?.affection ?? 0) >= min;
		checks.push(result);
		if (debug) console.log(`affection[${id}] >= ${min}? →`, result);
	}
	if (trust) {
		const [id, min] = trust;
		const result = (chars?.[id]?.trust ?? 0) >= min;
		checks.push(result);
		if (debug) console.log(`trust[${id}] >= ${min}? →`, result);
	}
	if (rapport) {
		const [id, min] = rapport;
		const result = (chars?.[id]?.rapport ?? 0) >= min;
		checks.push(result);
		if (debug) console.log(`rapport[${id}] >= ${min}? →`, result);
	}
	if (tension) {
		const [id, max] = tension;
		const result = (chars?.[id]?.tension ?? 0) <= max;
		checks.push(result);
		if (debug) console.log(`tension[${id}] <= ${max}? →`, result);
	}
	if (cooldown) {
		const [id, max] = cooldown;
		const result = (chars?.[id]?.cooldown ?? 0) <= max;
		checks.push(result);
		if (debug) console.log(`cooldown[${id}] <= ${max}? →`, result);
	}

	// Variable checks
	if (variable) {
		const result = !!v[variable];
		checks.push(result);
		if (debug) console.log(`variable[${variable}] →`, result);
	}
	if (notVariable) {
		const result = !v[notVariable];
		checks.push(result);
		if (debug) console.log(`notVariable[${notVariable}] →`, result);
	}

	// Inventory
	if (item) {
		const [id, count] = item;
		const result = (v.inventory?.[id] ?? 0) >= count;
		checks.push(result);
		if (debug) console.log(`item[${id}] x${count} →`, result);
	}

	// Quest
	if (quest) {
		const [path, min] = quest;
		const val = path.split(".").reduce((o, k) => o?.[k], v.quests ?? {});
		const result = (val ?? 0) >= min;
		checks.push(result);
		if (debug) console.log(`quest[${path}] >= ${min}? →`, result);
	}

	// Custom condition
	if (typeof conditions === "function") {
		const result = !!conditions(v);
		checks.push(result);
		if (debug) console.log(`custom condition →`, result);
	}

	// UsedMin
	if (usedMin !== null && npc && phase !== undefined) {
		const readVars = Object.entries(v)
			.filter(([key]) => key.startsWith(`Read_${phase}_${npc}_`))
			.map(([, value]) => value);
		const count = readVars.filter(val => val >= 1).length;
		const result = count >= usedMin;
		checks.push(result);
		if (debug) console.log(`usedMin[${usedMin}] →`, result, `(found: ${count})`);
	}

	// Compare logic
	if (compare) {
		const value = typeof compare.value === "string" ? setup._resolvePath(compare.value, v) : compare.value;
		const against = typeof compare.against === "string" ? setup._resolvePath(compare.against, v) : compare.against;
		const opMap = {
			"==": value == against,
			"===": value === against,
			"!=": value != against,
			"!==": value !== against,
			"<": value < against,
			"<=": value <= against,
			">": value > against,
			">=": value >= against
		};
		const result = opMap[compare.op];
		checks.push(result);
		if (debug) console.log(`compare ${compare.value} ${compare.op} ${compare.against} →`, result);
	}

	const passed = logic === "or" ? checks.some(Boolean) : checks.every(Boolean);
	if (debug) console.log("PASS LOGIC:", logic, "→", passed);
	if (debug) console.groupEnd();

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

	if (passed) return [label, target, reuse];
	if (!hide) return [label, null, reuse, "locked"];
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
			rapport: opt.rapport,
			tension: opt.tension,
			cooldown: opt.cooldown,
			variable: opt.variable,
			notVariable: opt.notVariable,
			item: opt.item,
			quest: opt.quest,
			compare: opt.compare,
			conditions: opt.conditions,
			usedMin: opt.usedMin,
			logic: opt.logic ?? "and",
			hide: opt.hide ?? false,
			reuse: opt.reuse ?? 0,
			logUnlock: opt.logUnlock,
			tags: opt.tags ?? []
		});
		if (entry) final.push(entry);
	}
	setup.addChoices(final);
};


