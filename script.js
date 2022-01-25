let ACTUAL = 0

let data = [{index:0, raw:""},{index:1, raw:""},{index:2, raw:""},{index:3, raw:""},{index:4, raw:""},]

document.documentElement.style.setProperty('--bgcolor', "black")
document.documentElement.style.setProperty('--fontcolor', "white")

function classStyle(classname, property, value) {

  console.log('classStyle used.')

    var all = document.getElementsByClassName(classname)
    for (var i = 0; i < all.length; i++) {
      all[i].style[property] = value
    }

}

function cookiesave() {

  datasave()

  text = ""

  for (const element of data) {

    text += element.raw + "Ҡ"

  }

  document.cookie = `null=${text}`

}

function loadsave() {

  name = prompt('nom de sauvegarde à charger ?')

  if(!document.cookie.includes(name)) text = "Sauvegarde inexistante."
  else text = backify(document.cookie.split(`${name}=`)[1])

  let cell = text.split('Ҡ')

  console.log(cell)

  for (var i = 0; i < 5; i++) {

    if(document.getElementById(`textclass-${i}`)) document.getElementById(`textclass-${i}`).value = "" + cell[i]

  }

  slicetext()

}

function linify(str) {

  return str.replace(/(?:\r\n|\r|\n)/g, '\\n')

}

function backify(str) {
  
  return str.replace(/(\\n)/g, '\n')

}

function between(str, btwn) {

  arr = str.split(btwn)
  new_ = []

  for(var i = 1; i < arr.length; i += 2) {
    new_.push(arr[i])
  }
      
  return new_

}

function markwith(str, sign, balise, end_balise) {

  arr = between(str, sign)

  if(arr.length > 0) {
    for (const this_ of arr) {
      str = str.replace(sign + this_ + sign, balise + this_ + end_balise)
    }
  }

  return str

}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}