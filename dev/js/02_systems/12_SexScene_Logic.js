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

	const detectBodyParts = (char) => {
		const body = char.body || {};
		const parts = {};
		const summary = [];

		// Core anatomy
		parts.mouth = defaultPartState();
		summary.push("Mouth");

		parts.leftHand = defaultPartState();
		parts.rightHand = defaultPartState();
		summary.push("Left Hand", "Right Hand");

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
			summary.push("Vagina", "Clitoris");
		}

		if (body.breastSize > 0) {
			parts.breasts = defaultPartState();
			summary.push(`Breasts (size ${body.breastSize})`);
		}

		return { parts, summary };
	};

	// === PLAYER INIT ===
	const playerChar = State.variables.player;
	const playerPartsData = detectBodyParts(playerChar);

	State.variables.sexScenePlayerState = {
		id: "player",
		name: "You",
		parts: playerPartsData.parts,
		orgasmCount: 0
	};

	// These should always reset during scene init
	State.variables.sexScenePendingActions = [];
	State.variables.sexSceneOngoingActions = [];

	console.log(`[SexSceneInit] 🧍 Player Anatomy Parts: ${playerPartsData.summary.join(", ")}`);

	// === PARTNERS INIT ===
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

				// ✅ Once layout is stable, render the actions
				setup.renderSexSceneActions();
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

	if (!body || typeof body !== "object") return parts;

	// Core anatomy defaults (included unless explicitly false)
	if (body.mouth !== false) parts.mouth = {};
	if (body.hands !== false) parts.hand = {}; // normalized to single "hand"
	if (body.feet !== false) parts.feet = {};

	// Anus present unless explicitly excluded
	if (body.anus !== false || body.buttSize >= 0) parts.anus = {};

	// Sexual anatomy
	if (body.vagina) parts.vagina = {};
	if (body.clitoris) parts.clitoris = {};
	if (body.penisSize != null) parts.penis = {};
	if (body.breastSize > 0) parts.breasts = {};

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
	const isCumming = playerChar.status?.isCumming ?? false;

	const groupedActions = {};
	const hands = ["leftHand", "rightHand"];
	const bodyParts = ["mouth", "feet", "anus", "penis", "vagina", "clitoris", "breasts"];
	[...hands, ...bodyParts].forEach(part => groupedActions[part] = []);

	// Track active stages per group/hand combo
	const activeStageMap = {};
	for (const entry of ongoing) {
		const act = setup.SexualActsDB[entry.label];
		if (act?.stageGroup) {
			const key = act.stageGroup + (entry.assignedHand ?? "");
			const current = activeStageMap[key] ?? -1;
			activeStageMap[key] = Math.max(current, act.stageLevel);
		}
	}

	// === Sort all valid actions into groupedActions
	for (const [label, act] of Object.entries(setup.SexualActsDB)) {
		if (act.giver !== "player" || !Array.isArray(act.subjectParts)) continue;

		// During climax: show only climax actions
		if (isCumming !== !!act.isCumming) continue;

		if (act.objectParts?.some(p => !partnerState.parts?.[p])) continue;

		if (act.skillsRequired && !Object.entries(act.skillsRequired).every(
			([skill, min]) => (playerSkills[skill] ?? 0) >= min
		)) continue;

		const isHand = act.subjectParts.includes("hand");

		if (isHand) {
			hands.forEach(hand => {
				const handState = playerState.parts?.[hand];
				if (!handState || handState.bound || handState.disabled) return;

				let visible = true;
				if (act.stageGroup) {
					const key = act.stageGroup + hand;
					const level = activeStageMap[key] ?? -1;
					visible = [0, level, level + 1].includes(act.stageLevel);
				}
				if (!visible) return;

				groupedActions[hand].push({ label, act, assignedHand: hand });
			});
		} else {
			if (!act.subjectParts.every(p => {
				const state = playerState.parts?.[p];
				return state && !state.bound && !state.disabled;
			})) continue;

			let visible = true;
			if (act.stageGroup) {
				const key = act.stageGroup;
				const level = activeStageMap[key] ?? -1;
				visible = [0, level, level + 1].includes(act.stageLevel);
			}
			if (!visible) continue;

			const primary = act.subjectParts[0];
			groupedActions[primary].push({ label, act });
		}
	}

	// === Render UI blocks for each part
	for (const [part, actions] of Object.entries(groupedActions)) {
		const $group = document.createElement("div");
		$group.classList.add("sexscene-group");
		$group.innerHTML = `<h3>${part.toUpperCase()}</h3>`;

		// REST button — always rendered first
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

		// All other action buttons
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
		console.warn(`[SexSceneAction] ❌ Unknown label: '${label}'`);
		return;
	}

	let queue = State.variables.sexScenePendingActions ?? [];
	queue = [...queue]; // Defensive copy to avoid mutation bugs

	if (assignedHand) {
		// Remove any action currently using this hand
		const existingIndex = queue.findIndex(entry => entry.assignedHand === assignedHand);
		if (existingIndex >= 0) {
			console.log(`[SexSceneAction] 🔄 Removed existing '${queue[existingIndex].label}' on '${assignedHand}'.`);
			queue.splice(existingIndex, 1);
		}

		queue.push({ label, assignedHand });
		console.log(`[SexSceneAction] ✅ Assigned '${label}' to '${assignedHand}'.`);
	} else {
		// Radio group logic — clear any conflicting non-hand actions
		const subjectParts = act.subjectParts || [];

		queue = queue.filter(entry => {
			const existing = setup.SexualActsDB[entry.label];
			if (!existing || entry.assignedHand) return true;

			const conflict = existing.subjectParts?.some(part => subjectParts.includes(part));
			if (conflict) {
				console.log(`[SexSceneAction] 🔁 '${entry.label}' removed (conflict with '${label}').`);
				return false;
			}
			return true;
		});

		queue.push({ label });
		console.log(`[SexSceneAction] ✅ Queued '${label}' (non-hand).`);
	}

	State.variables.sexScenePendingActions = queue;
	setup.renderSexSceneActions();
};


