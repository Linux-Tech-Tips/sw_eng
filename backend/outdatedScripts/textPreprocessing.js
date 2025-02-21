const sw = require('stopword')

//function that takes a string and returns a string without punctuation, stopwords, whitespace, and all in lowercas
function stripText(input) {
  
  let text = input.toLowerCase();
  
  //remove punctuation
  text = text.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '')
  
  //remove whitespace
  text = text.replace(/[\t\n\r]/g,'');

  //remove stopwords
  let textArray = text.split(' ');
  textArray = sw.removeStopwords(textArray); 
  text = textArray.join(' ');
  
  return text;
}

console.log(stripText("Hello! I am a sentence with stop words in it!"));

