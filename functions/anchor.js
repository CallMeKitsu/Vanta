function anchor(actual) {

  datasave()

    var div = document.createElement("div")
      div.className = 'renderblock'
      div.id = `renderblock-${actual}`
      div.background = "orange"

  elmnt = document.getElementById(`textclass-${actual}`)
  
  if(!elmnt || elmnt.nodeName !== "TEXTAREA") return
  
  ta = elmnt.value
  
  lines = ta.split("\n")

  n = 0
  code_ex = 1
  let in_code = false

  for (var line of lines) {

    if(in_code === true && !line.startsWith('```')) {
      continue
    }
    
    if(line.startsWith('# ')) {
      
      var title = document.createElement('h1')
        title.classname = "renderline"
        title.id = `renderblock-${actual}-renderline-${n}`
        title.innerHTML = line.split('# ')[1].bold()
      div.appendChild(title)

    }

    else if(line.startsWith('## ')) {
      
      var title = document.createElement('h2')
        title.classname = "renderline"
        title.id = `renderblock-${actual}-renderline-${n}`
        title.innerHTML = line.split('## ')[1].bold()
      div.appendChild(title)

    }

    else if(line.startsWith('### ')) {
      
      var title = document.createElement('h3')
        title.classname = "renderline"
        title.id = `renderblock-${actual}-renderline-${n}`
        title.innerHTML = line.split('### ')[1].bold()
      div.appendChild(title)

    }

    else if(line.startsWith('```')) {
      
      code_ex += 1

      if(code_ex % 2 === 0) {
        var code = document.createElement('code')
          code.id = `codeexemple-${code_ex-2}`
        div.appendChild(code)
        in_code = true
      }

      else in_code = false

    }

    else {

      var p = document.createElement("p")
        p.className = 'renderline'
        p.id = `renderblock-${actual}-renderline-${n}`

      line = markwith(line, "__", '<u>', '</u>')
      line = markwith(line, "**", '<b>', '</b>')
      line = markwith(line, "*", '<i>', '</i>')
      line = markwith(line, "_", '<i>', '</i>')
      line = markwith(line, "~~", '<strike>', '</strike>')

      p.innerHTML = line
      div.appendChild(p)

    }

    n += 1
  }

  console.log(document.querySelector('#codeexemple-0'))

  return div.outerHTML

}