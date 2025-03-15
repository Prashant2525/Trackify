import express from 'express';
import {submitWeeklyTask} from '../controllers/submissionController.js';
import upload from '../middleware/multer.js';
const submissionRouter = express.Router();

submissionRouter.post('/submit', upload.fields([{name:'image1', maxCount:1}, {name:'image2', maxCount:1}, {name:'projectFile', maxCount:1}]), submitWeeklyTask);

export default submissionRouter;
