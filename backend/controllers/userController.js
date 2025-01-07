import { db } from "../config/firebase.js";
import dotenv from "dotenv";
import axios from "axios";
import { response } from "express";

dotenv.config();

export const getUserDetails = async (req, res) => {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return res.status(500).json({ error: "Server configuration error." });
    }

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found." });
    }
    const userData = userDoc.data();

    let profilePictureUrl = userData.profilePicture || "";

    if (profilePictureUrl) {
      const filePath = profilePictureUrl.split("blob/main/")[1];
      if (filePath) {
        const githubApiUrl = `https://api.github.com/repos/prasangeet/profile-pictures/contents/${filePath}`;

        try {
          const response = await axios.get(githubApiUrl, {
            headers: {
              Authorization: `Bearer ${githubToken}`,
            },
          });

          profilePictureUrl = response.data.download_url;
        } catch {
          profilePictureUrl = "";
        }
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userDoc.id,
        username: userData.username || "Unknown",
        fullName: userData.fullName || "Unknown",
        email: userData.email || "Unknown",
        profilePicture: profilePictureUrl,
        role: userData.role || "User",
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const searchUsername = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res
      .status(400)
      .json({ error: "Username query parameter is required." });
  }

  try {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return res.status(500).json({ error: "Server configuration error." });
    }

    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("username", ">=", username)
      .where("username", "<=", username + "\uf8ff")
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ users: [] }); // Return empty array if no users are found
    }

    const users = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const userData = doc.data();

        let profilePictureUrl = userData.profilePicture || "";

        if (profilePictureUrl) {
          const filePath = profilePictureUrl.split("blob/main/")[1];
          if (filePath) {
            const githubApiUrl = `https://api.github.com/repos/prasangeet/profile-pictures/contents/${filePath}`;

            try {
              const response = await axios.get(githubApiUrl, {
                headers: {
                  Authorization: `Bearer ${githubToken}`,
                },
              });

              profilePictureUrl = response.data.download_url;
            } catch {
              profilePictureUrl = "";
            }
          }
        }

        return {
          id: doc.id,
          username: userData.username || "Unknown",
          fullName: userData.fullName || "Unknown",
          email: userData.email || "Unknown",
          profilePicture: profilePictureUrl,
          role: userData.role || "User",
        };
      })
    );

    return res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." + error });
  }
};
