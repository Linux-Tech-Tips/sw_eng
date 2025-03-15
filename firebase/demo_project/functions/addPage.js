/* Main file containing the Page Add API JavaScript Functions */

module.exports = {addPage};

const dbUtil = require("./dbUtil.js");
const textProcessing = require("./textProcessing.js");
const metadata = require("./metadata.js");
const meanings = require("./meanings.js");
const crawler = require("./crawler.js");

/** Takes in a string baseUrl and a domain for a website, finds any viable subpages, processes them and adds the processed data into the database */
async function addPage(baseUrl, domain) {
    console.log("addPage called!!");
    /* Fetch array of urls and create array of page strings */
    let limit = 2; //limit on how many links the crawler extracts
    let urls = [];
    let pages = [];
    urls = crawler.extractAllLinks(baseUrl, domain, limit);
    console.log("I got the links!!");

    for(i in urls) {
      pages[i] = (crawler.getPageData(urls[i]));
    }
    console.log("I got the pages!");

    /* Preprocess pages, strip html and then save to plaintext */
    for(idx in pages) {
	let page = textProcessing.htmlToText(pages[idx]);
	let pageTitle = page[0];
	console.log(pageTitle);
	let strippedTitle = textProcessing.stripText(pageTitle);
	let content = textProcessing.stripText(page[1]);
	pages[idx] = [pageTitle, strippedTitle, content];
    }
    console.log("I stripped the pages!!");
    let pageID = await dbUtil.dbGetLastID();

    /* Go through preprocessed pages, save into database */
    for(i in pages) {
	/* Increment ID of last page added */
	++pageID;

	/* Add page to database */
	await dbUtil.dbSetPage(urls[i], baseUrl, new Date(), pages[i][0], pageID);
	console.log("Page " + pageID + " added!");
	/* Process metadata and add to database */
	let termFreq = await metadata.metadataProcess([pages[i][1], pages[i][2]]);
	await dbUtil.dbSetPageMetadata(pageID.toString(), termFreq);
	console.log("Page " + pageID + " metadata added!");

	/* Add the page ID to the documents for each word where the termFreq is above a threshold x */
	let threshold = 0.01; //placeholder value
	for(key in termFreq) {
	  if(termFreq>threshold){	
            let currList = await db.dbUtilGetDocument("wordPages", key);
	    if(currList==undefined){
	      currList = [];
	    }
	    if(!currList.includes(pageID)){
	      currList.push(pageID);
          }
	  await db.dbUtilSetDocument("wordPages", key, currList);
	  console.log("Page " + pageID + " added to wordPages!");
	}	
	/* Process meaning and add to database */
	let matrix = meanings.stringToMatrix(pages[i][2]);
	await dbUtil.dbSetPageVec(pageID.toString(), matrix, matrix[0]);
	console.log("Page " + pageID + " vectors added!");
	
	/* Add content to database */
	await dbUtil.dbSetPageContent(pageID.toString(), pages[i][2]);
        console.log("Page " + pageID + " content added!");
	}
    }
    await dbUtil.dbSetLastID(pageID);
}
   
