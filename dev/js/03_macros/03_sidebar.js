function toggleSidebar() {
	const sidebar = document.getElementById("custom-sidebar");
	const toggle = document.getElementById("sidebar-toggle");
	const arrow = document.getElementById("sidebar-arrow");
	const nav = document.getElementById("sidebar-nav");

	if (!sidebar || !toggle || !arrow) {
		console.warn("Sidebar toggle failed: element(s) missing.");
		return;
	}

	sidebar.classList.toggle("collapsed");
	document.body.classList.toggle("sidebar-collapsed", sidebar.classList.contains("collapsed"));

	if (sidebar.classList.contains("collapsed")) {
		if (nav) nav.style.display = "none";
		toggle.style.left = "40px";
		arrow.setAttribute("data-lucide", "arrow-right");
	} else {
		if (nav) nav.style.display = "flex";
		toggle.style.left = "260px";
		arrow.setAttribute("data-lucide", "arrow-left");
	}

	if (window.lucide) {
		lucide.createIcons();
	}
}

$(document).one(':storyready', function () {
	const toggleBtn = document.getElementById("sidebar-toggle");
	if (toggleBtn) {
		toggleBtn.addEventListener("click", toggleSidebar);
	}
});
