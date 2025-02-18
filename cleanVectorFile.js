import fs from 'fs';
import * as sw from 'stopword';

//a large chonk is commented out bc it worked and I didn't want to run it over and over again bc it's slow, that chonk splits the big embeddings file by every fourth new line (each vector is 4 lines long) and then creates one long string that has one word + its vector on each line

//let vocab = fs.readFileSync('/Users/elisabeth/Desktop/Year2/SWE/SWE/sw_eng/vocab2.txt');
let glove = fs.readFileSync('glove2.txt');//glove2.txt is the file with the words+vectors on one line each

/*glove = glove.toString().split('\n');
var groups = [];
var currentGroup = [];

for (var i = 0; i < glove.length; i++) {
    currentGroup.push(glove[i]);

    if (currentGroup.length === 4) {
        groups.push(currentGroup.join('\n'));
        currentGroup = [];
    }
}

if (currentGroup.length > 0) {
    groups.push(currentGroup.join(','));
}

glove.sort();
glove = glove.join('\n');*/

//the thought process for this bit is to create a 2D array with the word in the first field and the vector in the second
//then remove the stopwords in it and then sort it
//then remove all rows where the first entry is empty (i.e. the word got removed bc stopword)
//at some point also remove all the entries that are just punctuation (there's vectors for ! and ' and . and such, we don't care)

function Empty2DArray(rows, cols) { //this guy makes an empty 2d array
    return Array.from({ length: rows },
        () => Array(cols).fill(null));
}

glove = glove.toString().split('\n'); //split the content of the file into an array by each newline
let gloveArray = Empty2DArray(glove.length, 2); //create an empty 2d array
let tempArray = [];
for(let i=0; i<glove.length; i++) { //for all entries in the original array
  tempArray = glove[i].split(/ (.*)/s); //split each entry by the first ' '
  gloveArray[i][0] = tempArray[0]; //save the word as the first entry in the row
  gloveArray[i][1] = tempArray[1]; //save the vector as the second entry in the row
}

//that all works, here come the problem children

gloveArray.sort((a, b) => a[0].localeCompare(b[0])); //function to sort the array by the first colum (returns the same array as when I used regular .sort() I think????)
gloveArray = sw.removeStopwords(gloveArray); //remove stopwords (idk if it will be fussy abt the fact that it's a 2d array, it currently won't even run)

console.log(gloveArray); //test print

//then the array is supposed to be reattached together and written to a new file (yeah I know I should be using a database shhhh the files are not the problem here)
//glove = glove.join('\n');
//fs.writeFileSync('glove.txt', glove);
