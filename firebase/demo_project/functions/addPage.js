/* Main file containing the Page Add API JavaScript Functions */

module.exports = {addPage};

const db = require("./dbUtil.js");
const textProcessing = require("./textProcessing.js");
const metadata = require("./metadata.js");
const meanings = require("./meanings.js");
const crawler = require("./crawler.js");

/** Takes in a string baseUrl and a domain for a website, finds any viable subpages, processes them and adds the processed data into the database */
async function addPage(urls, baseUrl) {
    /* Fetch array of urls and create array of page strings */
    //let limit = 50; //limit on how many links the crawler extracts
    //let urls = [];
    let pages = [];
    //urls = await crawler.extractAllLinks(baseUrl, domain, limit);
	/* A few print statements for the crawler. */
	//console.log("The number of links extracted: "  + urls.length);
	//console.log("The links extracted: " + urls);
    
    for(let i  = 0; i < urls.length; ++i) {
      pages[i] = (await crawler.getPageData(urls[i]));
    }

    /* Preprocess pages, strip html and then save to plaintext */
    for(let idx = 0; idx < pages.length; idx++) {
      let page = textProcessing.htmlToText(pages[idx]);
      let pageTitle = page[0];
      let strippedTitle = textProcessing.stripText(pageTitle);
      let content = textProcessing.stripText(page[1]);
      pages[idx] = [pageTitle, strippedTitle, content];
      console.log("Page " + pageTitle + " stripped: " + strippedTitle + ", " + content);
    }
    console.log("Pages stripped");

    let pageID = await db.dbGetLastID();

    /* Go through preprocessed pages, save into database */
    for(let i = 0; i < pages.length; ++i) {
	/* Increment ID of last page added */
	++pageID;

	/* Add page to database */
	await db.dbSetPage(encodeURIComponent(urls[i]), baseUrl, new Date(), pages[i][0], pageID);
	console.log("Added page to db: " + encodeURIComponent(urls[i]) + ", " + baseUrl);
	
	/* Process metadata and add to database */
	let termFreq = await metadata.metadataProcess([pages[i][1], pages[i][2]]);
	await db.dbSetPageMetadata(pageID.toString(), termFreq);
	console.log("Added Page Metadata");

	/*
	/* Add the page ID to the documents for each word where the termFreq is above a threshold x */
	let threshold = 0.01; //placeholder value
	for(key in termFreq) {
	    if(termFreq[key] > threshold) {	
		let currList = await db.dbGetDocument("wordPages", key);
		currList = currList.data();

		if(currList == undefined) {
		    currList = {};
		    currList.ids = [];
		    currList.ids.push(pageID);
		} else if(!currList.ids.includes(pageID)) {
		    currList.ids.push(pageID);
		}
		await db.dbSetDocument("wordPages", key, currList);
	    }
	}
	console.log("Added keys to wordPages");
	*/
	    
	/* Process meaning and add to database */
	let matrix = await meanings.stringToMatrix(pages[i][2]);
	matrixString = JSON.stringify(matrix);

        /* If the matrix is longer than Firestore maximum document size fragment it */
	const firebaseLimit = 1048287;
        let fragmentNum = 0;
	/* Adding the initial fragment */
	await db.dbSetPageVec(pageID.toString(), matrixString.substring(0, firebaseLimit), matrix[0], ((firebaseLimit < matrixString.length ? ++fragmentNum : -1)));
	/* Adding the rest of the fragments if any */
	for(let i = firebaseLimit; i < matrixString.length; i += firebaseLimit) {
	    await db.dbSetPageVec(pageID.toString() + "_" + fragmentNum, 
				    matrixString.substring(i, (i + firebaseLimit)), matrix[0], 
				    ((i + firebaseLimit) < matrixString.length ? ++fragmentNum : -1));
	}
	console.log("Added Page Vector to Database");
	
	/* Add content to database */
	await db.dbSetPageContent(pageID.toString(), pages[i][2]);
       	console.log("Page " + pageID + " content added: " + pages[i][2]);
    }
    await db.dbSetLastID(pageID);
}
   
