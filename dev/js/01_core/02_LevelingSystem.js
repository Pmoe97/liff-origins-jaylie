/* ==============================
   LEVELING SYSTEM CORE
   ============================== */

// XP curve configuration
const XP_CURVES = {
    // Character level XP requirements (Level 1–100)
    character: {
        base: 15, // XP needed for level 1
        multiplier: 1.0532, // ~5.32% increase per level. Full cumulative XP requirement for level 100 is ~50,000 XP
        formula: (level) => Math.floor(15 * Math.pow(1.0532, level - 1))
    },
    // Skill XP requirements (0-100 skill value)
    skill: {
        base: 20,
        multiplier: 1.0403, // Skills level slightly faster than character. Full cumulative XP requirement for a single skill is ~25,000 XP
        formula: (skillLevel) => Math.floor(20 * Math.pow(1.0403, Math.floor(skillLevel / 10)))
    }
};

// Skill categories for organization
const SKILL_CATEGORIES = {
    combat: {
        weapons: ['swords', 'polearms', 'blunt', 'axes', 'daggers', 'unarmed', 'bows', 'thrown'],
        armor: ['unarmored', 'lightArmor', 'mediumArmor', 'heavyArmor']
    },
    primary: ['athletics', 'acrobatics', 'sleightOfHand', 'stealth', 'fortitude', 'willpower', 
              'deception', 'intimidation', 'performance', 'persuasion', 'magic', 'investigation', 
              'religion', 'history', 'perception', 'survival', 'medicine'],
    secondary: {
        general: ['riding', 'dancing', 'swimming', 'cleaning', 'disguise'],
        sexual: ['hands', 'mouth', 'breasts', 'vagina', 'anus']
    }
};

// XP rewards configuration
const XP_REWARDS = {
    // Skill XP for various actions
    skillUse: {
        combat: {
            hit: 2,      // Successfully hitting an enemy
            kill: 10,    // Killing an enemy
            block: 3,    // Successfully blocking/parrying
            critical: 5  // Critical hit
        },
        primary: {
            success: 5,      // Successful skill check
            failure: 1,      // Failed skill check (learn from mistakes)
            critical: 10     // Critical success
        },
        secondary: {
            practice: 3,     // General practice/use
            success: 5,      // Successful use
            masterful: 10    // Exceptional performance
        }
    },
    // Character XP from skill advancement
    skillLevelUp: {
        primary: 25,      // XP gained when primary skill levels up
        secondary: 15,    // XP gained when secondary skill levels up
        combat: 20        // XP gained when combat skill levels up
    },
    // Direct character XP rewards
    combat: {
        easy: 10,
        medium: 25,
        hard: 50,
        boss: 100
    },
    quest: {
        minor: 50,
        major: 200,
        main: 500
    }
};

// Skill tier names for clarity
const SKILL_TIERS = {
    0: "Novice",      // 0-19
    1: "Apprentice",  // 20-39
    2: "Journeyman",  // 40-59
    3: "Expert",      // 60-79
    4: "Master",      // 80-99
    5: "Grandmaster"  // 100
};

// Event hooks registry
const LEVELING_HOOKS = {
    onXPChange: [],
    onSkillChange: [],
    onLevelChange: [],
    onAttributeChange: []
};

