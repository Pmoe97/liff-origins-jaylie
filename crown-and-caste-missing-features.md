# Crown & Caste Missing Features Analysis

## 1. Missing House Rules Implementation

**Current Status**: Framework exists but specific rules not implemented

**Missing House Rules:**
- **Wild Winds**: "Dealer may reroll one locked die anywhere per round"
- **Golden Tax**: "Chips cost +1g" 
- **Blessing of Sixes**: "Triple 6 auto-wins"
- **Royal Flush**: "Straights must be made entirely from Crown Dice"

**Implementation Needed:**
```javascript
// In useControlChip(), add Golden Tax check:
if (this.hasHouseRule("golden-tax")) {
  chipCost += 1;
}

// In resolveGame(), add Blessing of Sixes check:
session.players.forEach((p, i) => {
  const hasTripleSix = p.casteDice.filter(d => d === 6).length === 3;
  if (hasTripleSix && this.hasHouseRule("blessing-of-sixes")) {
    p.combo = { name: "Blessing of Sixes", rank: 999 }; // Auto-win
  }
});

// In combo evaluation, add Royal Flush validation:
if (this.hasHouseRule("royal-flush") && (comboName === "Octline" || comboName === "Split Line")) {
  // Check if straight uses only Crown Dice (indices 3, 4, 5)
  const usesOnlyCrownDice = combo.usedDice.every(i => i >= 3);
  if (!usesOnlyCrownDice) {
    return combo("High Dice"); // Invalidate straight
  }
}
```

## 2. Missing Dealer Special Actions

**Rule**: "Dealer may choose Crown Dice from inventory when applicable"

**Current Status**: Not implemented - dealers just roll random dice

**Implementation Needed:**
```javascript
// Add inventory system for Crown Dice
rollCrownDie(index, chosenValue = null) {
  const session = State.temporary.ccSession;
  const isDealer = session.currentPlayerIndex === session.dealerIndex;
  
  if (chosenValue && isDealer && this.hasInventoryDie(chosenValue)) {
    session.crownDice[index] = chosenValue;
    this.removeFromInventory(chosenValue);
  } else {
    const value = this.rollDie();
    session.crownDice[index] = value;
  }
}
```

## 3. Incomplete Turn Phase Management

**Rule**: "In each Round: 1. Dealer rolls Crown Die, 2. Players act in clockwise order, 3. Next Crown Die rolled"

**Current Issue**: Turn progression doesn't clearly separate these phases

**Implementation Needed:**
```javascript
// Add proper phase management
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
}
```

## 4. Missing Combo Validation

**Issue**: Some combos in RANKS array don't match rulebook exactly

**Corrections Needed:**
```javascript
RANKS: [
  "High Dice",           // 15
  "Single Pair",         // 14  
  "Dual Pairs",          // 13
  "Triplet",             // 12
  "Tri-Crown",           // 11
  "Line of Five Unpaired", // 10
  "Jester's Court",      // 9
  "Courtesan's Quad",      // 8 (should be "Courtesan's Quad")
  "Line of Five Paired", // 7
  "Split Line",          // 6
  "Octline",             // 5
  "Courtly Quad",        // 4
  "Royal Spread",        // 3
  "Fivefold Glory",      // 2
  "Imperial Crown"       // 1
]
```

## 5. Missing Automatic Dice Locking

**Rule**: "Dice are automatically locked at the end of Round 3"

**Current Status**: Only locks current player's dice in endTurn()

**Fix Needed:**
```javascript
// In endTurn(), when round 3 ends:
if (session.currentRound === 3) {
  // Lock ALL players' dice, not just current player
  session.players.forEach(p => {
    if (!p.isEliminated) {
      p.locks = [true, true, true];
    }
  });
  
  // Also lock all Crown Dice
  session.crownLocks = [true, true, true];
  session.crownProtected = true;
}
```

## 6. Missing Control Chip Usage Limits

**Rule**: "Chips may be used once per turn"

**Current Status**: No enforcement of once-per-turn limit

**Implementation Needed:**
```javascript
// Add turn tracking for chip usage
useControlChip(playerIndex, actionType, targetIndex = null) {
  const session = State.temporary.ccSession;
  const player = session.players[playerIndex];
  
  // Check if player already used chip this turn
  if (player.usedChipThisTurn) {
    console.warn(`[CrownAndCaste] ${player.name} already used a Control Chip this turn.`);
    return;
  }
  
  // ... existing chip logic ...
  
  // Mark chip as used this turn
  player.usedChipThisTurn = true;
}

// Reset chip usage flags when turn advances
nextTurn() {
  const session = State.temporary.ccSession;
  const currentPlayer = session.players[session.currentPlayerIndex];
  currentPlayer.usedChipThisTurn = false;
  
  // ... existing turn logic ...
}
```

## 7. Missing Session vs Game Distinction

**Rule**: "Control Chips reset between Sessions" (not between games)

**Current Status**: Chips reset every 3 games, but no session management

**Implementation Needed:**
```javascript
// Add session management
endSession() {
  const session = State.temporary.ccSession;
  
  // Reset all chips at session end
  session.players.forEach(p => {
    if (!p.isEliminated) {
      p.chips = 3;
    }
  });
  
  console.log("[CrownAndCaste] Session ended. All Control Chips reset.");
}

// Separate from the 3-game refresh which should remain
```

## 8. Missing Betting Validation

**Rule**: "Each Game begins with a blind bet (min 3g, max 10g)"

**Current Status**: collectBets() still uses auto-betting as fallback

**Fix Needed**: Remove auto-betting entirely and require manual betting:
```javascript
startGame() {
  // ... existing setup ...
  
  // Don't auto-collect bets - require manual betting phase
  this.initiateBetting();
  // Remove: setup.CrownAndCaste.collectBets();
}
