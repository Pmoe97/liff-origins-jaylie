# Map System Setup Guide

## Quick Setup (5 minutes)

### Step 1: Test the System
1. Open your Twine game
2. Navigate to the test passage: `MapSystemTest`
3. Click "Load Example Map" to see the system in action
4. Try using WASD keys to move around
5. Open the Journal → Map tab to see the full map

### Step 2: Load Map in Your Game
Add this to any passage where you want to initialize the map:

```
<<script>>
$(document).ready(async function() {
    await MapSystem.setCurrentMap('example-map');
});
<</script>>
```

### Step 3: Create Your First Custom Map
1. Copy `dev/js/data/maps/example-map.json`
2. Rename it to `my-first-map.json`
3. Edit the map data:
   - Change `mapId` to `"my-first-map"`
   - Change `name` to your map name
   - Modify the `nodes` array for your locations
4. Load it with: `MapSystem.setCurrentMap('my-first-map')`

## File Checklist

Make sure these files exist in your project:

### Core System Files
- ✅ `dev/js/02_systems/13_MapSystem.js` - Main map system
- ✅ `dev/styles/sidebar-minimap.css` - Map styling
- ✅ `overlays/journal-page.html` - Journal with map tab

### Example Files
- ✅ `dev/js/data/maps/example-map.json` - Example map data
- ✅ `dev/story/test_realm/MapTestPassages.tw` - Test passages

### Integration Files (Modified)
- ✅ `dev/js/02_systems/03_overlayManager.js` - Updated for movement blocking
- ✅ `dev/story/Special Passages/SidebarUI.tw` - Already has minimap container

## Testing Checklist

### Basic Functionality
- [ ] Map loads without errors
- [ ] WASD/Arrow keys move the player
- [ ] Minimap shows in sidebar
- [ ] Location name updates in sidebar
- [ ] Journal → Map tab shows full map
- [ ] Clicking adjacent tiles in full map moves player

### Advanced Features
- [ ] Movement blocked when overlays open
- [ ] Movement restored when overlays close
- [ ] Transition conditions work (if using conditional access)
- [ ] Fog-of-war reveals tiles (if enabled)

## Common Issues & Solutions

### Map Not Loading
**Problem**: Console shows "Failed to load map" error
**Solution**: 
1. Check file path: `dev/js/data/maps/your-map-id.json`
2. Validate JSON syntax at jsonlint.com
3. Ensure `mapId` in JSON matches filename

### Movement Not Working
**Problem**: WASD keys don't move player
**Solution**:
1. Check that map is loaded: `MapSystem.currentMap` should not be null
2. Verify transitions are defined in map JSON
3. Check console for movement blocking messages

### Icons Not Showing
**Problem**: Location icons don't appear
**Solution**:
1. Verify Lucide icon names at lucide.dev
2. Check that `lucide.createIcons()` is being called
3. Ensure icon names in JSON are correct (e.g., "beer", not "beer-icon")

### Passages Not Found
**Problem**: "Passage not found" errors when moving
**Solution**:
1. Create Twine passages that match `passage` field in map JSON
2. Check spelling and capitalization
3. Ensure passages are in the correct Twine file

## Integration with Existing Game

### Sidebar Integration
The map system automatically integrates with your existing sidebar:
- Minimap appears below status bars
- Location name updates in sidebar header
- No additional setup required

### Save Game Compatibility
Player map state is automatically saved:
- Current map and position
- Revealed fog-of-war tiles
- No additional save/load code needed

### Overlay Integration
Movement blocking works automatically:
- Any overlay blocks map movement
- Closing overlays restores movement
- Works with inventory, journal, character sheet, etc.

## Next Steps

### Create Your World
1. Plan your map layout on paper or in a drawing app
2. Create JSON files for each area/map
3. Create corresponding Twine passages
4. Test movement between all locations

### Add Advanced Features
1. **Conditional Access**: Gate areas behind items/stats
2. **Fog-of-War**: Hide unexplored areas
3. **One-Way Paths**: Create interesting navigation puzzles
4. **Custom Icons**: Use different icons for location types

### Customize Appearance
1. Modify CSS in `dev/styles/sidebar-minimap.css`
2. Change colors, sizes, animations
3. Add custom tile backgrounds
4. Adjust responsive breakpoints

## Support

### Documentation
- `README-MapSystem.md` - Complete technical documentation
- `dev/story/test_realm/MapTestPassages.tw` - Working examples

### Debugging
- Use browser console to see map system logs
- Check `MapSystem` object in console for current state
- Use `MapSystemTest` passage for testing features

### Performance
- Maps are cached after first load
- Minimap updates only when needed
- Full map renders only when journal is opened
- System is optimized for smooth gameplay

## Example Map Structure

```
Your Game World
├── Town Center (starting area)
│   ├── Tavern
│   ├── Shop
│   └── Inn
├── Palace District
│   ├── Palace Gates (requires reputation)
│   └── Palace Interior
└── Outskirts
    ├── City Gate
    └── Wilderness (fog-of-war enabled)
```

Each area would be a separate JSON file with interconnected nodes and appropriate transitions.
