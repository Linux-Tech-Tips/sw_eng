//script that processes the original file of word vectors into a filtered file in JSON formatting

module.exports = {uploadVocab};

async function uploadVocab() {

const db = require('../dbUtil');
const fs = require('fs');
const sw = require('stopword');

let glove = fs.readFileSync('/Users/elisabeth/Desktop/Year2/SWE/SWE/semiProcessedVectors.txt');//glove2.txt is the file with the words+vectors on one line each

glove = glove.toString().split('\n'); //split it into an array by newlines and sort it
glove.sort();

let gloveArray = {};
let tempArray = [];

for(let i=30000; i<glove.length; i++) { //for all entries in the original array
  if(glove[i].substring(0, glove[i].indexOf(' ')).match(/^[a-z]+$/g)) { //if the word is entirely english characters 
    tempArray[0] = glove[i].substring(0, glove[i].indexOf(' '));
    tempArray = sw.removeStopwords(tempArray); //call removeStopwords on it
  if(tempArray.length>0 && tempArray[0].length>1 && tempArray[0].substring(0,1)!=tempArray[0].substring(1,2)) {  //if the word exists, is longer than 2 characters and the first two characters aren't identical--> add it to the new array
     //await db.dbSetWord(glove[i].substring(0, glove[i].indexOf(' ')), glove[i].substring(glove[i].indexOf(' ') +1).split(' ')); //add the word to the database
      gloveArray[glove[i].substring(0, glove[i].indexOf(' '))] = glove[i].substring(glove[i].indexOf(' ') +1).split(' '); //set the vector as the entry indexed to the word
        }
  }
}
/*fs.writeFileSync('glove.txt', "");
      for(key in gloveArray) {
        fs.appendFileSync('glove.txt', key + ": " + JSON.stringify(gloveArray[key]) + "\n");
      }*/ 
 
fs.writeFileSync('glove.txt', JSON.stringify(gloveArray));
}
uploadVocab();
