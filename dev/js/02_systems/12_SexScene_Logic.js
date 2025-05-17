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

	// Core anatomy parts assumed unless explicitly false
	parts.mouth = defaultPartState();
	summary.push("Mouth");

	// Split hands into left and right, but actions can still use "hand"
	parts.leftHand = defaultPartState();
	parts.rightHand = defaultPartState();
	summary.push("Left Hand");
	summary.push("Right Hand");

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

	// Prepare dual-hand groups explicitly
	const hands = ["leftHand", "rightHand"];
	hands.forEach(hand => {
		groupedActions[hand] = [];
	});

	// Standard groupings
	const otherGroups = ["mouth", "feet", "anus", "penis", "vagina", "clitoris", "breasts"];
	otherGroups.forEach(part => {
		groupedActions[part] = [];
	});

	// Loop through all acts
	for (const [label, act] of Object.entries(setup.SexualActsDB)) {
		if (act.giver !== "player") continue;
		if (!act.subjectParts || !Array.isArray(act.subjectParts)) continue;

		// Special handling for 'hand' logic — offer for both hands if available
		if (act.subjectParts.includes("hand")) {
			hands.forEach(hand => {
				const handState = playerState.parts?.[hand];
				if (!handState || handState.bound || handState.disabled) return;

				// Check objectParts
				if (act.objectParts?.some(part => !partnerState.parts?.[part])) return;

				// Skill check
				if (act.skillsRequired) {
					for (const [skill, min] of Object.entries(act.skillsRequired)) {
						const current = playerSkills[skill] ?? 0;
						if (current < min) return;
					}
				}

				groupedActions[hand].push({ label, act, assignedHand: hand });
			});
			continue; // skip standard grouping
		}

		// Standard subject parts check
		const subjectCheck = act.subjectParts.every(part => {
			const partState = playerState.parts?.[part];
			return partState && !partState.bound && !partState.disabled;
		});
		if (!subjectCheck) continue;

		// Object parts
		if (act.objectParts?.some(part => !partnerState.parts?.[part])) continue;

		// Skill check
		if (act.skillsRequired) {
			for (const [skill, min] of Object.entries(act.skillsRequired)) {
				const current = playerSkills[skill] ?? 0;
				if (current < min) continue;
			}
		}

		const primaryPart = act.subjectParts[0];
		groupedActions[primaryPart].push({ label, act });
	}

	// Render groups
	for (const [part, actions] of Object.entries(groupedActions)) {
		if (!actions.length) continue;

		const $group = document.createElement("div");
		$group.classList.add("sexscene-group");

		$group.innerHTML = `<h3>${part.toUpperCase()}</h3>`;

		for (const entry of actions) {
			const $btn = document.createElement("button");
			$btn.textContent = entry.act.label;

			const isActive = pending.some(p => p.label === entry.label && p.assignedHand === entry.assignedHand);
			if (isActive) $btn.classList.add("active-sexact");

			$btn.onclick = () => setup.toggleSexAction(entry.label, entry.assignedHand);
			$group.appendChild($btn);
		}

		$wrapper.appendChild($group);
	}

	setup.renderSexSceneContinueButton();
};


