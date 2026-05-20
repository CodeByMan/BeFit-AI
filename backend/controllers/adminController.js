const User = require("../models/User");
const Blog = require("../models/Blog");
const bcrypt = require("bcryptjs"); // if not already imported

// ========================== GET ALL USERS (ADMINS + USERS) ==========================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================== RECYCLE BIN ==========================
exports.getDeletedUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: true }).select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================== SOFT DELETE ==========================
exports.softDeleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.id === id)
      return res.status(400).json({ message: "You cannot delete yourself" });

    await User.findByIdAndUpdate(id, {
      isDeleted: true,
      isLoggedIn: false
    });

    res.json({ success: true, message: "User moved to recycle bin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================== RESTORE ==========================
exports.restoreUser = async (req, res) => {
  try {
    const id = req.params.id;

    await User.findByIdAndUpdate(id, {
      isDeleted: false
    });

    res.json({ success: true, message: "User restored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================== PERMANENT DELETE ==========================
exports.permanentDeleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.id === id)
      return res.status(400).json({ message: "You cannot delete yourself" });

    await User.findByIdAndDelete(id);

    res.json({ success: true, message: "User permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ------------------ BLOG CRUD ------------------

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ------------------ ADMIN PROFILE ------------------

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
    res.json({ success: true, admin: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateAdminPassword = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Missing passwords" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password" });
  }
};
