/**
 * NodeMapSystem.js - Node Network Version
 * 
 * A node-based navigation system for Twine/SugarCube games.
 * Transforms the previous grid-based tile system into a clean node network
 * with spaced nodes connected by visible paths, similar to a metro map layout.
 * 
 * Features:
 * - Spaced nodes instead of touching grid tiles
 * - Visual connection lines between nodes
 * - Support for different connection types (normal, one-way, secret)
 * - Dynamic node conditions and states
 * - Clean, scalable architecture
 */

class NodeMapSystem {
    /**
     * Initialize the NodeMapSystem
     * @param {string} containerId - DOM element ID where the map will be rendered
     * @param {Object} options - Configuration options
     */
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = null;
        this.currentMap = null;
        this.currentMapData = null;
        this.nodes = new Map(); // Map of node ID to node data
        this.nodeElements = new Map(); // Map of node ID to DOM elements
        this.connectionElements = new Map(); // Map of connection ID to DOM elements
        
        // Node layout settings
        this.nodeSize = options.nodeSize || 60; // Size of each node in pixels
        this.nodeSpacing = options.nodeSpacing || 120; // Space between nodes
        this.connectionWidth = options.connectionWidth || 3; // Width of connection lines
        this.showGrid = options.showGrid || false;
        this.enableAnimations = options.enableAnimations !== false;
        
        // Visual settings
        this.nodeColors = {
            default: '#4a90e2',
            locked: '#95a5a6',
            special: '#e74c3c',
            shop: '#f39c12',
            exit: '#27ae60'
        };
        
        this.connectionColors = {
            normal: '#ffffff',
            secret: '#9b59b6',
            locked: '#95a5a6',
            oneway: '#e67e22'
        };
        
        // Event callbacks
        this.onMapLoaded = options.onMapLoaded || null;
        this.onNodeEnter = options.onNodeEnter || null;
        this.onNodeExit = options.onNodeExit || null;
        this.onNodeInteract = options.onNodeInteract || null;
        
        // Internal state
        this.isDestroyed = false;
        this.loadingPromise = null;
        
