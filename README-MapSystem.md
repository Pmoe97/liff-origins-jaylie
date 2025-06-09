# Map System Documentation

## Overview

The Map System is a comprehensive grid-based navigation system for Twine 2 - SugarCube 2 games. It provides seamless integration with the sidebar minimap and journal full map view, supporting keyboard/mouse navigation, fog-of-war mechanics, and dynamic transitions.

## Features

### Core Navigation
- **Grid-based movement**: 4-directional movement (North, South, East, West)
- **Keyboard controls**: WASD keys or arrow keys
- **Mouse/touch controls**: Click on adjacent tiles to move
- **Automatic passage loading**: Seamlessly transitions between Twine passages

### Visual Integration
- **Sidebar minimap**: Shows 3x3 area around player with current location
- **Journal full map**: Complete map view accessible from Journal → Map tab
- **Lucide icons**: Visual representation of locations and transition types
- **Real-time updates**: Minimap and location info update automatically

### Advanced Features
- **Fog-of-war**: Optional per-map feature that reveals tiles as player explores
- **Dynamic transitions**: Bidirectional and one-way paths with conditional access
- **Movement blocking**: Automatically blocks movement during conversations/overlays
- **Condition system**: Gate access based on items, variables, or quest states

## File Structure

```
dev/js/data/maps/           # Map JSON files
dev/js/02_systems/13_MapSystem.js  # Core map system
dev/styles/sidebar-minimap.css     # Map styling
overlays/journal-page.html          # Journal with map tab
dev/story/test_realm/MapTestPassages.tw  # Example passages
```

## Quick Start

### 1. Load a Map
```javascript
// Load and set the current map
await MapSystem.setCurrentMap('example-map');
```

### 2. Create Map JSON
Create a JSON file in `dev/js/data/maps/` with the following structure:

```json
{
  "mapId": "your-map-id",
  "name": "Your Map Name",
  "description": "Map description",
  "gridSize": {
    "width": 9,
    "height": 7
  },
  "fogOfWar": false,
  "playerStartPosition": {
    "x": 5,
    "y": 3
  },
  "nodes": [
    {
      "id": "location-id",
      "x": 5,
      "y": 3,
      "passage": "TwinePassageName",
      "name": "Location Display Name",
      "icon": "lucide-icon-name",
      "transitions": {
        "north": {
          "type": "bidirectional",
          "conditions": []
        }
      }
    }
  ]
}
```

### 3. Create Corresponding Passages
Create Twine passages that match the `passage` field in your map nodes:

```
:: TwinePassageName
Your passage content here.

The map system will automatically load this passage when the player moves to this location.
```

## Map JSON Reference

### Root Properties
- `mapId` (string): Unique identifier for the map
- `name` (string): Display name shown in UI
- `description` (string): Optional description
- `gridSize` (object): Map dimensions
  - `width` (number): Number of columns
  - `height` (number): Number of rows
- `fogOfWar` (boolean): Enable fog-of-war mechanics
- `playerStartPosition` (object): Default starting position
  - `x` (number): Column position (1-based)
  - `y` (number): Row position (1-based)
- `nodes` (array): Array of location nodes

### Node Properties
- `id` (string): Unique node identifier
- `x` (number): Column position (1-based)
- `y` (number): Row position (1-based)
- `passage` (string): Twine passage name to load
- `name` (string): Display name for location
- `icon` (string|null): Lucide icon name (optional)
- `transitions` (object): Available movement directions

### Transition Types
- `bidirectional`: Two-way movement allowed
- `one-way`: Movement only in specified direction
  - Requires `direction` property: "north", "south", "east", "west"

### Condition System
Transitions can include conditions that must be met for movement:

```json
"conditions": [
  {
    "type": "variable",
    "variable": "player.skills.stealth",
    "operator": ">=",
    "value": 3
  },
  {
    "type": "item",
    "item": "lockpick",
    "operator": ">=",
    "value": 1
  }
]
```

#### Condition Types
- `variable`: Check SugarCube variable value
- `item`: Check inventory item count
- `quest`: Check quest status (placeholder for future implementation)

#### Operators
- `==`: Equal to
- `!=`: Not equal to
- `>=`: Greater than or equal to
- `<=`: Less than or equal to
- `>`: Greater than
- `<`: Less than

## API Reference

### MapSystem Object

#### Core Methods
```javascript
// Initialize the map system
await MapSystem.init()

// Load a map from JSON file
await MapSystem.loadMap(mapId)

// Set current map and position
await MapSystem.setCurrentMap(mapId, position)

// Move player in direction
await MapSystem.movePlayer(direction)

// Check if movement is allowed
MapSystem.canMoveTo(direction)

// Block/unblock movement
MapSystem.setMovementBlocked(blocked)
```

