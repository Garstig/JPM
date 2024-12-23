import React from "react";
import DeleteTimeLogModal from "./DeleteTimeLogModal";
import TimeLogView from "./TimeLogView";
import TimeLogPreview from "./TimeLogPreview";

const Day = ({ day, time_logs = [], onAdd, onDeleteTimeLog, onUpdateTimeLog }) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedTimeLog, setSelectedTimeLog] = React.useState(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (time_logId) => {
    onDeleteTimeLog(time_logId);
    setShowDeleteModal(false);
    setSelectedTimeLog(null);
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
      <div className="time_logs-container" style={{ marginTop: "20px" }}>
        {time_logs.map((time_log) => (
          <React.Fragment key={time_log.id}>
            <TimeLogPreview
              time_log={time_log}
              onClick={() => {
                console.log("selected " + time_log)

                console.log(JSON.stringify(time_log, null, 2));

                setSelectedTimeLog(time_log);
                setShowDetailModal(true);
              }}
            />
          </React.Fragment>
        ))}
      </div>
      {showDetailModal && selectedTimeLog && (
        <TimeLogView
          time_log={selectedTimeLog}
          onEdit={() => onAdd(day, selectedTimeLog, true)}
          onDelete={handleDeleteClick}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTimeLog(null);
          }}
          onUpdate={(updatedTimeLog) => {
            onUpdateTimeLog(updatedTimeLog);
            setShowDetailModal(false);
            setSelectedTimeLog(null);
          }}
        />
      )}
      {showDeleteModal && (
        <DeleteTimeLogModal
          showModal={showDeleteModal}
          time_log={selectedTimeLog}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default Day;