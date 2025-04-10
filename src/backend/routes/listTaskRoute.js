import express from "express";
import { getWeeklyTasks, singleTask } from "../controllers/listofWeeklyTaskController.js";
import  authMiddleware  from "../middleware/authMiddleware.js";
import userAuth from "../middleware/userAuth.js";

const listTaskRouter = express.Router();

listTaskRouter.get("/weekly-tasks", userAuth, getWeeklyTasks);
listTaskRouter.get("/single-task", userAuth, singleTask);

export default listTaskRouter;
