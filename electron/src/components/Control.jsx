import React from "react";

function Control(props) {
    let c = "flex flex-col items-center justify-center";

    if (props.class) {
        c += " " + props.class;
    }

    return (
        <div style={{transform: `skewX(${props.skew}deg)`}} className={`${c}`}>
            {props.children}
        </div>
    );
}

export default Control;
