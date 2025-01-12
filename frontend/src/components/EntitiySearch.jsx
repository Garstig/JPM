import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { Button } from "react-bootstrap";

export const EntitySearch = ({ entities, onEntitySelect, onAddNewEntity, entityName }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [showAddButton, setShowAddButton] = useState(false);

  useEffect(() => {
    const newOptions = entities.map((entity) => ({
      value: entity.id,
      label: entity.name,
    }));

    setOptions(newOptions);

    const matchFound = newOptions.some((option) =>
      option.label.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    setShowAddButton(searchTerm !== "" && !matchFound);
  }, [searchTerm, entities]);

  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setSearchTerm(inputValue);
    }
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      const selectedEntity = entities.find(
        (entity) => entity.id === selectedOption.value
      );
      onEntitySelect(selectedEntity);
      setSearchTerm(selectedOption.label);
    }
  };

  // Custom Menu Component to include the "Add Entity" button
  const CustomMenu = (props) => {
    return (
      <components.Menu {...props}>
        {props.children}
        {searchTerm && (
          <div style={{ padding: "10px", textAlign: "center" }}>
            {/*
            <Button
              variant="primary"
              onClick={() => onAddNewEntity(searchTerm)}
            >
              {entityName} hinzufügen "{searchTerm}"
            </Button>
            */}
          </div>
        )}
      </components.Menu>
    );
  };

  return (
    <div className="mb-3">
      <label htmlFor="entity-select" className="form-label">
        {entityName}
      </label>
      <Select
        id="entity-select"
        options={options}
        onInputChange={handleInputChange}
        onChange={handleSelectChange}
        value={
          searchTerm
            ? options.find((option) => option.label === searchTerm) || null
            : null
        }
        placeholder={`Suche nach ${entityName}...`}
        components={{ Menu: CustomMenu }}
        noOptionsMessage={() => `${entityName} nicht gefunden`}
      />
    </div>
  );
};
