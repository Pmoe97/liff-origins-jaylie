/**
 * MinimapIntegration.js
 * 
 * Integration layer between the minimap system and the sidebar UI.
 * Handles initialization, updates, and coordination between systems.
 */

// Extend SidebarUI with minimap functionality
if (typeof setup !== 'undefined' && setup.SidebarUI) {
    
    // Initialize minimap system
 setup.SidebarUI.initializeMinimap = function() {
    if (typeof MinimapSystem !== 'undefined') {
        this.minimapSystem = new MinimapSystem('tile-map-container', {
            viewSize: 7,
            gridSize: 16,
            centerOnPlayer: true,
            enableMobileControls: true
        });

        // Connect to navigation system if available
        if (window.mainNavigationSystem) {
            this.minimapSystem.setNavigationSystem(window.mainNavigationSystem);
        }

        // Only load the map if the story has set the map and position
        if (State.variables.currentMap && State.variables.playerPosition) {
            this.minimapSystem.loadMap(State.variables.currentMap, State.variables.playerPosition);
            console.log('[SidebarUI] Minimap loaded with current map and player position');
        } else {
            console.log('[SidebarUI] No current map defined — minimap will not auto-load');
        }

        console.log('[SidebarUI] Minimap system initialized');
    } else {
        console.warn('[SidebarUI] MinimapSystem not available');
    }
};


    // Update minimap when player moves
    setup.SidebarUI.updateMinimap = function(mapId, playerPosition) {
        if (this.minimapSystem) {
            if (mapId && mapId !== this.minimapSystem.currentMapId) {
                // Map changed, load new map
                this.minimapSystem.loadMap(mapId, playerPosition);
            } else if (playerPosition) {
                // Just update player position
                this.minimapSystem.updatePlayerPosition(playerPosition.x, playerPosition.y);
            }
        }
    };

    // Refresh minimap dynamic tiles
    setup.SidebarUI.refreshMinimap = function() {
        if (this.minimapSystem) {
            this.minimapSystem.refreshDynamicTiles();
        }
    };

    // Enhanced update function that includes minimap
    const originalUpdate = setup.SidebarUI.update;
    setup.SidebarUI.update = function() {
        // Call original update
        if (originalUpdate) {
            originalUpdate.call(this);
        }
        
        // Update minimap if player position changed
        if (this.minimapSystem && State.variables.playerPosition) {
            const currentMap = State.variables.currentMap;
            const playerPos = State.variables.playerPosition;
            this.updateMinimap(currentMap, playerPos);
        }
    };
};

// Global functions for integration with navigation system
window.updateMinimap = function(mapId, playerPosition) {
    if (setup.SidebarUI && setup.SidebarUI.updateMinimap) {
        setup.SidebarUI.updateMinimap(mapId, playerPosition);
    }
};

window.refreshMinimap = function() {
    if (setup.SidebarUI && setup.SidebarUI.refreshMinimap) {
        setup.SidebarUI.refreshMinimap();
    }
};

// Initialize minimap when document is ready
$(document).ready(function() {
    // Wait for all systems to load
    setTimeout(() => {
        if (setup.SidebarUI && typeof setup.SidebarUI.initializeMinimap === 'function') {
            setup.SidebarUI.initializeMinimap();
        }
    }, 1000);
});

$(document).on(':storyready', function() {
    // Integration with TileNavigationSystem
    if (typeof TileNavigationSystem !== 'undefined') {
        // Extend TileNavigationSystem to update minimap on movement
        const originalCompleteMovement = TileNavigationSystem.prototype.completeMovement;
        TileNavigationSystem.prototype.completeMovement = function(previousPos, newPos, direction) {
            // Call original method
            if (originalCompleteMovement) {
                originalCompleteMovement.call(this, previousPos, newPos, direction);
            }
            
            // Update minimap
            window.updateMinimap(this.tileMapSystem.currentMap, newPos);
            
            // Update State variables for persistence
            if (State.variables) {
                State.variables.playerPosition = newPos;
                State.variables.currentMap = this.tileMapSystem.currentMap;
            }
        };

        // Extend map transition handling
        const originalExecuteMapTransition = TileNavigationSystem.prototype.executeMapTransition;
        TileNavigationSystem.prototype.executeMapTransition = async function(portal) {
            // Call original method
            if (originalExecuteMapTransition) {
                await originalExecuteMapTransition.call(this, portal);
            }
            
            // Update minimap with new map
            window.updateMinimap(portal.targetMap, portal.targetPosition);
            
            // Update State variables
            if (State.variables) {
                State.variables.currentMap = portal.targetMap;
                State.variables.playerPosition = portal.targetPosition;
            }
        };
    }
});


console.log('MinimapIntegration loaded');
