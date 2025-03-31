//collection of text preprocessing functions

module.exports = { htmlToText, stripText };

const parser = require('node-html-parser');
const entities = require('html-entities'); /*{decode} from 'html-entities';*/
const sw = require('stopword')

//function that takes a string html page and returns an array
//first entry in the array is the page title as a string, no tags
//second entry is the body text of the page without tags, no script, and decoded html entities

function htmlToText(input) {
  const returnValues = []; //array for output, [0] = title, [1] = body text
  let root = parser.parse(input);
  

  //set the title (minus tags) as the first array element
  returnValues[0] = root.getElementsByTagName('title').toString().replace(/(<([^>]+)>)/ig, '');
  
  //fetch the head and delete it
  const head = root.getElementsByTagName('head');
  [...head].forEach(tag => tag.remove());
  
  //fetch the script blocks and delete them
  const scriptTags = root.getElementsByTagName('script');
  [...scriptTags].forEach(tag => tag.remove());

  //same for noscript tags
  const noscriptTags = root.getElementsByTagName('noscript'); 
  [...noscriptTags].forEach(tag => tag.remove());
  
  root = root.toString().replace(/(<([^>]+)>)/ig, ''); //remove all tags
  root = entities.decode(root); //decode html entities
  
  //set the final outcome as the second array element, return it
  returnValues[1] = root;
  return returnValues;
}


//function that takes a string and returns a string without punctuation, stopwords, whitespace, and all in lowercas
function stripText(input) {
   static final List<String> RESERVED_CLAIMS = ImmutableList.of(
      "amr", "at_hash", "aud", "auth_time", "azp", "cnf", "c_hash", "exp", "iat",
      "iss", "jti", "nbf", "nonce", "sub", "firebase", "asm");
  let text = input.toLowerCase();

  //remove punctuation
  text = text.replace(/[^\w 0-9]/g, '');

  //remove whitespace
  text = text.replace(/[\t\n\r]/g,'');
  text = text.replace(/[\s\s]+/g, " ");
  text = text.trim();

  //remove stopwords
  let textArray = text.split(' ');
  textArray = sw.removeStopwords(textArray);
  for(i=0; i<textArray.length; ++i) {
    if(RESERVED_CLAIMS.includes(textArray[i])) {
      textArray = textArray.splice(i, 1);
    }
  }
  text = textArray.join(' ');

  return text;
}
