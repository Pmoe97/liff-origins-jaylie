setup.CrownAndCaste = {
  // ==========================
  // 1. Core Initialization
  // ==========================

  initSession(playerIds, stakes = "standard", houseRules = []) {
    const maxPlayers = 4;
    const finalIds = playerIds.slice(0, maxPlayers);
  
    const generatedPlayers = finalIds.map((id, index) => {
      const basePlayer = {
        gold: 15,
        chips: 3,
        casteDice: [null, null, null],
        locks: [false, false, false],
        combo: null,
        scoreRank: null,
        isEliminated: false,
        bet: 0,
      };
  
      if (id === "ghost") {
        return {
          ...basePlayer,
          name: `Ghost ${index + 1}`,
          isGhost: true,
          isPlayer: false,
        };
      }
  
      if (index === 0) {
        return {
          ...basePlayer,
          name: id,
          isPlayer: true,
          isGhost: false,
        };
      }
  
      const npc = State.variables.characters?.[id];
      return {
        ...basePlayer,
        name: npc?.name || `Unknown (${id})`,
        isGhost: false,
        isPlayer: false,
        npcId: id,
      };
    });
  
    State.temporary.ccSession = {
      players: generatedPlayers,
      dealerIndex: Math.floor(Math.random() * generatedPlayers.length),
      currentRound: 1,
      currentPlayerIndex: 0,
      crownDice: [null, null, null],
      crownLocks: [false, false, false],
      crownProtected: false,
      gameNumber: 1,
      totalGamesInSession: 0,
      pot: 0,
      turnPhase: "betting",
      gamesSinceChipRefresh: 0,
      gameComplete: false,
      stakes: stakes,
      chipCost: setup.CrownAndCaste.getChipCost(stakes),
      houseRules: houseRules,
      playerFavor: State.temporary.ccPlayerFavor ?? 1.0  // 👈 Inject favor here
    };
  
    console.log("[CrownAndCaste] Session initialized:", State.temporary.ccSession);
  },
  
  
  hasHouseRule(ruleName) {
    const session = State.temporary.ccSession;
    return session.houseRules && session.houseRules.includes(ruleName);
  },

  getStandardBet(stakes) {
    switch (stakes.toLowerCase()) {
      case "low": return 3;
      case "standard": return 5;
      case "high": return 10;
      default: return 5;
    }
  },

  getChipCost(stakes) {
    switch (stakes.toLowerCase()) {
      case "low": return 2;
      case "standard": return 3;
      case "high": return 5;
      default: return 3;
    }
  },
  
  startGame() {
    const session = State.temporary.ccSession;

    if (!session || !session.players) {
      console.error("[CrownAndCaste] No session found. Call initSession first.");
      return;
    }

    session.currentRound = 1;
    session.currentPlayerIndex = 0;
    session.pot = 0;
    session.turnPhase = "rolling";
    session.crownDice = [null, null, null];
    session.crownLocks = [false, false, false];
    session.crownProtected = false;
    session.turnsTakenThisRound = 0;
    session.gameComplete = false;

    const standardBet = this.getStandardBet(session.stakes);

    for (const player of session.players) {
      player.casteDice = [null, null, null];
      player.locks = [false, false, false];
      player.combo = null;
      player.scoreRank = null;
      player.usedChipThisTurn = false;

      // 💰 Deduct standard bet or go all-in
      const betAmount = Math.min(player.gold, standardBet);
      player.bet = betAmount;
      player.gold -= betAmount;
      session.pot += betAmount;

      // ❌ DO NOT eliminate here — wait until game resolution
      console.log(`[CrownAndCaste] ${player.name} bet ${betAmount}g. Remaining gold: ${player.gold}`);


      console.log(`[CrownAndCaste] ${player.name} bet ${betAmount}g. Remaining gold: ${player.gold}`);
    }

    // Roll Crown Die 1
    this.rollCrownDie(0);

    // First valid player takes the first turn
    for (let i = 0; i < session.players.length; i++) {
      const p = session.players[i];
      if (!p.isEliminated) {
        session.currentPlayerIndex = i;
        this.rollCasteDice(i);
        if (!p.isPlayer) this.processNPCTurn(i);


        break;
      }
    }

    console.log(`[CrownAndCaste] Game ${session.gameNumber} started. Standard bet applied: ${standardBet}g`);
  },


  startNextGame() {
    const session = State.temporary.ccSession;

    if (!session || !session.players) {
      console.error("[CrownAndCaste] No session found. Cannot start next game.");
      return;
    }

    if (!session.gameComplete) {
      console.warn("[CrownAndCaste] Current game is not complete. Cannot start next game.");
      return;
    }

    console.log(`[CrownAndCaste] Starting next game (Game ${session.gameNumber}) in session...`);
    
    // Start the next game
    this.startGame();
    
    // Update UI to reflect new game state
    this.updateUI();
  },



  endTurn() {
    const session = State.temporary.ccSession;

    // 🛑 Guard against recursive turn-ending loops
    if (session._currentlyEndingTurn) {
      console.warn("[CrownAndCaste] Prevented recursive endTurn call.");
      return;
    }
    session._currentlyEndingTurn = true;

    const currentPlayer = session.players[session.currentPlayerIndex];
    console.log(`[CrownAndCaste] Ending turn for ${currentPlayer.name}`);

    // 🧮 Track that one player just finished their turn
    session.turnsTakenThisRound++;

    const players = session.players;
    const activePlayers = players.filter(p => !p.isEliminated).length;
    const roundComplete = session.turnsTakenThisRound >= activePlayers;

    console.log(`[CrownAndCaste] Turn ${session.turnsTakenThisRound}/${activePlayers} completed. Round complete: ${roundComplete}`);

    if (roundComplete) {
      if (session.currentRound < 3) {
        // 🔁 Advance to next round
        session.currentRound++;
        session.turnsTakenThisRound = 0;

        console.log(`[CrownAndCaste] Advancing to Round ${session.currentRound}`);

        // 🎲 Roll the next Crown Die
        this.rollCrownDie(session.currentRound - 1);

        // 🔄 Reset chip usage for all players (1 chip per round)
        session.players.forEach(p => {
          p.usedChipThisTurn = false;
        });

        // 👑 Start next round with first player after dealer
        session.currentPlayerIndex = this.getNextPlayerClockwise(session.dealerIndex);
        const starter = session.players[session.currentPlayerIndex];
        console.log(`[CrownAndCaste] Round ${session.currentRound} starts with ${starter.name}`);

        // 🎲 Auto-roll their unlocked Caste Dice
        this.rollCasteDice(session.currentPlayerIndex);

        // ✅ Resume game
        session._currentlyEndingTurn = false;
        this.updateUI();

        if (!starter.isPlayer) {
          this.scheduleNPCTurn(session.currentPlayerIndex);
        }

        return;

      } else {
        // ✅ Final round completed — lock all dice before resolving
        session.players.forEach(p => {
          if (!p.isEliminated) {
            p.locks = [true, true, true];
          }
        });

        session.crownLocks = [true, true, true];
        session.crownProtected = true;

        console.log("[CrownAndCaste] Final round reached — all dice have been locked.");
        console.log("[CrownAndCaste] Final round completed. Resolving game...");

        session._currentlyEndingTurn = false;
        this.resolveGame();
        return;
      }
    }


    // 🔁 Continue to next player in same round
    const nextPlayerIndex = this.getNextPlayerClockwise(session.currentPlayerIndex);
    if (nextPlayerIndex === -1) {
      console.warn("[CrownAndCaste] No next player found!");
      session._currentlyEndingTurn = false;
      return;
    }

    session.currentPlayerIndex = nextPlayerIndex;
    const nextPlayer = session.players[nextPlayerIndex];
    console.log(`[CrownAndCaste] Next turn: ${nextPlayer.name}`);

    if (session.currentRound > 1) {
      this.rollCasteDice(nextPlayerIndex);
    }

    session._currentlyEndingTurn = false;
    this.updateUI();

    if (!nextPlayer.isPlayer) {
      this.scheduleNPCTurn(nextPlayerIndex);
    }
  },


  updateUI() {
    if (setup.CrownAndCasteUI?.updateGameStatus) {
      setup.CrownAndCasteUI.updateGameStatus();
    }
    if (setup.CrownAndCasteUI?.updateInteractionStates) {
      setup.CrownAndCasteUI.updateInteractionStates();
    }
    if (setup.CrownAndCasteUI?.renderPlayerPanels) {
      setup.CrownAndCasteUI.renderPlayerPanels();
    }
    if (setup.CrownAndCasteUI?.renderCrownDice) {
      setup.CrownAndCasteUI.renderCrownDice();
    }
  },

  scheduleNPCTurn(playerIndex) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    
    console.log(`[CrownAndCaste] Scheduling NPC turn for ${npc.name}`);
    
    // Process NPC actions immediately
    this.processNPCDiceActions(playerIndex);
    this.processNPCChipStrategy(playerIndex);
    
    // Schedule turn end after delay
    setTimeout(() => {
      if (!session._currentlyEndingTurn && session.currentPlayerIndex === playerIndex) {
        console.log(`[CrownAndCaste] Auto-ending turn for NPC ${npc.name}`);
        this.endTurn();
      }
    }, 1500);
  },

  advancePhase() {
    const session = State.temporary.ccSession;
    
    switch (session.turnPhase) {
      case "crown-roll":
        this.rollCrownDie(session.currentRound - 1);
        session.turnPhase = "player-actions";
        session.currentPlayerIndex = this.getNextPlayerClockwise(session.dealerIndex);
        break;
        
      case "player-actions":
        if (this.allPlayersActed()) {
          if (session.currentRound < 3) {
            session.currentRound++;
            session.turnPhase = "crown-roll";
          } else {
            this.resolveGame();
          }
        } else {
          session.currentPlayerIndex = this.getNextPlayerClockwise(session.currentPlayerIndex);
        }
        break;
    }
  },

  endSession() {
    const session = State.temporary.ccSession;
    
    // Reset all chips at session end
    session.players.forEach(p => {
      if (!p.isEliminated) {
        p.chips = 3;
      }
    });
    
    console.log("[CrownAndCaste] Session ended. All Control Chips reset.");
  },
  // ==========================
  // 2. Dice Logic
  // ==========================

  rollCasteDice(playerIndex) {
    const session = State.temporary.ccSession;
    const player = session.players[playerIndex];

    if (!player || player.isEliminated) {
      console.warn(`[CrownAndCaste] Cannot roll dice for player index ${playerIndex}`);
      return;
    }

    for (let i = 0; i < 3; i++) {
      if (!player.locks[i]) {
        // Always reroll unlocked dice in Rounds 2 and 3
        if (session.currentRound > 1 || player.casteDice[i] === null) {
          player.casteDice[i] = this.rollDie();
        }
      }
    }

    console.log(`[CrownAndCaste] Rolled Caste Dice for ${player.name}:`, player.casteDice);

    // 🟠 House Rule: Cutthroat Caste
    if (this.hasHouseRule?.("cutthroat-caste")) {
      const hasLockedDie = player.locks.some(lock => lock);
      if (!hasLockedDie) {
        console.warn(`[CrownAndCaste] Cutthroat Caste: ${player.name} must lock at least one die.`);
        // Simple enforcement: auto-lock first die
        player.locks[0] = true;
        console.log(`[CrownAndCaste] Cutthroat Caste enforced: auto-locked die 1 for ${player.name}.`);
      }
    }

    if (setup.CrownAndCasteUI?.updateDiceDisplay) {
      setup.CrownAndCasteUI.updateDiceDisplay(playerIndex);
    }
  },


  lockDie(playerIndex, dieIndex) {
    const session = State.temporary.ccSession;
    const player = session.players[playerIndex];

    if (!player || player.isEliminated) {
      console.warn(`[CrownAndCaste] Cannot toggle lock for player index ${playerIndex}`);
      return;
    }

    if (dieIndex < 0 || dieIndex >= 3) {
      console.warn(`[CrownAndCaste] Invalid die index: ${dieIndex}`);
      return;
    }

    const isLocked = player.locks[dieIndex];

    if (!isLocked) {
      // Locking is always allowed
      player.locks[dieIndex] = true;
      console.log(`[CrownAndCaste] ${player.name} locked die ${dieIndex + 1}`);
    } else {
      // Unlocking only allowed in Round 1
      if (session.currentRound === 1) {
        player.locks[dieIndex] = false;
        console.log(`[CrownAndCaste] ${player.name} unlocked die ${dieIndex + 1}`);
      } else {
        console.warn(`[CrownAndCaste] ${player.name} cannot unlock die after Round 1.`);
        setup.CrownAndCasteUI?.showFeedback?.("You can't unlock dice in later rounds!");
        return; // Stop here; don't call UI update
      }
    }

    // Update lock icon
    if (setup.CrownAndCasteUI?.updateLockDisplay) {
      setup.CrownAndCasteUI.updateLockDisplay(playerIndex, dieIndex, player.locks[dieIndex]);
    }
  },


  rollCrownDie(index, { isControlChip = false } = {}) {
    const session = State.temporary.ccSession;

    if (index < 0 || index > 2) {
      console.warn(`[CrownAndCaste] Invalid Crown Die index: ${index}`);
      return;
    }

    if (isControlChip && session.crownProtected) {
      console.warn(`[CrownAndCaste] Crown is protected. Cannot reroll Crown Die ${index + 1} via Control Chip.`);
      return;
    }

    const dealer = session.players[session.dealerIndex];
    const customDie = this.getDealerCrownDie(dealer, index);

    const value = (customDie && typeof customDie.roll === "function")
      ? customDie.roll()
      : this.rollDie();

    session.crownDice[index] = value;

    console.log(`[CrownAndCaste] Crown Die ${index + 1} rolled: ${value}${customDie ? ` (using ${customDie.name})` : ""}`);

    if (setup.CrownAndCasteUI?.updateCrownDisplay) {
      setup.CrownAndCasteUI.updateCrownDisplay(index, value);
    }
  },


  getDealerCrownDie(dealer, index) {
    if (!dealer || dealer.isEliminated) return null;
    
    // Get dealer's inventory
    const dealerInventory = State.variables[`inventory_${dealer.isPlayer ? 'player' : dealer.npcId}`];
    if (!dealerInventory) return null;
    
    // Find Crown dice in inventory
    const crownDiceIds = Object.keys(dealerInventory).filter(itemId => {
      const item = getItemMetadata(itemId);
      return item && item.subtype === "crown-die";
    });
    
    if (crownDiceIds.length === 0) return null;
    
    // Use the crown die at the specified index, or cycle through available ones
    const selectedId = crownDiceIds[index % crownDiceIds.length];
    return getItemMetadata(selectedId);
  },


  lockCrownDice() {
    const session = State.temporary.ccSession;

    session.crownProtected = true;
    session.crownLocks = [true, true, true];

    console.log(`[CrownAndCaste] Crown has been protected. All Crown Dice are now locked.`);

    if (setup.CrownAndCasteUI?.updateCrownLockDisplay) {
      for (let i = 0; i < 3; i++) {
        setup.CrownAndCasteUI.updateCrownLockDisplay(i, true);
      }
    }
  },

  // ==========================
  // 3. Control Chips
  // ==========================

  useControlChip(playerIndex, actionType, targetIndex = null) {
    const session = State.temporary.ccSession;
    const player = session.players[playerIndex];

    if (!player || player.isEliminated) {
      console.warn(`[CrownAndCaste] Invalid or eliminated player for chip use.`);
      return;
    }

    if (player.usedChipThisTurn) {
      console.warn(`[CrownAndCaste] ${player.name} already used a Control Chip this turn.`);
      return;
    }

    if (playerIndex === session.dealerIndex) {
      console.warn(`[CrownAndCaste] Dealer cannot use Control Chips.`);
      return;
    }

    if (actionType === "reroll-other" && targetIndex === session.dealerIndex) {
      console.warn("[CrownAndCaste] Cannot target dealer with Control Chips.");
      return;
    }

    if (player.chips <= 0) {
      console.warn(`[CrownAndCaste] Player ${player.name} has no Control Chips left.`);
      return;
    }

    let chipCost = session.chipCost || 2;
    if (this.hasHouseRule("golden-tax")) {
      chipCost += 1;
    }

    const actualCost = Math.min(chipCost, player.gold); // Fortune's Mercy
    player.gold -= actualCost;
    session.pot += actualCost; // Add to pot
    player.chips--;
    player.usedChipThisTurn = true;

    console.log(`[CrownAndCaste] ${player.name} used a Control Chip (${actionType}), paid ${actualCost}g.`);

    switch (actionType) {
      case "reroll-own": {
        if (targetIndex === null || targetIndex < 0 || targetIndex >= 3) {
          console.warn("[CrownAndCaste] Invalid targetIndex for reroll-own.");
          return;
        }

        if (!player.locks[targetIndex]) {
          console.warn(`[CrownAndCaste] Cannot reroll an unlocked die.`);
          return;
        }

        player.casteDice[targetIndex] = this.rollDie();
        console.log(`[CrownAndCaste] ${player.name} rerolled their locked die ${targetIndex + 1}.`);
        break;
      }

      case "reroll-other": {
        const targetInfo = targetIndex; // now expecting { targetPlayerIndex, dieIndex }
        const targetPlayer = session.players[targetInfo.targetPlayerIndex];

        if (!targetPlayer || targetPlayer.isEliminated || targetInfo.targetPlayerIndex === playerIndex) {
          console.warn("[CrownAndCaste] Invalid target for reroll-other.");
          return;
        }

        const dieIndex = targetInfo.dieIndex;

        if (
          dieIndex < 0 || dieIndex >= 3 ||
          !targetPlayer.locks[dieIndex]
        ) {
          console.warn(`[CrownAndCaste] Cannot reroll die ${dieIndex + 1} — not locked or invalid.`);
          return;
        }

        const oldValue = targetPlayer.casteDice[dieIndex];
        const newValue = this.rollDie();
        targetPlayer.casteDice[dieIndex] = newValue;

        console.log(`[CrownAndCaste] ${player.name} rerolled ${targetPlayer.name}'s locked die ${dieIndex + 1} (was ${oldValue}, now ${newValue}).`);

        if (setup.CrownAndCasteUI?.renderPlayerPanels) {
          setup.CrownAndCasteUI.renderPlayerPanels();
        }

        break;
      }



      case "reroll-crown": {
        if (targetIndex === null || targetIndex < 0 || targetIndex >= 3) {
          console.warn("[CrownAndCaste] Invalid crown die index for reroll.");
          return;
        }

        if (session.crownLocks[targetIndex]) {
          console.warn("[CrownAndCaste] That Crown Die is locked. Cannot reroll.");
          return;
        }

        if (session.crownDice[targetIndex] === null) {
          console.warn("[CrownAndCaste] Cannot reroll an unrolled Crown Die.");
          return;
        }

        this.rollCrownDie(targetIndex);
        console.log(`[CrownAndCaste] ${player.name} rerolled Crown Die ${targetIndex + 1}.`);
        break;
      }



      case "lock-crown": {
        this.lockCrownDice();
        console.log(`[CrownAndCaste] ${player.name} used a chip to Protect the Crown.`);
        break;
      }

      default:
        console.warn(`[CrownAndCaste] Unknown actionType: ${actionType}`);
        break;
    }

    if (setup.CrownAndCasteUI?.updateChipDisplay) {
      setup.CrownAndCasteUI.updateChipDisplay(playerIndex, player.chips, player.gold);
    }
  },

  canUseControlChip(playerIndex) {
    const session = State.temporary.ccSession;
    const player = session.players?.[playerIndex];
    
    if (!player || player.isEliminated) {
      console.warn(`[CrownAndCaste] Cannot use chip: invalid or eliminated player at index ${playerIndex}.`);
      return false;
    }

    if (playerIndex === session.dealerIndex) {
      console.log(`[CrownAndCaste] Dealer cannot use Control Chips.`);
      return false;
    }

    if (player.usedChipThisTurn) {
      console.log(`[CrownAndCaste] ${player.name} already used a Control Chip this turn.`);
      return false;
    }
  
    const hasChips = player.chips > 0;
  
    if (!hasChips) {
      console.log(`[CrownAndCaste] ${player.name} has no Control Chips left.`);
    }
  
    return hasChips;
  },
  

  // ==========================
  // 4. Scoring & Results
  // ==========================

  resolveGame() {
    const session = State.temporary.ccSession;

    if (!session || !session.players || session.players.length === 0) {
      console.error("[CrownAndCaste] Cannot resolve game: no session or players found.");
      return;
    }

    // Evaluate each player's combo
    session.players.forEach((p, i) => {
      const hasTripleSix = p.casteDice.filter(d => d === 6).length === 3;
      if (hasTripleSix && this.hasHouseRule?.("blessing-of-sixes")) {
        p.combo = { name: "Blessing of Sixes", usedDice: [0, 1, 2], rank: 999 };
        p.scoreRank = 999;
        console.log(`[CrownAndCaste] ${p.name} triggered Blessing of Sixes!`);
      } else {
        p.combo = this.evaluateCombos(p); // { name, details? }
        p.scoreRank = this.rankCombo(p.combo.name);
        console.log(`[CrownAndCaste] ${p.name}'s combo: ${p.combo.name} (Rank ${p.scoreRank})`);
      }
    });

    // Find highest ranked player(s)
    const ranked = session.players.map((p, i) => ({ index: i, rank: p.scoreRank }));
    ranked.sort((a, b) => b.rank - a.rank); // highest rank first

    const topRank = ranked[0].rank;
    const tied = ranked.filter(r => r.rank === topRank);
    let winnerIndex;

    if (tied.length > 1) {
      winnerIndex = this.breakTie(tied.map(r => r.index));
      console.log(`[CrownAndCaste] Tie-breaker selected winner: ${session.players[winnerIndex].name}`);
    } else {
      winnerIndex = tied[0].index;
      console.log(`[CrownAndCaste] Winner: ${session.players[winnerIndex].name}`);
    }

    // Award pot
    this.adjustGold(winnerIndex, session.pot);
    console.log(`[CrownAndCaste] ${session.players[winnerIndex].name} receives ${session.pot}g.`);

    // Advance session state
    session.totalGamesInSession++;
    session.gameNumber++;
    session.gamesSinceChipRefresh++;
    session.gameComplete = true;
    this.advanceDealer();

    if (session.gamesSinceChipRefresh >= 3) {
      this.refreshControlChips();
      session.gamesSinceChipRefresh = 0;
      console.log("[CrownAndCaste] All control chips have been refreshed after 3 games.");
    }

    this.checkElimination(winnerIndex);

    // Optional UI result trigger
    if (setup.CrownAndCasteUI?.showGameResult) {
      setup.CrownAndCasteUI.showGameResult(winnerIndex);
    }
  },

  
  evaluateCombos(player) {
    const session = State.temporary.ccSession;

    if (!session || !player || player.isEliminated) {
      console.warn("[CrownAndCaste] Cannot evaluate combos: invalid session or player.");
      return { name: "High Dice", usedDice: [], rank: 0 };
    }

    const fullDiceSet = player.casteDice.concat(session.crownDice);
    const result = setup.CrownAndCasteCombos.evaluate(fullDiceSet);

    if (!result || !result.name) {
      console.warn("[CrownAndCaste] Invalid combo evaluation result. Defaulting to High Dice.");
      return { name: "High Dice", usedDice: [], rank: 0 };
    }

    // 🟣 House Rule: Royal Flush enforcement
    if (
      this.hasHouseRule?.("royal-flush") &&
      (result.name === "Octline" || result.name === "Split Line")
    ) {
      const usesOnlyCrownDice = result.usedDice.every(i => i >= 3);
      if (!usesOnlyCrownDice) {
        console.log("[CrownAndCaste] Royal Flush rule active — straight invalidated.");
        return { name: "High Dice", usedDice: [], rank: 0 };
      }
    }

    return result;
  },  

  rankCombo(name) {
    if (!name || typeof name !== "string") {
      console.warn("[CrownAndCaste] Invalid combo name for ranking.");
      return 0;
    }
  
    const rank = setup.CrownAndCasteCombos?.rankIndex?.(name);
  
    if (typeof rank !== "number") {
      console.warn(`[CrownAndCaste] Unknown combo name: '${name}'. Defaulting to rank 0.`);
      return 0;
    }
  
    return rank;
  },
  

  breakTie(indices) {
    const session = State.temporary.ccSession;
    const candidates = indices.map(i => ({
      index: i,
      player: session.players[i],
    }));

    // 1. Compare full combo values (e.g., [7, 3] beats [6, 5])
    const sortComboValues = player => {
      const dice = player.casteDice.concat(session.crownDice);
      const counts = {};
      for (let die of dice) counts[die] = (counts[die] || 0) + 1;

      const values = Object.entries(counts)
        .filter(([_, c]) => c >= 2)
        .map(([v]) => parseInt(v))
        .sort((a, b) => b - a); // Descending

      return values;
    };

    candidates.sort((a, b) => {
      const aVals = sortComboValues(a.player);
      const bVals = sortComboValues(b.player);
      for (let i = 0; i < Math.max(aVals.length, bVals.length); i++) {
        if ((aVals[i] || 0) > (bVals[i] || 0)) return -1;
        if ((aVals[i] || 0) < (bVals[i] || 0)) return 1;
      }
      return 0; // Still tied
    });

    const bestComboScore = sortComboValues(candidates[0].player).join(",");
    const tiedByCombo = candidates.filter(c =>
      sortComboValues(c.player).join(",") === bestComboScore
    );

    if (tiedByCombo.length === 1) return tiedByCombo[0].index;

    // 2. Most Caste Dice used in the combo
    const maxCasteUsed = Math.max(...tiedByCombo.map(c =>
      c.player.combo.usedDice.filter(i => i < 3).length
    ));
    const tiedByCaste = tiedByCombo.filter(c =>
      c.player.combo.usedDice.filter(i => i < 3).length === maxCasteUsed
    );
    if (tiedByCaste.length === 1) return tiedByCaste[0].index;

    // 3. Highest sum of unused dice
    const tiedByUnused = [];
    let highestUnusedSum = -1;
    for (const c of tiedByCaste) {
      const fullDice = c.player.casteDice.concat(session.crownDice);
      const unused = fullDice.filter((_, i) => !c.player.combo.usedDice.includes(i));
      const total = unused.reduce((sum, val) => sum + val, 0);
      if (total > highestUnusedSum) {
        highestUnusedSum = total;
        tiedByUnused.length = 0;
        tiedByUnused.push(c);
      } else if (total === highestUnusedSum) {
        tiedByUnused.push(c);
      }
    }
    if (tiedByUnused.length === 1) return tiedByUnused[0].index;

    // 4. Sudden-death roll
    const rolled = tiedByUnused.map(f => ({
      index: f.index,
      roll: this.rollDie() + this.rollDie() + this.rollDie()
    }));
    rolled.sort((a, b) => b.roll - a.roll);
    console.log(`[CrownAndCaste] Tie-break resolved by sudden-death roll: ${rolled[0].roll}`);
    return rolled[0].index;
  },

  

  // ==========================
  // 5. Betting & Pot
  // ==========================
  initiateBetting() {
    const session = State.temporary.ccSession;
    session.turnPhase = "betting";
    session.betsRevealed = false;
    
    // Reset all bets
    session.players.forEach(p => {
      if (!p.isEliminated) {
        p.bet = 0;
        p.betPlaced = false;
      }
    });
  },

  placeBet(playerIndex, amount) {
    const session = State.temporary.ccSession;
    const player = session.players[playerIndex];
    
    if (session.turnPhase !== "betting") {
      console.warn("[CrownAndCaste] Not in betting phase.");
      return false;
    }
    
    if (amount < 3 || amount > 10) {
      console.warn("[CrownAndCaste] Bet must be between 3g and 10g.");
      return false;
    }
    
    if (amount > player.gold) {
      console.warn("[CrownAndCaste] Insufficient gold for bet.");
      return false;
    }
    
    player.bet = amount;
    player.betPlaced = true;
    
    // Check if all players have bet
    const allBetsPlaced = session.players
      .filter(p => !p.isEliminated)
      .every(p => p.betPlaced);
      
    if (allBetsPlaced) {
      this.revealBets();
    }
    
    return true;
  },

    collectBets() {
      const session = State.temporary.ccSession;
      const minBet = 3;
      const maxBet = 10;
    
      session.pot = 0;
    
      session.players.forEach((p, i) => {
        if (p.isEliminated) {
          console.log(`[CrownAndCaste] Skipping bet for eliminated player: ${p.name}`);
          p.bet = 0;
          return;
        }
    
        // Auto-bet logic (static for now, can expand later with UI)
        const desiredBet = minBet;
    
        // Apply Fortune's Mercy if they can't afford minimum
        const actualBet = Math.min(desiredBet, p.gold);
        p.gold -= actualBet;
        p.bet = actualBet;
        session.pot += actualBet;
    
        console.log(`[CrownAndCaste] ${p.name} bet ${actualBet}g. Remaining: ${p.gold}g`);
      });
    
      console.log(`[CrownAndCaste] Total pot is now ${session.pot}g.`);
    },  

  adjustGold(playerIndex, amount) {
    const session = State.temporary.ccSession;
    const player = session.players?.[playerIndex];
  
    if (!player) {
      console.warn(`[CrownAndCaste] adjustGold failed: invalid player index ${playerIndex}`);
      return;
    }
  
    if (player.isEliminated) {
      console.log(`[CrownAndCaste] adjustGold ignored for eliminated player: ${player.name}`);
      return;
    }
  
    player.gold += amount;
    console.log(`[CrownAndCaste] ${player.name} gold adjusted by ${amount}. New total: ${player.gold}g`);
  },  

  revealBets() {
    const session = State.temporary.ccSession;
    session.betsRevealed = true;
    session.pot = 0;
    
    session.players.forEach(p => {
      if (!p.isEliminated && p.betPlaced) {
        p.gold -= p.bet;
        session.pot += p.bet;
      }
    });
    
    session.turnPhase = "rolling";
    console.log(`[CrownAndCaste] All bets revealed. Total pot: ${session.pot}g`);
    
    // ✅ Automatically roll first Crown die and first player's caste dice
    this.rollCrownDie(0);
    this.rollCasteDice(0); // Roll first player's caste dice immediately
    
    // Set current player to first player for turn management
    session.currentPlayerIndex = 0;
  },

  allPlayersActed() {
    const session = State.temporary.ccSession;
    return session.players
      .filter(p => !p.isEliminated)
      .every(p => p.hasActedThisRound || false);
  },

  processAllNPCBets() {
    const session = State.temporary.ccSession;
    
    // Process bets for all NPCs
    session.players.forEach((player, index) => {
      if (!player.isPlayer && !player.isEliminated && !player.betPlaced) {
        this.processNPCBetting(index);
      }
    });
  },
  // ==========================
  // 6. Session Management
  // ==========================

  advanceDealer() {
    const session = State.temporary.ccSession;
    const totalPlayers = session.players.length;
  
    let nextDealer = session.dealerIndex;
  
    for (let i = 0; i < totalPlayers; i++) {
      nextDealer = (nextDealer - 1 + totalPlayers) % totalPlayers;
      if (!session.players[nextDealer].isEliminated) {
        session.dealerIndex = nextDealer;
        console.log(`[CrownAndCaste] New dealer is ${session.players[nextDealer].name}`);
        return;
      }
    }
  
    console.warn("[CrownAndCaste] Could not assign a new dealer. All players eliminated?");
  },  

  refreshControlChips() {
    const session = State.temporary.ccSession;
  
    session.players.forEach(p => {
      if (!p.isEliminated) {
        p.chips = 3;
        console.log(`[CrownAndCaste] ${p.name}'s Control Chips refreshed to 3.`);
      }
    });
  },
  

  checkElimination(winnerIndex = null) {
    const session = State.temporary.ccSession;

    session.players.forEach((p, i) => {
      const isWinner = i === winnerIndex;
      if (!p.isEliminated && !isWinner && p.gold <= 0) {
        p.isEliminated = true;
        console.log(`[CrownAndCaste] ${p.name} has been eliminated (0g remaining after loss).`);
      }
    });
  },

  
  // ==========================
  // 7. NPC AI System
  // ==========================



  processNPCBetting(playerIndex) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    const personality = this.getNPCPersonality(npc);
    
    // Calculate bet based on personality and game state
    let betAmount = 3; // minimum bet
    
    // Aggressive personalities bet higher
    if (personality.aggression > 0.7) {
      betAmount = Math.min(10, npc.gold);
    } else if (personality.aggression > 0.4) {
      betAmount = Math.min(7, npc.gold);
    } else if (personality.confidence > 0.6) {
      betAmount = Math.min(5, npc.gold);
    }
    
    // Risk assessment based on current gold
    if (npc.gold <= 10) {
      betAmount = Math.min(3, npc.gold); // Conservative when low on gold
    }
    
    // Add some randomness
    const variance = Math.random() * 0.3 - 0.15; // ±15%
    betAmount = Math.max(3, Math.min(10, Math.floor(betAmount * (1 + variance))));
    betAmount = Math.min(betAmount, npc.gold);
    
    console.log(`[CrownAndCaste] ${npc.name} bets ${betAmount}g (personality: aggression=${personality.aggression.toFixed(2)}, confidence=${personality.confidence.toFixed(2)})`);
    
    this.placeBet(playerIndex, betAmount);
  },

  processNPCTurn(playerIndex) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];

    if (!npc || npc.isPlayer || npc.isEliminated) {
      console.warn(`[CrownAndCaste] Invalid NPC for turn processing: ${playerIndex}`);
      return;
    }

    console.log(`[CrownAndCaste] Processing NPC turn for ${npc.name}`);

    switch (session.turnPhase) {
      case "betting":
        this.processNPCBetting(playerIndex);
        break;
      case "rolling":
        this.processNPCRolling(playerIndex);
        break;
      default:
        this.processNPCGameplay(playerIndex);
        break;
    }

    // ❌ NO auto-end turn here — that's handled by scheduleNPCAction (UI-controlled)
  },


  processNPCRolling(playerIndex) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    
    // Roll dice if they haven't been rolled yet
    if (npc.casteDice.every(die => die === null)) {
      this.rollCasteDice(playerIndex);
    }
    
    // Decide on locking strategy
    this.processNPCLockingStrategy(playerIndex);
  },

  processNPCGameplay(playerIndex) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    
    // First, handle dice rolling and locking
    this.processNPCDiceActions(playerIndex);
    
    // Then consider using control chips
    this.processNPCChipStrategy(playerIndex);
  },

  processNPCDiceActions(playerIndex) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    
    // Roll dice if any are unrolled
    if (npc.casteDice.some(die => die === null)) {
      this.rollCasteDice(playerIndex);
    }
    
    // Apply locking strategy
    this.processNPCLockingStrategy(playerIndex);
  },

  processNPCLockingStrategy(playerIndex) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    const personality = this.getNPCPersonality(npc);
    
    if (npc.casteDice.some(die => die === null)) {
      return; // Wait until all dice are rolled
    }
    
    // Analyze current hand
    const analysis = this.analyzeNPCHand(playerIndex);
    
    // Lock dice based on strategy
    for (let i = 0; i < 3; i++) {
      if (npc.locks[i]) continue; // Already locked
      
      const shouldLock = this.shouldNPCLockDie(playerIndex, i, analysis, personality);
      if (shouldLock) {
        this.lockDie(playerIndex, i);
      }
    }
  },

  shouldNPCLockDie(playerIndex, dieIndex, analysis, personality) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    const dieValue = npc.casteDice[dieIndex];
    
    // Always lock high-value dice (7-8) unless going for specific combos
    if (dieValue >= 7 && !analysis.hasSpecialCombo) {
      return true;
    }
    
    // Lock dice that are part of pairs/triplets
    if (analysis.pairs.includes(dieValue) || analysis.triplets.includes(dieValue)) {
      return true;
    }
    
    // Conservative players lock medium-high dice (5-6)
    if (personality.risk < 0.4 && dieValue >= 5) {
      return true;
    }
    
    // Aggressive players might keep rolling for better combos
    if (personality.risk > 0.7 && session.currentRound < 3) {
      return false;
    }
    
    // Lock dice that contribute to straights
    if (analysis.straightPotential && analysis.straightDice.includes(dieIndex)) {
      return true;
    }
    
    return false;
  },

  processNPCChipStrategy(playerIndex) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    const personality = this.getNPCPersonality(npc);
    
    if (!this.canUseControlChip(playerIndex)) {
      return;
    }
    
    // Decide whether to use a chip this turn
    const shouldUseChip = this.shouldNPCUseChip(playerIndex, personality);
    
    if (shouldUseChip) {
      const chipAction = this.chooseNPCChipAction(playerIndex, personality);
      this.executeNPCChipAction(playerIndex, chipAction);
    }
  },

  shouldNPCUseChip(playerIndex, personality) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    
    // Don't use chips if low on them and conservative
    if (npc.chips <= 1 && personality.risk < 0.5) {
      return false;
    }
    
    // More likely to use chips in later rounds
    const roundFactor = session.currentRound / 3;
    
    // More likely to use chips if behind in gold
    const avgGold = session.players.reduce((sum, p) => sum + p.gold, 0) / session.players.length;
    const goldFactor = npc.gold < avgGold ? 1.5 : 1.0;
    
    // Base probability based on personality
    let probability = personality.aggression * 0.3 + personality.risk * 0.2;
    probability *= roundFactor * goldFactor;
    
    return Math.random() < probability;
  },

  chooseNPCChipAction(playerIndex, personality) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    const analysis = this.analyzeNPCHand(playerIndex);
    
    const actions = [];
    
    // Consider rerolling own locked dice
    const lockedDice = npc.locks.map((locked, i) => locked ? i : null).filter(i => i !== null);
    if (lockedDice.length > 0) {
      actions.push({
        type: "reroll-own",
        target: lockedDice[Math.floor(Math.random() * lockedDice.length)],
        priority: analysis.hasGoodHand ? 0.2 : 0.8
      });
    }
    
    // Consider rerolling other players' dice (sabotage)
    if (personality.aggression > 0.5) {
      const targets = this.findNPCRerollTargets(playerIndex);
      targets.forEach(target => {
        actions.push({
          type: "reroll-other",
          target: target.playerIndex,
          priority: target.threat * personality.aggression
        });
      });
    }
    
    // Consider protecting the crown
    if (!session.crownProtected && session.currentRound >= 2) {
      actions.push({
        type: "lock-crown",
        target: null,
        priority: 0.3 + (session.currentRound - 1) * 0.3
      });
    }
    
    // Choose action with highest priority
    if (actions.length === 0) return null;
    
    actions.sort((a, b) => b.priority - a.priority);
    return actions[0];
  },

  executeNPCChipAction(playerIndex, action) {
    if (!action) return;
    
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    
    console.log(`[CrownAndCaste] ${npc.name} uses Control Chip for ${action.type}`);
    
    this.useControlChip(playerIndex, action.type, action.target);
  },

  findNPCRerollTargets(playerIndex) {
    const session = State.temporary.ccSession;
    const targets = [];
    
    session.players.forEach((player, i) => {
      if (i === playerIndex || player.isEliminated || i === session.dealerIndex) {
        return;
      }
      
      const analysis = this.analyzeNPCHand(i);
      const threat = this.calculatePlayerThreat(i, analysis);
      
      if (threat > 0.5) {
        targets.push({ playerIndex: i, threat });
      }
    });
    
    return targets.sort((a, b) => b.threat - a.threat);
  },

  calculatePlayerThreat(playerIndex, analysis) {
    const session = State.temporary.ccSession;
    const player = session.players[playerIndex];
    
    let threat = 0;
    
    // High gold = higher threat
    const avgGold = session.players.reduce((sum, p) => sum + p.gold, 0) / session.players.length;
    if (player.gold > avgGold) {
      threat += 0.3;
    }
    
    // Good hand = higher threat
    if (analysis.hasGoodHand) {
      threat += 0.4;
    }
    
    // Many chips = higher threat
    if (player.chips > 2) {
      threat += 0.2;
    }
    
    // High dice values = higher threat
    const avgDieValue = player.casteDice.reduce((sum, die) => sum + (die || 0), 0) / 3;
    if (avgDieValue > 5) {
      threat += 0.3;
    }
    
    return Math.min(1.0, threat);
  },

  analyzeNPCHand(playerIndex) {
    const session = State.temporary.ccSession;
    const npc = session.players[playerIndex];
    const fullDice = npc.casteDice.concat(session.crownDice);
    
    // Count occurrences
    const counts = {};
    fullDice.forEach(die => {
      if (die !== null) {
        counts[die] = (counts[die] || 0) + 1;
      }
    });
    
    const pairs = Object.keys(counts).filter(val => counts[val] === 2).map(Number);
    const triplets = Object.keys(counts).filter(val => counts[val] >= 3).map(Number);
    
    // Check for straight potential
    const sortedDice = fullDice.filter(d => d !== null).sort((a, b) => a - b);
    const straightPotential = this.checkStraightPotential(sortedDice);
    
    // Evaluate hand strength
    const combo = this.evaluateCombos(npc);
    const hasGoodHand = combo && this.rankCombo(combo.name) > 5;
    
    return {
      pairs,
      triplets,
      straightPotential: straightPotential.potential,
      straightDice: straightPotential.dice,
      hasGoodHand,
      hasSpecialCombo: triplets.length > 0 || pairs.length > 1,
      combo
    };
  },

  checkStraightPotential(sortedDice) {
    if (sortedDice.length < 4) {
      return { potential: false, dice: [] };
    }
    
    // Look for sequences of 4+ consecutive numbers
    for (let i = 0; i <= sortedDice.length - 4; i++) {
      let consecutive = 1;
      const sequenceDice = [i];
      
      for (let j = i + 1; j < sortedDice.length; j++) {
        if (sortedDice[j] === sortedDice[j-1] + 1) {
          consecutive++;
          sequenceDice.push(j);
        } else if (sortedDice[j] !== sortedDice[j-1]) {
          break;
        }
      }
      
      if (consecutive >= 4) {
        return { potential: true, dice: sequenceDice };
      }
    }
    
    return { potential: false, dice: [] };
  },

  getNPCPersonality(npc) {
    // Extract personality from character data
    const character = State.variables.characters?.[npc.npcId];
    
    if (!character) {
      // Default personality for ghost players
      return {
        aggression: 0.5,
        risk: 0.5,
        confidence: 0.5,
        cunning: 0.5
      };
    }
    
    // Map character traits to gambling personality
    const traits = character.traits || [];
    const socialStyle = character.socialStyle || "Neutral";
    
    let aggression = 0.5;
    let risk = 0.5;
    let confidence = 0.5;
    let cunning = 0.5;
    
    // Adjust based on traits
    traits.forEach(trait => {
      switch (trait.toLowerCase()) {
        case "confident":
        case "dominant":
        case "flashy":
          confidence += 0.3;
          aggression += 0.2;
          break;
        case "cynical":
        case "cunning":
        case "evasive":
          cunning += 0.3;
          risk -= 0.1;
          break;
        case "stoic":
        case "guarded":
          risk -= 0.2;
          aggression -= 0.1;
          break;
        case "flirty":
        case "charming":
          confidence += 0.2;
          cunning += 0.1;
          break;
        case "crude":
        case "feisty":
          aggression += 0.3;
          risk += 0.2;
          break;
        case "submissive":
        case "introverted":
          aggression -= 0.3;
          confidence -= 0.2;
          break;
        case "traumatized":
        case "detached":
          risk -= 0.3;
          aggression -= 0.2;
          break;
      }
    });
    
    // Adjust based on social style
    switch (socialStyle.toLowerCase()) {
      case "regal":
      case "commanding":
        confidence += 0.2;
        aggression += 0.1;
        break;
      case "seductive":
      case "charming":
        cunning += 0.2;
        confidence += 0.1;
        break;
      case "feisty":
        aggression += 0.3;
        risk += 0.2;
        break;
      case "humble":
      case "reserved":
        aggression -= 0.2;
        confidence -= 0.1;
        break;
      case "unhinged":
        risk += 0.4;
        aggression += 0.2;
        break;
      case "grizzled":
      case "stoic":
        risk -= 0.1;
        cunning += 0.1;
        break;
    }
    
    // Clamp values between 0 and 1
    return {
      aggression: Math.max(0, Math.min(1, aggression)),
      risk: Math.max(0, Math.min(1, risk)),
      confidence: Math.max(0, Math.min(1, confidence)),
      cunning: Math.max(0, Math.min(1, cunning))
    };
  },

  // ==========================
  // 8. Helpers
  // ==========================

    rollDie(playerIndex = null) {
      const buffer = new Uint8Array(1);
      window.crypto.getRandomValues(buffer);
      const raw = buffer[0] / 256;
      const baseValue = Math.floor(raw * 8) + 1;
    
      const session = State.temporary.ccSession;
      let value = baseValue;
    
      // 🎲 Apply bias if playerFavor is active
      if (playerIndex === 0 && session?.playerFavor && session.playerFavor > 1.0) {
        const bias = session.playerFavor;
        const biasedRaw = Math.pow(raw, 1 / bias);
        const biasedValue = Math.floor(biasedRaw * 8) + 1;
        value = Math.min(8, Math.max(1, biasedValue));
    
        console.log(
          `[CrownAndCaste] Rolled (playerFavor=${bias.toFixed(2)}): ` +
          `raw=${raw.toFixed(3)} → base=${baseValue}, biasedRaw=${biasedRaw.toFixed(3)} → biased=${biasedValue}, final=${value}`
        );
      } else {
        console.log(`[CrownAndCaste] Rolled die: raw=${raw.toFixed(3)} → ${value}`);
      }
    
      return value;
    },
  
 

  // ✨ Pseudo-rolling animation for dice (flavor feature)
  async rollDieWithAnimation(elementId, finalValue = null) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`[CrownAndCaste] Cannot animate die: element ${elementId} not found`);
      return finalValue || this.rollDie();
    }

    const actualValue = finalValue || this.rollDie();
    const animationDuration = 1500 + Math.random() * 1000; // 1.5-2.5 seconds
    const startTime = Date.now();

    // Add animation class for visual effects
    element.classList.add('rolling');

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;

      if (progress < 1) {
        // Show random values during animation
        const randomValue = Math.floor(Math.random() * 8) + 1;
        element.textContent = randomValue;
        requestAnimationFrame(animate);
      } else {
        // Animation complete - show final value
        element.textContent = actualValue;
        element.classList.remove('rolling');
        console.log(`[CrownAndCaste] Die animation complete: ${actualValue}`);
      }
    };

    animate();
    
    // Return a promise that resolves when animation completes
    return new Promise(resolve => {
      setTimeout(() => resolve(actualValue), animationDuration);
    });
  },

  logSessionState() {
    console.log("[CrownAndCaste] Current session state:");
    console.log(JSON.stringify(State.temporary.ccSession, null, 2));
  },

  getNextPlayerClockwise(currentIndex) {
    const session = State.temporary.ccSession;
    const totalPlayers = session.players.length;
    
    for (let i = 1; i <= totalPlayers; i++) {
      const nextIndex = (currentIndex + i) % totalPlayers;
      if (!session.players[nextIndex].isEliminated) {
        return nextIndex;
      }
    }
    return -1; // No valid players found
  },
  
  

};



  // ==========================
  // 8. Combos Logic
  // ==========================
