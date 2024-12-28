import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Button } from "react-bootstrap";

export const ProjectSearch = ({ projects, onProjectSelect, onAddNewProject }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [showAddButton, setShowAddButton] = useState(false);

  useEffect(() => {
    const newOptions = projects.map((project) => ({
      value: project.id,
      label: project.name,
    }));

    setOptions(newOptions);

    const matchFound = newOptions.some((option) =>
      option.label.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    setShowAddButton(searchTerm !== "" && !matchFound);
  }, [searchTerm, projects]);

  const handleInputChange = (inputValue) => {
    setSearchTerm(inputValue);
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      const selectedProject = projects.find(
        (project) => project.id === selectedOption.value
      );
      onProjectSelect(selectedProject);
      setSearchTerm(selectedOption.label); // Hier wird `searchTerm` korrekt gesetzt
    }
  };
  

  return (
    <div className="mb-3">
      <label htmlFor="project-select" className="form-label">
        Projekt
      </label>
      <Select
        id="project-select"
        options={options}
        onChange={handleSelectChange}
        value={
          searchTerm
            ? options.find((option) => option.label === searchTerm) || null
            : null
        }
        placeholder="Suche nach einem Projekt..."
        noOptionsMessage={() => (showAddButton ? `Kein Projekt gefunden` : `Tippe zum suchen`)}
      />

      
      {showAddButton && searchTerm && (
        <Button
          variant="primary"
          className="mt-2"
          onClick={() => onAddNewProject(searchTerm)}
        >
          Projekt hinzufügen "{searchTerm}"
        </Button>
      )}
    </div>
  );
};
