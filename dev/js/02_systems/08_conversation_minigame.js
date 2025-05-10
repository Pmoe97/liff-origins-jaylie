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
      maxTurn: 25,
      tension: 0,
      maxTension: npc.maxTension ?? 3,
      rapport: 0.5, // (make sure initial rapport is 0.5, right?)
      trustGained: 0,
      affectionGained: 0,
      ended: false,
      usedTropes: [],
      giftsGiven: [],
      promptMod: 0,
      heatTier: 1,
      lastCheckpoint: {
        trust: 0,
        affection: 0,
        turn: 0
      },
      luckLog: [], // ✅ Comma placed correctly, and luckLog is OUTSIDE lastCheckpoint
    };
    
  
    this.render();
  },
  openTutorial() {
    document.getElementById("tutorial-overlay").classList.add("active");
  },
  
  closeTutorial() {
    document.getElementById("tutorial-overlay").classList.remove("active");
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
    document.getElementById("convo-tension").textContent = convo.tension;
    document.getElementById("convo-max-tension").textContent = convo.maxTension;
  
    document.getElementById("convo-avatar").src = npc.avatar || "images/portrait_default.png";
  
    this.injectChoices();
  },
  
  applyHeatEffects() {
    const convoOverlay = document.querySelector(".convo-window");
    if (!convoOverlay) return;
  
    // Remove old heat classes
    convoOverlay.classList.remove("heat-1", "heat-2", "heat-3", "heat-4", "heat-5");
  
    const convo = State.temporary.convo;
    const heatTier = convo.heatTier ?? 1;
  
    // Apply new heat class based on current heat tier
    convoOverlay.classList.add(`heat-${heatTier}`);
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
  
    const unused = tierList.filter(trope => !convo.usedTropes.includes(trope.label));
    const shuffled = unused.sort(() => Math.random() - 0.5);
    const finalTropes = shuffled.slice(0, 4);
  
    if (finalTropes.length === 0) {
      choiceBox.innerHTML = "<em>No conversation options available.</em>";
      return;
    }
  
    for (const trope of finalTropes) {
      const btn = document.createElement("button");
      btn.textContent = `${trope.label} (${this.getSuccessChance(trope)}%)`;
      btn.onclick = () => this.handleChoice(trope);
      choiceBox.appendChild(btn);
    }
       
    setup.ConvoUI.animateChoices(choiceBox);
  },

  handleChoice(trope) {
    const convo = State.temporary.convo;
    const npc = State.variables.characters[convo.npcId];
  
    convo.usedTropes.push(trope.label.toLowerCase().replace(/\s+/g, ""));
  
    const roll = window.crypto.getRandomValues(new Uint32Array(1))[0] / 2**32 * 100;

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoGame] 🎲 Roll: ${roll.toFixed(2)} vs. Success Chance: ${this.getSuccessChance(trope)}%`);
    }

    const chance = this.getSuccessChance(trope);
    const success = roll <= chance;
    // Log luck tracking
    State.temporary.convo.luckLog.push({
      chance: chance,  // The success chance offered
      result: success ? 1 : 0 // 1 = success, 0 = fail
    });

    const clickedButton = event?.target ?? null; // Get the clicked button for particles
  
    if (success) {
      if (trope.effects.trust) {
        convo.trustGained += trope.effects.trust;
        setup.ConvoGame.spawnParticles("trust", trope.effects.trust, clickedButton);
        for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
          setup.ConvoGame.spawnParticles("trust-bonus", 1, clickedButton);
        }
      }
      if (trope.effects.affection) {
        convo.affectionGained += trope.effects.affection;
        setup.ConvoGame.spawnParticles("affection", trope.effects.affection, clickedButton);
        for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
          setup.ConvoGame.spawnParticles("affection-bonus", 1, clickedButton);
        }
      }
      // 🚫 No rapport gain here anymore!
    }
     else {
      convo.tension++;
  
      // Fail particles
      if (trope.effects.trust) {
        setup.ConvoGame.spawnParticles("fail-trust", 1, clickedButton);
      } else if (trope.effects.affection) {
        setup.ConvoGame.spawnParticles("fail-affection", 1, clickedButton);
      }
  
      // Shake and grey out button
      if (clickedButton) {
        clickedButton.classList.add("shake", "grey-out");
        setTimeout(() => {
          clickedButton.classList.remove("shake", "grey-out");
        }, 300);
      }
    }
  
    this.updateTurnProgress(success);
  
    if (convo.turn % 5 === 0) {
      convo.lastCheckpoint = {
        trust: convo.trustGained,
        affection: convo.affectionGained,
        turn: convo.turn
      };
    
      convo.rapport = Math.min(convo.rapport + 0.1, 2.0); // Cap rapport at 2.0 for safety
      console.log(`[ConvoGame] 🧪 Rapport increased to ${convo.rapport.toFixed(2)} at checkpoint.`);
      console.log(`[ConvoGame] ✅ Checkpoint saved at turn ${convo.turn}`, convo.lastCheckpoint);
    }
    
  
    convo.turn++;
  
    // Cap the game manually at turn 26
    if (convo.turn > 25) {
      convo.ended = true;
      console.log(`[ConvoGame] 🛑 Maximum turn cap reached at turn ${convo.turn}. Ending minigame.`);
      this.end();
      return;
    }
  
    if ((convo.turn - 1) % 5 === 0 && convo.turn > 1) {
      convo.heatTier = Math.min(convo.heatTier + 1, 5);
      console.log(`[ConvoGame] 🔥 Heat tier escalated to ${convo.heatTier}`);
    }
  
    this.applyHeatEffects();
  
    if (convo.tension >= convo.maxTension) {
      convo.trustGained = 0;
      convo.affectionGained = 0;
      convo.ended = true;
      console.log(`[ConvoGame] ❌ Max tension reached. Progress wiped.`);
      this.end();
      return;
    }
  
    this.render();
  },

  getSuccessChance(trope) {
    const convo = State.temporary.convo;
    const globalDifficultyModifier = 20; // 🔥 Global difficulty tweak: lowers success by 20%
  
    const base = 100 - trope.baseDifficulty - globalDifficultyModifier;
    const adjusted = base - (convo.promptMod * 5); // Still gets harder every checkpoint
  
    return Math.max(5, adjusted); // ✅ Only a floor at 5%, no ceiling
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
  
    // Calculate final trust/affection based on rapport multiplier
    const finalMultiplier = convo.rapport ?? 1.0;
    const rawTrust = convo.trustGained;
    const rawAffection = convo.affectionGained;
    const finalTrust = +(rawTrust * finalMultiplier).toFixed(2);
    const finalAffection = +(rawAffection * finalMultiplier).toFixed(2);
  
    // Save the final scaled values
    convo.trustGained = finalTrust;
    convo.affectionGained = finalAffection;
  
   // Display results
    document.getElementById("convo-result-status").textContent = convo.tension >= convo.maxTension ? "Failure" : "Success!";

    document.getElementById("convo-result-trust").innerHTML = `
      Base Trust: +${rawTrust} | Base Affection: +${rawAffection}<br>
      Rapport Multiplier: x${finalMultiplier.toFixed(2)}
      <hr style="border: 0; height: 1px; background: #555; margin: 8px 0;">
      <strong>Final Trust: +${finalTrust} | Final Affection: +${finalAffection}</strong>
    `;

    document.getElementById("convo-result-affection").innerHTML = "";

  
    const closeBtn = document.getElementById("convo-result-close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        window.closeOverlay();
      };
    }
    // ✅ After overlay is closed, refresh conversation UI if we're still on that NPC
    const npcId = convo.npcId;
    const phase = State.variables.currentPhase;
    const currentNPC = State.variables.currentNPC;

    if (currentNPC === npcId && typeof setup?.[`${npcId}_Conversation_Options_${phase}`] === "function") {
      setTimeout(() => {
        console.log(`[ConvoGame] 🔁 Refreshing conversation UI for ${npcId} in phase ${phase}`);
        setup[`${npcId}_Conversation_Options_${phase}`]();
      }, 300);
    }

    // Disable all leftover choice buttons
    const buttons = document.querySelectorAll("#convo-choices button");
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.5";
    });
  
    // Save gains back to NPC
    const npc = State.variables.characters[convo.npcId];
    if (npc) {
      npc.trust = (npc.trust || 0) + finalTrust;
      npc.affection = (npc.affection || 0) + finalAffection;
    }
  
    console.log("[ConvoGame] Conversation finished.", convo);
  
    // Luck Tracker Report
    const luckLog = convo.luckLog ?? [];
    if (luckLog.length > 0) {
      const totalExpected = luckLog.reduce((sum, entry) => sum + (entry.chance / 100), 0);
      const totalActual = luckLog.reduce((sum, entry) => sum + entry.result, 0);
      const luckScore = +(totalActual - totalExpected).toFixed(2);
  
      let luckDescriptor = "Average Luck";
      if (luckScore >= 1) luckDescriptor = "Incredibly Lucky!";
      else if (luckScore >= 0.5) luckDescriptor = "Very Lucky!";
      else if (luckScore <= -1) luckDescriptor = "Cursed!";
      else if (luckScore <= -0.5) luckDescriptor = "Unlucky!";
  
      console.log(`[ConvoGame] 🍀 Session Luck Report:`);
      console.log(`Expected Successes: ${totalExpected.toFixed(2)}`);
      console.log(`Actual Successes: ${totalActual}`);
      console.log(`Luck Score: ${luckScore} (${luckDescriptor})`);
    }
  },
  
  

  updateTurnProgress(success) {
    const convo = State.temporary.convo;
    const segmentsContainer = document.querySelector(".turn-progress-bar");
    let segments = segmentsContainer.querySelectorAll(".turn-segment");
    const currentIndex = (convo.turn - 1) % 5;
  
    // If we are starting a new block (Turn 6, 11, 16...), rebuild the segments
    if (currentIndex === 0 && convo.turn > 1) {
      // Clear old segments
      segmentsContainer.querySelectorAll(".turn-segment").forEach(seg => seg.remove());
  
      // Create 5 new pending segments
      for (let i = 0; i < 5; i++) {
        const newSeg = document.createElement("div");
        newSeg.classList.add("turn-segment", "pending");
        segmentsContainer.insertBefore(newSeg, document.getElementById("convo-max-turn"));
      }
  
      // Refresh segment list
      segments = segmentsContainer.querySelectorAll(".turn-segment");
  
      // Also update the block number (5 ➔ 10 ➔ 15 ➔ etc.)
      const blockNumber = Math.ceil(convo.turn / 5) * 5;
      document.getElementById("convo-max-turn").textContent = blockNumber;
    }
  
    // Now safely mark the current turn's segment
    if (segments[currentIndex]) {
      segments[currentIndex].classList.remove("pending");
      segments[currentIndex].classList.add(success ? "success" : "fail");
    }
  },
  
  spawnParticles(type, count, originButton) {
    const container = document.getElementById("conversation-overlay");
    if (!container || !originButton) return;
  
    const originRect = originButton.getBoundingClientRect();
    const overlayRect = container.getBoundingClientRect();
    const originX = originRect.left + (originRect.width / 2) - overlayRect.left;
    const originY = originRect.top + (originRect.height / 2) - overlayRect.top;
  
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
  
      // Determine what kind of particle
      if (type === "trust") {
        particle.classList.add("trust-particle");
        particle.textContent = "🤝";
      } else if (type === "affection") {
        particle.classList.add("affection-particle");
        particle.textContent = "❤️";
      } else if (type === "trust-bonus") {
        particle.classList.add("trust-particle");
        particle.textContent = "⭐";
      } else if (type === "affection-bonus") {
        particle.classList.add("affection-particle");
        particle.textContent = "🌸";
      } else if (type === "fail-trust") {
        particle.classList.add("fail-particle");
        particle.textContent = "😢";
      } else if (type === "fail-affection") {
        particle.classList.add("fail-particle");
        particle.textContent = "💔";
      }
  
      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;
  
      container.appendChild(particle);
  
      // Animate with random directions if success, straight down if fail
      let targetX = originX;
      let targetY = originY;

      if (type.startsWith("fail")) {
        // FAIL = straight downward
        targetY = originY + (60 + Math.random() * 40);
      } else {
        // SUCCESS = random pop upward (-45 to +45 from UP)
        const angle = (Math.random() * 90) + 225; // 225° to 315°
        const distance = 60 + Math.random() * 40;
        const rad = angle * (Math.PI / 180);
        targetX = originX + Math.cos(rad) * distance;
        targetY = originY + Math.sin(rad) * distance; // +sin, not minus!
      }


      particle.animate([
        { transform: `translate(0px, 0px)`, opacity: 1 },
        { transform: `translate(${targetX - originX}px, ${targetY - originY}px)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 400,
        easing: "ease-out",
        fill: "forwards"
      });
  
      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 1200);
    }
  },
  
};
