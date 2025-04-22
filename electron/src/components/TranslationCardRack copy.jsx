import React, {useState, useEffect, useRef} from "react";
import TranslationCardEmitter from "../emitters/TranslationCardEmitter";
import TranslationCard from "../components/TranslationCard";
import GetRandomID from "../utilities/RandomID";

function TranslationCardRack() {
    // Array of card props
    const [isVisible, setIsVisible] = useState(false);
    const [cards, setCards] = useState([{id: GetRandomID(), translationText: "Starting Text", originalText: "Starting Text", confidence: "100"}]);
    const [dismissedCards, setDismissedCards] = useState([]);
    const toBeDismissed = useRef(false);
    const firstRun = useRef(true);

    // Example card
    // const card = {translationText: "Hello World", originalText: "Hello World", confidence: "100"};

    function addNewCards(newCards) {
        const toBeAdded = [];
        newCards.forEach(card => {
            toBeAdded.push({id: GetRandomID(), ...card});
        });
        setCards(prevCards => [...prevCards, ...toBeAdded]);
    }

    function dismissCard(id) {
        setDismissedCards(prevDismissedCards => [...prevDismissedCards, id]);
        toBeDismissed.current = true;
    }

    // Setting up event listeners
    useEffect(() => {
        if (!firstRun.current) {
            return;
        }
        TranslationCardEmitter.subscribe("OPR:new_translation_card", addNewCards);
        TranslationCardEmitter.subscribe("OPR:dismiss_translation_card", dismissCard);

        firstRun.current = false;
    }, []);

    // Fade in animation
    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 50);
    });

    useEffect(() => {
        if (toBeDismissed.current) {
            setCards(prevCards => prevCards.filter(card => !dismissedCards.includes(card.id)));
            toBeDismissed.current = false;
        }
    }, [dismissedCards]);

    return (
        <div className={` flex-col h-screen w-[20vw] overflow-hidden duration-300 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"} p-2 *:m-5`} style={{backgroundColor: "rgba(255, 0, 0, 0.19)"}}>
            <TranslationCard id={"Test"} translationText={"Stay"} originalText={"Stay"} confidence={"100%"} stay={true} />
            {cards.map(card => (console.log(`Rendering ${card.translationText}`), (<TranslationCard {...card} />)))}
            <TranslationCard id={"Test"} translationText={"Last"} originalText={"Last"} confidence={"100%"} stay={true} />
        </div>
    );
}

export default TranslationCardRack;
