//script that uploads the vocabulary

module.exports = {uploadVocab};

async function uploadVocab() {

  const db = require('./dbUtil.js');
  const fs = require('fs');

  let glove = fs.readFileSync('./technicalVectors.txt');
  glove = JSON.parse(glove); //parse the file into a JSON object

  for(word in glove) {
    await db.dbSetWord(word, glove[word]); //add the word to the database
  }   
}
