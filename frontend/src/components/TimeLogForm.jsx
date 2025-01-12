import { v4 as uuidv4 } from 'uuid'; // UUID-Bibliothek importieren

const TimeLogForm = ({ selectedDate, onClose }) => {
  const [formData, setFormData] = useState({
    start_time: "18:00",         
    end_time: "",          
    project_id: "",        
    description: "",       
  });

  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await eel.get_projects()();

      // Falls Projekte keine UUID haben, füge eine hinzu
      const projectsWithUUID = projectsData.map(project => ({
        ...project,
        uuid: project.uuid || uuidv4() // UUID hinzufügen, falls nicht vorhanden
      }));

      setProjects(projectsWithUUID);

      // Standardprojekt setzen
      const defaultProject = projectsWithUUID.find(p => p.name === "default");
      if (defaultProject && !formData.project_id) {
        setFormData(prev => ({ ...prev, project_id: defaultProject.uuid }));
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
      setError("Failed to load projects. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!selectedDate) throw new Error("No date selected");
      if (!formData.project_id || !formData.start_time || !formData.end_time) {
        throw new Error("Please fill in all required fields");
      }

      const selectedProject = projects.find(p => p.uuid === formData.project_id);
      if (!selectedProject) throw new Error("Please select a valid project");

      const start = new Date(`1970-01-01T${formData.start_time}`);
      const end = new Date(`1970-01-01T${formData.end_time}`);
      if (start >= end) throw new Error("End time must be after start time");

      const timeLogData = {
        date: selectedDate,
        start: formData.start_time,
        end: formData.end_time,
        project_id: selectedProject.id,
        description: formData.description || "",
      };

      console.log("Submitting time log:", timeLogData);

      const result = await eel.add_time_log(
        timeLogData.date,
        timeLogData.start,
        timeLogData.end,
        timeLogData.project_id,
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

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Arbeitszeit hinzufügen</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Zeit Start</label>
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
                <label className="form-label">Zeit Ende</label>
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
                <label className="form-label">Projekt</label>
                <div className="input-group">
                  <select
                    name="project_id"
                    className="form-control"
                    value={formData.project_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Wähle ein Projekt</option>
                    {projects.map(project => (
                      <option key={project.uuid} value={project.uuid}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowProjectModal(true)}
                  >
                    Neues Projekt
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Beschreibung (optional)</label>
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
                Abbrechen
              </button>
              <button type="submit" className="btn btn-primary">
                Arbeitszeit hinzufügen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimeLogForm;
