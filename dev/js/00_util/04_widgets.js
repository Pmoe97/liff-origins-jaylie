/* Background Macro */
Macro.add("bg", {
	handler: function () {
		const arg = this.args[0];
		if (typeof arg === "string") {
			const path = "images/background_" + arg + ".png";
			State.variables.bgImage = path;
			State.variables.bgImageSetThisPassage = true;

			// Immediately apply to background
			const el = document.getElementById("background-image");
			if (el) {
				el.style.backgroundImage = `url('${path}')`;
				console.log(`🖼️ Background updated to: ${path}`);
			} else {
				console.warn("⚠️ Could not find #background element.");
			}
		} else {
			return this.error("Invalid argument to <<bg>>. Expected a string like 'tavern'.");
		}
	}
});

Macro.add('loadmap', {
    handler() {
        if (this.args.length === 0) {
            return this.error('No map ID specified.');
        }

        const mapId = this.args[0];
        const startX = this.args[1] ? parseInt(this.args[1], 10) : null;
        const startY = this.args[2] ? parseInt(this.args[2], 10) : null;

        // Validate start positions if provided
        if ((startX !== null && isNaN(startX)) || (startY !== null && isNaN(startY))) {
            return this.error('Invalid starting position coordinates.');
        }

        // Safety check: Make sure MapSystem is loaded
        if (typeof MapSystem === 'undefined' || typeof MapSystem.setCurrentMap !== 'function') {
            return this.error('MapSystem is not available.');
        }

        // Async IIFE to handle the map loading
        (async () => {
            try {
                if (startX !== null && startY !== null) {
                    await MapSystem.setCurrentMap(mapId, { x: startX, y: startY });
                } else {
                    await MapSystem.setCurrentMap(mapId);
                }
                console.log(`[loadmap] Successfully loaded map: ${mapId}`);
            } catch (e) {
                console.error(`[loadmap] Failed to load map: ${mapId}`, e);
                UI.alert(`Failed to load map: ${mapId}`);
            }
        })();
    }
});


Macro.add('unloadmap', {
    handler() {
        if (typeof MapSystem === 'undefined' || typeof MapSystem.clearCurrentMap !== 'function') {
            return this.error('MapSystem is not available.');
        }

        MapSystem.clearCurrentMap();
        console.log('[unloadmap] Map cleared.');
    }
});


Macro.add("know", {
	handler() {
		const charId = this.args[0];
		if (!charId || !State.variables.characters?.[charId]) {
			return this.error(`Unknown character ID: ${charId}`);
		}

		State.variables.characters[charId].known = true;
	}
});


