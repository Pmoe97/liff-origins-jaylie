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
  
    if (!player || player.isEliminated) {
      console.warn(`[CrownAndCaste] Invalid or eliminated player for chip use.`);
      return;
    }
  
    if (player.chips <= 0) {
      console.warn(`[CrownAndCaste] Player ${player.name} has no Control Chips left.`);
      return;
    }
  
    // Chip cost logic (adjustable per tavern if needed)
    const chipCost = 2;
    const actualCost = Math.min(chipCost, player.gold); // Fortune’s Mercy rule
    player.gold -= actualCost;
    player.chips--;
  
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
        const targetPlayer = session.players[targetIndex];
        if (
          !targetPlayer ||
          targetPlayer.isEliminated ||
          targetIndex === playerIndex
        ) {
          console.warn("[CrownAndCaste] Invalid target for reroll-other.");
          return;
        }
  
        const lockedDice = targetPlayer.locks.map((v, i) => v ? i : null).filter(i => i !== null);
        if (lockedDice.length === 0) {
          console.warn(`[CrownAndCaste] Target player ${targetPlayer.name} has no locked dice.`);
          return;
        }
  
        const dieToReroll = lockedDice[Math.floor(Math.random() * lockedDice.length)];
        targetPlayer.casteDice[dieToReroll] = this.rollDie();
        console.log(`[CrownAndCaste] ${player.name} rerolled ${targetPlayer.name}'s locked die ${dieToReroll + 1}.`);
        break;
      }
  
      case "reroll-crown": {
        if (session.crownProtected) {
          console.warn("[CrownAndCaste] Crown Dice are protected. Cannot reroll.");
          return;
        }
  
        const unlockedCrown = session.crownLocks.map((v, i) => !v ? i : null).filter(i => i !== null);
        if (unlockedCrown.length === 0) {
          console.warn("[CrownAndCaste] No unlocked Crown Dice available to reroll.");
          return;
        }
  
        const dieToReroll = unlockedCrown[Math.floor(Math.random() * unlockedCrown.length)];
        this.rollCrownDie(dieToReroll);
        console.log(`[CrownAndCaste] ${player.name} rerolled Crown Die ${dieToReroll + 1}.`);
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
  
    // Optional UI sync
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
      p.combo = this.evaluateCombos(p); // { name, details? }
      p.scoreRank = this.rankCombo(p.combo.name);
      console.log(`[CrownAndCaste] ${p.name}'s combo: ${p.combo.name} (Rank ${p.scoreRank})`);
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
    session.gameNumber++;
    session.gamesSinceChipRefresh++;
    this.advanceDealer();
  
    if (session.gamesSinceChipRefresh >= 3) {
      this.refreshControlChips();
      session.gamesSinceChipRefresh = 0;
      console.log("[CrownAndCaste] All control chips have been refreshed.");
    }
  
    this.checkElimination();
  
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
  
    // 1. Compare highest combo value (e.g., triple 8s > triple 7s)
    let topComboValue = -1;
    let strongest = [];
  
    for (const c of candidates) {
      const combo = c.player.combo;
      if (!combo || !combo.usedDice || !combo.usedDice.length) continue;
  
      // Determine max die value within the combo
      const fullDice = c.player.casteDice.concat(session.crownDice);
      const comboDice = combo.usedDice.map(i => fullDice[i]);
      const highest = Math.max(...comboDice);
  
      if (highest > topComboValue) {
        topComboValue = highest;
        strongest = [c];
      } else if (highest === topComboValue) {
        strongest.push(c);
      }
    }
  
    if (strongest.length === 1) return strongest[0].index;
  
    // 2. Compare most Caste Dice used in the combo
    let maxCasteCount = -1;
    let casteStrongest = [];
  
    for (const c of strongest) {
      const combo = c.player.combo;
      const count = combo.usedDice.filter(i => i < 3).length; // caste dice = indexes 0–2
      if (count > maxCasteCount) {
        maxCasteCount = count;
        casteStrongest = [c];
      } else if (count === maxCasteCount) {
        casteStrongest.push(c);
      }
    }
  
    if (casteStrongest.length === 1) return casteStrongest[0].index;
  
    // 3. Compare total of unused dice
    let highestLeftover = -1;
    let finalists = [];
  
    for (const c of casteStrongest) {
      const combo = c.player.combo;
      const fullDice = c.player.casteDice.concat(session.crownDice);
      const unused = fullDice.filter((_, i) => !combo.usedDice.includes(i));
      const total = unused.reduce((a, b) => a + b, 0);
  
      if (total > highestLeftover) {
        highestLeftover = total;
        finalists = [c];
      } else if (total === highestLeftover) {
        finalists.push(c);
      }
    }
  
    if (finalists.length === 1) return finalists[0].index;
  
    // 4. Sudden-death roll
    const rolled = finalists.map(f => ({
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
  
      // Apply Fortune’s Mercy if they can't afford minimum
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
  

  checkElimination() {
    const session = State.temporary.ccSession;
  
    session.players.forEach(p => {
      if (!p.isEliminated && p.gold <= 0) {
        p.isEliminated = true;
        console.log(`[CrownAndCaste] ${p.name} has been eliminated (0g remaining).`);
      }
    });
  },
  
  // ==========================
  // 7. Helpers
  // ==========================

  rollDie() {
    const value = Math.ceil(Math.random() * 8); // d8
    console.log(`[CrownAndCaste] Rolled die: ${value}`);
    return value;
  },
  

  logSessionState() {
    console.log("[CrownAndCaste] Current session state:");
    console.log(JSON.stringify(State.temporary.ccSession, null, 2));
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
    "Line of Five",
    "Jester’s Court",
    "Courtesan's Quad",
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
    if (countPairs() === 3) return combo("Jester’s Court");
    if (isStraight(5)) return combo("Line of Five");
    if (countValues.includes(3) && countValues.includes(2)) return combo("Tri-Crown");
    if (countValues[0] === 3) return combo("Triplet");
    if (countPairs() === 2) return combo("Dual Pairs");
    if (countPairs() === 1) return combo("Single Pair");

    return combo("High Dice");
  }
};

function hasSplitLine(values) {
  const unique = [...new Set(values)].sort((a, b) => a - b);
  const straights = [];

  for (let i = 0; i <= unique.length - 3; i++) {
    const a = unique[i], b = unique[i + 1], c = unique[i + 2];
    if (b === a + 1 && c === b + 1) {
      straights.push([a, b, c]);
    }
  }

  return straights.length >= 2;
}
