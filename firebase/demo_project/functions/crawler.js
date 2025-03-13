const cheerio = require("cheerio");
const axios = require("axios");
const parse = require('robots-txt-parse');
const url = require('url');
module.exports = { extractAllLinks, getPageData };

// A lambda function that is supposed to place the crawler to "sleep" for a short amount of time so that it's not automatically banned.
const delay = (tm) => {setTimeout(() => {}, tm * 1000)};

// requirements for this being that i need:
// a fetchTimeout: 10 (a maximum amount of seconds to wait before deeming the link unreachable).
// a crawlTimeout: 30 {a delay time until the next...}
// politenessDelay: {a delay time until the next https request.}
// MaxDepth: {number of levels to crawl through a domain tree.}
// maxConcurrency: {number of threads running throught the crawler.}

// need to respect the nofollow tag in the meta data file.

async function getPageData(url) {
    //const instance = axios.create();
    // will wait for 3 seconds before timing out.
    //instance.defaults.timeout = 3000;
    //const response = await axios.get(url);
    //console.log(url);
    const delayTime = 7;
    //axios.defaults.timeout = 10;
    try {
        const response = await axios.request({
            method: "GET",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
            },
            timeout: 3000,
        });
        // this is the politeness delay.
        delay(delayTime);
    
    return response.data; 

    } catch (error) {
        return null;    
    }
}

// there's a noindex tag that pages need apparently, so that it wont appear during the searches.

async function extractLinks(pageData) {
    // pageData is effectively a Promise.
    const $ = cheerio.load(await pageData);
    
    // first check if the file has a nofollow tag in the meta data, if it does, dont extract the links from the website.
    let links = [];

    if ($('meta').find("nofollow").length != 0) {
        return []
    }

    $('a').each((index, element) => {
        let link = $(element).attr('href');
        if (link && link.trim() != "") {
            links.push(link);
        }
    })
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
    try {
    let input = await getPageData(websiteFormatter(url, 'robots.txt'));
    let output = await parse(input);
    return output;
    } catch (error) {
        return null;
    }
}

// a function that extracts the important parts from the robots object
// the promise data has to be stored in a variable for this to work as intended.
async function extractRules(robots) {
    let result = [];
    let data = await robots;

    if (data == null) {
        return [];
    }

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
    if (rules.length == 0) {
        return [];
    }
    for (let rule of rules) {
        if ( !rule_types.find((type) => type == rule.rule) ) {
            rule_types.push(rule.rule);
        }
    }
    //console.log(rule_types);
    return rule_types;
}


// a function that will return the filtered rules.
async function filterRules(filter, robots) {
    let rules = await extractRules(robots);
    if (rules.length == 0) {
        return [];
    }
    let filtered_rules = rules.filter((rule) => rule.rule == filter).map((link) => link.path);
    return filtered_rules;
}


async function isValidUrl(url) {
    try {
        let u = new url.URL(url);
        const response = await fetch(u);
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    }  catch (error) {
        return false;
    }
}

// A dfs implementation using a stack to store both the pagedata and the links associated with the page data.


// arguments: [baseUrl, domain of website, limit of links that the crawler is roughly returning.]
// returns a list of links.

async function extractAllLinks(url, domain, limit) {
    let stack = [];
    let visitedUrls = [];
    let linkStorage = [];
    let links = [];
    let robots = await parseRobotsTxt(url);
    let disallowed_links = await filterRules("disallow", robots);
    stack.push(url);

    while(stack.length > 0 && limit > -1) {
        // get the topmost url from the stack.
        currentUrl = stack.pop();
        //console.log(currentUrl);
        // toplevel check to see whether or not to go through the current url.
        // this doesn't work apparently.
        //if (visitedUrls[currentUrl] === true) {
          //  continue;
        //}
        // if the link is included in the disallowed rules section,
        // mark it as visited and continue.
        if (disallowed_links.includes(currentUrl)) {
            visitedUrls[currentUrl] = true;
            continue;
        }
        // if the current url is a non empty relative path:
        // format it to be an absolute path and check if it's a valid url.
        if (!currentUrl.startsWith("http") && currentUrl.trim() != "") {
      //      console.log(currentUrl);
            currentUrl = currentUrl.substring(1, currentUrl.length);
            currentUrl = websiteFormatter(url, currentUrl);
            if (isValidUrl(currentUrl)) {
                linkStorage.push(currentUrl);
            }
            else {
                visitedUrls[currentUrl] = true;
                continue;
            }
        }
        // this is to be redone hopefully.
        try {
            currentDomain = new URL(currentUrl).hostname;
        //console.log(currentDomain);
        if (currentDomain != domain) {
            visitedUrls[currentUrl] = true;
            continue;
        }
   
        } catch (error) {
            visitedUrls[currentUrl] = true;
            continue;
        }
        // the same website with a different http protocol marks this as true.... interesting.
        //console.log(currentUrl, visitedUrls[currentUrl]);

        if(visitedUrls[currentUrl] != true) {
            // console.log(currentUrl);            
            let pageData = await getPageData(currentUrl);
            // if the pageData is null, just mark the current url as visited and continue.
            if (pageData == null) {
                visitedUrls[currentUrl] = true;
                continue;
            }
            links = await extractLinks(pageData);
            //linkStorage.push([currentUrl, pageData]);
            //visitedUrls[currentUrl] = true;
        }


        for (let link of links) {
            if (visitedUrls[link] == undefined) {
                stack.push(link);
                visitedUrls[link] = true;
            }
        }
        limit--;
    }
    //linkStorage = new Set(linkStorage);
    linkStorage.forEach((link) => console.log(link));
    //console.log(linkStorage.length);
    /*
    for (let index = 0; index < linkStorage.length; index++) {
        const element = linkStorage[index];
        console.log(element);
        
    }
*/
    return linkStorage;
}
