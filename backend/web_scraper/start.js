
const crawler = require("./crawler.js");
const similarity = require("./similarity-calculation.js");

const cheerio = require("cheerio");
const axios = require("axios");
const parse = require('robots-txt-parse');
const fs = require('fs');



// A lambda function that is supposed to place the crawler to "sleep" for a short amount of time so that it's not automatically banned.
const delay = (tm) => {setTimeout(() => {}, tm * 1000)};

// Place a mock data response when testing this for the web crawler.
async function getPageData(url) {
    //const response = await axios.get(url);
    //console.log(url);
    const delayTime = 5;
    const response = await axios.request({
        method: "GET",
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    });
    delay(delayTime);
    
    return response.data; 
}

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
// not fully my own tbh.


async function extractLinks(pageData) {
    // pageData is effectively a Promise.
    const $ = cheerio.load(await pageData); 
    let links = [];

    $('a').each((index, element) => {
        let link = $(element).attr('href');

        if (link && link.startsWith('http')) {
            links.push(link);
        }
    })
    console.log(links);
    return links;
}



// finds the root of the website via domain shenanigans.
function websiteFormatter(url, webpage) {
    let urlObject = new URL(url);
    let hostname_start = url.indexOf(urlObject.hostname);
    return url.substring(0, hostname_start + urlObject.hostname.length + 1) + webpage;
}

// so it does work but it's compressed when it's displayed in the terminal.
// the robots txt file is parsed into 2 sections. the first represents the groups that are being used
// (only the "*" matters for me) in this scenario as this is a custom crawler.
// The second section represents any extensions, which in this case would mean the sitemaps present.
async function parseRobotsTxt(url) {
    let input = await getPageData(websiteFormatter(url, 'robots.txt'));
    let output = await parse(input);
    return output;
}

// a function that extracts the important parts from the robots object
// the promise data has to be stored in a variable for this to work as intended.
async function extractRules(robots) {
    let result = [];
    let data = await robots;
    for (let group of (data['groups'])) {
        // because this is a custom crawler for a custom search engine, we will have to use the wildcard agent rules.
        if (group["agents"] == "*") {
            //result.concat(group['rules']);
            for (let rule of group['rules']) {
                result.push(rule);
            }
        }
    }
    return result;
}

// a function to extract all rule categories such that it can be automatically used as a filter for the obtained rules.
async function extractRuleCategories(robots) {
    let rule_types = [];
    let rules = await extractRules(robots);
    for (let rule of rules) {
        if ( !rule_types.find((type) => type == rule.rule) ) {
            rule_types.push(rule.rule);
        }
    }
    console.log(rule_types);
    return rule_types;
}

// a function that will return the filtered rules.
async function filterRules(filter, robots) {
    let rules = await extractRules(robots);
    let filtered_rules = rules.filter((rule) => rule.rule == filter);
    console.log(filtered_rules);
    return filtered_rules;
}

// Current issue, the data is present solely within the function and when it is returned to the global scope, it's seen as a promise. 
// Need to fix it.
let url = 'https://webscraper.io/test-sites/e-commerce/allinone';

// a better website to use for getting the data from robots.txt.
let url_test = 'https://crawler-test.com/';
let robots = parseRobotsTxt(url_test);
let urlObject = new URL(url);


extractRuleCategories(robots);
filterRules("allow", robots);
