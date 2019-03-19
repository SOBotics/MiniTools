$("#data").hide();

function fetch_vote_counts(){
    var api_url = STACKEXCHANGE_API+"/posts";
    var post_url = $("#postLink").val();
    var pattern = /(https:\/\/)?(.*?)\/.*?\/(\d+?)(\/.*)?$/i;
    var matched = post_url.match(pattern)
    if (matched){
        var site_name = matched[2];
        var post_id = matched[3];
        data = {
            "site": site_name,
            "key": API_KEY,
            "filter": "!4-MZ4PFG9xnx.DV7y"
        }
        $.get(api_url+"/"+post_id, data, success);
    }
    else {
        alert("can't find match");
    }

}

function success(return_data) {
    console.log(return_data)
    upc = return_data["items"][0]["up_vote_count"]
    doc = return_data["items"][0]["down_vote_count"]
    quota = return_data["quota_remaining"]
    $("#quota").html(quota)
    $("#upv-cnt").html(upc)
    $("#dwn-cnt").html(doc)
    $("#data").show()
}
