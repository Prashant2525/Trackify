import express from "express";
import { takeProject, joinProject } from "../controllers/StudentProjectController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import userAuth from "../middleware/userAuth.js";

const StudentProjectRouter = express.Router();

StudentProjectRouter.post("/take", userAuth, takeProject);
StudentProjectRouter.post("/join", userAuth, joinProject);


export default StudentProjectRouter;
