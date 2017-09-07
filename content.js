/*
CONTENT SCRIPTS
- a js file that runs in context of webpage
- content scripts injected after DOM loaded; no need to check if loaded

BROWSER ACTION
- icon added by extension; listen for clicks

MESSAGE PASSING
- content script grabs url of current page and background does smt with it
- the scripts communicate in order to work together

### JQUERY ###
CSS SELECTORS
- $(".class-name").children().attr("style", "color: red");
- $("#id-name").find("a[href^="http://"]").attr(blah); -- find elements under id with a href start with  http://

- children() -- select direct children
- find("given") -- select given
- parent() -- select parent directly above
- parents() -- parents all through chain

ATTRIBUTE SELECTORS
- ^= begins with
- $= ends with
- *= at least one instance of 

INSERT CONTENT
- before
- after
- prepend
- append
*/

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if( request.message === "clicked_browser_action" ) {
//       var firstHref = $("a[href^='http']").eq(0).attr("href");

//       console.log(firstHref);
//     }
//     chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
//     }
// );
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
	"sword-art-online": ""
};

var animeName = $("meta[property='og:url']").attr("content").split("/")[3];

var fillerList = $(function() {
	// set animeName to appropriate animefillerlist name lookup
	if (animeName in knownIssues) {
		animeName = knownIssues[animeName];
	}
	$.ajax({
		    async: false,
		    type: 'GET',
		    url: "http://www.animefillerlist.com/shows/" + animeName,
		    success: function(data) {
		        fillerList = data;
    	}});
});

$(function() {
	if ($(fillerList).find(".node-anime")[0]) {
		// episode list page
		$("a.portrait-element.block-link.titlefix.episode").each(function() {
			var epNum = $(this).attr("href").split("/")[2].split("-")[1];
			var epType = $(fillerList).find("#eps-" + epNum + " .Type span").text();

			// insert div and span for filler tag
			$(this).append(getFillerTag(epType));
		});

		// watch episode page
		updateCarousel();
	}
});

// update left and right of carousel view
$(".collection-carousel-arrow").click(function() {
	setTimeout(function() {updateCarousel()}, 1000);
});

// // update season dropdown view when opened
// $(".season-dropdown").click(function() {

// })

// function updateSeason() {
// 	// if season has season-dropdown, check if open. If true, then update with filler tag. 
// 	// on click, wait and if open then update
// }

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
		fillerTag = "<div class='empty-filler-tag' style='height: 16px;'></div>";
	}

	return fillerTag;	
}