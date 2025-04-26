// 08_conversation_minigame.js

setup.ConvoGame = {
  start(npcId) {
    const npc = State.variables.characters[npcId];
    if (!npc) {
      console.error(`[ConvoGame] Invalid NPC ID: ${npcId}`);
      return;
    }
  
    State.temporary.convo = {
      npcId,
      turn: 1,
      maxTurn: 999, // allow indefinite play unless manually ended or tension maxes
      tension: 0,
      maxTension: npc.maxTension ?? 3,
      rapport: npc.rapport ?? 1.0,
      trustGained: 0,
      affectionGained: 0,
      ended: false,
      usedTropes: [],
      giftsGiven: [],
      promptMod: 0,
      heatTier: 1, // 🔥 NOW INCLUDED!
      lastCheckpoint: {
        trust: 0,
        affection: 0,
        turn: 0
      }
    };
  
    this.render();
  },
  
  render() {
    const convo = State.temporary.convo;
    const npc = State.variables.characters[convo.npcId];
    if (!npc) return;

    // Increase difficulty with each checkpoint (every 5 turns)
    convo.promptMod = Math.floor((convo.turn - 1) / 5);

    const prompt = setup.getConvoPrompt(npc);
    convo.currentPrompt = prompt;

    document.getElementById("convo-npc-name").textContent = npc.name ?? "???";
    document.getElementById("convo-npc-prompt").textContent = prompt.text ?? "…";

    document.getElementById("gain-trust").textContent = convo.trustGained;
    document.getElementById("gain-affection").textContent = convo.affectionGained;
    document.getElementById("convo-rapport").textContent = convo.rapport.toFixed(1);
    document.getElementById("convo-turn").textContent = convo.turn;
    const nextCheckpoint = Math.ceil(convo.turn / 5) * 5;
    document.getElementById("convo-max-turn").textContent = nextCheckpoint; // Always display next checkpoint interval
    document.getElementById("convo-tension").textContent = convo.tension;
    document.getElementById("convo-max-tension").textContent = convo.maxTension;

    document.getElementById("convo-avatar").src = npc.avatar || "images/default-avatar.png";

    this.injectChoices();
  },

  injectChoices() {
    const convo = State.temporary.convo;
    const choiceBox = document.getElementById("convo-choices");
    if (!choiceBox) return;
  
    choiceBox.innerHTML = "";
  
    const tierList = setup.ConvoTropesByTier?.[convo.heatTier] ?? [];
  
    if (tierList.length === 0) {
      choiceBox.innerHTML = "<em>No conversation options available.</em>";
      console.warn(`[ConvoUI] No tropes found for HAWT™ tier ${convo.heatTier}`);
      return;
    }
  
    // Optionally remove used tropes to prevent repeats
    const unused = tierList.filter(trope => !convo.usedTropes.includes(trope.label));
  
    // Shuffle and select 4
    const shuffled = unused.sort(() => Math.random() - 0.5);
    const finalTropes = shuffled.slice(0, 4);
  
    if (finalTropes.length === 0) {
      choiceBox.innerHTML = "<em>No conversation options available.</em>";
      return;
    }
  
    for (const trope of finalTropes) {
      const btn = document.createElement("button");
      btn.textContent = `${trope.label} (${setup.ConvoGame.getSuccessChance(trope)}%)`;
      btn.onclick = () => setup.ConvoGame.handleChoice(trope);
      choiceBox.appendChild(btn);
    }
  },
  

  handleChoice(trope) {
    const convo = State.temporary.convo;
    const npc = State.variables.characters[convo.npcId];

    // Track trope as used
    convo.usedTropes.push(trope.label.toLowerCase().replace(/\s+/g, ""));

    const roll = Math.random() * 100;
    const chance = this.getSuccessChance(trope);
    const success = roll <= chance;

    if (success) {
      if (trope.effects.trust) {
        convo.trustGained += trope.effects.trust;
      }
      if (trope.effects.affection) {
        convo.affectionGained += trope.effects.affection;
      }
      convo.rapport += Object.values(trope.effects).reduce((a, b) => a + b, 0) * 0.1;
    } else {
      convo.tension++;
    }

    // Checkpoint every 5 turns
    if (convo.turn % 5 === 0) {
      convo.lastCheckpoint = {
        trust: convo.trustGained,
        affection: convo.affectionGained,
        turn: convo.turn
      };
      console.log(`[ConvoGame] ✅ Checkpoint saved at turn ${convo.turn}`, convo.lastCheckpoint);
    }

    convo.turn++;

    // Every checkpoint (5 turns), increase heatTier by 1 up to a max of 5
    if ((convo.turn - 1) % 5 === 0 && convo.turn > 1) {
    convo.heatTier = Math.min(convo.heatTier + 1, 5);
    console.log(`[ConvoGame] 🔥 Heat tier escalated to ${convo.heatTier}`);
  }


    // Failure: tension reached max
    if (convo.tension >= convo.maxTension) {
      convo.trustGained = 0;
      convo.affectionGained = 0;
      convo.ended = true;
      console.log(`[ConvoGame] ❌ Max tension reached. Progress wiped.`);
      this.end();
      return;
    }

    // Continue game
    this.render();
  },

  getSuccessChance(trope) {
    const convo = State.temporary.convo;
    const base = 100 - trope.baseDifficulty;
    const adjusted = base - (convo.promptMod * 5);
    return Math.max(5, Math.min(95, adjusted));
  },

  exitEarly() {
    const convo = State.temporary.convo;
    convo.trustGained = convo.lastCheckpoint.trust;
    convo.affectionGained = convo.lastCheckpoint.affection;
    convo.ended = true;
    console.log(`[ConvoGame] 🛑 Player exited manually. Reverting to last checkpoint.`);
    this.end();
  },

  end() {
    const convo = State.temporary.convo;
  
    const convoBody = document.getElementById("convo-body");
    const resultBox = document.getElementById("convo-results");
  
    if (convoBody) convoBody.classList.add("hidden");
    if (resultBox) resultBox.classList.remove("hidden");
  
    document.getElementById("convo-result-status").textContent = convo.tension >= convo.maxTension ? "Failure" : "Success!";
    document.getElementById("convo-result-trust").textContent = `Trust: +${convo.trustGained}`;
    document.getElementById("convo-result-affection").textContent = `Affection: +${convo.affectionGained}`;
  
    const closeBtn = document.getElementById("convo-result-close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        window.closeOverlay();
      };
    }
  
    console.log("[ConvoGame] Conversation finished.", convo);
  }
  
  
};
