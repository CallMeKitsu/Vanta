const {app, BrowserWindow} = require('electron')
const { ipcMain, isMac} = require('electron')

const path = require('path')

function createWindow () {

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/libs/preload.js')
    },
    frame: false,
    icon: "assets/ico.png"
  })

  mainWindow.loadFile('index.html')
  
}

app.whenReady().then(() => {

  createWindow()

  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    
  })

})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('window-minimize', function (event) {
  BrowserWindow.fromWebContents(event.sender).minimize();
})

ipcMain.on('window-maximize', function (event) {
  const window = BrowserWindow.fromWebContents(event.sender);
  window.isMaximized() ? window.unmaximize() : window.maximize();
})

ipcMain.on('window-close', function (event) {
  BrowserWindow.fromWebContents(event.sender).close()
})

ipcMain.on('window-is-maximized', function (event) {
  event.returnValue = BrowserWindow.fromWebContents(event.sender).isMaximized()
})