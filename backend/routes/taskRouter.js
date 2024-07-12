import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  task,
  updateTask,
  deleteTask,
  addTasks,
} from "../controllers/taskController.js";
import { getAllTasks } from "../controllers/taskController.js";

const router = express.Router();

router.post("/task", isAuthenticated, isAuthorized("Admin"), task);
router.put(
  "/updateTask/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateTask
);
// router.get("/task/:moduleId/tasks", isAuthorized, getTasksByModule);
router.delete(
  "/deleteTask/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteTask
);
router.get("/getAllTask", getAllTasks);

//add task
router.post("/addTasks", isAuthenticated, isAuthorized("Admin"), addTasks);

export default router;
