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
const vocab = require("./uploadVocab.js");

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

/*exports.uploadVocab = onRequest({timeoutSeconds: 3600, memory: "2GiB"}, async (request, response) => {
  await vocab.uploadVocab();
  reponse.send("<pre> Added vocabulary! </pre>");
});*/

exports.search = onRequest(async (request, response) => {
    /* Get user query */
    if(!request.query.query) {
	response.send("Please enter query (using the URL parameter query=query_text)");
	return;
    }
    let query = request.query.query;
    console.log("Searching with query: " + query);

    let result = await engine.search(query);
    response.send("<pre>Search Results: \n" + JSON.stringify(result) + "</pre>");
});

exports.addDemoPage = onRequest(async (request, response) => {
    /* First, get last page ID */
    let lastID = await dbUtil.dbGetLastID();
    ++lastID;

    /* Populate Page with dummy data */
    await dbUtil.dbSetPage("pageDemo" + lastID, "DEMO_PAGES", new Date(), "Page Demo #" + lastID, lastID);

    /* Populate all components with dummy data */

    /* Metadata */
    let metadata = {};
    for(let i = 0; i < 20; ++i) {
	metadata["word" + i] = 1/i;
    }
    await dbUtil.dbSetPageMetadata(lastID.toString(), metadata);

    /* Word Meaning Data */
    let pageMatrix = {};
    for(let i = 0; i < 30; ++i) {
	pageMatrix[i.toString()] = [];
	for(let j = 0; j < 50; ++j) {
	    pageMatrix[i][j] = Math.random();
	}
    }
    console.log("Created matrix: " + pageMatrix + "under ID " + lastID.toString());
    await dbUtil.dbSetPageVec(lastID.toString(), pageMatrix, 0.5);
    console.log("Written page vec data")

    /* Word Content Data */
    await dbUtil.dbSetPageContent(lastID.toString(), "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12 word13 word14 word15 word16 word17 word18 word19 word20 word21 word22 word23 word24 word25 word26 word27 word28 word29 word30");

    /* Save new page ID */
    await dbUtil.dbSetLastID(lastID);
    response.send("<pre>Added new Dummy page of ID " + lastID + "</pre>");
})

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
