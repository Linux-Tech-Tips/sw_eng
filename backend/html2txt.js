//function that takes a string html page and returns an array
//first entry in the array is the page title
//second entry is the body text of the page without tags, no script, and decoded html entities

import { parse } from 'node-html-parser';
import {decode} from 'html-entities';

function html2txt(input) {
  let file = fs.readFileSync(input);
  const returnValues = []; //array for output, [0] = title, [1] = body text
  let root = parse(file); //parse the input
  returnValues[0] = root.getElementsByTagName('title').toString().replace(/(<([^>]+)>)/ig, '');
  const head = root.getElementsByTagName('head');//fetch all script elements
  [...head].forEach(tag => tag.remove());//remove them
  const scriptTags = root.getElementsByTagName('script');//fetch all script elements
  [...scriptTags].forEach(tag => tag.remove());//remove them
  const noscriptTags = root.getElementsByTagName('noscript'); //similarly for noscript elements
  [...noscriptTags].forEach(tag => tag.remove());
  root = root.toString().replace(/(<([^>]+)>)/ig, ''); //remove all tags
  root = decode(root); //decode html entities
  returnValues[1] = root;
  return returnValues;
}



