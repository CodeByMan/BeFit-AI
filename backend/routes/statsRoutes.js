// backend/routes/statsRoutes.js
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Blog = require("../models/Blog");
const Testimonial = require("../models/Testimonial");

// GET stats
router.get("/", async (req, res) => {
  try {
    const users = await User.countDocuments({ roleId: 2 });
    const blogs = await Blog.countDocuments();
    const testimonials = await Testimonial.countDocuments({ isApproved: true });

    res.json({
      success: true,
      users,
      blogs,
      testimonials,
      support: 24, // always available
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
