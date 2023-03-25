const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
var _ = require('lodash');

const pipe = (functions) => (data) => {
  return functions.reduce((value, func) => func(value), data);
};

const finishUL = (line, prevLine) => {
  line =
    line.substring(0, 2) != '* ' && prevLine.substring(0, 2) == '* '
      ? '</ul>\n' + line
      : line; // Determina si se acaba de terminar un punteo (ul)
  return line;
};

const ConvertHeaders = (line) => {
  line = S(headerConverter)(hashtagCounter)(line);
  return line;
};

const S = (f) => (g) => (x) => {
  return f(x)(g(x));
};

const headerConverter = (line) => (hashtagQuantity) => {
  if (hashtagQuantity > 0) {
    line = `<h${hashtagQuantity}>${line.substring(
      hashtagQuantity + 1
    )}</h${hashtagQuantity}>`;
  }
  return line;
};

const hashtagCounter = (line) => {
  return line.split('#').length - 1;
};

ConvertTextTypes = (line) => {
  return line
    .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gm, '<em>$1</em>');
};

ConvertTextStructure = (prevLine, line) =>
  line
    .replace(/^\>\s(.*)$/gm, '<blockquote>$1</blockquote>')
    .replace(
      /^\*\s(.*)$/gm,
      prevLine.substring(0, 2) !== '* '
        ? '<ul>\n     <li>$1</li>'
        : '     <li>$1</li>'
    )
    .replace(/^(?!<| )(.*)$/gm, '<p>$1</p>');

const markdownToHtml = (markdownText) => {
  let lines = markdownText.split('\n');
  let prevLine = '';

  let htmlLines = _.reduce(
    lines,
    function (result, line) {
      result += pipe([
        (x) => ConvertHeaders(x),
        (x) => finishUL(x, prevLine),
        (x) => ConvertTextTypes(x),
        (x) => ConvertTextStructure(prevLine, x),
        (x) => `${x}\n`,
      ])(line);

      prevLine = line;

      return result;
    },
    ''
  );
  return _.replace(htmlLines, /<p><\/p>\n/g, '');
};

readline.question(
  'Name of the file to convert (without extension): ',
  (fileName) => {
    if (fileName == '') {
      fileName = 'example';
    }
    fs.readFile(`${fileName}.md`, 'utf-8', (err, data) => {
      if (err) throw err;
      const html = markdownToHtml(data);
      fs.writeFile('output.html', html, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    });
    readline.close();
  }
);
