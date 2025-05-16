// ===============================
// 🍑 Initialize Sex Scene State
// ===============================
setup.initializeSexSceneStates = function (npcIdListString) {
	console.log("[SexSceneInit] Initializing sex scene states...");

	const defaultPartState = () => ({
		occupiedBy: null,
		bound: false,
		gagged: false,
		disabled: false
	});

	// ✅ Updated and centralized body-to-parts detection
	const detectBodyParts = (char) => {
		const body = char.body || {};
		const parts = {};
		const summary = [];

		// Standard human parts assumed unless explicitly false
		parts.mouth = defaultPartState();
		summary.push("Mouth");

		parts.hand = defaultPartState(); // normalized to singular
		summary.push("Hand");

		parts.feet = defaultPartState();
		summary.push("Feet");

		parts.anus = defaultPartState();
		summary.push("Anus");

		if (body.penisSize != null) {
			parts.penis = defaultPartState();
			summary.push(`Penis (${body.penisSize}in)`);
		}

		if (body.vagina) {
			parts.vagina = defaultPartState();
			parts.clitoris = defaultPartState();
			summary.push("Vagina");
			summary.push("Clitoris");
		}

		if (body.breastSize > 0) {
			parts.breasts = defaultPartState();
			summary.push(`Breasts (size ${body.breastSize})`);
		}

		return { parts, summary };
	};

	// PLAYER INIT
	const playerChar = State.variables.player;
	const playerPartsData = detectBodyParts(playerChar);

	State.variables.sexScenePlayerState = {
		id: "player",
		name: "You",
		parts: playerPartsData.parts,
		orgasmCount: 0
	};

	console.log(`[SexSceneInit] 🧍 Player Anatomy Parts: ${playerPartsData.summary.join(", ")}`);

	// PARTNERS INIT
	const partnerIds = npcIdListString.split(",").map(id => id.trim());
	State.variables.sexScenePartnerStates = {};

	for (const id of partnerIds) {
		const npc = State.variables.characters[id];
		if (!npc) {
			console.warn(`[SexSceneInit] ❌ Character '${id}' not found.`);
			continue;
		}

		const npcPartsData = detectBodyParts(npc);

		State.variables.sexScenePartnerStates[id] = {
			id,
			name: npc.name ?? id,
			parts: npcPartsData.parts,
			orgasmCount: 0,
			lastReceivedAction: null
		};

		console.log(`[SexSceneInit] 👤 ${npc.name}'s Anatomy Parts: ${npcPartsData.summary.join(", ")}`);
	}

	State.variables.sexScenePendingActions = [];

	console.log("[SexSceneInit] ✅ Sex scene state initialized.");
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
				<div id="sexSceneStatusPanel"></div>
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


/* Body Part Detector */
setup.detectBodyParts = function (body) {
	const parts = {};

	// Core anatomy parts
	if (body?.mouth !== false) parts.mouth = {};
	if (body?.hands !== false) parts.hand = {}; // normalized to "hand" not "hands"
	if (body?.feet !== false) parts.feet = {};
	if (body?.anus !== false || body?.buttSize >= 0) parts.anus = {};
	if (body?.vagina) parts.vagina = {};
	if (body?.clitoris) parts.clitoris = {};
	if (body?.penisSize) parts.penis = {};
	if (body?.breastSize > 0) parts.breasts = {};

	return parts;
};


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
	const playerChar = State.variables.player;
	const playerSkills = playerChar.skills || {};
	const partnerId = Object.keys(State.variables.sexScenePartnerStates ?? {})[0];
	const partnerState = State.variables.sexScenePartnerStates?.[partnerId];
	const partnerChar = State.variables.characters?.[partnerId];

	if (!playerState || !partnerState || !partnerChar) {
		console.error("[SexSceneRender] ❌ Missing player or NPC state.");
		return;
	}

	const pending = State.variables.sexScenePendingActions ?? [];
	const groupedActions = {};

	for (const [label, act] of Object.entries(setup.SexualActsDB)) {
		// 1. Giver must be player
		if (act.giver !== "player") {
			console.log(`[SexSceneRender] 🔒 Skipped '${label}' — not player-giver.`);
			continue;
		}

		// 2. Must have valid subjectParts
		if (!act.subjectParts || !Array.isArray(act.subjectParts)) {
			console.warn(`[SexSceneRender] ⚠️ '${label}' missing subjectParts.`);
			continue;
		}

		// 3. Check player's anatomy
		let subjectCheck = act.subjectParts.every(part => {
			const partState = playerState.parts?.[part];
			return partState && !partState.bound && !partState.disabled;
		});
		if (!subjectCheck) {
			console.log(`[SexSceneRender] ⛔ '${label}' skipped — missing or blocked subjectParts.`);
			continue;
		}

		// 4. Check NPC's objectParts
		if (act.objectParts && Array.isArray(act.objectParts)) {
			let objectCheck = act.objectParts.every(part => partnerState.parts?.[part]);
			if (!objectCheck) {
				console.log(`[SexSceneRender] ⛔ '${label}' skipped — NPC missing objectParts.`);
				continue;
			}
		}

		// 5. Stage gating
		if (act.stageGroup && act.stageLevel > 0) {
			const lowerActive = pending.some(p => {
				const other = setup.SexualActsDB[p.label];
				return other && other.stageGroup === act.stageGroup && other.stageLevel === act.stageLevel - 1;
			});
			if (!lowerActive) {
				console.log(`[SexSceneRender] ⛔ '${label}' blocked — stage ${act.stageLevel - 1} not active in '${act.stageGroup}'.`);
				continue;
			}
		}

		// 6. Skill check
		if (act.skillsRequired) {
			let skillFail = false;
			for (const [skill, min] of Object.entries(act.skillsRequired)) {
				const current = playerSkills[skill] ?? 0;
				if (current < min) {
					skillFail = true;
					console.log(`[SexSceneRender] ⛔ '${label}' blocked — skill '${skill}' too low (${current} < ${min}).`);
					break;
				}
			}
			if (skillFail) continue;
		}

		// Group by first subject part for UI
		const primaryPart = act.subjectParts[0];
		if (!groupedActions[primaryPart]) groupedActions[primaryPart] = [];
		groupedActions[primaryPart].push({ label, act });
		console.log(`[SexSceneRender] ✅ '${label}' available under '${primaryPart}'.`);
	}

	// Render buttons
	for (const [part, actions] of Object.entries(groupedActions)) {
		if (!actions.length) continue;

		const $group = document.createElement("div");
		$group.classList.add("sexscene-group");
		$group.innerHTML = `<h3>${part.toUpperCase()}</h3>`;

		for (const entry of actions) {
			const $btn = document.createElement("button");
			$btn.textContent = entry.act.label;

			const isActive = pending.some(p => p.label === entry.label);
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
	const act = setup.SexualActsDB[label];
	if (!act) {
		console.warn(`[SexSceneAction] ❌ Unknown label: ${label}`);
		return;
	}

	// Ensure pending action list exists
	if (!State.variables.sexScenePendingActions) {
		State.variables.sexScenePendingActions = [];
	}
	const queue = State.variables.sexScenePendingActions;
	const index = queue.findIndex(entry => entry.label === label);

	if (index >= 0) {
		// Already active — remove it
		queue.splice(index, 1);
		console.log(`[SexSceneAction] 🔄 Removed '${label}' from queue.`);
	} else {
		// Exclusive: remove any other act using the same subjectParts
		if (act.exclusive && Array.isArray(act.subjectParts)) {
			for (let i = queue.length - 1; i >= 0; i--) {
				const existing = setup.SexualActsDB[queue[i].label];
				if (existing?.subjectParts?.some(part => act.subjectParts.includes(part))) {
					console.log(`[SexSceneAction] 🔁 '${queue[i].label}' removed — exclusive conflict on '${part}'`);
					queue.splice(i, 1);
				}
			}
		}

		// Remove same stageGroup+stageLevel act
		if (act.stageGroup) {
			for (let i = queue.length - 1; i >= 0; i--) {
				const existing = setup.SexualActsDB[queue[i].label];
				if (
					existing?.stageGroup === act.stageGroup &&
					existing?.stageLevel === act.stageLevel
				) {
					console.log(`[SexSceneAction] 🔁 '${queue[i].label}' removed — same stage in group '${act.stageGroup}'`);
					queue.splice(i, 1);
				}
			}
		}

		// Push the new action
		queue.push({ label });
		console.log(`[SexSceneAction] ✅ Added '${label}' to queue.`);
	}

	// Save and refresh UI
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
	$button.style.marginTop = "2em";

	const pending = State.variables.sexScenePendingActions ?? [];
	const isCumming = State.variables.player?.status?.isCumming ?? false;

	// Determine if button should be disabled
	if (isCumming) {
		const validOrgasmActSelected = pending.some(p => {
			const act = setup.SexualActsDB[p.label];
			return act?.isCumming === true;
		});
		$button.disabled = !validOrgasmActSelected;
		$button.classList.toggle("disabled", !validOrgasmActSelected);
	} else {
		$button.disabled = pending.length === 0;
		$button.classList.toggle("disabled", pending.length === 0);
	}

	$button.onclick = setup.handleSexSceneContinue;
	$wrapper.appendChild($button);
};



setup.handleSexSceneContinue = function () {
	console.log("[SexScene] ▶️ CONTINUE TURN");

	const pending = State.variables.sexScenePendingActions ?? [];
	if (!pending.length) {
		console.log("[SexScene] ⚠️ No actions selected this turn.");
		return;
	}

	// Clear previous feedback
	const feedbackBox = document.getElementById("sexSceneFeedbackBox");
	if (feedbackBox) {
		feedbackBox.innerHTML = "";
	}

	const isCumming = State.variables.player?.status?.isCumming ?? false;
	let playerClimaxResolved = false;

	for (const entry of pending) {
		const label = entry.label;
		const act = setup.SexualActsDB[label];
		if (!act) {
			console.warn(`[SexScene] ❌ Unknown action '${label}'.`);
			continue;
		}

		console.log(`[SexScene] ➤ Applying action '${label}'...`);

		const playerChar = State.variables.player;
		const playerStatus = playerChar.status;
		const partnerId = Object.keys(State.variables.sexScenePartnerStates)[0];
		const partnerChar = State.variables.characters[partnerId];
		const partnerStatus = partnerChar.status;
		const partnerState = State.variables.sexScenePartnerStates[partnerId];

		let responseLine = "";

		// Handle player orgasm resolution
		if (isCumming && act.isCumming) {
			const climaxLines = setup.SexSceneResponses[label]?.climax ?? [];
			responseLine = climaxLines.length
				? climaxLines[Math.floor(Math.random() * climaxLines.length)]
				: "You groan and release with a shudder.";

			playerStatus.excitement = 0;
			playerStatus.fatigue = Math.min(playerStatus.fatigue + 40, playerStatus.maxFatigue);
			playerStatus.isCumming = false;
			playerClimaxResolved = true;

			console.log(`[SexScene] ✅ Orgasm resolved with '${label}'. Excitement reset. Fatigue applied.`);

			// Remove all sustained/stage actions after climax
			State.variables.sexScenePendingActions = [];
			console.log("[SexScene] 💨 Cleared all active stage actions post-orgasm.");
			break; // No further actions should be processed during orgasm resolution
		}

		// Regular arousal gain
		if (!act.isCumming) {
			const subjectAmount = act.baseExcitement?.subject ?? 0;
			const objectAmount = act.baseExcitement?.object ?? 0;

			playerStatus.excitement += subjectAmount;
			partnerStatus.excitement += objectAmount;

			console.log(`   ➕ Player excitement +${subjectAmount} = ${playerStatus.excitement}`);
			console.log(`   ➕ ${partnerChar.name} excitement +${objectAmount} = ${partnerStatus.excitement}`);
		}

		// Track last act received (for NPC orgasm flavor)
		if (partnerState) {
			partnerState.lastReceivedAction = label;
		}

		// Regular response
		if (!responseLine) {
			let flavor = "Neutral";
			if (partnerChar.preferences?.sexualActs?.likes?.includes(label)) {
				flavor = "Liked";
			} else if (partnerChar.preferences?.sexualActs?.dislikes?.includes(label)) {
				flavor = "Disliked";
			}
			const responseData = setup.SexSceneResponses[label];
			const textList = responseData?.[flavor] ?? [];
			responseLine = textList.length
				? textList[Math.floor(Math.random() * textList.length)]
				: `${partnerChar.name} reacts passively.`;
		}

		if (feedbackBox) {
			const p = document.createElement("p");

			try {
				const temp = document.createElement("span");
				new Wikifier(temp, responseLine); // Safe Twine parser
				p.innerHTML = temp.innerHTML;
			} catch (err) {
				console.warn(`[Feedback] ❌ Wikifier parse error: ${err.message}`);
				p.textContent = responseLine;
			}

			feedbackBox.appendChild(p);
		}



		// Orgasm checks (for NPC only — player handled above)
		if (!isCumming && partnerStatus.excitement >= partnerStatus.maxExcitement) {
			console.log(`[SexScene] 🚨 ${partnerChar.name} orgasm triggered.`);
			setup.triggerOrgasm(partnerId);
		}

		if (!isCumming && playerStatus.excitement >= playerStatus.maxExcitement) {
			console.log("[SexScene] 🚨 Player orgasm triggered.");
			setup.triggerOrgasm("player");
		}
	}

	// If we just resolved a climax, actions were already cleared
	if (!playerClimaxResolved) {
		// Persist toggled actions into the next round
		setup.renderSexSceneActions();
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
	const state = isPlayer ? State.variables.sexScenePlayerState : State.variables.sexSceneNPCStates?.[charId];

	if (!char || !state) {
		console.warn(`[Orgasm] ❌ Could not resolve character or state for '${charId}'.`);
		return;
	}

	// Clamp excitement to 0, apply fatigue
	char.status.excitement = 0;
	char.status.fatigue = Math.min(char.status.fatigue + 40, char.status.maxFatigue);

	console.log(`[Orgasm] 💦 ${isPlayer ? "Player" : char.name} orgasmed.`);
	console.log(`   ➡️ Fatigue now: ${char.status.fatigue}/${char.status.maxFatigue}`);

	if (isPlayer) {
		// Enter climax resolution phase
		char.status.isCumming = true;
		console.log("[Orgasm] 🚩 Player is now in 'isCumming' resolution phase.");
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

	if (!npc || !feedbackBox) {
		console.warn(`[OrgasmFeedback] ❌ Missing NPC data or feedback box for '${npcId}'.`);
		return;
	}

	let climaxText = `${npc.name} orgasms, body trembling with release.`; // fallback

	// Pull from updated SexSceneResponses
	if (lastAct && setup.SexSceneResponses[lastAct]?.climax) {
		const options = setup.SexSceneResponses[lastAct].climax;
		if (Array.isArray(options) && options.length > 0) {
			const pick = options[Math.floor(Math.random() * options.length)];
			climaxText = pick;
			console.log(`[OrgasmFeedback] 💬 Using climax line from '${lastAct}'`);
		}
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

	const pending = State.variables.sexScenePendingActions ?? [];
	const activeLabels = pending.map(p => p.label);
	const playerParts = State.variables.sexScenePlayerState?.parts ?? {};
	const partnerId = Object.keys(State.variables.sexScenePartnerStates ?? {})[0];
	const partnerParts = State.variables.sexScenePartnerStates?.[partnerId]?.parts ?? {};

	const relevantOrgasmActs = [];

	for (const [label, act] of Object.entries(setup.SexualActsDB)) {
		if (!act.isCumming) continue;

		// Must match player's anatomy
		const playerOK = act.subjectParts.every(part => playerParts[part] !== undefined);
		if (!playerOK) continue;

		// Must match NPC anatomy
		const partnerOK = act.objectParts.every(part => partnerParts[part] !== undefined);
		if (!partnerOK) continue;

		relevantOrgasmActs.push({ label, act });
	}

	if (relevantOrgasmActs.length === 0) {
		const none = document.createElement("p");
		none.innerHTML = "No valid orgasm options found.";
		box.appendChild(none);
		return;
	}

	for (const { label, act } of relevantOrgasmActs) {
		const btn = document.createElement("button");
		btn.className = "orgasm-choice-button";
		btn.textContent = act.label;
		btn.onclick = () => setup.toggleSexAction(label);
		box.appendChild(btn);
	}

	console.log(`[OrgasmUI] 💦 ${relevantOrgasmActs.length} orgasm options rendered.`);
};
