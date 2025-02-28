//script that processes the original file of word vectors into a filtered file in JSON formatting

module.exports = {uploadVocab};

async function uploadVocab() {

const db = require('./dbUtil.js');
const sw = require('stopword');
const fs = require('fs');

let glove = fs.readFileSync('./glove2.txt');//glove2.txt is the file with the words+vectors on one line each
glove = glove.toString().split('\n'); //split it into an array by newlines and sort it

let gloveArray = {};
let tempArray = [];

for(let i=0; i<glove.length; i++) { //for all entries in the original array
  if(glove[i].substring(0, glove[i].indexOf(' ')).match(/^[a-z]+$/g)) { //if the word is entirely english characters 
    tempArray[0] = glove[i].substring(0, glove[i].indexOf(' '));
    tempArray = sw.removeStopwords(tempArray); //call removeStopwords on it
    if(tempArray.length>0) {  //if the word still exists add it to the new array
      await db.dbSetWord(glove[i].substring(0, glove[i].indexOf(' ')), glove[i].substring(glove[i].indexOf(' ') +1).split(' ')); //add the word to the database
     
    }
  }
}
}

