/* Main file containing the Search Engine API JavaScript Functions */


/* Takes in a search query as an unprocessed string, returns sorted array of JavaScript objects containing page information, from highest to lowest score.
 * Page info object:
 *  {
 *    pageTitle: string
 *    pageUrl: string
 *    pageScore: float
 *  }
 */
function search(query) {

    // TODO This function needs to be implemented. For its implementation, all the other components must be finished first. For now, this serves as a placeholder.

    // Step 1: Process the query using a preprocessor
    //  -> Required function: takes an unprocessed string as an argument, returns string containing space-separated preprocessed words

    // Step 2: Go through all existing pages in the database, call score calculation function on query and page
    //  -> Required function: Function that uses all three existing processors to calculate a final score using the formula from REQ_DOC

    // Step 3: Return aggregate result

}


// TBD The way the page is passed into this depends on the final database design
/* Takes in a preprocessed query string and the numeric ID of a page, and returns a similarity score based on the formula */
function getScore(pQuery, pageID) {

    // TODO This function needs to be implemented. For its implementation, other components must be finished first.

    // Step 1: Send query and required page referene/identifier into each query matching function
    // Step 2: Calculate final score from the three scores, and return the result

    // Variables necessary for the formula:
    //  -> Metadata relevance constant - arbitrary value
    //  -> Confidence value - calculated by word meaning match function

    // Required function interfaces:
    //  -> Functions to calculate score:
    //    -> Function taking a string query and page identifier (based on Database design), which returns word meaning correlation score and the confidence value (based on both page and query)
    //    -> Function taking a string query and page identifier, which returns the word content correlation score
    //    -> Function taking a string query and page identifier, which returns the metadata correlation score

    // Things to consider based on database read/write speed:
    //  -> Will it be faster to fetch each page separately by ID to save memory, or to fetch all pages at once, to save DB read ops and cpu time?

}
