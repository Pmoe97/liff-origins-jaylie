// ===============================
//  Move Rendered Passage Content
// ===============================
$(document).on(':passagerender', function () {
	setTimeout(function () {
		const passage = document.querySelector('#passages > .passage');
		const dynamicContent = document.getElementById('dynamic-content');

		// Skip if dynamic-content not found
		if (!dynamicContent) {
			console.error("[PassageInjector] dynamic-content container missing.");
			return;
		}

		// Skip if we are in dialogue mode (manual control active)
		const backdrop = document.getElementById('text-backdrop');
		if (backdrop?.classList.contains('in-dialogue')) {
			console.log("[PassageInjector] In dialogue mode — skipping normal passage injection.");
			return;
		}

		// Normal passage move
		if (passage) {
			dynamicContent.replaceChildren(passage);
		} else {
			console.warn("⚠️ Could not find rendered passage during passage render.");
		}
	}, 0);
});


// ===============================
//  Clean Up Dialogue Layout on Passage Start
// ===============================
$(document).on(':passagestart', function (ev) {
	const backdrop = document.getElementById("text-backdrop");
	if (!backdrop) return;

	// If the convo layout is present, clear it
	if (backdrop.querySelector("#convoLayoutContainer")) {
		backdrop.classList.remove("in-dialogue");
		backdrop.innerHTML = ""; // Clear convo stuff when leaving passage
	}
});

$(document).on(':passagerender', function() {
	if (window.setup?.SidebarUI?.updateSummary) {
		setup.SidebarUI.updateSummary();
	}
});

$(document).on(':passagestart', function () {
	const backdrop = document.getElementById("text-backdrop");
	const dynamicContent = document.getElementById("dynamic-content");
	if (!backdrop || !dynamicContent) return;

	// If convo layout is present, reset cleanly
	if (backdrop.classList.contains("in-dialogue")) {
		console.log("[PassageStart] Exiting dialogue mode.");
		backdrop.classList.remove("in-dialogue");
		dynamicContent.innerHTML = ""; // clear convo layout
	}
});
