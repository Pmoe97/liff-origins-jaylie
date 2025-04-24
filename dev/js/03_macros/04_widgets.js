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

		if (document.getElementById("custom-sidebar-buttons")) {
			console.log("SidebarUI: Already injected.");
			return;
		}

		sidebar.insertAdjacentHTML("afterbegin", `
			<div id="custom-sidebar-buttons">
				<!-- Navigation Arrows -->
				<div id="sidebar-nav">
					<button class="sidebar-nav-btn" onclick="SugarCube.Engine.backward()">←</button>
					<button class="sidebar-nav-btn" onclick="SugarCube.Engine.forward()">→</button>
				</div>

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

				<!-- Journal Button -->
				<div class="button-single">
					<button class="sidebar-btn" onclick="openOverlay('journal-page')">
						<i data-lucide="book-open"></i> Journal
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
			</div>
		`);

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
		const npc = this.args[0];
		const phase = this.args[1];

		if (!npc || typeof npc !== "string") {
			return this.error("DialogueTree requires a character ID as the first argument.");
		}

		if (State.variables.DEBUG) {
			console.log(`[DEBUG] DialogueTree loading for "${npc}", phase: ${phase}`);
		}

		const injectConvoElements = () => {
			const target = document.getElementById("text-backdrop");
			if (!target) {
				console.warn("[DialogueTree] ❌ No #text-backdrop found. Abort injection.");
				return;
			}

			if (!document.getElementById("convoBox")) {
				console.log("[DialogueTree] ➕ Injecting #convoBox and nested #convoChoices");
				const box = document.createElement("div");
				box.id = "convoBox";
			
				const choices = document.createElement("div");
				choices.id = "convoChoices";
			
				box.appendChild(choices);
				target.appendChild(box);
			} else {
				const existingChoices = document.getElementById("convoChoices");
				if (existingChoices) {
					existingChoices.innerHTML = "";
				}
			}
	
			const functionName = `${npc}_Conversation_Options_Phase${phase}`;
			const fallbackName = `${npc}_Conversation_Options_Generic`;
			const setupFunc = setup[functionName] || setup[fallbackName];

			if (typeof setupFunc === "function") {
				console.log(`[DialogueTree] ✅ Running setup: ${functionName}`);
				setupFunc();
			} else {
				console.warn(`[DialogueTree] ⚠️ No setup function found: ${functionName}`);
				document.getElementById("convoChoices").innerHTML = `<p>Dialogue options missing.</p>`;
			}
		};

		// Run injection after DOM settles
		setTimeout(() => {
			injectConvoElements();

			// Also observe DOM changes to catch edge cases where content is moved again
			const observer = new MutationObserver(() => {
				if (!document.getElementById("convoBox") || !document.getElementById("convoChoices")) {
					console.log("[DialogueTree] ⏱️ Re-attempting convo injection via observer...");
					injectConvoElements();
				}
			});

			const observeTarget = document.getElementById("text-backdrop");
			if (observeTarget) {
				observer.observe(observeTarget, { childList: true, subtree: true });
			}
		}, 20);
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


