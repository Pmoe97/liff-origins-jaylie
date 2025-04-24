setup.ConvoUI = {
  renderMinigame(npcId) {
    setup.ConvoGame.start(npcId);
    const npc = State.variables.characters[npcId];
    const convo = State.temporary.convo;

    const overlay = document.getElementById("conversation-overlay");
    if (!overlay) return;

    overlay.style.display = "block"; // <-- Ensures the overlay becomes visible

    document.getElementById("convo-avatar").src = npc.avatar;
    document.getElementById("convo-npc-name").textContent = npc.name;
    document.getElementById("convo-npc-style").textContent = `Social Style: ${npc.socialStyle ?? "—"}`;

    document.querySelector(".convo-choices").style.display = "block";
    document.querySelector(".convo-actions").style.display = "flex";
    document.querySelector(".convo-results").style.display = "none";

    setup.ConvoPromptTracker?.reset();
    setup.ConvoUI.updateMeta();
    setup.ConvoUI.renderPrompt();
    setup.ConvoUI.renderChoices();

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoUI] Minigame started with NPC:`, npc);
    }
  },

  updateMeta() {
    const convo = State.temporary.convo;
    const npc = State.variables.characters[convo.npcId];
    const maxTension = npc.maxTension ?? 3;

    document.getElementById("convo-turn").textContent = `Turn: ${convo.turn}`;
    document.getElementById("convo-rapport").textContent = `Rapport: x${convo.rapport.toFixed(2)}`;
    document.getElementById("convo-tension").textContent = `Tension: ${convo.tension}/${maxTension}`;
    document.getElementById("convo-gains").textContent = `Gains: ❤️ +${Math.round(convo.affectionGained)} | 🤝 +${Math.round(convo.trustGained)}`;

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoUI] Updated Meta`, {
        turn: convo.turn,
        rapport: convo.rapport,
        tension: convo.tension,
        trustGained: convo.trustGained,
        affectionGained: convo.affectionGained
      });
    }
  },

  renderPrompt() {
    const convo = State.temporary.convo;
    const npc = State.variables.characters[convo.npcId];
    const prompt = setup.getConvoPrompt?.(npc) ?? { text: "…", baseDifficultyMod: 0 };

    convo.promptMod = prompt.baseDifficultyMod;
    setup.ConvoPromptTracker?.markShown(prompt.text);
    document.getElementById("convo-npc-prompt").textContent = `“${prompt.text}”`;

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoUI] Prompt Rendered:`, prompt);
    }
  },

  renderChoices() {
    const choices = document.getElementById("convo-choices");
    choices.innerHTML = "";

    const availableKeys = setup.pickRandomTropes(6);

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoUI] Picked Tropes:`, availableKeys);
    }

    for (const tropeKey of availableKeys) {
      const trope = setup.ConvoTropes[tropeKey];
      const chance = setup.ConvoGame.getSuccessChance(tropeKey);
      const btn = document.createElement("button");

      btn.textContent = `${trope.label} ${chance}% (${Object.entries(trope.effects).map(([k, v]) => `+${v} ${k}`).join(", ")})`;
      btn.onclick = () => {
        setup.ConvoGame.resolveChoice(tropeKey);
        setup.ConvoUI.updateMeta();
        setup.ConvoUI.renderPrompt();
        setup.ConvoUI.renderChoices();
      };

      choices.appendChild(btn);
    }
  },

  showResultsScreen() {
    const convo = State.temporary.convo;
    document.querySelector(".convo-choices").style.display = "none";
    document.querySelector(".convo-actions").style.display = "none";
    document.querySelector(".convo-results").style.display = "block";

    document.getElementById("convo-summary-gains").textContent = `You gained ❤️ +${Math.round(convo.affectionGained)} Affection and 🤝 +${Math.round(convo.trustGained)} Trust`;
    document.getElementById("convo-summary-rapport").textContent = `Final Rapport Multiplier: x${convo.rapport.toFixed(2)}`;
    document.getElementById("convo-summary-gifts").textContent = `Gifts Given: ${convo.giftsGiven.length > 0 ? convo.giftsGiven.join(", ") : "None"}`;

    setup.ConvoGame.end();

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoUI] Results shown.`, convo);
    }
  },

  giveGiftMenu() {
    alert("Gift system not yet implemented!");
  }
};
