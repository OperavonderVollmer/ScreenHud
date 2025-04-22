import {useEffect, useRef} from "react";
// import TranslationCard from "./components/TranslationCard";
import _translationCardEmitter from "./emitters/TranslationCardEmitter";
import TranslationCardRack from "./components/TranslationCardRack";

function App() {
    const firstRun = useRef(true);

    useEffect(() => {
        if (!firstRun.current) {
            return;
        }

        const testList = [
            {translationText: "Hello World", originalText: "Hello World", confidence: "50"},
            {translationText: "Hello World", originalText: "Hello World", confidence: "50"},
        ];

        _translationCardEmitter.publishList("OPR:new_translation_card", testList);

        // testList.forEach(card => {
        //     TranslationCardEmitter.publish("OPR:new_translation_card", [card]);
        // });

        firstRun.current = false;
    });

    return (
        <div className="mainapp flex flex-row-reverse justify-between">
            <TranslationCardRack />
        </div>
    );
}

export default App;

/*

Notes:

This is probably only going to be used by myself, however it is still imperative that we create a understandable readme file, for practice in making documentation

As of right now, the box is working properly. Could use some refining for the appearance, but currently it is functional.

Things to work on:

    Small Things:
    ✖        -Implement the dismiss button from the translation card
    ✔        -Implement a way for the translation card to disappear after X amount of seconds
            -Improve the logo, it looks awful at the moment
            -Improve the color scheme
    ✖        -Fade in and out
    ✔        -Dismiss after waiting 5 seconds, resetting the timer while hovered
        

    Big Things:
        -Finally add listening for the sockets, should be able to accomodate multiple clients at once
        -Find a way to make a function that adds new translation cards based on socket events
        -When the application opens, make an animation!!
            -Install manga_animation, should be a npm package. Ask gemini | gpt for this
        -Also create a phone version of this app that is able to be used as a remote control for my machine
        -Add the ability to select which monitor to display on


Things to fix!:
    -When there's an error, it literally blocks everything. Find a way to prevent this, its getting annoying
    -Apply a logging system, and maybe make a module like I always do.


*/
