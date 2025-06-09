window.openOverlay = function (source) {
	const body = document.getElementById("overlay-body");
	if (!body) return;

	body.innerHTML = "";

	const normalized = source.toLowerCase();

	// Force file-based overlays for naming conventions like -page or -sheet
	if (normalized.endsWith(".html") || normalized.includes("-page") || normalized.includes("-sheet")) {
		const filename = normalized.endsWith(".html") ? normalized : `${normalized}.html`;
		setup.loadOverlayHTML("overlay-body", filename);
	} else {
		new Wikifier(body, `<<include [[${source}]]>>`);
	}

	document.getElementById("overlay-panel").classList.remove("overlay-hidden");
	
	// Block map movement when overlay is open
	if (window.MapSystem) {
		MapSystem.setMovementBlocked(true);
	}
	
	// Trigger overlay open event
	$(document).trigger(':overlayopen', [source]);
	
	renderLucideIconsSafely?.();
};


window.closeOverlay = function () {
	const panel = document.getElementById("overlay-panel");
	if (!panel) return;
	panel.classList.add("overlay-hidden");
	document.getElementById("overlay-body").innerHTML = "";
	
	// Unblock map movement when overlay is closed
	if (window.MapSystem) {
		MapSystem.setMovementBlocked(false);
	}
};

setup.loadOverlayHTML = async function (overlayId, filename) {
	const container = document.getElementById(overlayId);
	if (!container) {
		console.warn(`❌ Could not find element #${overlayId}`);
		return;
	}

	try {
		const response = await fetch(`overlays/${filename}`);
		const html = await response.text();
		container.innerHTML = html;

		// Re-run Lucide icon rendering if needed
		if (window.lucide) lucide.createIcons();
	} catch (err) {
		console.error(`❌ Error loading overlay file '${filename}':`, err);
	}
};
