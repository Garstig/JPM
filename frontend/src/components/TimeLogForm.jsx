import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';

export const eel = window.eel;
eel.set_host('ws://localhost:8080');

/**
 * TimeLogForm Component
 * Renders a form for adding new time log entries
 * @param {string} selectedDate - The date for which to add the time log
 * @param {function} onClose - Callback function to close the form modal
 */
const TimeLogForm = ({ selectedDate, onClose }) => {
  // Form state with required fields
  const [formData, setFormData] = useState({
    start_time: "18:00",         // HH:MM format
    end_time: "",          // HH:MM format
    project_id: "",        // Selected project ID
    description: "",       // Optional description
  });
  
  // Available projects from backend
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  // Error handling state
  const [error, setError] = useState("");
  
  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await eel.get_projects()();
      setProjects(projectsData);
      
      // Set default project if available
      const defaultProject = projectsData.find(p => p.name === "default");
      if (defaultProject && !formData.project_id) {
        setFormData(prev => ({ ...prev, project_id: defaultProject.id }));
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
      setError("Failed to load projects. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    try {
      // Validate required date
      if (!selectedDate) {
        throw new Error("No date selected");
      }
      
      // Validate required form fields
      if (!formData.project_id || !formData.start_time || !formData.end_time) {
        throw new Error("Please fill in all required fields");
      }
      
      // Get selected project
      const selectedProject = projects.find(
        p => p.id === parseInt(formData.project_id, 10)
      );
      if (!selectedProject) {
        throw new Error("Please select a valid project");
      }
      
      // Validate time range
      const start = new Date(`1970-01-01T${formData.start_time}`);
      const end = new Date(`1970-01-01T${formData.end_time}`);
      if (start >= end) {
        throw new Error("End time must be after start time");
      }
      
      // Prepare data for submission
      const timeLogData = {
        date: selectedDate,
        start: formData.start_time,
        end: formData.end_time,
        project: selectedProject.name,
        description: formData.description || ""
      };
      
      console.log("Submitting time log:", timeLogData);
      
      // Submit to backend with validated data
      const result = await eel.add_time_log(
        timeLogData.date,
        timeLogData.start,
        timeLogData.end,
        timeLogData.project,
        timeLogData.description
      )();
      
      console.log("Time log added successfully:", result);
      onClose();
    } catch (error) {
      const errorMessage = error.message || "Failed to add time log";
      console.error("Error adding time log:", errorMessage);
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(`Field ${e.target.name} changed to: "${value}"`);
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleProjectCreated = () => {
    loadProjects();
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Time Log</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <ProjectModal 
            show={showProjectModal} 
            onHide={() => setShowProjectModal(false)}
            onProjectCreated={handleProjectCreated}
          />
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  name="start_time"
                  className="form-control"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  name="end_time"
                  className="form-control"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Project</label>
                <div className="input-group">
                  <select
                    name="project_id"
                    className="form-control"
                    value={formData.project_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowProjectModal(true)}
                  >
                    New Project
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description (optional)</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Time Log
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimeLogForm;