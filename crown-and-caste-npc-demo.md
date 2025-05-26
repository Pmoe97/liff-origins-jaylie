# Crown and Caste NPC AI System - Demo Guide

## Overview

I've successfully implemented a comprehensive NPC AI system for your Crown and Caste minigame. The NPCs now make intelligent decisions based on their personality traits, game state, and strategic considerations.

## Key Features Added

### 1. **Personality-Based Decision Making**
NPCs extract personality traits from your existing character data:
- **Aggression**: How likely they are to bet high and use control chips aggressively
- **Risk**: Willingness to take chances vs. playing conservatively  
- **Confidence**: Affects betting amounts and chip usage
- **Cunning**: Influences strategic thinking and sabotage decisions

### 2. **Intelligent Betting System**
- NPCs automatically place bets based on personality and gold reserves
- Aggressive characters bet higher amounts
- Conservative characters bet minimum when low on gold
- Adds realistic variance to betting patterns

### 3. **Strategic Dice Management**
- NPCs analyze their hands for pairs, triplets, and straight potential
- Lock high-value dice (7-8) strategically
- Consider combo potential when deciding whether to reroll
- Adapt strategy based on current round and risk tolerance

### 4. **Smart Control Chip Usage**
NPCs intelligently use control chips for:
- **Rerolling own locked dice** when they have poor hands
- **Sabotaging opponents** with good hands (aggressive personalities)
- **Protecting the crown** in later rounds
- **Resource management** based on chip count and personality

### 5. **Threat Assessment**
NPCs evaluate other players based on:
- Gold reserves compared to average
- Hand strength and combo potential
- Number of control chips remaining
- Average die values

## Character Examples

### Mistress Adda (Dominant, Wise, Seductive)
- **High aggression & confidence**: Bets aggressively, uses chips strategically
- **Moderate risk**: Balances conservative play with bold moves
- **High cunning**: Excellent at identifying and sabotaging threats

### Marie (Introverted, Guarded, Submissive)  
- **Low aggression & confidence**: Conservative betting, minimal chip usage
- **Low risk**: Locks dice early, avoids confrontation
- **Defensive play**: Focuses on protecting own hand rather than sabotage

### Tesska (Flirty, Crude, Confident)
- **High aggression**: Aggressive betting and chip usage
- **High risk**: Willing to gamble for better combos
- **Confrontational**: Actively targets strong opponents

## Technical Implementation

### Automatic NPC Actions
- NPCs act automatically when it's their turn
- 1-2.5 second delays for realistic pacing
- UI updates smoothly after NPC actions
- Console logging for debugging and transparency

### Integration with Existing Systems
- Uses your existing character trait system
- Leverages current game logic and combo evaluation
- Maintains all existing house rules and mechanics
- Seamless integration with UI and game flow

## Usage

The system works automatically once you start a Crown and Caste game with NPCs. No additional setup required!

```javascript
// Example: Start a game with NPCs
setup.CrownAndCaste.initSession(['player', 'adda', 'marie', 'tesska']);
setup.CrownAndCaste.startGame();
setup.CrownAndCasteUI.renderMinigame();
```

## Benefits

1. **Immersive Experience**: NPCs feel like real opponents with distinct personalities
2. **Strategic Depth**: Each character plays differently based on their traits
3. **Smooth Gameplay**: Automatic actions keep the game flowing naturally
4. **Balanced Challenge**: NPCs provide appropriate difficulty without being overpowered
5. **Character Consistency**: NPC behavior matches their established personalities

## Future Enhancements

The system is designed to be easily expandable:
- Add more personality factors
- Implement learning from player behavior
- Create difficulty levels
- Add character-specific special abilities
- Implement bluffing and psychological tactics

Your Crown and Caste minigame now provides a truly engaging single-player experience that feels like playing with three intelligent opponents!
