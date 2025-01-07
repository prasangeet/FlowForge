import { auth, db, FieldValue } from "../config/firebase.js";
import dotenv from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";
import { addActivity } from "./handleActivities.js";

dotenv.config();

export const createProject = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  try {
    const projectRef = db.collection("projects").doc();
    const projectId = projectRef.id;

    const projectDetails = {
      id: projectId,
      title,
      description,
      createdBy: userId,
    };

    await projectRef.set({
      ...projectDetails,
      createdAt: new Date(),
      users: [
        {
          userId,
          role: "admin",
        },
      ],
      tasks: [],
    });

    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      projects: FieldValue.arrayUnion(projectDetails), // Use FieldValue here
    });

    res.status(201).json({
      message: "Project created successfully",
      projectId,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project" });
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Validate projectId
    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ error: "Invalid or missing projectId" });
    }

    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectData = projectDoc.data();

    const userDetails = [];
    if (projectData.users && Array.isArray(projectData.users)) {
      for (const user of projectData.users) {
        const { userId, role } = user;

        // Validate userId
        if (!userId || typeof userId !== "string") {
          console.error("Invalid userId:", userId);
          continue;
        }

        const userDoc = await db.collection("users").doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          let profilePictureUrl = userData.profilePicture || "";

          // Fetch GitHub profile picture if the user has one
          if (profilePictureUrl) {
            const filePath = profilePictureUrl.split("blob/main/")[1];
            if (filePath) {
              const githubApiUrl = `https://api.github.com/repos/prasangeet/profile-pictures/contents/${filePath}`;

              try {
                const response = await axios.get(githubApiUrl, {
                  headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                  },
                });
                profilePictureUrl = response.data.download_url;
              } catch (error) {
                console.warn(`Failed to fetch GitHub image for user ${userId}`);
                profilePictureUrl = ""; // Fallback to empty if error occurs
              }
            }
          }

          userDetails.push({
            id: userId,
            ...userData,
            role,
            profilePicture: profilePictureUrl,
          });
        } else {
          console.warn(`User document not found for userId: ${userId}`);
        }
      }
    }

    return res.status(200).json({
      id: projectId,
      title: projectData.title,
      description: projectData.description,
      createdBy: projectData.createdBy,
      createdAt: projectData.createdAt,
      users: userDetails,
      tasks: projectData.tasks || [],
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserProjects = async (req, res) => {
  const userId = req.user.id;

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const projects = userData.projects;

    if (!projects || projects.length === 0) {
      return res
        .status(200)
        .json({ message: "No projects found for this user", projects: [] });
    }

    res.status(200).json({
      message: "User projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ error: "Error fetching user projects" });
  }
};

export const addUserToProject = async (req, res) => {
  const { projectId, username, role } = req.body;
  const authenticatedUserId = req.user.id;

  console.log("Request body:", req.body);

  if (!projectId || !username || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Fetch userId using username
    const userQuery = await db
      .collection("users")
      .where("username", "==", username)
      .get();
    if (userQuery.empty) {
      return res.status(404).json({ error: "User not found" });
    }
    const userDoc = userQuery.docs[0];
    const userId = userDoc.id;

    // Check if the authenticated user is adding themselves
    if (userId === authenticatedUserId) {
      return res.status(400).json({
        error: "You cannot add yourself to the project",
      });
    }

    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectData = projectDoc.data();

    // Check if the user is already part of the project
    const userAlreadyInProject = projectData.users.some(
      (user) => user.userId === userId
    );
    if (userAlreadyInProject) {
      return res.status(400).json({
        error: `User ${username} is already part of this project`,
      });
    }

    // Construct project details using the project data
    const projectDetails = {
      id: projectDoc.id,
      title: projectData.title,
      description: projectData.description,
      createdBy: projectData.createdBy,
    };

    const authenticatedUserRole = projectData.users.find(
      (user) => user.userId === authenticatedUserId
    )?.role;

    if (authenticatedUserRole !== "admin") {
      return res.status(403).json({
        error: "You do not have permission to add users to this project",
      });
    }

    // Add the user to the project
    projectData.users.push({ userId, role });
    await projectRef.update({ users: projectData.users });

    // Update the user's projects field
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      projects: FieldValue.arrayUnion(projectDetails),
    });

    await addActivity(projectId, authenticatedUserId, `Added user ${username}`)

    res
      .status(200)
      .json({ message: `User ${username} added to the project as ${role}` });
  } catch (error) {
    console.error("Error adding user to project:", error);
    res.status(500).json({ error: "Error adding user to project" });
  }
};

export const removeUserFromProject = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;
  const authenticatedUserId = req.user.id;

  if (!projectId || !userId) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectData = projectDoc.data();

    const authenticatedUserRole = projectData.users.find(
      (user) => user.userId === authenticatedUserId
    )?.role;
    if (authenticatedUserRole !== "admin") {
      return res.status(403).json({
        error: "You do not have permission to remove users from this project",
      });
    }

    projectData.users = projectData.users.filter(
      (user) => user.userId !== userId
    );
    await projectRef.update({ users: projectData.users });

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    userData.projects = userData.projects.filter(
      (project) => project.id !== projectId
    );
    await userRef.update({ projects: userData.projects });

    await addActivity(projectId, authenticatedUserId, "Removed User: " + userId);

    res
      .status(200)
      .json({ message: `User ${userId} removed from the project` });
  } catch (error) {
    console.error("Error removing user from project:", error);
    res.status(500).json({ error: "Error removing user from project" });
  }
};

