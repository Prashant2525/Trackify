import express from 'express';
import {addProject, listProjects, removeProject} from '../controllers/projectController.js';
import upload from '../middleware/multer.js';

const projectRouter = express.Router();

projectRouter.post('/add', upload.fields([]), addProject);
projectRouter.get('/list', listProjects);
projectRouter.delete('/remove/:id', removeProject);

export default projectRouter;