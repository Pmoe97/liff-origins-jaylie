setup.CrownAndCasteUI = {
    renderMinigame() {
      window.openOverlay("crown-caste-overlay");
  
      setTimeout(() => {
        this.highlightCurrentPlayer();
        this.renderCrownDice();
        this.renderPlayerPanels();
        this.renderActionPanel();
  
        if (State.variables.DEBUG || setup.DEBUG) {
          console.log("[CrownAndCasteUI] Game UI initialized.");
        }
      }, 100);
    },
  
    closeMinigame() {
      const overlay = document.getElementById("crown-caste-overlay");
      if (overlay) {
        overlay.classList.add("overlay-hidden");
      }
  
      if (State.variables.DEBUG || setup.DEBUG) {
        console.log("[CrownAndCasteUI] Minigame overlay hidden.");
      }
    },
  
    getPositionId(index) {
      const zones = ["bottom-left", "top-left", "top-right", "bottom-right"];
      return zones[index] || `unknown-${index}`;
    },
  
    highlightCurrentPlayer() {
      const session = State.temporary.ccSession;
      const currentId = this.getPositionId(session.currentPlayerIndex);
      const panels = document.querySelectorAll(".player-zone");
  
      panels.forEach(panel => {
        if (panel.id === currentId) {
          panel.classList.add("active-player");
        } else {
          panel.classList.remove("active-player");
        }
      });
    },
  
    renderCrownDice() {
      const session = State.temporary.ccSession;
      session.crownDice.forEach((val, i) => {
        const el = document.getElementById(`crown-die-${i + 1}`);
        if (el) el.textContent = val ?? "?";
      });
    },
  
    renderPlayerPanels() {
      const session = State.temporary.ccSession;
      session.players.forEach((p, i) => {
        const containerId = this.getPositionId(i);
        const el = document.getElementById(containerId);
        if (!el) return;
  
        el.querySelector(".gold-amount").textContent = p.gold;
        el.querySelector(".chip-count").textContent = p.chips;
  
        p.casteDice.forEach((val, j) => {
          const dieEl = el.querySelector(`#${containerId}-die-${j + 1}`);
          if (dieEl) dieEl.textContent = val ?? "?";
          if (p.locks[j]) {
            dieEl.classList.add("locked");
          } else {
            dieEl.classList.remove("locked");
          }
        });
      });
    },
  
    renderActionPanel() {
      const session = State.temporary.ccSession;
      const player = session.players[session.currentPlayerIndex];
  
      const titleEl = document.getElementById("action-title");
      if (titleEl) titleEl.textContent = player.name === "jaylie" ? "Your Turn" : `${player.name}'s Turn`;
  
      const isPlayer = player.isPlayer;
      const buttons = document.querySelectorAll("#action-panel button");
      buttons.forEach(btn => {
        btn.disabled = !isPlayer;
      });
  
      if (isPlayer && setup.CrownAndCasteUI?.updateActionButtons) {
        setup.CrownAndCasteUI.updateActionButtons();
      }
    },
  
    updateChipDisplay(playerIndex, chipCount, goldCount) {
      const containerId = this.getPositionId(playerIndex);
      const el = document.getElementById(containerId);
      if (el) {
        el.querySelector(".chip-count").textContent = chipCount;
        el.querySelector(".gold-amount").textContent = goldCount;
      }
    },
  
    updateCrownDisplay(index, value) {
      const el = document.getElementById(`crown-die-${index + 1}`);
      if (el) el.textContent = value;
    },
  
    updateCrownLockDisplay(index, isLocked) {
      const el = document.getElementById(`crown-die-${index + 1}`);
      if (el) {
        el.classList.toggle("locked", isLocked);
      }
    },
  
    updateLockDisplay(playerIndex, dieIndex, isLocked) {
      const containerId = this.getPositionId(playerIndex);
      const el = document.getElementById(`${containerId}-die-${dieIndex + 1}`);
      if (el) {
        el.classList.toggle("locked", isLocked);
      }
    },
  
    showGameResult(winnerIndex) {
      const winner = State.temporary.ccSession.players[winnerIndex];
      alert(`🏆 ${winner.name} wins the round!`);
      if (State.variables.DEBUG || setup.DEBUG) {
        console.log(`[CrownAndCasteUI] Round won by ${winner.name}`);
      }
    }
  };
  