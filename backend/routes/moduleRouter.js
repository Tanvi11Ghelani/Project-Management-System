import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  postModule,
  updateModule,
  getAllModules,
  deleteModule,
  modules,
  addModules,
} from "../controllers/moduleController.js";

const router = express.Router();

router.post("/postModule", isAuthenticated, isAuthorized("Admin"), postModule);
router.put(
  "/updateModule/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateModule
);
router.get("/getAllModule", getAllModules);
router.delete(
  "/deleteModule/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteModule
);

router.get("/modules/:moduleId/tasks", modules);
router.post("/addmodules", isAuthenticated, isAuthorized("Admin"), addModules);
export default router;
