import React from "react";
import PropTypes from "prop-types";
import "./TimeLogView.scss";

const TimeLogPreview = ({ time_log, onClick }) => {
  return (
    <div className="time_log-preview" onClick={() => onClick(time_log)}>
      <h4>{time_log.name}</h4>
      <p className="mb-0">{`${time_log.start_time.slice(0,-3)} - ${time_log.end_time.slice(0,-3)}`}</p>
    </div>
  );
};

TimeLogPreview.propTypes = {
  time_log: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TimeLogPreview;