setup.CrownAndCasteUI = {
  chipMode: false,
  
  renderMinigame() {
    window.openOverlay("crown-and-caste-page");

    setTimeout(() => {
      this.initializeEventListeners();
      this.initializeOrientationDetection();
      this.highlightCurrentPlayer();
      this.renderCrownDice();
      this.renderPot();
      this.renderPlayerPanels();
      this.updateGameStatus();
      this.updateInteractionStates();

      if (State.variables.DEBUG || setup.DEBUG) {
        console.log("[CrownAndCasteUI] Game UI initialized.");
      }
    }, 100);
  },

  closeMinigame() {
    const overlay = document.getElementById("crown-and-caste-page");
    if (overlay) {
      overlay.classList.add("overlay-hidden");
    }

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log("[CrownAndCasteUI] Minigame overlay hidden.");
    }
  },

  initializeEventListeners() {
    // Dice click handlers
    document.querySelectorAll('.clickable-die').forEach(die => {
      die.addEventListener('click', (e) => this.handleDieClick(e));
    });

    // Chip click handlers
    document.querySelectorAll('.clickable-chips').forEach(chips => {
      chips.addEventListener('click', (e) => this.handleChipClick(e));
    });

    // Individual Crown Die click handlers (for rerolling via chip)
    document.querySelectorAll('.clickable-crown-die').forEach(el => {
      el.addEventListener('click', (e) => this.handleCrownDieClick(e));
    });

    // ✅ Backup: click on crown circle triggers protect crown (unless a die was clicked)
    const crownCircle = document.getElementById('center-circle');
    if (crownCircle) {
      crownCircle.addEventListener('click', (e) => {
        // Skip if the click originated inside a clickable die
        if (e.target.closest('.clickable-crown-die')) return;

        this.handleCrownClick(e);
      });
    }

    // Betting button handlers
    document.querySelectorAll('.bet-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleBetClick(e));
    });

    // End Turn button
    const endTurn = document.getElementById('end-turn-btn');
    if (endTurn) {
      endTurn.addEventListener('click', () => {
        setup.CrownAndCaste.endTurn();
        setup.CrownAndCasteUI.updateGameStatus();
        setup.CrownAndCasteUI.updateInteractionStates();
      });
    }

    // Next Game button handler
    const nextGameBtn = document.getElementById('next-game-btn');
    if (nextGameBtn) {
      nextGameBtn.addEventListener('click', () => {
        setup.CrownAndCasteUI.hideGameResult(); // ⬅ ensure result panel hides
        setup.CrownAndCaste.startNextGame();     // ⬅ resets state and rolls
        setup.CrownAndCasteUI.updateGameStatus();
        setup.CrownAndCasteUI.updateInteractionStates();
        setup.CrownAndCasteUI.renderPlayerPanels();
        setup.CrownAndCasteUI.renderCrownDice();
        setup.CrownAndCasteUI.renderPot();
      });
    }

    // End Game button handler
    const endGameBtn = document.getElementById("end-game-btn");
    if (endGameBtn) {
      endGameBtn.addEventListener("click", () => {
        setup.CrownAndCasteUI.cleanupTable();
        Engine.play("ReturnToFair"); // <- Or whatever passage you use
      });
    }
  },


  cleanupTable() {
    const frame = document.getElementById("crown-caste-frame");
    if (frame) frame.remove();

    // Reset session state
    delete State.temporary.ccSession;
    delete State.temporary.ccBuyIn;
    delete State.temporary.ccStakes;
    delete State.temporary.ccHouseRules;

    console.log("[CrownAndCasteUI] Crown & Caste session ended.");
  },


  handleDieClick(event) {
    const die = event.target;
    const playerIndex = parseInt(die.dataset.player);
    const dieIndex = parseInt(die.dataset.die);
    const session = State.temporary.ccSession;
    const currentPlayer = session.players[session.currentPlayerIndex];

    // Don't allow dice interaction during betting phase
    if (session.turnPhase === "betting") {
      this.showFeedback("Cannot interact with dice during betting phase!");
      return;
    }

    // Only allow interaction if it's the player's turn
    if (!currentPlayer.isPlayer) {
      this.showFeedback("Not your turn!");
      return;
    }

    if (this.chipMode) {
      // Control chip mode - reroll locked dice
      this.handleChipDieReroll(playerIndex, dieIndex);
    } else if (playerIndex === 0) {
      // Normal mode - player's own dice
      this.handlePlayerDieAction(dieIndex);
    } else {
      this.showFeedback("You can only interact with your own dice!");
    }
  },

  handlePlayerDieAction(dieIndex) {
    const session = State.temporary.ccSession;
    const player = session.players[0]; // Player is always index 0

    if (player.casteDice[dieIndex] === null) {
      // Roll unlocked die
      setup.CrownAndCaste.rollCasteDice(0);
      this.showFeedback("Dice rolled!");
    } else {
      // Toggle lock
      setup.CrownAndCaste.lockDie(0, dieIndex);
      const isLocked = player.locks[dieIndex];
      this.showFeedback(isLocked ? "Die locked!" : "Die unlocked!");
    }
    
    this.updateInteractionStates();
  },

  handleChipDieReroll(playerIndex, dieIndex) {
    const session = State.temporary.ccSession;
    const targetPlayer = session.players[playerIndex];

    if (!targetPlayer.locks[dieIndex]) {
      this.showFeedback("Can only reroll locked dice!");
      return;
    }

    if (playerIndex === 0) {
      // Reroll own locked die
      setup.CrownAndCaste.useControlChip(0, "reroll-own", dieIndex);
      this.showFeedback("Rerolled your locked die!");
    } else {
      // Reroll specific locked die of another player
      setup.CrownAndCaste.useControlChip(0, "reroll-other", {
        targetPlayerIndex: playerIndex,
        dieIndex: dieIndex
      });
      this.showFeedback(`Rerolled ${targetPlayer.name}'s locked die!`);
    }

    this.chipMode = false;
    this.updateInteractionStates();
  },

  handleChipClick(event) {
    const chipDisplay = event.target.closest('.chip-display');
    const playerIndex = parseInt(chipDisplay.closest('.player-zone').dataset.playerIndex);
    const session = State.temporary.ccSession;

    // Don't allow chip usage during betting phase
    if (session.turnPhase === "betting") {
      this.showFeedback("Cannot use chips during betting phase!");
      return;
    }

    // Only allow player to use their own chips
    if (playerIndex !== 0) {
      this.showFeedback("You can only use your own Control Chips!");
      return;
    }

    if (!setup.CrownAndCaste.canUseControlChip(0)) {
      this.showFeedback("Cannot use Control Chip right now!");
      return;
    }

    // Toggle chip mode
    this.chipMode = !this.chipMode;
    this.updateInteractionStates();
    
    if (this.chipMode) {
      this.showFeedback("Control Chip activated! Click dice to reroll or crown to protect.");
    } else {
      this.showFeedback("Control Chip mode deactivated.");
    }
  },

  handleCrownDieClick(event) {
    const session = State.temporary.ccSession;

    const dieEl = event.currentTarget; // ✅ Always use currentTarget
    const dieIndex = parseInt(dieEl.dataset.index, 10);

    if (isNaN(dieIndex) || dieIndex < 0 || dieIndex > 2) {
      console.warn("[CrownAndCasteUI] Invalid crown die index clicked.");
      return;
    }

    if (!this.chipMode) {
      this.showFeedback("Activate Control Chip mode first!");
      return;
    }

    setup.CrownAndCaste.useControlChip(0, "reroll-crown", dieIndex);
    this.showFeedback(`Rerolled Crown Die ${dieIndex + 1}`);
    this.chipMode = false;
    this.updateInteractionStates();
  },

  handleCrownClick(event) {
    const session = State.temporary.ccSession;

    // Don't allow crown interaction during betting phase
    if (session.turnPhase === "betting") {
      this.showFeedback("Cannot interact with crown during betting phase!");
      return;
    }

    if (!this.chipMode) {
      this.showFeedback("Activate Control Chip mode first!");
      return;
    }

    // Use chip to protect crown
    setup.CrownAndCaste.useControlChip(0, "lock-crown");
    this.showFeedback("Crown protected!");
    this.chipMode = false;
    this.updateInteractionStates();
  },

  handleBetClick(event) {
    const amount = parseInt(event.target.dataset.amount);
    const success = setup.CrownAndCaste.placeBet(0, amount);
    
    if (success) {
      this.showFeedback(`Bet placed: ${amount}g`);
      
      // Process all NPC bets automatically after a short delay
      setTimeout(() => {
        setup.CrownAndCaste.processAllNPCBets();
        this.updateGameStatus();
        this.renderPlayerPanels();
        this.renderPot();
        this.updateInteractionStates();
      }, 500);
    } else {
      this.showFeedback("Cannot place that bet!");
    }
  },

  updateInteractionStates() {
    const session = State.temporary.ccSession;
    const currentPlayer = session.players[session.currentPlayerIndex];
    const isPlayerTurn = currentPlayer.isPlayer;
    const isBettingPhase = session.turnPhase === "betting";

    // Disable specific game interactions during betting, but NOT the betting panel
    const gameElements = document.querySelectorAll('.clickable-die, .chip-button, .crown-die');
    gameElements.forEach(el => {
      el.classList.toggle('disabled-during-betting', isBettingPhase);
    });

    // Update chip mode visual state
    document.querySelectorAll('.chip-display').forEach(display => {
      display.classList.toggle('active', this.chipMode);
    });

    // Update crown circle state
    const crownCircle = document.getElementById('center-circle');
    if (crownCircle) {
      crownCircle.classList.toggle('chip-mode', this.chipMode);
    }

    // Update dice interaction states
    document.querySelectorAll('.clickable-die').forEach(die => {
      const playerIndex = parseInt(die.dataset.player);
      const dieIndex = parseInt(die.dataset.die);
      const player = session.players[playerIndex];

      die.classList.remove('can-roll', 'can-lock', 'chip-target');

      // Skip if not player's turn or during betting
      if (isBettingPhase || !isPlayerTurn) return;

      if (this.chipMode) {
        if (player.locks[dieIndex]) {
          die.classList.add('chip-target');
        }
      } else if (playerIndex === 0) {
        if (player.casteDice[dieIndex] === null) {
          die.classList.add('can-roll');
        } else {
          die.classList.add('can-lock');
        }
      }
    });

    // Show betting panel only during betting phase and player's turn
    const bettingPanel = document.getElementById('betting-panel');
    if (bettingPanel) {
      const showBetting = isBettingPhase && isPlayerTurn;
      bettingPanel.style.display = showBetting ? 'block' : 'none';
    }

    // Show or hide End Turn button
    const endTurnPanel = document.getElementById('player-actions');
    if (endTurnPanel) {
      const showEndTurn = isPlayerTurn && !isBettingPhase && !session.gameComplete;
      endTurnPanel.style.display = showEndTurn ? 'block' : 'none';
    }

    // Show or hide Next Game button
    const nextGamePanel = document.getElementById('next-game-panel');
    if (nextGamePanel) {
      const showNextGame = session.gameComplete;
      nextGamePanel.style.display = showNextGame ? 'block' : 'none';
    }

    // Update crown protected indicator
    const protectedIndicator = document.getElementById('crown-protected');
    if (protectedIndicator) {
      protectedIndicator.style.display = session.crownProtected ? 'block' : 'none';
    }
  },


  updateGameStatus() {
    const session = State.temporary.ccSession;
    const currentPlayer = session.players[session.currentPlayerIndex];

    const turnEl = document.getElementById('current-turn');
    const roundEl = document.getElementById('current-round');
    const phaseEl = document.getElementById('game-phase');

    if (turnEl) {
      turnEl.textContent = currentPlayer.isPlayer ? "Your Turn" : `${currentPlayer.name}'s Turn`;
    }

    if (roundEl) {
      roundEl.textContent = `Round ${session.currentRound}`;
    }

    if (phaseEl) {
      const phaseText = session.turnPhase === "betting" ? "Betting Phase" : 
                       session.turnPhase === "rolling" ? "Rolling Phase" : 
                       "Game Phase";
      phaseEl.textContent = phaseText;
    }

    // Trigger NPC actions if it's an NPC's turn
    if (!currentPlayer.isPlayer && !currentPlayer.isEliminated) {
      this.scheduleNPCAction(session.currentPlayerIndex);
    }
  },

  scheduleNPCAction(playerIndex) {
    // Add a delay to make NPC actions feel more natural
    setTimeout(() => {
      if (setup.CrownAndCaste.processNPCTurn) {
        setup.CrownAndCaste.processNPCTurn(playerIndex);
        
        // Update UI after NPC action
        setTimeout(() => {
          this.renderPlayerPanels();
          this.renderCrownDice();
          this.renderPot();
          this.highlightCurrentPlayer();
          this.updateInteractionStates();
        }, 500);
      }
    }, 1000 + Math.random() * 1500); // 1-2.5 second delay for realism
  },

  showFeedback(message) {
    const feedback = document.getElementById('action-feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.classList.add('show');
      
      setTimeout(() => {
        feedback.classList.remove('show');
      }, 2000);
    }
  },

  highlightCurrentPlayer() {
    const session = State.temporary.ccSession;
    const currentId = this.getPositionId(session.currentPlayerIndex);
    const panels = document.querySelectorAll(".player-zone");

    panels.forEach(panel => {
      panel.classList.remove("active-player", "current-turn");
      if (panel.id === currentId) {
        panel.classList.add("active-player", "current-turn");
      }
    });
  },

  getPositionId(index) {
    switch (index) {
      case 0: return "bottom-center"; // Player
      case 1: return "middle-left";   // NPC 1
      case 2: return "top-center";    // NPC 2
      case 3: return "middle-right";  // NPC 3
      default: return `unknown-${index}`;
    }
  },

  renderCrownDice() {
    const session = State.temporary.ccSession;
    session.crownDice.forEach((val, i) => {
      const el = document.getElementById(`crown-die-${i + 1}`);
      if (el) {
        el.textContent = val ?? "?";
        el.classList.toggle("locked", session.crownLocks[i]);
      }
    });
  },

  renderPot() {
    const session = State.temporary.ccSession;
    const potDisplay = document.getElementById("crown-pot");
    if (potDisplay) {
      potDisplay.textContent = `Pot: ${session.pot}g`;
    }
  },

  renderPlayerPanels() {
    const session = State.temporary.ccSession;

    session.players.forEach((p, i) => {
      const containerId = this.getPositionId(i);
      const el = document.getElementById(containerId);
      if (!el) return;

      const goldEl = el.querySelector(".gold-amount");
      const chipEl = el.querySelector(".chip-count");
      const nameEl = el.querySelector(".player-name");

      if (goldEl) goldEl.textContent = p.gold;
      if (chipEl) chipEl.textContent = p.chips;
      if (nameEl) {
        const baseName = p.name || `Player ${i + 1}`;
        const isDealer = i === session.dealerIndex;

        nameEl.innerHTML = isDealer
          ? `<i class="lucide crown-icon" data-lucide="crown"></i> ${baseName}`
          : baseName;
      }

      p.casteDice.forEach((val, j) => {
        const dieEl = el.querySelector(`#${containerId}-die-${j + 1}`);
        if (dieEl) {
          dieEl.textContent = val ?? "?";
          dieEl.classList.toggle("locked", p.locks[j]);
        }
      });
    });
    if (window.lucide) lucide.createIcons();
  },

  updateChipDisplay(playerIndex, chipCount, goldCount) {
    const containerId = this.getPositionId(playerIndex);
    const el = document.getElementById(containerId);
    if (el) {
      const chipEl = el.querySelector(".chip-count");
      const goldEl = el.querySelector(".gold-amount");
      if (chipEl) chipEl.textContent = chipCount;
      if (goldEl) goldEl.textContent = goldCount;
    }
    this.updateInteractionStates();
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
    this.updateInteractionStates();
  },

  updateDiceDisplay(playerIndex) {
    this.renderPlayerPanels();
    this.updateInteractionStates();
  },

  showGameResult(winnerIndex) {
    const session = State.temporary.ccSession;
    const winner = session.players[winnerIndex];

    const resultMessage = `${winner.name} wins the game and takes ${session.pot}g!`;
    setup.CrownAndCasteUI.showFeedback(resultMessage);

    const nextPanel = document.getElementById("next-game-panel");
    const endPanel = document.getElementById("end-game-panel");
    const player = session.players.find(p => p.isPlayer);

    const otherActive = session.players.filter(p => !p.isPlayer && !p.isEliminated && p.gold > 0).length;
    const playerHasGold = player && player.gold > 0;

    const shouldEnd =
      !playerHasGold || // You're broke
      otherActive === 0; // You're alone

    if (shouldEnd && endPanel) {
      endPanel.style.display = "block";
    } else if (!shouldEnd && nextPanel) {
      nextPanel.style.display = "block";
    }

    // 💡 Freeze interaction visuals
    setup.CrownAndCasteUI.disableBoard();
  },


  initializeOrientationDetection() {
    // Only run on mobile devices
    if (!this.isMobileDevice()) return;

    this.checkOrientation();
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.checkOrientation(), 100);
    });
    
    // Also listen for resize events as a fallback
    window.addEventListener('resize', () => {
      setTimeout(() => this.checkOrientation(), 100);
    });
  },

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768 && window.innerHeight <= 1024);
  },

  checkOrientation() {
    if (!this.isMobileDevice()) return;

    const orientationWarning = document.getElementById('orientation-warning');
    if (!orientationWarning) return;

    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
      // Show warning in landscape mode
      orientationWarning.style.display = 'flex';
      if (State.variables.DEBUG || setup.DEBUG) {
        console.log("[CrownAndCasteUI] Landscape orientation detected, showing rotation warning");
      }
    } else {
      // Hide warning in portrait mode
      orientationWarning.style.display = 'none';
      if (State.variables.DEBUG || setup.DEBUG) {
        console.log("[CrownAndCasteUI] Portrait orientation detected, hiding rotation warning");
      }
    }
  },

  hideGameResult() {
    const panel = document.getElementById("next-game-panel");
    if (panel) {
      panel.style.display = "none";
    }
  },

  disableBoard() {
    const frame = document.getElementById("crown-caste-frame");
    if (frame) {
      frame.classList.add("board-disabled");
    }
  }

};
