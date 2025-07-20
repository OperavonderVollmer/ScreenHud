const { contextBridge, ipcRenderer } = require("electron");
// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("controlAPI", {
  on(...args) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },

  invoke(...args) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  move(x, y) {
    ipcRenderer.send("move-window", x, y);
  },
  readjson: async (path) => {
    const res = await ipcRenderer.invoke("json-read", path);
    console.log(`Read JSON: ${res}`);
    return res;
  },
  // readjson(path) {
  //   const res = ipcRenderer.invoke("json-read", path);
  //   console.log(`Read JSON: ${res}`);
  //   return res;
  // },
  writejson(path, data) {
    const res = ipcRenderer.invoke("json-write", path, data);
    return res;
  },
  getForecast: async () => {
    const res = await ipcRenderer.invoke("get-forecast");
    return res;
  },

  newAlarm: async (payload) => {
    const res = await ipcRenderer.invoke("new-alarm", payload);
    return res;
  },
  listAlarms: async () => {
    const res = await ipcRenderer.invoke("list-alarms");
    return res;
  },
  startAlarm: async (title) => {
    const res = await ipcRenderer.invoke("start-alarm", title);
    return res;
  },
  clearAlarm: async (title) => {
    const res = await ipcRenderer.invoke("clear-alarm", title);
    return res;
  },
  startAllAlarms: async () => {
    const res = await ipcRenderer.invoke("start-all-alarms");
    return res;
  },
  clearAllAlarms: async () => {
    const res = await ipcRenderer.invoke("clear-all-alarms");
    return res;
  },
  setAutoSave: async (t) => {
    const res = await ipcRenderer.invoke("set-auto-save", t);
    return res;
  },
  setAutoStart: async (t) => {
    const res = await ipcRenderer.invoke("set-auto-start", t);
    return res;
  },
  newCard: async (message) => {
    const res = await ipcRenderer.invoke("new-card", message);
    return res;
  },
});
