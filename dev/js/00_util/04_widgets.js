console.log("✅ widgets.js loaded");

/* Background Macro */
Macro.add("bg", {
	handler: function () {
		const arg = this.args[0];
		if (typeof arg === "string") {
			State.variables.bgImage = "images/background_" + arg + ".png";
			State.variables.bgImageSetThisPassage = true;
		} else {
			return this.error("Invalid argument to <<bg>>. Expected a string like 'tavern'.");
		}
	}
});

/* SidebarUI Widget */
Macro.add("SidebarUI", {
	handler() {
		const sidebar = document.getElementById("custom-sidebar");

		if (!sidebar) {
			console.warn("SidebarUI: #custom-sidebar not found.");
			return;
		}

		// Check if already injected to avoid duplicates
		if (document.getElementById("sidebar-topbar")) {
			console.log("SidebarUI: Already injected.");
			return;
		}

		sidebar.innerHTML = `
			<!-- Top Nav and Collapse -->
			<div id="sidebar-topbar">
				<div id="sidebar-nav">
					<button id="sidebar-nav-back" class="sidebar-nav-btn" onclick="setup.navBack()">
						<i data-lucide="undo-2"></i>
					</button>
					<button id="sidebar-nav-forward" class="sidebar-nav-btn" onclick="setup.navForward()">
						<i data-lucide="redo-2"></i>
					</button>
				</div>
				<button id="sidebar-toggle" type="button" class="sidebar-btn">
					<i id="sidebar-arrow" data-lucide="arrow-left"></i>
				</button>
			</div>

			<!-- Collapsed Summary -->
			<div id="sidebar-summary" style="display: none; flex-direction: column; align-items: center; gap: 8px;">
				<span id="summary-time">--:--</span>
				<span id="summary-gold">0</span>
				<span id="summary-level">Lvl 1</span>
				<div class="exp-bar-mini">
					<div class="exp-bar-fill-mini" id="exp-fill-mini"></div>
				</div>
				<div id="summary-status-icons">
					<i id="summary-health" data-lucide="heart"></i>
					<i id="summary-fatigue" data-lucide="zap"></i>
					<i id="summary-composure" data-lucide="brain"></i>
					<i id="summary-excitement" data-lucide="flame"></i>
				</div>
				<div id="summary-conditions">
					<!-- Dynamic icons like poisoned/charmed will inject here -->
				</div>
			</div>


			<!-- Main Scrollable Content -->
			<div id="sidebar-content">
				<!-- Top Info -->
				<div id="sidebar-top-info">
					<div id="sidebar-datetime">
						<span id="sidebar-time">--:--</span>
						<span id="sidebar-date">Loading Date...</span>
					</div>
					<div id="sidebar-location-weather">
						<span id="sidebar-location">Unknown Location</span>
						<i id="sidebar-weather-icon" data-lucide="sun" title="Clear Skies"></i>
					</div>
					<div id="sidebar-gold">
						<i data-lucide="coins"></i> <span id="sidebar-gold-amount">0</span>
					</div>
				</div>

				<!-- Status Trackers -->
				<div id="sidebar-status-tracker">
					<div class="status-bar" id="health-bar">
						<i data-lucide="heart"></i><span>Health</span>
						<div class="status-bar-fill" id="health-fill"></div>
					</div>
					<div class="status-bar" id="fatigue-bar">
						<i data-lucide="zap"></i><span>Fatigue</span>
						<div class="status-bar-fill" id="fatigue-fill"></div>
					</div>
					<div class="status-bar" id="composure-bar">
						<i data-lucide="brain"></i><span>Composure</span>
						<div class="status-bar-fill" id="composure-fill"></div>
					</div>
					<div class="status-bar" id="excitement-bar">
						<i data-lucide="flame"></i><span>Excitement</span>
						<div class="status-bar-fill" id="excitement-fill"></div>
					</div>
					<div id="conditional-status-bars"></div>
				</div>

				<!-- Carry Weight (Hidden unless 85% full) -->
				<div id="sidebar-carryweight" style="display:none;">
					<i data-lucide="package"></i> <span id="carryweight-text">Carryweight: 0/100</span>
					<div class="status-bar-carry">
						<div class="carry-bar-fill" id="carry-fill"></div>
					</div>
				</div>

				<!-- Level and Experience -->
				<div id="sidebar-level-exp">
					<span id="sidebar-level">Lvl 1</span>
					<div class="exp-bar">
						<div class="exp-bar-fill" id="exp-fill"></div>
					</div>
					<span id="exp-text">0/100 XP</span>
				</div>

				<!-- Buttons injected here -->
				<div id="custom-sidebar-buttons">
					<!-- Character Button -->
					<div class="button-single">
						<button class="sidebar-btn" onclick="openOverlay('character-sheet')">
							<i data-lucide="scroll-text"></i> Character
						</button>
					</div>

					<!-- Inventory Button -->
					<div class="button-single">
						<button class="sidebar-btn" onclick="openOverlay('inventory-page')">
							<i data-lucide="backpack"></i> Inventory
						</button>
					</div>

					<!-- Journal & People Buttons -->
					<div class="button-pair">
						<button class="sidebar-btn" onclick="openOverlay('journal-page')">
							<i data-lucide="book-open"></i> Journal
						</button>
						<button class="sidebar-btn" onclick="openOverlay('people-page')">
							<i data-lucide="users"></i> People
						</button>
					</div>

					<!-- Stats & Achievements -->
					<div class="button-pair">
						<button class="sidebar-btn" onclick="openOverlay('stats-page')">
							<i data-lucide="brain"></i> Stats
						</button>
						<button class="sidebar-btn" onclick="openOverlay('achievements-page')">
							<i data-lucide="star"></i> Achievements
						</button>
					</div>

					<!-- Saves & Options -->
					<div class="button-pair">
						<button id="btn-saves" class="sidebar-btn"><i data-lucide="save"></i> Saves</button>
						<button class="sidebar-btn" onclick="UI.options()">
							<i data-lucide="settings"></i> Options
						</button>
					</div>
				</div> <!-- end #custom-sidebar-buttons -->
			</div> <!-- end #sidebar-content -->
		`;

		// AFTER injecting sidebar HTML, safely initialize the SidebarUI
		if (window.setup?.SidebarUI?.initialize) {
			console.log("[SidebarUI] Now initializing after Sidebar injection...");
			setup.SidebarUI.initialize();
		}

		if (window.lucide) {
			lucide.createIcons();
		} else {
			console.warn("Lucide not available at sidebar load time.");
		}
	}
});

