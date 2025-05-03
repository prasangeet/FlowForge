import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createTask,
  deleteTask,
  editTask,
  fetchUpdates,
  getAllTasks,
  getRecentDeadlines,
  gettaskDetails,
  getTasks,
  UpdateExpiredTasks,
  updateTaskNotes,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/:projectId/tasks", authenticate, createTask);

router.get("/:projectId/tasks", authenticate, getTasks);

router.get("/:projectId/tasks/:taskId", authenticate, gettaskDetails);

router.put("/:projectId/tasks/:taskId", authenticate, editTask);

router.delete("/:projectId/tasks/:taskId", authenticate, deleteTask);

router.post("/:projectId/tasks/:taskId/updates", authenticate, updateTaskNotes);

router.get("/:projectId/tasks/:taskId/updates", authenticate, fetchUpdates);

router.get("/tasks/recent-deadlines", authenticate, getRecentDeadlines);

router.get("/tasks/allTasks", authenticate, getAllTasks);

router.get("/tasks/expiredTasks",authenticate, UpdateExpiredTasks);

export default router;
