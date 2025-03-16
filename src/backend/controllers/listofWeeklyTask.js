// list of weekly tasks for student to see the tasks

import weeklyTaskModel from "../models/weeklyTaskModel.js";

const getWeeklyTasks = async (req, res) => {
    try {
        const tasks = await weeklyTaskModel.find({});

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No weekly tasks found." });
        }

        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export { getWeeklyTasks };
