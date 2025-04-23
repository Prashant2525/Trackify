import express from 'express';
import { getUser, getUserById, getStudentProjectDetails, loginUser, registerUser, loginAdmin, registerAdmin, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUser);
userRouter.get("/by-id", getUserById)
userRouter.get('/student-project-details', userAuth, getStudentProjectDetails);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin/register', registerAdmin);
userRouter.post('/admin/login', loginAdmin);
userRouter.post('/logout', logout);
userRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
userRouter.post('/verify-account', userAuth, verifyEmail);
userRouter.post('/is-auth', userAuth, isAuthenticated);
userRouter.post('/send-reset-otp', userAuth, sendResetOtp);
userRouter.post('/reset-password', userAuth, resetPassword);


export default userRouter;
