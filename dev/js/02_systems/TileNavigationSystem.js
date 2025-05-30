/**
 * TileNavigationSystem.js - Improved Version
 * 
 * Handles player navigation within the tile-based map system.
 * Manages WASD movement controls, position tracking, movement validation,
 * interaction handling, and map transitions.
 * 
 * Improvements:
 * - Better memory management and cleanup
 * - Debounced movement for smoother controls
 * - Enhanced error handling
 * - Improved event listener management
 * - Better separation of concerns
 * - Performance optimizations
 */

class TileNavigationSystem {
    /**
     * Initialize the TileNavigationSystem
     * @param {TileMapSystem} tileMapSystem - Reference to the tile map system
     * @param {Object} options - Configuration options
     */
    constructor(tileMapSystem, options = {}) {
        if (!tileMapSystem) {
            throw new Error('TileNavigationSystem requires a TileMapSystem instance');
        }
        
        this.tileMapSystem = tileMapSystem;
        this.playerPosition = { x: 0, y: 0 };
        this.isMoving = false;
        this.movementSpeed = options.movementSpeed || 300; // Animation duration in ms
        this.enableAnimations = options.enableAnimations !== false;
        this.debugMode = options.debugMode || false;
        
        // Input handling
        this.keyStates = new Map();
        this.inputEnabled = true;
        this.movementCooldown = options.movementCooldown || 50; // Minimum time between moves
        this.lastMoveTime = 0;
        this.queuedMovement = null;
        
        // Key mappings
        this.movementKeys = {
            'KeyW': 'north',
            'KeyA': 'west', 
            'KeyS': 'south',
            'KeyD': 'east',
            'ArrowUp': 'north',
            'ArrowLeft': 'west',
            'ArrowDown': 'south',
            'ArrowRight': 'east'
        };
        this.interactionKeys = new Set(['KeyE', 'Enter', 'Space']);
        
        // Event callbacks
        this.onPositionChange = options.onPositionChange || null;
        this.onMovementBlocked = options.onMovementBlocked || null;
        this.onMapTransition = options.onMapTransition || null;
        this.onInteraction = options.onInteraction || null;
        
        // Bound event handlers for proper cleanup
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandleKeyUp = this.handleKeyUp.bind(this);
        this.boundHandleKeyPress = this.handleKeyPress.bind(this);
        this.boundHandleFocus = this.handleFocus.bind(this);
        
        // Movement queue for smooth controls
        this.movementQueue = [];
        this.processQueueInterval = null;
        
        // State tracking
        this.isDestroyed = false;
        this.currentAnimationFrame = null;
        
        // Initialize the system
        this.initialize();
    }

    /**
     * Initialize the navigation system
     */
    initialize() {
        this.setupEventListeners();
        this.startMovementQueueProcessor();
        console.log('TileNavigationSystem initialized');
    }

    /**
     * Set up keyboard event listeners
     */
    setupEventListeners() {
        // Keyboard event listeners
        document.addEventListener('keydown', this.boundHandleKeyDown, { passive: false });
        document.addEventListener('keyup', this.boundHandleKeyUp, { passive: false });
        
        // Prevent default behavior for movement keys
        document.addEventListener('keydown', this.boundHandleKeyPress, { passive: false });

        // Focus management to ensure key events are captured
        document.addEventListener('click', this.boundHandleFocus);
        
        // Initial focus
        this.handleFocus();
    }

    /**
     * Handle focus management
     */
    handleFocus() {
        if (this.inputEnabled && this.tileMapSystem.container) {
            this.tileMapSystem.container.focus();
        }
    }

    /**
     * Handle keypress to prevent defaults
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyPress(event) {
        if (this.movementKeys[event.code] || this.interactionKeys.has(event.code)) {
            event.preventDefault();
        }
    }

    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        if (!this.inputEnabled || this.isDestroyed) return;

        const { code } = event;
        
        // Prevent key repeat
        if (this.keyStates.get(code)) return;
        
        // Track key state
        this.keyStates.set(code, true);

        // Handle movement keys
        if (this.movementKeys[code]) {
            const direction = this.movementKeys[code];
            this.queueMovement(direction);
        }

        // Handle interaction keys
        if (this.interactionKeys.has(code)) {
            this.handleInteraction();
        }

        // Debug commands
        if (this.debugMode) {
            this.handleDebugKeys(event);
        }
    }

    /**
     * Handle keyup events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyUp(event) {
        const { code } = event;
        this.keyStates.set(code, false);
        
        // Clear queued movement if key released
        if (this.movementKeys[code] && this.queuedMovement === this.movementKeys[code]) {
            this.queuedMovement = null;
        }
    }

    /**
     * Queue a movement for processing
     * @param {string} direction - Movement direction
     */
    queueMovement(direction) {
        // Check cooldown
        const now = Date.now();
        if (now - this.lastMoveTime < this.movementCooldown) {
            this.queuedMovement = direction;
            return;
        }
        
        // Attempt immediate movement
        this.attemptMovement(direction);
    }

