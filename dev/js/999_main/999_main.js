console.log("🔥 999_main.js loaded!");
// Basic setup
if (typeof setup === 'undefined') {
	setup = {};
}

// Debug logging
window.debugLog = function (...args) {
	if (State.variables.DEBUG) {
		console.log("📢 DEBUG:", ...args);
	}
};

// TEMP boot check
$(document).on(':passagestart', function () {
	console.log("🛠 StoryInit triggered.");
	if (setup.loadItemData) {
		console.log("🟢 setup.loadItemData exists. Running...");
		setup.loadItemData();
	} else {
		console.error("❌ setup.loadItemData is NOT defined yet.");
	}
});
