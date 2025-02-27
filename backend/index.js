const metadata = require("./metadata.js");

let pData = metadata.metadataProcess(["Page Title", "Page Title Word Thing Word Test Experiment Page Word Title Thing"]);

console.log(pData);

console.log("Score 1 is: " + metadata.metadataScore("Title Sentence", pData));
console.log("Score 2 is: " + metadata.metadataScore("Page Word", pData));
console.log("Score 3 is: " + metadata.metadataScore("All Experiment", pData));
