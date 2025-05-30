# 🗺️ Tile-Based Navigation System for Twine/SugarCube

A comprehensive, scalable, and maintainable tile-based navigation system designed for Twine/SugarCube games. This system provides D&D-style map navigation with WASD controls, dynamic tile states, multi-sized tiles, and seamless map transitions.

## 🌟 Features

### Core Navigation
- **WASD Movement Controls** - Smooth keyboard navigation with arrow key support
- **Multi-sized Tiles** - Support for 1×1, 2×2, 3×1, and custom tile dimensions
- **Movement Validation** - Entry/exit point restrictions and collision detection
- **Smooth Animations** - Configurable movement animations with easing
- **Interaction System** - Press E or Enter to interact with special tiles

### Dynamic Content
- **Conditional Tiles** - Tiles change based on game variables (day, quest states, etc.)
- **Daily Rotation** - Vendor locations and content change over time
- **Ambient Events** - Random atmospheric messages and events
- **Portal System** - Seamless transitions between different map regions

### Visual Polish
- **Responsive Design** - Scales appropriately for different screen sizes
- **Theme Support** - Dark/light theme compatibility
- **Accessibility** - High contrast mode and reduced motion support
- **Debug Mode** - Grid overlay, position info, and development tools

### Integration
- **SugarCube Compatible** - Designed specifically for Twine/SugarCube games
- **Minimap Support** - Sidebar integration with navigation controls
- **Event System** - Comprehensive callbacks for game integration
- **Modular Architecture** - Easy to extend and customize

## 📁 File Structure

```
dev/
├── js/
│   ├── 02_systems/
│   │   ├── TileMapSystem.js          # Core map rendering and management
│   │   └── TileNavigationSystem.js   # Player movement and input handling
│   └── data/
│       └── maps/
│           └── kings_market_day1.json # Example map data
├── styles/
│   └── tilemap.css                   # Complete styling system
├── story/
│   └── Special Passages/
│       └── MiniMap.tw                # Twine minimap integration
└── tools/
    └── tile-generator.html           # Tile image generation tool

images/
└── tiles/                           # Tile artwork directory

demo-tilemap-system.html             # Complete working demo
README-TileMapSystem.md              # This documentation
```

## 🚀 Quick Start

### 1. Include Required Files

Add these files to your Twine project:

```html
<!-- CSS -->
<link rel="stylesheet" href="dev/styles/tilemap.css">

<!-- JavaScript -->
<script src="dev/js/02_systems/TileMapSystem.js"></script>
<script src="dev/js/02_systems/TileNavigationSystem.js"></script>
```

### 2. Create a Map Container

Add a container element where you want the map to appear:

```html
<div id="game-map" style="width: 100%; height: 400px;"></div>
```

### 3. Initialize the System

```javascript
// Create the map system
const mapSystem = new TileMapSystem('game-map', {
    gridSize: 64,
    showGrid: false,
    enableAnimations: true,
    baseTilePath: 'images/tiles/'
});

// Create the navigation system
const navigationSystem = new TileNavigationSystem(mapSystem, {
    movementSpeed: 300,
    enableAnimations: true,
    onPositionChange: (newPos, oldPos, direction) => {
        // Update game state
        State.variables.playerPosition = newPos;
    }
});

// Load a map
mapSystem.loadMap('kings_market_day1', { x: 3, y: 6 });
```

### 4. Generate Tile Images

Open `dev/tools/tile-generator.html` in your browser and click "Download All Tiles" to generate the placeholder tile images. Place them in the `images/tiles/` directory.

## 🎮 Controls

| Key | Action |
|-----|--------|
| **W, ↑** | Move North |
| **A, ←** | Move West |
| **S, ↓** | Move South |
| **D, →** | Move East |
| **E, Enter, Space** | Interact with tile |

### Debug Controls (when debug mode enabled)
| Key | Action |
|-----|--------|
| **G** | Toggle grid display |
| **I** | Show position information |
| **R** | Refresh dynamic tiles |