/* *******************************************************************
<<ambientFlavorTags>> - Default: show flavor for all node tags (1 line, priority, no repeats)
<<ambientFlavorTags 3>> - Show up to 3 lines from node tags
<<ambientFlavorTags 2 "repeats">> - Allow repeated text
<<ambientFlavorTags "include:smoke1,smoke2">> - Only include specific tags
<<ambientFlavorTags "include:time">> - Include time-based flavor (special keyword)
<<ambientFlavorTags "include:weather">> - Include weather-based flavor (special keyword)
<<ambientFlavorTags "include:node,time">> - Include node tags + time flavor
<<ambientFlavorTags "force:rain">> - Force showing rain tags (for testing)
************************************************************************ */
Macro.add("ambientFlavorTags", {
	tags: null,
	handler() {
		// Parse arguments
		const args = this.args;
		const options = {
			maxLines: 1,           // Default to 1 line
			allowRepeats: false,   // Filter duplicates by default
			priorityMode: true,    // Use tag priority by default
			includeTags: [],       // Optional tag inclusion list
			includeSpecial: [],    // Special keywords like 'time', 'weather'
			forceTag: null         // Force a specific tag (for testing)
		};
		
		// Parse optional arguments
		for (let i = 0; i < args.length; i++) {
			if (typeof args[i] === 'number') {
				options.maxLines = args[i];
			} else if (typeof args[i] === 'string') {
				const arg = args[i].toLowerCase();
				if (arg === 'repeats') options.allowRepeats = true;
				else if (arg === 'nopriority') options.priorityMode = false;
				else if (arg.startsWith('include:')) {
					const includes = arg.substring(8).split(',').map(t => t.trim());
					// Separate special keywords from regular tags
					const specialKeywords = ['time', 'weather', 'season', 'node'];
					includes.forEach(inc => {
						if (specialKeywords.includes(inc)) {
							options.includeSpecial.push(inc);
						} else {
							options.includeTags.push(inc);
						}
					});
				} else if (arg.startsWith('force:')) {
					options.forceTag = arg.substring(6).trim();
				}
			}
		}
		
		// Collect tags to process
		let tags = [];
		
		// Handle forced tag
		if (options.forceTag) {
			tags = [options.forceTag];
		} else {
			// Add node tags if no specific includes or if 'node' is included
			if (options.includeTags.length === 0 || options.includeSpecial.includes('node')) {
				const mapState = State.variables.player?.mapState;
				if (mapState && mapState.currentMapId && mapState.position) {
					const pos = mapState.position;
					const node = MapSystem.getNodeAt(pos.x, pos.y);
					if (node && node.tags && Array.isArray(node.tags)) {
						tags = [...node.tags];
					}
				}
			}
			
			// Add specific included tags
			if (options.includeTags.length > 0) {
				// If specific tags requested, only use those (unless 'node' was also specified)
				if (!options.includeSpecial.includes('node')) {
					tags = options.includeTags;
				} else {
					// Filter node tags to only included ones
					tags = tags.filter(tag => options.includeTags.includes(tag));
				}
			}
			
			// Add special dynamic tags based on keywords
			if (options.includeSpecial.includes('time')) {
				const hour = new Date().getHours();
				const timeTag = (hour >= 6 && hour < 12) ? 'morning' :
							   (hour >= 12 && hour < 17) ? 'afternoon' :
							   (hour >= 17 && hour < 20) ? 'evening' : 'night';
				tags.push(timeTag);
			}
			
			if (options.includeSpecial.includes('weather')) {
				const weather = State.variables.world?.weather || 'clear';
				tags.push(weather);
			}
			
			if (options.includeSpecial.includes('season')) {
				const season = State.variables.world?.season || 'spring';
				tags.push(season);
			}
		}
		
		// Remove duplicate tags
		tags = [...new Set(tags)];
		
		// Sort by priority if enabled
		if (options.priorityMode && window.ambientFlavorTags?._priority) {
			const priorities = window.ambientFlavorTags._priority;
			tags.sort((a, b) => {
				const priorityA = priorities[a] || priorities.default || 0;
				const priorityB = priorities[b] || priorities.default || 0;
				return priorityB - priorityA; // Higher priority first
			});
		}
		
		// Collect eligible entries
		const eligibleEntries = [];
		const usedTexts = new Set(); // Track used texts to avoid repeats
		
		for (const tag of tags) {
			const entries = window.ambientFlavorTags?.[tag];
			if (!entries || !Array.isArray(entries)) continue;
			
			for (const entry of entries) {
				// Handle both string and object entries
				const entryObj = typeof entry === 'string' ? { text: entry, weight: 1 } : entry;
				
				// Check conditions if any
				if (entryObj.conditions && !this.evaluateConditions(entryObj.conditions)) {
					continue;
				}
				
				// Skip if already used and repeats not allowed
				if (!options.allowRepeats && usedTexts.has(entryObj.text)) {
					continue;
				}
				
				eligibleEntries.push({
					text: entryObj.text,
					weight: entryObj.weight || 1,
					tag: tag
				});
				
				// If priority mode, we might want to stop after finding entries for highest priority tag
				if (options.priorityMode && eligibleEntries.length >= options.maxLines) {
					break;
				}
			}
			
			if (options.priorityMode && eligibleEntries.length >= options.maxLines) {
				break;
			}
		}
		
		// Select entries based on weight
		const selectedEntries = [];
		const availableEntries = [...eligibleEntries];
		
		for (let i = 0; i < options.maxLines && availableEntries.length > 0; i++) {
			const entry = this.selectWeightedEntry(availableEntries);
			if (entry) {
				selectedEntries.push(entry);
				usedTexts.add(entry.text);
				
				// Remove selected entry from available pool
				const index = availableEntries.indexOf(entry);
				if (index > -1) {
					availableEntries.splice(index, 1);
				}
			}
		}
		
		// Output the selected entries
		if (selectedEntries.length > 0) {
			const lines = selectedEntries.map(entry => 
				`<p class="ambient-line ambient-${entry.tag}"><em>${entry.text}</em></p>`
			);
			this.output.append(lines.join("\n"));
		}
	},
	
	// Helper method to evaluate conditions
	evaluateConditions(conditions) {
		if (!conditions || !Array.isArray(conditions)) return true;
		
		for (const condition of conditions) {
			if (!this.evaluateSingleCondition(condition)) {
				return false;
			}
		}
		return true;
	},
	
	// Helper method to evaluate a single condition
	evaluateSingleCondition(condition) {
		const { type, name, value, operator = "==" } = condition;
		
		switch (type) {
			case "variable": {
				const actualValue = this.getNestedValue(State.variables, name);
				return this.compareValues(actualValue, operator, value);
			}
			case "time": {
				const hour = new Date().getHours();
				const timeOfDay = hour >= 6 && hour < 18 ? "day" : "night";
				return this.compareValues(timeOfDay, operator, value);
			}
			case "weather": {
				const weather = State.variables.world?.weather || "clear";
				return this.compareValues(weather, operator, value);
			}
			default:
				return true;
		}
	},
	
	// Helper to get nested object values
	getNestedValue(obj, path) {
		return path.split('.').reduce((current, key) => {
			return current && current[key] !== undefined ? current[key] : undefined;
		}, obj);
	},
	
	// Helper to compare values
	compareValues(a, operator, b) {
		switch (operator) {
			case "==": return a == b;
			case "!=": return a != b;
			case ">=": return a >= b;
			case "<=": return a <= b;
			case ">": return a > b;
			case "<": return a < b;
			default: return false;
		}
	},
	
	// Helper to select weighted entry
	selectWeightedEntry(entries) {
		if (!entries || entries.length === 0) return null;
		
		const totalWeight = entries.reduce((sum, entry) => sum + (entry.weight || 1), 0);
		let random = Math.random() * totalWeight;
		
		for (const entry of entries) {
			random -= (entry.weight || 1);
			if (random <= 0) {
				return entry;
			}
		}
		
		return entries[0]; // Fallback
	}
});


