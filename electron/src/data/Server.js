import {Buffer} from "buffer";
import net from "net";
import process from "process";

class ServerConfigs {
    static HUD_HOST = String(process.env.HUD_HOST ?? "127.0.0.1");
    static HUD_PORT = Number(process.env.HUD_PORT ?? 56000);
}

class _Server {
    constructor() {
        this.mainWindow = null;
        this.controlWindow = null;
    }

    win(mainWindow) {
        this.mainWindow = mainWindow;
    }

    control(controlWindow) {
        this.controlWindow = controlWindow;
    }

    // expected payload

    // type: type of payload
    // timestamp: timestamp
    // target: whether to send to main or control window
    // result: dictionary

    startServer() {
        const server = net.createServer(socket => {
            console.log("Client connected from: ", socket.remoteAddress + ":" + socket.remotePort);

            let receivedData = Buffer.alloc(0);
            let expectedDataSize = null;

            socket.on("data", chunk => {
                // Every time we receive data, add it to the buffer
                receivedData = Buffer.concat([receivedData, chunk]);

                if (expectedDataSize === null && receivedData.length >= 4) {
                    // Datasize is currently unknown, this means the data we have received is the datasize

                    expectedDataSize = receivedData.readUInt32BE(0);

                    // Cleansing received data buffer
                    receivedData = receivedData.subarray(4);
                    console.log("Expected datasize:", expectedDataSize);
                }

                if (expectedDataSize !== null && receivedData.length >= expectedDataSize) {
                    // Datasize is known and is at or more than the size of the data we expected to receive

                    const payloadJSON = receivedData.toString("utf8");
                    // Add a timestamp to the received payload
                    const timestamp = new Date().toISOString();
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

                    receivedData = Buffer.alloc(0);
                    expectedDataSize = null;
                }
            });

            socket.on("end", () => {
                console.log("Client disconnected from: ", socket.remoteAddress + ":" + socket.remotePort);
            });

            socket.on("error", error => {
                console.log("Socket error:", error);
            });
        });

        server.listen(ServerConfigs.HUD_PORT, ServerConfigs.HUD_HOST, () => {
            console.log(`Server started on ${ServerConfigs.HUD_HOST}:${ServerConfigs.HUD_PORT}`);
        });

        server.on("error", error => {
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

export default OPRServer;
