// People overlay functionality
window.PeopleOverlay = {
    currentLocation: null,
    selectedPersonId: null,
    filterSettings: {
        relationship: 'all',
        archetype: 'all'
    },
    
    // Initialize the overlay
    initialize() {
        console.log('🎭 Initializing People Overlay...');
        this.setupEventListeners();
        this.loadFilterSettings();
        this.refreshPeopleList();
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Filter controls
        const relationshipFilter = document.getElementById('relationship-filter');
        const archetypeFilter = document.getElementById('archetype-filter');
        const refreshButton = document.getElementById('refresh-people');
        
        if (relationshipFilter) {
            relationshipFilter.addEventListener('change', (e) => {
                this.filterSettings.relationship = e.target.value;
                this.saveFilterSettings();
                this.refreshPeopleList();
            });
        }
        
        if (archetypeFilter) {
            archetypeFilter.addEventListener('change', (e) => {
                this.filterSettings.archetype = e.target.value;
                this.saveFilterSettings();
                this.refreshPeopleList();
            });
        }
        
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.refreshPeopleList();
            });
        }
        
        // Listen for RGNPC system events
        $(document).on('rgnpc:relationship_updated', (event, data) => {
            if (this.selectedPersonId === data.rgnpcId) {
                this.showPersonDetails(data.rgnpcId);
            }
            // Update the person card if visible
            this.updatePersonCard(data.rgnpcId);
        });
        
        $(document).on('rgnpc:introduced', (event, data) => {
            this.refreshPeopleList();
            if (this.selectedPersonId === data.rgnpcId) {
                this.showPersonDetails(data.rgnpcId);
            }
        });
        
        $(document).on('rgnpc:trait_revealed', (event, data) => {
            if (this.selectedPersonId === data.rgnpcId) {
                this.showPersonDetails(data.rgnpcId);
            }
        });
        
        $(document).on('rgnpc:died', (event, data) => {
            if (this.selectedPersonId === data.rgnpcId) {
                this.selectedPersonId = null;
                document.getElementById('person-details').style.display = 'none';
            }
            this.refreshPeopleList();
        });
    },
    
    // Load filter settings from localStorage
    loadFilterSettings() {
        try {
            const saved = localStorage.getItem('people_overlay_filters');
            if (saved) {
                this.filterSettings = JSON.parse(saved);
                // Apply to UI
                const relationshipFilter = document.getElementById('relationship-filter');
                const archetypeFilter = document.getElementById('archetype-filter');
                if (relationshipFilter) relationshipFilter.value = this.filterSettings.relationship || 'all';
                if (archetypeFilter) archetypeFilter.value = this.filterSettings.archetype || 'all';
            }
        } catch (error) {
            console.error('Failed to load filter settings:', error);
        }
    },
    
    // Save filter settings to localStorage
    saveFilterSettings() {
        try {
            localStorage.setItem('people_overlay_filters', JSON.stringify(this.filterSettings));
        } catch (error) {
            console.error('Failed to save filter settings:', error);
        }
    },
    
    // Refresh the people list
    refreshPeopleList() {
        this.currentLocation = this.getCurrentLocation();
        this.updateLocationInfo();
        this.loadPeopleInLocation();
    },
    
    // Get current location (integrate with map system)
    getCurrentLocation() {
        // Try to get location from MapSystem
        if (window.MapSystem && typeof MapSystem.getCurrentLocation === 'function') {
            try {
                const location = MapSystem.getCurrentLocation();
                if (location) return location;
            } catch (error) {
                console.warn('Failed to get location from MapSystem:', error);
            }
        }
        
        // Try to get from game state
        if (window.State && State.variables && State.variables.currentLocation) {
            return State.variables.currentLocation;
        }
        
        // Default for testing
        return 'test_location';
    },
    
    // Update location information display
    updateLocationInfo() {
        const locationName = this.getLocationDisplayName(this.currentLocation);
        const population = window.RGNPCSystem ? RGNPCSystem.getLocationPopulation(this.currentLocation).size : 0;
        
        document.getElementById('current-location-name').textContent = locationName;
        document.getElementById('location-population').textContent = `Population: ${population}`;
        document.getElementById('people-title').textContent = `People (${population})`;
    },
    
    // Get display name for location
    getLocationDisplayName(locationId) {
        // Try to get from MapSystem first
        if (window.MapSystem && typeof MapSystem.getLocationName === 'function') {
            try {
                const name = MapSystem.getLocationName(locationId);
                if (name) return name;
            } catch (error) {
                console.warn('Failed to get location name from MapSystem:', error);
            }
        }
        
        // Fallback to predefined names
        const locationNames = {
            'test_location': 'Test Location',
            'tavern': 'The Local Tavern',
            'market': 'Market Square',
            'temple': 'Sacred Temple',
            'palace': 'Royal Palace',
            'slums': 'The Slums',
            'brothel': 'The Velvet Rose',
            'library': 'Grand Library',
            'barracks': 'City Barracks',
            'docks': 'Harbor District',
            'residential': 'Residential Quarter',
            'noble_district': 'Noble District'
        };
        
        return locationNames[locationId] || locationId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    
    // Load people in current location
    loadPeopleInLocation() {
        if (!window.RGNPCSystem) {
            this.showEmptyState();
            return;
        }
        
        const people = RGNPCSystem.getNPCsInLocation(this.currentLocation);
        const filteredPeople = this.applyFilters(people);
        
        if (filteredPeople.length === 0) {
            this.showEmptyState();
        } else {
            this.displayPeople(filteredPeople);
        }
    },
    
    // Apply filters to people list
    applyFilters(people) {
        const relationshipFilter = this.filterSettings.relationship || 'all';
        const archetypeFilter = this.filterSettings.archetype || 'all';
        
        return people.filter(person => {
            // Relationship filter
            if (relationshipFilter !== 'all') {
                switch (relationshipFilter) {
                    case 'known':
                        if (!person.known) return false;
                        break;
                    case 'unknown':
                        if (person.known) return false;
                        break;
                    case 'friendly':
                        if (person.trust <= 0 && person.affection <= 0) return false;
                        break;
                    case 'hostile':
                        if (person.trust >= 0 && person.tension <= 5) return false;
                        break;
                    case 'romantic':
                        if (person.affection < 5) return false;
                        break;
                    case 'trusted':
                        if (person.trust < 5) return false;
                        break;
                }
            }
            
            // Archetype filter
            if (archetypeFilter !== 'all' && person.archetype !== archetypeFilter) {
                return false;
            }
            
            return true;
        });
    },
    
    // Display people in the list
    displayPeople(people) {
        const peopleList = document.getElementById('people-list');
        const emptyState = document.getElementById('empty-state');
        
        emptyState.style.display = 'none';
        peopleList.style.display = 'grid';
        
        peopleList.innerHTML = people.map(person => this.createPersonCard(person)).join('');
        
        // Add click listeners
        peopleList.querySelectorAll('.person-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectPerson(card.dataset.personId);
            });
        });
    },
    
    // Create a person card HTML
    createPersonCard(person) {
        const displayName = person.known ? person.name : person.defaultName;
        const relationshipDots = this.getRelationshipDots(person);
        
        return `
            <div class="person-card" data-person-id="${person.rgnpcId}">
                <div class="person-card-header">
                    <img class="person-card-avatar" src="${person.avatar}" alt="Portrait">
                    <div class="person-card-name">${displayName}</div>
                </div>
                <div class="person-card-description">
                    ${this.getPersonDescription(person)}
                </div>
                <div class="person-card-status">
                    <div class="relationship-indicator">${relationshipDots}</div>
                    <div class="archetype-tag">${person.archetype}</div>
                </div>
            </div>
        `;
    },
    
    // Get person description based on what player knows
    getPersonDescription(person) {
        if (!person.known) {
            // Use body descriptors if available
            if (setup.BodyDescriptors && typeof setup.BodyDescriptors.describeFullAppearance === 'function') {
                try {
                    return setup.BodyDescriptors.describeFullAppearance(person.body);
                } catch (error) {
                    console.warn('Failed to generate body description:', error);
                }
            }
            // Fallback description
            return `A ${person.race} ${person.pronouns.noun} with ${person.body.hairColor} hair.`;
        } else {
            // Known person - show personality
            let description = '';
            
            // Add known traits
            if (person.knownTraits && person.knownTraits.size > 0) {
                const traits = Array.from(person.knownTraits).slice(0, 2);
                description = `A ${traits.join(', ').toLowerCase()} ${person.pronouns.noun}`;
            } else {
                description = `A ${person.archetype.toLowerCase()}`;
            }
            
            // Add occupation if known
            if (person.occupation && person.occupation.jobTitle) {
                description += ` who works as a ${person.occupation.jobTitle.toLowerCase()}`;
            }
            
            return description + '.';
        }
    },
    
    // Get relationship indicator dots
    getRelationshipDots(person) {
        const getClass = (value, isReverse = false) => {
            if (isReverse) {
                return value > 5 ? 'negative' : value > 2 ? 'neutral' : 'positive';
            }
            return value > 2 ? 'positive' : value < -2 ? 'negative' : 'neutral';
        };
        
        return `
            <div class="relationship-dot ${getClass(person.trust)}" title="Trust: ${person.trust}"></div>
            <div class="relationship-dot ${getClass(person.affection)}" title="Affection: ${person.affection}"></div>
            <div class="relationship-dot ${getClass(person.tension, true)}" title="Tension: ${person.tension}"></div>
        `;
    },
    
    // Select a person to view details
    selectPerson(personId) {
        // Remove previous selection
        document.querySelectorAll('.person-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        const selectedCard = document.querySelector(`[data-person-id="${personId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        this.selectedPersonId = personId;
        this.showPersonDetails(personId);
    },
    
    // Show detailed information about a person
    showPersonDetails(personId) {
        const person = RGNPCSystem.getRGNPC(personId);
        if (!person) {
            console.warn(`Person not found: ${personId}`);
            return;
        }
        
        const detailsPanel = document.getElementById('person-details');
        if (!detailsPanel) {
            console.error('Person details panel not found');
            return;
        }
        
        detailsPanel.style.display = 'block';
        
        // Update basic info
        const displayName = person.known ? person.name : person.defaultName;
        const nameElement = document.getElementById('person-name');
        const avatarElement = document.getElementById('person-avatar');
        const descriptionElement = document.getElementById('person-description');
        
        if (nameElement) nameElement.textContent = displayName;
        if (avatarElement) avatarElement.src = person.avatar || 'images/portrait_default.png';
        if (descriptionElement) descriptionElement.textContent = this.getPersonDescription(person);
        
        // Update pronouns in UI
        this.updatePronounDisplay(person);
        
        // Update relationship meters
        this.updateRelationshipMeters(person);
        
        // Update known information
        this.updateKnownInformation(person);
        
        // Update action buttons
        this.updateActionButtons(person);
        
        // Update debug info if enabled
        if (window.DEBUG_MODE) {
            this.updateDebugInfo(person);
        }
    },
    
    // Update pronoun display
    updatePronounDisplay(person) {
        const pronounElement = document.getElementById('person-pronouns');
        if (pronounElement) {
            pronounElement.textContent = `(${person.pronouns.subject}/${person.pronouns.object})`;
        }
    },
    
    // Update relationship meters
    updateRelationshipMeters(person) {
        const relationships = ['trust', 'affection', 'rapport', 'tension'];
        
        relationships.forEach(rel => {
            const value = person[rel];
            const range = RGNPCSystem.config.relationshipRanges[rel];
            const percentage = ((value - range[0]) / (range[1] - range[0])) * 100;
            
            document.getElementById(`${rel}-meter`).style.width = `${Math.max(0, Math.min(100, percentage))}%`;
            document.getElementById(`${rel}-value`).textContent = value;
        });
    },
    
    // Update known information section
    updateKnownInformation(person) {
        const knownInfo = document.getElementById('known-info');
        if (!knownInfo) return;
        
        // Reset all info items
        knownInfo.querySelectorAll('.info-item').forEach(item => {
            item.style.display = 'none';
        });
        
        if (person.known) {
            // Show occupation
            const occupationInfo = document.getElementById('occupation-info');
            const occupationText = document.getElementById('occupation-text');
            if (occupationInfo && occupationText && person.occupation) {
                occupationInfo.style.display = 'block';
                occupationText.textContent = person.occupation.jobTitle || 'Unknown';
            }
            
            // Show known traits
            if (person.knownTraits && person.knownTraits.size > 0) {
                const traitsInfo = document.getElementById('traits-info');
                const traitsText = document.getElementById('traits-text');
                if (traitsInfo && traitsText) {
                    traitsInfo.style.display = 'block';
                    const traitNames = Array.from(person.knownTraits).map(trait => {
                        // Capitalize trait names
                        return trait.charAt(0).toUpperCase() + trait.slice(1);
                    });
                    traitsText.textContent = traitNames.join(', ');
                }
            } else if (person.traits && person.traits.length > 0) {
                // Show some traits if relationship is decent
                if (person.trust > 2 || person.affection > 2) {
                    const traitsInfo = document.getElementById('traits-info');
                    const traitsText = document.getElementById('traits-text');
                    if (traitsInfo && traitsText) {
                        traitsInfo.style.display = 'block';
                        traitsText.textContent = 'Seems ' + person.traits[0].toLowerCase() + '...';
                    }
                }
            }
            
            // Show motivations if relationship is high enough
            if ((person.trust > 5 || person.affection > 5) && person.motivations && person.motivations.length > 0) {
                const motivationsInfo = document.getElementById('motivations-info');
                const motivationsText = document.getElementById('motivations-text');
                if (motivationsInfo && motivationsText) {
                    motivationsInfo.style.display = 'block';
                    const motivationNames = person.motivations.map(m => {
                        return m.charAt(0).toUpperCase() + m.slice(1);
                    });
                    motivationsText.textContent = motivationNames.join(', ');
                }
            }
            
            // Show inclinations if very close
            if ((person.trust > 7 || person.affection > 7) && person.inclinations && person.inclinations.length > 0) {
                const inclinationsInfo = document.getElementById('inclinations-info');
                if (!inclinationsInfo) {
                    // Create inclinations info if it doesn't exist
                    const infoGrid = document.querySelector('.info-grid');
                    if (infoGrid) {
                        const div = document.createElement('div');
                        div.className = 'info-item';
                        div.id = 'inclinations-info';
                        div.innerHTML = '<strong>Preferences:</strong> <span id="inclinations-text"></span>';
                        infoGrid.appendChild(div);
                    }
                }
                const inclinationsText = document.getElementById('inclinations-text');
                if (inclinationsText) {
                    document.getElementById('inclinations-info').style.display = 'block';
                    inclinationsText.textContent = person.inclinations.join(', ');
                }
            }
            
            // Show current activity
            const activity = RGNPCSystem.getCurrentActivity(person.rgnpcId);
            if (activity) {
                const scheduleInfo = document.getElementById('schedule-info');
                const scheduleText = document.getElementById('schedule-text');
                if (scheduleInfo && scheduleText) {
                    scheduleInfo.style.display = 'block';
                    let activityText = activity.activity.charAt(0).toUpperCase() + activity.activity.slice(1);
                    if (activity.location) {
                        activityText += ` at ${activity.location}`;
                    }
                    scheduleText.textContent = activityText;
                }
            }
        }
    },
    
    // Update action buttons
    updateActionButtons(person) {
        // Show/hide pickpocket button based on ability and relationship
        const pickpocketBtn = document.getElementById('pickpocket-btn');
        pickpocketBtn.style.display = person.canBePickpocketed && person.trust < 5 ? 'inline-block' : 'none';
        
        // Show/hide attack button based on game state
        const attackBtn = document.getElementById('attack-btn');
        attackBtn.style.display = person.canBeAttacked ? 'inline-block' : 'none';
    },
    
    // Update debug information
    updateDebugInfo(person) {
        const debugInfo = document.getElementById('debug-info');
        debugInfo.style.display = 'block';
        
        document.getElementById('debug-id').textContent = person.rgnpcId;
        document.getElementById('debug-race').textContent = person.race;
        document.getElementById('debug-archetype').textContent = person.archetype;
        document.getElementById('debug-age').textContent = person.birthDate.age;
        document.getElementById('debug-created').textContent = new Date(person.createdAt).toLocaleString();
    },
    
    // Show empty state
    showEmptyState() {
        const peopleList = document.getElementById('people-list');
        const emptyState = document.getElementById('empty-state');
        const personDetails = document.getElementById('person-details');
        
        if (peopleList) peopleList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        if (personDetails) personDetails.style.display = 'none';
    },
    
    // Update a specific person card
    updatePersonCard(personId) {
        const card = document.querySelector(`[data-person-id="${personId}"]`);
        if (!card) return;
        
        const person = RGNPCSystem.getRGNPC(personId);
        if (!person) return;
        
        // Update name
        const nameElement = card.querySelector('.person-card-name');
        if (nameElement) {
            nameElement.textContent = person.known ? person.name : person.defaultName;
        }
        
        // Update description
        const descElement = card.querySelector('.person-card-description');
        if (descElement) {
            descElement.textContent = this.getPersonDescription(person);
        }
        
        // Update relationship dots
        const dotsContainer = card.querySelector('.relationship-indicator');
        if (dotsContainer) {
            dotsContainer.innerHTML = this.getRelationshipDots(person);
        }
    }
};