/* Dialogue Choice Button */
Macro.add("dialogueChoice", {
	skipArgs: false,
	handler() {
		const [label, target, flag] = this.args;
		const reusable = flag === "1" || flag === 1;

		if (!label || !target) {
			console.warn("<<dialogueChoice>> missing label or target");
			return;
		}

		const $button = $("<p>")
			.addClass("dialogue-choice")
			.text(label)
			.css("cursor", "pointer")
			.on("click", () => {
				console.groupCollapsed(`📌 [dialogueChoice] "${label}" → ${target}`);
				console.log("Reusable:", reusable);
				console.log("Phase:", State.variables.currentPhase);
				console.log("NPC:", State.variables.currentNPC);

				$button.remove();

				// Track globally if not reusable
				State.variables.usedDialogueOptions ??= {};
				if (!reusable) {
					State.variables.usedDialogueOptions[target] = true;
					console.log("✅ Marked non-reusable as used:", target);
				}

				// Track usage by phase + NPC
				const char = State.variables.currentNPC || "Unknown";
				const phase = State.variables.currentPhase ?? "X";
				const key = `Read_${phase}_${char}_${target}`;
				State.variables[key] ??= 0;
				State.variables[key]++;
				console.log("📊 Incremented:", key, "→", State.variables[key]);

				const $box = $("#convoBox");
				if ($box.length) {
					const preChildren = $box[0].children.length;

					$box.children().removeClass("active-entry").addClass("faded-entry");

					console.log("📥 Injecting widget: <<", target, ">>");
					try {
						Wikifier.wikifyEval(`<<${target}>>`);
					} catch (e) {
						console.error("❌ Error injecting widget:", e);
					}

					if (typeof setup.clearConvoChoices === "function") {
						setup.clearConvoChoices();
					} else {
						console.warn("⚠️ setup.clearConvoChoices not found");
					}

					const funcKey = `${char}_Conversation_Options_${phase}`;
					const phaseFunc = setup?.[funcKey];

					if (typeof phaseFunc === "function") {
						console.log(`🔁 Recalling setup.${funcKey}()`);
						phaseFunc();
					} else {
						console.warn(`⚠️ No phase function found for: ${funcKey}`);
					}

					setTimeout(() => {
						const box = $box[0];
						const entries = box.children;
						const newEntry = entries[preChildren];
						if (!newEntry) {
							console.warn("🕳 No new entry detected.");
							return;
						}

						const divider = document.createElement("div");
						divider.className = "dialogue-divider";
						box.insertBefore(divider, newEntry);

						newEntry.classList.add("active-entry");
						newEntry.classList.remove("faded-entry");

						const boxTop = box.getBoundingClientRect().top;
						const entryTop = newEntry.getBoundingClientRect().top;
						const offset = entryTop - boxTop;

						box.scrollTo({
							top: box.scrollTop + offset,
							behavior: "smooth"
						});
						console.log("🧭 Scrolled to new entry.");
					}, 10);
				} else {
					console.warn("⚠️ convoBox not found.");
				}

				console.groupEnd();
			});

		this.output.append($button[0]);
	}
});