// Initialize leveling system
setup.LevelingSystem = {
    // Expose XP curves for external use
    get XP_CURVES() {
        return XP_CURVES;
    },
    
    // Add XP to a specific skill
    addSkillXP(skillCategory, skillName, amount) {
        const player = State.variables.player;
        let skill;
        
        // Find the skill in the appropriate category
        if (skillCategory === 'primary') {
            skill = player.primarySkills[skillName];
        } else if (skillCategory === 'secondary') {
            skill = player.secondarySkills[skillName];
        } else if (skillCategory === 'combat') {
            if (!player.combatSkills) {
                console.error('Combat skills not initialized');
                return;
            }
            skill = player.combatSkills[skillName];
        }
        
        if (!skill) {
            console.error(`Skill ${skillName} not found in category ${skillCategory}`);
            return;
        }
        
        const oldValue = skill.value;
        const oldTier = Math.floor(oldValue / 20); // Skills have 5 tiers (0-20, 20-40, etc)
        const oldXP = skill.xp;
        
        // Add XP
        skill.xp += amount;
        
        // Fire XP change hook
        this.fireHook('onXPChange', {
            type: 'skill',
            category: skillCategory,
            skillName: skillName,
            oldXP: oldXP,
            newXP: skill.xp,
            change: amount
        });
        
        // Calculate XP needed for next skill point
        let xpNeeded = XP_CURVES.skill.formula(skill.value);
        
        // Level up skill if enough XP
        while (skill.xp >= xpNeeded && skill.value < 100) {
            skill.xp -= xpNeeded;
            skill.value++;
            
            // Recalculate XP needed for next level
            xpNeeded = XP_CURVES.skill.formula(skill.value);
        }
        
        // Cap skill value at 100
        if (skill.value > 100) {
            skill.value = 100;
        }
        
        // Check if we crossed a tier threshold
        const newTier = Math.floor(skill.value / 20);
        if (newTier > oldTier && skill.value < 100) {
            this.onSkillTierUp(skillCategory, skillName, newTier);
        } else if (skill.value === 100 && oldValue < 100) {
            // Special case for reaching max
            this.onSkillTierUp(skillCategory, skillName, 5);
        }
        
        // Fire skill change hook if value changed
        if (skill.value !== oldValue) {
            this.fireHook('onSkillChange', {
                category: skillCategory,
                skillName: skillName,
                oldValue: oldValue,
                newValue: skill.value,
                oldTier: oldTier,
                newTier: newTier
            });
        }
        
        // Show XP gain notification
        this.showXPGain(skillName, amount, 'skill');
        
        // Update character sheet if open
        if (window.updateCharacterSheet) {
            window.updateCharacterSheet();
        }
    },
    
    // Add XP to character level
    addCharacterXP(amount) {
        const player = State.variables.player;
        const oldLevel = player.level;
        const oldXP = player.experience;
        
        player.experience += amount;
        
        // Fire XP change hook
        this.fireHook('onXPChange', {
            type: 'character',
            oldXP: oldXP,
            newXP: player.experience,
            change: amount
        });
        
        // Check for level up
        while (player.experience >= player.experienceToNextLevel && player.level < 100) {
            player.experience -= player.experienceToNextLevel;
            player.level++;
            
            // Calculate new XP requirement
            player.experienceToNextLevel = XP_CURVES.character.formula(player.level);
            
            this.onCharacterLevelUp(player.level);
        }
        
        // Fire level change hook if level changed
        if (player.level !== oldLevel) {
            this.fireHook('onLevelChange', {
                oldLevel: oldLevel,
                newLevel: player.level
            });
        }
        
        // Show XP gain notification
        this.showXPGain('Character', amount, 'character');
        
        // Update character sheet if open
        if (window.updateCharacterSheet) {
            window.updateCharacterSheet();
        }
    },
    
    // Handle skill tier up (renamed from onSkillLevelUp for clarity)
    onSkillTierUp(category, skillName, newTier) {
        // Grant character XP based on skill category
        const xpReward = XP_REWARDS.skillLevelUp[category] || XP_REWARDS.skillLevelUp.secondary;
        this.addCharacterXP(xpReward);
        
        // Show tier up notification
        const skillDisplayName = this.formatSkillName(skillName);
        const tierName = SKILL_TIERS[newTier];
        this.showLevelUpNotification(`${skillDisplayName} reached ${tierName} tier!`, 'skill');
        
        // Check for skill perks
        this.checkSkillPerks(category, skillName, newTier);
    },
    
    // Handle character level up
    onCharacterLevelUp(newLevel) {
        const player = State.variables.player;
        
        // Grant attribute points (1 per level, 2 every 5 levels)
        const attributePoints = (newLevel % 5 === 0) ? 2 : 1;
        const oldAttributePoints = player.attributePoints || 0;
        player.attributePoints = oldAttributePoints + attributePoints;
        
        // Fire attribute points change hook
        this.fireHook('onAttributeChange', {
            type: 'points',
            oldPoints: oldAttributePoints,
            newPoints: player.attributePoints,
            change: attributePoints
        });
        
        // Update derived stats
        this.updateDerivedStats();
        
        // Show level up notification
        this.showLevelUpNotification(`Level ${newLevel} reached!`, 'character');
        
        // Check for level perks
        if (newLevel % 5 === 0) {
            this.checkLevelPerks(newLevel);
        }
    },
    
    // Update derived stats based on attributes
    updateDerivedStats() {
        const player = State.variables.player;
        const attrs = player.attributes;
        
        // Update max values based on attributes
        player.status.maxHealth = 50 + (attrs.toughness * 10);
        player.status.maxFatigue = 50 + (attrs.agility * 10);
        player.status.maxComposure = 50 + Math.floor((attrs.toughness + attrs.intelligence) * 5);
        
        // Update carry weight
        const maxCarry = 30 + (attrs.strength * 5);
        if (setup.calculateMaxCarryWeight) {
            // This will trigger the inventory system to update
            setup.updatePlayerCarryWeight();
        }
    },
    
    // Check for skill-based perks
    checkSkillPerks(category, skillName, level) {
        // TODO: Implement skill perk system
        // For now, just log
        console.log(`Checking perks for ${skillName} at level ${level}`);
    },
    
    // Check for level-based perks
    checkLevelPerks(level) {
        // TODO: Implement level perk system
        // For now, just show a placeholder
        if (level % 10 === 0) {
            this.showPerkSelection();
        }
    },
    
    // Show perk selection dialog (placeholder)
    showPerkSelection() {
        // TODO: Implement perk selection UI
        alert('You have earned a perk point! (Perk system coming soon)');
    },
    
    // Visual feedback for XP gain
    showXPGain(skillName, amount, type) {
        // Create floating XP text
        const xpText = document.createElement('div');
        xpText.className = 'xp-gain-notification';
        xpText.textContent = `+${amount} XP`;
        xpText.dataset.type = type;
        
        // Add to UI
        const container = document.getElementById('xp-notifications') || document.body;
        container.appendChild(xpText);
        
        // Animate and remove
        setTimeout(() => {
            xpText.classList.add('fade-out');
            setTimeout(() => xpText.remove(), 500);
        }, 2000);
    },
    
    // Show level up notification
    showLevelUpNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.dataset.type = type;
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">⭐</div>
                <div class="level-up-text">${message}</div>
            </div>
        `;
        
        // Add to UI
        const container = document.getElementById('level-notifications') || document.body;
        container.appendChild(notification);
        
        // Animate and remove
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 1000);
        }, 3000);
    },
    
    // Format skill names for display
    formatSkillName(skillName) {
        return skillName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    },
    
    // Calculate skill effectiveness (with attribute bonuses)
    getSkillEffectiveness(skillName, category = 'primary') {
        const player = State.variables.player;
        let skill, attributeBonus = 0;
        
        if (category === 'primary') {
            skill = player.primarySkills[skillName];
            // Get attribute bonus
            const skillAttributes = {
                athletics: 'strength',
                acrobatics: 'agility',
                sleightOfHand: 'agility',
                stealth: 'agility',
                fortitude: 'toughness',
                willpower: 'toughness',
                deception: 'charisma',
                intimidation: 'charisma',
                performance: 'charisma',
                persuasion: 'charisma',
                magic: 'intelligence',
                investigation: 'intelligence',
                religion: 'intelligence',
                history: 'intelligence',
                perception: 'insight',
                survival: 'insight',
                medicine: 'insight'
            };
            
            const attr = skillAttributes[skillName];
            if (attr) {
                attributeBonus = Math.floor((player.attributes[attr] || 0) / 2);
            }
        } else if (category === 'secondary') {
            skill = player.secondarySkills[skillName];
        } else if (category === 'combat') {
            skill = player.combatSkills?.[skillName];
        }
        
        if (!skill) return 0;
        
        // Calculate total effectiveness
        let effectiveness = skill.value + attributeBonus;
        
        // Cap at reasonable maximum (allowing for bonuses to exceed 100)
        if (effectiveness > 200) {
            effectiveness = 200;
        }
        
        return effectiveness;
    },
    
    // Get skill tier information
    getSkillTier(skillValue) {
        const tier = Math.min(5, Math.floor(skillValue / 20));
        return {
            level: tier,
            name: SKILL_TIERS[tier],
            nextThreshold: tier < 5 ? (tier + 1) * 20 : 100,
            progress: tier < 5 ? (skillValue % 20) / 20 : 1
        };
    },
    
    // Register event hook
    registerHook(event, callback) {
        if (LEVELING_HOOKS[event]) {
            LEVELING_HOOKS[event].push(callback);
        }
    },
    
    // Unregister event hook
    unregisterHook(event, callback) {
        if (LEVELING_HOOKS[event]) {
            const index = LEVELING_HOOKS[event].indexOf(callback);
            if (index > -1) {
                LEVELING_HOOKS[event].splice(index, 1);
            }
        }
    },
    
    // Fire all hooks for an event
    fireHook(event, data) {
        if (LEVELING_HOOKS[event]) {
            LEVELING_HOOKS[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} hook:`, error);
                }
            });
        }
    },
    
    // Spend attribute points
    spendAttributePoint(attribute) {
        const player = State.variables.player;
        
        if (!player.attributePoints || player.attributePoints <= 0) {
            return false;
        }
        
        if (!player.attributes[attribute]) {
            return false;
        }
        
        // Cap attributes at 50
        if (player.attributes[attribute] >= 50) {
            return false;
        }
        
        const oldValue = player.attributes[attribute];
        player.attributes[attribute]++;
        player.attributePoints--;
        
        // Fire attribute change hook
        this.fireHook('onAttributeChange', {
            type: 'attribute',
            attribute: attribute,
            oldValue: oldValue,
            newValue: player.attributes[attribute]
        });
        
        // Update derived stats
        this.updateDerivedStats();
        
        // Update character sheet
        if (window.updateCharacterSheet) {
            window.updateCharacterSheet();
        }
        
        return true;
    }
};

