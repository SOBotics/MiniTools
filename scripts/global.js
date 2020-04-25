const API_KEY = "kmtAuIIqwIrwkXm1*p3qqA((";
const STACKEXCHANGE_API = "https://api.stackexchange.com/2.2";

function display_error(message) {
    console.error("Error: " + message);
    $("#error-msg").html(message);
    $("#error").show();
}

function log(info) {
    console.info(info);
    $("#info-msg").append(info + "<br/>");
}
