import { parse } from 'node-html-parser';
import {decode} from 'html-entities';

//function that takes a string html page and returns an array
//first entry in the array is the page title as a string, no tags
//second entry is the body text of the page without tags, no script, and decoded html entities

function html2txt(input) {
  const returnValues = []; //array for output, [0] = title, [1] = body text
  
  //set the title (minus tags) as the first array element
  returnValues[0] = root.getElementsByTagName('title').toString().replace(/(<([^>]+)>)/ig, '');
  
  //fetch the head and delete it
  const head = root.getElementsByTagName('head');
  [...head].forEach(tag => tag.remove());
  
  //fetch the script blocks and delete them
  const scriptTags = root.getElementsByTagName('script');
  [...scriptTags].forEach(tag => tag.remove());

  //same for noscript tags
  const noscriptTags = root.getElementsByTagName('noscript');
  [...noscriptTags].forEach(tag => tag.remove());
  
  root = root.toString().replace(/(<([^>]+)>)/ig, ''); //remove all tags
  root = decode(root); //decode html entities
  
  //set the final outcome as the second array element, return it
  returnValues[1] = root;
  return returnValues;
}



