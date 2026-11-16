import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import createEmailRouter from "./routes/email.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json());

// HTTP Server
const httpServer = http.createServer(app);

// Socket.IO Server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH"]
  }
});

// Verify Socket.IO user's login token
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.userId = decoded.id;

    next();

  } catch (error) {
    next(new Error("Invalid socket token"));
  }
});

// When user connects
io.on("connection", (socket) => {
  console.log("User Connected:", socket.userId);

  // Put user in their personal room
  socket.join(socket.userId);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.userId);
  });
});

// Health Route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Smart Mail Assistant API is running"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/emails", createEmailRouter(io));

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();