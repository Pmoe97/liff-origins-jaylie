/**
 * MinimapSystem.js
 * 
 * A specialized minimap system that extends TileMapSystem functionality
 * for sidebar and mobile minimap display. Handles local view rendering,
 * player centering, and responsive mobile controls.
 */

class MinimapSystem {
    /**
     * Initialize the MinimapSystem
     * @param {string} containerId - DOM element ID where the minimap will be rendered
     * @param {Object} options - Configuration options
     */
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = null;
        this.tileMapSystem = null;
        this.navigationSystem = null;
        
        // Minimap-specific options
        this.viewSize = options.viewSize || 7; // 7x7 grid for local view
        this.gridSize = options.gridSize || 16; // Smaller grid for minimap
        this.centerOnPlayer = options.centerOnPlayer !== false;
        this.showFullMap = options.showFullMap || false;
        this.enableMobileControls = options.enableMobileControls !== false;
        
        // State tracking
        this.currentPlayerPosition = { x: 0, y: 0 };
        this.currentMapId = null;
        this.isDestroyed = false;
        this.mobileControlsActive = false;
        
        // Mobile elements
        this.mobileOverlay = null;
        this.mobileControls = null;
        
        // Initialize the system
        this.initialize();
    }

    /**
     * Initialize the minimap system
     */
    initialize() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`MinimapSystem: Container element '${this.containerId}' not found`);
            return;
        }

        // Create the tile map system for minimap
        this.tileMapSystem = new TileMapSystem(this.containerId, {
            gridSize: this.gridSize,
            showGrid: false,
            enableAnimations: false,
            baseTilePath: 'images/tiles/',
            isMinimap: true,
            enableViewportCulling: false
        });

        // Set up mobile responsive behavior
        this.setupResponsiveHandling();
        
        // Set up event listeners
        this.setupEventListeners();

        console.log('MinimapSystem initialized');
    }

    /**
     * Set up responsive handling for mobile/desktop
     */
    setupResponsiveHandling() {
        // Create mobile overlay
        this.createMobileOverlay();
        
        // Create mobile movement controls
        this.createMobileControls();
        
        // Set up resize listener
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize(); // Initial check
    }

    /**
     * Create mobile minimap overlay
     */
    createMobileOverlay() {
        this.mobileOverlay = document.createElement('div');
        this.mobileOverlay.id = 'mobile-minimap-overlay';
        this.mobileOverlay.innerHTML = `
            <div class="minimap-display" id="mobile-tile-map-container"></div>
            <div class="minimap-info">
                <div class="minimap-location">
                    <span id="mobile-minimap-current-map">Loading...</span>
                </div>
                <div class="minimap-position">
                    <span id="mobile-minimap-player-coords">(0, 0)</span>
                </div>
            </div>
        `;
        document.body.appendChild(this.mobileOverlay);

        // Create mobile tile map system
        this.mobileTileMapSystem = new TileMapSystem('mobile-tile-map-container', {
            gridSize: 12,
            showGrid: false,
            enableAnimations: false,
            baseTilePath: 'images/tiles/',
            isMinimap: true,
            enableViewportCulling: false
        });
    }

    /**
     * Create mobile movement controls
     */
    createMobileControls() {
        this.mobileControls = document.createElement('div');
        this.mobileControls.id = 'mobile-movement-controls';
        this.mobileControls.innerHTML = `
            <div class="movement-dpad">
                <div class="movement-btn north" data-direction="north">↑</div>
                <div class="movement-btn west" data-direction="west">←</div>
                <div class="movement-btn east" data-direction="east">→</div>
                <div class="movement-btn south" data-direction="south">↓</div>
            </div>
        `;
        document.body.appendChild(this.mobileControls);

        // Add touch event listeners
        this.mobileControls.querySelectorAll('.movement-btn').forEach(btn => {
            const direction = btn.dataset.direction;
            
            // Touch events
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleMobileMovement(direction);
                btn.classList.add('active');
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.classList.remove('active');
            });
            
            // Mouse events for testing
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleMobileMovement(direction);
                btn.classList.add('active');
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                btn.classList.remove('active');
            });
        });
    }

    /**
     * Handle mobile movement input
     * @param {string} direction - Movement direction
     */
    handleMobileMovement(direction) {
        if (this.navigationSystem && this.navigationSystem.attemptMovement) {
            this.navigationSystem.attemptMovement(direction);
        } else if (window.mainNavigationSystem && window.mainNavigationSystem.attemptMovement) {
            window.mainNavigationSystem.attemptMovement(direction);
        } else {
            console.warn('No navigation system available for mobile movement');
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && !this.mobileControlsActive) {
            this.activateMobileMode();
        } else if (!isMobile && this.mobileControlsActive) {
            this.deactivateMobileMode();
        }
    }

    /**
     * Activate mobile mode
     */
    activateMobileMode() {
        this.mobileControlsActive = true;
        
        // Hide desktop minimap
        if (this.container) {
            this.container.style.display = 'none';
        }
        
        // Show mobile overlay and controls
        if (this.mobileOverlay) {
            this.mobileOverlay.style.display = 'block';
        }
        if (this.mobileControls) {
            this.mobileControls.style.display = 'block';
        }
        
        // Sync mobile minimap with current state
        this.syncMobileMinimap();
    }

    /**
     * Deactivate mobile mode
     */
    deactivateMobileMode() {
        this.mobileControlsActive = false;
        
        // Show desktop minimap
        if (this.container) {
            this.container.style.display = 'block';
        }
        
        // Hide mobile overlay and controls
        if (this.mobileOverlay) {
            this.mobileOverlay.style.display = 'none';
        }
        if (this.mobileControls) {
            this.mobileControls.style.display = 'none';
        }
    }

    /**
     * Sync mobile minimap with desktop version
     */
    syncMobileMinimap() {
        if (this.mobileTileMapSystem && this.currentMapId) {
            this.mobileTileMapSystem.loadMap(this.currentMapId, this.currentPlayerPosition);
            this.updateMobileInfo();
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Fullscreen button
        const fullscreenBtn = document.getElementById('minimap-fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.openFullscreenMap());
        }
    }

    /**
     * Load a map into the minimap
     * @param {string} mapId - Map identifier
     * @param {Object} playerPosition - Player position {x, y}
     */
    async loadMap(mapId, playerPosition = null) {
        this.currentMapId = mapId;
        if (playerPosition) {
            this.currentPlayerPosition = playerPosition;
        }

        // Load into desktop minimap
        if (this.tileMapSystem) {
            const success = await this.tileMapSystem.loadMap(mapId, playerPosition);
            if (success) {
                this.updateMinimapView();
                this.updateInfo();
            }
        }

        // Load into mobile minimap if active
        if (this.mobileControlsActive && this.mobileTileMapSystem) {
            await this.mobileTileMapSystem.loadMap(mapId, playerPosition);
            this.updateMobileInfo();
        }
    }

    /**
     * Update player position
     * @param {number} x - Grid X coordinate
     * @param {number} y - Grid Y coordinate
     */
    updatePlayerPosition(x, y) {
        this.currentPlayerPosition = { x, y };
        
        // Update desktop minimap
        if (this.tileMapSystem) {
            this.tileMapSystem.setPlayerPosition(x, y);
            if (this.centerOnPlayer) {
                this.centerMinimapOnPlayer();
            }
        }
        
        // Update mobile minimap
        if (this.mobileControlsActive && this.mobileTileMapSystem) {
            this.mobileTileMapSystem.setPlayerPosition(x, y);
        }
        
        this.updateInfo();
        this.updateMobileInfo();
    }

    /**
     * Center minimap view on player
     */
    centerMinimapOnPlayer() {
        if (!this.centerOnPlayer || !this.tileMapSystem) return;
        
        const container = this.tileMapSystem.container;
        if (!container) return;
        
        const { x, y } = this.currentPlayerPosition;
        const gridSize = this.tileMapSystem.gridSize;
        
        // Calculate center position
        const centerX = x * gridSize - container.clientWidth / 2;
        const centerY = y * gridSize - container.clientHeight / 2;
        
        container.scrollLeft = Math.max(0, centerX);
        container.scrollTop = Math.max(0, centerY);
    }

    /**
     * Update minimap view for local area
     */
    updateMinimapView() {
        if (!this.tileMapSystem || this.showFullMap) return;
        
        // For local view, we'll use CSS transform to scale and position
        const gridContainer = this.tileMapSystem.gridContainer;
        if (!gridContainer) return;
        
        const { x, y } = this.currentPlayerPosition;
        const gridSize = this.tileMapSystem.gridSize;
        const viewSize = this.viewSize;
        
        // Calculate the area to show (centered on player)
        const startX = Math.max(0, x - Math.floor(viewSize / 2));
        const startY = Math.max(0, y - Math.floor(viewSize / 2));
        
        // Apply transform to show only the local area
        const offsetX = -startX * gridSize;
        const offsetY = -startY * gridSize;
        
        gridContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.4)`;
        gridContainer.style.transformOrigin = 'top left';
    }

    /**
     * Update minimap info display
     */
    updateInfo() {
        const mapNameEl = document.getElementById('minimap-current-map');
        const coordsEl = document.getElementById('minimap-player-coords');
        
        if (mapNameEl && this.tileMapSystem && this.tileMapSystem.currentMapData) {
            mapNameEl.textContent = this.tileMapSystem.currentMapData.name || this.currentMapId;
        }
        
        if (coordsEl) {
            coordsEl.textContent = `(${this.currentPlayerPosition.x}, ${this.currentPlayerPosition.y})`;
        }
    }

    /**
     * Update mobile minimap info display
     */
    updateMobileInfo() {
        const mapNameEl = document.getElementById('mobile-minimap-current-map');
        const coordsEl = document.getElementById('mobile-minimap-player-coords');
        
        if (mapNameEl && this.mobileTileMapSystem && this.mobileTileMapSystem.currentMapData) {
            mapNameEl.textContent = this.mobileTileMapSystem.currentMapData.name || this.currentMapId;
        }
        
        if (coordsEl) {
            coordsEl.textContent = `(${this.currentPlayerPosition.x}, ${this.currentPlayerPosition.y})`;
        }
    }

    /**
     * Open fullscreen map view
     */
    openFullscreenMap() {
        if (!this.tileMapSystem || !this.currentMapId) return;
        
        // Create fullscreen overlay
        const overlay = document.createElement('div');
        overlay.className = 'tile-map-fullscreen';
        overlay.innerHTML = `
            <div id="fullscreen-tile-map" class="tile-map-container"></div>
            <button class="fullscreen-close-btn" style="position: absolute; top: 20px; right: 20px; z-index: 10000; background: rgba(0,0,0,0.8); color: white; border: 1px solid #555; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Close</button>
        `;
        document.body.appendChild(overlay);
        
        // Create fullscreen map system
        const fullscreenMap = new TileMapSystem('fullscreen-tile-map', {
            gridSize: 64,
            showGrid: true,
            enableAnimations: true,
            baseTilePath: 'images/tiles/'
        });
        
        // Load current map
        fullscreenMap.loadMap(this.currentMapId, this.currentPlayerPosition);
        
        // Close handlers
        const closeBtn = overlay.querySelector('.fullscreen-close-btn');
        closeBtn.addEventListener('click', () => {
            overlay.remove();
            fullscreenMap.destroy();
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                fullscreenMap.destroy();
            }
        });
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                fullscreenMap.destroy();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    /**
     * Set navigation system reference
     * @param {TileNavigationSystem} navigationSystem - Navigation system instance
     */
    setNavigationSystem(navigationSystem) {
        this.navigationSystem = navigationSystem;
    }

    /**
     * Refresh dynamic tiles
     */
    refreshDynamicTiles() {
        if (this.tileMapSystem) {
            this.tileMapSystem.updateDynamicTiles();
        }
        if (this.mobileControlsActive && this.mobileTileMapSystem) {
            this.mobileTileMapSystem.updateDynamicTiles();
        }
    }

    /**
     * Get current map information
     * @returns {Object} Current map data
     */
    getCurrentMapInfo() {
        if (this.tileMapSystem) {
            return this.tileMapSystem.getCurrentMapInfo();
        }
        return {
            mapId: this.currentMapId,
            mapData: null,
            tiles: []
        };
    }

    /**
     * Destroy the minimap system
     */
    destroy() {
        this.isDestroyed = true;
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        // Destroy tile map systems
        if (this.tileMapSystem) {
            this.tileMapSystem.destroy();
        }
        if (this.mobileTileMapSystem) {
            this.mobileTileMapSystem.destroy();
        }
        
        // Remove mobile elements
        if (this.mobileOverlay) {
            this.mobileOverlay.remove();
        }
        if (this.mobileControls) {
            this.mobileControls.remove();
        }
        
        console.log('MinimapSystem destroyed');
    }
}

// Export for use in other modules
window.MinimapSystem = MinimapSystem;
