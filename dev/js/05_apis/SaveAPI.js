window.SaveAPI = window.SaveAPI || {};

SaveAPI.nativeSaveMenu = function () {
	try {
		if (typeof UI !== "undefined" && typeof UI.save === "function") {
			UI.save();
		} else {
			console.warn("UI.save() not available. Trying SugarCube fallback...");
			if (typeof Dialog !== "undefined" && typeof Dialog.open === "function") {
				Dialog.open("saves");
			} else {
				alert("Save menu still not available. Something deeper is wrong.");
			}
		}
	} catch (err) {
		console.error("Save menu call failed:", err);
		alert("Could not open save menu.");
	}
};