#### Display Methods
```javascript
// Update minimap display
MapSystem.updateMinimapDisplay()

// Update full map display in journal
MapSystem.updateFullMapDisplay()

// Update location info in sidebar
MapSystem.updateLocationInfo()

// Open full map in journal
MapSystem.openFullMap()
```

#### Fog of War Methods
```javascript
// Reveal a tile
MapSystem.revealTile(mapId, x, y)

// Check if tile is revealed
MapSystem.isTileRevealed(mapId, x, y)
```

#### Utility Methods
```javascript
// Get node at coordinates
MapSystem.getNodeAt(x, y)

// Check if coordinates are adjacent to player
MapSystem.isAdjacentToPlayer(x, y)

// Handle tile click in full map
MapSystem.handleTileClick(x, y)
```

### Properties
```javascript
MapSystem.currentMap        // Current loaded map data
MapSystem.currentPosition   // Player position {x, y}
MapSystem.loadedMaps        // Map cache
MapSystem.movementBlocked   // Movement state
MapSystem.revealedTiles     // Fog-of-war state
```

## Integration with Existing Systems

### Sidebar Integration
The map system integrates with the existing sidebar UI:
- Minimap appears in the sidebar below status bars
- Location name updates automatically in sidebar header
- Fullscreen button opens journal map tab

### Overlay Integration
Movement is automatically blocked when overlays are open:
- Opening any overlay blocks map movement
- Closing overlays restores movement
- Prevents accidental navigation during UI interactions

### SugarCube Integration
The system works seamlessly with SugarCube:
- Uses `Engine.play()` for passage transitions
- Stores state in `State.variables.player.mapState`
- Integrates with existing passage display events

## Styling and Customization

### CSS Classes
The system uses these main CSS classes:
- `.tile-grid`: Base grid container
- `.tile`: Individual tile styling
- `.player-tile`: Player location highlighting
- `.tile-node`: Location tiles
- `.tile-empty`: Empty grid spaces
- `.tile-hidden`: Fog-of-war hidden tiles
- `.tile-clickable`: Interactive tiles in full map

### Icon Customization
Location icons use Lucide icons. Common examples:
- `beer`: Taverns
- `flask-conical`: Shops/Alchemy
- `bed-double`: Brothels/Inns
- `crown`: Palace/Royal locations
- `door-open`: Gates/Exits
- `lock`: Locked/Restricted areas

### Transition Indicators
Visual indicators show available paths:
- Blue lines: Bidirectional paths
- Red gradient lines: One-way paths
- Positioned on tile edges based on direction

## Testing and Debugging

### Test Page
Use the `MapSystemTest` passage for testing:
```
[[Test Map System->MapSystemTest]]
```

### Debug Features
- Map debug info in passages (when map is loaded)
- Console logging for all major operations
- Movement blocking toggle for testing
- Position manipulation for testing

### Common Issues
1. **Map not loading**: Check JSON syntax and file path
2. **Movement not working**: Ensure transitions are properly defined
3. **Icons not showing**: Verify Lucide icon names
4. **Passages not found**: Check passage names match map data

## Performance Considerations

### Map Caching
- Maps are cached after first load
- No need to reload unless map data changes
- Use `MapSystem.loadedMaps.clear()` to reset cache

### Update Frequency
- Minimap updates on movement and passage changes
- Full map updates only when journal tab is opened
- Fog-of-war state persists in player save data

### Memory Usage
- Revealed tiles stored as coordinate strings
- Map data cached in memory for performance
- Consider map size for large worlds

## Future Enhancements

### Planned Features
- Multi-floor support (layered grids)
- Minimap scaling for large maps
- Custom tile backgrounds
- Hover tooltips for accessibility
- Additional transition types
- Quest integration for conditions

### Extensibility
The system is designed for easy extension:
- Add new condition types in `evaluateCondition()`
- Create new transition types in map JSON
- Extend icon system with custom graphics
- Add new movement patterns beyond 4-directional

## Examples

### Basic Map Setup
```javascript
// In a passage or startup
$(document).ready(async function() {
    await MapSystem.setCurrentMap('example-map');
});
```

### Custom Movement Blocking
```javascript
// Block movement during conversation
MapSystem.setMovementBlocked(true);

// Restore movement after conversation
MapSystem.setMovementBlocked(false);
```

### Conditional Access
```json
{
  "transitions": {
    "north": {
      "type": "one-way",
      "direction": "north",
      "conditions": [
        {
          "type": "variable",
          "variable": "player.reputation.royal",
          "operator": ">=",
          "value": 10
        }
      ]
    }
  }
}
```

This creates a one-way passage north that requires royal reputation of 10 or higher.
