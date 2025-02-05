
const cheerio = require("cheerio");
const axios = require("axios");

// not fully my own tbh.

// Place a mock data response when testing this.
async function getPageData(url) {
    //const response = await axios.get(url);
    console.log(url);
    const response = await axios.request({
        method: "GET",
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    });
    //.then(({ data }) => responseData = data);
    // console.log(response.data);
    //const data = await response.data;
    return response.data; //response;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// not fully my own tbh.
async function extractLinks(pageData) {
    //console.log(await pageData);
    const $ = cheerio.load(await pageData);
    let links = [];

    $('a').each((index, element) => {
        let link = $(element).attr('href');
        //console.log(link);
        //if (link && link.trim !== "" && link !== '/' && !link.startsWith('/')) {
        if (link && link.startsWith('http')) {
            links.push(link);
        }
    })
    //console.log(links);
    return links;
}

// A dfs implementation using a stack to store both the pagedata and the links associated with the page data.
async function extractAllLinks(url, limit) {
    let stack = [];
    let visitedUrls = [];
    let pageDataStorage = [];
    let linkStorage = [];
    //console.log(url);
    stack.push(url);

    while(stack.length > 0 && limit > 0) {
        // ..
        currentUrl = stack.pop();
        //console.log(currentUrl);

        let pageData = await getPageData(currentUrl);
        let links = await extractLinks(pageData);
        //console.log(links);

        pageDataStorage.push([currentUrl, pageData]);

        linkStorage.push([currentUrl, pageData]);

        visitedUrls[currentUrl] = true;

        if(!visitedUrls[currentUrl]) {
            visitedUrls[currentUrl] = true;
        }
        for (link of linkStorage) {
            stack.push(link);
        }
    

        // for (link in links) 

        for (let link of links) {
            if (visitedUrls[link] === null) {
                stack.push(link);
                visitedUrls[link] = true;
            }
        }
        delay(5000);
        limit--;
    }
    console.log(linkStorage);
    //console.log(pageDataStorage);
    return pageDataStorage;
}


// Current issue, the data is present solely within the function and when it is returned to the global scope, it's seen as a promise. 
// Need to fix it.
let url = 'https://webscraper.io/test-sites/e-commerce/allinone';
let pageData = getPageData(url);
let links = extractLinks(pageData);
//console.log(pageData);
//console.log(links);

extractAllLinks(url, 5);


