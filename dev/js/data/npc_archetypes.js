setup.Archetypes = {
    // Military & Law Enforcement
    "Warden": {
        tags: ["Guard", "Loyal", "Stoic"],
        statRanges: {
            strength: [6, 10],
            charisma: [1, 5],
            insight: [4, 7]
        },
        styles: ["stern", "stoic", "polite"],
        preferredTraits: ["stoic", "loyal", "serious", "confident"],
        preferredMotivations: ["justice", "duty", "loyalty"],
        preferredInclinations: ["vanilla", "domination"],
        description: "Professional guards, soldiers, and law enforcement officers who maintain order."
    },
    
    "Soldier": {
        tags: ["Military", "Disciplined", "Tough"],
        statRanges: {
            strength: [7, 10],
            toughness: [6, 9],
            charisma: [2, 6]
        },
        styles: ["stern", "crude", "stoic"],
        preferredTraits: ["disciplined", "bold", "loyal", "serious"],
        preferredMotivations: ["duty", "survival", "loyalty"],
        preferredInclinations: ["roughplay", "domination", "vanilla"],
        description: "Battle-hardened warriors and military personnel."
    },

    // Entertainment & Social
    "Courtesan": {
        tags: ["Charmer", "Temptress", "Tactician"],
        statRanges: {
            charisma: [7, 10],
            agility: [4, 7],
            intelligence: [5, 8]
        },
        styles: ["seductive", "warm", "theatrical"],
        preferredTraits: ["flirty", "charismatic", "confident", "empathic"],
        preferredMotivations: ["pleasure", "wealth", "power"],
        preferredInclinations: ["seductive", "praise", "exhibitionism"],
        description: "Skilled entertainers who use charm and allure professionally."
    },

    "Bard": {
        tags: ["Artistic", "Charismatic", "Storyteller"],
        statRanges: {
            charisma: [6, 9],
            intelligence: [5, 8],
            agility: [4, 7]
        },
        styles: ["theatrical", "warm", "bubbly"],
        preferredTraits: ["charismatic", "expressive", "curious", "flirty"],
        preferredMotivations: ["fame", "knowledge", "thrill"],
        preferredInclinations: ["exhibitionism", "roleplay", "praise"],
        description: "Musicians, storytellers, and performers who entertain crowds."
    },

    "Merchant": {
        tags: ["Trader", "Persuasive", "Opportunistic"],
        statRanges: {
            charisma: [5, 8],
            intelligence: [6, 9],
            insight: [5, 8]
        },
        styles: ["cunning", "polite", "arrogant"],
        preferredTraits: ["charismatic", "cunning", "confident", "greedy"],
        preferredMotivations: ["wealth", "power", "legacy"],
        preferredInclinations: ["vanilla", "domination", "luxury"],
        description: "Traders and business people focused on profit and deals."
    },

    // Scholarly & Mystical
    "Witchling": {
        tags: ["Arcane", "Unsettling", "Reclusive"],
        statRanges: {
            intelligence: [8, 10],
            insight: [7, 10],
            toughness: [2, 5]
        },
        styles: ["aloof", "scholarly", "cold"],
        preferredTraits: ["curious", "secretive", "detached", "scholarly"],
        preferredMotivations: ["knowledge", "power", "mystery"],
        preferredInclinations: ["sensory", "bondage", "roleplay"],
        description: "Practitioners of arcane arts and mysterious knowledge."
    },

    "Scholar": {
        tags: ["Intellectual", "Bookish", "Analytical"],
        statRanges: {
            intelligence: [7, 10],
            insight: [6, 9],
            strength: [1, 4]
        },
        styles: ["scholarly", "polite", "aloof"],
        preferredTraits: ["curious", "scholarly", "serious", "introverted"],
        preferredMotivations: ["knowledge", "legacy", "truth"],
        preferredInclinations: ["vanilla", "sensual", "intellectual"],
        description: "Researchers, librarians, and academics devoted to learning."
    },

    "Healer": {
        tags: ["Compassionate", "Wise", "Nurturing"],
        statRanges: {
            insight: [7, 10],
            intelligence: [6, 9],
            charisma: [5, 8]
        },
        styles: ["warm", "humble", "scholarly"],
        preferredTraits: ["empathic", "kind", "wise", "nurturing"],
        preferredMotivations: ["healing", "service", "compassion"],
        preferredInclinations: ["vanilla", "sensual", "aftercare"],
        description: "Medical practitioners and healers who tend to the sick and wounded."
    },

    // Working Class
    "Artisan": {
        tags: ["Skilled", "Creative", "Practical"],
        statRanges: {
            agility: [6, 9],
            intelligence: [5, 8],
            strength: [4, 7]
        },
        styles: ["humble", "warm", "crude"],
        preferredTraits: ["creative", "practical", "proud", "hardworking"],
        preferredMotivations: ["craft", "legacy", "pride"],
        preferredInclinations: ["vanilla", "sensual", "praise"],
        description: "Skilled craftspeople who create goods with their hands."
    },

    "Laborer": {
        tags: ["Hardworking", "Strong", "Simple"],
        statRanges: {
            strength: [6, 9],
            toughness: [5, 8],
            intelligence: [2, 6]
        },
        styles: ["crude", "humble", "warm"],
        preferredTraits: ["hardworking", "simple", "loyal", "honest"],
        preferredMotivations: ["survival", "family", "security"],
        preferredInclinations: ["vanilla", "roughplay", "simple"],
        description: "Manual workers who perform physical labor for a living."
    },

    "Farmer": {
        tags: ["Rural", "Practical", "Traditional"],
        statRanges: {
            strength: [5, 8],
            toughness: [6, 9],
            insight: [4, 7]
        },
        styles: ["humble", "warm", "simple"],
        preferredTraits: ["practical", "traditional", "hardworking", "simple"],
        preferredMotivations: ["family", "tradition", "security"],
        preferredInclinations: ["vanilla", "breeding", "traditional"],
        description: "Agricultural workers who tend crops and livestock."
    },

    // Criminal & Underground
    "Thief": {
        tags: ["Sneaky", "Quick", "Opportunistic"],
        statRanges: {
            agility: [7, 10],
            intelligence: [5, 8],
            charisma: [4, 7]
        },
        styles: ["cunning", "aloof", "crude"],
        preferredTraits: ["sneaky", "quick", "opportunistic", "independent"],
        preferredMotivations: ["survival", "freedom", "wealth"],
        preferredInclinations: ["riskplay", "exhibitionism", "roughplay"],
        description: "Pickpockets, burglars, and other petty criminals."
    },

    "Smuggler": {
        tags: ["Secretive", "Daring", "Connected"],
        statRanges: {
            agility: [6, 9],
            charisma: [5, 8],
            intelligence: [6, 9]
        },
        styles: ["cunning", "charming", "secretive"],
        preferredTraits: ["daring", "secretive", "charming", "independent"],
        preferredMotivations: ["wealth", "freedom", "thrill"],
        preferredInclinations: ["riskplay", "domination", "secretive"],
        description: "Those who move illegal goods and information."
    },

    // Religious & Spiritual
    "Priest": {
        tags: ["Holy", "Devoted", "Moral"],
        statRanges: {
            insight: [7, 10],
            charisma: [6, 9],
            intelligence: [5, 8]
        },
        styles: ["humble", "warm", "scholarly"],
        preferredTraits: ["pious", "devoted", "moral", "compassionate"],
        preferredMotivations: ["faith", "service", "salvation"],
        preferredInclinations: ["vanilla", "chastity", "spiritual"],
        description: "Religious clergy devoted to serving their deity and congregation."
    },

    "Cultist": {
        tags: ["Fanatical", "Secretive", "Devoted"],
        statRanges: {
            insight: [5, 8],
            charisma: [4, 7],
            intelligence: [3, 6]
        },
        styles: ["secretive", "intense", "humble"],
        preferredTraits: ["fanatical", "secretive", "devoted", "obsessive"],
        preferredMotivations: ["faith", "power", "transformation"],
        preferredInclinations: ["submission", "ritual", "taboo"],
        description: "Members of fringe religious or mystical groups."
    },

    // Nobility & Upper Class
    "Noble": {
        tags: ["Aristocratic", "Privileged", "Refined"],
        statRanges: {
            charisma: [6, 9],
            intelligence: [5, 8],
            insight: [4, 7]
        },
        styles: ["arrogant", "polite", "theatrical"],
        preferredTraits: ["entitled", "refined", "proud", "charismatic"],
        preferredMotivations: ["power", "legacy", "status"],
        preferredInclinations: ["luxury", "domination", "exhibitionism"],
        description: "Members of the aristocracy with inherited wealth and status."
    },

    "Bureaucrat": {
        tags: ["Administrative", "Methodical", "Political"],
        statRanges: {
            intelligence: [6, 9],
            charisma: [5, 8],
            insight: [5, 8]
        },
        styles: ["polite", "cunning", "scholarly"],
        preferredTraits: ["methodical", "political", "cunning", "ambitious"],
        preferredMotivations: ["power", "order", "advancement"],
        preferredInclinations: ["control", "vanilla", "intellectual"],
        description: "Government officials and administrators who manage bureaucracy."
    },

    // Outcasts & Wanderers
    "Outcast": {
        tags: ["Rejected", "Independent", "Bitter"],
        statRanges: {
            toughness: [6, 9],
            insight: [5, 8],
            charisma: [1, 4]
        },
        styles: ["bitter", "aloof", "crude"],
        preferredTraits: ["bitter", "independent", "guarded", "cynical"],
        preferredMotivations: ["survival", "revenge", "acceptance"],
        preferredInclinations: ["roughplay", "submission", "pain"],
        description: "Those rejected by society who live on the margins."
    },

    "Wanderer": {
        tags: ["Nomadic", "Free", "Experienced"],
        statRanges: {
            agility: [6, 9],
            toughness: [5, 8],
            insight: [6, 9]
        },
        styles: ["free", "warm", "mysterious"],
        preferredTraits: ["free", "experienced", "wise", "independent"],
        preferredMotivations: ["freedom", "adventure", "knowledge"],
        preferredInclinations: ["exhibitionism", "variety", "adventure"],
        description: "Travelers and nomads who roam from place to place."
    },

    // Specialized Roles
    "Innkeeper": {
        tags: ["Hospitable", "Social", "Practical"],
        statRanges: {
            charisma: [5, 8],
            intelligence: [4, 7],
            insight: [5, 8]
        },
        styles: ["warm", "polite", "practical"],
        preferredTraits: ["hospitable", "social", "practical", "observant"],
        preferredMotivations: ["service", "community", "prosperity"],
        preferredInclinations: ["vanilla", "social", "variety"],
        description: "Those who run inns, taverns, and other hospitality businesses."
    },

    "Hunter": {
        tags: ["Tracker", "Patient", "Skilled"],
        statRanges: {
            agility: [7, 10],
            insight: [6, 9],
            strength: [5, 8]
        },
        styles: ["quiet", "practical", "intense"],
        preferredTraits: ["patient", "skilled", "observant", "independent"],
        preferredMotivations: ["survival", "mastery", "nature"],
        preferredInclinations: ["primal", "domination", "natural"],
        description: "Skilled trackers and hunters who live off the land."
    }
};

