function unanchor(actual) {

  datasave()

  let content = ""
  if(data[actual].raw) {
    content = backify(data[actual].raw)
  }

  return `<textarea class="textclass" id="textclass-${actual}" rows="1">${content}</textarea>`

}