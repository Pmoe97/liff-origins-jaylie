$(document).on(':passagerender', function () {
	setTimeout(function () {
		const passage = document.querySelector('#passages > .passage');
		const backdrop = document.getElementById('text-backdrop');

		if (passage && backdrop) {
			backdrop.innerHTML = ""; // Clear previous content
			backdrop.appendChild(passage); // Move the actual DOM node
		} else {
			console.warn("⚠️ Could not move passage content:", {
				passageFound: !!passage,
				backdropFound: !!backdrop
			});
		}
	}, 0);
});
