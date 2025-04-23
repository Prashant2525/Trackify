import React, { useEffect, useState, useContext } from "react";
import "./css/StudentDetails.css";
import { AppContext } from "../context/AppContext";

const StudentDetails = ({ onClose }) => {
  const { studentDetails, getStudentDetails } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStudentData = async () => {
      setLoading(true);
      await getStudentDetails();
      if (isMounted) setLoading(false);
    };

    if (studentDetails === null || studentDetails.length === 0) {
      fetchStudentData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [studentDetails, getStudentDetails]);


  const handleClose = () => {
    if (!loading) {
      onClose();
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
