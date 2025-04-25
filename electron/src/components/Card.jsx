import React, {useEffect, useRef, useState} from "react";

const Card = ({id, onFadeComplete, content}) => {
    const fadeTime = 500;
    const timeout = 5000;

    const [hovered, setHovered] = useState(false);

    const timeoutTimer = useRef(null);

    const onFadeCompleteRef = useRef(onFadeComplete);

    useEffect(() => {
        onFadeCompleteRef.current = onFadeComplete;
    }, [onFadeComplete]);

    useEffect(() => {
        if (hovered) {
            console.log(`Pausing timeout for card ${id}`);
            clearTimeout(timeoutTimer.current);
        } else {
            clearTimeout(timeoutTimer.current);
            console.log(`Starting timeout for card ${id}`);
            timeoutTimer.current = setTimeout(() => {
                console.log(`Fading out card ${id}`);
                setTimeout(() => {
                    onFadeCompleteRef.current();
                }, fadeTime + 100);
            }, timeout);
            return;
        }

        return () => clearTimeout(timeoutTimer.current);
    }, [hovered, id]);

    return (
        <div className={`card`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {Object.entries(content).map(([key, value]) => (
                <h4 key={key}>
                    {key}: <span>{value}</span>
                </h4>
            ))}
            <p>Automatically dismiss after 5 seconds. Hover to cancel</p>
        </div>
    );
};

export default Card;
