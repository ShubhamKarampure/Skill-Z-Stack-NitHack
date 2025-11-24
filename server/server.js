import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { devLogger, prodLogger } from "./middleware/logger.js";
import { checkConnection } from "./blockchain/utils/provider.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "production") {
  app.use(prodLogger);
} else {
  app.use(devLogger);
}

// Database Connection
const connectDB = async () => {
  try {
    // Logic: Select DB based on Environment
    const dbURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_URI_PROD
        : process.env.MONGO_URI_LOCAL;

    if (!dbURI) {
      throw new Error(
        `MongoDB URI not defined for ${process.env.NODE_ENV} mode`
      );
    }

    await mongoose.connect(dbURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Blockchain Connection
const checkBlockchainConnection = async () => {
  try {
    const status = await checkConnection();
    if (status.connected) {
      console.log("Blockchain connected successfully");
      console.log(`  Network ID: ${status.networkId}`);
      console.log(`  Block Number: ${status.blockNumber}`);
    } else {
      console.error("Blockchain connection failed");
    }
  } catch (error) {
    console.error("Blockchain connection error:", error.message);
  }
};

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Skills Passport API",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  });
});

app.use("/api/v1", routes);

// Error Handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use(errorHandler);

// Server Start
const startServer = async () => {
  try {
    await connectDB();
    await checkBlockchainConnection();

    app.listen(PORT, () => {
      console.log("\n" + "=".repeat(50));
      console.log("Skills Passport Backend Server");
      console.log("=".repeat(50));
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("=".repeat(50) + "\n");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

startServer();

export default app;