/* Continue Button and logic handler */
setup.renderSexSceneContinueButton = function () {
	const $wrapper = document.getElementById("sexSceneActionsBox");
	if (!$wrapper) {
		console.warn("[SexSceneRender] ❌ Cannot render Continue button: #sexSceneActionsBox missing.");
		return;
	}

	const $button = document.createElement("button");
	$button.id = "sexSceneContinueButton";
	$button.textContent = "Continue";
	$button.style.marginTop = "2em";

	const pending = State.variables.sexScenePendingActions ?? [];
	const ongoing = State.variables.sexSceneOngoingActions ?? [];
	const isCumming = State.variables.player?.status?.isCumming === true;

	let isEnabled = false;

	if (isCumming) {
		// ✅ Only allow Continue if a climax action has been selected
		isEnabled = pending.some(p => setup.SexualActsDB[p.label]?.isCumming);
	} else {
		// ✅ Normal state: allow if any pending or ongoing actions exist
		isEnabled = pending.length > 0 || ongoing.length > 0;
	}

	$button.disabled = !isEnabled;
	$button.classList.toggle("disabled", !isEnabled);
	$button.onclick = setup.handleSexSceneContinue;

	$wrapper.appendChild($button);
};



setup.toggleRestAction = function (part) {
	let queue = State.variables.sexScenePendingActions ?? [];
	const cleanedQueue = [];

	for (const entry of queue) {
		const label = entry.label;

		// Always remove other rest actions (you only get one per part)
		if (label.startsWith("__REST_")) continue;

		const act = setup.SexualActsDB[label];
		if (!act) continue;

		// Remove actions assigned to this hand or involving this part
		const isHandMatch = entry.assignedHand === part;
		const isPartMatch = act.subjectParts?.includes(part);

		if (isHandMatch || isPartMatch) continue;

		cleanedQueue.push(entry);
	}

	// Add the new rest action
	cleanedQueue.push({ label: `__REST_${part}` });

	State.variables.sexScenePendingActions = cleanedQueue;

	console.log(`[RestAction] 🧘 Queued rest for '${part}'.`);
	setup.renderSexSceneActions();
};



