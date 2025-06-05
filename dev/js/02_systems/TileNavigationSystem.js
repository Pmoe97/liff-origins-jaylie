/**
 * NodeNavigationSystem.js - Node Network Version
 * 
 * Handles player navigation within the node-based map system.
 * Manages WASD movement controls, position tracking, movement validation,
 * interaction handling, and map transitions between connected nodes.
 * 
 * Features:
 * - Node-to-node movement based on connections
 * - Visual movement indicators and animations
 * - Connection-based validation instead of grid neighbors
 * - Support for different connection types
 * - Click/tap navigation support
 */

class NodeNavigationSystem {
    /**
     * Initialize the NodeNavigationSystem
     * @param {NodeMapSystem} nodeMapSystem - Reference to the node map system
     * @param {Object} options - Configuration options
     */
    constructor(nodeMapSystem, options = {}) {
        if (!nodeMapSystem) {
            throw new Error('NodeNavigationSystem requires a NodeMapSystem instance');
        }
        
        this.nodeMapSystem = nodeMapSystem;
        this.currentNodeId = null;
        this.isMoving = false;
        this.movementSpeed = options.movementSpeed || 300; // Animation duration in ms
        this.enableAnimations = options.enableAnimations !== false;
        this.debugMode = options.debugMode || false;
        
        // Input handling
        this.keyStates = new Map();
        this.inputEnabled = true;
        this.movementCooldown = options.movementCooldown || 200; // Minimum time between moves
        this.lastMoveTime = 0;
        this.queuedMovement = null;
        
        // Key mappings for directional movement
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
        this.boundHandleNodeClick = this.handleNodeClick.bind(this);
        
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
        console.log('NodeNavigationSystem initialized');
    }

    /**
     * Set up keyboard and mouse event listeners
     */
    setupEventListeners() {
        // Keyboard event listeners
        document.addEventListener('keydown', this.boundHandleKeyDown, { passive: false });
        document.addEventListener('keyup', this.boundHandleKeyUp, { passive: false });
        
        // Prevent default behavior for movement keys
        document.addEventListener('keydown', this.boundHandleKeyPress, { passive: false });

        // Focus management to ensure key events are captured
        document.addEventListener('click', this.boundHandleFocus);
        
        // Node click handlers for mouse/touch navigation
        this.setupNodeClickHandlers();
        
        // Initial focus
        this.handleFocus();
    }

    /**
     * Set up click handlers for nodes
     */
    setupNodeClickHandlers() {
        // Use event delegation for better performance
        if (this.nodeMapSystem.container) {
            this.nodeMapSystem.container.addEventListener('click', this.boundHandleNodeClick);
        }
    }

    /**
     * Handle node click events
     * @param {Event} event - Click event
     */
    handleNodeClick(event) {
        if (!this.inputEnabled || this.isMoving || this.isDestroyed) return;

        const nodeElement = event.target.closest('.node');
        if (!nodeElement) return;

        const targetNodeId = nodeElement.dataset.nodeId;
        if (!targetNodeId || targetNodeId === this.currentNodeId) return;

        // Check if the clicked node is connected to current node
        if (this.isValidMovement(this.currentNodeId, targetNodeId)) {
            this.moveToNode(targetNodeId);
        } else {
            this.handleBlockedMovement('click', targetNodeId);
        }
    }

    /**
     * Handle focus management
     */
    handleFocus() {
        if (this.inputEnabled && this.nodeMapSystem.container) {
            this.nodeMapSystem.container.focus();
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
            case 'KeyI':
                // Show current position info
                this.showPositionInfo();
                break;
            case 'KeyR':
                // Refresh dynamic nodes
                this.nodeMapSystem.updateDynamicNodes();
                console.log('Dynamic nodes refreshed');
                break;
            case 'KeyC':
                // Show connections from current node
                this.showConnectionInfo();
                break;
        }
    }

