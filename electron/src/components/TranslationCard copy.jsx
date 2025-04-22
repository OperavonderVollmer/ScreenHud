import React, {useEffect, useRef, useState} from "react";
import TranslationCardEmitter from "../emitters/TranslationCardEmitter";

//import dotenv from "dotenv";

//dotenv.config();

const TranslationCard = ({id, translationText, originalText, confidence, stay}) => {
    const [hovered, setHovered] = useState(false);
    const [fadingOut, setFadingOut] = useState(false);
    //const timeout = Number(process.env.TRANSLATION_CARD_TIMEOUT ?? 5000);
    const timeout = 5000;
    const fadeTime = 500;
    const timerRef = useRef(null);

    useEffect(() => {
        if (stay) return;

        if (!hovered) {
            timerRef.current = setTimeout(() => {
                if (!hovered) {
                    console.log(`Dismissing card ${translationText}`);
                    setFadingOut(true);
                    clearTimeout(timerRef.current);
                    setTimeout(() => {
                        TranslationCardEmitter.publish("OPR:dismiss_translation_card", [id]);
                    }, fadeTime);
                } else {
                    clearTimeout(timerRef.current);
                }
            }, Number(timeout));
        } else {
            clearTimeout(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [id, hovered, stay, translationText]);

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

// Will keep the bbox values, just in case. But currently unneeded
//const topleft_x = bbox[0];
//const topleft_y = bbox[1];
//------------------------//
//    const topright_x = bbox[2];
//    const topright_y = bbox[3];
//------------------------//
//const bottomright_x = bbox[4];
//const bottomright_y = bbox[5];
//------------------------//
//        const bottomleft_x = bbox[6];
//        const bottomleft_y = bbox[7];

// backgroundColor: rgba(255, 0, 0, 0.19);
//<h4>Translation: <h3>{translationText}</h3></h4>
