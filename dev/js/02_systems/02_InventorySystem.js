/* Utility: Find item metadata from unified pool */
function getItemMetadata(id) {
	debugLog(`📦 getItemMetadata() called with id: '${id}'`);

	if (!setup.ItemData) {
		console.error("❌ setup.ItemData is undefined!");
		return null;
	}

	const item = setup.ItemData[id];
	if (!item) {
		console.warn(`⚠️ Item '${id}' NOT found in setup.ItemData.`);
		return null;
	}

	debugLog(`✅ Item '${id}' found in setup.ItemData:`, item);
	return item;
}
window.getItemMetadata = getItemMetadata;

/* Inventory Column Templates */
setup.inventoryHeaders = {
	all: ["Item", "Type", "Weight", "Value", "Qty"],  // Shortened headers for mobile
	weapons: ["Item", "Type", "Damage", "Weight", "Value", "Qty"],
	armor: ["Item", "Slot", "Defense", "Weight", "Value", "Qty"],
	consumable: ["Item", "Type", "Effects", "Weight", "Value", "Qty"],
	quest: ["Item", "Type", "Weight", "Value", "Qty"],
	misc: ["Item", "Type", "Weight", "Value", "Qty"],
	literature: ["Item", "Type", "Weight", "Value", "Qty"]
};

/* Highlight Active Inventory Tab */
setup.selectInventoryTab = function(category) {
	document.querySelectorAll(".inv-tab").forEach(btn => btn.classList.remove("active"));
	const active = document.querySelector(`.inv-tab[data-tab="${category}"]`);
	if (active) active.classList.add("active");

	setup.renderInventory("player", category);
};

/* Format Helpers */
setup.renderDamageIcons = function(damage) {
	if (!damage) return "—";
	return Object.entries(damage)
		.map(([type, val]) => `<span class="damage-type damage-${type}" title="${type}">${val}</span>`)
		.join(" ");
};

setup.renderStatEffects = function(stats) {
	if (!stats) return "—";
	return Object.entries(stats)
		.map(([stat, val]) => `<span class="stat-effect stat-${stat}" title="${stat}">${val > 0 ? '+' : ''}${val}</span>`)
		.join(" ");
};

/* Macro: Add or Subtract Items from Inventory */
/* Structure: <<additem "target" "itemId" amount>> */
/* Example usage: <<additem "player" "gold_coin" 100>> */
Macro.add("additem", {
	handler() {
		console.log("🔥 [additem] macro invoked — args:", this.args);

		const [target, itemId, amountRaw] = this.args;
		const amount = parseInt(amountRaw);

		if (!target || !itemId || isNaN(amount)) {
			console.warn("⚠️ [additem] called with invalid or missing arguments:", this.args);
			console.warn("⚠️ Expected usage: additem 'target' 'itemId' amount — skipping execution.");
			return;
		}

		const itemData = getItemMetadata(itemId);
		if (!itemData) {
			console.warn(`⚠️ Item '${itemId}' not found in metadata — cannot add to inventory.`);
			return;
		}

		const varName = `inventory_${target}`;
		if (!State.variables[varName]) {
			debugLog(`📦 No inventory found for '${target}' — creating new one`);
			State.variables[varName] = {};
		}

		const inventory = State.variables[varName];

		if (!inventory[itemId]) {
			inventory[itemId] = 0;
			debugLog(`📦 Initializing '${itemId}' to 0 in '${target}' inventory`);
		}

		inventory[itemId] += amount;
		debugLog(`➕ '${itemId}' in '${target}' inventory is now: ${inventory[itemId]}`);

		if (inventory[itemId] <= 0) {
			debugLog(`🗑️ '${itemId}' count zero or below — removing from inventory`);
			delete inventory[itemId];
		}

		/* === Sidebar update on run === */
		if (setup.SidebarUI?.update && document.getElementById("custom-sidebar")) {
			setup.SidebarUI.update();
		}

	}
});


