var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, ipcMain, screen } from "electron";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import { Buffer as Buffer$1 } from "buffer";
import net from "net";
import process$1 from "process";
import process$2 from "node:process";
import require$$0 from "fs";
import require$$1 from "path";
import require$$2 from "os";
import require$$3 from "crypto";
import { writeFileSync, readFileSync } from "node:fs";
class ServerConfigs {
}
__publicField(ServerConfigs, "HUD_HOST", String(process$1.env.HUD_HOST ?? "127.0.0.1"));
__publicField(ServerConfigs, "HUD_PORT", Number(process$1.env.HUD_PORT ?? 56e3));
class _Server {
  constructor() {
    this.mainWindow = null;
    this.controlWindow = null;
  }
  win(mainWindow) {
    this.mainWindow = mainWindow;
  }
  /**
   * Sets the control window reference for this server instance.
   * @param {BrowserWindow} controlWindow - The control window to be set.
   */
  control(controlWindow) {
    this.controlWindow = controlWindow;
  }
  // expected payload
  // type: type of payload
  // timestamp: timestamp
  // target: whether to send to main or control window
  // result: dictionary
  startServer() {
    const server = net.createServer((socket) => {
      console.log("Client connected from: ", socket.remoteAddress + ":" + socket.remotePort);
      let receivedData = Buffer$1.alloc(0);
      let expectedDataSize = null;
      socket.on("data", (chunk) => {
        receivedData = Buffer$1.concat([receivedData, chunk]);
        if (expectedDataSize === null && receivedData.length >= 4) {
          expectedDataSize = receivedData.readUInt32BE(0);
          receivedData = receivedData.subarray(4);
          console.log("Expected datasize:", expectedDataSize);
        }
        if (expectedDataSize !== null && receivedData.length >= expectedDataSize) {
          const payloadJSON = receivedData.toString("utf8");
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          console.log(timestamp + "Received payload:", payloadJSON);
          try {
            const payload = JSON.parse(payloadJSON);
            let w = null;
            switch (payload.target) {
              case "main":
                w = this.mainWindow;
                break;
              case "control":
                w = this.controlWindow;
                break;
            }
            if (!w || w.isDestroyed()) return;
            w.webContents.send("type-change", payload.type);
            w.webContents.send("payload-send", payload.results);
          } catch (error) {
            console.log("Error parsing payload:", error);
          }
          receivedData = Buffer$1.alloc(0);
          expectedDataSize = null;
        }
      });
      socket.on("end", () => {
        console.log("Client disconnected from: ", socket.remoteAddress + ":" + socket.remotePort);
      });
      socket.on("error", (error) => {
        console.log("Socket error:", error);
      });
    });
    server.listen(ServerConfigs.HUD_PORT, ServerConfigs.HUD_HOST, () => {
      console.log(`Server started on ${ServerConfigs.HUD_HOST}:${ServerConfigs.HUD_PORT}`);
    });
    server.on("error", (error) => {
      switch (error.code) {
        case "EACCES":
          console.log(`Port ${ServerConfigs.HUD_PORT} is already in use. A result of a previous instance of ScreenHud.`);
          break;
        case "EADDRINUSE":
          console.log(`Port ${ServerConfigs.HUD_PORT} is already in use. A result of a previous instance of ScreenHud.`);
          break;
      }
    });
  }
  stopServer() {
    throw new Error("This is not implemented yet");
  }
}
const OPRServer = new _Server();
const address = "http://127.0.0.1:56000/";
async function restCheck$1() {
  const res = await fetch(address);
  const data = await res.json();
  return data;
}
async function getForecast() {
  const res = await fetch(`${address}forecast`);
  const data = await res.json();
  return data;
}
async function newAlarm(payload) {
  console.log(
    `Payload to send ${address}alarms/new:
${JSON.stringify(payload)} `
  );
  const res = await fetch(`${address}alarms/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log(data);
  return data;
}
async function listAlarms() {
  const res = await fetch(`${address}alarms/list`);
  const data = await res.json();
  return data;
}
async function startAllAlarms() {
  const res = await fetch(`${address}alarms/start_all`);
  const data = await res.json();
  return data;
}
async function startAlarm(title) {
  const res = await fetch(`${address}alarms/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  const data = await res.json();
  return data;
}
async function clearAlarm(title) {
  const res = await fetch(`${address}alarms/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  const data = await res.json();
  return data;
}
async function clearAllAlarms() {
  const res = await fetch(`${address}alarms/clear_all`);
  const data = await res.json();
  return data;
}
async function setAutoSave(t) {
  const res = await fetch(`${address}alarms/set_auto_save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ t })
  });
  const data = await res.json();
  return data;
}
async function setAutoStart(t) {
  const res = await fetch(`${address}alarms/set_auto_start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ t })
  });
  const data = await res.json();
  return data;
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var main = { exports: {} };
const version$1 = "16.5.0";
const require$$4 = {
  version: version$1
};
const fs = require$$0;
const path = require$$1;
const os = require$$2;
const crypto = require$$3;
const packageJson = require$$4;
const version = packageJson.version;
const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
function parse(src) {
  const obj = {};
  let lines = src.toString();
  lines = lines.replace(/\r\n?/mg, "\n");
  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1];
    let value = match[2] || "";
    value = value.trim();
    const maybeQuote = value[0];
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, "\n");
      value = value.replace(/\\r/g, "\r");
    }
    obj[key] = value;
  }
  return obj;
}
function _parseVault(options) {
  const vaultPath = _vaultPath(options);
  const result = DotenvModule.configDotenv({ path: vaultPath });
  if (!result.parsed) {
    const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
    err.code = "MISSING_DATA";
    throw err;
  }
  const keys = _dotenvKey(options).split(",");
  const length = keys.length;
  let decrypted;
  for (let i = 0; i < length; i++) {
    try {
      const key = keys[i].trim();
      const attrs = _instructions(result, key);
      decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
      break;
    } catch (error) {
      if (i + 1 >= length) {
        throw error;
      }
    }
  }
  return DotenvModule.parse(decrypted);
}
function _warn(message) {
  console.log(`[dotenv@${version}][WARN] ${message}`);
}
function _debug(message) {
  console.log(`[dotenv@${version}][DEBUG] ${message}`);
}
function _dotenvKey(options) {
  if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
    return options.DOTENV_KEY;
  }
  if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
    return process.env.DOTENV_KEY;
  }
  return "";
}
function _instructions(result, dotenvKey) {
  let uri;
  try {
    uri = new URL(dotenvKey);
  } catch (error) {
    if (error.code === "ERR_INVALID_URL") {
      const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    throw error;
  }
  const key = uri.password;
  if (!key) {
    const err = new Error("INVALID_DOTENV_KEY: Missing key part");
    err.code = "INVALID_DOTENV_KEY";
    throw err;
  }
  const environment = uri.searchParams.get("environment");
  if (!environment) {
    const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
    err.code = "INVALID_DOTENV_KEY";
    throw err;
  }
  const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
  const ciphertext = result.parsed[environmentKey];
  if (!ciphertext) {
    const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
    err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
    throw err;
  }
  return { ciphertext, key };
}
function _vaultPath(options) {
  let possibleVaultPath = null;
  if (options && options.path && options.path.length > 0) {
    if (Array.isArray(options.path)) {
      for (const filepath of options.path) {
        if (fs.existsSync(filepath)) {
          possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
        }
      }
    } else {
      possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
    }
  } else {
    possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
  }
  if (fs.existsSync(possibleVaultPath)) {
    return possibleVaultPath;
  }
  return null;
}
function _resolveHome(envPath2) {
  return envPath2[0] === "~" ? path.join(os.homedir(), envPath2.slice(1)) : envPath2;
}
function _configVault(options) {
  const debug = Boolean(options && options.debug);
  if (debug) {
    _debug("Loading env from encrypted .env.vault");
  }
  const parsed = DotenvModule._parseVault(options);
  let processEnv = process.env;
  if (options && options.processEnv != null) {
    processEnv = options.processEnv;
  }
  DotenvModule.populate(processEnv, parsed, options);
  return { parsed };
}
function configDotenv(options) {
  const dotenvPath = path.resolve(process.cwd(), ".env");
  let encoding = "utf8";
  const debug = Boolean(options && options.debug);
  if (options && options.encoding) {
    encoding = options.encoding;
  } else {
    if (debug) {
      _debug("No encoding is specified. UTF-8 is used by default");
    }
  }
  let optionPaths = [dotenvPath];
  if (options && options.path) {
    if (!Array.isArray(options.path)) {
      optionPaths = [_resolveHome(options.path)];
    } else {
      optionPaths = [];
      for (const filepath of options.path) {
        optionPaths.push(_resolveHome(filepath));
      }
    }
  }
  let lastError;
  const parsedAll = {};
  for (const path2 of optionPaths) {
    try {
      const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
      DotenvModule.populate(parsedAll, parsed, options);
    } catch (e) {
      if (debug) {
        _debug(`Failed to load ${path2} ${e.message}`);
      }
      lastError = e;
    }
  }
  let processEnv = process.env;
  if (options && options.processEnv != null) {
    processEnv = options.processEnv;
  }
  DotenvModule.populate(processEnv, parsedAll, options);
  if (lastError) {
    return { parsed: parsedAll, error: lastError };
  } else {
    return { parsed: parsedAll };
  }
}
function config(options) {
  if (_dotenvKey(options).length === 0) {
    return DotenvModule.configDotenv(options);
  }
  const vaultPath = _vaultPath(options);
  if (!vaultPath) {
    _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
    return DotenvModule.configDotenv(options);
  }
  return DotenvModule._configVault(options);
}
function decrypt(encrypted, keyStr) {
  const key = Buffer.from(keyStr.slice(-64), "hex");
  let ciphertext = Buffer.from(encrypted, "base64");
  const nonce = ciphertext.subarray(0, 12);
  const authTag = ciphertext.subarray(-16);
  ciphertext = ciphertext.subarray(12, -16);
  try {
    const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
    aesgcm.setAuthTag(authTag);
    return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
  } catch (error) {
    const isRange = error instanceof RangeError;
    const invalidKeyLength = error.message === "Invalid key length";
    const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
    if (isRange || invalidKeyLength) {
      const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    } else if (decryptionFailed) {
      const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
      err.code = "DECRYPTION_FAILED";
      throw err;
    } else {
      throw error;
    }
  }
}
function populate(processEnv, parsed, options = {}) {
  const debug = Boolean(options && options.debug);
  const override = Boolean(options && options.override);
  if (typeof parsed !== "object") {
    const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
    err.code = "OBJECT_REQUIRED";
    throw err;
  }
  for (const key of Object.keys(parsed)) {
    if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
      if (override === true) {
        processEnv[key] = parsed[key];
      }
      if (debug) {
        if (override === true) {
          _debug(`"${key}" is already defined and WAS overwritten`);
        } else {
          _debug(`"${key}" is already defined and was NOT overwritten`);
        }
      }
    } else {
      processEnv[key] = parsed[key];
    }
  }
}
const DotenvModule = {
  configDotenv,
  _configVault,
  _parseVault,
  config,
  decrypt,
  parse,
  populate
};
main.exports.configDotenv = DotenvModule.configDotenv;
main.exports._configVault = DotenvModule._configVault;
main.exports._parseVault = DotenvModule._parseVault;
main.exports.config = DotenvModule.config;
main.exports.decrypt = DotenvModule.decrypt;
main.exports.parse = DotenvModule.parse;
main.exports.populate = DotenvModule.populate;
main.exports = DotenvModule;
var mainExports = main.exports;
const dotenv = /* @__PURE__ */ getDefaultExportFromCjs(mainExports);
const __dirname = path$1.dirname(fileURLToPath(import.meta.url));
const envPath = path$1.resolve(__dirname, "../../env.env");
dotenv.config({ path: envPath });
process$2.env.APP_ROOT = path$1.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process$2.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process$2.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process$2.env.APP_ROOT, "dist");
process$2.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process$2.env.APP_ROOT, "public") : RENDERER_DIST;
let win = null;
let control = null;
let REST_STATUS = "NO";
function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  let browserWindowProperties = {
    width,
    height,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path$1.join(__dirname, "preload_main.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  };
  win = new BrowserWindow(browserWindowProperties);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win == null ? void 0 : win.setHasShadow(false);
    {
      win == null ? void 0 : win.webContents.openDevTools();
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
function createControl() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: w, height: h } = primaryDisplay.workAreaSize;
  const width = w * 0.5;
  const height = w / 3.56;
  let browserWindowProperties = {
    width,
    height,
    autoHideMenuBar: true,
    frame: false,
    x: 10,
    y: 10,
    webPreferences: {
      preload: path$1.join(__dirname, "preload_control.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  };
  control = new BrowserWindow(browserWindowProperties);
  control.webContents.on("did-finish-load", () => {
    control == null ? void 0 : control.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    control == null ? void 0 : control.setHasShadow(false);
    {
      control == null ? void 0 : control.webContents.openDevTools();
    }
    control == null ? void 0 : control.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  if (VITE_DEV_SERVER_URL) {
    control.loadURL(`${VITE_DEV_SERVER_URL}control.html`);
  } else {
    control.loadFile(path$1.join(RENDERER_DIST, "control.html"));
  }
}
app.on("window-all-closed", () => {
  if (process$2.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  restCheck().then((res) => {
    console.log(`REST status: ${res}`);
  });
  createWindow();
  createControl();
  OPRServer.win(win);
  OPRServer.startServer();
});
async function restCheck() {
  const res = await restCheck$1();
  if (res.status === "OK" && res.status_code === 200) {
    REST_STATUS = "OK";
  } else {
    REST_STATUS = "NO";
  }
  return res.status;
}
ipcMain.on("move-window", (event, x, y) => {
  const w = BrowserWindow.fromWebContents(event.sender);
  if (w) {
    w.setPosition(x, y, true);
  } else {
    console.error("Failed to find window to move.");
  }
});
ipcMain.handle("get-window-size", (event) => {
  const win2 = BrowserWindow.fromWebContents(event.sender);
  if (win2) {
    const size = win2.getSize();
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
    const filepath = path$1.join(app.getAppPath(), _path);
    const data = JSON.parse(readFileSync(filepath, "utf8"));
    console.log(`Read file: ${filepath}. Result: ${JSON.stringify(data)}`);
    return { status: true, data };
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    return { status: false, error: err.message };
  }
});
ipcMain.handle("get-forecast", async () => {
  const res = await getForecast();
  return res;
});
ipcMain.handle("new-alarm", async (_event, payload) => {
  let res = await newAlarm(payload);
  return res;
});
ipcMain.handle("list-alarm", async () => {
  const res = await listAlarms();
  return res;
});
ipcMain.handle("start-all-alarms", async () => {
  await startAllAlarms();
});
ipcMain.handle("start-alarm", async (event, title) => {
  const res = await startAlarm(title);
  return res;
});
ipcMain.handle("clear-alarm", async (event, title) => {
  const res = await clearAlarm(title);
  return res;
});
ipcMain.handle("clear-all-alarms", async () => {
  const res = await clearAllAlarms();
  return res;
});
ipcMain.handle("set-auto-save", async (event, t) => {
  const res = await setAutoSave(t);
  return res;
});
ipcMain.handle("set-auto-start", async (event, t) => {
  const res = await setAutoStart(t);
  return res;
});
ipcMain.handle("new-card", async (event, message) => {
  console.log("New card:", message);
  win.webContents.send("type-change", "card");
  win.webContents.send("payload-send", message);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  REST_STATUS,
  VITE_DEV_SERVER_URL
};
