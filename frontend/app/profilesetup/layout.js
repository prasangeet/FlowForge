"use client";

import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust the import path for firebase
import { Power } from "lucide-react"; // Power icon for logout
import toast, { Toaster } from "react-hot-toast"; // Import toast and Toaster for notifications
import axios from "axios"; // Import axios for API requests
import { useEffect } from "react"; // Import useEffect for token checking
import jwt from "jsonwebtoken"; // Import jwt for decoding the token
import dotenv from 'dotenv';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function ProfileSetupLayout({ children }) {

  dotenv.config();
  const router = useRouter();

  // Handle logout process
  const handleLogout = async () => {
    try {
      // Sign out from Firebase Authentication
      await signOut(auth);

      // Get the token from localStorage (assuming it's stored there)
      const token = localStorage.getItem("token");

      // If token exists, send the token with the logout request
      if (token) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          localStorage.removeItem("token");
          // Redirect to login page after logout
          router.push("/authentication/login");
          toast.success("Logged out successfully!");
        }
      } else {
        toast.error("No token found. Please log in again.");
      }
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Check if the token is present and expired
  useEffect(() => {
    const token = localStorage.getItem("token"); // Check for the token in localStorage (you may adjust this based on where you're storing it)

    if (!token) {
      router.push("/authentication/login");
      toast.error("You must be logged in to access this page.");
      return;
    }

    try {
      const decodedToken = jwt.decode(token); // Decode the JWT to read its payload
      if (decodedToken && decodedToken.exp) {
        const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
        if (decodedToken.exp < currentTime) {
          // If the token is expired
          localStorage.removeItem("token"); // Optionally remove the expired token
          router.push("/authentication/login");
          toast.error("Your session has expired. Please log in again.");
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      router.push("/authentication/login");
      toast.error("Invalid token. Please log in again.");
    }
  }, [router]); // Add `router` to dependency array to rerun the effect on route change

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-4 overflow-y-auto ${poppins.className}`}
    >
      {/* Toast Container for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 p-2 bg-gradient-to-r from-[#dd00ff] to-[#ff7f00] text-white rounded-full hover:bg-gradient-to-l transition duration-300"
        aria-label="Logout"
      >
        <Power className="h-6 w-6" />
      </button>

      {/* Render children components */}
      {children}
    </div>
  );
}

export default ProfileSetupLayout;
