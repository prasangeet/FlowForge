"use client";

import Image from "next/image";
import { poppins, ubuntu } from "../fonts/fonts";
import { useState, useEffect, useCallback } from "react";
import { Camera } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./phone-input-custom.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    role: "",
    contactNumber: "",
    profilePicture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState(0); // Progress bar state
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission status
  const router = useRouter();

  const verifyProfileSetup = useCallback(
    async (token) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.user.profilesetup) {
            router.push("/dashboard"); // Redirect to dashboard if profile is set up
          }
        } else {
          // If the token verification failed
          toast.error("Token verification failed.");
          router.push("/authentication/login"); // Navigate user to the login page
        }
      } catch (error) {
        // Handle any errors during token verification
        console.error("Error verifying token", error);
        toast.error("An error occurred during token verification.");
        router.push("/authentication/login"); // Ensure user is redirected to login page
      }
    },
    [router]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      verifyProfileSetup(token);
    } else {
      router.push("/authentication/login");
      toast.error("you must login to access this pagey");
    }
  }, [router, verifyProfileSetup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, contactNumber: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start the form submission process
    setProgress(30); // Initial progress

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("companyName", formData.companyName);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("contactNumber", formData.contactNumber);
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/update`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setProgress(60); // Update progress to 60%
        toast.success("Profile updated successfully!");
        setProgress(90); // Update progress to 90%

        // After successful update, redirect to dashboard
        setProgress(100); // Final progress
        router.push("/dashboard");
      } else {
        toast.error("Error updating profile.");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false); // End the submission process
      setProgress(0); // Reset progress bar
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 ${poppins.className}`}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row bg-gradient-to-br from-[#dd00ff] via-[#ffae00] to-[#ff7f00]">
        <div className="w-full md:w-2/5 p-6 sm:p-8 md:p-5 md:mr-10 md:ml-5 flex flex-col justify-center rounded-3xl rounded-b-none">
          <div>
            <div className="flex justify-center items-center w-full flex-col mb-8">
              <Image
                src="/Logo.svg"
                width={142}
                height={82}
                className="w-24 h-auto sm:w-32 md:w-36"
                alt="logo"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-white mb-2">
              Welcome To
            </h2>
            <h1
              className={`text-5xl sm:text-6xl font-bold text-white mb-2 ${ubuntu.className}`}
            >
              FlowForge
            </h1>
            <p className="text-sm sm:text-[15px] text-white">
              Crafting Seamless Project Journeys
            </p>
          </div>
          <p className="text-sm text-white mt-8">© All rights reserved</p>
        </div>
        <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-12 bg-white md:rounded-3xl rounded-3xl flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8 md:mt-5 md:mr-5 md:ml-5 w-full">
            Enter your details
          </h2>
          {/* Progress Bar */}
          {isSubmitting && (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-[#dd00ff] to-[#ff7f00] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Camera className="text-gray-600 w-8 h-8" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Upload Profile Picture
              </p>
            </div>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                placeholder="Enter your Full Name here"
                required
              />
            </div>
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                placeholder="Enter your Company Name here"
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                placeholder="Enter your Role here"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Number
              </label>
              <PhoneInput
                country="us"
                value={formData.contactNumber}
                onChange={handlePhoneChange}
                inputProps={{
                  name: "contactNumber",
                  required: true,
                }}
                buttonStyle={{
                  border: "none",
                  height: "40px",
                  background: "white",
                  borderRadius: "9999px 0 0 9999px",
                }}
                className="w-full px-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                inputStyle={{ border: "none" }}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-br from-[#dd00ff] to-[#ff7f00] text-white font-semibold disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
