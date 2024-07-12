import {
  register,
  login,
  logout,
  getUser,
  getClient,
  addClient,
} from "../controllers/userController.js";
import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getUser", isAuthenticated, getUser);
router.get("/getClients", isAuthenticated, isAuthorized("Admin"), getClient);
router.post("/addClient", isAuthenticated, isAuthorized("Admin"), addClient);

export default router;
