
const crawler = require("./crawler.js");
const fs = require('fs');



async function storePageData(url, filename) {
    fs.writeFile(filename, await getPageData(url), function(err) {
        if (err) throw err;
        console.log('Page data stored.');
    })
}

async function storeRobotsData(data) {
    fs.writeFile("robot-info.txt", JSON.stringify(await data, null, " "), function (err) {
        if (err) throw err;
        console.log("robots data stored.");
    })
}

// Current issue, the data is present solely within the function and when it is returned to the global scope, it's seen as a promise. 
// Need to fix it.
//let url = 'https://webscraper.io/test-sites/e-commerce/allinone';

// a better website to use for getting the data from robots.txt.
let url = 'https://crawler-test.com/';
//let robots = parseRobotsTxt(url_test);
//let urlObject = new URL(url);


//extractRuleCategories(robots);
//filterRules("allow", robots);
crawler.extractAllLinks(url, new URL(url).hostname, 7);