setup.handleSexSceneContinue = function () {
	console.log("[SexScene] ▶️ CONTINUE TURN");

	let pending = State.variables.sexScenePendingActions ?? [];
	const ongoing = State.variables.sexSceneOngoingActions ?? [];

	// Use ongoing if nothing new is selected
	if (pending.length === 0 && ongoing.length > 0) {
		console.log("[SexScene] 🔁 No new actions selected — reusing ongoing actions.");
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

		// === Orgasm Resolution
		if (isCumming && act.isCumming) {
			const climaxLines = setup.SexSceneResponses[label]?.climax ?? [];
			const line = climaxLines.length
				? climaxLines[Math.floor(Math.random() * climaxLines.length)]
				: "You groan and release with a shudder.";
			playerFeedback.push(line);

			playerStatus.excitement = 0;
			playerStatus.fatigue = Math.min(playerStatus.fatigue + 40, playerStatus.maxFatigue);
			playerStatus.isCumming = false;
			playerClimaxResolved = true;

			console.log(`[SexScene] ✅ Orgasm resolved with '${label}'.`);
			console.log("   ➕ Excitement reset, fatigue increased.");
			continue; // Do not treat as ongoing
		}

		// === Arousal Gain
		playerStatus.excitement += act.baseExcitement?.subject ?? 0;
		partnerStatus.excitement += act.baseExcitement?.object ?? 0;

		console.log(`   ➕ Player excitement: ${playerStatus.excitement}`);
		console.log(`   ➕ ${partnerChar.name} excitement: ${partnerStatus.excitement}`);

		partnerState.lastReceivedAction = label;

		// === Ongoing Action Update
		const hand = entry.assignedHand ?? null;
		newOngoing = newOngoing.filter(p => {
			const other = setup.SexualActsDB[p.label];
			if (!other) return true;
			const sameGroup = act.stageGroup && other.stageGroup === act.stageGroup;
			const sameHand = hand ? p.assignedHand === hand : true;
			return !(sameGroup && sameHand);
		});
		newOngoing.push({ label, assignedHand: hand });

		// === Feedback Text
		let flavor = "Neutral";
		if (partnerChar.preferences?.sexualActs?.likes?.includes(label)) flavor = "Liked";
		if (partnerChar.preferences?.sexualActs?.dislikes?.includes(label)) flavor = "Disliked";

		const responseList = setup.SexSceneResponses[label]?.[flavor] ?? [];
		const response = responseList.length
			? responseList[Math.floor(Math.random() * responseList.length)]
			: `${partnerChar.name} reacts passively.`;

		(act.receiver === "player" ? playerFeedback : npcFeedback).push(response);

		// === Orgasm Triggers (Post-action)
		if (!isCumming && partnerStatus.excitement >= partnerStatus.maxExcitement) {
			console.log(`[SexScene] 🚨 ${partnerChar.name} orgasm triggered.`);
			setup.triggerOrgasm(partnerId);
		}

		if (!isCumming && playerStatus.excitement >= playerStatus.maxExcitement) {
			console.log("[SexScene] 🚨 Player orgasm triggered.");
			setup.triggerOrgasm("player");
		}
	}

	// === Cleanup & Rerender
	if (!playerClimaxResolved) {
		// Filter invalid ongoing
		const validOngoing = newOngoing.filter(entry => {
			const act = setup.SexualActsDB[entry.label];
			if (!act || act.isCumming) return false;

			const partOk = act.subjectParts.every(part => {
				const resolvedPart = part === "hand" ? entry.assignedHand : part;
				const state = playerState.parts?.[resolvedPart];
				return state && !state.bound && !state.disabled;
			});
			if (!partOk) return false;

			const objectOk = !act.objectParts?.some(p => !partnerState.parts?.[p]);
			if (!objectOk) return false;

			if (act.skillsRequired) {
				for (const [skill, min] of Object.entries(act.skillsRequired)) {
					if ((State.variables.player.skills?.[skill] ?? 0) < min) return false;
				}
			}
			return true;
		});

		State.variables.sexSceneOngoingActions = validOngoing;
		State.variables.sexScenePendingActions = [];

		setup.renderSexSceneActions();
	}

	// === Render Feedback
	if (feedbackBox) {
		if (npcFeedback.length > 0) {
			const npcPara = document.createElement("p");
			npcPara.innerHTML = npcFeedback.map(l => `<span>${l}</span>`).join(" ");
			feedbackBox.appendChild(npcPara);
		}
		if (playerFeedback.length > 0) {
			const playerPara = document.createElement("p");
			playerPara.innerHTML = playerFeedback.map(l => `<span>${l}</span>`).join(" ");
			feedbackBox.appendChild(playerPara);
		}
	}

	console.groupCollapsed("[SexScene] 🧷 Final Ongoing Actions");
	console.dir(State.variables.sexSceneOngoingActions);
	console.groupEnd();
	console.log("[SexScene] 🔁 Turn complete.");
};


/* ======================================================
   ORGASM TRIGGER & FEEDBACK SYSTEM
 ===================================================== */

