const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Helper to hash OTP
const hashOTP = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

// ========================== REGISTER ==========================
exports.register = async (req, res) => {
  const { name, email, password, roleId } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpPlain = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHashed = hashOTP(otpPlain);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId,
      otp: otpHashed,
      otpExpires: Date.now() + 10 * 60 * 1000
    });

    await sendEmail(email, "Verify Your Account", `Your OTP is: ${otpPlain}`);

    res.status(201).json({
      message: "User registered, OTP sent to email",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================== VERIFY OTP ==========================
exports.verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otpHashed = hashOTP(otp);
    if (user.otp !== otpHashed || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================== LOGIN ==========================
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified)
      return res.status(400).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🔥 FIX: mark logged in
    user.isLoggedIn = true;
    await user.save();

    const token = jwt.sign(
      { id: user._id, roleId: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, roleId: user.roleId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================== LOGOUT ==========================
exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      isLoggedIn: false
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================== FORGOT PASSWORD ==========================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const now = Date.now();

    if (!user.resetTries) user.resetTries = [];
    user.resetTries = user.resetTries.filter(t => now - t < 24 * 60 * 60 * 1000);

    if (user.resetTries.length >= 2)
      return res.status(429).json({ message: "You can request a reset link only twice per day." });

    if (user.lastReset && now - user.lastReset < 60 * 1000) {
      const waitSeconds = Math.ceil((60 * 1000 - (now - user.lastReset)) / 1000);
      return res.status(429).json({ message: `Please wait ${waitSeconds} seconds before retrying.` });
    }

    const tokenPlain = crypto.randomBytes(32).toString("hex");
    user.resetToken = crypto.createHash("sha256").update(tokenPlain).digest("hex");
    user.resetTokenExpires = now + 10 * 60 * 1000;
    user.lastReset = now;
    user.resetTries.push(now);

    await user.save();

    const resetLink = `http://localhost:5173/reset-password?userId=${user._id}&token=${tokenPlain}`;

    await sendEmail(
      email,
      "Password Reset",
      `Hello ${user.name || "User"},\n\nReset your password using this link: ${resetLink}\nLink expires in 10 minutes.`
    );

    res.json({ message: "Reset link sent to your email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================== RESET PASSWORD ==========================
exports.resetPassword = async (req, res) => {
  const { userId, token, newPassword } = req.body;
  if (!userId || !token || !newPassword)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    if (!user.resetToken || user.resetToken !== hashedToken || user.resetTokenExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
