const express = require("express");
const router = express.Router();
const { getGoal, createOrUpdateGoal } = require("../controllers/goalController");
const { protect } = require("../middlewares/authMiddleware");

// Only regular users (roleId 2) can access their goals
router.get("/", protect([2]), getGoal);         // Get logged-in user's goal
router.post("/", protect([2]), createOrUpdateGoal); // Create or update goal

module.exports = router;
