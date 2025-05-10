import React from "react";
import WeatherIcons from "../utilities/WeatherIcons.jsx";
import toPascalCase from "../utilities/ToPascalCase.js";
import { rgba } from "framer-motion";

const TIMESTYLE = "en-US";
// const TIMESTYLE = "en-GB";

const ControlWatch = (props) => {
  const currentTime =
    props.currentTime instanceof Date
      ? props.currentTime
      : new Date(props.currentTime);
  const nextForecast = "Rainy in 3 hr ";
  const forecastProvider = "Weather report powered by XXX";

  return (
    <div className={`${props.class}`}>
      <div
        className="p-5 rounded-2xl"
        style={{ backgroundColor: "rgb(200, 0, 0)" }}
      >
        <div
          className={`flex flex-row w-full m-0 p-0 items-end ${
            TIMESTYLE === "en-US" ? "justify-between" : "justify-end"
          }`}
        >
          {TIMESTYLE === "en-US" ? (
            <span className="text-[2.2vw] ">
              {
                currentTime
                  .toLocaleTimeString(TIMESTYLE, { hour12: true })
                  .split(" ")[1]
              }
            </span>
          ) : (
            ""
          )}
          <h1 className={`text-[9vw]`}>
            {TIMESTYLE === "en-US"
              ? currentTime
                  .toLocaleTimeString(TIMESTYLE, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .split(" ")[0]
              : currentTime.toLocaleTimeString(TIMESTYLE, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </h1>
        </div>
        <div className="text-[3vw] flex flex-row justify-between items-end gap-x-5">
          <h1>{toPascalCase(props.weather)}</h1>
          <h1>
            {currentTime.toLocaleDateString(TIMESTYLE, {
              month: "short",
              day: "numeric",
              weekday: "short",
            })}{" "}
          </h1>
        </div>
        <div className="text-[3vw] flex flex-row justify-between items-center gap-x-5">
          <WeatherIcons weather={props.weather} strokeColor="white" />
          <h1>{`48 c / 50 f`}</h1>
        </div>
        <div className="flex flex-col justify-end items-end">
          <h1 className="text-[2vw]">{nextForecast}</h1>
          <h1 className="text-[1.3vw]">{forecastProvider}</h1>
        </div>
      </div>
    </div>
  );
};

export default ControlWatch;
