window.openOverlay = function (source) {
	const body = document.getElementById("overlay-body");
	if (!body) {
		console.warn("❌ Could not find overlay-body element");
		return;
	}

	// Clear previous content
	body.innerHTML = "";

	// Use Wikifier to render the Twine passage
	try {
		new Wikifier(body, `<<include [[${source}]]>>`);
	} catch (err) {
		console.error(`❌ Error rendering overlay passage '${source}':`, err);
		body.innerHTML = `<div class="error-message">Could not load overlay: ${source}</div>`;
		return;
	}

	// Show the overlay panel
	const panel = document.getElementById("overlay-panel");
	if (panel) {
		panel.classList.remove("overlay-hidden");
	}

	// Block map movement when overlay is open
	if (window.MapSystem) {
		MapSystem.setMovementBlocked(true);
	}

	// Trigger overlay open event
	$(document).trigger(':overlayopen', [source]);

	// Re-render Lucide icons if available
	if (window.renderLucideIconsSafely) {
		renderLucideIconsSafely();
	} else if (window.lucide) {
		lucide.createIcons();
	}

	// Wait until DOM is ready and State is available
	if (source === "CharacterSheetPage") {
		let retries = 20;
		const waitForReady = () => {
			if (typeof State !== 'undefined' &&
				State.variables?.player &&
				typeof updateCharacterSheet === 'function' &&
				document.getElementById("char-name")
			) {
				updateCharacterSheet(State.variables.player);
				console.log("📜 Character sheet updated via overlay hook");
			} else if (retries-- > 0) {
				setTimeout(waitForReady, 100);
			} else {
				console.warn("⏰ Character sheet update failed after timeout");
			}
		};
		waitForReady();
	}

	console.log(`✅ Overlay opened: ${source}`);
};


window.closeOverlay = function () {
	const panel = document.getElementById("overlay-panel");
	if (!panel) {
		console.warn("❌ Could not find overlay-panel element");
		return;
	}
	
	// Hide the overlay
	panel.classList.add("overlay-hidden");
	
	// Clear the content
	const body = document.getElementById("overlay-body");
	if (body) {
		body.innerHTML = "";
	}
	
	// Unblock map movement when overlay is closed
	if (window.MapSystem) {
		MapSystem.setMovementBlocked(false);
	}
	
	// Trigger overlay close event
	$(document).trigger(':overlayclose');
	
	console.log("✅ Overlay closed");
};

// Helper function to check if an overlay is currently open
window.isOverlayOpen = function () {
	const panel = document.getElementById("overlay-panel");
	return panel && !panel.classList.contains("overlay-hidden");
};

// Helper function to get current overlay content
window.getOverlayContent = function () {
	const body = document.getElementById("overlay-body");
	return body ? body.innerHTML : null;
};

// Initialize overlay system
$(document).ready(function () {
	// Ensure overlay panel exists
	if (!document.getElementById("overlay-panel")) {
		console.warn("⚠️ Overlay panel not found in DOM. Make sure StoryInterface includes overlay-panel structure.");
	}
	
	// Close overlay on Escape key
	$(document).on("keydown", function (e) {
		if (e.key === "Escape" && isOverlayOpen()) {
			closeOverlay();
		}
	});
	
	// Optional: Close overlay when clicking outside (if you have a backdrop)
	$(document).on("click", "#overlay-backdrop", function () {
		closeOverlay();
	});
	
	console.log("✅ Overlay manager initialized");
});

// Deprecated function - kept for backwards compatibility
setup.loadOverlayHTML = function (overlayId, filename) {
	console.warn("⚠️ setup.loadOverlayHTML is deprecated. Use openOverlay() with Twine passage names instead.");
	// Attempt to convert filename to passage name
	const passageName = filename.replace(".html", "").replace(/-/g, " ");
	openOverlay(passageName);
};
