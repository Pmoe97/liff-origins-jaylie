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
Macro.add("choice", {
	handler() {
		if (!this.args[0] || !this.args[1]) return;

		if (State.variables.DEBUG) {
			console.log(`[DEBUG] Adding choice: "${this.args[0]}" → ${this.args[1]}`);
		}

		const choiceHTML = `<p><a class="link-internal" role="button">${this.args[0]}</a></p>`;
		const $choice = jQuery(choiceHTML);

		$choice.on("click", () => {
			$("#convoChoices").empty();
			Engine.play(this.args[1]);
		});

		$("#convoChoices").append($choice);
	}
});

/* Dialogue Tree Setup Macro */
/* This macro is used to set up the dialogue tree for a specific NPC and phase. It dynamically loads the appropriate setup function based on the NPC ID and phase number. */
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

		// Inject containers if they don't exist
		if (!document.getElementById("convoBox")) {
			jQuery("#passages").append(`<div id="convoBox"></div>`);
		}
		if (!document.getElementById("convoChoices")) {
			jQuery("#passages").append(`<div id="convoChoices"></div>`);
		} else {
			jQuery("#convoChoices").empty();
		}

		// Dynamically find the correct setup function
		let functionName = `${npc}_Conversation_Options_Phase${phase}`;
		let fallbackName = `${npc}_Conversation_Options_Generic`;
		let setupFunc = setup[functionName] || setup[fallbackName];

		if (typeof setupFunc === "function") {
			setupFunc();
		} else {
			console.warn(`[DialogueTree] No setup function found: ${functionName}`);
			jQuery("#convoChoices").append(`<p>Dialogue options missing.</p>`);
		}
	}
});
/* choice setup beautifier function */
setup.addChoices = function (list) {
	const $choices = $("#convoChoices");
	$choices.empty();
  
	list.forEach(([label, target]) => {
	  if (State.variables.DEBUG) {
		console.log(`[DEBUG] Adding choice: "${label}" → ${target}`);
	  }
	  Wikifier.wikifyEval(`<<choice "${label}" "${target}">>`);
	});
  };
  