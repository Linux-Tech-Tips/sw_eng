import { parse } from 'node-html-parser';
import {decode} from 'html-entities';
import fs from 'fs';

const input = process.argv[2]; //input is first commandline argument ADD CHECKS FOR CORRECT AMOUNT OF INPUTS
const myArray = input.split("."); //split argument and recreate it as a txt file with the same name
myArray.pop();
myArray.push("txt");
let output = myArray.join(".");

let file = fs.readFileSync(input); //read in file WRAP WITH A TRY BLOCK

let root = parse(file); //parse the file
const scriptTags = root.getElementsByTagName('script');//fetch all script elements
[...scriptTags].forEach(tag => tag.remove());//remove them
const noscriptTags = root.getElementsByTagName('noscript'); //similarly for noscript elements
[...noscriptTags].forEach(tag => tag.remove());
root = root.toString().replace(/(<([^>]+)>)/ig, '');
root = decode(root);
return root;

try {
  fs.writeFileSync(output, root.toString()); //create new file, write the altered data to it
} catch (error) {
  console.error('Error creating file:', error);
}

