import React, { useState, useEffect } from "react";
import "./css/StudentDetails.css";

const StudentDetails = ({ onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching student data
  useEffect(() => {
    // Mock data for demonstration
    const mockStudents = Array(9)
      .fill()
      .map(() => ({
        name: "Prashant Dhimal",
        projectName: "E-Commerce Website using mern",
        progress: "95%",
      }));

    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="sd_container">
      <div className="sd_header">
        <div className="sd_headerCell">Name</div>
        <div className="sd_headerCell">Project name</div>
        <div className="sd_headerCell">Progress</div>
      </div>

      <div className="sd_tableBody">
        {loading ? (
          <div className="sd_loading">Loading...</div>
        ) : (
          students.map((student, index) => (
            <div key={index} className="sd_row">
              <div className="sd_cell">{student.name}</div>
              <div className="sd_cell">{student.projectName}</div>
              <div className="sd_cell">{student.progress}</div>
            </div>
          ))
        )}
      </div>

      <div className="sd_footer">
        <button className="sd_nextButton" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default StudentDetails;
