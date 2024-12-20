import React from "react";

const DeleteAppointmentModal = ({
  showModal,
  appointment,
  onClose,
  onConfirm,
}) => {
  console.log(appointment)
  return (
    showModal && (
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Appointment</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body" style={{color:"black"}}>
              <p>Are you sure you want to delete the appointment for {appointment.name}?</p>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={() => onConfirm(appointment.id)}>
                Delete
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  );
};

export default DeleteAppointmentModal;