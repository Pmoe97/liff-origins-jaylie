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
	State.variables.sexScenePendingActions = [];
	State.variables.sexSceneOngoingActions = [];


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
		if (State.variables.sexSceneClimaxFeedback) {
			console.log("[SexSceneLayout] 🪄 Re-injecting climax feedback after passage reload.");
			setup.renderSexSceneActions(); // Triggers feedback render + UI buttons
		}

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
	const ongoing = State.variables.sexSceneOngoingActions ?? [];

	const groupedActions = {};
	const hands = ["leftHand", "rightHand"];
	const bodyParts = ["mouth", "feet", "anus", "penis", "vagina", "clitoris", "breasts"];
	[...hands, ...bodyParts].forEach(part => groupedActions[part] = []);

	// === Track the highest stage per stageGroup + hand combo
	const activeStageMap = {};
	for (const entry of ongoing) {
		const act = setup.SexualActsDB[entry.label];
		if (act?.stageGroup) {
			const key = act.stageGroup + (entry.assignedHand ?? "");
			const current = activeStageMap[key] ?? -1;
			activeStageMap[key] = Math.max(current, act.stageLevel);
		}
	}

	// === Step 1: Organize available acts into part groups
	const isCumming = playerChar.status?.isCumming ?? false;

	for (const [label, act] of Object.entries(setup.SexualActsDB)) {
		if (act.giver !== "player" || !Array.isArray(act.subjectParts)) continue;

		// 🚫 If climax phase is active, hide all non-orgasm actions
		if (isCumming && !act.isCumming) continue;

		// ✅ If climax phase is NOT active, hide orgasm actions
		if (!isCumming && act.isCumming) continue;


		const isHandAction = act.subjectParts.includes("hand");

		// Validate object parts
		if (act.objectParts?.some(p => !partnerState.parts?.[p])) continue;

		// Validate required skills
		if (act.skillsRequired) {
			const skillCheck = Object.entries(act.skillsRequired).every(([skill, min]) => {
				return (playerSkills[skill] ?? 0) >= min;
			});
			if (!skillCheck) continue;
		}

		// === Hand-based actions
		if (isHandAction) {
			hands.forEach(hand => {
				const handState = playerState.parts?.[hand];
				if (!handState || handState.bound || handState.disabled) return;

				let visible = true;
				if (act.stageGroup) {
					const key = act.stageGroup + hand;
					const activeLevel = activeStageMap[key] ?? -1;

					const isStarter = act.stageLevel === 0;
					const isCurrent = act.stageLevel === activeLevel;
					const isNext = act.stageLevel === activeLevel + 1;

					if (!isStarter && !isCurrent && !isNext) visible = false;
				}
				if (!visible) return;

				groupedActions[hand].push({ label, act, assignedHand: hand });
			});
			continue;
		}

		// === Non-hand actions
		const allValid = act.subjectParts.every(part => {
			const state = playerState.parts?.[part];
			return state && !state.bound && !state.disabled;
		});
		if (!allValid) continue;

		let visible = true;
		if (act.stageGroup) {
			const key = act.stageGroup;
			const activeLevel = activeStageMap[key] ?? -1;

			const isStarter = act.stageLevel === 0;
			const isCurrent = act.stageLevel === activeLevel;
			const isNext = act.stageLevel === activeLevel + 1;

			if (!isStarter && !isCurrent && !isNext) visible = false;
		}
		if (!visible) continue;

		const primary = act.subjectParts[0];
		groupedActions[primary].push({ label, act });
	}

	// === Step 2: Render each group with buttons
	for (const [part, actions] of Object.entries(groupedActions)) {
		const $group = document.createElement("div");
		$group.classList.add("sexscene-group");
		$group.innerHTML = `<h3>${part.toUpperCase()}</h3>`;

		// === REST button first
		const restLabel = `__REST_${part}`;
		const isRestPending = pending.some(p => p.label === restLabel);
		const isRestOngoing = ongoing.every(p =>
			(p.assignedHand ?? null) !== part &&
			!setup.SexualActsDB[p.label]?.subjectParts?.includes(part)
		);

		const $rest = document.createElement("button");
		$rest.textContent = "Rest";
		$rest.classList.add("rest-button");
		if (isRestPending) {
			$rest.classList.add("active-sexact", "pending");
		} else if (isRestOngoing) {
			$rest.classList.add("active-sexact", "ongoing");
		}
		$rest.onclick = () => setup.toggleRestAction(part);
		$group.appendChild($rest);

		// === Action buttons
		actions.forEach(entry => {
			const $btn = document.createElement("button");
			$btn.textContent = entry.act.label;

			const isPending = pending.some(p =>
				p.label === entry.label &&
				(p.assignedHand ?? null) === (entry.assignedHand ?? null)
			);

			const isOngoing = ongoing.some(p =>
				p.label === entry.label &&
				(p.assignedHand ?? null) === (entry.assignedHand ?? null)
			);

			if (isPending) {
				$btn.classList.add("active-sexact", "pending");
			} else if (isOngoing) {
				$btn.classList.add("active-sexact", "ongoing");
			}

			$btn.onclick = () => setup.toggleSexAction(entry.label, entry.assignedHand);
			$group.appendChild($btn);
		});

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

	if (assignedHand) {
		// Remove any previous action assigned to this hand
		const existingIndex = queue.findIndex(entry => entry.assignedHand === assignedHand);
		if (existingIndex >= 0) {
			queue.splice(existingIndex, 1);
			console.log(`[SexSceneAction] 🔄 Removed existing '${assignedHand}' action.`);
		}

		// Add new one (if different)
		queue.push({ label, assignedHand });
		console.log(`[SexSceneAction] ✅ Assigned '${label}' to '${assignedHand}'.`);
	} else {
		// Remove any queued actions that share subject parts (radio behavior)
		const playerState = State.variables.sexScenePlayerState;
		const subjectParts = act.subjectParts || [];

		for (let i = queue.length - 1; i >= 0; i--) {
			const existing = setup.SexualActsDB[queue[i].label];
			if (!existing || queue[i].assignedHand) continue;

			const conflict = existing.subjectParts?.some(part => subjectParts.includes(part));
			if (conflict) {
				console.log(`[SexSceneAction] 🔁 '${queue[i].label}' removed due to conflict with '${label}'.`);
				queue.splice(i, 1);
			}
		}

		// Add this one
		queue.push({ label });
		console.log(`[SexSceneAction] ✅ Queued '${label}' (non-hand).`);
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
	const ongoing = State.variables.sexSceneOngoingActions ?? [];
	const isCumming = State.variables.player?.status?.isCumming ?? false;

	let enabled = false;

	if (isCumming) {
		enabled = pending.some(p => setup.SexualActsDB[p.label]?.isCumming === true);
	} else {
		enabled = pending.length > 0 || ongoing.length > 0;
	}

	$button.disabled = !enabled;
	$button.classList.toggle("disabled", !enabled);
	$button.onclick = setup.handleSexSceneContinue;
	$wrapper.appendChild($button);
};



setup.toggleRestAction = function (part) {
	const queue = State.variables.sexScenePendingActions ?? [];

	// Remove all pending actions for this part
	for (let i = queue.length - 1; i >= 0; i--) {
		const label = queue[i].label;
		if (label.startsWith("__REST_")) {
			queue.splice(i, 1);
			continue;
		}
		const act = setup.SexualActsDB[label];
		if (!act) continue;
		if (
			queue[i].assignedHand === part ||
			act.subjectParts?.includes(part)
		) {
			queue.splice(i, 1);
		}
	}

	queue.push({ label: `__REST_${part}` });

	State.variables.sexScenePendingActions = queue;
	console.log(`[RestAction] 🧘 Queued rest for ${part}`);
	setup.renderSexSceneActions();
};



setup.handleSexSceneContinue = function () {
	console.log("[SexScene] ▶️ CONTINUE TURN");

	let pending = State.variables.sexScenePendingActions ?? [];
	const ongoing = State.variables.sexSceneOngoingActions ?? [];

	// Fallback to ongoing actions if none were selected this turn
	if (pending.length === 0 && ongoing.length > 0) {
		console.log("[SexScene] 🔁 No new actions selected — reusing ongoing actions as this turn’s pending.");
		pending = [...ongoing];
		State.variables.sexScenePendingActions = pending;
	}

	if (pending.length === 0) {
		console.log("[SexScene] ⚠️ No actions selected this turn, and no fallback found.");
		return;
	}

	const feedbackBox = document.getElementById("sexSceneFeedbackBox");
	if (feedbackBox) feedbackBox.innerHTML = "";

	const playerStatus = State.variables.player.status;
	const partnerId = Object.keys(State.variables.sexScenePartnerStates ?? {})[0];
	const partnerChar = State.variables.characters[partnerId];
	const partnerState = State.variables.sexScenePartnerStates[partnerId];
	const partnerStatus = partnerChar.status;

	const isCumming = playerStatus.isCumming ?? false;
	let playerClimaxResolved = false;

	let newOngoing = [...ongoing];
	const npcFeedback = [];
	const playerFeedback = [];

	for (const entry of pending) {
		const label = entry.label;

		// === REST HANDLING
		if (label.startsWith("__REST_")) {
			const restedPart = label.replace("__REST_", "");
			console.log(`[SexScene] 💤 Resting '${restedPart}' — clearing associated actions.`);

			newOngoing = newOngoing.filter(p => {
				const act = setup.SexualActsDB[p.label];
				if (!act) return true;
				const handMatch = p.assignedHand === restedPart;
				const partMatch = act.subjectParts?.includes(restedPart);
				return !(handMatch || partMatch);
			});
			continue;
		}

		const act = setup.SexualActsDB[label];
		if (!act) {
			console.warn(`[SexScene] ❌ Unknown action '${label}'.`);
			continue;
		}

		console.log(`[SexScene] ➤ Applying action '${label}'...`);
		let responseLine = "";

		// === Orgasm resolution
		if (isCumming && act.isCumming) {
			const climaxLines = setup.SexSceneResponses[label]?.climax ?? [];
			const responseLine = climaxLines.length
				? climaxLines[Math.floor(Math.random() * climaxLines.length)]
				: "You groan and release with a shudder.";

			// Save it for next turn
			State.variables.sexSceneClimaxFeedback = responseLine;

			// Handle status and clear
			playerStatus.excitement = 0;
			playerStatus.fatigue = Math.min(playerStatus.fatigue + 40, playerStatus.maxFatigue);
			playerStatus.isCumming = false;
			playerClimaxResolved = true;

			State.variables.sexScenePendingActions = [];
			State.variables.sexSceneOngoingActions = [];

			console.log(`[SexScene] ✅ Orgasm resolved with '${label}'. Excitement reset. Fatigue applied.`);
			console.log("[SexScene] 💨 Cleared all actions post-orgasm.");

			Engine.play(passage()); // Restart the passage to render anew
			return;
		}


		// === Excitement gain
		const subjectAmount = act.baseExcitement?.subject ?? 0;
		const objectAmount = act.baseExcitement?.object ?? 0;
		playerStatus.excitement += subjectAmount;
		partnerStatus.excitement += objectAmount;

		console.log(`   ➕ Player excitement +${subjectAmount} = ${playerStatus.excitement}`);
		console.log(`   ➕ ${partnerChar.name} excitement +${objectAmount} = ${partnerStatus.excitement}`);

		if (partnerState) {
			partnerState.lastReceivedAction = label;
		}

		// === Manage ongoing actions (stageGroup logic)
		const hand = entry.assignedHand ?? null;

		newOngoing = newOngoing.filter(p => {
			const other = setup.SexualActsDB[p.label];
			if (!other) return true;
			const sameGroup = act.stageGroup && other.stageGroup === act.stageGroup;
			const sameHand = hand ? p.assignedHand === hand : true;
			return !(sameGroup && sameHand);
		});

		newOngoing.push({ label, assignedHand: hand });

		// === Feedback generation
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

		if (act.receiver === "player") {
			playerFeedback.push(responseLine);
		} else {
			npcFeedback.push(responseLine);
		}

		// === Orgasm triggers
		if (!isCumming && partnerStatus.excitement >= partnerStatus.maxExcitement) {
			console.log(`[SexScene] 🚨 ${partnerChar.name} orgasm triggered.`);
			setup.triggerOrgasm(partnerId);
		}

		if (!isCumming && playerStatus.excitement >= playerStatus.maxExcitement) {
			console.log("[SexScene] 🚨 Player orgasm triggered.");
			setup.triggerOrgasm("player");
		}
	}

	// === Filter invalid ongoing actions
	if (!playerClimaxResolved) {
		const playerState = State.variables.sexScenePlayerState;
		const partnerState = State.variables.sexScenePartnerStates[partnerId];
		const playerSkills = State.variables.player.skills || {};

		newOngoing = newOngoing.filter(entry => {
			const act = setup.SexualActsDB[entry.label];
			if (!act || act.isCumming) return false;

			const validSubjects = act.subjectParts.every(part => {
				const p = part === "hand" ? entry.assignedHand : part;
				const state = playerState.parts?.[p];
				return state && !state.bound && !state.disabled;
			});
			if (!validSubjects) return false;

			if (act.objectParts?.some(p => !partnerState.parts?.[p])) return false;

			if (act.skillsRequired) {
				for (const [skill, min] of Object.entries(act.skillsRequired)) {
					if ((playerSkills[skill] ?? 0) < min) return false;
				}
			}
			return true;
		});

		State.variables.sexSceneOngoingActions = newOngoing;
		State.variables.sexScenePendingActions = [];
		setup.renderSexSceneActions();
	}

	// === Feedback rendering
	if (feedbackBox) {
		// === 1. Climax feedback (if stored from previous turn)
		const storedClimax = State.variables.sexSceneClimaxFeedback;
		if (storedClimax) {
			const climaxPara = document.createElement("p");
			try {
				const temp = document.createElement("span");
				new Wikifier(temp, storedClimax);
				climaxPara.innerHTML = temp.innerHTML;
			} catch (err) {
				console.warn(`[Feedback] ❌ Parse error (climax): ${err.message}`);
				climaxPara.textContent = storedClimax;
			}
			feedbackBox.appendChild(climaxPara);
			State.variables.sexSceneClimaxFeedback = null;
		}

		// === 2. NPC feedback (if any)
		if (npcFeedback.length > 0) {
			const npcPara = document.createElement("p");
			npcPara.innerHTML = npcFeedback.map(line => `<span>${line}</span>`).join(" ");
			feedbackBox.appendChild(npcPara);
		}

		// === 3. Player feedback (if any)
		if (playerFeedback.length > 0) {
			const playerPara = document.createElement("p");
			playerPara.innerHTML = playerFeedback.map(line => `<span>${line}</span>`).join(" ");
			feedbackBox.appendChild(playerPara);
		}
	}


	console.groupCollapsed("[SexScene] 🧷 Final Ongoing Actions");
	console.dir(State.variables.sexSceneOngoingActions);
	console.groupEnd();

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
		const hasPenis = !!state.parts?.penis;
		const hasVagina = !!state.parts?.vagina;

		if (!hasPenis && hasVagina) {
			console.log("[Orgasm] ✅ Auto-resolving climax for vagina-only player.");

			const feedbackBox = document.getElementById("sexSceneFeedbackBox");
			if (feedbackBox) {
				const p = document.createElement("p");
				p.innerHTML = "A wave of pleasure crashes over you as your body trembles in release.";
				feedbackBox.appendChild(p);
			}

			char.status.isCumming = false;
			State.variables.sexScenePendingActions = [];
			State.variables.sexSceneOngoingActions = [];
			setup.renderSexSceneActions();
			return;
		}

		// ✅ Insert the prompt immediately when climax state starts
		char.status.isCumming = true;
		console.log("[Orgasm] 🚩 Player is now in 'isCumming' resolution phase.");

		const feedbackBox = document.getElementById("sexSceneFeedbackBox");
		if (feedbackBox) {
			const p = document.createElement("p");
			p.innerHTML = "You're right at the edge. How do you want to finish?";
			feedbackBox.appendChild(p);
			console.log("[OrgasmUI] 💬 Prompt rendered in feedback box.");
		}
	}

};


setup.autoResolveVaginalOrgasm = function () {
	const feedbackBox = document.getElementById("sexSceneFeedbackBox");
	if (!feedbackBox) return;

	const p = document.createElement("p");
	p.innerHTML = "A wave of pleasure crashes over you as your body trembles in release.";
	feedbackBox.appendChild(p);

	State.variables.player.status.isCumming = false;
	State.variables.sexScenePendingActions = [];
	State.variables.sexSceneOngoingActions = [];
	setup.renderSexSceneActions();

	console.log("[Orgasm] ✅ Auto-orgasm complete.");
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

	// Add prompt paragraph only (no buttons!)
	const p = document.createElement("p");
	p.innerHTML = "You're right at the edge. How do you want to finish?";
	box.appendChild(p);

	console.log("[OrgasmUI] 💬 Prompt inserted. Orgasm choices will be rendered in body group actions.");
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



