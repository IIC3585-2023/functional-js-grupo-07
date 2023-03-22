const markdownToHtml = (markdownText) => {
  let lines = markdownText.split("\n");
  let response = '';
  let pointElement = '';
  let continuousPoints = 0

  lines.forEach(function(line){
    continuousPoints = (line.substr(0,2) != '* ')? 0 : continuousPoints + 1
    console.log(continuousPoints, pointElement)
    if(continuousPoints  === 0 && pointElement != ''){
      response += '</ul>\n'
    }
    
    pointElement = (continuousPoints === 1)? 'ul' : ((continuousPoints !== 0)? 'li' : '')
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
      .replace(/^\*\s(.*)$/gm, (pointElement == 'ul')? '<ul>\n     <li>$1</li>' : '     <li>$1</li>')
      // Replace new paragraph
      .replace(/^(?!<| )(.*)$/gm, '<p>$1</p>')
    response += `${htmlLine}\n`;
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