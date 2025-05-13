// ===============================
// 🍑 Initialize Sex Scene State
// ===============================
setup.initializeSexSceneStates = function (npcIdList) {
	const bodyParts = ["mouth", "hands", "penis", "vagina", "butt", "feet", "breasts"];

	const defaultPartState = () => {
		const state = {};
		for (const part of bodyParts) {
			state[part] = {
				occupiedBy: null,
				bound: false,
				gagged: false,
				disabled: false
			};
		}
		return state;
	};

	State.variables.sexScenePlayerState = {
		id: "player",
		name: "You",
		arousal: 0,
		orgasmCount: 0,
		parts: defaultPartState()
	};

	State.variables.sexScenePendingActions = [];

	const partnerIds = npcIdList.split(",").map(id => id.trim());
	State.variables.sexScenePartnerStates = {};

	for (const id of partnerIds) {
		const char = setup.characters?.[id];
		if (!char) {
			console.warn(`SexScene: NPC with ID '${id}' not found in setup.characters`);
			continue;
		}

		State.variables.sexScenePartnerStates[id] = {
			id,
			name: char.name ?? id,
			arousal: 0,
			orgasmCount: 0,
			parts: defaultPartState()
		};
	}

	console.log("Initialized Sex Scene States:", {
		player: State.variables.sexScenePlayerState,
		partners: State.variables.sexScenePartnerStates
	});
};

// ===============================
// 💄 Layout Macros
// ===============================
Macro.add("StartSexSceneLayout", {
	handler() {
		const backdrop = document.getElementById("text-backdrop");
		if (!backdrop) {
			console.warn("[SexSceneLayout] ⚠️ Could not find #text-backdrop.");
			return;
		}

		console.log("[SexSceneLayout] 🔹 Initializing layout...");

		backdrop.classList.add("in-sexscene");
		backdrop.innerHTML = `
			<div id="sexSceneLayoutContainer">
				<div id="sexSceneFeedbackPanel"><div id="sexSceneFeedbackBox"></div></div>
				<div id="sexSceneActionsPanel"><div id="sexSceneActionsBox"></div></div>
			</div>
		`;

		console.log("[SexSceneLayout] ✅ HTML structure injected.");

		const tryInjectPassage = () => {
			const passage = document.querySelector('#passages > .passage');
			const feedbackBox = document.getElementById("sexSceneFeedbackBox");

			if (passage && feedbackBox) {
				feedbackBox.appendChild(passage);
				console.log("[SexSceneLayout] ✅ Passage content moved to feedback panel.");
			} else {
				console.log("[SexSceneLayout] ⏳ Waiting for passage render...");
				requestAnimationFrame(tryInjectPassage);
			}
		};

		tryInjectPassage();
	}
});

Macro.add("EndSexSceneLayout", {
	handler() {
		const backdrop = document.getElementById("text-backdrop");
		if (backdrop?.classList.contains("in-sexscene")) {
			backdrop.classList.remove("in-sexscene");
			console.log("[SexSceneLayout] 🔸 Layout class removed.");
		} else {
			console.warn("[SexSceneLayout] ⚠️ Tried to end layout, but class wasn't present.");
		}
	}
});

