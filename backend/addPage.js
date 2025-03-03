/* Main file containing the Page Add API JavaScript Functions */

const dbUtil = require("./dbUtil.js");
const textProcessing = require("./textProcessing.js");
const metadata = require("./metadata.js");

/** Takes in a string baseUrl to a website, finds any viable subpages, processes them and adds the processed data into the database */
async function addPage(baseUrl) {

    //let pages = ...
    // TODO Populate this once function to get list of HTML content found
    // -> Assuming 'pages' being an array of strings containing HTML data
    let pages = [];

    /* Preprocess pages, strip html and then save to plaintext */
    for(idx in pages) {
	let page = textProcessing.htmlToText(pages[idx]);
	let pageTitle = page[0];
	let strippedTitle = textProcessing.stripText(pageTitle);
	let content = textProcessing.stripText(page[1]);
	pages[idx] = [pageTitle, strippedTitle, content];
    }

    let pageID = await dbUtil.dbGetLastID();

    /* Go through preprocessed pages, save into database */
    for(page of pages) {
	/* Increment ID of last page added */
	++pageID;

	/* Add page to database */
	await dbUtil.dbSetPage(page /* TODO figure out URL */, baseUrl, new Date(), page[0], pageID);

	/* Process metadata and add to database */
	let termFreq = await metadata.metadataProcess([page[1], page[2]]);
	await dbUtil.dbSetPageMetadata(pageID.toString(), termFreq);

	/* Process meaning and add to database */
	/* TODO WAITING FOR FUNCTION */

	/* Add content to database */
	await dbUtil.dbSetPageContent(pageID.toString(), page[2]);
    }

    await dbUtil.dbSetLastID(pageID);

    // TODO Based on how the Crawler works, this will differ - either JS array of HTML pages, or list of crawlable sites for which HTML will be obtained independently
    // Steps:
    //  -> For each Crawled page (HTML obtained), do:
    //    -> call preprocessor to turn HTML into plaintext and then plaintext into preprocessed
    //    -> throw the plaintext into each of the three preprocessors, function which will return a JS object
    //    -> save JS object from each preprocessor into the appropriate database
    //    -> or, alternatively, let each preprocessor do the saving themselves
}
