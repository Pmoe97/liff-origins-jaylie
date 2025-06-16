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
});
