let FRESH_RAW_DATA = ""

function quicksave() {
    
  let textarea = document.querySelector(`#raw-content`)
  if(!textarea || textarea.nodeName !== "TEXTAREA") return
  
  FRESH_RAW_DATA = textarea.value

  return FRESH_RAW_DATA
}

function compute_html() {

  let rendered_content = ""  
  let raw_content = quicksave()
  let lines = raw_content.split("\n")

  for (var line of lines) {
    
    if(line.startsWith('# ')) {
      rendered_content += `<h1>${line.split('# ')[1].bold()}</h1>`
    }

    else if(line.startsWith('## ')) {
      rendered_content += `<h2>${line.split('## ')[1].bold()}</h2>`
    }

    else if(line.startsWith('### ')) {
      rendered_content += `<h3>${line.split('### ')[1].bold()}</h3>`
    }

    else {
      line = markwith(line, "__", '<u>', '</u>')
      line = markwith(line, "**", '<b>', '</b>')
      line = markwith(line, "*", '<i>', '</i>')
      line = markwith(line, "_", '<i>', '</i>')
      line = markwith(line, "~~", '<strike>', '</strike>')
      rendered_content += line
    }

  }

  return rendered_content

}

function switch_render() {

  quicksave()
  
  if(document.querySelector('#raw-content')) {
    document.querySelector(`#content`).innerHTML = `<div id="rendered-content">${compute_html()}</div>`
    document.getElementById('render-button').name = "create-outline"
  }
  else {
    document.querySelector(`#content`).innerHTML = `<textarea id="raw-content" placeholder="Supporte Markdown et Markup !" rows="1">${FRESH_RAW_DATA}</textarea>`
    document.getElementById('render-button').name = "document-text-outline"
  }
}

function between(str, btwn) {

  arr = str.split(btwn)
  new_ = []

  for(var i = 1; i < arr.length; i += 2) {
    new_.push(arr[i])
  }
      
  return new_

}

function markwith(str, sign, balise, end_balise) {

  arr = between(str, sign)

  if(arr.length > 0) {
    for (const this_ of arr) {
      str = str.replace(sign + this_ + sign, balise + this_ + end_balise)
    }
  }

  return str

}