Macro.add("know", {
	handler() {
		const charId = this.args[0];
		if (!charId || !State.variables.characters?.[charId]) {
			return this.error(`Unknown character ID: ${charId}`);
		}

		State.variables.characters[charId].known = true;
	}
});


/* Dialogue Choice Button */
Macro.add("dialogueChoice", {
	skipArgs: false,
	handler() {
		const [label, target, flag] = this.args;
		const reusable = flag === "1" || flag === 1;

		if (!label || !target) {
			console.warn("<<dialogueChoice>> missing label or target");
			return;
		}

		const $button = $("<p>")
			.addClass("dialogue-choice")
			.text(label)
			.css("cursor", "pointer")
			.on("click", () => {
				console.groupCollapsed(`📌 [dialogueChoice] "${label}" → ${target}`);
				console.log("Reusable:", reusable);
				console.log("Phase:", State.variables.currentPhase);
				console.log("NPC:", State.variables.currentNPC);

				$button.remove();

				// Track globally if not reusable
				State.variables.usedDialogueOptions ??= {};
				if (!reusable) {
					State.variables.usedDialogueOptions[target] = true;
					console.log("✅ Marked non-reusable as used:", target);
				}

				// Track usage by phase + NPC
				const char = State.variables.currentNPC || "Unknown";
				const phase = State.variables.currentPhase ?? "X";
				const key = `Read_${phase}_${char}_${target}`;
				State.variables[key] ??= 0;
				State.variables[key]++;
				console.log("📊 Incremented:", key, "→", State.variables[key]);

				const $box = $("#convoBox");
				if ($box.length) {
					const preChildren = $box[0].children.length;

					$box.children().removeClass("active-entry").addClass("faded-entry");

					console.log("📥 Injecting widget: <<", target, ">>");
					try {
						Wikifier.wikifyEval(`<<${target}>>`);
					} catch (e) {
						console.error("❌ Error injecting widget:", e);
					}

					if (typeof setup.clearConvoChoices === "function") {
						setup.clearConvoChoices();
					} else {
						console.warn("⚠️ setup.clearConvoChoices not found");
					}

					const funcKey = `${char}_Conversation_Options_${phase}`;
					const phaseFunc = setup?.[funcKey];

					if (typeof phaseFunc === "function") {
						console.log(`🔁 Recalling setup.${funcKey}()`);
						phaseFunc();
					} else {
						console.warn(`⚠️ No phase function found for: ${funcKey}`);
					}

					setTimeout(() => {
						const box = $box[0];
						const entries = box.children;
						const newEntry = entries[preChildren];
						if (!newEntry) {
							console.warn("🕳 No new entry detected.");
							return;
						}

						const divider = document.createElement("div");
						divider.className = "dialogue-divider";
						box.insertBefore(divider, newEntry);

						newEntry.classList.add("active-entry");
						newEntry.classList.remove("faded-entry");

						const boxTop = box.getBoundingClientRect().top;
						const entryTop = newEntry.getBoundingClientRect().top;
						const offset = entryTop - boxTop;

						box.scrollTo({
							top: box.scrollTop + offset,
							behavior: "smooth"
						});
						console.log("🧭 Scrolled to new entry.");
					}, 10);
				} else {
					console.warn("⚠️ convoBox not found.");
				}

				console.groupEnd();
			});

		this.output.append($button[0]);
	}
});





