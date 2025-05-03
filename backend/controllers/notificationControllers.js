import { auth, db, FieldValue } from "../config/firebase.js";
import dotenv from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";

dotenv.config();

export const pushNotifications = async (req, res) => {
  try {
    const { title, body } = req.body;
    const userId = req.userId;

    if (!userId || !title || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const notificationsData = {
      title,
      body,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    };

    const userRef = db.collection("users").doc(userId);
    const notificationRef = userRef.collection("notifications").doc();

    await notificationRef.add(notificationsData);
    return res
      .status(200)
      .json({ message: "Notification stored successfully." });
  } catch (error) {
    console.log("Error pushing notifications: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
