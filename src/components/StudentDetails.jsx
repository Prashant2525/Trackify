import React, { useEffect, useState, useContext } from "react";
import "./css/StudentDetails.css";
import { AppContext } from "../context/AppContext";

const StudentDetails = ({ onClose }) => {
  const { studentDetails, getStudentDetails } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a mounted flag to ensure data fetching doesn't occur after unmount
    let isMounted = true;

    const fetchStudentData = async () => {
      setLoading(true);
      await getStudentDetails();
      if (isMounted) setLoading(false); // Only set loading state if still mounted
    };

    if (studentDetails === null || studentDetails.length === 0) {
      fetchStudentData(); // Fetch data only if it's not already available
    } else {
      setLoading(false); // If data is available, stop loading
    }

    return () => {
      isMounted = false; // Clean up flag on unmount
    };
  }, [studentDetails, getStudentDetails]);


  const handleClose = () => {
    // Prevent onClose callback during loading state
    if (!loading) {
      onClose(); // Only close when not loading
    }
  };

  return (
    <div className="sd_container">
      <div className="sd_header">
        <div className="sd_headerCell">Name</div>
        <div className="sd_headerCell">Project name</div>
        <div className="sd_headerCell">Progress</div>
        <div className="sd_headerCell">Status</div>
      </div>

      <div className="sd_tableBody">
        {loading ? (
          <div className="sd_loading">Loading...</div>
        ) : studentDetails && studentDetails.length > 0 ? (
          studentDetails.map((student, index) => (
            <div key={index} className="sd_row">
              <div className="sd_cell">{student.studentName}</div>
              <div className="sd_cell">{student.projectName}</div>
              <div className="sd_cell">{student.overallProgress}</div>
              <div className="sd_cell">
                {student.submittedTasks.map((task, taskIndex) => (
                  <div key={taskIndex}>
                    {/* Check if task status is "Done" */}
                    {task.status === "Done" ? (
                      <span style={{ color: "green" }}>
                        Week {task.weekNumber} task - Done
                      </span>
                    ) : task.status === "Not Done" ? (
                      <span style={{ color: "red" }}>
                        Week {task.weekNumber} task - Not Done
                      </span>
                    ) : (
                      <span style={{ color: "orange" }}>
                        Week {task.weekNumber} task - {task.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="sd_loading">No student data found</div>
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
