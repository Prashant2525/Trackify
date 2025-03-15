import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import projectRouter from "./routes/projectRoute.js";
import submissionRouter from "./routes/submissionRoute.js";

//configuration
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({credentials: true}));

//endpoints
app.use('/api/user', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/submission', submissionRouter)

app.get("/", (req, res) => {})

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
})