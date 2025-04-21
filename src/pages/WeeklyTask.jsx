import React, { useState } from 'react';
import './css/WeeklyTask.css';

const WeeklyTask = ({ onClose }) => {
  const [weekNumber, setWeekNumber] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle weekly task creation logic
    console.log("Adding weekly task:", { weekNumber, taskTitle, taskDescription });
    onClose();
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
          <div className="vwt_submissionsFooter">
          <button className="vwt_closeSubmissionsButton" onClick={onClose}>
            Close
          </button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default WeeklyTask;