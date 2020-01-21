$("#error").hide();
$("#data").hide();
const question_pattern = /https:\/\/(((?:.+\.)?((stackexchange|stackoverflow|superuser|serverfault|askubuntu|stackapps)\.com|mathoverflow\.net)))\/(q|questions)\/(\d+)(\/.*)?$/i;
const api_url = STACKEXCHANGE_API + "/questions";

function fetch_answers() {
    $("#error").hide();
    $("#data").hide();
    var post_url = $("#postLink").val();
    var matched_question = post_url.match(question_pattern);
    if (matched_question){
        console.log("matched question");
        window.site_name = matched_question[1];
        var post_id = matched_question[6];
    }
    else {
        display_error("Can't find match, check URL.");
        return;
    }

    data = {
        "site": site_name,
        "key": API_KEY,
        "sort": "creation",
        "filter": "!b1MMEbc8q)iw*H"
    }
    $.get(api_url + "/" + post_id + "/answers", data, success);

}

function success(return_data) {
    console.log(return_data);
    $("#quota").html(return_data.quota_remaining);

    if(return_data.items == false) {
        display_error("Could not load post, might be deleted");
        return;
    }
    var answers = return_data.items;

    if (answers.length == 0) {
        display_error("There are no answers to this question");
        return;
    }

    $("#data-table").html("<thead><tr><th>Created On</th><th>Score</th><th>Up Vote Count</th><th>Down Vote Count</th><th>User</th></tr></thead>");

    var tbody = $("<tbody></tbody>");
    for (i = 0; i < answers.length; i++) {

        var answer = answers[i];

        var creation_date = new Date(answer.creation_date * 1000).toISOString();
        var creation_date_col = "<td><a href='" + answer.link + "'>" + creation_date + "<a></td>";

        var upvote_count_col = "<td>" + answer.up_vote_count + "</td>";
        var downvote_count_col = "<td>" + answer.down_vote_count + "</td>";
        var score_col = "<td>" + answer.score + "</td>";

        var userid = answer.owner.user_id;
        if (userid) {
            var flair = "<td><a href='" + answer.owner.link + "'><img alt='" + userid + "' src='https://" + site_name + "/users/flair/" + userid + ".png' /></a></td>";
        }
        else {
            flair = "<td align='center'>user deleted</td>";
        }
        var row_type = "<tr>";
        if (answer.is_accepted) {
            row_type = "<tr class='accepted'>";
        }
        var div_string = row_type + creation_date_col + score_col + upvote_count_col + downvote_count_col + flair + '</tr>';
        var row = $(div_string);

        tbody.append(row);
    }

    $("#data-table").append(tbody);
    $("#data-table").DataTable( {"paging":   false,
                                 "searching": false,
                                 "info":     false,
                                 "destroy": true,});
    $("#data").show();
}
