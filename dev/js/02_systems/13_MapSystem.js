/**
 * Map System for Twine 2 - SugarCube 2
 * Provides grid-based navigation with keyboard/mouse controls
 * Integrates with sidebar minimap and journal full map view
 */

window.MapSystem = {
    // Core state
    currentMap: null,
    currentPosition: { x: 0, y: 0 },
    loadedMaps: new Map(),
    movementBlocked: false,
    
    // Fog of war state
    revealedTiles: new Map(), // mapId -> Set of "x,y" coordinates
    
    // Event handlers
    keyboardHandler: null,
    
    /**
     * Initialize the map system
     */
    async init() {
        console.log("[MapSystem] Initializing...");
        
        // Initialize player map state if not exists
        if (!State.variables.player.mapState) {
            State.variables.player.mapState = {
                currentMapId: null,
                position: { x: 0, y: 0 },
                revealedTiles: {}
            };
        }
        
        // Set up keyboard controls
        this.setupKeyboardControls();
        
        // Set up minimap fullscreen button
        this.setupMinimapControls();
        
        // IMPORTANT: Restore map state after refresh
        await this.restoreMapState();
        
        console.log("[MapSystem] Initialized successfully");
    },

    async restoreMapState() {
        const mapState = State.variables.player.mapState;
        
        if (mapState && mapState.currentMapId) {
            console.log(`[MapSystem] Restoring map state: ${mapState.currentMapId} at (${mapState.position.x}, ${mapState.position.y})`);
            
            // Load the map data
            const mapData = await this.loadMap(mapState.currentMapId);
            if (!mapData) {
                console.error(`[MapSystem] Failed to restore map: ${mapState.currentMapId}`);
                return false;
            }
            
            this.currentMap = mapData;
            this.currentPosition = { ...mapState.position };
            
            // Restore fog of war state
            if (mapData.fogOfWar && mapState.revealedTiles[mapState.currentMapId]) {
                const key = mapState.currentMapId;
                this.revealedTiles.set(key, new Set(mapState.revealedTiles[mapState.currentMapId]));
            }
            
            // Update displays
            this.updateMinimapDisplay();
            this.updateLocationInfo();
            
            console.log(`[MapSystem] Map state restored successfully`);
            return true;
        }
        
        return false;
    },
    
    /**
     * Load a map from JSON file
     */
    async loadMap(mapId) {
        if (this.loadedMaps.has(mapId)) {
            return this.loadedMaps.get(mapId);
        }
        
        try {
            const response = await fetch(`dev/js/data/maps/${mapId}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load map: ${response.status}`);
            }
            
            const mapData = await response.json();
            this.loadedMaps.set(mapId, mapData);
            
            console.log(`[MapSystem] Loaded map: ${mapData.name}`);
            return mapData;
        } catch (error) {
            console.error(`[MapSystem] Error loading map ${mapId}:`, error);
            return null;
        }
    },
    
    /**
     * Set the current map and player position
     */
    async setCurrentMap(mapId, position = null, entryPoint = null) {
        const mapData = await this.loadMap(mapId);
        if (!mapData) {
            console.error(`[MapSystem] Failed to set current map: ${mapId}`);
            return false;
        }
        
        this.currentMap = mapData;
        
        // Handle entry points
        if (entryPoint && mapData.entryPointRegistry) {
            // Create entry point registry if it exists
            this.entryPointRegistry = new Map(Object.entries(mapData.entryPointRegistry));
            const entryPosition = this.getEntryPointPosition(entryPoint);
            if (entryPosition) {
                position = entryPosition;
                console.log(`[MapSystem] Using entry point ${entryPoint} at position (${position.x}, ${position.y})`);
            }
        }
        
        // Set position
        if (position) {
            this.currentPosition = { ...position };
        } else if (mapData.defaultStart) {
            this.currentPosition = { ...mapData.defaultStart };
        } else if (mapData.playerStartPosition) {
            this.currentPosition = { ...mapData.playerStartPosition };
        } else {
            this.currentPosition = { x: 1, y: 1 };
        }
        
        // IMPORTANT: Save all map state to player variables for persistence
        State.variables.player.mapState.currentMapId = mapId;
        State.variables.player.mapState.position = { ...this.currentPosition };
        
        // Store additional map metadata if needed
        if (!State.variables.player.mapState.metadata) {
            State.variables.player.mapState.metadata = {};
        }
        State.variables.player.mapState.metadata[mapId] = {
            name: mapData.name,
            lastVisited: Date.now()
        };
        
        // Initialize fog of war if enabled
        if (mapData.fogOfWar) {
            this.initializeFogOfWar(mapId);
        }
        
        // Initialize project tag library and entry points from map data
        if (mapData.projectTagLibrary) {
            this.projectTagLibrary = new Set(mapData.projectTagLibrary);
        }
        
        if (mapData.entryPointRegistry) {
            this.entryPointRegistry = new Map(Object.entries(mapData.entryPointRegistry));
        }
        
        // Initialize passage texts if included
        if (mapData.passageTexts) {
            this.passageTexts = new Map(Object.entries(mapData.passageTexts));
        }
        
        // Update displays
        this.updateMinimapDisplay();
        this.updateLocationInfo();
        
        console.log(`[MapSystem] Set current map to ${mapData.name} at position (${this.currentPosition.x}, ${this.currentPosition.y})`);
        return true;
    },
    
    /**
     * Initialize fog of war for a map
     */
    initializeFogOfWar(mapId) {
        const key = `${mapId}`;
        if (!this.revealedTiles.has(key)) {
            this.revealedTiles.set(key, new Set());
        }
        
        // Load from player state
        if (State.variables.player.mapState.revealedTiles[mapId]) {
            const revealed = new Set(State.variables.player.mapState.revealedTiles[mapId]);
            this.revealedTiles.set(key, revealed);
        }
        
        // Always reveal current position
        this.revealTile(mapId, this.currentPosition.x, this.currentPosition.y);
    },
    
    /**
     * Reveal a tile in fog of war
     */
    revealTile(mapId, x, y) {
        const key = `${mapId}`;
        if (!this.revealedTiles.has(key)) {
            this.revealedTiles.set(key, new Set());
        }
        
        const tileKey = `${x},${y}`;
        this.revealedTiles.get(key).add(tileKey);
        
        // Save to player state
        if (!State.variables.player.mapState.revealedTiles[mapId]) {
            State.variables.player.mapState.revealedTiles[mapId] = [];
        }
        
        const revealedArray = Array.from(this.revealedTiles.get(key));
        State.variables.player.mapState.revealedTiles[mapId] = revealedArray;
    },
    
    /**
     * Check if a tile is revealed
     */
    isTileRevealed(mapId, x, y) {
        if (!this.currentMap || !this.currentMap.fogOfWar) {
            return true; // No fog of war
        }
        
        const key = `${mapId}`;
        if (!this.revealedTiles.has(key)) {
            return false;
        }
        
        const tileKey = `${x},${y}`;
        return this.revealedTiles.get(key).has(tileKey);
    },
    
    /**
     * Get node at specific coordinates
     */
    getNodeAt(x, y) {
        if (!this.currentMap) return null;
        
        // Handle both x,y and column,row formats
        return this.currentMap.nodes.find(node => {
            const nodeX = node.x !== undefined ? node.x : node.column;
            const nodeY = node.y !== undefined ? node.y : node.row;
            return nodeX === x && nodeY === y;
        });
    },
    
    /**
     * Check if movement is allowed from current position to target
     */
    canMoveTo(direction) {
        if (!this.currentMap || this.movementBlocked) {
            return false;
        }

        const currentNode = this.getNodeAt(this.currentPosition.x, this.currentPosition.y);
        if (!currentNode) {
            return false;
        }

        const transition = currentNode.transitions[direction];
        if (!transition) {
            return false;
        }

        // ✅ Dynamically evaluate transition type
        const effectiveType = this.getEffectiveTransitionType(transition);

        // 🔒 None or locked transitions are blocked
        if (effectiveType === "none" || effectiveType === "locked") {
            return false;
        }

        // 🕵️ Secret transitions only work if revealed
        if (effectiveType === "secret" && !this.isTransitionRevealed(currentNode, direction)) {
            return false;
        }

        // 🔁 One-way transitions only work if direction matches
        if (effectiveType === "one-way" && transition.direction !== direction) {
            return false;
        }

        // ✅ Finally, check if any conditions are unmet
        return this.checkTransitionConditions(transition.conditions);
    },

    
    /**
     * Check if a transition is currently locked by its conditions
     */
    isTransitionLocked(transition) {
        if (!transition.conditions || transition.conditions.length === 0) {
            return transition.type === "locked"; // Default locked state
        }
        
        // Check for lockIf conditions
        for (const condition of transition.conditions) {
            if (condition.action === "lockIf" && this.evaluateCondition(condition)) {
                return true;
            }
            if (condition.action === "unlockIf" && this.evaluateCondition(condition)) {
                return false;
            }
        }
        
        // If no unlock conditions are met and it's a locked transition, remain locked
        return transition.type === "locked";
    },
    
    /**
     * Check if a secret transition has been revealed
     */
    isTransitionRevealed(node, direction) {
        const transition = node.transitions[direction];
        if (transition.type !== "secret") {
            return true;
        }
        
        // Check for unlockIf conditions that would reveal the secret
        if (transition.conditions) {
            for (const condition of transition.conditions) {
                if (condition.action === "unlockIf" && this.evaluateCondition(condition)) {
                    return true;
                }
            }
        }
        
        return false;
    },
    
    /**
     * Get the effective transition type after applying conditions
     */
    getEffectiveTransitionType(transition) {
        if (!transition.conditions || transition.conditions.length === 0) {
            return transition.type;
        }
        
        // Check for changeIf conditions
        for (const condition of transition.conditions) {
            if (condition.action === "changeIf" && this.evaluateCondition(condition)) {
                return condition.changeTarget || transition.type;
            }
        }
        
        return transition.type;
    },
    
    /**
     * Check if transition conditions are met
     */
    checkTransitionConditions(conditions) {
        if (!conditions || conditions.length === 0) {
            return true;
        }
        
        for (const condition of conditions) {
            if (!this.evaluateCondition(condition)) {
                return false;
            }
        }
        
        return true;
    },

    parseConditionValue(rawValue) {
        if (rawValue === true || rawValue === false) return rawValue;
        if (typeof rawValue === 'number') return rawValue;
        if (typeof rawValue !== 'string') return rawValue;

        const trimmed = rawValue.trim();
        if (trimmed === "true") return true;
        if (trimmed === "false") return false;
        if (!isNaN(trimmed)) return Number(trimmed);

        return trimmed;
    },

    
    /**
     * Evaluate a single condition
     */
    evaluateCondition(condition) {
        const player = State.variables.player;
        const inventory = State.variables.inventory_player || {};

        const conditionType = condition.type;
        const operator = condition.operator || "==";
        let targetValue, actualValue;

        switch (conditionType) {
            case "variable": {
                const variablePath = condition.name || condition.variable;
                actualValue = this.getNestedValue(State.variables, variablePath);
                targetValue = this.parseConditionValue(condition.value);
                break;
            }

            case "item": {
                const itemName = condition.name || condition.item;
                actualValue = inventory[itemName] || 0;
                targetValue = this.parseConditionValue(condition.value || true);
                break;
            }

            case "quest": {
                const questName = condition.name || condition.quest;
                const quests = State.variables.quests || {};
                actualValue = quests[questName] || false;
                targetValue = this.parseConditionValue(condition.value || true);
                break;
            }

            default:
                console.warn(`[MapSystem] Unknown condition type: ${conditionType}`);
                return true;
        }

        return this.compareValues(actualValue, operator, targetValue);
    },

    
    /**
     * Get nested object value by dot notation
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    },
    
    /**
     * Compare values with operator
     */
    compareValues(a, operator, b) {
        switch (operator) {
            case "==": return a == b;
            case "!=": return a != b;
            case ">=": return a >= b;
            case "<=": return a <= b;
            case ">": return a > b;
            case "<": return a < b;
            default: return false;
        }
    },
    
    /**
     * Calculate target position for movement
     */
    getTargetPosition(direction) {
        const { x, y } = this.currentPosition;
        
        switch (direction) {
            case "north": return { x, y: y - 1 };
            case "south": return { x, y: y + 1 };
            case "east": return { x: x + 1, y };
            case "west": return { x: x - 1, y };
            default: return null;
        }
    },
    
    /**
     * Move player in specified direction
     */
    async movePlayer(direction) {
        if (!this.canMoveTo(direction)) {
            console.log(`[MapSystem] Movement blocked: ${direction}`);
            return false;
        }

        const targetPos = this.getTargetPosition(direction);
        if (!targetPos) {
            return false;
        }

        // Check if target position has a node
        const targetNode = this.getNodeAt(targetPos.x, targetPos.y);
        if (!targetNode) {
            console.log(`[MapSystem] No node at target position (${targetPos.x}, ${targetPos.y})`);
            return false;
        }

        // Update position
        this.currentPosition = targetPos;
        State.variables.player.mapState.position = { ...targetPos };

        // Reveal tiles for fog of war
        if (this.currentMap.fogOfWar) {
            this.revealTile(this.currentMap.mapId, targetPos.x, targetPos.y);
            this.revealAdjacentTiles(this.currentMap.mapId, targetPos.x, targetPos.y);
        }

        // Update displays (may be overwritten by passage change)
        this.updateMinimapDisplay();
        this.updateLocationInfo();

        // Get the effective node data (applying conditions)
        const effectiveNode = this.getEffectiveNodeData(targetNode);

        // Navigate to the target passage
        if (effectiveNode.passage) {
            console.log(`[MapSystem] Moving to passage: ${effectiveNode.passage}`);
            Engine.play(effectiveNode.passage);

            // 🧠 DEFERRED redraw of minimap after sidebar DOM is fully rebuilt
            setTimeout(() => {
                const container = document.getElementById("tile-map-container");
                if (container) {
                    this.updateMinimapDisplay();
                    console.log("🧭 Forced minimap redraw after move (delayed)");
                } else {
                    console.warn("⚠️ Could not redraw minimap: container missing");
                }
            }, 0);
        }

        return true;
    },
    
    /**
     * Reveal adjacent tiles for fog of war
     */
    revealAdjacentTiles(mapId, centerX, centerY) {
        const directions = [
            { x: 0, y: -1 }, // north
            { x: 0, y: 1 },  // south
            { x: 1, y: 0 },  // east
            { x: -1, y: 0 }  // west
        ];
        
        directions.forEach(dir => {
            const adjX = centerX + dir.x;
            const adjY = centerY + dir.y;
            
            // Check if adjacent position is within bounds and has a node
            if (this.getNodeAt(adjX, adjY)) {
                this.revealTile(mapId, adjX, adjY);
            }
        });
    },
    
    /**
     * Set up keyboard controls
     */
    setupKeyboardControls() {
        // Remove existing handler if any
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        
        this.keyboardHandler = (event) => {
            // Don't handle if movement is blocked or if typing in input
            if (this.movementBlocked || event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            let direction = null;
            
            // WASD keys
            switch (event.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    direction = 'north';
                    break;
                case 's':
                case 'arrowdown':
                    direction = 'south';
                    break;
                case 'a':
                case 'arrowleft':
                    direction = 'west';
                    break;
                case 'd':
                case 'arrowright':
                    direction = 'east';
                    break;
            }
            
            if (direction) {
                event.preventDefault();
                this.movePlayer(direction);
            }
        };
        
        document.addEventListener('keydown', this.keyboardHandler);
    },
    
    /**
     * Set up minimap controls
     */
    setupMinimapControls() {
        // Fullscreen button
        $(document).on('click', '#minimap-fullscreen-btn', () => {
            this.openFullMap();
        });
    },
    
    /**
     * Open full map in journal
     */
    openFullMap() {
        // Open journal overlay
        if (typeof openOverlay === 'function') {
            openOverlay('journal-page');
            
            // Switch to map tab after a brief delay
            setTimeout(() => {
                const mapTab = document.querySelector('[data-tab="map"]');
                if (mapTab) {
                    mapTab.click();
                }
            }, 100);
        }
    },
    
    /**
     * Block/unblock movement
     */
    setMovementBlocked(blocked) {
        this.movementBlocked = blocked;
        console.log(`[MapSystem] Movement ${blocked ? 'blocked' : 'unblocked'}`);
    },
    
    /**
     * Update minimap display
     */
    updateMinimapDisplay() {
        const container = document.getElementById('tile-map-container');

        if (!container) {
            console.warn("[MapSystem] updateMinimapDisplay aborted — #tile-map-container not found.");
            return;
        }

        if (!this.currentMap) {
            console.warn("[MapSystem] updateMinimapDisplay aborted — no current map.");
            return;
        }

        // Generate minimap HTML
        const minimapHtml = this.generateMinimapHTML();

        if (!minimapHtml || minimapHtml.trim() === '') {
            console.warn("[MapSystem] Minimap rendering failed — HTML output was blank. Skipping DOM injection.");
            return;
        }

        container.innerHTML = minimapHtml;
        console.log("🔍 Minimap container after HTML injection:", container.innerHTML);

        // Update minimap info
        this.updateMinimapInfo();

        // Re-render Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }

        // No scrolling needed - player is always centered by design
        console.log("[MapSystem] Minimap updated successfully with player centered.");
    },
    
    /**
     * Generate minimap HTML with enhanced styling support
     */
    generateMinimapHTML() {
        try {
            if (!this.currentMap) {
                console.warn("[MapSystem] No current map loaded in generateMinimapHTML.");
                return '';
            }

            const { x: playerX, y: playerY } = this.currentPosition;
            
            // Define viewport size (e.g., 5x5 grid with player at center)
            const viewportSize = 5; // Must be odd number to center player
            const halfViewport = Math.floor(viewportSize / 2);
            
            console.log(`[MapSystem] Rendering minimap viewport: ${viewportSize}x${viewportSize} centered on player at (${playerX}, ${playerY})`);

            // Calculate viewport bounds
            const startX = playerX - halfViewport;
            const startY = playerY - halfViewport;

            // Create container with relative positioning for connections
            let html = `<div class="minimap-container" style="position: relative;">`;
            html += `<div class="tile-grid minimap-grid" style="grid-template-columns: repeat(${viewportSize}, 1fr); grid-template-rows: repeat(${viewportSize}, 1fr);">`;

            // Generate tiles in correct order for CSS grid (row by row, left to right)
            for (let row = 0; row < viewportSize; row++) {
                for (let col = 0; col < viewportSize; col++) {
                    // Calculate actual map coordinates
                    const viewX = startX + col;
                    const viewY = startY + row;
                    
                    // Check if this is the player position
                    const isPlayer = (viewX === playerX && viewY === playerY);
                    
                    // Check if coordinates are within map bounds
                    const isOutOfBounds = viewX < 0 || viewX >= this.currentMap.gridSize.width || 
                                        viewY < 0 || viewY >= this.currentMap.gridSize.height;
                    
                    const node = isOutOfBounds ? null : this.getNodeAt(viewX, viewY);
                    const isRevealed = isOutOfBounds ? false : this.isTileRevealed(this.currentMap.mapId, viewX, viewY);

                    let tileClass = 'tile minimap-tile';
                    let tileContent = '';
                    let tileStyle = '';
                    let connections = '';

                    if (isOutOfBounds) {
                        tileClass += ' tile-out-of-bounds';
                    } else if (!isRevealed && this.currentMap.fogOfWar) {
                        tileClass += ' tile-hidden';
                    } else if (node) {
                        tileClass += ' tile-node';

                        if (node.style) {
                            try {
                                tileStyle = this.generateNodeStyle(node.style);
                                if (node.style.pattern && node.style.pattern !== 'none') {
                                    tileClass += ` node-pattern-${node.style.pattern}`;
                                }
                            } catch (styleError) {
                                console.warn(`[MapSystem] Style error on node (${viewX},${viewY}):`, styleError);
                            }
                        }

                        if (node.tags) {
                            try {
                                if (node.tags.some(tag => tag.startsWith('entry-'))) {
                                    tileClass += ' entry-point';
                                }
                                node.tags.forEach(tag => {
                                    tileClass += ` tag-${tag.replace(/[^a-zA-Z0-9-]/g, '-')}`;
                                });
                            } catch (tagError) {
                                console.warn(`[MapSystem] Tag error on node (${viewX},${viewY}):`, tagError);
                            }
                        }

                        if (isPlayer) {
                            tileClass += ' player-tile';
                            tileContent = '<i data-lucide="user" class="player-indicator"></i>';
                        } else {
                            try {
                                const effectiveNode = this.getEffectiveNodeData(node);
                                if (effectiveNode.icon) {
                                    tileContent = `<i data-lucide="${effectiveNode.icon}" class="tile-icon"></i>`;
                                }
                            } catch (iconError) {
                                console.warn(`[MapSystem] Icon error on node (${viewX},${viewY}):`, iconError);
                            }
                        }

                        // Generate connection elements for this node
                        if (node.transitions && isRevealed) {
                            connections = this.generateConnectionElements(node.transitions, col, row, 'minimap');
                        }
                    } else {
                        tileClass += ' tile-empty';
                    }

                    // Add the tile with a unique ID for connection positioning
                    const tileId = `minimap-tile-${col}-${row}`;
                    html += `<div id="${tileId}" class="${tileClass}" data-x="${viewX}" data-y="${viewY}" style="${tileStyle}">${tileContent}${connections}</div>`;
                }
            }

            html += '</div></div>';
            
            return html;

        } catch (e) {
            console.error("[MapSystem] Error generating minimap HTML:", e);
            return '<div class="tile-grid minimap-grid"><div class="tile minimap-tile tile-error">❌</div></div>';
        }
    },

    /**
     * Generate connection elements for a node
     */
    generateConnectionElements(transitions, gridX, gridY, mapType = 'minimap') {
        let html = '';
        
        Object.entries(transitions).forEach(([direction, transition]) => {
            if (transition.type === 'none' || (transition.type === 'secret' && !this.isTransitionRevealed(null, direction))) {
                return; // Skip none and unrevealed secret transitions
            }
            
            const effectiveType = this.getEffectiveTransitionType(transition);
            let connectionClass = `connection-line ${direction} ${effectiveType}`;
            
            html += `<div class="${connectionClass}"></div>`;
        });
        
        return html;
    },

    /**
     * Generate full map HTML for journal with enhanced styling
     */
    generateFullMapHTML() {
        if (!this.currentMap) {
            return '<div class="map-placeholder">No map loaded</div>';
        }
        
        const { width, height } = this.currentMap.gridSize;
        const { x: playerX, y: playerY } = this.currentPosition;
        
        let html = `<div class="full-map-container" style="position: relative;">`;
        html += `<div class="tile-grid full-map-grid" style="grid-template-columns: repeat(${width}, 60px); grid-template-rows: repeat(${height}, 60px);">`;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const node = this.getNodeAt(x, y);
                const isPlayer = (x === playerX && y === playerY);
                const isRevealed = this.isTileRevealed(this.currentMap.mapId, x, y);
                
                let tileClass = 'tile full-map-tile';
                let tileContent = '';
                let tileStyle = '';
                let connections = '';
                
                if (!isRevealed && this.currentMap.fogOfWar) {
                    tileClass += ' tile-hidden';
                } else if (node) {
                    tileClass += ' tile-node';
                    
                    // Apply node styling
                    if (node.style) {
                        tileStyle = this.generateNodeStyle(node.style);
                        if (node.style.pattern && node.style.pattern !== 'none') {
                            tileClass += ` node-pattern-${node.style.pattern}`;
                        }
                    }
                    
                    // Add entry point indicator
                    if (node.tags && node.tags.some(tag => tag.startsWith('entry-'))) {
                        tileClass += ' entry-point';
                    }
                    
                    // Add region/tag classes for styling
                    if (node.tags) {
                        node.tags.forEach(tag => {
                            tileClass += ` tag-${tag.replace(/[^a-zA-Z0-9-]/g, '-')}`;
                        });
                    }
                    
                    if (isPlayer) {
                        tileClass += ' player-tile';
                        tileContent = '<i data-lucide="user" class="player-indicator"></i>';
                    } else {
                        const effectiveNode = this.getEffectiveNodeData(node);
                        if (effectiveNode.icon) {
                            tileContent = `<i data-lucide="${effectiveNode.icon}" class="tile-icon"></i>`;
                        }
                    }
                    
                    // Add click handler for movement
                    if (this.isAdjacentToPlayer(x, y)) {
                        tileClass += ' tile-clickable';
                    }
                    
                    // Generate connection elements
                    if (node.transitions && isRevealed) {
                        connections = this.generateConnectionElements(node.transitions, x, y, 'fullmap');
                    }
                } else {
                    tileClass += ' tile-empty';
                }
                
                const tileId = `fullmap-tile-${x}-${y}`;
                html += `<div id="${tileId}" class="${tileClass}" data-x="${x}" data-y="${y}" onclick="MapSystem.handleTileClick(${x}, ${y})" style="${tileStyle}">${tileContent}${connections}</div>`;
            }
        }
        
        html += '</div></div>';
        return html;
    },
    
    /**
     * Update minimap info display
     */
    updateMinimapInfo() {
        const mapNameEl = document.getElementById('minimap-current-map');
        const coordsEl = document.getElementById('minimap-player-coords');
        
        if (mapNameEl && this.currentMap) {
            mapNameEl.textContent = this.currentMap.name;
        }
        
        if (coordsEl) {
            coordsEl.textContent = `(${this.currentPosition.x}, ${this.currentPosition.y})`;
        }
    },
    
    /**
     * Get the effective node data after applying conditions
     */
    getEffectiveNodeData(node) {
        if (!node || !node.conditions || node.conditions.length === 0) {
            return node;
        }
        
        // Create a copy of the node data
        const effectiveNode = { ...node };
        
        // Check conditions in priority order (first condition that matches wins)
        for (const condition of node.conditions) {
            if (this.evaluateCondition(condition)) {
                // Apply the condition's changes
                if (condition.passage) {
                    effectiveNode.passage = condition.passage;
                }
                if (condition.icon) {
                    effectiveNode.icon = condition.icon;
                }
                // First matching condition takes precedence
                break;
            }
        }
        
        return effectiveNode;
    },
    
    /**
     * Update location info in sidebar
     */
    updateLocationInfo() {
        if (!this.currentMap) return;
        
        const currentNode = this.getNodeAt(this.currentPosition.x, this.currentPosition.y);
        const effectiveNode = this.getEffectiveNodeData(currentNode);
        const locationName = effectiveNode ? effectiveNode.name : 'Unknown Location';
        
        // Update world state
        if (State.variables.world) {
            State.variables.world.locationName = locationName;
        }
        
        // Update sidebar display
        const locationEl = document.getElementById('sidebar-location');
        if (locationEl) {
            locationEl.textContent = locationName;
        }
    },
    
    /**
     * Get passage text for current or specified node
     */
    getPassageText(nodeKey = null) {
        if (!nodeKey) {
            nodeKey = `${this.currentPosition.x},${this.currentPosition.y}`;
        }
        
        return this.passageTexts.get(nodeKey) || null;
    },
    
    /**
     * Get map metadata
     */
    getMapMetadata() {
        if (!this.currentMap) return null;
        
        return {
            mapId: this.currentMap.mapId,
            name: this.currentMap.name,
            region: this.currentMap.region || null,
            width: this.currentMap.gridSize.width,
            height: this.currentMap.gridSize.height,
            entryPoints: Object.fromEntries(this.entryPointRegistry),
            tagLibrary: Array.from(this.projectTagLibrary)
        };
    },
    
    /**
     * Check if player can access a specific region/area
     */
    canAccessRegion(regionTag) {
        const currentTags = this.getCurrentNodeTags();
        
        // Example: "public" areas allow access to most regions
        if (currentTags.includes('public')) {
            return true;
        }
        
        // Example: "restricted" areas might block access
        if (currentTags.includes('restricted')) {
            return false;
        }
        
        // Default: allow access
        return true;
    },
    
    /**
     * Get all available entry points from current location
     */
    getAvailableEntryPoints() {
        const availableEntries = [];
        
        for (const [entryType, nodeKey] of this.entryPointRegistry) {
            const [x, y] = nodeKey.split(',').map(Number);
            const node = this.getNodeAt(x, y);
            
            if (node) {
                availableEntries.push({
                    type: entryType,
                    position: { x, y },
                    name: node.name,
                    tags: node.tags || []
                });
            }
        }
        
        return availableEntries;
    }

};


// Initialize when DOM is ready
$(document).ready(() => {
    MapSystem.init();
});

// Update map display on passage changes
$(document).on(':passagedisplay', async () => {
    // If we have map state but no current map loaded (e.g., after refresh)
    if (!MapSystem.currentMap && State.variables.player?.mapState?.currentMapId) {
        console.log("[MapSystem] Detected missing map after passage display, attempting restore...");
        await MapSystem.restoreMapState();
    }

    if (MapSystem.currentMap) {
        MapSystem.updateMinimapDisplay();
        MapSystem.updateLocationInfo();
    }
});

// Update full map when journal map tab is opened
$(document).on('click', '[data-tab="map"]', () => {
    setTimeout(() => {
        if (MapSystem.currentMap) {
            MapSystem.updateFullMapDisplay();
        }
    }, 100);
});