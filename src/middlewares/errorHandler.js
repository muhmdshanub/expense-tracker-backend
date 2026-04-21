const logger = require("../utils/logger");
const responseHelper = require("../utils/responseHelper");

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, method: req.method, url: req.originalUrl });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  responseHelper.error(res, statusCode, message);
};

module.exports = errorHandler;