// Utility functions for external use
window.addSkillXP = (category, skill, amount) => setup.LevelingSystem.addSkillXP(category, skill, amount);
window.addCharacterXP = (amount) => setup.LevelingSystem.addCharacterXP(amount);
window.levelUpCharacter = () => setup.LevelingSystem.onCharacterLevelUp(State.variables.player.level + 1);
window.getSkillTier = (skillValue) => setup.LevelingSystem.getSkillTier(skillValue);
window.registerLevelingHook = (event, callback) => setup.LevelingSystem.registerHook(event, callback);
window.spendAttributePoint = (attribute) => setup.LevelingSystem.spendAttributePoint(attribute);

// Add CSS for notifications
const levelingStyles = `
<style>
.xp-gain-notification {
    position: fixed;
    right: 20px;
    top: 100px;
    background: rgba(139, 105, 20, 0.9);
    color: #fff;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: bold;
    z-index: 10000;
    animation: slideIn 0.3s ease, float 2s ease-in-out;
}

.xp-gain-notification[data-type="character"] {
    background: rgba(212, 175, 55, 0.9);
}

.xp-gain-notification.fade-out {
    animation: fadeOut 0.5s ease forwards;
}

.level-up-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
    border: 2px solid #d4af37;
    padding: 30px;
    border-radius: 20px;
    z-index: 10001;
    box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);
    animation: levelUpPulse 0.5s ease;
}

.level-up-content {
    text-align: center;
    color: #d4af37;
}

.level-up-icon {
    font-size: 48px;
    margin-bottom: 10px;
    animation: spin 2s ease-in-out;
}

.level-up-text {
    font-size: 24px;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.level-up-notification.fade-out {
    animation: fadeOut 1s ease forwards;
}

@keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes fadeOut {
    to { opacity: 0; transform: scale(0.8); }
}

@keyframes levelUpPulse {
    0% { transform: translate(-50%, -50%) scale(0); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
`;

// Inject styles when script loads
$(document).one(':passageend', function() {
    $(levelingStyles).appendTo('head');
});