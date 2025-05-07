import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Emitter from "./emitters/Emitter.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

let type = "card";

window.mainAPI.on("type-change", (_event, newType) => {
    type = newType;
});

window.mainAPI.on("payload-send", (_event, results) => {
    console.log("Received payload:", results);

    switch (type) {
        case "card":
            Emitter.publishList("OPR:new_card", results);
            break;
        default:
            console.log("Unknown payload type:", type);
            break;
    }
});
