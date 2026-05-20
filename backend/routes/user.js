const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAdminDashboard, getUserDashboard, updateUserPassword } = require('../controllers/userController');

// Admin-only route
router.get('/admin', protect([1]), getAdminDashboard);

// User route
router.get('/dashboard', protect([2]), getUserDashboard);

router.put('/profile/password', protect([2]), updateUserPassword);

module.exports = router;
