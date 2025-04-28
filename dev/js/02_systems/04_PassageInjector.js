// ===============================
//  Move Rendered Passage Content
// ===============================
$(document).on(':passagerender', function () {
	setTimeout(function () {
		const passage = document.querySelector('#passages > .passage');
		const backdrop = document.getElementById('text-backdrop');

		if (passage && backdrop) {
			// FIX: preserves injected DOM nodes like convoBox instead of wiping them out
			backdrop.replaceChildren(passage);
		} else {
			console.warn("⚠️ Could not move passage content:", {
				passageFound: !!passage,
				backdropFound: !!backdrop
			});
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
