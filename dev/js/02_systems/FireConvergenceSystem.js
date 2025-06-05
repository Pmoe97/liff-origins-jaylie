/**
 * FireConvergenceSystem.js - Advanced Fire Rescue Event System
 * 
 * A comprehensive stress test implementation for the NodeMapSystem that creates
 * a dynamic, randomized orphanage fire rescue scenario with complex mechanics:
 * - Breath management system
 * - Dynamic fire progression
 * - Structural collapse mechanics
 * - Item and child randomization
 * - Multiple escape routes
 * - Real-time minimap updates
 * 
 * This system pushes the node network to its limits with time-based progression,
 * conditional node changes, and complex state management.
 */

class FireConvergenceSystem {
    constructor() {
        this.isActive = false;
        this.gameState = null;
        this.nodeMapSystem = null;
        this.navigationSystem = null;
        this.updateInterval = null;
        this.ambientEventInterval = null;
        
        // Game mechanics configuration
        this.config = {
            breathDecayRate: 2, // Breath lost per second
            fireSpreadRate: 1.5, // Fire intensity increase rate
            structuralDecayRate: 0.5, // Structure damage per second
            updateFrequency: 1000, // Update every 1 second
            ambientEventFrequency: 5000, // Check for ambient events every 5 seconds
            maxBreath: 100,
            criticalBreath: 20,
            collapseThreshold: 20
        };
        
        // Child data for randomization
        this.childrenData = {
            zan: { name: "Zan", age: 8, description: "A curious boy who loves to explore" },
            mira: { name: "Mira", age: 6, description: "A quiet girl who stays close to the infirmary" },
            tom: { name: "Tom", age: 10, description: "An older boy who helps with chores" },
            sara: { name: "Sara", age: 7, description: "A bookish girl who loves the library" }
        };
        
        // Item effects and descriptions
        this.itemData = {
            wet_cloth: {
                name: "Wet Cloth",
                description: "A damp cloth that can help filter smoke",
                effect: "Reduces breath cost by 1 in smoky areas",
                onUse: () => this.gameState.hasWetCloth = true
            },
            key_ring: {
                name: "Key Ring",
                description: "A ring of keys that can unlock doors",
                effect: "Unlocks locked doors and closets",
                onUse: () => this.gameState.hasKeys = true
            },
            rope: {
                name: "Rope",
                description: "A sturdy rope for climbing",
                effect: "Enables window escape route",
                onUse: () => this.gameState.hasRope = true
            },
            healing_potion: {
                name: "Healing Potion",
                description: "A small vial of healing liquid",
                effect: "Restores 20 breath points",
                onUse: () => this.restoreBreath(20)
            },
            lantern: {
                name: "Lantern",
                description: "A bright lantern to see through smoke",
                effect: "Improves visibility in dark areas",
                onUse: () => this.gameState.hasLantern = true
            }
        };
        
        // Bind methods for event handling
        this.handleRoomEntry = this.handleRoomEntry.bind(this);
        this.handleRoomInteraction = this.handleRoomInteraction.bind(this);
        this.handleAlternateExit = this.handleAlternateExit.bind(this);
        this.handleWindowEscape = this.handleWindowEscape.bind(this);
        this.discoverAlternateExit = this.discoverAlternateExit.bind(this);
        this.showMessage = this.showMessage.bind(this);
        
        // Make methods globally available for node events
        window.FireConvergence = {
            handleRoomEntry: this.handleRoomEntry,
            handleRoomInteraction: this.handleRoomInteraction,
            handleAlternateExit: this.handleAlternateExit,
            handleWindowEscape: this.handleWindowEscape,
            discoverAlternateExit: this.discoverAlternateExit,
            showMessage: this.showMessage,
            increaseFireIntensity: () => this.increaseFireIntensity(),
            damageStructure: (amount) => this.damageStructure(amount),
            giveChildHint: () => this.giveChildHint(),
            increaseBreathCost: (amount) => this.increaseBreathCost(amount)
        };
    }

