import express from "express";
import { getWeeklyTasks, singleTask } from "../controllers/listofWeeklyTaskController.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

const listTaskRouter = express.Router();

listTaskRouter.get("/weekly-tasks", authMiddleware, getWeeklyTasks);
listTaskRouter.get("/single-task", authMiddleware, singleTask);

export default listTaskRouter;