        // Initialize the system
        this.initialize();
    }

    /**
     * Initialize the node map system
     */
    initialize() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`NodeMapSystem: Container element '${this.containerId}' not found`);
            return;
        }

        // Set up the container
        this.container.classList.add('node-map-container');
        this.container.innerHTML = '';
        this.container.setAttribute('tabindex', '0'); // For keyboard focus

        // Create the map container
        this.mapContainer = document.createElement('div');
        this.mapContainer.classList.add('node-map');
        this.container.appendChild(this.mapContainer);

        // Create SVG for connections
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.classList.add('connection-layer');
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.style.pointerEvents = 'none';
        this.svg.style.zIndex = '1';
        this.mapContainer.appendChild(this.svg);

        // Create nodes container
        this.nodesContainer = document.createElement('div');
        this.nodesContainer.classList.add('nodes-container');
        this.nodesContainer.style.position = 'relative';
        this.nodesContainer.style.zIndex = '2';
        this.mapContainer.appendChild(this.nodesContainer);

        console.log('NodeMapSystem initialized');
    }

    /**
     * Load a map from JSON data
     * @param {string} mapId - The map identifier
     * @param {Object} playerPosition - Optional starting position {nodeId}
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
            console.log(`Loading node map: ${mapId}`);
            
            // Add loading state
            this.container.classList.add('loading');
            
            // Load map data from JSON file
            const mapData = await this.loadMapData(mapId);
            if (!mapData) {
                console.error(`Failed to load map data for: ${mapId}`);
                return false;
            }

            // Convert legacy tile data to node data if needed
            const nodeData = this.convertToNodeData(mapData);

            // Validate node data
            if (!this.validateNodeData(nodeData)) {
                console.error(`Invalid node data for: ${mapId}`);
                return false;
            }

            this.currentMap = mapId;
            this.currentMapData = nodeData;
            
            // Clear existing map
            this.clearMap();
            
            // Process and store node data
            this.processNodeData(nodeData.nodes);
            
            // Render the map
            await this.renderMap();
            
            // Set up player position
            if (playerPosition && playerPosition.nodeId) {
                this.setPlayerPosition(playerPosition.nodeId);
            } else if (nodeData.defaultPlayerNode) {
                this.setPlayerPosition(nodeData.defaultPlayerNode);
            }

            // Remove loading state
            this.container.classList.remove('loading');

            // Trigger map loaded callback
            if (this.onMapLoaded) {
                this.onMapLoaded(mapId, nodeData);
            }

            console.log(`Node map '${mapId}' loaded successfully`);
            return true;

        } catch (error) {
            console.error(`Error loading node map '${mapId}':`, error);
            this.container.classList.remove('loading');
            return false;
        }
    }

    /**
     * Convert legacy tile-based map data to node-based data
     * @param {Object} mapData - Legacy map data
     * @returns {Object} Node-based map data
     */
    convertToNodeData(mapData) {
        // If already in node format, return as-is
        if (mapData.nodes) {
            return mapData;
        }

        // Convert from legacy tile format
        const nodeData = {
            mapId: mapData.mapId,
            name: mapData.name,
            description: mapData.description,
            version: mapData.version,
            defaultPlayerNode: null,
            nodes: [],
            metadata: mapData.metadata || {}
        };

        // Convert significant tiles to nodes
        const significantTiles = mapData.tiles.filter(tile => 
            tile.events || 
            tile.metadata?.landmark || 
            tile.metadata?.shopId || 
            tile.metadata?.portal ||
            tile.id.includes('entrance') ||
            tile.id.includes('exit') ||
            tile.id.includes('vendor') ||
            tile.id.includes('center')
        );

        // Create nodes from significant tiles
        significantTiles.forEach((tile, index) => {
            const node = {
                id: tile.id,
                name: tile.metadata?.description || tile.id.replace(/_/g, ' '),
                position: this.calculateNodePosition(tile.position, index, significantTiles.length),
                type: this.determineNodeType(tile),
                walkable: tile.walkable !== false,
                connections: {},
                events: tile.events || {},
                metadata: tile.metadata || {},
                conditions: tile.dynamicConditions || []
            };

            nodeData.nodes.push(node);
        });

        // Set default player node
        if (mapData.defaultPlayerPosition) {
            const startTile = mapData.tiles.find(tile => 
                tile.position.x === mapData.defaultPlayerPosition.x && 
                tile.position.y === mapData.defaultPlayerPosition.y
            );
            if (startTile) {
                nodeData.defaultPlayerNode = startTile.id;
            } else {
                // Find closest significant tile
                const closestNode = this.findClosestNode(mapData.defaultPlayerPosition, nodeData.nodes);
                nodeData.defaultPlayerNode = closestNode?.id || nodeData.nodes[0]?.id;
            }
        } else {
            nodeData.defaultPlayerNode = nodeData.nodes[0]?.id;
        }

        // Generate connections between nodes
        this.generateNodeConnections(nodeData.nodes, mapData);

        return nodeData;
    }

    /**
     * Calculate visual position for a node
     * @param {Object} originalPos - Original tile position
     * @param {number} index - Node index
     * @param {number} total - Total number of nodes
     * @returns {Object} Visual position {x, y}
     */
    calculateNodePosition(originalPos, index, total) {
        // Use original position if available, otherwise create strict grid
        if (originalPos && typeof originalPos.x === 'number' && typeof originalPos.y === 'number') {
            // Convert original coordinates to grid-aligned positions
            return {
                x: originalPos.x * this.nodeSpacing + this.nodeSpacing,
                y: originalPos.y * this.nodeSpacing + this.nodeSpacing
            };
        }
        
        // Fallback: create strict grid layout
        const cols = Math.ceil(Math.sqrt(total));
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        return {
            x: col * this.nodeSpacing + this.nodeSpacing,
            y: row * this.nodeSpacing + this.nodeSpacing
        };
    }

    /**
     * Determine node type based on tile data
     * @param {Object} tile - Tile data
     * @returns {string} Node type
     */
    determineNodeType(tile) {
        if (tile.metadata?.shopId) return 'shop';
        if (tile.metadata?.portal) return 'exit';
        if (tile.metadata?.landmark) return 'special';
        if (!tile.walkable) return 'locked';
        return 'default';
    }

    /**
     * Find the closest node to a position
     * @param {Object} position - Target position {x, y}
     * @param {Array} nodes - Array of nodes
     * @returns {Object|null} Closest node
     */
    findClosestNode(position, nodes) {
        let closest = null;
        let minDistance = Infinity;

        for (const node of nodes) {
            const distance = Math.sqrt(
                Math.pow(position.x - node.position.x, 2) + 
                Math.pow(position.y - node.position.y, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closest = node;
            }
        }

        return closest;
    }

    /**
     * Generate connections between nodes
     * @param {Array} nodes - Array of nodes
     * @param {Object} originalMapData - Original map data for reference
     */
    generateNodeConnections(nodes, originalMapData) {
        // Create connections based on logical relationships
        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];
            
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeB = nodes[j];
                
                // Determine if nodes should be connected
                if (this.shouldNodesConnect(nodeA, nodeB, originalMapData)) {
                    const connectionType = this.determineConnectionType(nodeA, nodeB);
                    
                    // Add bidirectional connection by default
                    nodeA.connections[nodeB.id] = {
                        target: nodeB.id,
                        type: connectionType,
                        bidirectional: true
                    };
                    
                    nodeB.connections[nodeA.id] = {
                        target: nodeA.id,
                        type: connectionType,
                        bidirectional: true
                    };
                }
            }
        }
    }

    /**
     * Determine if two nodes should be connected
     * @param {Object} nodeA - First node
     * @param {Object} nodeB - Second node
     * @param {Object} mapData - Original map data
     * @returns {boolean} True if nodes should connect
     */
    shouldNodesConnect(nodeA, nodeB, mapData) {
        // Connect if nodes are close to each other
        const distance = Math.sqrt(
            Math.pow(nodeA.position.x - nodeB.position.x, 2) + 
            Math.pow(nodeA.position.y - nodeB.position.y, 2)
        );
        
        // Connect nodes that are reasonably close
        return distance < this.nodeSpacing * 2;
    }

    /**
     * Determine connection type between nodes
     * @param {Object} nodeA - First node
     * @param {Object} nodeB - Second node
     * @returns {string} Connection type
     */
    determineConnectionType(nodeA, nodeB) {
        // Special connections for certain node types
        if (nodeA.type === 'shop' || nodeB.type === 'shop') {
            return 'normal';
        }
        if (nodeA.type === 'exit' || nodeB.type === 'exit') {
            return 'normal';
        }
        
        return 'normal';
    }

    /**
     * Validate node data structure
     * @param {Object} nodeData - Node data to validate
     * @returns {boolean} True if valid
     */
    validateNodeData(nodeData) {
        if (!nodeData || typeof nodeData !== 'object') return false;
        if (!Array.isArray(nodeData.nodes)) return false;
        
        // Validate each node
        for (const node of nodeData.nodes) {
            if (!node.id || !node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
                console.error('Invalid node data:', node);
                return false;
            }
        }
        
        return true;
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
     * Process node data and apply dynamic conditions
     * @param {Array} nodesData - Array of node objects
     */
    processNodeData(nodesData) {
        this.nodes.clear();
        
        for (const nodeData of nodesData) {
            // Clone the node data to avoid modifying the original
            const node = JSON.parse(JSON.stringify(nodeData));
            
            // Apply dynamic conditions
            this.applyDynamicConditions(node);
            
            // Store the processed node
            this.nodes.set(node.id, node);
        }
    }

    /**
     * Apply dynamic conditions to a node based on game state
     * @param {Object} node - Node object to modify
     */
    applyDynamicConditions(node) {
        if (!node.conditions || node.conditions.length === 0) {
            return;
        }

        for (const condition of node.conditions) {
            if (this.evaluateCondition(condition.condition)) {
                // Apply the conditional changes
                if (condition.walkable !== undefined) node.walkable = condition.walkable;
                if (condition.type !== undefined) node.type = condition.type;
                if (condition.events) node.events = { ...node.events, ...condition.events };
                if (condition.connections) node.connections = { ...node.connections, ...condition.connections };
                
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
        // Clear DOM
        this.svg.innerHTML = '';
        this.nodesContainer.innerHTML = '';
        
        // Clear data structures
        this.nodeElements.clear();
        this.connectionElements.clear();
        this.nodes.clear();
    }

    /**
     * Render the entire map
     */
    async renderMap() {
        if (!this.currentMapData) {
            console.error('No map data to render');
            return;
        }

        // Calculate map bounds
        const bounds = this.calculateMapBounds();
        
        // Set up container dimensions
        this.mapContainer.style.width = `${bounds.width}px`;
        this.mapContainer.style.height = `${bounds.height}px`;
        this.svg.setAttribute('width', bounds.width);
        this.svg.setAttribute('height', bounds.height);

        // Render connections first (so they appear behind nodes)
        this.renderConnections();
        
        // Render nodes
        this.renderNodes();
    }

    /**
     * Calculate the bounds of the map
     * @returns {Object} Bounds {width, height, minX, minY, maxX, maxY}
     */
    calculateMapBounds() {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        for (const node of this.nodes.values()) {
            minX = Math.min(minX, node.position.x);
            minY = Math.min(minY, node.position.y);
            maxX = Math.max(maxX, node.position.x);
            maxY = Math.max(maxY, node.position.y);
        }
        
        // Add padding
        const padding = this.nodeSize * 2;
        return {
            width: maxX - minX + padding * 2,
            height: maxY - minY + padding * 2,
            minX: minX - padding,
            minY: minY - padding,
            maxX: maxX + padding,
            maxY: maxY + padding
        };
    }

    /**
     * Render all connections between nodes
     */
    renderConnections() {
        const processedConnections = new Set();
        
        for (const node of this.nodes.values()) {
            for (const [targetId, connection] of Object.entries(node.connections)) {
                const connectionId = [node.id, targetId].sort().join('-');
                
                // Skip if already processed (for bidirectional connections)
                if (processedConnections.has(connectionId)) continue;
                processedConnections.add(connectionId);
                
                const targetNode = this.nodes.get(targetId);
                if (!targetNode) continue;
                
                this.renderConnection(node, targetNode, connection);
            }
        }
    }

    /**
     * Render a connection between two nodes
     * @param {Object} fromNode - Source node
     * @param {Object} toNode - Target node
     * @param {Object} connection - Connection data
     */
    renderConnection(fromNode, toNode, connection) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        line.setAttribute('x1', fromNode.position.x);
        line.setAttribute('y1', fromNode.position.y);
        line.setAttribute('x2', toNode.position.x);
        line.setAttribute('y2', toNode.position.y);
        line.setAttribute('stroke', this.connectionColors[connection.type] || this.connectionColors.normal);
        line.setAttribute('stroke-width', this.connectionWidth);
        line.classList.add('connection', `connection-${connection.type}`);
        
        // Add dashed style for secret connections
        if (connection.type === 'secret') {
            line.setAttribute('stroke-dasharray', '5,5');
        }
        
        // Add arrow for one-way connections
        if (connection.type === 'oneway' && !connection.bidirectional) {
            line.setAttribute('marker-end', 'url(#arrowhead)');
        }
        
        this.svg.appendChild(line);
        
        const connectionId = [fromNode.id, toNode.id].sort().join('-');
        this.connectionElements.set(connectionId, line);
    }

    /**
     * Render all nodes
     */
    renderNodes() {
        for (const node of this.nodes.values()) {
            this.renderNode(node);
        }
    }

    /**
     * Render a single node
     * @param {Object} node - Node data object
     */
    renderNode(node) {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node', `node-${node.type}`);
        nodeElement.id = `node-${node.id}`;
        nodeElement.dataset.nodeId = node.id;

        // Position and size the node
        nodeElement.style.position = 'absolute';
        nodeElement.style.left = `${node.position.x - this.nodeSize / 2}px`;
        nodeElement.style.top = `${node.position.y - this.nodeSize / 2}px`;
        nodeElement.style.width = `${this.nodeSize}px`;
        nodeElement.style.height = `${this.nodeSize}px`;

        // Add node content
        const nodeContent = document.createElement('div');
        nodeContent.classList.add('node-content');
        nodeContent.textContent = node.name || node.id;
        nodeElement.appendChild(nodeContent);

        // Add walkability class
        if (node.walkable) {
            nodeElement.classList.add('walkable');
        } else {
            nodeElement.classList.add('non-walkable');
        }

        // Add interaction capability
        if (node.events && node.events.onInteract) {
            nodeElement.classList.add('interactive');
            nodeElement.setAttribute('aria-label', 'Interactive node - Press E to interact');
            nodeElement.setAttribute('role', 'button');
        }

        // Store the node element
        this.nodeElements.set(node.id, nodeElement);
        this.nodesContainer.appendChild(nodeElement);
    }

    /**
     * Get node by ID
     * @param {string} nodeId - Node identifier
     * @returns {Object|null} Node data or null if not found
     */
    getNodeById(nodeId) {
        return this.nodes.get(nodeId) || null;
    }

    /**
     * Check if movement is valid from one node to another
     * @param {string} fromNodeId - Starting node ID
     * @param {string} toNodeId - Target node ID
     * @returns {boolean} True if movement is valid
     */
    isValidMovement(fromNodeId, toNodeId) {
        const fromNode = this.getNodeById(fromNodeId);
        const toNode = this.getNodeById(toNodeId);

        // Check if target node exists and is walkable
        if (!toNode || !toNode.walkable) {
            return false;
        }

        // Check if there's a connection between the nodes
        if (!fromNode || !fromNode.connections[toNodeId]) {
            return false;
        }

        return true;
    }

    /**
     * Get connected nodes from a given node
     * @param {string} nodeId - Node ID
     * @returns {Array} Array of connected node IDs
     */
    getConnectedNodes(nodeId) {
        const node = this.getNodeById(nodeId);
        if (!node) return [];
        
        return Object.keys(node.connections).filter(targetId => {
            const targetNode = this.getNodeById(targetId);
            return targetNode && targetNode.walkable;
        });
    }

    /**
     * Handle node entry event
     * @param {string} nodeId - Node ID
     */
    handleNodeEntry(nodeId) {
        const node = this.getNodeById(nodeId);
        if (!node) return;

        // Execute onEnter event
        if (node.events && node.events.onEnter) {
            this.executeEvent(node.events.onEnter, node);
        }

        // Trigger callback
        if (this.onNodeEnter) {
            this.onNodeEnter(node, nodeId);
        }
    }

    /**
     * Handle node interaction
     * @param {string} nodeId - Node ID
     */
    handleNodeInteraction(nodeId) {
        const node = this.getNodeById(nodeId);
        if (!node) return;

        // Execute onInteract event
        if (node.events && node.events.onInteract) {
            this.executeEvent(node.events.onInteract, node);
        }

        // Trigger callback
        if (this.onNodeInteract) {
            this.onNodeInteract(node, nodeId);
        }
    }

    /**
     * Execute a node event safely
     * @param {string} eventCode - JavaScript code to execute
     * @param {Object} node - The node that triggered the event
     */
    executeEvent(eventCode, node = null) {
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
                node: node, // Current node context
                system: this // Reference to the system
            };

            // Execute the event code with the context
            const func = new Function(...Object.keys(context), eventCode);
            func(...Object.values(context));

        } catch (error) {
            console.error('Error executing node event:', error, '\nEvent code:', eventCode);
        }
    }

    /**
     * Show a message to the player
     * @param {string} message - Message to display
     */
    showMessage(message) {
        console.log('Node Message:', message);
        
        // Integration with SugarCube
        if (window.UI && window.UI.alert) {
            window.UI.alert(message);
        } else if (window.Dialog && window.Dialog.setup && window.Dialog.open) {
            window.Dialog.setup('Message', 'node-message');
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
        if (window.Engine && window.Engine.play) {
            window.Engine.play(eventId);
        } else {
            this.showMessage(`Event "${eventId}" would start here.`);
        }
    }

    /**
     * Set player position (for visual indicators)
     * @param {string} nodeId - Node ID
     */
    setPlayerPosition(nodeId) {
        // Remove previous player indicator
        const previousIndicator = this.container.querySelector('.player-indicator');
        if (previousIndicator) {
            previousIndicator.remove();
        }

        const node = this.getNodeById(nodeId);
        if (!node) return;

        // Create new player indicator
        const indicator = document.createElement('div');
        indicator.classList.add('player-indicator');
        indicator.style.position = 'absolute';
        indicator.style.left = `${node.position.x - 10}px`;
        indicator.style.top = `${node.position.y - 10}px`;
        indicator.style.width = '20px';
        indicator.style.height = '20px';
        indicator.style.zIndex = '1000';
        
        // Add position data for debugging
        indicator.dataset.nodeId = nodeId;

        this.nodesContainer.appendChild(indicator);
    }

    /**
     * Update dynamic nodes based on current game state
     */
    updateDynamicNodes() {
        if (!this.currentMapData) return;

        const updatedNodes = new Set();
        
        // Check each node for condition changes
        for (const originalNode of this.currentMapData.nodes) {
            const currentNode = this.nodes.get(originalNode.id);
            if (!currentNode) continue;
            
            // Re-evaluate dynamic conditions
            const updatedNode = JSON.parse(JSON.stringify(originalNode));
            this.applyDynamicConditions(updatedNode);
            
            // Check if node has changed
            if (JSON.stringify(currentNode) !== JSON.stringify(updatedNode)) {
                updatedNodes.add(updatedNode.id);
                this.nodes.set(updatedNode.id, updatedNode);
            }
        }
        
        // Re-render only changed nodes
        for (const nodeId of updatedNodes) {
            const node = this.nodes.get(nodeId);
            const existingElement = this.nodeElements.get(nodeId);
            
            if (existingElement) {
                existingElement.remove();
                this.nodeElements.delete(nodeId);
            }
            
            this.renderNode(node);
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
            nodes: Array.from(this.nodes.values())
        };
    }

    /**
     * Destroy the node map system and clean up resources
     */
    destroy() {
        this.isDestroyed = true;
        
        // Clear DOM
        if (this.container) {
            this.container.innerHTML = '';
            this.container.classList.remove('node-map-container', 'loading');
        }
        
        // Clear data structures
        this.nodes.clear();
        this.nodeElements.clear();
        this.connectionElements.clear();
        
        // Clear references
        this.currentMap = null;
        this.currentMapData = null;
        this.container = null;
        this.mapContainer = null;
        this.svg = null;
        this.nodesContainer = null;

        console.log('NodeMapSystem destroyed');
    }
}

// Export for use in other modules
window.NodeMapSystem = NodeMapSystem;
