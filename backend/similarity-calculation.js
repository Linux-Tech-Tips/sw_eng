module.exports = { calculate_similarity_score };


// This is just the implementation of the jaro similarity function.
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



// an equivalent of an activation function is required in order to skew the values of the similarity score towards what's required.
function correction(score, threshold) {
    // so far a value of exactly 1 leads towards 0.5
    let exponent = 1 + Math.pow(score, threshold);
    return Math.pow(score, exponent);
}

// merge page_process and term_comparison such that, there's only one function that takes in the query and the page.
// creates a hashtable with length equal to the query. save the maximum term comparison to the term's value.
// reduce all gathered values into a singular one
// and return it.

// input: 
// -> query [ list of words ]
// -> page [ list of words ]

// output: a score between 0 and 1
function calculate_similarity_score(query, page) {
	var result = 0.0;
    
    // a more permissable threshold for fuzzy searching.
    var threshold = 0.85;
    // The terms of the query are stored into a hashmap and their values are initially set to 0.0
	var query_map = new Map();
	query.forEach((term) => {
		query_map.set(term, 0.0);
	});

	var query_length = query.length;

	for ( word of page ) {
		for ( term of query ) {
            // comparing each term of the query with each word in the page (efficiency is to be improved)
            // if the jaro similarity of the term with the currently checked word is greater than the previously stored value, update the hashmap.
			var prev_value = query_map.get(term);
			query_map.set(term, Math.max(prev_value, jaro(term, word)));
		}
	}
    // afterwards, retrive all of the values from the query map and "normalise" them.
    1
	for ( term of query ) {
		result += query_map.get(term) / query_length;
	}
    result = Math.min(1, result);
    // apply a correction function which to ensure that values below a certain threshold are skewed towards 0 and those above it are skewed towards 1.
	return correction(result, threshold);
}