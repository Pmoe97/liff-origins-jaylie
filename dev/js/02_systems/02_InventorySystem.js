
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
	all: ["Item Name", "Type", "Weight", "Value", "Amount"],
	weapons: ["Item Name", "Subtype", "Damage", "Weight", "Value", "Amount"],
	armor: ["Item Name", "Slot", "Armor Value", "Armor Class", "Weight", "Value", "Amount"],
	consumable: ["Item Name", "Consumable Type", "Affected Stats", "Stat Amounts", "Weight", "Value", "Amount"],
	quest: ["Item Name", "Subtype", "Weight", "Value", "Amount"],
	misc: ["Item Name", "Subtype", "Weight", "Value", "Amount"]
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
	if (!damage) return "";
	return Object.entries(damage).map(([type, val]) => `|${type}| ${val}`).join(" ");
};

setup.renderStatEffects = function(effects) {
	if (!effects) return "";
	return Object.entries(effects).map(([stat, val]) => `|${stat}| ${val}`).join(" ");
};

/* Macro: Add or Subtract Items from Inventory */
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
		if (setup.SidebarUI?.update) {
			setup.SidebarUI.update();
		}
	}
});


/* Drop Button Logic - Start */
function dropCustomAmount() {
	const amount = prompt("How many do you want to drop?");
	const parsed = parseInt(amount);
	if (!isNaN(parsed) && parsed > 0) {
		console.log(`🗑️ Would drop ${parsed} item(s) — placeholder logic`);
		// TODO: Hook into additem with negative value
	} else {
		alert("Invalid number.");
	}
}
/* Drop Button Logic - End */

/* Renderer: Inventory Display */
setup.renderInventory = function (target = "player", category = "all") {
	debugLog(`🧾 renderInventory() for '${target}' — Category: '${category}'`);

	const inventory = State.variables[`inventory_${target}`];
	if (!inventory) {
		console.warn(`⚠️ No inventory found for '${target}'`);
		return `<tr><td colspan="6"><em>Inventory is empty.</em></td></tr>`;
	}

	const tableBody = document.getElementById("inventory-list");
	const tableHead = document.querySelector("#inventory-table thead tr");

	if (!tableBody || !tableHead) {
		console.warn("⚠️ Table structure not found.");
		return;
	}

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

	for (const itemId in inventory) {
		const quantity = inventory[itemId];
		const item = getItemMetadata(itemId);
		if (!item) continue;

		if (category !== "all" && item.type !== category && item.subtype !== category) {
			continue;
		}

		const tr = document.createElement("tr");
		tr.classList.add("inventory-row");
		tr.dataset.itemId = item.id;

		// Row content per category
		let rowHTML = "";

		switch (category) {
			case "weapons":
				rowHTML += `<td>${item.name}</td>`;
				rowHTML += `<td>${item.subtype || ""}</td>`;
				rowHTML += `<td>${setup.renderDamageIcons(item.damage)}</td>`;
				rowHTML += `<td>${item.weight}</td>`;
				rowHTML += `<td>${item.value}</td>`;
				rowHTML += `<td>x${quantity}</td>`;
				break;

			case "armor":
				rowHTML += `<td>${item.name}</td>`;
				rowHTML += `<td>${item.slot || "—"}</td>`;
				rowHTML += `<td>${setup.renderDamageIcons(item.armor || {})}</td>`;
				rowHTML += `<td>${item.armorClass || "Unarmored"}</td>`;
				rowHTML += `<td>${item.weight}</td>`;
				rowHTML += `<td>${item.value}</td>`;
				rowHTML += `<td>x${quantity}</td>`;
				break;

			case "consumable":
				rowHTML += `<td>${item.name}</td>`;
				rowHTML += `<td>${item.subtype || ""}</td>`;
				rowHTML += `<td>${setup.renderStatEffects(item.effects)}</td>`;
				rowHTML += `<td>${setup.renderStatEffects(item.effects)}</td>`;
				rowHTML += `<td>${item.weight}</td>`;
				rowHTML += `<td>${item.value}</td>`;
				rowHTML += `<td>x${quantity}</td>`;
				break;

			default:
				rowHTML += `<td>${item.name}</td>`;
				rowHTML += `<td>${item.subtype || item.type}</td>`;
				rowHTML += `<td>${item.weight}</td>`;
				rowHTML += `<td>${item.value}</td>`;
				rowHTML += `<td>x${quantity}</td>`;
				break;
		}

		tr.innerHTML = rowHTML;
		tableBody.appendChild(tr);
		itemsShown++;
	}

	if (itemsShown === 0) {
		tableBody.innerHTML = `<tr><td colspan="${headers.length}"><em>No items in this category.</em></td></tr>`;
	}
};

/* Condensed Paperdoll Support */
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

window.setup = setup;