    /**
     * Start the movement queue processor
     */
    startMovementQueueProcessor() {
        this.processQueueInterval = setInterval(() => {
            if (!this.isDestroyed && this.queuedMovement && !this.isMoving) {
                const direction = this.queuedMovement;
                this.queuedMovement = null;
                this.attemptMovement(direction);
            }
        }, 50); // Process queue every 50ms
    }

    /**
     * Handle debug key commands
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleDebugKeys(event) {
        switch (event.code) {
            case 'KeyG':
                // Toggle grid display
                this.tileMapSystem.toggleGrid();
                console.log('Grid display toggled');
                break;
            case 'KeyI':
                // Show current position info
                this.showPositionInfo();
                break;
            case 'KeyR':
                // Refresh dynamic tiles
                this.tileMapSystem.updateDynamicTiles();
                console.log('Dynamic tiles refreshed');
                break;
            case 'KeyD':
                // Toggle debug mode display
                this.tileMapSystem.setDebugMode(!this.tileMapSystem.container.classList.contains('debug-mode'));
                break;
        }
    }

    /**
     * Attempt to move the player in a specific direction
     * @param {string} direction - Movement direction (north, south, east, west)
     */
    attemptMovement(direction) {
        if (this.isMoving || !this.inputEnabled || this.isDestroyed) return;

        const currentPos = this.playerPosition;
        const targetPos = this.calculateTargetPosition(currentPos, direction);

        // Check if movement is valid
        if (!this.isValidMovement(currentPos, targetPos, direction)) {
            this.handleBlockedMovement(direction, targetPos);
            return;
        }

        // Execute the movement
        this.executeMovement(targetPos, direction);
        this.lastMoveTime = Date.now();
    }

    /**
     * Calculate target position based on current position and direction
     * @param {Object} currentPos - Current position {x, y}
     * @param {string} direction - Movement direction
     * @returns {Object} Target position {x, y}
     */
    calculateTargetPosition(currentPos, direction) {
        const { x, y } = currentPos;
        
        switch (direction) {
            case 'north': return { x, y: y - 1 };
            case 'south': return { x, y: y + 1 };
            case 'east': return { x: x + 1, y };
            case 'west': return { x: x - 1, y };
            default: return currentPos;
        }
    }

    /**
     * Check if movement is valid
     * @param {Object} fromPos - Starting position {x, y}
     * @param {Object} toPos - Target position {x, y}
     * @param {string} direction - Movement direction
     * @returns {boolean} True if movement is valid
     */
    isValidMovement(fromPos, toPos, direction) {
        // Check map boundaries
        if (!this.isWithinMapBounds(toPos)) {
            return false;
        }

        // Use tile map system to validate movement
        return this.tileMapSystem.isValidMovement(
            fromPos.x, fromPos.y,
            toPos.x, toPos.y,
            direction
        );
    }

    /**
     * Check if position is within map boundaries
     * @param {Object} position - Position to check {x, y}
     * @returns {boolean} True if within bounds
     */
    isWithinMapBounds(position) {
        const mapData = this.tileMapSystem.currentMapData;
        if (!mapData) return false;

        const { x, y } = position;
        const { width, height } = mapData.size;

        return x >= 0 && x < width && y >= 0 && y < height;
    }

    /**
     * Execute player movement to target position
     * @param {Object} targetPos - Target position {x, y}
     * @param {string} direction - Movement direction
     */
    executeMovement(targetPos, direction) {
        this.isMoving = true;
        const previousPos = { ...this.playerPosition };

        // Update player position
        this.playerPosition = targetPos;

        // Handle tile exit events from previous position
        const previousTile = this.tileMapSystem.getTileAt(previousPos.x, previousPos.y);
        if (previousTile && previousTile.events && previousTile.events.onExit) {
            this.tileMapSystem.executeEvent(previousTile.events.onExit, previousTile);
        }

        // Update visual position
        if (this.enableAnimations) {
            this.animateMovement(previousPos, targetPos, () => {
                this.completeMovement(previousPos, targetPos, direction);
            });
        } else {
            this.tileMapSystem.setPlayerPosition(targetPos.x, targetPos.y);
            this.completeMovement(previousPos, targetPos, direction);
        }
    }

