import { app, BrowserWindow, screen, Tray, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let tray;
function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  let browserWindowProperties = {
    width,
    height,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  };
  win = new BrowserWindow(browserWindowProperties);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win == null ? void 0 : win.setHasShadow(false);
    {
      win == null ? void 0 : win.webContents.openDevTools();
    }
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
function createTray() {
  const trayIcon = path.join(process.env.VITE_PUBLIC, "HUD2.png");
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Translation Card Test", click: () => {
      console.log("Translation Card Test");
    } },
    { label: "Exit", click: () => {
      app.quit();
    } }
  ]);
  tray.setToolTip("ScreenHud");
  tray.setContextMenu(contextMenu);
}
app.whenReady().then(() => {
  createWindow();
  createTray();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
