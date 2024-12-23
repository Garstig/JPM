import React, { useState, useEffect } from "react";
import "./Calendar.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import AppointmentModal from "./AppointmentModal";

export const eel = window.eel;
eel.set_host('ws://localhost:8080');

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    name: "",
    description: "",
    project_id: "",
  });

  useEffect(() => {
    window.eel.get_time_logs(currentYear, currentMonth)((data) => {
      setAppointments(data);
    });
  }, [currentYear, currentMonth]);
  
  const handleMonthChange = (newYear, newMonth) => {
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
  };

  const handleAddAppointment = () => {
    const { id, start_time, end_time, name, description, project_id } = formData;

    const appointmentFunction = id ? eel.update_appointment : eel.add_appointment;
    const args = id 
      ? [id, selectedDate, start_time, end_time, name, description]
      : [selectedDate, start_time, end_time, name, description];

    appointmentFunction(...args)((response) => {
      console.log(response);
      setShowModal(false);
      setFormData({
        start_time: "",
        end_time: "",
        name: "",
        description: "",
      });
      window.eel.get_time_logs(currentYear, currentMonth)((data) => setAppointments(data));
    });
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      const response = await eel.update_appointment(
        updatedAppointment.id,
        updatedAppointment.date,
        updatedAppointment.start_time,
        updatedAppointment.end_time,
        updatedAppointment.name,
        updatedAppointment.description
      )();
      console.log(response);
      window.eel.get_time_logs(currentYear, currentMonth)((data) => setAppointments(data));
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await eel.delete_appointment(appointmentId)();
      console.log(response);
      await window.eel.get_time_logs(currentYear, currentMonth)((data) => {
        setAppointments(data);
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleDateSelection = (date, appointment = null, isEdit = false) => {
    setSelectedDate(date);
    if (isEdit && appointment) {
      setFormData({
        id: appointment.id,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        name: appointment.name,
        description: appointment.description || "",
      });
    } else {
      setFormData({
        start_time: "",
        end_time: "",
        name: "",
        description: "",
      });
    }
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <CalendarHeader year={currentYear} month={currentMonth} onMonthChange={handleMonthChange} />
      <CalendarGrid
        year={currentYear}
        month={currentMonth}
        appointments={appointments}
        onAddAppointment={handleDateSelection}
        onDeleteAppointment={handleDeleteAppointment}
        onUpdateAppointment={handleUpdateAppointment}
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