    /**
     * Initialize the FireConvergence event
     * @param {NodeMapSystem} nodeMapSystem - The node map system instance
     * @param {NodeNavigationSystem} navigationSystem - The navigation system instance
     */
    async initialize(nodeMapSystem, navigationSystem) {
        this.nodeMapSystem = nodeMapSystem;
        this.navigationSystem = navigationSystem;
        
        console.log('Initializing FireConvergence event...');
        
        // Initialize game state
        this.initializeGameState();
        
        // Load the orphanage map
        const success = await this.nodeMapSystem.loadMap('fire_convergence_orphanage');
        if (!success) {
            console.error('Failed to load FireConvergence map');
            return false;
        }
        
        // Randomize the scenario
        this.randomizeScenario();
        
        // Start the event systems
        this.startEventSystems();
        
        // Set up UI
        this.setupUI();
        
        this.isActive = true;
        console.log('FireConvergence event initialized successfully');
        
        // Show initial message
        this.showMessage("The orphanage is burning! You must find and rescue the children before it's too late. Use WASD to move and E to interact with rooms.");
        
        return true;
    }

    /**
     * Initialize the game state
     */
    initializeGameState() {
        this.gameState = {
            breath: this.config.maxBreath,
            foundChildren: [],
            rescuedChildren: [],
            structuralIntegrity: 100,
            fireIntensity: 1,
            timeElapsed: 0,
            hasWetCloth: false,
            hasLantern: false,
            hasKeys: false,
            hasRope: false,
            alternateExitsFound: [],
            itemsFound: [],
            roomsSearched: [],
            startTime: Date.now()
        };
        
        // Store in SugarCube state for condition evaluation
        if (window.State && window.State.variables) {
            window.State.variables.fireConvergence = this.gameState;
        }
    }

    /**
     * Randomize the scenario layout, items, and children
     */
    randomizeScenario() {
        console.log('Randomizing FireConvergence scenario...');
        
        const mapData = this.nodeMapSystem.currentMapData;
        if (!mapData || !mapData.dynamicGeneration) return;
        
        const generation = mapData.dynamicGeneration;
        
        // Generate random seed if not provided
        if (!generation.randomSeed) {
            generation.randomSeed = Math.floor(Math.random() * 1000000);
        }
        
        // Use seeded random for consistent randomization
        this.random = this.createSeededRandom(generation.randomSeed);
        
        // Randomize item spawns
        this.randomizeItems(generation.itemSpawns);
        
        // Randomize child locations
        this.randomizeChildren(generation.childLocations);
        
        // Apply initial fire progression
        this.applyInitialFire(generation.fireProgression);
        
        console.log(`Scenario randomized with seed: ${generation.randomSeed}`);
    }

    /**
     * Create a seeded random number generator
     * @param {number} seed - Random seed
     * @returns {Function} Seeded random function
     */
    createSeededRandom(seed) {
        let state = seed;
        return function() {
            state = (state * 1664525 + 1013904223) % 4294967296;
            return state / 4294967296;
        };
    }

    /**
     * Randomize item spawns based on probabilities
     * @param {Object} itemSpawns - Item spawn configuration
     */
    randomizeItems(itemSpawns) {
        for (const [itemId, config] of Object.entries(itemSpawns)) {
            if (this.random() < config.probability) {
                // Choose a random room from possible rooms
                const roomId = config.rooms[Math.floor(this.random() * config.rooms.length)];
                
                // Add item to room metadata
                const node = this.nodeMapSystem.getNodeById(roomId);
                if (node && node.metadata) {
                    if (!node.metadata.spawnedItems) {
                        node.metadata.spawnedItems = [];
                    }
                    node.metadata.spawnedItems.push(itemId);
                }
                
                console.log(`Spawned ${itemId} in ${roomId}`);
            }
        }
    }

