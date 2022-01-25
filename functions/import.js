async function importfromfile() {

  document.getElementById('fileToLoad').click()

  const selectElement = document.querySelector('#fileToLoad')

  selectElement.addEventListener('change', (event) => {

    var fileToLoad = document.getElementById("fileToLoad").files[0]
    let extensions = fileToLoad.name.split('.')
    let extension = extensions[extensions.length-2] + "." + extensions[extensions.length-1]

    let accepted_ext = ['vb.tsu']

    if(!accepted_ext.includes(extension)) return alert(`l\'extension de fichier n\'est pas reconnue.`)

    var fileReader = new FileReader()

    fileReader.onload = function(fileLoadedEvent) {

      rawtext = fileLoadedEvent.target.result

      if(!rawtext.endsWith('Ҡ')) return alert(`le fichier est corrompu ou erroné.`)

      let text = backify(rawtext)

      let cell = text.split('Ҡ')

      for (var i = 0; i < 5; i++) {

        if(document.getElementById(`textclass-${i}`)) document.getElementById(`textclass-${i}`).value = "" + cell[i]

      }

      slicetext()

    }

    fileReader.readAsText(fileToLoad, "UTF-8")

  })

  

}