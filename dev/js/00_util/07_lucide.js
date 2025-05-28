var lucideScript = document.createElement('script');
lucideScript.src = 'https://unpkg.com/lucide@latest';
lucideScript.onload = function () {
	console.log("✅ Lucide icons loaded.");
	window.lucideReady = true;
};
document.head.appendChild(lucideScript);

function renderLucideIconsSafely() {
	console.log("🔄 Attempting to render Lucide icons...");
	if (window.lucideReady && window.lucide && window.lucide.createIcons) {
		console.log("✅ Lucide is ready — rendering icons now.");
		window.lucide.createIcons();
	} else {
		console.log("⏳ Lucide not ready yet... retrying in 50ms");
		setTimeout(renderLucideIconsSafely, 50);
	}
}
