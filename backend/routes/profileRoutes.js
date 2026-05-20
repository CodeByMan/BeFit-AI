// backend/routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getProfile,
  createOrUpdateProfile,
  viewProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
} = require("../controllers/profileController");

// ------------------- Multer Setup -------------------
const uploadFolder = "uploads/avatars";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// ------------------- PUBLIC PROFILE (Used by Home Testimonials) -------------------
router.get("/public/:userId", async (req, res) => {
  try {
    const Profile = require("../models/Profile");
    const profile = await Profile.findOne({ user_id: req.params.userId });

    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------- PROTECTED USER PROFILE ROUTES -------------------
router.post("/setup", protect([2]), createOrUpdateProfile);
router.get("/", protect([2]), getProfile);
router.get("/me", protect([2]), viewProfile);
router.put("/update", protect([2]), updateProfile);
router.put("/password", protect([2]), updatePassword);

// Avatar upload
router.post("/avatar", protect([2]), upload.single("avatar"), uploadAvatar);

module.exports = router;
