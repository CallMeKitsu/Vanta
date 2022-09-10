let FRESH_RAW_DATA = ""

function quicksave() {

  let textarea = document.querySelector(`#raw-content`)
  if (!textarea || textarea.nodeName !== "TEXTAREA") return

  FRESH_RAW_DATA = textarea.value

  textarea.rows = FRESH_RAW_DATA.split("\n").length + 20

  return FRESH_RAW_DATA
}

function compute_html() {

  let rendered_content = ""
  let raw_content = quicksave()
  let lines = raw_content.split("\n")

  let state = {
    code: false,
    quote: false,
    maths: false
  }

  for (var line of lines) {

    if (line.startsWith('<div class="widget"')) {
      rendered_content += line
    }

    else if (line.startsWith('```')) {
      if (!state.code) {
        state.code = line.split('```')[1] || true
        rendered_content += `\<code>`
      }
      else {
        state.code = false
        rendered_content += `\</code>`
      }

    }

    else if (state.code) {
      if (state.code === "js") rendered_content += `${highlight_js(line)}<br>`
      else rendered_content += `${line}<br>`
    }

    else if (line.startsWith(':::')) {
      if (!state.maths) {
        state.maths = line.split(':::')[1] || true
        rendered_content += `\<maths>`
      }
      else {
        state.maths = false
        rendered_content += `\</maths>`
      }
    }

    else if (state.maths) {
      rendered_content += `${mathscript(line)}<br>`
    }

    else if (line.startsWith('---') || line.startsWith('***') || line.startsWith('___')) {
      rendered_content += `<hr>`
    }

    else if (line.startsWith('# ')) {
      rendered_content += `<h1>${line.split('# ')[1].bold()}</h1>`
    }

    else if (line.startsWith('## ')) {
      rendered_content += `<h2>${line.split('## ')[1].bold()}</h2>`
    }

    else if (line.startsWith('### ')) {
      rendered_content += `<h3>${line.split('### ')[1].bold()}</h3>`
    }

    else if (line.startsWith('#### ')) {
      rendered_content += `<h4>${line.split('#### ')[1].bold()}</h4>`
    }

    else if (line.startsWith('##### ')) {
      rendered_content += `<h5>${line.split('##### ')[1].bold()}</h5>`
    }

    else if (line.startsWith('###### ')) {
      rendered_content += `<h6>${line.split('###### ')[1].bold()}</h6>`
    }

    else if (line.startsWith(' * ') || line.startsWith(' - ') || line.startsWith(' + ')) {
      let content = line.split(' * ')[1] || line.split(' - ')[1] || line.split(' + ')[1]
      rendered_content += `<li><span>${content}</span></li>`
    }

    else if (line.startsWith('   * ') || line.startsWith('   - ') || line.startsWith('   + ')) {
      let content = line.split('   * ')[1] || line.split('   - ')[1] || line.split('   + ')[1]
      rendered_content += `<li style='margin-left:25px'><span>${content}</span></li>`
    }

    else if (line.startsWith('     * ') || line.startsWith('     - ') || line.startsWith('     + ')) {
      let content = line.split('     * ')[1] || line.split('     - ')[1] || line.split('     + ')[1]
      rendered_content += `<li style='margin-left:50px'><span>${content}</span></li>`
    }

    else {
      line = markwith(line, "^", '<sup>', '</sup>')
      line = markwith(line, "#=#", '<mark>', '</mark>')
      line = markwith(line, "__", '<u>', '</u>')
      line = markwith(line, "**", '<b>', '</b>')
      line = markwith(line, "*", '<i>', '</i>')
      line = markwith(line, "_", '<i><grey>', '</grey></i>')
      line = markwith(line, "~~", '<strike>', '</strike>')
      line = markwith(line, "~", '<sub>', '</sub>')
      line = line.replaceAll('(c)', '©')
      line = line.replaceAll('(C)', '©')
      line = line.replaceAll('(r)', '®')
      line = line.replaceAll('(R)', '®')
      line = line.replaceAll('(tm)', '™')
      line = line.replaceAll('(TM)', '™')
      line = line.replaceAll('+-', '±')
      line = line.replaceAll('sqrt(', '√(')
      rendered_content += `${line}<br/>`
    }

  }

  return rendered_content

}

function switch_render() {

  quicksave()

  if (document.querySelector('#raw-content')) {
    document.querySelector(`#content`).innerHTML = `<div id="rendered-content">${compute_html()}</div>`
    document.getElementById('render-button').name = "create-outline"
    document.querySelector("#rendered-content").style.overflow = "auto"
  }
  else {
    document.querySelector(`#content`).innerHTML = `<textarea id="raw-content" spellcheck="false" onkeypress="quicksave()" onchange="quicksave()" placeholder="Supporte Markdown et Markup !" rows="1">${FRESH_RAW_DATA}</textarea>`
    document.getElementById('render-button').name = "document-text-outline"
    document.querySelector('#raw-content').style.overflow = "auto"
  }

  quicksave()
}

function between(str, btwn) {

  arr = str.split(btwn)
  new_ = []

  for (var i = 1; i < arr.length; i += 2) {
    new_.push(arr[i])
  }

  return new_

}

function markwith(str, sign, balise, end_balise) {

  arr = between(str, sign)

  if (arr.length > 0) {
    for (const this_ of arr) {
      str = str.replace(`${sign}${this_}${sign}`, balise + this_ + end_balise)
    }
  }

  return str

}

