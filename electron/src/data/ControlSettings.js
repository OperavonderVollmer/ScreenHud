import GetRandomID from "../utilities/RandomID";

class _ControlSettings {
    constructor() {
        this.id = GetRandomID();
        this.window = null;
        this.control = null;
        this.width = 0;
        this.height = 0;
        this.offset = 0;

        console.log("ControlSettings created. ID: ", this.id);
    }

    main(window) {
        if (window) {
            console.log("Window is null");
            return false;
        }
        console.log(`Window created for ${this.id}`);
        this.window = window;
    }

    control(window) {
        if (window) {
            console.log("Window is null");
            return false;
        }
        console.log(`Control window referenced for ${this.id}`);
        this.control = window;
    }

    checkID() {
        return this.id;
    }

    size(width, height) {
        this.width = width;
        this.height = height;
    }

    setOffset(offset) {
        this.offset = offset;
    }

    confirmWindow() {
        if (!this.window) {
            console.log("Window is null");
            return false;
        }
        if (this.window.isDestroyed()) {
            console.log("Main window is destroyed");
            return false;
        }
        return true;
    }

    confirmControl() {
        if (!this.control) {
            console.log("Window is null");
            return false;
        }
        if (this.control.isDestroyed()) {
            console.log("Main window is destroyed");
            return false;
        }
        return true;
    }

    communicate(type, event, payload) {
        if (!this.confirmWindow()) return;
        this.window.webContents.send("type-change", type);
        this.window.webContents.send(event, payload);
    }

    move(x, y) {
        if (!this.confirmControl()) return;
        this.control.setPosition(x, y);
    }
}
const ControlSettings = new _ControlSettings();

export default ControlSettings;
