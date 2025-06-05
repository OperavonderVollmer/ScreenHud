import WeatherIcons from "../utilities/WeatherIcons.jsx";
import toPascalCase from "../utilities/ToPascalCase.js";
import { useEffect, useRef, useState } from "react";

const TIMESTYLE = "en-US";
// const TIMESTYLE = "en-GB";

const ControlWatch = (props) => {
  if (props.forecasts.length === 0) return <div></div>;
  const [next, setNext] = useState(props.forecasts[0]);
  const [weather, setWeather] = useState("cloudy");
  const [nextForecast, setNextForecast] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const forecastProvider = useRef("Weather report powered by wttr.in");

  const currentTime =
    props.currentTime instanceof Date
      ? props.currentTime
      : new Date(props.currentTime);

  const forecasts = props.forecasts;
  const nextForecastTimeHours = Math.floor(
    props.nextForecastTime / 1000 / 60 / 60
  );

  useEffect(() => {
    if (forecasts.length === 0) return;

    const hour0 = parseInt(forecasts[0]?.timeGB?.split(":")[0], 10);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    setNext(hour0 > currentMinutes ? forecasts[0] : forecasts[1]);

    if (next) console.log(next.chances);
  }, [forecasts]);

  useEffect(() => {
    setNextForecast(
      `${next?.forecast} within ${
        typeof nextForecastTimeHours === "number"
          ? nextForecastTimeHours <= 1
            ? "the hour"
            : `${nextForecastTimeHours} hrs`
          : "?"
      }`
    );

    setWeather(next?.forecast);

    let warning = { w: ["none", 0] };
    console.log(next.chances);
    for (const [key, value] of Object.entries(next.chances)) {
      if (value >= warning.w[1]) {
        warning.w[0] = key;
        warning.w[1] = value;
      }
    }

    console.log(warning);
    setWarningMessage(
      warning.w[1] > 60 ? `${toPascalCase(warning.w[0])}: ${warning.w[1]}%` : ""
    );
  }, [next]);

  return (
    <div className={`${props.class} `}>
      <div className="p-5 OPRControl baseColor">
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
          <h1>{toPascalCase(weather)}</h1>
          <h1>
            {currentTime.toLocaleDateString(TIMESTYLE, {
              month: "short",
              day: "numeric",
              weekday: "short",
            })}{" "}
          </h1>
        </div>
        <div className="text-[3vw] flex flex-row justify-between items-center gap-x-5">
          <WeatherIcons weather={weather} strokeColor="white" />
          <h1>{`${next?.tempC}°c / ${next?.tempF}°f`}</h1>
        </div>
        <div className="flex flex-col justify-end items-end">
          <h1 className="text-[2vw]">
            <span className="text-[1.3vw]">{warningMessage}</span>{" "}
            {nextForecast}
          </h1>
          <h1 className="text-[1vw] text-[#aaa]">{forecastProvider.current}</h1>
        </div>
      </div>
    </div>
  );
};

export default ControlWatch;
