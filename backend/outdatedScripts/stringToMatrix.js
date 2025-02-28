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



