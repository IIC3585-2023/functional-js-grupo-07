const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
var _ = require('lodash');

const pipe = functions => data => {
  return functions.reduce( (value, func) => func(value), data);
  };

ConvertHeaders = (line) => 
  line
      .replace(/^#\s(.*)$/gm, '<h1>$1</h1>')
      .replace(/^##\s(.*)$/gm, '<h2>$1</h2>')
      .replace(/^###\s(.*)$/gm, '<h3>$1</h3>')
      .replace(/^####\s(.*)$/gm, '<h4>$1</h4>')
      .replace(/^#####\s(.*)$/gm, '<h5>$1</h5>')
      .replace(/^######\s(.*)$/gm, '<h6>$1</h6>')

ConvertTextTypes = (line) =>
  line
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gm, '<em>$1</em>')


ConvertTextStructure = (prevLine, line) => 
  line
      .replace(/^\>\s(.*)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^\*\s(.*)$/gm, (prevLine.substring(0,2) !== '* ') ? '<ul>\n     <li>$1</li>' : '     <li>$1</li>')
      .replace(/^(?!<| )(.*)$/gm, '<p>$1</p>')

  
const markdownToHtml = (markdownText) => {
  let lines = markdownText.split("\r\n");
  let prevLine = '';

  let html = _.reduce(lines, function (result, line) {

    result +=  pipe([
                  x => (x.substring(0,2) != '* ' && prevLine.substring(0,2) == '* ')? '</ul>\n' + x: x, // Determina si se acaba de terminar un punteo (ul)
                  x => ConvertHeaders(x),
                  x => ConvertTextTypes(x),
                  x => ConvertTextStructure(prevLine, x),
                  x => `${x}\n`
                ])(line)
                

    prevLine = line;
    
    return result;
  }, '');

  
  return _.replace(html, /<p><\/p>\n/g, '')
}



readline.question('Name of the file to convert (without extension): ', fileName => {
  if (fileName == "") {
    fileName = 'example';
  }
  fs.readFile(`${fileName}.md`, 'utf-8', (err, data) => {
    if (err) throw err;
    const html = markdownToHtml(data);
    fs.writeFile('output.html', html, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  })
  readline.close();
});