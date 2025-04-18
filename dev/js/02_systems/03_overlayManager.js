window.openOverlay = function (source) {
	const body = document.getElementById("overlay-body");
	if (!body) return;

	body.innerHTML = "";

	// Detect if it's a file or passage
	if (source.endsWith(".html")) {
		setup.loadOverlayHTML("overlay-body", source);
	} else {
		new Wikifier(body, `<<include [[${source}]]>>`);
	}

	document.getElementById("overlay-panel").classList.remove("overlay-hidden");
	renderLucideIconsSafely?.();
};

window.closeOverlay = function () {
	const panel = document.getElementById("overlay-panel");
	if (!panel) return;
	panel.classList.add("overlay-hidden");
	document.getElementById("overlay-body").innerHTML = "";
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
