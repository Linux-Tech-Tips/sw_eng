/**
 * Firebase functions demo
 *
 * Have this file in your firebase functions folder and call `firebase deploy` to push these functions to the project online
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const dbUtil = require("./dbUtil.js");

/* Read test - reads a specified collection or document from the database */
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

/* Write test - writes a javascript object into a specified collection and document of the database */
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
