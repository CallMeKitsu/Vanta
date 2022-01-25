function datasave() {

  for (var i = 0; i < 5; i++) {

    if(document.getElementById(`textclass-${i}`)) data[i].raw = linify(document.getElementById(`textclass-${i}`).value)

  }

}