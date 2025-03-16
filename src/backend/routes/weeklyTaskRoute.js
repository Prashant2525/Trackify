import express from "express";
import { createWeeklyTask, getStudentProgress, verifyWeeklyTask} from "../controllers/weeklyTaskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const weeklyTaskRouter = express.Router();

weeklyTaskRouter.post("/create", authMiddleware, createWeeklyTask);
weeklyTaskRouter.get("/progress", authMiddleware, getStudentProgress);
weeklyTaskRouter.patch("/verify/:taskId/:studentId", authMiddleware, verifyWeeklyTask);

export default weeklyTaskRouter;