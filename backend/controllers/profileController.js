// backend/controllers/profileController.js
const Profile = require("../models/Profile");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

// ------------------- Existing functions -------------------
// Existing createOrUpdateProfile and getProfile remain unchanged
const createOrUpdateProfile = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user.id;

        let profile = await Profile.findOne({ user_id: userId });

        if (profile) {
            Object.assign(profile, data);
            profile.setup_complete = true;
            await profile.save();
        } else {
            profile = await Profile.create({
                user_id: userId,
                ...data,
                setup_complete: true,
            });
        }

        res.status(200).json({ success: true, profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save profile" });
    }
};

const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user_id: req.user.id });

        if (!profile) return res.status(200).json({ exists: false });

        res.json({ exists: true, profile });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

// ------------------- New functions -------------------

// View profile (same as getProfile but more explicit)
const viewProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user_id: req.user.id });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
        res.json({ success: true, profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update profile anytime (partial update allowed)
const updateProfile = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user.id;

        const profile = await Profile.findOneAndUpdate(
            { user_id: userId },
            { ...data },
            { new: true }
        );

        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

        res.json({ success: true, profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Update user password
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword)
            return res.status(400).json({ success: false, message: "Both passwords are required" });

        const user = await User.findById(userId).select("+password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ------------------- New function: Upload avatar -------------------
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const profile = await Profile.findOne({ user_id: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    // Optional: Delete old avatar file
    if (profile.avatar_filename) {
      const oldPath = path.join(__dirname, "../", profile.avatar_filename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save new avatar filename (with path)
    profile.avatar_filename = `/uploads/avatars/${req.file.filename}`;
    await profile.save();

    res.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Avatar upload failed" });
  }
};

module.exports = {
  createOrUpdateProfile,
  getProfile,
  viewProfile,
  updateProfile,
  updatePassword,
  uploadAvatar, // <- export new function
};
