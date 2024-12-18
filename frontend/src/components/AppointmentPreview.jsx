import React from "react";
import PropTypes from "prop-types";
import "./AppointmentView.scss";

const AppointmentPreview = ({ appointment, onClick }) => {
  return (
    <div className="appointment-preview" onClick={() => onClick(appointment)}>
      <h4>{appointment.name}</h4>
      <p className="mb-0">{`${appointment.start_time} - ${appointment.end_time}`}</p>
    </div>
  );
};

AppointmentPreview.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AppointmentPreview;