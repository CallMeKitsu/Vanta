function displayAbbr() {
  let ABBREVIATIONS = JSON.parse(get("https://vanta.kitsuforyou.repl.co/abbr.json"))
  
  console.log(ABBREVIATIONS)
  
  let html = ''
  
  for(let key in ABBREVIATIONS) {
    html += `<h3>${key}</h3>
    <table>
    <thead>
    <tr>
      <th>shorthand</th>
      <th>meaning</th>
    </tr>
    </thead>`
    let dico = ABBREVIATIONS[key]
    for(let abbr of Object.keys(dico)) {
      html+= `
    <tr>
      <td><yellow>␣</yellow>${abbr}</td>
      <td><yellow>␣</yellow>${dico[abbr]}</td>
    </tr>
    `
    }
    html+="</table>"
  }
  
  document.querySelector('#abbrs').innerHTML = html
}