/* Dialogue Tree Macro: Pulls current NPC & Phase and injects options */
Macro.add("DialogueTree", {
	handler() {
		const [characterName, phaseId] = this.args;

		if (!characterName || !phaseId) {
			console.error("DialogueTree: Missing character name or phase identifier.");
			return;
		}

		const v = State.variables;
		v.currentNPC = characterName;
		v.currentPhase = phaseId;

		if (typeof setup.clearConvoChoices === "function") {
			setup.clearConvoChoices();
		}

		// Always use flat naming: setup.char_Conversation_Options_phaseId
		const functionName = `${characterName}_Conversation_Options_${phaseId}`;
		const setupFunc = setup[functionName];

		if (typeof setupFunc !== "function") {
			console.error(`DialogueTree: Missing setup function '${functionName}'`);
			return;
		}

		console.log(`📂 [DialogueTree] Switching to: ${functionName}`);

		setTimeout(() => {
			const choiceEl = document.getElementById("convoChoices");
			if (!choiceEl) {
				console.warn("DialogueTree: #convoChoices not found.");
				return;
			}
			setupFunc();
		}, 0);
	}
});



/* Injects List of Choices into UI */
setup.addChoices = function (list) {
	const $container = $("#convoChoices");
	if (!$container.length) {
		console.warn("[addChoices] convoChoices not found.");
		return;
	}

	State.variables.usedDialogueOptions ??= {};

	list.forEach(([label, target, reusableFlag = 0]) => {
		const reusable = reusableFlag === 1 || reusableFlag === "1";
		const used = State.variables.usedDialogueOptions[target];

		if (used && !reusable) {
			console.log(`[addChoices] Skipping used non-reusable choice: ${target}`);
			return;
		}

		const macroCall = `<<dialogueChoice "${label}" "${target}" "${reusable ? 1 : 0}">>`;
		new Wikifier($container[0], macroCall);
	});
};

