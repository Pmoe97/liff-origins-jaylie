// dev/js/03_sidebar.js

setup.SidebarUI = {
	initialize() {
		console.log("[SidebarUI] Initializing SidebarUI...");
		const toggleButton = document.getElementById("sidebar-toggle");

		if (!toggleButton) {
			console.warn("[SidebarUI] Sidebar toggle button not found during initialize().");
			return;
		}

		console.log("[SidebarUI] Found toggleButton:", toggleButton);
		toggleButton.addEventListener("click", function() {
			console.log("[SidebarUI] Collapse button clicked!");
			setup.SidebarUI.toggleSidebar();
		});

		setup.SidebarUI.startAutoRefresh();
		tryLucideIcons();
	},

	toggleSidebar() {
		const sidebar = document.getElementById("custom-sidebar");
		const arrow = document.getElementById("sidebar-arrow");
		const toggleButton = document.getElementById("sidebar-toggle");

		if (!sidebar) {
			console.warn("[SidebarUI] Custom sidebar not found during toggleSidebar().");
			return;
		}

		sidebar.classList.toggle("collapsed");
		const isCollapsed = sidebar.classList.contains("collapsed");

		if (arrow) {
			arrow.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
		}

		if (isCollapsed) {
			document.body.classList.add("sidebar-collapsed");
		} else {
			document.body.classList.remove("sidebar-collapsed");
		}

		if (toggleButton) {
			toggleButton.style.position = isCollapsed ? "initial" : "fixed";
		}

		console.log(`[SidebarUI] Sidebar is now ${isCollapsed ? "collapsed" : "expanded"}.`);
	},

	updateSidebar() {
		const player = State.variables.player;
		const world = State.variables.world;
		const inventory = State.variables.inventory || [];

		if (!player || !world) {
			console.warn("[SidebarUI] Player or WorldState missing — cannot update sidebar.");
			return;
		}

		// Top Info
		updateText("sidebar-time", formatWorldTime(world.hour, world.minute, world.is24HourFormat));
		updateText("sidebar-date", formatWorldDate(world.dayOfYear, world.year));
		updateText("sidebar-location", world.locationName || "Unknown Location");

		// Weather Icon
		updateWeatherIcon(world.weather);

		// Gold
		const goldAmount = findGoldAmount(inventory);
		updateText("sidebar-gold-amount", goldAmount);
		updateText("summary-gold", abbreviateGold(goldAmount));

		// Level + XP Bars
		updateText("summary-level", `Lvl ${player.level}`);
		updateExpBars(player);

		// Status Bars
		updateStatusBars(player);

		// Status Icon Coloring
		updateStatusIcon("summary-health", player.status.health, player.status.maxHealth);
		updateStatusIcon("summary-fatigue", player.status.fatigue, player.status.maxFatigue, true);
		updateStatusIcon("summary-composure", player.status.composure, player.status.maxComposure);
		updateStatusIcon("summary-excitement", player.status.excitement, player.status.maxExcitement);

		// Conditional Effects
		updateConditionalStatusIcons(player.status);
	},

	startAutoRefresh() {
		if (window.setup.SidebarUI._refreshTimer) {
			clearInterval(window.setup.SidebarUI._refreshTimer);
		}
		window.setup.SidebarUI._refreshTimer = setInterval(() => {
			setup.SidebarUI.updateSidebar();
		}, 1000);
	}
};

/* ====================
    Utility Functions
==================== */

// Generic text updater
function updateText(id, text) {
	const el = document.getElementById(id);
	if (el) {
		el.textContent = text;
	}
}

// Weather icon setter
function updateWeatherIcon(weatherType) {
	const icon = document.getElementById("sidebar-weather-icon");
	if (!icon) return;

	const weatherIcons = {
		"Clear": "sun",
		"Rain": "cloud-rain",
		"Storm": "cloud-lightning",
		"Snow": "cloud-snow",
		"Fog": "cloud-fog"
	};

	const iconName = weatherIcons[weatherType] || "sun";
	icon.setAttribute("data-lucide", iconName);

	if (window.lucide) {
		lucide.createIcons();
	}
}

// Find Gold from Inventory
function findGoldAmount(inventory) {
	const goldItem = inventory.find(item => item.key === "gold_coin");
	return goldItem ? goldItem.amount : 0;
}

