const fs = require('fs');

//function to turn a given (preprocessed) string into an array of vectors
//the first entry in the array is a percentage of how many words were found in the lookup table
//on its current state it works with a file of word vectors, in the actual engine it will work with a database

function stringToMatrix(text) {
  //processing the vector file into an array indexed by the word
  let vectors = fs.readFileSync('/Users/elisabeth/Desktop/Year2/SWE/SWE/sw_eng/backend/vocabularyProcessing/glove.txt');
  vectors = vectors.toString().split('/n');
  let vectorArray = {};
  let tempArray = {};
  for(let i=0; i<vectors.length; i++) {
    tempArray = vectors[i].split(':');
    vectorArray[tempArray[0]] = tempArray[1];
  }

  console.log(vectorArray);
  console.log(vectors); 
  //split the given text into an array, create empty array for vectors
  let textArray = text.split(' ');
  let vectorisedText = {};  
  vectorisedText[0] = 0; //counter for how many words were found, will be converted to a percentage

  //loop through the array, if the word is findable in the vector table --> add it and increment the counter of how many words were found
  for(let i=1; i<=textArray.length; i++) {
    if(vectorArray[textArray[i]]!=undefined){
      console.log("I found a word!");
      vectorisedText[i] = vectorArray[textArray[i]];
      vectorisedText[0]++;
    }
    else {
      console.log("word not found :(");
    }
  }
  vectorisedText[0] = vectorisedText[0]/textArray.length; //convert the number of found words into percentage

  return vectorisedText;
}

console.log(stringToMatrix("the quick brown fox jumped over the lazy dog"));


