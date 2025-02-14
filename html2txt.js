import { parse } from 'node-html-parser';
import {decode} from 'html-entities';

function html2txt(input) {
  const returnValues = []; //array for output, [0] = title, [1] = body text
  let root = parse(input); //parse the input
  returnValues[0] = root.getElementsByTagName('title'); //save the title in a separate field
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


