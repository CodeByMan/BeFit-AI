const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { register, verifyOTP, login, forgotPassword, resetPassword, logout } = require('../controllers/authController');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: { message: "Too many requests, please try again later" }
});

// Public routes
router.post('/register', limiter, register);
router.post('/verify-otp', limiter, verifyOTP);
router.post('/login', limiter, login);
router.post('/forgot-password', limiter, forgotPassword);
router.post('/reset-password', limiter, resetPassword);

// Protected route
router.post('/logout', protect(), logout);

module.exports = router;
