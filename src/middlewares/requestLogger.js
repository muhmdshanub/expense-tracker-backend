const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  logger.info(`Incoming Request`, { method: req.method, url: req.originalUrl, body: req.body });
  next();
};

module.exports = requestLogger;
