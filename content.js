var knownIssues = {
	"ace-attorney": "",
	"assassination-classroom": "ansatsu,-kyoushitsu-assassination-classroom",
	"attack-on-titan": "attack-titan",
	"berserk": "berserk-2016",
	"case-closed": "detective-conan",
	"dgray-man": "d-gray-man",
	"fatestay-night": "fatestay-night-unlimited-blade-works",
	"haikyu": "",
	"parasyte-the-maxim-": "parasyte-maxim",
	"reborn": "katekyo-hitman-reborn",
	"relife": "",
	"shugo-chara": "",
	"steinsgate-0": "slam-dunk",
	"sword-art-online": "",
	"the-rising-of-the-shield-hero": "rising-shield-hero"
};

var animeName = $("meta[property='og:url']").attr("content").split("/")[3];
var fillerListUrl = "https://www.animefillerlist.com/shows/" + animeName
var fillerList = $(function() {
	animeName = (animeName in knownIssues) ? knownIssues[animeName] : animeName;
	if (animeName in knownIssues) {
		animeName = knownIssues[animeName];
	}
	// workaround for CORS
	$.get(`${'https://cors-anywhere.herokuapp.com/'}` + fillerListUrl,
		function(data) {
			fillerList = data;
			if ($(fillerList).find(".node-anime")[0]) {
				updateSeason($(".season").first());
				updateCarousel();
			}
		}
	);
});

function updateSeason(view) {
	$(view).addClass("tag-view");
	$(view).find("a.portrait-element.block-link.titlefix.episode")
		.each(function() {
			epNum = $(this).attr("href").split("/")[2].split("-")[1];
			$(this).append(getFillerTag(epNum));
	});
}
function updateCarousel() {
	$("img.mug").each(function() {
		if (!($(this).next(".filler-tag").length)) {
			epNum = $(this).attr("alt").split(" ").pop();

			$(this).after(getFillerTag(epNum));
			if ($(this).next(".filler-tag").length) { // update height
				$(".collection-carousel").attr("style", "height: 125px");
				$(".collection-carousel-contents").attr("style", "height: 125px");
			}
		}
	});
}

function getFillerTag(epNum) {
	var epType = $(fillerList).find("#eps-" + epNum + " .Type span").text();
	var fillerTag = "<div class='filler-tag' style='height: 16px;'></div>";
	if (epType.length > 0) {
		var tagColor = epType.includes("Filler") ? "#A14A40" : "#91BD09";

		fillerTag = `<div class='filler-tag' style='width: 100%; text-align: \
		center; background-color: ${tagColor};'><span style='font-size: 11px; \
		color: white; text-transform: uppercase;'>${epType}</span></div>`;
	}

	return fillerTag;
}

$(".collection-carousel-arrow").click(function() {
	var delay = 500; // buffer for carousel loading next section
	setTimeout(function() {
		if ($(fillerList).find(".node-anime")[0]) {
			updateCarousel();
		}
	}, delay);
});

$(".season-dropdown").click(function() {
	var seasonView = $(event.currentTarget).parent();
	if (seasonView.find("a.open") && !(seasonView.hasClass("tag-view"))) {
		updateSeason(seasonView);
	}
});
