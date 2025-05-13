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
		if (act.giver !== "player") {
			console.log(`[SexSceneRender] 🔒 Skipped '${label}' — not player-giver.`);
			continue;
		}

		if (!act.usedBy || !Array.isArray(act.usedBy)) {
			console.warn(`[SexSceneRender] ⚠️ '${label}' missing 'usedBy'.`);
			continue;
		}

		let isValid = false;

		for (const part of act.usedBy) {
			if (!playerState.parts?.[part]) {
				console.log(`[SexSceneRender] ⛔ '${label}' skipped — no '${part}' on player.`);
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
			isValid = true;
		}

		if (!isValid) {
			console.log(`[SexSceneRender] 🚫 '${label}' had no valid parts after filtering.`);
		}
	}

	for (const [part, actions] of Object.entries(groupedActions)) {
		if (!actions.length) continue;

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

/** ======================================================
 *   ORGASM TRIGGER & FEEDBACK SYSTEM
 *   Drop into 12_SexScene_Logic.js
 * ===================================================== */

setup.triggerOrgasm = function (charId) {
	const isPlayer = charId === "player";
	const char = isPlayer ? State.variables.player : State.variables.characters?.[charId];
	const state = isPlayer ? null : State.variables.sexSceneNPCStates?.[charId];
	if (!char) return;

	// Reset excitement, add fatigue
	char.status.excitement = 0;
	char.status.fatigue = Math.min(char.status.fatigue + 40, char.status.maxFatigue);

	if (isPlayer) {
		setup.offerPlayerOrgasmChoices();
	} else {
		setup.displayNPCOrgasmFeedback(charId);
	}
};

setup.displayNPCOrgasmFeedback = function (npcId) {
	const state = State.variables.sexSceneNPCStates?.[npcId];
	const lastAct = state?.lastReceivedAction ?? null;
	const npc = State.variables.characters[npcId];
	const feedbackBox = document.getElementById("sexSceneFeedbackBox");
	if (!feedbackBox) return;

	let climaxText = `<<npc.name>> orgasms, body trembling with release.`; // fallback

	if (lastAct && setup.SexSceneResponses[lastAct]?.responses?.climax) {
		const options = setup.SexSceneResponses[lastAct].responses.climax;
		const pick = options[Math.floor(Math.random() * options.length)];
		climaxText = pick;
	}

	const p = document.createElement("p");
	p.innerHTML = Wikifier.parse(climaxText);
	feedbackBox.appendChild(p);
};

setup.offerPlayerOrgasmChoices = function () {
	const box = document.getElementById("sexSceneFeedbackBox");
	if (!box) return;

	const p = document.createElement("p");
	p.innerHTML = "You're right at the edge. How do you want to finish?";
	box.appendChild(p);

	const choices = [
		["Cum Inside", "inside"],
		["Pull Out / Cum Outside", "outside"],
		["Cum on Their Face", "face"]
	];

	for (const [label, mode] of choices) {
		const btn = document.createElement("button");
		btn.className = "orgasm-choice-button";
		btn.textContent = label;
		btn.onclick = () => setup.resolvePlayerOrgasm(mode);
		box.appendChild(btn);
	}
};

setup.resolvePlayerOrgasm = function (mode) {
	const box = document.getElementById("sexSceneFeedbackBox");
	if (!box) return;

	const lines = {
		inside: "You release deep inside them, gasping as the climax overtakes you.",
		outside: "You pull out at the last second, stroking yourself to a messy finish across their body.",
		face: "You guide yourself upward and finish across their face, groaning through every twitch of pleasure."
	};

	const p = document.createElement("p");
	p.innerHTML = Wikifier.parse(lines[mode] ?? lines.inside);
	box.appendChild(p);

	// Reset player excitement, add fatigue again just in case
	const player = State.variables.player;
	player.status.excitement = 0;
	player.status.fatigue = Math.min(player.status.fatigue + 40, player.status.maxFatigue);
};


setup.performSexAct = function (label, targetId = null) {
	console.log(`[SexSceneAction] 🟢 Attempting action: ${label}`);

	const act = setup.SexualActsDB?.[label];
	if (!act) {
		console.warn(`[SexSceneAction] ❌ Action '${label}' not found in SexualActsDB.`);
		return;
	}

	const player = State.variables.player;
	const playerStatus = player.status;
	const playerState = State.variables.sexScenePlayerState;

	// If no specific target passed, pick the first NPC (assumes 1v1 scenes for now)
	if (!targetId) {
		const npcIds = Object.keys(State.variables.sexSceneNPCStates || {});
		if (npcIds.length === 0) {
			console.warn("[SexSceneAction] ❌ No available NPCs to target.");
			return;
		}
		targetId = npcIds[0];
	}
	const targetState = State.variables.sexSceneNPCStates[targetId];
	const targetChar = State.variables.characters[targetId];
	const targetStatus = targetChar.status;

	console.log(`[SexSceneAction] 📌 Target: ${targetId}`);
	console.log(`[SexSceneAction] ✅ Player excitement: ${playerStatus.excitement}`);
	console.log(`[SexSceneAction] ✅ Target excitement: ${targetStatus.excitement}`);

	// -- SIMULATED AROUSAL GAIN (adjust later per act type)
	const arousalGain = 25;

	if (act.usedBy.includes("genitals") && act.targetPart === "genitals") {
		console.log(`[SexSceneAction] 🔥 Genital-to-genital detected. Doubling arousal.`);
		playerStatus.excitement += arousalGain;
		targetStatus.excitement += arousalGain;
	} else {
		playerStatus.excitement += arousalGain;
		targetStatus.excitement += arousalGain;
	}

	console.log(`[SexSceneAction] 🧪 New player excitement: ${playerStatus.excitement}`);
	console.log(`[SexSceneAction] 🧪 New target excitement: ${targetStatus.excitement}`);

	// -- TRACK LAST RECEIVED ACTION
	targetState.lastReceivedAction = label;
	console.log(`[SexSceneAction] 📎 Set '${label}' as last received act for '${targetId}'.`);

	// -- DISPLAY RESPONSE (placeholder)
	const feedbackBox = document.getElementById("sexSceneFeedbackBox");
	if (feedbackBox) {
		const line = `${label}: you stimulate ${targetChar.name}.`;
		const p = document.createElement("p");
		p.textContent = line;
		feedbackBox.appendChild(p);
	}

	// -- ORGASM CHECK
	if (playerStatus.excitement >= playerStatus.maxExcitement) {
		console.log("[SexSceneAction] 🚨 PLAYER climax threshold reached.");
		setup.triggerOrgasm("player");
	}

	if (targetStatus.excitement >= targetStatus.maxExcitement) {
		console.log(`[SexSceneAction] 🚨 NPC '${targetId}' climax threshold reached.`);
		setup.triggerOrgasm(targetId);
	}

	// -- Re-render actions for continued play
	setup.renderSexSceneActions();
};