    /**
     * Animate player movement between positions
     * @param {Object} fromPos - Starting position {x, y}
     * @param {Object} toPos - Target position {x, y}
     * @param {Function} onComplete - Callback when animation completes
     */
    animateMovement(fromPos, toPos, onComplete) {
        const playerIndicator = this.tileMapSystem.container.querySelector('.player-indicator');
        if (!playerIndicator) {
            // No visual indicator, just complete immediately
            onComplete();
            return;
        }

        const gridSize = this.tileMapSystem.gridSize;
        const startX = fromPos.x * gridSize + gridSize / 4;
        const startY = fromPos.y * gridSize + gridSize / 4;
        const endX = toPos.x * gridSize + gridSize / 4;
        const endY = toPos.y * gridSize + gridSize / 4;

        // Cancel any existing animation
        if (this.currentAnimationFrame) {
            cancelAnimationFrame(this.currentAnimationFrame);
        }

        // Animate using requestAnimationFrame for smoother movement
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.movementSpeed, 1);
            
            // Easing function for smoother movement
            const easeProgress = this.easeInOutQuad(progress);
            
            const currentX = startX + (endX - startX) * easeProgress;
            const currentY = startY + (endY - startY) * easeProgress;
            
            playerIndicator.style.left = `${currentX}px`;
            playerIndicator.style.top = `${currentY}px`;
            
