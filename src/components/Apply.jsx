import React, { useState, useRef, useEffect, useContext } from "react";
import "./css/Apply.css";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Apply = ({ isOpen, onClose, projectName, projectId, onSuccess }) => {
  const { backendUrl, userData } = useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);

  // Pre-fill form with user data
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setRegistrationNumber(userData.reg_num || "");
    }
  }, [userData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        backendUrl + "/api/projects/take",
        { projectId },
        { withCredentials: true }
      );

      console.log(
        "🛠 POST /api/projects/take →",
        response.status,
        response.data
      );

      if (response.data.joinCode) {
        setCode(response.data.joinCode);
      }

      toast.success(response.data.message || "Project taken successfully");

      // Call the onSuccess callback to update the parent component
      if (onSuccess) {
        onSuccess();
      }

      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error taking project:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to take project"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle clicks outside the modal
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="apply-modal-overlay">
      <div className="apply-modal" ref={modalRef}>
        <div className="apply-modal-content">
          <h2 className="apply-title">Apply for Project: {projectName}</h2>
          <form onSubmit={handleSubmit}>
            <div className="apply-form-row">
              <div className="apply-form-group">
                <label htmlFor="fullname">Fullname</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="apply-input"
                  disabled={true} // Using user data from context
                />
              </div>
              <div className="apply-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="apply-input"
                  disabled={true} // Using user data from context
                />
              </div>
            </div>

            <div className="apply-form-row">
              <div className="apply-form-group">
                <label htmlFor="registrationNumber">Registration Number</label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="apply-input"
                  disabled={true} // Using user data from context
                />
              </div>
            </div>

            {code && (
              <div className="apply-form-group code-group">
                <label htmlFor="code">Code (for others to join)</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={code}
                  className="apply-input code-input"
                  readOnly
                />
                <p className="code-note">
                  Share this code with your team members to join this project
                </p>
              </div>
            )}

            <div className="apply-button-container">
              <button
                type="submit"
                className="apply-submit-button"
                disabled={loading}
              >
                {loading ? "Processing..." : "Let's Go"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
