import React from "react";
import PropTypes from "prop-types";
import "./AppointmentView.scss";

const AppointmentView = ({ appointment, onEdit, onDelete, onClose, onUpdate }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [editedAppointment, setEditedAppointment] = React.useState(appointment);
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "confirmed";
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
    }
  };

  return (
    <div className="appointment-view modal d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Appointment Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {!editMode ? (
              <>
                <h3>{appointment.name}</h3>
                <p>
                  <strong>Date:</strong>
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong>
                  {`${appointment.start_time} - ${appointment.end_time}`}
                </p>
                <p>
                  <strong>Description:</strong>
                  {appointment.description}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span className={`status-badge ${getStatusClass(appointment.status || 'pending')}`}>
                    {appointment.status || 'Pending'}
                  </span>
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editedAppointment.name}
                  onChange={(e) => setEditedAppointment({ ...editedAppointment, name: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={editedAppointment.date}
                  onChange={(e) => setEditedAppointment({ ...editedAppointment, date: e.target.value })}
                />
                <input
                  type="time"
                  className="form-control mb-2"
                  value={editedAppointment.start_time}
                  onChange={(e) => setEditedAppointment({ ...editedAppointment, start_time: e.target.value })}
                />
                <input
                  type="time"
                  className="form-control mb-2"
                  value={editedAppointment.end_time}
                  onChange={(e) => setEditedAppointment({ ...editedAppointment, end_time: e.target.value })}
                />
                <textarea
                  className="form-control mb-2"
                  value={editedAppointment.description}
                  onChange={(e) => setEditedAppointment({ ...editedAppointment, description: e.target.value })}
                />
              </>
            )}
            <div className="appointment-actions">
              {!editMode ? (
                <>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(appointment.id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => {
                      onUpdate(editedAppointment);
                      setEditMode(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditedAppointment(appointment);
                      setEditMode(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AppointmentView.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AppointmentView;