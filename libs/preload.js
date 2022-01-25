window.addEventListener('DOMContentLoaded', () => {

  let { ipcRenderer } = require('electron')

  const customTitlebar = require("custom-electron-titlebar");

  const titlebar = new customTitlebar.Titlebar({

      backgroundColor: customTitlebar.Color.fromHex("#000000"),
      onMinimize: () => ipcRenderer.send('window-minimize'),
      onMaximize: () => ipcRenderer.send('window-maximize'),
      onClose: () => ipcRenderer.send('window-close'),
      isMaximized: () => ipcRenderer.sendSync('window-is-maximized'),
      onMenuItemClick: (commandId) => ipcRenderer.send('menu-event', commandId)

  })

  titlebar.updateIcon('../assets/ico.png')
  titlebar.updateTitle('')
  titlebar.updateTitleAlignment('left')

  document.querySelector("body > div.cet-titlebar.cet-windows > div.cet-window-title.cet-center").classname = "cet-window-title cet-left"
  document.querySelector("body > div.cet-titlebar.cet-windows > div.cet-window-title.cet-center").innerHTML = ""
  document.querySelector("body > div.cet-container").style.overflow = "hidden"

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

})