// Action functions
function talkToPerson() {
    if (!PeopleOverlay.selectedPersonId) {
        console.warn('No person selected');
        return;
    }
    
    const person = RGNPCSystem.getRGNPC(PeopleOverlay.selectedPersonId);
    if (!person) {
        console.error('Selected person not found');
        return;
    }
    
    // Introduce the person if not known
    if (!person.known) {
        RGNPCSystem.introduceNPC(PeopleOverlay.selectedPersonId);
        PeopleOverlay.refreshPeopleList();
        PeopleOverlay.showPersonDetails(PeopleOverlay.selectedPersonId);
    }
    
    // Store the NPC ID for dialogue system
    if (window.State && State.variables) {
        State.variables.currentNPCId = PeopleOverlay.selectedPersonId;
        State.variables.currentNPC = person;
    }
    
    // This would integrate with dialogue system
    console.log(`💬 Initiating conversation with ${person.name || person.defaultName}`);
    
    // If dialogue system exists, use it
    if (window.DialogueSystem && typeof DialogueSystem.startConversation === 'function') {
        DialogueSystem.startConversation(person);
    }
    
    // Close overlay to show dialogue
    if (typeof closeOverlay === 'function') {
        closeOverlay();
    }
}

function observePerson() {
    if (!PeopleOverlay.selectedPersonId) {
        console.warn('No person selected');
        return;
    }
    
    const person = RGNPCSystem.getRGNPC(PeopleOverlay.selectedPersonId);
    if (!person) {
        console.error('Selected person not found');
        return;
    }
    
    // Check if we can reveal more about this person
    const unrevealedTraits = person.traits.filter(trait => !person.knownTraits.has(trait));
    
    if (unrevealedTraits.length > 0) {
        // Reveal a random trait
        const randomTrait = unrevealedTraits[Math.floor(Math.random() * unrevealedTraits.length)];
        RGNPCSystem.revealTrait(PeopleOverlay.selectedPersonId, randomTrait);
        
        // Show notification
        const traitName = randomTrait.charAt(0).toUpperCase() + randomTrait.slice(1);
        console.log(`👁️ You notice that ${person.pronouns.subject} seems ${traitName.toLowerCase()}.`);
        
        // Update UI
        PeopleOverlay.showPersonDetails(PeopleOverlay.selectedPersonId);
        
        // Small relationship boost for observation
        RGNPCSystem.updateRelationship(PeopleOverlay.selectedPersonId, 'rapport', 1);
    } else {
        console.log(`👁️ You've already learned all you can from observing ${person.name || person.defaultName}.`);
    }
}

