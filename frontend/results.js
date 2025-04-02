function getSearch() {
    const query = new URLSearchParams(window.location.search);
    query.get();
}

// Displays until results are retrieved from backend??
function displayLoadingOverlay(loadingOverlayId) {
    const searchLoadingOverlay = document.getElementById(loadingOverlayId);

    searchLoadingOverlay.style.display = 'flex';
    searchLoadingOverlay.style.display = 'none';

}

async function processSearch(loadingOverlayId, resultsDivId, firebaseURL) {
    const searchLoadingOverlay = document.getElementById(loadingOverlayId);

    searchLoadingOverlay.style.display = 'flex';

    let query = new URLSearchParams(window.location.search).get("query");

    if(!query) {
        window.location.href = 'index.html';
    }

    try {

        let response = await fetch(firebaseURL + "?query=" + query);
        let results = await response.json();

        const resultsDiv = document.getElementById(resultsDivId);
        for(result of results) {
            let resultString = "<div class=\"result-item\"> \
                                    <h2 class=\"result-title\"><a href=\"" + unescape(result.pageUrl) + "\" class=\"result-link\">" + result.pageTitle + "</a></h2> \
                                </div>";
            resultsDiv.innerHTML += resultString;
        }

        searchLoadingOverlay.style.display = 'none';

    } catch(error) {
	document.getElementById(resultsDivId).innerHTML += "<div class='failure'>Error encountered: " + error.toString() + "</div>"
        searchLoadingOverlay.style.display = 'none';
    }
}
