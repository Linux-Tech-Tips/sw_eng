
//function that takes two matrices and returns a number representing how similar they are
//number is within [0,1]

//CONCEPT:
  //do a cosine similarity between each word in the query and the page, count how many results are above a certain threshold 
  //divide that number by the number of words in the page --> save it in the similarity array
  //then a)calculate the average of the similarity array (if this alternative, array not necessary)
  //OR   b)calculate the average of the similarity array, adding some number to it if there are words that are very similar

function compareMatrices(query, page) {
  let similarity = []; //matrix for the similarity of each word
  for(let i=0; i<query.length; i++) {
    similarity[i]=0;
  }
  let threshold = 0.5; //threshold for similarity between words EDIT TO TWEAK PERFORMACE
  let importantWord = 0.7; //threshold for when a word is big relevant EDIT TO TWEAK PERFORMANCE  
  let increaseSimilarity = 0.01; //amount to add to the similarity if a word is big relevant COULD MAYBE CHANGE DEPENDING ON WORDCOUNT????  

  let dotProduct = 0;
  let magQuery = 0; //magnitude of current query word
  let magPage = 0; //magnitude of current page word
  let cosim = 0; //cosine similarity between current words

  for(i=0; i<query.length; i++) {//for all words in the query
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
      
      //if the similarity is high enough --> increment the similarity index of that word
      if(cosim>threshold) {
        similarity[i]++;
      }
    }
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
    if(similarity[i]>importantWord) {
      avgSimilarity+=increaseSimilarity;
    }
  }
  console.log(avgSimilarity);

}

function sumSquares(acc, n){
  return acc += n*n;
}

let mA = [[1,2,3],[2,3,1], [3,2,1]];
let mB = [[1,2,3],[-2,-3,-1], [-3,-2,-1]];
compareMatrices(mA, mB);

