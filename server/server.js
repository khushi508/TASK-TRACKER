require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Health check route (useful for confirming deployment works)
app.get("/", (req, res) => {
  res.send("Task Tracker API is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