## 📊 Map Data Format

Maps are defined in JSON format with the following structure:

```json
{
  "mapId": "kings_market_day1",
  "name": "King's Market - Day 1",
  "description": "A bustling market square during the first day of the royal fair",
  "size": { "width": 7, "height": 7 },
  "defaultPlayerPosition": { "x": 3, "y": 6 },
  "tiles": [
    {
      "id": "market_center",
      "position": { "x": 3, "y": 3 },
      "size": { "width": 1, "height": 1 },
      "image": "tile_fountain_center.png",
      "walkable": true,
      "entryPoints": ["north", "south", "east", "west"],
      "exitPoints": ["north", "south", "east", "west"],
      "dynamicConditions": [
        {
          "condition": "State.variables.currentDay == 2",
          "image": "tile_fountain_dry.png"
        }
      ],
      "events": {
        "onInteract": "showMessage('A beautiful fountain marks the center of the market square.')"
      }
    }
  ],
  "portals": [
    {
      "id": "to_castle_courtyard",
      "triggerTileId": "north_exit",
      "targetMap": "castle_courtyard",
      "targetPosition": { "x": 3, "y": 6 }
    }
  ]
}
```

### Tile Properties

- **id**: Unique identifier for the tile
- **position**: Grid coordinates `{x, y}`
- **size**: Tile dimensions `{width, height}`
- **image**: Filename of the tile's background image
- **walkable**: Whether the player can move through this tile
- **entryPoints**: Array of directions from which the tile can be entered
- **exitPoints**: Array of directions from which the tile can be exited
- **dynamicConditions**: Array of conditional modifications
- **events**: Object containing event handlers (`onEnter`, `onExit`, `onInteract`)

## 🔧 API Reference

### TileMapSystem

#### Constructor
```javascript
new TileMapSystem(containerId, options)
```

#### Options
- `gridSize` (number): Size of each grid cell in pixels (default: 64)
- `showGrid` (boolean): Whether to show grid lines (default: false)
- `enableAnimations` (boolean): Enable tile animations (default: true)
- `baseTilePath` (string): Base path for tile images (default: 'images/tiles/')

#### Methods
- `loadMap(mapId, playerPosition)`: Load a map from JSON
- `getTileAt(x, y)`: Get tile at specific coordinates
- `isValidMovement(fromX, fromY, toX, toY, direction)`: Check if movement is valid
- `updateDynamicTiles()`: Refresh tiles based on current game state
- `setPlayerPosition(x, y)`: Update visual player position

### TileNavigationSystem

#### Constructor
```javascript
new TileNavigationSystem(tileMapSystem, options)
```

#### Options
- `movementSpeed` (number): Animation duration in ms (default: 300)
- `enableAnimations` (boolean): Enable movement animations (default: true)
- `debugMode` (boolean): Enable debug features (default: false)

#### Methods
- `setPosition(x, y)`: Set player position
- `getPosition()`: Get current player position
- `setInputEnabled(enabled)`: Enable/disable input handling
- `teleport(x, y)`: Instantly move player to position
- `getValidDirections()`: Get array of valid movement directions

#### Events
- `onPositionChange(newPos, oldPos, direction)`: Player moved
- `onMovementBlocked(direction, targetPos)`: Movement was blocked
- `onMapTransition(portal)`: Map transition triggered
- `onInteraction(x, y)`: Player interacted with tile

## 🎨 Styling and Themes

The system includes comprehensive CSS with support for:

- **Responsive Design**: Automatic scaling for mobile devices
- **Theme Variants**: Dark and light theme support
- **Accessibility**: High contrast and reduced motion support
- **Customization**: Easy to override colors and animations

### CSS Classes

