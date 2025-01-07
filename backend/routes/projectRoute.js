import express from "express";
import {
  createProject,
  getUserProjects,
  addUserToProject,
  removeUserFromProject,
  updateUserRoleInProject,
  deleteProject,
  getProjectById,
  getActivities,
} from "../controllers/projectController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a project
router.post("/create", authenticate, createProject);

// Route to get user's projects
router.get("/user-projects", authenticate, getUserProjects);

// Route to add a user to a project
router.post("/add-user", authenticate, addUserToProject);

// Route to remove a user from a project
router.delete("/:projectId/remove-user", authenticate, removeUserFromProject);

// Route to update user role in a project
router.put("/update-role", authenticate, updateUserRoleInProject);

// Route to delete a project
router.delete("/delete/:projectId", authenticate, deleteProject);

router.get("/:projectId", authenticate, getProjectById);

router.get("/:projectId/activities", authenticate, getActivities);

export default router;
