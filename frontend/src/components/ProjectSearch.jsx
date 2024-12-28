import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
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
  }, [projects]);

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
      setSearchTerm(selectedOption.label);
    }
  };

  // Custom Menu Component to include the "Add Project" button
  const CustomMenu = (props) => {
    return (
      <components.Menu {...props}>
        {props.children}
        {searchTerm && (
          <div style={{ padding: "10px", textAlign: "center" }}>
           {showAddButton && searchTerm && (
             <Button
              variant="primary"
              onClick={() => onAddNewProject(searchTerm)}
            >
               
              Projekt hinzufügen "{searchTerm}"
            </Button>)}
          </div>
        )}
      </components.Menu>
    );
  };

  return (
    <div className="mb-3">
      <label htmlFor="project-select" className="form-label">
        Projekt
      </label>
      <Select
        id="project-select"
        options={options}
        onInputChange={handleInputChange}
        onChange={handleSelectChange}
        value={
          searchTerm
            ? options.find((option) => option.label === searchTerm) || null
            : null
        }
        placeholder="Suche nach einem Projekt..."
        components={{ Menu: CustomMenu }}
        noOptionsMessage={() => "Kein Projekt gefunden"}
      />
    </div>
  );
};
