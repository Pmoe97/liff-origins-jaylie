setup.ShopSystem = {
  activeCategory: "all",

  renderBothInventories(category = "all") {
    this.activeCategory = category;
    this.renderInventory("player", category);
    this.renderInventory("shop", category);
    this.updateTabHighlight(category);
  },

  renderInventory(source, category) {
    const inventory = State.variables[`inventory_${source}`];
    const tableId = source === "shop" ? "shop-inventory-list" : "player-inventory-list";
    const tableBody = document.getElementById(tableId);

    tableBody.innerHTML = "";
    const filteredItems = this.getFilteredItems(source, category);

    filteredItems.forEach(({ id, quantity }) => {
      const item = getItemMetadata(id);
      const row = document.createElement("tr");
      row.dataset.itemId = id;
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.type}</td>
        <td>${item.weight}</td>
        <td>${item.value}</td>
        <td>x${quantity}</td>
      `;
      row.onclick = () => this.toggleSelection(source, id);
      tableBody.appendChild(row);
    });
  },

  getFilteredItems(source, category) {
    const inventory = State.variables[`inventory_${source}`] || {};
    const results = [];
    for (const id in inventory) {
      const item = getItemMetadata(id);
      if (!item) continue;
      if (category === "all" || item.type === category || item.subtype === category) {
        results.push({ id, quantity: inventory[id] });
      }
    }
    return results;
  },

  toggleSelection(source, itemId) {
    const key = `pending_${source}`;
    const pending = State.temporary[key] || (State.temporary[key] = {});
    pending[itemId] = !pending[itemId];
    this.refreshVisuals();
  },

  refreshVisuals() {
    this.renderInventory("player", this.activeCategory);
    this.renderInventory("shop", this.activeCategory);
  },

  confirmTransaction() {
    const shopInv = State.variables.inventory_shop;
    const playerInv = State.variables.inventory_player;
    const pendingShop = State.temporary.pending_shop || {};
    const pendingPlayer = State.temporary.pending_player || {};

    let playerGold = State.variables.player_gold;
    let shopGold = State.variables.shop_gold;

    // Buying from shop
    for (const id in pendingShop) {
      if (!pendingShop[id]) continue;
      const item = getItemMetadata(id);
      if (!item) continue;
      if (playerGold >= item.value) {
        shopInv[id] = (shopInv[id] || 0) - 1;
        playerInv[id] = (playerInv[id] || 0) + 1;
        playerGold -= item.value;
        shopGold += item.value;
      }
    }

    // Selling to shop
    for (const id in pendingPlayer) {
      if (!pendingPlayer[id]) continue;
      const item = getItemMetadata(id);
      if (!item) continue;
      if ((shopGold >= item.value) && (playerInv[id] > 0)) {
        shopInv[id] = (shopInv[id] || 0) + 1;
        playerInv[id] -= 1;
        playerGold += item.value;
        shopGold -= item.value;
      }
    }

    // Update gold trackers
    State.variables.player_gold = playerGold;
    State.variables.shop_gold = shopGold;
    delete State.temporary.pending_shop;
    delete State.temporary.pending_player;
    this.closeOverlay();
  },

  updateTabHighlight(category) {
    document.querySelectorAll(".inv-tab").forEach(btn => btn.classList.remove("active"));
    const btn = document.querySelector(`.inv-tab[onclick*='${category}']`);
    if (btn) btn.classList.add("active");
  },

  closeOverlay() {
    const panel = document.getElementById("overlay-panel");
    if (panel) panel.classList.add("overlay-hidden");
    // Return to conversation state here if needed
  }
};
