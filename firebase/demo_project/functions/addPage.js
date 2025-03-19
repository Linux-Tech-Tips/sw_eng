/* Main file containing the Page Add API JavaScript Functions */

module.exports = {addPage};

const db = require("./dbUtil.js");
const textProcessing = require("./textProcessing.js");
const metadata = require("./metadata.js");
const meanings = require("./meanings.js");
const crawler = require("./crawler.js");

/** Takes in a string baseUrl and a domain for a website, finds any viable subpages, processes them and adds the processed data into the database */
async function addPage(baseUrl, domain) {
    /* Fetch array of urls and create array of page strings */
    let limit = 2; //limit on how many links the crawler extracts
    let urls = ["test1", "test2"];
    let pages = ["<html><head><title>Test 1!!</title></head><body> 5 Linux is a Unix based operating system<script>this is a script tag</script></body></html>", "<html><head><title>Test 2!!</title></head><body>The linux mascot is a penguin<script>this is also a script tag</script></body></html>"];
    /*urls = await crawler.extractAllLinks(baseUrl, domain, limit);
	/* A few print statements for the crawler. *
	console.log("The number of links extracted: "  + urls.length);
	console.log("The links extracted: " + urls);
    
	console.log("I got the links!!");

    for(let i  = 0; i <  urls.length; i++) {
      pages[i] = (await crawler.getPageData(urls[i]));
    }
    console.log("I got the pages!");*/

    /* Preprocess pages, strip html and then save to plaintext */
    for(let idx = 0; idx < pages.length; idx++) {
      let page = textProcessing.htmlToText(pages[idx]);
      let pageTitle = page[0];
      let strippedTitle = textProcessing.stripText(pageTitle);
      let content = textProcessing.stripText(page[1]);
      pages[idx] = [pageTitle, strippedTitle, content];
    }

    console.log("I stripped the pages!!");
    let pageID = await db.dbGetLastID();

    /* Go through preprocessed pages, save into database */
    for(let i = 0; i < pages.length; i++) {
	/* Increment ID of last page added */
	++pageID;

	/* Add page to database */
	await db.dbSetPage(urls[i], baseUrl, new Date(), pages[i][0], pageID);
	console.log("Page " + pageID + " added!");
	
	/* Process metadata and add to database */
	let termFreq = await metadata.metadataProcess([pages[i][1], pages[i][2]]);
        await db.dbSetPageMetadata(pageID.toString(), termFreq);
	console.log("Page " + pageID + " metadata added!");

	/* Add the page ID to the documents for each word where the termFreq is above a threshold x */
	let threshold = 0.01; //placeholder value
	for(key in termFreq) {	
	  if(termFreq[key]>threshold){	
	    let currList = await db.dbGetDocument("wordPages", key);
	    currList = currList.data();
	    if(currList === undefined){
      	      currList = {};
	      currList[0] = [];
	      currList[0].push(pageID);
   	    }

	    else if(!currList[0].includes(pageID)){
   	      currList[0].push(pageID);
              }
	  
	    await db.dbSetDocument("wordPages", key, currList);
	    console.log("Page " + pageID + " added to " + key + "!");
	  }
	}	
	
	/* Process meaning and add to database */
	let matrix = await meanings.stringToMatrix(pages[i][2]);
	await db.dbSetPageVec(pageID.toString(), matrix, matrix[0]);
	console.log("Page " + pageID + " vectors added!");
	
	/* Add content to database */
	await db.dbSetPageContent(pageID.toString(), pages[i][2]);
       	console.log("Page " + pageID + " content added!");
    }
    await db.dbSetLastID(pageID);
}
   
