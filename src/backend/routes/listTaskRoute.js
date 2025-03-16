import express from "express";
import { getWeeklyTasks } from "../controllers/listofWeeklyTask.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

const listTaskRouter = express.Router();

listTaskRouter.get("/weekly-tasks", authMiddleware, getWeeklyTasks);

export default listTaskRouter;
