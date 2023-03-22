const pipe = functions => data => {
  return functions.reduce( (value, func) => func(value), data);
  };
  
const markdownToHtml = (markdownText) => {
  let lines = markdownText.split("\n");
  let response = '';
  let prevLine = '';

  lines.forEach(function(line){

    // Determina si se acaba de terminar un punteo
    const ulFinished = pipe( [
      x => x.substring(0,2), 
      x => x != '* ', 
      x => x && prevLine.substring(0,2) == '* ' 
    ] )(line);

    if(ulFinished){
      response += '</ul>\n'
    }
    
    const htmlLine = line
      // Replace #
      .replace(/^#\s(.*)$/gm, '<h1>$1</h1>')
      .replace(/^##\s(.*)$/gm, '<h2>$1</h2>')
      .replace(/^###\s(.*)$/gm, '<h3>$1</h3>')
      .replace(/^####\s(.*)$/gm, '<h4>$1</h4>')
      .replace(/^#####\s(.*)$/gm, '<h5>$1</h5>')
      .replace(/^######\s(.*)$/gm, '<h6>$1</h6>')
      // Replace >
      .replace(/^\>\s(.*)$/gm, '<blockquote>$1</blockquote>')
      // Replace **
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gm, '<em>$1</em>')
      // Replace *
      .replace(/^\*\s(.*)$/gm, (prevLine.substring(0,2) !== '* ') ? '<ul>\n     <li>$1</li>' : '     <li>$1</li>')
      // Replace new paragraph
      .replace(/^(?!<| )(.*)$/gm, '<p>$1</p>')
    response += `${htmlLine}\n`;
    prevLine = line;
  })
  return response;
}


const markdownText = 
`# Hello World
This **is** a sample *paragraph*.
* Bullet point 1
* Bullet point 2
* Bullet point 3
## Subheading
> This is a blockquote.`;

console.log(markdownToHtml(markdownText));