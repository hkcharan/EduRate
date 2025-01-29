import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  verifyCollegeEmail,
  saveCollege,
  removeSavedCollege,
  getUsers,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-college-email/:id", isAuthenticated,verifyCollegeEmail);
router.post("/otp-verification",isAuthenticated, verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.get("/users",isAuthenticated, getUsers)
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.post("/save-college", isAuthenticated, saveCollege);
router.delete("/remove-college/:collegeId", isAuthenticated, removeSavedCollege);

export default router;