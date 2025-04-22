import React, { useContext, useEffect, useRef, useState } from "react";
import "./css/WeeklyTask.css";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import ViewTask from "./ViewTask";

const WeeklyTask = ({ onClose }) => {
  const { backendUrl } = useContext(AppContext);

  const [weekNumber, setWeekNumber] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [showWeeklyTask, setShowWeeklyTask] = useState(false);

  const viewTaskRef = useRef(null);

  // Handle clicks outside of pop-ups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showWeeklyTask &&
        viewTaskRef.current &&
        !viewTaskRef.current.contains(event.target)
      ) {
        setShowWeeklyTask(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWeeklyTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      const payload = {
        weekNumber: weekNumber,
        taskName: taskTitle,
        taskDescription: taskDescription,
      };
      console.log(payload);

      const { data } = await axios.post(
        backendUrl + "/api/weekly-tasks/create",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("🛠 POST /api/weekly-tasks/create →", data.status, data.data);
      toast.success(data.message);
    } catch (error) {
      console.error(
        "Error response:",
        error.response ? error.response.data : error.message
      );
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="wt_container">
      <h2 className="wt_title">Add Weekly Task</h2>

      <form onSubmit={handleSubmit} className="wt_form">
        <div className="wt_formGroup">
          <label className="wt_label">Week Number:</label>
          <input
            type="number"
            className="wt_input"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="wt_formGroup">
          <label className="wt_label">Task Title:</label>
          <input
            type="text"
            className="wt_input"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
        </div>

        <div className="wt_formGroup">
          <label className="wt_label">Task Description:</label>
          <textarea
            className="wt_textarea"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows="5"
            required
          />
        </div>

        <div className="wt_buttonGroup">
          <button type="submit" className="wt_addButton">
            Add Task
          </button>
          <button
            type="button"
            className="ap_editButton"
            onClick={() => setShowWeeklyTask(true)}
          >
            View/Edit Existing Task
          </button>
          <div className="vwt_submissionsFooter">
            <button className="vwt_closeSubmissionsButton" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </form>

      {/* Pop-up components */}
      {showWeeklyTask && (
        <div className="ad_popupOverlay">
          <div ref={viewTaskRef}>
            <ViewTask onClose={() => setShowWeeklyTask(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyTask;
