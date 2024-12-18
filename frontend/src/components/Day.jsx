import React from "react";
import DeleteAppointmentModal from "./DeleteAppointmentModal";

const Day = ({ day, appointments = [], onAdd, onDeleteAppointment }) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (appointmentId) => {
    onDeleteAppointment(appointmentId);
    setShowDeleteModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="col border p-2" style={{ minHeight: "120px", position: "relative" }}>
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
      <div className="d-flex flex-column" style={{ gap: "4px" }}>
        {appointments.map((appt, idx) => (
          <div key={idx} className="badge bg-success d-flex justify-content-between align-items-center">
            <span>{appt.name}</span>
            <button
              className="btn btn-sm btn-danger ms-2 p-0 px-1"
              onClick={() => handleDeleteClick(appt)}
              style={{ fontSize: "0.7rem" }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {showDeleteModal && (
        <DeleteAppointmentModal
          showModal={showDeleteModal}
          appointment={selectedAppointment}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default Day;