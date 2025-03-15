

// add project
const addProject = async (req, res) => {
    try {

        const { name, description, slots } = req.body;

        console.log(name, description, slots)

        res.status(200).json({ message: "Project Details Added Successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// list projects
const listProjects = async (req, res) => {

}

// remove project
const removeProject = async (req, res) => {

}

export { addProject, listProjects, removeProject };