/* Drop Button Logic - Start */
function dropItem(itemId, amount) {
	const inventory = State.variables.inventory_player;
	const currentAmount = inventory[itemId] || 0;
	
	if (amount === "all") {
		amount = currentAmount;
	} else if (amount === "custom") {
		const input = prompt(`How many do you want to drop? (Max: ${currentAmount})`);
		amount = parseInt(input);
		if (isNaN(amount) || amount <= 0 || amount > currentAmount) {
			alert("Invalid amount.");
			return;
		}
	}
	
	// Use the additem macro with negative amount
	$(document).wiki(`<<additem "player" "${itemId}" -${amount}>>`);
	
	// Refresh the inventory display
	setup.renderInventory("player", State.temporary.currentInventoryTab || "all");
	
	// Update carry weight
	setup.updatePlayerCarryWeight();
	
	// Clear selection if item was removed
	if (!State.variables.inventory_player[itemId]) {
		setup.clearInventorySelection();
	}
}
window.dropItem = dropItem;

/* Equip Item Function */
setup.equipItem = function(itemId, slot) {
	const item = getItemMetadata(itemId);
	if (!item) return;
	
	const equipped = State.variables.equipped || {};
	const inventory = State.variables.inventory_player;
	
	// Determine appropriate slot if not specified
	if (!slot) {
		if (item.type === "weapon") {
			slot = "main";
		} else if (item.type === "armor") {
			slot = item.slot || item.subtype;
		} else {
			console.warn("Cannot equip item type:", item.type);
			return;
		}
	}
	
	// Unequip current item in slot
	if (equipped[slot]) {
		const unequippedId = equipped[slot].id;
		$(document).wiki(`<<additem "player" "${unequippedId}" 1>>`);
	}
	
	// Equip new item
	equipped[slot] = {
		id: item.id,
		name: item.name,
		type: item.type
	};
	
	// Remove from inventory
	$(document).wiki(`<<additem "player" "${itemId}" -1>>`);
	
	State.variables.equipped = equipped;
	
	// Update displays
	setup.renderInventory("player", State.temporary.currentInventoryTab || "all");
};

/* Clear inventory selection */
setup.clearInventorySelection = function() {
	$(".inventory-row").removeClass("selected");
	$("#inventory-item-image").attr("src", "images/items/default.png");
	$("#inventory-item-name").text("Select an item");
	$("#inventory-item-description").text("[Select an item to view details]");
	$("#inventory-item-meta").text("");
	$(".inventory-buttons button").prop("disabled", true);
};

