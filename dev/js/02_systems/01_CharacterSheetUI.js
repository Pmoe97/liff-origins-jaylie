// Character Sheet Functionality

// Mapping for numeric values to descriptive text
const valueMappings = {
    bodyType: {
        1: "Skinny", 2: "Slim", 3: "Average", 4: "Curvy", 5: "Plump"
    },
    breastSize: {
        1: "Flat", 2: "Modest", 3: "Average", 4: "Large", 5: "Huge"
    },
    buttSize: {
        1: "Flat", 2: "Modest", 3: "Average", 4: "Large", 5: "Huge"
    },
    muscleTone: {
        1: "Soft", 2: "Fit", 3: "Athletic", 4: "Muscular", 5: "Ripped"
    },
    hipWidth: {
        1: "Narrow", 2: "Wide", 3: "Very Wide"
    },
    bodyHair: {
        0: "None", 1: "Light", 2: "Moderate", 3: "Heavy"
    },
    lipFullness: {
        1: "Thin", 2: "Modest", 3: "Full", 4: "Plump", 5: "Bee-stung"
    }
};

// Make updateCharacterSheet globally available
window.updateCharacterSheet = function(data) {
    // If no data provided, use the player state
    if (!data && typeof State !== 'undefined' && State.variables && State.variables.player) {
        data = State.variables.player;
    }
    
    // Check if elements exist before updating
    if (!document.getElementById('char-name')) {
        console.error('Character sheet elements not found giiiiirrllllllll');
        return;
    }

    // Update basic info
    document.getElementById('char-name').textContent = data.name;
    document.getElementById('char-level-badge').textContent = data.level;
    document.getElementById('char-race').textContent = data.race;
    document.getElementById('char-gender').textContent = data.gender;
    document.getElementById('char-age').textContent = data.age;
    document.getElementById('char-dob').textContent = data.dob;

    // Update XP
    const xpPercent = (data.experience / data.experienceToNextLevel) * 100;
    document.getElementById('char-xp-fill').style.width = xpPercent + '%';
    document.getElementById('char-xp-text').textContent = `${data.experience} / ${data.experienceToNextLevel}`;

    // Update Attributes with interactive elements
    if (data.attributes) {
        for (const [attr, value] of Object.entries(data.attributes)) {
            const attrElement = document.getElementById(`attr-${attr}`);
            if (attrElement) {
                attrElement.textContent = value;
                
                // Add max indicator if at cap
                if (value >= 50) {
                    attrElement.classList.add('max-value');
                } else {
                    attrElement.classList.remove('max-value');
                }
            }
        }
        
        // Update attribute spending buttons if points available
        const hasPoints = data.attributePoints && data.attributePoints > 0;
        document.querySelectorAll('.attribute-item').forEach(item => {
            const attr = item.dataset.attr;
            const value = data.attributes[attr];
            
            // Show/hide plus button
            let plusBtn = item.querySelector('.attribute-plus');
            if (!plusBtn && hasPoints && value < 50) {
                plusBtn = document.createElement('button');
                plusBtn.className = 'attribute-plus';
                plusBtn.textContent = '+';
                plusBtn.onclick = () => {
                    if (setup.LevelingSystem.spendAttributePoint(attr)) {
                        updateCharacterSheet(State.variables.player);
                    }
                };
                item.appendChild(plusBtn);
            } else if (plusBtn && (!hasPoints || value >= 50)) {
                plusBtn.remove();
            }
        });
    }

    // Update Equipment
    if (data.equipment) {
        for (const [slot, item] of Object.entries(data.equipment)) {
            const equipElement = document.getElementById(`equip-${slot}`);
            if (equipElement) {
                equipElement.textContent = item || "None";
            }
        }
    }

    // Update Carry Weight
    if (data.carryWeight) {
        const maxCarryWeight = setup.calculateMaxCarryWeight ? setup.calculateMaxCarryWeight() : 30 + (data.attributes.strength * 5);
        const currentWeight = data.carryWeight.current || 0;
        const carryPercent = Math.min((currentWeight / maxCarryWeight) * 100, 100);
        
        const fillElement = document.getElementById('carry-weight-fill');
        const textElement = document.getElementById('carry-weight-text');
        
        if (fillElement && textElement) {
            fillElement.style.width = carryPercent + '%';
            textElement.textContent = `${currentWeight.toFixed(1)} / ${maxCarryWeight} lbs`;
            
            // Change color based on encumbrance
            if (carryPercent > 90) {
                fillElement.style.background = 'linear-gradient(90deg, #c92a2a 0%, #ff6b6b 100%)';
            } else if (carryPercent > 75) {
                fillElement.style.background = 'linear-gradient(90deg, #f08c00 0%, #ffd43b 100%)';
            } else {
                fillElement.style.background = 'linear-gradient(90deg, #8b6914 0%, #d4af37 100%)';
            }
        }
    }

    // Update Primary Skills with tier information
    if (data.primarySkills) {
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
        
        for (const [skillName, skillData] of Object.entries(data.primarySkills)) {
            const skillElement = document.querySelector(`[data-skill="${skillName}"]`);
            if (skillElement) {
                const attribute = skillAttributes[skillName];
                const attributeBonus = Math.floor((data.attributes[attribute] || 0) / 2);
                const totalValue = skillData.value + attributeBonus;
                
                // Update skill bonus text
                const bonusElement = skillElement.querySelector('.skill-bonus');
                if (bonusElement) {
                    bonusElement.textContent = attributeBonus > 0 ? `(+${attributeBonus})` : '';
                }
                
                // Get tier information
                const tierInfo = setup.LevelingSystem.getSkillTier(skillData.value);
                
                // Update skill dots to show tiers
                const level = tierInfo.level;
                const levelElement = skillElement.querySelector('.skill-level');
                if (levelElement) {
                    levelElement.innerHTML = Array(5).fill(0).map((_, i) => 
                        `<div class="skill-dot ${i < level ? 'filled' : ''}" title="${SKILL_TIERS[i + 1] || 'Locked'}"></div>`
                    ).join('');
                }
                
                // Update tier progress bar
                const xpProgress = tierInfo.progress * 100;
                const xpFillElement = skillElement.querySelector('.skill-xp-fill');
                if (xpFillElement) {
                    xpFillElement.style.width = xpProgress + '%';
                }
                
                // Update XP text with tier info
                const xpTextElement = skillElement.querySelector('.skill-xp-text');
                if (xpTextElement) {
                    if (skillData.value >= 100) {
                        xpTextElement.textContent = `Grandmaster (Max)`;
                    } else {
                        xpTextElement.textContent = `${tierInfo.name} - ${skillData.value}/${tierInfo.nextThreshold}`;
                    }
                }
            }
        }
    }

    // Update Secondary Skills with tier information
    if (data.secondarySkills) {
        for (const [skillName, skillData] of Object.entries(data.secondarySkills)) {
            const skillElement = document.querySelector(`[data-skill="${skillName}"]`);
            if (skillElement) {
                // Get tier information
                const tierInfo = setup.LevelingSystem.getSkillTier(skillData.value);
                
                // Update skill dots to show tiers
                const level = tierInfo.level;
                const levelElement = skillElement.querySelector('.skill-level');
                if (levelElement) {
                    levelElement.innerHTML = Array(5).fill(0).map((_, i) => 
                        `<div class="skill-dot ${i < level ? 'filled' : ''}" title="${SKILL_TIERS[i + 1] || 'Locked'}"></div>`
                    ).join('');
                }
                
                // Update tier progress bar
                const xpProgress = tierInfo.progress * 100;
                const xpFillElement = skillElement.querySelector('.skill-xp-fill');
                if (xpFillElement) {
                    xpFillElement.style.width = xpProgress + '%';
                }
                
                // Update XP text with tier info
                const xpTextElement = skillElement.querySelector('.skill-xp-text');
                if (xpTextElement) {
                    if (skillData.value >= 100) {
                        xpTextElement.textContent = `Grandmaster (Max)`;
                    } else {
                        xpTextElement.textContent = `${tierInfo.name} - ${skillData.value}/${tierInfo.nextThreshold}`;
                    }
                }
            }
        }
    }

    // Update Combat Skills with tier information
    if (data.combatSkills) {
        for (const [skillName, skillData] of Object.entries(data.combatSkills)) {
            const skillElement = document.querySelector(`[data-skill="${skillName}"]`);
            if (skillElement) {
                // Get tier information
                const tierInfo = setup.LevelingSystem.getSkillTier(skillData.value);
                
                // Update skill dots to show tiers
                const level = tierInfo.level;
                const levelElement = skillElement.querySelector('.skill-level');
                if (levelElement) {
                    levelElement.innerHTML = Array(5).fill(0).map((_, i) => 
                        `<div class="skill-dot ${i < level ? 'filled' : ''}" title="${SKILL_TIERS[i + 1] || 'Locked'}"></div>`
                    ).join('');
                }
                
                // Update tier progress bar
                const xpProgress = tierInfo.progress * 100;
                const xpFillElement = skillElement.querySelector('.skill-xp-fill');
                if (xpFillElement) {
                    xpFillElement.style.width = xpProgress + '%';
                }
                
                // Update XP text with tier info
                const xpTextElement = skillElement.querySelector('.skill-xp-text');
                if (xpTextElement) {
                    if (skillData.value >= 100) {
                        xpTextElement.textContent = `Grandmaster (Max)`;
                    } else {
                        xpTextElement.textContent = `${tierInfo.name} - ${skillData.value}/${tierInfo.nextThreshold}`;
                    }
                }
            }
        }
    }

    // Update Combat Stats - NEW
    if (data.combatStats) {
        document.getElementById('combat-kills').textContent = data.combatStats.kills || 0;
        document.getElementById('combat-wins').textContent = data.combatStats.wins || 0;
        document.getElementById('combat-losses').textContent = data.combatStats.losses || 0;
        document.getElementById('combat-max-damage').textContent = data.combatStats.maxDamage || 0;
    }

    // Update Attribute Points Display - NEW
    if (data.attributePoints && data.attributePoints > 0) {
        // Show unspent points indicator
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && !document.getElementById('unspent-points')) {
            const unspentDiv = document.createElement('div');
            unspentDiv.id = 'unspent-points';
            unspentDiv.className = 'unspent-points-indicator';
            unspentDiv.innerHTML = `<span class="point-icon">!</span> ${data.attributePoints} unspent attribute points`;
            heroSection.appendChild(unspentDiv);
        } else if (document.getElementById('unspent-points')) {
            document.getElementById('unspent-points').innerHTML = `<span class="point-icon">!</span> ${data.attributePoints} unspent attribute points`;
        }
    } else if (document.getElementById('unspent-points')) {
        document.getElementById('unspent-points').remove();
    }

    // Update Status
    if (data.status) {
        updateStatusBar('health', { current: data.status.health, max: data.status.maxHealth });
        updateStatusBar('fatigue', { current: data.status.fatigue, max: data.status.maxFatigue });
        updateStatusBar('composure', { current: data.status.composure, max: data.status.maxComposure });
        updateStatusBar('excitement', { current: data.status.excitement, max: data.status.maxExcitement });
        
        // Update Conditions
        const conditions = [];
        if (data.status.poisoned > 0) conditions.push(`Poisoned (${data.status.poisoned}/${data.status.maxPoisoned})`);
        if (data.status.intoxicated > 0) conditions.push(`Intoxicated (${data.status.intoxicated}/${data.status.maxIntoxicated})`);
        if (data.status.charmed > 0) conditions.push(`Charmed (${data.status.charmed}/${data.status.maxCharmed})`);
        if (data.status.burning) conditions.push("Burning");
        if (data.status.bleeding > 0) conditions.push(`Bleeding (${data.status.bleeding}/${data.status.maxBleeding})`);
        if (data.status.stunned) conditions.push("Stunned");
        if (data.status.isCumming) conditions.push("Climaxing");
        
        const conditionsEl = document.getElementById('char-conditions');
        if (conditionsEl) {
            if (conditions.length > 0) {
                conditionsEl.innerHTML = conditions.map(c => 
                    `<span class="condition-tag">${c}</span>`
                ).join('');
            } else {
                conditionsEl.innerHTML = '<span class="condition-tag condition-healthy">Healthy</span>';
            }
        }
    }

    // Update Appearance - Physical Characteristics
    if (data.body) {
        // Height conversion
        const heightInches = data.body.height;
        const feet = Math.floor(heightInches / 12);
        const inches = heightInches % 12;
        document.getElementById('appear-height').textContent = `${feet}'${inches}"`;
        
        // Map numeric values to descriptive text
        document.getElementById('appear-bodyType').textContent = valueMappings.bodyType[data.body.bodyType] || data.body.bodyType;
        document.getElementById('appear-muscleTone').textContent = valueMappings.muscleTone[data.body.muscleTone] || data.body.muscleTone;
        document.getElementById('appear-skinTone').textContent = data.body.skinTone;
        document.getElementById('appear-breastSize').textContent = valueMappings.breastSize[data.body.breastSize] || data.body.breastSize;
        document.getElementById('appear-buttSize').textContent = valueMappings.buttSize[data.body.buttSize] || data.body.buttSize;
        document.getElementById('appear-hipWidth').textContent = valueMappings.hipWidth[data.body.hipWidth] || data.body.hipWidth;
        document.getElementById('appear-bodyHair').textContent = valueMappings.bodyHair[data.body.bodyHair] || data.body.bodyHair;
        
        // Facial features
        document.getElementById('appear-hairColor').textContent = data.body.hairColor;
        document.getElementById('appear-hairStyle').textContent = data.body.hairStyle;
        document.getElementById('appear-hairLength').textContent = `${data.body.hairLength} inches`;
        document.getElementById('appear-eyeColor').textContent = data.body.eyeColor;
        document.getElementById('appear-lipFullness').textContent = valueMappings.lipFullness[data.body.lipFullness] || data.body.lipFullness;
        document.getElementById('appear-voiceTone').textContent = data.body.voiceTone;
        
        // Functional anatomy
        const anatomyEl = document.getElementById('functional-anatomy');
        if (anatomyEl) {
            const anatomyParts = [];
            if (data.body.vagina) anatomyParts.push("Vagina");
            if (data.body.clitoris) anatomyParts.push("Clitoris");
            // Add any other functional anatomy parts as they're added to the data structure
            
            anatomyEl.innerHTML = anatomyParts.map(part => 
                `<span class="anatomy-tag">${part}</span>`
            ).join('');
        }
    }
}