setup.CrownAndCasteCombos = {
RANKS: [                        
  "High Dice",           
  "Single Pair",         
  "Dual Pairs",          
  "Triplet",             
  "Tri-Crown",           
  "Line of Five Unpaired",
  "Jester's Court",      
  "Courtesan's Quad",    
  "Line of Five Paired", 
  "Split Line",          
  "Octline",             
  "Courtly Quad",        
  "Royal Spread",        
  "Fivefold Glory",      
  "Imperial Crown"       
  ],

  rankIndex(name) {
    return this.RANKS.indexOf(name);
  },

  evaluate(diceArray) {
    const counts = {};
    for (const die of diceArray) {
      counts[die] = (counts[die] || 0) + 1;
    }

    const values = diceArray.slice().sort((a, b) => a - b);
    const unique = [...new Set(values)];
    const countValues = Object.values(counts).sort((a, b) => b - a);

    const hasNOfKind = n => Object.values(counts).includes(n);
    const getAllOfCount = n => Object.entries(counts).filter(([_, c]) => c === n).map(([v]) => parseInt(v));
    const isStraight = (len = 6) => {
      for (let i = 0; i <= values.length - len; i++) {
        let streak = 1;
        for (let j = i; j < i + len - 1; j++) {
          if (values[j + 1] !== values[j] + 1) break;
          streak++;
        }
        if (streak === len) return true;
      }
      return false;
    };

    const countPairs = () => getAllOfCount(2).length;
    const countTriplets = () => getAllOfCount(3).length;

    const combo = (name) => ({
      name,
      usedDice: [...Array(6).keys()], // placeholder
      rank: this.rankIndex(name)
    });

    if (countValues[0] === 6) return combo("Imperial Crown");
    if (countValues[0] === 5) return combo("Fivefold Glory");
    if (countTriplets() === 2) return combo("Royal Spread");
    if (countValues[0] === 4 && countValues[1] === 2) return combo("Courtly Quad");
    if (isStraight(6)) return combo("Octline");
    if (hasSplitLine(values)) return combo("Split Line");
    if (countValues[0] === 4 && countValues[1] <= 1) return combo("Courtesan's Quad");
    if (countPairs() === 3) return combo("Jester's Court");

    if (hasFiveInARow(values)) {
      const fiveInRow = getFiveInRowValues(values);
      const sixthDie = values.find(v => !fiveInRow.includes(v));
      if (sixthDie !== undefined && fiveInRow.includes(sixthDie)) {
        return combo("Line of Five Paired");
      } else {
        return combo("Line of Five Unpaired");
      }
    }

    if (countValues.includes(3) && countValues.includes(2)) return combo("Tri-Crown");
    if (countValues[0] === 3) return combo("Triplet");
    if (countPairs() === 2) return combo("Dual Pairs");
    if (countPairs() === 1) return combo("Single Pair");

    return combo("High Dice");
  }
};

