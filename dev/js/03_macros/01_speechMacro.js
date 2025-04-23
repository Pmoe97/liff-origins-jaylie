Macro.add('speech', {
	tags: null,
	handler: function () {
		const id = this.args[0];
		const text = this.payload[0].contents.trim();
		const char = State.variables.characters?.[id] || {};
		const displayName = (char.known && char.name) ? char.name : char.defaultName || "???";
		const avatar = char.avatar || "images/default.png";
		const color = char.color || "white";
		const bgColor = char.bgColor || "rgba(0, 0, 0, 0.8)";

		const output = `
			<div class="speech" style="color:${color}; background-color:${bgColor};">
				<span class="avatar" style="background-image: url('${avatar}');"></span>
				<div class="speech-content">
					<b>${displayName}</b>
					<hr>
					<p>${text}</p>
				</div>
			</div>
		`;

		$(this.output).wiki(output.trim());
	}
});