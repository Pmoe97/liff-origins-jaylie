(() => {
	function getMessage(O) {
		if (O == null) return 'unknown error';
		return typeof O === 'object' && 'message' in O ? O.message : String(O);
	}

	Story.lookup('tags', 'style').forEach((p, i) => {
		try {
			const swrap = new StyleWrapper(document.createElement('style'));
			swrap.add(Scripting.evalJavaScript('`' + p.text.trim() + '`'));
			jQuery(swrap.style).appendTo(document.head).attr({
				id: `style-story-extra-${i}`,
				name: p.title,
				type: 'text/css'
			});
		} catch (ex) {
			console.error(ex);
			Alert.error(p.name, getMessage(ex));
		}
	});

	Story.lookup('tags', 'script').forEach(p => {
		try {
			Scripting.evalJavaScript(p.text);
		} catch (ex) {
			console.error(ex);
			Alert.error(p.name, getMessage(ex));
		}
	});
})();
