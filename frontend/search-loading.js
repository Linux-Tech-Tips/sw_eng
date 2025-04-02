function sendSearch(searchBoxId, resultsPage) {
    const searchBox = document.getElementById(searchBoxId);
    const query = encodeURIComponent(searchBox.value);
    window.location.href = resultsPage + "?query=" + query; // Send to results page immediately
}
