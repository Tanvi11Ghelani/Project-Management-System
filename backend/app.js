import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import projectRouter from "./routes/projectRouter.js";
import moduleRouter from "./routes/moduleRouter.js";
import taskRouter from "./routes/taskRouter.js";
import transactionRouter from "./routes/transactionRouter.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(
  cors({
    origin: ["https://project-management-system-okod.vercel.app"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/module", moduleRouter);
app.use("/api/v1/task", taskRouter);

connectDB();

app.use(errorMiddleware);

export default app;
