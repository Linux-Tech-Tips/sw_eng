import fs from 'fs'


let vocab = fs.readFileSync('vocab.txt');
vocab = vocab.toString();
vocab = vocab.replace(/(\n)/ig, '');
let vocabArray = vocab.split(' ');
vocabArray.sort(); 
let i=0
while(i<10000) {
  if(vocabArray[i]!='') {
    break;
  }
  i++;
}
vocabArray = vocabArray.slice(i, -1);
vocab = vocabArray.join('\n ');
vocab+='\n';
console.log(vocab);
fs.writeFileSync('vocab2.txt', vocab);

