/* Main file containing the Page Add API JavaScript Functions */

const dbUtil = require("./dbUtil.js");


/** Takes in a string baseUrl to a website, finds any viable subpages, processes them and adds the processed data into the database */
async function addPage(baseUrl) {

    // TODO Based on how the Crawler works, this will differ - either JS array of HTML pages, or list of crawlable sites for which HTML will be obtained independently
    // Steps:
    //  -> For each Crawled page (HTML obtained), do:
    //    -> call preprocessor to turn HTML into plaintext and then plaintext into preprocessed
    //    -> throw the plaintext into each of the three preprocessors, function which will return a JS object
    //    -> save JS object from each preprocessor into the appropriate database
    //    -> or, alternatively, let each preprocessor do the saving themselves

}
