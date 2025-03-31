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
    
    //normalise meaning score into [0,1]
    //I know there's probably a better way to find the max/min score but gahhh
    let maxVal = -1;
    let minVal = 1;
    for(id in meaning) {
      if(meaning[id][1]>maxVal) {
        maxVal = (meaning[id][1]);
      }
      else if(meaning[id][1]<minVal) {
        minVal = (meaning[id][1]);
      }
    }
    console.log("Minimum value: " + minVal);
    console.log("Maximum value: " + maxVal);
    for(id in meaning) {
      meaning[id][1] = ((meaning[id][1]-minVal)/(maxVal-minVal));
    }
    
    /* Go through all page IDs, get score */
    let pages = await dbUtil.dbGetCollection("pages");
    let result = [];

    pages.forEach(doc => {
	let pageID = doc.data().pageID;
	if(pageID.toString().includes('_')) {
	    return;
	}
	let score = getScore(metadata[pageID.toString()], 0.5, meaning[pageID.toString()][1], meaning[pageID.toString()][0], content[pageID.toString()]);
	let testScore = getScoreTest(metadata[pageID.toString()], 0.5, meaning[pageID.toString()][1], meaning[pageID.toString()][0], content[pageID.toString()]);
/*	console.log("Metadata score for " + pageID + ": " + metadata[pageID]);
	console.log("Meaning score for " + pageID + ": " + meaning[pageID]);
	console.log("Content score for " + pageID + ": " + content[pageID]);
	console.log("Total score for " + pageID + ": " + score);
	//console.log("Total score with lower meaning value for " + pageID + ": " + testScore);
*/	
        result.push({
	    pageTitle: doc.data().pageTitle,
	    pageUrl: doc.id,
	    pageScore: score
	});
    });
    console.log("Meaning score for 5: " + meaning[5]);
    console.log("Meaning score for 46: " + meaning[46]);
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

//test with a lower meaning score relevance
function getScoreTest(metadataScore, metadataRelevance, meaningScore, confidenceValue, contentScore) {
    return (metadataRelevance * metadataScore) + (1 - metadataRelevance) * ((0.7 * confidenceValue * meaningScore) + (1 - confidenceValue) * contentScore);
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