// ===============================
// 🔘 Track & Toggle Pending Actions
// ===============================
setup.toggleSexAction = function (label, assignedHand = null) {
	const act = setup.SexualActsDB[label];
	if (!act) {
		console.warn(`[SexSceneAction] ❌ Unknown label: ${label}`);
		return;
	}

	const queue = State.variables.sexScenePendingActions ?? [];

	// Special handling for hand-specific actions
	if (assignedHand) {
		const existingIndex = queue.findIndex(entry => entry.assignedHand === assignedHand);
		if (existingIndex >= 0) {
			queue.splice(existingIndex, 1);
			console.log(`[SexSceneAction] 🔄 Removed action from '${assignedHand}'.`);
		} else {
			queue.push({ label, assignedHand });
			console.log(`[SexSceneAction] ✅ Assigned '${label}' to '${assignedHand}'.`);
		}
	} else {
		// Standard (non-hand) logic
		const index = queue.findIndex(entry => entry.label === label);
		if (index >= 0) {
			queue.splice(index, 1);
			console.log(`[SexSceneAction] 🔄 Removed '${label}' from queue.`);
		} else {
			queue.push({ label });
			console.log(`[SexSceneAction] ✅ Added '${label}' to queue.`);
		}
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

		// -- ORGASM RESOLUTION
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

			State.variables.sexScenePendingActions = [];
			console.log("[SexScene] 💨 Cleared all actions post-orgasm.");
			break;
		}

		// -- Arousal gain (skip for climax acts)
		if (!act.isCumming) {
			const subjectAmount = act.baseExcitement?.subject ?? 0;
			const objectAmount = act.baseExcitement?.object ?? 0;

			playerStatus.excitement += subjectAmount;
			partnerStatus.excitement += objectAmount;

			console.log(`   ➕ Player excitement +${subjectAmount} = ${playerStatus.excitement}`);
			console.log(`   ➕ ${partnerChar.name} excitement +${objectAmount} = ${partnerStatus.excitement}`);
		}

		// Track last received
		if (partnerState) {
			partnerState.lastReceivedAction = label;
		}

		// Determine response
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

		// Append feedback
		if (feedbackBox) {
			const p = document.createElement("p");
			try {
				p.innerHTML = Wikifier.parse(responseLine);
			} catch (err) {
				p.textContent = responseLine;
			}
			feedbackBox.appendChild(p);
		}

		// -- NPC ORGASM CHECKS (player handled above)
		if (!isCumming && partnerStatus.excitement >= partnerStatus.maxExcitement) {
			console.log(`[SexScene] 🚨 ${partnerChar.name} orgasm triggered.`);
			setup.triggerOrgasm(partnerId);
		}

		// -- PLAYER ORGASM CHECKS
		if (!isCumming && playerStatus.excitement >= playerStatus.maxExcitement) {
			console.log("[SexScene] 🚨 Player orgasm triggered.");
			setup.triggerOrgasm("player");
		}
	}

	// -- Clear only non-hand actions and reset occupancy per hand if applicable
	if (!playerClimaxResolved) {
		// Filter queue to only hand actions with hand assignment (persist hands)
		State.variables.sexScenePendingActions = State.variables.sexScenePendingActions.filter(entry => {
			// If hand assigned, keep in queue unless player explicitly toggles
			if (entry.assignedHand) return true;
			return false;
		});
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


/*=========================================================================================
================= NPC DECISION MAKING =====================================================
======================================================================================== */

setup.npcDecideActions = function (npcId) {
	const npc = State.variables.characters[npcId];
	const npcState = State.variables.sexScenePartnerStates[npcId];
	if (!npc || !npcState) {
		console.warn(`[NPC AI] ❌ Cannot resolve NPC '${npcId}'.`);
		return;
	}

	const availableActs = [];

	for (const [label, act] of Object.entries(setup.SexualActsDB)) {
		if (act.giver !== "npc" || act.receiver !== "player") continue;
		if (act.isCumming) continue;

		if (!act.subjectParts.every(p => npcState.parts?.[p])) continue;
		if (!act.objectParts.every(p => State.variables.sexScenePlayerState.parts?.[p])) continue;

		const score = setup.npcEvaluateAction(npc, act);
		availableActs.push({ label, score });
	}

	if (!availableActs.length) {
		console.warn(`[NPC AI] ⚠ No available acts for '${npc.name}'.`);
		return;
	}

	// Prevent duplicate selection of same act
	const topActs = availableActs.sort((a, b) => b.score - a.score).slice(0, 3);
	const chosen = topActs[Math.floor(Math.random() * topActs.length)];

	if (State.variables.sexScenePendingActions.some(p => p.label === chosen.label)) {
		console.log(`[NPC AI] ⚠ '${npc.name}' tried to pick '${chosen.label}' but it's already queued.`);
		return;
	}

	console.log(`[NPC AI] 🤔 '${npc.name}' selects '${chosen.label}' (score: ${chosen.score})`);

	// Track recent acts for inclination learning
	if (!npcState.recentActs) npcState.recentActs = [];
	npcState.recentActs.push(chosen.label);

	// Add to pending
	State.variables.sexScenePendingActions.push({ label: chosen.label, data: setup.SexualActsDB[chosen.label] });
};



setup.npcEvaluateAction = function (npc, act) {
	let score = 10;

	if (npc.preferences?.sexualActs?.likes?.includes(act.label)) score += 20;
	if (npc.preferences?.sexualActs?.dislikes?.includes(act.label)) score -= 20;

	const npcStatus = npc.status;
	if (npcStatus.excitement >= 70 && act.stageLevel >= 1) score += 15;
	if (npcStatus.fatigue >= 70 && act.stageLevel <= 0) score += 10;

	const playerStatus = State.variables.player.status;
	if (playerStatus.excitement >= 80 && act.baseExcitement.object >= 10) score += 10;

	if (act.inclinationTags) {
		for (const tag of act.inclinationTags) {
			if (npc.inclinations?.includes(tag)) score += 5;
		}
	}

	// Mood bias if present
	const mood = State.variables.sexScenePartnerStates[npc.id]?.mood;
	if (mood === "aggressive" && act.stageLevel >= 1) score += 8;
	if (mood === "gentle" && act.stageLevel === 0) score += 8;
	if (mood === "teasing" && act.stageLevel === 0 && act.inclinationTags?.includes("tease")) score += 10;

	score += Math.random() * 5;

	return score;
};


setup.npcMoodInit = function (npcId) {
	const moods = ["aggressive", "teasing", "gentle"];
	const mood = moods[Math.floor(Math.random() * moods.length)];
	State.variables.sexScenePartnerStates[npcId].mood = mood;
	console.log(`[NPC AI] '${npcId}' mood set to '${mood}'.`);
};


setup.npcInclinationShift = function (npcId) {
	const npc = State.variables.characters[npcId];
	const npcState = State.variables.sexScenePartnerStates[npcId];
	if (!npc || !npcState?.recentActs) return;

	const uniqueActs = [...new Set(npcState.recentActs)];

	for (const actLabel of uniqueActs) {
		if (Math.random() <= 0.1) {
			const act = setup.SexualActsDB[actLabel];
			if (!act || !act.inclinationTags) continue;

			for (const tag of act.inclinationTags) {
				if (!npc.inclinations.includes(tag)) {
					npc.inclinations.push(tag);
					console.log(`[NPC AI] 🌱 '${npc.name}' developed stronger inclination toward '${tag}' from '${actLabel}'.`);
				}
			}
		}
	}

	// Clear session-specific tracking after learning
	npcState.recentActs = [];
};



