/**
 * TileMapSystem.js - Improved Version
 * 
 * A comprehensive tile-based navigation system for Twine/SugarCube games.
 * Handles loading tile maps from JSON, rendering the tile grid, managing dynamic conditions,
 * and coordinating with the navigation system for player movement.
 * 
 * Improvements:
 * - Memory leak prevention with proper cleanup
 * - Performance optimizations for large maps
 * - Better error handling and validation
 * - Improved modularity and separation of concerns
 * - Enhanced caching mechanisms
 * - Safer event execution
 */

class TileMapSystem {
    /**
     * Initialize the TileMapSystem
     * @param {string} containerId - DOM element ID where the map will be rendered
     * @param {Object} options - Configuration options
     */
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = null;
        this.currentMap = null;
        this.currentMapData = null;
        this.tiles = new Map(); // Map of tile ID to tile data
        this.tileElements = new Map(); // Map of tile ID to DOM elements
        this.tileCache = new Map(); // Cache for tile lookups by position
        this.gridSize = options.gridSize || 64; // Size of each grid cell in pixels
        this.showGrid = options.showGrid || false;
        this.enableAnimations = options.enableAnimations !== false;
        this.baseTilePath = options.baseTilePath || 'images/tiles/';
        
        // Performance options
        this.renderBatchSize = options.renderBatchSize || 50; // Tiles to render per frame
        this.enableViewportCulling = options.enableViewportCulling !== false;
        this.viewportPadding = options.viewportPadding || 2; // Grid cells to render outside viewport
        
        // Event callbacks
        this.onMapLoaded = options.onMapLoaded || null;
        this.onTileEnter = options.onTileEnter || null;
        this.onTileExit = options.onTileExit || null;
        this.onTileInteract = options.onTileInteract || null;
        
        // Internal state
        this.ambientEventInterval = null;
        this.isDestroyed = false;
        this.loadingPromise = null;
        this.imagePreloadCache = new Map();
        
