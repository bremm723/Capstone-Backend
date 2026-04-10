import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
import foodRoutes from "./routes/food.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import userRoutes from "./routes/user.routes.js";
import notifikasiRoutes from "./routes/notifikasi.routes.js";

dotenv.config();

const app = express();

// Parse FRONTEND_URL - support comma-separated list, strip trailing slashes
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((u) => u.trim().replace(/\/$/, ""))
  : ["http://localhost:6767"];

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, Railway health checks, etc.)
      if (!origin) return callback(null, true);
      // Strip trailing slash from incoming origin for comparison
      const cleanOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(cleanOrigin)) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/food", foodRoutes);
app.use("/tracking", trackingRoutes);
app.use("/user", userRoutes);
app.use("/notifikasi", notifikasiRoutes);

app.get("/", (req, res) => res.json({ message: "NutriTrack API Running 🚀", status: "ok" }));
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
