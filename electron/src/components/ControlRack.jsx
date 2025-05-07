import {useEffect, useState} from "react";
import Control from "./Control.jsx";
import * as anime from "animejs";
import WeatherIcons from "../utilities/WeatherIcons.jsx";
import ControlBG from "./ControlBG.jsx";

const CONTROLHOVEROPENTIME = 250;
// const TIMESTYLE = "en-GB";
const TIMESTYLE = "en-US";

export const ControlRack = () => {
    const [hovered, setHovered] = useState(false);
    const [windowSize, setWindowSize] = useState({width: 0, height: 0});
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weather, setWeather] = useState("rainy");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
        // No dependencies: we don't want to re-create the interval every time date change
    }, []);

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

    useEffect(() => {
        const timeline = anime.createTimeline({
            defaults: {
                easing: "easeInOutQuad",
                duration: CONTROLHOVEROPENTIME,
            },
        });

        timeline.add(".OPRcontrol", {
            opacity: hovered ? 1 : 0,
            translateX: hovered ? 0 : -200,
            // delay: anime.stagger(50),
        });

        if (hovered) {
            // console.log("Hovered");
            // window.controlAPI.move(-10, -10);
        } else {
            // console.log("Not hovered");
            setTimeout(() => {
                // window.controlAPI.move(windowSize.width * -1 + 15, windowSize.height * -1 + 15);
            }, CONTROLHOVEROPENTIME);
        }
    }, [hovered, windowSize]);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex flex-col w-screen h-screen overflow-hidden OPRControlRack text-white font-[Orbitron]"
            style={{backgroundColor: "rgba(255, 0, 0, .2)"}}
        >
            <ControlBG class="OPRcontrol h-[100vh] w-[100vw] absolute" view={`0 0 ${windowSize.width} ${windowSize.height}`} style={{zIndex: -1}} />
            <Control class={`OPRcontrol h-[70vh] w-[70vw] mx-[10vw] my-[5vh] rounded-2xl bg-black`} skew={-5}>
                <h1>
                    {TIMESTYLE === "en-GB" ? currentTime.toLocaleTimeString(TIMESTYLE, {hour: "2-digit"}) : currentTime.toLocaleTimeString(TIMESTYLE, {hour: "2-digit", hour12: true}).split(" ")[0]}
                </h1>

                <h1>{TIMESTYLE === "en-GB" ? currentTime.toLocaleTimeString(TIMESTYLE, {minute: "2-digit"}) : currentTime.toLocaleTimeString(TIMESTYLE, {minute: "2-digit", hour12: true})}</h1>

                {TIMESTYLE === "en-US" ? <h1>{currentTime.toLocaleTimeString(TIMESTYLE, {hour: "2-digit", hour12: true}).split(" ")[1]}</h1> : ""}

                <h1>{currentTime.toLocaleDateString(TIMESTYLE)}</h1>
                <h1>{currentTime.toLocaleDateString(TIMESTYLE, {weekday: "short"})}</h1>

                <WeatherIcons weather={weather} strokeColor="white" />
            </Control>

            <div className="flex flex-row">
                <Control class={`OPRcontrol cursor-pointer h-[10vh] w-[10vw] mx-[10vw] rounded-sm hover:scale-110 ease-in-out duration-100 bg-black text-white`} skew={-5}>
                    <h1>Hello</h1>
                </Control>
                <Control class={`OPRcontrol cursor-pointer h-[10vh] w-[10vw] mx-[10vw] rounded-sm hover:scale-110 ease-in-out duration-100 bg-black text-white`} skew={-5}>
                    <h1>Hello</h1>
                </Control>
                <Control class={`OPRcontrol cursor-pointer h-[10vh] w-[10vw] mx-[10vw] rounded-sm hover:scale-110 ease-in-out duration-100 bg-black text-white`} skew={-5}>
                    <h1>Hello</h1>
                </Control>
            </div>
        </div>
    );
};

export default ControlRack;
