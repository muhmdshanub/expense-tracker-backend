const express = require("express");
const responseHelper = require("../utils/responseHelper");

const router = express.Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint for monitoring and deployment platforms
 * @access  Public
 */
router.get("/", (_req, res) => {
  return responseHelper.success(res, 200, { status: "ok", timestamp: new Date() }, "API is healthy");
});

module.exports = router;
