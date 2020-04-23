const sitenames = ["stackoverflow","serverfault","superuser","meta","webapps","webapps.meta","gaming","gaming.meta","webmasters","webmasters.meta","cooking","cooking.meta","gamedev","gamedev.meta","photo","photo.meta","stats","stats.meta","math","math.meta","diy","diy.meta","meta.superuser","meta.serverfault","gis","gis.meta","tex","tex.meta","askubuntu","meta.askubuntu","money","money.meta","english","english.meta","stackapps","ux","ux.meta","unix","unix.meta","wordpress","wordpress.meta","cstheory","cstheory.meta","apple","apple.meta","rpg","rpg.meta","bicycles","bicycles.meta","softwareengineering","softwareengineering.meta","electronics","electronics.meta","android","android.meta","boardgames","boardgames.meta","physics","physics.meta","homebrew","homebrew.meta","security","security.meta","writing","writing.meta","video","video.meta","graphicdesign","graphicdesign.meta","dba","dba.meta","scifi","scifi.meta","codereview","codereview.meta","codegolf","codegolf.meta","quant","quant.meta","pm","pm.meta","skeptics","skeptics.meta","fitness","fitness.meta","drupal","drupal.meta","mechanics","mechanics.meta","parenting","parenting.meta","sharepoint","sharepoint.meta","music","music.meta","sqa","sqa.meta","judaism","judaism.meta","german","german.meta","japanese","japanese.meta","philosophy","philosophy.meta","gardening","gardening.meta","travel","travel.meta","crypto","crypto.meta","dsp","dsp.meta","french","french.meta","christianity","christianity.meta","bitcoin","bitcoin.meta","linguistics","linguistics.meta","hermeneutics","hermeneutics.meta","history","history.meta","bricks","bricks.meta","spanish","spanish.meta","scicomp","scicomp.meta","movies","movies.meta","chinese","chinese.meta","biology","biology.meta","poker","poker.meta","mathematica","mathematica.meta","psychology","psychology.meta","outdoors","outdoors.meta","martialarts","martialarts.meta","sports","sports.meta","academia","academia.meta","cs","cs.meta","workplace","workplace.meta","windowsphone","windowsphone.meta","chemistry","chemistry.meta","chess","chess.meta","raspberrypi","raspberrypi.meta","russian","russian.meta","islam","islam.meta","salesforce","salesforce.meta","patents","patents.meta","genealogy","genealogy.meta","robotics","robotics.meta","expressionengine","expressionengine.meta","politics","politics.meta","anime","anime.meta","magento","magento.meta","ell","ell.meta","sustainability","sustainability.meta","tridion","tridion.meta","reverseengineering","reverseengineering.meta","networkengineering","networkengineering.meta","opendata","opendata.meta","freelancing","freelancing.meta","blender","blender.meta","mathoverflow.net","meta.mathoverflow.net","space","space.meta","sound","sound.meta","astronomy","astronomy.meta","tor","tor.meta","pets","pets.meta","ham","ham.meta","italian","italian.meta","pt.stackoverflow","pt.meta.stackoverflow","aviation","aviation.meta","ebooks","ebooks.meta","alcohol","alcohol.meta","softwarerecs","softwarerecs.meta","arduino","arduino.meta","cs50","cs50.meta","expatriates","expatriates.meta","matheducators","matheducators.meta","meta.stackoverflow","earthscience","earthscience.meta","joomla","joomla.meta","datascience","datascience.meta","puzzling","puzzling.meta","craftcms","craftcms.meta","buddhism","buddhism.meta","hinduism","hinduism.meta","communitybuilding","communitybuilding.meta","worldbuilding","worldbuilding.meta","ja.stackoverflow","ja.meta.stackoverflow","emacs","emacs.meta","hsm","hsm.meta","economics","economics.meta","lifehacks","lifehacks.meta","engineering","engineering.meta","coffee","coffee.meta","vi","vi.meta","musicfans","musicfans.meta","woodworking","woodworking.meta","civicrm","civicrm.meta","medicalsciences","medicalsciences.meta","ru.stackoverflow","ru.meta.stackoverflow","rus","rus.meta","mythology","mythology.meta","law","law.meta","opensource","opensource.meta","elementaryos","elementaryos.meta","portuguese","portuguese.meta","computergraphics","computergraphics.meta","hardwarerecs","hardwarerecs.meta","es.stackoverflow","es.meta.stackoverflow","3dprinting","3dprinting.meta","ethereum","ethereum.meta","latin","latin.meta","languagelearning","languagelearning.meta","retrocomputing","retrocomputing.meta","crafts","crafts.meta","korean","korean.meta","monero","monero.meta","ai","ai.meta","esperanto","esperanto.meta","sitecore","sitecore.meta","iot","iot.meta","literature","literature.meta","vegetarianism","vegetarianism.meta","ukrainian","ukrainian.meta","devops","devops.meta","bioinformatics","bioinformatics.meta","cseducators","cseducators.meta","interpersonal","interpersonal.meta","iota","iota.meta","stellar","stellar.meta","conlang","conlang.meta","quantumcomputing","quantumcomputing.meta","eosio","eosio.meta","tezos","tezos.meta","or","or.meta","drones","drones.meta"];
const api_url = STACKEXCHANGE_API + "/users";

function get_suspended_users() {
	$("#error").hide();
    const time_period = parseInt($("#time-period").val());
    const sitename = $("#sitename").val();
    if (!time_period || !sitename)  { // time period or sitename is not defined
    	display_error("You can't leave an input blank.");
    	return;
    } else if (!Number.isInteger(time_period) || time_period > 24 || time_period < 1) {
    	display_error("Number must be an integer between 1 and 100.");
    	return;
	} else if (!sitenames.find(site => site == sitename)) { // sitename doesn't exist
		display_error("Invalid sitename.");
		return;
	}

	data = {
        "site": sitename,
        "key": API_KEY,
        "filter": "!)RwcIAGFAE-f5H4jKSWcrvi4",
       	"sort": "creation",
       	"order": "desc",
       	"fromdate": Math.round(new Date().getTime() / 1000) - time_period * 3600, // SE works with secs, not millisecs!
       	"todate": Math.round(new Date().getTime() / 1000),
       	"page": 1,
       	"pagesize": 100
	};
	loop();
}

function loop() {
    setTimeout(function () {
		$.get(api_url, data, async function(results) {
			$("#quota").html(results.quota_remaining);
			for (let i = 0; i < results.items.length; i++) {
				if (results.items[i].timed_penalty_date) $("#data").append(`<span style="white-space: pre;"><a href=${results.items[i].link}>${results.items[i].display_name}</a> was suspended on ${new Date(results.items[i].creation_date * 1000).toISOString()}.</span><br/>`);
			}
			if (results.backoff) {
				console.warn("BACKOFF received on page", data.page, ", stopping for", results.backoff, "seconds");
				await new Promise(a => setTimeout(a, 10000));
			}
			data.page++;
			if (results.has_more) loop();
		})
    }, 2000);
}