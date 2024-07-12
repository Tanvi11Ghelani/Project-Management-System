import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  transaction,
  updateTransaction,
  getAllTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post(
  "/transaction",
  isAuthenticated,
  isAuthorized("Admin"),
  transaction
);
router.put(
  "/updateTransaction/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateTransaction
);
router.get(
  "/getAllTransaction",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllTransaction
);

export default router;
