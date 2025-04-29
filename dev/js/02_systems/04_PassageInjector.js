// ===============================
//  Move Rendered Passage Content
// ===============================
$(document).on(':passagerender', function () {
	setTimeout(function () {
		const passage = document.querySelector('#passages > .passage');
		const dynamicContent = document.getElementById('dynamic-content');

		if (!dynamicContent) {
			console.error("[PassageInjector] dynamic-content container missing.");
			return;
		}

		if (passage) {
			dynamicContent.replaceChildren(passage);
		} else {
			console.warn("⚠️ Could not find rendered passage during passage render.");
		}
	}, 0);
});

// ===============================
//  Update Sidebar Summary (Unrelated to Dialogue)
// ===============================
$(document).on(':passagerender', function () {
	if (window.setup?.SidebarUI?.updateSummary) {
		setup.SidebarUI.updateSummary();
	}
});
