import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./css/ViewWeeklyTask.css";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ViewWeeklyTask = ({ onClose }) => {
  const { backendUrl } = useContext(AppContext);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedTaskSubmissions, setSelectedTaskSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [description, setDescription] = useState("No description available");

  // Fetch all weekly tasks for the dropdown
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          backendUrl + "/api/list/weekly-tasks",
          {
            withCredentials: true,
          }
        );
        console.log(
          "🛠 GET /api/list/weekly-tasks →",
          response.status,
          response.data
        );

        if (response.data.success && response.data.tasks) {
          setWeeklyTasks(response.data.tasks);
          if (response.data.tasks.length > 0) {
            // Default select the first week/task
            setSelectedWeek(response.data.tasks[0].weekNumber);

            // Get submission count for the first task
            fetchSubmissionCount(response.data.tasks[0].weekNumber);
          }
        } else {
          setWeeklyTasks([]);
          toast.error("No weekly tasks found");
        }
      } catch (error) {
        console.error("fetchTasks error:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch weekly tasks"
        );
        setWeeklyTasks([]);
      }
      setLoading(false);
    };
    fetchTasks();
  }, [backendUrl]);

  // Find the selected task by week number
  const selectedTask = weeklyTasks.find(
    (task) => task.weekNumber === parseInt(selectedWeek)
  );

  // When selected week or task changes, fetch submission count and task-specific description
  useEffect(() => {
    if (selectedWeek && selectedTask) {
      fetchTaskSpecificData(selectedWeek, selectedTask._id);
    }
  }, [selectedWeek, selectedTask, backendUrl]);

  // Fetch submission count and task-specific description
  const fetchTaskSpecificData = async (weekNumber, taskId) => {
    try {
      const response = await axios.get(
        backendUrl + `/api/submission/${weekNumber}`,
        { withCredentials: true }
      );

      if (response.data.success && response.data.submissions) {
        // Set the total submission count
        setSubmissionCount(response.data.submissions.length);

        // Find the submission for the currently selected task
        const relevantSubmission = response.data.submissions.find(
          (submission) => submission.taskId === taskId
        );

        // Set description from the relevant submission if found
        if (relevantSubmission) {
          setDescription(relevantSubmission.description);
        } else {
          setDescription("No submission for this specific task");
        }
      } else {
        setSubmissionCount(0);
        setDescription("No submissions available");
      }
    } catch (error) {
      console.error("Fetch task specific data error:", error);
      setSubmissionCount(0);
      setDescription("Error loading submission details");
    }
  };

  // Fetch submission count for the selected week
  const fetchSubmissionCount = async (weekNumber) => {
    try {
      const response = await axios.get(
        backendUrl + `/api/submission/${weekNumber}`,
        { withCredentials: true }
      );

      if (response.data.success && response.data.submissions) {
        setSubmissionCount(response.data.submissions.length);
      } else {
        setSubmissionCount(0);
      }
    } catch (error) {
      console.error("Fetch submission count error:", error);
      setSubmissionCount(0);
    }
  };

  // Fetch submissions for the selected week
  const fetchSubmissions = async (weekNumber) => {
    setSubmissionsLoading(true);
    try {
      const response = await axios.get(
        backendUrl + `/api/submission/${weekNumber}`,
        { withCredentials: true }
      );
      console.log(
        "🛠 GET /api/submission/:weekNumber →",
        response.status,
        response.data
      );

      if (response.data.success && response.data.submissions) {
        setSelectedTaskSubmissions(response.data.submissions);
        setShowSubmissions(true);
      } else {
        setSelectedTaskSubmissions([]);
        setShowSubmissions(true);
        toast.info("No submissions found for this week");
      }
    } catch (error) {
      console.error("Fetch submissions error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch submissions"
      );
      setSelectedTaskSubmissions([]);
      setShowSubmissions(true);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // Helper function to download images
  const downloadImage = (e, imageUrl, filename) => {
    e.preventDefault();
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
        toast.error("Failed to download image");
      });
  };

  return (
    <div className="vwt_container">
      <h2 className="vwt_title">View Weekly Tasks</h2>

      {loading ? (
        <div className="vwt_loading">Loading tasks...</div>
      ) : (
        <div className="vwt_content">
          {weeklyTasks.length > 0 ? (
            <>
              <div className="vwt_weekSelector">
                <label htmlFor="week-select" className="vwt_weekLabel">
                  Select Week:
                </label>
                <select
                  id="week-select"
                  className="vwt_weekSelect"
                  value={selectedWeek || ""}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                >
                  {weeklyTasks.map((task) => (
                    <option key={task._id} value={task.weekNumber}>
                      Week {task.weekNumber}: {task.taskName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTask && (
                <div className="vwt_taskCard">
                  <div className="vwt_taskHeader">
                    <h3 className="vwt_taskTitle">{selectedTask.taskName}</h3>
                    <div className="vwt_taskWeek">
                      Week {selectedTask.weekNumber}
                    </div>
                  </div>

                  <div className="vwt_taskDescription">
                    <h4>Submission Description:</h4>
                    <p>{description}</p>
                  </div>

                  <div className="vwt_submissionCount">
                    <span>Submissions: {submissionCount}</span>
                  </div>

                  <div className="vwt_taskActions">
                    <button
                      className="vwt_viewSubmissionsButton"
                      onClick={() => fetchSubmissions(selectedTask.weekNumber)}
                    >
                      View Submissions
                    </button>
                    <button className="vwt_editTaskButton">Edit Task</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="vwt_noTasks">No weekly tasks available</div>
          )}
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
          loading={submissionsLoading}
          onClose={() => setShowSubmissions(false)}
          downloadImage={downloadImage}
        />
      )}
    </div>
  );
};

// Submissions Popup Component
const SubmissionsPopup = ({ submissions, loading, onClose, downloadImage }) => {
  // Function to open image in new tab
  const openImageInNewTab = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  return (
    <div className="vwt_submissionsOverlay">
      <div className="vwt_submissionsContainer">
        <h2 className="vwt_submissionsTitle">Student Submissions</h2>

        {loading ? (
          <div className="vwt_loading">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="vwt_noSubmissions">No submissions yet</div>
        ) : (
          <div className="vwt_submissionsList">
            {submissions.map((submission, index) => (
              <div key={submission._id || index} className="vwt_submissionCard">
                <div className="vwt_submissionHeader">
                  <h3 className="vwt_studentName">{submission.studentName}</h3>
                  <div
                    className={`vwt_submissionStatus vwt_status_${submission.status.toLowerCase()}`}
                  >
                    Status: {submission.status}
                  </div>
                </div>

                <div className="vwt_projectInfo">
                  <strong>Project:</strong> {submission.projectName}
                </div>

                <div className="vwt_submissionDescription">
                  <h4>Description:</h4>
                  <p>{submission.description}</p>
                </div>

                {/* Display Images with Preview and Download Option */}
                {submission.images && submission.images.length > 0 && (
                  <div className="vwt_submissionImages">
                    <h4>Images:</h4>
                    <div className="vwt_imagesContainer">
                      {submission.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="vwt_imagePreview">
                          <img
                            src={img}
                            alt={`Submission ${imgIndex + 1}`}
                            onClick={() => openImageInNewTab(img)}
                            className="vwt_clickableImage"
                          />
                          <div className="vwt_imageActions">
                            <a
                              href={img}
                              className="vwt_downloadButton"
                              download={`image-${imgIndex + 1}.jpg`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) =>
                                downloadImage(
                                  e,
                                  img,
                                  `image-${imgIndex + 1}.jpg`
                                )
                              }
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display Files with Download Option */}
                {submission.files && submission.files.length > 0 && (
                  <div className="vwt_submissionFiles">
                    <h4>Files:</h4>
                    <div className="vwt_filesContainer">
                      {submission.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="vwt_fileInfo">
                          <span className="vwt_fileName">
                            {file.split("/").pop()}
                          </span>
                          <a
                            href={file}
                            className="vwt_downloadButton"
                            download={file.split("/").pop()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show progress percentage if available */}
                {submission.progressPercentage !== undefined && (
                  <div className="vwt_progressContainer">
                    <h4>Progress:</h4>
                    <div className="vwt_progressBar">
                      <div
                        className="vwt_progressFill"
                        style={{ width: `${submission.progressPercentage}%` }}
                      ></div>
                      <span className="vwt_progressLabel">
                        {submission.progressPercentage}%
                      </span>
                    </div>
                  </div>
                )}
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
