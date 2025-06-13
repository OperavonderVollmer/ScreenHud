import React from "react";

import { useState, useEffect } from "react";

function ControlAlarmNew(props) {
  const [hrMax, setHrMax] = useState(23);
  const [wasTimeFormat, setWasTimeFormat] = useState("");
  const [timeFormat, setTimeFormat] = useState("");
  const [hr, setHr] = useState(0);
  const [min, setMin] = useState(0);
  const [showWeek, setShowWeek] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [showDay, setShowDay] = useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [months, setMonths] = useState([]);
  const [days, setDays] = useState([]);
  const [year, setYear] = useState(null);

  async function loadConfig() {
    const jsonData = await window.controlAPI.readjson(
      "OPRScreenHUD_Config.json"
    );
    if (!jsonData.status) {
      console.log(
        `Failed to read config.json. Status: ${jsonData.status}. Error: ${jsonData.error}`
      );
      return;
    } else {
      setTimeFormat(jsonData.data.timeFormat);
    }
  }

  useEffect(() => {
    loadConfig();
  }, []);

  function updateTimeFormat(e) {
    setWasTimeFormat(timeFormat);
    setTimeFormat(e.target.value);
  }

  useEffect(() => {
    if (timeFormat === "24") {
      if (wasTimeFormat === "PM") {
        setHr(parseInt(hr) + 12);
      }
      setHrMax(23);
    } else {
      if (hr > 12) {
        setHr(hr - 12);
      }
      setHrMax(12);
    }
  }, [timeFormat]);

  async function newAlarm() {
    window.controlAPI.newAlarm();
  }

  function repeatButton(e) {
    const btn = e.target;
    const isSelected = btn.classList.contains("selected");

    if (isSelected) {
      btn.classList.remove("selected");
      switch (btn.name) {
        case "week":
          setShowWeek(false);
          break;
        case "month":
          setShowMonth(false);
          break;
        case "day":
          setShowDay(false);
          break;
      }
    } else {
      btn.classList.add("selected");
      switch (btn.name) {
        case "week":
          setShowWeek(true);
          break;
        case "month":
          setShowMonth(true);
          break;
        case "day":
          setShowDay(true);
          break;
      }
    }
  }

  function weeklyButton(e) {
    const btn = e.target;
    const day = parseInt(btn.name);
    const isSelected = btn.classList.contains("selected");

    if (isSelected) {
      btn.classList.remove("selected");
      setWeekdays((prev) => prev.filter((d) => d !== day));
    } else {
      btn.classList.add("selected");
      setWeekdays((prev) => [...prev, day]);
    }
  }

  function monthlyButton(e) {
    const btn = e.target;
    const month = parseInt(btn.name);
    const isSelected = btn.classList.contains("selected");

    if (isSelected) {
      btn.classList.remove("selected");
      setMonths((prev) => prev.filter((m) => m !== month));
    } else {
      btn.classList.add("selected");
      setMonths((prev) => [...prev, month]);
    }
  }

  function dayButton(e) {
    const btn = e.target;
    const day = parseInt(btn.name);
    const isSelected = btn.classList.contains("selected");

    if (isSelected) {
      btn.classList.remove("selected");
      setDays((prev) => prev.filter((d) => d !== day));
    } else {
      btn.classList.add("selected");
      setDays((prev) => [...prev, day]);
    }
  }

  useEffect(() => {
    console.log(
      `Weekdays: ${weekdays}, Months: ${months}, Day: ${days}, Year: ${year}`
    );
  }, [weekdays, months, days, year]);

  if (props.class) {
    c += " " + props.class;
  }

  return (
    <div className={`${props.class} p-1.5 OPRControlAlarmNew `}>
      <h1 className="text-2xl p-2 pb-5">New Alarm</h1>
      <div className="alarm-time flex flex-row">
        <input
          type="number"
          min={timeFormat === "24" ? "0" : "1"}
          max={hrMax}
          name="hr"
          id="hr"
          pattern="\d*"
          value={hr}
          maxLength={2}
          placeholder="10"
          onFocus={(e) => e.target.select()}
          onInput={(e) => {
            if (e.target.value.length > 2) {
              e.target.value = e.target.value.slice(0, 2);
            }
            if (e.target.value > hrMax) {
              e.target.value = hrMax;
            }
            setHr(e.target.value);
          }}
          onWheel={(e) => e.target.blur()}
          onBlur={(e) => {
            const padded = e.target.value.padStart(2, "0");
            setHr(padded);
          }}
        />
        {" : "}
        <input
          type="number"
          min="0"
          max="59"
          name="hr"
          id="hr"
          placeholder="10"
          onFocus={(e) => e.target.select()}
          value={min}
          onInput={(e) => {
            if (e.target.value.length > 2) {
              e.target.value = e.target.value.slice(0, 2);
            }
            setMin(e.target.value);
          }}
          pattern="\d*"
          maxLength={2}
          onWheel={(e) => e.target.blur()}
          onBlur={(e) => {
            const padded = e.target.value.padStart(2, "0");
            setMin(padded);
          }}
        />
        <select
          name="ampmmil"
          id="ampmmil"
          value={timeFormat}
          onChange={(e) => updateTimeFormat(e)}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
          <option value="24">24</option>
        </select>
      </div>
      {/* <label> old time format
        Time:
        <select name="alarm-timehr" id="alarm-timehr">
          {[...Array(hrMax)].map((e, index) =>
            hrMax === 24 ? (
              <option key={index}>{index}</option>
            ) : (
              <option key={index + 1}>{index + 1}</option>
            )
          )}
        </select>
        <span>{"hr"}</span>
        <select name="alarm-timemin" id="alarm-timemin">
          {[...Array(59)].map((e, index) => (
            <option key={index + 1}>{index + 1}</option>
          ))}
        </select>
        <span>{"min"}</span>
        <div>
          {hrMax === 24 ? (
            ""
          ) : (
            <select name="alarm-timeampm" id="alarm-timeampm" defaultValue="AM">
              <option>AM</option>
              <option>PM</option>
            </select>
          )}
          <select
            name="alarm-timeformat"
            id="alarm-timeformat"
            value={timeFormat}
            onChange={(e) => setTimeFormat(e.target.value)}
          >
            <option>24</option>
            <option>12</option>
          </select>
        </div>
      </label> */}
      <label htmlFor="alarm-title">
        Title:{" "}
        <input
          type="text"
          name="alarm-title"
          id="alarm-title"
          placeholder="Title"
        />
      </label>
      <label htmlFor="alarm-subtitle">
        Sub-Title:
        <input
          type="text"
          name="alarm-subtitle"
          id="alarm-subtitle"
          placeholder="Subtitle (Optional)"
        />
      </label>
      <label htmlFor="alarm-description">
        Description:
        <input
          type="text"
          name="alarm-description"
          id="alarm-description"
          placeholder="Description (Optional)"
        />
      </label>
      <label htmlFor="alarm-subdescription">
        Sub-Description:
        <input
          type="text"
          name="alarm-subdescription"
          id="alarm-subdescription"
          placeholder="Subdescription (Optional)"
        />
      </label>
      <h1 className="text-2xl p-2 pb-5">Repeat Every</h1>
      <div className="mb-5">
        <button className="OPRToggleButtons" name="week" onClick={repeatButton}>
          Weekly
        </button>
        <button
          className="OPRToggleButtons"
          name="month"
          onClick={repeatButton}
        >
          Monthly
        </button>
        <button className="OPRToggleButtons" name="day" onClick={repeatButton}>
          Day
        </button>
      </div>
      <label
        htmlFor="alarm-repeat-week"
        className="items-stretch flex flex-col flex-start flex-grow max-w-full w-full gap-2"
        style={{ display: showWeek ? "flex" : "none", alignItems: "stretch" }}
      >
        Weekly
        <div className="OPRStretch flex flex-row w-full">
          <button name="7" className="OPRToggleButtons" onClick={weeklyButton}>
            Su
          </button>
          <button name="1" className="OPRToggleButtons" onClick={weeklyButton}>
            M
          </button>
          <button name="2" className="OPRToggleButtons" onClick={weeklyButton}>
            T
          </button>
          <button name="3" className="OPRToggleButtons" onClick={weeklyButton}>
            W
          </button>
          <button name="4" className="OPRToggleButtons" onClick={weeklyButton}>
            Th
          </button>
          <button name="5" className="OPRToggleButtons" onClick={weeklyButton}>
            F
          </button>
          <button name="6" className="OPRToggleButtons" onClick={weeklyButton}>
            Sa
          </button>
        </div>
      </label>
      <label
        htmlFor="alarm-repeat-month"
        className="items-stretch flex flex-col flex-start flex-grow max-w-full w-full gap-2"
        style={{ display: showMonth ? "flex" : "none", alignItems: "stretch" }}
      >
        Monthly
        <div className="OPRStretch flex flex-col flex-1 box-border max-w-full items-stretch gap-2">
          <div className="flex flex-row w-full">
            <button
              name="1"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Jan
            </button>
            <button
              name="2"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Feb
            </button>
            <button
              name="3"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Mar
            </button>
            <button
              name="4"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Apr
            </button>
            <button
              name="5"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              May
            </button>
            <button
              name="6"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Jun
            </button>
          </div>
          <div className="flex flex-row w-full">
            <button
              name="7"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Jul
            </button>
            <button
              name="8"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Aug
            </button>
            <button
              name="9"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Sep
            </button>
            <button
              name="10"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Oct
            </button>
            <button
              name="11"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Nov
            </button>
            <button
              name="12"
              className="OPRToggleButtons months"
              onClick={monthlyButton}
            >
              Dec
            </button>
          </div>
        </div>
      </label>
      <label
        htmlFor="alarm-repeat-day"
        className="items-stretch flex flex-col flex-start flex-grow max-w-full w-full gap-2"
        style={{ display: showDay ? "flex" : "none", alignItems: "stretch" }}
      >
        Day
        <div className="OPRStretch flex flex-col flex-grow max-w-full w-full items-stretch gap-2">
          <div
            className="grid grid-cols-7 gap-2 OPRCalendar"
            style={{ display: "grid" }}
          >
            {[...Array(31)].map((_, i) => (
              <button
                key={i}
                name={i + 1}
                className="OPRToggleButtons"
                onClick={dayButton}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </label>
    </div>
  );
}

export default ControlAlarmNew;
