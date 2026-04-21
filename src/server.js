const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("API is running");
});

// Example route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working" });
});

// Use dynamic port (CRITICAL for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});