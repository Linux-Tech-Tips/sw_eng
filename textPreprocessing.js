const { removeStopwords } = require('stopword')

function stripText(input) {
  let text = input.toLowerCase();
  text = text.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '')
  let textArray = text.split(' ');
  textArray = removeStopwords(textArray);
  text = textArray.join(' ');
  return text;
}

