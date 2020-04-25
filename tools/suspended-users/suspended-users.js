const api_url = STACKEXCHANGE_API + "/users";

function get_suspended_users() {
    $("#error").hide();
    $("#data").html("");
    const time_period = parseInt($("#time-period").val());
    const sitename = $("#sitename").val();
    if (!time_period || !sitename)  { // time period or sitename is not defined
        display_error("You can't leave an input blank.");
        return;
    } else if (!Number.isInteger(time_period) || time_period > 48 || time_period < 1) { //must be (positive) int <=24
        display_error("Number must be an integer between 1 and 100.");
        return;
    }
    $("#info").find("span").html("");

    data = {
        "site": sitename,
        "key": API_KEY,
        "filter": "!)RwcIAGFAE-e-odlWQ5NZNXb",
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
        $.ajax({
            method: 'GET',
            url: api_url,
            data: data,
            success: async function(results) {
                $("#quota").html(results.quota_remaining);
                $("#info-progress").html(`Processing ${results.page}/${Math.trunc(results.total / 100) + 1}...<br/>`);
                for (let i = 0; i < results.items.length; i++) {
                    if (results.items[i].timed_penalty_date) $("#data").append(`<span style="white-space: pre;"><a href=${results.items[i].link}>${results.items[i].display_name}</a> was suspended on ${new Date(results.items[i].creation_date * 1000).toISOString()}.</span><br/>`);
                }
                if (results.backoff) {
                    log("⚠ BACKOFF received on page " + data.page);
                    await new Promise(a => setTimeout(a, 10000));
                }
                data.page++;
                if (results.has_more) loop();
                else {
                    if (!$("#data").html()) $("#data").html("<span>No users found.</span>");
                    log("✔️ Successfully fetched " + (data.page - 1) + " pages of data!");
                    $("#info-progress br").before(" done!");
                }
            },
            error: function(error) {
                log(`❌ Error ${error.responseJSON.error_id} ${error.responseJSON.error_name}`);
                display_error(`Error ${error.responseJSON.error_id} ${error.responseJSON.error_name}: ${error.responseJSON.error_message}`);
            }
        });
    }, 100);
}
