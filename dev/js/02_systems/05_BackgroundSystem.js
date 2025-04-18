$(document).on(':passagedisplay', function () {
	const bgDiv = document.getElementById("background-image");

	// If no new background was set, fallback to default
	if (!State.variables.bgImageSetThisPassage) {
		State.variables.bgImage = "images/background_default.png";
	}

	const url = State.variables.bgImage;
	if (bgDiv) {
		bgDiv.style.backgroundImage = `url('${url}')`;
	}

	// Reset flag for next passage
	delete State.variables.bgImageSetThisPassage;
});