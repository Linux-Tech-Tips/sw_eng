import { parse } from 'node-html-parser';
import {decode} from 'html-entities';

function html2txt(input) {
  let root = parse(input); //parse the input
  const scriptTags = root.getElementsByTagName('script');//fetch all script elements
  [...scriptTags].forEach(tag => tag.remove());//remove them
  const noscriptTags = root.getElementsByTagName('noscript'); //similarly for noscript elements
  [...noscriptTags].forEach(tag => tag.remove());
  root = root.toString().replace(/(<([^>]+)>)/ig, ''); //remove all tags
  root = decode(root); //decode html entities
  return root;
}


