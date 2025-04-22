import React, { useState, useRef, useEffect } from "react";
import "./css/Join.css";

const Join = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const modalRef = useRef(null);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process join request with code
    console.log("Join submitted with code:", code);
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
    <div className="join-modal-overlay">
      <div className="join-modal" ref={modalRef}>
        <div className="join-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="join-form-group">
              <label htmlFor="code">Enter the Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={handleChange}
                className="join-input"
                placeholder=""
              />
            </div>

            <div className="join-button-container">
              <button type="submit" className="join-submit-button">
                Let's Go
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;