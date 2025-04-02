module.exports = { metadataProcess, metadataScore };

/* Takes in preprocessed page data in the format [pageTitle, pageContent], returns an associative list with words as keys and their importance as values */
function metadataProcess(pageData) {

    /* Variables to be used in the processing */
    let pageTitle = pageData[0].split(" ");
    let pageContent = pageData[1].split(" ");
    let words = {};
    let pageSize = pageContent.length;

    /* Going through page content and incrementing counter for each word */
    for(word of pageContent) {
	if(words[word]) {
	    ++words[word];
	} else {
	    words[word] = 1;
	}
    }
    /* Incrementing counters with more weight based on page title */
    for(word of pageTitle) {
	if(words[word]) {
	    words[word] *= 2;
	    pageSize += words[word] / 2;
	} else {
	    words[word] = 1;
	}
    }

    /* Normalizing term frequency counts to be between 0 and 1 */
    for(word in words) {
	words[word] /= pageSize;
    }

    return words;
}

/* Takes in a preprocessed query and page data in the format returned by the metadataProcess function, returns correlation score */
function metadataScore(query, pageData) {

    let text = query.split(" ");
    let cScore = 0;

    /* Getting cumulative score for page */
    for(word of text) {
	if(pageData[word])
	    cScore += pageData[word];
    }

    /* Returning normalized score */
    return cScore / text.length;
}