/* Renderer: Inventory Display */
setup.renderInventory = function (target = "player", category = "all") {
	debugLog(`🧾 renderInventory() for '${target}' — Category: '${category}'`);
	
	// Store current category
	State.temporary.currentInventoryTab = category;

	const inventory = State.variables[`inventory_${target}`];
	if (!inventory) {
		console.warn(`⚠️ No inventory found for '${target}'`);
		return;
	}

	const tableBody = document.getElementById("inventory-list");
	const tableHead = document.querySelector("#inventory-table thead tr");

	if (!tableBody || !tableHead) {
		console.warn("⚠️ Table structure not found.");
		return;
	}

	// Update active tab
	document.querySelectorAll(".inv-tab").forEach(btn => {
		btn.classList.toggle("active", btn.dataset.tab === category);
	});

	// Reset table head
	tableHead.innerHTML = "";
	const headers = setup.inventoryHeaders[category] || setup.inventoryHeaders["all"];
	headers.forEach(h => {
		const th = document.createElement("th");
		th.textContent = h;
		tableHead.appendChild(th);
	});

	// Reset body
	tableBody.innerHTML = "";
	let itemsShown = 0;

	// Sort items by name for consistent display
	const sortedItems = Object.keys(inventory).sort((a, b) => {
		const itemA = getItemMetadata(a);
		const itemB = getItemMetadata(b);
		return (itemA?.name || a).localeCompare(itemB?.name || b);
	});

	for (const itemId of sortedItems) {
		const quantity = inventory[itemId];
		const item = getItemMetadata(itemId);
		if (!item) continue;

		// Handle category filtering with singular/plural matching
		if (category !== "all") {
			let itemMatchesCategory = false;
			
			// Check for exact match first
			if (item.type === category) {
				itemMatchesCategory = true;
			}
			// Handle singular/plural cases
			else if (category === "weapons" && item.type === "weapon") {
				itemMatchesCategory = true;
			}
			else if (category === "armor" && item.type === "armor") {
				itemMatchesCategory = true;
			}
			else if (category === "consumable" && item.type === "consumable") {
				itemMatchesCategory = true;
			}
			else if (category === "literature" && item.type === "literature") {
				itemMatchesCategory = true;
			}
			else if (category === "quest" && item.type === "quest") {
				itemMatchesCategory = true;
			}
			else if (category === "misc" && item.type === "misc") {
				itemMatchesCategory = true;
			}
			
			if (!itemMatchesCategory) continue;
		}

		const tr = document.createElement("tr");
		tr.classList.add("inventory-row");
		tr.dataset.itemId = item.id;

		// Row content per category
		let cells = [];

		switch (category) {
			case "weapons":
				cells = [
					item.name,
					item.subtype || "—",
					setup.renderDamageIcons(item.damage),
					item.weight || 0,
					item.value || 0,
					`×${quantity}`
				];
				break;

			case "armor":
				cells = [
					item.name,
					item.slot || item.subtype || "—",
					setup.renderDamageIcons(item.resist || item.armor),
					item.weight || 0,
					item.value || 0,
					`×${quantity}`
				];
				break;

			case "consumable":
				cells = [
					item.name,
					item.subtype || "—",
					setup.renderStatEffects(item.stats || item.effects),
					item.weight || 0,
					item.value || 0,
					`×${quantity}`
				];
				break;

			default:
				cells = [
					item.name,
					item.subtype || item.type,
					item.weight || 0,
					item.value || 0,
					`×${quantity}`
				];
				break;
		}

		cells.forEach(content => {
			const td = document.createElement("td");
			td.innerHTML = content;
			tr.appendChild(td);
		});

		tableBody.appendChild(tr);
		itemsShown++;
	}

	if (itemsShown === 0) {
		tableBody.innerHTML = `<tr><td colspan="${headers.length}" class="empty-message"><em>No items in this category.</em></td></tr>`;
	}

	// Update weight display
	setup.updateWeightDisplay();
};

/* Update weight display */
setup.updateWeightDisplay = function() {
	const current = setup.calculateInventoryWeight("player");
	const max = setup.calculateMaxCarryWeight();
	const percent = (current / max) * 100;
	
	const weightText = document.getElementById("weight-text");
	const weightBar = document.getElementById("weight-bar-fill");
	
	if (weightText) {
		weightText.textContent = `${current.toFixed(1)} / ${max} kg`;
	}
	
	if (weightBar) {
		weightBar.style.width = `${Math.min(percent, 100)}%`;
		weightBar.classList.toggle("overweight", percent > 100);
		weightBar.classList.toggle("heavy", percent > 75 && percent <= 100);
	}
};

setup.updateCondensedPaperdoll = function () {
  const equipped = State.variables.equipped || {};

  const slotMap = [
    "head", "face", "neck", "back", "chest", "main", "sec",
    "pants", "feet", "ring1", "ring2", "ring3"
  ];

  // Standard slots
  slotMap.forEach(slot => {
    const el = document.getElementById(`slot-${slot}-text`);
    if (el) {
      const item = equipped[slot];
      el.textContent = item ? item.name || item.id : "Empty";
    }
  });

  // Special case: gloves (shared)
  const glovesEl = document.getElementById(`slot-gloves-text`);
  if (glovesEl) {
    const gloveItem = equipped["gloves"];
    glovesEl.textContent = gloveItem ? gloveItem.name || gloveItem.id : "Empty";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (setup.updateCondensedPaperdoll) setup.updateCondensedPaperdoll();
});

