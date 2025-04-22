import express from "express";
import { addProject, listProjects, removeProject } from "../controllers/AdminProjectController.js";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";

const AdminProjectRouter = express.Router();

AdminProjectRouter.post("/add",adminAuth, addProject);
AdminProjectRouter.get("/list",userAuth, listProjects);
AdminProjectRouter.post("/remove", removeProject);
AdminProjectRouter.delete("/remove",adminAuth, removeProject);

export default AdminProjectRouter;
