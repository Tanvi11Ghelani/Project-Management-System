import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  postProject,
  updateProject,
  getAllProjects,
  deleteProject,
  getSingleProject,
  projects,
  createProject,
  addProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post(
  "/postProject",
  isAuthenticated,
  isAuthorized("Admin"),
  postProject
);
router.put(
  "/updateProject/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateProject
);
router.get("/getAllProjects", getAllProjects);
router.delete(
  "/deleteProject/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteProject
);

router.get(
  "/getSingleProject/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  getSingleProject
);

router.get("/projects/:id/modules", projects);

//add project
router.post("/addProject", isAuthenticated, isAuthorized("Admin"), addProject);

export default router;
