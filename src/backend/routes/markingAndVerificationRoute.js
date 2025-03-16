import express from "express";
import { verifySubmission, assignMarks, getStudentProgress } from "../controllers/markingAndVerificationController.js";

const markingRouter = express.Router();

// Verify weekly task submission
markingRouter.patch("/verify/:submissionId", verifySubmission);

// Assign marks to students
markingRouter.patch("/assign-marks/:submissionId", assignMarks);

// Get progress of students in a project
markingRouter.get("/progress/:projectId", getStudentProgress);

export default markingRouter;
