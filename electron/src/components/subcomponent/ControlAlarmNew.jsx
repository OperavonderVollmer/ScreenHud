import React from "react";

import { useState, useEffect } from "react";

function ControlAlarmNew(props) {
  const [hrMax, setHrMax] = useState(23);
  const [wasTimeFormat, setWasTimeFormat] = useState("");
  const [timeFormat, setTimeFormat] = useState("");
  const [hr, setHr] = useState(timeFormat === "24" ? "00" : "01");
  const [min, setMin] = useState("00");
  const [showWeek, setShowWeek] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [showDay, setShowDay] = useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [months, setMonths] = useState([]);
  const [days, setDays] = useState([]);
  const [daily, setDaily] = useState(false);
  const [year, setYear] = useState(null);
  const [operation, setOperation] = useState("oneoff");
  const [oneoffOp, setOneoffOp] = useState("asap");

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

  async function submitAlarm() {
    // title: str
    // subtitle: str = "No subtitle"
    // description: str = "No description"
    // subdescription: str = "No subdescription"
    // creation: datetime.date
    // trigger: datetime.time
    // reoccurence_type: ReoccurenceType
    // weekdays: Optional[list[int]] = None
    // months: Optional[list[int]] = None
    // day: Optional[list[int]] = None               # 1-31
    // year: Optional[int] = None              # NOTE: ONLY USED FOR ONE-OFF ALARMS
    const p_title = document.getElementById("alarm-title").value;
    const p_subtitle = document.getElementById("alarm-subtitle").value;
    const p_description = document.getElementById("alarm-description").value;
    const p_subdescription = document.getElementById(
      "alarm-subdescription"
    ).value;
    const today_date = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const p_creation = `${today_date.getFullYear()}-${pad(
      today_date.getMonth() + 1
    )}-${pad(today_date.getDate())}`;
    const p_trigger = `${pad(hr)}:${pad(min)}:00`;
    let p_reoccurence_type = "";
    let p_weekdays = [];
    let p_months = [];
    let p_days = [];
    let p_year = null;

    if (operation === "oneoff") {
      p_reoccurence_type = "NONE";
      if (oneoffOp === "asap") {
        p_year = today_date.getFullYear();
      } else if (oneoffOp === "scheduled") {
        const dateString = document.getElementById("alarm-oneoff-date").value; // "2025-07-13"

        if (dateString) {
          const [year, month, day] = dateString.split("-").map(Number);
          p_year = year;
          p_month = month;
          p_days = day;
        } else {
          // Handle the case where no date is selected
          console.warn("No date selected for scheduled one-off alarm.");
        }
      }
    } else if (operation === "repeating") {
      if (showWeek && !showMonth) {
        p_reoccurence_type = "WEEKLY";
        p_weekdays = weekdays;
      } else if (showMonth) {
        p_reoccurence_type = "PERIODIC";
        p_months = months;
        p_days = days;
      } else if (daily) {
        p_reoccurence_type = "DAILY";
        p_days = days;
      }
    }

    console.log(
      `Alarm Details
      Title: ${p_title},
      Subtitle: ${p_subtitle},
      Description: ${p_description},
      Subdescription: ${p_subdescription},
      Creation: ${p_creation},
      Trigger: ${p_trigger},
      Reoccurence Type: ${p_reoccurence_type},
      Weekdays: ${p_weekdays},
      Months: ${p_months},
      Days: ${p_days},
      Year: ${p_year}`
    );

    window.controlAPI
      .newAlarm({
        title: p_title,
        subtitle: p_subtitle,
        description: p_description,
        subdescription: p_subdescription,
        creation: p_creation,
        trigger: p_trigger,
        reoccurence_type: p_reoccurence_type,
        weekdays: p_weekdays,
        months: p_months,
        days: p_days,
        year: p_year,
      })
      .then((res) => {
        console.log(res);
        if (res.status_code == 200) {
          // control API > response to main js > create a toast at the other window
          // console.log(`Alarm "${p_title}" created successfully!`);
          window.controlAPI.newCard({
            source: "New alarm",
            message: `Alarm "${p_title}" created successfully!`,
          });
        }
      })
      .catch((err) => console.error(err));
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
          onBlur={(e) => {
            let padded = e.target.value.padStart(2, "0");
            if (padded > hrMax) {
              padded = hrMax;
            }
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
          onBlur={(e) => {
            let padded = e.target.value.padStart(2, "0");
            if (padded > 59) {
              padded = 59;
            }
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
      <div className="pb-5 pt-5">
        <button
          name="oneoff"
          className={`OPRToggleButtons ${
            operation === "oneoff" ? "selected" : ""
          }`}
          onClick={(e) => {
            setOperation(e.target.name);
          }}
          style={{ margin: 0 }}
        >
          One-Off
        </button>
        <button
          name="repeating"
          className={`OPRToggleButtons ${
            operation === "repeating" ? "selected" : ""
          }`}
          onClick={(e) => {
            setOperation(e.target.name);
          }}
          style={{ margin: 0 }}
        >
          Repeating
        </button>
      </div>
      <div // For One-Off alarms
        className="flex flex-col w-full"
        style={{
          alignItems: "stretch",
          display: operation === "oneoff" ? "flex" : "none",
        }}
      >
        <h1 className="text-2xl p-2 pb-5">One Off</h1>
        <div className="mb-5">
          <button
            className={`OPRToggleButtons ${
              oneoffOp === "asap" ? "selected" : ""
            }`}
            name="asap"
            onClick={(e) => setOneoffOp(e.target.name)}
            disabled={showDay}
          >
            ASAP
          </button>
          <button
            className={`OPRToggleButtons ${
              oneoffOp === "scheduled" ? "selected" : ""
            }`}
            name="scheduled"
            onClick={(e) => setOneoffOp(e.target.name)}
          >
            Scheduled
          </button>
        </div>
        <label
          className="items-stretch flex flex-col flex-start flex-grow max-w-full w-full gap-2"
          style={{
            display: oneoffOp === "scheduled" ? "flex" : "none",
            alignItems: "stretch",
          }}
        >
          Scheduled
          <div className="OPRStretch flex flex-row w-full items-stretch justify-center">
            {/* Day:
            <input type="text" />
            Month:
            <input type="text" />
            Year:
            <input type="text" /> */}
            <input
              className="OPRScheduled"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              id="alarm-oneoff-date"
            />
          </div>
        </label>
      </div>
      <div // For Repeating alarms
        className="flex flex-col w-full"
        style={{
          alignItems: "stretch",
          display: operation === "repeating" ? "flex" : "none",
        }}
      >
        <h1 className="text-2xl p-2 pb-5">Repeat Every</h1>
        <div className="mb-5">
          <button
            className="OPRToggleButtons"
            name="week"
            onClick={repeatButton}
            disabled={showDay}
          >
            Weekly
          </button>
          <button
            className="OPRToggleButtons"
            name="month"
            onClick={repeatButton}
          >
            Monthly
          </button>
          <button
            className="OPRToggleButtons"
            name="day"
            onClick={repeatButton}
            disabled={showWeek}
          >
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
            <button
              name="7"
              className="OPRToggleButtons"
              onClick={weeklyButton}
            >
              Su
            </button>
            <button
              name="1"
              className="OPRToggleButtons"
              onClick={weeklyButton}
            >
              M
            </button>
            <button
              name="2"
              className="OPRToggleButtons"
              onClick={weeklyButton}
            >
              T
            </button>
            <button
              name="3"
              className="OPRToggleButtons"
              onClick={weeklyButton}
            >
              W
            </button>
            <button
              name="4"
              className="OPRToggleButtons"
              onClick={weeklyButton}
            >
              Th
            </button>
            <button
              name="5"
              className="OPRToggleButtons"
              onClick={weeklyButton}
            >
              F
            </button>
            <button
              name="6"
              className="OPRToggleButtons"
              onClick={weeklyButton}
            >
              Sa
            </button>
          </div>
        </label>
        <label
          htmlFor="alarm-repeat-month"
          className="items-stretch flex flex-col flex-start flex-grow max-w-full w-full gap-2"
          style={{
            display: showMonth ? "flex" : "none",
            alignItems: "stretch",
          }}
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
          <div className="flex flex-row w-full gap-3.5">
            Day
            <button
              className="OPRToggleButtons"
              onClick={(e) => {
                setDaily(!daily);
                e.target.classList.toggle("selected");
              }}
            >
              Daily
            </button>
          </div>

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

      <div className="flex flex-row-reverse items-stretch flex-grow p-7 gap-5">
        <button className="OPRButtonAccent OPRSubmitButton">Cancel</button>
        <button
          className="OPRButtonAccent OPRSubmitButton"
          onClick={() => submitAlarm()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ControlAlarmNew;
