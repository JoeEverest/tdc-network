import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import endorsementRoutes from "./routes/endorsement";
import jobRoutes from "./routes/job";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vibecode";

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/endorsements", endorsementRoutes);
app.use("/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Vibecode backend running" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
