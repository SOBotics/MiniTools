const api_url = STACKEXCHANGE_API + "/users";

function get_suspended_users() {
	$("#error").hide();
	$("#data").hide();
	const time_period = parseInt($("#time-period").val());
	const sitename = $("#sitename").val();
    if (!time_period || !sitename)  { // time period or sitename is not defined
    	display_error("You can't leave an input blank.");
    	return;
	} else if (!Number.isInteger(time_period) || time_period > 24 || time_period < 1) { //must be (positive) int <=24
    	display_error("Number must be an integer between 1 and 100.");
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
	$("#data").show();
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
	}, 100);
	console.log("Process finished!");
}
