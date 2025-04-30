// ===============================
// Declarative Dialogue Detection System
// ===============================

$(document).on(':passagerender', function (ev) {
	setTimeout(function () {
		const passageElement = document.querySelector('#passages > .passage');
		const backdrop = document.getElementById('text-backdrop');

		if (!passageElement || !backdrop) {
			console.warn("[DeclarativeSystem] Required elements missing.");
			return;
		}

		const passageHTML = passageElement.innerHTML;
		const isDialogueMode = passageHTML.includes('StartDialogueLayout');

		// 💣 Always wipe previous layout clean
		backdrop.innerHTML = "";
		backdrop.classList.remove("in-dialogue");

		// ☢️ Just in case — double-tap ghosts
		["convoChoices", "convoBox", "convoLayoutContainer", "convoBoxPanel", "convoChoicesPanel"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				console.warn(`[DeclarativeSystem] Removing lingering #${id}`);
				el.remove();
			}
		});

		if (isDialogueMode) {
			console.log("[DeclarativeSystem] Rebuilding as DIALOGUE layout.");
			setup.startDialogueLayout();
		} else {
			console.log("[DeclarativeSystem] Normal prose passage — layout handled by injector.");
			// No action needed — prose will be injected by 04_PassageInjector.js
		}
	}, 20);
});

// ===============================
// Dialogue Layout Builder
// ===============================

setup.startDialogueLayout = function () {
	const backdrop = document.getElementById('text-backdrop');

	if (!backdrop) return;

	backdrop.classList.add('in-dialogue');

	backdrop.innerHTML = `
		<div id="convoLayoutContainer">
			<div id="convoChoicesPanel">
				<div id="convoChoices"></div>
			</div>
			<div id="convoBoxPanel">
				<div id="convoBox"></div>
			</div>
		</div>
	`;
};