- `.tile-map-container`: Main map container
- `.tile-grid`: Grid container for tiles
- `.tile`: Individual tile element
- `.player-indicator`: Player position marker
- `.walkable` / `.non-walkable`: Tile accessibility states
- `.interactive`: Tiles that can be interacted with

## 🔌 Twine Integration

### Sidebar Minimap

Include the `MiniMap.tw` special passage in your Twine project to add a minimap to your sidebar:

```twee
:: MiniMap [special]
<!-- Content automatically included -->
```

### State Variables

The system integrates with these SugarCube state variables:

- `State.variables.currentMap`: Current map identifier
- `State.variables.playerPosition`: Player position `{x, y}`
- `State.variables.currentDay`: Current day (for dynamic tiles)
- `State.variables.timeOfDay`: Time of day (for conditional content)

### Event Integration

```javascript
// Update minimap when player moves
window.updateMinimap = function(mapId, playerPosition) {
    // Automatically called by the navigation system
};

// Integrate with existing shop system
TileMapSystem.prototype.openShop = function(shopId) {
    // Call your existing shop opening logic
    window.ShopSystem.openShop(shopId);
};
```

## 🛠️ Development Tools

### Tile Generator

Use `dev/tools/tile-generator.html` to create placeholder tile images:

1. Open the file in a web browser
2. Click "Generate All Tiles" to preview
3. Click "Download All Tiles" to save images
4. Place downloaded images in `images/tiles/`

### Debug Mode

Enable debug mode for development:

```javascript
navigationSystem.debugMode = true;
```

Features:
- Grid overlay display
- Tile ID labels
- Position information
- Console logging
- Performance monitoring

## 📱 Demo

Open `demo-tilemap-system.html` in your browser to see a complete working example with:

- Full map navigation
- Interactive controls
- Minimap display
- Event logging
- Dynamic tile changes
- Debug features

## 🔄 Dynamic Content Examples

### Day-based Vendor Rotation

```json
{
  "id": "vendor_spot",
  "dynamicConditions": [
    {
      "condition": "State.variables.currentDay == 1",
      "image": "tile_weapon_vendor.png",
      "events": { "onInteract": "openShop('weapons')" }
    },
    {
      "condition": "State.variables.currentDay == 2",
      "image": "tile_food_vendor.png",
      "events": { "onInteract": "openShop('food')" }
    },
    {
      "condition": "State.variables.currentDay == 3",
      "image": "tile_empty_grass.png",
      "walkable": true,
      "events": {}
    }
  ]
}
```

### Time-based Events

```json
{
  "id": "bard_stage",
  "dynamicConditions": [
    {
      "condition": "State.variables.timeOfDay == 'evening'",
      "image": "tile_stage_performance.png",
      "events": { "onInteract": "startEvent('bard_performance')" }
    }
  ]
}
```

## 🚀 Performance Optimization

- **Lazy Loading**: Maps load only when needed
- **Efficient Rendering**: Only visible tiles are processed
- **Memory Management**: Automatic cleanup of unused resources
- **Optimized Animations**: Hardware-accelerated CSS transitions
- **Responsive Images**: Automatic scaling for different screen sizes

## 🔮 Future Enhancements

Potential additions for future versions:

- **Weather Effects**: Visual weather overlays
- **Quest Markers**: Dynamic objective indicators
- **Pathfinding**: Automatic route calculation
- **Sound Integration**: Positional audio support
- **Multiplayer**: Shared map state
- **Map Editor**: Visual map creation tool

## 📄 License

This tile-based navigation system is designed for use in Twine/SugarCube games. Feel free to modify and extend it for your projects.

## 🤝 Contributing

To contribute improvements:

1. Test changes with the demo system
2. Ensure backward compatibility
3. Update documentation
4. Follow the existing code style
5. Add appropriate comments

## 📞 Support

For questions or issues:

1. Check the demo for working examples
2. Review the API documentation
3. Examine the JSON map format
4. Test with debug mode enabled

---

**Happy mapping! 🗺️✨**