export const updateUserRoleInProject = async (req, res) => {
  const { projectId, userId, newRole } = req.body;
  const authenticatedUserId = req.user.id;

  if (!projectId || !userId || !newRole) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectData = projectDoc.data();

    // Only allow an admin to update the role of a user
    const authenticatedUserRole = projectData.users.find(
      (user) => user.userId === authenticatedUserId
    )?.role;
    if (authenticatedUserRole !== "admin") {
      return res.status(403).json({
        error:
          "You do not have permission to update user roles in this project",
      });
    }

    const userIndex = projectData.users.findIndex(
      (user) => user.userId == userId
    );

    if (userIndex !== -1) {
      projectData.users[userIndex].role = newRole;
      await projectRef.update({ users: projectData.users });

      await addActivity(projectId, authenticatedUserId, `Updated User Role: ${userId} to ${newRole}`);
      res.status(200).json({ message: `User role updated to ${newRole}` });
    } else {
      res.status(404).json({ error: "User not found in the project" });
    }
  } catch (error) {
    console.error("Error updating user role in project:", error);
    res.status(500).json({ error: "Error updating user role in project" });
  }
};

export const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  const authenticatedUserId = req.user.id; // Ensure the user is authenticated and their ID is available

  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  try {
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      console.log("Project not found");
      return res.status(404).json({ error: "Project not found" });
    }

    const projectData = projectDoc.data();

    // Find authenticated user role
    const authenticatedUserRole = projectData.users.find(
      (user) => user.userId === authenticatedUserId
    )?.role;

    // Check if the authenticated user has admin privileges
    if (authenticatedUserRole !== "admin") {
      console.log("Permission denied for user:", authenticatedUserId);
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this project" });
    }

    // Delete the project
    await projectRef.delete();

    // Get user IDs from the project data
    const usersToUpdate = projectData.users.map((user) => user.userId);
    // Update each user's `projects` array to remove the deleted project
    for (const userId of usersToUpdate) {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const updatedProjects = userData.projects
          ? userData.projects.filter((project) => project.id !== projectId)
          : [];

        // Update the user's document with the new list of projects
        await userRef.update({ projects: updatedProjects });
      } else {
        console.log(`User ${userId} not found`);
      }
    }

    // Respond with a success message
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Error deleting project" });
  }
};

export const getActivities = async (req, res) => {
  const { projectId } = req.params;

  try {
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const activityLog = projectDoc.data().activity || [];
    res.status(200).json({
      activity: activityLog,
    });
  } catch (error) {
    console.log("Error fetching activities", error);
    res.status(500).json({ error: "Internal server error" });
  }
};