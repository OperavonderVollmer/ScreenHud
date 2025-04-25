import {app, BrowserWindow, Tray, Menu, screen} from "electron";
import {fileURLToPath} from "node:url";
import path from "node:path";
import OPRServer from "../src/data/Server.js";
import process from "node:process";
import dotenv from "dotenv";

/*
Unused imports cause typescript is a bitch and complains about unused imports


import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

*/

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.resolve(__dirname, "../../env.env");
dotenv.config({path: envPath});

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

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let win = null;
let tray = null;

const DEBUG_MODE = false;

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const {width, height} = primaryDisplay.workAreaSize;

    let browserWindowProperties = {
        width: width,
        height: height,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    };

    if (!DEBUG_MODE) {
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
        win?.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
        win?.setHasShadow(false);

        if (DEBUG_MODE) {
            win?.webContents.openDevTools();
        } else {
            win?.setIgnoreMouseEvents(true, {forward: true});
        }

        win?.webContents.send("main-process-message", new Date().toLocaleString());
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
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
    if (!DEBUG_MODE) {
        createTray();
    }
    OPRServer.win(win);
    OPRServer.startServer();
});
