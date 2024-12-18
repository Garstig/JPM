import React, { useState, useEffect } from "react";
import "./Calendar.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import AppointmentModal from "./AppointmentModal";

export const eel = window.eel;
eel.set_host('ws://localhost:8080');

const Calendar = ({ year = new Date().getFullYear(), month = new Date().getMonth() + 1 }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    window.eel.get_appointments(year, month)((data) => {
      setAppointments(data);
    });
  }, [year, month]);

  const handleAddAppointment = () => {
    const { start_time, end_time, name, description } = formData;

    eel.add_appointment(selectedDate, start_time, end_time, name, description)((response) => {
      console.log(response);
      setShowModal(false);
      setFormData({
        start_time: "",
        end_time: "",
        name: "",
        description: "",
      });
      window.eel.get_appointments(year, month)((data) => setAppointments(data));
    });
  };

  const handleDeleteAppointment = (appointmentId) => {
    eel.delete_appointment(appointmentId)((response) => {
      console.log(response);
      window.eel.get_appointments(year, month)((data) => setAppointments(data));
    });
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <CalendarHeader year={year} month={month} />
      <CalendarGrid
        year={year}
        month={month}
        appointments={appointments}
        onAddAppointment={handleDateSelection}
        onDeleteAppointment={handleDeleteAppointment}
      />
      <AppointmentModal
        showModal={showModal}
        selectedDate={selectedDate}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddAppointment}
      />
    </div>
  );
};

export default Calendar;
