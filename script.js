let FRESH_RAW_DATA = ""

function quicksave() {
  
  let textarea = document.querySelector(`#raw-content`)
  if(!textarea || textarea.nodeName !== "TEXTAREA") return
  
  FRESH_RAW_DATA = textarea.value

  textarea.rows = FRESH_RAW_DATA.split("\n").length + 2

  return FRESH_RAW_DATA
}

function compute_html() {

  let rendered_content = ""  
  let raw_content = quicksave()
  let lines = raw_content.split("\n")

  let state = {
    code: false,
    quote: false
  }

  for (var line of lines) {

    if(line.startsWith('```')) {
      if(!state.code) {
        state.code = line.split('```')[1] || true
        rendered_content += `\<code>`
      }
      else {
        state.code = false
        rendered_content += `\</code>`
      }
      
    }

    else if(state.code) {
      if(state.code === "js") rendered_content += `${highlight_js(line)}<br>`
      else rendered_content += `${line}<br>`
    }

    else if(line.startsWith('---') || line.startsWith('***') || line.startsWith('___')) {
      rendered_content += `<hr>`
    }
    
    else if(line.startsWith('# ')) {
      rendered_content += `<h1>${line.split('# ')[1].bold()}</h1>`
    }

    else if(line.startsWith('## ')) {
      rendered_content += `<h2>${line.split('## ')[1].bold()}</h2>`
    }

    else if(line.startsWith('### ')) {
      rendered_content += `<h3>${line.split('### ')[1].bold()}</h3>`
    }

    else if(line.startsWith('#### ')) {
      rendered_content += `<h4>${line.split('#### ')[1].bold()}</h4>`
    }

    else if(line.startsWith('##### ')) {
      rendered_content += `<h5>${line.split('##### ')[1].bold()}</h5>`
    }

    else if(line.startsWith('###### ')) {
      rendered_content += `<h6>${line.split('###### ')[1].bold()}</h6>`
    }

    else if(line.startsWith(' * ') || line.startsWith(' - ') || line.startsWith(' + ')) {
      rendered_content += `<li><span>${line.split(' * ')[1]}</span></li>`
    }

    else if(line.startsWith('   * ') || line.startsWith('   - ') || line.startsWith('   + ')) {
      rendered_content += `<li style='margin-left:25px'><span>${line.split('   * ')[1]}</span></li>`
    }

    else if(line.startsWith('     * ') || line.startsWith('     - ') || line.startsWith('     + ')) {
      rendered_content += `<li style='margin-left:50px'><span>${line.split('     * ')[1]}</span></li>`
    }

    else {
      line = markwith(line, "^", '<sup>', '</sup>')
      line = markwith(line, "#=#", '<mark>', '</mark>')
      line = markwith(line, "__", '<u>', '</u>')
      line = markwith(line, "**", '<b>', '</b>')
      line = markwith(line, "*", '<i>', '</i>')
      line = markwith(line, "_", '<i><grey>', '</grey></i>')
      line = markwith(line, "~", '<sub>', '</sub>')
      line = markwith(line, "~~", '<strike>', '</strike>')
      line = line.replaceAll('(c)', '©')
      line = line.replaceAll('(C)', '©')
      line = line.replaceAll('(r)', '®')
      line = line.replaceAll('(R)', '®')
      line = line.replaceAll('(tm)', '™')
      line = line.replaceAll('(TM)', '™')
      line = line.replaceAll('+-', '±')
      rendered_content += `${line}<br/>` 
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
    document.querySelector(`#content`).innerHTML = `<textarea id="raw-content" spellcheck="false" onkeypress="quicksave()" onchange="quicksave()" placeholder="Supporte Markdown et Markup !" rows="1">${FRESH_RAW_DATA}</textarea>`
    document.getElementById('render-button').name = "document-text-outline"
  }

  quicksave()
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
      str = str.replace(`${sign}${this_}${sign}`, balise + this_ + end_balise)
    }
  }

  return str

}

function highlight_js(html) {
  let res = html
  //res = res.replaceAll('   ', "&nbsp;")
  res = placeBaliseAround(res, ['async', 'function', 'var', 'let', "const", "of"], 'blue', "spaced")
  res = placeBaliseAround(res, ['function'], 'blue', "func")
  res = placeBaliseAround(res, ['for', 'while', 'if', 'continue', "return", "await", "throw"], 'pink', "spaced")
  res = placeBaliseAround(res, ['for', 'while', 'if' ], 'pink', "func")
  let numbers = res.match(/([0-9]+([.][0-9]*)?|[.][0-9]+)/gi) || []
  res = placeBaliseAround(res, numbers, 'lightgreen', "simple")
  let functions = res.match(/\w*\(/gi) || []
  for(var i=0; i<functions.length; i++) {
    functions[i] = functions[i].slice(0, -1)
  }
  functions = functions.filter(x => ["for", "if", 'while', "function"].includes(x) === false )
  res = placeBaliseAround(res, functions, 'lightyellow', "func")
  let comments = res.match(/(\/\/.+)/gi) || []
  res = placeBaliseAround(res, comments, 'green', "simple")
  let strings = res.match(/([\"'])(?:\\\1|.)*?\1/gi) || []
  res = placeBaliseAround(res, strings, 'orange', "simple")

  return res
} 

function placeBaliseAround(text, array, balise, type) {

  for (statement of array) {
    if(type === "simple") text = text.replaceAll(statement, `<${balise}>${statement}</${balise}>`)
    else if (type === "spaced") text = text.replaceAll(`${statement} `, `<${balise}>${statement}</${balise}> `)
    else if (type === "func") {
      text = text.replaceAll(`${statement}(`, `<${balise}>${statement}</${balise}>(`)
    }
  }
  
  return text
}