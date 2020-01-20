$("#data").hide();
$("#error").hide();
const api_url = STACKEXCHANGE_API + "/users";
const user_pattern = /https:\/\/((((.+)\.)stackexchange|stackoverflow|superuser|serverfault|askubuntu|stackapps)\.com|mathoverflow\.net)\/u(?:sers)?\/(\d+?)(?:\/(?:[a-z0-9-]*(?:\/)?)?)?$/i;

function retrieve_network_id() {
    $("#data").hide();
    $("#error").hide();
    var user_profile_url = $("#userProfileLink").val();
    var matched_profile = user_profile_url.match(user_pattern);
    if (matched_profile) {
        console.log("matched user profile");
        var site_name = matched_profile[1];
        var user_id = matched_profile[5];
    }
    else {
        display_error("Can't find match, check URL.");
        return;
    }

    data = {
        "site": site_name,
        "key": API_KEY,
        "filter": "!23IYXArYxClsvoFOUU(KD"
    };
    $.get(api_url + "/" + user_id, data, success);

}

function success(return_data) {
    console.log(return_data);
    if (return_data.items == false) {
        display_error("Could not find user id. Perhaps the user is deleted or such id doesn't exist.");
        return;
    }

    $("#quota").html(return_data.quota_remaining);
    $("#userid").attr("href", "https://stackexchange.com/users/" + return_data.items[0].account_id).html(return_data.items[0].account_id);
    $("#data").show();
}
