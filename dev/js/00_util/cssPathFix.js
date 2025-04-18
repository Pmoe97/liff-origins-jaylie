if (
	document.location.href.toLowerCase().includes("/twine/scratch/") ||
	document.location.href.toLowerCase().includes("/temp/") ||
	document.location.href.toLowerCase().includes("/private/") ||
	hasOwnProperty.call(window, "storyFormat")
) {
	$(document).one(":passagerender", function () {
		setTimeout(function () {
			$(".avatar").each(function () {
				var url = $(this).css("background-image");
				url = url.replace(/\"/gi, "").replace(')', '');
				url = url.slice(url.lastIndexOf("/") + 1);
				$(this).css("background-image", "url('file:///C:/Games/My%20Game/" + url + "')");
			});
		});
	});
}