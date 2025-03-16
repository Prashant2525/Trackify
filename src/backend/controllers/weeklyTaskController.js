import WeeklyTask from "../models/weeklyTaskModel.js";
import Submission from "../models/submissionModel.js";
import User from "../models/userModel.js";
import Project from "../models/projectModel.js";

const createWeeklyTask = async (req, res) => {
    try {
        const { weekNumber, taskName } = req.body;

        const weekExist = await WeeklyTask.findOne({ weekNumber });

        if (weekExist) {
            return res.status(400).json({ succuss: false, message: "Weekly Task already exists!" })
        }

        if (req.user.isAdmin === false) {
            return res.status(403).json({ message: "Only admins can create tasks" });
        }

        const newTask = new WeeklyTask({ weekNumber, taskName });
        await newTask.save();

        res.status(201).json({ message: "Weekly Task Created", weeklyTask: newTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyWeeklyTask = async (req, res) => {
    try {
        const { taskId, studentId } = req.params;

        const weeklyTask = await WeeklyTask.findById(taskId);
        if (!weeklyTask) {
            return res.status(404).json({ message: "Weekly Task not found" });
        }

        const submission = await Submission.findOne({
            studentID: studentId,
            taskId: taskId
        });

        console.log("Submission Found:", submission);

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        if (submission.status === "Done") {
            return res.status(400).json({ message: "Submission already verified" });
        }

        // Update Submission Status
        submission.status = "Done";
        submission.progressPercentage = 100;
        await submission.save();

        // Update Weekly Task Submission Status
        const submissionIndex = weeklyTask.submissions.findIndex(sub => sub.studentId.toString() === studentId);
        if (submissionIndex !== -1) {
            weeklyTask.submissions[submissionIndex].submissionStatus = "Done";
            await weeklyTask.save();
        }

        res.status(200).json({ message: "Submission Verified", submission });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// (List of Students Who Submitted) it is reflected in admin portal inside student details
const getStudentProgress = async (req, res) => {
    try {
        const students = await User.find({ isAdmin: false });

        if (!students.length) {
            return res.status(404).json({ message: "No students found" });
        }

        let studentProgress = await Promise.all(students.map(async (student) => {
            const submissions = await Submission.find({ studentID: student._id });

            let totalTasks = await WeeklyTask.countDocuments();
            let completedTasks = submissions.filter(sub => sub.status === "Done").length;
            let progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return {
                studentId: student._id,
                studentName: student.name,
                submittedTasks: submissions.map(sub => ({
                    taskName: sub.taskName,
                    status: sub.status,
                    progressPercentage: sub.progressPercentage,
                })),
                overallProgress: `${progressPercentage.toFixed(2)}%`
            };
        }));

        res.status(200).json({ studentProgress });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { createWeeklyTask, verifyWeeklyTask, getStudentProgress };