// Archetype utilities
setup.ArchetypeUtils = {
    // Get random archetype
    getRandomArchetype() {
        const archetypes = Object.keys(setup.Archetypes);
        return archetypes[Math.floor(Math.random() * archetypes.length)];
    },
    
    // Get archetypes by tag
    getArchetypesByTag(tag) {
        return Object.entries(setup.Archetypes)
            .filter(([name, data]) => data.tags.includes(tag))
            .map(([name, data]) => name);
    },
    
    // Get weighted random archetype based on location type
    getArchetypeForLocation(locationType, rng = Math.random) {
        const locationWeights = {
            'tavern': {
                'Innkeeper': 0.3,
                'Bard': 0.2,
                'Merchant': 0.15,
                'Laborer': 0.15,
                'Thief': 0.1,
                'Wanderer': 0.1
            },
            'market': {
                'Merchant': 0.4,
                'Artisan': 0.25,
                'Farmer': 0.15,
                'Thief': 0.1,
                'Laborer': 0.1
            },
            'temple': {
                'Priest': 0.5,
                'Scholar': 0.2,
                'Healer': 0.15,
                'Cultist': 0.1,
                'Noble': 0.05
            },
            'palace': {
                'Noble': 0.4,
                'Bureaucrat': 0.25,
                'Warden': 0.15,
                'Courtesan': 0.1,
                'Scholar': 0.1
            },
            'slums': {
                'Thief': 0.3,
                'Outcast': 0.25,
                'Laborer': 0.2,
                'Smuggler': 0.15,
                'Cultist': 0.1
            },
            'default': {
                'Laborer': 0.2,
                'Merchant': 0.15,
                'Artisan': 0.15,
                'Farmer': 0.1,
                'Warden': 0.1,
                'Thief': 0.1,
                'Innkeeper': 0.05,
                'Scholar': 0.05,
                'Priest': 0.05,
                'Wanderer': 0.05
            }
        };
        
        const weights = locationWeights[locationType] || locationWeights.default;
        return this.weightedRandomArchetype(weights, rng);
    },
    
    // Weighted random selection
    weightedRandomArchetype(weights, rng) {
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        let random = rng() * totalWeight;
        
        for (const [archetype, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return archetype;
        }
        
        return Object.keys(weights)[0]; // Fallback
    }
};
