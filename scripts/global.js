var API_KEY = "kmtAuIIqwIrwkXm1*p3qqA((";
var STACKEXCHANGE_API = "https://api.stackexchange.com/2.2"

function display_error(message) {
    console.log("error: "+message)
    $("#error-msg").html(message)
    $("#error").show()
}