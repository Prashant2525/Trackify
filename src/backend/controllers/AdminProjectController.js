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
            return res.status(400).json({success:true,  message: "Project already exists" });
        }

        const project = new projectModel(projectData);
        await project.save();

        res.status(200).json({success:true,  message: "Project added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false,  message: "Internal Server Error" });
    }
};

const listProjects = async (req, res) => {
    try {
        const projects = await projectModel.find();
        res.status(200).json({success:true, projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false, message: "Internal Server Error" });
    }
};

const removeProject = async (req, res) => {
    try {
        //One way to delete a project
        // const { id } = req.params;

        //Another way to delete a project
        const { id } = req.body;
        const deletedProject = await projectModel.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({success:true,  message: "Project not found" });
        }

        res.status(200).json({success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false,  message: "Internal Server Error" });
    }
};

export { addProject, listProjects, removeProject };
