State.variables.world = {
    // === Time and Calendar ===
    dayOfYear: 1,     // 1-400
    year: 12219,      // After Impact (AI)
    hour: 6,
    minute: 0,
    is24HourFormat: true,  // toggleable from settings
  
    // === Weather ===
    weather: "Clear", // Clear, Rain, Storm, Snow, Fog
  
    // === Location ===
    locationName: "Unknown",
  
    // === Environmental Flags (future expansion) ===
    specialEvent: null, // e.g., "Harvest Festival"
  };
  console.log("WorldData is loaded.");