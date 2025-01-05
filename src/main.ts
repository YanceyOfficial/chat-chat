import { app, BrowserWindow, ipcMain } from 'electron'
import started from 'electron-squirrel-startup'
import path from 'path'
import {
  saveFileToAppDataDir,
  saveFileWithDialog,
  transformFilenameToSrc
} from './ipc'
import { IPC_NAMES } from './shared/constants'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
    icon: '../public/icon.png'
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }

  // Open the DevTools.
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools()
  }

  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       'Content-Security-Policy': [
  //         "default-src 'self'",
  //         "img-src * 'self' data: https: asset: https://asset.localhost",
  //         "style-src 'self' 'unsafe-inline'",
  //         "connect-src ipc: http://ipc.localhost *  asset: https://asset.localhost"
  //       ]
  //     }
  //   })
  // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle(IPC_NAMES.saveFileWithDialog, saveFileWithDialog)
ipcMain.handle(IPC_NAMES.saveFileToAppDataDir, saveFileToAppDataDir)
ipcMain.handle(IPC_NAMES.transformFilenameToSrc, transformFilenameToSrc)
