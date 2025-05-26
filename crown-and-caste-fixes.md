# Crown & Caste Implementation Fixes

## 1. Add Dealer Restrictions

```javascript
// In useControlChip() function, add this check at the beginning:
if (playerIndex === session.dealerIndex) {
  console.warn(`[CrownAndCaste] Dealer cannot use Control Chips.`);
  return;
}

// In canUseControlChip() function, add this check:
if (playerIndex === session.dealerIndex) {
  console.log(`[CrownAndCaste] Dealer cannot use Control Chips.`);
  return false;
}

// In useControlChip() for "reroll-other" action, add this check:
if (targetIndex === session.dealerIndex) {
  console.warn("[CrownAndCaste] Cannot target dealer with Control Chips.");
  return;
}
```

## 2. Fix Turn Order Logic

```javascript
// Add a helper function to determine clockwise order
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

// Update nextTurn() to use this helper
nextTurn() {
  const session = State.temporary.ccSession;
  const nextIndex = this.getNextPlayerClockwise(session.currentPlayerIndex);
  
  if (nextIndex === -1) {
    console.warn("[CrownAndCaste] No eligible players remaining for next turn.");
    return;
  }
  
  session.currentPlayerIndex = nextIndex;
  console.log(`[CrownAndCaste] Turn passed to ${session.players[nextIndex].name}.`);
}
```

## 3. Implement Proper Betting Phase

```javascript
// Add betting phase management
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
}
```

## 4. Add Stakes-Based Chip Costs

```javascript
// Add stakes configuration to session initialization
initSession(playerIds, stakes = "standard") {
  // ... existing code ...
  
  State.temporary.ccSession = {
    // ... existing properties ...
    stakes: stakes,
    chipCost: this.getChipCost(stakes)
  };
},

getChipCost(stakes) {
  switch (stakes.toLowerCase()) {
    case "low": return 2;
    case "standard": return 3;
    case "high": return 5;
    default: return 3;
  }
},

// Update useControlChip to use dynamic cost
useControlChip(playerIndex, actionType, targetIndex = null) {
  // ... existing validation ...
  
  const chipCost = session.chipCost; // Use dynamic cost instead of hard-coded 2
  
  // ... rest of function ...
}
```

## 5. Fix Combo Evaluation

```javascript
// In CrownAndCasteCombos.evaluate(), add proper Line of Five handling
evaluate(diceArray) {
  // ... existing code until Line of Five check ...
  
  if (hasFiveInARow(values)) {
    const sixthDie = values.find(v => !isPartOfFiveInARow(v, values));
    const fiveInRowValues = getFiveInRowValues(values);
    
    if (fiveInRowValues.includes(sixthDie)) {
      return combo("Line of Five Paired");
    } else {
      return combo("Line of Five Unpaired");
    }
  }
  
  // ... rest of function ...
}

// Helper functions for Line of Five detection
function hasFiveInARow(values) {
  const unique = [...new Set(values)].sort((a, b) => a - b);
  for (let i = 0; i <= unique.length - 5; i++) {
    let consecutive = true;
    for (let j = i; j < i + 4; j++) {
      if (unique[j + 1] !== unique[j] + 1) {
        consecutive = false;
        break;
      }
    }
    if (consecutive) return true;
  }
  return false;
}
```

## 6. Add House Rules Configuration

```javascript
// Add house rules to session
initSession(playerIds, stakes = "standard", houseRules = []) {
  // ... existing code ...
  
  State.temporary.ccSession = {
    // ... existing properties ...
    houseRules: houseRules
  };
},

// Add house rule checks
hasHouseRule(ruleName) {
  const session = State.temporary.ccSession;
  return session.houseRules && session.houseRules.includes(ruleName);
},

// Example usage in rollCasteDice
rollCasteDice(playerIndex) {
  // ... existing code ...
  
  // Check Cutthroat Caste house rule
  if (this.hasHouseRule("cutthroat-caste")) {
    const player = session.players[playerIndex];
    const hasLockedDie = player.locks.some(lock => lock);
    
    if (!hasLockedDie) {
      console.warn(`[CrownAndCaste] Cutthroat Caste: ${player.name} must lock at least one die.`);
      // Force lock the first die or implement UI prompt
    }
  }
}
