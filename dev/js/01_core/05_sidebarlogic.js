/* Sidebar Update Handlers */
setup.SidebarUI.update = function () {
	if (!State.variables.player || !State.variables.world) {
	  console.warn("SidebarUI: Player or World data missing.");
	  return;
	}
  
	setup.SidebarUI.updateStatuses();
	setup.SidebarUI.updateCarryWeight();
	setup.SidebarUI.updateLevelAndExp();
	setup.SidebarUI.updateGold();
	setup.SidebarUI.updateTime();
	setup.SidebarUI.updateDate();
	setup.SidebarUI.updateWeather();
	setup.SidebarUI.updateSummaryIcons();
  };
  
/* Status Bar Update Handlers */
setup.SidebarUI.updateStatuses = function () {
	const status = State.variables.player.status;
  
	const bars = [
	  { id: "health", value: status.health, max: status.maxHealth },
	  { id: "fatigue", value: status.fatigue, max: status.maxFatigue },
	  { id: "composure", value: status.composure, max: status.maxComposure },
	  { id: "excitement", value: status.excitement, max: status.maxExcitement }
	];
  
	bars.forEach(bar => {
	  const fill = document.getElementById(`${bar.id}-fill`);
	  if (fill) {
		const percent = (bar.value / bar.max) * 100;
		fill.style.width = `${percent}%`;
  
		// Color coding
		if (percent >= 70) {
		  fill.style.background = "linear-gradient(90deg, #4caf50, #81c784)"; // Green
		} else if (percent >= 30) {
		  fill.style.background = "linear-gradient(90deg, #ff9800, #ffc107)"; // Yellow
		} else {
		  fill.style.background = "linear-gradient(90deg, #f44336, #e57373)"; // Red
		}
	  }
	});
  };

  /* Carryweight Update Handler */
  setup.SidebarUI.updateCarryWeight = function () {
	const weight = State.variables.player.carryWeight;
	const carryContainer = document.getElementById("sidebar-carryweight");
	const carryFill = document.getElementById("carry-fill");
	const carryText = document.getElementById("carryweight-text");
  
	const percent = (weight.current / weight.max) * 100;
  
	if (percent >= 85) {
	  carryContainer.style.display = "block";
	  carryFill.style.width = `${percent}%`;
	  carryText.textContent = `Carryweight: ${weight.current}/${weight.max}`;
	} else {
	  carryContainer.style.display = "none";
	}
  };
  
  /* Level and Experience Update Handler */
  setup.SidebarUI.updateLevelAndExp = function () {
	const player = State.variables.player;
  
	const expPercent = (player.experience / player.experienceToNextLevel) * 100;
	const expFill = document.getElementById("exp-fill");
	const expText = document.getElementById("exp-text");
	const levelText = document.getElementById("sidebar-level");
  
	if (expFill) expFill.style.width = `${expPercent}%`;
	if (expText) expText.textContent = `${player.experience}/${player.experienceToNextLevel} XP`;
	if (levelText) levelText.textContent = `Lvl ${player.level}`;
  
	// Update mini version for collapsed mode
	const miniFill = document.getElementById("exp-fill-mini");
	const miniLevel = document.getElementById("summary-level");
	if (miniFill) miniFill.style.width = `${expPercent}%`;
	if (miniLevel) miniLevel.textContent = `Lvl ${player.level}`;
  };
  
  /* Time Update Handler */
  setup.SidebarUI.updateTime = function () {
	const world = State.variables.world;
	if (!world) return;
  
	const hours = world.hour;
	const minutes = world.minute.toString().padStart(2, "0");
	let timeString = "";
  
	if (world.is24HourFormat) {
	  timeString = `${hours}:${minutes}`;
	} else {
	  const suffix = hours >= 12 ? "PM" : "AM";
	  const hour12 = ((hours + 11) % 12 + 1);
	  timeString = `${hour12}:${minutes} ${suffix}`;
	}
  
	const timeDisplay = document.getElementById("sidebar-time");
	const timeSummary = document.getElementById("summary-time");
  
	if (timeDisplay) timeDisplay.textContent = timeString;
	if (timeSummary) timeSummary.textContent = timeString;
  };
  /* Date Update Handler */
  setup.SidebarUI.updateDate = function () {
	const world = State.variables.world;
	if (!world) return;
  
	const seasons = ["Rain", "Sun", "Harvest", "Snow"];
	const seasonIndex = Math.floor((world.dayOfYear - 1) / 100);
	const seasonDay = ((world.dayOfYear - 1) % 100) + 1;
	const seasonName = seasons[seasonIndex] || "Unknown";
  
	const dateString = `${seasonDay} of ${seasonName}, ${world.year} AI`;
  
	const dateDisplay = document.getElementById("sidebar-date");
	if (dateDisplay) dateDisplay.textContent = dateString;
  };
  
  /* Weather Icon Update Handler */
  setup.SidebarUI.updateWeather = function () {
	const world = State.variables.world;
	const icon = document.getElementById("sidebar-weather-icon");
  
	if (!icon) return;
  
	const weatherIcons = {
	  "Clear": "sun",
	  "Rain": "cloud-rain",
	  "Storm": "cloud-lightning",
	  "Snow": "snowflake",
	  "Fog": "cloud-fog"
	};
  
	const weatherName = world.weather || "Clear";
	const iconName = weatherIcons[weatherName] || "sun";
  
	icon.setAttribute("data-lucide", iconName);
	icon.setAttribute("title", weatherName);
  
	if (window.lucide) {
	  lucide.createIcons();
	}
  };
  