/* 📌 Minigame Start Button */
Macro.add("OpenConvoGame", {
	handler() {
		const npcId = this.args[0];
		
		// Debug logging
		console.log("[OpenConvoGame] Called with npcId:", npcId);
		console.log("[OpenConvoGame] State.variables.characters exists:", !!State.variables.characters);
		console.log("[OpenConvoGame] Available character IDs:", State.variables.characters ? Object.keys(State.variables.characters) : "none");
		
		// Check if characters need to be initialized
		if (!State.variables.characters) {
			console.warn("[OpenConvoGame] Characters not initialized, attempting to initialize...");
			if (typeof setup.initializeCharacters === 'function') {
				State.variables.characters = setup.initializeCharacters();
				console.log("[OpenConvoGame] Characters initialized successfully");
			} else {
				console.error("[OpenConvoGame] setup.initializeCharacters function not found!");
				return this.error("Character system not properly initialized.");
			}
		}
		
		const char = State.variables.characters?.[npcId];
		console.log("[OpenConvoGame] Character found:", !!char);
		
		if (!npcId || !char) {
			console.error("[OpenConvoGame] Failed to find character:", npcId);
			console.error("[OpenConvoGame] Available characters:", Object.keys(State.variables.characters || {}));
			return this.error("OpenConvoGame requires a valid NPC ID.");
		}

		const uniqueId = `start-minigame-${npcId}`;
		const btnHTML = `
			<div id="${uniqueId}" class="start-minigame-button-wrapper">
				<button class="start-minigame-button" onclick="
					setup.ConvoUI.renderMinigame('${npcId}');
					const wrapper = document.getElementById('${uniqueId}');
					if (wrapper) {
						wrapper.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
						wrapper.style.opacity = '0';
						wrapper.style.transform = 'translateY(-10px)';
						setTimeout(() => wrapper.remove(), 400);
					}
				">
					Get to know ${char.name}
				</button>
			</div>
		`;

		const target = document.getElementById("convoBox");
		if (target) {
			target.insertAdjacentHTML("beforeend", btnHTML);
		} else {
			console.warn("[OpenConvoGame] #convoBox not found.");
		}
	}
});


