import React, { useContext, useEffect, useRef, useState } from "react";
import "./css/AddProject.css";
import ViewProjects from "./ViewProjects.jsx";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";

const AddProject = ({ onClose }) => {
  const { backendUrl } = useContext(AppContext);

  const [projectName, setProjectName] = useState("");
  const [slots, setSlots] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [showProjects, setShowProjects] = useState(false);

  // Refs for popup containers
  const viewProjectRef = useRef(null);

  // Handle clicks outside of pop-ups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProjects &&
        viewProjectRef.current &&
        !viewProjectRef.current.contains(event.target)
      ) {
        setShowProjects(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProjects]);

  const handleSubmit = async (e) => {
    axios.defaults.withCredentials = true;
    e.preventDefault();

    try {
      const payload = {
        name: projectName,
        description: projectDescription,
        slotsAvailable: slots,
      };
      console.log(payload)

      const { data } = await axios.post(
        backendUrl + "/api/projects/add",
        payload
      );
      console.log("🛠 POST /api/projects/add →", data.status, data.data);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
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
          <label className="ap_label">Project Description:</label>
          <input
            type="text"
            className="ap_input"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
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
            onClick={() => setShowProjects(true)}
          >
            View/Edit Existing Project
          </button>
          <div className="vwt_submissionsFooter">
            <button className="vwt_closeSubmissionsButton" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </form>

      {/* Pop-up components */}
      {showProjects && (
        <div className="ad_popupOverlay">
          <div ref={viewProjectRef}>
            <ViewProjects onClose={() => setShowProjects(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProject;
