import React, { useState, useRef, useEffect } from "react";
import "./css/Apply.css";

const Apply = ({ isOpen, onClose, projectName }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    registrationNumber: "",
    groupName: "",
    code: "32556678"
  });
  
  const modalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process application data here
    console.log("Application submitted:", formData);
    onClose();
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
          <form onSubmit={handleSubmit}>
            <div className="apply-form-row">
              <div className="apply-form-group">
                <label htmlFor="fullname">Fullname</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="apply-input"
                />
              </div>
              <div className="apply-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="apply-input"
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
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="apply-input"
                />
              </div>
              <div className="apply-form-group">
                <label htmlFor="groupName">Group Name</label>
                <input
                  type="text"
                  id="groupName"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleChange}
                  className="apply-input"
                />
              </div>
            </div>

            <div className="apply-form-group code-group">
              <label htmlFor="code">Code (for other to join)</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="apply-input code-input"
                readOnly
              />
            </div>

            <div className="apply-button-container">
              <button type="submit" className="apply-submit-button">
                Let's Go
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;