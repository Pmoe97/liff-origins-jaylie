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
	variable = null,
	item = null,
	quest = null,
	hide = false,
	reuse = 0,
	logic = "and"
} = {}) {
	const v = State.variables;
	const chars = v.characters;

	let checks = [];

	if (aff) {
		const [npc, min] = aff;
		checks.push((chars?.[npc]?.affection ?? 0) >= min);
	}
	if (trust) {
		const [npc, min] = trust;
		checks.push((chars?.[npc]?.trust ?? 0) >= min);
	}
	if (variable) {
		checks.push(!!v[variable]);
	}
	if (item) {
		const [id, count] = item;
		checks.push((v.inventory?.[id] ?? 0) >= count);
	}
	if (quest) {
		const [path, min] = quest;
		const val = path.split(".").reduce((o, k) => o?.[k], v.quests ?? {});
		checks.push((val ?? 0) >= min);
	}

	const passed = logic === "or"
		? checks.some(Boolean)
		: checks.every(Boolean);

	if (passed) {
		return [label, target, reuse];
	}

	// Return a "locked" flag if not hidden
	if (!hide) {
		return [label, null, reuse, "locked"];
	}

	return null;
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

