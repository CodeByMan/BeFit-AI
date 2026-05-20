const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  roleId: { type: Number, default: 2 }, // 1 = admin, 2 = user

  isVerified: { type: Boolean, default: false },

  // Required for your logic
  isDeleted: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },

  otp: { type: String },
  otpExpires: { type: Date },

  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  lastReset: { type: Date },
  resetTries: [{ type: Date }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
