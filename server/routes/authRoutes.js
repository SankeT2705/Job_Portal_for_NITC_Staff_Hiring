import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  requestAdminAccess,
  getAdminRequests,
  handleAdminRequest,
} from "../controllers/authController.js";
import { updatePassword } from "../controllers/authController.js";
import { forgotPassword } from "../controllers/authController.js";  // Import controller


const router = express.Router();
router.put("/update-password", protect, updatePassword);
// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.get("/profile", protect, getProfile);

router.post("/request-admin", requestAdminAccess);   // User requests admin
router.get("/admin-requests", getAdminRequests);     // Super admin fetches requests
router.post("/handle-admin-request/:id", handleAdminRequest); // Accept/Reject
router.post("/forgot-password", forgotPassword);
export default router;
