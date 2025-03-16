import projectModel from "../models/projectModel.js";

const addProject = async (req, res) => {
    try {
        const { name, description, slotsAvailable } = req.body;

        const projectData = {
            name,
            description,
            slotsAvailable,
        };
        
        const projectExists = await projectModel.findOne({ name: name });

        if (projectExists) {
            return res.status(400).json({ message: "Project already exists" });
        }

        const project = new projectModel(projectData);
        await project.save();

        res.status(200).json({ message: "Project added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const listProjects = async (req, res) => {
    try {
        const projects = await projectModel.find();
        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const removeProject = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProject = await projectModel.findByIdAndDelete(id);
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export { addProject, listProjects, removeProject };
