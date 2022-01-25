function menu(here, e, actual) {
  
  if(here) {
    var div = document.createElement("div")
      div.className = 'menu'
      div.style.width = "100px"
      div.style.height = "100px"
      div.style.background = "red"
      div.style.color = "white"
      div.style.left = `${e.pageX}px`
      div.style.top = `${e.pageY}px`
      div.innerHTML = "Menu"
    document.body.appendChild(div)

    var button = document.createElement('button');
      button.innerHTML = 'save';
      button.onclick = save()
    
    div.appendChild(button)

    var button = document.createElement('button');
      button.innerHTML = 'load';
      button.onclick = loadsave()
    
    div.appendChild(button)

    var button = document.createElement('button');
      button.innerHTML = 'log';
      button.onclick = log()
    
    div.appendChild(button)

    var button = document.createElement('button');
      button.innerHTML = 'widjet';
      button.onclick = widjet()
    
    div.appendChild(button)

  }
  
  else {

    if(document.getElementsByClassName('menu')[actual] !== undefined) {
      document.getElementsByClassName('menu')[actual].remove()
    }

  }

}