Macro.add("CrownAndCaste", {
	handler() {
	  const args = this.args;
	  const buyIn = parseFloat(args[0]);
	  const npcIds = args.slice(1, 4).filter(id => id && id !== "");
  
	  const validStakes = ["low", "standard", "high"];
	  const knownHouseRules = ["golden-tax", "split-line", "blessing-of-sixes", "royal-flush"];
  
	  // Optional arguments after NPCs
	  const remaining = args.slice(4);
	  let stakes = "standard";
	  let houseRules = [];
	  let winPassage = null;
	  let losePassage = null;
	  let playerFavor = null;
  
	  for (const arg of remaining) {
		const lower = String(arg).toLowerCase();
		if (validStakes.includes(lower)) {
		  stakes = lower;
		} else if (knownHouseRules.includes(lower)) {
		  houseRules.push(lower);
		} else if (!isNaN(parseFloat(arg)) && parseFloat(arg) > 1) {
		  playerFavor = parseFloat(arg);
		} else if (!winPassage) {
		  winPassage = arg;
		} else if (!losePassage) {
		  losePassage = arg;
		}
	  }
  
	  if (!losePassage && winPassage) losePassage = winPassage;
  
	  if (isNaN(buyIn)) {
		return this.error("CrownAndCaste requires a numeric buy-in as the first argument.");
	  }
  
	  const characters = State.variables.characters;
	  const sessionPlayers = ["jaylie"];
  
	  npcIds.forEach(id => {
		const cleanId = id.trim();

		if (characters?.[cleanId]) {
			// Matches a real character in the characters object
			sessionPlayers.push(cleanId);
		} else if (cleanId.toLowerCase() === "ghost") {
			sessionPlayers.push("ghost");
		} else {
			// Allow literal name as a fallback
			sessionPlayers.push({ name: cleanId });
		}
		});

  
	  if (sessionPlayers.length < 2) {
		return this.error("Crown & Caste requires at least 2 players (including you).");
	  }
	  if (sessionPlayers.length > 4) {
		sessionPlayers.splice(4);
	  }
  
	  const playerGold = State.variables.inventory_player?.gold_coin || 0;
	  const hasEnoughGold = playerGold >= buyIn;
  
	  const stakesDisplay = stakes === "low" ? "Low Stakes" :
							stakes === "high" ? "High Stakes" :
							"Standard Stakes";
  
	  const sessionKey = `crown-and-caste-${Date.now()}`;
	  const uniqueId = `start-cnc-${sessionKey}`;
	  const buttonId = `btn-${uniqueId}`;
	  const goldIcon = `<i data-lucide='coins'></i>`;
  
	  const houseRulesDisplay = houseRules.length > 0
		? `<div class="house-rules-display">House Rules: ${houseRules.join(", ")}</div>` : "";
  
	  const btnHTML = `
		<div id="${uniqueId}" class="start-minigame-button-wrapper">
		  <div class="crown-caste-game-info">
			<h4>Crown & Caste Table</h4>
			<div class="game-details">
			  <span class="stakes-level">${stakesDisplay}</span>
			  <span class="buy-in">Buy-In: ${buyIn} ${goldIcon}</span>
			  <span class="players">Players: ${sessionPlayers.length}/4</span>
			</div>
			${houseRulesDisplay}
		  </div>
		  <button class="start-minigame-button" id="${buttonId}" ${hasEnoughGold ? "" : "disabled"}>
			${hasEnoughGold ? "Join Game" : "Insufficient Gold"}
		  </button>
		  ${!hasEnoughGold ? `<p class='minigame-warning'>(Need ${buyIn}g to join this table)</p>` : ""}
		</div>
	  `;
  
	  $(this.output).append(btnHTML);
  
	  setTimeout(() => {
		const buttonEl = document.getElementById(buttonId);
		if (buttonEl && hasEnoughGold) {
		  buttonEl.addEventListener("click", () => {
			console.log("[CrownAndCaste] 🟢 Starting game...");
			console.log(`[CrownAndCaste] Stakes: ${stakes}, Rules: ${houseRules}`);
			console.log(`[CrownAndCaste] Routes: Win → ${winPassage}, Lose → ${losePassage}`);
			if (playerFavor) console.log(`[CrownAndCaste] Player Favor Modifier: ${playerFavor}`);
  
			if (State.variables.inventory_player?.gold_coin) {
			  State.variables.inventory_player.gold_coin -= buyIn;
			}
  
			// Store metadata
			State.temporary.ccBuyIn = buyIn;
			State.temporary.ccStakes = stakes;
			State.temporary.ccHouseRules = houseRules;
			State.temporary.ccWinPassage = winPassage;
			State.temporary.ccLosePassage = losePassage;
			State.temporary.ccPlayerFavor = playerFavor ?? null;
  
			setup.CrownAndCaste.initSession(sessionPlayers, stakes, houseRules, playerFavor, buyIn);
			setup.CrownAndCaste.startGame();
			setup.CrownAndCasteUI.renderMinigame();
  
			const wrapper = document.getElementById(uniqueId);
			if (wrapper) {
			  wrapper.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
			  wrapper.style.opacity = '0';
			  wrapper.style.transform = 'translateY(-10px)';
			  setTimeout(() => wrapper.remove(), 400);
			}
  
			if (window.lucide) lucide.createIcons();
		  });
		}
	  }, 50);
	}
  });
  
  



/* Optional Utility: Clears conversation snapshot state */
Macro.add("ClearSnapshots", {
	handler() {
		if (typeof setup.clearSnapshots === 'function') {
			setup.clearSnapshots();
		} else {
			console.warn("[ClearSnapshots] setup.clearSnapshots function not found.");
		}
	}
});


