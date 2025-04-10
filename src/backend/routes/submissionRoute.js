import express from 'express';
import { submitWeeklyTask,  getSubmissionsByWeek} from '../controllers/submissionController.js';
import upload from '../middleware/multer.js';
import authMiddleware from '../middleware/authMiddleware.js';
import userAuth from '../middleware/userAuth.js';
const submissionRouter = express.Router();

submissionRouter.post('/submit', userAuth, upload.fields([
    { name: 'image1', maxCount: 1 }, 
    { name: 'image2', maxCount: 1 },
    { name:'projectFile1', maxCount: 1 },
    { name:'projectFile2', maxCount: 1 }
]), submitWeeklyTask);

submissionRouter.get("/:weekNumber", userAuth, getSubmissionsByWeek);

export default submissionRouter;