/* Dialogue Tree Macro: Pulls current NPC & Phase and injects options */
Macro.add("DialogueTree", {
	handler() {
		const [characterName, phaseId] = this.args;

		if (!characterName || !phaseId) {
			console.error("DialogueTree: Missing character name or phase identifier.");
			return;
		}

		const v = State.variables;
		v.currentNPC = characterName;
		v.currentPhase = phaseId;

		if (typeof setup.clearConvoChoices === "function") {
			setup.clearConvoChoices();
		}

		// Always use flat naming: setup.char_Conversation_Options_phaseId
		const functionName = `${characterName}_Conversation_Options_${phaseId}`;
		const setupFunc = setup[functionName];

		if (typeof setupFunc !== "function") {
			console.error(`DialogueTree: Missing setup function '${functionName}'`);
			return;
		}

		console.log(`📂 [DialogueTree] Switching to: ${functionName}`);

		setTimeout(() => {
			const choiceEl = document.getElementById("convoChoices");
			if (!choiceEl) {
				console.warn("DialogueTree: #convoChoices not found.");
				return;
			}
			setupFunc();
		}, 0);
	}
});



/* Injects List of Choices into UI */
setup.addChoices = function (list) {
	const $container = $("#convoChoices");
	if (!$container.length) {
		console.warn("[addChoices] convoChoices not found.");
		return;
	}

	State.variables.usedDialogueOptions ??= {};

	list.forEach(([label, target, reusableFlag = 0]) => {
		const reusable = reusableFlag === 1 || reusableFlag === "1";
		const used = State.variables.usedDialogueOptions[target];

		if (used && !reusable) {
			console.log(`[addChoices] Skipping used non-reusable choice: ${target}`);
			return;
		}

		const macroCall = `<<dialogueChoice "${label}" "${target}" "${reusable ? 1 : 0}">>`;
		new Wikifier($container[0], macroCall);
	});
};

/* 📌 Minigame Start Button */
Macro.add("OpenConvoGame", {
	handler() {
		const npcId = this.args[0];
		const char = State.variables.characters?.[npcId];

		if (!npcId || !char) {
			return this.error("OpenConvoGame requires a valid NPC ID.");
		}

		const uniqueId = `start-minigame-${npcId}`;
		const btnHTML = `
			<div id="${uniqueId}" class="start-minigame-button-wrapper">
				<button class="start-minigame-button" onclick="
					setup.ConvoUI.renderMinigame('${npcId}');
					const wrapper = document.getElementById('${uniqueId}');
					if (wrapper) {
						wrapper.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
						wrapper.style.opacity = '0';
						wrapper.style.transform = 'translateY(-10px)';
						setTimeout(() => wrapper.remove(), 400);
					}
				">
					Get to know ${char.name}
				</button>
			</div>
		`;

		const target = document.getElementById("convoBox");
		if (target) {
			target.insertAdjacentHTML("beforeend", btnHTML);
		} else {
			console.warn("[OpenConvoGame] #convoBox not found.");
		}
	}
});


/* Optional Utility: Clears conversation snapshot state */
Macro.add("ClearSnapshots", {
	handler() {
		if (typeof setup.clearSnapshots === 'function') {
			setup.clearSnapshots();
		} else {
			console.warn("[ClearSnapshots] setup.clearSnapshots function not found.");
		}
	}
});


/* Character Relation Changing Macro */
Macro.add("relation", {
	skipArgs: false,
	handler() {
		if (this.args.length < 3) {
			return this.error("Usage: <<relation 'characterId' 'stat' value ['set' or 'add']>>");
		}

		const [charId, stat, rawValue, mode = "add"] = this.args;
		const chars = State.variables.characters;
		const char = chars?.[charId];

		if (!char) return this.error(`Character '${charId}' not found.`);
		if (!["trust", "affection", "rapport", "tension", "cooldown"].includes(stat)) {
			return this.error(`Stat '${stat}' is not a valid relationship field.`);
		}

		const value = parseFloat(rawValue);
		if (isNaN(value)) {
			return this.error("Value must be a number.");
		}

		if (mode === "set") {
			char[stat] = value;
		} else if (mode === "add") {
			char[stat] = (char[stat] ?? 0) + value;
		} else {
			return this.error("Mode must be 'add' or 'set'.");
		}

		// Optionally log or visually confirm
		console.log(`[relation] ${mode} ${value} to ${charId}.${stat} → ${char[stat]}`);
	}
});
