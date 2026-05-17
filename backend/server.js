require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

const missingEnvVars = requiredEnvVars.filter((key) => {
  const value = process.env[key];
  return !value || !value.trim();
});

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  // Do not call process.exit in environments like serverless — fail startup gracefully.
}

const clientUrl = process.env.CLIENT_URL || "";
const allowedOrigins = isProduction
  ? [
      "https://service-request-board-ebon.vercel.app",
      ...clientUrl
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ]
  : [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "http://localhost:3002",
      "http://127.0.0.1:3002",
      "http://localhost:3003",
      "http://127.0.0.1:3003",
    ];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (isDevelopment && origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health" || req.path === "/",
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.disable("x-powered-by");
app.use(helmet());

if (isDevelopment) {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
    next();
  });
}

app.use(cors(corsOptions));

app.use(limiter);
// CORS configuration for Railway/Vercel
// CORS configuration for Railway/Vercel
// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/", (req, res) => {
  res.status(200).send("API Running Successfully");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// 404 handler for unmatched routes
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Cannot find ${req.method} ${req.originalUrl} on this server`,
      404,
    ),
  );
});

// Global error handler
app.use(errorHandler);

// Global error handlers to avoid unhandled exceptions crashing the process silently
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const startServer = async () => {
  if (missingEnvVars.length > 0) {
    console.error("Server not started due to missing configuration.");
    return;
  }

  if (isProduction && allowedOrigins.length === 0) {
    console.error("Server not started: invalid CLIENT_URL configuration.");
    return;
  }

  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
      );
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    // Let the caller / hosting platform handle process lifecycle. Rethrow to make failure visible.
    throw error;
  }
};

// Only start the server when this file is executed directly (e.g., `node server.js`).
// This prevents automatic `app.listen` when the module is imported (useful for tests and serverless).
if (require.main === module) {
  startServer().catch((err) => {
    console.error("Fatal startup error:", err);
  });
}

module.exports = app;