// ===============================
// 🎛️ Render Action Buttons
// ===============================
setup.renderSexSceneActions = function () {
	console.log("[SexSceneRender] 🔄 Rendering available sex actions...");

	const $wrapper = document.getElementById("sexSceneActionsBox");
	if (!$wrapper) {
		console.warn("[SexSceneRender] ❌ #sexSceneActionsBox not found.");
		return;
	}

	$wrapper.innerHTML = "";

	const playerState = State.variables.sexScenePlayerState;
	if (!playerState) {
		console.error("[SexSceneRender] ❌ Player state missing.");
		return;
	}

	const groupedActions = {};

	for (const [label, act] of Object.entries(setup.SexualActsDB)) {
		if (!act.usedBy || !Array.isArray(act.usedBy)) {
			console.warn(`[SexSceneRender] ⚠️ '${label}' missing 'usedBy'.`);
			continue;
		}

		for (const part of act.usedBy) {
			if (!playerState.parts?.[part]) {
				console.log(`[SexSceneRender] ⛔ '${label}' skipped - no '${part}' on player.`);
				continue;
			}

			const partState = playerState.parts[part];
			if (partState.bound || partState.gagged || partState.disabled) {
				console.log(`[SexSceneRender] ⛔ '${label}' blocked — ${part} is bound/gagged/disabled.`);
				continue;
			}

			if (!groupedActions[part]) groupedActions[part] = [];
			groupedActions[part].push({ label, act });
			console.log(`[SexSceneRender] ✅ '${label}' available under '${part}'.`);
		}
	}

  for (const [part, actions] of Object.entries(groupedActions)) {
	if (!actions.length) continue; // ⛔ Skip empty action groups

	const $group = document.createElement("div");
	$group.classList.add("sexscene-group");
	$group.innerHTML = `<h3>${part.toUpperCase()}</h3>`;

	for (const entry of actions) {
		const $btn = document.createElement("button");
		$btn.textContent = entry.act.label;

		const isActive = State.variables.sexScenePendingActions?.some(a => a.label === entry.label);
		if (isActive) $btn.classList.add("active-sexact");

		$btn.onclick = () => setup.toggleSexAction(entry.label);
		$group.appendChild($btn);
	}

	$wrapper.appendChild($group);
}

  setup.renderSexSceneContinueButton();

};

// ===============================
// 🔘 Track & Toggle Pending Actions
// ===============================
setup.toggleSexAction = function (label) {
	const action = setup.SexualActsDB[label];
	if (!action) {
		console.warn(`[SexSceneAction] ❌ Unknown label: ${label}`);
		return;
	}

	const queue = State.variables.sexScenePendingActions ?? [];
	const index = queue.findIndex(entry => entry.label === label);

	if (index >= 0) {
		queue.splice(index, 1);
		console.log(`[SexSceneAction] 🔄 Removed '${label}' from queue.`);
	} else {
		if (action.exclusive && Array.isArray(action.usedBy)) {
			for (const part of action.usedBy) {
				for (let i = queue.length - 1; i >= 0; i--) {
					const existing = setup.SexualActsDB[queue[i].label];
					if (existing?.usedBy?.includes(part)) {
						console.log(`[SexSceneAction] 🔁 '${queue[i].label}' removed (exclusive conflict with '${label}')`);
						queue.splice(i, 1);
					}
				}
			}
		}

		queue.push({ label, data: action });
		console.log(`[SexSceneAction] ✅ Added '${label}' to queue.`);
	}

	State.variables.sexScenePendingActions = queue;
	setup.renderSexSceneActions();
};

/* Continue Button and logic handler */
setup.renderSexSceneContinueButton = function () {
	const $wrapper = document.getElementById("sexSceneActionsBox");
	if (!$wrapper) return;

	const $button = document.createElement("button");
	$button.id = "sexSceneContinueButton";
	$button.textContent = "Continue";
	$button.onclick = setup.handleSexSceneContinue;
	$button.style.marginTop = "2em";
	$wrapper.appendChild($button);
};

setup.handleSexSceneContinue = function () {
	console.log("[SexScene] ▶️ CONTINUE TURN");

	const pending = State.variables.sexScenePendingActions ?? [];
	if (!pending.length) {
		console.log("[SexScene] ⚠️ No actions selected this turn.");
		return;
	}

	for (const entry of pending) {
		console.log(`[SexScene] ➤ Applying action '${entry.label}'...`);

		// Example: Arousal gain per action (custom logic can go here)
		const receiverId = setup.SexualActsDB[entry.label]?.receiver === "npc"
			? Object.keys(State.variables.sexScenePartnerStates)[0] // TEMP: just grab first NPC
			: "player";

		const receiverState = receiverId === "player"
			? State.variables.sexScenePlayerState
			: State.variables.sexScenePartnerStates[receiverId];

		if (receiverState) {
			receiverState.arousal += 10;
			console.log(`   ➕ Arousal +10 to '${receiverState.name}' (${receiverId})`);
		}
	}

	// Clear pending queue
	State.variables.sexScenePendingActions = [];

	// Refresh UI
	setup.renderSexSceneActions();

	// Optional: Print feedback
	const feedbackBox = document.getElementById("sexSceneFeedbackBox");
	if (feedbackBox) {
		const p = document.createElement("p");
		p.textContent = "You acted. The scene shifts...";
		feedbackBox.appendChild(p);
	}

	console.log("[SexScene] 🔁 Turn complete.");
};
