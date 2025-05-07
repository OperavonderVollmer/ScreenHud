import React from "react";
import ReactDOM from "react-dom/client";
import "./control.css";
import ControlRack from "./components/ControlRack.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ControlRack />
    </React.StrictMode>
);

let type = "unknown";

window.controlAPI.on("main-process-message", (_event, message) => {
    console.log(message);
});

window.controlAPI.on("type-change", (_event, newType) => {
    type = newType;
});

window.controlAPI.on("payload-send", (_event, results) => {
    console.log("Received payload:", results);

    switch (type) {
        /// I haven't created any payload types for this, will make them at some point but they would usually communicate using the Emitter
        default:
            console.log("Unknown payload type:", type);
            break;
    }
});
