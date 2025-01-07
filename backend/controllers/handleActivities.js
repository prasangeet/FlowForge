import axios from "axios";
import { db, FieldValue } from "../config/firebase.js";
import dotenv from "dotenv";
import { format } from "date-fns";

export const addActivity = async (projectId, userId, activity) => {
  try {
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      throw new Error("Project does not exist");
    }

    const activityData = {
      user: userId,
      activity,
      createdAt: new Date(),
    };
    
    await projectRef.update({
      activity: FieldValue.arrayUnion(activityData),
    });
  } catch (error) {
    console.log("Error adding activity: ", error);
  }
};
