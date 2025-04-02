module.exports = {testMeanings};

const meanings = require("./meanings.js");
const db = require("./dbUtil.js");

async function testMeanings() {
  console.log("It's grepping time!");
  let query = "grep";
  let page = await db.dbGetPageVec("5");
  console.log("Page got!"); 
  let grepVec = await db.GetWord("grep");
  grepVec = grepVec.data().vec;
  console.log("grep vec got!");
  page = page.data().matrix;
  console.log("page matrix got!");
 
  for(i in page) {
    if(page[i]==grepVec) {
      console.log("grep found!");
    }
  }
  let queryVec = await meanings.stringToMatrix(query);
  console.log("Query Matrix: ", queryVec);

  let similarity =  meaningSearch(query, page);
  console.log("similarity: ", similarity);
}
