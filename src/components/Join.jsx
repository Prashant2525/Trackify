import React, { useState, useRef, useEffect, useContext } from "react";
import "./css/Join.css";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Join = ({ isOpen, onClose, onSuccess }) => {
  const { backendUrl } = useContext(AppContext);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Please enter a join code");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        backendUrl + "/api/projects/join",
        { joinCode: code },
        { withCredentials: true }
      );

      console.log(
        "🛠 POST /api/projects/join →",
        response.status,
        response.data
      );
      toast.success(response.data.message || "Successfully joined project");

      // Call the onSuccess callback to update the parent component
      if (onSuccess) {
        onSuccess();
      }

      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error joining project:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to join project"
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

  // Reset code when modal opens
  useEffect(() => {
    if (isOpen) {
      setCode("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="join-modal-overlay">
      <div className="join-modal" ref={modalRef}>
        <div className="join-modal-content">
          <h2 className="join-title">Join Project</h2>
          <p className="join-description">
            Enter the join code provided by your team leader
          </p>

          <form onSubmit={handleSubmit}>
            <div className="join-form-group">
              <label htmlFor="code">Enter the Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={handleChange}
                className="join-input"
                placeholder="e.g., abc123"
              />
            </div>

            <div className="join-button-container">
              <button
                type="submit"
                className="join-submit-button"
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

export default Join;
