import express from 'express';
import { loginUser, registerUser, loginAdmin, registerAdmin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin/register', registerAdmin);
userRouter.post('/admin/login', loginAdmin);

export default userRouter;
