import React, {useState, useEffect, useCallback} from "react";
import Emitter from "../emitters/Emitter";
import GetRandomID from "../utilities/RandomID";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import Card from "./Card";

function CardRack() {
    const [cards, setCards] = useState([]);

    const addNewCards = useCallback(
        newCards => {
            const updatedCards = [];
            newCards.forEach(card => {
                updatedCards.push({id: GetRandomID(), content: card});
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
        Emitter.subscribe("OPR:new_card", addNewCards);
        Emitter.subscribe("OPR:dismiss_card", dismissCard);
    }, [addNewCards, dismissCard]);

    return (
        <div className={`flex flex-col h-screen w-[20vw] overflow-hidden duration-300 ease-in-out p-2 *:m-5`}>
            <TransitionGroup component={null}>
                {cards.map(card => (
                    <CSSTransition key={card.id} timeout={500} classNames={"card-transition"}>
                        <Card
                            key={card.id}
                            onFadeComplete={() => {
                                Emitter.publish("OPR:dismiss_card", [card.id]);
                            }}
                            id={card.id}
                            content={card.content}
                        />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
}

export default CardRack;