        // Initialize the system
        this.initialize();
    }

    /**
     * Initialize the tile map system
     */
    initialize() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`TileMapSystem: Container element '${this.containerId}' not found`);
            return;
        }

        // Set up the container
        this.container.classList.add('tile-map-container');
        this.container.innerHTML = '';
        this.container.setAttribute('tabindex', '0'); // For keyboard focus

        // Create the grid container
        this.gridContainer = document.createElement('div');
        this.gridContainer.classList.add('tile-grid');
        this.container.appendChild(this.gridContainer);

        // Set up viewport culling if enabled
        if (this.enableViewportCulling) {
            this.setupViewportCulling();
        }

        // Set up event listeners for ambient events
        this.setupAmbientEvents();

        console.log('TileMapSystem initialized');
    }

    /**
     * Set up viewport culling for performance
     */
    setupViewportCulling() {
        this.viewportObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const tileElement = entry.target;
                if (entry.isIntersecting) {
                    tileElement.classList.remove('tile-culled');
                } else {
                    tileElement.classList.add('tile-culled');
                }
            });
        }, {
            root: this.container,
            rootMargin: `${this.viewportPadding * this.gridSize}px`
        });
    }

    /**
     * Load a map from JSON data
     * @param {string} mapId - The map identifier
     * @param {Object} playerPosition - Optional starting position {x, y}
     * @returns {Promise<boolean>} Success status
     */
    async loadMap(mapId, playerPosition = null) {
        // Prevent concurrent loads
        if (this.loadingPromise) {
            await this.loadingPromise;
        }

        this.loadingPromise = this._loadMapInternal(mapId, playerPosition);
        const result = await this.loadingPromise;
        this.loadingPromise = null;
        return result;
    }

    /**
     * Internal map loading logic
     * @private
     */
    async _loadMapInternal(mapId, playerPosition) {
        try {
            console.log(`Loading map: ${mapId}`);
            
            // Add loading state
            this.container.classList.add('loading');
            
            // Load map data from JSON file
            const mapData = await this.loadMapData(mapId);
            if (!mapData) {
                console.error(`Failed to load map data for: ${mapId}`);
                return false;
            }

            // Validate map data
            if (!this.validateMapData(mapData)) {
                console.error(`Invalid map data for: ${mapId}`);
                return false;
            }

            // Preload tile images
            await this.preloadTileImages(mapData.tiles);

            this.currentMap = mapId;
            this.currentMapData = mapData;
            
            // Clear existing tiles
            this.clearMap();
            
            // Process and store tile data
            this.processTileData(mapData.tiles);
            
            // Build tile position cache
            this.buildTileCache();
            
            // Render the map
            await this.renderMap();
            
            // Set up player position
            if (playerPosition) {
                this.setPlayerPosition(playerPosition.x, playerPosition.y);
            } else if (mapData.defaultPlayerPosition) {
                this.setPlayerPosition(mapData.defaultPlayerPosition.x, mapData.defaultPlayerPosition.y);
            }

            // Remove loading state
            this.container.classList.remove('loading');

            // Trigger map loaded callback
            if (this.onMapLoaded) {
                this.onMapLoaded(mapId, mapData);
            }

            console.log(`Map '${mapId}' loaded successfully`);
            return true;

        } catch (error) {
            console.error(`Error loading map '${mapId}':`, error);
            this.container.classList.remove('loading');
            return false;
        }
    }

    /**
     * Validate map data structure
     * @param {Object} mapData - Map data to validate
     * @returns {boolean} True if valid
     */
    validateMapData(mapData) {
        if (!mapData || typeof mapData !== 'object') return false;
        if (!mapData.size || typeof mapData.size.width !== 'number' || typeof mapData.size.height !== 'number') return false;
        if (!Array.isArray(mapData.tiles)) return false;
        
        // Validate each tile
        for (const tile of mapData.tiles) {
            if (!tile.id || !tile.position || typeof tile.position.x !== 'number' || typeof tile.position.y !== 'number') {
                console.error('Invalid tile data:', tile);
                return false;
            }
            if (!tile.size || typeof tile.size.width !== 'number' || typeof tile.size.height !== 'number') {
                console.error('Invalid tile size:', tile);
                return false;
            }
        }
        
        return true;
    }

    /**
     * Preload tile images for better performance
     * @param {Array} tiles - Array of tile objects
     */
    async preloadTileImages(tiles) {
        const imageUrls = new Set();
        
        // Collect all unique image URLs
        for (const tile of tiles) {
            if (tile.image) {
                imageUrls.add(this.baseTilePath + tile.image);
            }
            // Also preload dynamic condition images
            if (tile.dynamicConditions) {
                for (const condition of tile.dynamicConditions) {
                    if (condition.image) {
                        imageUrls.add(this.baseTilePath + condition.image);
                    }
                }
            }
        }
        
        // Preload all images
        const preloadPromises = Array.from(imageUrls).map(url => {
            if (this.imagePreloadCache.has(url)) {
                return this.imagePreloadCache.get(url);
            }
            
            const promise = new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                img.src = url;
            });
            
            this.imagePreloadCache.set(url, promise);
            return promise;
        });
        
        try {
            await Promise.all(preloadPromises);
        } catch (error) {
            console.warn('Some tile images failed to preload:', error);
        }
    }

    /**
     * Load map data from JSON file
     * @param {string} mapId - The map identifier
     * @returns {Object|null} Map data or null if failed
     */
    async loadMapData(mapId) {
        try {
            const response = await fetch(`dev/js/data/maps/${mapId}.json`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to load map data for '${mapId}':`, error);
            return null;
        }
    }

    /**
     * Process tile data and apply dynamic conditions
     * @param {Array} tilesData - Array of tile objects from JSON
     */
    processTileData(tilesData) {
        this.tiles.clear();
        
        for (const tileData of tilesData) {
            // Clone the tile data to avoid modifying the original
            const tile = JSON.parse(JSON.stringify(tileData));
            
            // Apply dynamic conditions
            this.applyDynamicConditions(tile);
            
            // Store the processed tile
            this.tiles.set(tile.id, tile);
        }
    }

    /**
     * Build tile position cache for fast lookups
     */
    buildTileCache() {
        this.tileCache.clear();
        
        for (const [tileId, tile] of this.tiles) {
            const { position, size } = tile;
            
            // Cache all grid positions this tile occupies
            for (let x = position.x; x < position.x + size.width; x++) {
                for (let y = position.y; y < position.y + size.height; y++) {
                    const key = `${x},${y}`;
                    this.tileCache.set(key, tile);
                }
            }
        }
    }

    /**
     * Apply dynamic conditions to a tile based on game state
     * @param {Object} tile - Tile object to modify
     */
    applyDynamicConditions(tile) {
        if (!tile.dynamicConditions || tile.dynamicConditions.length === 0) {
            return;
        }

        for (const condition of tile.dynamicConditions) {
            if (this.evaluateCondition(condition.condition)) {
                // Apply the conditional changes
                if (condition.image !== undefined) tile.image = condition.image;
                if (condition.walkable !== undefined) tile.walkable = condition.walkable;
                if (condition.events) tile.events = { ...tile.events, ...condition.events };
                if (condition.entryPoints) tile.entryPoints = condition.entryPoints;
                if (condition.exitPoints) tile.exitPoints = condition.exitPoints;
                
                // Only apply the first matching condition
                break;
            }
        }
    }

    /**
     * Evaluate a condition string using SugarCube's State system
     * @param {string} conditionStr - Condition to evaluate
     * @returns {boolean} Result of condition evaluation
     */
    evaluateCondition(conditionStr) {
        if (!conditionStr || typeof conditionStr !== 'string') {
            return false;
        }
        
        try {
            // Create a safer evaluation context
            const State = window.State || {};
            const evalFunc = new Function('State', `return ${conditionStr}`);
            return evalFunc(State);
        } catch (error) {
            console.warn(`Failed to evaluate condition: ${conditionStr}`, error);
            return false;
        }
    }

    /**
     * Clear the current map
     */
    clearMap() {
        // Clean up viewport observer
        if (this.viewportObserver) {
            this.viewportObserver.disconnect();
        }
        
        // Clear DOM
        this.gridContainer.innerHTML = '';
        
        // Clear data structures
        this.tileElements.clear();
        this.tiles.clear();
        this.tileCache.clear();
    }

    /**
     * Render the entire map with batching for performance
     */
    async renderMap() {
        if (!this.currentMapData) {
            console.error('No map data to render');
            return;
        }

        const { width, height } = this.currentMapData.size;
        
        // Set up the grid container dimensions
        this.gridContainer.style.width = `${width * this.gridSize}px`;
        this.gridContainer.style.height = `${height * this.gridSize}px`;
        this.gridContainer.style.position = 'relative';
        
        // Add grid lines if enabled
        if (this.showGrid) {
            this.gridContainer.classList.add('show-grid');
        } else {
            this.gridContainer.classList.remove('show-grid');
        }

        // Render tiles in batches to prevent blocking
        const tiles = Array.from(this.tiles.values());
        for (let i = 0; i < tiles.length; i += this.renderBatchSize) {
            const batch = tiles.slice(i, i + this.renderBatchSize);
            
            // Render batch
            batch.forEach(tile => this.renderTile(tile));
            
            // Allow browser to breathe
            if (i + this.renderBatchSize < tiles.length) {
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
        }
    }

    /**
     * Render a single tile
     * @param {Object} tile - Tile data object
     */
    renderTile(tile) {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        tileElement.id = `tile-${tile.id}`;
        tileElement.dataset.tileId = tile.id;

        // Position and size the tile
        const { x, y } = tile.position;
        const { width, height } = tile.size;
        
        tileElement.style.position = 'absolute';
        tileElement.style.left = `${x * this.gridSize}px`;
        tileElement.style.top = `${y * this.gridSize}px`;
        tileElement.style.width = `${width * this.gridSize}px`;
        tileElement.style.height = `${height * this.gridSize}px`;

        // Set background image
        if (tile.image) {
            tileElement.style.backgroundImage = `url('${this.baseTilePath}${tile.image}')`;
            tileElement.style.backgroundSize = 'cover';
            tileElement.style.backgroundPosition = 'center';
            tileElement.style.backgroundRepeat = 'no-repeat';
        }

        // Add walkability class
        if (tile.walkable) {
            tileElement.classList.add('walkable');
        } else {
            tileElement.classList.add('non-walkable');
        }

        // Add interaction capability
        if (tile.events && tile.events.onInteract) {
            tileElement.classList.add('interactive');
            tileElement.setAttribute('aria-label', 'Interactive tile - Press E to interact');
            tileElement.setAttribute('role', 'button');
        }

        // Add tile type for styling
        if (tile.type) {
            tileElement.dataset.tileType = tile.type;
        }

        // Store the tile element
        this.tileElements.set(tile.id, tileElement);
        this.gridContainer.appendChild(tileElement);
        
        // Add to viewport observer if enabled
        if (this.viewportObserver) {
            this.viewportObserver.observe(tileElement);
        }
    }

    /**
     * Get tile at specific grid coordinates (with caching)
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @returns {Object|null} Tile data or null if no tile found
     */
    getTileAt(x, y) {
        const key = `${x},${y}`;
        return this.tileCache.get(key) || null;
    }

    /**
     * Get tile by ID
     * @param {string} tileId - Tile identifier
     * @returns {Object|null} Tile data or null if not found
     */
    getTileById(tileId) {
        return this.tiles.get(tileId) || null;
    }

    /**
     * Check if movement is valid from one position to another
     * @param {number} fromX - Starting X coordinate
     * @param {number} fromY - Starting Y coordinate
     * @param {number} toX - Target X coordinate
     * @param {number} toY - Target Y coordinate
     * @param {string} direction - Movement direction (north, south, east, west)
     * @returns {boolean} True if movement is valid
     */
    isValidMovement(fromX, fromY, toX, toY, direction) {
        const fromTile = this.getTileAt(fromX, fromY);
        const toTile = this.getTileAt(toX, toY);

        // Check if target tile exists and is walkable
        if (!toTile || !toTile.walkable) {
            return false;
        }

        // Check if we can exit from the current tile in this direction
        if (fromTile && fromTile.exitPoints && fromTile.exitPoints.length > 0 && !fromTile.exitPoints.includes(direction)) {
            return false;
        }

        // Check if we can enter the target tile from the opposite direction
        const oppositeDirection = this.getOppositeDirection(direction);
        if (toTile.entryPoints && toTile.entryPoints.length > 0 && !toTile.entryPoints.includes(oppositeDirection)) {
            return false;
        }

        return true;
    }

    /**
     * Get the opposite direction
     * @param {string} direction - Original direction
     * @returns {string} Opposite direction
     */
    getOppositeDirection(direction) {
        const opposites = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };
        return opposites[direction] || direction;
    }

    /**
     * Handle tile entry event
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @param {string} direction - Direction of entry
     */
    handleTileEntry(x, y, direction) {
        const tile = this.getTileAt(x, y);
        if (!tile) return;

        // Execute onEnter event
        if (tile.events && tile.events.onEnter) {
            this.executeEvent(tile.events.onEnter, tile);
        }

        // Check for exit events (portals)
        if (tile.events && tile.events.onExit) {
            this.executeEvent(tile.events.onExit, tile);
        }

        // Trigger callback
        if (this.onTileEnter) {
            this.onTileEnter(tile, x, y, direction);
        }
    }

    /**
     * Handle tile interaction
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     */
    handleTileInteraction(x, y) {
        const tile = this.getTileAt(x, y);
        if (!tile) return;

        // Execute onInteract event
        if (tile.events && tile.events.onInteract) {
            this.executeEvent(tile.events.onInteract, tile);
        }

        // Trigger callback
        if (this.onTileInteract) {
            this.onTileInteract(tile, x, y);
        }
    }

    /**
     * Execute a tile event safely
     * @param {string} eventCode - JavaScript code to execute
     * @param {Object} tile - The tile that triggered the event
     */
    executeEvent(eventCode, tile = null) {
        if (!eventCode || typeof eventCode !== 'string') {
            console.warn('Invalid event code:', eventCode);
            return;
        }
        
        try {
            // Create a safe execution context
            const context = {
                showMessage: (msg) => this.showMessage(msg),
                openShop: (shopId) => this.openShop(shopId),
                startEvent: (eventId) => this.startEvent(eventId),
                loadMap: (mapId, position) => this.loadMap(mapId, position),
                State: window.State || {}, // SugarCube State object
                tile: tile, // Current tile context
                system: this // Reference to the system
            };

            // Execute the event code with the context
            const func = new Function(...Object.keys(context), eventCode);
            func(...Object.values(context));

        } catch (error) {
            console.error('Error executing tile event:', error, '\nEvent code:', eventCode);
        }
    }

    /**
     * Show a message to the player
     * @param {string} message - Message to display
     */
    showMessage(message) {
        // This should integrate with your game's message system
        console.log('Tile Message:', message);
        
        // Integration with SugarCube
        if (window.UI && window.UI.alert) {
            window.UI.alert(message);
        } else if (window.Dialog && window.Dialog.setup && window.Dialog.open) {
            window.Dialog.setup('Message', 'tile-message');
            window.Dialog.wiki(message);
            window.Dialog.open();
        } else {
            // Fallback to native alert
            alert(message);
        }
    }

    /**
     * Open a shop interface
     * @param {string} shopId - Shop identifier
     */
    openShop(shopId) {
        console.log('Opening shop:', shopId);
        // This should integrate with your existing shop system
        if (window.ShopSystem && window.ShopSystem.openShop) {
            window.ShopSystem.openShop(shopId);
        } else {
            this.showMessage(`Shop "${shopId}" would open here.`);
        }
    }

    /**
     * Start a game event
     * @param {string} eventId - Event identifier
     */
    startEvent(eventId) {
        console.log('Starting event:', eventId);
        // This should integrate with your existing event system
        if (window.Engine && window.Engine.play) {
            window.Engine.play(eventId);
        } else {
            this.showMessage(`Event "${eventId}" would start here.`);
        }
    }

    /**
     * Set player position (for visual indicators)
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     */
    setPlayerPosition(x, y) {
        // Remove previous player indicator
        const previousIndicator = this.container.querySelector('.player-indicator');
        if (previousIndicator) {
            previousIndicator.remove();
        }

        // Create new player indicator
        const indicator = document.createElement('div');
        indicator.classList.add('player-indicator');
        indicator.style.position = 'absolute';
        indicator.style.left = `${x * this.gridSize + this.gridSize / 4}px`;
        indicator.style.top = `${y * this.gridSize + this.gridSize / 4}px`;
        indicator.style.width = `${this.gridSize / 2}px`;
        indicator.style.height = `${this.gridSize / 2}px`;
        indicator.style.zIndex = '1000';
        
        // Add position data for debugging
        indicator.dataset.position = `${x},${y}`;

        this.container.appendChild(indicator);
    }

    /**
     * Update dynamic tiles based on current game state
     */
    updateDynamicTiles() {
        if (!this.currentMapData) return;

        const updatedTiles = new Set();
        
        // Check each tile for condition changes
        for (const originalTile of this.currentMapData.tiles) {
            const currentTile = this.tiles.get(originalTile.id);
            if (!currentTile) continue;
            
            // Re-evaluate dynamic conditions
            const updatedTile = JSON.parse(JSON.stringify(originalTile));
            this.applyDynamicConditions(updatedTile);
            
            // Check if tile has changed
            if (JSON.stringify(currentTile) !== JSON.stringify(updatedTile)) {
                updatedTiles.add(updatedTile.id);
                this.tiles.set(updatedTile.id, updatedTile);
            }
        }
        
        // Re-render only changed tiles
        for (const tileId of updatedTiles) {
            const tile = this.tiles.get(tileId);
            const existingElement = this.tileElements.get(tileId);
            
            if (existingElement) {
                existingElement.remove();
                this.tileElements.delete(tileId);
            }
            
            this.renderTile(tile);
        }
        
        // Rebuild cache if tiles changed
        if (updatedTiles.size > 0) {
            this.buildTileCache();
        }
    }

    /**
     * Set up ambient events system
     */
    setupAmbientEvents() {
        // Clear any existing interval
        if (this.ambientEventInterval) {
            clearInterval(this.ambientEventInterval);
        }
        
        // Check for ambient events periodically
        this.ambientEventInterval = setInterval(() => {
            if (!this.isDestroyed) {
                this.checkAmbientEvents();
            }
        }, 10000); // Check every 10 seconds
    }

    /**
     * Check and potentially trigger ambient events
     */
    checkAmbientEvents() {
        if (!this.currentMapData || !this.currentMapData.ambientEvents) return;

        for (const ambientEvent of this.currentMapData.ambientEvents) {
            // Check probability
            if (Math.random() > ambientEvent.probability) continue;

            // Check conditions
            let conditionsMet = true;
            if (ambientEvent.conditions) {
                for (const condition of ambientEvent.conditions) {
                    if (!this.evaluateCondition(condition)) {
                        conditionsMet = false;
                        break;
                    }
                }
            }

            if (conditionsMet) {
                this.showMessage(ambientEvent.message);
                break; // Only trigger one ambient event at a time
            }
        }
    }

    /**
     * Get current map information
     * @returns {Object} Current map data
     */
    getCurrentMapInfo() {
        return {
            mapId: this.currentMap,
            mapData: this.currentMapData,
            tiles: Array.from(this.tiles.values())
        };
    }

    /**
     * Toggle grid display
     */
    toggleGrid() {
        this.showGrid = !this.showGrid;
        if (this.showGrid) {
            this.gridContainer.classList.add('show-grid');
        } else {
            this.gridContainer.classList.remove('show-grid');
        }
    }

    /**
     * Enable debug mode
     * @param {boolean} enabled - Whether to enable debug mode
     */
    setDebugMode(enabled) {
        if (enabled) {
            this.container.classList.add('debug-mode');
        } else {
            this.container.classList.remove('debug-mode');
        }
    }

    /**
     * Destroy the tile map system and clean up resources
     */
    destroy() {
        this.isDestroyed = true;
        
        // Clear ambient event interval
        if (this.ambientEventInterval) {
            clearInterval(this.ambientEventInterval);
            this.ambientEventInterval = null;
        }
        
        // Disconnect viewport observer
        if (this.viewportObserver) {
            this.viewportObserver.disconnect();
            this.viewportObserver = null;
        }
        
        // Clear DOM
        if (this.container) {
            this.container.innerHTML = '';
            this.container.classList.remove('tile-map-container', 'loading', 'debug-mode');
        }
        
        // Clear data structures
        this.tiles.clear();
        this.tileElements.clear();
        this.tileCache.clear();
        this.imagePreloadCache.clear();
        
        // Clear references
        this.currentMap = null;
        this.currentMapData = null;
        this.container = null;
        this.gridContainer = null;
        
        console.log('TileMapSystem destroyed');
    }
}

// Export for use in other modules
window.TileMapSystem = TileMapSystem;
