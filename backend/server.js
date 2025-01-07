import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/firebase.js";
import authRoutes from "./routes/authRoutes.js";
import updateprofileRoutes from "./routes/updateprofileRoutes.js";
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoute.js'
import { authenticate } from "./middlewares/authMiddleware.js";
import taskRoutes from './routes/taskRoutes.js'

dotenv.config();

const port = process.env.PORT || 5001;

const app = express();

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", updateprofileRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", authenticate, taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/check-db", async (req, res) => {
  try {
    const testDoc = db.collection("test").doc("connection-check");
    await testDoc.set({ message: "Firestore is connected" });
    const doc = await testDoc.get();

    if (doc.exists) {
      res.status(200).json({ status: "success", data: doc.data() });
    } else {
      res.status(404).json({ status: "error", message: "Document not found" });
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    res
      .status(500)
      .json({ status: "error", message: "Database connection failed" });
  }
});

app.listen(port, () => [
  console.log(`server running on port http://localhost:${port}`),
]);
