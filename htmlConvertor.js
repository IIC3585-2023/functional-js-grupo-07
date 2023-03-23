var _ = require('lodash');

const pipe = functions => data => {
  return functions.reduce( (value, func) => func(value), data);
  };

const ConvertHeaders = (line) => 
  line
      .replace(/^#\s(.*)$/gm, '<h1>$1</h1>')
      .replace(/^##\s(.*)$/gm, '<h2>$1</h2>')
      .replace(/^###\s(.*)$/gm, '<h3>$1</h3>')
      .replace(/^####\s(.*)$/gm, '<h4>$1</h4>')
      .replace(/^#####\s(.*)$/gm, '<h5>$1</h5>')
      .replace(/^######\s(.*)$/gm, '<h6>$1</h6>')

const ConvertTextTypes = (line) =>
  line
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gm, '<em>$1</em>')


const ConvertTextStructure = (prevLine, line) => 
  line
      .replace(/^\>\s(.*)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^\*\s(.*)$/gm, (prevLine.substring(0,2) !== '* ') ? '<ul>\n     <li>$1</li>' : '     <li>$1</li>')
      .replace(/^(?!<| )(.*)$/gm, '<p>$1</p>')

  
const markdownToHtml = (markdownText) => {
  let lines = markdownText.split("\n");
  let prevLine = '';

  let html = _.reduce(lines, function (result, line) {
    result +=  pipe([
                  x => x = (x.substring(0,2) != '* ' && prevLine.substring(0,2) == '* ')? '</ul>\n' + x: x, // Determina si se acaba de terminar un punteo (ul)
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


const markdownText = 
`# El formato Markdown
## Parte 1
El formato de markdown es ampliamente utilizado porque permite describir un **contenido en forma estructurada** en forma sencilla.

Por ejemplo se puede usar en *GitHub* para documentar el código, escribir manuales, etc.

## Parte 2
Markdown puede ser usado para muchas cosas. Por ejemplo la gente lo utiliza para

* crear páginas web
* publicar documentos, 
* escribir notas
* hacer presentaciones
* redactar correos
* generar documentación técnica
* escribir libros 
`;

console.log(markdownToHtml(markdownText));