import React, {useEffect, useRef, useState} from "react";
import TranslationCardEmitter from "../emitters/TranslationCardEmitter";

const TranslationCard = ({id, translationText, originalText, confidence}) => {
    const fadeTime = 500;
    const timeout = 5000;

    const [hovered, setHovered] = useState(false);
    const [fadingOut, setFadingOut] = useState(false);

    const timeoutTimer = useRef(null);

    useEffect(() => {
        if (hovered) {
            console.log(`Pausing timeout for card ${id}`);
            clearTimeout(timeoutTimer.current);
        } else {
            clearTimeout(timeoutTimer.current);
            console.log(`Starting timeout for card ${id}`);
            timeoutTimer.current = setTimeout(() => {
                console.log(`Fading out card ${id}`);
                setFadingOut(true);
                setTimeout(() => {
                    TranslationCardEmitter.publish("OPR:dismiss_translation_card", [id]);
                }, fadeTime + 50);
            }, timeout);
            return;
        }

        return () => clearTimeout(timeoutTimer.current);
    }, [hovered, id]);

    return (
        <div className={`card duration-[${fadeTime}] ease-in-out ${fadingOut ? "opacity-0" : "opacity-100"}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
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