/* Summary Icon Color Update (Summary View) Handler */
setup.SidebarUI.updateSummaryIcons = function () {
	const status = State.variables.player.status;
  
	const icons = [
	  { id: "summary-health", value: status.health, max: status.maxHealth },
	  { id: "summary-fatigue", value: status.fatigue, max: status.maxFatigue },
	  { id: "summary-composure", value: status.composure, max: status.maxComposure },
	  { id: "summary-excitement", value: status.excitement, max: status.maxExcitement }
	];
  
	icons.forEach(icon => {
	  const element = document.getElementById(icon.id);
	  if (element) {
		const percent = (icon.value / icon.max) * 100;
		if (percent >= 70) {
		  element.style.color = "#4caf50"; // Green
		} else if (percent >= 30) {
		  element.style.color = "#ffc107"; // Yellow
		} else {
		  element.style.color = "#f44336"; // Red
		}
	  }
	});
  };
  
  /* Gold Update Handler */
  setup.SidebarUI.getGoldAmount = function () {
	const inventory = State.variables.inventory_player;
	if (!inventory) return 0;
  
	return inventory["gold_coin"] || 0;
  };
  
  setup.SidebarUI.updateGold = function () {
	const gold = setup.SidebarUI.getGoldAmount();
	const goldDisplay = document.getElementById("sidebar-gold-amount");
	const goldSummary = document.getElementById("summary-gold");
  
	const formattedGold = gold >= 1000 ? (gold / 1000).toFixed(1) + "K" : gold;
  
	if (goldDisplay) goldDisplay.textContent = formattedGold;
	if (goldSummary) goldSummary.textContent = formattedGold;
  };
  
  $(document).on(":storyready", () => {
	const btn = document.getElementById("btn-saves");
	if (btn) {
		btn.addEventListener("click", () => {
			console.log("[DEBUG] Save button clicked.");
			if (typeof Dialog === "undefined") {
				console.error("[ERROR] Dialog object is not defined.");
			} else {
				console.log("[DEBUG] Dialog.open available:", typeof Dialog.open);
				Dialog.open("saves");
			}
		});
		if (window.lucide) lucide.createIcons();
	}

	// Ensure UI system is initialized only after DOM is ready
	if (typeof UI !== "undefined" && typeof UI.init === "function") {
		console.log("[DEBUG] Calling UI.init()");
		UI.init();
	} else {
		console.error("[ERROR] UI.init is not available.");
	}
});



