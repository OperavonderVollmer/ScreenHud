import { useEffect, useState, useRef } from "react";
import Control from "./Control.jsx";
import * as anime from "animejs";
import WeatherIcons from "../utilities/WeatherIcons.jsx";
import ControlBG from "./ControlBG.jsx";
import ControlWatch from "./ControlWatch.jsx";
import ControlAlarm from "./ControlAlarm.jsx";
import ControlInfo from "./ControlInfo.jsx";
import { hover } from "framer-motion";

import { getColors } from "../utilities/Colors.js";

const CONTROLHOVEROPENTIME = 200;
// const TIMESTYLE = "en-GB";
const TIMESTYLE = "en-US";

export const ControlRack = () => {
  const [hovered, setHovered] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [configData, setConfigData] = useState({});
  const [weather, setWeather] = useState("rainy");
  const firstRun = useRef(true);

  //loads the config and sets the colors
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    async function loadConfig() {
      const jsonData = await window.controlAPI.readjson(
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

  //sets the time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //sets the window size and the font
  useEffect(() => {
    async function fetchWindowSize() {
      const size = await window.controlAPI.invoke("get-window-size");
      setWindowSize(size);
    }
    fetchWindowSize();

    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css?family=Orbitron";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  //sets the anime timeline
  useEffect(() => {
    const timeline = anime.createTimeline({
      defaults: {
        easing: "easeInOutQuad",
        duration: CONTROLHOVEROPENTIME,
      },
    });

    timeline.add(".OPRControlRack", {
      opacity: hovered ? 1 : 0,
      translateX: hovered ? 0 : -200,
      // delay: anime.stagger(50),
    });

    if (hovered) {
      console.log("Hovered");
      window.controlAPI.move(-15, -10);
    } else {
      console.log("Not hovered");
      setTimeout(() => {
        if (!hovered) {
          window.controlAPI.move(
            windowSize.width * -1 + 5,
            windowSize.height * -1 + 5
          );
        }
      }, CONTROLHOVEROPENTIME);
    }
  }, [hovered, windowSize]);

  //Remove the question marks in OPRControlRack

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-row w-full h-screen text-white font-[Orbitron]"
    >
      <div className="OPRControlRack? OPRControlRackBG accentColor absolute w-screen h-screen" />
      <div className="OPRControlRack? flex flex-row w-screen overflow-hidden p-5  gap-x-5">
        <div className="flex flex-col h-screen">
          <ControlWatch
            class={"w-[45vw] pb-[5vh]"}
            currentTime={`${currentTime}`}
            weather={weather}
          />
          <ControlAlarm class={"w-[45vw]"} />
        </div>
        <div className="baseColor OPRControl flex flex-col overflow-auto scrollbar-hide ">
          <ControlInfo
            infoIcon={
              <>
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </>
            }
            infoText={"The quick brown fox jumps over the lazy dog"}
          />
          <ControlInfo
            infoIcon={
              <>
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </>
            }
            infoText={"The quick brown fox jumps over the lazy dog"}
          />
          <ControlInfo
            infoIcon={
              <>
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </>
            }
            infoText={"The quick brown fox jumps over the lazy dog"}
          />
          <ControlInfo
            infoIcon={
              <>
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </>
            }
            infoText={"The quick brown fox jumps over the lazy dog"}
          />
          <ControlInfo
            infoIcon={
              <>
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </>
            }
            infoText={"The quick brown fox jumps over the lazy dog"}
          />
          <ControlInfo
            infoIcon={
              <>
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </>
            }
            infoText={"The quick brown fox jumps over the lazy dog"}
          />
          <ControlInfo
            infoIcon={
              <>
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </>
            }
            infoText={"The quick brown fox jumps over the lazy dog"}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlRack;

// return (
//     <div
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//         className="flex flex-col w-screen h-screen overflow-hidden OPRControlRack text-white font-[Orbitron]"
//         style={{backgroundColor: "rgba(255, 0, 0, .2)"}}
//     >
//         <ControlBG class="OPRcontrol h-[100vh] w-[100vw] absolute" view={`0 0 ${windowSize.width} ${windowSize.height}`} style={{zIndex: -1}} />
//         <Control class={`OPRcontrol h-[70vh] w-[70vw] mx-[10vw] my-[5vh] rounded-2xl bg-black`} skew={-5}>
//             <h1>
//                 {TIMESTYLE === "en-GB" ? currentTime.toLocaleTimeString(TIMESTYLE, {hour: "2-digit"}) : currentTime.toLocaleTimeString(TIMESTYLE, {hour: "2-digit", hour12: true}).split(" ")[0]}
//             </h1>

//             <h1>{TIMESTYLE === "en-GB" ? currentTime.toLocaleTimeString(TIMESTYLE, {minute: "2-digit"}) : currentTime.toLocaleTimeString(TIMESTYLE, {minute: "2-digit", hour12: true})}</h1>

//             {TIMESTYLE === "en-US" ? <h1>{currentTime.toLocaleTimeString(TIMESTYLE, {hour: "2-digit", hour12: true}).split(" ")[1]}</h1> : ""}

//             <h1>{currentTime.toLocaleDateString(TIMESTYLE)}</h1>
//             <h1>{currentTime.toLocaleDateString(TIMESTYLE, {weekday: "short"})}</h1>

//             <WeatherIcons weather={weather} strokeColor="white" />
//         </Control>

//         {/* <div className="flex flex-row">
//             <Control class={`OPRcontrol cursor-pointer h-[10vh] w-[10vw] mx-[10vw] rounded-sm hover:scale-110 ease-in-out duration-100 bg-black text-white`} skew={-5}>
//                 <h1>Hello</h1>
//             </Control>
//             <Control class={`OPRcontrol cursor-pointer h-[10vh] w-[10vw] mx-[10vw] rounded-sm hover:scale-110 ease-in-out duration-100 bg-black text-white`} skew={-5}>
//                 <h1>Hello</h1>
//             </Control>
//             <Control class={`OPRcontrol cursor-pointer h-[10vh] w-[10vw] mx-[10vw] rounded-sm hover:scale-110 ease-in-out duration-100 bg-black text-white`} skew={-5}>
//                 <h1>Hello</h1>
//             </Control>
//         </div> */}
//     </div>
// );
