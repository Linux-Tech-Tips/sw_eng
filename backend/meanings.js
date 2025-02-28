//collection of functions needed for the meaning search

module.exports = { stringToMatrix, meaningSearch };

//function to turn a given (preprocessed) string into an array of vectors
//the first entry in the array is a percentage of how many words were found in the lookup table

function stringToMatrix(text) {

  //split the given text into an array, create empty array for vectors
  let textArray = text.split(' ');
  let vectorisedText = {};
  vectorisedText[0] = 0; //counter for how many words were found, will be converted to a percentage

  //loop through the array, if the word is findable in the vector table --> add it and increment the counter of how many words were found
  for(let i=1; i<=textArray.length; i++) {
    if(vectorArray[textArray[i]]!=undefined){ //TBD: call the database to check if the word is defined
      vectorisedText[i] = vectorArray[textArray[i]]; //TBD: fetch the vector from the databse
      vectorisedText[0]++;
    }

  }
  vectorisedText[0] = vectorisedText[0]/textArray.length; //convert the number of found words into percentage

  return vectorisedText;
}

//function that takes two matrices and returns a number within [0,1] representing how similar they are. TBD: Also returns a value representing the confidence

function meaningSearch(query, page) {
  let similarity = []; //matrix for the similarity of each word
  for(let i=0; i<query.length; i++) {
    similarity[i]=0;
  }
  let dotProduct = 0;
  let magQuery = 0; //magnitude of current query word
  let magPage = 0; //magnitude of current page word
  let cosim = 0; //cosine similarity between current words
  
  
  for(i=0; i<query.length; i++) {//for all words in the query
    //TBD: remember that the percentage of words known is part of the array!!
    //calculate the magnitude of the current word
    magQuery = query[i].reduce((acc, n) => acc + (n*n), 0);
    magQuery = Math.sqrt(magQuery);

    for(let j=0; j<page.length; j++) { //for each word in the page
      //calculate the magnitude of the current word
      magPage = page[i].reduce((acc, n) => acc + (n*n),0);
      magPage = Math.sqrt(magPage);

      //calculate the dot product + the cosine similarity
      dotProduct = query[i].reduce((acc, n, k) => acc + (n * page[j][k]), 0);
      cosim = dotProduct/(magPage*magQuery);
      similarity[i]+=cosim; //increment the similarity index for that word by the cosine similarit
    }
    //console.log(similarity);
    //divide the similarity of the query word by the number of words in the page
    similarity[i] = similarity[i]/page.length;
  }
  
  //calculate the average of the similarity of all query words
  let avgSimilarity = similarity.reduce((acc, n) => acc + n, 0)/similarity.length;
  console.log(avgSimilarity);

  //loop through array, if any words are big important --> add to the similarity
  for(i=0; i<similarity.length; i++) {
    if(avgSimilarity+increaseSimilarity>1) {
      break;
    }
    if(similarity[i]>avgSimilarity) { //increase the similarity if a word appears more often than average
      avgSimilarity+=similarity[i]; //TBD: NEEDS TO BE ALTERED --> COULD PUT IT OVER 1
    }
  }
  return avgSimilarity; //TBD: needs to calculate smth with the percentages of words known

}
