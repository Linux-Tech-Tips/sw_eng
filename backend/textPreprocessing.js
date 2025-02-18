//function that takes a string and returns a string without punctuation, stopwords, and all in lowercase
//local tests with files commented out

//import fs from 'fs';
import * as sw from 'stopword';

function stripText(input) {
  let text = input.toLowerCase();
  text = text.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '')
  let textArray = text.split(' ');
  textArray = sw.removeStopwords(textArray);
  text = textArray.join(' ');
  return text;
}

/*let file = fs.readFileSync('/Users/elisabeth/Desktop/Year2/SWE/SWE/vocab.txt');
file = file.toString();
fs.writeFileSync('/Users/elisabeth/Desktop/Year2/SWE/SWE/vocab.txt', stripText(file));
*/