function hasSplitLine(values) {
  const sorted = values.slice().sort((a, b) => a - b);

  // Try every combination of two 3-length straights that do not reuse dice values
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      for (let k = j + 1; k < sorted.length; k++) {
        const first = [sorted[i], sorted[j], sorted[k]];
        if (!isConsecutive(first)) continue;

        // Remove the dice used in the first straight (by index, not just value)
        const remaining = [...values];
        for (const val of first) {
          const index = remaining.indexOf(val);
          if (index !== -1) remaining.splice(index, 1);
        }

        // Try to find a second non-overlapping 3-straight in the remaining dice
        remaining.sort((a, b) => a - b);
        for (let a = 0; a < remaining.length; a++) {
          for (let b = a + 1; b < remaining.length; b++) {
            for (let c = b + 1; c < remaining.length; c++) {
              const second = [remaining[a], remaining[b], remaining[c]];
              if (isConsecutive(second)) {
                return true;
              }
            }
          }
        }
      }
    }
  }

  return false;
}

function isConsecutive(arr) {
  return arr[1] === arr[0] + 1 && arr[2] === arr[1] + 1;
}


function hasFiveInARow(values) {
  const unique = [...new Set(values)].sort((a, b) => a - b);
  for (let i = 0; i <= unique.length - 5; i++) {
    let isStraight = true;
    for (let j = 0; j < 4; j++) {
      if (unique[i + j + 1] !== unique[i + j] + 1) {
        isStraight = false;
        break;
      }
    }
    if (isStraight) return true;
  }
  return false;
}

function getFiveInRowValues(values) {
  const unique = [...new Set(values)].sort((a, b) => a - b);
  for (let i = 0; i <= unique.length - 5; i++) {
    const segment = unique.slice(i, i + 5);
    let isStraight = true;
    for (let j = 0; j < 4; j++) {
      if (segment[j + 1] !== segment[j] + 1) {
        isStraight = false;
        break;
      }
    }
    if (isStraight) return segment;
  }
  return [];
}
