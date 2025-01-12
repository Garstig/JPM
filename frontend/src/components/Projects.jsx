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
    kunde: '',
    redaktion: '',
    projektart: '',
    rechnungsnummer: '',
    vereinbartes_honorar: null,
    max_projektstunden: '',
    kontaktperson: '',
    prognosetage: null,
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
      [e.target.name]: e.target.value,
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
    resetForm();
    loadProjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Projekt löschen möchten?')) {
      await eel.delete_project(id)();
      loadProjects();
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData(project);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
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
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Projekte</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Projekt hinzufügen
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Kunde</th>
            <th>Redaktion</th>
            <th>Projektart</th>
            <th>Rechnungsnummer</th>
            <th>Vereinbartes Honorar (in Euro)</th>
            <th>Maximale Projektstunden</th>
            <th>Kontaktperson</th>
            <th>Aktionen</th>
            <th>Prognose Tage</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.kunde}</td>
              <td>{project.redaktion}</td>
              <td>{project.projektart}</td>
              <td>{project.rechnungsnummer}</td>
              <td>{project.vereinbartes_honorar}</td>
              <td>{project.max_projektstunden}</td>
              <td>{project.kontaktperson}</td>
              <td>{project.prognosetage}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(project)}
                >
                  Bearbeiten
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
                  Löschen
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingProject(null);
          resetForm();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? 'Projekt bearbeiten' : 'Projekt hinzufügen'}</Modal.Title>
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
            <Form.Group className="mb-3">
              <Form.Label>Projektart</Form.Label>
              <Form.Control
                type="text"
                name="projektart"
                value={formData.projektart}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rechnungsnummer</Form.Label>
              <Form.Control
                type="text"
                name="rechnungsnummer"
                value={formData.rechnungsnummer}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vereinbartes Honorar (in Euro)</Form.Label>
              <Form.Control
                type="number"
                name="vereinbartes_honorar"
                value={formData.vereinbartes_honorar}
                onChange={handleInputChange}
                style={{ MozAppearance: 'textfield' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Maximale Projektstunden</Form.Label>
              <Form.Control
                type="number"
                name="max_projektstunden"
                value={formData.max_projektstunden}
                onChange={handleInputChange}
                style={{ MozAppearance: 'textfield' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kontaktperson</Form.Label>
              <Form.Control
                type="text"
                name="kontaktperson"
                value={formData.kontaktperson}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingProject ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Projects;
