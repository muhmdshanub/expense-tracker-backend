const express = require("express");
const cors = require("cors");
const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");
const expenseRoutes = require("./routes/expenseRoutes");
const responseHelper = require("./utils/responseHelper");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check route (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("API is running with cleanly structured architecture!");
});

// Routes
app.use("/expenses", expenseRoutes);

// 404 Handler
app.use((req, res, next) => {
  responseHelper.error(res, 404, "Route not found");
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
