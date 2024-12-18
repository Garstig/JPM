import React from "react";

const CalendarHeader = ({ year, month }) => {
  return (
    <>
      <h3 className="text-center">{`Calendar for ${year}, Month ${month}`}</h3>
      <div className="row text-center bg-light fw-bold">
        {["MO", "DI", "MI", "DO", "FR", "SA", "SO"].map((day) => (
          <div className="col border" key={day}>
            {day}
          </div>
        ))}
      </div>
    </>
  );
};

export default CalendarHeader;