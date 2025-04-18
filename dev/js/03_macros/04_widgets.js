/* SidebarUI */
console.log("✅ widgets.js loaded");

Macro.add("SidebarUI", {
	handler() {
		const uiBar = document.getElementById("ui-bar");

		if (!uiBar) {
			console.warn("SidebarUI: #ui-bar not found.");
			return;
		}

		// Avoid duplicating if already built
		if (document.getElementById("custom-sidebar-buttons")) return;

		uiBar.insertAdjacentHTML("afterbegin", `
			<div id="custom-sidebar-buttons">
				<!-- Navigation Arrows -->
				<div id="sidebar-nav">
					<button class="sidebar-nav-btn" onclick="SugarCube.Engine.backward()">←</button>
					<button class="sidebar-nav-btn" onclick="SugarCube.Engine.forward()">→</button>
				</div>

				<!-- Character Button -->
				<div class="button-single">
					<button class="sidebar-btn" onclick="openOverlay('CharacterSheet')">
						<i data-lucide="scroll-text"></i> Character
					</button>
				</div>

				<!-- Inventory Button -->
				<div class="button-single">
					<button class="sidebar-btn" onclick="openOverlay('InventoryPage')">
						<i data-lucide="backpack"></i> Inventory
					</button>
				</div>

				<!-- Journal Button -->
				<div class="button-single">
					<button class="sidebar-btn" onclick="openOverlay('JournalPage')">
						<i data-lucide="book-open"></i> Journal
					</button>
				</div>

				<!-- Stats & Achievements -->
				<div class="button-pair">
					<button class="sidebar-btn" onclick="openOverlay('StatsPage')">
						<i data-lucide="brain"></i> Stats
					</button>
					<button class="sidebar-btn" onclick="openOverlay('AchievementsPage')">
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

		// Re-render icons
		if (window.lucide) {
			lucide.createIcons();
		}
	}
});

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
$(document).on(':storyready', () => {
	if (SugarCube.Macro.has("SidebarUI")) {
		SugarCube.Macro.get("SidebarUI").handler.call({ output: document.body });
	} else {
		console.warn("SidebarUI macro not found during storyready.");
	}
});
