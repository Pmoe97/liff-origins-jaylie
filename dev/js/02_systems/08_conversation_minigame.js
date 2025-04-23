setup.ConvoGame = {
  start(npcId) {
    const npc = State.variables.characters[npcId];
    if (!npc) {
      if (State.variables.DEBUG || setup.DEBUG) {
        console.warn(`[ConvoGame] Could not start; NPC '${npcId}' not found.`);
      }
      return;
    }

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

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoGame] Conversation started with:`, npcId);
    }
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
    const finalChance = Math.clamp(Math.round(rawChance), 5, 95);

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoGame] SuccessChance for '${tropeKey}':`, {
        playerSkill,
        baseDifficulty,
        traitMod,
        turnMod,
        promptMod,
        finalChance
      });
    }

    return finalChance;
  },

  resolveChoice(tropeKey) {
    const convo = State.temporary.convo;
    const npc = State.variables.characters[convo.npcId];
    const chance = setup.ConvoGame.getSuccessChance(tropeKey);
    const trope = setup.ConvoTropes[tropeKey];
    const success = Math.random() * 100 < chance;

    convo.history.push({ tropeKey, success, turn: convo.turn });
    convo.turn++;

    if (success) {
      const effects = trope.effects;
      const trust = (effects.trust ?? 0) * convo.rapport;
      const affection = (effects.affection ?? 0) * convo.rapport;

      npc.trust += trust;
      npc.affection += affection;
      convo.trustGained += trust;
      convo.affectionGained += affection;
      npc.rapport += 0.1;

      const xpGained = random(1, 3);
      setup.gainSkillXP?.(trope.skill, xpGained);

      if (State.variables.DEBUG || setup.DEBUG) {
        console.log(`[ConvoGame] SUCCESS - '${tropeKey}'`, {
          chance,
          skill: trope.skill,
          xpGained,
          trust,
          affection,
          updatedTrust: npc.trust,
          updatedAffection: npc.affection
        });
      }

    } else {
      convo.tension++;
      npc.tension = convo.tension;
      const maxTension = npc.maxTension ?? 3;

      if (State.variables.DEBUG || setup.DEBUG) {
        console.log(`[ConvoGame] FAILURE - '${tropeKey}'`, {
          chance,
          currentTension: convo.tension,
          maxTension
        });
      }

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
    if (!item || item.type !== "misc") {
      if (State.variables.DEBUG || setup.DEBUG) {
        console.warn(`[ConvoGame] Invalid gift item:`, itemId);
      }
      return false;
    }

    npc.rapport += (item.rapportBoost ?? 0.2);
    convo.giftsGiven.push(itemId);
    State.variables.inventory.misc = State.variables.inventory.misc.filter(i => i !== itemId);

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoGame] Gift given:`, itemId, `(Rapport now: x${npc.rapport.toFixed(2)})`);
    }

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

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoGame] Conversation ended with result: '${result}'`, {
        trust: npc.trust,
        affection: npc.affection,
        tension: npc.tension
      });
    }
  },

  close() {
    setup.ConvoPromptTracker?.reset();
    delete State.temporary.convo;

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoGame] Conversation overlay closed and reset.`);
    }
  }
};

// ⬇️ Skill XP Gain
setup.gainSkillXP = function(skillName, amount) {
  if (!State.variables.skillXP) State.variables.skillXP = {};
  if (!State.variables.skillXP[skillName]) State.variables.skillXP[skillName] = 0;
  State.variables.skillXP[skillName] += amount;

  if (State.variables.DEBUG || setup.DEBUG) {
    console.log(`[XP] +${amount} XP gained in ${skillName} (Total: ${State.variables.skillXP[skillName]})`);
  }
};
