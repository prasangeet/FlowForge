import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {db} from "./config/firebase.js";
import authRoutes from "./routes/authRoutes.js"

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
