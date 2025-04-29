// ===============================
// Declarative Dialogue Detection System
// ===============================

$(document).on(':passagerender', function (ev) {
	setTimeout(function () {
		const passageElement = document.querySelector('#passages > .passage');
		const dynamicContent = document.getElementById('dynamic-content');
		const backdrop = document.getElementById('text-backdrop');

		if (!passageElement || !dynamicContent || !backdrop) return;

		const passageHTML = passageElement.innerHTML;
		const isDialogueMode = passageHTML.includes('StartDialogueLayout');

		// 💣 Nuke all previous layout content completely
		backdrop.innerHTML = "";
		backdrop.classList.remove("in-dialogue");

		if (isDialogueMode) {
			console.log("[DeclarativeSystem] Rebuilding as DIALOGUE layout.");
			setup.startDialogueLayout();
		} else {
			console.log("[DeclarativeSystem] Rebuilding as NORMAL layout.");

			// 🧠 Reinsert normal passage content (from SugarCube render)
			backdrop.appendChild(dynamicContent); // restore container
			dynamicContent.replaceChildren(passageElement.cloneNode(true));
		}
	}, 20);
});


// ===============================
// Setup Functions
// ===============================

setup.startDialogueLayout = function () {
	const backdrop = document.getElementById('text-backdrop');

	if (!dynamicContent || !backdrop) return;

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

setup.endDialogueLayout = function() {
	const dynamicContent = document.getElementById('dynamic-content');
	const backdrop = document.getElementById('text-backdrop');

	if (!dynamicContent || !backdrop) return;

	backdrop.classList.remove('in-dialogue');
	dynamicContent.innerHTML = "<!-- Empty until next passage injects -->";
};
