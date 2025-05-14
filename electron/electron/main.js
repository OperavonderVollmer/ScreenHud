import { app, BrowserWindow, Tray, Menu, screen, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import OPRServer from "../src/data/Server.js";
import process from "node:process";
import dotenv from "dotenv";
import { writeFileSync, readFileSync } from "node:fs";
import { Facebook } from "lucide-react";

/*
Unused imports cause typescript is a bitch and complains about unused imports


import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

*/

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.resolve(__dirname, "../../env.env");
dotenv.config({ path: envPath });

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win = null;
let control = null;
let tray = null;

const MAINWINDOW_DEBUG_MODE = false;
const CONTROL_DEBUG_MODE = false;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  let browserWindowProperties = {
    width: width,
    height: height,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload_main.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  };

  if (!MAINWINDOW_DEBUG_MODE) {
    browserWindowProperties = {
      ...browserWindowProperties,
      transparent: true,
      frame: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      focusable: false,
    };
  }
  win = new BrowserWindow(browserWindowProperties);

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win?.setHasShadow(false);

    if (MAINWINDOW_DEBUG_MODE) {
      win?.webContents.openDevTools();
    } else {
      win?.setIgnoreMouseEvents(true, { forward: true });
    }

    // win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

function createControl() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: w, height: h } = primaryDisplay.workAreaSize;
  const width = w * 0.5;
  // const height = h * 0.5;
  const height = w / 3.56; // This is to preserve the aspect ratio

  // const xoffset = CONTROL_DEBUG_MODE ? width : width * -1 + 10;
  // const xoffset = width * -1 + 20;

  let browserWindowProperties = {
    width: width,
    height: height,
    autoHideMenuBar: true,
    frame: false,
    x: CONTROL_DEBUG_MODE ? 10 : width * -1 + 5,
    y: CONTROL_DEBUG_MODE ? 10 : h * -1,

    webPreferences: {
      preload: path.join(__dirname, "preload_control.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  };

  if (!CONTROL_DEBUG_MODE) {
    browserWindowProperties = {
      ...browserWindowProperties,
      resizable: false,
      transparent: true,
      frame: false,
      skipTaskbar: true,
      alwaysOnTop: true,
    };
  }

  control = new BrowserWindow(browserWindowProperties);

  // control?.webContents.openDevTools();

  control.webContents.on("did-finish-load", () => {
    control?.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    control?.setHasShadow(false);

    if (CONTROL_DEBUG_MODE) {
      control?.webContents.openDevTools();
    } else {
      // control?.setIgnoreMouseEvents(true, { forward: true });
    }

    control?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  if (VITE_DEV_SERVER_URL) {
    control.loadURL(`${VITE_DEV_SERVER_URL}control.html`);
  } else {
    control.loadFile(path.join(RENDERER_DIST, "control.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function createTray() {
  const trayIcon = path.join(process.env.VITE_PUBLIC, "HUD2.png");
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Exit",
      click: () => {
        app.quit(); // ,
        //app.isQuitting = True
      },
    },
  ]);

  tray.setToolTip("ScreenHud");
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  createControl();

  OPRServer.win(win);
  OPRServer.startServer();

  if (!MAINWINDOW_DEBUG_MODE) {
    createTray();
  }
});

ipcMain.on("move-window", (event, x, y) => {
  const w = BrowserWindow.fromWebContents(event.sender);
  if (w) {
    w.setPosition(x, y, true);
  } else {
    console.error("Failed to find window to move.");
  }
});

ipcMain.handle("get-window-size", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    const size = win.getSize();
    return { width: size[0], height: size[1] };
  } else {
    console.error("Failed to find window to get size.");
    return { width: 0, height: 0 };
  }
});

ipcMain.handle("json-write", (event, _path, _data) => {
  try {
    writeFileSync(_path, JSON.stringify(_data, null, 2), "utf8");
    return { status: true };
  } catch (err) {
    return { status: false, error: err.message };
  }
});

ipcMain.handle("json-read", (event, _path) => {
  try {
    const filepath = path.join(app.getAppPath(), _path);
    const data = JSON.parse(readFileSync(filepath, "utf8"));
    console.log(`Read file: ${filepath}. Result: ${JSON.stringify(data)}`);
    return { status: true, data };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    return { status: false, error: err.message };
  }
});
