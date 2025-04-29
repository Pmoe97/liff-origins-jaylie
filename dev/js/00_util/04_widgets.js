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
				<button class="sidebar-nav-btn" onclick="setup.navBack()">
					<i data-lucide="undo-2"></i>
				</button>
				<button class="sidebar-nav-btn" onclick="setup.navForward()">
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
	handler() {
		const label = this.args[0];
		const target = this.args[1];
		if (!label || !target) return;

		if (!State.variables.usedDialogueOptions) {
			State.variables.usedDialogueOptions = {};
		}

		if (State.variables.DEBUG) {
			console.log(`[DEBUG] Adding dialogueChoice: "${label}" → ${target}`);
		}

		const choiceHTML = `<p><a class="link-internal" role="button">${label}</a></p>`;
		const $dialoguechoice = jQuery(choiceHTML);

		$dialoguechoice.on("click", () => {
			// Track usage
			if (!target.includes("StartMinigame") && !target.includes("Nevermind")) {
				State.variables.usedDialogueOptions[target] = true;
			}

			// Clear menu
			$("#convoChoices").remove();

			// Display selected response
			Wikifier.wikifyEval(`<<${target}>>`);

			// Reinject choices just after DOM has updated
			setTimeout(() => {
				// Recreate convoChoices inside convoBox
				const box = document.getElementById("convoBox");
				if (!document.getElementById("convoChoices") && box) {
					const choices = document.createElement("div");
					choices.id = "convoChoices";
					box.appendChild(choices);
				}
			
				// Then reinject options
				const npc = State.variables.currentNPC || "allura";
				const phase = State.variables.currentPhase ?? 0;
			
				const func = setup[`${npc}_Conversation_Options_Phase${phase}`];
				if (typeof func === "function") {
					console.log(`[DEBUG] Re-injecting dialogue options for ${npc}, phase ${phase}`);
					func();
				}
			}, 25);			
		});

		$("#convoChoices").append($dialoguechoice);
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

		// Create new convo layout container inside text-backdrop
		const textBackdrop = document.getElementById("text-backdrop");
		if (!textBackdrop) {
			console.error("DialogueTree: text-backdrop not found.");
			return;
		}

		// Clear old content
		textBackdrop.innerHTML = `
			<div id="convoLayoutContainer">
				<div id="convoChoicesPanel">
					<div id="convoChoices"></div>
				</div>
				<div id="convoBoxPanel">
					<div id="convoBox"></div>
				</div>
			</div>
		`;

		// Load options for this character + phase
		const setupFunc = setup[`${characterName}_Conversation_Options_Phase${phase}`];
		if (typeof setupFunc === "function") {
			setupFunc();
		} else {
			console.error(`DialogueTree: Setup function setup.${characterName}_Conversation_Options_Phase${phase} not found.`);
		}
	}
});



/* Choice setup beautifier function */
setup.addChoices = function (list) {
	const $dialoguechoices = $("#convoChoices");
	$dialoguechoices.empty();

	list.forEach(([label, target]) => {
		// Always include "Nevermind" or persistent options
		const persistent = target.includes("StartMinigame") || target.includes("Nevermind");

		if (!persistent && State.variables.usedDialogueOptions?.[target]) return;

		Wikifier.wikifyEval(`<<dialogueChoice "${label}" "${target}">>`);
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
Macro.add("StartDialogueLayout", {
	handler() {
		const backdrop = document.getElementById("text-backdrop");
		const dynamicContent = document.getElementById("dynamic-content");

		if (!dynamicContent || !backdrop) {
			console.error("[Dialogue Layout] Missing containers.");
			return;
		}

		// Add dialogue mode class immediately for styling
		backdrop.classList.add("in-dialogue");

		// Defer building the split layout until AFTER passage renders
		$(document).one(':passagerender', function () {
			const passage = document.querySelector('#passages > .passage');
			if (!passage) {
				console.error("[Dialogue Layout] No passage content found after render.");
				return;
			}

			const oldPassageHTML = passage.innerHTML; // capture text content AFTER SugarCube is done

			dynamicContent.innerHTML = `
				<div id="convoLayoutContainer">
					<div id="convoChoicesPanel">
						<div id="convoChoices"></div>
					</div>
					<div id="convoBoxPanel">
						<div id="convoBox"></div>
					</div>
				</div>
			`;

			// Now inject the captured scene text into convoBox
			const convoBox = document.getElementById("convoBox");
			if (convoBox) {
				convoBox.innerHTML = `<div class="convo-scene-intro">${oldPassageHTML}</div>`;
			}
		});
	}
});

Macro.add("EndDialogueLayout", {
	handler() {
		const backdrop = document.getElementById("text-backdrop");
		if (!backdrop) {
			console.error("[Dialogue Layout] text-backdrop not found.");
			return;
		}

		backdrop.classList.remove("in-dialogue");
		backdrop.innerHTML = ""; // Clear conversation layout
	}
});

