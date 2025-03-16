// upto now it is optional and it is not used in the project.

import Submission from "../models/submissionModel.js";
import Project from "../models/projectModel.js";

// Verify Weekly Task Submission (Admin Marks it as Done)
const verifySubmission = async (req, res) => {
    try {
        const { studentID } = req.params;

        // Find the submission
        const updatedSubmission = await Submission.findById(studentID);
        if (!updatedSubmission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        const newProgress = Math.min(updatedSubmission.progressPercentage + 20, 100);

        // Update status and progress percentage
        updatedSubmission.status = "Done";
        updatedSubmission.progressPercentage = newProgress;
        await updatedSubmission.save();

        res.status(200).json({ message: "Submission verified successfully", updatedSubmission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Assign Marks to Students
const assignMarks = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks } = req.body;

        const updatedSubmission = await Submission.findByIdAndUpdate(
            submissionId,
            { marks },
            { new: true }
        );

        if (!updatedSubmission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        res.status(200).json({ message: "Marks assigned successfully", updatedSubmission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get Progress of Students
const getStudentProgress = async (req, res) => {
    try {
        const { projectId } = req.params;

        const submissions = await Submission.find({ projectId });

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({ message: "No submissions found for this project" });
        }

        const progressData = submissions.map((submission) => ({
            studentName: submission.studentName,
            progress: submission.progressPercentage,
            status: submission.status,
            marks: submission.marks || null,
        }));

        res.status(200).json({ progressData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export { verifySubmission, assignMarks, getStudentProgress };
