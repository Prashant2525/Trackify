// In the Admin Dashboard, when the admin clicks "Student Details", they will see all student submissions for a specific week.

import React, { useState, useEffect } from "react";
import axios from "axios";

const SubmissionList = () => {
    const [weekNumber, setWeekNumber] = useState("");
    const [submissions, setSubmissions] = useState([]);

    const fetchSubmissions = async () => {
        try {
            const { data } = await axios.get(`/api/submissions/${weekNumber}`);
            setSubmissions(data.submissions);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold mb-4">Student Submissions</h2>

            <select 
                className="p-2 border rounded mb-4"
                value={weekNumber} 
                onChange={(e) => setWeekNumber(e.target.value)}
            >
                <option value="">Select Week</option>
                <option value="1">Week 1: DFD Diagram</option>
                <option value="2">Week 2: Use Case Diagram</option>
            </select>

            <button 
                onClick={fetchSubmissions} 
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Fetch Submissions
            </button>

            {submissions.length > 0 ? (
                <div className="mt-4">
                    {submissions.map((submission) => (
                        <div key={submission._id} className="border p-4 mb-2 rounded">
                            <h3 className="font-bold">{submission.studentName}</h3>
                            <p>Week: {submission.weekNumber} - {submission.taskName}</p>
                            <p>Status: {submission.status}</p>

                            <div className="mt-2">
                                <h4 className="font-semibold">Files:</h4>
                                {submission.files.map((file, index) => (
                                    <a key={index} href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 block">
                                        File {index + 1}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No submissions found.</p>
            )}
        </div>
    );
};

export default SubmissionList;
