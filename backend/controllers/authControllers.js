import { auth, db } from "../config/firebase.js";
import dotenv from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";

dotenv.config();

export const signUp = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Check if the username already exists
    const usersCollection = db.collection("users");
    const usernameQuery = await usersCollection.where("username", "==", username).get();

    if (!usernameQuery.empty) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create the user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Save user details in Firestore
    const userDetails = {
      id: userRecord.uid,
      username: userRecord.displayName,
      email: userRecord.email,
      companyName: "",
      role: "",
      contactNumber: "",
      profilesetup: false,
      createdAt: new Date().toISOString(),
      projects: [],
    };

    const userRef = db.collection("users").doc(userRecord.uid);
    await userRef.set(userDetails);

    res.status(201).json({
      message: "User created successfully",
      user: userDetails,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
    const response = await axios.post(firebaseAuthUrl, {
      email,
      password,
      returnSecureToken: true,
    });

    const { localId: uid, idToken } = response.data;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(401).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    const token = jwt.sign(
      { id: uid, email: userData.email, username: userData.username, profileSetup: userData.profileSetup},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: userData,
    });
  } catch (error) {
    res
      .status(401)
      .json({ error: error.response?.data?.error?.message || error.message });
  }
};

export const logout = async (req, res) => {
  res.status(200).send({ message: "Logout successful" });
};
