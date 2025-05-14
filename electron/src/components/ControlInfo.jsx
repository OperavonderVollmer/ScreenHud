import React from "react";

const ControlInfo = (props) => {
  const infoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[5vw] h-[5vw]"
    >
      {props.infoIcon}
    </svg>
  );
  const infoText = props.infoText;

  return (
    <div
      className={`OPRControlInfo darkerAccentColor text-black text-[2vw] ${props.class}`}
    >
      <div className="flex flex-row rounded-2xl ">
        <div className="w-fit px-4 flex items-center text-center justify-center">
          {infoIcon}
        </div>
        <div className="w-full p-4">{infoText}</div>
      </div>
    </div>
  );
};

export default ControlInfo;