function attemptPickpocket() {
    if (!PeopleOverlay.selectedPersonId) return;
    
    const person = RGNPCSystem.getRGNPC(PeopleOverlay.selectedPersonId);
    if (!person) return;
    
    // This would integrate with crime/stealth systems
    console.log(`Attempting to pickpocket ${person.name || person.defaultName}`);
}

function attackPerson() {
    if (!PeopleOverlay.selectedPersonId) return;
    
    const person = RGNPCSystem.getRGNPC(PeopleOverlay.selectedPersonId);
    if (!person) return;
    
    // This would integrate with combat systems
    console.log(`Attacking ${person.name || person.defaultName}`);
}

function generateTestPeople() {
    if (!window.RGNPCSystem) {
        console.warn('RGNPC System not available');
        return;
    }
    
    // Generate test NPCs in current location
    const location = PeopleOverlay.getCurrentLocation();
    const locationType = PeopleOverlay.getLocationType(location);
    
    console.log(`🧪 Generating test NPCs for ${location} (${locationType})`);
    
    // Generate appropriate number based on location type
    const count = locationType === 'tavern' ? 8 : 5;
    RGNPCSystem.generateTestNPCs(count, location, locationType);
    
    PeopleOverlay.refreshPeopleList();
}

// Additional helper functions for PeopleOverlay
PeopleOverlay.getLocationType = function(locationId) {
    // Map location IDs to types for proper archetype selection
    const locationTypes = {
        'tavern': 'tavern',
        'market': 'market',
        'temple': 'temple',
        'palace': 'palace',
        'slums': 'slums',
        'brothel': 'tavern', // Similar to tavern
        'library': 'temple', // Similar to temple for scholars
        'barracks': 'palace', // Similar to palace for guards
        'docks': 'market', // Similar to market
        'residential': 'default',
        'noble_district': 'palace'
    };
    
    return locationTypes[locationId] || 'default';
};

// Initialize the overlay when it opens
$(document).on(':overlayopen', function(event, source) {
    if (source === 'people-page' || source === 'people-page.html') {
        if (window.PeopleOverlay) {
            PeopleOverlay.initialize();
        }
    }
});
