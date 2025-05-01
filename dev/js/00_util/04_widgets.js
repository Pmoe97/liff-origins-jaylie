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
						<button class="sidebar-btn" onclick="Save.show()">
							<i data-lucide="save"></i> Saves
						</button>
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



/* Dialogue Choice Setup Macro */
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
				$button.remove();

				if (!reusable) {
					State.variables.usedDialogueOptions = State.variables.usedDialogueOptions || {};
					State.variables.usedDialogueOptions[target] = true;
				}

				const $box = $("#convoBox");
				if ($box.length) {
					Wikifier.wikifyEval(`<<${target}>>`);

					// 🧠 Re-evaluate and re-render choices
					const currentChar = State.variables.currentNPC;
					const currentPhase = State.variables.currentPhase;
					const phaseFunc = setup?.[`${currentChar}_Conversation_Options_Phase${currentPhase}`];
					if (typeof phaseFunc === "function") {
						phaseFunc();
					}

					// ✅ Scroll to bottom
					setTimeout(() => {
						$box[0].scrollTo({
							top: $box[0].scrollHeight,
							behavior: "smooth"
						});
					}, 10);
				}
			});

		this.output.append($button[0]);
	}
});


Macro.add("DialogueTree", {
	handler() {
		const characterName = this.args[0];
		const phase = this.args[1];

		if (!characterName || phase === undefined) {
			console.error("DialogueTree: Missing character name or phase number.");
			return;
		}

		// Save state for reinjection if needed
		State.variables.currentNPC = characterName;
		State.variables.currentPhase = phase;

		// Clear any lingering choices
		if (typeof setup.clearConvoChoices === "function") {
			setup.clearConvoChoices();
		}

		// Validate setup function
		const setupFunc = setup[`${characterName}_Conversation_Options_Phase${phase}`];
		if (typeof setupFunc !== "function") {
			console.error(`DialogueTree: Setup function setup.${characterName}_Conversation_Options_Phase${phase} not found.`);
			return;
		}

		// Dynamically wrap and inject options
		setTimeout(() => {
			const choiceEl = document.getElementById("convoChoices");
			if (!choiceEl) {
				console.warn("DialogueTree: #convoChoices not found.");
				return;
			}

			// Build the choice HTML and wrap it
			const output = [];
			setupFunc(); // this calls setup.addChoices(), which already uses <<dialogueChoice>>

			// Note: we no longer try to wrap <<DialogueTree>> inside LayoutConvoChoices
			// setup.addChoices takes care of formatting the output properly
		}, 0);
	}
});

setup.addChoices = function (list) {
	const $container = $("#convoChoices");
	if (!$container.length) {
		console.warn("[addChoices] convoChoices not found.");
		return;
	}

	$container.empty();
	State.variables.usedDialogueOptions = State.variables.usedDialogueOptions || {};

	list.forEach(([label, target, reusableFlag = 0]) => {
		const reusable = reusableFlag === 1 || reusableFlag === "1";
		const used = State.variables.usedDialogueOptions[target];

		// ✅ Skip only if it's used and not reusable
		if (used && !reusable) {
			console.log(`[addChoices] Skipping used non-reusable choice: ${target}`);
			return;
		}

		// ✅ Reinject even if previously used, if marked reusable
		const macroCall = `<<dialogueChoice "${label}" "${target}" "${reusable ? 1 : 0}">>`;
		console.log(`[addChoices] Injecting: ${macroCall}`);
		new Wikifier($container[0], macroCall);
	});
};


/* In-line Convo Minigame Button/Launcher Insert Macro */
/* <<OpenConvoGame "npcId">> to start */
Macro.add("OpenConvoGame", {
	handler() {
		const npcId = this.args[0];
		const char = State.variables.characters?.[npcId];

		if (!npcId || !char) {
			return this.error("OpenConvoGame requires a valid NPC ID.");
		}

		const btnHTML = `
			<div class="start-minigame-button-wrapper">
				<button class="start-minigame-button" onclick="setup.ConvoUI.renderMinigame('${npcId}')">
					Get to know ${char.name}
				</button>
			</div>
		`;

		const target = document.getElementById("convoBox");
		if (target) {
			target.insertAdjacentHTML("beforeend", btnHTML);
		} else {
			console.warn("[OpenConvoGame] #convoBox not found — cannot inject button.");
		}
	}
});

/* Side-by-side Dialogue UI setup macros */

Macro.add('ClearSnapshots', {
	handler() {
		if (typeof setup.clearSnapshots === 'function') {
			setup.clearSnapshots();
		} else {
			console.warn("[ClearSnapshots] setup.clearSnapshots function not found.");
		}
	}
});

