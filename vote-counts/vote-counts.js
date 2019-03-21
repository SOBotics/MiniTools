$("#data").hide()
$("#error").hide()

function fetch_vote_counts(){
    var api_url = STACKEXCHANGE_API+"/posts"
    var post_url = $("#postLink").val()
    var answer_pattern = /(https:\/\/)?(.*?)\/.*?\/(\d+?)(\/.*)?\/(\d+)#(\d+)$/i
    var matched_answer = post_url.match(answer_pattern)
    var question_pattern = /(https:\/\/)?(.*?)\/.*?\/(\d+?)(\/.*)?$/i
    var matched_question = post_url.match(question_pattern)
    if (matched_answer){
        console.log("matched answer")
        var site_name = matched_answer[2]
        var post_id = matched_answer[5]
    }
    else if (matched_question){
        console.log("matched question")
        var site_name = matched_question[2]
        var post_id = matched_question[3]
    }
    else {
        error("Can't find match, check URL.")
        return;
    }

    data = {
        "site": site_name,
        "key": API_KEY,
        "filter": "!4-MZ4PFG9xnx.DV7y"
    }
    $.get(api_url+"/"+post_id, data, success)

}

function success(return_data) {
    console.log(return_data)
    if(return_data["items"] == false) {
        error("Could not load post, might be deleted");
        return;
    }
    upc = return_data["items"][0]["up_vote_count"]
    doc = return_data["items"][0]["down_vote_count"]
    quota = return_data["quota_remaining"]
    $("#quota").html(quota)
    $("#upv-cnt").html(upc)
    $("#dwn-cnt").html(doc)
    $("#data").show()
}

function error(message) {
    console.log("error: "+message)
    $("#error-msg").html(message)
    $("#error").show()
}