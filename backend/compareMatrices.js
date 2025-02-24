
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
      avgSimilarity+=similarity[i]; //NEEDS TO BE ALTERED --> COULD PUT IT OVER 1
    }
  }
  console.log(avgSimilarity);

}

function genMatrices(length, min, max) {
  let v = new Array(length).fill(new Array(50).fill(0));
  for(let j=0; j<length; ++j) {  
    for(let i=0; i<50; ++i) {
      v[j][i] = Math.random() * (max - min) + min;
     }
  }
  return v;
}

function stressTest(size, min, max) {
  let v1 = genMatrices(10,min, max);
  let v2 = genMatrices(size,min, max); 
  
  compareMatrices(v1, v2);
  console.log("Run with a page wordcount of=" + size + "; min=" + min + "; max=" + max);
}

let t0 = performance.now();
stressTest(1000, 0, 1000);
stressTest(1000, 0, 1000);
stressTest(1000, 0, 1000);
stressTest(1000, 0, 1000);
stressTest(1000, 0, 1000);
let t1 = performance.now();
console.log("Performance: " + (t1-t0) + "ms");

/*
let mA = [[1,2,3],[2,3,1], [3,2,1]];
let mB = [[1,2,3],[-2,-3,-1], [-3,-2,-1]];
compareMatrices(mA, mB);
*/
