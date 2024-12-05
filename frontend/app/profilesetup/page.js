"use client";

import Image from "next/image";
import { poppins, ubuntu } from "../fonts/fonts";
import { useState } from "react";
import Form from "next/form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./phone-input-custom.css";

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    role: "",
    contactNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, contactNumber: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 ${poppins.className}`}
    >
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row bg-gradient-to-br from-[#dd00ff] via-[#ffae00] to-[#ff7f00]">
        <div className="w-full md:w-2/5 p-6 sm:p-8 md:p-5 md:mr-10 md:ml-5 flex flex-col justify-center  rounded-3xl rounded-b-none">
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
          <Form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="relative">
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
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Number
              </label>
              <div className="relative">
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
                    height: "40px", // Set a height that fits well
                    background: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "9999px 0 0 9999px",
                  }}
                  buttonClass="phonebutton"
                  className="w-full px-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                  inputStyle={{border: "none"}}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-[#dd00ff] to-[#ff7f00] text-white font-semibold rounded-full hover:opacity-90 transition duration-300"
            >
              Create Account
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
