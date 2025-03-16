import express from "express";
import { takeProject, joinProject } from "../controllers/StudentProjectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const StudentProjectRouter = express.Router();

StudentProjectRouter.post("/take", authMiddleware, takeProject);
StudentProjectRouter.post("/join", authMiddleware, joinProject);


export default StudentProjectRouter;
