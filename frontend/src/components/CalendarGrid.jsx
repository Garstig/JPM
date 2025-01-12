import React from "react";
import Day from "./Day";

const CalendarGrid = ({ year, month, time_logs, onAddTimeLog }) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const firstDayMonday = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const generateCalendar = () => {
    const calendar = [];
    let day = 1;
    let totalDays = firstDayMonday + daysInMonth;
    let weeks = Math.ceil(totalDays / 7);

    for (let week = 0; week < weeks; week++) {
      const weekRow = [];
      for (let i = 0; i < 7; i++) {
        if (week === 0 && i < firstDayMonday) {
          weekRow.push(<Day key={`empty-${week}-${i}`} />);
        } else if (day <= daysInMonth) {
          const dayTimeLogs = time_logs.filter(
            (appt) => new Date(appt.date).getDate() === day
          );
          console.log(dayTimeLogs);
          weekRow.push(
            <Day
              key={day}
              day={day}
              time_logs={dayTimeLogs}
              onAdd={(specificDay) => {
                const selectedDate = `${year}-${month.toString().padStart(2, "0")}-${specificDay.toString().padStart(2, "0")}`;
                onAddTimeLog(selectedDate);
              }}
            />
          );
          day++;
        } else {
          weekRow.push(<Day key={`empty-${week}-${i}`} />);
        }
      }
      calendar.push(
        <div className="row" key={`week-${week}`}>
          {weekRow}
        </div>
      );
    }
    return calendar;
  };

  return <>{generateCalendar()}</>;
};

export default CalendarGrid;