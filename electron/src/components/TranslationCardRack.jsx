import React, {useState, useEffect, useCallback} from "react";
import TranslationCardEmitter from "../emitters/TranslationCardEmitter";
import TranslationCard from "../components/TranslationCard";
import GetRandomID from "../utilities/RandomID";
import {TransitionGroup, CSSTransition} from "react-transition-group";

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

    const dismissCard = useCallback(id => {
        console.log(`Dismissing card ${id}`);
        setCards(prevCards => prevCards.filter(card => card.id !== id));
    }, []);

    // Subscribes the events
    useEffect(() => {
        TranslationCardEmitter.subscribe("OPR:new_translation_card", addNewCards);
        TranslationCardEmitter.subscribe("OPR:dismiss_translation_card", dismissCard);
    }, [addNewCards, dismissCard]);

    return (
        <div className={`flex flex-col h-screen w-[20vw] overflow-hidden duration-300 ease-in-out p-2 *:m-5`}>
            <TransitionGroup component={null}>
                {cards.map(card => (
                    <CSSTransition key={card.id} timeout={500} classNames={"card-transition"}>
                        <TranslationCard
                            key={card.id}
                            {...card}
                            onFadeComplete={() => {
                                TranslationCardEmitter.publish("OPR:dismiss_translation_card", [card.id]);
                            }}
                        />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
}

export default TranslationCardRack;
