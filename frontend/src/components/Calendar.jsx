import React, { useState, useEffect } from "react";
import "./Calendar.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import TimeLogModal from "./TimeLogModal";

export const eel = window.eel;
eel.set_host('ws://localhost:8080');

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [time_logs, setTimeLogs] = useState([]);
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
      setTimeLogs(data);
    });
  }, [currentYear, currentMonth]);
  
  const handleMonthChange = (newYear, newMonth) => {
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
  };

  const handleAddTimeLog = (formData) => {
    console.log(formData);
    console.log("got here")
    const { id, start_time, end_time, name, description, project_id } = formData;

    const time_logFunction = id ? eel.update_time_log : eel.add_time_log;
    const args = id 
      ? [id, selectedDate, start_time, end_time, name, description]
      : [selectedDate, start_time, end_time, name, description];

    time_logFunction(...args)((response) => {
      console.log(response);
      setShowModal(false);
      setFormData({
        start_time: "",
        end_time: "",
        name: "",
        description: "",
      });
      window.eel.get_time_logs(currentYear, currentMonth)((data) => setTimeLogs(data));
    });
  };

  const handleUpdateTimeLog = async (updatedTimeLog) => {
    try {
      const response = await eel.update_time_log(
        updatedTimeLog.id,
        updatedTimeLog.date,
        updatedTimeLog.start_time,
        updatedTimeLog.end_time,
        updatedTimeLog.name,
        updatedTimeLog.description
      )();
      console.log(response);
      window.eel.get_time_logs(currentYear, currentMonth)((data) => setTimeLogs(data));
    } catch (error) {
      console.error("Error updating time_log:", error);
    }
  };

  const handleDeleteTimeLog = async (time_logId) => {
    try {
      const response = await eel.delete_time_log(time_logId)();
      console.log(response);
      await window.eel.get_time_logs(currentYear, currentMonth)((data) => {
        setTimeLogs(data);
      });
    } catch (error) {
      console.error("Error deleting time_log:", error);
    }
  };

  const handleDateSelection = (date, time_log = null, isEdit = false) => {
    setSelectedDate(date);
    if (isEdit && time_log) {
      setFormData({
        id: time_log.id,
        start_time: time_log.start_time,
        end_time: time_log.end_time,
        name: time_log.name,
        description: time_log.description || "",
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
        time_logs={time_logs}
        onAddTimeLog={handleDateSelection}
        onDeleteTimeLog={handleDeleteTimeLog}
        onUpdateTimeLog={handleUpdateTimeLog}
      />
      <TimeLogModal
        showModal={showModal}
        selectedDate={selectedDate}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddTimeLog}
      />
    </div>
  );
};

export default Calendar;
