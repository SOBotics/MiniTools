$("#data").hide()
$("#error").hide()
const api_url = STACKEXCHANGE_API + "/posts";
const question_pattern = /https:\/\/((((.+)\.)stackexchange|stackoverflow|superuser|serverfault|askubuntu|stackapps)\.com|mathoverflow\.net)\/(q|questions)\/(\d+)(\/.*)?$/i;
const answer_pattern = /https:\/\/((((.+)\.)stackexchange|stackoverflow|superuser|serverfault|askubuntu|stackapps)\.com|mathoverflow\.net)\/(questions\/\d+?\/.*\/(\d+?)#|a\/)(\d+)(?:\/(?:\d+?(?:\/)?)?)?$/i;

function fetch_vote_counts() {
    var post_url = $("#postLink").val();
    var matched_answer = post_url.match(answer_pattern);
    var matched_question = post_url.match(question_pattern);
    if (matched_answer) {
        console.log("matched answer");
        var site_name = matched_answer[1];
        var post_id = matched_answer[6];
    }
    else if (matched_question) {
        console.log("matched question");
        var site_name = matched_question[1];
        var post_id = matched_question[6];
    }
    else {
        display_error("Can't find match, check URL.");
        return;
    }

    data = {
        "site": site_name,
        "key": API_KEY,
        "filter": "!4-MZ4PFG9xnx.DV7y"
    };
    $.get(api_url + "/" + post_id, data, success);

}

function success(return_data) {
    console.log(return_data);
    if (return_data.items == false) {
        display_error("Could not load post, it might not exist or it may have been deleted.");
        return;
    }

    $("#quota").html(return_data.quota_remaining);
    $("#upv-cnt").html(return_data.items[0].up_vote_count);
    $("#dwn-cnt").html(return_data.items[0].down_vote_count);
    $("#data").show();
}