// Abbreviate big gold numbers
function abbreviateGold(amount) {
	if (amount >= 1000000) {
		return (amount / 1000000).toFixed(1) + "M";
	} else if (amount >= 1000) {
		return (amount / 1000).toFixed(1) + "K";
	} else {
		return amount.toString();
	}
}

// Update both large and mini exp bars
function updateExpBars(player) {
	const mainFill = document.getElementById("exp-fill");
	const miniFill = document.getElementById("exp-fill-mini");
	const percent = Math.min((player.experience / player.experienceToNextLevel) * 100, 100);

	if (mainFill) mainFill.style.width = `${percent}%`;
	if (miniFill) miniFill.style.width = `${percent}%`;

	updateText("exp-text", `${player.experience}/${player.experienceToNextLevel} XP`);
}

// Update sidebar status bars
function updateStatusBars(player) {
	const healthPercent = (player.status.health / player.status.maxHealth) * 100;
	const fatiguePercent = (player.status.fatigue / player.status.maxFatigue) * 100;
	const composurePercent = (player.status.composure / player.status.maxComposure) * 100;
	const excitementPercent = (player.status.excitement / player.status.maxExcitement) * 100;

	setFillWidth("health-fill", healthPercent);
	setFillWidth("fatigue-fill", fatiguePercent);
	setFillWidth("composure-fill", composurePercent);
	setFillWidth("excitement-fill", excitementPercent);
}

// Set fill % width
function setFillWidth(id, percent) {
	const fill = document.getElementById(id);
	if (fill) {
		fill.style.width = `${Math.min(Math.max(percent, 0), 100)}%`;
	}
}

// Status Icon Coloring
function updateStatusIcon(iconId, current, max, inverse = false) {
	const icon = document.getElementById(iconId);
	if (!icon) return;

	const ratio = current / max;

	let color = "white";
	if (inverse) {
		if (ratio >= 0.75) color = "red";
		else if (ratio >= 0.5) color = "orange";
		else color = "green";
	} else {
		if (ratio <= 0.25) color = "red";
		else if (ratio <= 0.5) color = "orange";
		else color = "green";
	}

	icon.style.stroke = color;
}

// Update Conditional Effects
function updateConditionalStatusIcons(status) {
	const container = document.getElementById("summary-conditions");
	if (!container) return;

	container.innerHTML = "";

	const effects = [
		{ key: "poisoned", icon: "skull" },
		{ key: "intoxicated", icon: "glass-water" },
		{ key: "charmed", icon: "heart-handshake" },
		{ key: "burning", icon: "flame" },
		{ key: "bleeding", icon: "droplet" },
		{ key: "stunned", icon: "zap-off" }
	];

	effects.forEach(effect => {
		if (status[effect.key]) {
			const newIcon = document.createElement("i");
			newIcon.setAttribute("data-lucide", effect.icon);
			newIcon.style.width = "16px";
			newIcon.style.height = "16px";
			container.appendChild(newIcon);
		}
	});

	if (window.lucide) {
		lucide.createIcons();
	}
}

// Format World Time
function formatWorldTime(hour, minute, is24h) {
	if (is24h) {
		return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
	} else {
		const ampm = hour >= 12 ? "PM" : "AM";
		const h12 = hour % 12 || 12;
		return `${h12}:${minute.toString().padStart(2, "0")} ${ampm}`;
	}
}

// Format World Date
function formatWorldDate(dayOfYear, year) {
	const seasons = ["Rain", "Sun", "Harvest", "Snow"];
	const seasonLength = 100;
	const seasonIndex = Math.floor((dayOfYear - 1) / seasonLength);
	const seasonDay = ((dayOfYear - 1) % seasonLength) + 1;
	const season = seasons[seasonIndex] || "Unknown";

	return `${seasonDay} of ${season}, ${year} AI`;
}

// Retry loop for Lucide icons
function tryLucideIcons() {
	if (typeof lucide !== "undefined") {
		lucide.createIcons();
		console.log("[SidebarUI] Lucide icons rendered successfully!");
	} else {
		console.warn("[SidebarUI] Lucide not ready yet — retrying in 250ms...");
		setTimeout(tryLucideIcons, 250);
	}
}
