setup.CrownAndCaste = {
  // ==========================
  // 1. Core Initialization
  // ==========================

  initSession(playerIds) {
    const maxPlayers = 4;
    const finalIds = playerIds.slice(0, maxPlayers);

    const generatedPlayers = finalIds.map((id, index) => {
      if (id === "ghost") {
        return {
          name: `Ghost ${index + 1}`,
          isGhost: true,
          isPlayer: false,
          gold: 15,
          chips: 3,
          casteDice: [null, null, null],
          locks: [false, false, false],
          combo: null,
          scoreRank: null,
          isEliminated: false,
          bet: 0,
        };
      }

      if (index === 0) {
        return {
          name: id,
          isPlayer: true,
          isGhost: false,
          gold: 15,
          chips: 3,
          casteDice: [null, null, null],
          locks: [false, false, false],
          combo: null,
          scoreRank: null,
          isEliminated: false,
          bet: 0,
        };
      }

      const npc = State.variables.characters?.[id];
      return {
        name: npc?.name || `Unknown (${id})`,
        isGhost: false,
        isPlayer: false,
        npcId: id,
        gold: 15,
        chips: 3,
        casteDice: [null, null, null],
        locks: [false, false, false],
        combo: null,
        scoreRank: null,
        isEliminated: false,
        bet: 0,
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
      pot: 0,
      turnPhase: "betting",
      gamesSinceChipRefresh: 0,
    };

    console.log("[CrownAndCaste] Session initialized:", State.temporary.ccSession);
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

    for (const player of session.players) {
      player.casteDice = [null, null, null];
      player.locks = [false, false, false];
      player.combo = null;
      player.scoreRank = null;
      player.bet = 0;
    }

    setup.CrownAndCaste.collectBets();
    setup.CrownAndCaste.rollCrownDie(0);

    console.log(`[CrownAndCaste] Game ${session.gameNumber} started. First Crown Die rolled.`);
  },

  nextTurn() {
    const session = State.temporary.ccSession;
    const totalPlayers = session.players.length;
    let nextIndex = session.currentPlayerIndex;

    for (let i = 0; i < totalPlayers; i++) {
      nextIndex = (nextIndex + 1) % totalPlayers;
      const candidate = session.players[nextIndex];
      if (!candidate.isEliminated) {
        session.currentPlayerIndex = nextIndex;
        console.log(`[CrownAndCaste] Turn passed to ${candidate.name}.`);
        return;
      }
    }

    console.warn("[CrownAndCaste] No eligible players remaining for next turn.");
  },

  endTurn() {
    const session = State.temporary.ccSession;
    const currentPlayer = session.players[session.currentPlayerIndex];

    if (session.currentRound === 3) {
      currentPlayer.locks = [true, true, true];
    }

    let playersRemaining = session.players.length;
    let nextIndex = session.currentPlayerIndex;

    for (let i = 0; i < playersRemaining; i++) {
      nextIndex = (nextIndex + 1) % playersRemaining;
      const candidate = session.players[nextIndex];
      if (!candidate.isEliminated) {
        session.currentPlayerIndex = nextIndex;

        if (nextIndex === session.dealerIndex) {
          break;
        }

        console.log(`[CrownAndCaste] Next player is ${candidate.name}`);
        return;
      }
    }

    if (session.currentRound < 3) {
      session.currentRound++;
      console.log(`[CrownAndCaste] Advancing to Round ${session.currentRound}`);
      setup.CrownAndCaste.rollCrownDie(session.currentRound - 1);

      let next = session.dealerIndex;
      for (let i = 0; i < playersRemaining; i++) {
        next = (next + 1) % playersRemaining;
        if (!session.players[next].isEliminated) {
          session.currentPlayerIndex = next;
          break;
        }
      }

      return;
    }

    console.log("[CrownAndCaste] Final round completed. Resolving game...");
    setup.CrownAndCaste.resolveGame();
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
        player.casteDice[i] = this.rollDie();
      }
    }

    console.log(`[CrownAndCaste] Rolled Caste Dice for ${player.name}:`, player.casteDice);

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

    player.locks[dieIndex] = !player.locks[dieIndex];

    console.log(`[CrownAndCaste] ${player.name} ${player.locks[dieIndex] ? "locked" : "unlocked"} die ${dieIndex + 1}`);

    if (setup.CrownAndCasteUI?.updateLockDisplay) {
      setup.CrownAndCasteUI.updateLockDisplay(playerIndex, dieIndex, player.locks[dieIndex]);
    }
  },

  rollCrownDie(index) {
    const session = State.temporary.ccSession;

    if (index < 0 || index > 2) {
      console.warn(`[CrownAndCaste] Invalid Crown Die index: ${index}`);
      return;
    }

    if (session.crownProtected || session.crownLocks[index]) {
      console.log(`[CrownAndCaste] Crown Die ${index + 1} is locked and cannot be rerolled.`);
      return;
    }

    const value = this.rollDie();
    session.crownDice[index] = value;

    console.log(`[CrownAndCaste] Crown Die ${index + 1} rolled: ${value}`);

    if (setup.CrownAndCasteUI?.updateCrownDisplay) {
      setup.CrownAndCasteUI.updateCrownDisplay(index, value);
    }
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

    if (!this.canUseControlChip(playerIndex)) return;

    // Deduct chip and gold
    player.chips--;
    const chipCost = 2; // or dynamic
    player.gold = Math.max(0, player.gold - chipCost);

    switch (actionType) {
      case "reroll-own":
        if (player.locks[targetIndex]) {
          player.casteDice[targetIndex] = this.rollDie();
        }
        break;
      case "reroll-other":
        const target = session.players[targetIndex];
        if (target && target.locks) {
          const lockedIndexes = target.locks.map((v, i) => v ? i : null).filter(v => v !== null);
          const rand = lockedIndexes[Math.floor(Math.random() * lockedIndexes.length)];
          target.casteDice[rand] = this.rollDie();
        }
        break;
      case "reroll-crown":
        const unlocked = session.crownLocks.map((v, i) => !v ? i : null).filter(v => v !== null);
        if (unlocked.length > 0) {
          const rand = unlocked[Math.floor(Math.random() * unlocked.length)];
          this.rollCrownDie(rand);
        }
        break;
      case "lock-crown":
        this.lockCrownDice();
        break;
    }
  },

  canUseControlChip(playerIndex) {
    const player = State.temporary.ccSession.players[playerIndex];
    return player.chips > 0;
  },

  // ==========================
  // 4. Scoring & Results
  // ==========================

  resolveGame() {
    const session = State.temporary.ccSession;

    session.players.forEach(p => {
      p.combo = this.evaluateCombos(p);
      p.scoreRank = this.rankCombo(p.combo.name);
    });

    const ranks = session.players.map((p, i) => ({ index: i, rank: p.scoreRank }));
    ranks.sort((a, b) => b.rank - a.rank);

    const topRank = ranks[0].rank;
    const tied = ranks.filter(r => r.rank === topRank);

    let winnerIndex = tied.length > 1 ? this.breakTie(tied.map(r => r.index)) : tied[0].index;

    this.adjustGold(winnerIndex, session.pot);

    // Advance game state
    session.gameNumber++;
    session.gamesSinceChipRefresh++;
    this.advanceDealer();

    if (session.gamesSinceChipRefresh >= 3) {
      this.refreshControlChips();
      session.gamesSinceChipRefresh = 0;
    }

    this.checkElimination();
  },

  evaluateCombos(player) {
    // Returns { name: "Combo Name", usedDice: [indexes], rank: 1 }
    return setup.CrownAndCasteCombos.evaluate(player.casteDice, State.temporary.ccSession.crownDice);
  },

  rankCombo(name) {
    return setup.CrownAndCasteCombos.rankIndex(name);
  },

  breakTie(indices) {
    // Implement tie-break logic
    return indices[Math.floor(Math.random() * indices.length)]; // placeholder
  },

  // ==========================
  // 5. Betting & Pot
  // ==========================

  collectBets() {
    const session = State.temporary.ccSession;
    session.players.forEach(p => {
      const bet = 3; // placeholder until betting UI
      p.gold -= bet;
      p.bet = bet;
      session.pot += bet;
    });
  },

  adjustGold(playerIndex, amount) {
    const player = State.temporary.ccSession.players[playerIndex];
    player.gold += amount;
  },

  // ==========================
  // 6. Session Management
  // ==========================

  advanceDealer() {
    const session = State.temporary.ccSession;
    session.dealerIndex = (session.dealerIndex - 1 + session.players.length) % session.players.length;
  },

  refreshControlChips() {
    const session = State.temporary.ccSession;
    session.players.forEach(p => p.chips = 3);
  },

  checkElimination() {
    const session = State.temporary.ccSession;
    session.players.forEach(p => {
      if (p.gold <= 0) p.isEliminated = true;
    });
  },

  // ==========================
  // 7. Helpers
  // ==========================

  rollDie() {
    return Math.ceil(Math.random() * 8); // d8
  },

  logSessionState() {
    console.log(JSON.stringify(State.temporary.ccSession, null, 2));
  }
};