            if (progress < 1) {
                this.currentAnimationFrame = requestAnimationFrame(animate);
            } else {
                this.currentAnimationFrame = null;
                onComplete();
            }
        };
        
        this.currentAnimationFrame = requestAnimationFrame(animate);
    }

    /**
     * Easing function for smooth animation
     * @param {number} t - Progress (0-1)
     * @returns {number} Eased progress
     */
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /**
     * Complete movement and trigger callbacks
     * @param {Object} previousPos - Previous position {x, y}
     * @param {Object} newPos - New position {x, y}
     * @param {string} direction - Movement direction
     */
    completeMovement(previousPos, newPos, direction) {
        this.isMoving = false;

        // Handle tile entry events
        this.tileMapSystem.handleTileEntry(newPos.x, newPos.y, direction);

        // Trigger position change callback
        if (this.onPositionChange) {
            this.onPositionChange(newPos, previousPos, direction);
        }

        // Check for map transitions
        this.checkMapTransitions();

        // Check if movement key is still held for continuous movement
        for (const [key, dir] of Object.entries(this.movementKeys)) {
            if (this.keyStates.get(key) && dir === direction) {
                this.queuedMovement = direction;
                break;
            }
        }

        // Debug output
        if (this.debugMode) {
            console.log(`Moved ${direction} to (${newPos.x}, ${newPos.y})`);
        }
    }

    /**
     * Handle blocked movement
     * @param {string} direction - Attempted movement direction
     * @param {Object} targetPos - Target position that was blocked
     */
    handleBlockedMovement(direction, targetPos) {
        if (this.debugMode) {
            console.log(`Movement blocked: ${direction} to (${targetPos.x}, ${targetPos.y})`);
        }

        // Trigger blocked movement callback
        if (this.onMovementBlocked) {
            this.onMovementBlocked(direction, targetPos);
        }

        // Visual feedback for blocked movement
        this.showBlockedMovementFeedback(direction);
    }

    /**
     * Show visual feedback for blocked movement
     * @param {string} direction - Blocked direction
     */
    showBlockedMovementFeedback(direction) {
        const playerIndicator = this.tileMapSystem.container.querySelector('.player-indicator');
        if (!playerIndicator) return;

        // Add blocked movement class for visual feedback
        playerIndicator.classList.add('movement-blocked');
        
        // Small shake animation in blocked direction
        const gridSize = this.tileMapSystem.gridSize;
        const shakeDistance = 5;
        const originalLeft = parseFloat(playerIndicator.style.left);
        const originalTop = parseFloat(playerIndicator.style.top);
        
        let offsetX = 0, offsetY = 0;
        switch (direction) {
            case 'north': offsetY = -shakeDistance; break;
            case 'south': offsetY = shakeDistance; break;
            case 'east': offsetX = shakeDistance; break;
            case 'west': offsetX = -shakeDistance; break;
        }
        
        // Animate shake
        playerIndicator.style.transition = 'all 0.1s ease-out';
        playerIndicator.style.left = `${originalLeft + offsetX}px`;
        playerIndicator.style.top = `${originalTop + offsetY}px`;
        
        setTimeout(() => {
            playerIndicator.style.left = `${originalLeft}px`;
            playerIndicator.style.top = `${originalTop}px`;
            
            setTimeout(() => {
                playerIndicator.style.transition = '';
                playerIndicator.classList.remove('movement-blocked');
            }, 100);
        }, 100);
    }

    /**
     * Handle interaction with current tile
     */
    handleInteraction() {
        if (this.isMoving || this.isDestroyed) return;

        const { x, y } = this.playerPosition;
        
        // Check for interactive tiles in all adjacent positions
        const positions = [
            { x, y }, // Current position
            { x, y: y - 1 }, // North
            { x: x + 1, y }, // East
            { x, y: y + 1 }, // South
            { x: x - 1, y } // West
        ];
        
        let interacted = false;
        for (const pos of positions) {
            if (this.isWithinMapBounds(pos)) {
                const tile = this.tileMapSystem.getTileAt(pos.x, pos.y);
                if (tile && tile.events && tile.events.onInteract) {
                    // Handle tile interaction
                    this.tileMapSystem.handleTileInteraction(pos.x, pos.y);
                    interacted = true;
                    break;
                }
            }
        }

        // Trigger interaction callback
        if (this.onInteraction) {
            this.onInteraction(x, y, interacted);
        }

        if (this.debugMode) {
            console.log(`Interaction at (${x}, ${y}) - ${interacted ? 'Success' : 'No interactive tile found'}`);
        }
    }

    /**
     * Check for map transitions based on current position
     */
    checkMapTransitions() {
        const mapData = this.tileMapSystem.currentMapData;
        if (!mapData || !mapData.portals) return;

        const currentTile = this.tileMapSystem.getTileAt(this.playerPosition.x, this.playerPosition.y);
        if (!currentTile) return;

        // Check if current tile triggers a portal
        for (const portal of mapData.portals) {
            if (portal.triggerTileId === currentTile.id) {
                // Check portal conditions
                if (this.checkPortalConditions(portal)) {
                    this.executeMapTransition(portal);
                    break;
                }
            }
        }
    }

    /**
     * Check if portal conditions are met
     * @param {Object} portal - Portal data
     * @returns {boolean} True if conditions are met
     */
    checkPortalConditions(portal) {
        if (!portal.conditions || portal.conditions.length === 0) {
            return true;
        }

        for (const condition of portal.conditions) {
            if (!this.tileMapSystem.evaluateCondition(condition)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Execute map transition
     * @param {Object} portal - Portal data
     */
    async executeMapTransition(portal) {
        if (this.debugMode) {
            console.log(`Transitioning to map: ${portal.targetMap}`);
        }

        // Disable input during transition
        this.setInputEnabled(false);

        // Trigger transition callback
        if (this.onMapTransition) {
            this.onMapTransition(portal);
        }

        try {
            // Load the new map
            const success = await this.tileMapSystem.loadMap(portal.targetMap, portal.targetPosition);
            
            if (success) {
                // Update player position
                if (portal.targetPosition) {
                    this.setPosition(portal.targetPosition.x, portal.targetPosition.y, true);
                }
            } else {
                console.error(`Failed to load map: ${portal.targetMap}`);
            }
        } catch (error) {
            console.error(`Error during map transition:`, error);
        } finally {
            // Re-enable input
            this.setInputEnabled(true);
        }
    }

    /**
     * Set player position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     * @param {boolean} updateVisual - Whether to update visual position
     */
    setPosition(x, y, updateVisual = true) {
        const previousPos = { ...this.playerPosition };
        this.playerPosition = { x, y };
        
        if (updateVisual) {
            this.tileMapSystem.setPlayerPosition(x, y);
        }

        // Trigger position change callback
        if (this.onPositionChange) {
            this.onPositionChange({ x, y }, previousPos, null);
        }
    }

    /**
     * Get current player position
     * @returns {Object} Current position {x, y}
     */
    getPosition() {
        return { ...this.playerPosition };
    }

    /**
     * Enable or disable input handling
     * @param {boolean} enabled - Whether input should be enabled
     */
    setInputEnabled(enabled) {
        this.inputEnabled = enabled;
        
        // Clear key states when disabling
        if (!enabled) {
            this.keyStates.clear();
            this.queuedMovement = null;
        }
        
        if (this.debugMode) {
            console.log('Input', enabled ? 'enabled' : 'disabled');
        }
    }

    /**
     * Check if player is currently moving
     * @returns {boolean} True if moving
     */
    isPlayerMoving() {
        return this.isMoving;
    }

    /**
     * Force stop current movement
     */
    stopMovement() {
        this.isMoving = false;
        this.queuedMovement = null;
        
        // Cancel animation
        if (this.currentAnimationFrame) {
            cancelAnimationFrame(this.currentAnimationFrame);
            this.currentAnimationFrame = null;
        }
        
        // Remove any transition animations
        const playerIndicator = this.tileMapSystem.container.querySelector('.player-indicator');
        if (playerIndicator) {
            playerIndicator.style.transition = '';
        }
    }

    /**
     * Show current position information (debug)
     */
    showPositionInfo() {
        const { x, y } = this.playerPosition;
        const currentTile = this.tileMapSystem.getTileAt(x, y);
        
        console.group('Position Info');
        console.log(`Position: (${x}, ${y})`);
        console.log('Current Tile:', currentTile);
        console.log('Map:', this.tileMapSystem.currentMap);
        console.log('Valid Directions:', this.getValidDirections());
        console.log('Key States:', Array.from(this.keyStates.entries()));
        console.groupEnd();
    }

    /**
     * Get movement direction from two positions
     * @param {Object} fromPos - Starting position {x, y}
     * @param {Object} toPos - Target position {x, y}
     * @returns {string|null} Direction or null if not adjacent
     */
    getMovementDirection(fromPos, toPos) {
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;

        if (Math.abs(dx) + Math.abs(dy) !== 1) {
            return null; // Not adjacent
        }

        if (dx === 1) return 'east';
        if (dx === -1) return 'west';
        if (dy === 1) return 'south';
        if (dy === -1) return 'north';

        return null;
    }

    /**
     * Teleport player to specific position (no movement validation)
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     */
    teleport(x, y) {
        const previousPos = { ...this.playerPosition };
        this.playerPosition = { x, y };
        
        // Stop any ongoing movement
        this.stopMovement();
        
        // Update visual position immediately
        this.tileMapSystem.setPlayerPosition(x, y);
        
        // Handle tile entry
        this.tileMapSystem.handleTileEntry(x, y, null);
        
        // Trigger callbacks
        if (this.onPositionChange) {
            this.onPositionChange({ x, y }, previousPos, 'teleport');
        }

        if (this.debugMode) {
            console.log(`Teleported to (${x}, ${y})`);
        }
    }

    /**
     * Get valid movement directions from current position
     * @returns {Array} Array of valid direction strings
     */
    getValidDirections() {
        const validDirections = [];
        const currentPos = this.playerPosition;

        for (const direction of ['north', 'south', 'east', 'west']) {
            const targetPos = this.calculateTargetPosition(currentPos, direction);
            if (this.isValidMovement(currentPos, targetPos, direction)) {
                validDirections.push(direction);
            }
        }

        return validDirections;
    }

    /**
     * Set debug mode
     * @param {boolean} enabled - Whether to enable debug mode
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
        this.tileMapSystem.setDebugMode(enabled);
    }

    /**
     * Destroy the navigation system
     */
    destroy() {
        this.isDestroyed = true;
        
        // Stop movement processing
        if (this.processQueueInterval) {
            clearInterval(this.processQueueInterval);
            this.processQueueInterval = null;
        }
        
        // Cancel any ongoing animations
        if (this.currentAnimationFrame) {
            cancelAnimationFrame(this.currentAnimationFrame);
            this.currentAnimationFrame = null;
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.boundHandleKeyDown);
        document.removeEventListener('keyup', this.boundHandleKeyUp);
        document.removeEventListener('keydown', this.boundHandleKeyPress);
        document.removeEventListener('click', this.boundHandleFocus);
        
        // Reset state
        this.keyStates.clear();
        this.isMoving = false;
        this.inputEnabled = false;
        this.queuedMovement = null;
        
        console.log('TileNavigationSystem destroyed');
    }
}

// Export for use in other modules
window.TileNavigationSystem = TileNavigationSystem;