    /**
     * Attempt to move the player in a specific direction
     * @param {string} direction - Movement direction (north, south, east, west)
     */
    attemptMovement(direction) {
        if (this.isMoving || !this.inputEnabled || this.isDestroyed || !this.currentNodeId) return;

        // Find the best connected node in the given direction
        const targetNodeId = this.findNodeInDirection(direction);
        
        if (!targetNodeId) {
            this.handleBlockedMovement(direction, null);
            return;
        }

        // Execute the movement
        this.moveToNode(targetNodeId);
        this.lastMoveTime = Date.now();
    }

    /**
     * Find the best connected node in a given direction
     * @param {string} direction - Movement direction
     * @returns {string|null} Target node ID or null if none found
     */
    findNodeInDirection(direction) {
        if (!this.currentNodeId) return null;

        const currentNode = this.nodeMapSystem.getNodeById(this.currentNodeId);
        if (!currentNode) return null;

        const connectedNodeIds = this.nodeMapSystem.getConnectedNodes(this.currentNodeId);
        if (connectedNodeIds.length === 0) return null;

        // Get current node position
        const currentPos = currentNode.position;
        let bestNode = null;
        let bestScore = -Infinity;

        // Find the node that best matches the direction
        for (const nodeId of connectedNodeIds) {
            const node = this.nodeMapSystem.getNodeById(nodeId);
            if (!node) continue;

            const nodePos = node.position;
            const dx = nodePos.x - currentPos.x;
            const dy = nodePos.y - currentPos.y;

            // Calculate direction score based on movement direction
            let score = 0;
            switch (direction) {
                case 'north':
                    score = -dy + Math.abs(dx) * -0.5; // Prefer upward movement, penalize horizontal
                    break;
                case 'south':
                    score = dy + Math.abs(dx) * -0.5; // Prefer downward movement
                    break;
                case 'east':
                    score = dx + Math.abs(dy) * -0.5; // Prefer rightward movement
                    break;
                case 'west':
                    score = -dx + Math.abs(dy) * -0.5; // Prefer leftward movement
                    break;
            }

            if (score > bestScore) {
                bestScore = score;
                bestNode = nodeId;
            }
        }

        // Only return a node if it's actually in the right direction
        return bestScore > 0 ? bestNode : null;
    }

    /**
     * Move to a specific node
     * @param {string} targetNodeId - Target node ID
     */
    moveToNode(targetNodeId) {
        if (this.isMoving || !this.inputEnabled || this.isDestroyed) return;

        // Validate movement
        if (!this.isValidMovement(this.currentNodeId, targetNodeId)) {
            this.handleBlockedMovement('direct', targetNodeId);
            return;
        }

        this.isMoving = true;
        const previousNodeId = this.currentNodeId;

        // Handle node exit events from previous node
        if (previousNodeId) {
            this.nodeMapSystem.handleNodeEntry(targetNodeId);
        }

        // Update current node
        this.currentNodeId = targetNodeId;

        // Update visual position
        if (this.enableAnimations) {
            this.animateMovement(previousNodeId, targetNodeId, () => {
                this.completeMovement(previousNodeId, targetNodeId);
            });
        } else {
            this.nodeMapSystem.setPlayerPosition(targetNodeId);
            this.completeMovement(previousNodeId, targetNodeId);
        }
    }

    /**
     * Check if movement is valid from one node to another
     * @param {string} fromNodeId - Starting node ID
     * @param {string} toNodeId - Target node ID
     * @returns {boolean} True if movement is valid
     */
    isValidMovement(fromNodeId, toNodeId) {
        return this.nodeMapSystem.isValidMovement(fromNodeId, toNodeId);
    }