setup.triggerOrgasm = function (charId) {
	const isPlayer = charId === "player";
	const char = isPlayer ? State.variables.player : State.variables.characters?.[charId];
	const state = isPlayer ? State.variables.sexScenePlayerState : State.variables.sexSceneNPCStates?.[charId];

	if (!char || !state) {
		console.warn(`[Orgasm] ❌ Could not resolve character or state for '${charId}'.`);
		return;
	}

	// Clamp excitement and apply fatigue
	char.status.excitement = 0;
	char.status.fatigue = Math.min(char.status.fatigue + 40, char.status.maxFatigue);

	console.log(`[Orgasm] 💦 ${isPlayer ? "Player" : char.name} orgasmed.`);
	console.log(`   ➡️ Fatigue now: ${char.status.fatigue}/${char.status.maxFatigue}`);

	if (!isPlayer) {
		// NPC orgasm: show passive feedback or animation here if needed
		setup.displayNPCOrgasmFeedback?.(charId);
		return;
	}

	const hasPenis = !!state.parts?.penis;
	const hasVagina = !!state.parts?.vagina;

	// === Auto-orgasm for vagina-only players
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

	// === Manual orgasm resolution (via action)
	char.status.isCumming = true;
	console.log("[Orgasm] 🚩 Player is now in 'isCumming' resolution phase.");

	const feedbackBox = document.getElementById("sexSceneFeedbackBox");
	if (feedbackBox) {
		const p = document.createElement("p");
		p.innerHTML = "You're right at the edge. How do you want to finish?";
		feedbackBox.appendChild(p);
		console.log("[OrgasmUI] 💬 Prompt rendered in feedback box.");
	}
};


setup.autoResolveVaginalOrgasm = function () {
	const feedbackBox = document.getElementById("sexSceneFeedbackBox");
	if (!feedbackBox) {
		console.warn("[Orgasm] ❌ Feedback box not found for auto-orgasm.");
		return;
	}

	const p = document.createElement("p");
	p.innerHTML = "A wave of pleasure crashes over you as your body trembles in release.";
	feedbackBox.appendChild(p);

	// Reset orgasm state and clear queued actions
	State.variables.player.status.isCumming = false;
	State.variables.player.status.excitement = 0;
	State.variables.sexScenePendingActions = [];
	State.variables.sexSceneOngoingActions = [];

	setup.renderSexSceneActions();
	console.log("[Orgasm] ✅ Auto-orgasm complete.");
};


setup.displayNPCOrgasmFeedback = function (npcId) {
	const state = State.variables.sexSceneNPCStates?.[npcId];
	const lastAct = state?.lastReceivedAction ?? null;
	const npc = State.variables.characters?.[npcId];
	const feedbackBox = document.getElementById("sexSceneFeedbackBox");

	if (!npc || !feedbackBox) {
		console.warn(`[OrgasmFeedback] ❌ Missing NPC or feedbackBox for '${npcId}'.`);
		return;
	}

	let climaxText = `${npc.name} orgasms, body trembling with release.`; // Default fallback

	if (lastAct) {
		const response = setup.SexSceneResponses[lastAct];
		const climaxLines = response?.climax ?? [];

		if (Array.isArray(climaxLines) && climaxLines.length > 0) {
			climaxText = climaxLines[Math.floor(Math.random() * climaxLines.length)];
			console.log(`[OrgasmFeedback] 💬 '${npc.name}' climax response sourced from '${lastAct}'.`);
		} else {
			console.log(`[OrgasmFeedback] ⚠️ No climax lines found for '${lastAct}'. Using fallback.`);
		}
	} else {
		console.log(`[OrgasmFeedback] ⚠️ No lastReceivedAction for '${npc.name}'. Using fallback.`);
	}

	const p = document.createElement("p");
	try {
		const span = document.createElement("span");
		new Wikifier(span, climaxText);
		p.innerHTML = span.innerHTML;
	} catch (err) {
		console.warn(`[OrgasmFeedback] ❌ Error parsing climax text: ${err.message}`);
		p.textContent = climaxText;
	}

	feedbackBox.appendChild(p);
};


setup.offerPlayerOrgasmChoices = function () {
	const box = document.getElementById("sexSceneFeedbackBox");
	if (!box) {
		console.warn("[OrgasmUI] ❌ Feedback box not found — cannot render prompt.");
		return;
	}

	const p = document.createElement("p");
	p.innerHTML = "You're right at the edge. How do you want to finish?";
	box.appendChild(p);

	console.log("[OrgasmUI] 💬 Prompt inserted. Orgasm choice buttons will be rendered via body groups.");
};



/*=========================================================================================
================= NPC DECISION MAKING =====================================================
======================================================================================== */

