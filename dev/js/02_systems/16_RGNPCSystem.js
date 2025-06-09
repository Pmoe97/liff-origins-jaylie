/* ======================================================
   RGNPC (Randomly Generated NPC) System
   ------------------------------------------------------
   A comprehensive system for creating, managing, and 
   persisting randomly generated NPCs with full depth:
   - Identity, relationships, personality, body, status
   - Schedules, occupations, quests, social ties
   - Dynamic discovery and relationship building
   - Cultural/racial naming variations
   - Population management per region
========================================================= */

// Global RGNPC storage and management
window.RGNPCSystem = {
    // Core data storage
    npcs: new Map(), // rgnpcId -> RGNPC object
    locationPopulations: new Map(), // locationId -> Set of rgnpcIds
    scheduleCache: new Map(), // rgnpcId -> current schedule data
    
    // Configuration
    config: {
        maxPopulationPerLocation: {
            'small_village': 15,
            'large_village': 30,
            'small_town': 50,
            'large_town': 100,
            'small_city': 200,
            'large_city': 500,
            'capital': 1000,
            'tavern': 25,
            'market': 40,
            'temple': 15,
            'palace': 30,
            'slums': 50,
            'default': 25
        },
        relationshipRanges: {
            trust: [-10, 10],
            affection: [-10, 10], 
            rapport: [0, 10],
            tension: [0, 10]
        },
        scheduleSlots: [
            { name: 'earlyMorning', start: 6.5, end: 9.5 },    // 6:30-9:29 AM
            { name: 'lateMorning', start: 9.5, end: 12 },      // 9:30-11:59 AM
            { name: 'afternoon', start: 12, end: 17.5 },       // 12:00-5:29 PM
            { name: 'evening', start: 17.5, end: 20 },         // 5:30-7:59 PM
            { name: 'night', start: 20, end: 24 },             // 8:00-11:59 PM
            { name: 'lateNight', start: 0, end: 6.5 }          // 12:00-6:29 AM
        ]
    },

    // Initialize the system
    initialize() {
        console.log("🧩 Initializing RGNPC System...");
        
        // Load persisted data if available
        this.loadPersistedData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Validate data files
        this.validateDataFiles();
        
        console.log("✅ RGNPC System initialized");
    },

    // Validate that all required data files are loaded
    validateDataFiles() {
        const requiredData = [
            'setup.Archetypes',
            'setup.NamePools',
            'setup.PersonalityTraits',
            'setup.Inclinations',
            'setup.Motivations',
            'setup.SocialStyles',
            'setup.BodyDescriptors'
        ];
        
        const missing = [];
        for (const dataPath of requiredData) {
            const parts = dataPath.split('.');
            let obj = window;
            for (const part of parts) {
                if (!obj[part]) {
                    missing.push(dataPath);
                    break;
                }
                obj = obj[part];
            }
        }
        
        if (missing.length > 0) {
            console.warn('⚠️ Missing required data files:', missing);
        }
    },

    // Generate a new RGNPC
    generateRGNPC(options = {}) {
        const rng = new Math.seedrandom(options.seed || Math.random());
        
        // Generate unique ID
        const rgnpcId = this.generateUniqueId();
        
        // Determine basic identity
        const race = options.race || this.selectRace(rng);
        const genderIdentity = options.gender || this.selectGender(rng);
        const locationType = options.locationType || 'default';
        const archetype = options.archetype || this.selectArchetype(rng, race, locationType);
        
        // Generate core RGNPC structure
        const rgnpc = {
            // Core Identity
            rgnpcId: rgnpcId,
            race: race,
            genderIdentity: genderIdentity,
            archetype: archetype,
            
            // Names (initially unknown to player)
            name: this.generateName(race, genderIdentity, rng),
            defaultName: null, // Will be generated from body description
            known: false,
            knownTraits: new Set(), // Gradually revealed traits
            
            // Avatar
            avatar: this.selectAvatar(race, genderIdentity, archetype, rng),
            
            // Pronouns
            pronouns: this.generatePronouns(genderIdentity, rng),
            
            // Relationships (initialized randomly within ranges)
            trust: this.randomInRange(this.config.relationshipRanges.trust, rng),
            affection: this.randomInRange(this.config.relationshipRanges.affection, rng),
            rapport: this.randomInRange(this.config.relationshipRanges.rapport, rng),
            tension: this.randomInRange(this.config.relationshipRanges.tension, rng),
            
            // Personality
            traits: this.selectTraits(archetype, rng),
            inclinations: this.selectInclinations(archetype, rng),
            motivations: this.selectMotivations(archetype, rng),
            socialStyle: this.selectSocialStyle(archetype, rng),
            
            // Body (full physical description)
            body: this.generateBody(race, genderIdentity, archetype, rng),
            
            // Status
            health: 100,
            maxHealth: 100,
            fatigue: this.randomInRange([0, 30], rng),
            maxFatigue: 100,
            
            // Inventory
            inventory: this.generateInventory(archetype, rng),
            
            // Occupation
            occupation: this.generateOccupation(archetype, rng),
            
            // Quests (generated from templates)
            availableQuests: this.generateQuests(archetype, rng),
            completedQuests: [],
            
            // Social Ties
            socialTies: this.generateSocialTies(rng),
            
            // Schedule (weekly repeating)
            schedule: this.generateSchedule(archetype, locationType, rng),
            currentLocation: options.location || null,
            
            // World Interaction Flags
            canBePickpocketed: true,
            canBeAttacked: true,
            crimeWitnessLevel: this.selectCrimeWitnessLevel(archetype, rng),
            
            // Metadata
            createdAt: Date.now(),
            lastInteraction: null,
            birthDate: this.generateBirthDate(rng),
            
            // Hidden stats (not shown to player)
            hiddenStats: {
                fear: this.randomInRange([0, 10], rng),
                respect: this.randomInRange([0, 10], rng),
                lust: this.randomInRange([0, 10], rng),
                loyalty: this.randomInRange([0, 10], rng)
            }
        };
        
        // Generate default name from body description
        rgnpc.defaultName = this.generateDefaultName(rgnpc);
        
        // Store the RGNPC
        this.npcs.set(rgnpcId, rgnpc);
        
        console.log(`🧩 Generated RGNPC: ${rgnpc.defaultName} (${rgnpcId})`);
        return rgnpc;
    },

    // Generate unique ID for RGNPC
    generateUniqueId() {
        let id;
        do {
            id = `rgnpc_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        } while (this.npcs.has(id));
        return id;
    },

    // Select race based on world demographics
    selectRace(rng) {
        const raceWeights = {
            'human': 0.45,
            'elf': 0.20,
            'half_orc': 0.15,
            'halfling': 0.10,
            'half_demon': 0.08,
            'dwarf': 0.02  // Extremely rare as noted
        };
        
        return this.weightedRandom(raceWeights, rng);
    },

    // Select gender identity
    selectGender(rng) {
        const genderWeights = {
            'male': 0.48,
            'female': 0.48,
            'non_binary': 0.04
        };
        
        return this.weightedRandom(genderWeights, rng);
    },

    // Select archetype based on race preferences and location
    selectArchetype(rng, race, locationType = 'default') {
        // Use location-based weights if available
        if (setup.ArchetypeUtils && setup.ArchetypeUtils.getArchetypeForLocation) {
            return setup.ArchetypeUtils.getArchetypeForLocation(locationType, rng);
        }
        
        // Fallback to random selection
        const archetypeKeys = Object.keys(setup.Archetypes || {});
        if (archetypeKeys.length === 0) {
            console.warn('⚠️ No archetypes available');
            return 'Laborer'; // Default fallback
        }
        return archetypeKeys[Math.floor(rng() * archetypeKeys.length)];
    },

    // Generate culturally appropriate name
    generateName(race, gender, rng) {
        // Use the improved name generation utilities if available
        if (setup.NameUtils && setup.NameUtils.generateCulturalName) {
            return setup.NameUtils.generateCulturalName(race, gender, null, rng);
        }
        
        // Fallback to basic generation
        const namePool = setup.NamePools?.[race];
        if (!namePool) {
            console.warn(`⚠️ No name pool for ${race}, using human names`);
            return this.generateName('human', gender, rng);
        }
        
        // Handle non-binary names by randomly choosing from male/female pools
        let genderPool = gender;
        if (gender === 'non_binary') {
            genderPool = rng() > 0.5 ? 'male' : 'female';
        }
        
        if (!namePool[genderPool]) {
            console.warn(`⚠️ No name pool for ${race}/${gender}, using first available`);
            genderPool = Object.keys(namePool).find(key => key !== 'surnames') || 'male';
        }
        
        const firstNames = namePool[genderPool];
        if (!firstNames || firstNames.length === 0) {
            return 'Unknown';
        }
        
        const firstName = firstNames[Math.floor(rng() * firstNames.length)];
        
        // Generate surname if available
        let fullName = firstName;
        if (namePool.surnames && namePool.surnames.length > 0) {
            const surname = namePool.surnames[Math.floor(rng() * namePool.surnames.length)];
            fullName = `${firstName} ${surname}`;
        }
        
        return fullName;
    },

    // Generate pronouns based on gender identity
    generatePronouns(genderIdentity, rng) {
        const pronounSets = {
            'male': {
                subject: 'he',
                object: 'him', 
                possessive: 'his',
                reflexive: 'himself',
                noun: 'man'
            },
            'female': {
                subject: 'she',
                object: 'her',
                possessive: 'her', 
                reflexive: 'herself',
                noun: 'woman'
            },
            'non_binary': {
                subject: 'they',
                object: 'them',
                possessive: 'their',
                reflexive: 'themself',
                noun: 'person'
            }
        };
        
        return pronounSets[genderIdentity] || pronounSets['non_binary'];
    },

    // Select personality traits
    selectTraits(archetype, rng) {
        const archetypeData = setup.Archetypes?.[archetype];
        const allTraits = Object.keys(setup.PersonalityTraits || {});
        
        if (allTraits.length === 0) {
            console.warn('⚠️ No personality traits available');
            return ['curious', 'practical'];
        }
        
        const numTraits = 3 + Math.floor(rng() * 3); // 3-5 traits
        
        const selectedTraits = [];
        const usedTraits = new Set();
        
        // Prefer archetype-aligned traits
        if (archetypeData && archetypeData.preferredTraits) {
            for (const trait of archetypeData.preferredTraits) {
                if (selectedTraits.length < numTraits && !usedTraits.has(trait) && setup.PersonalityTraits[trait]) {
                    selectedTraits.push(trait);
                    usedTraits.add(trait);
                    
                    // Add conflicting traits to used set
                    const traitData = setup.PersonalityTraits[trait];
                    if (traitData && traitData.conflicts) {
                        traitData.conflicts.forEach(conflict => usedTraits.add(conflict));
                    }
                }
            }
        }
        
        // Fill remaining slots with random traits
        let attempts = 0;
        while (selectedTraits.length < numTraits && attempts < 100) {
            attempts++;
            const trait = allTraits[Math.floor(rng() * allTraits.length)];
            if (!usedTraits.has(trait)) {
                selectedTraits.push(trait);
                usedTraits.add(trait);
                
                // Add conflicting traits to used set
                const traitData = setup.PersonalityTraits[trait];
                if (traitData && traitData.conflicts) {
                    traitData.conflicts.forEach(conflict => usedTraits.add(conflict));
                }
            }
        }
        
        return selectedTraits;
    },

    // Select inclinations
    selectInclinations(archetype, rng) {
        const archetypeData = setup.Archetypes?.[archetype];
        const allInclinations = Object.keys(setup.Inclinations || {});
        
        if (allInclinations.length === 0) {
            console.warn('⚠️ No inclinations available');
            return ['vanilla'];
        }
        
        const numInclinations = 1 + Math.floor(rng() * 3); // 1-3 inclinations
        
        const selected = [];
        
        // Prefer archetype-aligned inclinations
        if (archetypeData && archetypeData.preferredInclinations) {
            for (const inclination of archetypeData.preferredInclinations) {
                if (selected.length < numInclinations && setup.Inclinations[inclination]) {
                    selected.push(inclination);
                }
            }
        }
        
        // Fill remaining slots
        let attempts = 0;
        while (selected.length < numInclinations && attempts < 50) {
            attempts++;
            const inclination = allInclinations[Math.floor(rng() * allInclinations.length)];
            if (!selected.includes(inclination)) {
                selected.push(inclination);
            }
        }
        
        return selected;
    },

    // Select motivations
    selectMotivations(archetype, rng) {
        const archetypeData = setup.Archetypes?.[archetype];
        const allMotivations = Object.keys(setup.Motivations || {});
        
        if (allMotivations.length === 0) {
            console.warn('⚠️ No motivations available');
            return ['survival'];
        }
        
        const numMotivations = 1 + Math.floor(rng() * 2); // 1-2 motivations
        
        const selected = [];
        
        // Prefer archetype-aligned motivations
        if (archetypeData && archetypeData.preferredMotivations) {
            for (const motivation of archetypeData.preferredMotivations) {
                if (selected.length < numMotivations && setup.Motivations[motivation]) {
                    selected.push(motivation);
                }
            }
        }
        
        // Fill remaining slots
        let attempts = 0;
        while (selected.length < numMotivations && attempts < 50) {
            attempts++;
            const motivation = allMotivations[Math.floor(rng() * allMotivations.length)];
            if (!selected.includes(motivation)) {
                selected.push(motivation);
            }
        }
        
        return selected;
    },

    // Select social style
    selectSocialStyle(archetype, rng) {
        const archetypeData = setup.Archetypes?.[archetype];
        
        // Prefer archetype-aligned styles
        if (archetypeData && archetypeData.styles && archetypeData.styles.length > 0) {
            return archetypeData.styles[Math.floor(rng() * archetypeData.styles.length)];
        }
        
        // Fallback to random style
        const allStyles = Object.keys(setup.SocialStyles || {});
        if (allStyles.length === 0) {
            console.warn('⚠️ No social styles available');
            return 'polite';
        }
        
        return allStyles[Math.floor(rng() * allStyles.length)];
    },

    // Generate full body description
    generateBody(race, genderIdentity, archetype, rng) {
        const body = {
            // Basic measurements
            height: this.generateHeight(race, genderIdentity, rng),
            weight: null, // Will be calculated from other factors
            
            // Body composition
            bodyType: Math.floor(rng() * (setup.BodyDescriptors?.bodyType?.length || 8)),
            muscleTone: Math.floor(rng() * (setup.BodyDescriptors?.muscleTone?.length || 7)),
            
            // Physical features
            skinTone: this.generateSkinTone(race, rng),
            hairColor: this.generateHairColor(race, rng),
            hairStyle: this.generateHairStyle(genderIdentity, rng),
            hairLength: this.generateHairLength(genderIdentity, rng),
            eyeColor: this.generateEyeColor(race, rng),
            
            // Facial features
            lipFullness: Math.floor(rng() * (setup.BodyDescriptors?.lipFullness?.length || 6)),
            
            // Body details
            bodyHair: Math.floor(rng() * (setup.BodyDescriptors?.bodyHair?.length || 5)),
            voiceTone: this.generateVoiceTone(genderIdentity, rng),
            
            // Gender-specific features
            ...(genderIdentity === 'female' || genderIdentity === 'non_binary' ? {
                breastSize: Math.floor(rng() * (setup.BodyDescriptors?.breastSize?.length || 7)),
                hipWidth: Math.floor(rng() * (setup.BodyDescriptors?.hipWidth?.length || 4))
            } : {}),
            
            buttSize: Math.floor(rng() * (setup.BodyDescriptors?.buttSize?.length || 7)),
            
            // Sexual characteristics (for adult content)
            ...(genderIdentity === 'male' || genderIdentity === 'non_binary' ? {
                penisSize: this.generatePenisSize(rng)
            } : {}),
            
            // Special racial features
            ...this.generateRacialFeatures(race, rng)
        };
        
        // Calculate weight based on height and body type
        body.weight = this.calculateWeight(body.height, body.bodyType, body.muscleTone);
        
        return body;
    },

    // Generate height based on race and gender
    generateHeight(race, genderIdentity, rng) {
        const baseHeights = {
            'human': { male: 70, female: 65, non_binary: 67.5 },
            'elf': { male: 68, female: 63, non_binary: 65.5 },
            'half_orc': { male: 74, female: 69, non_binary: 71.5 },
            'dwarf': { male: 52, female: 48, non_binary: 50 },
            'halfling': { male: 42, female: 40, non_binary: 41 },
            'half_demon': { male: 71, female: 66, non_binary: 68.5 }
        };
        
        const base = baseHeights[race]?.[genderIdentity] || baseHeights['human'][genderIdentity] || 67.5;
        const variation = (rng() - 0.5) * 8; // ±4 inches variation
        
        return Math.round(base + variation);
    },

    // Generate other body features...
    generateSkinTone(race, rng) {
        const skinTones = {
            'human': ['pale', 'fair', 'light', 'olive', 'tan', 'brown', 'dark brown', 'deep brown'],
            'elf': ['porcelain', 'pale', 'fair', 'light olive', 'golden'],
            'half_orc': ['green-tinged', 'olive-green', 'bronze', 'dark olive'],
            'dwarf': ['ruddy', 'tan', 'bronze', 'weathered brown'],
            'halfling': ['rosy', 'fair', 'tan', 'warm brown'],
            'half_demon': ['pale', 'ashen', 'red-tinged', 'midnight blue', 'deep purple']
        };
        
        const tones = skinTones[race] || skinTones['human'];
        return tones[Math.floor(rng() * tones.length)];
    },

    generateHairColor(race, rng) {
        const hairColors = {
            'human': ['black', 'dark brown', 'brown', 'light brown', 'blonde', 'red', 'auburn', 'gray'],
            'elf': ['silver', 'platinum blonde', 'golden blonde', 'auburn', 'copper', 'white'],
            'half_orc': ['black', 'dark brown', 'brown', 'gray'],
            'dwarf': ['black', 'dark brown', 'brown', 'red', 'gray', 'white'],
            'halfling': ['brown', 'light brown', 'blonde', 'red', 'curly brown'],
            'half_demon': ['black', 'deep red', 'purple-black', 'silver', 'white']
        };
        
        const colors = hairColors[race] || hairColors['human'];
        return colors[Math.floor(rng() * colors.length)];
    },

    generateHairStyle(genderIdentity, rng) {
        const styles = {
            'male': ['short and neat', 'messy', 'slicked back', 'tousled', 'cropped', 'shaved sides'],
            'female': ['long and flowing', 'braided', 'in a bun', 'loose waves', 'straight', 'curly'],
            'non_binary': ['shoulder-length', 'asymmetrical', 'layered', 'textured', 'natural', 'undercut']
        };
        
        const genderStyles = styles[genderIdentity] || styles['non_binary'];
        return genderStyles[Math.floor(rng() * genderStyles.length)];
    },

    generateHairLength(genderIdentity, rng) {
        const ranges = {
            'male': [1, 6],      // buzzed to short
            'female': [4, 26],   // short to waist-length  
            'non_binary': [2, 14] // cropped to shoulder-length
        };
        
        const [min, max] = ranges[genderIdentity] || ranges['non_binary'];
        return min + Math.floor(rng() * (max - min + 1));
    },

    generateEyeColor(race, rng) {
        const eyeColors = {
            'human': ['brown', 'blue', 'green', 'hazel', 'gray'],
            'elf': ['blue', 'green', 'silver', 'violet', 'gold'],
            'half_orc': ['brown', 'amber', 'red', 'yellow'],
            'dwarf': ['brown', 'blue', 'gray', 'green'],
            'halfling': ['brown', 'blue', 'green', 'hazel'],
            'half_demon': ['red', 'yellow', 'purple', 'black', 'silver']
        };
        
        const colors = eyeColors[race] || eyeColors['human'];
        return colors[Math.floor(rng() * colors.length)];
    },

    generateVoiceTone(genderIdentity, rng) {
        const tones = {
            'male': ['deep', 'gravelly', 'smooth', 'commanding', 'gentle', 'raspy'],
            'female': ['melodic', 'breathy', 'clear', 'warm', 'sultry', 'crisp'],
            'non_binary': ['soft', 'neutral', 'pleasant', 'calm', 'measured', 'androgynous']
        };
        
        const genderTones = tones[genderIdentity] || tones['non_binary'];
        return genderTones[Math.floor(rng() * genderTones.length)];
    },

    generatePenisSize(rng) {
        // Realistic distribution (inches)
        const mean = 5.5;
        const stdDev = 0.8;
        let size = this.normalRandom(mean, stdDev, rng);
        return Math.max(3, Math.min(10, Math.round(size * 2) / 2)); // Round to nearest 0.5, clamp 3-10
    },

    generateRacialFeatures(race, rng) {
        const features = {};
        
        switch (race) {
            case 'elf':
                features.ears = 'pointed';
                break;
            case 'half_orc':
                features.tusks = rng() > 0.5 ? 'small tusks' : 'pronounced canines';
                break;
            case 'dwarf':
                if (rng() > 0.3) features.beard = 'thick beard';
                break;
            case 'half_demon':
                if (rng() > 0.6) features.horns = 'small horns';
                if (rng() > 0.7) features.tail = 'thin tail';
                break;
        }
        
        return features;
    },

    // Calculate weight from other body factors
    calculateWeight(height, bodyType, muscleTone) {
        const baseWeight = (height - 60) * 2.3 + 110; // Rough BMI calculation
        const typeMultiplier = [0.7, 0.8, 0.9, 1.0, 1.2, 1.4, 1.6, 1.8][bodyType] || 1.0;
        const muscleMultiplier = [0.9, 0.95, 1.0, 1.05, 1.1, 1.2, 1.3][muscleTone] || 1.0;
        
        return Math.round(baseWeight * typeMultiplier * muscleMultiplier);
    },

    // Generate default name from physical description
    generateDefaultName(rgnpc) {
        const body = rgnpc.body;
        const descriptors = [];
        
        // Height descriptor
        if (setup.BodyDescriptors?.heightDescriptor) {
            descriptors.push(setup.BodyDescriptors.heightDescriptor(body.height));
        } else {
            // Fallback height description
            if (body.height <= 54) descriptors.push('short');
            else if (body.height <= 66) descriptors.push('average height');
            else descriptors.push('tall');
        }
        
        // Build descriptor
        if (body.bodyType !== undefined && setup.BodyDescriptors?.bodyType) {
            descriptors.push(setup.BodyDescriptors.bodyType[body.bodyType]);
        }
        
        // Hair color if notable
        if (body.hairColor && !['brown', 'black'].includes(body.hairColor.toLowerCase())) {
            descriptors.push(body.hairColor + '-haired');
        }
        
        // Gender noun
        descriptors.push(rgnpc.pronouns.noun);
        
        // Combine descriptors intelligently
        if (descriptors.length > 3) {
            return `${descriptors[0]} ${descriptors[descriptors.length - 1]} with ${descriptors[descriptors.length - 2]} hair`;
        } else {
            return descriptors.join(' ');
        }
    },

    // Generate inventory based on archetype
    generateInventory(archetype, rng) {
        // This would integrate with existing inventory system
        // For now, return basic structure
        const inventoryTemplates = {
            'Warden': {
                visible: ['sword', 'shield', 'armor'],
                hidden: ['coin_pouch', 'keys'],
                equipped: ['sword', 'shield', 'armor']
            },
            'Merchant': {
                visible: ['ledger', 'coin_pouch'],
                hidden: ['valuable_goods', 'contracts'],
                equipped: ['fine_clothes']
            },
            'Thief': {
                visible: ['dagger'],
                hidden: ['lockpicks', 'stolen_goods'],
                equipped: ['dagger', 'dark_cloak']
            }
        };
        
        const template = inventoryTemplates[archetype] || {
            visible: [],
            hidden: ['coin_pouch'],
            equipped: []
        };
        
        return {
            visible: [...template.visible],
            hidden: [...template.hidden],
            equipped: [...template.equipped]
        };
    },

    // Generate occupation
    generateOccupation(archetype, rng) {
        const occupations = {
            'Warden': ['City Guard', 'Gate Guard', 'Prison Guard', 'Patrol Officer'],
            'Courtesan': ['Entertainer', 'Dancer', 'Musician', 'Hostess'],
            'Witchling': ['Herbalist', 'Fortune Teller', 'Scribe', 'Researcher'],
            'Scholar': ['Librarian', 'Teacher', 'Researcher', 'Archivist'],
            'Merchant': ['Trader', 'Shop Owner', 'Caravan Master', 'Appraiser'],
            'Artisan': ['Blacksmith', 'Carpenter', 'Jeweler', 'Tailor'],
            'Laborer': ['Dock Worker', 'Miner', 'Construction Worker', 'Porter'],
            'Farmer': ['Crop Farmer', 'Livestock Keeper', 'Orchard Tender', 'Beekeeper'],
            'Thief': ['Pickpocket', 'Burglar', 'Fence', 'Con Artist'],
            'Bard': ['Minstrel', 'Storyteller', 'Court Jester', 'Traveling Performer'],
            'Healer': ['Physician', 'Herbalist', 'Midwife', 'Surgeon'],
            'Priest': ['Cleric', 'Monk', 'Temple Keeper', 'Spiritual Advisor'],
            'Noble': ['Lord/Lady', 'Courtier', 'Diplomat', 'Estate Manager'],
            'Innkeeper': ['Tavern Owner', 'Innkeeper', 'Brewmaster', 'Host'],
            'Hunter': ['Tracker', 'Trapper', 'Guide', 'Beast Slayer']
        };
        
        const archetypeJobs = occupations[archetype] || ['Laborer', 'Merchant', 'Artisan', 'Farmer'];
        const jobTitle = archetypeJobs[Math.floor(rng() * archetypeJobs.length)];
        
        return {
            jobTitle: jobTitle,
            skills: this.generateSkills(jobTitle, rng),
            shopId: null // Could link to shop system
        };
    },

    generateSkills(jobTitle, rng) {
        // Generate relevant skills based on job
        const skillSets = {
            'City Guard': ['Combat', 'Investigation', 'Intimidation'],
            'Entertainer': ['Performance', 'Persuasion', 'Insight'],
            'Herbalist': ['Nature', 'Medicine', 'Alchemy'],
            'Merchant': ['Persuasion', 'Insight', 'Deception'],
            'Blacksmith': ['Crafting', 'Strength', 'Metallurgy'],
            'Physician': ['Medicine', 'Investigation', 'Herbalism'],
            'Pickpocket': ['Sleight of Hand', 'Stealth', 'Perception'],
            'Tracker': ['Survival', 'Nature', 'Perception']
        };
        
        return skillSets[jobTitle] || ['General Labor'];
    },

    // Generate quests from templates
    generateQuests(archetype, rng) {
        // This would use Madlib-style templates based on motivation/personality
        // For now, return empty array - to be expanded
        return [];
    },

    // Generate social ties
    generateSocialTies(rng) {
        return {
            family: [],
            friends: [],
            enemies: [],
            guilds: [],
            factions: []
        };
    },

    // Generate weekly schedule
    generateSchedule(archetype, locationType, rng) {
        const schedule = {};
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        // Get archetype-specific activities
        const archetypeActivities = this.getArchetypeActivities(archetype);
        
        for (const day of days) {
            schedule[day] = {};
            for (const slot of this.config.scheduleSlots) {
                schedule[day][slot.name] = this.generateScheduleActivity(archetype, slot, archetypeActivities, rng);
            }
        }
        
        return schedule;
    },

    getArchetypeActivities(archetype) {
        const activities = {
            'Warden': {
                earlyMorning: ['patrol duty', 'morning drills', 'guard post'],
                lateMorning: ['patrol duty', 'training', 'paperwork'],
                afternoon: ['patrol duty', 'guard post', 'prisoner duty'],
                evening: ['patrol duty', 'shift change', 'tavern visit'],
                night: ['night watch', 'tavern visit', 'off duty'],
                lateNight: ['night watch', 'sleeping']
            },
            'Merchant': {
                earlyMorning: ['opening shop', 'inventory check', 'breakfast'],
                lateMorning: ['selling goods', 'negotiating deals', 'managing shop'],
                afternoon: ['selling goods', 'meeting suppliers', 'counting coins'],
                evening: ['closing shop', 'dinner', 'social networking'],
                night: ['bookkeeping', 'relaxing', 'planning'],
                lateNight: ['sleeping']
            },
            'Courtesan': {
                earlyMorning: ['sleeping', 'beauty routine'],
                lateMorning: ['sleeping', 'preparing for work'],
                afternoon: ['socializing', 'entertaining clients', 'rehearsing'],
                evening: ['entertaining clients', 'performing', 'socializing'],
                night: ['entertaining clients', 'performing', 'private sessions'],
                lateNight: ['winding down', 'counting earnings', 'sleeping']
            }
        };
        
        return activities[archetype] || {
            earlyMorning: ['sleeping', 'waking up', 'morning routine'],
            lateMorning: ['working', 'breakfast', 'morning chores'],
            afternoon: ['working', 'socializing', 'errands'],
            evening: ['dinner', 'socializing', 'relaxing'],
            night: ['socializing', 'entertainment', 'personal time'],
            lateNight: ['sleeping', 'night shift', 'personal time']
        };
    },

    generateScheduleActivity(archetype, timeSlot, archetypeActivities, rng) {
        const slotActivities = archetypeActivities[timeSlot.name] || ['free time'];
        const activity = slotActivities[Math.floor(rng() * slotActivities.length)];
        
        // Determine location based on activity
        const activityLocations = {
            'patrol duty': ['streets', 'gates', 'market'],
            'guard post': ['gates', 'palace', 'prison'],
            'selling goods': ['market', 'shop'],
            'entertaining clients': ['brothel', 'tavern', 'private quarters'],
            'sleeping': ['home', 'barracks', 'inn'],
            'tavern visit': ['tavern'],
            'working': ['workplace', 'market', 'fields']
        };
        
        const possibleLocations = activityLocations[activity] || [null];
        const location = possibleLocations[Math.floor(rng() * possibleLocations.length)];
        
        return {
            activity: activity,
            location: location,
            priority: Math.floor(rng() * 10)
        };
    },

    // Select avatar based on characteristics
    selectAvatar(race, genderIdentity, archetype, rng) {
        // For now, return placeholder - would integrate with avatar system
        return 'images/portrait_default.png';
    },

    // Generate birth date
    generateBirthDate(rng) {
        // Generate age between 18-60
        const age = 18 + Math.floor(rng() * 42);
        const currentYear = 12219; // AI (After Impact)
        const birthYear = currentYear - age;
        
        // Random season and day
        const seasons = ['Snow', 'Rain', 'Sun', 'Harvest'];
        const season = seasons[Math.floor(rng() * seasons.length)];
        const day = 1 + Math.floor(rng() * 100); // 1-100 days per season
        
        return {
            day: day,
            season: season,
            year: birthYear,
            age: age
        };
    },

    // Select crime witness behavior
    selectCrimeWitnessLevel(archetype, rng) {
        const levels = ['ignore', 'report', 'intervene'];
        const weights = {
            'Warden': { ignore: 0.1, report: 0.3, intervene: 0.6 },
            'Courtesan': { ignore: 0.6, report: 0.3, intervene: 0.1 },
            'Witchling': { ignore: 0.4, report: 0.5, intervene: 0.1 },
            'Merchant': { ignore: 0.3, report: 0.6, intervene: 0.1 },
            'Thief': { ignore: 0.8, report: 0.1, intervene: 0.1 },
            'Noble': { ignore: 0.2, report: 0.7, intervene: 0.1 },
            'Priest': { ignore: 0.2, report: 0.6, intervene: 0.2 }
        };
        
        const archetypeWeights = weights[archetype] || { ignore: 0.4, report: 0.4, intervene: 0.2 };
        return this.weightedRandom(archetypeWeights, rng);
    },

    // Utility functions
    randomInRange(range, rng) {
        const [min, max] = range;
        return min + Math.floor(rng() * (max - min + 1));
    },

    weightedRandom(weights, rng) {
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        let random = rng() * totalWeight;
        
        for (const [key, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return key;
        }
        
        return Object.keys(weights)[0]; // Fallback
    },

    normalRandom(mean, stdDev, rng) {
        // Box-Muller transform for normal distribution
        const u1 = rng();
        const u2 = rng();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return mean + z0 * stdDev;
    },

    // Population management
    getLocationPopulation(locationId) {
        return this.locationPopulations.get(locationId) || new Set();
    },

    addNPCToLocation(rgnpcId, locationId) {
        if (!this.locationPopulations.has(locationId)) {
            this.locationPopulations.set(locationId, new Set());
        }
        this.locationPopulations.get(locationId).add(rgnpcId);
        
        // Update NPC's current location
        const npc = this.npcs.get(rgnpcId);
        if (npc) {
            npc.currentLocation = locationId;
        }
    },

    removeNPCFromLocation(rgnpcId, locationId) {
        const population = this.locationPopulations.get(locationId);
        if (population) {
            population.delete(rgnpcId);
        }
    },

    // Check if location can accommodate more NPCs
    canAddNPCToLocation(locationId, locationType = 'default') {
        const currentPopulation = this.getLocationPopulation(locationId).size;
        const maxPopulation = this.config.maxPopulationPerLocation[locationType] || this.config.maxPopulationPerLocation.default;
        return currentPopulation < maxPopulation;
    },

    // Get NPCs in a specific location
    getNPCsInLocation(locationId) {
        const population = this.getLocationPopulation(locationId);
        return Array.from(population).map(id => this.npcs.get(id)).filter(npc => npc);
    },

    // Get RGNPC by ID
    getRGNPC(rgnpcId) {
        return this.npcs.get(rgnpcId);
    },

    // Update RGNPC relationship values
    updateRelationship(rgnpcId, relationshipType, change) {
        const npc = this.npcs.get(rgnpcId);
        if (!npc) return false;

        const range = this.config.relationshipRanges[relationshipType];
        if (!range) return false;

        const [min, max] = range;
        npc[relationshipType] = Math.max(min, Math.min(max, npc[relationshipType] + change));
        
        // Trigger event for UI updates
        $(document).trigger('rgnpc:relationship_updated', {
            rgnpcId: rgnpcId,
            type: relationshipType,
            newValue: npc[relationshipType]
        });
        
        return true;
    },

    // Mark NPC as known to player
    introduceNPC(rgnpcId) {
        const npc = this.npcs.get(rgnpcId);
        if (npc) {
            npc.known = true;
            npc.lastInteraction = Date.now();
            
            // Trigger event for UI updates
            $(document).trigger('rgnpc:introduced', { rgnpcId: rgnpcId });
            
            return true;
        }
        return false;
    },

    // Add known trait to NPC (gradual discovery)
    revealTrait(rgnpcId, trait) {
        const npc = this.npcs.get(rgnpcId);
        if (npc && npc.traits.includes(trait)) {
            npc.knownTraits.add(trait);
            
            // Trigger event for UI updates
            $(document).trigger('rgnpc:trait_revealed', {
                rgnpcId: rgnpcId,
                trait: trait
            });
            
            return true;
        }
        return false;
    },

    // Get current schedule activity for NPC
    getCurrentActivity(rgnpcId, currentTime = new Date()) {
        const npc = this.npcs.get(rgnpcId);
        if (!npc) return null;

        const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][currentTime.getDay()];
        const hour = currentTime.getHours() + currentTime.getMinutes() / 60;

        // Find current time slot
        const currentSlot = this.config.scheduleSlots.find(slot => {
            if (slot.name === 'lateNight') {
                return hour >= slot.start || hour < slot.end;
            }
            return hour >= slot.start && hour < slot.end;
        });

        if (!currentSlot) return null;

        return npc.schedule[dayOfWeek]?.[currentSlot.name] || null;
    },

    // Kill an RGNPC (for consequences system)
    killRGNPC(rgnpcId, replacement = true) {
        const npc = this.npcs.get(rgnpcId);
        if (!npc) return false;

        const location = npc.currentLocation;
        
        // Remove from location
        if (location) {
            this.removeNPCFromLocation(rgnpcId, location);
        }

        // Remove from main storage
        this.npcs.delete(rgnpcId);

        console.log(`💀 RGNPC ${npc.name || npc.defaultName} (${rgnpcId}) has died`);

        // Trigger death event
        $(document).trigger('rgnpc:died', {
            rgnpcId: rgnpcId,
            name: npc.name || npc.defaultName,
            location: location
        });

        // Optionally generate replacement
        if (replacement && location) {
            setTimeout(() => {
                this.generateReplacementNPC(location);
            }, Math.random() * 86400000); // Random delay up to 24 hours
        }

        return true;
    },

    // Generate replacement NPC for location
    generateReplacementNPC(locationId, locationType = 'default') {
        if (!this.canAddNPCToLocation(locationId, locationType)) {
            return null;
        }

        const newNPC = this.generateRGNPC({ 
            location: locationId,
            locationType: locationType
        });
        this.addNPCToLocation(newNPC.rgnpcId, locationId);
        
        console.log(`🔄 Generated replacement RGNPC: ${newNPC.defaultName} in ${locationId}`);
        return newNPC;
    },

    // Populate a location with NPCs
    populateLocation(locationId, locationType = 'default', targetPopulation = null) {
        const maxPop = targetPopulation || this.config.maxPopulationPerLocation[locationType] || this.config.maxPopulationPerLocation.default;
        const currentPop = this.getLocationPopulation(locationId).size;
        const needed = Math.max(0, maxPop - currentPop);

        const generated = [];
        for (let i = 0; i < needed; i++) {
            const npc = this.generateRGNPC({ 
                location: locationId,
                locationType: locationType
            });
            this.addNPCToLocation(npc.rgnpcId, locationId);
            generated.push(npc);
        }

        console.log(`🏘️ Populated ${locationId} with ${generated.length} new RGNPCs (${currentPop + generated.length}/${maxPop})`);
        return generated;
    },

    // Persistence functions
    savePersistedData() {
        try {
            const data = {
                npcs: Array.from(this.npcs.entries()).map(([id, npc]) => {
                    // Convert Set to Array for serialization
                    const serializedNPC = { ...npc };
                    if (npc.knownTraits instanceof Set) {
                        serializedNPC.knownTraits = Array.from(npc.knownTraits);
                    }
                    return [id, serializedNPC];
                }),
                locationPopulations: Array.from(this.locationPopulations.entries()).map(([key, value]) => [key, Array.from(value)]),
                version: '1.1'
            };
            
            localStorage.setItem('rgnpc_data', JSON.stringify(data));
            console.log('💾 RGNPC data saved to localStorage');
        } catch (error) {
            console.error('❌ Failed to save RGNPC data:', error);
        }
    },

    loadPersistedData() {
        try {
            const saved = localStorage.getItem('rgnpc_data');
            if (!saved) return;

            const data = JSON.parse(saved);
            
            // Restore NPCs
            this.npcs.clear();
            for (const [id, npc] of data.npcs) {
                // Convert knownTraits back to Set
                if (Array.isArray(npc.knownTraits)) {
                    npc.knownTraits = new Set(npc.knownTraits);
                } else if (!npc.knownTraits) {
                    npc.knownTraits = new Set();
                }
                this.npcs.set(id, npc);
            }

            // Restore location populations
            this.locationPopulations.clear();
            for (const [locationId, npcIds] of data.locationPopulations) {
                this.locationPopulations.set(locationId, new Set(npcIds));
            }

            console.log(`📂 Loaded ${this.npcs.size} RGNPCs from localStorage`);
        } catch (error) {
            console.error('❌ Failed to load RGNPC data:', error);
        }
    },

    // Event listeners setup
    setupEventListeners() {
        // Save data periodically
        setInterval(() => {
            this.savePersistedData();
        }, 300000); // Every 5 minutes

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.savePersistedData();
        });

        // Listen for game events that might affect NPCs
        $(document).on('rgnpc:relationship_change', (event, data) => {
            this.updateRelationship(data.rgnpcId, data.type, data.change);
        });

        $(document).on('rgnpc:introduce', (event, data) => {
            this.introduceNPC(data.rgnpcId);
        });

        $(document).on('rgnpc:reveal_trait', (event, data) => {
            this.revealTrait(data.rgnpcId, data.trait);
        });

        // Listen for location changes
        $(document).on('location:changed', (event, data) => {
            // Could trigger NPC movement based on schedules
            this.updateNPCLocations(data.newLocation);
        });
    },

    // Update NPC locations based on schedules
    updateNPCLocations(currentLocation) {
        const currentTime = new Date();
        
        // Check each NPC's schedule
        for (const [rgnpcId, npc] of this.npcs) {
            const activity = this.getCurrentActivity(rgnpcId, currentTime);
            if (activity && activity.location && activity.location !== npc.currentLocation) {
                // NPC should be somewhere else based on schedule
                // This could trigger movement or just update their location
                console.log(`📍 ${npc.name || npc.defaultName} should be at ${activity.location} for ${activity.activity}`);
            }
        }
    },

    // Debug functions
    debugInfo() {
        console.log('🧩 RGNPC System Debug Info:');
        console.log(`Total NPCs: ${this.npcs.size}`);
        console.log(`Locations with NPCs: ${this.locationPopulations.size}`);
        
        for (const [locationId, population] of this.locationPopulations) {
            console.log(`  ${locationId}: ${population.size} NPCs`);
        }
        
        // Show data file status
        console.log('\n📁 Data File Status:');
        this.validateDataFiles();
    },

    // Generate test NPCs for debugging
    generateTestNPCs(count = 5, locationId = 'test_location', locationType = 'default') {
        const generated = [];
        for (let i = 0; i < count; i++) {
            const npc = this.generateRGNPC({ 
                location: locationId,
                locationType: locationType
            });
            this.addNPCToLocation(npc.rgnpcId, locationId);
            generated.push(npc);
        }
        
        console.log(`🧪 Generated ${count} test RGNPCs in ${locationId}`);
        return generated;
    },

    // Export system state for debugging
    exportSystemState() {
        return {
            npcs: Array.from(this.npcs.entries()),
            locationPopulations: Array.from(this.locationPopulations.entries()).map(([k, v]) => [k, Array.from(v)]),
            config: this.config
        };
    }
};

// Initialize the system when the script loads
$(document).ready(() => {
    if (window.RGNPCSystem) {
        RGNPCSystem.initialize();
    }
});
