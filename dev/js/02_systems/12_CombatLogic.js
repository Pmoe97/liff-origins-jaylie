// Combat System Core Logic

window.CombatSystem = {
    // Combat state
    state: {
        active: false,
        turn: 0,
        turnOrder: [],
        currentTurnIndex: 0,
        combatLog: [],
        enemies: [],
        allies: [],
        battlefield: {
            terrain: "normal",
            weather: "clear",
            lighting: "normal"
        }
    },

    // Initialize combat
    initCombat(enemies, allies = null) {
        this.state.active = true;
        this.state.turn = 0;
        this.state.enemies = enemies.map(e => this.createCombatant(e, 'enemy'));
        this.state.allies = allies || [this.createPlayerCombatant()];
        this.state.combatLog = [];
        
        this.calculateInitiative();
        this.addToLog("Combat begins!", "system");
        return this.state;
    },

    // Create combatant from character data
    createCombatant(data, type) {
        return {
            id: data.id || Date.now() + Math.random(),
            name: data.name,
            type: type,
            level: data.level || 1,
            
            // Combat stats
            hp: data.hp || 100,
            maxHp: data.maxHp || 100,
            mp: data.mp || 50,
            maxMp: data.maxMp || 50,
            stamina: data.stamina || 100,
            maxStamina: data.maxStamina || 100,
            excitement: data.excitement || 0,
            maxExcitement: data.maxExcitement || 100,
            
            // Attributes
            attributes: data.attributes || {
                strength: 10,
                agility: 10,
                toughness: 10,
                charisma: 10,
                intelligence: 10,
                insight: 10
            },
            
            // Combat modifiers
            initiative: 0,
            armor: data.armor || 0,
            evasion: data.evasion || 10,
            accuracy: data.accuracy || 85,
            
            // Status effects
            statusEffects: [],
            
            // Tease preferences (for enemies)
            teasePreferences: data.teasePreferences || this.generateTeasePreferences(),
            
            // Equipment/abilities
            equipment: data.equipment || {},
            abilities: data.abilities || [],
            
            // AI behavior
            aiType: data.aiType || "aggressive",
            targetPriority: data.targetPriority || "lowest_hp"
        };
    },

    // Create player combatant from player data
    createPlayerCombatant() {
        const player = State.variables.player;
        return {
            id: "player",
            name: player.name,
            type: "ally",
            level: player.level,
            
            hp: player.status.health,
            maxHp: player.status.maxHealth,
            mp: player.status.mana || 50,
            maxMp: player.status.maxMana || 50,
            stamina: player.status.fatigue,
            maxStamina: player.status.maxFatigue,
            excitement: player.status.excitement,
            maxExcitement: player.status.maxExcitement,
            
            attributes: player.attributes,
            
            initiative: 0,
            armor: this.calculatePlayerArmor(),
            evasion: 10 + Math.floor(player.attributes.agility / 2),
            accuracy: 85 + Math.floor(player.attributes.insight / 3),
            
            statusEffects: [],
            equipment: player.equipment,
            abilities: this.getPlayerAbilities(),
            
            isPlayer: true
        };
    },

    // Generate random tease preferences for enemies
    generateTeasePreferences() {
        const bodyParts = ['lips', 'breasts', 'thighs', 'hips', 'eyes', 'hair'];
        const preferences = {};
        
        bodyParts.forEach(part => {
            preferences[part] = Math.random() * 2; // 0-2 multiplier
        });
        
        return preferences;
    },

    // Calculate initiative order
    calculateInitiative() {
        const allCombatants = [...this.state.allies, ...this.state.enemies];
        
        allCombatants.forEach(combatant => {
            combatant.initiative = this.rollDice(20) + Math.floor(combatant.attributes.agility / 2);
        });
        
        this.state.turnOrder = allCombatants.sort((a, b) => b.initiative - a.initiative);
        this.state.currentTurnIndex = 0;
    },

    // Get current combatant
    getCurrentCombatant() {
        return this.state.turnOrder[this.state.currentTurnIndex];
    },

    // Process turn
    processTurn(action, target = null) {
        const actor = this.getCurrentCombatant();
        
        if (!actor || actor.hp <= 0) {
            this.nextTurn();
            return;
        }
        
        // Process start of turn effects
        this.processStatusEffects(actor, 'start');
        
        // Execute action
        switch(action.type) {
            case 'attack':
                this.processAttack(actor, target, action.weaponType);
                break;
            case 'tease':
                this.processTease(actor, target, action.bodyPart);
                break;
            case 'ability':
                this.processAbility(actor, target, action.ability);
                break;
            case 'magic':
                this.processMagic(actor, target, action.spell);
                break;
            case 'item':
                this.processItem(actor, target, action.item);
                break;
            case 'defend':
                this.processDefend(actor);
                break;
            case 'dodge':
                this.processDodge(actor);
                break;
            case 'run':
                this.processRun(actor);
                break;
            case 'surrender':
                this.processSurrender(actor);
                break;
        }
        
        // Process end of turn effects
        this.processStatusEffects(actor, 'end');
        
        // Check battle end conditions
        if (this.checkBattleEnd()) {
            return;
        }
        
        // Next turn
        this.nextTurn();
    },

    // Attack processing
    processAttack(attacker, defender, weaponType = 'unarmed') {
        if (!defender || defender.hp <= 0) return;
        
        // Hit calculation
        const hitChance = attacker.accuracy - defender.evasion + this.rollDice(20);
        
        if (hitChance < 10) {
            this.addToLog(`${attacker.name} misses ${defender.name}!`, "miss");
            return;
        }
        
        // Damage calculation
        let damage = this.calculateDamage(attacker, weaponType);
        
        // Critical hit check
        const critRoll = this.rollDice(100);
        if (critRoll >= 95) {
            damage *= 2;
            this.addToLog(`Critical hit!`, "critical");
        }
        
        // Apply armor reduction
        damage = Math.max(1, damage - defender.armor);
        
        // Apply damage
        defender.hp = Math.max(0, defender.hp - damage);
        
        this.addToLog(`${attacker.name} attacks ${defender.name} for ${damage} damage!`, "damage");
        
        // Check if defender defeated
        if (defender.hp <= 0) {
            this.handleDefeat(defender);
        }
    },

    // Tease processing
    processTease(teaser, target, bodyPart) {
        if (!target || target.hp <= 0 || target.excitement >= target.maxExcitement) return;
        
        // Calculate tease effectiveness
        const charismaBonus = Math.floor(teaser.attributes.charisma / 2);
        const preference = target.teasePreferences[bodyPart] || 1;
        const baseExcitement = this.rollDice(10) + 5;
        
        let excitementGain = Math.floor(baseExcitement * preference + charismaBonus);
        
        // Apply excitement
        target.excitement = Math.min(target.maxExcitement, target.excitement + excitementGain);
        
        // Narrative based on effectiveness
        if (preference > 1.5) {
            this.addToLog(`${teaser.name} teases ${target.name} with their ${bodyPart}. They seem very affected!`, "tease-effective");
        } else if (preference < 0.5) {
            this.addToLog(`${teaser.name} teases ${target.name} with their ${bodyPart}, but it doesn't seem very effective.`, "tease-weak");
        } else {
            this.addToLog(`${teaser.name} teases ${target.name} with their ${bodyPart}.`, "tease");
        }
        
        this.addToLog(`${target.name}'s excitement increases by ${excitementGain}!`, "excitement");
        
        // Check if target is overcome by excitement
        if (target.excitement >= target.maxExcitement) {
            this.handleExcitementDefeat(target);
        }
    },

    // Calculate damage
    calculateDamage(attacker, weaponType) {
        const strengthBonus = Math.floor(attacker.attributes.strength / 2);
        const weaponDamage = this.getWeaponDamage(weaponType);
        const baseDamage = this.rollDice(weaponDamage.dice, weaponDamage.sides) + weaponDamage.bonus;
        
        return baseDamage + strengthBonus;
    },

    // Get weapon damage stats
    getWeaponDamage(weaponType) {
        const weapons = {
            unarmed: { dice: 1, sides: 4, bonus: 0 },
            dagger: { dice: 1, sides: 6, bonus: 2 },
            sword: { dice: 1, sides: 8, bonus: 3 },
            axe: { dice: 1, sides: 10, bonus: 2 },
            mace: { dice: 1, sides: 8, bonus: 4 },
            staff: { dice: 1, sides: 6, bonus: 1 },
            bow: { dice: 1, sides: 8, bonus: 2 }
        };
        
        return weapons[weaponType] || weapons.unarmed;
    },

    // Handle defeat
    handleDefeat(combatant) {
        this.addToLog(`${combatant.name} has been defeated!`, "defeat");
        combatant.isDefeated = true;
        
        // Remove from turn order
        const index = this.state.turnOrder.indexOf(combatant);
        if (index > -1) {
            this.state.turnOrder.splice(index, 1);
            if (this.state.currentTurnIndex >= index && this.state.currentTurnIndex > 0) {
                this.state.currentTurnIndex--;
            }
        }
    },

    // Handle excitement defeat
    handleExcitementDefeat(combatant) {
        this.addToLog(`${combatant.name} is overcome by excitement and can no longer fight!`, "excitement-defeat");
        combatant.isSeduced = true;
        this.handleDefeat(combatant);
    },

    // Process status effects
    processStatusEffects(combatant, phase) {
        combatant.statusEffects.forEach(effect => {
            if (effect.phase === phase) {
                this.applyStatusEffect(combatant, effect);
            }
        });
        
        // Remove expired effects
        combatant.statusEffects = combatant.statusEffects.filter(effect => {
            if (effect.duration !== undefined) {
                effect.duration--;
                return effect.duration > 0;
            }
            return true;
        });
    },

    // Check battle end conditions
    checkBattleEnd() {
        const aliveAllies = this.state.allies.filter(a => a.hp > 0);
        const aliveEnemies = this.state.enemies.filter(e => e.hp > 0 && !e.isSeduced);
        
        if (aliveAllies.length === 0) {
            this.endCombat('defeat');
            return true;
        }
        
        if (aliveEnemies.length === 0) {
            this.endCombat('victory');
            return true;
        }
        
        return false;
    },

    // End combat
    endCombat(result) {
        this.state.active = false;
        this.addToLog(`Combat ends in ${result}!`, "system");
        
        // Process rewards/consequences
        if (result === 'victory') {
            this.processVictory();
        } else if (result === 'defeat') {
            this.processDefeat();
        }
        
        // Update player stats
        this.updatePlayerStats();
    },

    // Next turn
    nextTurn() {
        this.state.currentTurnIndex++;
        if (this.state.currentTurnIndex >= this.state.turnOrder.length) {
            this.state.currentTurnIndex = 0;
            this.state.turn++;
        }
    },

    // Utility functions
    rollDice(count, sides = 20) {
        let total = 0;
        for (let i = 0; i < count; i++) {
            total += Math.floor(Math.random() * sides) + 1;
        }
        return total;
    },

    addToLog(message, type = "normal") {
        this.state.combatLog.push({
            message: message,
            type: type,
            turn: this.state.turn,
            timestamp: Date.now()
        });
    },

    // Get available actions for current combatant
    getAvailableActions(combatant) {
        const actions = ['attack', 'defend', 'dodge'];
        
        if (combatant.isPlayer || combatant.attributes.charisma > 5) {
            actions.push('tease');
        }
        
        if (combatant.abilities && combatant.abilities.length > 0) {
            actions.push('abilities');
        }
        
        if (combatant.mp > 0) {
            actions.push('magic');
        }
        
        if (combatant.isPlayer) {
            actions.push('inventory', 'run', 'surrender');
        }
        
        return actions;
    }
};
