import axios from "axios";
import toast from "react-hot-toast";

export const fetchUserDetails = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const response = await axios.get("http://localhost:5000/api/user/details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.success) {
      return response.data.user;
    } else {
      toast.error("Failed to fetch user details. Please try again.");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    toast.error("Failed to fetch user details. Please try again.");
    return null;
  }
};


