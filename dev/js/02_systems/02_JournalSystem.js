/**
 * Journal System for Twine 2 - SugarCube 2
 * Manages journal tabs, quest tracking, relationships, and map integration
 */

window.JournalSystem = {
    // Current active tab
    activeTab: 'quests',
    
    /**
     * Initialize the journal system
     */
    init() {
        console.log("[JournalSystem] Initializing...");
        
        // Set up event listeners for journal opening
        $(document).on(':journalopen', () => {
            this.onJournalOpen();
        });
        
        console.log("[JournalSystem] Initialized successfully");
    },
    
    /**
     * Called when journal is opened
     */
    onJournalOpen() {
        // Re-render Lucide icons
        if (window.lucide) {
            setTimeout(() => lucide.createIcons(), 100);
        }
        
        // Update map display if on map tab
        if (this.activeTab === 'map' && window.MapSystem) {
            setTimeout(() => {
                if (typeof MapSystem.updateFullMapDisplay === 'function') {
                    MapSystem.updateFullMapDisplay();
                }
            }, 100);
        }
    },
    
    /**
     * Switch between journal tabs
     */
    switchTab(tabName) {
        // Validate tab name
        const validTabs = ['quests', 'relationships', 'map', 'codex'];
        if (!validTabs.includes(tabName)) {
            console.warn(`[JournalSystem] Invalid tab name: ${tabName}`);
            return;
        }
        
        // Remove active class from all tabs and content
        document.querySelectorAll('.journal-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.journal-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to selected tab and content
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(`journal-${tabName}`);
        
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // Update active tab
        this.activeTab = tabName;
        
        // Special handling for map tab
        if (tabName === 'map') {
            setTimeout(() => {
                if (window.MapSystem && typeof MapSystem.updateFullMapDisplay === 'function') {
                    MapSystem.updateFullMapDisplay();
                }
            }, 100);
        }
        
        console.log(`[JournalSystem] Switched to tab: ${tabName}`);
    },
    
    /**
     * Toggle map grid display
     */
    toggleMapGrid() {
        const mapContainer = document.getElementById('full-map-container');
        if (mapContainer) {
            const grid = mapContainer.querySelector('.tile-grid');
            if (grid) {
                grid.classList.toggle('show-grid');
                console.log('[JournalSystem] Toggled map grid');
            }
        }
    },
    
    /**
     * Update quest display
     */
    updateQuests() {
        // This would be implemented to update quest data from game state
        // For now, it's a placeholder for future implementation
        console.log('[JournalSystem] Quest update requested');
    },
    
    /**
     * Update relationships display
     */
    updateRelationships() {
        // This would be implemented to update relationship data from game state
        // For now, it's a placeholder for future implementation
        console.log('[JournalSystem] Relationship update requested');
    },
    
    /**
     * Update codex entries
     */
    updateCodex() {
        // This would be implemented to update codex data from game state
        // For now, it's a placeholder for future implementation
        console.log('[JournalSystem] Codex update requested');
    }
};

// Global functions for HTML onclick handlers
window.switchJournalTab = function(tabName) {
    if (window.JournalSystem) {
        JournalSystem.switchTab(tabName);
    }
};

window.toggleMapGrid = function() {
    if (window.JournalSystem) {
        JournalSystem.toggleMapGrid();
    }
};

// Initialize when DOM is ready
$(document).ready(() => {
    JournalSystem.init();
});

// Trigger journal open event when overlay opens
$(document).on(':overlayopen', (event, overlayName) => {
    if (overlayName === 'journal-page') {
        $(document).trigger(':journalopen');
    }
});
