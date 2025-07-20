import React, { useState, useEffect, useCallback, useRef } from "react";
import Emitter from "../emitters/Emitter";
import GetRandomID from "../utilities/RandomID";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { getColors } from "../utilities/Colors.js";
import Card from "./Card";

function CardRack() {
  const [cards, setCards] = useState([]);
  const [configData, setConfigData] = useState({});
  const firstRun = useRef(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css?family=Orbitron";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  //loads the config and sets the colors
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    async function loadConfig() {
      const jsonData = await window.mainAPI.readjson(
        "OPRScreenHUD_Config.json"
      );
      setConfigData(jsonData);
      if (!jsonData.status) {
        console.log(
          `Failed to read config.json. Status: ${jsonData.status}. Error: ${jsonData.error}`
        );
        return;
      } else {
        const colors = getColors(
          jsonData.data.baseColor,
          jsonData.data.accentColor
        );

        document.documentElement.style.setProperty(
          "--baseColor",
          `rgb(${colors.baseColor})`
        );
        document.documentElement.style.setProperty(
          "--lighterBaseColor",
          `rgb(${colors.lighterBaseColor})`
        );
        document.documentElement.style.setProperty(
          "--darkerBaseColor",
          `rgb(${colors.darkerBaseColor})`
        );
        document.documentElement.style.setProperty(
          "--baseButtonColor",
          `rgb(${colors.baseButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--hoverBaseButtonColor",
          `rgb(${colors.hoverBaseButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--clickBaseButtonColor",
          `rgb(${colors.clickBaseButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--baseThemedButtonColor",
          `rgb(${colors.baseThemedButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--hoverBaseThemedButtonColor",
          `rgb(${colors.hoverBaseThemedButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--clickBaseThemedButtonColor",
          `rgb(${colors.clickBaseThemedButtonColor})`
        );

        document.documentElement.style.setProperty(
          "--accentColor",
          `rgb(${colors.accentColor})`
        );
        document.documentElement.style.setProperty(
          "--lighterAccentColor",
          `rgb(${colors.lighterAccentColor})`
        );
        document.documentElement.style.setProperty(
          "--darkerAccentColor",
          `rgb(${colors.darkerAccentColor})`
        );
        document.documentElement.style.setProperty(
          "--accentButtonColor",
          `rgb(${colors.accentButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--hoverAccentButtonColor",
          `rgb(${colors.hoverAccentButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--clickAccentButtonColor",
          `rgb(${colors.clickAccentButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--accentThemedButtonColor",
          `rgb(${colors.accentThemedButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--hoverAccentThemedButtonColor",
          `rgb(${colors.hoverAccentThemedButtonColor})`
        );
        document.documentElement.style.setProperty(
          "--clickAccentThemedButtonColor",
          `rgb(${colors.clickAccentThemedButtonColor})`
        );
      }
    }
    loadConfig();
  }, [firstRun.current]);

  const addNewCards = useCallback(
    (newCards) => {
      const cardsArray = Array.isArray(newCards) ? newCards : [newCards];
      const updatedCards = cardsArray.map((card) => ({
        id: GetRandomID(),
        content: card,
      }));
      setCards((prevCards) => [...prevCards, ...updatedCards]);
    },
    [setCards]
  );

  const dismissCard = useCallback((id) => {
    console.log(`Dismissing card ${id}`);
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  }, []);

  // Subscribes the events
  useEffect(() => {
    Emitter.subscribe("OPR:new_card", addNewCards);
    Emitter.subscribe("OPR:dismiss_card", dismissCard);
  }, [addNewCards, dismissCard]);

  return (
    <div
      className={`font-[Orbitron] flex flex-col h-screen w-[20vw] overflow-hidden duration-300 ease-in-out p-2 *:m-5 `}
    >
      <TransitionGroup component={null}>
        {cards.map((card) => (
          <CSSTransition
            key={card.id}
            timeout={500}
            classNames={"card-transition"}
          >
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
