import express from "express";
import multer from "multer";
import { authenticate } from "../middlewares/authMiddleware.js";
import { updateProfile } from "../controllers/updateprofileController.js";

// Set up multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("profilePicture");

// Create router instance
const router = express.Router();

// Define the profile update route
router.put("/update", authenticate, upload, updateProfile);

export default router;
