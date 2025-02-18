
import fs from 'fs';
const { removeStopwords } = require('stopword');
//import * as sw from 'stopword'

/*let file = fs.readFileSync('/Users/elisabeth/Desktop/Year2/SWE/SWE/glove/glove.6B.50d.txt');

file = file.toString().replace(/([0-9])/ig, '');
file = file.toString().replace(/([!"#$%&'()*+,-./:;?@[\]^_`{|}~])/ig, '');
file = file.replace(/(?<=(^|\s))\D(\s|$)/ig, '');
*/
let file = fs.readFileSync('/Users/elisabeth/Desktop/Year2/SWE/SWE/vocab.txt');
file = file.toString();
let textArray = file.split(' ');
textArray = sw.removeStopwords(textArray);
file = textArray.join(' ');


fs.writeFileSync('/Users/elisabeth/Desktop/Year2/SWE/SWE/vocab.txt', file);

