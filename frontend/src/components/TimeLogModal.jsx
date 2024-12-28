import React, { useEffect, useState } from "react";
import { ProjectSearch } from "./ProjectSearch";

const TimeLogModal = ({
  showModal,
  selectedDate,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) => {
  const [projects, setProjects] = useState([]);

  // Load projects when modal opens
  useEffect(() => {
    const loadProjects = async () => {
      if (showModal) {
        const projectsData = await window.eel.get_projects()();
        setProjects(projectsData);
      }
    };
    loadProjects();
  }, [showModal]);



  return (
    showModal && (
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{formData.id ? 'Edit TimeLog' : 'Add TimeLog'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Datum</label>
                  <input type="text" className="form-control" value={selectedDate} readOnly />
                </div>
                <ProjectSearch 
                  projects={projects}
                  onProjectSelect={(project) => setFormData({...formData, project_id: project.id})}
                  onAddNewProject={(projectName) => {
                    onClose();
                    window.eel.add_project({ name: projectName })().then(() => {
                      window.eel.get_projects()().then(setProjects);
                    });
                  }}
                />
                <div className="mb-3">
                  <label className="form-label">Startzeit</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Endzeit</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Beschreibung</label>
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={onSubmit}>
                {formData.id ? 'Update TimeLog' : 'Add TimeLog'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default TimeLogModal;
