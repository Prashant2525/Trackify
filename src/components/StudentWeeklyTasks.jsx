// Fetching Weekly Tasks & Allowing Submission

import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentWeeklyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await axios.get("/api/weekly-tasks");
                setTasks(data.tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    const handleSubmit = async () => {
        if (!selectedTask) {
            alert("Please select a task to submit.");
            return;
        }

        const formData = new FormData();
        formData.append("taskId", selectedTask._id); // Auto-attached when clicking a task
        formData.append("description", description);
        formData.append("file", file);

        try {
            await axios.post("/api/submissions/submit", formData);
            alert("Task submitted successfully!");
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold mb-4">Weekly Tasks</h2>
            
            <ul className="mb-4">
                {tasks.map((task) => (
                    <li 
                        key={task._id} 
                        onClick={() => setSelectedTask(task)}
                        className={`cursor-pointer p-2 border rounded ${selectedTask?._id === task._id ? 'bg-blue-200' : ''}`}
                    >
                        Week {task.weekNumber}: {task.taskName}
                    </li>
                ))}
            </ul>

            {selectedTask && (
                <div>
                    <h3 className="font-semibold">Submit Task: {selectedTask.taskName}</h3>
                    <textarea 
                        className="w-full border p-2 my-2"
                        placeholder="Write description..."
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} className="my-2" />
                    <button 
                        onClick={handleSubmit} 
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentWeeklyTasks;
