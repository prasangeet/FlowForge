import { db } from "../config/firebase.js"; // Firebase reference
import { uploadFileToGithub } from "../utils/uploadFileToGitHub.js"; // Assuming you are uploading to GitHub
import axios from "axios";

// Profile Update Controller
export const updateProfile = async (req, res) => {
  const { fullName, companyName, role, contactNumber } = req.body;
  const { id } = req.user; // From the authenticate middleware

  if (!fullName || !companyName || !role || !contactNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let profilePictureUrl = null;

    if (req.file) {
      const fileName = `profile_pictures/${id}_${Date.now()}.jpg`;
      profilePictureUrl = await uploadFileToGithub(
        req.file.buffer,
        fileName,
        "Upload profile picture"
      );
    }

    const userRef = db.collection("users").doc(id);
    await userRef.update({
      fullName,
      companyName,
      role,
      contactNumber,
      profilePicture: profilePictureUrl || "",
      profilesetup: true,
    });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message });
  }
};
