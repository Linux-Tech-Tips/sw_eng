
module.exports = { extractAllLinks };
// A dfs implementation using a stack to store both the pagedata and the links associated with the page data.
async function extractAllLinks(url, domain, limit) {
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
    


        for (let link of links) {
            if (visitedUrls[link] === null) {
                stack.push(link);
                visitedUrls[link] = true;
            }
        }
        limit--;
    }
    console.log(linkStorage);
    return pageDataStorage;
}