// ===============================
//  Move Rendered Passage Content into #text-backdrop (Prose Mode Only)
// ===============================

$(document).on(':passagerender', function () {
	// Optional: Disable transition glitch on initial load
	document.body.classList.add("rendering");

	setTimeout(function () {
		const passage = document.querySelector('#passages > .passage');
		const backdrop = document.getElementById('text-backdrop');

		if (!passage || !backdrop) {
			console.warn("⚠️ Could not move passage content:", {
				passageFound: !!passage,
				backdropFound: !!backdrop
			});
			document.body.classList.remove("rendering");
			return;
		}

		// Skip layout injection if it's handled by the dialogue system
		const isDialogue = passage.innerHTML.includes("StartDialogueLayout");
		if (isDialogue) {
			console.log("[PassageInjector] Skipping injection (dialogue layout will take over)");
			document.body.classList.remove("rendering");
			return;
		}

		backdrop.innerHTML = "";       // Clear old content
		backdrop.appendChild(passage); // Physically move the rendered content
		if (!setup.prefersReducedMotion?.()) {
			backdrop.scrollTo({ top: 0, behavior: "smooth" });
		} else {
			backdrop.scrollTop = 0;
		}


		// Sync sidebar layout class with actual state
		const sidebar = document.getElementById("custom-sidebar");
		if (sidebar) {
			if (sidebar.classList.contains("collapsed")) {
				document.body.classList.add("sidebar-collapsed");
			} else {
				document.body.classList.remove("sidebar-collapsed");
			}
		}

		document.body.classList.remove("rendering");
	}, 0);
});


// ===============================
//  Update Sidebar Summary (Unrelated to Dialogue)
// ===============================
$(document).on(':passagedisplay', function () {
	if (window.setup?.SidebarUI?.updateSummary) {
		setup.SidebarUI.updateSummary();
	}
});
