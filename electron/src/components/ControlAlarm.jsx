import { useState, useEffect } from "react";

const TIMESTYLE = "en-US";
// const TIMESTYLE = "en-GB";

const ControlAlarm = (props) => {
  const [tooLong, setTooLong] = useState(false);

  // TODO: Set an alarm object
  const alarmTime = "12:00 PM";
  const alarmText = "Pick up the cake at the bakery";

  useEffect(() => {
    alarmText.length > 12 ? setTooLong(true) : setTooLong(false);
  }, []);

  return (
    <div className={`${props.class}`}>
      <div
        className="text-[2vw] p-5 my-2 rounded-2xl gap-x-6 flex flex-row justify-between items-center"
        style={{ backgroundColor: "rgb(200, 0, 0)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-[5vw] h-[5vw]"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
            clipRule="evenodd"
          />
        </svg>{" "}
        <h1 className="leading-none">
          {alarmTime.split(" ")[0]}
          <span>{alarmTime.split(" ")[1]}</span>
        </h1>
        <div className="w-[50vw] h-fit items-center overflow-hidden">
          <h1
            className={`leading-none scrollbar-hide ${
              tooLong ? "scroll-marquee" : ""
            } `}
          >
            {alarmText}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ControlAlarm;
