const searchButton = document.getElementById('search-button');
const searchBox = document.getElementById('search-box');
const searchLoadingOverlay = document.getElementById('search-loading-overlay');

searchButton.addEventListener('click', function() {
    searchLoadingOverlay.style.display = 'flex';

    setTimeout(function() {
        searchLoadingOverlay.style.display = 'none';

        setTimeout(() => {
            window.location.href = "results.html?query=" + encodeURIComponent(searchBox.value);
        });
    }, 4000);
});
