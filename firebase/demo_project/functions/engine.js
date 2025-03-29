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

    /* Get indices of relevant pages */
    /*let wordPages = [];
    let words = dbUtil.dbOpenCollection("wordPages");
    for(word of stripQuery.split(" ")) {
	console.log("checking word " + word)
	let currList = await dbUtil.dbGetCollectionDoc(words, word);
	console.log(currList);
	if(currList.data()) {
	    console.log("found data");
	    for(num of currList.data().ids) {
		console.log("looking through id " + num);
		if(!wordPages.includes(num)) {
		    wordPages.push(num);
		    console.log("added id " + num);
		}
	    }
	}
    }

    /* Get all scores */
    let [metadata, meaning, content] = await Promise.all([metadataScore(stripQuery), meaningScore(stripQuery), contentScore(stripQuery)]);

    /* Go through all page IDs, get score */
    let pages = await dbUtil.dbGetCollection("pages");
    let result = [];

    pages.forEach(doc => {
	let pageID = doc.data().pageID;
	if(pageID.toString().includes('_')) {
	    return;
	}
	let score = getScore(metadata[pageID.toString()], 0.5, meaning[pageID.toString()][1], meaning[pageID.toString()][0], content[pageID.toString()]);
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
	if(pageID.toString().includes('_')) {
	    return;
	}
	result[pageID.toString()] = metadata.metadataScore(pQuery, doc.data().termFrequency);
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
	if(pageID.toString().includes('_')) {
	    return;
	}
	//console.log("Meaning Score: " + matrixQuery + " (" + matrixQuery.length + ") --- " + doc.data().matrix + "(" + doc.data().matrix.length + ")");
	let pageContent = doc.data().matrix;
	if(doc.data().nextID >= 0) {
	    let currentDoc = doc;
	    while(currentDoc.data().nextID >= 0) {
		let docID = pageID + "_" + currentDoc.data().nextID;
		currentDoc = pageData.docs.find((element) => element.id == docID);
		pageContent += currentDoc.data().matrix;
	    }
	}
	result[pageID.toString()] = meanings.meaningSearch(Object.values(matrixQuery), Object.values(JSON.parse(pageContent)));
    });
    return result;
}

/** Takes in a preprocessed search query, returns a list of word content scores, indexed by pageID */
async function contentScore(pQuery) {

    let pageData = await dbUtil.dbGetCollection("pageContent");
    let result = [];

    pageData.forEach(doc => {
	let pageID = doc.id;
	if(pageID.toString().includes('_')) {
	    return;
	}
	result[pageID.toString()] = content.calculate_similarity_score(pQuery.split(" "), doc.data().processedPage.split(" "));
    });
    return result;
}
