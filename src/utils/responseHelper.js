const responseHelper = {
  success: (res, statusCode, data, message = "Success") => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error: (res, statusCode, message) => {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  },
};

module.exports = responseHelper;
