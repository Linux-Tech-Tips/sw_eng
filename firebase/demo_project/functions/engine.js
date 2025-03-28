/* Main file containing the Search Engine API JavaScript Functions */
module.exports = { search };

const textProcessing = require("./textProcessing.js");
const dbUtil = require("./dbUtil.js");

const metadata = require("./metadata.js");
const content = require("./similarity-calculation.js");
const meanings = require("./meanings.js");

/** Takes in a search query as an unprocessed string, returns sorted array of JavaScript objects containing page information, from highest to lowest score.
 * Page info object:
 *  {
 *    pageTitle: string
 *    pageUrl: string
 *    pageScore: float
 *  }
 */
async function search(query) {

    /* Preprocess query */
    let stripQuery = textProcessing.stripText(query);

    /* Getting page indices */
    //let indices = []
    //for(word of stripQuery) {
	//let currList = await db.dbGetDocument("wordPages", key);
    //}


    /* Get all scores */
    let [metadata, meaning, content] = await Promise.all([metadataScore(stripQuery), meaningScore(stripQuery), contentScore(stripQuery)]);

    /* Go through all page IDs, get score */
    let pages = await dbUtil.dbGetCollection("pages");
    let result = [];

    pages.forEach(doc => {
	let pageID = doc.data().pageID;
	let score = getScore(metadata[pageID], 0.5, meaning[pageID][1], meaning[pageID][0], content[pageID]);
	result.push({
	    pageTitle: doc.data().pageTitle,
	    pageUrl: doc.id,
	    pageScore: score
	});
    });

    /* Sort and return resulting array */
    result.sort((a, b) => {
	return b.pageScore - a.pageScore;
    });
    return result;
}

/** Takes in the three scores from each engine component, as well as the confidence value and relevance constant, and returns the resulting score */
function getScore(metadataScore, metadataRelevance, meaningScore, confidenceValue, contentScore) {
    return (metadataRelevance * metadataScore) + (1 - metadataRelevance) * ((confidenceValue * meaningScore) + (1 - confidenceValue) * contentScore);
}


/** Takes in a preprocessed search query, returns a list of metadata scores, indexed by pageID */
async function metadataScore(pQuery) {

    let pageData = await dbUtil.dbGetCollection("pageMetadata");
    let result = [];

    pageData.forEach(doc => {
	let pageID = doc.id;
	result[pageID] = metadata.metadataScore(pQuery, doc.data().termFrequency);
    });
    return result;
}

/** Takes in a preprocessed search query, returns a list of lists of word meaning scores and confidence values, indexed by pageID */
async function meaningScore(pQuery) {

    let pageData = await dbUtil.dbGetCollection("pageVec");
    let result = [];

    let matrixQuery = await meanings.stringToMatrix(pQuery);

    pageData.forEach(doc => {
	let pageID = doc.id;
	//console.log("Meaning Score: " + matrixQuery + " (" + matrixQuery.length + ") --- " + doc.data().matrix + "(" + doc.data().matrix.length + ")");
	result[pageID] = meanings.meaningSearch(Object.values(matrixQuery), Object.values(JSON.parse(doc.data().matrix)));
    });
    return result;
}

/** Takes in a preprocessed search query, returns a list of word content scores, indexed by pageID */
async function contentScore(pQuery) {

    let pageData = await dbUtil.dbGetCollection("pageContent");
    let result = [];

    pageData.forEach(doc => {
	let pageID = doc.id;
	result[pageID] = content.calculate_similarity_score(pQuery.split(" "), doc.data().processedPage.split(" "));
    });
    return result;
}
