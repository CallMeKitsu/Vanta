function slicetext() {

  var calculateContentHeight = function( ta, scanAmount ) {
      var origHeight = ta.style.height,
          height = ta.offsetHeight,
          scrollHeight = ta.scrollHeight,
          overflow = ta.style.overflow;

      if ( height >= scrollHeight ) {

          ta.style.height = (height + scanAmount) + 'px';

          ta.style.overflow = 'hidden';

          if ( scrollHeight < ta.scrollHeight ) {

              while (ta.offsetHeight >= ta.scrollHeight) {
                  ta.style.height = (height -= scanAmount)+'px';
              }
              while (ta.offsetHeight < ta.scrollHeight) {
                  ta.style.height = (height++)+'px';
              }
              ta.style.height = origHeight;
              ta.style.overflow = overflow;
              return height;
          }
      } else {
          return scrollHeight;
      }
  }

  for (var i = 0; i < 5; i++) {
    let ta = document.getElementById(`textclass-${i}`)

    if(ta && ta.nodeName === "TEXTAREA") {

      taLineHeight = 25
      taHeight = calculateContentHeight(ta, taLineHeight),
      numberOfLines = Math.ceil(taHeight / taLineHeight) -1

      ta.rows = numberOfLines + 2
      data[i].raw = linify(ta.value)

    }
  
  }

}