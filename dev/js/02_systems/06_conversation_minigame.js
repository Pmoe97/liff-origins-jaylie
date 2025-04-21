// ================================
// Core Minigame Logic
// ================================

setup.ConvoGame = {
    start(npcId) {
      const npc = State.variables.characters[npcId];
      if (!npc) return;
  
      State.temporary.convo = {
        npcId,
        turn: 1,
        tension: npc.tension ?? 0,
        rapport: npc.rapport ?? 1.0,
        lastCheckpoint: 0,
        trustGained: 0,
        affectionGained: 0,
        giftsGiven: [],
        history: [],
        ended: false,
        result: null,
        promptMod: 0
      };
    },
  
    getSuccessChance(tropeKey) {
      const convo = State.temporary.convo;
      const npc = State.variables.characters[convo.npcId];
      const trope = setup.ConvoTropes[tropeKey];
      if (!npc || !trope) return 0;
  
      let playerSkill = State.variables.skills?.[trope.skill] ?? 0;
      let baseDifficulty = trope.baseDifficulty ?? 10;
      let traitMod = setup.getTraitModifier(npc, tropeKey);
      let turnMod = Math.max(0, convo.turn - 4);
      let promptMod = convo.promptMod ?? 0;
  
      let rawChance = 50 + (playerSkill * 5) - baseDifficulty - traitMod - turnMod - promptMod;
      return Math.clamp(Math.round(rawChance), 5, 95);
    },
  
    resolveChoice(tropeKey) {
      const convo = State.temporary.convo;
      const npc = State.variables.characters[convo.npcId];
      const chance = setup.ConvoGame.getSuccessChance(tropeKey);
      const trope = setup.ConvoTropes[tropeKey];
      const success = Math.random() * 100 < chance;
  
      convo.history.push({ tropeKey, success, turn: convo.turn });
      convo.turn++;
  
      const effects = trope.effects;
      if (success) {
        const trust = (effects.trust ?? 0) * convo.rapport;
        const affection = (effects.affection ?? 0) * convo.rapport;
        npc.trust += trust;
        npc.affection += affection;
        convo.trustGained += trust;
        convo.affectionGained += affection;
        npc.rapport += 0.1;
  
        const xpGained = random(1, 3);
        setup.gainSkillXP?.(trope.skill, xpGained);
      } else {
        convo.tension++;
        npc.tension = convo.tension;
        let maxTension = npc.maxTension ?? 3;
        if (convo.tension >= maxTension) {
          setup.ConvoGame.end("fail");
          return;
        }
      }
  
      if (convo.turn % 5 === 0) {
        convo.lastCheckpoint = convo.turn;
      }
    },
  
    giveGift(itemId) {
      const convo = State.temporary.convo;
      const npc = State.variables.characters[convo.npcId];
      const item = setup.getItemMetadata(itemId);
      if (!item || item.type !== "misc") return false;
  
      npc.rapport += (item.rapportBoost ?? 0.2);
      convo.giftsGiven.push(itemId);
      State.variables.inventory.misc = State.variables.inventory.misc.filter(i => i !== itemId);
      return true;
    },
  
    end(result = "manual") {
      const convo = State.temporary.convo;
      const npc = State.variables.characters[convo.npcId];
  
      convo.ended = true;
      convo.result = result;
  
      if (result === "fail") {
        npc.trust -= 1;
        npc.affection -= 1;
        npc.tension = 0;
      } else {
        npc.tension = convo.tension;
      }
    },
  
    close() {
      setup.ConvoPromptTracker?.reset();
      delete State.temporary.convo;
    }
  };
  
  setup.gainSkillXP = function(skillName, amount) {
    if (!State.variables.skillXP) State.variables.skillXP = {};
    if (!State.variables.skillXP[skillName]) State.variables.skillXP[skillName] = 0;
    State.variables.skillXP[skillName] += amount;
    UI.alert(`Gained ${amount} XP in ${skillName}`);
  };
  