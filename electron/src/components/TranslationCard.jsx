import React, {useEffect, useRef, useState} from "react";

const TranslationCard = ({id, translationText, originalText, confidence, onFadeComplete}) => {
    const fadeTime = 500;
    const timeout = 5000;

    const [hovered, setHovered] = useState(false);
    // const [fadingOut, setFadingOut] = useState(false);

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
                // setFadingOut(true);
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
            <h4>
                Translation: <span>{translationText}</span>
            </h4>
            <h4>
                Original: <span>{originalText}</span>
            </h4>
            <h4>
                Confidence: <span>{confidence}%</span>
            </h4>
            <p>Automatically dismiss after 5 seconds. Hover to cancel</p>
        </div>
    );
};

export default TranslationCard;
