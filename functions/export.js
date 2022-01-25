function exportasstring() {

  datasave()

  let string = ""

  for (const element of data) {

    string += element.raw + "Ҡ"

  }

  name = prompt('nom de sauvegarde ?')

  var blob = new Blob([string], { type: "text/plain;charset=utf-8" })
  _global.saveAs(blob, `${name}.vb.tsu`)

}