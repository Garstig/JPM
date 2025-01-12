import React from "react";
import PropTypes from "prop-types";
import "./TimeLogView.scss";

const TimeLogView = ({ time_log, onEdit, onDelete, onClose, onUpdate }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [editedTimeLog, setEditedTimeLog] = React.useState(time_log);
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
    <div className="time_log-view modal d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{color:"black"}}>Details dieser Zeiterfassung</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {!editMode ? (
              <>
                <h3>{time_log.name}</h3>
                <p>
                  <strong>Datum:</strong>
                  {new Date(time_log.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Zeit:</strong>
                  {`${time_log.start_time.substring(0,5)} - ${time_log.end_time.substring(0,5)}`}
                </p>
                <p>
                  <strong>Beschreibung:</strong>
                  {time_log.description}
                </p>
                <p>
                  <strong>Projekt:</strong>
                  {time_log.project_name}
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editedTimeLog.name}
                  onChange={(e) => setEditedTimeLog({ ...editedTimeLog, name: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={editedTimeLog.date}
                  onChange={(e) => setEditedTimeLog({ ...editedTimeLog, date: e.target.value })}
                />
                <input
                  type="time"
                  className="form-control mb-2"
                  value={editedTimeLog.start_time}
                  onChange={(e) => setEditedTimeLog({ ...editedTimeLog, start_time: e.target.value })}
                />
                <input
                  type="time"
                  className="form-control mb-2"
                  value={editedTimeLog.end_time}
                  onChange={(e) => setEditedTimeLog({ ...editedTimeLog, end_time: e.target.value })}
                />
                <textarea
                  className="form-control mb-2"
                  value={editedTimeLog.description}
                  onChange={(e) => setEditedTimeLog({ ...editedTimeLog, description: e.target.value })}
                />
              </>
            )}
            <div className="time_log-actions">
              {!editMode ? (
                <>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => setEditMode(true)}
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(time_log.id)}
                  >
                    Löschen
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => {
                      onUpdate(editedTimeLog);
                      setEditMode(false);
                    }}
                  >
                    Speichern
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditedTimeLog(time_log);
                      setEditMode(false);
                    }}
                  >
                    Abbrechen
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

TimeLogView.propTypes = {
  time_log: PropTypes.shape({
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

export default TimeLogView;