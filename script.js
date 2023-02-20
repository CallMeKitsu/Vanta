let FRESH_RAW_DATA = ""

let ABBREVIATIONS = JSON.parse(get("https://vanta.kitsuforyou.repl.co/abbr.json"))

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
      else rendered_content += `${line_md(line)}<br>`
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
      rendered_content += `<h1>${line_md(line.split('# ')[1]).bold()}</h1>`
    }

    else if (line.startsWith('## ')) {
      rendered_content += `<h2>${line_md(line.split('## ')[1]).bold()}</h2>`
    }

    else if (line.startsWith('### ')) {
      rendered_content += `<h3>${line_md(line.split('### ')[1]).bold()}</h3>`
    }

    else if (line.startsWith('#### ')) {
      rendered_content += `<h4>${line_md(line.split('#### ')[1]).bold()}</h4>`
    }

    else if (line.startsWith('##### ')) {
      rendered_content += `<h5>${line_md(line.split('##### ')[1]).bold()}</h5>`
    }

    else if (line.startsWith('###### ')) {
      rendered_content += `<h6>${line_md(line.split('###### ')[1]).bold()}</h6>`
    }

    else if (line.startsWith('> ')) {
      rendered_content += `<quote>${line_md(line.split('> ')[1])}</quote>`
    }

    else if (line.startsWith(' * ') || line.startsWith(' - ') || line.startsWith(' + ')) {
      let content = line.split(' * ')[1] || line.split(' - ')[1] || line.split(' + ')[1]
      rendered_content += `<li><span>${line_md(content)}</span></li>`
    }

    else if (line.startsWith('   * ') || line.startsWith('   - ') || line.startsWith('   + ')) {
      let content = line.split('   * ')[1] || line.split('   - ')[1] || line.split('   + ')[1]
      rendered_content += `<li style='margin-left:25px'><span>${line_md(content)}</span></li>`
    }

    else if (line.startsWith('     * ') || line.startsWith('     - ') || line.startsWith('     + ')) {
      let content = line.split('     * ')[1] || line.split('     - ')[1] || line.split('     + ')[1]
      rendered_content += `<li style='margin-left:50px'><span>${line_md(content)}</span></li>`
    }

    else {

      rendered_content += `${line_md(line)}<br/>`

    }

  }

  return rendered_content

}

