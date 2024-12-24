import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';

export const eel = window.eel;
eel.set_host('ws://localhost:8080');

const TimeLogForm = ({ selectedDate, onClose }) => {
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    project_id: "",
    description: "",
  });
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const projectsData = await eel.get_projects()();
    setProjects(projectsData);
    // Set default project if available
    const defaultProject = projectsData.find(p => p.name === "default");
    if (defaultProject && !formData.project_id) {
      setFormData(prev => ({ ...prev, project_id: defaultProject.id }));
    }
  };

  const handleSubmit = async (e) => {
    console.log("got here")
    e.preventDefault();
    if (!formData.project_id) {
      alert("Please select a project");
      return;
    }
    console.log("Form Data:", formData)
    await eel.add_time_log({
      date: selectedDate,
      ...formData,
      project_id: parseInt(formData.project_id, 10)
    })();
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectCreated = () => {
    loadProjects();
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add TimeLog</h5>
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
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Project</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a project..."
                  />
                  <Button variant="outline-secondary" onClick={() => setShowProjectModal(true)}>
                    New Project
                  </Button>
                </div>
                <select 
                  className="form-select mt-2"
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                >
                  <option value="">Select a project</option>
                  {projects
                    .filter(project => 
                      searchTerm === "" || 
                      project.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProjectModal = ({ show, onHide, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    kunde: '',
    redaktion: '',
    projektart: '',
    rechnungsnummer: '',
    vereinbartes_honorar: null,
    max_projektstunden: '',
    kontaktperson: '',
    prognosetage: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await eel.add_project(formData)();
    onProjectCreated();
    onHide();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Kunde</Form.Label>
            <Form.Control
              type="text"
              name="kunde"
              value={formData.kunde}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Redaktion</Form.Label>
            <Form.Control
              type="text"
              name="redaktion"
              value={formData.redaktion}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Project
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TimeLogForm;
