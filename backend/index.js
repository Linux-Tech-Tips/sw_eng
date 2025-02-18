const { metadataProcess } = require('./metadata.js');
const { metadataScore } = require('./metadata.js');

let pData = metadataProcess(["Page Title", "Page Title Word Thing Word Test Experiment Page Word Title Thing"]);

console.log(pData);

console.log("Score 1 is: " + metadataScore("Title Sentence", pData));
console.log("Score 2 is: " + metadataScore("Page Word", pData));
console.log("Score 3 is: " + metadataScore("All Experiment", pData));