function line_md(line) {

  if (line.match(/\[(.*?)\]\((.*?)\)/g)) {
    for (const e of line.match(/\[(.*?)\]\((.*?)\)/g)) {
      let desc = e.match(/\[(.*?)\]/g)[0].replaceAll(']', '').replaceAll('[', '')
      let link = e.match(/\((.*?)\)/g)[0].replaceAll('(', '').replaceAll(')', '')
      line = line.replaceAll(e, `<a style='color: white;text-decoration-style: dotted;' href="${link}">${desc}</a>`)
    }
  }

  if(line.match(/`(.*?)`/gi)) {
    for (let block of line.match(/`(.*?)`/gi)) {
      line = line.replaceAll(block, `<block>${mathscript(block.replaceAll('`', ''))}</block>`)
    }
  }

  for (var abbrDict of Object.keys(ABBREVIATIONS)) {

    if (!document.querySelector(`#abbr_${abbrDict}`) || !document.querySelector(`#abbr_${abbrDict}`).checked) continue

    for (var abbr of Object.keys(ABBREVIATIONS[abbrDict])) {
      line = line.replaceAll(` ${abbr}`, ` ${ABBREVIATIONS[abbrDict][abbr]}`)
    }
  }

  line = line.replaceAll('\\', '')
  line = line.replaceAll('~=', '≈')
  line = markwith(line, "^", '<sup>', '</sup>')
  line = markwith(line, "#=#", '<mark>', '</mark>')
  line = markwith(line, "__", '<u>', '</u>')
  line = markwith(line, "**", '<b>', '</b>')
  line = markwith(line, "*", '<i>', '</i>')
  line = markwith(line, "_", '<i><grey>', '</grey></i>')
  line = markwith(line, "~~", '<strike>', '</strike>')
  line = markwith(line, "~", '<sub>', '</sub>')
  line = line.replaceAll('::', '➜')
  line = line.replaceAll('->', '➜')
  line = line.replaceAll('(c)', '©')
  line = line.replaceAll('(C)', '©')
  line = line.replaceAll('(r)', '®')
  line = line.replaceAll('(R)', '®')
  line = line.replaceAll('(tm)', '™')
  line = line.replaceAll('(TM)', '™')
  line = line.replaceAll('+-', '±')
  line = line.replaceAll('sqrt(', '√(')

  return line
}

function switch_render() {

  quicksave()

  if (document.querySelector('#raw-content')) {
    document.querySelector(`#content`).innerHTML = `<div id="rendered-content">${compute_html()}</div>`
    document.getElementById('render-button').name = "create-outline"
    document.querySelector("#rendered-content").style.overflow = "auto"
  }
  else {
    document.querySelector(`#content`).innerHTML = `<textarea id="raw-content" spellcheck="false" onkeypress="quicksave()" onchange="quicksave()" placeholder="Bienvenue." rows="1">${FRESH_RAW_DATA}</textarea>`
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
      str = str.replaceAll(`${sign}${this_}${sign}`, balise + this_ + end_balise)
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

function switch_widget() {
  document.querySelector('#widgetmenu').classList.toggle('hidden')
  let textarea = document.querySelector(`#raw-content`)
  if (!textarea || textarea.nodeName !== "TEXTAREA") {
    switch_render()
  }
}

function switch_theme() {
  if (document.getElementById("theme-button").name === "cloudy-night-outline") {

    document.getElementById("theme-button").name = "partly-sunny-outline"

    document.documentElement.style.setProperty('--bgcolor', "black")
    document.documentElement.style.setProperty('--fontcolor', "white")
    if (!document.querySelector('#tickhighlight').checked) {
      document.documentElement.style.setProperty('--selectionbg', "white")
      document.documentElement.style.setProperty('--selectioncolor', "black")
    }
    document.documentElement.style.setProperty('--fontcode', "#B9BBBE")
    document.documentElement.style.setProperty('--bgcode', "#272727")
    document.querySelector('#vanta-logo').style.filter = "none"

  }
  else {

    document.getElementById("theme-button").name = "cloudy-night-outline"

    document.documentElement.style.setProperty('--bgcolor', "white")
    document.documentElement.style.setProperty('--fontcolor', "black")
    if (!document.querySelector('#tickhighlight').checked) {
      document.documentElement.style.setProperty('--selectionbg', "black")
      document.documentElement.style.setProperty('--selectioncolor', "white")
    }
    document.documentElement.style.setProperty('--fontcode', "#272727")
    document.documentElement.style.setProperty('--bgcode', "#B9BBBE")
    document.querySelector('#vanta-logo').style.filter = "invert(1)"

  }
}

function mathscript(text) {
  let res = text
  res = res.replaceAll('=/=', '≠')
  res = res.replaceAll('~=', '≈')
  res = res.replaceAll('>=', '≥')
  res = res.replaceAll('<=', '≤')
  res = res.replaceAll('+-', '±')
  res = res.replaceAll('-+', '±')
  res = res.replaceAll('*', '⋅')
  res = res.replaceAll('infini', '∞')
  res = res.replaceAll('pi', 'π')
  res = res.replaceAll('xi', 'ξ')
  res = res.replaceAll('delta', 'Δ')
  res = res.replaceAll('omega', 'Ω')
  res = res.replaceAll('lambda', 'λ')
  res = res.replaceAll('inter', '∩')
  res = res.replaceAll('union', '∪')
  res = res.replaceAll('in', '∈')
  res = res.replaceAll('empty', 'Ø')
  res = res.replaceAll('_U', '𝕌')
  res = res.replaceAll('_N', 'ℕ')
  res = res.replaceAll('_R', 'ℝ')
  res = res.replaceAll('_Z', 'ℤ')
  res = res.replaceAll('_Q', 'ℚ')
  res = res.replaceAll('_C', 'ℂ')
  res = res.replaceAll('f(x)', '<i>f </i>(𝓍)')

  let alph = "abcdefghijklmnopqrstuvwxyz"
  for (var char of alph) {
    let malph = ["𝒶", "𝒷", "𝒸", "𝒹", "ℯ", "<i>f </i>", "ℊ", "𝒽", "𝒾", "𝒿", "𝓀", "𝓁", "𝓂", "𝓃", "ℴ", "𝓅", "𝓆", "𝓇", "𝓈", "𝓉", "𝓊", "𝓋", "𝓌", "𝓍", "𝓎", "𝓏"]
    
    let alph_pos = alph.indexOf(char)
    res = res.replaceAll(`$${char}`, malph.at(alph_pos))
  }

  let squareRoots = res.match(/(sqrt)+\((?<args>.*)\)/gmi) || []
  
  for (let sqrt of squareRoots) {
    let arg = sqrt.split('(')[1].split(')')[0]
    let length = arg.length / (arg.length + 1) * 100
    res = res.replaceAll(sqrt, `<square-root style="--sqrt-length: ${length}%">${arg}</square-root>`)
  }

  let fractions = res.match(/\{(.*?)\}/gi) || []
  fractions = fractions.filter(x => x.includes("_") === true)

  for (var fraction of fractions) {
    let up = fraction.replaceAll(" _ ", "_").split('_')[0].replaceAll("{ ", "").replaceAll("{", "")
    let down = fraction.replaceAll(" _ ", "_").split('_')[1].replaceAll(" }", "").replaceAll("}", "")
    console.log(up, down)
    res = res.replaceAll(fraction, frac(up, down))
  }

  let sums = res.match(/(?<name>sum)+\((?<args>.*)\)/gmi) || []
  
  for (let sum of sums) {
    let paramstring = sum.match(/\(([^\)]+)\)/gi)[0]
    let params = paramstring.match(/(?:[^,()]+((?:\((>[^()]+|\(|\))*\)))*)+/gi)
    let args = []
    
    for (let param of params) {
      if (param[0] == " ") {
        param = param.replaceAll(' ', '')
      }
      args.push(param)
    }
    
    let sub = args[0]
    let expr = args[1]
    let sup = args[2]
    sigma = `<sigma><sup class="sigma">${sup}</sup><span style="font-size: 2em;">Σ</span><sub class="sigma">${sub}</sub></sigma> ${expr}`
    res = res.replaceAll(sums, sigma)
  }
  

  res = markwith(res, "~", '<sub>', '</sub>')
  res = markwith(res, "^", '<sup>', '</sup>')
  res = markwith(res, "_", '<moy>', '</moy>')

  return res

}

function frac(up, down) {
  return `<div class="fraction"><span class="fup">${up}</span><span class="bar">/</span><span class="fdn">${down}</span></div>`
}

/*
function lim(point) {
  return `<div class="limite"><span class="fup">lim</span><span class="bar">/</span><span class="fdn">${down}</span></div>`
}*/

function switch_file() {
  quicksave()

  let nchar = FRESH_RAW_DATA.length

  document.querySelector('#n-characters').innerHTML = nchar
  if (nchar < 3000) {
    document.querySelector('#n-characters').style.color = "green"
  } else if (nchar === 3000) {
    document.querySelector('#n-characters').style.color = "orange"
  } else if (nchar > 3000) {
    document.querySelector('#n-characters').style.color = "red"
  }

  document.querySelector('#filemenu').classList.toggle('hidden')

  if (document.querySelector('#files-button').name !== "folder-outline") {
    document.querySelector('#files-button').name = "folder-outline"
  } else {
    document.querySelector('#files-button').name = "folder-open-outline"
  }
}

function save_utf8() {
  let ext = document.querySelector('#filetype-export').value
  let name = document.querySelector('#filename-export').value
  let blob = new Blob([FRESH_RAW_DATA], { type: "text/plain;charset=utf-8" })
  _global.saveAs(blob, `${name}${ext}`)
}

function load_utf8() {

  let fileuploader = document.querySelector('#fileuploader')

  var file = fileuploader.files[0]
  if (!file) return alert('Aucun fichier importé.')
  let extension = file.name.split('.')[1]
  let accepted_ext = ['vanta', 'md', 'txt']
  if (!accepted_ext.includes(extension)) return alert(`l\'extension de fichier n\'est pas reconnue.`)

  var fileReader = new FileReader()

  fileReader.onload = function(fileLoadedEvent) {

    if (!confirm('Êtes vous sûr.e de vouloir formater le document actuel ?')) return
    if (document.querySelector('#raw-content')) {
      document.querySelector('#raw-content').value = fileLoadedEvent.target.result
    } else {
      switch_render()
      document.querySelector('#raw-content').value = fileLoadedEvent.target.result
    }
  }

  fileReader.readAsText(file, "UTF-8")
}

function closeAllWindows(not) {
  if (not !== "files" && !document.querySelector('#filemenu').classList.contains('hidden')) {
    switch_file()
  }
  if (not !== "widget" && !document.querySelector('#widgetmenu').classList.contains('hidden')) {
    switch_widget()
  }
  if (not !== "wopt" && !document.querySelector('#widgetoptions').classList.contains('hidden')) {
    document.querySelector('#widgetoptions').classList.toggle('hidden')
  }
  if (not !== "pres" && !document.querySelector('#presmenu').classList.contains('hidden')) {
    switch_pres()
  }
  if (not !== "dico" && !document.querySelector('#dicomenu').classList.contains('hidden')) {
    switch_dico()
  }
}

function switch_wopt(params, funcname) {
  closeAllWindows()
  
  options = ``

  for (let param of params) {
    options += `
    <h3>${param.name}</h3>
    ${param.html}
    `
  }

  options += `
  <button onclick="closeAllWindows('files');${funcname}">charger</button>`

  document.querySelector('#widgetoptions').innerHTML = options
  document.querySelector('#widgetoptions').classList.toggle('hidden')
}

function widg_yt() {
  let id = document.querySelector('#youtube-video-id').value
  if (!id) return

  let textarea = document.querySelector('#raw-content')
  if (!textarea) return
  textarea.value += `<div class="widget"><iframe width="424" height="238" src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay;"></iframe></div>`

}

function widg_mathsExpr() {
  let expr = document.querySelector('#maths-expression').value
  if (!expr) return

  let textarea = document.querySelector('#raw-content')
  if (!textarea) return
  textarea.value += `:::\n${expr}\n:::`
}

function switch_pres() {
  document.querySelector('#presmenu').classList.toggle('hidden')
}

document.querySelector('#tickhighlight').addEventListener('change', function() {
  if (document.querySelector('#tickhighlight').checked) {
    document.documentElement.style.setProperty('--selectionbg', "yellow")
    document.documentElement.style.setProperty('--selectioncolor', "black")
  }
  else {
    document.documentElement.style.setProperty('--selectionbg', document.documentElement.style.getPropertyValue('--fontcolor'))
    document.documentElement.style.setProperty('--selectioncolor', document.documentElement.style.getPropertyValue('--bgcolor'))
  }
})

function switch_dico() {
  document.querySelector('#dicomenu').classList.toggle('hidden')
}

document.addEventListener("keydown", (event) => {
  let key = event.isComposing || event.keyCode
  if (event.ctrlKey && key === 13) {
    switch_render()
    let ta = document.querySelector('#raw-content')
    if (ta) {
      ta.setSelectionRange(ta.value.length, ta.value.length);
      ta.focus()
    }
    return

  } if (event.ctrlKey && key === 190) {
    event.preventDefault()
    return switch_widget()

  } if (event.ctrlKey && key === 84) {
    event.preventDefault()
    return switch_theme()

  } if (event.ctrlKey && key === 83) {
    event.preventDefault()
    return switch_file()

  } if (event.ctrlKey && key === 72) {
    return switch_pres()

  } if (event.ctrlKey && event.altKey && key === 68) {
    return switch_dico()
  }
})