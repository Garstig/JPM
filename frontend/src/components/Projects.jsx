import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

export const eel = window.eel;
eel.set_host('ws://localhost:8080');

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    class: '',
    invoice_number: '',
    order_volume: '',
    max_project_hours: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const projectsData = await eel.get_projects()();
    setProjects(projectsData);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProject) {
      await eel.update_project(editingProject.id, formData)();
    } else {
      await eel.add_project(formData)();
    }
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      name: '',
      client: '',
      class: '',
      invoice_number: '',
      order_volume: '',
      max_project_hours: ''
    });
    loadProjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await eel.delete_project(id)();
      loadProjects();
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData(project);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Projects</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>Add Project</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Client</th>
            <th>Class</th>
            <th>Invoice Number</th>
            <th>Order Volume</th>
            <th>Max Project Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.client}</td>
              <td>{project.class}</td>
              <td>{project.invoice_number}</td>
              <td>{project.order_volume}</td>
              <td>{project.max_project_hours}</td>
              <td>
                <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(project)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingProject(null);
        setFormData({
          name: '',
          client: '',
          class: '',
          invoice_number: '',
          order_volume: '',
          max_project_hours: ''
        });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? 'Edit Project' : 'Add Project'}</Modal.Title>
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Control
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Class</Form.Label>
              <Form.Control
                type="text"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Order Volume</Form.Label>
              <Form.Control
                type="number"
                name="order_volume"
                value={formData.order_volume}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Project Hours</Form.Label>
              <Form.Control
                type="number"
                name="max_project_hours"
                value={formData.max_project_hours}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Projects;