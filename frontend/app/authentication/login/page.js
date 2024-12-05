"use client";

import Image from "next/image";
import { poppins, ubuntu } from "../../fonts/fonts";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export default function Login() {
  dotenv.config();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState(0); // Progress bar state
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Track login process
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      verifyToken(token);
    }
  }, [router]);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-token",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Token is invalid or expired");
      }

      const data = await response.json();

      if (!data.user.profilesetup) {
        router.push("/profilesetup");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Token verification failed", error);
      localStorage.removeItem("token");
      router.push("/authentication/login");
      toast.error("Invalid or expired token. Please log in again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Start the login process
    setProgress(30); // Initial progress

    try {
      // Step 1: Make a request to the login API
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      setProgress(60); // Update progress

      const data = await response.json();

      // Step 2: Handle successful login
      toast.success("Logged in successfully!");

      setProgress(90); // Further progress

      // Step 3: Check profile setup status and redirect
      if (!data.user.profilesetup) {
        setProgress(100);
        localStorage.setItem("token", data.token);
        router.push("/profilesetup"); // Redirect to Profile Setup
      } else {
        setProgress(100);
        localStorage.setItem("token", data.token);
        router.push("/dashboard"); // Redirect to Dashboard
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
    } finally {
      setIsLoggingIn(false); // End the login process
      setProgress(0); // Reset progress bar
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-12 bg-white md:rounded-3xl rounded-3xl">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8">
            Login To Your Account
          </h2>
          {/* Progress Bar */}
          {isLoggingIn && (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-[#dd00ff] to-[#ff7f00] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                placeholder="Enter your Email here"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                  placeholder="Enter your Password here"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 transition-all duration-1000"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoggingIn} // Disable button during login
              className={`w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-[#dd00ff] to-[#ff7f00] text-white font-semibold rounded-full hover:opacity-90 transition duration-300 ${
                isLoggingIn ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoggingIn ? "Logging In..." : "Log In"}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/authentication/signup"
                className="text-[#ff7f00] hover:underline"
              >
                Create an Account
              </Link>
            </p>
            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="absolute px-3 font-medium text-gray-500 bg-white">
                OR
              </span>
            </div>
            <button className="mt-4 w-full flex items-center justify-center px-4 py-3 sm:py-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Image
                className="w-5 h-5 mr-4"
                src="/google.png"
                alt="Google Icon"
                width={20}
                height={20}
              />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
