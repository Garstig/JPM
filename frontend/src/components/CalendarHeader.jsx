import React from "react";

const CalendarHeader = ({ year, month, onMonthChange }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button 
          className="btn btn-outline-primary" 
          onClick={() => {
            const newMonth = month === 1 ? 12 : month - 1;
            const newYear = month === 1 ? year - 1 : year;
            onMonthChange(newYear, newMonth);
          }}
        >&lt;</button>
        <div className="d-flex align-items-center">
          <h3 className="mb-0 me-3">{year}</h3>
          <select 
            className="form-select" 
            value={month}
            onChange={(e) => onMonthChange(year, parseInt(e.target.value, 10))}
            style={{ width: "auto" }}
          >
            {months.map((monthName, index) => (
              <option key={index + 1} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => {
            const newMonth = month === 12 ? 1 : month + 1;
            const newYear = month === 12 ? year + 1 : year;
            onMonthChange(newYear, newMonth);
          }}
        >&gt;</button>
      </div>
      <div className="row text-center bg-light fw-bold">
        {["MO", "DI", "MI", "DO", "FR", "SA", "SO"].map((day) => (
          <div className="col border text-black" key={day}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;