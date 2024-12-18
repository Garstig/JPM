import React from "react";
import DeleteAppointmentModal from "./DeleteAppointmentModal";
import AppointmentView from "./AppointmentView";
import AppointmentPreview from "./AppointmentPreview";

const Day = ({ day, appointments = [], onAdd, onDeleteAppointment, onUpdateAppointment }) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);

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
      <div className="appointments-container" style={{ marginTop: "20px" }}>
        {appointments.map((appointment) => (
          <React.Fragment key={appointment.id}>
            <AppointmentPreview
              appointment={appointment}
              onClick={() => {
                setSelectedAppointment(appointment);
                setShowDetailModal(true);
              }}
            />
          </React.Fragment>
        ))}
      </div>
      {showDetailModal && selectedAppointment && (
        <AppointmentView
          appointment={selectedAppointment}
          onEdit={() => onAdd(day, selectedAppointment, true)}
          onDelete={handleDeleteClick}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAppointment(null);
          }}
          onUpdate={(updatedAppointment) => {
            onUpdateAppointment(updatedAppointment);
            setShowDetailModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}
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