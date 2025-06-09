# RGNPC (Randomly Generated NPC) System Guide

## Overview

The RGNPC system is a comprehensive, fully systemic randomly generated NPC framework designed to create living, breathing NPCs that feel more alive than hand-crafted characters. This system creates persistent, relationship-driven NPCs with full depth including personality, schedules, occupations, and dynamic discovery mechanics.

## Key Features

### 🧩 Core Identity System
- **Dynamic Names**: Cultural/racial naming with surnames
- **Physical Descriptions**: Comprehensive body generation with racial features
- **Pronouns**: Proper gender identity support (he/him, she/her, they/them)
- **Avatars**: Placeholder system ready for integration

### 🤝 Relationship Mechanics
- **Trust**: -10 to +10 (how much they trust the player)
- **Affection**: -10 to +10 (romantic/platonic fondness)
- **Rapport**: 0 to +10 (social connection and understanding)
- **Tension**: 0 to +10 (conflict and stress levels)

### 🎭 Personality System
- **Traits**: 3-5 personality traits with conflict resolution
- **Inclinations**: Sexual/romantic preferences (1-3)
- **Motivations**: Life goals and driving forces (1-2)
- **Social Style**: How they interact socially

### 📅 Schedule System
- **Weekly Repeating**: Sunday through Saturday
- **Time Slots**: 6 daily periods (Early Morning, Late Morning, Afternoon, Evening, Night, Late Night)
- **Activities**: Context-appropriate activities based on archetype
- **Movement**: NPCs can move between locations based on schedule

### 💼 Occupation System
- **Job Titles**: Archetype-appropriate occupations
- **Skills**: Relevant skill sets for their profession
- **Shop Integration**: Ready for shop system integration

### 🗺️ Population Management
- **Location Caps**: Configurable maximum population per location type
- **Persistence**: NPCs persist between visits
- **Replacement**: Optional replacement when NPCs die
- **Dynamic Population**: Locations can become depopulated over time

## File Structure

### Core System Files
- `dev/js/02_systems/16_RGNPCSystem.js` - Main RGNPC system
- `overlays/people-page.html` - Player UI for NPC interaction

### Data Files
- `dev/js/data/npc_names.js` - Name pools with cultural variations
- `dev/js/data/npc_archetypes.js` - Comprehensive archetype system
- `dev/js/data/personality_traits.js` - Personality trait definitions
- `dev/js/data/inclinations.js` - Sexual/romantic preferences
- `dev/js/data/motivations.js` - Life motivations and goals
- `dev/js/data/social_styles.js` - Social interaction styles

### Integration Files
- `dev/js/02_systems/11_BodyDescriptorsDB.js` - Physical description system
- `dev/js/01_core/04_character.js` - Hand-crafted NPCs (separate from RGNPCs)

## Usage Guide

### Basic NPC Generation

```javascript
// Generate a random NPC
const npc = RGNPCSystem.generateRGNPC();

// Generate with specific parameters
const specificNPC = RGNPCSystem.generateRGNPC({
    race: 'elf',
    gender: 'female',
    archetype: 'Scholar',
    location: 'library'
});
```

### Population Management

```javascript
// Populate a location
RGNPCSystem.populateLocation('tavern', 'tavern', 10);

// Get NPCs in a location
const npcsInTavern = RGNPCSystem.getNPCsInLocation('tavern');

// Check if location can accommodate more NPCs
const canAdd = RGNPCSystem.canAddNPCToLocation('tavern', 'tavern');
```

### Relationship Management

```javascript
// Update relationships
RGNPCSystem.updateRelationship(npcId, 'trust', +2);
RGNPCSystem.updateRelationship(npcId, 'tension', -1);

// Introduce NPC to player
RGNPCSystem.introduceNPC(npcId);

// Reveal traits gradually
RGNPCSystem.revealTrait(npcId, 'curious');
```

### Schedule System

