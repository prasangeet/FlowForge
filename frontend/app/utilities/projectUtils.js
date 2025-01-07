import axios from "axios";
import toast from "react-hot-toast";
import dotenv from 'dotenv';

dotenv.config();

export const fetchProjectDetails = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access this page");
      return;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/user-projects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ); // Debug response

    if (response.data && response.data.projects) {
      return response.data.projects;
    } else {
      toast.error("No projects found");
      return [];
    }
  } catch (error) {
    console.log("Failed to fetch user projects:", error);
    toast.error("Failed to fetch user projects");
    return [];
  }
};

export const fetchProjectById = async (projectId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized. Please log in.");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

export const addMembers = async (projectId, username, role) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized. Please log in.");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/add-user`,
      {
        projectId: projectId ? projectId : "",
        username: username,
        role: role,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);
  } catch (error) {
    console.error("Error adding members:", error);
    toast.error("Error adding members");
    throw error;
  }
};

export const searchMembers = async (username, existingMembers) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized. Please log in.");
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/search`, {
      params: { username },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const users = response.data.users;

    if (!Array.isArray(users)) {
      throw new Error("Unexpected response format: 'users' is not an array.");
    }

    const existingUsernames = new Set(
      existingMembers.map((user) => user.username)
    );
    return users.filter((user) => !existingUsernames.has(user.username));
  } catch (error) {
    console.error("Error searching members:", error);
    toast.error("Failed to search members");
    throw error;
  }
};

export const removeUser = async (projectId, userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/remove-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId }, // userId should be in the request body here
      }
    );

    if (response.status === 200) {
      toast.success("User removed successfully");
      return true;
    } else {
      toast.error("Failed to remove user. Please try again.");
      return false;
    }
  } catch (error) {
    console.error("Failed to remove user:", error);
    toast.error("Failed to remove user");
    return false;
  }
};

export const fetchActivities = async (projectId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/activities
        `,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data.activity;
    } else {
      toast.error("Failed to fetch activities");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    toast.error("Failed to fetch activities");
    return [];
  }
};
