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
