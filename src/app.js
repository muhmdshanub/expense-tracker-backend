const express = require("express");
const cors = require("cors");
const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");
const expenseRoutes = require("./routes/expenseRoutes");
const healthRoutes = require("./routes/healthRoutes");
const responseHelper = require("./utils/responseHelper");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check routes
app.use("/api/health", healthRoutes);
app.use("/health", healthRoutes); // Duplicate for convenience

// Root redirect or simple message
app.get("/", (_req, res) => {
  res.send("API is running with cleanly structured architecture! Check /api/health for status.");
});

// Routes
app.use("/api/expenses", expenseRoutes);
app.use("/expenses", expenseRoutes); // Keep legacy /expenses for compatibility if needed


// 404 Handler
app.use((_req, res, _next) => {
  responseHelper.error(res, 404, "Route not found");
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
