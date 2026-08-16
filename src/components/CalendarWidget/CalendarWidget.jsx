import { useState } from "react";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";
import "./CalendarWidget.css";

const CalendarWidget = () => {
  const [value, setValue] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <div>
          <h2 className="calendar-title">Calendar</h2>

          <p className="calendar-subtitle">Schedule & Important Dates</p>
        </div>

        <button
          className="calendar-btn"
          onClick={() => {
            const today = new Date();
            setValue(today);
            setActiveStartDate(today);
          }}
        >
          Today
        </button>
      </div>

      <Calendar
        value={value}
        onChange={setValue}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
      />
    </div>
  );
};

export default CalendarWidget;
