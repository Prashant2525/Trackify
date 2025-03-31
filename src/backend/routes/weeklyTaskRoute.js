import express from "express";
import { createWeeklyTask, getStudentProgress, verifyWeeklyTask} from "../controllers/weeklyTaskController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";

const weeklyTaskRouter = express.Router();

weeklyTaskRouter.post("/create", adminAuth, createWeeklyTask);
weeklyTaskRouter.get("/progress", adminAuth, getStudentProgress);
weeklyTaskRouter.patch("/verify/:taskId/:studentId", adminAuth, verifyWeeklyTask);

export default weeklyTaskRouter;