$("#data").hide();
$("#error").hide();
const api_url = STACKEXCHANGE_API + "/comments";
const comment_pattern = /https:\/\/((((.+)\.)stackexchange|stackoverflow|superuser|serverfault|askubuntu|stackapps)\.com|mathoverflow\.net)\/(q(?:uestions)?\/\d+.*#comment|posts\/comments\/)(\d+)(?:_\d+)?(?:\/|[a-z?=1]*)?$/i;

function get_body_content() {
    $("#data").hide();
    $("#error").hide();
    var comment_url = $("#commentLink").val();
    var matched_comment = comment_url.match(comment_pattern);
    if (matched_comment) {
        console.log("matched comment");
        site_name = matched_comment[1];
        var user_id = matched_comment[6];
    }
    else {
        display_error("Can't find match, check URL.");
        return;
    }

    data = {
        "site": site_name,
        "key": API_KEY,
        "filter": "!*JxbB6N6w(LGV_JR"
    };
    $.get(api_url + "/" + user_id, data, success);

}

function success(return_data) {
    console.log(return_data);
    if (return_data.items == false) {
        display_error("Could not find comment. Perhaps it has been deleted or it doesn't exist.");
        return;
    }

    $("#quota").html(return_data.quota_remaining);
    $("#comment-body").html(return_data.items[0].body_markdown);
    $("#comment-preview").html(return_data.items[0].body);
    $("#data").show();
    $('#data').on('change keyup keydown paste cut', 'textarea', function (){
        $(this).height(0).height(this.scrollHeight);
    }).find('textarea').change();
}
