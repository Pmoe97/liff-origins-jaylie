/* To track stats throughout my game I have to use these functions in all of the appropriate places when programming these different systems and events.

// Combat tracking
StatsTracker.trackCombat('kill', { enemyType: 'Goblin' });
StatsTracker.trackCombat('damage_dealt', { amount: 50, critical: true });

// Social tracking
StatsTracker.trackSocial('meet', { npcId: 'merchant_bob' });
StatsTracker.trackSocial('quest', { status: 'completed' });

// Economic tracking
StatsTracker.trackEconomic('earn', { amount: 100 });
StatsTracker.trackEconomic('spend', { amount: 50, item: 'Health Potion' });

// Exploration tracking
StatsTracker.trackExploration('discover', { locationId: 'hidden_cave' });
StatsTracker.trackExploration('travel', { distance: 5 });

// Intimate tracking
StatsTracker.trackIntimate('partner', { partnerId: 'npc_alice' });
StatsTracker.trackIntimate('act', { type: 'oral', role: 'given' });

// Misc tracking
StatsTracker.trackMisc('sleep');
StatsTracker.trackMisc('playtime', { minutes: 5 });

*/
// Stats Central Logic - Comprehensive tracking system
window.StatsTracker = (function() {
    'use strict';
    
    // Initialize stats structure with categories
    const initializeStats = function() {
        if (!State.variables.playerStats) {
            State.variables.playerStats = {
                combat: {
                    totalKills: 0,
                    killsByType: {},
                    totalDamageDealt: 0,
                    totalDamageTaken: 0,
                    criticalHits: 0,
                    missedAttacks: 0,
                    battlesWon: 0,
                    battlesLost: 0,
                    battlesFled: 0
                },
                social: {
                    peopleNet: 0,
                    uniqueNPCs: new Set(),
                    conversationsHad: 0,
                    questsAccepted: 0,
                    questsCompleted: 0,
                    questsFailed: 0,
                    favorsAsked: 0,
                    favorsDone: 0,
                    timesLied: 0,
                    timesTruthful: 0
                },
                economic: {
                    totalMoneyEarned: 0,
                    totalMoneySpent: 0,
                    largestPurchase: { amount: 0, item: '' },
                    itemsBought: 0,
                    itemsSold: 0,
                    timesBartered: 0,
                    timesBroke: 0
                },
                exploration: {
                    locationsDiscovered: 0,
                    uniqueLocations: new Set(),
                    totalDistanceTraveled: 0,
                    secretsFound: 0,
                    treasuresLooted: 0,
                    trapsTriggered: 0,
                    timesLost: 0
                },
                intimate: {
                    totalPartners: 0,
                    uniquePartners: new Set(),
                    kisses: 0,
                    intimateActs: {
                        given: {},
                        received: {}
                    },
                    orgasmsAchieved: 0,
                    orgasmsGiven: 0,
                    timesRejected: 0,
                    timesSeduced: 0
                },
                misc: {
                    totalPlayTime: 0,
                    timesSlept: 0,
                    mealsEaten: 0,
                    itemsConsumed: 0,
                    timesRested: 0,
                    gamesSaved: 0,
                    timesKnocked: 0
                }
            };
        }
    };
    
    // Track combat stats
    const trackCombat = function(action, data = {}) {
        initializeStats();
        const stats = State.variables.playerStats.combat;
        
        switch(action) {
            case 'kill':
                stats.totalKills++;
                if (data.enemyType) {
                    stats.killsByType[data.enemyType] = (stats.killsByType[data.enemyType] || 0) + 1;
                }
                break;
            case 'damage_dealt':
                stats.totalDamageDealt += data.amount || 0;
                if (data.critical) stats.criticalHits++;
                break;
            case 'damage_taken':
                stats.totalDamageTaken += data.amount || 0;
                break;
            case 'miss':
                stats.missedAttacks++;
                break;
            case 'battle_end':
                if (data.result === 'won') stats.battlesWon++;
                else if (data.result === 'lost') stats.battlesLost++;
                else if (data.result === 'fled') stats.battlesFled++;
                break;
        }
    };
    
    // Track social interactions
    const trackSocial = function(action, data = {}) {
        initializeStats();
        const stats = State.variables.playerStats.social;
        
        switch(action) {
            case 'meet':
                if (data.npcId && !stats.uniqueNPCs.has(data.npcId)) {
                    stats.peopleNet++;
                    stats.uniqueNPCs.add(data.npcId);
                }
                break;
            case 'conversation':
                stats.conversationsHad++;
                break;
            case 'quest':
                if (data.status === 'accepted') stats.questsAccepted++;
                else if (data.status === 'completed') stats.questsCompleted++;
                else if (data.status === 'failed') stats.questsFailed++;
                break;
            case 'lie':
                stats.timesLied++;
                break;
            case 'truth':
                stats.timesTruthful++;
                break;
        }
    };
    
    // Track economic activity
    const trackEconomic = function(action, data = {}) {
        initializeStats();
        const stats = State.variables.playerStats.economic;
        
        switch(action) {
            case 'earn':
                stats.totalMoneyEarned += data.amount || 0;
                break;
            case 'spend':
                stats.totalMoneySpent += data.amount || 0;
                if (data.amount > stats.largestPurchase.amount) {
                    stats.largestPurchase = { amount: data.amount, item: data.item || 'Unknown' };
                }
                break;
            case 'buy':
                stats.itemsBought++;
                break;
            case 'sell':
                stats.itemsSold++;
                break;
            case 'barter':
                stats.timesBartered++;
                break;
            case 'broke':
                stats.timesBroke++;
                break;
        }
    };
    
    // Track exploration
    const trackExploration = function(action, data = {}) {
        initializeStats();
        const stats = State.variables.playerStats.exploration;
        
        switch(action) {
            case 'discover':
                if (data.locationId && !stats.uniqueLocations.has(data.locationId)) {
                    stats.locationsDiscovered++;
                    stats.uniqueLocations.add(data.locationId);
                }
                break;
            case 'travel':
                stats.totalDistanceTraveled += data.distance || 1;
                break;
            case 'secret':
                stats.secretsFound++;
                break;
            case 'treasure':
                stats.treasuresLooted++;
                break;
            case 'trap':
                stats.trapsTriggered++;
                break;
            case 'lost':
                stats.timesLost++;
                break;
        }
    };
    
    // Track intimate interactions
    const trackIntimate = function(action, data = {}) {
        initializeStats();
        const stats = State.variables.playerStats.intimate;
        
        switch(action) {
            case 'partner':
                if (data.partnerId && !stats.uniquePartners.has(data.partnerId)) {
                    stats.totalPartners++;
                    stats.uniquePartners.add(data.partnerId);
                }
                break;
            case 'kiss':
                stats.kisses++;
                break;
            case 'act':
                if (data.type && data.role) {
                    const roleStats = data.role === 'given' ? stats.intimateActs.given : stats.intimateActs.received;
                    roleStats[data.type] = (roleStats[data.type] || 0) + 1;
                }
                break;
            case 'orgasm':
                if (data.given) stats.orgasmsGiven++;
                else stats.orgasmsAchieved++;
                break;
            case 'rejected':
                stats.timesRejected++;
                break;
            case 'seduced':
                stats.timesSeduced++;
                break;
        }
    };
    
    // Track miscellaneous stats
    const trackMisc = function(action, data = {}) {
        initializeStats();
        const stats = State.variables.playerStats.misc;
        
        switch(action) {
            case 'playtime':
                stats.totalPlayTime += data.minutes || 1;
                break;
            case 'sleep':
                stats.timesSlept++;
                break;
            case 'eat':
                stats.mealsEaten++;
                break;
            case 'consume':
                stats.itemsConsumed++;
                break;
            case 'rest':
                stats.timesRested++;
                break;
            case 'save':
                stats.gamesSaved++;
                break;
            case 'knocked':
                stats.timesKnocked++;
                break;
        }
    };
    
    // Get formatted stats for display
    const getFormattedStats = function() {
        initializeStats();
        const stats = State.variables.playerStats;
        
        // Convert Sets to arrays for display
        const formatted = JSON.parse(JSON.stringify(stats));
        formatted.social.uniqueNPCs = Array.from(stats.social.uniqueNPCs || []);
        formatted.exploration.uniqueLocations = Array.from(stats.exploration.uniqueLocations || []);
        formatted.intimate.uniquePartners = Array.from(stats.intimate.uniquePartners || []);
        
        return formatted;
    };
    
    // Public API
    return {
        trackCombat,
        trackSocial,
        trackEconomic,
        trackExploration,
        trackIntimate,
        trackMisc,
        getStats: getFormattedStats,
        init: initializeStats
    };
})();

// Initialize on game start
$(document).on(':passagestart', function() {
    StatsTracker.init();
});