```javascript
// Get current activity
const activity = RGNPCSystem.getCurrentActivity(npcId);
console.log(`${npc.name} is currently: ${activity.activity}`);
```

### Debug Functions

```javascript
// Generate test NPCs
RGNPCSystem.generateTestNPCs(5, 'test_location');

// Debug info
RGNPCSystem.debugInfo();

// Get specific NPC
const npc = RGNPCSystem.getRGNPC(npcId);
```

## Archetype System

### Available Archetypes

#### Military & Law Enforcement
- **Warden**: Guards, soldiers, law enforcement
- **Soldier**: Battle-hardened military personnel

#### Entertainment & Social
- **Courtesan**: Skilled entertainers using charm professionally
- **Bard**: Musicians, storytellers, performers
- **Merchant**: Traders focused on profit

#### Scholarly & Mystical
- **Witchling**: Practitioners of arcane arts
- **Scholar**: Researchers, academics, librarians
- **Healer**: Medical practitioners and healers

#### Working Class
- **Artisan**: Skilled craftspeople
- **Laborer**: Manual workers
- **Farmer**: Agricultural workers

#### Criminal & Underground
- **Thief**: Pickpockets, burglars, petty criminals
- **Smuggler**: Movers of illegal goods

#### Religious & Spiritual
- **Priest**: Religious clergy
- **Cultist**: Fringe religious group members

#### Nobility & Upper Class
- **Noble**: Aristocracy with inherited status
- **Bureaucrat**: Government officials

#### Outcasts & Wanderers
- **Outcast**: Society's rejected living on margins
- **Wanderer**: Travelers and nomads

#### Specialized Roles
- **Innkeeper**: Hospitality business operators
- **Hunter**: Skilled trackers living off the land

### Location-Based Archetype Weights

Different locations favor different archetypes:

- **Taverns**: Innkeepers, Bards, Merchants, Laborers
- **Markets**: Merchants, Artisans, Farmers
- **Temples**: Priests, Scholars, Healers
- **Palaces**: Nobles, Bureaucrats, Wardens
- **Slums**: Thieves, Outcasts, Smugglers

## Name System

### Supported Races
- **Human**: Traditional fantasy names with regional variants
- **Elf**: Elegant, flowing names with nature themes
- **Half-Orc**: Strong, harsh-sounding names
- **Dwarf**: Traditional dwarven names with clan surnames
- **Halfling**: Cheerful, nature-inspired names
- **Half-Demon**: Dark, mystical names with infernal themes

### Regional Variants
- **Northern Humans**: Norse-inspired names
- **Southern Humans**: Mediterranean-inspired names
- **Eastern Humans**: Slavic-inspired names

## Discovery System

### Unknown NPCs
- Display as physical descriptions ("Tall blonde woman")
- No name or personal information revealed
- Basic relationship tracking still active

### Known NPCs
- Real name revealed after first conversation
- Gradual trait revelation through interaction
- Occupation and motivations revealed as relationship deepens
- Schedule information becomes available

## People Overlay UI

### Features
- **Location Info**: Current location and population count
- **Filtering**: Filter by relationship status, archetype, known/unknown
- **Person Cards**: Visual cards showing basic info and relationship indicators
- **Detailed View**: Comprehensive information panel for selected NPCs
- **Relationship Meters**: Visual representation of all relationship values
- **Action Buttons**: Talk, Observe, Pickpocket, Attack (context-sensitive)

### Relationship Indicators
- **Green Dots**: Positive relationships (trust, affection)
- **Red Dots**: Negative relationships (tension, low trust)
- **Gray Dots**: Neutral relationships

## Integration Points

### Map System Integration
```javascript
// The system integrates with MapSystem for location tracking
const currentLocation = MapSystem.getCurrentLocation();
```

### Dialogue System Integration
```javascript
// NPCs can be introduced through dialogue
RGNPCSystem.introduceNPC(npcId);

// Relationship changes can be triggered by dialogue outcomes
$(document).trigger('rgnpc:relationship_change', {
    rgnpcId: npcId,
    type: 'trust',
    change: +1
});
```

