import projectModel from "../models/projectModel.js";
import crypto from "crypto";


const takeProject = async (req, res) => {
    try {
        const { projectId } = req.body;

        // Get logged-in user details (assumes req.user is populated via auth middleware)
        const userId = req.user.id;

        // Check if the user is already in any project (either as a leader or a student)
        const existingProject = await projectModel.findOne({
            $or: [{ leader: userId }, { students: userId }]
        });

        if (existingProject) {
            return res.status(400).json({ message: "You have already taken or joined a project and cannot take another." });
        }

        //Check if project is taken by the user
        const projectTaken = await projectModel.findById(projectId);

        if (!projectTaken) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (projectTaken.leader && projectTaken.leader.toString() === userId.toString()) {
            return res.status(400).json({ message: "You are the leader of this project" });
        }
        

        if (projectTaken.students.includes(userId)) {
            return res.status(400).json({ message: "You have already taken this project" });
        }

        if (projectTaken.slotsFilled >= projectTaken.slotsAvailable) {
            return res.status(400).json({ message: "No slots available for this project" });
        }


        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.slotsFilled >= project.slotsAvailable) {
            return res.status(400).json({ message: "No slots available for this project" });
        }

        if (project.slotsFilled === 0) {
            project.leader = userId;
            project.joinCode = crypto.randomBytes(4).toString("hex"); //join code
        }

        if (!project.students.includes(userId)) {
            project.students.push(userId);
            project.slotsFilled += 1;
        }

        await project.save();

        res.status(200).json({ message: "Project taken successfully", joinCode: project.joinCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const joinProject = async (req, res) => {
    try {
        const { joinCode } = req.body;

        const userId = req.user.id;

        const existingProject = await projectModel.findOne({
            $or: [{ leader: userId }, { students: userId }]
        });

        if (existingProject) {
            return res.status(400).json({ message: "You have already taken or joined a project and cannot join another." });
        }


        const project = await projectModel.findOne({ joinCode });
        if (!project) {
            return res.status(404).json({ message: "Invalid join code or project not found" });
        }

        if (project.slotsFilled >= project.slotsAvailable) {
            return res.status(400).json({ message: "No slots available for this project" });
        }

        if (project.students.includes(userId)) {
            return res.status(400).json({ message: "You have already joined this project" });
        }

        project.students.push(userId);
        project.slotsFilled += 1;

        await project.save();

        res.status(200).json({ message: "Project joined successfully", projectName: project.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export { takeProject, joinProject };
