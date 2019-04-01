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
	"sword-art-online": ""
};

var animeName = $("meta[property='og:url']").attr("content").split("/")[3];
var fillerListUrl = "https://www.animefillerlist.com/shows/" + animeName

var fillerList = $(function() {
	// set animeName to appropriate animefillerlist name lookup
	if (animeName in knownIssues) {
		animeName = knownIssues[animeName];
	}
	// workaround for CORS
        $.get(`${'https://cors-anywhere.herokuapp.com/'}` + fillerListUrl, function(data) {
                fillerList = data;
                if ($(fillerList).find(".node-anime")[0]) {
                        // episode list page
                        updateSeason($(".season").first());

                        // watch episode page
                        updateCarousel();
                }
        })
});

// update left and right of carousel view
$(".collection-carousel-arrow").click(function() {
	setTimeout(function() {
		if ($(fillerList).find(".node-anime")[0]) {
			updateCarousel()
		}
	}, 1000);
});

// update season dropdown view when opened
$(".season-dropdown").click(function() {
		var seasonClicked = $(event.currentTarget).parent();
		if (seasonClicked.find("a.open") && !(seasonClicked.hasClass("tag-view"))) {
			updateSeason(seasonClicked);
		}
});

// update episodes with filler tags under given parent object
function updateSeason(parent) {
	$(parent).addClass("tag-view");
	// on click, if open then update
	$(parent).find("a.portrait-element.block-link.titlefix.episode").each(function() {
		var epNum = $(this).attr("href").split("/")[2].split("-")[1];
		var epType = $(fillerList).find("#eps-" + epNum + " .Type span").text();

		// insert div and span for filler tag
		$(this).append(getFillerTag(epType));
	});
}

// update episodes with filler tags if not already in carousel
function updateCarousel() {
	$("img.mug").each(function() {
		// if the episode doesn't already have a filler tag
		// then update that!!
		if (!($(this).next(".filler-tag").length)) {
			// pop episode numner from carousel image alt attribute
			// find episode type from animefillerlist
			var epNum = $(this).attr("alt").split(" ").pop();
			var epType = $(fillerList).find("#eps-" + epNum + " .Type span").text();

			if (epType.length > 0) {
				// adjust carousel height for tag
				$(".collection-carousel").attr("style", "height: 125px");
				$(".collection-carousel-contents").attr("style", "height: 125px");
			}

			// insert div and span for filler tag
			$(this).after(getFillerTag(epType));
		}
	});
}

function getFillerTag(epType) {
	var fillerTag;
	if (epType.length > 0) {
		fillerTag = "<div class='filler-tag' style='width: 100%; text-align: center; background-color: ";
		if(epType == "Filler" || epType == "Mostly Filler") {
			fillerTag += "#A14A40"; // red
		}
		else {
			fillerTag +="#91BD09"; // green
		}
		fillerTag +=";'><span style='font-size: 11px; color: white; text-transform: uppercase;'>" + epType + "</span></div>";
	}
	else {
		fillerTag = "<div class='filler-tag' style='height: 16px;'></div>";
	}

	return fillerTag;
}
