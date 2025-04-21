import React, { useState, useEffect } from 'react';
import './css/ViewWeeklyTask.css';

const ViewWeeklyTask = ({ onClose }) => {
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedTaskSubmissions, setSelectedTaskSubmissions] = useState([]);
  
  // Simulate fetching task data
  useEffect(() => {
    // Mock data for demonstration
    const mockTasks = [
      {
        week: 1,
        title: "Create UI Design",
        description: "Design a responsive UI for the e-commerce website using Figma.",
        dueDate: "27 Feb 2025"
      },
      {
        week: 2,
        title: "Frontend Implementation",
        description: "Implement the frontend components using React and Tailwind CSS.",
        dueDate: "6 Mar 2025"
      },
      {
        week: 3,
        title: "Backend Integration",
        description: "Connect the frontend with Node.js and MongoDB backend.",
        dueDate: "13 Mar 2025"
      }
    ];
    
    setTimeout(() => {
      setWeeklyTasks(mockTasks);
      setLoading(false);
    }, 500);
  }, []);
  
  const fetchSubmissions = () => {
    // Mock data for student submissions
    const mockSubmissions = [
      {
        studentId: 1,
        studentName: "Alex Johnson",
        submissionDate: "25 Feb 2025",
        description: "Completed the UI design with responsive layouts for mobile and desktop.",
        images: ["/submission-image1.jpg", "/submission-image2.jpg"],
        file: {
          name: "ui-design-final.fig",
          size: "2.4 MB",
          url: "/files/ui-design-final.fig"
        }
      },
      {
        studentId: 2,
        studentName: "Jamie Smith",
        submissionDate: "26 Feb 2025",
        description: "Implemented all required screens with animations and transitions as specified.",
        images: ["/submission-image3.jpg", "/submission-image4.jpg"],
        file: {
          name: "design-implementation.zip",
          size: "4.1 MB",
          url: "/files/design-implementation.zip"
        }
      }
    ];
    
    setSelectedTaskSubmissions(mockSubmissions);
    setShowSubmissions(true);
  };

  return (
    <div className="vwt_container">
      <h2 className="vwt_title">View Weekly Tasks</h2>
      
      {loading ? (
        <div className="vwt_loading">Loading tasks...</div>
      ) : (
        <div className="vwt_content">
          <div className="vwt_weekSelector">
            <label htmlFor="week-select" className="vwt_weekLabel">Select Week:</label>
            <select 
              id="week-select"
              className="vwt_weekSelect"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
            >
              {weeklyTasks.map(task => (
                <option key={task.week} value={task.week}>Week {task.week}</option>
              ))}
            </select>
          </div>
          
          {weeklyTasks.filter(task => task.week === selectedWeek).map((task, index) => (
            <div key={index} className="vwt_taskCard">
              <div className="vwt_taskHeader">
                <h3 className="vwt_taskTitle">{task.title}</h3>
                <div className="vwt_taskDueDate">Due: {task.dueDate}</div>
              </div>
              
              <div className="vwt_taskDescription">
                {task.description}
              </div>
              
              <div className="vwt_taskActions">
                <button 
                  className="vwt_viewSubmissionsButton"
                  onClick={fetchSubmissions}
                >
                  View Submissions
                </button>
                <button className="vwt_editTaskButton">
                  Edit Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="vwt_footer">
        <button className="vwt_closeButton" onClick={onClose}>
          Close
        </button>
      </div>
      
      {/* Submissions Popup */}
      {showSubmissions && (
        <SubmissionsPopup 
          submissions={selectedTaskSubmissions} 
          onClose={() => setShowSubmissions(false)} 
        />
      )}
    </div>
  );
};

// Submissions Popup Component
const SubmissionsPopup = ({ submissions, onClose }) => {
  return (
    <div className="vwt_submissionsOverlay">
      <div className="vwt_submissionsContainer">
        <h2 className="vwt_submissionsTitle">Student Submissions</h2>
        
        {submissions.length === 0 ? (
          <div className="vwt_noSubmissions">No submissions yet</div>
        ) : (
          <div className="vwt_submissionsList">
            {submissions.map((submission, index) => (
              <div key={index} className="vwt_submissionCard">
                <div className="vwt_submissionHeader">
                  <h3 className="vwt_studentName">{submission.studentName}</h3>
                  <div className="vwt_submissionDate">Submitted: {submission.submissionDate}</div>
                </div>
                
                <div className="vwt_submissionDescription">
                  <h4>Description:</h4>
                  <p>{submission.description}</p>
                </div>
                
                <div className="vwt_submissionImages">
                  <h4>Images:</h4>
                  <div className="vwt_imagesContainer">
                    {submission.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="vwt_imagePreview">
                        <img src={img} alt={`Submission ${imgIndex + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="vwt_submissionFile">
                  <h4>Attached File:</h4>
                  <div className="vwt_fileInfo">
                    <span className="vwt_fileName">{submission.file.name}</span>
                    <span className="vwt_fileSize">({submission.file.size})</span>
                    <button className="vwt_downloadButton">Download</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="vwt_submissionsFooter">
          <button className="vwt_closeSubmissionsButton" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewWeeklyTask;
