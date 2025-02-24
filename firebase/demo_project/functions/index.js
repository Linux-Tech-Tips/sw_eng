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

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.readTest = onRequest(async (request, response) => {
    /* Get collection request parameter, set to default if not present */
    let col = request.query.col;
    if(!col)
	col = "test1";
    /* Get result based on whether document set or not */
    let result = "";
    if(request.query.doc) {
	/* If document set, write the document to the result */
	let doc = await dbUtil.dbGetDocument(col, request.query.doc);
	result += JSON.stringify(doc.data());
    } else {
	/* If document not set, write the entire collection to the result */
        let data = await dbUtil.dbGetCollection(col);
	data.forEach(doc => {
	    result += doc.id + ": " + JSON.stringify(doc.data()) + "\n";
	});
    }
    /* Send the result back to the user */
    response.send("<pre>" + result + "</pre>");
});

exports.writeTest = onRequest(async (request, response) => {
    /* Get collection and document from the query, set defaults if not in query */
    let col = "test1";
    let doc = "testDoc";
    if(request.query.col) {
	col = request.query.col;
	delete request.query.col;
    }
    if(request.query.doc) {
	doc = request.query.doc;
	delete request.query.doc;
    }
    /* Write the query data without the collection and document fields to the database */
    await dbUtil.dbSetDocument(col, doc, request.query);
    response.send("<pre>Written Data: " + JSON.stringify(request.query) + "</pre>");
});
