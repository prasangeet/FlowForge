import axios from "axios";
import toast from "react-hot-toast";
import dotenv from "dotenv";

dotenv.config();

export const addTask = async (projectId, taskData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access this page");
      return;
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status == 201) {
      toast.success("Task added successfully!");
      return true;
    }
  } catch (error) {
    toast.error("Failed to add task");
    throw error;
  }
};

export const getAllTasks = async (projectId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access this page");
      return;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if(response.status == 200){
        return response.data.tasks;
    }
  } catch (error) {
    toast.error("Failed to get tasks");
    console.log(error);
    return null;
  }
};

export const editTask = async (projectId, taskId, taskData) => {
  try{
    const token = localStorage.getItem("token");
    if(!token){
      toast.error("Please login to access this page");
      return;
    }
    
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}`,
      taskData,
      {
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }
    )

    if(response.status === 200){
      return true;
    }
  }catch(error){
    toast.error("Failed to update task");
    console.log(error);
    return false;
  }
}

export const deleteTask = async (projectId, taskId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access this page");
      return false;
    }
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      toast.success("Task deleted successfully!");
      return true;
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task.");
    return false;
  }
};

export const updateNote = async (projectId, taskId, noteData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}/updates`,
      noteData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authentication token
        },
      }
    );
    if(response.status == 200){
      return true;
    }else{
      return false;
    }
  } catch (error) {
    console.error("Error updating task notes:", error.response?.data || error.message);
    toast.error("Failed to update task notes");
    throw new Error(error.response?.data?.error || "Failed to update notes");
  }
};

export const fetchNotes = async(projectId, taskId) => {
  try{
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}/updates`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authentication token
        }
      }
    )

    if(response.status == 200){
      return response.data.updates;
    } else {
      return [];
    }
  }catch(error){
    console.error("Error fetching notes:", error);
    toast.error("Failed to fetch notes");
    return [];
  }
}