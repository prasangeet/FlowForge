import axios from "axios";
import { db, FieldValue } from "../config/firebase.js";
import dotenv from "dotenv";
import { format } from "date-fns"; // Importing date-fns for formatting
import { addActivity } from "./handleActivities.js";


dotenv.config();

export const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, status, dueDate } = req.body;
  const authenticateUserId = req.user.id;

  if (!title || !description || !assignedTo) {
    return res.status(400).json({
      error: "Title, Description and assignedTo should not be missing",
    });
  }

  try {
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const taskRef = projectRef.collection("tasks").doc();
    const taskId = taskRef.id;

    const projectData = projectDoc.data();

    const authenticateuserRole = projectData.users.find(
      (user) => user.userId === authenticateUserId
    )?.role;

    if (authenticateuserRole !== "admin") {
      return res.status(403).json({
        error: "You are not authorized to create a task",
      });
    }

    const isAssigneeInProject = projectData.users.some(
      (user) => user.userId === assignedTo
    );

    if (!isAssigneeInProject) {
      return res
        .status(400)
        .json({ error: "Assignee must be a member of the project" });
    }

    const taskData = {
      id: taskId,
      title,
      description,
      assignedTo: assignedTo,
      status: status || "pending",
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: new Date(),
    };

    await taskRef.set(taskData);

    await addActivity(projectId, authenticateUserId, `Created a task: ${title}`);

    res.status(201).json({
      message: "Task created successfully",
      taskData,
    });
  } catch (error) {
    console.log("Error creating task", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const tasksSnapshot = await projectRef.collection("tasks").get();
    const tasks = [];

    for (const taskDoc of tasksSnapshot.docs) {
      const taskData = taskDoc.data();

      const userRef = db.collection("users").doc(taskData.assignedTo);
      const userDoc = await userRef.get();

      const username = userDoc.exists
        ? userDoc.data().username
        : "Unknown User";

      tasks.push({
        ...taskData,
        assignedTo: username,
        // Convert dueDate (Firestore Timestamp) to readable format
        dueDate: taskData.dueDate
          ? format(taskData.dueDate.toDate(), "MM/dd/yyyy")
          : "No Due Date",
      });
    }

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    console.log("Error retrieving tasks", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const gettaskDetails = async (req, res) => {
  const { projectId, taskId } = req.params;

  try {
    const taskRef = db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId);

    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    const taskData = taskDoc.data();

    // Convert dueDate (Firestore Timestamp) to readable format
    const formattedDueDate = taskData.dueDate
      ? format(taskData.dueDate.toDate(), "MM/dd/yyyy")
      : "No Due Date";

    res
      .status(200)
      .json({ taskData: { ...taskData, dueDate: formattedDueDate } });
  } catch (error) {
    console.log("Error retrieving task details", error);
    res.status(500).json({ error: "Error retrieving task" });
  }
};

export const editTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  const updates = req.body;

  try {
    const taskRef = db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId);

    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    await taskRef.update({
      ...updates,
      // assignedTo: userSnapshot.docs[0].data().id,
      dueDate: updates.dueDate ? new Date(updates.dueDate) : null,
      updatedAt: new Date(),
    });

    await addActivity(projectId, req.user.id, `Edited task: ${taskDoc.data().title}`);

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log("Error editing task: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTaskNotes = async (req, res) => {
  const { projectId, taskId } = req.params;
  const { note, userId, username } = req.body;

  if (!note || !userId || !username) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const taskRef = db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId);

    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newNote = {
      note,
      addedBy: { userId, username },
      createdAt: new Date(),
    };

    await taskRef.update({
      updates: FieldValue.arrayUnion(newNote),
    });

    res
      .status(200)
      .json({ message: "Note added to task updates successfully" });
  } catch (error) {
    console.log("Error updating task notes: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchUpdates = async( req, res) => {
  const {projectId, taskId} = req.params;

  try{
    const taskRef = db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId);

    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    const taskData = taskDoc.data();
    const updates = taskData.updates || [];
    res
      .status(200)
      .json({updates });
  }catch(error){
    console.log("Error fetching task updates: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteTask = async (req, res) => {
  const { projectId, taskId } = req.params;

  try {
    const taskRef = db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId);

    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    await addActivity(projectId, req.user.id, `Deleted task: ${taskDoc.data().title}`);

    await taskRef.delete();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("Error deleting task: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


