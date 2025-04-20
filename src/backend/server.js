import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import AdminProjectRouter from "./routes/AdminProjectRoute.js";
import submissionRouter from "./routes/submissionRoute.js";
import markingRouter from "./routes/markingAndVerificationRoute.js";
import StudentProjectRouter from "./routes/StudentProjectRoute.js";
import weeklyTaskRouter from "./routes/weeklyTaskRoute.js";
import listTaskRouter from "./routes/listTaskRoute.js";

//configuration
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

const allowedOrigins = ['http://localhost:5173']

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

//endpoints
app.use('/api/user', userRouter);
app.use('/api/projects', AdminProjectRouter);
app.use('/api/projects', StudentProjectRouter);
app.use('/api/submission', submissionRouter);
// app.use('/api/marking', markingRouter);
app.use('/api/weekly-tasks', weeklyTaskRouter);
app.use('/api/list', listTaskRouter);

app.get("/", (req, res) => {})

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
})