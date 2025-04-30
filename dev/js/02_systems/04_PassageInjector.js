// ===============================
//  Move Rendered Passage Content into #text-backdrop (Prose Mode Only)
// ===============================

$(document).on(':passagerender', function () {
	setTimeout(function () {
		const passage = document.querySelector('#passages > .passage');
		const backdrop = document.getElementById('text-backdrop');

		if (!passage || !backdrop) {
			console.warn("⚠️ Could not move passage content:", {
				passageFound: !!passage,
				backdropFound: !!backdrop
			});
			return;
		}

		const isDialogue = passage.innerHTML.includes("StartDialogueLayout");
		if (isDialogue) {
			console.log("[PassageInjector] Skipping injection (dialogue layout will take over)");
			return;
		}

		backdrop.innerHTML = "";       // Clear old content
		backdrop.appendChild(passage); // Physically move the rendered content
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
