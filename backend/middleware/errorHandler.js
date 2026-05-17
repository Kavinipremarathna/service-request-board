const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  const isProduction = process.env.NODE_ENV === "production";

  // Log error in development
  if (!isProduction) {
    console.error("❌ Error:", err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = new AppError(`Resource not found with id: ${err.value}`, 404);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(messages.join(". "), 422);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`Duplicate value for field: ${field}`, 409);
  }

  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational === true;
  const message =
    isOperational || !isProduction
      ? error.message || "Internal Server Error"
      : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(!isProduction && { stack: err.stack }),
  });
};

module.exports = errorHandler;