/* Character Relation Changing Macro */
Macro.add("relation", {
	skipArgs: false,
	handler() {
		if (this.args.length < 3) {
			return this.error("Usage: <<relation 'characterId' 'stat' value ['set' or 'add']>>");
		}

		const [charId, stat, rawValue, mode = "add"] = this.args;
		const chars = State.variables.characters;
		const char = chars?.[charId];

		if (!char) return this.error(`Character '${charId}' not found.`);
		if (!["trust", "affection", "rapport", "tension", "cooldown"].includes(stat)) {
			return this.error(`Stat '${stat}' is not a valid relationship field.`);
		}

		const value = parseFloat(rawValue);
		if (isNaN(value)) {
			return this.error("Value must be a number.");
		}

		if (mode === "set") {
			char[stat] = value;
		} else if (mode === "add") {
			char[stat] = (char[stat] ?? 0) + value;
		} else {
			return this.error("Mode must be 'add' or 'set'.");
		}

		// Optionally log or visually confirm
		console.log(`[relation] ${mode} ${value} to ${charId}.${stat} → ${char[stat]}`);
	}
});

Macro.add("SceneFadeInNow", {
	handler() {
		setTimeout(() => {
			const nodes = document.querySelectorAll("#montage .fade-start");
			nodes.forEach(n => n.classList.remove("fade-start"));
			console.log(`[SceneFadeInNow] ${nodes.length} element(s) faded in.`);
		}, 20);
	}
});

Macro.add("StartSexScene", {
	skipArgs: false,
	handler() {
	  const args = this.args;
  
	  console.log("[SexScene] 🔹 Macro Triggered");
	  console.log("[SexScene] Arguments Received:", args);
  
	  if (!args.length) {
		return this.error("<<StartSexScene>> requires at least one NPC ID.");
	  }
  
	  let label = "Have Sex";
	  let npcIdList = "";
	  let positionOverride = null;
  
	  if (args.length === 1) {
		npcIdList = args[0];
		console.log(`[SexScene] Using default label. Target NPCs: ${npcIdList}`);
	  } else if (args.length >= 2) {
		label = args[0];
		npcIdList = args[1];
		if (args[2]) {
		  positionOverride = args[2];
		  console.log(`[SexScene] Position override specified: ${positionOverride}`);
		}
		console.log(`[SexScene] Custom label: ${label} | Target NPCs: ${npcIdList}`);
	  }
  
	  const $link = $("<span>")
		.addClass("macro-link")
		.wiki(label)
		.css("cursor", "pointer")
		.on("click", () => {
		  console.log("[SexScene] 🔸 Link clicked. Beginning setup...");
  
		  // Initialize body states
		  setup.initializeSexSceneStates(npcIdList);
		  console.log("[SexScene] ✅ States initialized via setup.initializeSexSceneStates");
  
		  // Store participants
		  const npcArray = npcIdList.split(",").map(id => id.trim());
		  State.variables.sexSceneParticipants = {
			player: "player",
			npcs: npcArray
		  };
		  console.log("[SexScene] 🧍 Participants set:", State.variables.sexSceneParticipants);
  
		  // Set up environment
		  State.variables.sexSceneEnvironment = {
			location: State.activePassage,
			furniture: ["floor", "wall"],
			positionOverride: positionOverride ?? null
		  };
		  console.log("[SexScene] 🛋️ Environment defined:", State.variables.sexSceneEnvironment);
  
		  // Launch scene
		  console.log("[SexScene] 🚪 Entering ::SexScene passage...");
		  Engine.play("SexScene");
		});
  
	  $(this.output).append($link);
	}
  });
  
Macro.add("EndSexScene", {
	handler() {
		if (this.args.length === 0 || typeof this.args[0] !== "string") {
			return this.error("You must provide a valid passage name as a string.");
		}

		const exitTarget = this.args[0];
		State.variables.sexSceneExitTarget = exitTarget;

		console.log(`[SexSceneInit] 📍 Exit passage set to '${exitTarget}'`);
	}
});


 console.log("✅ widgets.js loaded");
