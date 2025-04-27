// 09_conversation_ui.js

setup.ConvoUI = {
  renderMinigame(npcId) {
    window.openOverlay("convo-minigame-page");
  
    setTimeout(() => {
      setup.ConvoGame.start(npcId);
  
      // Attach End Conversation button logic
      const endButton = document.getElementById("end-button");
      if (endButton) {
        endButton.onclick = () => {
          setup.ConvoGame.exitEarly();
        };
      }
  
      const giftButton = document.getElementById("gift-button");
      if (giftButton) {
        giftButton.onclick = () => {
          setup.ConvoUI.giveGiftMenu();
        };
      }
  
    }, 100); // slight delay to ensure overlay body contents have been injected
  
    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoUI] Minigame started with NPC: ${npcId}`);
    }
  },
  
  
  render() {
    const convo = State.temporary.convo;
    const npc = State.variables.characters[convo.npcId];
  
    // Set NPC name
    document.getElementById("convo-npc-name").textContent = npc.known ? npc.name : "???";
  
    // Set NPC prompt
    const promptObj = setup.getConvoPrompt(npc);
    convo.currentPrompt = promptObj;
    document.getElementById("convo-npc-prompt").textContent = promptObj.text;
  
    // Set Avatars
    document.getElementById("convo-avatar").src = npc.avatar || "images/placeholder_npc.png";
    document.getElementById("player-avatar").src = "images/portrait_jaylie.png"; // or player avatar logic later
  
    // Inject choices
    setup.ConvoGame.injectChoices(promptObj);
  
    if (State.variables.DEBUG || setup.DEBUG) {
      console.log("[ConvoUI] Minigame UI rendered:", {
        npc: convo.npcId,
        prompt: promptObj,
      });
    }
  },
  openTutorial() {
    const overlay = document.getElementById("tutorial-overlay");
    if (overlay) {
      overlay.classList.add("active");
      overlay.classList.remove("hidden");
    }
  },

  closeTutorial() {
    const overlay = document.getElementById("tutorial-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      overlay.classList.add("hidden");
    }
  },
  
  updateMeta() {
    const convo = State.temporary.convo;
    const npc = State.variables.characters[convo.npcId];

    document.getElementById("convo-turn").textContent = convo.turn;
    document.getElementById("convo-rapport").textContent = convo.rapport.toFixed(1);
    document.getElementById("convo-tension").textContent = `${convo.tension} / ${convo.maxTension}`;
    document.getElementById("gain-trust").textContent = convo.trustGained;
    document.getElementById("gain-affection").textContent = convo.affectionGained;

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log(`[ConvoUI] Meta updated:`, {
        turn: convo.turn,
        rapport: convo.rapport,
        tension: convo.tension,
        trust: convo.trustGained,
        affection: convo.affectionGained,
      });
    }
  },

  closeMinigame() {
    const overlay = document.getElementById("conversation-overlay");
    if (overlay) {
      overlay.classList.add("overlay-hidden");
    }

    if (State.variables.DEBUG || setup.DEBUG) {
      console.log("[ConvoUI] Minigame overlay hidden.");
    }
  },

  giveGiftMenu() {
    alert("Gift system not yet implemented!");
    if (State.variables.DEBUG || setup.DEBUG) {
      console.log("[ConvoUI] Gift system placeholder triggered.");
    }
  }
  
};
setup.ConvoUI.animateChoices = function(container) {
  const buttons = container.querySelectorAll("button");
  buttons.forEach((btn, index) => {
    setTimeout(() => {
      btn.classList.add("animate-choice");
    }, index * 100);
  });
};



