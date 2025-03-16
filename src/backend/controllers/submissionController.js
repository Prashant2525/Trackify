import { v2 as cloudinary } from "cloudinary";
import submissionModel from "../models/submissionModel.js";
import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import weeklyTaskModel from "../models/weeklyTaskModel.js";

const submitWeeklyTask = async (req, res) => {
    try {
        const { description, taskId } = req.body;
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        const project = await projectModel.findOne({ students: userId });

        if (!project || !user) {
            return res.status(404).json({ message: "User or Project not found" });
        }

        const weeklyTask = await weeklyTaskModel.findById(taskId);
        if (!weeklyTask) {
            return res.status(404).json({ message: "Weekly Task not found" });
        }

        const alreadySubmitted = await submissionModel.findOne({ studentID: userId, projectId: project._id });

        if (alreadySubmitted) {
            return res.status(400).json({
                success: false,
                message: `You have already submitted this week's task. Status: ${alreadySubmitted.status}`
            });
        }

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];

        const projectFile1 = req.files.projectFile1 && req.files.projectFile1[0];
        const projectFile2 = req.files.projectFile2 && req.files.projectFile2[0];

        const images = [image1, image2].filter((item) => item !== undefined);
        const files = [projectFile1, projectFile2].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        let fileUrl = await Promise.all(
            files.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'raw' });
                return result.secure_url;
            })
        );

        const submissionData = {
            studentName: user.name,
            studentID: user._id,
            taskId,
            weekNumber: weeklyTask.weekNumber,
            taskName: weeklyTask.taskName,
            projectName: project.name,
            projectId: project._id,
            description,
            images: imagesUrl,
            files: fileUrl,
            status: "Pending",
            progressPercentage: 0,
        };

        const submission = new submissionModel(submissionData);
        await submission.save();

        await weeklyTaskModel.findByIdAndUpdate(taskId, {
            $push: {
                submissions: {
                    studentId: user._id,
                    studentName: user.name,
                    submissionStatus: "Pending",
                    submissionFiles: fileUrl,
                    description,
                    projectName: project.name,
                },
            },
        });

        res.status(200).json({ message: "Task submitted successfully and updated in Weekly Task model." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


// Get all student submissions for a given weekly task (Admin)
const getSubmissionsByWeek = async (req, res) => {
    try {
        const { weekNumber } = req.params;

        const submissions = await submissionModel.find({ weekNumber });

        if (submissions.length === 0) {
            return res.status(404).json({ message: "No submissions found for this week." });
        }

        res.status(200).json({ success: true, submissions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export { submitWeeklyTask, getSubmissionsByWeek };