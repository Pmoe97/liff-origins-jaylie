Macro.add("fogtext", {
	tags: null,
	handler: function () {
		const difficulty = parseInt(this.args[0]);
		const skill = this.args[1].toLowerCase();
		const content = this.payload[0].contents.trim();
		const fogId = "fogtext-" + Math.random().toString(36).substr(2, 9);

		if (isNaN(difficulty) || !skill) {
			return this.error("Invalid parameters: fogtext [difficulty] [skill]");
		}

		const skillValue =
			(State.variables.skills && State.variables.skills[skill]?.value) ??
			(State.variables.attributes && State.variables.attributes[skill]) ?? 0;

		const roll = random(1, 20);
		const total = roll + skillValue;
		const passed = total >= difficulty;

		let html = `<div id="${fogId}" class="fog-container">`;

		if (typeof State.temporary.fogResults === "undefined") {
			State.temporary.fogResults = {};
		}

		const alreadyRolled = State.temporary.fogResults[fogId];

		if (alreadyRolled) {
			if (alreadyRolled.passed) {
				html += `<div class="fogtext" title="Passed ${skill} ${alreadyRolled.roll}+${alreadyRolled.skill} ≥ ${difficulty}">${content}</div>`;
			} else {
				html += `<div class="fog-fail">You rolled a ${alreadyRolled.roll} + ${alreadyRolled.skill} = ${alreadyRolled.total} for ${skill}. You needed ${difficulty}.<br><em>You cannot make out the details.</em></div>`;
			}
		} else {
			html += `<div class="fog-unchecked">???</div>`;
			html += `<button class="fog-roll-button" onclick="
				(function() {
					const roll = random(1, 20);
					const skillValue = (State.variables.skills && State.variables.skills['${skill}']?.value) ??
					                   (State.variables.attributes && State.variables.attributes['${skill}']) ?? 0;
					const total = roll + skillValue;
					const passed = total >= ${difficulty};
					State.temporary.fogResults['${fogId}'] = { roll: roll, skill: skillValue, total: total, passed: passed };
					Engine.play(Engine.active.passages[Engine.active.passages.length - 1].title);
				})()
			">Roll for ${skill.charAt(0).toUpperCase() + skill.slice(1)}</button>`;
		}

		html += `</div>`;
		$(this.output).wiki(html);
	}
});
