// -*- indent-tabs-mode: nil -*-
// All JavaScript goes in here
//

const api_key   = "AIzaSyBI6UWWW3cn5La1bbLO5geSvYVNWEqwYEE";
const client_id = "440799916291-rfcs9c051ke7pla7n588sok57t9g60bi.apps.googleusercontent.com";
const sheet_id  = "1lmlJA0cH4x51C1wshULfHPgRRX9vNtgy5NYuCLLsUV0";

const professor_form = "https://docs.google.com/forms/d/e/" +
      "1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q" +
      "/viewform?embedded=true"
const advisor_form   = "https://docs.google.com/forms/d/e/" +
      "1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q" +
      "/viewform?embedded=true"

const sheet = "https://sheets.googleapis.com/v4/spreadsheets/" +
      sprdsht_id +
      "/?key=" +
      api_key +
      "&includeGridData=true"


function display(html) {
    document.getElementsByTagName("article")[0].innerHTML = html;
}

// Entrypoint of the dynamic portions of this site, called immediately after
// we source Google's sheets SDK in order to set up the client session then
// fill in site content.
function main() {
    switch (window.location.href.split("/")[3]) {
    case "":
    case "index.html":
        display("Display the site's summary here");
        break;
    case "advisor_feedback.html":
        display("<iframe src='" + advisor_form + "'>loading...<iframe>")
        break;
    case "professor_feedback.html":
        display("<iframe src='" + professor_form + "'>loading...<iframe>")
        break;
    case "results.html":
        display("Display a list of all results");
        break;
    case "search.html":
        display("Display search results");
        break;
    default:
        display("If you're seeing this the webmaster broke something")
    }
}
