setup.NPCs = [];

setup.generateNPC = function (gender, race, archetypeName, seed) {
    const archetype = setup.Archetypes[archetypeName];
    const rng = new Math.seedrandom(seed ?? Math.random());

    const namePool = setup.NamePools[race]?.[gender];
    const name = namePool[Math.floor(rng() * namePool.length)];

    const stats = {};
    for (let stat in archetype.statRanges) {
        const [min, max] = archetype.statRanges[stat];
        stats[stat] = Math.floor(rng() * (max - min + 1)) + min;
    }

    const trait = setup.Traits[Math.floor(rng() * setup.Traits.length)];
    const inclination = setup.Inclinations[Math.floor(rng() * setup.Inclinations.length)];
    const style = archetype.styles[Math.floor(rng() * archetype.styles.length)];

    const npc = {
        id: `npc-${Date.now()}-${Math.floor(rng() * 1000)}`,
        name,
        gender,
        race,
        archetype: archetypeName,
        stats,
        trait,
        inclination,
        style
    };

    setup.NPCs.push(npc);
    return npc;
};

setup.filterNPCs = function (criteria = {}) {
    return setup.NPCs.filter(npc => {
        return Object.entries(criteria).every(([key, val]) => {
            return npc[key] === val || (Array.isArray(val) && val.includes(npc[key]));
        });
    });
};
