/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const dbUtil = require("./dbUtil.js");
const engine = require("./engine.js");
const add = require("./addPage.js");

exports.search = onRequest({cors: true}, async (request, response) => {
    /* Get user query */
    if(!request.query.query) {
	response.send("Please enter query (using the URL parameter query=query_text)");
	return;
    }
    let query = request.query.query;
    console.log("Searching with query: " + query);

    let result = await engine.search(query);
    response.send(JSON.stringify(result));
});

exports.addPage = onRequest({timeoutSeconds: 3600, cors: true}, async (request, response) => {
  //test call of the addPage function with the linux man pages
  //let url = "https://man7.org/linux/man-pages/dir_section_1.html";
  //let domain = new URL(url).hostname;
  //await add.addPage(url, domain);
  if(!request.body.urls) {
    response.send("Please enter links (in a post request parameter urls=link1,link2,link3)");
    return;
  }
  await add.addPage(request.body.urls.split(","), new URL(request.body.urls.split(",")[0]).hostname);
  
  response.send("<pre> Added pages! </pre>");
});

