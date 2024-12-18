import React from "react";

const Day = ({ day, appointments = [], onAdd }) => {
  return (
    <div className="col border p-2" style={{ height: "120px", position: "relative" }}>
      {day && (
        <>
          <div className="fw-bold">{day}</div>
          <button
            className="btn btn-sm btn-outline-primary position-absolute top-0 start-0"
            onClick={() => onAdd(day)}
            style={{ fontSize: "0.8rem", margin: "2px" }}
          >
            +
          </button>
        </>
      )}
      {appointments.map((appt, idx) => (
        <div key={idx} className="badge bg-success mb-1">
          {appt.name}
        </div>
      ))}
    </div>
  );
};

export default Day;