import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../config/firebase.js";

dotenv.config();

export const verfyToken = async (req, res) => {
  try {
    const { id } = req.user;
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = userDoc.data();
    return res.status(200).json({
      message: "Token is valid",
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
