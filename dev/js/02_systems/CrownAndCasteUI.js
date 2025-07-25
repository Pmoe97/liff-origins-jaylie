setup.CrownAndCasteUI = {
  chipMode: false,
  
  renderMinigame() {
    window.openOverlay("CrownAndCastePage");

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
    const overlay = document.getElementById("CrownAndCastePage");
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

    const endGameBtn = document.getElementById("end-game-btn");
    if (endGameBtn) {
      endGameBtn.addEventListener("click", () => {
        try {
          closeOverlay();
        } catch (e) {
          console.warn("closeOverlay() not available:", e);
        }

        const session = State.temporary;
        const game = session.ccSession;

        const player = game?.players?.find(p => p.isPlayer);
        const playerWon = player && player.gold > 0;
        const exitPassage = playerWon ? session.ccWinPassage : session.ccLosePassage;

        // 💰 Distribute winnings if the player won
        if (playerWon && typeof State.variables.inventory_player?.gold_coin === "number") {
          State.variables.inventory_player.gold_coin += game.pot;
          console.log(`[CrownAndCaste] Player awarded ${game.pot}g from the pot.`);
        }

        setup.CrownAndCasteUI.cleanupTable();

        if (exitPassage) {
          Engine.play(exitPassage);
        } else {
          console.warn("[CrownAndCaste] No valid exit passage found, falling back to default.");
          Engine.play("ReturnToFair");
        }
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
    // Find the actual dice box element, whether we clicked the box or its contents
    const die = event.target.closest('.clickable-die');
    if (!die) return;
    
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
      // Animate the dice that were just rolled - use updated values
      setTimeout(() => {
        this.animateDiceRoll(0, session.players[0].casteDice);
      }, 50);
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
      // Animate specific die - get updated value
      setTimeout(() => {
        this.animateSingleDie(playerIndex, dieIndex, session.players[playerIndex].casteDice[dieIndex]);
      }, 50);
    } else {
      // Reroll specific locked die of another player
      setup.CrownAndCaste.useControlChip(0, "reroll-other", {
        targetPlayerIndex: playerIndex,
        dieIndex: dieIndex
      });
      this.showFeedback(`Rerolled ${targetPlayer.name}'s locked die!`);
      // Animate specific die - get updated value
      setTimeout(() => {
        this.animateSingleDie(playerIndex, dieIndex, session.players[playerIndex].casteDice[dieIndex]);
      }, 50);
    }

    this.chipMode = false;
    this.updateInteractionStates();
  },

  handleChipClick(event) {
    const chipDisplay = event.target.closest('.clickable-chips');
    const playerIndex = parseInt(chipDisplay.closest('.player-cluster').dataset.playerIndex);
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
    // Animate crown die - get updated value
    setTimeout(() => {
      this.animateCrownDie(dieIndex, session.crownDice[dieIndex]);
    }, 50);
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

      // 🛡 Fix: Guard against undefined players
      if (!player) return;

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

    // Update End Turn button state
    const endTurnBtn = document.getElementById('end-turn-btn');
    if (endTurnBtn) {
      // Enable button only if it's player's turn, not betting phase, and game not complete
      const canEndTurn = isPlayerTurn && !isBettingPhase && !session.gameComplete;
      endTurnBtn.disabled = !canEndTurn;
      
      // Hide entire player-actions div if game is complete
      const playerActionsDiv = document.getElementById('player-actions');
      if (playerActionsDiv) {
        playerActionsDiv.style.display = session.gameComplete ? 'none' : 'block';
      }
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
        
        // Animate NPC dice rolls
        const session = State.temporary.ccSession;
        const npc = session.players[playerIndex];
        if (npc && session.turnPhase === "rolling") {
          this.animateDiceRoll(playerIndex, npc.casteDice);
        }
        
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

  showFeedback(message, duration = 2000, type = 'info') {
    const feedback = document.getElementById('action-feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.className = `show feedback-${type}`;
      
      setTimeout(() => {
        feedback.classList.remove('show');
        feedback.className = '';
      }, duration);
    }
  },

  showCurrentHandStrength() {
    const session = State.temporary.ccSession;
    const player = session.players[0]; // Player is always index 0
    
    if (!player || player.casteDice.some(d => d === null)) {
      return; // Don't show if dice aren't rolled yet
    }

    const combo = setup.CrownAndCaste.evaluateCombos(player);
    const comboDetails = this.formatComboDetails(combo);
    const strengthMessage = comboDetails ? 
      `Current hand: ${combo.name} (${comboDetails})` : 
      `Current hand: ${combo.name}`;
    
    this.showFeedback(strengthMessage, 3000, 'info');
  },

  announceRoundStart(roundNumber) {
    const roundMessages = {
      1: "Round 1: Roll your Caste Dice!",
      2: "Round 2: Crown Die 2 revealed!",
      3: "Round 3: Final Crown Die revealed!"
    };
    
    this.showFeedback(roundMessages[roundNumber] || `Round ${roundNumber} begins!`, 2500, 'round');
    
    // Animate crown dice reveals
    if (roundNumber === 2 || roundNumber === 3) {
      setTimeout(() => {
        this.revealCrownDice(roundNumber);
      }, 100);
    }
  },

  announcePhaseChange(phase) {
    const phaseMessages = {
      "betting": "Place your bets!",
      "rolling": "Rolling phase begins!",
      "final": "Final round - all dice locked!"
    };
    
    if (phaseMessages[phase]) {
      this.showFeedback(phaseMessages[phase], 2000, 'phase');
    }
  },

  highlightCurrentPlayer() {
    const session = State.temporary.ccSession;
    const panels = document.querySelectorAll(".player-cluster");

    panels.forEach(panel => {
      panel.classList.remove("active-player", "current-turn");
      if (parseInt(panel.dataset.playerIndex) === session.currentPlayerIndex) {
        panel.classList.add("active-player", "current-turn");
      }
    });
  },

  getPositionId(index) {
    // This function is no longer needed with the new structure
    // Keep it for backwards compatibility but it won't be used
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
      if (el && !el.classList.contains('rolling')) {
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
      // Find the cluster by data-player-index
      const cluster = document.querySelector(`.player-cluster[data-player-index="${i}"]`);
      if (!cluster) return;

      const goldEl = cluster.querySelector(".gold-amount");
      const chipEl = cluster.querySelector(".chip-count");
      const nameEl = cluster.querySelector(".player-name");

      if (goldEl) goldEl.textContent = p.gold;
      if (chipEl) chipEl.textContent = p.chips;
      if (nameEl) {
        const baseName = p.name || `Player ${i + 1}`;
        const isDealer = i === session.dealerIndex;

        nameEl.innerHTML = isDealer
          ? `<i class="lucide crown-icon" data-lucide="crown"></i> ${baseName}`
          : baseName;
      }

      // Update dice display
      p.casteDice.forEach((val, j) => {
        const dieEl = cluster.querySelector(`.clickable-die[data-die="${j}"]`);
        if (dieEl && !dieEl.classList.contains('rolling')) {
          if (val !== null) {
            // Remove label and show value with proper styling
            dieEl.innerHTML = `<span style="font-size: 1.5em; font-weight: bold; color: #f0e6d2;">${val}</span>`;
            dieEl.classList.add("has-value");
            dieEl.setAttribute("data-value", val);
          } else {
            // Show label when no value
            dieEl.innerHTML = `<div class="dice-label">Caste<br>Die ${j + 1}</div>`;
            dieEl.classList.remove("has-value");
            dieEl.removeAttribute("data-value");
          }
          dieEl.classList.toggle("locked", p.locks[j]);
        }
      });
    });
    if (window.lucide) lucide.createIcons();
  },

  updateChipDisplay(playerIndex, chipCount, goldCount) {
    const cluster = document.querySelector(`.player-cluster[data-player-index="${playerIndex}"]`);
    if (cluster) {
      const chipEl = cluster.querySelector(".chip-count");
      const goldEl = cluster.querySelector(".gold-amount");
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
    const cluster = document.querySelector(`.player-cluster[data-player-index="${playerIndex}"]`);
    if (cluster) {
      const dieEl = cluster.querySelector(`.clickable-die[data-die="${dieIndex}"]`);
      if (dieEl) {
        dieEl.classList.toggle("locked", isLocked);
      }
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

    // Create detailed result message with combo information
    const winnerCombo = winner.combo;
    let resultMessage = `🎉 ${winner.name} wins with ${winnerCombo.name}!`;
    
    // Add combo details if available
    if (winnerCombo.comboValues && winnerCombo.comboValues.length > 0) {
      const comboDetails = this.formatComboDetails(winnerCombo);
      resultMessage += `\n${comboDetails}`;
    }
    
    resultMessage += `\nTakes the pot: ${session.pot}g`;

    // Show all players' final hands for comparison
    console.log("[CrownAndCaste] Final Results:");
    session.players.forEach((p, i) => {
      const combo = p.combo;
      const diceStr = p.casteDice.concat(session.crownDice).join(', ');
      console.log(`${p.name}: ${combo.name} (${diceStr}) - Rank ${p.scoreRank}`);
    });

    // Display the result prominently
    this.showGameResultModal(winner, resultMessage);

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

  formatComboDetails(combo) {
    const name = combo.name;
    const values = combo.comboValues || [];
    
    switch (name) {
      case "Single Pair":
        return `Pair of ${values[0]}s`;
      case "Dual Pairs":
        return `Pairs of ${values[0]}s and ${values[1]}s`;
      case "Triplet":
        return `Three ${values[0]}s`;
      case "Tri-Crown":
        return `Three ${values[0]}s with pair of ${values[1]}s`;
      case "Courtesan's Quad":
      case "Courtly Quad":
        return `Four ${values[0]}s` + (values[1] ? ` with pair of ${values[1]}s` : '');
      case "Jester's Court":
        return `Three pairs: ${values.join(', ')}`;
      case "Royal Spread":
        return `Two triplets: ${values[0]}s and ${values[1]}s`;
      case "Fivefold Glory":
        return `Five ${values[0]}s`;
      case "Imperial Crown":
        return `Six ${values[0]}s`;
      case "Octline":
      case "Split Line":
      case "Line of Five Paired":
      case "Line of Five Unpaired":
        return `Straight to ${values[0]}`;
      default:
        return values.length > 0 ? `High: ${values[0]}` : '';
    }
  },

  showGameResultModal(winner, message) {
    // Create or update result modal
    let modal = document.getElementById('game-result-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'game-result-modal';
      modal.className = 'game-result-modal';
      document.getElementById('crown-caste-frame').appendChild(modal);
    }

    modal.innerHTML = `
      <div class="result-content">
        <div class="result-header">Game Complete!</div>
        <div class="result-message">${message.replace(/\n/g, '<br>')}</div>
        <button class="result-close-btn" onclick="this.parentElement.parentElement.style.display='none'">
          Continue
        </button>
      </div>
    `;

    modal.style.display = 'flex';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (modal && modal.style.display !== 'none') {
        modal.style.display = 'none';
      }
    }, 5000);
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
  },

  // New animation methods
  animateDiceRoll(playerIndex, finalValues) {
    const cluster = document.querySelector(`.player-cluster[data-player-index="${playerIndex}"]`);
    if (!cluster) return;

    finalValues.forEach((val, dieIndex) => {
      if (val !== null) {
        const dieEl = cluster.querySelector(`.clickable-die[data-die="${dieIndex}"]`);
        // Check if die is not locked before animating
        const session = State.temporary.ccSession;
        const player = session.players[playerIndex];
        if (dieEl && !player.locks[dieIndex]) {
          this.animateSingleDie(playerIndex, dieIndex, val);
        }
      }
    });
  },

  animateSingleDie(playerIndex, dieIndex, finalValue) {
    const cluster = document.querySelector(`.player-cluster[data-player-index="${playerIndex}"]`);
    if (!cluster) return;

    const dieEl = cluster.querySelector(`.clickable-die[data-die="${dieIndex}"]`);
    if (!dieEl || finalValue === null) return;

    // Add rolling class
    dieEl.classList.add('rolling', 'has-value');
    
    // Rapid value changes
    const animationDuration = 1500;
    const frameDelay = 50;
    const frames = animationDuration / frameDelay;
    let currentFrame = 0;

    const rollInterval = setInterval(() => {
      currentFrame++;
      
      if (currentFrame < frames) {
        // Show random value
        const randomValue = Math.floor(Math.random() * 8) + 1;
        dieEl.innerHTML = `<span style="font-size: 1.5em; font-weight: bold;">${randomValue}</span>`;
      } else {
        // Show final value and cleanup
        clearInterval(rollInterval);
        dieEl.classList.remove('rolling');
        dieEl.innerHTML = `<span style="font-size: 1.5em; font-weight: bold; color: #f0e6d2;">${finalValue}</span>`;
        dieEl.setAttribute("data-value", finalValue);
      }
    }, frameDelay);
  },

  animateCrownDie(dieIndex, finalValue) {
    const dieEl = document.getElementById(`crown-die-${dieIndex + 1}`);
    if (!dieEl || finalValue === null) return;

    // Add rolling class
    dieEl.classList.add('rolling');
    
    // Rapid value changes
    const animationDuration = 1500;
    const frameDelay = 50;
    const frames = animationDuration / frameDelay;
    let currentFrame = 0;

    const rollInterval = setInterval(() => {
      currentFrame++;
      
      if (currentFrame < frames) {
        // Show random value
        const randomValue = Math.floor(Math.random() * 8) + 1;
        dieEl.textContent = randomValue;
      } else {
        // Show final value and cleanup
        clearInterval(rollInterval);
        dieEl.classList.remove('rolling');
        dieEl.textContent = finalValue;
      }
    }, frameDelay);
  },

  // Animate crown dice when revealed
  revealCrownDice(roundNumber) {
    const session = State.temporary.ccSession;
    
    if (roundNumber === 2 && session.crownDice[1] !== null) {
      this.animateCrownDie(1, session.crownDice[1]);
    } else if (roundNumber === 3 && session.crownDice[2] !== null) {
      this.animateCrownDie(2, session.crownDice[2]);
    }
  },

};
