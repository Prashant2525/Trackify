import React, { useState } from "react";
import "./css/AddProject.css";

const AddProject = ({ onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [slots, setSlots] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle project creation/editing logic
    console.log("Adding project:", { projectName, slots });
    onClose();
  };

  return (
    <div className="ap_container">
      <form onSubmit={handleSubmit} className="ap_form">
        <div className="ap_formGroup">
          <label className="ap_label">Project Name:</label>
          <input
            type="text"
            className="ap_input"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div className="ap_formGroup">
          <label className="ap_label">Number of Slots</label>
          <input
            type="number"
            className="ap_input"
            value={slots}
            onChange={(e) => setSlots(e.target.value)}
            required
          />
        </div>

        <div className="ap_buttonGroup">
          <button type="submit" className="ap_addButton">
            Add
          </button>
          <button
            type="button"
            className="ap_editButton"
            onClick={() => console.log("Edit mode")}
          >
            Edit Existing Project
          </button>
          <div className="vwt_submissionsFooter">
            <button className="vwt_closeSubmissionsButton" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