### Crime System Integration
```javascript
// NPCs have crime witness behavior
const witnessLevel = npc.crimeWitnessLevel; // 'ignore', 'report', 'intervene'
```

## Persistence

### Automatic Saving
- Data saved to localStorage every 5 minutes
- Data saved on page unload
- Persistent across browser sessions

### Data Structure
```javascript
{
    npcs: Map of rgnpcId -> RGNPC object,
    locationPopulations: Map of locationId -> Set of rgnpcIds,
    version: '1.0'
}
```

## Calendar Integration

### Custom Calendar System
- **Years**: Notated as AI (After Impact)
- **Current Date**: 20th of Rain, 12219 AI
- **Seasons**: Snow (Winter), Rain (Spring), Sun (Summer), Harvest (Fall)
- **Season Length**: 100 days each
- **Week Length**: 7 days

### Age System
- NPCs generated with ages 18-60
- Birth dates include day, season, and year
- Ages calculated from current game date

## Future Expansion Points

### Quest System Integration
- Madlib-style quest templates based on motivation/personality
- Dynamic quest generation tied to NPC backgrounds

### Social Network System
- NPCs can know each other
- Family relationships, friendships, rivalries
- Marriage and romantic relationships between NPCs

### Aging System
- NPCs age over time
- Natural death from old age
- Life events and relationship changes

### Advanced Scheduling
- NPCs can travel between locations
- Special events and festivals
- Seasonal activity variations

## Console Commands

### Debug Commands
```javascript
// Generate test NPCs
RGNPCSystem.generateTestNPCs(10, 'tavern');

// Get system info
RGNPCSystem.debugInfo();

// Get specific NPC
const npc = RGNPCSystem.getRGNPC('rgnpc_1234567890_1234');

// Force save data
RGNPCSystem.savePersistedData();

// Clear all data (use with caution!)
localStorage.removeItem('rgnpc_data');
```

### Relationship Manipulation
```javascript
// Boost relationship with specific NPC
RGNPCSystem.updateRelationship('rgnpc_id', 'trust', 5);
RGNPCSystem.updateRelationship('rgnpc_id', 'affection', 3);

// Introduce all NPCs in location
const npcs = RGNPCSystem.getNPCsInLocation('tavern');
npcs.forEach(npc => RGNPCSystem.introduceNPC(npc.rgnpcId));
```

## Performance Considerations

### Memory Management
- NPCs stored in Maps for O(1) lookup
- Location populations use Sets for efficient operations
- Lazy loading of schedule calculations

### Scalability
- System designed to handle thousands of NPCs
- Efficient serialization for persistence
- Minimal memory footprint per NPC

### Optimization Tips
- Use location-based population limits
- Consider NPC cleanup for very old, unused NPCs
- Monitor localStorage usage in long-running games

## Troubleshooting

### Common Issues

1. **NPCs not appearing**: Check if location is populated
2. **Relationship changes not saving**: Verify event triggers are firing
3. **Names not generating**: Ensure name pools are loaded
4. **UI not updating**: Check if PeopleOverlay is initialized

### Debug Mode
Set `window.DEBUG_MODE = true` to enable:
- Debug information in People overlay
- Additional console logging
- Extended NPC information display

## Contributing

### Adding New Archetypes
1. Add archetype definition to `npc_archetypes.js`
2. Include preferred traits, motivations, and inclinations
3. Add location weights if needed
4. Update occupation mappings

### Expanding Name Pools
1. Add new names to appropriate race/gender categories
2. Include surnames for full name generation
3. Consider regional variants for cultural depth

### New Personality Elements
1. Add traits to `personality_traits.js` with conflict definitions
2. Add motivations to `motivations.js` with descriptive tags
3. Add social styles to `social_styles.js`

This system provides a robust foundation for creating thousands of unique, persistent NPCs that enhance the living world experience of your text-based RPG.
