import React, { useEffect, useRef, useState } from "react";

const Card = ({ id, onFadeComplete, content }) => {
  const fadeTime = 100;

  const [mouseIn, setMouseIn] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const onFadeCompleteRef = useRef(onFadeComplete);

  useEffect(() => {
    onFadeCompleteRef.current = onFadeComplete;
  }, [onFadeComplete]);

  function handleMouseEnter() {
    console.log(`Mouse entered card ${id}`);
    setMouseIn(true);
  }

  function handleMouseExit() {
    if (mouseIn && !fadingOut) {
      console.log(`Mouse exited card ${id}, fading`);
      setFadingOut(true);
      setTimeout(() => {
        onFadeCompleteRef.current();
      }, fadeTime);
    }
  }

  return (
    // <div className={`card`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <div
      className={`card`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseExit}
    >
      {Object.entries(content).map(([key, value]) => (
        <h4 key={key}>
          {key}: <span>{value}</span>
        </h4>
      ))}
      <p>Hover and move mouse away to dismiss.</p>
    </div>
  );
};

export default Card;
