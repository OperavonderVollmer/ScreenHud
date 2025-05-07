const {contextBridge, ipcRenderer} = require("electron");
// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("controlAPI", {
    on(...args) {
        const [channel, listener] = args;
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
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
    pong() {
        return ipcRenderer.send("pong-control");
    },
});
