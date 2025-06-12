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
        
        console.log("[MapSystem] Initialized successfully");
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
    async setCurrentMap(mapId, position = null) {
        const mapData = await this.loadMap(mapId);
        if (!mapData) {
            console.error(`[MapSystem] Failed to set current map: ${mapId}`);
            return false;
        }
        
        this.currentMap = mapData;
        
        // Set position
        if (position) {
            this.currentPosition = { ...position };
        } else if (mapData.playerStartPosition) {
            this.currentPosition = { ...mapData.playerStartPosition };
        } else {
            this.currentPosition = { x: 1, y: 1 };
        }
        
        // Update player state
        State.variables.player.mapState.currentMapId = mapId;
        State.variables.player.mapState.position = { ...this.currentPosition };
        
        // Initialize fog of war if enabled
        if (mapData.fogOfWar) {
            this.initializeFogOfWar(mapId);
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
        
        return this.currentMap.nodes.find(node => node.x === x && node.y === y);
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
        
        // Check transition type
        if (transition.type === "none") {
            return false;
        }
        
        if (transition.type === "secret") {
            // Secret transitions are hidden until unlocked
            if (!this.isTransitionRevealed(currentNode, direction)) {
                return false;
            }
        }
        
        if (transition.type === "one-way" && transition.direction !== direction) {
            return false;
        }
        
        // Check if transition is currently locked by conditions
        if (this.isTransitionLocked(transition)) {
            return false;
        }
        
        // Check conditions
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
    
    /**
     * Evaluate a single condition
     */
    evaluateCondition(condition) {
        const player = State.variables.player;
        const inventory = State.variables.inventory_player || {};
        
        // Handle both old and new condition formats
        const conditionType = condition.type;
        const operator = condition.operator || "==";
        let targetValue, actualValue;
        
        switch (conditionType) {
            case "variable":
                // New format: condition.name contains the variable path
                // Old format: condition.variable contains the variable path
                const variablePath = condition.name || condition.variable;
                actualValue = this.getNestedValue(State.variables, variablePath);
                targetValue = condition.value;
                break;
                
            case "item":
                // New format: condition.name contains the item name
                // Old format: condition.item contains the item name
                const itemName = condition.name || condition.item;
                actualValue = inventory[itemName] || 0;
                targetValue = condition.value || true; // Default to checking if item exists
                break;
                
            case "quest":
                // New format: condition.name contains the quest name
                // Old format: condition.quest contains the quest name
                const questName = condition.name || condition.quest;
                // Implement quest condition checking based on your quest system
                // For now, assume quests are stored in State.variables.quests
                const quests = State.variables.quests || {};
                actualValue = quests[questName] || false;
                targetValue = condition.value || true; // Default to checking if quest is completed
                break;
                
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
            // Reveal adjacent tiles
            this.revealAdjacentTiles(this.currentMap.mapId, targetPos.x, targetPos.y);
        }
        
        // Update displays
        this.updateMinimapDisplay();
        this.updateLocationInfo();
        
        // Get the effective node data (applying conditions)
        const effectiveNode = this.getEffectiveNodeData(targetNode);
        
        // Navigate to the target passage
        if (effectiveNode.passage) {
            console.log(`[MapSystem] Moving to passage: ${effectiveNode.passage}`);
            Engine.play(effectiveNode.passage);
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
        if (!container || !this.currentMap) {
            return;
        }
        
        // Generate minimap HTML
        const minimapHtml = this.generateMinimapHTML();
        container.innerHTML = minimapHtml;
        
        // Update minimap info
        this.updateMinimapInfo();
        
        // Re-render Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    },
    
    /**
     * Generate minimap HTML with enhanced styling support
     */
    generateMinimapHTML() {
        if (!this.currentMap) return '';
        
        const { width, height } = this.currentMap.gridSize;
        const { x: playerX, y: playerY } = this.currentPosition;
        
        // Calculate visible area (3x3 around player for minimap)
        const minX = Math.max(1, playerX - 1);
        const maxX = Math.min(width, playerX + 1);
        const minY = Math.max(1, playerY - 1);
        const maxY = Math.min(height, playerY + 1);
        
        let html = '<div class="tile-grid minimap-grid">';
        
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const node = this.getNodeAt(x, y);
                const isPlayer = (x === playerX && y === playerY);
                const isRevealed = this.isTileRevealed(this.currentMap.mapId, x, y);
                
                let tileClass = 'tile minimap-tile';
                let tileContent = '';
                let tileStyle = '';
                
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
                    
                    // Add transitions
                    if (node.transitions) {
                        Object.keys(node.transitions).forEach(dir => {
                            const transition = node.transitions[dir];
                            tileClass += ` has-${dir}`;
                            
                            if (transition.type === 'one-way') {
                                tileClass += ` oneway-${dir}`;
                            }
                        });
                    }
                } else {
                    tileClass += ' tile-empty';
                }
                
                html += `<div class="${tileClass}" data-x="${x}" data-y="${y}" style="${tileStyle}">${tileContent}</div>`;
            }
        }
        
        html += '</div>';
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
     * Generate full map HTML for journal with enhanced styling
     */
    generateFullMapHTML() {
        if (!this.currentMap) {
            return '<div class="map-placeholder">No map loaded</div>';
        }
        
        const { width, height } = this.currentMap.gridSize;
        const { x: playerX, y: playerY } = this.currentPosition;
        
        let html = '<div class="tile-grid full-map-grid">';
        
        for (let y = 1; y <= height; y++) {
            for (let x = 1; x <= width; x++) {
                const node = this.getNodeAt(x, y);
                const isPlayer = (x === playerX && y === playerY);
                const isRevealed = this.isTileRevealed(this.currentMap.mapId, x, y);
                
                let tileClass = 'tile full-map-tile';
                let tileContent = '';
                let tileStyle = '';
                
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
                    
                    // Add transitions
                    if (node.transitions) {
                        Object.keys(node.transitions).forEach(dir => {
                            const transition = node.transitions[dir];
                            tileClass += ` has-${dir}`;
                            
                            if (transition.type === 'one-way') {
                                tileClass += ` oneway-${dir}`;
                            }
                        });
                    }
                } else {
                    tileClass += ' tile-empty';
                }
                
                html += `<div class="${tileClass}" data-x="${x}" data-y="${y}" onclick="MapSystem.handleTileClick(${x}, ${y})" style="${tileStyle}">${tileContent}</div>`;
            }
        }
        
        html += '</div>';
        return html;
    },
    
    /**
     * Check if coordinates are adjacent to player
     */
    isAdjacentToPlayer(x, y) {
        const { x: px, y: py } = this.currentPosition;
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    },
    
    /**
     * Handle tile click in full map
     */
    handleTileClick(x, y) {
        if (!this.isAdjacentToPlayer(x, y)) {
            return;
        }
        
        const { x: px, y: py } = this.currentPosition;
        let direction = null;
        
        if (x > px) direction = 'east';
        else if (x < px) direction = 'west';
        else if (y > py) direction = 'south';
        else if (y < py) direction = 'north';
        
        if (direction) {
            this.movePlayer(direction);
        }
    },
    
    /**
     * Update full map display in journal
     */
    updateFullMapDisplay() {
        const container = document.getElementById('full-map-container');
        const mapTitle = document.getElementById('map-title');
        
        if (!container) {
            return;
        }
        
        if (!this.currentMap) {
            container.innerHTML = `
                <div class="map-placeholder">
                    <i data-lucide="map"></i>
                    <p>No map loaded</p>
                    <p>Use <code>MapSystem.setCurrentMap('example-map')</code> to load a map</p>
                </div>
            `;
            if (mapTitle) {
                mapTitle.textContent = 'No Map Loaded';
            }
            return;
        }
        
        // Update map title
        if (mapTitle) {
            mapTitle.textContent = this.currentMap.name;
        }
        
        // Generate full map HTML
        const mapHtml = this.generateFullMapHTML();
        container.innerHTML = mapHtml;
        
        // Re-render Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    },
    
    // ===== ENHANCED GAMEPLAY UTILITY FUNCTIONS =====
    
    /**
     * Generate CSS style string for node styling
     */
    generateNodeStyle(style) {
        let styleString = '';
        
        if (style.primaryColor && style.primaryColor !== '#007bff') {
            styleString += `background-color: ${style.primaryColor}; `;
            styleString += `--node-primary-color: ${style.primaryColor}; `;
        }
        
        if (style.secondaryColor && style.secondaryColor !== '#6c757d') {
            styleString += `--node-secondary-color: ${style.secondaryColor}; `;
        }
        
        return styleString;
    },
    
    /**
     * Get all nodes with specific tags
     */
    getNodesByTag(tag) {
        if (!this.currentMap) return [];
        
        return this.currentMap.nodes.filter(node => 
            node.tags && node.tags.includes(tag)
        );
    },
    
    /**
     * Get all nodes in a specific region
     */
    getNodesByRegion(region) {
        return this.getNodesByTag(region);
    },
    
    /**
     * Get current node's tags
     */
    getCurrentNodeTags() {
        const currentNode = this.getNodeAt(this.currentPosition.x, this.currentPosition.y);
        return currentNode ? (currentNode.tags || []) : [];
    },
    
    /**
     * Check if current location has specific tag
     */
    currentLocationHasTag(tag) {
        return this.getCurrentNodeTags().includes(tag);
    },
    
    /**
     * Get entry point position by type
     */
    getEntryPointPosition(entryType) {
        if (!this.entryPointRegistry.has(entryType)) {
            return null;
        }
        
        const nodeKey = this.entryPointRegistry.get(entryType);
        const [x, y] = nodeKey.split(',').map(Number);
        return { x, y };
    },
    
    /**
     * Teleport player to entry point
     */
    teleportToEntryPoint(entryType) {
        const position = this.getEntryPointPosition(entryType);
        if (!position) {
            console.warn(`[MapSystem] Entry point not found: ${entryType}`);
            return false;
        }
        
        const targetNode = this.getNodeAt(position.x, position.y);
        if (!targetNode) {
            console.warn(`[MapSystem] No node at entry point position: ${entryType}`);
            return false;
        }
        
        // Update position
        this.currentPosition = position;
        State.variables.player.mapState.position = { ...position };
        
        // Reveal tiles for fog of war
        if (this.currentMap.fogOfWar) {
            this.revealTile(this.currentMap.mapId, position.x, position.y);
            this.revealAdjacentTiles(this.currentMap.mapId, position.x, position.y);
        }
        
        // Update displays
        this.updateMinimapDisplay();
        this.updateLocationInfo();
        
        // Navigate to the target passage
        const effectiveNode = this.getEffectiveNodeData(targetNode);
        if (effectiveNode.passage) {
            console.log(`[MapSystem] Teleporting to passage: ${effectiveNode.passage}`);
            Engine.play(effectiveNode.passage);
        }
        
        return true;
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
$(document).on(':passagedisplay', () => {
    if (MapSystem.currentMap) {
        MapSystem.updateMinimapDisplay();
        MapSystem.updateLocationInfo();
    }
});
