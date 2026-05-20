const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ message: 'Welcome Admin', users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Dashboard
exports.getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ message: 'Welcome User', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both passwords are required" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password" });
  }
};