function highlight_js(html) {
  let res = html
  res = placeBaliseAround(res, ['async', 'function', 'var', 'let', "const", "of"], 'blue', "spaced")
  res = placeBaliseAround(res, ['function'], 'blue', "func")
  res = placeBaliseAround(res, ['for', 'while', 'if', 'continue', "return", "await", "throw"], 'pink', "spaced")
  res = placeBaliseAround(res, ['for', 'while', 'if'], 'pink', "func")
  let numbers = res.match(/([0-9]+([.][0-9]*)?|[.][0-9]+)/gi) || []
  res = placeBaliseAround(res, numbers, 'lightgreen', "simple")
  let functions = res.match(/\w*\(/gi) || []
  for (var i = 0; i < functions.length; i++) {
    functions[i] = functions[i].slice(0, -1)
  }
  functions = functions.filter(x => ["for", "if", 'while', "function"].includes(x) === false)
  res = placeBaliseAround(res, functions, 'lightyellow', "func")
  let comments = res.match(/(\/\/.+)/gi) || []
  res = placeBaliseAround(res, comments, 'green', "simple")
  let strings = res.match(/([\"'])(?:\\\1|.)*?\1/gi) || []
  res = placeBaliseAround(res, strings, 'orange', "simple")

  return res
}

function placeBaliseAround(text, array, balise, type) {

  for (statement of array) {
    if (type === "simple") text = text.replaceAll(statement, `<${balise}>${statement}</${balise}>`)
    else if (type === "spaced") text = text.replaceAll(`${statement} `, `<${balise}>${statement}</${balise}> `)
    else if (type === "func") {
      text = text.replaceAll(`${statement}(`, `<${balise}>${statement}</${balise}>(`)
    }
  }

  return text
}

function switch_widjet() {
  let name = prompt("Widjet Command (beta) ?")
  let textarea = document.querySelector(`#raw-content`)
  if (!textarea || textarea.nodeName !== "TEXTAREA") return

  if (name === "yt") {
    let id = prompt("Youtube video Id ?")
    textarea.value += `<div class="widget"><iframe width="424" height="238" src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay;"></iframe></div>`
  }
}

function switch_theme() {
  if (document.getElementById("theme-button").name === "cloudy-night-outline") {
    
    document.getElementById("theme-button").name = "partly-sunny-outline"

    document.documentElement.style.setProperty('--bgcolor', "black")
    document.documentElement.style.setProperty('--fontcolor', "white")
    document.documentElement.style.setProperty('--fontcode', "#B9BBBE")
    document.documentElement.style.setProperty('--bgcode', "#272727")
    document.querySelector('#vanta-logo').style.filter = "none"

  }
  else {
    
    document.getElementById("theme-button").name = "cloudy-night-outline"

    document.documentElement.style.setProperty('--bgcolor', "white")
    document.documentElement.style.setProperty('--fontcolor', "black")
        document.documentElement.style.setProperty('--fontcode', "#272727")
    document.documentElement.style.setProperty('--bgcode', "#B9BBBE")
    document.querySelector('#vanta-logo').style.filter = "invert(1)"

  }
}

function mathscript(text) {
  let res = text
  res = res.replace('=/=', '≠')
  res = res.replace('~=', '≈')
  res = res.replace('≥', '>=')
  res = res.replace('≤', '<=')
  res = res.replace('+-', '±')
  res = res.replace('-+', '±')
  res = res.replace('*', '×⋅')
  res = res.replace('sqrt', '√')
  res = res.replace('infini', '∞')
  res = res.replace('pi', 'π')
  res = res.replace('delta', 'Δ')
  res = res.replace('sigma', '∑')
  res = res.replace('omega', 'Ω')
  res = res.replace('lambda', 'λ')
  res = res.replace('inter', '∩')
  res = res.replace('union', '∪')
  res = res.replace('in', '∈')
  res = res.replace('empty', 'Ø')
  res = res.replace('_U', '𝕌')
  res = res.replace('_N', 'ℕ')
  res = res.replace('_R', 'ℝ')
  res = res.replace('_Z', 'ℤ')
  res = res.replace('_Q', 'ℚ')
  res = res.replace('_C', 'ℂ')

  for (var char of res) {
    let alph = "abcdefghijklmnopqrstuvwxyz"
    let malph = ["𝒶","𝒷","𝒸","𝒹", "ℯ", "<i>f </i>", "ℊ", "𝒽", "𝒾", "𝒿", "𝓀", "𝓁", "𝓂", "𝓃", "ℴ", "𝓅", "𝓆", "𝓇", "𝓈", "𝓉", "𝓊", "𝓋","𝓌","𝓍","𝓎", "𝓏"]
    if(alph.includes(char)) {
      let alph_pos = alph.indexOf(char)
      
      console.log(char, malph[alph_pos], malph, malph.length)
      res = res.replaceAll(char, malph.at(alph_pos))
    }
  }

  let fractions = res.match(/\(([^)]+)\)/gi) || []
  fractions = fractions.filter(x => x.includes("_") === true)
  
  for (var fraction of fractions) {
    
    let up = fraction.replaceAll(" _ ", "_").split('_')[0].replaceAll("( ", "").replaceAll("(", "")
    let down = fraction.replaceAll(" _ ", "_").split('_')[1].replaceAll(" )", "").replaceAll(")", "")
    console.log(up, down)
    res = res.replaceAll(fraction, frac(up, down))
  }

  res = markwith(res, "~", '<sub>', '</sub>')
  res = markwith(res, "^", '<sup>', '</sup>')
  
  return res
  
}

function frac(up, down) {
  return `<div class="fraction"><span class="fup">${up}</span><span class="bar">/</span><span class="fdn">${down}</span></div>`
}