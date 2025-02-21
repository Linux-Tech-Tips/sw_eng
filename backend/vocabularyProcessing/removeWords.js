//script that processes the original file of word vectors into a filtered file in JSON formatting

const  fs = require('fs');
const sw = require('stopword');

let glove = fs.readFileSync('/Users/elisabeth/Desktop/Year2/SWE/SWE/glove2.txt');//glove2.txt is the file with the words+vectors on one line each

glove = glove.toString().split('\n'); //split it into an array by newlines and sort it
glove.sort();


let gloveArray = {};
let tempArray = [];

for(let i=0; i<glove.length; i++) { //for all entries in the original array
  if(glove[i].substring(0, glove[i].indexOf(' ')).match(/^[a-z]+$/g)) { //if the word is entirely english characters 
    tempArray[0] = glove[i].substring(0, glove[i].indexOf(' '));
    tempArray = sw.removeStopwords(tempArray); //call removeStopwords on it
    if(tempArray.length>0) {  //if the word still exists add it to the new array
      gloveArray[glove[i].substring(0, glove[i].indexOf(' '))] = glove[i].substring(glove[i].indexOf(' ') +1).split(' '); //set the vector as the entry indexed to the word
      
    }
  }
}

fs.writeFileSync('glove.txt', JSON.stringify(gloveArray));
