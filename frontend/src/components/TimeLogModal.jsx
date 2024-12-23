import React from "react";

import { useEffect, useState } from "react";

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

  // Default times to ensure that minutes are set
  const defaultStartTime = formData.start_time || "09:00"; // default 09:00 if not provided
  const defaultEndTime = formData.end_time || "17:00";   // default 17:00 if not provided

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
                <div className="mb-3">
                  <label className="form-label">Project</label>
                  <select 
                    className="form-select" 
                    name="project_id"
                    value={formData.project_id || ""}
                    onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                  >
                    <option value="">No Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Startzeit</label>
                  <input
                    type="time"
                    className="form-control"
                    value={defaultStartTime}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Endzeit</label>
                  <input
                    type="time"
                    className="form-control"
                    value={defaultEndTime}
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