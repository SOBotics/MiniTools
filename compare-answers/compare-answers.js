$("#error").hide()
$("#data").hide()
var site_name = null

function fetch_answers(){
    var api_url = STACKEXCHANGE_API+"/questions"
    var post_url = $("#postLink").val()
    var question_pattern = /(https:\/\/)?(.*?)\/.*?\/(\d+?)(\/.*)?$/i
    var matched_question = post_url.match(question_pattern)
    if (matched_question){
        console.log("matched question")
        site_name = matched_question[2]
        var post_id = matched_question[3]
    }
    else {
        error("Can't find match, check URL.")
        return;
    }

    data = {
        "site": site_name,
        "key": API_KEY,
        "sort": "creation",
        "filter": "!b1MMEbc8q)iw*H"
    }
    $.get(api_url+"/"+post_id+"/answers", data, success)

}

function success(return_data) {
    console.log(return_data)
    quota = return_data["quota_remaining"]
    $("#quota").html(quota)
    $("#data-table").html("<thead><tr><th>Created On</th><th>Score</th><th>Up Vote Count</th><th>Down Vote Count</th><th>Flair</th></tr></thead>")

    if(return_data["items"] == false) {
        display_error("Could not load post, might be deleted");
        return;
    }
    var answers = return_data["items"]

    if(answers.length == 0) {
        display_error("There are no answers to this question");
        return;
    }

    var tbody = $("<tbody></tbody>")
    for (i=0; i<answers.length; i++){

        var answer = answers[i]

        var creation_date = answer["creation_date"]
        var link = answer["link"]
        var creation_date_col = "<td><a href='"+link+"'>"+creation_date+"<a></td>"

        var upv_count = answer["up_vote_count"]
        var upv_count_col = "<td>"+upv_count+"</td>"

        var dnv_count = answer["down_vote_count"]
        var dnv_count_col = "<td>"+dnv_count+"</td>"

        var score = answer["score"]
        var score_col = "<td>"+score+"</td>"

        var userid = answer["owner"]["user_id"]
        var flair = "<td><img src='https://"+site_name+"/users/flair/"+userid+".png' /></td>"

        var div_string = '<tr>' + creation_date_col + score_col + upv_count_col + dnv_count_col + flair + '</tr>'
        var row = $(div_string)

        tbody.append(row)

    }
    $("#data-table").append(tbody)
    $("#data-table").DataTable(        {"paging":   false,
                                       "searching": false,
                                       "info":     false})
    $("#data").show()
}
