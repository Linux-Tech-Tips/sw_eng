//collection of functions needed for the meaning search

module.exports = { stringToMatrix, meaningSearch };

const db = require('./dbUtil.js');
//function to turn a given (preprocessed) string into an array of vectors
//the first entry in the array is a percentage of how many words were found in the lookup table

async function stringToMatrix(text) {
  
  //split the given text into an array, create empty array for vectors
  let textArray = text.split(' ');
  let vectorisedText = {};
  vectorisedText[0] = 0; //counter for how many words were found, will be converted to a percentage
  let key = 0; //key for making the matrix of vectors an object
  let currVec = []; //vector for the current word

  //loop through the array, if the word is findable in the vector table --> add it and increment the counter of how many words were found
  for(let i=0; i<textArray.length; i++) {
    currVec = await db.dbGetWord(textArray[i]);
    if(currVec.data()){ 
      key = i+1;
      vectorisedText[key]= currVec.data().vec;
      vectorisedText[0]++;
    }

  }
  vectorisedText[0] = vectorisedText[0]/textArray.length; //convert the number of found words into percentage

  return vectorisedText;
}


//function that takes a JSON object query and a JSON object page
//the first entry in both the query matrix and the page object are a float representation of the perventage of words known
//returns an array, first value is the confidence value (based on words known) and second is the similarity score

function meaningSearch(query, page) {
  let similarity = []; //matrix for the similarity of each word
  for(let i=0; i<query.length; i++) {
    similarity[i]=0;
  }
  let dotProduct = 0;
  let magQuery = 0; //magnitude of current query word
  let magPage = 0; //magnitude of current page word
  let cosim = 0; //cosine similarity between current words
  let confidenceValue = (query[0]+page[0])/2 //confidence value is the average of words known 
 
  for(i=1; i<query.length; i++) {//for all words in the query
    //calculate the magnitude of the current word
    magQuery = query[i].reduce((acc, n) => acc + (n*n), 0);
    magQuery = Math.sqrt(magQuery);

    for(let j=1; j<page.length; j++) { //for each word in the page
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

  //loop through array, if any words are big important --> add to the similarity
  for(i=0; i<similarity.length; i++) { 
    if(similarity[i]>avgSimilarity) { //increase the similarity if a word appears more often than average
      avgSimilarity+=similarity[i]/similarity.length;
    }
  }
  let output = [confidenceValue, avgSimilarity];
  return output; 
  
}
