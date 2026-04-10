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

// 🔥 ambil dari ENV
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((u) =>
      u.trim().replace(/\/$/, "")
    )
  : ["http://localhost:5173"];

console.log("Allowed origins:", allowedOrigins);

// 🔥 FIX CORS PROPER
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow postman / curl

      const cleanOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        callback(null, true);
      } else {
        console.error("❌ CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

// routes
app.use("/auth", authRoutes);
app.use("/food", foodRoutes);
app.use("/tracking", trackingRoutes);
app.use("/user", userRoutes);
app.use("/notifikasi", notifikasiRoutes);

// health check
app.get("/", (req, res) =>
  res.json({ message: "NutriTrack API Running 🚀", status: "ok" })
);

app.get("/health", (req, res) => res.json({ status: "ok" }));

// global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});