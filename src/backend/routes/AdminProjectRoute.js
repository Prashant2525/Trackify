import express from "express";
import { addProject, listProjects, removeProject } from "../controllers/AdminProjectController.js";
import adminAuth from "../middleware/adminAuth.js";

const AdminProjectRouter = express.Router();

AdminProjectRouter.post("/add",adminAuth, addProject);
AdminProjectRouter.get("/list",adminAuth, listProjects);
// AdminProjectRouter.delete("/remove/:id", removeProject);
AdminProjectRouter.delete("/remove",adminAuth, removeProject);

export default AdminProjectRouter;
