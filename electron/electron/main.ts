import { app, BrowserWindow, Tray, Menu, screen } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

/*
Unused imports cause typescript is a bitch and complains about unused imports


import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

*/


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray | null

function createWindow() {

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  win = new BrowserWindow({
    // transparent: true,    
    // frame: false,
    // skipTaskbar: true,
    // alwaysOnTop: true,
    // focusable: false,


    // So far, these haven't been working out

    // fullscreen: true,
    // kiosk: true,

    width: width,
    height: height,
    resizable: false,
    
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })


  // This opens the console. Uncomment as needed
  win.webContents.openDevTools()

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {

    //win?.setAlwaysOnTop(true, "screen-saver")
    // win?.setAlwaysOnTop(true, 'floating')


    win?.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true})
    win?.setHasShadow(false)

    // win?.setIgnoreMouseEvents(true, { forward: true })


    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})



function createTray(){
  
  const trayIcon = path.join(process.env.VITE_PUBLIC, 'HUD2.png')
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {label: "Translation Card Test", click: () => {
      console.log("Translation Card Test")
    }},
    {label: "Exit", click: () => {
      app.quit()// ,
      //app.isQuitting = True
    }},
  ])

  tray.setToolTip("ScreenHud")
  tray.setContextMenu(contextMenu)


}



app.whenReady().then(() =>{
  createWindow()
  createTray()
})