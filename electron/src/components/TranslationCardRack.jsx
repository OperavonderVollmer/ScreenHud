import React, {useState, useEffect, useRef, useCallback} from "react";
import TranslationCardEmitter from "../emitters/TranslationCardEmitter";
import TranslationCard from "../components/TranslationCard";
import GetRandomID from "../utilities/RandomID";

function TranslationCardRack() {
    const [cards, setCards] = useState([]);

    const addNewCards = useCallback(
        newCards => {
            const updatedCards = [];
            newCards.forEach(card => {
                updatedCards.push({id: GetRandomID(), ...card});
            });
            setCards(prevCards => [...prevCards, ...updatedCards]);
        },
        [setCards]
    );

    const dismissCard = useCallback(
        id => {
            const updatedCards = [];
            cards.forEach(card => {
                if (card.id !== id) {
                    updatedCards.push(card);
                }
            });
            console.log(updatedCards);
            setCards(updatedCards);
        },
        [cards, setCards]
    );

    // Subscribes the events
    useEffect(() => {
        TranslationCardEmitter.subscribe("OPR:new_translation_card", addNewCards);
        TranslationCardEmitter.subscribe("OPR:dismiss_translation_card", dismissCard);
    }, [addNewCards, dismissCard]);

    return (
        <div className={`flex-col h-screen w-[20vw] overflow-hidden duration-300 ease-in-out p-2 *:m-5`} style={{backgroundColor: "rgba(255, 0, 0, 0.19)"}}>
            {cards.map(card => (
                <TranslationCard {...card} />
            ))}
        </div>
    );
}

export default TranslationCardRack;
