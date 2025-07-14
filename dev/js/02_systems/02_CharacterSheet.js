// Character Sheet Functionality
(function() {
    // Check if already initialized
    if (window.characterSheetInitialized) return;
    window.characterSheetInitialized = true;

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
            1: "Thin", 2: "Modest", 3: "Full", 4: "Plump"
        }
    };

    // Define SKILL_TIERS if not already defined
    if (typeof window.SKILL_TIERS === 'undefined') {
        window.SKILL_TIERS = {
            1: "Novice",
            2: "Apprentice", 
            3: "Journeyman",
            4: "Expert",
            5: "Master"
        };
    }

    // Helper functions
    function formatSkillName(skillName) {
        // Convert camelCase to Title Case
        return skillName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    function updateStatusBar(type, status) {
        const percent = Math.max(0, Math.min(100, (status.current / status.max) * 100));
        const fillEl = document.getElementById(`status-${type}-fill`);
        const textEl = document.getElementById(`status-${type}-text`);
        
        if (fillEl) fillEl.style.width = percent + '%';
        if (textEl) textEl.textContent = `${status.current}/${status.max}`;
    }

    // Helper function to create skill HTML
    function createSkillHTML(skillName, skillData, attributeBonus = 0) {
        const tierInfo = setup.LevelingSystem ? setup.LevelingSystem.getSkillTier(skillData.value) : {
            level: Math.floor(skillData.value / 20),
            name: 'Unknown',
            progress: ((skillData.value % 20) / 20),
            nextThreshold: Math.min(100, Math.ceil(skillData.value / 20) * 20)
        };
        
        const bonusText = attributeBonus > 0 ? `(+${attributeBonus})` : '';
        
        // Calculate XP requirement for next skill level
        let xpForNext = 0;
        if (setup.LevelingSystem && skillData.value < 100) {
            const XP_CURVES = setup.LevelingSystem.XP_CURVES;
            xpForNext = XP_CURVES.skill.formula(skillData.value);
        }
        
        // Calculate XP progress percentage
        const xpProgress = xpForNext > 0 ? (skillData.xp / xpForNext) * 100 : 0;
        
        return `
            <div class="skill-item-extended" data-skill="${skillName}">
                <div class="skill-header">
                    <span class="skill-name">${formatSkillName(skillName)} <span class="skill-bonus">${bonusText}</span></span>
                    <div class="skill-level">${Array(5).fill(0).map((_, i) => 
                        `<div class="skill-dot ${i < tierInfo.level ? 'filled' : ''}" title="${window.SKILL_TIERS[i + 1] || 'Locked'}"></div>`
                    ).join('')}</div>
                </div>
                <div class="skill-progress">
                    <div class="skill-xp-bar">
                        <div class="skill-xp-fill" style="width: ${xpProgress}%"></div>
                    </div>
                    <span class="skill-xp-text">${skillData.value >= 100 ? 'Grandmaster (Max)' : `${tierInfo.name} - Level ${skillData.value} (${skillData.xp}/${xpForNext} XP)`}</span>
                </div>
            </div>
        `;
    }

    // Helper function to update skill UI elements
    function updateSkillUI(skillElement, skillData, attributeBonus = 0) {
        if (!skillElement || !skillData) return;
        
        // Update skill bonus text
        const bonusElement = skillElement.querySelector('.skill-bonus');
        if (bonusElement) {
            bonusElement.textContent = attributeBonus > 0 ? `(+${attributeBonus})` : '';
        }
        
        // Get tier information
        const tierInfo = setup.LevelingSystem ? setup.LevelingSystem.getSkillTier(skillData.value) : {
            level: Math.floor(skillData.value / 20),
            name: 'Unknown',
            progress: ((skillData.value % 20) / 20),
            nextThreshold: Math.min(100, Math.ceil(skillData.value / 20) * 20)
        };
        
        // Update skill dots to show tiers
        const levelElement = skillElement.querySelector('.skill-level');
        if (levelElement) {
            levelElement.innerHTML = Array(5).fill(0).map((_, i) => 
                `<div class="skill-dot ${i < tierInfo.level ? 'filled' : ''}" title="${window.SKILL_TIERS[i + 1] || 'Locked'}"></div>`
            ).join('');
        }
        
        // Calculate XP requirement for next skill level
        let xpForNext = 0;
        let xpProgress = 0;
        if (setup.LevelingSystem && skillData.value < 100) {
            const XP_CURVES = setup.LevelingSystem.XP_CURVES;
            xpForNext = XP_CURVES.skill.formula(skillData.value);
            xpProgress = xpForNext > 0 ? (skillData.xp / xpForNext) * 100 : 0;
        }
        
        // Update XP progress bar
        const xpFillElement = skillElement.querySelector('.skill-xp-fill');
        if (xpFillElement) {
            xpFillElement.style.width = xpProgress + '%';
        }
        
        // Update XP text
        const xpTextElement = skillElement.querySelector('.skill-xp-text');
        if (xpTextElement) {
            if (skillData.value >= 100) {
                xpTextElement.textContent = 'Grandmaster (Max)';
            } else {
                xpTextElement.textContent = `${tierInfo.name} - Level ${skillData.value} (${skillData.xp}/${xpForNext} XP)`;
            }
        }
    }

    // Make updateCharacterSheet globally available
    window.updateCharacterSheet = function (data, attempt = 1) {
        if (!data && typeof State !== 'undefined' && State.variables && State.variables.player) {
            data = State.variables.player;
        }

        // Wait for DOM elements if not yet ready (max 2 attempts)
        if (!document.getElementById('char-name')) {
            if (attempt < 2) {
                setTimeout(() => updateCharacterSheet(data, attempt + 1), 100);
            } else {
                console.warn('[CharacterSheet] DOM not ready after retry.');
            }
            return;
        }

        // === BASIC INFO ===
        document.getElementById('char-name').textContent = data.name;
        document.getElementById('char-level-badge').textContent = data.level;
        document.getElementById('char-race').textContent = data.race;
        document.getElementById('char-gender').textContent = data.gender;
        document.getElementById('char-age').textContent = data.age;
        document.getElementById('char-dob').textContent = data.dob;

        // === XP BAR ===
        const xpPercent = (data.experience / data.experienceToNextLevel) * 100;
        document.getElementById('char-xp-fill').style.width = xpPercent + '%';
        document.getElementById('char-xp-text').textContent = `${data.experience} / ${data.experienceToNextLevel}`;

        // === ATTRIBUTES ===
        if (data.attributes) {
            for (const [attr, value] of Object.entries(data.attributes)) {
                const el = document.getElementById(`attr-${attr}`);
                if (el) {
                    el.textContent = value;
                    el.classList.toggle('max-value', value >= 50);
                }
            }
        }

        // === EQUIPMENT ===
        if (data.equipment) {
            for (const [slot, item] of Object.entries(data.equipment)) {
                const el = document.getElementById(`equip-${slot}`);
                if (el) el.textContent = item || "None";
            }
        }

        // === CARRY WEIGHT ===
        if (data.carryWeight) {
            const max = setup.calculateMaxCarryWeight?.() ?? (30 + (data.attributes.strength * 5));
            const current = data.carryWeight.current || 0;
            const percent = Math.min((current / max) * 100, 100);
            const fill = document.getElementById('carry-weight-fill');
            const text = document.getElementById('carry-weight-text');
            if (fill && text) {
                fill.style.width = percent + '%';
                text.textContent = `${current.toFixed(1)} / ${max} lbs`;
            }
        }

        // === PRIMARY SKILLS ===
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

        for (const [skill, dataSkill] of Object.entries(data.primarySkills ?? {})) {
            const el = document.querySelector(`[data-skill="${skill}"]`);
            if (el) {
                const bonus = Math.floor((data.attributes[skillAttributes[skill]] ?? 0) / 2);
                updateSkillUI(el, dataSkill, bonus);
            }
        }

        // === SECONDARY + COMBAT SKILLS ===
        for (const [skillType, group] of Object.entries({
            ...data.secondarySkills,
            ...data.combatSkills
        })) {
            const el = document.querySelector(`[data-skill="${skillType}"]`);
            if (el) updateSkillUI(el, group);
        }

        // === ATTRIBUTE POINTS INDICATOR ===
        const hero = document.querySelector('.hero-section');
        const indicator = document.getElementById('unspent-points');
        if (data.attributePoints > 0 && hero) {
            if (!indicator) {
                const div = document.createElement('div');
                div.id = 'unspent-points';
                div.className = 'unspent-points-indicator';
                div.innerHTML = `<span class="point-icon">!</span> ${data.attributePoints} unspent attribute points`;
                hero.appendChild(div);
            } else {
                indicator.innerHTML = `<span class="point-icon">!</span> ${data.attributePoints} unspent attribute points`;
            }
        } else if (indicator) {
            indicator.remove();
        }

        // === STATUS BARS ===
        const updateBar = (id, current, max) => {
            const fill = document.getElementById(`${id}-fill`);
            const text = document.getElementById(`${id}-value`);
            if (fill) fill.style.width = `${(current / max) * 100}%`;
            if (text) text.textContent = `${current} / ${max}`;
        };

        if (data.status) {
            updateBar('health', data.status.health, data.status.maxHealth);
            updateBar('fatigue', data.status.fatigue, data.status.maxFatigue);
            updateBar('composure', data.status.composure, data.status.maxComposure);
            updateBar('excitement', data.status.excitement, data.status.maxExcitement);

            const c = [];
            if (data.status.poisoned > 0) c.push(`Poisoned (${data.status.poisoned})`);
            if (data.status.intoxicated > 0) c.push(`Intoxicated (${data.status.intoxicated})`);
            if (data.status.charmed > 0) c.push(`Charmed (${data.status.charmed})`);
            if (data.status.bleeding > 0) c.push(`Bleeding (${data.status.bleeding})`);
            if (data.status.burning) c.push("Burning");
            if (data.status.stunned) c.push("Stunned");
            if (data.status.isCumming) c.push("Climaxing");

            const conditionsEl = document.getElementById('char-conditions');
            if (conditionsEl) {
                conditionsEl.innerHTML = c.length
                    ? c.map(s => `<span class="condition-tag">${s}</span>`).join('')
                    : `<span class="condition-tag condition-healthy">Healthy</span>`;
            }
        }

        // === APPEARANCE ===
        if (data.body) {
            const inches = data.body.height % 12;
            const feet = Math.floor(data.body.height / 12);
            document.getElementById('appear-height').textContent = `${feet}'${inches}"`;

            const mapVal = (id, dict, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = dict[val] ?? val;
            };

            mapVal('appear-bodyType', valueMappings.bodyType, data.body.bodyType);
            mapVal('appear-muscleTone', valueMappings.muscleTone, data.body.muscleTone);
            mapVal('appear-breastSize', valueMappings.breastSize, data.body.breastSize);
            mapVal('appear-buttSize', valueMappings.buttSize, data.body.buttSize);
            mapVal('appear-hipWidth', valueMappings.hipWidth, data.body.hipWidth);
            mapVal('appear-bodyHair', valueMappings.bodyHair, data.body.bodyHair);
            mapVal('appear-lipFullness', valueMappings.lipFullness, data.body.lipFullness);

            document.getElementById('appear-skinTone').textContent = data.body.skinTone;
            document.getElementById('appear-hairColor').textContent = data.body.hairColor;
            document.getElementById('appear-hairStyle').textContent = data.body.hairStyle;
            document.getElementById('appear-hairLength').textContent = `${data.body.hairLength} inches`;
            document.getElementById('appear-eyeColor').textContent = data.body.eyeColor;
            document.getElementById('appear-voiceTone').textContent = data.body.voiceTone;

            const anatomyEl = document.getElementById('functional-anatomy');
            if (anatomyEl) {
                const tags = [];
                if (data.body.vagina) tags.push("Vagina");
                if (data.body.clitoris) tags.push("Clitoris");
                anatomyEl.innerHTML = tags.map(tag => `<span class="anatomy-tag">${tag}</span>`).join('');
            }
        }
    };


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
            
            // Set up auto-refresh interval while character sheet is open
            if (window.characterSheetInterval) {
                clearInterval(window.characterSheetInterval);
            }
            
            // Refresh every 500ms to catch any changes
            window.characterSheetInterval = setInterval(() => {
                const overlay = document.querySelector('.overlay-content');
                if (overlay && overlay.offsetParent !== null) {
                    updateCharacterSheet(State.variables.player);
                } else {
                    // Character sheet closed, clear interval
                    clearInterval(window.characterSheetInterval);
                    window.characterSheetInterval = null;
                }
            }, 500);
        } else {
            // Use default data structure as fallback
            console.warn('No player data found in State.variables, using placeholder data');
        }
    };

    // Add cleanup function for when overlay closes
    window.cleanupCharacterSheet = function() {
        if (window.characterSheetInterval) {
            clearInterval(window.characterSheetInterval);
            window.characterSheetInterval = null;
        }
    };

    // Add global refresh function that can be called from anywhere
    window.refreshCharacterSheet = function() {
        if (typeof State !== 'undefined' && State.variables && State.variables.player) {
            updateCharacterSheet(State.variables.player);
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
})();
