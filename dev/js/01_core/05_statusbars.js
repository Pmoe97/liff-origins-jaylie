setup.statusGradients = {
	fatigue: [
		"#ffffff", "#e6e6eb", "#cdcdd7", "#b3b4c3", "#9a9baf", "#81839b",
		"#686a87", "#4f5173", "#35385f", "#1c1f4b", "#030637"
	],
	pain: [
		"#61DF0F", "#7AD628", "#93CC32", "#ABC23C", "#C4B847", "#DCAE51",
		"#DD9249", "#DD763F", "#DE5A34", "#DF3D29", "#DF250F"
	],
	corruption: [
		"#3f48cc", "#3941b8", "#323aa3", "#2c328f", "#262b7a", "#202466",
		"#191d52", "#13163d", "#0d0e29", "#060714", "#000000"
	]
};

setup.getStatusColor = function (status, value) {
	const gradient = setup.statusGradients[status];
	if (!gradient) return "#888";
	const pct = Math.max(0, Math.min(1, value / 1000));
	const idx = Math.floor(pct * 10);
	return gradient[idx];
};

setup.renderStatusBar = function (status, label, value) {
	const color = setup.getStatusColor(status, value);
	const pct = Math.min(100, Math.floor((value / 1000) * 100));
	return `
		<div class="statusbar">
			<span class="status-label">${label}</span>
			<div class="status-fill" style="width:${pct}%; background-color:${color};"></div>
		</div>
	`;
};