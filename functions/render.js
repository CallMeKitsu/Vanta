function render() {

  if(document.getElementById(`textclass-${ACTUAL}`)) {
    document.getElementById(`textclass-${ACTUAL}`).outerHTML = anchor(ACTUAL)
    document.getElementById('render-button').name = "create-outline"
  }
  else {
    document.getElementById(`renderblock-${ACTUAL}`).outerHTML = unanchor(ACTUAL)
    document.getElementById('render-button').name = "document-text-outline"
  }
  slicetext()

}