    /**
     * Randomize child locations based on probabilities
     * @param {Object} childLocations - Child location configuration
     */
    randomizeChildren(childLocations) {
        for (const [childId, config] of Object.entries(childLocations)) {
            if (this.random() < config.probability) {
                // Choose a random room from possible rooms
                const roomId = config.possibleRooms[Math.floor(this.random() * config.possibleRooms.length)];
                
                // Add child to room metadata
                const node = this.nodeMapSystem.getNodeById(roomId);
                if (node && node.metadata) {
                    if (!node.metadata.spawnedChildren) {
                        node.metadata.spawnedChildren = [];
                    }
                    node.metadata.spawnedChildren.push(childId);
                }
                
                console.log(`Placed ${childId} in ${roomId}`);
            }
        }
    }

    /**
     * Apply initial fire progression
     * @param {Object} fireProgression - Fire progression configuration
     */
    applyInitialFire(fireProgression) {
        for (const nodeId of fireProgression.initialFire) {
            const node = this.nodeMapSystem.getNodeById(nodeId);
            if (node && node.metadata) {
                node.metadata.fireIntensity = Math.max(node.metadata.fireIntensity || 0, 2);
                node.metadata.breathCost = Math.max(node.metadata.breathCost || 0, 3);
            }
        }
    }

    /**
     * Start the event systems (timers, updates, etc.)
     */
    startEventSystems() {
        // Main game update loop
        this.updateInterval = setInterval(() => {
            this.updateGameState();
        }, this.config.updateFrequency);
        
        // Ambient events
        this.ambientEventInterval = setInterval(() => {
            this.processAmbientEvents();
        }, this.config.ambientEventFrequency);
    }

    /**
     * Update the game state (breath, fire, structure)
     */
    updateGameState() {
        if (!this.isActive) return;
        
        this.gameState.timeElapsed = Date.now() - this.gameState.startTime;
        
        // Update breath
        this.updateBreath();
        
        // Update fire progression
        this.updateFireProgression();
        
        // Update structural integrity
        this.updateStructuralIntegrity();
        
        // Update UI
        this.updateUI();
        
        // Check win/lose conditions
        this.checkGameConditions();
        
        // Update dynamic nodes
        this.nodeMapSystem.updateDynamicNodes();
    }

    /**
     * Update breath system
     */
    updateBreath() {
        const currentNodeId = this.navigationSystem.getPosition();
        const currentNode = this.nodeMapSystem.getNodeById(currentNodeId);
        
        if (currentNode && currentNode.metadata) {
            let breathCost = currentNode.metadata.breathCost || 0;
            
            // Apply wet cloth bonus
            if (this.gameState.hasWetCloth && breathCost > 0) {
                breathCost = Math.max(0, breathCost - 1);
            }
            
            // Apply breath decay
            this.gameState.breath -= (this.config.breathDecayRate + breathCost) * (this.config.updateFrequency / 1000);
            this.gameState.breath = Math.max(0, this.gameState.breath);
        }
    }

