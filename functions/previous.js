function previous() {

  if(ACTUAL > 0) {
    document.getElementById(`textclass-${ACTUAL}`).outerHTML = anchor(ACTUAL)
    slicetext()
    ACTUAL -= 1
    if(document.getElementById(`textclass-${ACTUAL}`)) document.getElementById(`textclass-${ACTUAL}`).outerHTML = unanchor(ACTUAL)
    else document.getElementById(`renderblock-${ACTUAL}`).outerHTML = unanchor(ACTUAL)
    slicetext()
  }

}