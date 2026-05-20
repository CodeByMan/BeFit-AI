// backend/server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

// your existing routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profileRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const calorieRoutes = require("./routes/calorieRoutes");
const foodLogRoutes = require("./routes/foodLogRoutes");
const adminRoutes = require("./routes/admin");
const testimonialRoutes = require("./routes/testimonialRoutes");
const statsRoutes = require("./routes/statsRoutes");
const blogRoutes = require("./routes/blogRoutes");

// Groq AI REST route
const aiRoutesRouter = require("./routes/aiRoutes");
const goalRoutes = require("./routes/goalRoutes");

const app = express();
connectDB();

// -------- Global Middleware --------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(helmet());
app.use(morgan("combined"));

// Rate Limiter BEFORE routes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: { message: "Too many requests, try again later." },
});
app.use("/api/", apiLimiter);

// Serve uploads
app.use("/uploads", (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.CORS_ORIGIN || "http://localhost:5173"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/avatars", express.static(path.join(__dirname, "uploads/avatars")));


// -------- API Routes --------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", calorieRoutes);
app.use("/api/foodlog", foodLogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/goal", goalRoutes);


// Groq AI REST route
app.use("/api/ai", aiRoutesRouter);

// -------- Serve React Frontend in Production --------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// -------- Start Server --------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