    /**
     * Animate player movement between nodes
     * @param {string} fromNodeId - Starting node ID
     * @param {string} toNodeId - Target node ID
     * @param {Function} onComplete - Callback when animation completes
     */
    animateMovement(fromNodeId, toNodeId, onComplete) {
        const playerIndicator = this.nodeMapSystem.container.querySelector('.player-indicator');
        if (!playerIndicator) {
            // No visual indicator, just complete immediately
            onComplete();
            return;
        }

        const fromNode = this.nodeMapSystem.getNodeById(fromNodeId);
        const toNode = this.nodeMapSystem.getNodeById(toNodeId);
        
        if (!fromNode || !toNode) {
            onComplete();
            return;
        }

        const startX = fromNode.position.x - 10;
        const startY = fromNode.position.y - 10;
        const endX = toNode.position.x - 10;
        const endY = toNode.position.y - 10;

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
     * @param {string} previousNodeId - Previous node ID
     * @param {string} newNodeId - New node ID
     */
    completeMovement(previousNodeId, newNodeId) {
        this.isMoving = false;

        // Handle node entry events
        this.nodeMapSystem.handleNodeEntry(newNodeId);

        // Trigger position change callback
        if (this.onPositionChange) {
            this.onPositionChange(newNodeId, previousNodeId);
        }

        // Check for map transitions
        this.checkMapTransitions();

        // Debug output
        if (this.debugMode) {
            console.log(`Moved from ${previousNodeId} to ${newNodeId}`);
        }
    }

    /**
     * Handle blocked movement
     * @param {string} direction - Attempted movement direction or type
     * @param {string} targetNodeId - Target node that was blocked
     */
    handleBlockedMovement(direction, targetNodeId) {
        if (this.debugMode) {
            console.log(`Movement blocked: ${direction} to ${targetNodeId}`);
        }

        // Trigger blocked movement callback
        if (this.onMovementBlocked) {
            this.onMovementBlocked(direction, targetNodeId);
        }

        // Visual feedback for blocked movement
        this.showBlockedMovementFeedback(direction);
    }

    /**
     * Show visual feedback for blocked movement
     * @param {string} direction - Blocked direction
     */
    showBlockedMovementFeedback(direction) {
        const playerIndicator = this.nodeMapSystem.container.querySelector('.player-indicator');
        if (!playerIndicator) return;

        // Add blocked movement class for visual feedback
        playerIndicator.classList.add('movement-blocked');
        
        // Small shake animation
        const originalTransform = playerIndicator.style.transform || '';
        
        // Animate shake
        playerIndicator.style.transition = 'transform 0.1s ease-out';
        playerIndicator.style.transform = `${originalTransform} translateX(-3px)`;
        
        setTimeout(() => {
            playerIndicator.style.transform = `${originalTransform} translateX(3px)`;
            
            setTimeout(() => {
                playerIndicator.style.transform = originalTransform;
                
                setTimeout(() => {
                    playerIndicator.style.transition = '';
                    playerIndicator.classList.remove('movement-blocked');
                }, 100);
            }, 50);
        }, 50);
    }

    /**
     * Handle interaction with current node
     */
    handleInteraction() {
        if (this.isMoving || this.isDestroyed || !this.currentNodeId) return;

        // Handle current node interaction
        this.nodeMapSystem.handleNodeInteraction(this.currentNodeId);

        // Trigger interaction callback
        if (this.onInteraction) {
            this.onInteraction(this.currentNodeId, true);
        }

        if (this.debugMode) {
            console.log(`Interaction at node: ${this.currentNodeId}`);
        }
    }

    /**
     * Check for map transitions based on current node
     */
    checkMapTransitions() {
        const mapData = this.nodeMapSystem.currentMapData;
        if (!mapData || !mapData.portals) return;

        const currentNode = this.nodeMapSystem.getNodeById(this.currentNodeId);
        if (!currentNode) return;

        // Check if current node triggers a portal
        for (const portal of mapData.portals) {
            if (portal.triggerNodeId === currentNode.id) {
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
            if (!this.nodeMapSystem.evaluateCondition(condition)) {
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
            const success = await this.nodeMapSystem.loadMap(portal.targetMap, { nodeId: portal.targetNodeId });
            
            if (success) {
                // Update player position
                if (portal.targetNodeId) {
                    this.setPosition(portal.targetNodeId, true);
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
     * @param {string} nodeId - Node ID
     * @param {boolean} updateVisual - Whether to update visual position
     */
    setPosition(nodeId, updateVisual = true) {
        const previousNodeId = this.currentNodeId;
        this.currentNodeId = nodeId;
        
        if (updateVisual) {
            this.nodeMapSystem.setPlayerPosition(nodeId);
        }

        // Trigger position change callback
        if (this.onPositionChange) {
            this.onPositionChange(nodeId, previousNodeId);
        }
    }

    /**
     * Get current player position
     * @returns {string} Current node ID
     */
    getPosition() {
        return this.currentNodeId;
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
        const playerIndicator = this.nodeMapSystem.container.querySelector('.player-indicator');
        if (playerIndicator) {
            playerIndicator.style.transition = '';
        }
    }

    /**
     * Show current position information (debug)
     */
    showPositionInfo() {
        const currentNode = this.nodeMapSystem.getNodeById(this.currentNodeId);
        const connectedNodes = this.nodeMapSystem.getConnectedNodes(this.currentNodeId);
        
        console.group('Position Info');
        console.log(`Current Node: ${this.currentNodeId}`);
        console.log('Node Data:', currentNode);
        console.log('Connected Nodes:', connectedNodes);
        console.log('Map:', this.nodeMapSystem.currentMap);
        console.log('Key States:', Array.from(this.keyStates.entries()));
        console.groupEnd();
    }

    /**
     * Show connection information (debug)
     */
    showConnectionInfo() {
        if (!this.currentNodeId) {
            console.log('No current node');
            return;
        }

        const currentNode = this.nodeMapSystem.getNodeById(this.currentNodeId);
        const connectedNodes = this.nodeMapSystem.getConnectedNodes(this.currentNodeId);
        
        console.group('Connection Info');
        console.log(`Current Node: ${this.currentNodeId}`);
        console.log('Connections:', currentNode?.connections || {});
        console.log('Valid Connected Nodes:', connectedNodes);
        console.groupEnd();
    }

    /**
     * Teleport player to specific node (no movement validation)
     * @param {string} nodeId - Node ID
     */
    teleport(nodeId) {
        const previousNodeId = this.currentNodeId;
        this.currentNodeId = nodeId;
        
        // Stop any ongoing movement
        this.stopMovement();
        
        // Update visual position immediately
        this.nodeMapSystem.setPlayerPosition(nodeId);
        
        // Handle node entry
        this.nodeMapSystem.handleNodeEntry(nodeId);
        
        // Trigger callbacks
        if (this.onPositionChange) {
            this.onPositionChange(nodeId, previousNodeId);
        }

        if (this.debugMode) {
            console.log(`Teleported to node: ${nodeId}`);
        }
    }

    /**
     * Get valid movement directions from current node
     * @returns {Array} Array of valid direction strings
     */
    getValidDirections() {
        const validDirections = [];
        
        for (const direction of ['north', 'south', 'east', 'west']) {
            const targetNodeId = this.findNodeInDirection(direction);
            if (targetNodeId) {
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
        
        if (this.nodeMapSystem.container) {
            this.nodeMapSystem.container.removeEventListener('click', this.boundHandleNodeClick);
        }
        
        // Reset state
        this.keyStates.clear();
        this.isMoving = false;
        this.inputEnabled = false;
        this.queuedMovement = null;
        this.currentNodeId = null;
        
        console.log('NodeNavigationSystem destroyed');
    }
}

// Export for use in other modules
window.NodeNavigationSystem = NodeNavigationSystem;
// Maintain backward compatibility
window.TileNavigationSystem = NodeNavigationSystem;