setup.showInventoryItemDetails = function (itemId) {
	const item = getItemMetadata(itemId);
	if (!item) {
		console.warn(`[InventoryUI] No metadata for item: ${itemId}`);
		return;
	}

	// Set image
	const image = document.getElementById("inventory-item-image");
	if (image) {
		image.src = item.img ? `images/items/${item.img}` : "images/items/default.png";
		image.alt = item.name || "Unknown Item";
	}

	// Set name
	document.getElementById("inventory-item-name").textContent = item.name || "Unknown Item";

	// Set description
	document.getElementById("inventory-item-description").textContent =
		item.description || "[No description available]";

	// Set stats/details
	const metaEl = document.getElementById("inventory-item-meta");
	let metaHTML = [];
	
	if (item.damage) {
		metaHTML.push(`<div class="item-stat">Damage: ${setup.renderDamageIcons(item.damage)}</div>`);
	}
	if (item.resist || item.armor) {
		metaHTML.push(`<div class="item-stat">Defense: ${setup.renderDamageIcons(item.resist || item.armor)}</div>`);
	}
	if (item.stats || item.effects) {
		metaHTML.push(`<div class="item-stat">Effects: ${setup.renderStatEffects(item.stats || item.effects)}</div>`);
	}
	if (item.material) {
		metaHTML.push(`<div class="item-stat">Material: ${item.material}</div>`);
	}
	if (item.tags && item.tags.length) {
		const tagStr = item.tags.filter(t => t !== "devOnly").join(", ");
		if (tagStr) metaHTML.push(`<div class="item-stat">Properties: ${tagStr}</div>`);
	}
	
	metaEl.innerHTML = metaHTML.join("");

	// Enable/disable buttons based on item type
	const buttons = document.querySelectorAll(".inventory-buttons button");
	buttons.forEach(btn => btn.disabled = false);
	
	// Update button visibility based on item type
	const equipBtn = document.getElementById("btn-equip");
	const equipPrimaryBtn = document.getElementById("btn-equip-primary");
	const equipSecondaryBtn = document.getElementById("btn-equip-secondary");
	const useBtn = document.getElementById("btn-use");
	const readBtn = document.getElementById("btn-read");
	
	// Hide all special buttons first
	[equipBtn, equipPrimaryBtn, equipSecondaryBtn, useBtn, readBtn].forEach(btn => {
		if (btn) btn.style.display = "none";
	});
	
	// Show relevant buttons based on item type
	if (item.type === "weapon") {
		if (equipPrimaryBtn) equipPrimaryBtn.style.display = "block";
		if (equipSecondaryBtn) equipSecondaryBtn.style.display = "block";
	} else if (item.type === "armor") {
		if (equipBtn) equipBtn.style.display = "block";
	} else if (item.type === "consumable") {
		if (useBtn) useBtn.style.display = "block";
	} else if (item.type === "literature") {
		if (readBtn) readBtn.style.display = "block";
	}
	
	// Store current item for button actions
	State.temporary.selectedInventoryItem = itemId;
};

$(document).on("click", ".inventory-row", function () {
	const itemId = this.dataset.itemId;
	if (!itemId) return;

	$(".inventory-row").removeClass("selected");
	$(this).addClass("selected");

	if (typeof setup.showInventoryItemDetails === "function") {
		setup.showInventoryItemDetails(itemId);
	}
});

/* =============================== */
/* Carryweight Logic Implemenation */
/* =============================== */
setup.calculateMaxCarryWeight = function () {
	const strength = State.variables.player?.attributes?.strength || 1;
	return 30 + (strength * 5); // 30 base + 5 per Strength point
};

setup.calculateInventoryWeight = function (target = "player") {
	const inventory = State.variables[`inventory_${target}`];
	if (!inventory) return 0;

	let totalWeight = 0;

	for (const itemId in inventory) {
		const item = getItemMetadata(itemId);
		const amount = inventory[itemId];

		if (item?.weight) {
			totalWeight += item.weight * amount;
		}
	}

	return totalWeight;
};

setup.updatePlayerCarryWeight = function () {
	const player = State.variables.player;
	if (!player) return;

	const currentWeight = setup.calculateInventoryWeight("player");
	const maxWeight = setup.calculateMaxCarryWeight();

	player.carryWeight = {
		current: currentWeight,
		max: maxWeight
	};
};

window.setup = setup;