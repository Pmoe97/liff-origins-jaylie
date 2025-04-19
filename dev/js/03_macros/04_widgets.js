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

		if (window.lucide) {
			lucide.createIcons();
		} else {
			console.warn("Lucide not available at sidebar load time.");
		}
	}
});
