module.exports = { jaro, jaro_winkler };

function jaro(query, word) {
    if (query == word) {
        return 1.0;
    }
    query_length =  query.length;
    word_length = word.length;

    max_dist = Math.floor(Math.max(query_length, word_length) / 2) - 1;

    match = 0;

    query_hash = [];
    word_hash = [];
    for (var i = 0; i < query.length; i++){
        query_hash.push(0);
    }
    for (var i = 0; i <  word_length; i++) {
        word_hash.push(0);
    }

    for (var i = 0; i < query_length; i++) {
        for (var j = Math.max(0, i - max_dist) ; j < Math.min(word_length, i + max_dist + 1); j++) {
            if (query[i] == word[j] && word_hash[j] == 0) {
                query_hash[i] = 1;
                word_hash[j] = 1;
                match += 1;
            }
        }
    }
    if (match == 0) {
        return 0.0;
    }

    t = 0;
    point = 0;

    for (var i = 0; i < query_length; i++) {
        if (query_hash[i] == 1) {
            while (word_hash[point] == 0) {
                point += 1;
            }
            if (query[i] != word[i]) {
                t += 1;
            }
            point += 1;
        }
    }
    t = Math.floor(t/2);

    return ((match / query_length + match / word_length + (match - t) / match) / 3.0).toPrecision(3);
}

// Only exists to check for the initial prefix of the words (query and word) for the jaro-winkler similarity.
function common_prefix(word1, word2) {
    let result = 0;
    if (word1.length == 0 || word2.length == 0) {
        return 0;
    }
    let min_length = Math.min(word1.length, word2.length);
    for (var i = 0; i < min_length; i++) {
        if (word1[i] == word2[i]) {
            result++;
        }
    }
    return Math.max(result, 4);
}


// may not even be needed since it's more 
function jaro_winkler(query, word) {
    let jaro_sim = jaro(query, word);
    // Standard value for the constant.
    let p = 0.1;
    // This is the length of the common prefix between the query and the word with a max of 4 characters.
    // Now need to figure out how to do that.
    let l = common_prefix(query, word);
    return jaro_sim + l * p * (1 - jaro_sim);
}

// A function that reads in a page and runs the jaro winkler algorithm on each word.
function page_process(query, page) {
    var result = 0.0;
    var words = page.split(' ');
    for ( word of words ) {
        result = Math.max(result, jaro(query, word));
    }
    return result;
}


//console.log(jaro("This is an example sentence.", "This is an example sentence.")) // 1.0
//console.log(jaro("This is an exanple sentence.", "This is an example sentence.")) // Something around 0.9 ish
//console.log(jaro("example sentence", "This is an example sentence.")) // something a bit below 1.0 but still high

// Needs to be fine-tuned so that there's a higher difference between sentences.
//console.log(jaro("No words here are the same.", "This is an example sentence.")) // 0.0