    /**
     * Update fire progression
     */
    updateFireProgression() {
        // Increase global fire intensity over time
        this.gameState.fireIntensity += this.config.fireSpreadRate * (this.config.updateFrequency / 1000) * 0.1;
        
        // Spread fire to connected nodes
        for (const node of this.nodeMapSystem.nodes.values()) {
            if (node.metadata && node.metadata.fireIntensity > 0) {
                // Spread to connected nodes
                for (const connectionId of Object.keys(node.connections)) {
                    const connectedNode = this.nodeMapSystem.getNodeById(connectionId);
                    if (connectedNode && connectedNode.metadata) {
                        const currentFire = connectedNode.metadata.fireIntensity || 0;
                        const spreadAmount = 0.1 * (this.config.updateFrequency / 1000);
                        connectedNode.metadata.fireIntensity = Math.min(3, currentFire + spreadAmount);
                        
                        // Increase breath cost with fire
                        if (connectedNode.metadata.fireIntensity > 0) {
                            connectedNode.metadata.breathCost = Math.max(
                                connectedNode.metadata.breathCost || 0,
                                Math.floor(connectedNode.metadata.fireIntensity)
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * Update structural integrity
     */
    updateStructuralIntegrity() {
        // Decrease structural integrity based on fire intensity
        let totalFireDamage = 0;
        for (const node of this.nodeMapSystem.nodes.values()) {
            if (node.metadata && node.metadata.fireIntensity > 0) {
                totalFireDamage += node.metadata.fireIntensity;
            }
        }
        
        const damageRate = totalFireDamage * this.config.structuralDecayRate * (this.config.updateFrequency / 1000);
        this.gameState.structuralIntegrity -= damageRate;
        this.gameState.structuralIntegrity = Math.max(0, this.gameState.structuralIntegrity);
    }

    /**
     * Process ambient events
     */
    processAmbientEvents() {
        const mapData = this.nodeMapSystem.currentMapData;
        if (!mapData || !mapData.ambientEvents) return;
        
        for (const event of mapData.ambientEvents) {
            // Check probability
            if (Math.random() > event.probability) continue;
            
            // Check conditions
            if (event.conditions && event.conditions.length > 0) {
                let conditionsMet = true;
                for (const condition of event.conditions) {
                    if (!this.nodeMapSystem.evaluateCondition(condition)) {
                        conditionsMet = false;
                        break;
                    }
                }
                if (!conditionsMet) continue;
            }
            
            // Check cooldown
            const now = Date.now();
            const lastTriggered = event.lastTriggered || 0;
            if (now - lastTriggered < event.cooldown) continue;
            
            // Trigger event
            this.showMessage(event.message);
            event.lastTriggered = now;
            
            // Execute effect
            if (event.effect) {
                try {
                    eval(event.effect);
                } catch (error) {
                    console.error('Error executing ambient event effect:', error);
                }
            }
        }
    }

    /**
     * Handle room entry
     * @param {string} roomId - Room ID
     */
    handleRoomEntry(roomId) {
        const node = this.nodeMapSystem.getNodeById(roomId);
        if (!node) return;
        
        // Apply breath cost for entering room
        if (node.metadata && node.metadata.breathCost) {
            let breathCost = node.metadata.breathCost;
            
            // Apply wet cloth bonus
            if (this.gameState.hasWetCloth && breathCost > 0) {
                breathCost = Math.max(0, breathCost - 1);
            }
            
            this.gameState.breath -= breathCost;
            this.gameState.breath = Math.max(0, this.gameState.breath);
        }
        
        // Show room description
        if (node.metadata && node.metadata.description) {
            this.showMessage(node.metadata.description);
        }
        
        // Check for automatic discoveries
        this.checkRoomDiscoveries(roomId);
    }

    /**
     * Handle room interaction (searching)
     * @param {string} roomId - Room ID
     */
    handleRoomInteraction(roomId) {
        const node = this.nodeMapSystem.getNodeById(roomId);
        if (!node || !node.metadata) return;
        
        // Check if room is searchable
        if (!node.metadata.searchable) {
            this.showMessage("There's nothing to search here.");
            return;
        }
        
        // Check if already searched
        if (this.gameState.roomsSearched.includes(roomId)) {
            this.showMessage("You've already searched this room thoroughly.");
            return;
        }
        
        // Mark as searched
        this.gameState.roomsSearched.push(roomId);
        
        // Search for items
        this.searchForItems(roomId, node);
        
        // Search for children
        this.searchForChildren(roomId, node);
    }

    /**
     * Search for items in a room
     * @param {string} roomId - Room ID
     * @param {Object} node - Node data
     */
    searchForItems(roomId, node) {
        const spawnedItems = node.metadata.spawnedItems || [];
        
        if (spawnedItems.length > 0) {
            for (const itemId of spawnedItems) {
                if (!this.gameState.itemsFound.includes(itemId)) {
                    this.gameState.itemsFound.push(itemId);
                    const itemData = this.itemData[itemId];
                    
                    if (itemData) {
                        this.showMessage(`You found: ${itemData.name}! ${itemData.description}`);
                        
                        // Apply item effect
                        if (itemData.onUse) {
                            itemData.onUse();
                        }
                    }
                }
            }
        } else {
            this.showMessage("You search the room but find nothing useful.");
        }
    }

    /**
     * Search for children in a room
     * @param {string} roomId - Room ID
     * @param {Object} node - Node data
     */
    searchForChildren(roomId, node) {
        const spawnedChildren = node.metadata.spawnedChildren || [];
        
        for (const childId of spawnedChildren) {
            if (!this.gameState.foundChildren.includes(childId)) {
                this.gameState.foundChildren.push(childId);
                const childData = this.childrenData[childId];
                
                if (childData) {
                    this.showMessage(`You found ${childData.name}! ${childData.description}. You quickly guide them to safety.`);
                    
                    // Add to rescued children
                    this.gameState.rescuedChildren.push(childId);
                }
            }
        }
    }

    /**
     * Check for automatic room discoveries
     * @param {string} roomId - Room ID
     */
    checkRoomDiscoveries(roomId) {
        const node = this.nodeMapSystem.getNodeById(roomId);
        if (!node || !node.metadata) return;
        
        // Special room effects
        if (node.metadata.hasWater && this.gameState.breath < this.config.maxBreath) {
            this.showMessage("You splash water on your face and take a moment to breathe cleaner air.");
            this.restoreBreath(10);
        }
    }

    /**
     * Handle alternate exit discovery
     * @param {string} exitId - Exit ID
     */
    discoverAlternateExit(exitId) {
        if (!this.gameState.alternateExitsFound.includes(exitId)) {
            this.gameState.alternateExitsFound.push(exitId);
            this.showMessage("You've discovered an alternate escape route! This could be crucial if the main entrance becomes blocked.");
            
            // Update node connections
            this.nodeMapSystem.updateDynamicNodes();
        }
    }

    /**
     * Handle alternate exit usage
     * @param {string} exitId - Exit ID
     */
    handleAlternateExit(exitId) {
        if (this.gameState.rescuedChildren.length === 0) {
            this.showMessage("You can't leave without rescuing at least one child!");
            return;
        }
        
        this.completeEvent('alternate_exit', exitId);
    }

    /**
     * Handle window escape
     * @param {string} windowId - Window ID
     */
    handleWindowEscape(windowId) {
        if (!this.gameState.hasRope) {
            this.showMessage("The window is too high to jump from safely. You need rope to escape this way.");
            return;
        }
        
        if (this.gameState.rescuedChildren.length === 0) {
            this.showMessage("You can't leave without rescuing at least one child!");
            return;
        }
        
        this.completeEvent('window_escape', windowId);
    }

    /**
     * Restore breath points
     * @param {number} amount - Amount to restore
     */
    restoreBreath(amount) {
        this.gameState.breath = Math.min(this.config.maxBreath, this.gameState.breath + amount);
        this.showMessage(`You feel refreshed! Breath restored by ${amount} points.`);
    }

    /**
     * Increase fire intensity
     */
    increaseFireIntensity() {
        this.gameState.fireIntensity += 0.5;
    }

    /**
     * Damage structure
     * @param {number} amount - Damage amount
     */
    damageStructure(amount) {
        this.gameState.structuralIntegrity -= amount;
        this.gameState.structuralIntegrity = Math.max(0, this.gameState.structuralIntegrity);
    }

    /**
     * Give hint about child location
     */
    giveChildHint() {
        const unfoundChildren = Object.keys(this.childrenData).filter(
            childId => !this.gameState.foundChildren.includes(childId)
        );
        
        if (unfoundChildren.length > 0) {
            const childId = unfoundChildren[Math.floor(Math.random() * unfoundChildren.length)];
            const childData = this.childrenData[childId];
            
            // Find where this child is located
            for (const node of this.nodeMapSystem.nodes.values()) {
                if (node.metadata && node.metadata.spawnedChildren && 
                    node.metadata.spawnedChildren.includes(childId)) {
                    this.showMessage(`You hear ${childData.name}'s voice coming from the ${node.name}!`);
                    return;
                }
            }
        }
    }

    /**
     * Increase breath cost
     * @param {number} amount - Amount to increase
     */
    increaseBreathCost(amount) {
        // This affects the current room's breath cost temporarily
        const currentNodeId = this.navigationSystem.getPosition();
        const currentNode = this.nodeMapSystem.getNodeById(currentNodeId);
        
        if (currentNode && currentNode.metadata) {
            currentNode.metadata.breathCost = (currentNode.metadata.breathCost || 0) + amount;
        }
    }

    /**
     * Check game win/lose conditions
     */
    checkGameConditions() {
        // Lose condition: breath depleted
        if (this.gameState.breath <= 0) {
            this.endEvent('breath_depleted');
            return;
        }
        
        // Lose condition: structural collapse
        if (this.gameState.structuralIntegrity <= this.config.collapseThreshold) {
            this.endEvent('structural_collapse');
            return;
        }
        
        // Win condition: all children rescued and at exit
        const totalChildren = Object.keys(this.childrenData).length;
        if (this.gameState.rescuedChildren.length === totalChildren) {
            const currentNodeId = this.navigationSystem.getPosition();
            const currentNode = this.nodeMapSystem.getNodeById(currentNodeId);
            
            if (currentNode && currentNode.metadata && currentNode.metadata.isExit) {
                this.completeEvent('all_children_saved', currentNodeId);
            }
        }
    }

    /**
     * Complete the event successfully
     * @param {string} method - Completion method
     * @param {string} location - Completion location
     */
    completeEvent(method, location) {
        this.isActive = false;
        
        // Stop update systems
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        if (this.ambientEventInterval) {
            clearInterval(this.ambientEventInterval);
            this.ambientEventInterval = null;
        }
        
        // Calculate score
        const score = this.calculateScore();
        
        // Show completion message
        let message = `FireConvergence Event Complete!\n\n`;
        message += `Children Rescued: ${this.gameState.rescuedChildren.length}/${Object.keys(this.childrenData).length}\n`;
        message += `Time Elapsed: ${Math.floor(this.gameState.timeElapsed / 1000)} seconds\n`;
        message += `Breath Remaining: ${Math.floor(this.gameState.breath)}/${this.config.maxBreath}\n`;
        message += `Structural Integrity: ${Math.floor(this.gameState.structuralIntegrity)}%\n`;
        message += `Escape Method: ${method}\n`;
        message += `Final Score: ${score}\n\n`;
        
        if (this.gameState.rescuedChildren.length === Object.keys(this.childrenData).length) {
            message += "Perfect rescue! You saved all the children!";
        } else {
            message += "You escaped, but some children are still missing...";
        }
        
        this.showMessage(message);
        
        console.log('FireConvergence event completed:', {
            method,
            location,
            score,
            gameState: this.gameState
        });
    }

    /**
     * End the event (failure)
     * @param {string} reason - Failure reason
     */
    endEvent(reason) {
        this.isActive = false;
        
        // Stop update systems
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        if (this.ambientEventInterval) {
            clearInterval(this.ambientEventInterval);
            this.ambientEventInterval = null;
        }
        
        let message = `FireConvergence Event Failed!\n\n`;
        
        switch (reason) {
            case 'breath_depleted':
                message += "You've run out of breath and collapsed from smoke inhalation!";
                break;
            case 'structural_collapse':
                message += "The building has collapsed! You were trapped inside!";
                break;
            default:
                message += `Event ended: ${reason}`;
        }
        
        message += `\n\nChildren Rescued: ${this.gameState.rescuedChildren.length}/${Object.keys(this.childrenData).length}`;
        message += `\nTime Survived: ${Math.floor(this.gameState.timeElapsed / 1000)} seconds`;
        
        this.showMessage(message);
        
        console.log('FireConvergence event failed:', {
            reason,
            gameState: this.gameState
        });
    }

    /**
     * Calculate final score
     * @returns {number} Final score
     */
    calculateScore() {
        let score = 0;
        
        // Base score for children rescued
        score += this.gameState.rescuedChildren.length * 1000;
        
        // Bonus for saving all children
        if (this.gameState.rescuedChildren.length === Object.keys(this.childrenData).length) {
            score += 2000;
        }
        
        // Time bonus (faster is better)
        const timeBonus = Math.max(0, 600 - Math.floor(this.gameState.timeElapsed / 1000)) * 10;
        score += timeBonus;
        
        // Breath bonus
        score += Math.floor(this.gameState.breath) * 5;
        
        // Structural integrity bonus
        score += Math.floor(this.gameState.structuralIntegrity) * 10;
        
        // Item collection bonus
        score += this.gameState.itemsFound.length * 100;
        
        return score;
    }

    /**
     * Set up UI elements
     */
    setupUI() {
        // Create UI container
        const uiContainer = document.createElement('div');
        uiContainer.id = 'fire-convergence-ui';
        uiContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            z-index: 1000;
            min-width: 200px;
            border: 2px solid #ff4500;
        `;
        
        document.body.appendChild(uiContainer);
        this.uiContainer = uiContainer;
        
        this.updateUI();
    }

    /**
     * Update UI display
     */
    updateUI() {
        if (!this.uiContainer) return;
        
        const breathColor = this.gameState.breath > this.config.criticalBreath ? '#00ff00' : '#ff0000';
        const structureColor = this.gameState.structuralIntegrity > 50 ? '#00ff00' : 
                              this.gameState.structuralIntegrity > 25 ? '#ffff00' : '#ff0000';
        
        this.uiContainer.innerHTML = `
            <div style="color: #ff4500; font-weight: bold; margin-bottom: 10px;">🔥 FIRE CONVERGENCE 🔥</div>
            <div style="color: ${breathColor};">Breath: ${Math.floor(this.gameState.breath)}/${this.config.maxBreath}</div>
            <div style="color: ${structureColor};">Structure: ${Math.floor(this.gameState.structuralIntegrity)}%</div>
            <div>Fire Level: ${Math.floor(this.gameState.fireIntensity * 10) / 10}</div>
            <div>Time: ${Math.floor(this.gameState.timeElapsed / 1000)}s</div>
            <div>Children: ${this.gameState.rescuedChildren.length}/${Object.keys(this.childrenData).length}</div>
            <div style="margin-top: 10px; font-size: 12px;">
                ${this.gameState.hasWetCloth ? '🧽 Wet Cloth ' : ''}
                ${this.gameState.hasKeys ? '🗝️ Keys ' : ''}
                ${this.gameState.hasRope ? '🪢 Rope ' : ''}
                ${this.gameState.hasLantern ? '🏮 Lantern ' : ''}
            </div>
        `;
    }

    /**
     * Show message to player
     * @param {string} message - Message to display
     */
    showMessage(message) {
        console.log('FireConvergence Message:', message);
        
        // Integration with SugarCube
        if (window.UI && window.UI.alert) {
            window.UI.alert(message);
        } else if (window.Dialog && window.Dialog.setup && window.Dialog.open) {
            window.Dialog.setup('FireConvergence', 'fire-convergence-message');
            window.Dialog.wiki(message);
            window.Dialog.open();
        } else {
            // Fallback to native alert
            alert(message);
        }
    }

    /**
     * Destroy the system and clean up
     */
    destroy() {
        this.isActive = false;
        
        // Stop update systems
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        if (this.ambientEventInterval) {
            clearInterval(this.ambientEventInterval);
            this.ambientEventInterval = null;
        }
        
        // Remove UI
        if (this.uiContainer) {
            this.uiContainer.remove();
            this.uiContainer = null;
        }
        
        // Clear global references
        if (window.FireConvergence) {
            delete window.FireConvergence;
        }
        
        console.log('FireConvergenceSystem destroyed');
    }
}

// Export for use in other modules
window.FireConvergenceSystem = FireConvergenceSystem;
