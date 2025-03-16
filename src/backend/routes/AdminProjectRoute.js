import express from "express";
import { addProject, listProjects, removeProject } from "../controllers/AdminProjectController.js";

const AdminProjectRouter = express.Router();

AdminProjectRouter.post("/add", addProject);
AdminProjectRouter.get("/list", listProjects);
AdminProjectRouter.delete("/remove/:id", removeProject);

export default AdminProjectRouter;
