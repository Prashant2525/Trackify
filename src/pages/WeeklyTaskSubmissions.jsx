import React, { useState, useEffect } from 'react';
import './css/WeeklyTaskSubmissions.css';

const WeeklyTaskSubmissions = ({ onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simulate fetching submission data
  useEffect(() => {
    // Mock data for demonstration
    const mockSubmissions = Array(6).fill().map((_, i) => ({
      studentName: "Prashant Dhimal",
      weekNumber: `Week ${i + 1}`,
      submittedOn: "17 Feb 2025",
      fileName: "Task_submission.pdf"
    }));
    
    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 500);
  }, []);

  const handleAssignMarks = (submissionId, marks) => {
    console.log(`Assigned ${marks} marks to submission ${submissionId}`);
  };

  return (
    <div className="wts_container">
      <h2 className="wts_title">Weekly Task Submissions</h2>
      
      {loading ? (
        <div className="wts_loading">Loading submissions...</div>
      ) : (
        <div className="wts_table">
          <div className="wts_header">
            <div className="wts_headerCell">Student</div>
            <div className="wts_headerCell">Week</div>
            <div className="wts_headerCell">Submitted On</div>
            <div className="wts_headerCell">File</div>
            <div className="wts_headerCell">Marks</div>
          </div>
          
          <div className="wts_tableBody">
            {submissions.map((submission, index) => (
              <div key={index} className="wts_row">
                <div className="wts_cell">{submission.studentName}</div>
                <div className="wts_cell">{submission.weekNumber}</div>
                <div className="wts_cell">{submission.submittedOn}</div>
                <div className="wts_cell">
                  <a href="#" className="wts_fileLink">{submission.fileName}</a>
                </div>
                <div className="wts_cell">
                  <input 
                    type="number" 
                    className="wts_marksInput" 
                    min="0" 
                    max="100"
                    placeholder="0-100"
                    onChange={(e) => handleAssignMarks(index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="wts_footer">
        <button className="wts_saveButton" onClick={onClose}>
          Save Marks
        </button>
        <button className="wts_closeButton" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default WeeklyTaskSubmissions;