setup.npcDecideActions = function (npcId) {
	const npc = State.variables.characters?.[npcId];
	const npcState = State.variables.sexScenePartnerStates?.[npcId];
	const playerState = State.variables.sexScenePlayerState;

	if (!npc || !npcState || !playerState) {
		console.warn(`[NPC AI] ❌ Could not resolve required data for '${npcId}'.`);
		return;
	}

	const availableActs = [];

	for (const [label, act] of Object.entries(setup.SexualActsDB)) {
		if (act.giver !== "npc" || act.receiver !== "player") continue;
		if (act.isCumming) continue;

		// Anatomy validation
		const npcHasParts = act.subjectParts.every(p => npcState.parts?.[p]);
		const playerHasParts = act.objectParts.every(p => playerState.parts?.[p]);
		if (!npcHasParts || !playerHasParts) continue;

		const score = setup.npcEvaluateAction(npc, act);
		availableActs.push({ label, score });
	}

	if (availableActs.length === 0) {
		console.warn(`[NPC AI] ⚠ No valid acts found for '${npc.name}'.`);
		return;
	}

	// Pick from top 3 highest-scoring actions
	const topActs = availableActs.sort((a, b) => b.score - a.score).slice(0, 3);
	const chosen = topActs[Math.floor(Math.random() * topActs.length)];

	// Avoid re-queuing the same label
	if (State.variables.sexScenePendingActions.some(p => p.label === chosen.label)) {
		console.log(`[NPC AI] ⚠ '${npc.name}' attempted to reuse '${chosen.label}'. Skipping.`);
		return;
	}

	console.log(`[NPC AI] 🤔 '${npc.name}' selects '${chosen.label}' (score: ${chosen.score})`);

	// Track for AI learning / behavior modeling
	npcState.recentActs = npcState.recentActs ?? [];
	npcState.recentActs.push(chosen.label);

	// Add to pending
	State.variables.sexScenePendingActions.push({
		label: chosen.label,
		data: setup.SexualActsDB[chosen.label]
	});
};



setup.npcEvaluateAction = function (npc, act) {
	let score = 10;

	const npcPrefs = npc.preferences?.sexualActs;
	const npcInclinations = npc.inclinations ?? [];
	const npcStatus = npc.status ?? {};
	const playerStatus = State.variables.player?.status ?? {};
	const mood = State.variables.sexScenePartnerStates?.[npc.id]?.mood ?? null;

	// === Preferences
	if (npcPrefs?.likes?.includes(act.label)) score += 20;
	if (npcPrefs?.dislikes?.includes(act.label)) score -= 20;

	// === Fatigue / Excitement
	if (npcStatus.excitement >= 70 && act.stageLevel >= 1) score += 15;
	if (npcStatus.fatigue >= 70 && act.stageLevel <= 0) score += 10;

	if (playerStatus.excitement >= 80 && act.baseExcitement?.object >= 10) score += 10;

	// === Inclinations
	if (act.inclinationTags) {
		for (const tag of act.inclinationTags) {
			if (npcInclinations.includes(tag)) score += 5;
		}
	}

	// === Mood Biasing
	if (mood === "aggressive" && act.stageLevel >= 1) score += 8;
	if (mood === "gentle" && act.stageLevel === 0) score += 8;
	if (mood === "teasing" && act.stageLevel === 0 && act.inclinationTags?.includes("tease")) {
		score += 10;
	}

	// === Small randomness for variation
	score += Math.random() * 5;

	return score;
};


setup.npcMoodInit = function (npcId) {
	const state = State.variables.sexScenePartnerStates?.[npcId];
	if (!state) {
		console.warn(`[NPC AI] ❌ Cannot assign mood — no partner state for '${npcId}'.`);
		return;
	}

	const moods = ["aggressive", "teasing", "gentle"];
	const index = Math.floor(Math.random() * moods.length);
	const mood = moods[index];

	state.mood = mood;

	console.log(`[NPC AI] 🎭 '${npcId}' mood initialized as '${mood}'.`);
};


setup.npcInclinationShift = function (npcId) {
	const npc = State.variables.characters?.[npcId];
	const npcState = State.variables.sexScenePartnerStates?.[npcId];
	if (!npc || !npcState?.recentActs?.length) return;

	const seen = new Set();

	for (const actLabel of npcState.recentActs) {
		if (seen.has(actLabel)) continue;
		seen.add(actLabel);

		if (Math.random() > 0.1) continue; // 10% chance to learn

		const act = setup.SexualActsDB[actLabel];
		if (!act?.inclinationTags) continue;

		for (const tag of act.inclinationTags) {
			if (!npc.inclinations?.includes(tag)) {
				npc.inclinations = npc.inclinations ?? [];
				npc.inclinations.push(tag);
				console.log(`[NPC AI] 🌱 '${npc.name}' developed inclination toward '${tag}' from '${actLabel}'.`);
			}
		}
	}

	npcState.recentActs = []; // Clear tracking
};
