//************************************************************************************** */
// Simple app to poll qbittorent-nox data from a remote machine (in this case a pi 4)
// and display some stats to the screen. An alternative to using a web browswer, idk why.
// Made this to try and learn some javascript stuff, still in work.
//
// Update your own IP address and login info right below here
//
// setup directory with "npm init" then "npm install electron --save-dev"
// run with "npm run start"
//
// Author - Jeremy R.
//************************************************************************************** */

//Set your own IP address, not mine
const address = "http://127.0.0.1:8080";
//These are the default values, probably change these
const username = "admin";
const password = "adminadmin";

const { app, BrowserWindow, ipcMain, nativeTheme, Menu, MenuItem } = require('electron')
const path = require('path')
var tools = require('./interface');

const createWindow = () => {
  const win = new BrowserWindow({
    //titleBarStyle: 'hidden',
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  function getApiVersions(apiVer, appVer, savePath) {
    console.log(apiVer);
    console.log(appVer);
    console.log(savePath);
    win.webContents.send('update-versions', apiVer, appVer, savePath);
  }

  function upGlobal(totalDown, totalUp, curDown, curUP) {
    console.log(totalDown);
    console.log(totalUp);

    win.webContents.send('update-bytes', totalDown, curDown, totalUp, curUP);
  }
  tools.startAPI(getApiVersions, upGlobal, address, username, password);
  tools.runAPI();
}

const menu = new Menu()
menu.append(new MenuItem({
  label: 'Electron',
  submenu: [{
    role: 'help',
    accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
    click: () => { console.log('Menu pressed') }
  }]
}))

Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})