function formatSkillName(skillName) {
    // Convert camelCase to Title Case
    return skillName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

function createSkillItemWithXP(name, value, xp, bonus = 0, totalValue = null) {
    // Calculate skill level (0-5) based on value (0-100)
    const displayValue = totalValue !== null ? totalValue : value;
    const level = Math.floor(displayValue / 20);
    const dots = Array(5).fill(0).map((_, i) => 
        `<div class="skill-dot ${i < level ? 'filled' : ''}"></div>`
    ).join('');
    
    // Calculate XP progress to next skill level
    const nextLevelValue = Math.min(100, (Math.floor(value / 20) + 1) * 20);
    const currentLevelValue = Math.floor(value / 20) * 20;
    const xpProgress = ((value - currentLevelValue) / 20) * 100;
    
    const bonusText = bonus > 0 ? ` (+${bonus})` : '';
    
    return `
        <div class="skill-item-extended">
            <div class="skill-header">
                <span class="skill-name">${name}${bonusText}</span>
                <div class="skill-level">${dots}</div>
            </div>
            <div class="skill-progress">
                <div class="skill-xp-bar">
                    <div class="skill-xp-fill" style="width: ${xpProgress}%"></div>
                </div>
                <span class="skill-xp-text">${value}/100 (${xp} XP)</span>
            </div>
        </div>
    `;
}

function updateStatusBar(type, status) {
    const percent = Math.max(0, Math.min(100, (status.current / status.max) * 100));
    const fillEl = document.getElementById(`status-${type}-fill`);
    const textEl = document.getElementById(`status-${type}-text`);
    
    if (fillEl) fillEl.style.width = percent + '%';
    if (textEl) textEl.textContent = `${status.current}/${status.max}`;
}

// Tab Switching Function
window.switchCharacterTab = function(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Find and activate the correct button
    tabButtons.forEach(button => {
        if (
            (tabName === 'status' && button.textContent.includes('Status')) ||
            (tabName === 'skills' && button.textContent.includes('Attributes')) ||
            (tabName === 'combat' && button.textContent.includes('Combat')) ||
            (tabName === 'appearance' && button.textContent.includes('Appearance'))
        ) {
            button.classList.add('active');
        }
    });

    // Update tab panels
    const allPanels = document.querySelectorAll('.tab-panel');
    allPanels.forEach(panel => panel.classList.remove('active'));
    
    const activePanel = document.getElementById(`${tabName}-tab`);
    if (activePanel) {
        activePanel.classList.add('active');
    }

    // Reset animations for the active tab
    if (activePanel) {
        const cards = activePanel.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.6s ease forwards`;
                card.style.animationDelay = `${index * 0.1}s`;
            }, 10);
        });
    }
}

// Initialize when character sheet is opened
window.initializeCharacterSheet = function() {
    // Try to get actual player data from State
    if (typeof State !== 'undefined' && State.variables && State.variables.player) {
        updateCharacterSheet(State.variables.player);
    } else {
        // Use default data structure as fallback
        console.warn('No player data found in State.variables, using placeholder data');
    }
};

// Also try to initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if character sheet is already visible
    const charSheet = document.querySelector('.character-sheet-container');
    if (charSheet && charSheet.offsetParent !== null) {
        initializeCharacterSheet();
    }
});

// Helper function to add character XP
window.addCharacterXP = function(amount) {
    if (!State.variables.player) return;
    
    const result = setup.LevelingSystem.addCharacterXP(amount);
    
    // Update the character sheet if it's open
    if (typeof updateCharacterSheet === 'function') {
        updateCharacterSheet(State.variables.player);
    }
    
    return result;
};

// Helper function to add skill XP
window.addSkillXP = function(category, skillName, amount) {
    if (!State.variables.player) return;
    
    const result = setup.LevelingSystem.addSkillXP(category, skillName, amount);
    
    // Update the character sheet if it's open
    if (typeof updateCharacterSheet === 'function') {
        updateCharacterSheet(State.variables.player);
    }
    
    return result;
};

// Helper function to spend attribute points
window.spendAttributePoint = function(attribute) {
    if (!State.variables.player) return false;
    
    const result = setup.LevelingSystem.spendAttributePoint(attribute);
    
    // Update the character sheet if it's open
    if (typeof updateCharacterSheet === 'function') {
        updateCharacterSheet(State.variables.player);
    }
    
    return result;
};