const API_KEY = "kmtAuIIqwIrwkXm1*p3qqA((";
const STACKEXCHANGE_API = "https://api.stackexchange.com/2.2";

function display_error(message) {
    console.error("Error: " + message);
    $("#error-msg").html(message);
    $("#error").show();
}
